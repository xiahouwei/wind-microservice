export default {
	'order-center': {
		id: 'order-center',
		label: '订单中心',
		code: '07_0000_0000_00',
		child: [{
			id: 'shopping-online_order',
			label: '订单管理',
			code: '07_0001_0000_00'
		}, {
			id: 'shopping-online_valetOrder',
			label: '代客下单',
			code: '07_0003_0000_00'
		}, {
			id: 'shopping-online_pickingList',
			label: '拣货清单',
			code: '07_0004_0000_00'
		}, {
			id: 'shopping-online_refundOrder',
			label: '退单管理',
			code: '07_0002_0000_00'
		}, {
			id: 'shopping-online_afterSale',
			label: '售后记录',
			code: '07_0005_0000_00'
		}, {
			id: 'shopping-online_valetRefundOrder',
			label: '代客退单',
			code: '07_0006_0000_00'
		}]
	}
}
