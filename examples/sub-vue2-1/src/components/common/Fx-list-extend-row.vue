<template>
	<el-form class="fx-list-extend-row" label-position="left" inline size="mini" :label-width="labelWidth">
		<slot></slot>
	</el-form>
</template>
<script>
export default {
	name: 'fx-list-extend-row',
	props: {
		labelWidth: {
			type: String,
			default: '100px'
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.fx-list-extend-row {
}
</style>

