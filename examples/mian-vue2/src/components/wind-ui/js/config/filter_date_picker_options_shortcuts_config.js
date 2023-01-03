import utils from '@/js/lib/utils/index'
export default {
	today: {
		text: '今天',
		onClick (picker) {
			const beginDate = utils.setDate() + ' 00:00:00'
			const endDate = utils.setDate() + ' 23:59:59'
			picker.$emit('pick', [beginDate, endDate])
		}
	},
	yesterday: {
		text: '昨天',
		onClick (picker) {
			const beginDate = utils.setDate(utils.getCustomDate(-1)) + ' 00:00:00'
			const endDate = utils.setDate(utils.getCustomDate(-1)) + ' 23:59:59'
			picker.$emit('pick', [beginDate, endDate])
		}
	},
	TenDaysBefore: {
		text: '前10天',
		onClick (picker) {
			const beginDate = utils.setDate(utils.getCustomDate(-9)) + ' 00:00:00'
			const endDate = utils.setDate() + ' 23:59:59'
			picker.$emit('pick', [beginDate, endDate])
		}
	},
	thisWeek: {
		text: '本周',
		onClick (picker) {
			const beginDate = utils.getCurrentWeekFirst() + ' 00:00:00'
			const endDate = utils.getCurrentWeekLast() + ' 23:59:59'
			picker.$emit('pick', [beginDate, endDate])
		}
	},
	thisMonth: {
		text: '本月',
		onClick (picker) {
			const beginDate = utils.getCurrentMonthFirst() + ' 00:00:00'
			const endDate = utils.getCurrentMonthLast() + ' 23:59:59'
			picker.$emit('pick', [beginDate, endDate])
		}
	},
	thisYear: {
		text: '本年',
		onClick (picker) {
			const beginDate = utils.getCurrentYearFirst() + ' 00:00:00'
			const endDate = utils.getCurrentYearLast() + ' 23:59:59'
			picker.$emit('pick', [beginDate, endDate])
		}
	},
	lastWeek: {
		text: '上周',
		onClick (picker) {
			const beginDate = utils.getCurrentWeekFirst(-1) + ' 00:00:00'
			const endDate = utils.getCurrentWeekLast(-1) + ' 23:59:59'
			picker.$emit('pick', [beginDate, endDate])
		}
	},
	lastMonth: {
		text: '上月',
		onClick (picker) {
			const beginDate = utils.getCurrentMonthFirst(-1) + ' 00:00:00'
			const endDate = utils.getCurrentMonthLast(-1) + ' 23:59:59'
			picker.$emit('pick', [beginDate, endDate])
		}
	},
	lastYear: {
		text: '去年',
		onClick (picker) {
			const beginDate = utils.getCurrentYearFirst(-1) + ' 00:00:00'
			const endDate = utils.getCurrentYearLast(-1) + ' 23:59:59'
			picker.$emit('pick', [beginDate, endDate])
		}
	},
	tomorrow: {
		text: '明天',
		onClick (picker) {
			const beginDate = utils.setDate(utils.getCustomDate(1)) + ' 00:00:00'
			const endDate = utils.setDate(utils.getCustomDate(1)) + ' 23:59:59'
			picker.$emit('pick', [beginDate, endDate])
		}
	},
	nextWeek: {
		text: '下周',
		onClick (picker) {
			const beginDate = utils.getCurrentWeekFirst(1) + ' 00:00:00'
			const endDate = utils.getCurrentWeekLast(1) + ' 23:59:59'
			picker.$emit('pick', [beginDate, endDate])
		}
	},
	nextMonth: {
		text: '下月',
		onClick (picker) {
			const beginDate = utils.getCurrentMonthFirst(1) + ' 00:00:00'
			const endDate = utils.getCurrentMonthLast(1) + ' 23:59:59'
			picker.$emit('pick', [beginDate, endDate])
		}
	},
	last3Month: {
		text: '近三月',
		onClick (picker) {
			const beginDate = utils.getCurrentMonthFirst(-2) + ' 00:00:00'
			const endDate = utils.getCurrentMonthLast() + ' 23:59:59'
			picker.$emit('pick', [beginDate, endDate])
		}
	}
}
