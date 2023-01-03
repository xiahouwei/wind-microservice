import library from './library.js'
const orderType = 'Inquiry'
export default {
	id: 'stock-inquiry-order',
	label: '采购询定价单',
	actions: [{
		id: 'add',
		label: '新增',
		messageHandler ({ orderData, type }) {
			return `系统单号:${this.createCodeSpan(orderData, orderType)},单据类型:${type}`
		}
	}, {
		id: 'delete',
		label: '删除',
		messageHandler ({ orderData }) {
			if (Array.isArray(orderData)) {
				return orderData.map(billData => {
					return `系统单号:${this.createCodeSpan(billData, orderType)},该单据上级单据为:${billData.parentBill ? this.createCodeSpan({
						id: billData.parentBill,
						sysBillCode: billData.parentBillCode
					}, billData.parentBillType) : '无'}`
				}).join(';')
			} else {
				return `系统单号:${this.createCodeSpan(orderData, orderType)},该单据上级单据为:${orderData.parentBill ? this.createCodeSpan(orderData.parentBill, orderData.parentBill.billClass) : '无'}`
			}
		}
	}, {
		id: 'recyclingDelete',
		label: '回收站删除',
		messageHandler ({ orderData }) {
			if (Array.isArray(orderData)) {
				return orderData.map(billData => {
					return `系统单号:${this.createCodeSpan(billData, orderType)},该单据上级单据为:${billData.parentBill ? this.createCodeSpan({
						id: billData.parentBill,
						sysBillCode: billData.parentBillCode
					}, billData.parentBillType) : '无'}`
				}).join(';')
			} else {
				return `系统单号:${this.createCodeSpan(orderData, orderType)},该单据上级单据为:${orderData.parentBill ? this.createCodeSpan(orderData.parentBill, orderData.parentBill.billClass) : '无'}`
			}
		}
	}, {
		id: 'recover',
		label: '回收站恢复',
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
		id: 'update',
		label: '修改',
		messageHandler ({ pre, cur, orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, orderType)};修改信息为:` + this.createUpdateMessageByLibrary(library.main)(pre, cur)
		}
	}, {
		id: 'addMulityDetails',
		label: '批量新增明细',
		messageHandler ({ addItemListInfo, orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, orderType)},批量新增明细信息:${addItemListInfo}`
		}
	}, {
		id: 'copyItem',
		label: '复制品项',
		messageHandler ({ addItemListInfo, orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, orderType)},复制品项信息:${addItemListInfo}`
		}
	}, {
		id: 'addDetails',
		label: '新增明细',
		messageHandler ({ orderData, addItemInfo }) {
			return `系统单号:${this.createCodeSpan(orderData, orderType)},新增明细信息:${addItemInfo}`
		}
	}, {
		id: 'deleteDetails',
		label: '删除明细',
		messageHandler ({ orderData, deleteItemInfo }) {
			return `系统单号:${this.createCodeSpan(orderData, orderType)},删除明细信息:${deleteItemInfo};该单据上级单据为:${orderData.parentBill ? this.createCodeSpan(orderData.parentBill, orderData.parentBill.billClass) : '无'}`
		}
	}, {
		id: 'clearDetails',
		label: '清空明细',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, orderType)};该单据上级单据为:${orderData.parentBill ? this.createCodeSpan(orderData.parentBill, orderData.parentBill.billClass) : '无'}`
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
		id: 'exportModel',
		label: '导出空白模板',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, orderType)}`
		}
	}, {
		id: 'exportData',
		label: '导出明细数据',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, orderType)}`
		}
	}, {
		id: 'importModel',
		label: '按模板导入',
		messageHandler ({ orderData, name }) {
			return `系统单号:${this.createCodeSpan(orderData, orderType)},文件名称:${name}`
		}
	}, {
		id: 'copy',
		label: '复制单据',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, orderType)}`
		}
	}, {
		id: 'exportMulity',
		label: '批量导出',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, orderType)}`
		}
	}]
}
