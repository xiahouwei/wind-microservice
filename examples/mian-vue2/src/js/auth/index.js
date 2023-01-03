import { AUTH_CONFIG, FIRST_BUTTON_ENUM } from '@/config/auth_config'
import utils from '@/js/lib/utils'

const fullCodeWithThirdRE = /^\d{4}_\d{4}_\d{4}_\d{3}_\d{3}$/
const fullCodeWithoutThirdRE = /^\d{4}_\d{4}_\d{3}_\d{3}$/
const firstButtonCodeWithThirdRE = /^\d{4}_\d{4}_\d{4}_\d{3}$/
const firstButtonCodeWithoutThirdRE = /^\d{4}_\d{4}_\d{3}$/
const thirdCodeRE = /^\d{4}_\d{4}_\d{4}$/
const subCodeRE = /^\d{4}_\d{4}$/
const mainCodeRE = /^\d{4}$/
const authKeyRE = /^([a-zA-Z\-]*)\_([a-zA-Z\-]*)\_?([a-zA-Z\-]*)?\.?([a-zA-Z\-]*)?$/
let authConfiMap = null
/*
 * 权限map, 用来判断不同类型的校验
 * example:
 * mainModule:basic-archives
 * subModule:basic-archives_organ-manage
 * thirdModule:basic-archives_support-archives_bussiness-type
 * firstButton: add
 * secondButton: basic-archives_organ-manage.add-shop
*/
const isAuthHandlerMap = {
	mainModule (type, codes) {
		if (Array.isArray(codes)) {
			return codes.every(code => mainMoudleHandler(type, code))
		} else {
			return mainMoudleHandler(type, codes)
		}
	},
	subModule (type, codes) {
		if (Array.isArray(codes)) {
			return codes.every(code => subModuleHandler(type, code))
		} else {
			return subModuleHandler(type, codes)
		}
	},
	thirdModule (type, codes) {
		if (Array.isArray(codes)) {
			return codes.every(code => thirdModuleHandler(type, code))
		} else {
			return thirdModuleHandler(type, codes)
		}
	},
	firstButton (type, codes) {
		if (Array.isArray(codes)) {
			return codes.every(code => firstButtonHandler(type, code))
		} else {
			return firstButtonHandler(type, codes)
		}
	},
	secondButton (type, codes) {
		if (Array.isArray(codes)) {
			return codes.every(code => secondButtonHandler(type, code))
		} else {
			return secondButtonHandler(type, codes)
		}
	}
}
const mainMoudleHandler = function (type, code) {
	const { mainModule } = getAuthKeyByCode(code)
	return !!mainModule && type === mainModule
}
const subModuleHandler = function (type, code) {
	const { mainModule, subModule } = getAuthKeyByCode(code)
	return !!subModule && type === `${mainModule}_${subModule}`
}
const thirdModuleHandler = function (type, code) {
	const { mainModule, subModule, thirdModule } = getAuthKeyByCode(code)
	return !!thirdModule && type === `${mainModule}_${subModule}_${thirdModule}`
}
const firstButtonHandler = function (type, code) {
	const { firstBtnCode } = resolveAuthCode(code)
	return FIRST_BUTTON_ENUM[type].code === firstBtnCode
}
const secondButtonHandler = function (type, code) {
	const { mainModule, subModule, thirdModule, secondBtn } = getAuthKeyByCode(code)
	return thirdModule ? type === `${mainModule}_${subModule}_${thirdModule}.${secondBtn}` : type === `${mainModule}_${subModule}.${secondBtn}`
}
const reverseNormalizationAuthCode = function (code) {
	return /^scm_/.test(code) ? code.replace(/^scm_/, '') : code
}
const normalizationAuthCode = function (code) {
	return /^(?!scm_)/.test(code) ? `scm_${code}` : code
}
const isAuth = function (authType) {
	return function (authTypeValue) {
		return function (codes) {
			return isAuthHandlerMap[authType](authTypeValue, reverseNormalizationAuthCode(codes))
		}
	}
}
const resolveAuthCode = function (code) {
	let mainCode = ''
	let subCode = ''
	let thirdCode = ''
	let firstBtnCode = ''
	let secondBtnCode = ''
	if (fullCodeWithThirdRE.test(code)) {
		[mainCode, subCode, thirdCode, firstBtnCode, secondBtnCode] = code.split('_')
	} else if (fullCodeWithoutThirdRE.test(code)) {
		[mainCode, subCode, firstBtnCode, secondBtnCode] = code.split('_')
	} else if (firstButtonCodeWithThirdRE.test(code)) {
		[mainCode, subCode, thirdCode, firstBtnCode] = code.split('_')
	} else if (firstButtonCodeWithoutThirdRE.test(code)) {
		[mainCode, subCode, firstBtnCode] = code.split('_')
	} else if (thirdCodeRE.test(code)) {
		[mainCode, subCode, thirdCode] = code.split('_')
	} else if (subCodeRE.test(code)) {
		[mainCode, subCode] = code.split('_')
	} else if (mainCodeRE.test(code)) {
		mainCode = code
	}
	return {
		mainCode,
		subCode,
		thirdCode,
		firstBtnCode,
		secondBtnCode
	}
}
const getAuthKeyByCode = function (code) {
	code = reverseNormalizationAuthCode(code)
	const { mainCode, subCode, thirdCode, firstBtnCode, secondBtnCode } = resolveAuthCode(code)
	const mainAuthConfig = Object.values(AUTH_CONFIG).find(item => item.code === mainCode) || {}
	if (!secondBtnCode && !subCode && !thirdCode && mainCode) {
		return {
			mainModule: mainAuthConfig.id,
			subModule: ''
		}
	} else if (subCode && mainCode && !thirdCode) {
		const subAuthConfig = (Object.values(mainAuthConfig.child || {})).find(item => item.code === `${mainCode}_${subCode}`) || {}
		if (!secondBtnCode || !firstBtnCode) {
			return {
				mainModule: mainAuthConfig.id,
				subModule: subAuthConfig.id
			}
		} else {
			const secondBtnConfig = (Object.values(subAuthConfig.child || {})).find(item => item.code === code) || {}
			return {
				mainModule: mainAuthConfig.id,
				subModule: subAuthConfig.id,
				secondBtn: secondBtnConfig.id
			}
		}
	} else if (subCode && mainCode && thirdCode) {
		const subAuthConfig = (Object.values(mainAuthConfig.child || {})).find(item => item.code === `${mainCode}_${subCode}`) || {}
		const thirdAuthConfig = (Object.values(subAuthConfig.child || {})).find(item => item.code === `${mainCode}_${subCode}_${thirdCode}`) || {}
		if (!secondBtnCode || !firstBtnCode) {
			return {
				mainModule: mainAuthConfig.id,
				subModule: subAuthConfig.id,
				thirdModule: thirdAuthConfig.id
			}
		} else {
			const secondBtnConfig = (Object.values(thirdAuthConfig.child || {})).find(item => item.code === code) || {}
			return {
				mainModule: mainAuthConfig.id,
				subModule: subAuthConfig.id,
				thirdModule: thirdAuthConfig.id,
				secondBtn: secondBtnConfig.id
			}
		}
	}
}
const getAuthByCode = function (code) {
	code = reverseNormalizationAuthCode(code)
	const { mainCode, subCode, thirdCode, firstBtnCode, secondBtnCode } = resolveAuthCode(code)
	const mainAuthConfig = Object.values(AUTH_CONFIG).find(item => item.code === mainCode) || {}
	if (!secondBtnCode && !subCode && !thirdCode && mainCode) {
		return mainAuthConfig
	} else if (subCode && mainCode && !thirdCode) {
		const subAuthConfig = (Object.values(mainAuthConfig.child || {})).find(item => item.code === `${mainCode}_${subCode}`) || {}
		if (!secondBtnCode || !firstBtnCode) {
			return subAuthConfig
		} else {
			return (Object.values(subAuthConfig.child || {})).find(item => item.code === code) || {}
		}
	} else if (subCode && mainCode && thirdCode) {
		const subAuthConfig = (Object.values(mainAuthConfig.child || {})).find(item => item.code === `${mainCode}_${subCode}`) || {}
		const thirdAuthConfig = (Object.values(subAuthConfig.child || {})).find(item => item.code === `${mainCode}_${subCode}_${thirdCode}`) || {}
		if (!secondBtnCode || !firstBtnCode) {
			return thirdAuthConfig
		} else {
			return (Object.values(thirdAuthConfig.child || {})).find(item => item.code === code) || {}
		}
	}
}
const getCodeByAuthKey = function (key) {
	const [, main, sub, third, detail] = key.match(authKeyRE)
	let code = ''
	if (third) {
		code = detail ? AUTH_CONFIG[main].child[sub].child[third].child[detail].code : AUTH_CONFIG[main].child[sub].child[third].code
	} else if (detail) {
		code = AUTH_CONFIG[main].child[sub].child[detail].code
	} else {
		code = AUTH_CONFIG[main].child[sub].code
	}
	return normalizationAuthCode(code)
}
const authGetter = function (authKey) {
	return (detailsAuthMap) => {
		const [moduleName, detailsName] = authKey.split('.')
		return utils.logicJudgmentStr(detailsName, detail => {
			return !!detailsAuthMap[`${moduleName}.${detail}`]
		})
	}
}

