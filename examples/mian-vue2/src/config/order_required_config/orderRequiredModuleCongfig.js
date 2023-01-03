export const ORDER_REQUIRED_MODULE_CONFIG = {
	'store-manage': {
		id: 'store-manage',
		label: '库存管理',
		children: {
			'in-store-order': {
				id: 'in-store-order',
				label: '入库单',
				billType: 'InStore',
				icon: 'bill-type-in-store-order'
			},
			'out-store-order': {
				id: 'out-store-order',
				label: '出库单',
				billType: 'OutStore',
				icon: 'bill-type-out-store-order'
			},
			'move-order': {
				id: 'move-order',
				label: '调拨单',
				billType: 'MoveOrder',
				icon: 'bill-type-move-order'
			},
			'take-stock-order': {
				id: 'take-stock-order',
				label: '盘点单',
				billType: 'TakeStockOrder',
				icon: 'bill-type-take-stock-order'
			}
		}
	},
	'stock-sale-manage': {
		id: 'stock-sale-manage',
		label: '采销管理',
		children: {
			'stock-plan-order': {
				id: 'stock-plan-order',
				label: '采购计划单',
				billType: 'StockPlanOrder',
				icon: 'bill-type-stock-plan-order'
			},
			'stock-order': {
				id: 'stock-order',
				label: '采购订单',
				billType: 'StockOrder',
				icon: 'bill-type-stock-order'
			},
			'sale-order': {
				id: 'sale-order',
				label: '销售订单',
				billType: 'SaleOrder',
				icon: 'bill-type-sale-order'
			}
		}
	}
}
