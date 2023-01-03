export default {
	'food-bom': {
		id: 'food-bom',
		label: '菜品BOM',
		code: '0001_0009_0001',
		child: {
			'add-food-bom-details': {
				id: 'add-food-bom-details',
				label: '菜品BOM中新建详情',
				code: '0001_0009_0001_001_001',
				decision: ['edit-food-bom-details']
			},
			'edit-food-bom-details': {
				id: 'edit-food-bom-details',
				label: '菜品BOM中编辑详情',
				code: '0001_0009_0001_002_001',
				controlled: 'add-food-bom-details'
			},
			'edit-food-bom': {
				id: 'edit-food-bom',
				label: '编辑菜品BOM',
				code: '0001_0009_0001_002_002'
			},
			'replace-mulity-food-bom': {
				id: 'replace-mulity-food-bom',
				label: '菜品批量替换配料',
				code: '0001_0009_0001_002_004'
			},
			'delete-food-bom-details': {
				id: 'delete-food-bom-details',
				label: '菜品BOM中删除详情',
				code: '0001_0009_0001_004_001'
			},
			'import-food-bom-details': {
				id: 'import-food-bom-details',
				label: '导入菜品成本卡',
				code: '0001_0009_0001_030_002'
			},
			'export-food-bom-details': {
				id: 'export-food-bom-details',
				label: '导出菜品成本卡明细数据',
				code: '0001_0009_0001_040_003'
			}
		}
	}
}
