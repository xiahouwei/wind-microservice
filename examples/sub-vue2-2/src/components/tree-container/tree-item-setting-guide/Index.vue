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
	name: 'itemSettingTreeContainer',
	props: {
		visibleFlag: Boolean,
		treeData: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	watch: {
		visibleFlag: {
			immediate: true,
			handler (val) {
				if (val) {
					this.setCurrentKey()
				}
			}
		}
	},
	methods: {
		onTreeItemClick (data, node) {
			this.$emit('on-tree-item-click', data, node)
		},
		setFirstNode () {
			return this.treeData[0]
		},
		setCurrentKey () {
			this.$refs.tree && this.$refs.tree.setCurrentKey(this.treeData[0])
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
