import PICKING_LIST from './picking-list'
import PRODUCTION_PLAN from './production-plan'
import MACHINING_ORDER from './machining-order'
import DOSING_DEFAULT_HOUSE from './dosing-default-house'
export default {
	id: 'production-manage',
	label: '生产管理',
	child: [
		PICKING_LIST,
		PRODUCTION_PLAN,
		MACHINING_ORDER,
		DOSING_DEFAULT_HOUSE
	]
}
