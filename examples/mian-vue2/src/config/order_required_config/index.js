/**
 * @name orderRequiredConfig
 * @desc 单据必填设置——基础配置
 * @author cc
 * @date 2022/06/17
 */

import IN_STORE_ORDER from './src/inStoreOrder.js'
import OUT_STORE_ORDER from './src/outStoreOrder.js'
import MOVE_ORDER from './src/moveOrder.js'
import TAKE_STOCK_ORDER from './src/takeStockOrder.js'
import STOCK_PLAN_ORDER from './src/stockPlanOrder.js'
import STOCK_ORDER from './src/stockOrder.js'
import SALE_ORDER from './src/saleOrder.js'

export * from './orderRequiredModuleCongfig.js'

export const REQUIRED_ITEM_CONFIG = {
	...IN_STORE_ORDER,
	...OUT_STORE_ORDER,
	...MOVE_ORDER,
	...TAKE_STOCK_ORDER,
	...STOCK_PLAN_ORDER,
	...STOCK_ORDER,
	...SALE_ORDER
}
