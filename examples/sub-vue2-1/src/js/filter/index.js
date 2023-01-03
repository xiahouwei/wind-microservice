
import app from '@/main.js'
import utils from '@/js/lib/utils'

/**
 * filterAutoZeroFill by shw
 * @desc 补零过滤器 根据系统参数'XTGF_ZERO_FILL'的值 , 对文本自动补零
 * @param {Number} len 保留位数
 */
const filterAutoZeroFill = (value, { len = 2 } = {}) => {
	const pushZero = app.vue.$store.getters.getSysParams('XTGF_ZERO_FILL', 'value')
	return utils.toFixed(parseFloat(value), len, pushZero)
}
const filterTaxes = (value) => {
	return utils.toFixed(value * 100, 2, false)
}
const filterDateYMD = (value) => {
	return utils.setDate(new Date(value))
}
const filterDateTime = (value, formatter = 'YYYY:MM:DD HH:MM') => {
	return utils.formatterDateTime(value, formatter)
}
const filters = {
	filterAutoZeroFill,
	filterTaxes,
	filterDateYMD,
	filterDateTime
}
export default function fxFilters (vm) {
	Object.keys(filters).forEach(key => {
		vm.filter(key, filters[key])
	})
}
