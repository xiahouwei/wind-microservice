import app from '@/main.js'
import utils from '@/js/lib/utils'

export function go (routerPath) {
	const isHttp = typeof routerPath === 'string' && (/http/.test(routerPath) || /https/.test(routerPath))
	if (!isHttp) {
		const $router = app.vue.$router
		if (typeof routerPath === 'object' && routerPath.replace === true) {
			$router.replace(routerPath)
		} else {
			routerPath === 'BACK' ? $router.go(-1) : $router.push(routerPath)
		}
	} else {
		window.location.href = routerPath
	}
}

export function getUrl (url, $router) {
	// Make sure the href is right in hash mode
	if ($router && !$router._history && typeof url === 'string' && !/http/.test(url)) {
		return '#!' + url
	}
	return url && typeof url !== 'object' ? url : 'javascript:void(0);'
}

export function goBlank (routerPath) {
	const isHttp = typeof routerPath === 'string' && (/http/.test(routerPath) || /https/.test(routerPath))
	if (!isHttp) {
		const $router = app.vue.$router
		let routeData = {}
		if (typeof routerPath === 'string') {
			routeData = $router.resolve(routerPath)
		} else {
			const { path, query } = routerPath
			routeData = $router.resolve({ path, query })
		}
		window.open(routeData.href, '_blank')
	} else {
		window.open(routerPath, '_blank')
	}
}
/**
 * @name clearRouterQuery
 * @desc 清除当前url的query参数
 * @author shw
 * @date 2021/9/24
 */
export function clearRouterQuery () {
	const _route = app.vue.$route
	if (!utils.isEmptyObj(_route.query)) {
		window.history.replaceState('', '', `#${_route.path}`)
	}
}

/**
 * @name routeLoginPage
 * @desc 跳转登录页面
 * @author shw
 * @date 2021/9/24
 */
export function routeLoginPage () {
	app.vue.$router.replace({ name: 'login', query: { hostId: app.vue.$store.state.loginer.hostId } })
}

/**
 * @name replaceRouterPathNofresh
 * @desc 改变router-patch
 * @author shw
 * @date 2021/10/29
 */
export function replaceRouterPathNofresh (path) {
	const _path = /^\//.test(path) ? `#${path}` : `#${app.vue.$route.path}/${path}`
	window.history.replaceState('', '', _path)
}
