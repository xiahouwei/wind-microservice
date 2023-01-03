<template>
	<el-steps :active="active" class="step-container">
		<el-step v-for="item in stepConfig" :key="item.step">
			<template #title>
				<div class="mistake-title">
					<span :class="[item.mistakeType]">【{{mistakeTitleHeader(item.mistakeType)}}】</span>
					{{item.title}}
				</div>
			</template>
			<template #icon>
				<w-icon :type="iconType(item.step)"></w-icon>
			</template>
		</el-step>
	</el-steps>
</template>
<script>
import MISTAKE_CHECK_STEP_CONFIG from '@/config/mistake_check_step_config/index.js'
export default ({
	name: 'mistakeCheckStep',
	props: {
		activeStep: {
			type: Number,
			default: 0
		},
		type: String
	},
	computed: {
		iconType () {
			return (step) => {
				if (step === this.activeStep) {
					return 'mistake-check-step-active'
				} else if (step > this.activeStep) {
					return 'mistake-check-step-unknow'
				} else if (step < this.activeStep) {
					return 'mistake-check-step-pass'
				} else {
					return ''
				}
			}
		},
		mistakeTitleHeader () {
			return (mistakeType) => {
				switch (mistakeType) {
				case 'error':
					return '错误'
				case 'warn' :
					return '警告'
				case 'remind' :
					return '提示'
				default:
					return ''
				}
			}
		},
		active () {
			return this.activeStep - 1
		},
		stepConfig () {
			return MISTAKE_CHECK_STEP_CONFIG[this.type]
		}
	}
})
</script>

<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.step-container {
	margin-bottom	10px
  width 100%;
	>>>.el-step {
		display flex
		align-items center
		flex-basis unset !important
    margin-right 50px !important;
		&:last-child {
			margin-right 0 !important
			max-width unset !important
		}
		.el-step__head {
			width inherit
			height 24px
			.el-step__icon.is-text {
				border none
			}
			.el-step__line {
				height 0
			}
		}
		.el-step__main {
			height 36px
			width max-content
			.mistake-title {
				font-size 12px
				line-height 36px
				.error {
					color: $fxRed
				}
				.warn {
					color: $fxOrange4
				}
				.remind {
					color: $fxViolet2
				}
			}
			.is-finish {
				color $fxBlack
			}
			.is-process {
				color $fxBlue
			}
			.is-wait {
				color $fxBlack2
			}
			.el-step__title.is-finish {
				&::after {
					content: ''
					height 2px
					width 35px
					background-color $fxBlue7
					position: absolute;
					right: -45px;
					top: 50%;
					transform: translateY(-50%)
					z-index 99
				}
			}
		}
		&:not(:last-child)::after {
			content: ''
			height 2px
			width 35px
			background-color #ccc
			position: absolute;
			right: -45px;
			top: 50%;
			transform: translateY(-50%)
		}
	}
}
</style>
