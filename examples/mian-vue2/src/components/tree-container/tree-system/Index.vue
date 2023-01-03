<template>
	<div class="tree-container">
		<fx-tree
			ref="tree"
			:treeData="treeData"
			:defaultProps="treeProps"
			:searchProps="searchProps"
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
			treeProps: {
				children: 'childrens',
				label: 'nickName'
			},
			treeData: [],
			searchProps: ['nickName', 'code']
		}
	},
	methods: {
		initTree () {
			return this.$fxApi('paramConfig.getTreeData').then(res => {
				this.treeData = res
				return Promise.resolve({ res: this.getCurrentTreeCode(res[0]), name: res[0].nickName })
			})
		},
		onTreeItemClick (data, node) {
			this.$emit('on-tree-item-click', this.getCurrentTreeCode(data), data.nickName)
		},
		getCurrentTreeCode (data) {
			return data.value.map(item => item.id)
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
