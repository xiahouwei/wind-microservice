import { getStorageNumber, getStorageJson, getStorage, getStorageBoolean } from '../utils'
export default {
	// 整数最大位数
	numberLength: 8,
	// 数量小数点保留位数(4位)
	sysPointSize: getStorageNumber('sysPointSize', 4),
	// 金额小数点保留位数(2位)
	sysMoneyPointSize: getStorageNumber('sysMoneyPointSize', 2),
	// 单价小数点保留位数(4位)
	sysPricePointSize: getStorageNumber('sysPricePointSize', 4),
	// 可输入最大数量
	maxAmount: 99999999,
	// 可选税率
	taxesList: [{
		id: 0,
		name: '0%'
	}, {
		id: 0.01,
		name: '1%'
	}, {
		id: 0.03,
		name: '3%'
	}, {
		id: 0.05,
		name: '5%'
	}, {
		id: 0.06,
		name: '6%'
	}, {
		id: 0.09,
		name: '9%'
	}, {
		id: 0.13,
		name: '13%'
	}],
	// 系统默认到货间隔
	sysArrivalInterval: 24,
	// 系统设置
	sysParamsConfig: getStorageJson('sysParamsConfig', {}),
	// 菜单隐藏标记
	appMenuHiddenFlag: getStorageBoolean('appMenuHiddenFlag', false),
	// 极速订地址
	biubiuorderUrl: getStorageJson('biubiuorderUrl', ''),
	// 生产管理（MES）地址
	productionManagerUrl: getStorage('productionManagerUrl', '')
	// productionManagerUrl: 'http://192.168.25.90:8877'
}
