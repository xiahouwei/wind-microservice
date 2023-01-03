export default {
	'invoice-type': {
		id: 'invoice-type',
		label: '发票类型',
		code: '0001_0010_0004',
		child: {
			'add-invoice': {
				id: 'add-invoice',
				label: '新建发票类型',
				code: '0001_0010_0004_001_001',
				decision: ['edit-invoice']
			},
			'edit-invoice': {
				id: 'edit-invoice',
				label: '编辑发票类型',
				code: '0001_0010_0004_002_001',
				controlled: 'add-invoice'
			},
			'delete-invoice': {
				id: 'delete-invoice',
				label: '删除发票类型',
				code: '0001_0010_0004_004_001'
			},
			'enable-invoice': {
				id: 'enable-invoice',
				label: '启用发票类型',
				code: '0001_0010_0004_006_001'
			},
			'disable-invoice': {
				id: 'disable-invoice',
				label: '停用发票类型',
				code: '0001_0010_0004_008_001'
			}
		}
	}
}
