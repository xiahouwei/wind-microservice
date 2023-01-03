export default {
	'quick-out-plan': {
		id: 'quick-out-plan',
		label: '快速出库方案管理',
		code: '0001_0013',
		child: {
			'add-quick-out': {
				id: 'add-quick-out',
				label: '新建快速出库方案',
				code: '0001_0013_001_001',
				decision: ['edit-quick-out']
			},
			'edit-quick-out': {
				id: 'edit-quick-out',
				label: '编辑快速出库方案',
				code: '0001_0013_002_001',
				controlled: 'add-quick-out'
			},
			'delete-quick-out': {
				id: 'delete-quick-out',
				label: '删除快速出库方案',
				code: '0001_0013_004_001'
			},
			'recover-quick-out': {
				id: 'recover-quick-out',
				label: '恢复快速出库方案',
				code: '0001_0013_005_001'
			},
			'enable-quick-out': {
				id: 'enable-quick-out',
				label: '启用快速出库方案',
				code: '0001_0013_006_001'
			},
			'disable-quick-out': {
				id: 'disable-quick-out',
				label: '停用快速出库方案',
				code: '0001_0013_008_001'
			},
			'check-quick-out': {
				id: 'check-quick-out',
				label: '审核快速出库方案',
				code: '0001_0013_011_001'
			},
			'uncheck-quick-out': {
				id: 'uncheck-quick-out',
				label: '反审快速出库方案',
				code: '0001_0013_012_001'
			},
			'import-quick-out': {
				id: 'import-quick-out',
				label: '按模板导入快速出库方案',
				code: '0001_0013_030_001'
			},
			'export-blank': {
				id: 'export-blank',
				label: '导出空白快速出库方案',
				code: '0001_0013_040_002'
			},
			'export-quick-out': {
				id: 'export-quick-out',
				label: '导出快速出库方案明细数据',
				code: '0001_0013_040_003'
			}
		}
	}
}
