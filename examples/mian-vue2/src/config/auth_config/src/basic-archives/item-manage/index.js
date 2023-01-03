export default {
	'item-manage': {
		id: 'item-manage',
		label: '品项管理',
		code: '0001_0005',
		child: {
			'add-item': {
				id: 'add-item',
				label: '新建品项信息',
				code: '0001_0005_001_001',
				decision: ['edit-item']
			},
			'add-itemCategory': {
				id: 'add-itemCategory',
				label: '添加品项类别',
				code: '0001_0005_001_002',
				decision: ['edit-itemCategory']
			},
			'edit-item': {
				id: 'edit-item',
				label: '编辑品项信息',
				code: '0001_0005_002_001',
				controlled: 'add-item'
			},
			'edit-itemCategory': {
				id: 'edit-itemCategory',
				label: '编辑品项类别',
				code: '0001_0005_002_002',
				controlled: 'add-itemCategory'
			},
			'delete-item': {
				id: 'delete-item',
				label: '删除品项信息',
				code: '0001_0005_004_001'
			},
			'delete-itemCategory': {
				id: 'delete-itemCategory',
				label: '删除品项类别',
				code: '0001_0005_004_002'
			},
			'recover-organ': {
				id: 'recover-organ',
				label: '恢复回收站数据',
				code: '0001_0005_005_001'
			},
			'enable-item': {
				id: 'enable-item',
				label: '启用品项',
				code: '0001_0005_006_001'
			},
			'disable-item': {
				id: 'disable-item',
				label: '停用品项',
				code: '0001_0005_008_001'
			},
			'export-item': {
				id: 'export-item',
				label: '导出品项档案',
				code: '0001_0005_040_001'
			}
		}
	}
}
