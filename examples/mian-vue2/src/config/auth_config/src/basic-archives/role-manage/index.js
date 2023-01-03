export default {
	'role-manage': {
		id: 'role-manage',
		label: '权限管理',
		code: '0001_0007',
		child: {
			'add-role': {
				id: 'add-role',
				label: '新建权限角色信息',
				code: '0001_0007_001_001',
				decision: ['edit-role']
			},
			'edit-role': {
				id: 'edit-role',
				label: '编辑权限角色信息',
				code: '0001_0007_002_001',
				controlled: 'add-role'
			},
			'delete-role': {
				id: 'delete-role',
				label: '删除权限角色信息',
				code: '0001_0007_004_001'
			}
		}
	}
}
