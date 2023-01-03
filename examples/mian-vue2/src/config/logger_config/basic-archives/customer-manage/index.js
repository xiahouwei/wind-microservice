import library from './library.js'
export default {
	id: 'customer-manage',
	label: '客户管理',
	actions: [{
		id: 'add',
		label: '新增',
		messageHandler ({ customer, type }) {
			return `客户名称:${customer}, 机构类型:${type}`
		}
	}, {
		id: 'delete',
		label: '删除',
		messageHandler ({ customer }) {
			return `客户名称:${customer}`
		}
	}, {
		id: 'recover',
		label: '恢复',
		messageHandler ({ customer }) {
			return `客户名称:${customer}`
		}
	}, {
		id: 'recyclingDelete',
		label: '回收站删除',
		messageHandler ({ customer }) {
			return `客户名称:${customer}`
		}
	}, {
		id: 'enable',
		label: '启用',
		messageHandler ({ customer }) {
			return `客户名称:${customer}`
		}
	}, {
		id: 'disable',
		label: '停用',
		messageHandler ({ customer }) {
			return `客户名称:${customer}`
		}
	}, {
		id: 'update',
		label: '修改',
		messageHandler ({ pre, cur, name, type }) {
			return `客户名称:${name},机构类型:${type};修改信息为:` + this.createUpdateMessageByLibrary(library.main)(pre, cur)
		}
	}, {
		id: 'connectItem',
		label: '关联品项',
		messageHandler ({ pre, cur, name, type }) {
			return `客户名称:${name},机构类型:${type};` + this.createUpdateMessageByLibrary(library.connect)({ connectItem: pre }, { connectItem: cur })
		}
	}, {
		id: 'copyWithStore',
		label: '与其他机构一致',
		messageHandler ({ copyName, name, type }) {
			return `客户名称:${name},机构类型:${type};与"机构名称:${copyName}"一致`
		}
	}, {
		id: 'copyConnect',
		label: '复制关系',
		messageHandler ({ selectRows, name, type }) {
			const _name = selectRows.map(item => item.name).join(',')
			return `客户名称:${name},机构类型:${type};复制机构名称:"${_name}"`
		}
	}, {
		id: 'customerTypeAdd',
		label: '新增类别',
		messageHandler ({ name }) {
			return `类别名称:${name}`
		}
	}, {
		id: 'customerTypeDelete',
		label: '删除类别',
		messageHandler ({ name }) {
			return `类别名称:${name}`
		}
	}, {
		id: 'customerTypeUpdate',
		label: '修改类别',
		messageHandler ({ name }) {
			return `类别名称:${name}`
		}
	}, {
		id: 'customerGroupAdd',
		label: '新增所属企业',
		messageHandler ({ name }) {
			return `所属企业名称:${name}`
		}
	}, {
		id: 'customerGroupDelete',
		label: '删除所属企业',
		messageHandler ({ name }) {
			return `所属企业名称:${name}`
		}
	}, {
		id: 'customerGroupUpdate',
		label: '修改所属企业',
		messageHandler ({ name }) {
			return `所属企业名称:${name}`
		}
	}, {
		id: 'exportData',
		label: '导出档案',
		messageHandler () {
			return '导出客户档案'
		}
	}, {
		id: 'settingMulity',
		label: '批量设置',
		messageHandler ({ settingInfo }) {
			return `批量设置信息:${settingInfo}`
		}
	}]
}
