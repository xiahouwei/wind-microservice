import { get, post, put, del } from '@/js/api/dataSource'
import { devUrl } from '@/js/service/baseUrl'
export default {
	// 打印
	print: {
		// 获取打印方案接口
		getTemplateDetails (type, id) {
			return get({ url: `${devUrl}/print/template/v1/type/${type}/plans/${id}` })
		},
		// 新增打印方案接口
		addTemplate () {
			return post({ url: `${devUrl}/print/template/v1/plans/`, autoSuccessMsg: true })
		},
		// 修改打印方案接口
		updateTemplate (id) {
			return put({ url: `${devUrl}/print/template/v1/plans/${id}`, autoSuccessMsg: true })
		},
		// 删除打印方案接口
		delTemplate (id) {
			return del({ url: `${devUrl}/print/template/v1/plans/${id}`, autoSuccessMsg: true })
		},
		// 获取打印方案列表
		getTemplateList (type) {
			return get({ url: `${devUrl}/print/template/v1/type/${type}/plans/` })
		},
		// 获取打印数据-出库单
		OutStore () {
			return post({ url: '/bill/out_store/v1/print' })
		},
		// 获取打印数据-入库单
		InStore () {
			return post({ url: '/bill/in_store/v1/print' })
		},
		// 获取打印数据-调拨单
		MoveApply () {
			return post({ url: '/bill/move_apply/v1/print' })
		},
		// 获取打印数据-领用单
		ReceivingApply () {
			return post({ url: '/bill/move_apply/v1/print' })
		},
		// 获取打印数据-盘点单
		CheckBill () {
			return post({ url: '/bill/check/v1/print' })
		},
		// 获取打印数据-销售订单
		SalesOrder () {
			return post({ url: '/bill/sales_order/v1/print' })
		},
		// 获取打印数据-采购订单
		StockOrder () {
			return post({ url: '/bill/stock_order/v1/print' })
		},
		// 获取打印数据-采购计划单
		StockPlan () {
			return post({ url: '/bill/stock_plans/v1/print' })
		},
		// 获取打印数据-采购发票
		PurchaseInvoice () {
			return post({ url: '/finance/purchase_invoice/v1/print' })
		},
		// 获取打印数据-理论耗用单
		TheoryExpend () {
			return post({ url: '/bill/theory/v1/print' })
		},
		// 获取打印数据-菜品营业单
		DishBusinessBill () {
			return post({ url: '/bill/dish_business/v1/print' })
		},
		// 获取打印数据-组合加工单
		MachineCompose () {
			return post({ url: '/bill/machine_compose/v1/print' })
		},
		// 打印状态
		printState (type) {
			return post({ url: `/bill/${type}/v1/printState`, loading: false })
		}
	}
}
