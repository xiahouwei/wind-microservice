<template>
	<el-button class="fx-button" :class="classes"  @click="onClick">
		<slot></slot>
	</el-button>
</template>
<script>
/**
 * fx-button by shang 2020/2/25
 * @desc fx-button 业务按钮
 * @params type[string] 按钮类型, 为了统一规范业务按钮颜色, 声明按钮类型 方便使用 可选 save, submit, return, check, uncheck, recheck, unrecheck, agreen, reject
 */
export default {
	name: 'fx-button',
	props: {
		type: {
			type: String,
			default: 'save'
		},
		stop: Boolean
	},
	computed: {
		classes () {
			return [`fx-button--${this.type}`]
		}
	},
	methods: {
		onClick (e) {
			if (this.stop) {
				event.stopPropagation()
			}
			this.$emit('click', e)
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
}
</style>

