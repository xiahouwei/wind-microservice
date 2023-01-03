export default {
	'sale-order': {
		id: 'sale-order',
		label: '销售订单',
		code: '0004_0004',
		child: {
			'add-sale': {
				id: 'add-sale',
				label: '新建销售订单',
				code: '0004_0004_001_001',
				decision: ['edit-sale']
			},
			'edit-sale': {
				id: 'edit-sale',
				label: '编辑销售订单',
				code: '0004_0004_002_001',
				controlled: 'add-sale'
			},
			'delete-sale': {
				id: 'delete-sale',
				label: '删除销售订单',
				code: '0004_0004_004_001'
			},
			'recover-sale': {
				id: 'recover-sale',
				label: '恢复回收站数据',
				code: '0004_0004_005_001'
			},
			'submit-sale': {
				id: 'submit-sale',
				label: '提交销售订单',
				code: '0004_0004_009_001'
			},
			'back-sale': {
				id: 'back-sale',
				label: '退回销售订单',
				code: '0004_0004_010_001'
			},
			'check-sale': {
				id: 'check-sale',
				label: '审核销售订单',
				code: '0004_0004_011_001'
			},
			'uncheck-sale': {
				id: 'uncheck-sale',
				label: '反审销售订单',
				code: '0004_0004_012_001'
			},
			'recheck-sale': {
				id: 'recheck-sale',
				label: '复审销售订单',
				code: '0004_0004_013_001'
			},
			'unrecheck-sale': {
				id: 'unrecheck-sale',
				label: '取消复审销售订单',
				code: '0004_0004_014_001'
			},
			'print-sale': {
				id: 'print-sale',
				label: '打印销售订单',
				code: '0004_0004_015_001'
			},
			'copy-sale': {
				id: 'copy-sale',
				label: '复制销售订单',
				code: '0004_0004_016_001'
			},
			'import-sale': {
				id: 'import-sale',
				label: '按模板导入销售订单',
				code: '0004_0004_030_001'
			},
			'export-blank': {
				id: 'export-blank',
				label: '导出空白销售订单',
				code: '0004_0004_040_002'
			},
			'export-sale': {
				id: 'export-sale',
				label: '导出销售订单明细数据',
				code: '0004_0004_040_003'
			},
			'assign-in-sale': {
				id: 'assign-in-sale',
				label: '入库分派销售订单',
				code: '0004_0004_050_002',
				connectModule: ['stock-sale-manage_assign-manage_in-store']
			},
			'assign-out-sale': {
				id: 'assign-out-sale',
				label: '出库分派销售订单',
				code: '0004_0004_050_003',
				connectModule: ['stock-sale-manage_assign-manage_out-store']
			}
		}
	}
}
