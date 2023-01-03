import STATE_MODULE from '@/config/app_state_config.js'
const getStateConfig = function (type) {
	return STATE_MODULE[type]
}
// 获取状态对象
const getStateObj = function (type) {
	return (val) => {
		const states = getStateConfig(type)
		return states.find(item => {
			return `${item.id}` === `${val}`
		}) || {}
	}
}
// 获取单据类型对象,单据状态包括审核状态或复审状态
const getOrderStateById = function (billState, recheckState, deleteState) {
	if (deleteState) {
		return getStateConfig('deleteState').find(item => {
			return `${item.id}` === `${deleteState}`
		}) || {}
	} else if (recheckState) {
		return getStateConfig('recheckState').find(item => {
			return `${item.id}` === `${recheckState}`
		}) || {}
	} else {
		return getStateConfig('billState').find(item => {
			return `${item.id}` === `${billState}`
		}) || {}
	}
}

// 状态判断
const isState = function (type) {
	return (stateName = []) => {
		return (stateId) => {
			const states = [].concat(stateName)
			const values = getStateObj(type)(stateId).type
			return states.includes(values)
		}
	}
}
// const getStateVal = function (type) {
// 	return function (key) {
// 		const states = getStateConfig(type)
// 		return states[key]
// 	}
// }
// const getStateName = function (type) {
// 	return function (val) {
// 		const states = getStateConfig(type)
// 		const _key = Object.keys(states).find(item => {
// 			return states[item] === val
// 		})
// 		return STATE_MODULE.stateName[_key]
// 	}
// }
export default {
	getStateConfig,
	getStateObj,
	getOrderStateById,
	isState
}
