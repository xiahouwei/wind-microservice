import library from './library.js'
export default {
	id: 'stock-plan',
	label: '订货方案',
	actions: [{
		id: 'add',
		label: '新增',
		messageHandler ({ name }) {
			return `方案名称:${name}`
		}
	}, {
		id: 'delete',
		label: '删除',
		messageHandler ({ names }) {
			return `方案名称:${names}`
		}
	}, {
		id: 'enable',
		label: '启用',
		messageHandler ({ names }) {
			return `方案名称:${names}`
		}
	}, {
		id: 'disable',
		label: '停用',
		messageHandler ({ names }) {
			return `方案名称:${names}`
		}
	}, {
		id: 'check',
		label: '审核',
		messageHandler ({ names }) {
			return `方案名称:${names}`
		}
	}, {
		id: 'uncheck',
		label: '反审核',
		messageHandler ({ names }) {
			return `方案名称:${names}`
		}
	}, {
		id: 'update',
		label: '修改',
		messageHandler ({ pre, cur, name }) {
			return `方案名称:${name};修改信息为:` + this.createUpdateMessageByLibrary(library.main)(pre, cur)
		}
	}, {
		id: 'recover',
		label: '恢复',
		messageHandler ({ names }) {
			return `方案名称:${names}`
		}
	}, {
		id: 'recyclingDelete',
		label: '回收站删除',
		messageHandler ({ names }) {
			return `方案名称:${names}`
		}
	},
	{
		id: 'addMulityDetails',
		label: '批量新增明细',
		messageHandler ({ addItemListInfo, name }) {
			return `方案名称:${name},批量新增明细信息:${addItemListInfo}`
		}
	}, {
		id: 'addDetails',
		label: '新增明细',
		messageHandler ({ name, addItemInfo }) {
			return `方案名称:${name},新增明细信息:${addItemInfo}`
		}
	}, {
		id: 'deleteDetails',
		label: '删除明细',
		messageHandler ({ name, deleteItemInfo }) {
			return `方案名称:${name},删除明细信息:${deleteItemInfo}`
		}
	}, {
		id: 'updateDetails',
		label: '修改明细',
		messageHandler ({ pre, cur, name, itemName }) {
			return `方案名称:${name},品项名称:${itemName};修改信息为:` + this.createUpdateMessageByLibrary(library.details)(pre, cur)
		}
	}, {
		id: 'settingMulityDetails',
		label: '批量设置明细',
		messageHandler ({ settingInfo, name, itemNames }) {
			return `方案名称:${name},品项名称:${itemNames.join(',')},批量设置明细信息:${settingInfo}`
		}
	}, {
		id: 'mistakeDeleteDetails',
		label: '异常警告删除明细',
		messageHandler ({ name, deleteItemInfo }) {
			return `方案名称:${name},异常警告删除明细信息:${deleteItemInfo}`
		}
	}, {
		id: 'exportModel',
		label: '导出空白模板',
		messageHandler ({ name }) {
			return `方案名称:${name}`
		}
	}, {
		id: 'exportData',
		label: '导出明细数据',
		messageHandler ({ name }) {
			return `方案名称:${name}`
		}
	}, {
		id: 'importModel',
		label: '按模板导入',
		messageHandler ({ name, fileName }) {
			return `方案名称:${name},文件名称:${fileName}`
		}
	}]
}
