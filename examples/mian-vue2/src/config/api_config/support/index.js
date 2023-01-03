import API_TAKE_STOCK_CLASS from './api_take_stock_class'
import API_INVENTORY_PROFIT_REASON from './api_inventory_profit_reason'
import API_OUT_STORE_REASON from './api_out_store_reason'
import OTHER_EXPENSE_TYPE_SETTING from './api_other_expense_type_setting'
import API_ITEM_CUSTOM_GROUP from './api_item_custom_group.js'
export default {
	...API_TAKE_STOCK_CLASS,
	...API_INVENTORY_PROFIT_REASON,
	...API_OUT_STORE_REASON,
	...OTHER_EXPENSE_TYPE_SETTING,
	...API_ITEM_CUSTOM_GROUP
}
