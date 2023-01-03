// 极速定菜单设置
export default {
	id: 'shopping-online',
	title: '线上商城',
	shortTitle: '商城',
	icon: 'shopping-online',
	child: [{
		id: 'shopping-online_home-page',
		title: '首页',
		type: 'biubiuorder',
		path: 'biubiuorder',
		query: {
			router: 'main/home'
		}
	}, {
		id: 'seller-center',
		title: '卖家中心',
		type: 'biubiuorder',
		child: [{
			id: 'shopping-online_businessSetup',
			title: '企业设置',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/businessSetup'
			}
		}, {
			id: 'shopping-online_storeBasicInfo',
			title: '店铺设置',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/storeBasicInfo'
			}
		}, {
			id: 'shopping-online_purchaseOrderSetting',
			title: '常购清单',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/purchaseOrderSetting'
			}
		}, {
			id: 'shopping-online_categoryManagement',
			title: '店铺分类',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/categoryManagement'
			}
		}, {
			id: 'shopping-online_route',
			title: '线路管理',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/route'
			}
		}, {
			id: 'shopping-online_freight',
			title: '运费',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/freight'
			}
		}, {
			id: 'shopping-online_selfDelivery',
			title: '自提管理',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/selfDelivery'
			}
		}, {
			id: 'shopping-online_weiPay',
			title: '微企付',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/weiPay'
			}
		}]
	}, {
		id: 'commodity-center',
		title: '商品中心',
		type: 'biubiuorder',
		child: [{
			id: 'shopping-online_saleableGoods',
			title: '可售商品库',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/saleableGoods'
			}
		}, {
			id: 'shopping-online_appendageList',
			title: '附属商品',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/appendageList'
			}
		}, {
			id: 'shopping-online_gradePrice',
			title: '客户等级价格',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/gradePrice'
			}
		}]
	}, {
		id: 'store-center',
		title: '库存中心',
		type: 'biubiuorder',
		child: [{
			id: 'shopping-online_storage',
			title: '出入库',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/storage'
			}
		}, {
			id: 'shopping-online_inventoryCheck',
			title: '库存查询',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/inventoryCheck'
			}
		}]
	}, {
		id: 'customer-center',
		title: '客户中心',
		type: 'biubiuorder',
		child: [{
			id: 'shopping-online_customer',
			title: '客户档案',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/customer'
			}
		}, {
			id: 'shopping-online_receivingTime',
			title: '收货时间',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/receivingTime'
			}
		}, {
			id: 'shopping-online_exclusivePrice',
			title: '商品专有价格',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/exclusivePrice'
			}
		}]
	}, {
		id: 'pay-center',
		title: '支付中心',
		type: 'biubiuorder',
		child: [{
			id: 'shopping-online_payCenter',
			title: '支付设置',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/payCenter'
			}
		}, {
			id: 'shopping-online_payAdvance',
			title: '预付货款',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/payAdvance'
			}
		}]
	}, {
		id: 'order-center',
		title: '订单中心',
		type: 'biubiuorder',
		child: [{
			id: 'shopping-online_order',
			title: '订单管理',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/order'
			}
		}, {
			id: 'shopping-online_valetOrder',
			title: '代客下单',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/valetOrder'
			}
		}, {
			id: 'shopping-online_pickingList',
			title: '拣货清单',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/pickingList'
			}
		}, {
			id: 'shopping-online_refundOrder',
			title: '退单管理',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/refundOrder'
			}
		}, {
			id: 'shopping-online_afterSale',
			title: '售后记录',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/afterSale'
			}
		}, {
			id: 'shopping-online_valetRefundOrder',
			title: '代客退单',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/valetRefundOrder'
			}
		}]
	}, {
		id: 'sale-center',
		title: '销售中心',
		type: 'biubiuorder',
		child: [{
			id: 'shopping-online_percentage',
			title: '方案设置',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/percentage'
			}
		}, {
			id: 'shopping-online_achievement',
			title: '提成统计',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/achievement'
			}
		}, {
			id: 'shopping-online_rebateStatistics',
			title: '返佣统计',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/rebateStatistics'
			}
		}, {
			id: 'shopping-online_withdrawalReview',
			title: '提现审核',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/withdrawalReview'
			}
		}]
	}, {
		id: 'market-center',
		title: '营销中心',
		type: 'biubiuorder',
		child: [{
			id: 'shopping-online_marketing',
			title: '全部活动',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/marketing'
			}
		}, {
			id: 'shopping-online_marketingManagement',
			title: '活动管理',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/marketingManagement'
			}
		}, {
			id: 'shopping-online_discountList',
			title: '满减券',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/discountList'
			}
		}, {
			id: 'shopping-online_preSaleList',
			title: '商品预售',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/preSaleList'
			}
		}, {
			id: 'shopping-online_vipList',
			title: '会员卡',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/vipList'
			}
		}, {
			id: 'shopping-online_promotionList',
			title: '商品折扣',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/promotionList'
			}
		}]
	}, {
		id: 'shopping-online_authority',
		title: '权限',
		authType: 'scm',
		child: [{
			id: 'shopping-online_authority_permissions',
			title: '权限角色',
			type: 'biubiuorder',
			authType: 'scm',
			path: 'biubiuorder',
			query: {
				router: 'main/permissions'
			}
		}]
	}, {
		id: 'shopping-online_report-center',
		title: '报表中心',
		type: 'biubiuorder',
		path: 'biubiuorder',
		query: {
			router: 'reportform/orderDetail'
		}
	}, {
		id: 'system-center',
		title: '系统中心',
		type: 'biubiuorder',
		child: [{
			id: 'shopping-online_fileSetting',
			title: '基础档案',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/fileSetting'
			}
		}, {
			id: 'shopping-online_orderSetting',
			title: '订单设置',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/orderSetting'
			}
		}, {
			id: 'shopping-online_miniProgram',
			title: '小程序',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/miniProgram'
			}
		}, {
			id: 'shopping-online_initialize',
			title: '系统初始化',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/initialize'
			}
		}, {
			id: 'shopping-online_defaultImg',
			title: '默认图管理',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/defaultImg'
			}
		}, {
			id: 'shopping-online_operationLog',
			title: '操作日志',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/operationLog'
			}
		}]
	}, {
		id: 'message-center',
		title: '消息中心',
		type: 'biubiuorder',
		child: [{
			id: 'shopping-online_msgCenter',
			title: '交易消息',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/msgCenter'
			}
		}, {
			id: 'shopping-online_systemMsg',
			title: '系统消息',
			type: 'biubiuorder',
			path: 'biubiuorder',
			query: {
				router: 'main/systemMsg'
			}
		}]
	}]
}
