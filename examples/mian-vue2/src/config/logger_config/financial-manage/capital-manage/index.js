import PAYABLE_ORDER from './payable-order/index.js'
import PAYMENT_ORDER from './payment-order/index.js'
import ADVANCED_ORDER from './advanced-order/index.js'
import VERIFICATION_ORDER from './verification-order/index.js'
import RECEIVABLE_ORDER from './receivable-order/index.js'
export default {
	id: 'capital-manage',
	label: '资金管理',
	child: [
		PAYABLE_ORDER,
		PAYMENT_ORDER,
		ADVANCED_ORDER,
		VERIFICATION_ORDER,
		RECEIVABLE_ORDER
	]
}
