import utilsType from './type'
import utils from './utils'
import { createEventBus } from '@/js/lib/plugin/src/eventBus'

const getObjectValue = function (obj, key) {
	if (~key.indexOf('.')) {
		return key.split('.').reduce((pre, cur) => {
			return pre === undefined ? pre : pre[cur]
		}, obj)
	}
	return obj[key]
}
/*
 * table集合且生成对应rowspan by shw
 * options[Array] 集合设置
 * options[0].gatherKey[String] 集合key
 * options[0].rowMergeKey[String] 合并row的key
*/
// const gatherTableData = function (arr, options) {
// 	const gatherHander = (gatherArr, count) => {
// 		const option = options[count]
// 		const obj = {}
// 		gatherArr.forEach(item => {
// 			const value = getObjectValue(item, option.gatherKey)
// 			if (!utilsType.isDef(obj[value])) {
// 				obj[value] = true
// 			}
// 		})
// 		const _arr = Object.keys(obj).map(objKey => {
// 			let list = gatherArr.filter(item => {
// 				return objKey === getObjectValue(item, option.gatherKey)
// 			})
// 			list.forEach((item, index) => {
// 				item[option.rowMergeKey] = !index ? list.length : 0
// 			})
// 			if (count < options.length - 1) {
// 				list = gatherHander(list, count + 1)
// 			}
// 			return list
// 		})
// 		return utilsArray.arrFlatten(_arr)
// 	}
// 	return gatherHander(arr, 0)
// }
const gatherTableData = function (arr, options) {
	const dataMap = {}
	const optionList = []
	options.forEach((_item, index) => {
		const currentOption = options.slice(0, index + 1)
		optionList[index] = currentOption.map(item => {
			return item.gatherKey
		})
	})
	arr.forEach(item => {
		optionList.forEach(option => {
			const mapKey = option.map(optionItem => {
				return getObjectValue(item, optionItem)
			}).join(',')
			if (!dataMap[mapKey]) {
				dataMap[mapKey] = {
					value: [item],
					count: 1
				}
			} else {
				dataMap[mapKey].value.push(item)
				dataMap[mapKey].count = dataMap[mapKey].value.length
			}
		})
	})
	arr.forEach(item => {
		optionList.forEach(option => {
			const mapKey = option.map(optionItem => {
				return getObjectValue(item, optionItem)
			}).join(',')
			if (dataMap[mapKey]) {
				const gatherKey = option[option.length - 1]
				const rowMergeKey = options.find(keyItem => {
					return keyItem.gatherKey === gatherKey
				}).rowMergeKey
				item[rowMergeKey] = dataMap[mapKey].count
				dataMap[mapKey].count = 0
			}
		})
	})
	const _arr = Object.keys(dataMap).filter(item => {
		return item.split(',').length === options.length
	}).reduce((pre, cur) => {
		return pre.concat(dataMap[cur].value)
	}, [])
	return _arr
}
/*
 * 设置集合key by shw
*/
const setGatherKey = function (arr, key, gatherKey, fn) {
	const obj = {}
	arr.forEach(item => {
		const value = getObjectValue(item, key)
		if (!utilsType.isDef(obj[value])) {
			obj[value] = typeof fn === 'function' ? fn(value) : utils.createUUID()
		}
	})
	arr.forEach(item => {
		const value = getObjectValue(item, key)
		if (utilsType.isDef(obj[value])) {
			item[gatherKey] = obj[value]
		}
	})
}
class TableQueueUtils {
	constructor (option = {}) {
		this.ctx = null
		this.listRefName = null
		this.checked = false
		this.prevErrorMessage = option.prevErrorMessage || '当前为第一个'
		this.nextErrorMessage = option.nextErrorMessage || '当前为最后一个'
		this.eventBus = createEventBus()
	}

	init (ctx, option = {}) {
		this.ctx = ctx
		this.listRefName = option.listRefName
		this.eventBus.initEvent(ctx, 'billChange', this.billChangeHandler.bind(this, option.billChange))
		this.eventBus.initEvent(ctx, 'checkedChange', this.checkChangeHandler.bind(this))
	}

	billChange (type) {
		this.eventBus.$emit('billChange', type)
	}

	billChangeHandler (cb, type) {
		this.ctx.$refs[this.listRefName].changeRow(type, {
			prevErrorMessage: this.prevErrorMessage,
			nextErrorMessage: this.nextErrorMessage
		}).then(cb)
	}

	checkedChange (id, flag) {
		this.eventBus.$emit('checkedChange', id, flag)
	}

	checkChangeHandler (id, flag) {
		const row = this.ctx.$refs[this.listRefName].listData.find(item => {
			return item.id === id
		})
		if (row) {
			this.ctx.$refs[this.listRefName].doSelectRow(row, flag)
		}
	}

	setChecked (val) {
		this.checked = val
	}
}

const tableQueueUtils = function (option) {
	return new TableQueueUtils(option)
}

const pythagorasTheorem = function (a, b) {
	return Math.floor(Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)))
}
const cosa = function (a, b, c) {
	return Math.acos((Math.pow(b, 2) + Math.pow(c, 2) - Math.pow(a, 2)) / (2 * b * c)) * 180 / Math.PI
}
export default {
	gatherTableData,
	setGatherKey,
	getObjectValue,
	tableQueueUtils,
	pythagorasTheorem,
	cosa
}
