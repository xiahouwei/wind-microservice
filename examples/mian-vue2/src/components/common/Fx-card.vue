<template>
	<div class="fx-card-container">
		<div class="header-container" v-if="(title || iconType) && !$slots.header">
			<div class="title-container" :class="titleClass">
				<w-icon verticalAlign v-if="iconType" :type="iconType" class="header-icon"></w-icon>
				<span>{{title}}</span>
				<slot name="title-left"></slot>
				<div v-if="showUnderLine" class="under-line"></div>
			</div>
			<div class="title-right">
				<slot name="title-right"></slot>
			</div>
		</div>
		<slot name="header"></slot>
		<slot></slot>
	</div>
</template>
<script>
/**
	 * @name fx-card
	 * @desc 卡片组件
	 * @author cai
	 * @date 2021/11/11
	 *
	 * @param {String} iconType - 标题前面的icon图标
	 * @param {String} title - 标题
	 * @param {String} titleSize - 标题样式大小['large', 'normal', 'small]
	 * @param {Boolean} showUnderLine - 是否显示标题下划线，默认显示
	 */
export default {
	name: 'fx-card',
	props: {
		iconType: String,
		title: String,
		titleSize: {
			type: String,
			default: 'large',
			validator: function (value) {
				return ['large', 'normal', 'small'].indexOf(value) !== -1
			}
		},
		showUnderLine: {
			type: Boolean,
			default: true
		}
	},
	computed: {
		titleClass () {
			return [`title-container_${this.titleSize}`]
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.fx-card-container {
	box-sizing border-box
	padding 10px 15px 15px
	border-radius 10px
	background-color #fff
	// box-shadow 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
	overflow hidden
	.header-container {
		display flex
		justify-content space-between
		flex-direction row
	}
	.title-container {
		position relative
		display flex
		align-items center
		color $fxBlack1
		font-weight bold
		&_large {
			line-height 40px
			font-size 18px
			.header-icon {
				width 32px
				height 32px
				margin-right 10px
			}
		}
		&_normal {
			line-height 30px
			font-size 14px
			.header-icon {
				width 20px
				height 20px
				margin-right 10px
			}
		}
		&_small {
			line-height 30px
			font-size 12px
			.header-icon {
				width 14px
				height 14px
				margin-right 6px
			}
		}
		.under-line{
			position absolute
			bottom -4px
			left 0
			width 20px
			height 4px
			border-radius 2px
			background-color $fxBlue5
		}
	}
	.title-right {
		display flex
		align-items center
	}
}
</style>

