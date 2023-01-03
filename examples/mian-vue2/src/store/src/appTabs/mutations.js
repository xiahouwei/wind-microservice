import app from '@/main.js'
import { setStorage } from '../utils'
import { DEFAULT_TABS_LIST } from './state'
export function PUSH_APP_TAB (state, newTab) {
	state.tabsList.push(newTab)
	setStorage('tabsList', state.tabsList, 'sessionStorage')
}

export function SET_APP_TABS (state, tabList) {
	state.tabsList = tabList
	setStorage('tabsList', state.tabsList, 'sessionStorage')
}

export function SET_APP_CURRENT_TAB (state, value) {
	state.currentTab = value
}

export function CLEAR_APP_TABS (state) {
	SET_APP_CURRENT_TAB(state, '')
	SET_APP_TABS(state, DEFAULT_TABS_LIST.slice())
}

export function SET_APP_CURRENT_TAB_TITLE (state, value) {
	const activeTab = state.tabsList.find(item => item.name === state.currentTab)
	if (activeTab) {
		activeTab.title = value
		SET_APP_TABS(state, state.tabsList)
	}
}

export function SET_APP_CONTAINER_VISIBLE (state, value) {
	Object.keys(state.appContainerVisible).forEach(key => {
		state.appContainerVisible[key] = false
	})
	if (app.vue.$fxUtils.isDef(state.appContainerVisible[value])) {
		state.appContainerVisible[value] = true
	} else {
		state.appContainerVisible.default = true
	}
}
