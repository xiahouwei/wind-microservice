import library from './library.js'
export default {
	id: 'receivable-order',
	label: '应收单',
	actions: [{
		id: 'add',
		label: '新增',
		messageHandler ({ orderData, type }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ReceivableBill')},单据类型:${type}`
		}
	}, {
		id: 'delete',
		label: '删除',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ReceivableBill')}`
		}
	}, {
		id: 'submit',
		label: '提交',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ReceivableBill')}`
		}
	}, {
		id: 'return',
		label: '退回',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ReceivableBill')}`
		}
	}, {
		id: 'check',
		label: '审核',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ReceivableBill')}`
		}
	}, {
		id: 'uncheck',
		label: '反审核',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ReceivableBill')}`
		}
	}, {
		id: 'recheck',
		label: '复审',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ReceivableBill')}`
		}
	}, {
		id: 'unrecheck',
		label: '取消复审',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ReceivableBill')}`
		}
	}, {
		id: 'pushdown',
		label: '下推',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ReceivableBill')}`
		}
	}, {
		id: 'update',
		label: '修改',
		messageHandler ({ pre, cur, orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ReceivableBill')};修改信息为:` + this.createUpdateMessageByLibrary(library.main)(pre, cur)
		}
	}, {
		id: 'addDetails',
		label: '新增明细',
		messageHandler ({ orderData, inStoreOrders }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ReceivableBill')},新增明细来源:${this.createCodeSpan(inStoreOrders, 'CWInStoreBill')}`
		}
	}, {
		id: 'clearDetails',
		label: '清空明细',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ReceivableBill')}`
		}
	}, {
		id: 'updateDetails',
		label: '修改明细',
		messageHandler ({ pre, cur, orderData, itemName }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ReceivableBill')},品项名称:${itemName};修改信息为:` + this.createUpdateMessageByLibrary(library.details)(pre, cur)
		}
	}, {
		id: 'exportData',
		label: '导出明细数据',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ReceivableBill')}`
		}
	}]
}
