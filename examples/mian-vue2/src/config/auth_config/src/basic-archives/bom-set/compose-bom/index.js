export default {
	'compose-bom': {
		id: 'compose-bom',
		label: '组合BOM',
		code: '0001_0009_0002',
		child: {
			'add-compose-bom-details': {
				id: 'add-compose-bom-details',
				label: '组合BOM中新建详情',
				code: '0001_0009_0002_001_001',
				decision: ['edit-compose-bom-details']
			},
			'add-compose-bom': {
				id: 'add-compose-bom',
				label: '新建组合BOM',
				code: '0001_0009_0002_001_002',
				decision: ['edit-compose-bom']
			},
			'edit-compose-bom-details': {
				id: 'edit-compose-bom-details',
				label: '组合BOM中编辑详情',
				code: '0001_0009_0002_002_001',
				controlled: 'add-compose-bom-details'
			},
			'edit-compose-bom': {
				id: 'edit-compose-bom',
				label: '编辑组合BOM',
				code: '0001_0009_0002_002_002',
				controlled: 'add-compose-bom'
			},
			'replace-mulity-compose-bom': {
				id: 'replace-mulity-compose-bom',
				label: '组合批量替换配料',
				code: '0001_0009_0002_002_004'
			},
			'delete-compose-bom-details': {
				id: 'delete-compose-bom-details',
				label: '组合BOM中删除详情',
				code: '0001_0009_0002_004_001'
			},
			'delete-compose-bom': {
				id: 'delete-compose-bom',
				label: '删除组合BOM',
				code: '0001_0009_0002_004_002'
			},
			'import-compose-bom-details': {
				id: 'import-compose-bom-details',
				label: '导入组合成本卡',
				code: '0001_0009_0002_030_002'
			},
			'export-compose-bom-details': {
				id: 'export-compose-bom-details',
				label: '导出组合成本卡明细数据',
				code: '0001_0009_0002_040_003'
			}
		}
	}
}
