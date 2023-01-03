export default {
	'dosing-default-house': {
		id: 'dosing-default-house',
		label: '配料默认仓库设置',
		code: '0010_0004_0005',
		child: {
			'add-dosingDefaultHouse': {
				id: 'add-dosingDefaultHouse',
				label: '新建配料默认仓库',
				code: '0010_0004_0005_001_001',
				decision: ['edit-dosingDefaultHouse']
			},
			'edit-dosingDefaultHouse': {
				id: 'edit-dosingDefaultHouse',
				label: '编辑配料默认仓库',
				code: '0010_0004_0005_002_001',
				controlled: 'add-dosingDefaultHouse'
			},
			'delete-dosingDefaultHouse': {
				id: 'delete-dosingDefaultHouse',
				label: '删除配料默认仓库',
				code: '0010_0004_0005_004_001'
			},
			'connect-dosingDefaultHouse': {
				id: 'connect-dosingDefaultHouse',
				label: '关联配料默认仓库品项',
				code: '0010_0004_0005_098_001'
			}
		}
	}
}
