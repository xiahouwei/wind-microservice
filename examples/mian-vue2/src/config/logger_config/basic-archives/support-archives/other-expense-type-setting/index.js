import library from './library.js'
export default {
	id: 'other-expense-type-setting',
	label: '其他费用类型',
	actions: [{
		id: 'add',
		label: '新增',
		messageHandler ({ name, code }) {
			return `其他费用类型名称:${name}, 其他费用类型编号:${code}`
		}
	}, {
		id: 'delete',
		label: '删除',
		messageHandler ({ name }) {
			return `其他费用类型名称:${name}`
		}
	}, {
		id: 'enable',
		label: '启用',
		messageHandler ({ name }) {
			return `其他费用类型名称:${name}`
		}
	}, {
		id: 'disable',
		label: '停用',
		messageHandler ({ name }) {
			return `其他费用类型名称:${name}`
		}
	}, {
		id: 'update',
		label: '修改',
		messageHandler ({ pre, cur, name }) {
			return `其他费用类型名称:${name};修改信息为:` + this.createUpdateMessageByLibrary(library.main)(pre, cur)
		}
	}]
}
