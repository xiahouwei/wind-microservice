import PRICE_PLAN from './pricePlan.js'
import ORDER_PLAN from './stockPlan.js'
import IN_STORE_ORDER from './inStoreOrder.js'
import OUT_STORE_ORDER from './outStoreOrder.js'
import MOVE_ORDER from './moveOrder.js'
import TAKE_STOCK_ORDER from './takeStockOrder.js'
import STOCK_PLAN_ORDER from './stockPlanOrder.js'
import STOCK_ORDER from './stockOrder.js'
import SALE_ORDER from './saleOrder.js'
import MACHINING_ORDER from './machiningOrder.js'
import PICK_LIST from './pickList.js'

export default {
	...PRICE_PLAN,
	...ORDER_PLAN,
	...IN_STORE_ORDER,
	...OUT_STORE_ORDER,
	...MOVE_ORDER,
	...TAKE_STOCK_ORDER,
	...STOCK_PLAN_ORDER,
	...STOCK_ORDER,
	...SALE_ORDER,
	...MACHINING_ORDER,
	...PICK_LIST
}
