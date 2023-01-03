export default {
	'item-custom-group': {
		id: 'item-custom-group',
		label: '品项自定义分组',
		code: '0001_0010_0009',
		child: {
			'add-item-custom-group': {
				id: 'add-item-custom-group',
				label: '新建品项自定义分组',
				code: '0001_0010_0009_001_001',
				decision: ['edit-item-custom-group']
			},
			'edit-item-custom-group': {
				id: 'edit-item-custom-group',
				label: '编辑品项自定义分组',
				code: '0001_0010_0009_002_001',
				controlled: 'add-item-custom-group'
			},
			'delete-item-custom-group': {
				id: 'delete-item-custom-group',
				label: '删除品项自定义分组',
				code: '0001_0010_0009_004_001'
			}
		}
	}
}
