import library from './library.js'
export default {
	id: 'financial-class',
	label: '财务分类',
	actions: [{
		id: 'add',
		label: '新增',
		messageHandler ({ name, code }) {
			return `财务分类名称:${name}, 财务分类编号:${code}`
		}
	}, {
		id: 'delete',
		label: '删除',
		messageHandler ({ name }) {
			return `财务分类名称:${name}`
		}
	}, {
		id: 'enable',
		label: '启用',
		messageHandler ({ name }) {
			return `财务分类名称:${name}`
		}
	}, {
		id: 'disable',
		label: '停用',
		messageHandler ({ name }) {
			return `财务分类名称:${name}`
		}
	}, {
		id: 'update',
		label: '修改',
		messageHandler ({ pre, cur, name }) {
			return `财务分类名称:${name};修改信息为:` + this.createUpdateMessageByLibrary(library.main)(pre, cur)
		}
	}]
}
