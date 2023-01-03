<template>
	<div class="tree-container">
		<fx-tree
			ref="organTree"
			:treeData="treeData"
			:filterNode="showAllBtn ? filterNode : null"
			showTreeNodeIcon
			:treeNodeIcon="getTreeNodeIcon"
			:showCheckbox="showCheckbox"
			:showTreeWidthExtendBtn="showTreeWidthExtendBtn"
			:defaultFiter="defaultFiter"
			:tipFormatter="tipFormatter"
			@node-click="onTreeItemClick"
			@check="onTreeCheck"
		>
		<el-checkbox
			v-if="showAllBtn"
			slot="tree-bottom"
			v-model="showAll"
			size="mini"
			class="disable-checkbox"
			@change="onShowAllChange"
		>显示全部</el-checkbox>
		</fx-tree>
	</div>
</template>
<script>
export default {
	name: 'treeOrgan',
	props: {
		readonly: Boolean,
		data: {
			type: Array,
			default: () => {
				return []
			}
		},
		showCheckbox: Boolean,
		showTreeWidthExtendBtn: {
			type: Boolean,
			default: true
		},
		showAllBtn: Boolean
	},
	data () {
		return {
			treeData: [],
			showAll: false
		}
	},
	watch: {
		data: {
			immediate: true,
			handler (val) {
				if (val[0]) {
					val[0].enableFlag = 1
				}
				this.treeData = val
			}
		}
	},
	methods: {
		getTreeData () {
			return this.$fxApi('organ.getOrganTree').then(res => {
				this.treeData = res
				return Promise.resolve()
			})
		},
		onRefreshTree () {
			this.getTreeData()
		},
		getOrganTreeLv (data) {
			if (data.treeType === 'root') {
				return ''
			} else if (data.organLevel === 0.5) {
				return `0.5-${data.id}`
			} else if (!data.organType) {
				return `0-${data.id}`
			} else {
				return `${data.organLevel}-${data.id}`
			}
		},
		getOrganType (data) {
			if (data.treeType === 'root') {
				switch (data.id) {
				case '123456':
					return 'Organ'
				case '5':
					return 'Supplier'
				case '6':
					return 'Customer'
				}
				return ''
			} else {
				switch (data.organType) {
				case '1':case '2':
					return 'Organ'
				case '5':
					return 'Supplier'
				case '6':
					return 'Customer'
				}
			}
			if (data.organLevel === 0.5) return 'Customer'
			if (data.fatherId) return 'Organ'
			if (this.treeData[0].children[0].children.includes(data)) return 'Organ'
			if (this.treeData[0].children[1].children.includes(data)) return 'Supplier'
			if (this.treeData[0].children[2].children.includes(data)) return 'Customer'
		},
		onTreeItemClick (data, node) {
			this.$emit('on-tree-item-click', this.getOrganTreeLv(data))
		},
		getCurrentNode () {
			return this.$refs.organTree.getCurrentNode()
		},
		getCurrentNodeTreeLv () {
			const node = this.$refs.organTree.getCurrentNode()
			return node ? this.getOrganTreeLv(node) : ''
		},
		getCurrentNodeOrganType () {
			const node = this.$refs.organTree.getCurrentNode()
			return node ? this.getOrganType(node) : ''
		},
		filterNode (value, data) {
			if (value) return true
			return data.enableFlag === 1
		},
		onShowAllChange (flag) {
			this.$refs.organTree.filter(flag)
			this.$emit('on-show-all-change', flag)
		},
		getTreeNodeIcon (data) {
			if (data.treeType === 'root') {
				return 'organ-type-group'
			} else if (data.organLevel === 0.5) {
				return 'organ-customer-company'
			} else if (!data.organType) {
				return 'organ-type-region'
			} else {
				return this.$fxTypeMiddleware.getCommonTypeItemById('allOrganType')(data.organType).icon
			}
		},
		getRootData () {
			return this.treeData[0]
		},
		onTreeCheck (data, treeCheckData) {
			this.$emit('check', data, treeCheckData)
		},
		clearSearchInput () {
			this.$refs.organTree.clearSearchInput()
		},
		defaultFiter () {
			return this.showAll
		},
		tipFormatter (data) {
			const code = data.code ? `(${data.code})` : ''
			return `${data.name}${code}`
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.tree-container {
	display: flex
	.disable-checkbox {
		margin-left: 10px
		&>>>.el-checkbox__label {
			font-size: 12px
		}
	}
}
.fx-tree-tools-popover {
	.tree-node-tools-item {
		font-size: 12px
		height: 24px;
		line-height: 24px;
		display: flex;
		align-items: center;
		cursor: pointer
		&:hover {
			color: $fxDefaultColor
		}
		.tree-tools-icon {
			width: 20px
			height: 20px
			margin-right: 5px
		}
	}
}
</style>
<style lang="stylus">
.fx-tree-tools-popover {
	min-width: 90px
}
</style>

