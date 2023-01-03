import PINYIN_LIBRARY from './pinyin_library.js'
import regUtils from './reg.js'
// 字符串切割,处理空字符串与类型错误的问题 by shw
const split = function (value, separator, howmany) {
	if (typeof value !== 'string' || value === '') {
		return []
	}
	return String.prototype.split.apply(value, [separator, howmany])
}
// 字符串反转 by shw
const strReverse = (str) => {
	return str.split('').reverse().join('')
}
// 汉字转拼音(全拼/简拼)
const chinese2Pinyin = function (val, simple = false) {
	return split(val, '').reduce((pre, cur) => {
		if (regUtils.regInitByType(['english', 'number']).test(cur)) {
			pre += cur
		} else if (regUtils.regInitByType('chinese').test(cur)) {
			const name = getFirstLetter(cur, simple)
			pre += name
		}
		return pre
	}, '')
}
const getFirstLetter = function (val, simple) {
	const [first] = [...val]
	for (var name in PINYIN_LIBRARY) {
		if (~PINYIN_LIBRARY[name].indexOf(first)) {
			return ucfirst(name, simple)
		}
	}
	return ''
}
const ucfirst = function (l1, simple) {
	if (l1.length > 0) {
		if (simple) return l1.substr(0, 1)
		const first = l1.substr(0, 1).toUpperCase()
		const spare = l1.substr(1, l1.length)
		return first + spare
	}
	return ''
}
// 获取文本宽度 by shw
const getTextWidth = function (str) {
	const html = document.createElement('span')
	html.innerText = str
	html.className = 'fx-getTextWidth-span'
	document.querySelector('body').appendChild(html)
	const width = document.querySelector('.fx-getTextWidth-span').offsetWidth
	document.querySelector('.fx-getTextWidth-span').remove()
	return width
}
// 字符串逻辑判断
const logicJudgmentStr = function (str = '', fn) {
	if (/\|/.test(str)) {
		const strList = str.split('|')
		return strList.some(item => logicJudgmentStr(item, fn))
	} else if (/\&/.test(str)) {
		const strList = str.split('&')
		return strList.every(item => logicJudgmentStr(item, fn))
	} else {
		return fn(str.trim())
	}
}
export default {
	split,
	strReverse,
	chinese2Pinyin,
	getTextWidth,
	logicJudgmentStr
}
