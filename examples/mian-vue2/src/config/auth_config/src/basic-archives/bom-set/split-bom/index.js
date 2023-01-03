export default {
	'split-bom': {
		id: 'split-bom',
		label: '拆分BOM',
		code: '0001_0009_0003',
		child: {
			'add-split-bom-details': {
				id: 'add-split-bom-details',
				label: '拆分BOM中新建详情',
				code: '0001_0009_0003_001_001',
				decision: ['edit-split-bom-details']
			},
			'add-split-bom': {
				id: 'add-split-bom',
				label: '新建拆分BOM',
				code: '0001_0009_0003_001_002',
				decision: ['edit-split-bom']
			},
			'edit-split-bom-details': {
				id: 'edit-split-bom-details',
				label: '拆分BOM中编辑详情',
				code: '0001_0009_0003_002_001',
				controlled: 'add-split-bom-details'
			},
			'edit-split-bom': {
				id: 'edit-split-bom',
				label: '编辑拆分BOM',
				code: '0001_0009_0003_002_002',
				controlled: 'add-split-bom'
			},
			'replace-mulity-split-bom': {
				id: 'replace-mulity-split-bom',
				label: '拆分批量替换配料',
				code: '0001_0009_0003_002_004'
			},
			'delete-split-bom-details': {
				id: 'delete-split-bom-details',
				label: '拆分BOM中删除详情',
				code: '0001_0009_0003_004_001'
			},
			'delete-split-bom': {
				id: 'delete-split-bom',
				label: '删除拆分BOM',
				code: '0001_0009_0003_004_002'
			},
			'import-split-bom-details': {
				id: 'import-split-bom-details',
				label: '导入拆分成本卡',
				code: '0001_0009_0003_030_002'
			},
			'export-split-bom-details': {
				id: 'export-split-bom-details',
				label: '导出拆分成本卡明细数据',
				code: '0001_0009_0003_040_003'
			}
		}
	}
}
