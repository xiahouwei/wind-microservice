import STOCK_PLAN_ORDER from './stock-plan-order/index.js'
import STOCK_ORDER from './stock-order/index.js'
import SALE_ORDER from './sale-order/index.js'
import STOCK_INQUIRY_ORDER from './stock-inquiry-order/index.js'
import STOCK_OFFER_ORDER from './stock-offer-order/index.js'
export default {
	'stock-sale-manage': {
		...STOCK_PLAN_ORDER,
		...STOCK_ORDER,
		...SALE_ORDER,
		...STOCK_INQUIRY_ORDER,
		...STOCK_OFFER_ORDER
	}
}
