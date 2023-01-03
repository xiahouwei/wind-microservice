<template>
	<el-button
		:class="classes"
		:type="computedType"
		:size="size"
		:plain="plain"
		:round="round"
		:circle="circle"
		:loading="loading"
		:disabled="disabled"
		:icon="icon"
		@click="onClick"
	>
		<slot></slot>
	</el-button>
</template>
<script>
/**
 * fx-button by shang 2020/2/25
 * @desc fx-button 业务按钮
 * @params type[string] 按钮类型, 为了统一规范业务按钮颜色, 声明按钮类型 方便使用 可选 save, submit, return, check, uncheck, recheck, unrecheck, agreen, reject, endcheck, splitcheck; 也可为el-button原生属性primary / success / warning / danger / info / text
 * @params size[String] 按钮尺寸 medium / small / mini
 * @params plain[Boolean] 是否朴素按钮
 * @params round[Boolean] 是否圆角按钮
 * @params circle[Boolean] 是否圆形按钮
 * @params loading[Boolean] 是否加载中状态
 * @params disabled[Boolean] 是否禁用状态
 * @params icon[String] 图标类名
 */
const EL_BUTTON_TYPE = ['primary', 'success', 'warning', 'danger', 'info', 'text']
const FX_BUTTON_TYPE = ['save', 'submit', 'return', 'check', 'uncheck', 'recheck', 'unrecheck', 'agreen', 'reject', 'endcheck', 'splitcheck']
export default {
	name: 'fx-button',
	props: {
		type: String,
		size: String,
		stop: Boolean,
		plain: Boolean,
		round: Boolean,
		circle: Boolean,
		loading: Boolean,
		disabled: Boolean,
		icon: String
	},
	computed: {
		classes () {
			if (FX_BUTTON_TYPE.includes(this.type)) {
				return ['fx-button', `fx-button--${this.type}`]
			} else {
				return ''
			}
		},
		computedType () {
			if (EL_BUTTON_TYPE.includes(this.type)) {
				return this.type
			} else {
				return ''
			}
		}
	},
	methods: {
		onClick (e) {
			if (this.stop) {
				event.stopPropagation()
			}
			this.$fxUtils.fxDebounce(500).then(() => {
				this.$emit('click', e)
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.fx-button {
	color: $fxWhite
	&:active {
		opacity: .4
	}
	&--save {
		border-color: $fxBlue1
		background-color: $fxBlue1
		&:hover,&:focus {
			border-color: $fxLightBlue1
			background-color: $fxLightBlue1
		}
	}
	&--submit {
		border-color: $fxPuce
		background-color: $fxPuce
		&:hover,&:focus {
			border-color: $fxLightPuce
			background-color: $fxLightPuce
		}
	}
	&--return {
		border-color: $fxPink
		background-color: $fxPink
		&:hover,&:focus {
			border-color: $fxLightPink
			background-color: $fxLightPink
		}
	}
	&--check {
		border-color: $fxViolet1
		background-color: $fxViolet1
		&:hover,&:focus {
			border-color: $fxLightViolet1
			background-color: $fxLightViolet1
		}
	}
	&--uncheck {
		border-color: $fxGreen3
		background-color: $fxGreen3
		&:hover,&:focus {
			border-color: $fxLightGreen3
			background-color: $fxLightGreen3
		}
	}
	&--recheck {
		border-color: $fxBlue2
		background-color: $fxBlue2
		&:hover,&:focus {
			border-color: $fxLightBlue2
			background-color: $fxLightBlue2
		}
	}
	&--unrecheck {
		border-color: $fxRed3
		background-color: $fxRed3
		&:hover,&:focus{
			border-color: $fxLightRed3
			background-color: $fxLightRed3
		}
	}
	&--agreen {
		border-color: $fxBlue4
		background-color: $fxBlue4
		&:hover,&:focus {
			border-color: $fxLightBlue4
			background-color: $fxLightBlue4
		}
	}
	&--reject {
		border-color: $fxRed4
		background-color: $fxRed4
		&:hover,&:focus {
			border-color: $fxLightRed4
			background-color: $fxLightRed4
		}
	}
	&--endcheck {
		border-color: $fxViolet1
		background-color: $fxViolet1
		&:hover,&:focus {
			border-color: $fxLightViolet1
			background-color: $fxLightViolet1
		}
	}
	&--splitcheck {
		border-color: $fxViolet1
		background-color: $fxViolet1
		&:hover,&:focus {
			border-color: $fxLightViolet1
			background-color: $fxLightViolet1
		}
	}
}
</style>

