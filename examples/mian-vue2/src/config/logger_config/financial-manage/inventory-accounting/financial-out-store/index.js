import library from './library.js'
const orderType = 'CWOutStoreBill'
export default {
	id: 'financial-out-store',
	label: '财务出库单',
	actions: [{
		id: 'delete',
		label: '删除',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, orderType)}`
		}
	}, {
		id: 'submit',
		label: '提交',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, orderType)}`
		}
	}, {
		id: 'return',
		label: '退回',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, orderType)}`
		}
	}, {
		id: 'check',
		label: '审核',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, orderType)}`
		}
	}, {
		id: 'uncheck',
		label: '反审核',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, orderType)}`
		}
	}, {
		id: 'recheck',
		label: '复审',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, orderType)}`
		}
	}, {
		id: 'unrecheck',
		label: '取消复审',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, orderType)}`
		}
	}, {
		id: 'pushDownEstimationPayable',
		label: '下推暂估应付单',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, orderType)}`
		}
	}, {
		id: 'pushDownStandardPayable',
		label: '下推标准应付单',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, orderType)}`
		}
	}, {
		id: 'update',
		label: '修改',
		messageHandler ({ pre, cur, orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, orderType)},修改信息为:` + this.createUpdateMessageByLibrary(library.main)(pre, cur)
		}
	}, {
		id: 'updateDetails',
		label: '修改明细',
		messageHandler ({ pre, cur, orderData, itemName }) {
			return `系统单号:${this.createCodeSpan(orderData, orderType)},品项名称:${itemName};修改信息为:` + this.createUpdateMessageByLibrary(library.details)(pre, cur)
		}
	}, {
		id: 'exportData',
		label: '导出明细数据',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, orderType)}`
		}
	}]
}
