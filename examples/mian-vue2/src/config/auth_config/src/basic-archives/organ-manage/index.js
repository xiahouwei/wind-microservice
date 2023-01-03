export default {
	'organ-manage': {
		id: 'organ-manage',
		label: '机构管理',
		code: '0001_0001',
		child: {
			'add-region': {
				id: 'add-region',
				label: '添加区域',
				code: '0001_0001_001_002',
				decision: ['edit-region']
			},
			'add-shop': {
				id: 'add-shop',
				label: '新建门店信息',
				code: '0001_0001_001_003',
				decision: ['edit-organ']
			},
			'add-rdc': {
				id: 'add-rdc',
				label: '新建配送中心信息',
				code: '0001_0001_001_004',
				decision: ['edit-organ']
			},
			'add-store': {
				id: 'add-store',
				label: '新建仓库信息',
				code: '0001_0001_001_005',
				decision: ['edit-organ']
			},
			'add-workshop': {
				id: 'add-workshop',
				label: '新建车间信息',
				code: '0001_0001_001_014',
				decision: ['edit-organ']
			},
			'add-section': {
				id: 'add-section',
				label: '新建部门信息',
				code: '0001_0001_001_006',
				decision: ['edit-organ']
			},
			'edit-organ': {
				id: 'edit-organ',
				label: '编辑机构信息',
				code: '0001_0001_002_001',
				controlled: 'add-shop|add-rdc|add-store|add-section'
			},
			'edit-region': {
				id: 'edit-region',
				label: '编辑区域',
				code: '0001_0001_002_002',
				controlled: 'add-region'
			},
			'delete-organ': {
				id: 'delete-organ',
				label: '删除机构信息',
				code: '0001_0001_004_001'
			},
			'delete-region': {
				id: 'delete-region',
				label: '删除区域',
				code: '0001_0001_004_002'
			},
			'recover-organ': {
				id: 'recover-organ',
				label: '恢复回收站数据',
				code: '0001_0001_005_001'
			},
			'enable-organ': {
				id: 'enable-organ',
				label: '启用机构',
				code: '0001_0001_006_001'
			},
			'disable-organ': {
				id: 'disable-organ',
				label: '停用机构',
				code: '0001_0001_008_001'
			},
			'export-organ': {
				id: 'export-organ',
				label: '导出机构档案',
				code: '0001_0001_040_001'
			}
		}
	}
}
