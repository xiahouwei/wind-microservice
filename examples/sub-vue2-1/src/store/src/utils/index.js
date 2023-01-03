import utils from '@/js/lib/utils'
const log = utils.fxDebug('fxVuex')
const normalizationKey = function (key) {
	return `${window.location.host}__${key}`
}
const getLocalStorage = function (lname, defaultValue, validity = 0) {
	lname = normalizationKey(lname)
	if (validity) {
		return getLocalStorageTimeStamp(lname, validity) || defaultValue
	} else {
		return window.localStorage[lname] || defaultValue
	}
}
const getLocalStorageNumber = function (lname, defaultValue) {
	lname = normalizationKey(lname)
	return parseFloat(window.localStorage[lname]) || defaultValue
}
const getLocalStorageBoolean = function (lname, defaultValue) {
	lname = normalizationKey(lname)
	if (window.localStorage[lname] === '' || window.localStorage[lname] === undefined) {
		return defaultValue
	} else {
		return window.localStorage[lname] === 'true'
	}
}
const getSessionStorageBoolean = function (lname, defaultValue) {
	lname = normalizationKey(lname)
	if (window.sessionStorage[lname] === '' || window.sessionStorage[lname] === undefined) {
		return defaultValue
	} else {
		return window.sessionStorage[lname] === 'true'
	}
}
const getLocalStorageJson = function (lname, defaultValue) {
	lname = normalizationKey(lname)
	return utils.JSONparse(window.localStorage[lname]) || defaultValue
}
const setLocalStorage = function (key, val) {
	key = normalizationKey(key)
	if (utils.toRawType(val) === 'Object' || utils.toRawType(val) === 'Array') {
		window.localStorage.setItem(key, JSON.stringify(val))
	} else {
		window.localStorage.setItem(key, val)
	}
}
const setSessionStorage = function (key, val) {
	key = normalizationKey(key)
	if (utils.toRawType(val) === 'Object' || utils.toRawType(val) === 'Array') {
		window.sessionStorage.setItem(key, JSON.stringify(val))
	} else {
		window.sessionStorage.setItem(key, val)
	}
}
const setLocalStorageTimeStamp = function (key, val) {
	key = normalizationKey(key)
	const time = new Date().getTime()
	if (utils.toRawType(val) === 'Object' || utils.toRawType(val) === 'Array') {
		val = JSON.stringify(val)
	}
	const _val = `fxVal=${val}&fxTimeStamp=${time}`
	window.localStorage.setItem(key, _val)
}
const getLocalStorageTimeStamp = function (key, validity = 0) {
	key = normalizationKey(key)
	const currentTime = new Date().getTime()
	const valObj = parseTimeStampValue(window.localStorage[key])
	const time = valObj.fxTimeStamp || 0
	const interval = utils.ms2d(currentTime - time)
	const _val = valObj.fxVal || ''
	if (!validity || validity > interval) {
		return _val
	} else {
		return ''
	}
}
const parseTimeStampValue = function (val) {
	if (!val || !/^fxVal=/.test(val)) {
		return {}
	}
	try {
		const [valPair, timeStampPair] = val.split('&')
		const fxVal = valPair.split('=')[1]
		const fxTimeStamp = timeStampPair.split('=')[1]
		return {
			fxVal,
			fxTimeStamp
		}
	} catch (error) {
		log('时间戳解析失败, 返回空值', error)
		return {}
	}
}
export {
	getLocalStorage,
	getLocalStorageNumber,
	getLocalStorageBoolean,
	getSessionStorageBoolean,
	getLocalStorageJson,
	setLocalStorage,
	setSessionStorage,
	setLocalStorageTimeStamp,
	getLocalStorageTimeStamp
}
