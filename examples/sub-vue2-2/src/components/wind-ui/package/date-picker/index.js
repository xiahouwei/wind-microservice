/**
 * date-picker by shang 2021/7/7
 * @desc date-picker 日期选择插件
 * @param {Boolean}  scrollClose - 滚动自动关闭
 */
import { DatePicker } from 'element-ui'
import scrollHide from '../../js/utils/scroll-hide.js'
import DATE_PICKER_SHORTCUTS_CONFIG from '../../js/config/filter_date_picker_options_shortcuts_config'
import utils from '@/js/lib/utils'
export default {
	name: 'w-date-picker',
	fxComponentName: 'w-date-picker',
	mixins: [DatePicker],
	props: {
		scrollClose: {
			type: Boolean,
			default: true
		}
	},
	data () {
		return {
			fxOldValue: ''
		}
	},
	methods: {
		showPicker () {
			if (this.$isServer) return
			if (!this.picker) {
				this.mountPicker()
			}
			this.pickerVisible = this.picker.visible = true
			this.updatePopper()
			this.picker.value = this.parsedValue
			this.picker.resetView && this.picker.resetView()
			this.fxOldValue = this.value
			this.$nextTick(() => {
				this.picker.adjustSpinners && this.picker.adjustSpinners()
			})
			if (this.scrollClose) {
				scrollHide.add(this)
			}
			this.$emit('visible-change', true)
		},
		hidePicker () {
			if (this.picker) {
				this.picker.resetView && this.picker.resetView()
				this.pickerVisible = this.picker.visible = false
				this.destroyPopper()
			}
			if (this.scrollClose) {
				scrollHide.remove(this)
			}
			this.$emit('visible-change', false)
		},
		focus () {
			const inputRef = this.$refs.reference
			if (inputRef) {
				inputRef.focus()
			} else {
				const inputEl = inputRef.querySelector('.el-range-input')
				inputEl.focus()
			}
		},
		getOldValue () {
			return this.fxOldValue
		}
	}
}

/**
 * @name getCommonTypeItemByRule
 * @desc 根据传参返回date-picker组件pickerOptions传参中shortcuts字段数组
 * @author caicai
 * @date 2022/5/17
 * @param {String / Array} shortcutsType shortcuts类型名称 'all' / ['today','yesterday',...]
 * @return { shortcuts: []}
 */
const ALL_SHORTCUTS_TYPE = ['today', 'yesterday', 'TenDaysBefore', 'thisWeek', 'thisMonth', 'thisYear', 'lastWeek', 'lastMonth', 'lastYear', 'tomorrow', 'nextWeek', 'nextMonth']
export const getDatePickerOptionsShortcuts = function (shortcutsType) {
	if (shortcutsType === 'all') {
		return {
			shortcuts: ALL_SHORTCUTS_TYPE.map(item => {
				return DATE_PICKER_SHORTCUTS_CONFIG[item]
			})
		}
	} else if (utils.isArray(shortcutsType) && shortcutsType.length) {
		const shortcutsArr = []
		shortcutsType.forEach(item => {
			DATE_PICKER_SHORTCUTS_CONFIG[item] && shortcutsArr.push(DATE_PICKER_SHORTCUTS_CONFIG[item])
		})
		return { shortcuts: shortcutsArr }
	} else {
		return { shortcuts: [] }
	}
}
