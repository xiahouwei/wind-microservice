export default {
	'storage-manage': {
		id: 'storage-manage',
		label: '机构管理',
		code: '0001_0012',
		child: {
			'add-space': {
				id: 'add-space',
				label: '新建货位',
				code: '0001_0012_001_001',
				decision: ['edit-space']
			},
			'add-rack': {
				id: 'add-rack',
				label: '新建货架',
				code: '0001_0012_001_002',
				decision: ['edit-rack']
			},
			'edit-space': {
				id: 'edit-space',
				label: '编辑货位',
				code: '0001_0012_002_001',
				controlled: 'add-space'
			},
			'edit-rack': {
				id: 'edit-rack',
				label: '编辑货架',
				code: '0001_0012_002_002',
				controlled: 'add-rack'
			},
			'delete-space': {
				id: 'delete-space',
				label: '删除货位',
				code: '0001_0012_004_001'
			},
			'delete-rack': {
				id: 'delete-rack',
				label: '删除货架',
				code: '0001_0012_004_002'
			},
			'enable-space': {
				id: 'enable-space',
				label: '启用货位',
				code: '0001_0012_006_001'
			},
			'disable-space': {
				id: 'disable-space',
				label: '停用货位',
				code: '0001_0012_008_001'
			},
			'import-space': {
				id: 'import-space',
				label: '导入货位档案',
				code: '0001_0012_030_002'
			},
			'export-space': {
				id: 'export-space',
				label: '导出货位档案',
				code: '0001_0012_040_001'
			}
		}
	}
}
