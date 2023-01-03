<template>
	<div class="tree-container">
		<fx-page-header title="货架"></fx-page-header>
		<div class="tree-content">
			<fx-tree
				ref="organTree"
				:treeData="treeData"
				:filterNode="filterNode"
				showTreeNodeIcon
				:treeNodeIcon="getTreeNodeIcon"
				:showCheckbox="showCheckbox"
				:showTreeWidthExtendBtn="showTreeWidthExtendBtn"
				:defaultFiter="defaultFiter"
				:tipFormatter="tipFormatter"
				@node-click="onTreeItemClick"
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
						<div v-show="canAddComputed(data)" class="tree-node-tools-item" @click="onTreeAddClick(data)">
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
							v-show="activeTreeItemId===data.id"
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
		</div>
		<createRack ref="createRack" @on-update="onUpdate"></createRack>
	</div>
</template>
<script>
import createRack from './CreateRack.vue'
export const apiName = 'storageManage'
export default {
	name: 'treeRack',
	components: {
		createRack
	},
	props: {
		readonly: Boolean,
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
	computed: {
		canAddComputed () {
			return data => {
				return data.organType === '3' && this.canAdd
			}
		},
		canEditComputed () {
			return data => {
				return !data.organType && this.canEdit
			}
		},
		canDeleteComputed () {
			return data => {
				return !data.organType && this.canDelete
			}
		},
		showTools () {
			return data => {
				return !this.readonly && (this.canAddComputed(data) || this.canEditComputed(data) || this.canDeleteComputed(data)) && data.treeType !== 'root' && this.hasRelated(data)
			}
		},
		hasRelated () {
			return data => {
				return data.related === 1
			}
		}
	},
	methods: {
		getTreeData () {
			return this.$fxApi(`${apiName}.getRackTree`).then(res => {
				this.treeData = res
				return Promise.resolve()
			})
		},
		getTreeDataHandler () {
			return this.$fxApi(`${apiName}.getRackTree`)
		},
		onTreeEditClick (data) {
			this.getRack(data).then(this.$refs.createRack.edit)
		},
		getRack (data) {
			return this.$fxApi(`${apiName}.getRack`, data.id)
		},
		onTreeDelClick (data) {
			this.$fxConfirm('确定删除当前货架？').then(() => {
				this.onDelHandler(data.id, data.name, data.code).then(this.onUpdate)
			})
		},
		onDelHandler (id, name, code) {
			const logger = this.$fxLogger.createInfo('basic-archives.storage-manage.deleteRack', { code, name })
			return this.$fxApi(`${apiName}.delRack`, id)({ logger }).then(res => {
				return Promise.resolve(res)
			})
		},
		onTreeAddClick (data) {
			this.$refs.createRack.add(data)
		},
		getOrganTreeLv (data) {
			if (data.treeType === 'root') {
				return ''
			} else if (!data.organType) {
				return `2-${data.id}`
			} else {
				return `${data.organLevel - 1}-${data.id}`
			}
		},
		onTreeItemClick () {
			this.$emit('on-tree-item-click')
		},
		getCurrentNode () {
			return this.$refs.organTree.getCurrentNode()
		},
		getCurrentNodeTreeLv () {
			const node = this.$refs.organTree.getCurrentNode()
			return node ? this.getOrganTreeLv(node) : ''
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
			} else if (!data.organType) {
				return 'storage-rack'
			} else {
				return this.$fxTypeMiddleware.getCommonTypeItemById('organType')(data.organType).icon
			}
		},
		clearSearchInput () {
			this.$refs.organTree.clearSearchInput()
		},
		onUpdate () {
			return this.getTreeDataHandler().then(this.$refs.organTree.updateTreeChild).then(() => {
				this.$emit('on-refresh-list')
			})
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
	overflow hidden
	.tree-content {
		display flex
		height calc(100% - 44px)
	}
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

