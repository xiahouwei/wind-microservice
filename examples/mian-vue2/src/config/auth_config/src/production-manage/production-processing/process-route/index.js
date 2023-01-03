export default {
	'process-route': {
		id: 'process-route',
		label: '工艺路线',
		code: '0010_0004_0004',
		// connectDetails: ['stock-sale-manage_sale-order.assign-in-sale'],
		child: {
			'add-processRoute': {
				id: 'add-processRoute',
				label: '新建工艺路线',
				code: '0010_0004_0004_001_001'
			},
			'edit-processRoute': {
				id: 'edit-processRoute',
				label: '编辑工艺路线',
				code: '0010_0004_0004_002_001'
			},
			'delete-processRoute': {
				id: 'delete-processRoute',
				label: '删除工艺路线',
				code: '0010_0004_0004_004_001'
			},
			'enable-processRoute': {
				id: 'enable-processRoute',
				label: '启用工艺路线',
				code: '0010_0004_0004_006_001'
			},
			'disable-processRoute': {
				id: 'disable-processRoute',
				label: '停用工艺路线',
				code: '0010_0004_0004_008_001'
			}
		}
	}
}
