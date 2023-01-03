export default {
	'stock-order': {
		id: 'stock-order',
		label: '采购订单',
		code: '0004_0003',
		child: {
			'add-stock': {
				id: 'add-stock',
				label: '新建采购订单',
				code: '0004_0003_001_001',
				decision: ['edit-stock']
			},
			'edit-stock': {
				id: 'edit-stock',
				label: '编辑采购订单',
				code: '0004_0003_002_001',
				controlled: 'add-stock'
			},
			'delete-stock': {
				id: 'delete-stock',
				label: '删除采购订单',
				code: '0004_0003_004_001'
			},
			'recover-stock': {
				id: 'recover-stock',
				label: '恢复回收站数据',
				code: '0004_0003_005_001'
			},
			'submit-stock': {
				id: 'submit-stock',
				label: '提交采购订单',
				code: '0004_0003_009_001'
			},
			'back-stock': {
				id: 'back-stock',
				label: '退回采购订单',
				code: '0004_0003_010_001'
			},
			'check-stock': {
				id: 'check-stock',
				label: '审核采购订单',
				code: '0004_0003_011_001'
			},
			'uncheck-stock': {
				id: 'uncheck-stock',
				label: '反审采购订单',
				code: '0004_0003_012_001'
			},
			'recheck-stock': {
				id: 'recheck-stock',
				label: '复审采购订单',
				code: '0004_0003_013_001'
			},
			'unrecheck-stock': {
				id: 'unrecheck-stock',
				label: '取消复审采购订单',
				code: '0004_0003_014_001'
			},
			'print-stock': {
				id: 'print-stock',
				label: '打印采购订单',
				code: '0004_0003_015_001'
			},
			'copy-stock': {
				id: 'copy-stock',
				label: '复制采购订单',
				code: '0004_0003_016_001'
			},
			'import-stock': {
				id: 'import-stock',
				label: '按模板导入采购订单',
				code: '0004_0003_030_001'
			},
			'export-blank': {
				id: 'export-blank',
				label: '导出空白采购订单',
				code: '0004_0003_040_002'
			},
			'export-stock': {
				id: 'export-stock',
				label: '导出采购订单明细数据',
				code: '0004_0003_040_003'
			},
			'send-srm': {
				id: 'send-srm',
				label: '发单至SRM',
				code: '0004_0003_110_001'
			}
		}
	}
}
