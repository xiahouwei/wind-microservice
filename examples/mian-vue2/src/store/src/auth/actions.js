import app from '@/main.js'
import { AUTH_CONFIG } from '@/config/auth_config'
import { normalizationAuthCode } from './mutations'
import utils from '@/js/lib/utils'

export function syncDetailsAuth ({ commit }, { moduleName, loading = true }) {
	const moduleList = moduleName.map(moduleName => {
		return {
			moduleName,
			code: authName2Code(moduleName)
		}
	})
	const fatherCodeList = moduleList.map(item => item.code)
	return app.vue.$fxApi('auth.getCurrentAuth', fatherCodeList, loading).then(res => {
		const privilegesMap = normalizationTreePrivileges(res.treeHavePrivilegesData)
		const moduleDetaislAuthMap = {}
		moduleList.forEach(item => {
			const privilege = privilegesMap[item.code]
			moduleDetaislAuthMap[item.moduleName] = privilege ? normalizationDetailsAuthData(privilege, item.moduleName) : {}
		})
		commit('SET_AUTH_DETAILS_MULITY', { moduleDetaislAuthMap })
		return Promise.resolve()
	})
}

export function syncModuleAuth ({ commit }) {
	return app.vue.$fxApi('auth.getCurrentAuth').then(res => {
		commit('SET_AUTH_MODULE', res.haveModulars)
		return Promise.resolve()
	})
}

export function syncJSDModuleAuth ({ commit }) {
	return app.vue.$fxApi('auth.getCurrentJSDAuth').then(res => {
		commit('SET_JSD_AUTH_MODULE', res)
		return Promise.resolve()
	})
}

function authName2Code (moduleName) {
	const [main, sub, third] = moduleName.split('_')
	return third ? normalizationAuthCode(AUTH_CONFIG[main].child[sub].child[third].code) : normalizationAuthCode(AUTH_CONFIG[main].child[sub].code)
}

function getDetailsAuthConfigMap (moduleName) {
	const authMap = new Map()
	const [main, sub, third] = moduleName.split('_')
	const detailsAuth = third ? AUTH_CONFIG[main].child[sub].child[third].child : AUTH_CONFIG[main].child[sub].child
	Object.values(detailsAuth).forEach(item => {
		authMap.set(normalizationAuthCode(item.code), item.id)
	})
	return authMap
}

function normalizationTreePrivileges (data) {
	const authObj = {}
	data.forEach(item => {
		authObj[item.code] = item.children
	})
	return authObj
}

function normalizationDetailsAuthData (data, moduleName) {
	const authMap = getDetailsAuthConfigMap(moduleName)
	const authObj = {}
	data.forEach(item => {
		if (authMap.has(item.code)) {
			const authName = authMap.get(item.code)
			authObj[authName] = item.code
		} else {
			utils.fxDebug(`${item.name}-${item.code}不在当前详情权限列表, 请添加后再操作`)
		}
	})
	return authObj
}

export function getTenantInfo ({ commit }) {
	return new Promise(resolve => {
		app.vue.$fxApi('auth.getTenantInfo').then(res => {
			commit('SET_TENANT_INFO', res)
			resolve(res)
		})
	})
}
