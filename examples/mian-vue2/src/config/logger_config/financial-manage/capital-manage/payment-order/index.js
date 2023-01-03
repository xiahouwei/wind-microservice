import library from './library.js'
export default {
	id: 'payment-order',
	label: '付款单',
	actions: [{
		id: 'add',
		label: '新增',
		messageHandler ({ orderData, type }) {
			return `系统单号:${this.createCodeSpan(orderData, 'CWPaymentBill')},单据类型:${type}`
		}
	}, {
		id: 'delete',
		label: '删除',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'CWPaymentBill')}`
		}
	}, {
		id: 'submit',
		label: '提交',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'CWPaymentBill')}`
		}
	}, {
		id: 'return',
		label: '退回',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'CWPaymentBill')}`
		}
	}, {
		id: 'check',
		label: '审核',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'CWPaymentBill')}`
		}
	}, {
		id: 'uncheck',
		label: '反审核',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'CWPaymentBill')}`
		}
	}, {
		id: 'recheck',
		label: '复审',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'CWPaymentBill')}`
		}
	}, {
		id: 'unrecheck',
		label: '取消复审',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'CWPaymentBill')}`
		}
	}, {
		id: 'update',
		label: '修改',
		messageHandler ({ pre, cur, orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'CWPaymentBill')};修改信息为:` + this.createUpdateMessageByLibrary(library.main)(pre, cur)
		}
	}, {
		id: 'addDetails',
		label: '新增结算明细',
		messageHandler ({ orderData, addItemInfo }) {
			return `系统单号:${this.createCodeSpan(orderData, 'CWPaymentBill')},新增结算明细:${addItemInfo}`
		}
	}, {
		id: 'updateDetails',
		label: '修改结算明细',
		messageHandler ({ pre, cur, orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'CWPaymentBill')},结算方式:${cur.settleWay},修改信息为:` + this.createUpdateMessageByLibrary(library.details)(pre, cur)
		}
	}, {
		id: 'deleteDetails',
		label: '删除结算明细',
		messageHandler ({ orderData, deleteItemInfo }) {
			return `系统单号:${this.createCodeSpan(orderData, 'CWPaymentBill')},删除结算明细:${deleteItemInfo}`
		}
	}, {
		id: 'clearSettlementDetails',
		label: '清空结算明细',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'CWPaymentBill')}`
		}
	}, {
		id: 'addPayableOrderDetails',
		label: '新增关联单据',
		messageHandler ({ orderData, payableOrders }) {
			return `系统单号:${this.createCodeSpan(orderData, 'CWPaymentBill')},新增关联单据:${this.createCodeSpan(payableOrders, 'PayableBill')}`
		}
	}, {
		id: 'deleteConnectBillDetails',
		label: '删除关联单据',
		messageHandler ({ orderData, payableOrders }) {
			return `系统单号:${this.createCodeSpan(orderData, 'CWPaymentBill')},删除关联单据:${this.createCodeSpan(payableOrders, 'PayableBill')}`
		}
	}, {
		id: 'clearConnectBillDetails',
		label: '清空关联单据',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'CWPaymentBill')}`
		}
	}]
}
