<template>
	<div class="tree-container">
		<fx-tree
			ref="tree"
			:treeData="treeData"
			showTreeNodeIcon
			:filterNode="filterNode"
			:treeNodeIcon="getTreeNodeIcon"
			:showCheckbox="showCheckbox"
			:showTreeWidthExtendBtn="showTreeWidthExtendBtn"
			:defaultFiter="defaultFiter"
			:tipFormatter="tipFormatter"
			@node-click="onTreeItemClick"
			@check="onTreeCheck"
		>
			<template v-if="showTools(data)" slot-scope="{ data, activeTreeItemId }">
				<el-popover placement="right" trigger="hover" popper-class="fx-tree-tools-popover">
					<div v-show="canEditComputed(data)" class="tree-node-tools-item" @click="onTreeEditClick(data)">
						<w-icon
							class="tree-tools-icon"
							type="tree-node-edit"
						></w-icon>
						编辑
					</div>
					<div v-show="canAdd" class="tree-node-tools-item" @click="onTreeAddClick(data)">
						<w-icon
							class="tree-tools-icon"
							type="tree-node-add"
						></w-icon>
						添加
					</div>
					<div v-show="canDeleteComputed(data)" class="tree-node-tools-item" @click="onTreeDelClick(data)">
						<w-icon
							class="tree-tools-icon"
							type="tree-node-delete"
						></w-icon>
						删除
					</div>
					<w-icon
						slot="reference"
						v-show="activeTreeItemId===data.id && (data.treeType==='root' || data.organLevel===0)"
						type="tree-node-tools"
						class="tree-node-tools-btn"
						pointer
						stop
					></w-icon>
				</el-popover>
			</template>
			<el-checkbox
				slot="tree-bottom"
				v-model="showAll"
				size="mini"
				class="disable-checkbox"
				@change="onShowAllChange"
			>显示全部</el-checkbox>
		</fx-tree>
		<createDailog ref="createDailog" @on-refresh="onUpdate"></createDailog>
	</div>
</template>
<script>
import createDailog from './CreateSupplier.vue'
export default {
	name: 'treeContainer',
	components: {
		createDailog
	},
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
		canAdd: {
			type: Boolean,
			default: true
		},
		canEdit: {
			type: Boolean,
			default: true
		},
		canDelete: {
			type: Boolean,
			default: true
		}
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
	computed: {
		canEditComputed () {
			return data => {
				return data.treeType !== 'root' && this.canEdit
			}
		},
		canDeleteComputed () {
			return data => {
				return data.treeType !== 'root' && this.canDelete
			}
		},
		showTools () {
			return data => {
				return !this.readonly && (this.canAdd || this.canEditComputed(data) || this.canDeleteComputed(data))
			}
		}
	},
	methods: {
		getTreeData () {
			return this.$fxApi('supplier.getSupplierTree').then(res => {
				res[0].id = '1'
				this.treeData = res
				return Promise.resolve()
			})
		},
		getTreeDataHandler () {
			return this.$fxApi('supplier.getSupplierTree').then(res => {
				res[0].id = '1'
				return Promise.resolve(res)
			})
		},
		onTreeAddClick () {
			this.$refs.createDailog.add()
		},
		onTreeEditClick (data) {
			this.$refs.createDailog.edit(data)
		},
		onTreeDelClick (data) {
			if (data.children && data.children.length !== 0) {
				this.$fxMessage.warning('该类别下已经存在供货商，请先删除供货商后再删除类别')
				return false
			}
			this.$fxConfirm('确定删除当前类别？').then(() => {
				this.onSupplierDelHandler(data.id, data.name).then(this.onUpdate)
			})
		},
		onSupplierDelHandler (id, name) {
			const logger = this.$fxLogger.createInfo('basic-archives.supplier-manage.supplierTreeDelete', { name })
			return this.$fxApi('supplierType.delete', id)({ logger }).then(res => {
				return Promise.resolve(res)
			})
		},
		onRefreshTree () {
			this.getTreeData()
		},
		getTreeLv (data) {
			if (data.treeType === 'root') {
				return ''
			} else {
				return `${data.organLevel}-${data.id}`
			}
		},
		onTreeItemClick (data, node) {
			this.$emit('on-tree-item-click', this.getTreeLv(data))
		},
		getCurrentNode () {
			return this.$refs.tree.getCurrentNode()
		},
		getCurrentNodeTreeLv () {
			const node = this.$refs.tree.getCurrentNode()
			return node ? this.getTreeLv(node) : ''
		},
		getTreeNodeIcon (data) {
			if (data.treeType === 'root' || !data.organType) {
				return 'organ-supplier-type'
			} else {
				return this.$fxTypeMiddleware.getCommonTypeItemById('supplierType')(data.organType).icon
			}
		},
		onTreeCheck (data, treeCheckData) {
			this.$emit('check', data, treeCheckData)
		},
		clearSearchInput () {
			this.$refs.tree.clearSearchInput()
		},
		filterNode (value, data) {
			if (value || data.treeType === 'root' || data.organLevel === 0) return true
			return data.enableFlag === 1
		},
		onShowAllChange (val) {
			this.$refs.tree.filter(val)
			this.$emit('on-show-all-change', val)
		},
		onUpdate () {
			return this.getTreeDataHandler().then(this.$refs.tree.updateTreeChild)
		},
		onUpdateTree (treeData) {
			return this.$refs.tree.updateTreeChild(treeData)
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
.tree-node-tools-btn {
	margin-top 6px
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

