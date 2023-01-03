import SYSTEM_PARAMS from './system-params/index.js'
import IMPORT_MANAGE from './import-manage/index.js'
import DATA_INITIALIZATION from './data-initialization/index.js'
export default {
	id: 'system-setting',
	label: '系统设置',
	child: [
		SYSTEM_PARAMS,
		IMPORT_MANAGE,
		DATA_INITIALIZATION
	]
}
