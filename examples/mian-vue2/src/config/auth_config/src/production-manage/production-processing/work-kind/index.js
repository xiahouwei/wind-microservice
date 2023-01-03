export default {
	'work-kind': {
		id: 'work-kind',
		label: '工种信息',
		code: '0010_0004_0001',
		// connectDetails: ['stock-sale-manage_sale-order.assign-in-sale'],
		child: {
			'add-workKind': {
				id: 'add-workKind',
				label: '新建工种信息',
				code: '0010_0004_0001_001_001'
			},
			'edit-workKind': {
				id: 'edit-workKind',
				label: '编辑工种信息',
				code: '0010_0004_0001_002_001'
			},
			'delete-workKind': {
				id: 'delete-workKind',
				label: '删除工种信息',
				code: '0010_0004_0001_004_001'
			},
			'enable-workKind': {
				id: 'enable-workKind',
				label: '启用工种信息',
				code: '0010_0004_0001_006_001'
			},
			'disable-workKind': {
				id: 'disable-workKind',
				label: '停用工种信息',
				code: '0010_0004_0001_008_001'
			},
			'connect-employee': {
				id: 'connect-employee',
				label: '关联员工',
				code: '0010_0004_0001_099_001'
			}
		}
	}
}
