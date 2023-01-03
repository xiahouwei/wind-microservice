import library from './library.js'
export default {
	id: 'financial-in-store',
	label: '财务入库单',
	actions: [{
		id: 'delete',
		label: '删除',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'CWInStoreBill')}`
		}
	}, {
		id: 'submit',
		label: '提交',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'CWInStoreBill')}`
		}
	}, {
		id: 'return',
		label: '退回',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'CWInStoreBill')}`
		}
	}, {
		id: 'check',
		label: '审核',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'CWInStoreBill')}`
		}
	}, {
		id: 'uncheck',
		label: '反审核',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'CWInStoreBill')}`
		}
	}, {
		id: 'recheck',
		label: '复审',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'CWInStoreBill')}`
		}
	}, {
		id: 'unrecheck',
		label: '取消复审',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'CWInStoreBill')}`
		}
	}, {
		id: 'pushDownEstimationPayable',
		label: '下推暂估应付单',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'CWInStoreBill')}`
		}
	}, {
		id: 'pushDownStandardPayable',
		label: '下推标准应付单',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'CWInStoreBill')}`
		}
	}, {
		id: 'updateDetails',
		label: '修改明细',
		messageHandler ({ pre, cur, orderData, itemName }) {
			return `系统单号:${this.createCodeSpan(orderData, 'CWInStoreBill')},品项名称:${itemName};修改信息为:` + this.createUpdateMessageByLibrary(library.details)(pre, cur)
		}
	}, {
		id: 'exportData',
		label: '导出明细数据',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'CWInStoreBill')}`
		}
	}]
}
