import PRODUCTION_PROCESSING from './production-processing/index.js'
import PRODUCTION_PLAN from './production-plan/index.js'
import PICKING_LIST from './picking-list/index.js'
import PROCESS_TASK from './process-task/index'
import MACHINING_ORDER from './machining-order/index.js'
import DEVICE_INFORMATION from './device-information/index.js'
import PRODUCTION_BOARD from './production-board/index.js'
import LOG_WATCH from './log-watch/index.js'
import DOSING_DEFAULT_HOUSE from './dosing-default-house/index.js'

export default {
	'production-manage': {
		id: 'production-manage',
		label: '生产管理',
		code: '0010',
		child: {
			...PRODUCTION_PROCESSING,
			...PRODUCTION_PLAN,
			...PICKING_LIST,
			...PROCESS_TASK,
			...MACHINING_ORDER,
			...DEVICE_INFORMATION,
			...PRODUCTION_BOARD,
			...LOG_WATCH,
			...DOSING_DEFAULT_HOUSE
		}
	}
}
