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
	name: 'treeContainer',
	data () {
		return {
			treeData: []
		}
	},
	methods: {
		getTreeData () {
			return this.$fxApi('account.getAccountTree').then(res => {
				this.treeData = res
				return Promise.resolve()
			})
		},
		onTreeItemClick (data, node) {
			this.$emit('on-tree-item-click', this.getCurrentTreeOrganId())
		},
		getCurrentNode () {
			return this.$refs.tree.getCurrentNode()
		},
		getCurrentTreeOrganId () {
			const node = this.$refs.tree.getCurrentNode()
			return (node && node.organId) || ''
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
