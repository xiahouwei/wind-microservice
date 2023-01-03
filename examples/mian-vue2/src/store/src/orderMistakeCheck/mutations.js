import { setStorage } from '../utils'
import utils from '@/js/lib/utils'

export function SET_ORDER_MISTAKE_CHECK_SETTING (state, res) {
	if (utils.isArray(res)) {
		state.appOrderMistakeCheckConfig = {}
		res.forEach(item => {
			state.appOrderMistakeCheckConfig[item.type] = utils.JSONparse(item.data) || []
		})
	} else {
		state.appOrderMistakeCheckConfig[res.type] = utils.JSONparse(res.data) || []
	}
	setStorage('appOrderMistakeCheckConfig', state.appOrderMistakeCheckConfig)
}
