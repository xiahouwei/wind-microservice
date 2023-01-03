import library from './library.js'
export default {
	id: 'financial-supplier-manage',
	label: '供货商列表',
	actions: [{
		id: 'enable',
		label: '启用',
		messageHandler ({ names }) {
			return `供货商名称:${names}`
		}
	}, {
		id: 'disable',
		label: '停用',
		messageHandler ({ names }) {
			return `供货商名称:${names}`
		}
	}, {
		id: 'update',
		label: '修改',
		messageHandler ({ pre, cur, name }) {
			return `供货商名称:${name};修改信息为:` + this.createUpdateMessageByLibrary(library.main)(pre, cur)
		}
	}, {
		id: 'addDetails',
		label: '新增结算信息',
		messageHandler ({ name, addItemInfo }) {
			return `供货商名称:${name},新增结算信息: ${addItemInfo}`
		}
	}, {
		id: 'deleteDetails',
		label: '删除结算信息',
		messageHandler ({ name, deleteItemInfo }) {
			return `供货商名称:${name},删除结算信息: ${deleteItemInfo}`
		}
	}, {
		id: 'updateDetails',
		label: '修改结算信息',
		messageHandler ({ pre, cur, name, settlementWay }) {
			return `供货商名称:${name};结算方式:${settlementWay},修改信息为: ` + this.createUpdateMessageByLibrary(library.details)(pre, cur)
		}
	}, {
		id: 'exportData',
		label: '导出数据',
		messageHandler () {
			return '导出供货商数据'
		}
	}]
}
