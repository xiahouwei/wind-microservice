import library from './library.js'
export default {
	id: 'financial-organ-manage',
	label: '机构管理',
	actions: [{
		id: 'enable',
		label: '启用',
		messageHandler ({ names }) {
			return `机构名称:${names}`
		}
	}, {
		id: 'disable',
		label: '停用',
		messageHandler ({ names }) {
			return `机构名称:${names}`
		}
	}, {
		id: 'update',
		label: '修改',
		messageHandler ({ pre, cur, name }) {
			return `机构名称:${name};修改信息为:` + this.createUpdateMessageByLibrary(library.main)(pre, cur)
		}
	}, {
		id: 'addDetails',
		label: '新增结算信息',
		messageHandler ({ name, addItemInfo }) {
			return `机构名称:${name},新增结算信息: ${addItemInfo}`
		}
	}, {
		id: 'deleteDetails',
		label: '删除结算信息',
		messageHandler ({ name, deleteItemInfo }) {
			return `机构名称:${name},删除结算信息: ${deleteItemInfo}`
		}
	}, {
		id: 'updateDetails',
		label: '修改结算信息',
		messageHandler ({ pre, cur, name, settlementWay }) {
			return `机构名称:${name};结算方式:${settlementWay},修改信息为: ` + this.createUpdateMessageByLibrary(library.details)(pre, cur)
		}
	}, {
		id: 'exportData',
		label: '导出数据',
		messageHandler () {
			return '导出机构数据'
		}
	}]
}
