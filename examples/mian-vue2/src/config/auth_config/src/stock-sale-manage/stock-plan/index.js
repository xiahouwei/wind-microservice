export default {
	'stock-plan': {
		id: 'stock-plan',
		label: '订货方案管理',
		code: '0004_0001',
		child: {
			'add-stock': {
				id: 'add-stock',
				label: '新建订货方案',
				code: '0004_0001_001_001',
				decision: ['edit-stock']
			},
			'edit-stock': {
				id: 'edit-stock',
				label: '编辑订货方案',
				code: '0004_0001_002_001',
				controlled: 'add-stock'
			},
			'delete-stock': {
				id: 'delete-stock',
				label: '删除订货方案',
				code: '0004_0001_004_001'
			},
			'recover-stock': {
				id: 'recover-stock',
				label: '恢复订货方案',
				code: '0004_0001_005_001'
			},
			'enable-stock': {
				id: 'enable-stock',
				label: '启用订货方案',
				code: '0004_0001_006_001'
			},
			'disable-stock': {
				id: 'disable-stock',
				label: '停用订货方案',
				code: '0004_0001_008_001'
			},
			'check-stock': {
				id: 'check-stock',
				label: '审核订货方案',
				code: '0004_0001_011_001'
			},
			'uncheck-stock': {
				id: 'uncheck-stock',
				label: '反审订货方案',
				code: '0004_0001_012_001'
			},
			'import-stock': {
				id: 'import-stock',
				label: '按模板导入订货方案',
				code: '0004_0001_030_001'
			},
			'export-blank': {
				id: 'export-blank',
				label: '导出空白订货方案',
				code: '0004_0001_040_002'
			},
			'export-stock': {
				id: 'export-stock',
				label: '导出订货方案明细数据',
				code: '0004_0001_040_003'
			}
		}
	}
}
