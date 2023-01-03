export default {
	'move-order': {
		id: 'move-order',
		label: '调拨单',
		code: '0003_0003',
		child: {
			'add-instore': {
				id: 'add-instore',
				label: '新建调拨单（入库方申请）',
				code: '0003_0003_001_001',
				decision: ['edit-move']
			},
			'add-outstore': {
				id: 'add-outstore',
				label: '新建调拨单（出库方申请）',
				code: '0003_0003_001_014',
				decision: ['edit-move']
			},
			'add-inside': {
				id: 'add-inside',
				label: '新建调拨单（内部领用申请）',
				code: '0003_0003_001_015',
				decision: ['edit-move']
			},
			'edit-move': {
				id: 'edit-move',
				label: '编辑调拨单',
				code: '0003_0003_002_001',
				controlled: 'add-instore|add-outstore|add-inside'
			},
			'delete-move': {
				id: 'delete-move',
				label: '删除调拨单',
				code: '0003_0003_004_001'
			},
			'recover-move': {
				id: 'recover-move',
				label: '恢复回收站数据',
				code: '0003_0003_005_001'
			},
			'submit-move': {
				id: 'submit-move',
				label: '提交调拨单',
				code: '0003_0003_009_001'
			},
			'back-move': {
				id: 'back-move',
				label: '退回调拨单',
				code: '0003_0003_010_001'
			},
			'check-move': {
				id: 'check-move',
				label: '审核调拨单',
				code: '0003_0003_011_001'
			},
			'uncheck-move': {
				id: 'uncheck-move',
				label: '反审调拨单',
				code: '0003_0003_012_001'
			},
			'recheck-move': {
				id: 'recheck-move',
				label: '复审调拨单',
				code: '0003_0003_013_001'
			},
			'unrecheck-move': {
				id: 'unrecheck-move',
				label: '取消复审调拨单',
				code: '0003_0003_014_001'
			},
			'print-move': {
				id: 'print-move',
				label: '打印调拨单',
				code: '0003_0003_015_001'
			},
			'copy-move': {
				id: 'copy-move',
				label: '复制调拨单',
				code: '0003_0003_016_001'
			},
			'agree-move': {
				id: 'agree-move',
				label: '同意',
				code: '0003_0003_019_001'
			},
			'reject-move': {
				id: 'reject-move',
				label: '拒绝',
				code: '0003_0003_020_001'
			},
			'import-move': {
				id: 'import-move',
				label: '按模板导入调拨单',
				code: '0003_0003_030_001'
			},
			'export-blank': {
				id: 'export-blank',
				label: '导出空白调拨单',
				code: '0003_0003_040_002'
			},
			'export-move': {
				id: 'export-move',
				label: '导出调拨单明细数据',
				code: '0003_0003_040_003'
			}
		}
	}
}