const createAuthDetailsMap = function (data) {
	const authMap = getAuthConfigMap()
	const authObj = {}
	if (Array.isArray(data) && data.length > 0) {
		data.forEach(item => {
			if (authMap.has(item.code)) {
				const authName = authMap.get(item.code)
				authObj[authName] = item.code
			}
		})
	} else {
		const code = typeof data === 'string' ? data : data.code
		if (authMap.has(code)) {
			const authName = authMap.get(code)
			authObj[authName] = code
		}
	}
	return authObj
}

const getAuthConfigMap = function () {
	if (authConfiMap) {
		return authConfiMap
	}
	const authMap = new Map()
	Object.values(AUTH_CONFIG).forEach(item => {
		authMap.set(normalizationAuthCode(item.code), item.id)
		Object.values(item.child || {}).forEach(sub => {
			authMap.set(normalizationAuthCode(sub.code), `${item.id}_${sub.id}`)
			Object.values(sub.child || {}).forEach(third => {
				if (third.child) {
					Object.values(third.child).forEach(secondButton => {
						authMap.set(normalizationAuthCode(secondButton.code), `${item.id}_${sub.id}_${third.id}.${secondButton.id}`)
					})
				} else {
					authMap.set(normalizationAuthCode(third.code), `${item.id}_${sub.id}.${third.id}`)
				}
			})
		})
	})
	authConfiMap = authMap
	return authConfiMap
}

export default {
	isAuth,
	getAuthKeyByCode,
	getAuthByCode,
	getCodeByAuthKey,
	authGetter,
	createAuthDetailsMap
}
