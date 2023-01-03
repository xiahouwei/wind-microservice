import WORK_KIND from './work-kind/index.js'
import STATION from './station/index.js'
import PROCEDURE from './procedure/index.js'
import PROCESS_ROUTE from './process-route/index.js'
import DOSING_DEFAULT_HOUSE from './dosing-default-house/index.js'
export default {
	'production-processing': {
		id: 'production-processing',
		label: '生产设置',
		code: '0010_0004',
		child: {
			...WORK_KIND,
			...STATION,
			...PROCEDURE,
			...PROCESS_ROUTE,
			...DOSING_DEFAULT_HOUSE
		}
	}
}
