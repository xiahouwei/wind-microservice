import BOM_DIAGNOSIS from './bom-diagnosis/index.js'
import FOOD_BUSINESS_ORDER from './food-business-order/index.js'
import BUSINESS_DATA_SEARCH from './business-data-search/index.js'
import THEORY_COST_ORDER from './theory-cost-order/index.js'
export default {
	'cost-manage': {
		id: 'cost-manage',
		label: '成本管理',
		code: '0006',
		child: {
			...BOM_DIAGNOSIS,
			...FOOD_BUSINESS_ORDER,
			...BUSINESS_DATA_SEARCH,
			...THEORY_COST_ORDER
		}
	}
}
