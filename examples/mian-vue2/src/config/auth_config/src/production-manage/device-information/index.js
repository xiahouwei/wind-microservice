import DEVICE_MANAGEMENT from './device-management/index.js'
import MAINTENANCE_RECORD from './maintenance-record/index.js'
export default {
	'device-information': {
		id: 'device-information',
		label: '设备信息',
		code: '0010_0006',
		child: {
			...DEVICE_MANAGEMENT,
			...MAINTENANCE_RECORD
		}
	}
}
