export default {
	'device-management': {
		id: 'device-management',
		label: '设备管理',
		code: '0010_0006_0001',
		// connectDetails: ['stock-sale-manage_sale-order.assign-in-sale'],
		child: {
			'add-device': {
				id: 'add-device',
				label: '新增设备',
				code: '0010_0006_0001_001_001'
			},
			'edit-device': {
				id: 'edit-device',
				label: '编辑设备',
				code: '0010_0006_0001_002_001'
			},
			'delete-device': {
				id: 'delete-device',
				label: '删除设备',
				code: '0010_0006_0001_004_001'
			},
			'repair-device': {
				id: 'enable-device',
				label: '维修',
				code: '0010_0006_0001_205_001'
			},
			'spotCheck-device': {
				id: 'disable-device',
				label: '点检',
				code: '0010_0006_0001_206_001'
			}
		}
	}
}
