export default {
	'stock-plan-order': {
		id: 'stock-plan-order',
		label: '采购计划单',
		code: '0004_0002',
		child: {
			'add-stock-plan': {
				id: 'add-stock-plan',
				label: '新建采购计划单',
				code: '0004_0002_001_001',
				decision: ['edit-stock-plan']
			},
			'edit-stock-plan': {
				id: 'edit-stock-plan',
				label: '编辑采购计划单',
				code: '0004_0002_002_001',
				controlled: 'add-stock-plan'
			},
			'delete-stock-plan': {
				id: 'delete-stock-plan',
				label: '删除采购计划单',
				code: '0004_0002_004_001'
			},
			'recover-stock-plan': {
				id: 'recover-stock-plan',
				label: '恢复回收站数据',
				code: '0004_0002_005_001'
			},
			'submit-stock-plan': {
				id: 'submit-stock-plan',
				label: '提交采购计划单',
				code: '0004_0002_009_001'
			},
			'back-stock-plan': {
				id: 'back-stock-plan',
				label: '退回采购计划单',
				code: '0004_0002_010_001'
			},
			'check-stock-plan': {
				id: 'check-stock-plan',
				label: '审核采购计划单',
				code: '0004_0002_011_001'
			},
			'uncheck-stock-plan': {
				id: 'uncheck-stock-plan',
				label: '反审采购计划单',
				code: '0004_0002_012_001'
			},
			'recheck-stock-plan': {
				id: 'recheck-stock-plan',
				label: '复审采购计划单',
				code: '0004_0002_013_001'
			},
			'unrecheck-stock-plan': {
				id: 'unrecheck-stock-plan',
				label: '取消复审采购计划单',
				code: '0004_0002_014_001'
			},
			'print-stock-plan': {
				id: 'print-stock-plan',
				label: '打印采购计划单',
				code: '0004_0002_015_001'
			},
			'copy-stock-plan': {
				id: 'copy-stock-plan',
				label: '复制采购计划单',
				code: '0004_0002_016_001'
			},
			'mergeBill-stock-plan': {
				id: 'mergeBill-stock-plan',
				label: '合并采购计划单',
				code: '0004_0002_018_001'
			},
			'import-stock-plan': {
				id: 'import-stock-plan',
				label: '按模板导入采购计划单',
				code: '0004_0002_030_001'
			},
			'export-blank': {
				id: 'export-blank',
				label: '导出空白采购计划单',
				code: '0004_0002_040_002'
			},
			'export-stock-plan': {
				id: 'export-stock-plan',
				label: '导出采购计划单明细数据',
				code: '0004_0002_040_003'
			},
			'assign-stock-plan': {
				id: 'assign-stock-plan',
				label: '分派采购计划单',
				code: '0004_0002_050_001',
				connectModule: ['stock-sale-manage_assign-manage_stock-plan']
			},
			'again-push-assign-stock-plan': {
				id: 'again-push-assign-stock-plan',
				label: '再次下推分派采购计划单',
				code: '0004_0002_050_004'
			},
			'urgent-stock': {
				id: 'urgent-stock',
				label: '采购计划单允许加急',
				code: '0004_0002_208_001'
			}
		}
	}
}
