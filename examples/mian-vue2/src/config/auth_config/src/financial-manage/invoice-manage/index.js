import PURCHASE_INVOICE from './purchase-invoice/index.js'
export default {
	'invoice-manage': {
		id: 'invoice-manage',
		label: '发票管理',
		code: '0007_0001',
		child: {
			...PURCHASE_INVOICE
		}
	}
}
