import API_BUSINESS_BUSINESSDATASEARCH from './api_business-data-search'
import API_SALES_AREA from './api_sales-area'
import THEORY_COST_ORDER from './api_theory-cost-order'
import FOOD_BUSINESS_ORDER from './api_food-business-order'
export default {
	...API_BUSINESS_BUSINESSDATASEARCH,
	...API_SALES_AREA,
	...THEORY_COST_ORDER,
	...FOOD_BUSINESS_ORDER
}
