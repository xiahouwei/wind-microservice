import { REQUIRED_ITEM_CONFIG } from '@/config/order_required_config'
import utils from '@/js/lib/utils'

function getOrderRequiredConfig (state, type, billType) {
	const appOrderRequiredConfig = {}
	appOrderRequiredConfig[type] = utils.deepClone(REQUIRED_ITEM_CONFIG[type].billTypes)
	if (!utils.isEmptyObj(state.appOrderRequiredConfig) && state.appOrderRequiredConfig[type]) {
		appOrderRequiredConfig[type].forEach(item => {
			const stateAppOrderRequiredConfig = state.appOrderRequiredConfig[type].find(_item => item.id === _item.id)
			Object.keys(item.requiredItems).forEach(key => {
				if (stateAppOrderRequiredConfig && stateAppOrderRequiredConfig.requiredItems[key]) {
					item.requiredItems[key].required = stateAppOrderRequiredConfig.requiredItems[key].required
					if (item.requiredItems[key].relevance && stateAppOrderRequiredConfig.requiredItems[key].relevance) {
						item.requiredItems[key].relevance.relevanceArr = stateAppOrderRequiredConfig.requiredItems[key].relevance.relevanceArr
					}
				}
			})
		})
	}
	if (billType) {
		return appOrderRequiredConfig[type].find(item => item.id === billType) || {}
	} else {
		return appOrderRequiredConfig[type]
	}
}

export default {
	getOrderRequired: (state) => (type, billType) => {
		return getOrderRequiredConfig(state, type, billType)
	},
	getOrderRequiredList: (state) => (type, billType, relevanceProp = '') => {
		const orderRequiredList = Object.values(getOrderRequiredConfig(state, type, billType).requiredItems || {})
		return orderRequiredList.filter(item => {
			if (relevanceProp && item.relevance && item.required) {
				return item.relevance.relevanceArr.includes(relevanceProp)
			} else {
				return item.required
			}
		}).map(item => item.id)
	},
	getOrderDataIsRequired: (state) => (type, billType, requiredProp, relevanceProp = '') => {
		const orderRequiredList = getOrderRequiredConfig(state, type, billType).requiredItems || {}
		if (relevanceProp && orderRequiredList[requiredProp] && orderRequiredList[requiredProp].relevance && orderRequiredList[requiredProp].required) {
			return orderRequiredList[requiredProp].relevance.relevanceArr.includes(relevanceProp)
		} else {
			return orderRequiredList[requiredProp] && orderRequiredList[requiredProp].required
		}
	}
}
