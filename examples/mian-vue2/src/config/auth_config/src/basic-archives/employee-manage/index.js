export default {
	'employee-manage': {
		id: 'employee-manage',
		label: '员工管理',
		code: '0001_0004',
		child: {
			'add-employee': {
				id: 'add-employee',
				label: '新建员工信息',
				code: '0001_0004_001_001',
				decision: ['edit-employee']
			},
			'edit-employee': {
				id: 'edit-employee',
				label: '编辑员工信息',
				code: '0001_0004_002_001',
				controlled: 'add-employee'
			},
			'delete-employee': {
				id: 'delete-employee',
				label: '删除员工信息',
				code: '0001_0004_004_001'
			},
			'enable-employee': {
				id: 'enable-employee',
				label: '启用员工',
				code: '0001_0004_006_001'
			},
			'disable-employee': {
				id: 'disable-employee',
				label: '停用员工',
				code: '0001_0004_008_001'
			},
			'export-employee': {
				id: 'export-employee',
				label: '导出员工档案',
				code: '0001_0004_040_001'
			}
		}
	}
}
