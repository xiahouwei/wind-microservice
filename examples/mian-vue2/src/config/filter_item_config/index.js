import ORGAN_MANAGE from './src/organManage.js'
import IN_STORE_ORDER from './src/inStoreOrder.js'
import OUT_STORE_ORDER from './src/outStoreOrder.js'
import MOVE_ORDER from './src/moveOrder.js'
import TAKE_STOCK_ORDER from './src/takeStockOrder.js'
import STOCK_PLAN_ORDER from './src/stockPlanOrder.js'
import STOCK_OFFER_ORDER from './src/stockOfferOrder.js'
import STOCK_ORDER from './src/stockOrder.js'
import SALE_ORDER from './src/saleOrder.js'
import STOCK_INQQUIRY_ORDER from './src/stockInquiryOrder.js'
import FOOD_BUSINESS_ORDER from './src/foodBusinessOrder.js'
import THEORY_COST_ORDER from './src/theoryCostOrder.js'
import PRODUCTION_PLAN from './src/productionPlan.js'
import PICKING_LIST from './src/pickingList'
import MACHINING_ORDER from './src/machiningOrder'
import FINANCIAL_IN_STORE from './src/financialInStore'
import FINANCIAL_OUT_STORE from './src/financialOutStore'
import PAYABLE_ORDER from './src/payableOrder'
import PAYMENT_ORDER from './src/paymentOrder'
import ADVANCED_ORDER from './src/advancedOrder'
import VERIFICATION_ORDER from './src/verificationOrder'
import RECEIVABLE_ORDER from './src/receivableOrder'

export * from './filterSettingCongfig.js'

export const FILTER_ITEM_CONFIG = {
	...ORGAN_MANAGE,
	...IN_STORE_ORDER,
	...OUT_STORE_ORDER,
	...MOVE_ORDER,
	...TAKE_STOCK_ORDER,
	...STOCK_PLAN_ORDER,
	...STOCK_OFFER_ORDER,
	...STOCK_ORDER,
	...SALE_ORDER,
	...STOCK_INQQUIRY_ORDER,
	...FOOD_BUSINESS_ORDER,
	...THEORY_COST_ORDER,
	...PRODUCTION_PLAN,
	...PICKING_LIST,
	...MACHINING_ORDER,
	...FINANCIAL_IN_STORE,
	...FINANCIAL_OUT_STORE,
	...PAYABLE_ORDER,
	...PAYMENT_ORDER,
	...ADVANCED_ORDER,
	...VERIFICATION_ORDER,
	...RECEIVABLE_ORDER
}
