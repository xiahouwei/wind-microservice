export default {
	'machining-order': {
		id: 'machining-order',
		label: '组合加工单',
		code: '0010_0003',
		child: {
			'add-machiningOrder': {
				id: 'add-machiningOrder',
				label: '新建加工单',
				code: '0010_0003_001_001',
				decision: ['edit-machiningOrder']
			},
			'edit-machiningOrder': {
				id: 'edit-machiningOrder',
				label: '编辑加工单',
				code: '0010_0003_002_001',
				controlled: 'add-machiningOrder'
			},
			'delete-machiningOrder': {
				id: 'delete-machiningOrder',
				label: '删除加工单',
				code: '0010_0003_004_001'
			},
			'recover-machiningOrder': {
				id: 'recover-machiningOrder',
				label: '恢复回收站数据',
				code: '0010_0003_005_001'
			},
			'submit-machiningOrder': {
				id: 'submit-machiningOrder',
				label: '提交加工单',
				code: '0010_0003_009_001'
			},
			'back-machiningOrder': {
				id: 'back-machiningOrder',
				label: '退回加工单',
				code: '0010_0003_010_001'
			},
			'check-machiningOrder': {
				id: 'check-machiningOrder',
				label: '审核加工单',
				code: '0010_0003_011_001'
			},
			'uncheck-machiningOrder': {
				id: 'uncheck-machiningOrder',
				label: '反审加工单',
				code: '0010_0003_012_001'
			},
			'goBack-ProductionPlan': {
				id: 'goBack-ProductionPlan',
				label: '退回生产计划',
				code: '0010_0003_094_001'
			},
			'print-machiningOrder': {
				id: 'print-machiningOrder',
				label: '打印加工单',
				code: '0010_0003_015_001'
			},
			'copy-machiningOrder': {
				id: 'copy-machiningOrder',
				label: '复制加工单',
				code: '0010_0003_016_001'
			},
			'import-machiningOrder': {
				id: 'import-machiningOrder',
				label: '按模板导入加工单',
				code: '0010_0003_030_001'
			},
			'export-blank': {
				id: 'export-machiningOrder',
				label: '导出空白加工单',
				code: '0010_0003_040_001'
			},
			'export-machiningOrder': {
				id: 'export-machiningOrder',
				label: '导出加工单明细数据',
				code: '0010_0003_040_001'
			}
		}
	}
}
