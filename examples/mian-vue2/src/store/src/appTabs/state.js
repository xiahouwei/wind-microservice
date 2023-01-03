import { getStorageJson } from '../utils'
export const DEFAULT_TABS_LIST = [{ title: '首页', name: 'home', closable: false }]
export default {
	tabsList: getStorageJson('tabsList', DEFAULT_TABS_LIST.slice(), 'sessionStorage'),
	currentTab: '',
	appContainerVisible: getStorageJson('appContainerVisible', {
		default: true,
		report: false
	})
}
