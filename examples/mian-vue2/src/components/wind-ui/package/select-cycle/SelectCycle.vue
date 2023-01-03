<template>
	<div class="w-select-cycle">
		<w-select
			ref="cycleWay"
			v-model="currentValue.cycleWay"
			:optionlist="cycleList"
			class="w-select-cycle__cycleWay"
			:disabled="disabled"
			@change="onCycleWayChange"
			@keydown.native.tab.prevent="onCycleWayTabHanlder"
		></w-select>
		<w-select-mulity
			ref="cycleDay"
			v-if="selectShow"
			v-model="currentValue.cycleDay"
			:optionlist="cycleListComputed"
			:showEmpty="false"
			:disabled="disabled"
			class="w-select-cycle__cycleDay"
		></w-select-mulity>
		<w-input-number
			ref="cycleDayValue"
			v-if="inputShow"
			v-model="currentValue.cycleDayValue"
			:disabled="inputDisabled || disabled"
			:min="1"
			:max="99"
			:intLength="3"
			integer
			class="w-select-cycle__cycleDayValue"
			@keydown.native.tab.stop="emitTabHanlder"
		></w-input-number>
	</div>
</template>
<script>
/**
 * select-cycle by shang 2021/2/5
 * @desc select-cycle 周期选择框
 * @param {value}  [any] - 输入框值
 */
export default {
	name: 'w-select-cycle',
	props: {
		value: null,
		actionLabel: {
			type: String,
			default: ''
		},
		disabled: Boolean
	},
	data () {
		const dayList = Array.from({
			length: 31
		}, (item, i) => {
			return {
				id: `${i + 1}`,
				name: `${i + 1}`
			}
		})
		dayList.push({
			id: '32',
			name: '月末最后一天'
		})
		return {
			currentValue: {
				cycleWay: 1,
				cycleDay: [],
				cycleDayValue: ''
			},
			dayList,
			cycleList: [
				{
					id: 1,
					name: `每天${this.actionLabel}`
				},
				{
					id: 2,
					name: `每周固定日${this.actionLabel}`
				},
				{
					id: 3,
					name: `每月固定日${this.actionLabel}`
				},
				{
					id: 4,
					name: `月末${this.actionLabel}`
				}, {
					id: 5,
					name: `隔天${this.actionLabel}`
				}
			],
			weekList: [
				{
					id: '1',
					name: '周一'
				},
				{
					id: '2',
					name: '周二'
				},
				{
					id: '3',
					name: '周三'
				},
				{
					id: '4',
					name: '周四'
				}, {
					id: '5',
					name: '周五'
				}, {
					id: '6',
					name: '周六'
				}, {
					id: '7',
					name: '周日'
				}
			]
		}
	},
	computed: {
		cycleListComputed () {
			if (this.currentValue.cycleWay === 2) {
				return this.weekList
			} else if (this.currentValue.cycleWay === 3) {
				return this.dayList
			}
			return this.weekList
		},
		selectShow () {
			return [2, 3].includes(this.currentValue.cycleWay)
		},
		inputShow () {
			return [1, 4, 5].includes(this.currentValue.cycleWay)
		},
		inputDisabled () {
			return this.currentValue.cycleWay !== 5
		}
	},
	watch: {
		value: {
			immediate: true,
			handler (val) {
				this.currentValue.cycleWay = val.cycleWay
				if ([2, 3].includes(val.cycleWay)) {
					this.currentValue.cycleDay = (val.cycleDay && val.cycleDay.split(',')) || []
				} else if (val.cycleWay === 5) {
					this.currentValue.cycleDayValue = val.cycleDay
				} else {
					this.currentValue.cycleDay = []
					this.currentValue.cycleDayValue = ''
				}
			}
		},
		'currentValue.cycleWay' (val) {
			this.value.cycleWay = val
		},
		'currentValue.cycleDay' (val) {
			this.value.cycleDay = val.join(',')
		},
		'currentValue.cycleDayValue' (val) {
			this.value.cycleDay = val
		},
		selectShow: {
			immediate: true,
			handler (val) {
				if (val) {
					this.$nextTick(() => {
						this.bindWSelectMulityPopperTabEvent()
					})
				}
			}
		}
	},
	methods: {
		onCycleWayChange () {
			this.currentValue.cycleDay = []
			this.currentValue.cycleDayValue = ''
		},
		bindWSelectMulityPopperTabEvent () {
			const popperEl = this.$refs.cycleDay.$refs.popper.$refs.popper
			popperEl.addEventListener('keydown', this.onCycleDayTabHanlder)
		},
		focus () {
			this.$refs.cycleWay.focus()
		},
		onCycleWayTabHanlder (e) {
			this.$refs.cycleWay.handleClose()
			if (this.selectShow) {
				this.$refs.cycleDay.focus()
			} else if (this.inputDisabled) {
				this.emitTabHanlder(e)
			}
		},
		emitTabHanlder (e) {
			this.$emit('on-tab', e)
		},
		onCycleDayTabHanlder (e) {
			if (e.code === 'Tab') {
				e.preventDefault()
				this.$refs.cycleDay.handleClose()
				this.emitTabHanlder(e)
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
.w-select-cycle {
	display : flex
	&__cycleWay {
		flex: 1
		margin-right: 20px
	}
	&__cycleDay {
		flex: 1
	}
	&__cycleDayValue {
		flex: 1
	}
}
</style>
