export default {
	'financial-class': {
		id: 'financial-class',
		label: '财务分类',
		code: '0001_0010_0001',
		child: {
			'add-financial': {
				id: 'add-financial',
				label: '新建财务分类',
				code: '0001_0010_0001_001_001',
				decision: ['edit-financial']
			},
			'edit-financial': {
				id: 'edit-financial',
				label: '编辑财务分类',
				code: '0001_0010_0001_002_001',
				controlled: 'add-financial'
			},
			'delete-financial': {
				id: 'delete-financial',
				label: '删除财务分类',
				code: '0001_0010_0001_004_001'
			},
			'enable-financial': {
				id: 'enable-financial',
				label: '启用财务分类',
				code: '0001_0010_0001_006_001'
			},
			'disable-financial': {
				id: 'disable-financial',
				label: '停用财务分类',
				code: '0001_0010_0001_008_001'
			}
		}
	}
}
