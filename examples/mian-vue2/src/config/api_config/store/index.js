import API_MOVE_ORDER from './api_move_order'
import API_TAKE_STOCK_ORDER from './api_take_stock_order'
import API_IN_STORE from './api_in_store_order'
import API_OUT_STORE from './api_out_store_order'
export default {
	...API_MOVE_ORDER,
	...API_TAKE_STOCK_ORDER,
	...API_IN_STORE,
	...API_OUT_STORE
}
