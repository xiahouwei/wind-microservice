import API_PRODUCTION_PLAN from './api_production_plan'
import API_PICKING_LIST from './api_picking_list'
import API_MACHINING_ORDER from './api_machining_order'
import API_DOSING_DEFAULT_HOUSE from './api_dosing-default-house'
export default {
	...API_PRODUCTION_PLAN,
	...API_PICKING_LIST,
	...API_MACHINING_ORDER,
	...API_DOSING_DEFAULT_HOUSE
}
