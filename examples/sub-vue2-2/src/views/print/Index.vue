<template>
	<div class="print-view">
		<div>ssssss{{$printstore.state.aaa}}</div>
		<el-button
			@click='onTestClick'
		>测试</el-button>
	</div>
</template>
<script>
export default {
	name: 'print',
	data () {
		return {
		}
	},
	methods: {
		onTestClick () {
			this.$printstore.commit('setA')
		}
	}
}
</script>
<style id="printStyle" title="printStyle" lang="stylus">
@import '~$assets/stylus/varsty.styl'
/*fx-print-style*/
.print-view {
	height: 100%
	overflow:auto
}
</style>

