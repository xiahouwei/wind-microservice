import utilsType from './type.js'
import utilsDate from './date.js'
// 生成uuid by shw
const createUUID = function () {
	const myDate = new Date()
	const myM = myDate.getMinutes()
	const myS = myDate.getSeconds()
	const myMS = myDate.getMilliseconds()
	const random = Math.round(Math.random() * 1000000)
	return `${myM}${myS}${myMS}${random}`
}
// 模糊查询string shw
const fuzzyQueryString = function (val, key) {
	if (Array.isArray(val)) {
		return ~(val.findIndex(item => {
			return fuzzyQueryString(item, key)
		}))
	} else {
		return (val || '').toLowerCase().includes((key || '').toLowerCase())
	}
}

// 模糊查询obj by shw
const fuzzyQueryObj = function (val, key, props) {
	return !!props.find(item => {
		if (~item.indexOf('.') && typeof val === 'object') {
			return fuzzyQuery(val, key, item)
		}
		return fuzzyQueryString(val[item], key)
	})
}
const fuzzyQuery = function (val, key, searchKey) {
	if (~searchKey.indexOf('.') && utilsType.toRawType(val) === 'Object') {
		const searchKeys = searchKey.split('.')
		const firstKey = searchKeys.shift()
		const otherKey = searchKeys.join('.')
		const _val = val[firstKey]
		if (Array.isArray(_val)) {
			return _val.some(item => {
				return fuzzyQuery(item, key, otherKey)
			})
		} else if (utilsType.toRawType(_val) === 'Object') {
			return fuzzyQuery(_val, key, otherKey)
		} else {
			return fuzzyQueryString(_val, key)
		}
	} else {
		return fuzzyQueryString(val[searchKey], key)
	}
}
// 获取父元素
const findParentElement = function (el, tagName) {
	let parent = el.parentElement
	while (parent) {
		if (parent.tagName === tagName) {
			return parent
		}
		parent = parent.parentElement
	}
}
// 获取手工单号类型的年月日时分 by shw
const createBillCode = function (type = '') {
	return utilsDate.setDateTime(new Date(), (y, m, d, myH, myM) => {
		y = `${y}`.substr(-2)
		return `${type}${y}${m}${d}${myH}${myM}`
	})
}
// 后端返回文件流下载文件
const downloadFile = function (fileData, fileName = `excel-${new Date().getTime()}`) {
	const Temp = document.createElement('a')
	if (fileData.headers) {
		const disposition = fileData.headers['content-disposition']
		fileName = decodeURIComponent(disposition.substring(disposition.indexOf('filename=') + 9, disposition.length))
		fileData = fileData.data
	}
	const blob = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
	Temp.href = window.URL.createObjectURL(blob)
	Temp.download = fileName
	Temp.click()
	Temp.remove()
}
// selectTag通用查询方法
const getSelectTagById = function (id, list, listData = 'listData') {
	const select = {}
	for (let i = 0; i < list.length; i++) {
		const index = list[i][listData].findIndex(item => {
			return item.id === id
		})
		if (~index) {
			return list[i][listData][index]
		}
	}
	return select
}
// selectMulity通用查询方法
const getSelectMulityById = function (ids, list) {
	return list.filter(item => {
		return ids.includes(item.id)
	})
}
// 判断回车code
const isEnterCode = function (code) {
	return code === 'Enter' || code === 'NumpadEnter'
}

// url参数转json by shw
const parameters2json = function (str) {
	const params = {}
	str.replace(/([^?&]+)=([^?&]+)/g, function (s, v, k) {
		params[v] = decodeURIComponent(k)
		return `${k}=${v}`
	})
	return params
}

export default {
	createUUID,
	fuzzyQueryString,
	fuzzyQueryObj,
	findParentElement,
	createBillCode,
	downloadFile,
	getSelectTagById,
	getSelectMulityById,
	isEnterCode,
	parameters2json
}
