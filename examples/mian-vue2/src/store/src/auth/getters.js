import utils from '@/js/lib/utils'
import { getModuleAuthConfigNameMap, getJSDModuleAuthConfigNameMap } from './mutations'
const getDetailsAuth = function (detailsAuth, moduleName) {
	return detailsAuth[moduleName] || {}
}
const hasAuth = function (state, moduleName, details) {
	const detailsAuthMap = getDetailsAuth(state, moduleName)
	return utils.logicJudgmentStr(details, detail => {
		return !!detailsAuthMap[detail]
	})
}
export default {
	// 获取详情权限
	detailsAuthGetter: state => (authKey) => {
		const [moduleName, details] = authKey.split('.')
		return hasAuth(state.detailsAuth, moduleName, details)
	},
	// 获取模块权限
	moduleAuthGetter: state => (moduleName, authType) => {
		const authMap = getModuleAuthConfigNameMap()
		const jsdAuthMap = getJSDModuleAuthConfigNameMap()
		return utils.logicJudgmentStr(moduleName, (moduleName) => {
			switch (authType) {
			case 'scm':
			case 'report':
			case 'reportNew':
			case 'productionManage':
			default:
				return authMap.has(moduleName) ? !!state.moduleAuth[moduleName] : true
			case 'biubiuorder':
				return jsdAuthMap.has(moduleName) ? !!state.jsdModuleAuth[moduleName] : true
			}
		})
	}
}
