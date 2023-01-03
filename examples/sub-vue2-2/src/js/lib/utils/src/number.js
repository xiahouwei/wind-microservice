import utilsType from './type'
import utilsString from './string'
// 精准四舍五入及补零 by shw
const toFixed = function (number, len = 0, pushZero = true) {
	let num = number - 0 + 0.0000000001
	num = isNaN(num) ? 0 : num
	const _len = len - 0
	const mathPow = Math.pow(10, _len)
	let _num = Math.round(num * mathPow) / mathPow + ''
	if (pushZero && _len > 0) {
		let dot = _num.indexOf('.')
		if (!~dot) {
			_num += '.'
			dot = _num.length - 1
		}
		// 获取当前小数点后位数,跟参数_len比较一下,如果不等用0补齐
		const dotLen = _num.length - (dot + 1)
		// 需要补0的个数
		const zeroLen = _len - dotLen
		if (dotLen < _len) {
			for (let i = 0; i < zeroLen; i++) {
				_num += '0'
			}
		}
	}
	return _num
}
const toFixedParseNumber = function () {
	return parseFloat(toFixed(...arguments))
}
// 数字转化 by shw
const toNumber = function (val) {
	return utilsType.isDef(val) ? isNaN(parseFloat(val)) ? 0 : parseFloat(val) : 0
}
// floor by shw
const floor = function (val) {
	return Math.floor(toNumber(val))
}
// 判断小数位是否满足条件
const checkNumberPoint = function (num, point) {
	const index = utilsString.strReverse(num + '').indexOf('.')
	return !(~index && index > point)
}
// 格式化小数位保留指定位数
const formatNumByPoint = function (num, point) {
	const strVal = num + ''
	if (!checkNumberPoint(num, point)) {
		return parseFloat(strVal.slice(0, strVal.indexOf('.') + point + 1))
	} else {
		return num
	}
}
// 生成插入索引
const createInsertNumber = function (pre, next) {
	const len = Math.max(getPointLength(pre), getPointLength(next))
	const preVal = pre * Math.pow(10, len)
	const nextVal = next * Math.pow(10, len)
	if ((nextVal - preVal) > 1) {
		return (preVal + 1) / Math.pow(10, len)
	} else {
		return (preVal + 0.1) / Math.pow(10, len)
	}
}
const getPointLength = function (num) {
	const index = utilsString.strReverse(`${num}`).indexOf('.')
	return ~index ? index : 0
}

// 金额转中文大写(配置)
const cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
const cnIntRadice = ['', '拾', '佰', '仟']
const cnIntUnits = ['', '万', '亿', '兆']
const cnDecUnits = ['角', '分', '毫', '厘']
const cnInteger = '整'
const cnIntLast = '元'
const maxNum = 999999999999999.9999
// 金额转中文大写(函数体)
const convertCurrency = function (money) {
	let integerNum
	let decimalNum
	let chineseStr = ''
	let parts = []
	// 判断传入money是否有效
	if (money === '') { return '' }
	money = parseFloat(money)
	if (money >= maxNum) {
		return ''
	}
	if (money === 0) {
		chineseStr = cnNums[0] + cnIntLast + cnInteger
		return chineseStr
	}
	// 分割money整数、小数部分
	money = money.toString()
	if (money.indexOf('.') === -1) {
		integerNum = money
		decimalNum = ''
	} else {
		parts = money.split('.')
		integerNum = parts[0]
		decimalNum = parts[1].substr(0, 4)
	}
	if (parseInt(integerNum, 10) > 0) {
		let zeroCount = 0
		const intLen = integerNum.length
		for (let i = 0; i < intLen; i++) {
			const n = integerNum.substr(i, 1)
			const p = intLen - i - 1
			const q = p / 4
			const m = p % 4
			if (n === '0') {
				zeroCount++
			} else {
				if (zeroCount > 0) {
					chineseStr += cnNums[0]
				}
				zeroCount = 0
				chineseStr += cnNums[parseInt(n)] + cnIntRadice[m]
			}
			if (m === 0 && zeroCount < 4) {
				chineseStr += cnIntUnits[q]
			}
		}
		chineseStr += cnIntLast
	}
	if (decimalNum !== '') {
		let zeroCount = 0
		const decLen = decimalNum.length
		for (let i = 0; i < decLen; i++) {
			const n = decimalNum.substr(i, 1)
			if (n === '0') {
				zeroCount++
			} else {
				if (zeroCount > 0) {
					chineseStr += cnNums[0]
				}
				zeroCount = 0
				chineseStr += cnNums[Number(n)] + cnDecUnits[i]
			}
		}
	}
	if (chineseStr === '') {
		chineseStr += cnNums[0] + cnIntLast + cnInteger
	} else if (decimalNum === '') {
		chineseStr += cnInteger
	}
	return chineseStr
}

export default {
	toFixed,
	toFixedParseNumber,
	toNumber,
	floor,
	checkNumberPoint,
	formatNumByPoint,
	createInsertNumber,
	convertCurrency
}
