export default {
	'goods-manage': {
		id: 'goods-manage',
		label: '商品管理',
		code: '0001_0006',
		child: {
			'add-goods': {
				id: 'add-goods',
				label: '新建商品信息',
				code: '0001_0006_001_001',
				decision: ['edit-goods']
			},
			'edit-goods': {
				id: 'edit-goods',
				label: '编辑商品信息',
				code: '0001_0006_002_001',
				controlled: 'add-goods'
			},
			'delete-goods': {
				id: 'delete-goods',
				label: '删除商品信息',
				code: '0001_0006_004_001'
			},
			'enable-goods': {
				id: 'enable-goods',
				label: '启用商品',
				code: '0001_0006_006_001'
			},
			'disable-goods': {
				id: 'disable-goods',
				label: '停用商品',
				code: '0001_0006_027_001'
			},
			'push-goods': {
				id: 'push-goods',
				label: '推送商品',
				code: '0001_0006_028_001'
			},
			'import-goods': {
				id: 'import-goods',
				label: '导入商品',
				code: '0001_0006_030_004'
			},
			'unbind-goods': {
				id: 'unbind-goods',
				label: '解绑商品',
				code: '0001_0006_029_001'
			}
		}
	}
}
