import SYSTEM_PARAMS_RESOLVER from '@/config/system_params_resolver'
export default {
	getSysParams: (state) => (key, prop) => {
		const sysParam = (state.sysParamsConfig || {})[key] || {}
		if (prop === 'value') {
			return sysParam[prop] && SYSTEM_PARAMS_RESOLVER[key](sysParam[prop])
		}
		return prop ? sysParam[prop] : sysParam
	}
}
