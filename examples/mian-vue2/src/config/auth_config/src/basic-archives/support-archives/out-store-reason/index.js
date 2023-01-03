export default {
	'out-store-reason': {
		id: 'out-store-reason',
		label: '出库原因',
		code: '0001_0010_0007',
		child: {
			'add-out-store-reason': {
				id: 'add-out-store-reason',
				label: '新建出库原因',
				code: '0001_0010_0007_001_001',
				decision: ['edit-out-store-reason']
			},
			'edit-out-store-reason': {
				id: 'edit-out-store-reason',
				label: '编辑出库原因',
				code: '0001_0010_0007_002_001',
				controlled: 'add-out-store-reason'
			},
			'delete-out-store-reason': {
				id: 'delete-out-store-reason',
				label: '删除出库原因',
				code: '0001_0010_0007_004_001'
			},
			'enable-out-store-reason': {
				id: 'enable-out-store-reason',
				label: '启用出库原因',
				code: '0001_0010_0007_006_001'
			},
			'disable-out-store-reason': {
				id: 'disable-out-store-reason',
				label: '停用出库原因',
				code: '0001_0010_0007_008_001'
			}
		}
	}
}
