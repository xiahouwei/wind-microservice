import { AUTH_CONFIG } from '@/config/auth_config'
import { setStorage } from '../utils'
import JSD_AUTH_CONFIG from '@/config/jsd_auth_config'
import utils from '@/js/lib/utils'
import { updateAuthRender } from '@/js/directives/fx-auth'

export function SET_AUTH_DETAILS (state, { module, auth }) {
	const detailsAuth = {}
	detailsAuth[module] = auth
	state.detailsAuth = detailsAuth
	setStorage('detailsAuth', state.detailsAuth)
	updateAuthRender()
}
export function SET_AUTH_DETAILS_MULITY (state, { moduleDetaislAuthMap }) {
	const detailsAuth = {}
	Object.keys(moduleDetaislAuthMap).forEach(moduleAuth => {
		detailsAuth[moduleAuth] = moduleDetaislAuthMap[moduleAuth]
	})
	state.detailsAuth = detailsAuth
	setStorage('detailsAuth', state.detailsAuth)
	updateAuthRender()
}
export function SET_AUTH_MODULE (state, auth) {
	const moduleAuth = normalizationModuleAuthData(auth)
	state.moduleAuth = moduleAuth
	setStorage('moduleAuth', state.moduleAuth)
}
export function getModuleAuthConfigMap () {
	const authMap = new Map()
	Object.values(AUTH_CONFIG).forEach(item => {
		authMap.set(normalizationAuthCode(item.code), item.id)
		Object.values(item.child).forEach(sub => {
			authMap.set(normalizationAuthCode(sub.code), `${item.id}_${sub.id}`)
			if (sub.child) {
				Object.values(sub.child).forEach(third => {
					if (third.child) {
						authMap.set(normalizationAuthCode(third.code), `${item.id}_${sub.id}_${third.id}`)
					}
				})
			}
		})
	})
	return authMap
}
export function getModuleAuthConfigNameMap () {
	const authMap = new Map()
	Object.values(AUTH_CONFIG).forEach(item => {
		authMap.set(item.id, normalizationAuthCode(item.code))
		Object.values(item.child).forEach(sub => {
			authMap.set(`${item.id}_${sub.id}`, normalizationAuthCode(sub.code))
			if (sub.child) {
				Object.values(sub.child).forEach(third => {
					if (third.child) {
						authMap.set(`${item.id}_${sub.id}_${third.id}`, normalizationAuthCode(third.code))
					}
				})
			}
		})
	})
	return authMap
}

function normalizationModuleAuthData (data) {
	const authMap = getModuleAuthConfigMap()
	const authObj = {}
	data.forEach(item => {
		if (authMap.has(item.code)) {
			const authName = authMap.get(item.code)
			authObj[authName] = item.code
		} else {
			utils.fxDebug(`${item.name}-${item.code}不在当前菜单权限列表, 请添加后再操作`)
		}
	})
	return authObj
}

export function normalizationAuthCode (code) {
	return /^(?!scm_)/.test(code) ? `scm_${code}` : code
}

export function SET_TENANT_INFO (state, info) {
	state.tenantInfo = info
	setStorage('tenantInfo', info)
}

// {{{ jsd极速订模块权限
export function SET_JSD_AUTH_MODULE (state, auth) {
	const jsdModuleAuth = normalizationJSDModuleAuthData(auth)
	state.jsdModuleAuth = jsdModuleAuth
	setStorage('jsdModuleAuth', state.jsdModuleAuth)
}
export function getJSDModuleAuthConfigMap () {
	const authMap = new Map()
	Object.values(JSD_AUTH_CONFIG).forEach(item => {
		authMap.set(normalizationJSDAuthCode(item.code), item.id)
		if (item.child) {
			Object.values(item.child).forEach(sub => {
				authMap.set(normalizationJSDAuthCode(sub.code), sub.id)
			})
		}
	})
	return authMap
}
export function getJSDModuleAuthConfigNameMap () {
	const authMap = new Map()
	Object.values(JSD_AUTH_CONFIG).forEach(item => {
		authMap.set(item.id, normalizationJSDAuthCode(item.code))
		if (item.child) {
			Object.values(item.child).forEach(sub => {
				authMap.set(sub.id, normalizationJSDAuthCode(sub.code))
			})
		}
	})
	return authMap
}
function normalizationJSDModuleAuthData (auth) {
	const authMap = getJSDModuleAuthConfigMap()
	const authObj = {}
	auth.forEach(item => {
		if (authMap.has(item)) {
			const authName = authMap.get(item)
			authObj[authName] = item
		} else {
			utils.fxDebug(`${item}不在当前菜单权限列表, 请添加后再操作`)
		}
	})
	return authObj
}

export function normalizationJSDAuthCode (code) {
	return /^(?!jsd_)/.test(code) ? `jsd_${code}` : code
}

// }}}
