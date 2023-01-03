export default {
	'out-store': {
		id: 'out-store',
		label: '出库单',
		code: '0004_0005_0003',
		connectDetails: ['stock-sale-manage_sale-order.assign-out-sale'],
		child: {
			'recover-outstore': {
				id: 'recover-outstore',
				label: '恢复已放弃出库数据',
				code: '0004_0005_0003_005_001'
			},
			'lock-summary': {
				id: 'lock-summary',
				label: '锁定销售订单并汇总',
				code: '0004_0005_0003_021_001'
			},
			'unlock-outstore': {
				id: 'unlock-outstore',
				label: '解除锁定销售订单',
				code: '0004_0005_0003_022_001'
			},
			'assign-outstore': {
				id: 'assign-outstore',
				label: '出库分派销售订单',
				code: '0004_0005_0003_050_001'
			},
			'giveup-outstore': {
				id: 'giveup-outstore',
				label: '整单出库放弃销售订单',
				code: '0004_0005_0003_060_001'
			},
			'show-giveup': {
				id: 'show-giveup',
				label: '查看销售订单出库已放弃数据',
				code: '0004_0005_0003_060_002'
			}
		}
	}
}
