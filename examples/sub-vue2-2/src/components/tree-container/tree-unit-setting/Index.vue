<template>
	<div class="tree-container">
		<fx-tree
			ref="tree"
			:treeData="treeData"
			:setFirstNode="setFirstNode"
			:showTreeWidthExtendBtn="false"
			:showTreeSearchBar="false"
			@node-click="onTreeItemClick"
		>
		</fx-tree>
	</div>
</template>
<script>
export default {
	name: 'unitSettingTreeContainer',
	data () {
		return {
			treeData: this.$fxTypeMiddleware.getCommonTypeList('unitSettingBillClassList')
		}
	},
	methods: {
		onTreeItemClick (data, node) {
			this.$emit('on-tree-item-click', data, node)
		},
		setFirstNode () {
			return this.treeData[0]
		},
		setCurrentKey (key) {
			const currentData = this.treeData.find(item => item.id === key)
			this.$refs.tree && this.$refs.tree.setCurrentKey(currentData)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.tree-container {
	display: flex
	height 100%
	>>>.organ-manage-tree__content {
		min-width 185px
	}
}
</style>
