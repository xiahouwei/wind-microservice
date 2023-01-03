import MOVE_ORDER from './move-order/index.js'
import TAKE_STOCK_ORDER from './take-stock-order/index.js'
import IN_STORE_ORDER from './in-store-order/index.js'
import OUT_STORE_ORDER from './out-store-order/index.js'
import PUTAWAY_TASK from './putaway-task/index.js'
export default {
	id: 'store-manage',
	label: '库存管理',
	child: [
		IN_STORE_ORDER,
		OUT_STORE_ORDER,
		MOVE_ORDER,
		TAKE_STOCK_ORDER,
		PUTAWAY_TASK
	]
}
