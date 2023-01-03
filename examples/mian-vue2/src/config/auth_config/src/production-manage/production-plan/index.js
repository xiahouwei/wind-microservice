export default {
	'production-plan': {
		id: 'production-plan',
		label: '生产计划',
		code: '0010_0001',
		child: {
			'add-productionPlan': {
				id: 'add-productionPlan',
				label: '新建生产计划',
				code: '0010_0001_001_001',
				decision: ['edit-productionPlan']
			},
			'edit-productionPlan': {
				id: 'edit-productionPlan',
				label: '编辑生产计划',
				code: '0010_0001_002_001',
				controlled: 'add-productionPlan'
			},
			'delete-productionPlan': {
				id: 'delete-productionPlan',
				label: '删除生产计划',
				code: '0010_0001_004_001'
			},
			'recover-productionPlan': {
				id: 'recover-productionPlan',
				label: '恢复回收站数据',
				code: '0010_0001_005_001'
			},
			'submit-productionPlan': {
				id: 'submit-productionPlan',
				label: '提交生产计划',
				code: '0010_0001_009_001'
			},
			'back-productionPlan': {
				id: 'back-productionPlan',
				label: '退回生产计划',
				code: '0010_0001_010_001'
			},
			'check-productionPlan': {
				id: 'check-productionPlan',
				label: '审核生产计划',
				code: '0010_0001_011_001'
			},
			'uncheck-productionPlan': {
				id: 'uncheck-productionPlan',
				label: '反审生产计划',
				code: '0010_0001_012_001'
			},
			'recheck-productionPlan': {
				id: 'recheck-productionPlan',
				label: '复审生产计划',
				code: '0010_0001_013_001'
			},
			'unrecheck-productionPlan': {
				id: 'unrecheck-productionPlan',
				label: '取消复审生产计划',
				code: '0010_0001_014_001'
			},
			'print-productionPlan': {
				id: 'print-productionPlan',
				label: '打印生产计划',
				code: '0010_0001_015_001'
			},
			'copy-productionPlan': {
				id: 'copy-productionPlan',
				label: '复制生产计划',
				code: '0010_0001_016_001'
			},
			'import-productionPlan': {
				id: 'import-productionPlan',
				label: '按模板导入生产计划',
				code: '0010_0001_030_001'
			},
			'export-blank': {
				id: 'export-productionPlan',
				label: '导出空白生产计划',
				code: '0010_0001_040_002'
			},
			'export-productionPlan': {
				id: 'export-productionPlan',
				label: '导出生产计划明细数据',
				code: '0010_0001_040_003'
			},
			'create-pickingBill': {
				id: 'create-pickingBill',
				label: '生成领料单',
				code: '0010_0001_091_001'
			},
			'create-procedureTaskBill': {
				id: 'create-procedureTaskBill',
				label: '生成工序任务单',
				code: '0010_0001_092_001'
			},
			'create-machiningBill': {
				id: 'create-machiningBill',
				label: '生成加工单',
				code: '0010_0001_093_001'
			}
		}
	}
}
