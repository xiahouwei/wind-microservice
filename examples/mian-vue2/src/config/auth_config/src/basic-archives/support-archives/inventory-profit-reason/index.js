export default {
	'inventory-profit-reason': {
		id: 'inventory-profit-reason',
		label: '盘盈原因',
		code: '0001_0010_0005',
		child: {
			'add-inventory-profit-reason': {
				id: 'add-inventory-profit-reason',
				label: '新建盘盈原因',
				code: '0001_0010_0005_001_001',
				decision: ['edit-inventory-profit-reason']
			},
			'edit-inventory-profit-reason': {
				id: 'edit-inventory-profit-reason',
				label: '编辑盘盈原因',
				code: '0001_0010_0005_002_001',
				controlled: 'add-inventory-profit-reason'
			},
			'delete-inventory-profit-reason': {
				id: 'delete-inventory-profit-reason',
				label: '删除盘盈原因',
				code: '0001_0010_0005_004_001'
			},
			'enable-inventory-profit-reason': {
				id: 'enable-inventory-profit-reason',
				label: '启用盘盈原因',
				code: '0001_0010_0005_006_001'
			},
			'disable-inventory-profit-reason': {
				id: 'disable-inventory-profit-reason',
				label: '停用盘盈原因',
				code: '0001_0010_0005_008_001'
			}
		}
	}
}
