import library from './library.js'
export default {
	id: 'out-store-order',
	label: '出库单',
	actions: [{
		id: 'add',
		label: '新增',
		messageHandler ({ orderData, type }) {
			return `系统单号:${this.createCodeSpan(orderData, 'OutStore')},单据类型:${type}`
		}
	}, {
		id: 'delete',
		label: '删除',
		messageHandler ({ orderData }) {
			if (Array.isArray(orderData)) {
				return orderData.map(billData => {
					return `系统单号:${this.createCodeSpan(billData, 'OutStore')},该单据上级单据为:${billData.parentBill ? this.createCodeSpan({
						id: billData.parentBill,
						sysBillCode: billData.parentBillCode
					}, billData.parentBillType) : '无'}`
				}).join(';')
			} else {
				return `系统单号:${this.createCodeSpan(orderData, 'OutStore')},该单据上级单据为:${orderData.parentBill ? this.createCodeSpan(orderData.parentBill, orderData.parentBill.billClass) : '无'}`
			}
		}
	}, {
		id: 'recyclingDelete',
		label: '回收站删除',
		messageHandler ({ orderData }) {
			if (Array.isArray(orderData)) {
				return orderData.map(billData => {
					return `系统单号:${this.createCodeSpan(billData, 'OutStore')},该单据上级单据为:${billData.parentBill ? this.createCodeSpan({
						id: billData.parentBill,
						sysBillCode: billData.parentBillCode
					}, billData.parentBillType) : '无'}`
				}).join(';')
			} else {
				return `系统单号:${this.createCodeSpan(orderData, 'OutStore')},该单据上级单据为:${orderData.parentBill ? this.createCodeSpan(orderData.parentBill, orderData.parentBill.billClass) : '无'}`
			}
		}
	}, {
		id: 'recover',
		label: '回收站恢复',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'OutStore')}`
		}
	}, {
		id: 'submit',
		label: '提交',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'OutStore')}`
		}
	}, {
		id: 'return',
		label: '退回',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'OutStore')}`
		}
	}, {
		id: 'check',
		label: '审核',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'OutStore')}`
		}
	}, {
		id: 'updateBusinessDate',
		label: '修改业务时间',
		messageHandler ({ orderData, result }) {
			return `系统单号:${this.createCodeSpan(orderData, 'OutStore')},业务时间由${orderData.businessDate}改为当前审核时间${result.businessDate}`
		}
	}, {
		id: 'uncheck',
		label: '反审核',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'OutStore')}`
		}
	}, {
		id: 'recheck',
		label: '复审',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'OutStore')}`
		}
	}, {
		id: 'unrecheck',
		label: '取消复审',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'OutStore')}`
		}
	}, {
		id: 'exportMulity',
		label: '批量导出',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'OutStore')}`
		}
	}, {
		id: 'update',
		label: '修改',
		messageHandler ({ pre, cur, orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'OutStore')};修改信息为:` + this.createUpdateMessageByLibrary(library.main)(pre, cur)
		}
	}, {
		id: 'addMulityDetails',
		label: '批量新增明细',
		messageHandler ({ addItemListInfo, orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'OutStore')},批量新增明细信息:${addItemListInfo}`
		}
	}, {
		id: 'addDetails',
		label: '新增明细',
		messageHandler ({ orderData, addItemInfo }) {
			return `系统单号:${this.createCodeSpan(orderData, 'OutStore')},新增明细信息:${addItemInfo}`
		}
	}, {
		id: 'deleteDetails',
		label: '删除明细',
		messageHandler ({ orderData, deleteItemInfo }) {
			return `系统单号:${this.createCodeSpan(orderData, 'OutStore')},删除明细信息:${deleteItemInfo};该单据上级单据为:${orderData.parentBill ? this.createCodeSpan(orderData.parentBill, orderData.parentBill.billClass) : '无'}`
		}
	}, {
		id: 'clearDetails',
		label: '清空明细',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'OutStore')};该单据上级单据为:${orderData.parentBill ? this.createCodeSpan(orderData.parentBill, orderData.parentBill.billClass) : '无'}`
		}
	}, {
		id: 'updateDetails',
		label: '修改明细',
		messageHandler ({ pre, cur, orderData, itemName }) {
			return `系统单号:${this.createCodeSpan(orderData, 'OutStore')},品项名称:${itemName};修改信息为:` + this.createUpdateMessageByLibrary(library.details)(pre, cur)
		}
	}, {
		id: 'settingMulityDetails',
		label: '批量设置明细',
		messageHandler ({ settingInfo, orderData, itemNames }) {
			return `系统单号:${this.createCodeSpan(orderData, 'OutStore')},品项名称:${itemNames.join(',')},批量设置明细信息:${settingInfo}`
		}
	}, {
		id: 'syncPrice',
		label: '同步最新价格',
		messageHandler ({ orderData, itemNames }) {
			return `系统单号:${this.createCodeSpan(orderData, 'OutStore')},品项名称:${itemNames}`
		}
	}, {
		id: 'copy',
		label: '复制单据',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'OutStore')}`
		}
	}, {
		id: 'exportModel',
		label: '导出空白模板',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'OutStore')}`
		}
	}, {
		id: 'exportData',
		label: '导出明细数据',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'OutStore')}`
		}
	}, {
		id: 'importModel',
		label: '按模板导入',
		messageHandler ({ orderData, name }) {
			return `系统单号:${this.createCodeSpan(orderData, 'OutStore')},文件名称:${name}`
		}
	}]
}
