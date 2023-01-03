export const FILTER_SETTING_CONFIG = {
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
			// 'stock-inquiry-order': {
			// 	id: 'stock-inquiry-order',
			// 	label: '采购询定价单',
			// 	billType: 'StockInquiryOrder',
			// 	icon: 'bill-type-stock-plan-order'
			// }
		}
	},
	'business-data': {
		id: 'business-data',
		label: '营业数据',
		children: {
			'food-business-order': {
				id: 'food-business-order',
				label: '菜品营业单据',
				billType: 'FoodBusinessOrder',
				icon: 'bill-type-food-business-order'
			},
			'theory-cost-order': {
				id: 'theory-cost-order',
				label: '理论耗用单',
				billType: 'TheoryCostOrder',
				icon: 'bill-type-theory-cost-order'
			}
		}
	},
	'production-manage': {
		id: 'production-manage',
		label: '生产管理',
		children: {
			'production-plan': {
				id: 'production-plan',
				label: '生产计划',
				billType: 'ProductionPlan',
				icon: 'bill-type-in-store-order'
			},
			'picking-list': {
				id: 'picking-list',
				label: '领料单',
				billType: 'PickingList',
				icon: 'bill-type-in-store-order'
			},
			'machining-order': {
				id: 'machining-order',
				label: '组合加工单',
				billType: 'MachiningOrder',
				icon: 'bill-type-in-store-order'
			}
		}
	}
	// 'financial-manage': {
	// 	id: 'financial-manage',
	// 	label: '财务管理',
	// 	children: {
	// 		'financial-in-store': {
	// 			id: 'financial-in-store',
	// 			label: '财务入库单',
	// 			billType: 'FinancialInStore',
	// 			icon: 'bill-type-in-store-order'
	// 		},
	// 		'financial-out-store': {
	// 	    id: 'financial-out-store',
	// 	    label: '财务出库单',
	// 	    billType: 'FinancialOutStore',
	// 	    icon: 'bill-type-out-store-order'
	//    },
	// 		'payable-order': {
	// 			id: 'payable-order',
	// 			label: '应付单',
	// 			billType: 'PayableOrder',
	// 			icon: 'bill-type-out-store-order'
	// 		},
	// 		'payment-order': {
	// 			id: 'payment-order',
	// 			label: '付款单',
	// 			billType: 'PaymentOrder',
	// 			icon: 'bill-type-out-store-order'
	// 		},
	// 		'advanced-order': {
	// 			id: 'advanced-order',
	// 			label: '预付单',
	// 			billType: 'AdvancedOrder',
	// 			icon: 'bill-type-out-store-order'
	// 		},
	// 		'verification-order': {
	// 			id: 'verification-order',
	// 			label: '应付核销',
	// 			billType: 'VerificationOrder',
	// 			icon: 'bill-type-out-store-order'
	// 		},
	// 		'receivable-order': {
	// 			id: 'receivable-order',
	// 			label: '应收单',
	// 			billType: 'ReceivableOrder',
	// 			icon: 'bill-type-out-store-order'
	// 		}
	// 	}
	// }
}
