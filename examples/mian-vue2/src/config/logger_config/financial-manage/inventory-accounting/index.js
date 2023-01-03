import FINANCIAL_IN_STORE from './financial-in-store/index.js'
import FINANCIAL_OUT_STORE from './financial-out-store/index.js'
export default {
	id: 'inventory-accounting',
	label: '存货核算',
	child: [
		FINANCIAL_IN_STORE,
		FINANCIAL_OUT_STORE
	]
}
