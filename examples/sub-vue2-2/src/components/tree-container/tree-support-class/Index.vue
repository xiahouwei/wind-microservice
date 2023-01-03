<template>
	<div class="tree-container">
		<fx-tree
			ref="tree"
			:treeData="treeData"
			:setFirstNode="setFirstNode"
			@node-click="onTreeItemClick"
		>
		</fx-tree>
	</div>
</template>
<script>
const supportClassList = ['financialClass', 'bussinessType', 'inventoryProfitReason', 'outStoreReason', 'otherExpenseTypeSetting', 'takeStockClass', 'itemCustomGroup', 'invoiceType']
export default {
	name: 'supportClassTreeContainer',
	data () {
		return {
			treeData: [],
			firstNodeId: ''
		}
	},
	methods: {
		getTreeData () {
			return this.$fxApi('common.getSupportClassTree').then(res => {
				this.treeData = res
				this.firstNodeId = res[0].children[0].id
				return Promise.resolve(res[0].children[0])
			})
		},
		onTreeItemClick (data, node) {
			if (supportClassList.includes(data.id)) {
				this.$emit('on-tree-type-click', data, node)
			} else if (!data.treeType) {
				this.$emit('on-tree-item-click', data, node)
			}
		},
		getCurrentNode () {
			return this.$refs.tree.getCurrentNode()
		},
		setFirstNode () {
			return this.firstNodeId
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
