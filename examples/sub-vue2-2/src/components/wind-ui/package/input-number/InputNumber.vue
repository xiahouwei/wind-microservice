<template>
	<el-input
		ref="input"
		v-model="currentValue"
		:size="size"
		:placeholder="placeholder"
		:disabled="disabled"
		@input="onInput"
		@blur="onBlur"
		@focus="onFocus"
	>
		<span v-if="$slots.suffix" slot="suffix">
			<slot name="suffix"></slot>
		</span>
	</el-input>
</template>
<script>
/**
 * input-number by shang 2020/7/30
 * @desc input-number 输入框-数字类型
 * @param {value}  [any] - 输入框值
 * @param {integer}  [Boolean] - 是否int
 * @param {disabled}  [Boolean] - 是否禁用
 * @param {asyncChange}  [Boolean] - 是否异步更新(手动)
 * @param {inputWidth}  [String] - 输入框宽度
 * @param {min}  [String, Number] - 最小值
 * @param {max}  [String, Number] - 最大值
 * @param {defaultValue}  [String, Number] - 默认值
 * @param {pointSize}  [String, Number] - 小数位
 * @param {intLength}  [String, Number] - 整数位
 * @param {size}  [String] - 尺寸
 * @param {placeholder}  [String] - 默认提示
 *
 * @event {change} 当绑定值变化时触发的事件	当前组件的值
 * @event {blur} 输入框失焦时触发
 * @event {focus} 输入框聚焦时触发
 */
export default {
	name: 'w-input-number',
	props: {
		value: [Number, String],
		disabled: Boolean,
		readonly: Boolean,
		integer: Boolean,
		positive: Boolean,
		min: {
			type: Number,
			default: 0
		},
		max: {
			type: Number,
			default: Infinity
		},
		pointSize: {
			type: [String, Number],
			default: 4
		},
		intLength: {
			type: [String, Number],
			default: 8
		},
		size: {
			type: String,
			default: 'mini'
		},
		placeholder: {
			type: String,
			default: '请输入'
		}
	},
	data () {
		return {
			currentValue: 0,
			oldValue: 0
		}
	},
	computed: {
		computedNumberReg () {
			return this.$fxUtils.regNumberIncludeNegative(this.pointSize)
		}
	},
	mounted () {
		this.disableDrag()
	},
	watch: {
		value: {
			immediate: true,
			handler (val, oldVal) {
				if (val === '' || !this.$fxUtils.isDef(val)) {
					this.currentValue = ''
				} else if (val !== this.currentValue) {
					this.currentValue = this.format(val)
				}
				this.oldValue = this.currentValue
			}
		}
	},
	methods: {
		focus () {
			if (this.$refs.input) {
				this.$refs.input.$el.querySelector('input').focus()
			}
		},
		blur () {
			if (this.$refs.input) {
				this.$refs.input.blur()
			}
		},
		format (value) {
			value = String(value).replace(this.$fxUtils.regInputNumber(), '')
			return value === ''
				? 0 : this.integer
					? this.$fxUtils.floor(value) : this.pointSize
						? this.$fxUtils.toNumber(this.$fxUtils.toFixed(value, this.pointSize, false)) : this.$fxUtils.toNumber(value)
		},
		formatString (value) {
			value = String(value).replace(this.$fxUtils.regInputNumber(), '')
			if (value.indexOf('.') !== -1) {
				const values = value.split('.')
				value = +(values[0]) + '.' + values[1]
			} else if (value.includes('-')) {
				value = '-' + value.replace(/-/g, '')
			} else {
				value = +value
			}
			const floorValue = Number(value)
			return value === '' ? '0' : this.integer ? Math.floor(floorValue) + '' : '' + value
		},
		range (value) {
			return Math.max(Math.min(this.max, this.format(value)), this.min)
		},
		onInput (value) {
			const _value = value
			value = value.replace(/\。/, '.')
			const formatted = this.formatString(value)
			const intFormatted = this.$fxUtils.floor(value) + ''
			if (this.$fxUtils.regInputNumber().test(value)) {
				this.currentValue = this.value
				return false
			}
			if (this.positive && value < 0) {
				this.currentValue = this.value
				return false
			} else if (this.$fxUtils.isDef(this.pointSize)) {
				if (
					(formatted.indexOf('.') === -1 && formatted.replace(/-/g, '').length > this.intLength) ||
					(formatted.indexOf('.') !== -1 && intFormatted.replace(/-/g, '').length > this.intLength) ||
					(formatted.indexOf('.') !== -1 && !this.computedNumberReg.test(formatted))
				) {
					this.currentValue = this.value
					return false
				}
			}
			if (_value !== formatted) {
				this.currentValue = formatted
			}
			if (formatted === '-') return
			this.$emit('input', Number(formatted))
			this.$emit('change', Number(formatted), this.oldValue)
			this.oldValue = formatted
		},
		onBlur (event) {
			if (this.readonly || this.disabled) {
				event.preventDefault()
				return false
			}
			this.currentValue = this.range(this.currentValue)
			if (this.currentValue !== this.value) {
				this.$emit('input', this.currentValue)
				this.$emit('change', this.currentValue, this.oldValue)
				this.oldValue = this.currentValue
			}
			this.$emit('blur', event)
		},
		onFocus (event) {
			if (this.readonly || this.disabled) {
				event.preventDefault()
				return false
			}
			this.$refs.input.$el.querySelector('input').select()
			this.$emit('focus', event)
		},
		isFocus () {
			return this.$refs.input.$refs.input
		},
		disableDrag () {
			this.$refs.input.$refs.input.ondragstart = function () {
				return false
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
</style>
