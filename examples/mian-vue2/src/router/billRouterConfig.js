/*
 * 单据参数枚举, 根据showdoc定义, 注意key必须以文档定义为准
 * http://doc.wuuxiang.com/showdoc/web/#/123?page_id=6699
 */
export default {
	StockPlan: {
		id: 'StockPlan',
		name: '采购计划单',
		path: 'stockPlanOrder',
		detailPath: 'stockPlanOrderDetail'
	},
	StockOffer: {
		id: 'StockOffer',
		name: '采购报价单',
		path: 'stockOfferOrder',
		detailPath: 'stockOfferOrderDetail'
	},
	StockOrder: {
		id: 'StockOrder',
		name: '采购订单',
		path: 'stockOrder',
		detailPath: 'stockOrderDetail'
	},
	SalesOrder: {
		id: 'SalesOrder',
		name: '销售订单',
		path: 'saleOrder',
		detailPath: 'saleOrderDetail'
	},
	Inquiry: {
		id: 'Inquiry',
		name: '采购询定价单',
		path: 'stockInquiryOrder',
		detailPath: 'stockInquiryOrderDetail'
	},
	InStore: {
		id: 'InStore',
		name: '入库单',
		path: 'inStoreOrder',
		detailPath: 'inStoreOrderDetail'
	},
	OutStore: {
		id: 'OutStore',
		name: '出库单',
		path: 'outStoreOrder',
		detailPath: 'outStoreOrderDetail'
	},
	MoveApply: {
		id: 'MoveApply',
		name: '调拨单',
		path: 'moveOrder',
		detailPath: 'moveOrderDetail'
	},
	ReceivingApply: {
		id: 'ReceivingApply',
		name: '领用申请单',
		path: 'moveOrder',
		detailPath: 'moveOrderDetail'
	},
	CheckBill: {
		id: 'CheckBill',
		name: '盘点单',
		path: 'takeStockOrder',
		detailPath: 'takeStockOrderDetail'
	},
	PurchaseInvoice: {
		id: 'PurchaseInvoice',
		name: '采购发票',
		path: 'purchaseInvoice',
		detailPath: 'purchaseInvoiceDetail'
	},
	CWInStoreBill: {
		id: 'CWInStoreBill',
		name: '财务入库单',
		path: 'financialInStore'
	},
	CWOutStoreBill: {
		id: 'CWOutStoreBill',
		name: '财务出库单',
		path: 'financialOutStore'
	},
	PayableBill: {
		id: 'PayableBill',
		name: '应付单',
		path: 'payableOrder'
	},
	CWPaymentBill: {
		id: 'CWPaymentBill',
		name: '付款单',
		path: 'paymentOrder'
	},
	AdvanceBill: {
		id: 'AdvanceBill',
		name: '预付单',
		path: 'advancedOrder'
	},
	PayWriteOff: {
		id: 'PayWriteOff',
		name: '应付核销',
		path: 'verificationOrder'
	},
	ReceivableBill: {
		id: 'ReceivableBill',
		name: '应收单',
		path: 'receivableOrder'
	},
	TheoryExpend: {
		id: 'TheoryExpend',
		name: '理论耗用单',
		path: 'theoryCostOrder',
		detailPath: 'theoryCostOrderDetail'
	},
	StockPlanAssign: {
		id: 'StockPlanAssign',
		name: '采购计划单分派',
		path: 'stockPlanAssign'
	},
	InStoreAssign: {
		id: 'InStoreAssign',
		name: '入库分派',
		path: 'inStoreAssign'
	},
	OutStoreAssign: {
		id: 'OutStoreAssign',
		name: '出库分派',
		path: 'outStoreAssign'
	},
	DishBusinessBill: {
		id: 'DishBusinessBill',
		name: '菜品营业单',
		path: 'foodBusinessOrder',
		detailPath: 'foodBusinessOrderDetail'
	},
	ProductionPlan: {
		id: 'ProductionPlan',
		name: '生产计划',
		path: 'productionPlan',
		detailPath: 'productionPlanDetail'
	},
	Pick: {
		id: 'pickingList',
		name: '领料单',
		path: 'pickingList',
		detailPath: 'pickingListDetail'
	},
	MachineCompose: {
		id: 'machiningOrder',
		name: '组合加工单',
		path: 'machiningOrder',
		detailPath: 'machiningOrderDetail'
	},
	ProcedureTask: {
		id: 'ProcedureTask',
		name: '工序任务单',
		path: 'productionManage',
		query: {
			router: 'main/processTask',
			tagTitle: '工序任务单'
		}
	}
}

const INVOICE_LIST = ['PurchaseInvoice']
export const getPrintPath = function (billType) {
	return INVOICE_LIST.includes(billType) ? '/main/printInvoice' : '/main/print'
}
