export default {
	'unit-setting': {
		id: 'unit-setting',
		label: '单位使用设置',
		code: '0001_0011',
		child: {
			'add-unit': {
				id: 'add-unit',
				label: '新建单位',
				code: '0001_0011_001_001',
				decision: ['edit-unit']
			},
			'edit-unit': {
				id: 'edit-unit',
				label: '编辑单位',
				code: '0001_0011_002_001',
				controlled: 'add-unit'
			},
			'delete-unit': {
				id: 'delete-unit',
				label: '删除单位',
				code: '0001_0011_004_001'
			},
			'import-unit': {
				id: 'import-unit',
				label: '导入单位',
				code: '0001_0011_030_002'
			}
		}
	}
}
