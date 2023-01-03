import IN_STORE from './in-store/index.js'
import OUT_STORE from './out-store/index.js'
import MOVE_ORDER from './move-order/index.js'
import TAKE_STOCK from './take-stock/index.js'
import PUTAWAY_TASK from './putaway-task/index.js'
export default {
	'store-manage': {
		id: 'store-manage',
		label: '库存管理',
		code: '0003',
		child: {
			...IN_STORE,
			...OUT_STORE,
			...MOVE_ORDER,
			...TAKE_STOCK,
			...PUTAWAY_TASK
		}
	}
}
