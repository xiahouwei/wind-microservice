export default {
	'take-stock-order': {
		id: 'take-stock-order',
		label: '盘点单',
		code: '0003_0004',
		child: {
			'add-order': {
				id: 'add-order',
				label: '新建盘点单',
				code: '0003_0004_001_001',
				decision: ['edit-order']
			},
			'edit-order': {
				id: 'edit-order',
				label: '编辑盘点单',
				code: '0003_0004_002_001',
				controlled: 'add-order'
			},
			'delete-order': {
				id: 'delete-order',
				label: '删除盘点单',
				code: '0003_0004_004_001'
			},
			'recover-order': {
				id: 'recover-order',
				label: '恢复回收站数据',
				code: '0003_0004_005_001'
			},
			'submit-order': {
				id: 'submit-order',
				label: '提交盘点单',
				code: '0003_0004_009_001'
			},
			'back-order': {
				id: 'back-order',
				label: '退回盘点单',
				code: '0003_0004_010_001'
			},
			'check-order': {
				id: 'check-order',
				label: '审核盘点单',
				code: '0003_0004_011_001'
			},
			'uncheck-order': {
				id: 'uncheck-order',
				label: '反审盘点单',
				code: '0003_0004_012_001'
			},
			'recheck-order': {
				id: 'recheck-order',
				label: '复审盘点单',
				code: '0003_0004_013_001'
			},
			'unrecheck-order': {
				id: 'unrecheck-order',
				label: '取消复审盘点单',
				code: '0003_0004_014_001'
			},
			'print-order': {
				id: 'print-order',
				label: '打印盘点单',
				code: '0003_0004_015_001'
			},
			'merge-order': {
				id: 'merge-order',
				label: '合并盘点单',
				code: '0003_0004_018_001'
			},
			'import-order': {
				id: 'import-order',
				label: '按模板导入盘点单',
				code: '0003_0004_030_001'
			},
			'export-blank': {
				id: 'export-blank',
				label: '导出空白盘点单',
				code: '0003_0004_040_002'
			},
			'export-order': {
				id: 'export-order',
				label: '导出盘点单明细数据',
				code: '0003_0004_040_003'
			}
		}
	}
}
