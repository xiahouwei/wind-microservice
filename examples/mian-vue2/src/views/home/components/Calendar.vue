<template>
	<fx-card title="我的日历" class="calendar-container" >
		<div slot="title-right" class="title-right">
			<fx-list-state-tag icon='orange' label='待办'></fx-list-state-tag>
			<fx-list-state-tag icon='black' label='未盘点'></fx-list-state-tag>
		</div>
		<div class="calendar-content" v-show="calendarShow">
			<div class="calendar-date-picker">
				<el-date-picker
					v-model="currentMonth"
					type="month"
					placeholder="选择月"
					class="date-picker"
					format="yyyy 年 MM 月"
					value-format="yyyy-MM"
					:clearable="false"
					@change="onMonthChange"
				>
				</el-date-picker>
				<el-button class="todo-button" @click="onTodayClick">今天</el-button>
			</div>
			<el-calendar :first-day-of-week="7" v-model="currentDay">
				<div
					slot="dateCell"
					slot-scope="{date,data}"
					@click="onDateClick(data)"
				>
					<div class="date-cell" :class="dateColor(date)">
						{{data.type==='current-month' ? date.getDate() : ''}}
					</div>
					<div class="calendar-date">
						<span v-if="showDotUnchecked(data.day)" class="calendar-date__dot calendar-date__dot-orange"></span>
						<span v-if="showDotUnTackStock(data.day)" class="calendar-date__dot calendar-date__dot-black"></span>
					</div>
				</div>
			</el-calendar>
		</div>
		<calendar-details
			ref="calendarDetails"
			v-show="detailShow"
			:date="currentDay"
			:calenderDetails="calenderDetails"
			:storeList="storeList"
			:organId="organId"
			:selectedOrganId="selectedOrganId"
			:manageAllOrgan="manageAllOrgan"
			:organSelectList="organSelectList"
			@on-back="onBackClick"
			@on-search="onSearchClick"
		></calendar-details>
	</fx-card>
