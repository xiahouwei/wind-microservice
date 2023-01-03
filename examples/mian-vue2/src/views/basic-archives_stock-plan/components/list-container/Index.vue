<template>
	<div class="organ-manage-container">
		<filterBar ref="filterBar" @on-search="refresh" :billStateDisabled="recycleShow"></filterBar>
		<fx-list-virtual-table
			ref="listTable"
			:tableColumn="tableColumn"
			:listData.sync="tableData"
			:fpGetListData="getListDataHandler"
			showIndex
			indexContinuous
			:defaultSortParam="defaultSortParam"
			@on-page-change="onPageChange"
			@on-table-row-dbclick="onTableRowDbclick"
			@on-sort-change="onSortChange"
		>
			<div slot="btn-tools-left" class="tools-left">
				<fx-list-btn-tools v-model="recycleShow" @on-recycle-change="refresh">
					<el-button v-fx-auth:stock-sale-manage_stock-plan.edit-stock class="order-btn" type="primary" plain @click="onEditClick">编辑</el-button>
					<el-button v-fx-auth:stock-sale-manage_stock-plan.delete-stock class="order-btn" type="danger" plain @click="onDeletClick">删除</el-button>
					<el-button v-fx-auth:stock-sale-manage_stock-plan.enable-stock class="order-btn" type="primary" plain @click="onEnableClick">启用</el-button>
					<el-button v-fx-auth:stock-sale-manage_stock-plan.disable-stock class="order-btn" type="danger" plain @click="onDisableClick">停用</el-button>
					<el-button v-fx-auth:stock-sale-manage_stock-plan.check-stock class="order-btn" type="primary" plain @click="onCheckClick">审核</el-button>
					<el-button v-fx-auth:stock-sale-manage_stock-plan.uncheck-stock class="order-btn" type="danger" plain @click="onUncheckClick">反审</el-button>
					<el-button v-fx-auth:stock-sale-manage_stock-plan.recover-stock slot="recycle" class="order-btn" type="primary" plain @click="onRecoverClick">恢复</el-button>
					<el-button v-fx-auth:stock-sale-manage_stock-plan.delete-stock slot="recycle" class="order-btn" type="danger" plain @click="onRecycleDeletClick">删除</el-button>
				</fx-list-btn-tools>
			</div>
			<div slot="btn-tools-right" class="tools-right">
				<el-button v-fx-auth:stock-sale-manage_stock-plan.add-stock type="primary" slot="reference" @click="onCreateClick">新建</el-button>
			</div>
		</fx-list-virtual-table>
	</div>
