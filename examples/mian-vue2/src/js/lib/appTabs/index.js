import app from '@/main'
import routerConifig from '@/router/routerConfig'
let tabsOpenCountMap = {}
const tabsBeforeDeactivated = {}
const MAX_TABS_LIST_COUNT = 60
let setTabPathQueryFlag = false
const getRoute = function () {
	return app.vue.$route
}
const getRouter = function () {
	return app.vue.$router
}
const getStore = function () {
	return app.vue.$store
}
const getTabKey = function () {
	const route = getRoute()
	return !route.meta.single ? route.fullPath : route.name
}
const setTabsList = function (list = []) {
	const store = getStore()
	store.state.appTabs.tabsList = list
}
const isNewTab = function () {
	const tabsOpenCount = tabsOpenCountMap[getTabKey()]
	return !tabsOpenCount || tabsOpenCount === 1
}
const onTabBeforeDeactivated = function (fn, context) {
	const tabsKey = getTabKey()
	if (!tabsBeforeDeactivated[tabsKey]) {
		tabsBeforeDeactivated[tabsKey] = new Set()
	}
	tabsBeforeDeactivated[tabsKey].add(fn)
	context.$once('hook:beforeDestroy', function () {
		offTabBeforeDeactivated(fn, tabsKey)
	})
}
const offTabBeforeDeactivated = function (fn, tabsKey = getTabKey()) {
	if (tabsBeforeDeactivated[tabsKey]) {
		tabsBeforeDeactivated[tabsKey].delete(fn)
	}
}
const tabsBeforeDeactivatedGenerator = async function (list) {
	for (const handler of list) {
		await handler()
	}
}
const doTabsBeforeDeactivatedGenerator = function () {
	const tabsKey = getTabKey()
	const tabsBeforeDeactivatedStack = tabsBeforeDeactivated[tabsKey] || new Set()
	return tabsBeforeDeactivatedGenerator(tabsBeforeDeactivatedStack)
}
const tabsListMaxToast = function () {
	app.vue.$fxMessage.warning('已超过最大分页数量')
}
const canPushTab = function (to) {
	const store = getStore()
	const router = getRouter()
	const routerData = router.resolve(to)
	let targetPath = routerData.route.fullPath
	if (routerData.route.meta.single) {
		targetPath = routerData.route.name
	}
	if (store.getters.hasTabGetter(targetPath)) {
		return true
	}
	const tabsList = store.getters.tabsListGetter
	if (tabsList.length < MAX_TABS_LIST_COUNT) {
		return true
	}
	return false
}
const tabsPush = function (to, doBeforeDeactivatedGenerator = true) {
	const store = getStore()
	const router = getRouter()
	to = normalizationTo(to)
	return new Promise(resolve => {
		const currentTab = store.getters.currentTabGetter
		if (currentTab !== to) {
			if (!canPushTab(to)) {
				tabsListMaxToast()
				return false
			}
			if (doBeforeDeactivatedGenerator) {
				doTabsBeforeDeactivatedGenerator().then(() => {
					encodeQuery(to)
					router.push(to)
					resolve(to)
				}).catch(() => {
					const tabTarget = getTabKey()
					store.commit('SET_APP_CURRENT_TAB', tabTarget)
					resolve(tabTarget)
				})
			} else {
				encodeQuery(to)
				router.push(to)
			}
		}
	})
}
const encodeQuery = function (to) {
	if (app.vue.$fxUtils.isPlainObject(to)) {
		if (to.query && to.query.name) {
			to.query.name = encodeURIComponent(to.query.name)
		}
	}
}
const normalizationTo = function (to) {
	if (app.vue.$fxUtils.isPlainObject(to) && to.query) {
		for (const key in to.query) {
			if (typeof to.query[key] === 'boolean') {
				to.query[key] = to.query[key].toString()
			}
		}
		const store = getStore()
		const tabsList = store.getters.tabsListGetter
		const hasTabInTabsList = tabsList.find(item => {
			const hasId = (/id=[0-9]+/.exec(item.name) || [''])[0].split('=')[1]
			return item.name.includes(to.path) && to.query.id && hasId === to.query.id
		})
		if (hasTabInTabsList) {
			return hasTabInTabsList.name
		}
		const routeList = app.vue.$fxUtils.arrFlatten(routerConifig, item => item.children)
		const nextRouterConfig = routeList.find(item => item.path === to.path)
		if (nextRouterConfig && nextRouterConfig.meta && nextRouterConfig.meta.single === false) {
			to.query.tabuuid = app.vue.$fxUtils.createUUID()
		}
	}
	return to
}
const tabsRemove = function (removeName = getTabKey()) {
	const store = getStore()
	const currentTab = store.getters.currentTabGetter
	if (currentTab === removeName) {
		doTabsBeforeDeactivatedGenerator().then(() => {
			const tabsList = store.getters.tabsListGetter
			const removeTagIndex = tabsList.findIndex(item => item.name === removeName)
			const nextTab = tabsList[removeTagIndex + 1] || tabsList[removeTagIndex - 1]
			store.commit('SET_APP_TABS', tabsList.filter(item => item.name !== removeName))
			tabsOpenCountMap[removeName] = false
			if (nextTab) {
				tabsPush(nextTab.name, false)
			}
		})
	} else {
		const tabsList = store.getters.tabsListGetter
		store.commit('SET_APP_TABS', tabsList.filter(item => item.name !== removeName))
		tabsOpenCountMap[removeName] = false
	}
}
const tabsRemoveRightMulity = function (tabIndex) {
	const store = getStore()
	const currentTab = store.getters.currentTabGetter
	const tabsList = store.getters.tabsListGetter
	const currentTabIndex = tabsList.findIndex(item => item.name === currentTab)
	if (currentTabIndex > tabIndex) {
		doTabsBeforeDeactivatedGenerator().then(() => {
			const nextTab = tabsList[tabIndex]
			for (let i = tabIndex + 1; i < tabsList.length; i++) {
				tabsOpenCountMap[tabsList[i].name] = false
			}
			store.commit('SET_APP_TABS', tabsList.slice(0, tabIndex + 1))
			if (nextTab) {
				tabsPush(nextTab.name, false)
			}
		})
	} else {
		for (let i = tabIndex + 1; i < tabsList.length; i++) {
			tabsOpenCountMap[tabsList[i].name] = false
		}
		store.commit('SET_APP_TABS', tabsList.slice(0, tabIndex + 1))
	}
}

