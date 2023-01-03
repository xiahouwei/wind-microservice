export default {
	station: {
		id: 'station',
		label: '工位信息',
		code: '0010_0004_0002',
		// connectDetails: ['stock-sale-manage_sale-order.assign-in-sale'],
		child: {
			'add-station': {
				id: 'add-station',
				label: '新建工位信息',
				code: '0010_0004_0002_001_001'
			},
			'edit-station': {
				id: 'edit-station',
				label: '编辑工位信息',
				code: '0010_0004_0002_002_001'
			},
			'delete-station': {
				id: 'delete-station',
				label: '删除工位信息',
				code: '0010_0004_0002_004_001'
			},
			'enable-station': {
				id: 'enable-station',
				label: '启用工位信息',
				code: '0010_0004_0002_006_001'
			},
			'disable-station': {
				id: 'disable-station',
				label: '停用工位信息',
				code: '0010_0004_0002_008_001'
			},
			'connect-workKind': {
				id: 'connect-workKind',
				label: '关联工种',
				code: '0010_0004_0002_200_001'
			}
		}
	}
}
