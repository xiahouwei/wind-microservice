import STOCK_PLAN from './stock-plan/index.js'
import STOCK_ORDER from './stock-order/index.js'
import SALE_ORDER from './sale-order/index.js'
import STOCK_PLAN_ORDER from './stock-plan-order/index.js'
import STOCK_INQUIRY_ORDER from './stock-inquiry-order/index.js'
import STOCK_OFFER_ORDER from './stock-offer-order/index.js'
import ASSIGN_MANAGE from './assign-manage'
import ASSIGN_SUMMARY_SHEET from './assign-summary-sheet'
export default {
	id: 'stock-sale-manage',
	label: '采销管理',
	child: [
		STOCK_PLAN,
		STOCK_PLAN_ORDER,
		STOCK_OFFER_ORDER,
		STOCK_ORDER,
		SALE_ORDER,
		STOCK_INQUIRY_ORDER,
		ASSIGN_MANAGE,
		ASSIGN_SUMMARY_SHEET
	]
}
