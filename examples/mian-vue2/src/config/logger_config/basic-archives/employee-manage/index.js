import library from './library.js'
export default {
	id: 'employee-manage',
	label: '员工管理',
	actions: [{
		id: 'add',
		label: '新增',
		messageHandler ({ employee, code }) {
			return `员工名称:${employee}, 员工编号:${code}`
		}
	}, {
		id: 'delete',
		label: '删除',
		messageHandler ({ employee }) {
			return `员工名称:${employee}`
		}
	}, {
		id: 'enable',
		label: '启用',
		messageHandler ({ employee }) {
			return `员工名称:${employee}`
		}
	}, {
		id: 'disable',
		label: '停用',
		messageHandler ({ employee }) {
			return `员工名称:${employee}`
		}
	}, {
		id: 'update',
		label: '修改',
		messageHandler ({ pre, cur, name, code }) {
			return `员工名称:${name},员工编号:${code};修改信息为:` + this.createUpdateMessageByLibrary(library.main)(pre, cur)
		}
	}, {
		id: 'manageOrgan',
		label: '员工可管理机构',
		messageHandler ({ pre, cur, name, code }) {
			return `员工名称:${name},员工编号:${code};` + this.createUpdateMessageByLibrary(library.manage)({ manageOrgan: pre }, { manageOrgan: cur })
		}
	}, {
		id: 'copyWithEmployee_organ',
		label: '可管理机构与其他员工一致',
		messageHandler ({ copyName, name, code }) {
			return `员工名称:${name},员工编号:${code};可管理机构与"员工名称:${copyName}"一致`
		}
	}, {
		id: 'copyOrgan',
		label: '可管理机构复制关系',
		messageHandler ({ selectRows, name, code }) {
			const _name = selectRows.map(item => item.name).join(',')
			return `员工名称:${name},员工编号:${code};复制员工名称:"${_name}"`
		}
	}, {
		id: 'manageSupplier',
		label: '员工可管理供货商',
		messageHandler ({ pre, cur, name, code }) {
			return `员工名称:${name},员工编号:${code};` + this.createUpdateMessageByLibrary(library.manage)({ manageSupplier: pre }, { manageSupplier: cur })
		}
	}, {
		id: 'copyWithEmployee_supplier',
		label: '可管理供货商与其他员工一致',
		messageHandler ({ copyName, name, code }) {
			return `员工名称:${name},员工编号:${code};可管理供货商与"员工名称:${copyName}"一致`
		}
	}, {
		id: 'copySupplier',
		label: '可管理供货商复制关系',
		messageHandler ({ selectRows, name, code }) {
			const _name = selectRows.map(item => item.name).join(',')
			return `员工名称:${name},员工编号:${code};复制员工名称:"${_name}"`
		}
	}, {
		id: 'manageCustomer',
		label: '员工可管理客户',
		messageHandler ({ pre, cur, name, code }) {
			return `员工名称:${name},员工编号:${code};` + this.createUpdateMessageByLibrary(library.manage)({ manageCustomer: pre }, { manageCustomer: cur })
		}
	}, {
		id: 'copyWithEmployee_customer',
		label: '可管理客户与其他员工一致',
		messageHandler ({ copyName, name, code }) {
			return `员工名称:${name},员工编号:${code};可管理客户与"员工名称:${copyName}"一致`
		}
	}, {
		id: 'copyCustomer',
		label: '可管理客户复制关系',
		messageHandler ({ selectRows, name, code }) {
			const _name = selectRows.map(item => item.name).join(',')
			return `员工名称:${name},员工编号:${code};复制员工名称:"${_name}"`
		}
	}, {
		id: 'exportData',
		label: '导出档案',
		messageHandler () {
			return '导出员工档案'
		}
	}, {
		id: 'manageStore',
		label: '员工适用店铺',
		messageHandler ({ pre, cur, name, code }) {
			return `员工名称:${name},员工编号:${code};` + this.createUpdateMessageByLibrary(library.manage)({ manageStore: pre }, { manageStore: cur })
		}
	}, {
		id: 'manageSubordinate',
		label: '员工可管理下属',
		messageHandler ({ pre, cur, name, code }) {
			return `员工名称:${name},员工编号:${code};` + this.createUpdateMessageByLibrary(library.manage)({ manageSubordinate: pre }, { manageSubordinate: cur })
		}
	}, {
		id: 'copyEmployee',
		label: '复制员工',
		messageHandler ({ selectRows, name, code }) {
			const _name = selectRows.map(item => item.name).join(',')
			return `员工名称:${name},员工编号:${code};复制员工名称:"${_name}"`
		}
	}]
}
