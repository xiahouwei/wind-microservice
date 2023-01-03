import library from './library.js'
export default {
	id: 'picking-list',
	label: '领料单',
	actions: [{
		id: 'add',
		label: '新增',
		messageHandler ({ orderData, type }) {
			return `系统单号:${this.createCodeSpan(orderData, 'Pick')},单据类型:${type}`
		}
	}, {
		id: 'delete',
		label: '删除',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'Pick')}`
		}
	}, {
		id: 'recyclingDelete',
		label: '回收站删除',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'Pick')}`
		}
	}, {
		id: 'recover',
		label: '回收站恢复',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'Pick')}`
		}
	}, {
		id: 'submit',
		label: '提交',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'Pick')}`
		}
	}, {
		id: 'return',
		label: '退回',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'Pick')}`
		}
	}, {
		id: 'check',
		label: '审核',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'Pick')}`
		}
	}, {
		id: 'uncheck',
		label: '反审核',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'Pick')}`
		}
	}, {
		id: 'recheck',
		label: '复审',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'Pick')}`
		}
	}, {
		id: 'unrecheck',
		label: '取消复审',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'Pick')}`
		}
	}, {
		id: 'update',
		label: '修改',
		messageHandler ({ pre, cur, orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'Pick')};修改信息为:` + this.createUpdateMessageByLibrary(library.main)(pre, cur)
		}
	}, {
		id: 'addMulityDetails',
		label: '批量新增明细',
		messageHandler ({ addItemListInfo, orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'Pick')},批量新增明细信息:${addItemListInfo}`
		}
	}, {
		id: 'addDetails',
		label: '新增明细',
		messageHandler ({ orderData, addItemInfo }) {
			return `系统单号:${this.createCodeSpan(orderData, 'Pick')},新增明细信息:${addItemInfo}`
		}
	}, {
		id: 'deleteDetails',
		label: '删除明细',
		messageHandler ({ orderData, deleteItemInfo }) {
			return `系统单号:${this.createCodeSpan(orderData, 'Pick')},删除明细信息:${deleteItemInfo}`
		}
	}, {
		id: 'clearDetails',
		label: '清空明细',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'Pick')}`
		}
	}, {
		id: 'updateDetails',
		label: '修改明细',
		messageHandler ({ pre, cur, orderData, itemName }) {
			return `系统单号:${this.createCodeSpan(orderData, 'Pick')},品项名称:${itemName};修改信息为:` + this.createUpdateMessageByLibrary(library.details)(pre, cur)
		}
	}, {
		id: 'settingMulityDetails',
		label: '批量设置明细',
		messageHandler ({ settingInfo, orderData, itemNames }) {
			return `系统单号:${this.createCodeSpan(orderData, 'Pick')},品项名称:${itemNames.join(',')},批量设置明细信息:${settingInfo}`
		}
	}, {
		id: 'syncPrice',
		label: '同步最新价格',
		messageHandler ({ orderData, itemNames }) {
			return `系统单号:${this.createCodeSpan(orderData, 'Pick')},品项名称:${itemNames}`
		}
	}, {
		id: 'copy',
		label: '复制单据',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'Pick')}`
		}
	}, {
		id: 'exportModel',
		label: '导出空白模板',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'Pick')}`
		}
	}, {
		id: 'exportData',
		label: '导出明细数据',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'Pick')}`
		}
	}, {
		id: 'importModel',
		label: '按模板导入',
		messageHandler ({ orderData, name }) {
			return `系统单号:${this.createCodeSpan(orderData, 'Pick')},文件名称:${name}`
		}
	}, {
		id: 'returnGoods',
		label: '退货',
		messageHandler ({ orderData, info }) {
			return `系统单号:${this.createCodeSpan(orderData, 'Pick')},退货明细信息:${info}`
		}
	}, {
		id: 'returnGoodsMulity',
		label: '批量退货',
		messageHandler ({ orderData }) {
			return orderData.map(item => {
				return `系统单号:${this.createCodeSpan(item, 'Pick')},退货明细信息:${item.info}`
			})
		}
	}, {
		id: 'createPutawayTask',
		label: '生成上架任务',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'Pick')}`
		}
	}, {
		id: 'rebackProductionPlan',
		label: '退回生产计划',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'Pick')}`
		}
	}, {
		id: 'repeatPick',
		label: '多次领料',
		messageHandler ({ orderData, repeatPickInfo }) {
			return `系统单号:${this.createCodeSpan(orderData, 'Pick')},领料信息:${repeatPickInfo}`
		}
	}, {
		id: 'pickComplete',
		label: '完成',
		messageHandler ({ orderData }) {
			return `领料单:${this.createCodeSpan(orderData, 'Pick')}已完成`
		}
	}, {
		id: 'pickUnfinished',
		label: '取消完成',
		messageHandler ({ orderData }) {
			return `领料单:${this.createCodeSpan(orderData, 'Pick')}取消完成`
		}
	}]
}
