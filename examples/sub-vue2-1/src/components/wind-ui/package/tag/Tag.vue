<template>
	<transition name="el-zoom-in-center">
		<div class="wind-tag" @clic="handleClick" :title='this.showTitle ? this.$slots.default[0].text : false'>
			<span class="wind-tag__tag" :style='{maxWidth: maxWidth + "px"}'>
				<slot></slot>
			</span>
			<i v-if="closable && !disabled" class="wind-tag__close el-icon-close" @click="handleClose"></i>
		</div>
	</transition>
</template>
<script>
/**
 * tag by shang 2020/11/5
 * @desc tag 标签
 * @param {value}  [any] - 输入框值
 */
export default {
	name: 'w-tag',
	props: {
		closable: Boolean,
		disabled: {
			type: Boolean,
			default: false
		},
		maxWidth: {
			type: Number,
			default: 100
		},
		showTitle: {
			type: Boolean,
			default: true
		}
	},
	// @TODO
	data () {
		return {
		}
	},
	// @TODO
	computed: {
	},
	methods: {
		handleClose (event) {
			event.stopPropagation()
			this.$emit('close', event)
		},
		handleClick (event) {
			this.$emit('click', event)
		}
	}
}
</script>
<style lang="stylus" scoped>
.wind-tag {
	font-size:12px
	height: 20px
	margin: 2px 0 2px 6px;
	box-sizing: border-box;
    border-color: transparent;
    background-color: #f0f2f5;
    user-select: none;
	padding-right: 5px;
	border-width: 1px;
    border-style: solid;
    border-radius: 4px;
	background-color: #f4f4f5;
    border-color: #e9e9eb;
    color: #909399;
	display:inline-block
	position:relative
	&__tag {
		overflow:hidden
		text-overflow : ellipsis
		white-space:nowrap
		display:inline-block
	}
	&__close {
		background-color: #c0c4cc;
		color: #909399;
		margin-left: -3px;
		transform: scale(.7);
		display: inline-block;
		border-radius: 50%;
		text-align: center;
		position: relative;
		cursor: pointer;
		font-size: 12px;
		height: 16px;
		width: 16px;
		line-height: 16px;
		vertical-align: middle;
		top: -4px;
		right: -5px;
		&:hover {
			color: #FFF;
		}
	}
}
.el-zoom-in-center-enter-active,
.el-zoom-in-center-leave-active {
  transition: all .3s cubic-bezier(.55,0,.1,1);
}
.el-zoom-in-center-enter,
.el-zoom-in-center-leave-active {
  opacity: 0;
  transform: scaleX(0);
}
</style>
