<template>
	<w-app-container class="print-view" direction="row">
		<div>ssssss{{$printstore.state.aaa}}</div>
		<el-button
			@click='onTestClick'
		>测试</el-button>
	</w-app-container>
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
			this.$printstore.setData()
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

