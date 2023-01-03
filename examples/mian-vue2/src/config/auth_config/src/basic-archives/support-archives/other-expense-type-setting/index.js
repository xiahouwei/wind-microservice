export default {
	'other-expense-type-setting': {
		id: 'other-expense-type-setting',
		label: '其他费用类型',
		code: '0001_0010_0008',
		child: {
			'add-other-expense-type-setting': {
				id: 'add-other-expense-type-setting',
				label: '新建其他费用类型',
				code: '0001_0010_0008_001_001',
				decision: ['edit-other-expense-type-setting']
			},
			'edit-other-expense-type-setting': {
				id: 'edit-other-expense-type-setting',
				label: '编辑其他费用类型',
				code: '0001_0010_0008_002_001',
				controlled: 'add-other-expense-type-setting'
			},
			'delete-other-expense-type-setting': {
				id: 'delete-other-expense-type-setting',
				label: '删除其他费用类型',
				code: '0001_0010_0008_004_001'
			},
			'enable-other-expense-type-setting': {
				id: 'enable-other-expense-type-setting',
				label: '启用其他费用类型',
				code: '0001_0010_0008_006_001'
			},
			'disable-other-expense-type-setting': {
				id: 'disable-other-expense-type-setting',
				label: '停用其他费用类型',
				code: '0001_0010_0008_008_001'
			}
		}
	}
}
