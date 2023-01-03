<template>
	<div :class="['wind-switch', {'is-inclusion': inclusion}]" @click='onClick'>
		<el-switch
			ref='switch'
			:value="currentValue"
			:active-color="currentActiveColor"
			:inactive-color="currentInactiveColor"
			:active-value="activeValue"
			:inactive-value="inactiveValue"
			:active-text="currentActiveText"
			:disabled="disabled"
			:width="width"
			@change="onChange"
		></el-switch>
	</div>
</template>
<script>
/**
 * switch by shang 2020/11/12
 * @desc switch 开关
 * @param {value}  [any] - 输入框值
 * @param {disabled}  [Boolean] - 是否禁用
 *
 * @event {change} 选项发生变化触发
 */
export default {
	name: 'w-switch',
	props: {
		value: null,
		disabled: Boolean,
		activeValue: {
			type: [String, Number, Boolean],
			default: 1
		},
		inactiveValue: {
			type: [String, Number, Boolean],
			default: 0
		},
		activeColor: {
			type: String,
			default: 'green'
		},
		inactiveColor: {
			type: String,
			default: 'red'
		},
		activeText: String,
		inactiveText: String,
		width: {
			type: Number,
			default: 60
		},
		inclusion: {
			type: Boolean,
			default: true
		}
	},
	data () {
		return {
			currentValue: '',
			colorList: [{
				id: 'blue',
				value: '#179BFF'
			}, {
				id: 'green',
				value: '#13ce66'
			}, {
				id: 'red',
				value: '#ff4949'
			}]
		}
	},
	computed: {
		currentActiveText () {
			return this.value === this.activeValue ? this.activeText : this.inactiveText
		},
		currentActiveColor () {
			return (this.colorList.find(item => {
				return this.activeColor === item.id
			}) || {}).value || this.activeColor
		},
		currentInactiveColor () {
			return (this.colorList.find(item => {
				return this.inactiveColor === item.id
			}) || {}).value || this.inactiveColor
		}
	},
	watch: {
		value: {
			immediate: true,
			handler (val, oldVal) {
				this.currentValue = val
			}
		},
		currentValue (val) {
			this.$emit('input', val)
		}
	},
	methods: {
		onChange (item) {
			this.$emit('input', item)
			this.$emit('change', item)
		},
		focus () {
			this.$refs.switch.focus()
		},
		onClick () {
			this.$emit('click', this.$refs.switch)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '../../style/varsty.styl'
.wind-switch {
	>>>.el-switch__input:focus+.el-switch__core {
		animation: focus-state 1s 0.2s linear infinite
	}
	&.is-inclusion {
		>>>.el-switch {
			position: relative;
			height: 24px;
			line-height: 24px;
			&.is-checked {
				.el-switch__core {
					background: #179bff;
					&:after {
						margin-left: -22px;
					}
				}
			}
			.el-switch__label,
			.el-switch__core {
				height: 24px;
			}
			.el-switch__core {
				border-radius: 12px;
				border: none;
				background: #f1f1f1;
				&:after {
				box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.3);
				width: 22px;
				height: 22px;
				}
			}
			.el-switch__label.is-active {
				color: #333;
			}
			.el-switch__label--right {
				margin-left: 0px;
				position: absolute;
				transform: translateX(50%);
				right: calc(50% - 9px);
				white-space: nowrap;
				top: -1px;
				color: $wind-switch-lable-color;
				&.is-active {
					color: $wind-switch-lable-color;
					transform: translateX(-50%);
					left: calc(50% - 9px);
					right: unset
					white-space: nowrap;
				}
				> span {
					font-size: 12px;
				}
			}
		}
	}
}
@keyframes focus-state
{
    0% {
		box-shadow: 0px 0px 8px #179bff
	}
    50% {
		box-shadow: 0px 0px 8px #f1f1f1
	}
}
</style>
