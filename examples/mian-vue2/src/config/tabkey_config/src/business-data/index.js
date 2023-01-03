import FOOD_BUSINESS_ORDER from './food-business-order/index.js'
import THEORY_COST_ORDER from './theory-cost-order/index.js'
export default {
	'business-data': {
		...FOOD_BUSINESS_ORDER,
		...THEORY_COST_ORDER
	}
}
