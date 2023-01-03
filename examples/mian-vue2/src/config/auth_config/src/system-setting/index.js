import LOG_MANAGE from './log-manage/index.js'
import SYSTEM_PARAMS from './system-params/index.js'
import ACCOUNT_BINDING from './account-binding/index.js'
import IMPORT_MANAGE from './import-manage/index.js'
import DATA_INITIALIZATION from './data-initialization/index.js'
import FILTER_SETTING from './filter-setting/index.js'
import ORDER_REQUIRED_SETTING from './order-required-setting/index.js'
import ORDER_MISTAKE_CHECK_SETTING from './/order-mistake-check-setting/index.js'
export default {
	'system-setting': {
		id: 'system-setting',
		label: '系统设置',
		code: '0002',
		child: {
			...LOG_MANAGE,
			...SYSTEM_PARAMS,
			...ACCOUNT_BINDING,
			...IMPORT_MANAGE,
			...DATA_INITIALIZATION,
			...FILTER_SETTING,
			...ORDER_REQUIRED_SETTING,
			...ORDER_MISTAKE_CHECK_SETTING
		}
	}
}
