<template>
	<div class="tree-container">
		<fx-tree
			ref="tree"
			:treeData="treeData"
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
						<w-link
							icon="tree-node-edit"
							type="default"
						>编辑</w-link>
					</div>
					<div v-show="canAdd" class="tree-node-tools-item" @click="onTreeAddClick(data)">
						<w-link
							icon="tree-node-add"
							type="default"
						>添加</w-link>
					</div>
					<div v-show="canDeleteComputed(data)" class="tree-node-tools-item" @click="onTreeDelClick(data)">
						<w-link
							icon="tree-node-delete"
							type="default"
						>删除</w-link>
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
		</fx-tree>
		<createDailog ref="createDailog" @on-refresh="onUpdate"></createDailog>
	</div>
</template>
<script>
import createDailog from './CreateItem.vue'
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
	computed: {
		canEditComputed () {
			return data => {
				return data.treeType !== 'root' && this.canEdit && this.isHand(data)
			}
		},
		canDeleteComputed () {
			return data => {
				return data.treeType !== 'root' && this.canDelete && this.isHand(data)
			}
		},
		showTools () {
			return data => {
				return !this.readonly && (this.canAdd || this.canEditComputed(data) || this.canDeleteComputed(data))
			}
		},
		isHand () {
			return data => {
				return data.sourceType === 0
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
		getTreeDataHandler () {
			return this.$fxApi('itemType.getItemTree')
		},
		onTreeAddClick (data) {
			this.$refs.createDailog.add(data)
		},
		onTreeEditClick (data) {
			this.$refs.createDailog.edit(data)
		},
		onTreeDelClick (data) {
			if (data.children && data.children.length !== 0) {
				this.$fxMessage.warning('该品项类别下已存在其他小类，不允许删除该类别')
				return false
			}
			this.$fxConfirm('确定删除当前品项类别？').then(() => {
				this.onItemTypeDelHandler(data.id, data.name).then(this.onUpdate)
			})
		},
		onItemTypeDelHandler (id, name) {
			const logger = this.$fxLogger.createInfo('basic-archives.item-manage.itemTypeDelete', { name })
			return this.$fxApi('itemType.delete', id)({ logger }).then(res => {
				this.$fxMessage.success('删除成功')
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
		onTreeCheck (data, treeCheckData) {
			this.$emit('check', data, treeCheckData)
		},
		clearSearchInput () {
			this.$refs.tree.clearSearchInput()
		},
		onUpdate () {
			return this.getTreeDataHandler().then(this.$refs.tree.updateTreeChild)
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
}
.tree-node-tools-btn {
	margin-top 6px
}
</style>
<style lang="stylus">
.fx-tree-tools-popover {
	min-width: 90px
}
</style>

