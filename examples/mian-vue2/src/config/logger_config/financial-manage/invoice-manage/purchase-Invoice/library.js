// import app from '@/main.js'
const createFileMessage = function (file) {
	return file.appendixUrl
}
export default {
	main: [{
		id: 'invoicingDate',
		label: '开票日期',
		type: 'basic'
	}, {
		id: 'invoiceTypeName',
		label: '发票类型',
		type: 'basic'
	}, {
		id: 'invoicingMoney',
		label: '开票金额',
		type: 'basic'
	}, {
		id: 'invoicingCode',
		label: '发票号码',
		type: 'basic'
	}, {
		id: 'salesOrganName',
		label: '销售方',
		type: 'seller'
	}, {
		id: 'salesTaxNO',
		label: '销售方税号',
		type: 'seller'
	}, {
		id: 'salesAddr',
		label: '销售方联系地址',
		type: 'seller'
	}, {
		id: 'salesPhone',
		label: '销售方联系电话',
		type: 'seller'
	}, {
		id: 'salesBankName',
		label: '销售方开户行',
		type: 'seller'
	}, {
		id: 'salesBankAccount',
		label: '销售方开户账号',
		type: 'seller'
	}, {
		id: 'purchaseOrganName',
		label: '采购方',
		type: 'buyer'
	}, {
		id: 'purchaseTaxNO',
		label: '采购方税号',
		type: 'buyer'
	}, {
		id: 'purchaseAddr',
		label: '采购方联系地址',
		type: 'buyer'
	}, {
		id: 'purchasePhone',
		label: '采购方联系电话',
		type: 'buyer'
	}, {
		id: 'purchaseBankName',
		label: '采购方开户行',
		type: 'buyer'
	}, {
		id: 'purchaseBankAccount',
		label: '采购方开户账号',
		type: 'buyer'
	}, {
		id: 'totalMoney',
		label: '价税合计',
		type: 'details'
	}, {
		id: 'memo',
		label: '备注',
		type: 'other'
	}, {
		id: 'mappendixList',
		label: '附件资料',
		type: 'other',
		handler ({ pre, cur }) {
			return this.createDiffMessage({
				label: '附件资料',
				pre,
				cur,
				msgHandler: createFileMessage
			})
		}
	}]
}
