<template>
	<div class="tree-container">
		<fx-tree
			ref="tree"
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
			<template v-if="(data.treeType==='root'&&canAdd) || showTools || showCompanyTools" slot-scope="{ data, activeTreeItemId }">
				<el-popover v-if="data.treeType==='root'&&canAdd" placement="right" trigger="hover" popper-class="fx-tree-tools-popover">
					<div class="tree-node-tools-item" @click="onTreeAddClick(data)">
						<w-icon
							class="tree-tools-icon"
							type="tree-node-add"
						></w-icon>
						添加
					</div>
					<w-icon
						slot="reference"
						v-show="activeTreeItemId===data.id && data.treeType==='root' && canAdd"
						type="tree-node-tools"
						class="tree-node-tools-btn"
						pointer
						stop
					></w-icon>
				</el-popover>
				<el-popover v-if="showTools&&data.organLevel===0" placement="right" trigger="hover" popper-class="fx-tree-tools-popover">
					<div v-show="canEdit" class="tree-node-tools-item" @click="onTreeEditClick(data)">
						<w-icon
							class="tree-tools-icon"
							type="tree-node-edit"
						></w-icon>
						编辑
					</div>
					<div v-show="canAddCompany" class="tree-node-tools-item" @click="onTreeAddCompanyClick(data)">
						<w-icon
							class="tree-tools-icon"
							type="tree-node-add"
						></w-icon>
						添加
					</div>
					<div v-show="canDelete" class="tree-node-tools-item" @click="onTreeDelClick(data)">
						<w-icon
							class="tree-tools-icon"
							type="tree-node-delete"
						></w-icon>
						删除
					</div>
					<w-icon
						slot="reference"
						v-show="activeTreeItemId===data.id && (showTools && data.organLevel===0)"
						type="tree-node-tools"
						class="tree-node-tools-btn"
						pointer
						stop
					></w-icon>
				</el-popover>
				<el-popover v-if="showCompanyTools&&data.organLevel===0.5" placement="right" trigger="hover" popper-class="fx-tree-tools-popover">
					<div v-show="canEditCompany" class="tree-node-tools-item" @click="onTreeEditCompanyClick(data)">
						<w-icon
							class="tree-tools-icon"
							type="tree-node-edit"
						></w-icon>
						编辑
					</div>
					<div v-show="canDeleteCompany" class="tree-node-tools-item" @click="onTreeDelCompanyClick(data)">
						<w-icon
							class="tree-tools-icon"
							type="tree-node-delete"
						></w-icon>
						删除
					</div>
					<w-icon
						slot="reference"
						v-show="activeTreeItemId===data.id && (showCompanyTools && data.organLevel===0.5)"
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
		<createGroupDailog ref="createGroupDailog" @on-refresh="onUpdate"></createGroupDailog>
	</div>
</template>
<script>
import createDailog from './CreateCustomer.vue'
import createGroupDailog from './CreateGroup.vue'
export default {
	name: 'treeContainer',
	components: {
		createDailog,
		createGroupDailog
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
		},
		canAddCompany: {
			type: Boolean,
			default: true
		},
		canEditCompany: {
			type: Boolean,
			default: true
		},
		canDeleteCompany: {
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
		showTools () {
			return !this.readonly && (this.canAddCompany || this.canEdit || this.canDelete)
		},
		showCompanyTools () {
			return !this.readonly && (this.canEditCompany || this.canDeleteCompany)
		}
	},
	methods: {
		getTreeData () {
			return this.$fxApi('customer.getCustomTree').then(res => {
				res[0].id = '1'
				this.treeData = res
				return Promise.resolve()
			})
		},
		getTreeDataHandler () {
			return this.$fxApi('customer.getCustomTree').then(res => {
				res[0].id = '1'
				return Promise.resolve(res)
			})
		},
		onTreeAddClick (data) {
			this.$refs.createDailog.add()
		},
		onTreeAddCompanyClick (data) {
			this.$refs.createGroupDailog.add(data)
		},
		onTreeEditClick (data) {
			this.$refs.createDailog.edit(data)
		},
		onTreeEditCompanyClick (data) {
			this.$refs.createGroupDailog.edit(data)
		},
		onTreeDelClick (data) {
			this.$fxConfirm('确定删除当前客户类别？').then(() => {
				this.onCustomerTypeDelHandler(data.id, data.name).then(this.onUpdate)
			})
		},
		onTreeDelCompanyClick (data) {
			this.$fxConfirm('确定删除当前所属企业？').then(() => {
				this.onCustomerGroupDelHandler(data.id, data.name).then(this.onUpdate)
			})
		},
		onShowAllChange (flag) {
			this.$refs.tree.filter(flag)
			this.$emit('on-show-all-change', flag)
		},
		onCustomerTypeDelHandler (id, name) {
			const logger = this.$fxLogger.createInfo('basic-archives.customer-manage.customerTypeDelete', { name })
			return this.$fxApi('customerType.delete', id)({ logger }).then(res => {
				return Promise.resolve(res)
			})
		},
		onCustomerGroupDelHandler (id, name) {
			const logger = this.$fxLogger.createInfo('basic-archives.customer-manage.customerGroupDelete', { name })
			return this.$fxApi('customerGroup.delete', id)({ logger }).then(res => {
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
			if (data.treeType === 'root' || data.organLevel === 0) {
				return 'organ-customer-type'
			} else if (data.organLevel === 0.5) {
				return 'organ-customer-company'
			} else {
				return this.$fxTypeMiddleware.getCommonTypeItemById('customerOrganType')(data.organType).icon
			}
		},
		onTreeCheck (data, treeCheckData) {
			this.$emit('check', data, treeCheckData)
		},
		filterNode (value, data) {
			if (value || data.organLevel === 0 || data.organLevel === 0.5 || data.treeType === 'root') return true
			return data.enableFlag === 1
		},
		onUpdate () {
			return this.getTreeDataHandler().then(this.$refs.tree.updateTreeChild)
		},
		clearSearchInput () {
			this.$refs.tree.clearSearchInput()
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

