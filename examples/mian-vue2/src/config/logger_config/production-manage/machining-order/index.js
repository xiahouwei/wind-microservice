import library from './library.js'
export default {
	id: 'machining-order',
	label: '组合加工单',
	actions: [{
		id: 'add',
		label: '新增',
		messageHandler ({ orderData, type }) {
			return `系统单号:${this.createCodeSpan(orderData, 'MachineCompose')},单据类型:${type}`
		}
	}, {
		id: 'delete',
		label: '删除',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'MachineCompose')}`
		}
	}, {
		id: 'recyclingDelete',
		label: '回收站删除',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'MachineCompose')}`
		}
	}, {
		id: 'recover',
		label: '回收站恢复',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'MachineCompose')}`
		}
	}, {
		id: 'submit',
		label: '提交',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'MachineCompose')}`
		}
	}, {
		id: 'return',
		label: '退回',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'MachineCompose')}`
		}
	}, {
		id: 'check',
		label: '审核',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'MachineCompose')}`
		}
	}, {
		id: 'uncheck',
		label: '反审核',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'MachineCompose')}`
		}
	}, {
		id: 'backToPlan',
		label: '退回生产计划',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'MachineCompose')}`
		}
	}, {
		id: 'recheck',
		label: '复审',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'MachineCompose')}`
		}
	}, {
		id: 'unrecheck',
		label: '取消复审',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'MachineCompose')}`
		}
	}, {
		id: 'update',
		label: '修改',
		messageHandler ({ pre, cur, orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'MachineCompose')};修改信息为:` + this.createUpdateMessageByLibrary(library.main)(pre, cur)
		}
	}, {
		id: 'addMulityDetails',
		label: '批量新增明细',
		messageHandler ({ addItemListInfo, orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'MachineCompose')},批量新增明细信息:${addItemListInfo}`
		}
	}, {
		id: 'addDetails',
		label: '新增明细',
		messageHandler ({ orderData, addItemInfo }) {
			return `系统单号:${this.createCodeSpan(orderData, 'MachineCompose')},新增明细信息:${addItemInfo}`
		}
	}, {
		id: 'addAdditionDetails',
		label: '新增附成品明细',
		messageHandler ({ orderData, addItemInfo }) {
			return `系统单号:${this.createCodeSpan(orderData, 'MachineCompose')},新增明细信息:${addItemInfo}`
		}
	}, {
		id: 'addSubDetails',
		label: '新增配料明细',
		messageHandler ({ orderData, addItemInfo }) {
			return `系统单号:${this.createCodeSpan(orderData, 'MachineCompose')},新增明细信息:${addItemInfo}`
		}
	},
	{
		id: 'deleteDetails',
		label: '删除明细',
		messageHandler ({ orderData, deleteItemInfo }) {
			return `系统单号:${this.createCodeSpan(orderData, 'MachineCompose')},删除明细信息:${deleteItemInfo}`
		}
	}, {
		id: 'clearDetails',
		label: '清空明细',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'MachineCompose')}`
		}
	}, {
		id: 'updateDetails',
		label: '修改明细',
		messageHandler ({ pre, cur, orderData, itemName }) {
			return `系统单号:${this.createCodeSpan(orderData, 'MachineCompose')},品项名称:${itemName};修改信息为:` + this.createUpdateMessageByLibrary(library.details)(pre, cur)
		}
	}, {
		id: 'updateAdditionDetails',
		label: '修改附成品明细',
		messageHandler ({ pre, cur, orderData, itemName }) {
			return `系统单号:${this.createCodeSpan(orderData, 'MachineCompose')},品项名称:${itemName};修改信息为:` + this.createUpdateMessageByLibrary(library.details)(pre, cur)
		}
	}, {
		id: 'updateSubItemDetails',
		label: '修改配料明细',
		messageHandler ({ pre, cur, orderData, itemName }) {
			return `系统单号:${this.createCodeSpan(orderData, 'MachineCompose')},配料名称:${itemName};修改信息为:` + this.createUpdateMessageByLibrary(library.subDetails)(pre, cur)
		}
	},
	{
		id: 'settingMulityDetails',
		label: '批量设置明细',
		messageHandler ({ settingInfo, orderData, itemNames }) {
			return `系统单号:${this.createCodeSpan(orderData, 'MachineCompose')},品项名称:${itemNames.join(',')},批量设置明细信息:${settingInfo}`
		}
	}, {
		id: 'copy',
		label: '复制单据',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'MachineCompose')}`
		}
	}, {
		id: 'exportModel',
		label: '导出空白模板',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'MachineCompose')}`
		}
	}, {
		id: 'exportData',
		label: '导出明细数据',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'MachineCompose')}`
		}
	}, {
		id: 'exportMulity',
		label: '批量导出',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'MachineCompose')}`
		}
	}, {
		id: 'importModel',
		label: '按模板导入',
		messageHandler ({ orderData, name }) {
			return `系统单号:${this.createCodeSpan(orderData, 'MachineCompose')},文件名称:${name}`
		}
	}, {
		id: 'rebackProductionPlan',
		label: '退回生产计划',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'MachineCompose')}`
		}
	}]
}
