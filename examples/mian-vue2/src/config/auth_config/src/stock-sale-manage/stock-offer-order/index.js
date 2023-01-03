export default {
	'stock-offer-order': {
		id: 'stock-offer-order',
		label: '采购报价单',
		code: '0004_0008',
		child: {
			'edit-stock-offer': {
				id: 'edit-stock-offer',
				label: '编辑采购报价单',
				code: '0004_0008_002_001',
				controlled: 'add-stock-offer'
			},
			'submit-stock-offer': {
				id: 'submit-stock-offer',
				label: '提交采购报价单',
				code: '0004_0008_009_001'
			},
			'back-stock-offer': {
				id: 'back-stock-offer',
				label: '退回采购报价单',
				code: '0004_0008_010_001'
			},
			'check-stock-offer': {
				id: 'check-stock-offer',
				label: '审核采购报价单',
				code: '0004_0008_011_001'
			},
			'uncheck-stock-offer': {
				id: 'uncheck-stock-offer',
				label: '反审采购报价单',
				code: '0004_0008_012_001'
			},
			'recheck-stock-offer': {
				id: 'recheck-stock-offer',
				label: '复审采购报价单',
				code: '0004_0008_013_001'
			},
			'unrecheck-stock-offer': {
				id: 'unrecheck-stock-offer',
				label: '取消复审采购报价单',
				code: '0004_0008_014_001'
			},
			'import-stock-offer': {
				id: 'import-stock-offer',
				label: '按模板导入采购报价单',
				code: '0004_0008_030_001'
			},
			'export-blank': {
				id: 'export-blank',
				label: '导出空白采购报价单',
				code: '0004_0008_040_002'
			},
			'export-stock-offer': {
				id: 'export-stock-offer',
				label: '导出采购报价单明细数据',
				code: '0004_0008_040_003'
			}
		}
	}
}
