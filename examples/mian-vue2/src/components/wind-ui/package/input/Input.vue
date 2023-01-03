<template>
	<el-input
		ref="input"
		v-model="currentValue"
		:maxlength="maxlength"
		:placeholder="currentPlaceholder"
		:disabled="disabled"
		:show-password="showPassword"
		:size="size"
		:prefix-icon="prefixIcon"
		:suffix-icon="suffixIcon"
		:clearable="clearable"
		:type="type"
		:rows="rows"
		:resize="resize"
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
 * @param {clearable}  [Boolean] - 是否可清空
 * @param {maxlength}  [Number] - 最大输入长度
 * @param {regType}  [String] - 正则类型
 * @param {size}  [String] - 尺寸
 * @param {placeholder}  [String] - 默认提示
 * @param {show-password}  [Boolean] - 密码框
 * @param {type}  [String] - 输入框类型，text，textarea 和其他 原生 input 的 type 值
 * @param {rows}  [Number] - 输入框行数，只对 type="textarea" 有效
 * @param {resize}  [String] - 控制是否能被用户缩放 none, both, horizontal, vertical
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
		clearable: Boolean,
		size: {
			type: String,
			default: 'mini'
		},
		placeholder: {
			type: String,
			default: '请输入'
		},
		prefixIcon: null,
		suffixIcon: null,
		type: {
			type: String,
			default: 'text'
		},
		rows: Number,
		resize: {
			type: String,
			default: 'none'
		}
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
			if (this.type === 'textarea') {
				this.$refs.input.$el.querySelector('textarea').select()
			} else {
				this.$refs.input.$el.querySelector('input').select()
			}
			this.$emit('focus', event)
		},
		disableDrag () {
			if (this.type === 'textarea') {
				this.$refs.input.$refs.textarea.ondragstart = function () {
					return false
				}
			} else {
				this.$refs.input.$refs.input.ondragstart = function () {
					return false
				}
			}
		}
	}
}
</script>
