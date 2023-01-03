export default {
	'food-business-order': {
		id: 'food-business-order',
		label: '菜品营业单据',
		code: '0006_0003',
		child: {
			'edit-bill': {
				id: 'edit-bill',
				label: '编辑菜品营业单据',
				code: '0006_0003_002_001'
			},
			'submit-bill': {
				id: 'submit-bill',
				label: '提交菜品营业单据',
				code: '0006_0003_009_001'
			},
			'return-bill': {
				id: 'return-bill',
				label: '退回菜品营业单据',
				code: '0006_0003_010_001'
			},
			'check-bill': {
				id: 'check-bill',
				label: '审核菜品营业单据',
				code: '0006_0003_011_001'
			},
			'uncheck-bill': {
				id: 'uncheck-bill',
				label: '反审菜品营业单据',
				code: '0006_0003_012_001'
			},
			'print-bill': {
				id: 'print-bill',
				label: '打印菜品营业单据',
				code: '0006_0003_015_001'
			},
			'offset-bill': {
				id: 'offset-bill',
				label: '冲减菜品营业单据',
				code: '0006_0003_023_001'
			},
			'export-bill': {
				id: 'export-bill',
				label: '导出菜品营业单据明细数据',
				code: '0006_0003_040_003'
			}

		}
	}
}
