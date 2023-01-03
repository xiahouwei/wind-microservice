import API_PARAM_CONFIG from './api_param-config'
import API_BIUBIUORDER from './api_biubiuorder'
import API_ORDER_REQUIRED from './api_order-required'
import API_ORDER_MISTAKE_CHECK from './api_order-mistake-check'
export default {
	...API_PARAM_CONFIG,
	...API_BIUBIUORDER,
	...API_ORDER_REQUIRED,
	...API_ORDER_MISTAKE_CHECK
}
