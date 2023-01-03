/**
 * @name orderMistakeCheckConfig
 * @desc 单据异常警告设置——基础配置
 * @author cc
 * @date 2022/10/26
 */

import IN_STORE_ORDER from './src/inStoreOrder.js'
import OUT_STORE_ORDER from './src/outStoreOrder.js'
import TAKE_STOCK_ORDER from './src/takeStockOrder.js'
import STOCK_PLAN_ORDER from './src/stockPlanOrder.js'
import STOCK_ORDER from './src/stockOrder.js'

export * from './orderMistakeCheckModuleCongfig.js'

export const MISTAKE_CHECK_ITEM_CONFIG = {
	...IN_STORE_ORDER,
	...OUT_STORE_ORDER,
	...TAKE_STOCK_ORDER,
	...STOCK_PLAN_ORDER,
	...STOCK_ORDER
}
