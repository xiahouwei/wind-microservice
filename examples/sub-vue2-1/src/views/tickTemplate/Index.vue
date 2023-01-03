
<template>
	<div class="tick-design">
		<div>ssssss{{$printstore.state.aaa}}</div>
		<el-button
			@click='onTestClick'
		>测试</el-button>
	</div>
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
			window.$$windMicroStore.commit('setA')
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
