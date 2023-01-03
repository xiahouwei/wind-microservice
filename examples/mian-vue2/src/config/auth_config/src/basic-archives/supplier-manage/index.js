export default {
	'supplier-manage': {
		id: 'supplier-manage',
		label: '供货商管理',
		code: '0001_0002',
		child: {
			'add-supplierCategory': {
				id: 'add-supplierCategory',
				label: '添加供货商类别',
				code: '0001_0002_001_002',
				decision: ['edit-supplierCategory']
			},
			'add-supplier': {
				id: 'add-supplier',
				label: '新建供货商主体',
				code: '0001_0002_001_007',
				decision: ['edit-supplier']
			},
			'add-store': {
				id: 'add-store',
				label: '新建供货商仓库',
				code: '0001_0002_001_008',
				decision: ['edit-supplier']
			},
			'add-section': {
				id: 'add-section',
				label: '新建供货商部门',
				code: '0001_0002_001_009',
				decision: ['edit-supplier']
			},
			'edit-supplier': {
				id: 'edit-supplier',
				label: '编辑供货商信息',
				code: '0001_0002_002_001',
				controlled: 'add-supplier|add-store|add-section'
			},
			'edit-supplierCategory': {
				id: 'edit-supplierCategory',
				label: '编辑供货商类别',
				code: '0001_0002_002_002',
				controlled: 'add-supplierCategory'
			},
			'delete-supplier': {
				id: 'delete-supplier',
				label: '删除供货商信息',
				code: '0001_0002_004_001'
			},
			'delete-supplierCategory': {
				id: 'delete-supplierCategory',
				label: '删除供货商类别',
				code: '0001_0002_004_002'
			},
			'recover-organ': {
				id: 'recover-organ',
				label: '恢复回收站数据',
				code: '0001_0002_005_001'
			},
			'enable-supplier': {
				id: 'enable-supplier',
				label: '启用供货商',
				code: '0001_0002_006_001'
			},
			'disable-supplier': {
				id: 'disable-supplier',
				label: '停用供货商',
				code: '0001_0002_008_001'
			},
			'export-supplier': {
				id: 'export-supplier',
				label: '导出供货商档案',
				code: '0001_0002_040_001'
			}
		}
	}
}
