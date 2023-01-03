export default {
	hasTabGetter: state => (routerPath) => {
		return !!state.tabsList.find(item => item.name === routerPath)
	},
	tabGetter: state => (routerPath) => {
		return state.tabsList.find(item => item.name === routerPath)
	},
	tabsListGetter: state => {
		return state.tabsList
	},
	currentTabGetter: state => {
		return state.currentTab
	}
}
