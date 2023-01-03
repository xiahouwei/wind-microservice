export default {
	'purchase-invoice': {
		id: 'purchase-invoice',
		label: '采购发票',
		code: '0007_0001_0001',
		child: {
			'add-purchase-invoice': {
				id: 'add-purchase-invoice',
				label: '新建采购发票',
				code: '0007_0001_0001_001_001',
				decision: ['edit-purchase-invoice']
			},
			'edit-purchase-invoice': {
				id: 'edit-purchase-invoice',
				label: '编辑采购发票',
				code: '0007_0001_0001_002_001',
				controlled: 'add-purchase-invoice'
			},
			'delete-purchase-invoice': {
				id: 'delete-purchase-invoice',
				label: '删除采购发票',
				code: '0007_0001_0001_004_001'
			},
			'recover-purchase-invoice': {
				id: 'recover-purchase-invoice',
				label: '恢复回收站数据',
				code: '0007_0001_0001_005_001'
			},
			'print-purchase-invoice': {
				id: 'print-purchase-invoice',
				label: '打印采购发票',
				code: '0007_0001_0001_015_001'
			},
			'import-purchase-invoice': {
				id: 'import-purchase-invoice',
				label: '批量导入采购发票',
				code: '0007_0001_0001_030_002'
			},
			'export-purchase-invoice': {
				id: 'export-purchase-invoice',
				label: '导出采购发票',
				code: '0007_0001_0001_040_001'
			},
			'articulation-purchase-invoice': {
				id: 'articulation-purchase-invoice',
				label: '勾稽发票明细',
				code: '0007_0001_0001_070_001'
			},
			'AccountingScarletLetter-purchase-invoice': {
				id: 'AccountingScarletLetter-purchase-invoice',
				label: '红冲采购发票',
				code: '0007_0001_0001_071_001'
			}
		}
	}
}
