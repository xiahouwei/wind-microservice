export default {
	'picking-list': {
		id: 'picking-list',
		label: '领料单',
		code: '0010_0002',
		child: {
			'add-pickingList': {
				id: 'add-pickingList',
				label: '新建领料单',
				code: '0010_0002_001_001',
				decision: ['edit-pickingList']
			},
			'edit-pickingList': {
				id: 'edit-pickingList',
				label: '编辑领料单',
				code: '0010_0002_002_001',
				controlled: 'add-pickingList'
			},
			'delete-pickingList': {
				id: 'delete-pickingList',
				label: '删除领料单',
				code: '0010_0002_004_001'
			},
			'recover-pickingList': {
				id: 'recover-pickingList',
				label: '恢复回收站数据',
				code: '0010_0002_005_001'
			},
			'submit-pickingList': {
				id: 'submit-pickingList',
				label: '提交领料单',
				code: '0010_0002_009_001'
			},
			'back-pickingList': {
				id: 'back-pickingList',
				label: '退回领料单',
				code: '0010_0002_010_001'
			},
			'check-pickingList': {
				id: 'check-pickingList',
				label: '审核领料单',
				code: '0010_0002_011_001'
			},
			'uncheck-pickingList': {
				id: 'uncheck-pickingList',
				label: '反审领料单',
				code: '0010_0002_012_001'
			},
			'goBack-ProductionPlan': {
				id: 'goBack-ProductionPlan',
				label: '退回生产计划',
				code: '0010_0002_094_001'
			},
			'print-pickingList': {
				id: 'print-pickingList',
				label: '打印领料单',
				code: '0010_0002_015_001'
			},
			'copy-pickingList': {
				id: 'copy-pickingList',
				label: '复制领料单',
				code: '0010_0002_016_001'
			},
			'import-pickingList': {
				id: 'import-pickingList',
				label: '按模板导入领料单',
				code: '0010_0002_030_001'
			},
			'export-blank': {
				id: 'export-pickingList',
				label: '导出空白领料单',
				code: '0010_0002_040_002'
			},
			'export-pickingList': {
				id: 'export-pickingList',
				label: '导出空白领料单明细数据',
				code: '0010_0002_040_003'
			},
			'willPick-pickingList': {
				id: 'willPick-pickingList',
				label: '领用领料单',
				code: '0010_0002_097_001'
			},
			'finish-pickingList': {
				id: 'finish-pickingList',
				label: '完成领料单',
				code: '0010_0002_096_001'
			},
			'cancel-pickingList': {
				id: 'cancel-pickingList',
				label: '领料单取消完成',
				code: '0010_0002_207_001'
			}
		}
	}
}
