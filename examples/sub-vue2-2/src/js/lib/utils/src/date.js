import { fxDebug } from './debug.js'
import utilsType from './type.js'
const log = fxDebug('utils-date')
const timeIntervalObj = {}
// new Data 解决ios识别问题 by shw
const newDate = function (date) {
	return date ? new Date(date.replace(/-/g, '/')) : new Date()
}
// 格式化日期 by shw
const setDate = function (date = new Date(), formatter) {
	if (utilsType.toRawType(date) === 'Number') {
		date = new Date(date)
	} else if (utilsType.toRawType(date) !== 'Date') {
		date = newDate(date)
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
	if (!date) return date
	if (typeof date !== 'string') {
		log('只接受字符串格式的日期')
		return date
	}
	switch (formatter) {
	case 'YYYY:MM:DD HH:MM':
		if (date.length === 16) {
			return date
		} else {
			return date.slice(0, -3)
		}
	case 'YYYY:MM:DD':
		if (date.length === 16) {
			return date.slice(0, -6)
		} else {
			return date.slice(0, -9)
		}
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
// 获取本周第一天/当传参时则为当前周的指定前/后周的第一天 by cc
const getCurrentWeekFirst = function (week = 0) {
	const firstDay = new Date()
	const currentWeek = firstDay.getDay()
	const customWeek = week * 7
	const diffWeek = currentWeek === 0 ? -6 : 1 - currentWeek
	firstDay.setDate(firstDay.getDate() + diffWeek + customWeek)
	return setDate(firstDay)
}
// 获取本周最后一天/当传参时则为当前周的指定前/后周的最后一天 by cc
const getCurrentWeekLast = function (week = 0) {
	const lastDay = new Date()
	const currentWeek = lastDay.getDay()
	const customWeek = week * 7
	const diffWeek = currentWeek === 0 ? 0 : 7 - currentWeek
	lastDay.setDate(lastDay.getDate() + diffWeek + customWeek)
	return setDate(lastDay)
}
// 获取当月第一天/当传参时则为当前月的指定前/后月的第一天 by shw
const getCurrentMonthFirst = function (month = 0) {
	const firstDay = new Date()
	firstDay.setMonth(firstDay.getMonth() + month, 1)
	return setDate(firstDay)
}
// 获取当月最后一天/当传参时则为当前月的指定前/后月的最后一天 by shw
const getCurrentMonthLast = function (month = 0) {
	const lastDay = new Date()
	lastDay.setMonth(lastDay.getMonth() + 1 + month, 0)
	return setDate(lastDay)
}
// 获取本年第一天/当传参时则为当前年的指定前/后年的第一天 by cc
const getCurrentYearFirst = function (year = 0) {
	const firstDay = new Date()
	firstDay.setFullYear(firstDay.getFullYear() + year, 0, 1)
	return setDate(firstDay)
}
// 获取本年最后一天/当传参时则为当前年的指定前/后年的最后一天 by cc
const getCurrentYearLast = function (year = 0) {
	const lastDay = new Date()
	lastDay.setFullYear(lastDay.getFullYear() + year, 11, 31)
	return setDate(lastDay)
}
// 获取当前天的指定前/后天数 by shw
const getCustomDate = (days) => {
	const date = new Date()
	date.setDate(date.getDate() + days)
	return date
}
// 获取指定天的指定前/后天数  by shw
const getCustomAssignDate = function (assignDate, days) {
	const date = newDate(assignDate)
	date.setDate(date.getDate() + days)
	return date
}
// 比较两个日期,是否满足 firstDate + range < secondDate by shw
const compareDateRange = (firstDate, secondDate, range = 0) => {
	return (new Date(secondDate) >= new Date(firstDate)) && getCustomAssignDate(firstDate, range) >= new Date(secondDate)
}
// 比较日期大小
const compareDate = function (firstDate, secondDate) {
	return newDate(firstDate) >= newDate(secondDate)
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
	return newDate(setDate(date) + ' ' + getCurrentTime())
}
// 获取指定日期 + 指定时间 by shw
const getCustomerDateAndTime = (date, time) => {
	return newDate(setDate(date) + ' ' + time)
}
// 获取指定日期前一天毫秒
const getTimeBeforeDay = function (d) {
	return new Date(d).getTime() - 8.64e7
}
// 获取间隔 by shw
const getTimeInterval = function (type = 'default') {
	const currentTime = newDate().getTime()
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
export default {
	newDate,
	setDate,
	setDateTime,
	formatterDateTime,
	getCurrentTime,
	getDateWeek,
	getCustomAssignDate,
	getCurrentWeekFirst,
	getCurrentWeekLast,
	getCurrentMonthFirst,
	getCurrentMonthLast,
	getCurrentYearFirst,
	getCurrentYearLast,
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
	d2ms
}
