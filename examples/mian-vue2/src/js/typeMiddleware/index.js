import { COMMON_TYPE_CONFIG } from '@/config/app_common_type_config.js'
import utils from '@/js/lib/utils'
const log = utils.fxDebug('typeMiddleware')
// 获取类型list by shw
const getCommonTypeList = function (type) {
	if (!COMMON_TYPE_CONFIG[type]) {
		log('无法找到要查询类型,请检查type值是否传输正确')
	}
	return COMMON_TYPE_CONFIG[type]
}
// 根据类型id获取类型数据对象
const getCommonTypeItemById = function (type) {
	return (id) => {
		return getCommonTypeList(type).find(item => {
			return `${item.id}` === `${id}`
		}) || {}
	}
}
/**
 * @name getCommonTypeItemByRule
 * @desc 根据类型rule获取类型数据对象
 * @author shw
 * @date 2021/9/10
 * @param {String} type 类型名称
 * @param {Boolean} mulity  mulity=false只返回找到的第一个符合规则的类型, 否则返回所有
 * @return object / array
 */
const getCommonTypeItemByRule = function (type, mulity = false) {
	return (...arg) => {
		const typeList = getCommonTypeList(type)
		if (!mulity) {
			return typeList.find(item => {
				return item.rule(...arg)
			}) || {}
		} else {
			return typeList.filter(item => item.rule(...arg))
		}
	}
}

// 类型判断
const isCommonType = function (type, rule = 'id') {
	return (typeName = []) => {
		return (...arg) => {
			const types = [].concat(typeName)
			if (rule === 'id') {
				const typeValue = getCommonTypeItemById(type)(...arg).type
				return types.includes(typeValue)
			} else {
				const typeValues = getCommonTypeItemByRule(type, true)(...arg).map(item => item.type)
				return types.some(item => typeValues.includes(item))
			}
		}
	}
}

const getTypeEnum = function (type) {
	const [enumName, enumKey] = type.split('.')
	return COMMON_TYPE_CONFIG[enumName][enumKey]
}

export default {
	getCommonTypeList,
	getCommonTypeItemById,
	getCommonTypeItemByRule,
	isCommonType,
	getTypeEnum
}
