export default {
	'customer-manage': {
		id: 'customer-manage',
		label: '客户管理',
		code: '0001_0003',
		child: {
			'add-customer-category': {
				id: 'add-customer-category',
				label: '添加客户类别',
				code: '0001_0003_001_002',
				decision: ['edit-customer-category']
			},
			'add-customer-company': {
				id: 'add-customer-company',
				label: '添加客户所属企业',
				code: '0001_0003_001_010',
				decision: ['edit-customer-company']
			},
			'add-customer': {
				id: 'add-customer',
				label: '新建客户主体',
				code: '0001_0003_001_011',
				decision: ['edit-customer']
			},
			'add-store': {
				id: 'add-store',
				label: '新建客户仓库',
				code: '0001_0003_001_012',
				decision: ['edit-customer']
			},
			'add-section': {
				id: 'add-section',
				label: '新建客户部门',
				code: '0001_0003_001_013',
				decision: ['edit-customer']
			},
			'edit-customer': {
				id: 'edit-customer',
				label: '编辑客户信息',
				code: '0001_0003_002_001',
				controlled: 'add-customer|add-store|add-section'
			},
			'edit-customer-category': {
				id: 'edit-customer-category',
				label: '编辑客户类别',
				code: '0001_0003_002_002',
				controlled: 'add-customer-category'
			},
			'edit-customer-company': {
				id: 'edit-customer-company',
				label: '编辑客户所属企业',
				code: '0001_0003_002_003',
				controlled: 'add-customer-company'
			},
			'delete-customer': {
				id: 'delete-customer',
				label: '删除客户信息',
				code: '0001_0003_004_001'
			},
			'delete-customer-category': {
				id: 'delete-customer-category',
				label: '删除客户类别',
				code: '0001_0003_004_002'
			},
			'delete-customer-company': {
				id: 'delete-customer-company',
				label: '删除客户所属企业',
				code: '0001_0003_004_003'
			},
			'recover-customer': {
				id: 'recover-customer',
				label: '恢复回收站数据',
				code: '0001_0003_005_001'
			},
			'enable-customer': {
				id: 'enable-customer',
				label: '启用客户',
				code: '0001_0003_006_001'
			},
			'disable-customer': {
				id: 'disable-customer',
				label: '停用客户',
				code: '0001_0003_008_001'
			},
			'export-customer': {
				id: 'export-customer',
				label: '导出客户档案',
				code: '0001_0003_040_001'
			}
		}
	}
}
