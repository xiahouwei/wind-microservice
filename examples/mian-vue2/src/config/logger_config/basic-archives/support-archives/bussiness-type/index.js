import library from './library.js'
export default {
	id: 'bussiness-type',
	label: '业务类型',
	actions: [{
		id: 'add',
		label: '新增',
		messageHandler ({ name }) {
			return `业务类型名称:${name}`
		}
	}, {
		id: 'delete',
		label: '删除',
		messageHandler ({ name }) {
			return `业务类型名称:${name}`
		}
	}, {
		id: 'enable',
		label: '启用',
		messageHandler ({ name }) {
			return `业务类型名称:${name}`
		}
	}, {
		id: 'disable',
		label: '停用',
		messageHandler ({ name }) {
			return `业务类型名称:${name}`
		}
	}, {
		id: 'update',
		label: '修改',
		messageHandler ({ pre, cur, name }) {
			return `业务类型名称:${name};修改信息为:` + this.createUpdateMessageByLibrary(library.main)(pre, cur)
		}
	}, {
		id: 'addCorrespondingRelation',
		label: '新增对应关系',
		messageHandler ({ cur, name }) {
			return `出库单业务类型名称:${name}，对应入库单业务类型设置为:${cur}`
		}
	}, {
		id: 'editCorrespondingRelation',
		label: '修改对应关系',
		messageHandler ({ pre, cur, name }) {
			return `出库单业务类型名称:${name}，修改信息为：对应入库单业务类型由“${pre}”改为“${cur}”`
		}
	}]
}
