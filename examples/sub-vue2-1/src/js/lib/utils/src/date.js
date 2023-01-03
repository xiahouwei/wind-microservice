import { fxDebug } from './debug.js'
import utilsType from './type.js'
const log = fxDebug('utils-date')
const timeIntervalObj = {}
// new Data 解决ios识别问题 by shw
const newData = function (date) {
	return date ? new Date(date.replace(/-/g, '/')) : new Date()
}
// 格式化日期 by shw
const setDate = function (date = new Date(), formatter) {
	if (utilsType.toRawType(date) !== 'Date') {
		date = new Date(date)
	}
	const y = date.getFullYear()
	let m = date.getMonth() + 1
	let d = date.getDate()
	m = m < 10 ? '0' + m : m
	d = d < 10 ? '0' + d : d
	switch (formatter) {
	case '年月日':
		return `${y}年${m}月${d}日`
	case 'ios':
		return `${y}/${m}/${d}`
	case 'YYYY.MM.DD':
		return `${y}.${m}.${d}`
	case 'YYYY-MM':
		return `${y}-${m}`
	case 'MM-DD':
		return `${m}-${d}`
	default:
		return `${y}-${m}-${d}`
	}
}
// 获取年月日小时分钟秒  by shw
const setDateTime = function (date = new Date(), formatter) {
	const pushZero = (val) => {
		return val < 10 ? '0' + val : val
	}
	const y = date.getFullYear()
	const m = pushZero(date.getMonth() + 1)
	const d = pushZero(date.getDate())
	const myH = pushZero(date.getHours())
	const myM = pushZero(date.getMinutes())
	const myS = pushZero(date.getSeconds())
	if (typeof formatter === 'function') {
		return formatter(y, m, d, myH, myM, myS)
	}
	switch (formatter) {
	case '年月日':
		return `${y}年${m}月${d}日 ${myH}:${myM}:${myS}`
	case '年月日时分':
		return `${y}年${m}月${d}日 ${myH}:${myM}`
	case '时分':
		return `${y}-${m}-${d} ${myH}:${myM}`
	default:
		return `${y}-${m}-${d} ${myH}:${myM}:${myS}`
	}
}
// 转换日期格式, 只接受string类型的date by shw
const formatterDateTime = function (date, formatter = 'YYYY:MM:DD HH:MM') {
	if (typeof date !== 'string') {
		log('只接受字符串格式的日期')
		return date
	}
	switch (formatter) {
	case 'YYYY:MM:DD HH:MM':
		return date.slice(0, -3)
	case 'YYYY:MM:DD':
		return date.slice(0, -9)
	default:
		return date
	}
}
// 获取当前小时分钟秒 by shw
const getCurrentTime = function (formatter) {
	const myDate = new Date()
	const myH = myDate.getHours()
	const myM = myDate.getMinutes()
	const myS = myDate.getSeconds()
	return `${myH}:${myM}:${myS}`
}
// 获取星期几 by shw
const getDateWeek = (date) => {
	const week = '日一二三四五六'.charAt(date.getDay())
	return `星期${week}`
}
// 获取当月第一天 by shw
const getCurrentMonthFirst = function () {
	const date = new Date()
	const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
	return setDate(firstDay)
}
// 获取当月最后一天 by shw
const getCurrentMonthLast = function () {
	const date = new Date()
	const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
	return setDate(lastDay)
}
// 获取当前天的指定前/后天数 by shw
const getCustomDate = (days) => {
	var date = new Date()
	date.setDate(date.getDate() + days)
	return date
}
// 获取指定天的指定前/后天数  by shw
const getCustomAssignDate = function (assignDate, days) {
	const date = newData(assignDate)
	date.setDate(date.getDate() + days)
	return date
}
// 比较两个日期,是否满足 firstDate + range < secondDate by shw
const compareDateRange = (firstDate, secondDate, range = 0) => {
	return (new Date(secondDate) >= new Date(firstDate)) && getCustomAssignDate(firstDate, range) >= new Date(secondDate)
}
// 比较日期大小
const compareDate = function (firstDate, secondDate) {
	return newData(firstDate) >= newData(secondDate)
}
// 判断日期是否在日期区间,是否满足 firstDate <= date <= secondDate
const compareDateBetween = function (date, firstDate, secondDate) {
	return compareDate(date, firstDate) && compareDate(secondDate, date)
}
const formatterTime = function (t) {
	if (~t.indexOf(' ')) {
		return t.split(' ')[1]
	}
	return t
}
// 比较时间大小
const compareTime = function (ft, st) {
	const date = new Date()
	const firstTime = formatterTime(ft).split(':')
	const secondTime = formatterTime(st).split(':')
	return date.setHours(...firstTime) > date.setHours(...secondTime)
}
// 判断是否在时间区间
const compareTimeRange = function (t, ft, st) {
	return compareTime(t, ft) && compareTime(st, t)
}
// 获取指定日期 + 当前时间 by shw
const getCustomerDateAndCurrentTime = (date) => {
	return newData(setDate(date) + ' ' + getCurrentTime())
}
// 获取指定日期 + 指定时间 by shw
const getCustomerDateAndTime = (date, time) => {
	return newData(setDate(date) + ' ' + time)
}
// 获取指定日期前一天毫秒
const getTimeBeforeDay = function (d) {
	return new Date(d).getTime() - 8.64e7
}
// 获取间隔 by shw
const getTimeInterval = function (type = 'default') {
	const currentTime = newData().getTime()
	const interval = currentTime - timeIntervalObj.type
	timeIntervalObj.type = currentTime
	return isNaN(interval) ? 0 : interval
}
// 毫秒转化分钟
const ms2m = function (ms) {
	return Math.floor(ms / 1000 / 60)
}
// 毫秒转天
const ms2d = function (ms) {
	return ms / 1000 / 60 / 60 / 24
}
// 小时转毫秒
const h2ms = function (h) {
	return Math.floor(h * 60 * 60 * 1000)
}
// 天转毫秒
const d2ms = function (d) {
	return Math.floor(d * 24 * 60 * 60 * 1000)
}

const MILLISECOND = 1
const SECOND = 1000 * MILLISECOND
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const WEEK = 7 * DAY
const MONTH = 30 * DAY
const YEAR = 365 * DAY
export default {
	newData,
	setDate,
	setDateTime,
	formatterDateTime,
	getCurrentTime,
	getDateWeek,
	getCustomAssignDate,
	getCurrentMonthFirst,
	getCurrentMonthLast,
	getCustomDate,
	compareDateRange,
	compareDate,
	compareDateBetween,
	compareTime,
	compareTimeRange,
	getCustomerDateAndCurrentTime,
	getCustomerDateAndTime,
	getTimeBeforeDay,
	getTimeInterval,
	ms2m,
	ms2d,
	h2ms,
	d2ms,
	MILLISECOND,
	SECOND,
	MINUTE,
	HOUR,
	DAY,
	WEEK,
	MONTH,
	YEAR
}
