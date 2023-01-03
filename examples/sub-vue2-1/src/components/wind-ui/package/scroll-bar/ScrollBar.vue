<template>
	<el-scrollbar class="wind-scroll-bar" :style="styles" :class="classes" :wrapClass="wrapClass">
		<slot></slot>
	</el-scrollbar>
</template>
<script>
export default {
	name: 'wind-scroll-bar',
	provide () {
		return {
			isInView: (el) => {
				const wrap = this.$el.querySelector('.el-scrollbar__wrap')
				return el.offsetTop + el.clientHeight - wrap.scrollTop - wrap.clientHeight < 0
			},
			doScrollTop: (top) => {
				const wrap = this.$el.querySelector('.el-scrollbar__wrap')
				this.$fxUtils.scrollTopW({ $el: wrap, offsetTop: top, distance: 20 })
			}
		}
	},
	props: {
		scrollType: {
			type: String,
			default: 'y'
		},
		height: {
			type: String,
			default: '100%'
		},
		flex: Boolean,
		wrapClass: null
	},
	computed: {
		styles () {
			return {
				height: this.height
			}
		},
		classes () {
			return [`wind-scroll-bar-${this.scrollType}`, {
				'is-flex': this.flex
			}]
		}
	}
}
</script>
<style lang="stylus" scoped>
.wind-scroll-bar {
	flex: 1
	padding-right: 15px;
	padding-bottom: 15px;
    box-sizing: border-box;
	>>>.el-scrollbar__wrap{
		margin-right: 0px !important;
		margin-bottom: 0px !important;
		&::-webkit-scrollbar {
			display:none
		}
		&::-webkit-scrollbar-thumb {
			display:none
		}
		&::-webkit-scrollbar-track {
			display:none
		}
	}
}
.wind-scroll-bar-y {
	>>>.el-scrollbar__wrap{
		overflow-x: hidden
	}
}
.wind-scroll-bar-x {
	>>>.el-scrollbar__wrap{
		overflow-y: hidden
	}
}
</style>
<style lang="stylus">
.wind-scroll-bar {
	&.is-flex {
		>.el-scrollbar__wrap{
			display:flex
			flex-direction: column
			>.el-scrollbar__view {
				flex: 1
				display:flex
			}
		}
	}
}
</style>

