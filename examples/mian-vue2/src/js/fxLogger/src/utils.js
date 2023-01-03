const getUUID = function () {
	const r = []
	const s = '0123456789abcdef'.split('')
	for (let i = 0; i < 32; i++) {
		r[i] = s[Math.floor(Math.random() * 0x10)]
	}
	return r.join('')
}
const createUUIDInt = function () {
	var id = 0
	return function () {
		return ++id
	}
}
const getUUIDInt = createUUIDInt()
const getTime = function () {
	return new Date().getTime()
}
const getDomain = function () {
	return window.location.href.match(/:\/\/([\w.\-_]+(?::\d+)?)\//)[1]
}
const isDef = function (value) {
	return value !== undefined && value !== null
}
const compare = function (origin, target) {
	if (typeof target !== 'object' || target === null) {
		return origin === target
	}
	if (typeof origin !== 'object') {
		return false
	}
	if (Object.keys(origin).length !== Object.keys(target).length) {
		return false
	}
	for (const key of Object.keys(target)) {
		if (!compare(origin[key], target[key])) {
			return false
		}
	}
	return true
}
// 数组比较工具
class CompareArrayUtils {
	constructor (arr, fn) {
		this.compareData = {}
		this.compareMap = {}
		this.setData(arr, fn)
	}

	setData (arr, fn) {
		const arrObj = {}
		const arrMap = {}
		arr.forEach(item => {
			const key = typeof fn === 'function' ? fn(item) : item
			arrObj[key] = true
			arrMap[key] = item
		})
		this.compareData = Object.freeze(arrObj)
		this.compareMap = arrMap
	}

	has (val) {
		return this.compareData[val]
	}

	get () {
		return this.compareData
	}

	getMap () {
		return this.compareMap
	}
}
const getIntersectionArrByMap = function (pre, cur) {
	return Object.keys(cur).filter(item => Object.prototype.hasOwnProperty.call(pre, item))
}
const compareDiff = function (pre, cur, getKeyFn) {
	return typeof getKeyFn === 'function' ? compareDiffByKey(pre, cur, getKeyFn) : compareDiffNoKey(pre, cur)
}
const compareDiffNoKey = function (pre, cur) {
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
const compareDiffByKey = function (pre, cur, getKeyFn) {
	const data = {}
	if (pre.length === 0 && cur.length !== 0) {
		data.add = cur
	} else if (pre.length !== 0 && cur.length === 0) {
		data.delete = pre
	} else if (pre.length !== 0 && cur.length !== 0) {
		const preMap = new CompareArrayUtils(pre, getKeyFn)
		const curMap = new CompareArrayUtils(cur, getKeyFn)
		const intersectionArr = getIntersectionArrByMap(preMap.get(), curMap.get())
		const adds = cur.filter(item => !preMap.has(getKeyFn(item)))
		const dels = pre.filter(item => !curMap.has(getKeyFn(item)))
		const modifys = []
		intersectionArr.forEach(key => {
			if (!compare(preMap.getMap()[key], curMap.getMap()[key])) {
				modifys.push([preMap.getMap()[key], curMap.getMap()[key]])
			}
		})
		if (adds.length > 0) {
			data.add = adds
		}
		if (dels.length > 0) {
			data.delete = dels
		}
		if (modifys.length > 0) {
			data.update = modifys
		}
	}
	return data
}
const getObjDeepValue = function (obj, prop) {
	if (~prop.indexOf('.')) {
		return prop.split('.').reduce((pre, cur) => {
			return !isDef(pre) ? '' : pre[cur]
		}, obj)
	}
	return isDef(obj[prop]) ? obj[prop] : ''
}

const setDateTime = function (date = new Date(), formatter) {
	const pushZero = (val) => {
		return val < 10 ? '0' + val : val
	}
	const y = date.getFullYear()
	const m = pushZero(date.getMonth() + 1)
	const d = pushZero(date.getDate())
	const myH = pushZero(date.getHours())
	const myM = pushZero(date.getMinutes())
	const myS = pushZero(date.getSeconds())
	if (typeof formatter === 'function') {
		return formatter(y, m, d, myH, myM, myS)
	}
	switch (formatter) {
	case '年月日':
		return `${y}年${m}月${d}日 ${myH}:${myM}:${myS}`
	case '年月日时分':
		return `${y}年${m}月${d}日 ${myH}:${myM}`
	case '时分':
		return `${y}-${m}-${d} ${myH}:${myM}`
	case 'HH:MM:SS':
		return `${myH}:${myM}:${myS}`
	default:
		return `${y}-${m}-${d} ${myH}:${myM}:${myS}`
	}
}
export default {
	getUUID,
	getUUIDInt,
	getTime,
	getDomain,
	isDef,
	compare,
	compareDiff,
	getObjDeepValue,
	setDateTime
}
