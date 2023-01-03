import API_ASSIGN_INSTORE from './api_assign-in-store'
import API_ASSIGN_OUTSTORE from './api_assign-out-store'
import API_ASSIGN_STOCKPLAN from './api_assign-stock-plan'
export default {
	...API_ASSIGN_INSTORE,
	...API_ASSIGN_OUTSTORE,
	...API_ASSIGN_STOCKPLAN
}
