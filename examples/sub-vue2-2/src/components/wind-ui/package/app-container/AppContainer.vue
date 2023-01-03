<template>
	<div :class="classes" class="wind-app-container">
		<slot></slot>
	</div>
</template>
<script>
/**
 * AppContaner by shang 2020/2/25
 * @desc AppContaner app页面内容容器
 * @param {String} direction 布局 column, row 垂直/水平
 */
export default {
	name: 'wind-app-container',
	props: {
		direction: {
			type: String,
			default: 'column'
		}
	},
	computed: {
		classes () {
			return [`wind-app-container__direction-${this.direction}`]
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '../../style/varsty.styl'
.wind-app-container {
	flex: 1
	display:flex
	text-align: left
	background-color: $wind-app-container-background-color
	&__direction-column {
		flex-direction: column
	}
	&__direction-row {
		flex-direction: row
	}
}
</style>
