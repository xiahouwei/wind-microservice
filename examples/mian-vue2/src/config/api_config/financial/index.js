import API_FINANCIAL_IN_STORE from './api_financial_in_store'
import API_FINANCIAL_OUT_STORE from './api_financial_out_store'
import API_PAYABLE_ORDER from './api_payable_order'
import API_PAYMENT_ORDER from './api_payment_order'
import API_ADVANCED_ORDER from './api_advanced_order'
import API_VERIFICATION_ORDER from './api_verification_order'
import API_RECEIVABLE_ORDER from './api_receivable_order'
import API_FINANCIAL_ORGAN_MANAGE from './api_financial_organ_manage'
import API_FINANCIAL_SUPPLIER_MANAGE from './api_financial_supplier_manage'
import API_FINANCIAL_CUSTOMER_MANAGE from './api_financial_customer_manage'
import API_SETTLEMENT_WAY from './api_settlement_way'
export default {
	...API_FINANCIAL_IN_STORE,
	...API_FINANCIAL_OUT_STORE,
	...API_PAYABLE_ORDER,
	...API_PAYMENT_ORDER,
	...API_ADVANCED_ORDER,
	...API_VERIFICATION_ORDER,
	...API_RECEIVABLE_ORDER,
	...API_FINANCIAL_ORGAN_MANAGE,
	...API_FINANCIAL_SUPPLIER_MANAGE,
	...API_FINANCIAL_CUSTOMER_MANAGE,
	...API_SETTLEMENT_WAY
}
