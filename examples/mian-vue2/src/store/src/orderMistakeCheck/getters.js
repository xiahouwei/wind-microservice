import { MISTAKE_CHECK_ITEM_CONFIG } from '@/config/order_mistake_check_config'
import utils from '@/js/lib/utils'

function getOrderMistakeCheckConfig (state, type) {
	const appOrderMistakeCheckConfig = {}
	appOrderMistakeCheckConfig[type] = utils.deepClone(MISTAKE_CHECK_ITEM_CONFIG[type])
	if (!utils.isEmptyObj(state.appOrderMistakeCheckConfig) && state.appOrderMistakeCheckConfig[type]) {
		appOrderMistakeCheckConfig[type].selectedList = state.appOrderMistakeCheckConfig[type]
	} else {
		appOrderMistakeCheckConfig[type].selectedList = appOrderMistakeCheckConfig[type].mistakeCheckList.map(item => item.id)
	}
	return appOrderMistakeCheckConfig[type]
}

export default {
	getOrderMistakeCheck: (state) => (type) => {
		return getOrderMistakeCheckConfig(state, type)
	},
	getOrderMistakeCheckList: (state) => (type, mistakeCheckList = []) => {
		return getOrderMistakeCheckConfig(state, type).selectedList.filter(item => {
			return !mistakeCheckList.length || mistakeCheckList.includes(item)
		})
	}
}
