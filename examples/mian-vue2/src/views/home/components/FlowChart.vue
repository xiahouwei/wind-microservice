<template>
	<fx-card class="flow-chart-container">
		<img src="~images/img/home/home-flow.png" class="flow-chart-content">
	</fx-card>
</template>
<script>
export default {
	name: 'flowChart',
	data () {
		return {
		}
	},
	methods: {
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.flow-chart-container {
	flex 2
	display flex
	justify-content center
	align-items center
	width 100%
	padding 0
	margin-top 15px
	min-height 180px
	@media screen and (max-width: 1840px) {
    .flow-chart-content {
			width 1200px
		}
	}
	@media screen and (min-width: 1840px) {
		.flow-chart-content {
			width 1330px
		}
}
}
</style>

