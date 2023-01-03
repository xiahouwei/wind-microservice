
<template>
	<div class="tick-design">
		<div>ssssss{{$printstore.state.aaa}}</div>
		<div>ssssss{{aaa}}</div>
		<el-button
			@click='onTestClick'
		>测试</el-button>
	</div>
</template>
<script>
import { mapState } from '@wind-microservice/wind-micro-core'
export default {
	name: 'createContainer',
	data () {
		return {
		}
	},
	computed: {
		...mapState({
			aaa: 'aaa'
		})
	},
	methods: {
		onTestClick () {
			this.$printstore.commit('setA')
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
