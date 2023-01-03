export default {
	'take-stock-class': {
		id: 'take-stock-class',
		label: '盘点分类',
		code: '0001_0010_0003',
		child: {
			'add-take-stock-class': {
				id: 'add-take-stock-class',
				label: '新建盘点分类',
				code: '0001_0010_0003_001_001',
				decision: ['edit-take-stock-class']
			},
			'edit-take-stock-class': {
				id: 'edit-take-stock-class',
				label: '编辑盘点分类',
				code: '0001_0010_0003_002_001',
				controlled: 'add-take-stock-class'
			},
			'delete-take-stock-class': {
				id: 'delete-take-stock-class',
				label: '删除盘点分类',
				code: '0001_0010_0003_004_001'
			},
			'enable-take-stock-class': {
				id: 'enable-take-stock-class',
				label: '启用盘点分类',
				code: '0001_0010_0003_006_001'
			},
			'disable-take-stock-class': {
				id: 'disable-take-stock-class',
				label: '停用盘点分类',
				code: '0001_0010_0003_008_001'
			}
		}
	}
}
