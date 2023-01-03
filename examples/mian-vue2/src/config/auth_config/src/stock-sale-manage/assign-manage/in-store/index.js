export default {
	'in-store': {
		id: 'in-store',
		label: '入库单',
		code: '0004_0005_0002',
		connectDetails: ['stock-sale-manage_sale-order.assign-in-sale'],
		child: {
			'recover-instore': {
				id: 'recover-instore',
				label: '恢复已放弃入库数据',
				code: '0004_0005_0002_005_001'
			},
			'lock-summary': {
				id: 'lock-summary',
				label: '锁定销售订单并汇总',
				code: '0004_0005_0002_021_001'
			},
			'unlock-instore': {
				id: 'unlock-instore',
				label: '解除锁定销售订单',
				code: '0004_0005_0002_022_001'
			},
			'assign-instore': {
				id: 'assign-instore',
				label: '入库分派销售订单',
				code: '0004_0005_0002_050_001'
			},
			'giveup-instore': {
				id: 'giveup-instore',
				label: '整单入库放弃销售订单',
				code: '0004_0005_0002_060_001'
			},
			'show-giveup': {
				id: 'show-giveup',
				label: '查看销售订单入库已放弃数据',
				code: '0004_0005_0002_060_002'
			}
		}
	}
}
