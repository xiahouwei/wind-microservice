
<template>
	<w-app-container class="tick-design">
		<div>ssssss{{$printstore.state.aaa}}</div>
		<el-button
			@click='onTestClick'
		>测试</el-button>
	</w-app-container>
</template>
<script>
export default {
	name: 'createContainer',
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
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.tick-design {
	height: 100%;
    overflow: auto
	width: 100%
}
</style>
