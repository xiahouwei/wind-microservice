<template>
	<w-dialog
		v-model="dialogVisible"
		width="1200px"
		title="管理下属"
		heightFullscreen
		:beforeClose="onBeforeClose"
		@close="close"
	>
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
				leftTitle="全部下属"
				rightTitle="选定下属"
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
	name: 'connect-subordinate',
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
						return row.organType ? this.$fxTypeMiddleware.getCommonTypeItemById('allOrganType')(row.organType).label : this.$fxTypeMiddleware.getCommonTypeItemById('userType')('adminUser').organTypeLabel
					}
				}
			],
			tableData: [],
			listSelectIds: [],
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			rowDataVerification: this.$fxUtils.fxDataVerification()
		}
	},
	methods: {
		open (item) {
			this.itemDetails = item
			this.initOrganTree().then(this.refreshConnectList).then(() => {
				this.fxDataVerification.resetData(this.listSelectIds)
				this.dialogVisible = true
				this.$nextTick(() => {
					const selectRows = this.$refs.transfer.getSelectRows()
					this.rowDataVerification.resetData(selectRows)
				})
			})
		},
		close () {
			this.$refs.treeContainer.clearSearchInput()
		},
		onCancelClick () {
			this.verificationSelected().then(() => {
				this.$refs.treeContainer.clearSearchInput()
				this.dialogVisible = false
			})
		},
		onSaveClick () {
			if (this.fxDataVerification.checkData(this.listSelectIds)) {
				this.$fxMessage.success('操作成功！')
				return Promise.resolve(this.listSelectIds)
			} else {
				const selectRows = this.$refs.transfer.getSelectRows()
				const logger = this.$fxLogger.createInfo('basic-archives.employee-manage.manageSubordinate', this.createLoggerParams(this.rowDataVerification.getOriginData(), selectRows))
				return this.$fxApi('employee.saveSubordinates', this.itemDetails.id)({ data: this.listSelectIds, logger }).then(res => {
					this.fxDataVerification.resetData(this.listSelectIds)
					this.rowDataVerification.resetData(selectRows)
					return Promise.resolve()
				})
			}
		},
		createLoggerParams (pre, cur) {
			return {
				pre,
				cur,
				name: this.itemDetails.name,
				code: this.itemDetails.code
			}
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
		refreshConnectList () {
			return this.$fxApi('employee.getSubordinates', this.itemDetails.id).then(res => {
				this.tableData = res
				this.listSelectIds = res.filter(item => {
					return item.related === '1'
				}).map(item => {
					return item.id
				})
				return Promise.resolve()
			})
		},
		onTreeCheck (data, { checkedKeys }) {
			this.treeCheckedKeys = checkedKeys
		},
		transferFilter (item) {
			return this.treeCheckedKeys.length === 0 || this.treeCheckedKeys.includes(item.orgaId)
		},
		verificationSelected () {
			return this.fxDataVerification.checkComfirm(this.listSelectIds)
		},
		onBeforeClose (close) {
			this.verificationSelected().then(close)
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
</style>
