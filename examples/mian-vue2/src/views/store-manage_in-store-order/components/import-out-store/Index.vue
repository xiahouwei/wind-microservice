<template>
	<w-dialog
		v-model="dialogVisible"
		title="导入出库单生成入库"
		fullscreen
		@close="onDialogClose"
	>
		<filterBar ref="filterBar" @on-search="getListData"></filterBar>
		<fx-list-virtual-table
			ref="listTable"
			:tableColumn="tableColumn"
			:listData="tableData"
			:defaultSortParam="defaultSortParam"
			:showColumnFilterBtn="false"
			showIndex
			indexContinuous
			@on-page-change="onPageChange"
			@on-sort-change="onSortChange"
		>
			<div slot="btn-tools-left" class="tools-left">
				<fx-list-btn-tools :recycle="false">
					<el-button class="order-btn" plain @click="onCancelClick">取消</el-button>
					<el-button class="order-btn" type="primary" @click="onImportClick">确认导入</el-button>
				</fx-list-btn-tools>
			</div>
		</fx-list-virtual-table>
		<import-details ref="importDetails" @on-refresh="getListData"></import-details>
	</w-dialog>
</template>
<script>
import filterBar from './FilterBar.vue'
import importDetails from './ImportDetails.vue'
export default {
	name: 'listContainer',
	components: {
		filterBar,
		importDetails
	},
	data () {
		return {
			tableColumn: [
				{ prop: 'sysBillCode', label: '系统单号', required: true, sortable: true, width: '140px' },
				{
					prop: 'businessDate',
					label: '出库时间',
					required: true,
					sortable: true,
					width: '160px',
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.businessDate)
					}
				},
				{ prop: 'organName', label: '出库方', required: true, sortable: true, sortKey: 'organId' },
				{ prop: 'billTypeName', label: '单据类型', required: true, sortable: true, sortKey: 'billType' },
				{ prop: 'billBizTypeName', label: '业务类型', required: true },
				{ prop: 'otherOrganName', label: '入库方', required: true, sortable: true, sortKey: 'otherOrganId' },
				{ prop: 'userBillCode', label: '手工单号', sortable: true, width: '140px' },
				{ prop: 'operation', label: '操作', fxRender: this.operationRender }
			],
			tableData: [],
			dialogVisible: false,
			defaultSortParam: { businessDate: 'desc', sysBillCode: 'desc' }
		}
	},
	methods: {
		open () {
			this.tableData = []
			this.dialogVisible = true
			this.$nextTick(() => {
				this.refresh()
			})
		},
		refresh () {
			this.$refs.filterBar.initSelectData().then(this.refreshPageData)
		},
		refreshPageData () {
			this.$refs.listTable.setPaginationCurrent(1)
			this.$refs.listTable.clearSelected()
			this.getListData()
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
				sortParams: this.$refs.listTable.getSortKey()
			}
			return {
				...this.$refs.listTable.getPaginationParams(),
				...this.$fxCommon.getSearchParams('outStoreList')(params)
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
			return this.$fxApi('inStore.getOutStoreOrderPage')({ data: this.getSearchParams() })
		},
		createMulityParams (selectRows) {
			return selectRows.map(item => {
				return item.id
			})
		},
		onImportClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确认导入所选单据生成入库单？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onImportHandler(res)
				})
			})
		},
		onImportHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('store-manage.in-store-order.importOutStoreOrder', { orderData: selectRows })
			return this.$fxApi('inStore.importOutStoreOrder')({ data: params, logger }).then(this.onCancelClick)
		},
		onCancelClick () {
			this.dialogVisible = false
		},
		operationRender (h, { row }) {
			h = this.$createElement
			return <el-button
				class="order-btn"
				type="primary"
				size="mini"
				on-click={this.onImportDetailsClick(row)}
			>按明细导入</el-button>
		},
		onImportDetailsClick (row) {
			return () => {
				event.stopPropagation()
				return this.$fxApi('inStore.getOutStoreDetails', row.id).then(res => {
					const importData = {
						id: row.id,
						sysBillCode: row.sysBillCode,
						billClass: 'OutStore',
						details: res,
						inOrganId: row.otherOrganId,
						inOrganName: row.otherOrganName
					}
					this.$refs.importDetails.open(importData)
				})
			}
		},
		onDialogClose () {
			this.$emit('on-refresh')
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
</style>
