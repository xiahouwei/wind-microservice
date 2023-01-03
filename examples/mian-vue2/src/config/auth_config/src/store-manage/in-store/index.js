export default {
	'in-store-order': {
		id: 'in-store-order',
		label: '入库单',
		code: '0003_0001',
		child: {
			'add-instore': {
				id: 'add-instore',
				label: '新建入库单',
				code: '0003_0001_001_001',
				decision: ['edit-instore']
			},
			'edit-instore': {
				id: 'edit-instore',
				label: '编辑入库单',
				code: '0003_0001_002_001',
				controlled: 'add-instore'
			},
			'delete-instore': {
				id: 'delete-instore',
				label: '删除入库单',
				code: '0003_0001_004_001'
			},
			'recover-instore': {
				id: 'recover-instore',
				label: '恢复回收站数据',
				code: '0003_0001_005_001'
			},
			'submit-instore': {
				id: 'submit-instore',
				label: '提交入库单',
				code: '0003_0001_009_001'
			},
			'back-instore': {
				id: 'back-instore',
				label: '退回入库单',
				code: '0003_0001_010_001'
			},
			'check-instore': {
				id: 'check-instore',
				label: '审核入库单',
				code: '0003_0001_011_001'
			},
			'uncheck-instore': {
				id: 'uncheck-instore',
				label: '反审入库单',
				code: '0003_0001_012_001'
			},
			'recheck-instore': {
				id: 'recheck-instore',
				label: '复审入库单',
				code: '0003_0001_013_001'
			},
			'unrecheck-instore': {
				id: 'unrecheck-instore',
				label: '取消复审入库单',
				code: '0003_0001_014_001'
			},
			'print-instore': {
				id: 'print-instore',
				label: '打印入库单',
				code: '0003_0001_015_001'
			},
			'copy-instore': {
				id: 'copy-instore',
				label: '复制入库单',
				code: '0003_0001_016_001'
			},
			'returnGoods-instore': {
				id: 'returnGoods-instore',
				label: '新增红入退货',
				code: '0003_0001_024_001'
			},
			'import-instore': {
				id: 'import-instore',
				label: '按模板导入入库单',
				code: '0003_0001_030_001'
			},
			'export-blank': {
				id: 'export-blank',
				label: '导出空白入库单',
				code: '0003_0001_040_002'
			},
			'export-instore': {
				id: 'export-instore',
				label: '导出入库单明细数据',
				code: '0003_0001_040_003'
			},
			'createPutawayTask-instore': {
				id: 'createPutawayTask-instore',
				label: '生成上架任务',
				code: '0003_0001_100_001'
			},
			'fastOutStore-instore': {
				id: 'fastOutStore-instore',
				label: '快速出库',
				code: '0003_0001_230_001'
			},
			'send-srm': {
				id: 'send-srm',
				label: '发单至SRM',
				code: '0003_0001_110_001'
			}
		}
	}
}
