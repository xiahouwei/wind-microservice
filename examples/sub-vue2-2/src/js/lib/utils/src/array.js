import utilsType from './type'
import utilsNumber from './number'
import regUtils from './reg.js'
// 数组去重  by shw
const arrDedup = function (arr = []) {
	return Array.from(new Set(arr))
}
// 查找数组满足条件的元素,且返回指定值  by shw
const appointedMap = function (arr = [], filter) {
	const res = []
	arr.forEach((item, i) => {
		const data = filter(item, i)
		if (undefined !== data) {
			res.push(data)
		}
	})
	return res
}
// 数组求和 by shw
const arrSum = function (arr, fn, decimal = 2) {
	const sum = arr.reduce((pre, cur) => {
		return utilsNumber.toNumber(pre) + utilsNumber.toNumber(fn(cur))
	}, 0)
	return utilsNumber.toFixed(sum, decimal)
}
// 数组扁平化 by shw
const arrFlatten = function (arr, fn) {
	if (typeof fn === 'function') {
		return arr.reduce((pre, cur) => {
			const child = fn(cur)
			return pre.concat(Array.isArray(child) ? [cur].concat(arrFlatten(child, fn)) : cur)
		}, [])
	} else {
		return arr.reduce((pre, cur) => {
			return pre.concat(cur)
		}, [])
	}
}
// 数组删除
const arrRemove = function (arr, key) {
	if (utilsType.toRawType(key) === 'String') {
		return arr.filter(item => {
			return item !== key
		})
	} else if (utilsType.toRawType(key) === 'Array') {
		return arr.filter(item => {
			return !key.includes(item)
		})
	}
}
// 判断是空数组
const isArrayEmpty = function (arr) {
	return Array.isArray(arr) && arr.length === 0
}
/**
 * 数组排序
 * @param name key
 * @param order asc 升序，des 降序
 * @param minor 排序函数
 */
const sortBy = function (name, order = 'asc', minor) {
	const rev = order === 'asc' ? 1 : -1
	return function (o, p) {
		if (o && p && typeof o === 'object' && typeof p === 'object') {
			const a = utilsType.getObjDeepValue(o, name)
			const b = utilsType.getObjDeepValue(p, name)
			if (a === b) {
				return typeof minor === 'function' ? minor(o, p) : 0
			}
			if (regUtils.regInitByType('chinese').test(a[0]) && !regUtils.regInitByType('chinese').test(b[0])) {
				return 1 * rev
			}
			if (!regUtils.regInitByType('chinese').test(a[0]) && regUtils.regInitByType('chinese').test(b[0])) {
				return -1 * rev
			}
			if (typeof a === 'string') {
				return a.localeCompare(b) * rev
			}
			return a < b ? -1 * rev : 1 * rev
		}
	}
}
export default {
	arrDedup,
	appointedMap,
	arrSum,
	arrFlatten,
	arrRemove,
	isArrayEmpty,
	sortBy
}
