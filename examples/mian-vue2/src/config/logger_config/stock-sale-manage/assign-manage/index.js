import IN_ASSIGN from './in-assign/index.js'
import OUT_ASSIGN from './out-assign/index.js'
import STOCK_PLAN from './stock-plan/index.js'
export default {
	id: 'assign-manage',
	label: '分派管理',
	child: [
		STOCK_PLAN,
		IN_ASSIGN,
		OUT_ASSIGN
	]
}