const onRouteChange = (value) => {
	const route = getRoute()
	const store = getStore()
	if (setTabPathQueryFlag) {
		setTabPathQueryFlag = false
		store.commit('SET_APP_CURRENT_TAB', value)
		return false
	}
	if (value) {
		if (route.meta.single) {
			value = route.name
		}
		if (!store.getters.hasTabGetter(value)) {
			let title = route.meta.tagTitle || value
			if (typeof route.meta.tagTitle === 'function') {
				title = route.meta.tagTitle(route.query)
			}
			store.commit('PUSH_APP_TAB', {
				title,
				name: value,
				closable: route.meta.closable !== false
			})
			tabsOpenCountMap[value] = 1
		} else {
			if (!tabsOpenCountMap[value]) {
				tabsOpenCountMap[value] = 1
			} else {
				tabsOpenCountMap[value]++
			}
		}
		store.commit('SET_APP_CURRENT_TAB', value)
	}
}
const clear = function () {
	const store = getStore()
	store.commit('CLEAR_APP_TABS')
	store.commit('SET_APP_CONTAINER_VISIBLE', 'default')
	tabsOpenCountMap = {}
}

const hasTab = function (value) {
	const store = getStore()
	return store.getters.hasTabGetter(value)
}

const setTabTitle = function () {
	const store = getStore()
	const route = getRoute()
	let title = route.meta.tagTitle
	if (typeof route.meta.tagTitle === 'function') {
		title = route.meta.tagTitle(...arguments)
	}
	store.commit('SET_APP_CURRENT_TAB_TITLE', title)
}
const getTabTitle = function (val) {
	const store = getStore()
	const tab = store.getters.tabGetter(val)
	return tab ? tab.title : ''
}
const setTabPathQuery = function (query) {
	const tabsKey = getTabKey()
	const store = getStore()
	const router = getRouter()
	const route = getRoute()
	const _query = app.vue.$fxUtils.deepClone(route.query)
	if (_query.tabuuid) {
		delete _query.tabuuid
	}
	if (app.vue.$fxUtils.compare(_query, query)) {
		return false
	}
	if (route.query && route.query.tabuuid) {
		query.tabuuid = route.query.tabuuid
	}
	const routerData = router.resolve({ query })
	const path = routerData.href.replace(/#/, '')
	const tabsList = store.getters.tabsListGetter
	const currentTab = tabsList.find(item => item.name === tabsKey)
	currentTab.name = path
	tabsBeforeDeactivated[path] = tabsBeforeDeactivated[tabsKey]
	tabsOpenCountMap[path] = tabsOpenCountMap[tabsKey]
	tabsOpenCountMap[tabsKey] = false
	setTabPathQueryFlag = true
	app.vue.$router.replace({
		query
	})
	store.commit('SET_APP_TABS', tabsList)
}
const getTabRouteViewKey = function (route) {
	if (route.query && route.query.tabuuid) {
		return route.query.tabuuid
	}
	return route.fullPath
}
const getKeepAliveTabRouteViewKey = function (route) {
	if (route.meta.single === false && route.meta.keepAlive === true) {
		return app.vue.$fxUtils.isArray(route.query.billId) ? route.query.billId.join('') : route.query.billId
	} else {
		return null
	}
}
const getKeepAliveTabsNameList = function () {
	const store = getStore()
	const tabsList = store.getters.tabsListGetter
	return tabsList.map(item => {
		return normalizationKeepAliveTabName(item.name)
	})
}
const normalizationKeepAliveTabName = function (name) {
	if (/^\/main\/print\?/.test(name)) {
		return 'print'
	} else if (/^\/main\/printInvoice\?/.test(name)) {
		return 'printInvoice'
	} else if (/^\/main\/printNested\?/.test(name)) {
		return 'printNested'
	} else {
		return name
	}
}
export default {
	setTabsList,
	isNewTab,
	onTabBeforeDeactivated,
	offTabBeforeDeactivated,
	doTabsBeforeDeactivatedGenerator,
	tabsPush,
	tabsRemove,
	tabsRemoveRightMulity,
	onRouteChange,
	clear,
	hasTab,
	setTabTitle,
	getTabTitle,
	setTabPathQuery,
	getTabRouteViewKey,
	getKeepAliveTabRouteViewKey,
	getKeepAliveTabsNameList
}
