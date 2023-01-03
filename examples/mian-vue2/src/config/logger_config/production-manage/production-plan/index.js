import library from './library.js'
export default {
	id: 'production-plan',
	label: '生产计划',
	actions: [{
		id: 'add',
		label: '新增',
		messageHandler ({ orderData, type }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ProductionPlan')},单据类型:${type}`
		}
	}, {
		id: 'delete',
		label: '删除',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ProductionPlan')}`
		}
	}, {
		id: 'recyclingDelete',
		label: '回收站删除',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ProductionPlan')}`
		}
	}, {
		id: 'recover',
		label: '回收站恢复',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ProductionPlan')}`
		}
	}, {
		id: 'submit',
		label: '提交',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ProductionPlan')}`
		}
	}, {
		id: 'return',
		label: '退回',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ProductionPlan')}`
		}
	}, {
		id: 'check',
		label: '审核',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ProductionPlan')}`
		}
	}, {
		id: 'uncheck',
		label: '反审核',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ProductionPlan')}`
		}
	}, {
		id: 'recheck',
		label: '复审',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ProductionPlan')}`
		}
	}, {
		id: 'unrecheck',
		label: '取消复审',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ProductionPlan')}`
		}
	}, {
		id: 'update',
		label: '修改',
		messageHandler ({ pre, cur, orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ProductionPlan')};修改信息为:` + this.createUpdateMessageByLibrary(library.main)(pre, cur)
		}
	}, {
		id: 'addMulityDetails',
		label: '批量新增明细',
		messageHandler ({ addItemListInfo, orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ProductionPlan')},批量新增明细信息:${addItemListInfo}`
		}
	}, {
		id: 'addDetails',
		label: '新增明细',
		messageHandler ({ orderData, addItemInfo }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ProductionPlan')},新增明细信息:${addItemInfo}`
		}
	}, {
		id: 'deleteDetails',
		label: '删除明细',
		messageHandler ({ orderData, deleteItemInfo }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ProductionPlan')},删除明细信息:${deleteItemInfo}`
		}
	}, {
		id: 'clearDetails',
		label: '清空明细',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ProductionPlan')}`
		}
	}, {
		id: 'updateDetails',
		label: '修改明细',
		messageHandler ({ pre, cur, orderData, itemName }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ProductionPlan')},品项名称:${itemName};修改信息为:` + this.createUpdateMessageByLibrary(library.details)(pre, cur)
		}
	}, {
		id: 'settingMulityDetails',
		label: '批量设置明细',
		messageHandler ({ settingInfo, orderData, itemNames }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ProductionPlan')},品项名称:${itemNames.join(',')},批量设置明细信息:${settingInfo}`
		}
	}, {
		id: 'syncPrice',
		label: '同步最新价格',
		messageHandler ({ orderData, itemNames }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ProductionPlan')},品项名称:${itemNames}`
		}
	}, {
		id: 'copy',
		label: '复制单据',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ProductionPlan')}`
		}
	}, {
		id: 'exportModel',
		label: '导出空白模板',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ProductionPlan')}`
		}
	}, {
		id: 'exportData',
		label: '导出明细数据',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ProductionPlan')}`
		}
	}, {
		id: 'importModel',
		label: '按模板导入',
		messageHandler ({ orderData, name }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ProductionPlan')},文件名称:${name}`
		}
	}, {
		id: 'returnGoods',
		label: '退货',
		messageHandler ({ orderData, info }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ProductionPlan')},退货明细信息:${info}`
		}
	}, {
		id: 'returnGoodsMulity',
		label: '批量退货',
		messageHandler ({ orderData }) {
			return orderData.map(item => {
				return `系统单号:${this.createCodeSpan(item, 'ProductionPlan')},退货明细信息:${item.info}`
			})
		}
	}, {
		id: 'createPickingList',
		label: '生成领料单',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ProductionPlan')}`
		}
	}, {
		id: 'createMachiningOrder',
		label: '生成加工单',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ProductionPlan')}`
		}
	}, {
		id: 'createProcedureTask',
		label: '生成工序任务',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'ProductionPlan')}`
		}
	}]
}
