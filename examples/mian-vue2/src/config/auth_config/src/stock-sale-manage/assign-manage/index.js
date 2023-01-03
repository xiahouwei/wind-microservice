import IN_STORE from './in-store/index.js'
import OUT_STORE from './out-store/index.js'
import STOCK_PLAN from './stock-plan/index.js'
export default {
	'assign-manage': {
		id: 'assign-manage',
		label: '分派管理',
		code: '0004_0005',
		child: {
			...IN_STORE,
			...OUT_STORE,
			...STOCK_PLAN
		}
	}
}
