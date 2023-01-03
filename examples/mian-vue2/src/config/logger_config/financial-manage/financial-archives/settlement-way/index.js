import library from './library.js'
export default {
	id: 'settlement-way',
	label: '结算方式',
	actions: [{
		id: 'enable',
		label: '启用',
		messageHandler ({ names }) {
			return `结算方式名称:${names}`
		}
	}, {
		id: 'disable',
		label: '停用',
		messageHandler ({ names }) {
			return `结算方式名称:${names}`
		}
	}, {
		id: 'add',
		label: '新增',
		messageHandler ({ name }) {
			return `结算方式名称:${name}`
		}
	}, {
		id: 'update',
		label: '修改',
		messageHandler ({ pre, cur, name }) {
			return `结算方式名称:${name};修改信息为:` + this.createUpdateMessageByLibrary(library.main)(pre, cur)
		}
	}, {
		id: 'exportData',
		label: '导出数据',
		messageHandler () {
			return '导出结算方式数据'
		}
	}]
}
