export default {
	'out-store-order': {
		id: 'out-store-order',
		label: '出库单',
		code: '0003_0002',
		child: {
			'add-outstore': {
				id: 'add-outstore',
				label: '新建出库单',
				code: '0003_0002_001_001',
				decision: ['edit-outstore']
			},
			'edit-outstore': {
				id: 'edit-outstore',
				label: '编辑出库单',
				code: '0003_0002_002_001',
				controlled: 'add-outstore'
			},
			'delete-outstore': {
				id: 'delete-outstore',
				label: '删除出库单',
				code: '0003_0002_004_001'
			},
			'recover-outstore': {
				id: 'recover-outstore',
				label: '恢复回收站数据',
				code: '0003_0002_005_001'
			},
			'submit-outstore': {
				id: 'submit-outstore',
				label: '提交出库单',
				code: '0003_0002_009_001'
			},
			'back-outstore': {
				id: 'back-outstore',
				label: '退回出库单',
				code: '0003_0002_010_001'
			},
			'check-outstore': {
				id: 'check-outstore',
				label: '审核出库单',
				code: '0003_0002_011_001'
			},
			'uncheck-outstore': {
				id: 'uncheck-outstore',
				label: '反审出库单',
				code: '0003_0002_012_001'
			},
			'recheck-outstore': {
				id: 'recheck-outstore',
				label: '复审出库单',
				code: '0003_0002_013_001'
			},
			'unrecheck-outstore': {
				id: 'unrecheck-outstore',
				label: '取消复审出库单',
				code: '0003_0002_014_001'
			},
			'print-outstore': {
				id: 'print-outstore',
				label: '打印出库单',
				code: '0003_0002_015_001'
			},
			'copy-outstore': {
				id: 'copy-outstore',
				label: '复制出库单',
				code: '0003_0002_016_001'
			},
			'import-outstore': {
				id: 'import-outstore',
				label: '按模板导入出库单',
				code: '0003_0002_030_001'
			},
			'export-blank': {
				id: 'export-blank',
				label: '导出空白出库单',
				code: '0003_0002_040_002'
			},
			'export-outstore': {
				id: 'export-outstore',
				label: '导出出库单明细数据',
				code: '0003_0002_040_003'
			}
		}
	}
}
