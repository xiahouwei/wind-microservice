export default {
	procedure: {
		id: 'procedure',
		label: '工序信息',
		code: '0010_0004_0003',
		// connectDetails: ['stock-sale-manage_stock-plan-order.assign-stock-plan'],
		child: {
			'add-procedure': {
				id: 'add-procedure',
				label: '新建工序信息',
				code: '0010_0004_0003_001_001'
			},
			'edit-procedure': {
				id: 'edit-procedure',
				label: '编辑工序信息',
				code: '0010_0004_0003_002_001'
			},
			'delete-procedure': {
				id: 'delete-procedure',
				label: '删除工序信息',
				code: '0010_0004_0003_004_001'
			},
			'enable-procedure': {
				id: 'enable-procedure',
				label: '启用工序信息	',
				code: '0010_0004_0003_006_001'
			},
			'disable-procedure': {
				id: 'enable-procedure',
				label: '停用工序信息	',
				code: '0010_0004_0003_008_001'
			},
			'add-procedure-type': {
				id: 'add-procedure-type',
				label: '新建工序分类',
				code: '0010_0004_0003_001_002'
			},
			'edit-procedure-type': {
				id: 'edit-procedure-type',
				label: '编辑工序分类',
				code: '0010_0004_0003_002_002'
			},
			'delete-procedure-type': {
				id: 'delete-procedure-type',
				label: '删除工序分类',
				code: '0010_0004_0003_004_002'
			}
		}
	}
}