</template>
<script>
import calendarDetails from './CalendarDetails.vue'
import { apiName } from '../Index.vue'
export default {
	name: 'calendar',
	components: {
		calendarDetails
	},
	data () {
		return {
			currentDay: new Date(),
			calendarShow: true,
			detailShow: false,
			dateDotList: {},
			calenderDetails: {},
			storeList: [],
			currentMonth: this.$fxUtils.setDate(new Date(), 'YYYY-MM'),
			organId: '',
			hasDetailsAuth: false,
			manageAllOrgan: 0,
			organSelectList: [],
			selectedOrganId: '',
			isFirstClick: true
		}
	},
	computed: {
		dateColor () {
			return (date) => {
				return [0, 6].includes(date.getDay()) ? ['blue'] : ''
			}
		},
		showDotUnchecked () {
			return (date) => {
				return this.dateDotList[this.currentMonth] && this.dateDotList[this.currentMonth][date] && this.dateDotList[this.currentMonth][date].unchecked
			}
		},
		showDotUnTackStock () {
			return (date) => {
				return this.dateDotList[this.currentMonth] && this.dateDotList[this.currentMonth][date] && this.dateDotList[this.currentMonth][date].isTodoCheck
			}
		}
	},
	mounted () {
		this.getCalendar()
	},
	methods: {
		getCalendar () {
			if (this.dateDotList[this.currentMonth]) return false
			const params = {
				date: this.currentMonth,
				refresh: true
			}
			return this.$fxApi(`${apiName}.getCalendar`)({ data: params }).then(res => {
				this.$set(this.dateDotList, this.currentMonth, res)
				this.organId = res.Employee.OrganId || ''
				this.manageAllOrgan = res.Employee.manageAllOrgan
			})
		},
		async onDateClick ({ day, type }) {
			const calenderDetails = this.dateDotList[this.currentMonth][day]
			if (type !== 'current-month' || !calenderDetails) {
				event.stopPropagation()
				return false
			}
			if (calenderDetails.isTodoCheck && this.manageAllOrgan !== 1 && this.isFirstClick) {
				await this.getCurrentUser()
				await this.getOrganList()
				await this.getStoreList()
				this.isFirstClick = false
			}
			if (!this.hasDetailsAuth) {
				await this.getDetailsAuth()
				this.hasDetailsAuth = true
			}
			this.calenderDetails = calenderDetails
			this.calendarShow = false
			this.detailShow = true
		},
		onBackClick () {
			this.calendarShow = true
			this.detailShow = false
		},
		onMonthChange (val) {
			this.currentDay = new Date(val)
			this.getCalendar()
		},
		onTodayClick () {
			this.currentDay = new Date()
			this.currentMonth = this.$fxUtils.setDate(new Date(), 'YYYY-MM')
		},
		getDetailsAuth () {
			return this.$store.dispatch('syncDetailsAuth', { moduleName: ['store-manage_take-stock-order'], loading: false }).then(() => {
				return Promise.resolve()
			}).catch(() => {
				return new Promise()
			})
		},
		getCurrentUser () {
			return this.$fxApi(`${apiName}.getCurrentUser`).then(res => {
				this.selectedOrganId = res.currentOrgan.id || ''
				return Promise.resolve()
			}).catch(() => {
				return new Promise()
			})
		},
		getOrganList () {
			return this.$fxApi(`${apiName}.getOrganList`)({ data: { names: ['Shop', 'Center'] } }).then(res => {
				this.organSelectList = res
				return Promise.resolve()
			}).catch(() => {
				return new Promise()
			})
		},
		getStoreList (organ) {
			const organId = organ || this.selectedOrganId
			const selectedOrgan = this.$fxUtils.getSelectTagById(organId, this.organSelectList)
			if (!selectedOrgan.id) return Promise.resolve()
			return this.$fxApi(`${apiName}.getStoreList`, organId).then(res => {
				this.storeList = res.house
				return Promise.resolve()
			}).catch(() => {
				return new Promise()
			})
		},
		onSearchClick (organ) {
			this.getStoreList(organ)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.calendar-container {
	display flex
	flex-direction column
	width 670px
	.title-right {
		width 160px
		justify-content space-around
	}
}
.date-cell {
	height 22px
	line-height 22px
	background-color #e9f0fe
	text-align center
}
.blue {
	color $fxBlue5
}
.calendar-content {
	display flex
	align-items center
	flex-direction column
	justify-content space-evenly
	flex 1
	.calendar-date-picker {
		display flex
		justify-content space-between
		align-items center
		height 40px
		width 100%
		padding 0 20px
		box-sizing border-box
		.date-picker {
			width 130px
			height 30px
			>>>.el-input__inner {
				padding-right 0
			}
		}
		.todo-button {
			width 73px
			height 30px
			padding 0
			font-size 14px
			line-height 30px
			color #3F97FF
			border-color #9ABDFF
		}
	}
}
>>>.el-calendar {
	border-radius 10px
	.el-calendar__header {
		display none
	}
	.el-calendar__body {
		padding 0 10px
		.el-calendar-table {
			.el-calendar-day {
				padding 0
				height 40px
			}
			thead {
				text-align center
				th {
					padding 8px 0
					border-top 1px solid $fxElementBorder
					border-right 1px solid $fxElementBorder
				}
				th:first-child, th:last-child {
					color $fxBlue5
				}
				th:first-child {
					border-left 1px solid $fxElementBorder
				}
			}
			.is-today {
				.el-calendar-day {
					font-weight 700
					border 1px solid $fxBlue1
					.date-cell {
						height 21px
					}
				}
			}
		}
	}
}
.calendar-date {
	display flex
	flex-direction row
	justify-content center
	align-items center
	height 18px
	&__dot {
		width 8px
		height 8px
		border-radius 50%
		&:not(:last-child) {
			margin-right 10px
		}
		&-black {
			background-color $fxBlack3
		}
		&-orange {
			background-color $fxOrange1
		}
	}
}
</style>

