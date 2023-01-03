export default {
	'sales-area': {
		id: 'sales-area',
		label: '销售区域',
		code: '0001_0010_0006',
		child: {
			'add-sales-area': {
				id: 'add-sales-area',
				label: '新建销售区域',
				code: '0001_0010_0006_001_001',
				decision: ['edit-sales-area']
			},
			'edit-sales-area': {
				id: 'edit-sales-area',
				label: '编辑销售区域',
				code: '0001_0010_0006_002_001',
				controlled: 'add-sales-area'
			},
			'delete-sales-area': {
				id: 'delete-sales-area',
				label: '删除销售区域',
				code: '0001_0010_0006_004_001'
			},
			'enable-sales-area': {
				id: 'enable-sales-area',
				label: '启用销售区域',
				code: '0001_0010_0006_006_001'
			},
			'disable-sales-area': {
				id: 'disable-sales-area',
				label: '停用销售区域',
				code: '0001_0010_0006_008_001'
			}
		}
	}
}
