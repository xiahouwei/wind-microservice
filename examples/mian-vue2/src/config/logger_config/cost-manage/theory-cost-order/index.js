import library from './library.js'
const orderType = 'TheoryExpend'
export default {
	id: 'theory-cost-order',
	label: '理论耗用单',
	actions: [{
		id: 'submit',
		label: '提交',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, orderType)}`
		}
	}, {
		id: 'delete',
		label: '删除',
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
		id: 'update',
		label: '修改',
		messageHandler ({ pre, cur, orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, orderType)};修改信息为:` + this.createUpdateMessageByLibrary(library.main)(pre, cur)
		}
	}, {
		id: 'updateDetails',
		label: '修改明细',
		messageHandler ({ pre, cur, orderData, itemName }) {
			return `系统单号:${this.createCodeSpan(orderData, orderType)},品项名称:${itemName};修改信息为:` + this.createUpdateMessageByLibrary(library.details)(pre, cur)
		}
	}, {
		id: 'settingMulityDetails',
		label: '批量设置明细',
		messageHandler ({ settingInfo, orderData, itemNames }) {
			return `系统单号:${this.createCodeSpan(orderData, orderType)},品项名称:${itemNames.join(',')},批量设置明细信息:${settingInfo}`
		}
	}, {
		id: 'exportData',
		label: '导出明细数据',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, orderType)}`
		}
	}]
}
