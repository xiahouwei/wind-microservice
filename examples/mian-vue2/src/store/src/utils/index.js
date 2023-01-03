import utils from '@/js/lib/utils'
const log = utils.fxDebug('fxVuex')
const getStorageHandler = function (key, type = 'localStorage') {
	return window[type][key]
}
const setStorageHandler = function (key, val, type = 'localStorage') {
	window[type].setItem(key, val)
}
const normalizationKey = function (key) {
	return `${window.location.host}__${key}`
}
const getStorage = function (lname, defaultValue, type = 'localStorage', validity = 0) {
	lname = normalizationKey(lname)
	if (validity) {
		return getStorageTimeStamp(lname, type, validity) || defaultValue
	} else {
		return getStorageHandler(lname, type) || defaultValue
	}
}
const getStorageNumber = function (lname, defaultValue, type = 'localStorage') {
	lname = normalizationKey(lname)
	return parseFloat(getStorageHandler(lname, type)) || defaultValue
}
const getStorageBoolean = function (lname, defaultValue, type = 'localStorage') {
	lname = normalizationKey(lname)
	const val = getStorageHandler(lname, type)
	if (val === '' || val === undefined) {
		return defaultValue
	} else {
		return val === 'true'
	}
}
const getStorageJson = function (lname, defaultValue, type = 'localStorage') {
	lname = normalizationKey(lname)
	return utils.JSONparse(getStorageHandler(lname, type)) || defaultValue
}
const setStorage = function (key, val, type = 'localStorage') {
	key = normalizationKey(key)
	if (utils.toRawType(val) === 'Object' || utils.toRawType(val) === 'Array') {
		setStorageHandler(key, JSON.stringify(val), type)
	} else {
		window.localStorage.setItem(key, val)
		setStorageHandler(key, `${val}`, type)
	}
}
const setStorageTimeStamp = function (key, val, type = 'localStorage') {
	key = normalizationKey(key)
	const time = new Date().getTime()
	if (utils.toRawType(val) === 'Object' || utils.toRawType(val) === 'Array') {
		val = JSON.stringify(val)
	}
	setStorageHandler(key, `fxVal=${val}&fxTimeStamp=${time}`, type)
}
const getStorageTimeStamp = function (key, type = 'localStorage', validity = 0) {
	key = normalizationKey(key)
	const currentTime = new Date().getTime()
	const valObj = parseTimeStampValue(getStorageHandler(key, type))
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
	getStorage,
	getStorageNumber,
	getStorageBoolean,
	getStorageJson,
	setStorage,
	setStorageTimeStamp,
	getStorageTimeStamp
}
