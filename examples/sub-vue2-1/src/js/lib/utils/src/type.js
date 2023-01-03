import utilsArray from './array.js'
import { fxDebug } from './debug.js'
const _log = fxDebug('fxUtils')
const _toString = Object.prototype.toString
// 类型检查  by shw
const toRawType = function (value) {
	return _toString.call(value).slice(8, -1)
}

// 判断是数组
const isArray = Array.isArray

// 判断是map
const isMap = (val) => toRawType(val) === 'Map'

// 判断是set
const isSet = (val) => toRawType(val) === 'Set'

// 判断是日期对象
const isDate = (val) => val instanceof Date

// 判断是function
const isFunction = (val) => typeof val === 'function'

// 判断是string
const isString = (val) => typeof val === 'string'

// 判断是symbol
const isSymbol = (val) => typeof val === 'symbol'

// 判断是Boolean
const isBoolean = (val) => typeof val === 'boolean'

// 判断是对象
const isObject = (val) => val !== null && typeof val === 'object'

// 判断是否为一个纯粹对象
const isPlainObject = (val) => toRawType(val) === 'Object'

// 判断空对象 by shw
const isEmptyObj = function (obj) {
	if (toRawType(obj) !== 'Object') {
		throw new Error('this is not object')
	}
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			return false
		}
	}
	return true
}
// JSON解析 by shw
const JSONparse = function (jsonStr, type) {
	try {
		const obj = JSON.parse(jsonStr)
		if (type === 'object' && typeof obj !== 'object') {
			return {}
		}
		return obj
	} catch (error) {
		if (type === 'object') {
			return {}
		}
		return undefined
	}
}
// 深拷贝 by shw
const deepClone = function (target) {
	let result
	if (toRawType(target) === 'Object') {
		result = {}
		for (const i in target) {
			if (Object.prototype.hasOwnProperty.call(target, i)) {
				result[i] = deepClone(target[i])
			}
		}
	} else if (toRawType(target) === 'Array') {
		result = []
		target.forEach(item => {
			result.push(deepClone(item))
		})
	} else {
		result = target
	}
	return result
}
// 判断undefined/null by shw
const isDef = function (value) {
	return value !== undefined && value !== null
}
// 隐式类型转换比较-number|string by shw
const compareStrNum = function (val, compVal) {
	if (typeof compVal !== 'string' && typeof compVal !== 'number') {
		return false
	}
	return val === (compVal - 0) || val === (compVal + '')
}

// obj转化str by shw
const obj2str = function (obj) {
	let description = ''
	for (var i in obj) {
		var property = obj[i]
		description += i + ' = ' + property + '\n'
	}
	return description
}
// 判断两个数据完全相等 by shw
const compare = function (origin, target, log = false) {
	if (typeof target !== 'object' || target === null) {
		const val = origin === target
		if (log && !val) {
			_log(`valpre:${origin},valcur:${target}`)
		}
		return val
	}
	if (typeof origin !== 'object') {
		if (log) {
			_log('origin类型错误')
		}
		return false
	}
	if (Object.keys(origin).length !== Object.keys(target).length) {
		if (log) {
			const originKeys = Object.keys(origin)
			const targetKeys = Object.keys(target)
			const originKeysDiff = originKeys.filter(item => {
				return !~targetKeys.indexOf(item)
			})
			const targetKeysDiff = targetKeys.filter(item => {
				return !~originKeys.indexOf(item)
			})
			const keys = utilsArray.arrDedup([...originKeysDiff, ...targetKeysDiff])
			_log(`key数量不等,keys:${keys.join(',')}`)
		}
		return false
	}
	for (const key of Object.keys(target)) {
		if (!compare(origin[key], target[key])) {
			if (log) {
				_log(`key:${key},valpre:`, origin[key], ' ,valcur:', target[key])
			}
			return false
		}
	}
	return true
}
// 比较两个数组的数据, 返回 增加的, 删除的, 以及 改变的
const compareDiff = function (pre, cur) {
	const data = {}
	if (pre.length > cur.length) {
		const count = pre.length - cur.length
		data.delete = pre.slice(pre.length - count)
		if (cur.length !== 0) {
			const update = []
			cur.forEach((item, index) => {
				if (!compare(item, pre[index])) {
					update.push([pre[index], item])
				}
			})
			if (update.length > 0) {
				data.update = update
			}
		}
	} else if (pre.length < cur.length) {
		const count = cur.length - pre.length
		data.add = cur.slice(cur.length - count)
		if (pre.length !== 0) {
			const update = []
			pre.forEach((item, index) => {
				if (!compare(item, cur[index])) {
					update.push([item, cur[index]])
				}
			})
			if (update.length > 0) {
				data.update = update
			}
		}
	} else {
		if (pre.length !== 0) {
			const update = []
			pre.forEach((item, index) => {
				if (!compare(item, cur[index])) {
					update.push([item, cur[index]])
				}
			})
			if (update.length > 0) {
				data.update = update
			}
		}
	}
	return data
}
// 数组转对象
const fromEntries = function (arr) {
	const obj = {}
	arr.forEach(item => {
		obj[item[0]] = item[1]
	})
	return obj
}
// 获取深层属性
const getObjDeepValue = function (obj, prop) {
	if (~prop.indexOf('.')) {
		return prop.split('.').reduce((pre, cur) => {
			return !isDef(pre) ? '' : pre[cur]
		}, obj)
	}
	return isDef(obj[prop]) ? obj[prop] : ''
}

// 数组比较工具
class CompareArrayUtils {
	constructor (data, config) {
		this.compareData = new Map()
		if (data) {
			this.setData(data, config)
		}
	}

	setData (arr, config = {}) {
		this.compareData = new Map()
		arr.forEach(item => {
			config.key ? this.compareData.set(getObjDeepValue(item, config.key), item) : this.compareData.set(item, item)
		})
	}

	has (val) {
		return this.compareData.has(val)
	}

	get (val) {
		return this.compareData.get(val)
	}
}

const compareArrayUtils = function () {
	return new CompareArrayUtils(...arguments)
}
export default {
	toRawType,
	isArray,
	isMap,
	isSet,
	isDate,
	isFunction,
	isString,
	isSymbol,
	isBoolean,
	isObject,
	isPlainObject,
	isEmptyObj,
	JSONparse,
	deepClone,
	isDef,
	compareStrNum,
	obj2str,
	compare,
	compareDiff,
	fromEntries,
	getObjDeepValue,
	compareArrayUtils
}
