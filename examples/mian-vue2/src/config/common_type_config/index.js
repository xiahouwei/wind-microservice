import IN_STORE_TYPE from './in_store'
import OUT_STORE_TYPE from './out_store'
import STOCK_ORDER_TYPE from './stock_order'
import SALE_ORDER_TYPE from './sale_order'
import ENUM_TYPE from './enum_type'
import USER_TYPE from './user_type'
import STOCK_PLAN_ORDER_TYPE from './stock_plan_order'
import STOCK_INQUIRY_ORDER_TYPE from './stock_inquiry_order'
import PICK_LIST_TYPE from './pick_list'
import PAYABLE from './payable-order'
import PAYMENT_ORDER from './payment-order'
import RECEIVABLE_ORDER from './receivable-order'

export default {
	...IN_STORE_TYPE,
	...OUT_STORE_TYPE,
	...STOCK_ORDER_TYPE,
	...SALE_ORDER_TYPE,
	...ENUM_TYPE,
	...USER_TYPE,
	...STOCK_PLAN_ORDER_TYPE,
	...STOCK_INQUIRY_ORDER_TYPE,
	...PICK_LIST_TYPE,
	...PAYABLE,
	...PAYMENT_ORDER,
	...RECEIVABLE_ORDER
}
