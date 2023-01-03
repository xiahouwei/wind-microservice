<template>
	<div class="tree-container">
		<fx-tree
			ref="tree"
			:treeData="treeData"
			@node-click="onTreeItemClick"
		>
		</fx-tree>
	</div>
</template>
<script>
export default {
	name: 'bussinessTreeContainer',
	data () {
		return {
			treeData: []
		}
	},
	methods: {
		getTreeData () {
			return this.$fxApi('bussinessType.getTree').then(res => {
				this.treeData = res
				return Promise.resolve()
			})
		},
		onTreeItemClick (data, node) {
			this.$emit('on-tree-item-click', data, node)
		},
		getCurrentNode () {
			return this.$refs.tree.getCurrentNode()
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
