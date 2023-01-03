import FINANCIAL_IN_STORE from './financial-in-store/index.js'
import FINANCIAL_OUT_STORE from './financial-out-store/index.js'
import PAYABLE_ORDER from './payable-order/index.js'
import PAYMENT_ORDER from './payment-order/index.js'
import ADVANCED_ORDER from './advanced-order/index.js'
import VERIFICATION_ORDER from './verification-order/index.js'
import RECEIVABLE_ORDER from './receivable-order/index.js'
import FINANCIAL_ORGAN_MANAGE from './financial-organ-manage/index.js'
import FINANCIAL_SUPPLIER_MANAGE from './financial-supplier-manage/index.js'
import FINANCIAL_CUSTOMER_MANAGE from './financial-customer-manage/index.js'
export default {
	'financial-manage': {
		...FINANCIAL_IN_STORE,
		...FINANCIAL_OUT_STORE,
		...PAYABLE_ORDER,
		...PAYMENT_ORDER,
		...ADVANCED_ORDER,
		...VERIFICATION_ORDER,
		...RECEIVABLE_ORDER,
		...FINANCIAL_ORGAN_MANAGE,
		...FINANCIAL_SUPPLIER_MANAGE,
		...FINANCIAL_CUSTOMER_MANAGE
	}
}
