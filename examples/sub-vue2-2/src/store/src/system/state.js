import { getLocalStorageNumber, getLocalStorageJson } from '../utils'
export default {
	// 整数最大位数
	numberLength: 8,
	// 数量小数点保留位数(4位)
	sysPointSize: getLocalStorageNumber('sysPointSize', 4),
	// 金额小数点保留位数(2位)
	sysMoneyPointSize: getLocalStorageNumber('sysMoneyPointSize', 2),
	// 单价小数点保留位数(4位)
	sysPricePointSize: getLocalStorageNumber('sysPricePointSize', 4),
	// 可输入最大数量
	maxAmount: 99999999,
	// 可选税率
	taxesList: [{
		id: 0,
		name: '0%'
	}, {
		id: 0.03,
		name: '3%'
	}, {
		id: 0.1,
		name: '10%'
	}],
	// 系统默认到货间隔
	sysArrivalInterval: 24,
	sysParamsConfig: getLocalStorageJson('sysParamsConfig', {})
}
