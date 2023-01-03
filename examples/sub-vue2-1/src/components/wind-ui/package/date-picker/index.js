/**
 * date-picker by shang 2021/7/7
 * @desc date-picker 日期选择插件
 * @param {Boolean}  scrollClose - 滚动自动关闭
 */
import { DatePicker } from 'element-ui'
import scrollHide from '../../js/utils/scroll-hide.js'
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
		}
	}
}
