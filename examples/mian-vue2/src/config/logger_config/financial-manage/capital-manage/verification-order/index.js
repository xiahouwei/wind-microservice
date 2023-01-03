import library from './library.js'
export default {
	id: 'verification-order',
	label: '应付核销',
	actions: [{
		id: 'add',
		label: '新增',
		messageHandler ({ orderData, type }) {
			return `系统单号:${this.createCodeSpan(orderData, 'PayWriteOff')},单据类型:${type}`
		}
	}, {
		id: 'delete',
		label: '删除',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'PayWriteOff')}`
		}
	}, {
		id: 'uncheck',
		label: '反核销',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'PayWriteOff')}`
		}
	}, {
		id: 'handVerification',
		label: '手动核销',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'PayWriteOff')}`
		}
	}, {
		id: 'diffVerification',
		label: '差异核销',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'PayWriteOff')}`
		}
	}, {
		id: 'unverification',
		label: '反核销',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'PayWriteOff')}`
		}
	}, {
		id: 'update',
		label: '修改',
		messageHandler ({ pre, cur, orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'PayWriteOff')};修改信息为:` + this.createUpdateMessageByLibrary(library.main)(pre, cur)
		}
	}, {
		id: 'addDetails',
		label: '新增结算明细',
		messageHandler ({ orderData, addItemInfo }) {
			return `系统单号:${this.createCodeSpan(orderData, 'PayWriteOff')},新增结算明细:${addItemInfo}`
		}
	}, {
		id: 'updateDetails',
		label: '修改结算明细',
		messageHandler ({ pre, cur, orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'PayWriteOff')},结算方式:${cur.settleWay},修改信息为:` + this.createUpdateMessageByLibrary(library.details)(pre, cur)
		}
	}, {
		id: 'deleteDetails',
		label: '删除结算明细',
		messageHandler ({ orderData, deleteItemInfo }) {
			return `系统单号:${this.createCodeSpan(orderData, 'PayWriteOff')},删除结算明细:${deleteItemInfo}`
		}
	}, {
		id: 'clearSettlementDetails',
		label: '清空结算明细',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'PayWriteOff')}`
		}
	}, {
		id: 'addPayableVerificationDetails',
		label: '新增应付明细',
		messageHandler ({ orderData, payableOrders }) {
			return `系统单号:${this.createCodeSpan(orderData, 'PayWriteOff')},新增应付明细:${this.createCodeSpan(payableOrders, 'PayableBill')}`
		}
	}, {
		id: 'updatePayableVerificationDetails',
		label: '修改应付明细',
		messageHandler ({ pre, cur, orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'PayWriteOff')},修改信息为:` + this.createUpdateMessageByLibrary(library.details)(pre, cur)
		}
	}, {
		id: 'deletePayableVerificationDetails',
		label: '删除应付明细',
		messageHandler ({ orderData, payableOrders }) {
			return `系统单号:${this.createCodeSpan(orderData, 'PayWriteOff')},删除应付明细:${this.createCodeSpan(payableOrders, 'PayableBill')}`
		}
	}, {
		id: 'addPaymentVerificationDetails',
		label: '新增付款明细',
		messageHandler ({ orderData, paymentOrders }) {
			return `系统单号:${this.createCodeSpan(orderData, 'PayWriteOff')},新增付款明细:${this.createCodeSpan(paymentOrders, 'PaymentBill')}`
		}
	}, {
		id: 'updatePaymentVerificationDetails',
		label: '修改付款明细',
		messageHandler ({ pre, cur, orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'PayWriteOff')},修改信息为:` + this.createUpdateMessageByLibrary(library.details)(pre, cur)
		}
	}, {
		id: 'deletePaymentVerificationDetails',
		label: '删除付款明细',
		messageHandler ({ orderData, paymentOrders }) {
			return `系统单号:${this.createCodeSpan(orderData, 'PayWriteOff')},删除付款明细:${this.createCodeSpan(paymentOrders, 'PaymentBill')}`
		}
	}, {
		id: 'clearVerificationDetails',
		label: '清空明细',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'PayWriteOff')}`
		}
	}]
}
