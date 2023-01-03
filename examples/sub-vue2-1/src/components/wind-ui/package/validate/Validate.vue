<template>
	<el-tooltip
		ref="validate"
		v-model="validateFlag"
		:manual="true"
		:placement="placement"
		:content="validateMessage"
		popper-class="wind-validate-popover"
	>
		<slot></slot>
	</el-tooltip>
</template>
<script>
/**
 * Validate by shang 2020/11/19
 * @desc Validate 校验提示
 */
import scrollHide from '../../js/utils/scroll-hide.js'
export default {
	name: 'w-validate',
	fxComponentName: 'w-validate',
	props: {
		value: null,
		message: String,
		placement: {
			type: String,
			default: 'top'
		},
		scrollClose: {
			type: Boolean,
			default: true
		}
	},
	data () {
		return {
			validateFlag: false,
			validateMessage: ''
		}
	},
	watch: {
		value: {
			immediate: true,
			handler (val) {
				this.validateFlag = val
			}
		},
		message: {
			immediate: true,
			handler (val) {
				this.validateMessage = val
			}
		},
		validateFlag (val) {
			if (this.scrollClose) {
				val ? scrollHide.add(this) : scrollHide.remove(this)
			}
			this.$emit('input', val)
		}
	},
	methods: {
		show (message) {
			if (!message) {
				return false
			}
			this.validateMessage = message
			this.validateFlag = true
		},
		clear () {
			this.validateMessage = ''
			this.validateFlag = false
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '../../style/varsty.styl'
</style>
<style lang="stylus">
@import '../../style/varsty.styl'
.wind-validate-popover {
	background-color: $wind-validate-popover-background-color !important;
    color: $wind-validate-popover-color !important;
	z-index: 9999 !important
	.popper__arrow {
		border-top-color: $wind-validate-popover-background-color !important
		&::after {
			border-top-color: $wind-validate-popover-background-color !important
			border-bottom-color: $wind-validate-popover-background-color !important
		}
	}
}
</style>
