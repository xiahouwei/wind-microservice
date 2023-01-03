import SETTLEMENT_WAY from './settlement-way/index.js'
import FINANCIAL_ORGAN_MANAGE from './financial-organ-manage/index.js'
import FINANCIAL_SUPPLIER_MANAGE from './financial-supplier-manage/index.js'
import FINANCIAL_CUSTOMER_MANAGE from './financial-customer-manage/index.js'
export default {
	id: 'financial-archives',
	label: '财务档案',
	child: [
		SETTLEMENT_WAY,
		FINANCIAL_ORGAN_MANAGE,
		FINANCIAL_SUPPLIER_MANAGE,
		FINANCIAL_CUSTOMER_MANAGE
	]
}
