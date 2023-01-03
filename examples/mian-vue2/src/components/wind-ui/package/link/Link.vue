<template>
	<a :href="hrefCoumpted" :class="classes" class="wind-link" @click="onLinkClick" :target='target'>
		<w-icon v-if="icon" :type="icon" :class="[iconClass]" class="wind-link-icon"></w-icon>
		<span>
			<slot></slot>
		</span>
	</a>
</template>
<script>
/**
 * link by shang 2020/8/4
 * @desc link
 * @params [String] href 跳转地址
 * @params [String] type 类型 primary, danger, default
 * @params [Boolean] stop 阻止冒泡
 * @params [Boolean] disabled 禁用
 * @params [String] target 跳转方式
 */
export default {
	name: 'windLink',
	props: {
		href: String,
		type: {
			type: String,
			default: 'primary'
		},
		stop: Boolean,
		disabled: Boolean,
		icon: String,
		inline: {
			type: Boolean,
			default: true
		},
		iconClass: String,
		target: {
			type: String,
			default: '_self'
		}
	},
	computed: {
		hrefCoumpted () {
			return this.href ? this.href : null
		},
		classes () {
			return [`wind-link-${this.type}`, {
				'is-block': !this.inline,
				'is-disabled': this.disabled
			}]
		}
	},
	methods: {
		onLinkClick (e) {
			if (this.disabled) {
				return false
			}
			if (this.stop) {
				e.stopPropagation()
			}
			this.$emit('click', e)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '../../style/varsty.styl'
.wind-link {
	font-size: 12px
	padding: 0 5px
	line-height: 20px
	&.is-block {
		display: block
	}
	&.is-disabled {
		cursor: not-allowed;
	}
	.wind-link-icon {
		width: 20px
		height: 20px
		margin-right: 4px
		position: relative;
		top: 5px;
	}
	&-default {
		&:hover {
			color:$wind-link-color-primary
		}
	}
	&-primary {
		color:$wind-link-color-primary
		&:hover {
			color:$wind-link-color-primary
		}
	}
	&-danger {
		color:$wind-link-color-danger
		&:hover {
			color:$wind-link-color-danger
		}
	}
}
</style>
