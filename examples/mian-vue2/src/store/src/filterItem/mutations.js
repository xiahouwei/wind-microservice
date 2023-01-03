import { setStorage } from '../utils'
import utils from '@/js/lib/utils'

export function SET_FILTER_CONFIG_ALL (state, obj) {
	const appFilterConfig = {}
	Object.values(obj).forEach(item => {
		const { type, id, data, createDate, createMan } = item
		appFilterConfig[type] = {
			id,
			type,
			createDate,
			createMan,
			data: utils.JSONparse(data, 'object')
		}
	})
	state.appFilterConfig = appFilterConfig
	setStorage('appFilterConfig', appFilterConfig)
}

export function SET_FILTER_CONFIG (state, obj) {
	const { type, id, data, createDate, createMan } = obj
	const config = {
		id,
		type,
		createDate,
		createMan,
		data: utils.JSONparse(data, 'object')
	}
	const appFilterConfig = state.appFilterConfig
	appFilterConfig[obj.type] = config
	state.appFilterConfig = {}
	state.appFilterConfig = appFilterConfig
	setStorage('appFilterConfig', appFilterConfig)
}

export function CLEAR_FILTER_CONFIG (state, type) {
	const appFilterConfig = state.appFilterConfig
	delete appFilterConfig[type]
	state.appFilterConfig = {}
	state.appFilterConfig = appFilterConfig
	setStorage('appFilterConfig', appFilterConfig)
}

