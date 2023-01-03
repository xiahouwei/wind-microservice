export default {
	'stock-inquiry-order': {
		id: 'stock-inquiry-order',
		label: '采购询定价单',
		code: '0004_0007',
		child: {
			'add-stock-inquiry': {
				id: 'add-stock-inquiry',
				label: '新建采购询定价单',
				code: '0004_0007_001_001',
				decision: ['edit-stock-inquiry']
			},
			'edit-stock-inquiry': {
				id: 'edit-stock-inquiry',
				label: '编辑采购询定价单',
				code: '0004_0007_002_001',
				controlled: 'add-stock-inquiry'
			},
			'delete-stock-inquiry': {
				id: 'delete-stock-inquiry',
				label: '删除采购询定价单',
				code: '0004_0007_004_001'
			},
			'recover-stock-inquiry': {
				id: 'recover-stock-inquiry',
				label: '恢复回收站数据',
				code: '0004_0007_005_001'
			},
			'submit-stock-inquiry': {
				id: 'submit-stock-inquiry',
				label: '提交采购询定价单',
				code: '0004_0007_009_001'
			},
			'back-stock-inquiry': {
				id: 'back-stock-inquiry',
				label: '退回采购询定价单',
				code: '0004_0007_010_001'
			},
			'check-stock-inquiry': {
				id: 'check-stock-inquiry',
				label: '审核采购询定价单',
				code: '0004_0007_011_001'
			},
			'uncheck-stock-inquiry': {
				id: 'uncheck-stock-inquiry',
				label: '反审采购询定价单',
				code: '0004_0007_012_001'
			},
			'recheck-stock-inquiry': {
				id: 'recheck-stock-inquiry',
				label: '复审采购询定价单',
				code: '0004_0007_013_001'
			},
			'unrecheck-stock-inquiry': {
				id: 'unrecheck-stock-inquiry',
				label: '取消复审采购询定价单',
				code: '0004_0007_014_001'
			},
			'copy-item-inquiry': {
				id: 'copy-item-inquiry',
				label: '复制品项',
				code: '0004_0007_241_001'
			}
			// 'print-stock-inquiry': {
			// 	id: 'print-stock-inquiry',
			// 	label: '打印采购询定价单',
			// 	code: '0004_0007_015_001'
			// },
			// 'copy-stock-inquiry': {
			// 	id: 'copy-stock-inquiry',
			// 	label: '复制采购询定价单',
			// 	code: '0004_0007_016_001'
			// },
			// 'mergeBill-stock-inquiry': {
			// 	id: 'mergeBill-stock-inquiry',
			// 	label: '合并采购询定价单',
			// 	code: '0004_0007_018_001'
			// },
			// 'import-stock-inquiry': {
			// 	id: 'import-stock-inquiry',
			// 	label: '按模板导入采购询定价单',
			// 	code: '0004_0007_030_001'
			// },
			// 'export-blank': {
			// 	id: 'export-blank',
			// 	label: '导出空白采购询定价单',
			// 	code: '0004_0007_040_002'
			// },
			// 'export-stock-inquiry': {
			// 	id: 'export-stock-inquiry',
			// 	label: '导出采购询定价单明细数据',
			// 	code: '0004_0007_040_003'
			// }
		}
	}
}
