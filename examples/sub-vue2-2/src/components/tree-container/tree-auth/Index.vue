<template>
	<div class="tree-container">
		<fx-tree
			ref="tree"
			:treeData="treeData"
			:showCheckbox="showCheckbox"
			:showTreeSearchBar="showTreeSearchBar"
			:showTreeWidthExtendBtn="showTreeWidthExtendBtn"
			:defaultChecked="defaultChecked"
			@node-click="onTreeItemClick"
			@check="onTreeCheck"
		>
		</fx-tree>
	</div>
</template>
<script>
export default {
	name: 'treeContainer',
	props: {
		readonly: Boolean,
		data: {
			type: Array,
			default: () => {
				return []
			}
		},
		showCheckbox: Boolean,
		showTreeSearchBar: {
			type: Boolean,
			default: true
		},
		showTreeWidthExtendBtn: {
			type: Boolean,
			default: true
		},
		defaultChecked: {
			type: [Array, Function],
			default: () => {
				return []
			}
		}
	},
	data () {
		return {
			treeData: []
		}
	},
	watch: {
		data: {
			immediate: true,
			handler (val) {
				this.treeData = val
			}
		}
	},
	methods: {
		getTreeData () {
			return this.$fxApi('itemType.getItemTree').then(res => {
				this.treeData = res
				return Promise.resolve()
			})
		},
		onRefreshTree () {
			this.getTreeData()
		},
		onTreeItemClick (data, node) {
			const itemCodes = data.treeType === 'root' ? [] : data.children ? this.getCodeArr(data.children) : [data.code]
			this.$emit('on-tree-item-click', itemCodes)
		},
		getCodeArr (data) {
			let itemCodes = []
			if (Array.isArray(data)) {
				data.forEach(item => {
					if (item.children) {
						itemCodes = itemCodes.concat(this.getCodeArr(item.children))
					} else {
						itemCodes.push(item.code)
					}
				})
			}
			return itemCodes
		},
		getCurrentNode () {
			return this.$refs.tree.getCurrentNode()
		},
		onTreeCheck (data, treeCheckData, flag) {
			this.$emit('check', data, treeCheckData, flag)
		},
		getAllCheckedKeys () {
			return this.$refs.tree.getAllCheckedKeys(item => {
				return item.treeType !== 'root'
			})
		},
		getAllSubModuleCheckedKeys () {
			return this.$refs.tree.getAllCheckedKeys(item => item.type === 2)
		},
		clearSearchInput () {
			this.$refs.tree.clearSearchInput()
		},
		setChecked (data, checked, deep) {
			this.$refs.tree.setChecked(data, checked, deep)
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
<style lang="stylus">
.fx-tree-tools-popover {
	min-width: 90px
}
</style>

