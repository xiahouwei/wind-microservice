export default {
	'stock-plan': {
		id: 'stock-plan',
		label: '采购计划单',
		code: '0004_0005_0001',
		connectDetails: ['stock-sale-manage_stock-plan-order.assign-stock-plan'],
		child: {
			'lock-summary': {
				id: 'lock-summary',
				label: '锁定采购计划单并汇总',
				code: '0004_0005_0001_021_001'
			},
			unlock: {
				id: 'unlock',
				label: '解除锁定采购计划单',
				code: '0004_0005_0001_022_001'
			},
			'assign-order': {
				id: 'assign-order',
				label: '分派采购计划单',
				code: '0004_0005_0001_050_001'
			},
			'giveup-order': {
				id: 'giveup-order',
				label: '整单放弃采购计划单',
				code: '0004_0005_0001_060_001'
			},
			'show-giveup': {
				id: 'show-giveup',
				label: '查看采购计划单已放弃数据',
				code: '0004_0005_0001_060_002'
			}
		}
	}
}
