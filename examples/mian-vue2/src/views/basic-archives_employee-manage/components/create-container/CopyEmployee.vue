<template>
	<w-dialog v-model="dialogVisible" width="1200px" title="复制员工" heightFullscreen @close="close">
		<div class="copy-employee-warning fx-warn-font">注：仅复制当前员工的【基础信息】中的【所属角色】、【权限设置】、【提醒设置】</div>
		<div class="create-organ">
			<treeContainer
				ref="treeContainer"
				:data="tableTreeData"
				showAllBtn
				showCheckbox
				readonly
				:showTreeWidthExtendBtn="false"
				class="tree-container"
				@check="onTreeCheck"
			></treeContainer>
			<fx-transfer
				ref="transfer"
				v-model="listSelectIds"
				:tableColumn="tableColumn"
				:tableData="tableData"
				:filter="transferFilter"
				leftTitle="全部员工"
				rightTitle="选定员工"
			></fx-transfer>
		</div>
		<template slot="footer">
			<el-button @click="onCancelClick">取消</el-button>
			<el-button type="primary" @click="onSaveClick">保存</el-button>
		</template>
	</w-dialog>
</template>
<script>
import treeContainer from '@/components/tree-container/tree-organ-all/Index.vue'
export default {
	name: 'copy-connect',
	components: {
		treeContainer
	},
	data () {
		return {
			dialogVisible: false,
			itemDetails: {},
			tableTreeData: [],
			treeCheckedKeys: [],
			tableColumn: [
				{ prop: 'name', label: '员工名称', required: true },
				{ prop: 'organName', label: '所属机构名称', required: true },
				{
					prop: 'organType',
					label: '机构类型',
					required: true,
					formatter: (row) => {
						return this.$fxTypeMiddleware.getCommonTypeItemById('allOrganType')(row.organType).label
					}
				}
			],
			tableData: [],
			tableSearchKey: '',
			listSelectIds: []
		}
	},
	methods: {
		open (item) {
			this.itemDetails = item
			this.initOrganTree().then(this.refreshItemList).then(() => {
				this.dialogVisible = true
			})
		},
		close () {
			this.$refs.treeContainer.clearSearchInput()
		},
		onCancelClick () {
			this.dialogVisible = false
		},
		onSaveClick () {
			if (this.listSelectIds.length === 0) {
				this.$fxMessage.warning('请选择一条明细')
				return false
			}
			const logger = this.$fxLogger.createInfo('basic-archives.employee-manage.copyEmployee', { selectRows: this.$refs.transfer.getSelectRows(), name: this.itemDetails.name, code: this.itemDetails.code })
			return this.$fxApi('employee.copyEmployee', this.itemDetails.id)({ data: this.listSelectIds, logger }).then(res => {
				return Promise.resolve()
			})
		},
		initOrganTree () {
			return this.$fxApi('common.getTreeByType')({
				data: [{
					type: 'Organ',
					level: 1
				}, {
					type: 'Supplier',
					level: 1
				}, {
					type: 'Customer',
					level: 1
				}]
			}).then(res => {
				this.treeCheckedKeys = []
				this.tableTreeData = res
				return Promise.resolve()
			})
		},
		refreshItemList () {
			return this.$fxApi('employee.getEmployeeExcludeId', this.itemDetails.id).then(res => {
				this.tableData = res.filter(item => item.username !== 'admin')
				this.listSelectIds = []
				return Promise.resolve()
			})
		},
		onTreeCheck (data, { checkedKeys }) {
			this.treeCheckedKeys = checkedKeys
		},
		transferFilter (item) {
			return this.treeCheckedKeys.length === 0 || this.treeCheckedKeys.includes(item.organId)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.create-organ {
	flex: 1
	display: flex;
	flex-direction: row;
	overflow: auto;
	.tree-container {
		margin-top:21px
	}
}
.copy-employee-warning {
	height: 24px
	line-height: 24px
}
</style>
