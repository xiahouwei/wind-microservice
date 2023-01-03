<template>
	<div class="tree-container">
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
						v-show="activeTreeItemId===data.id && !data.organType"
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
		<createArea ref="createArea" @on-update="onUpdate"></createArea>
		<editArea ref="editArea" @on-update="onUpdate"></editArea>
	</div>
</template>
<script>
import createArea from './CreateArea.vue'
import editArea from './EditArea.vue'
export default {
	name: 'treeOrgan',
	components: {
		createArea,
		editArea
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
		getTreeDataHandler () {
			return this.$fxApi('organ.getOrganTree')
		},
		onTreeEditClick (data) {
			this.$refs.editArea.open(data)
		},
		onTreeDelClick (data) {
			const message = data.children.length !== 0
				? '该区域下已存在下级机构，删除后所有下级机构的所属区域将发生更改，是否确认删除？'
				: '确定删除当前区域？'
			this.$fxConfirm(message).then(() => {
				this.onOrganDelHandler(data.id, data.name).then(this.onUpdate)
			})
		},
		onOrganDelHandler (id, name) {
			const logger = this.$fxLogger.createInfo('basic-archives.organ-manage.organTreeDelete', { name })
			return this.$fxApi('region.regionDelete', id)({ logger }).then(res => {
				this.$fxMessage.success('删除成功')
				return Promise.resolve(res)
			})
		},
		onTreeAddClick (data) {
			this.$refs.createArea.open(data)
		},
		onRefreshTree () {
			this.getTreeData()
		},
		getOrganTreeLv (data) {
			if (data.treeType === 'root') {
				return ''
			} else if (!data.organType) {
				return `0-${data.id}`
			} else {
				return `${data.organLevel}-${data.id}`
			}
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
				return 'organ-type-region'
			} else {
				return this.$fxTypeMiddleware.getCommonTypeItemById('organType')(data.organType).icon
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
		onUpdate () {
			return this.getTreeDataHandler().then(this.$refs.organTree.updateTreeChild)
		},
		onUpdateTree (treeData) {
			return this.$refs.organTree.updateTreeChild(treeData)
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

