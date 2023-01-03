<template>
	<el-input
		ref="input"
		v-model="currentValue"
		:maxlength="maxlength"
		:placeholder="currentPlaceholder"
		:disabled="disabled"
		:show-password='showPassword'
		:size="size"
		:clearable='clearable'
		:prefix-icon="prefixIcon"
		:suffix-icon='suffixIcon'
		@input="onInput"
		@blur="onBlur"
		@focus="onFocus"
	>
	</el-input>
</template>
<script>
/**
 * input by shang 2020/11/4
 * @desc input 输入框-文本类型
 * @param {value}  [any] - 输入框值
 * @param {disabled}  [Boolean] - 是否禁用
 * @param {readonly}  [Boolean] - 是否只读
 * @param {maxlength}  [Number] - 最大输入长度
 * @param {regType}  [String] - 正则类型
 * @param {size}  [String] - 尺寸
 * @param {placeholder}  [String] - 默认提示
 * @param {show-password}  [Boolean] - 密码框
 *
 * @event {change} 当绑定值变化时触发的事件	当前组件的值
 * @event {input} 当绑定值变化时触发的事件	当前组件的值
 * @event {blur} 输入框失焦时触发
 * @event {focus} 输入框聚焦时触发
 */
export default {
	name: 'w-input',
	props: {
		value: null,
		disabled: Boolean,
		showPassword: Boolean,
		readonly: Boolean,
		maxlength: Number,
		regType: String,
		clearable: {
			type: Boolean,
			default: true
		},
		size: {
			type: String,
			default: 'mini'
		},
		placeholder: {
			type: String,
			default: '请输入'
		},
		prefixIcon: null,
		suffixIcon: null
	},
	data () {
		return {
			currentValue: ''
		}
	},
	computed: {
		currentPlaceholder () {
			return this.disabled ? '' : this.placeholder
		}
	},
	mounted () {
		this.disableDrag()
	},
	watch: {
		value: {
			immediate: true,
			handler (val, oldVal) {
				this.currentValue = val
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
		onInput (value) {
			let _val = value
			if (typeof this.regType === 'string') {
				_val = value.replace(this.$fxUtils.regFilterByType(this.regType), '')
				this.currentValue = _val
			} else if (this.$fxUtils.toRawType(this.regType) === 'RegExp') {
				_val = value.replace(this.regType, '')
				this.currentValue = _val
			}
			this.$emit('input', _val)
			this.$emit('change', _val)
		},
		onBlur (event) {
			if (this.readonly || this.disabled) {
				event.preventDefault()
				return false
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
		disableDrag () {
			this.$refs.input.$refs.input.ondragstart = function () {
				return false
			}
		}
	}
}
</script>
