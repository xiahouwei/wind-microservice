import { getStorage, getStorageNumber } from '../utils'
export default {
	// token
	token: getStorage('token', ''),
	tenantId: getStorageNumber('tenantId', 0),
	// 员工直属机构名称
	organName: getStorage('organName', ''),
	// 机构id
	organId: getStorage('organId', ''),
	// 员工名称
	employeeName: getStorage('employeeName', ''),
	// 登录用户名
	username: getStorage('username', ''),
	// 登录人id
	userId: getStorage('userId', ''),
	// 域名
	hostname: getStorage('hostname', ''),
	hostId: getStorage('hostId', ''),
	// 管理员标记
	systemFlag: getStorageNumber('systemFlag', 0),
	// 可见销售金额
	haveMoneyPower: getStorageNumber('haveMoneyPower', 0),
	// 可见成本金额
	haveCostPower: getStorageNumber('haveCostPower', 0),
	// 生产模块版本
	productionVersion: getStorage('productionVersion', ''),
	// 商龙平台token
	SLCloudToken: '',
	// 集团code
	entCode: getStorage('entCode', '')
}
