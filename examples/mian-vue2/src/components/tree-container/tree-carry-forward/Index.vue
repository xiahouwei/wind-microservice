<template>
	<div class="tree-container">
		<fx-tree
			ref="tree"
			:treeData="treeData"
			:showTreeSearchBar="false"
			@node-click="onTreeItemClick"
		>
		</fx-tree>
	</div>
</template>
<script>
export default {
	name: 'treeContainer',
	data () {
		return {
			treeData: [{
				id: '',
				name: '全部',
				children: this.$fxTypeMiddleware.getCommonTypeList('allOrganTypeSimple')
			}]
		}
	},
	methods: {
		onTreeItemClick (data, node) {
			this.$emit('on-tree-item-click')
		},
		getCurrentTreeOrganId () {
			const node = this.$refs.tree.getCurrentNode()
			return node.id || ''
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.tree-container {
	display: flex
}
</style>