</template>
<script>
import filterBar from './FilterBar.vue'
import FxListStateTag from '@/components/common/Fx-list-state-tag.vue'
export default {
	name: 'listContainer',
	components: {
		filterBar
	},
	data () {
		return {
			tableColumn: [
				{ prop: 'code', label: '方案编号', required: true, sortable: true, width: '140px' },
				{ prop: 'name', label: '方案名称', required: true, sortable: true },
				{
					prop: 'buyers',
					label: '买方机构',
					required: true,
					formatter: (row) => {
						return row.buyers.join(',')
					}
				},
				{ prop: 'beginDate', label: '起始日期', sortable: true },
				{ prop: 'endDate', label: '截止日期', sortable: true },
				{
					prop: 'planState',
					label: '审核状态',
					required: true,
					fxRender: this.planStateRender
				},
				{
					prop: 'enableFlag',
					label: '启停状态',
					required: true,
					fxRender: this.enableRender
				},
				{ prop: 'memo', label: '备注' },
				{
					prop: 'modifyUserName',
					label: '最新修改人',
					sortable: true,
					sortKey: 'modifyMan'
				},
				{
					prop: 'modifyDate',
					label: '最新修改时间',
					width: '140px',
					sortable: true,
					sortKey: 'modifyDate',
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.modifyDate)
					}
				},
				{ prop: 'createUserName', label: '创建人' },
				{
					prop: 'createDate',
					label: '创建时间',
					width: '140px',
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.createDate)
					}
				}
			],
			tableData: [],
			recycleShow: false,
			defaultSortParam: { code: 'desc' }
		}
	},
	computed: {
		enableState () {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('enableState')(val)[key]
			}
		},
		planState () {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('planState')(val)[key]
			}
		}
	},
	methods: {
		initFilterBar () {
			this.$refs.filterBar.onResetClick()
		},
		refresh () {
			this.$refs.listTable.setPaginationCurrent(1)
			this.$refs.listTable.clearSelected()
			return this.getListData()
		},
		onPageChange () {
			return this.getListData()
		},
		onSortChange () {
			return this.getListData()
		},
		getSearchParams () {
			const params = {
				...this.$refs.filterBar.getFilterParams(),
				sortParams: this.$refs.listTable.getSortKey(),
				delFlag: this.recycleShow ? 1 : 0
			}
			params.planState = this.recycleShow ? '' : params.planState
			return {
				...this.$refs.listTable.getPaginationParams(),
				...this.$fxCommon.getSearchParams('planStockList')(params)
			}
		},
		getListData () {
			return this.getListDataHandler().then(res => {
				this.$refs.listTable.setPaginationTotal(res.total)
				this.tableData = res.result
				return Promise.resolve(res.result)
			})
		},
		getListDataHandler () {
			return this.$fxApi('planStock.getPage')({ data: this.getSearchParams() }).then(res => {
				return Promise.resolve(res)
			})
		},
		onCreateClick () {
			this.$emit('on-create')
		},
		createMulityParams (selectRows) {
			return selectRows.map(item => {
				return item.id
			})
		},
		onEnableClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定启用所选方案？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onEnableHandler(res)
				})
			})
		},
		onEnableHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan.enable', { names: this.getPlanName(selectRows) })
			return this.$fxApi('planStock.enabelMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onDisableClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定停用所选方案？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onDisableHandler(res)
				})
			})
		},
		onDisableHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan.disable', { names: this.getPlanName(selectRows) })
			return this.$fxApi('planStock.disableMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onDeletClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定删除所选方案？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onDeleteHandler(res)
				})
			})
		},
		onDeleteHandler (selectRows) {
			const params = selectRows.map(item => {
				return item.id
			})
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan.delete', { names: this.getPlanName(selectRows) })
			return this.$fxApi('planStock.deleteMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onCheckClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定审核所选方案？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onCheckHandler(res)
				})
			})
		},
		onCheckHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan.check', { names: this.getPlanName(selectRows) })
			return this.$fxApi('planStock.checkMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh', false)
				return Promise.resolve()
			})
		},
		onUncheckClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定反审所选方案？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onUncheckHandler(res)
				})
			})
		},
		onUncheckHandler (selectRows) {
			const params = selectRows.map(item => {
				return item.id
			})
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan.uncheck', { names: this.getPlanName(selectRows) })
			return this.$fxApi('planStock.uncheckMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh', false)
				return Promise.resolve()
			})
		},
		onRecoverClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定恢复所选方案？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onRecoverHandler(res)
				})
			})
		},
		onRecoverHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan.recover', { names: this.getPlanName(selectRows) })
			return this.$fxApi('planStock.recoverMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh', true)
				return Promise.resolve()
			})
		},
		onRecycleDeletClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定删除所选方案？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onRecycleDeleteHandler(res)
				})
			})
		},
		onRecycleDeleteHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan.recyclingDelete', { names: this.getPlanName(selectRows) })
			return this.$fxApi('planStock.recyclingDeleteMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh', true)
				return Promise.resolve()
			})
		},
		getPlanName (list) {
			return list.map(item => {
				return item.name
			}).join(',')
		},
		onEditClick () {
			this.$refs.listTable.getSingleSelectedRow().then(row => {
				this.$refs.listTable.currentDbclickRow = row
				this.$emit('on-edit', row.id)
			})
		},
		clearSelected () {
			this.$refs.listTable.clearSelected()
		},
		onTableRowDbclick (row) {
			this.$emit('on-edit', row.id)
		},
		enableRender (h, { row }) {
			return <FxListStateTag
				icon={this.enableState(row.enableFlag, 'icon')}
				label={this.enableState(row.enableFlag, 'label')}
			></FxListStateTag>
		},
		planStateRender (h, { row }) {
			return <FxListStateTag
				icon={this.planState(row.planState, 'icon')}
				label={this.planState(row.planState, 'label')}
			></FxListStateTag>
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.organ-manage-container {
	flex: 1;
	display:flex
	flex-direction: column
	overflow: auto
	.tools-left, .tools-right {
		display:flex
		flex-direction: row
		align-items: center
	}
	.tools-left {
		flex: 1
	}
}
</style>
