import API_PLAN_PRICE from './api_plan-price'
import API_PLAN_STOCK from './api_plan-stock'
import API_PLAN_QUICK_OUT from './api_plan-quick-out'
export default {
	...API_PLAN_PRICE,
	...API_PLAN_STOCK,
	...API_PLAN_QUICK_OUT
}
