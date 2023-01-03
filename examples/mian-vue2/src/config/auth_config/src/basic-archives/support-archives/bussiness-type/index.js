export default {
	'bussiness-type': {
		id: 'bussiness-type',
		label: '业务类型',
		code: '0001_0010_0002',
		child: {
			'add-bussiness': {
				id: 'add-bussiness',
				label: '新建业务类型',
				code: '0001_0010_0002_001_001',
				decision: ['edit-bussiness']
			},
			'edit-bussiness': {
				id: 'edit-bussiness',
				label: '编辑业务类型',
				code: '0001_0010_0002_002_001',
				controlled: 'add-bussiness'
			},
			'delete-bussiness': {
				id: 'delete-bussiness',
				label: '删除业务类型',
				code: '0001_0010_0002_004_001'
			},
			'enable-bussiness': {
				id: 'enable-bussiness',
				label: '启用业务类型',
				code: '0001_0010_0002_006_001'
			},
			'disable-bussiness': {
				id: 'disable-bussiness',
				label: '停用业务类型',
				code: '0001_0010_0002_008_001'
			}
		}
	}
}
