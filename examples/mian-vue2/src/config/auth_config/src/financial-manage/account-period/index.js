export default {
	'account-period': {
		id: 'account-period',
		label: '会计期',
		code: '0007_0002',
		child: {
			'add-account-period': {
				id: 'add-account-period',
				label: '新建会计期',
				code: '0007_0002_001_001',
				decision: ['edit-account-period']
			},
			'edit-account-period': {
				id: 'edit-account-period',
				label: '编辑会计期',
				code: '0007_0002_002_001',
				controlled: 'add-account-period'
			},
			'delete-account-period': {
				id: 'delete-account-period',
				label: '删除会计期',
				code: '0007_0002_004_001'
			},
			'enable-account-period': {
				id: 'enable-account-period',
				label: '启用会计期',
				code: '0007_0002_006_001'
			},
			'unable-account-period': {
				id: 'unable-account-period',
				label: '取消启用会计期',
				code: '0007_0002_007_001'
			}
		}
	}
}
