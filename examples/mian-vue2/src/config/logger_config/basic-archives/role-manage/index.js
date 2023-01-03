import library from './library.js'
export default {
	id: 'role-manage',
	label: '权限管理',
	actions: [{
		id: 'add',
		label: '新增',
		messageHandler ({ role, code }) {
			return `角色名称:${role}, 角色编号:${code}`
		}
	}, {
		id: 'delete',
		label: '删除',
		messageHandler ({ role }) {
			return `角色名称:${role}`
		}
	}, {
		id: 'update',
		label: '修改',
		messageHandler ({ pre, cur, name, code }) {
			return `角色名称:${name},角色编号:${code};修改信息为:` + this.createUpdateMessageByLibrary(library.main)(pre, cur)
		}
	}, {
		id: 'connectEmployee',
		label: '关联员工',
		messageHandler ({ pre, cur, name, code }) {
			return `角色名称:${name},角色编号:${code};` + this.createUpdateMessageByLibrary(library.connectEmployee)({ connectEmployee: pre }, { connectEmployee: cur })
		}
	}, {
		id: 'connectAuth',
		label: '关联权限',
		messageHandler ({ pre, cur, name, code }) {
			return `角色名称:${name},角色编号:${code};\n` + this.createUpdateMessageByLibrary(library.connectAuth)({ connectAuth: pre }, { connectAuth: cur })
		}
	}]
}
