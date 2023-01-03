import INVOICE_MANAGE from './invoice-manage/index.js'
import ACCOUNT_PERIOD from './account-period/index.js'
import CARRY_FORWARD from './carry-forward/index.js'
export default {
	'financial-manage': {
		id: 'financial-manage',
		label: '财务管理',
		code: '0007',
		child: {
			...INVOICE_MANAGE,
			...ACCOUNT_PERIOD,
			...CARRY_FORWARD
		}
	}
}
