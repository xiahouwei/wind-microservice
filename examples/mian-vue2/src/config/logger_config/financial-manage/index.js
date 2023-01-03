import INVOICE_MANAGE from './invoice-manage/index.js'
import INVENTORY_ACCOUNTING from './inventory-accounting/index.js'
import CAPITAL_MANAGE from './capital-manage/index.js'
import FINANCIAL_ARCHIVES from './financial-archives/index.js'
import ACCOUNT_PERIOD from './account-period/index.js'
import CARRY_FORWARD from './carry-forward/index.js'
export default {
	id: 'financial-manage',
	label: '财务管理',
	child: [
		INVOICE_MANAGE,
		INVENTORY_ACCOUNTING,
		CAPITAL_MANAGE,
		FINANCIAL_ARCHIVES,
		ACCOUNT_PERIOD,
		CARRY_FORWARD
	]
}
