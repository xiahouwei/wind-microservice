import SEARCH_PARAMS from '@/config/search_params_config.js'
import utils from '@/js/lib/utils/index.js'
// 获取搜索参数 by shw
const getSearchParams = function (searchType) {
	let searchParamConfig = SEARCH_PARAMS[searchType]
	return (params) => {
		if (typeof searchParamConfig.merge === 'function') {
			const mergeConfig = searchParamConfig.merge(params)
			searchParamConfig = mergeHandler(searchParamConfig, mergeConfig)
		}
		return {
			e: getParamsByConfig('eq', searchParamConfig, params),
			l: getParamsByConfig('link', searchParamConfig, params),
			custom: getParamsByConfig('custom', searchParamConfig, params),
			u: getFuzzyParams(searchParamConfig, params),
			i: getParamsByConfig('in', searchParamConfig, params),
			ni: getParamsByConfig('notIn', searchParamConfig, params),
			rl: getParamsByConfig('rl', searchParamConfig, params),
			orl: getParamsByConfig('orl', searchParamConfig, params),
			r: getParamsByConfig('range', searchParamConfig, params),
			ri: getParamsByConfig('rangeIn', searchParamConfig, params),
			ra: getParamsByConfig('rangeAnd', searchParamConfig, params),
			rid: getParamsByConfig('rangeInId', searchParamConfig, params),
			o: params.sortParams || null
		}
	}
}
const mergeHandler = function (config, mergeConfig) {
	const _config = utils.deepClone(config)
	Object.keys(mergeConfig).forEach(item => {
		if (!_config[item]) {
			_config[item] = mergeConfig[item]
		} else {
			_config[item].push(...mergeConfig[item])
		}
	})
	return _config
}
const getParamsByConfig = function (type, config, params) {
	const _params = {}
	if (config[type]) {
		config[type].forEach(item => {
			if (!utils.isArrayEmpty(params[item])) {
				_params[item] = params[item]
			}
		})
	}
	return _params
}
const getFuzzyParams = function (config, params) {
	const fuzzy = {}
	if (config.fuzzy) {
		config.fuzzy.forEach(item => {
			fuzzy[item.rule] = params[item.id]
		})
	}
	return fuzzy
}
export default {
	getSearchParams
}
