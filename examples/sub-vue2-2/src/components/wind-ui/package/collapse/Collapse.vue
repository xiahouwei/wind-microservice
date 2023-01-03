<template>
	<div class="wind-collapse" :class="collapseClasses">
		<div class="wind-collapse__title" :class="{'is-expanded': show && value, 'is-disabled': disabled}" @click="onTitleClick">
			<slot name="title-slot">
				<div class="title-arrow">
					<Icon v-show="showArrow" class="title-arrow__icon" :class="{
						'is-expanded': show && value
					}" type="arrow-right"></Icon>
				</div>
				<div class="title-text">{{title}}</div>
			</slot>
		</div>
		<div
			v-show="show"
			ref="wrapper"
			:class="wrapperClasses"
			class="wind-collapse__wrapper"
			@transitionend="transitionend"
			@webkitTransitionEnd="transitionend"
		>
			<div ref="content" class="wind-collapse__content" :class="contentClasses">
				<slot></slot>
			</div>
		</div>
	</div>
</template>

<script type="text/babel">
/**
 * Collapse by shang 2020/10/13
 * @desc Collapse 折叠组件
 * @params value[Boolean] 开启/关闭
 * @params title[String] 标题
 * @params disabled[Boolean] 禁用
 * @params showArrow[Boolean] 显示箭头 默认显示
 * @params autoScrollTop[Boolean] 点击展开时自动滚动至顶部 默认开启
 *
 * @slot defalut 内容插槽
 * @slot title-slot 标题插槽
 */
import Icon from '../icon'
export default {
	name: 'w-collapse',
	components: {
		Icon
	},
	inject: {
		isInView: {
			default: null
		},
		doScrollTop: {
			default: null
		}
	},
	props: {
		value: Boolean,
		title: String,
		disabled: Boolean,
		showArrow: {
			type: Boolean,
			default: true
		},
		contentHeight: String,
		fullScreen: Boolean,
		autoScrollTop: {
			type: Boolean,
			default: true
		}
	},
	data () {
		return {
			show: false,
			wrapperAnimateFlag: false
		}
	},
	computed: {
		collapseClasses () {
			return {
				'is-fullScreen': this.fullScreen
			}
		},
		wrapperClasses () {
			return {
				'is-fullScreen': this.fullScreen,
				'is-flex': this.contentHeight,
				'is-animate': this.wrapperAnimateFlag && !this.disabled
			}
		},
		contentClasses () {
			return {
				'is-flex': this.contentHeight
			}
		}
	},
	mounted () {
		window.addEventListener('resize', this.resize)
		this.setWrapperAnimate()
	},
	destroyed () {
		window.removeEventListener('resize', this.resize)
	},
	updated () {
		if (this.value) {
			this.resize()
		}
	},
	watch: {
		value: {
			immediate: true,
			handler (val) {
				if (val) {
					this.show = true
					this.resize()
				} else {
					this.close()
				}
			}
		}
	},
	methods: {
		onTitleClick () {
			if (this.disabled) {
				return false
			}
			this.$emit('input', !this.value)
			this.$nextTick(() => {
				if (this.value && this.isInView && this.doScrollTop && this.autoScrollTop) {
					setTimeout(() => {
						const isInView = this.isInView(this.$el)
						if (!isInView) {
							this.doScrollTop(this.$el.offsetTop)
						}
					}, 350)
				}
			})
		},
		transitionend () {
			if (!this.value) {
				this.show = false
			}
		},
		resize () {
			if (this.disabled && !this.contentHeight) {
				return false
			}
			this.$nextTick(() => {
				const { wrapper, content } = this.$refs
				const height = this.contentHeight ? this.contentHeight : `${content.clientHeight}px`
				this.$fxUtils.fxRequestAnimationFrame(function () {
					wrapper.style.height = height
				})
			})
		},
		close () {
			this.$nextTick(() => {
				const { wrapper } = this.$refs
				this.$fxUtils.fxRequestAnimationFrame(function () {
					wrapper.style.height = 0
				})
			})
		},
		setWrapperAnimate () {
			this.wrapperAnimateFlag = true
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '../../style/varsty.styl'
.wind-collapse {
	background-color: $wind-collapse-background-color
	margin-top:4px
	position: relative
	padding-top: 4px;
	&.is-fullScreen {
		flex: 1
		display: flex
		flex-direction: column
	}
	&__title {
		display: flex;
		flex-direction: row;
		height: 36px;
		align-items: center;
		font-size: 12px;
		font-weight: 700;
		position:relative
		cursor: pointer
		.title-text {
			flex: 1;
		}
		.title-arrow {
			width: 20px;
			&__icon {
				width: 10px
				height:10px
				transition: transform 0.3s;
				&.is-expanded {
					transform: rotate(90deg);
				}
			}
		}
		&.is-expanded::after {
			content: ' '
			position: absolute
			box-sizing:border-box
			right: 0
			bottom: 0
			left: 20px
			border-bottom:1px solid $wind-collapse-bord-color
			transform:scaleY(0.5)
		}
		&.is-disabled {
			cursor: unset
		}
	}
	&__wrapper {
		overflow:hidden
		padding-left: 20px;
		padding-top 10px
		&.is-fullScreen {
			flex: 1
		}
		&.is-flex {
			display: flex
		}
		&.is-animate {
			transition:height 0.3s ease-in-out
			will-change:height
		}
	}
	&__content {
		&.is-flex {
			flex: 1
		}
	}
}
</style>
