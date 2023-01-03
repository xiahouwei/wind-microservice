import { setStorage } from '../utils'
import utils from '@/js/lib/utils'

export function SET_ORDER_REQUIRED_SETTING (state, res) {
	if (utils.isArray(res)) {
		state.appOrderRequiredConfig = {}
		res.forEach(item => {
			state.appOrderRequiredConfig[item.type] = utils.JSONparse(item.data, 'object')
		})
	} else {
		state.appOrderRequiredConfig[res.type] = utils.JSONparse(res.data, 'object')
	}
	setStorage('appOrderRequiredConfig', state.appOrderRequiredConfig)
}
