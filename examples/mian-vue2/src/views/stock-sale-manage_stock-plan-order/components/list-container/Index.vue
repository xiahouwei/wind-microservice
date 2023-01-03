<template>
	<div class="organ-manage-container">
		<filterBar ref="filterBar" @on-search="refresh" :billStateDisabled="recycleShow"></filterBar>
		<fx-list-virtual-table
			ref="listTable"
			:tableColumn="computedColumn"
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
				<fx-list-btn-tools v-model="recycleShow" history :historyVisible.sync="historyVisible" @on-recycle-change="refresh" @on-history-change="refresh">
					<el-button v-fx-auth:stock-sale-manage_stock-plan-order.mergeBill-stock-plan class="order-btn" type="primary" plain @click="onMergeClick">合并单据</el-button>
					<el-button v-fx-auth:stock-sale-manage_stock-plan-order.edit-stock-plan class="order-btn" type="primary" plain @click="onEditClick">编辑</el-button>
					<el-button v-fx-auth:stock-sale-manage_stock-plan-order.delete-stock-plan class="order-btn" type="danger" plain @click="onDeletClick">删除</el-button>
					<el-button v-fx-auth:stock-sale-manage_stock-plan-order.submit-stock-plan class="order-btn" type="primary" plain @click="onSubmitClick">提交</el-button>
					<el-button v-fx-auth:stock-sale-manage_stock-plan-order.back-stock-plan class="order-btn" type="danger" plain @click="onReturnClick">退回</el-button>
					<el-button v-fx-auth:stock-sale-manage_stock-plan-order.check-stock-plan class="order-btn" type="primary" plain @click="onCheckClick">审核</el-button>
					<el-button v-fx-auth:stock-sale-manage_stock-plan-order.uncheck-stock-plan class="order-btn" type="danger" plain @click="onUncheckClick">反审</el-button>
					<el-button v-fx-auth:stock-sale-manage_stock-plan-order.recheck-stock-plan class="order-btn" type="primary" plain @click="onRecheckClick">复审</el-button>
					<el-button v-fx-auth:stock-sale-manage_stock-plan-order.unrecheck-stock-plan class="order-btn" type="danger" plain @click="onUnrecheckClick">取消复审</el-button>
					<el-button v-fx-auth:stock-sale-manage_stock-plan-order.export-stock-plan class="order-btn" type="primary" plain @click="onExportClick">导出</el-button>
					<el-button v-fx-auth:stock-sale-manage_stock-plan-order.print-stock-plan class="order-btn" type="danger" plain @click="onPrintClick">打印</el-button>
					<el-button v-fx-auth:stock-sale-manage_stock-plan-order.assign-stock-plan class="order-btn" type="primary" plain @click="onAssign">分派</el-button>
					<el-button v-fx-auth:stock-sale-manage_stock-plan-order.recover-stock-plan slot="recycle" class="order-btn" type="primary" plain @click="onRecoverClick">恢复</el-button>
					<el-button v-fx-auth:stock-sale-manage_stock-plan-order.delete-stock-plan slot="recycle" class="order-btn" type="danger" plain @click="onRecycleDeletClick">删除</el-button>
					<el-button v-fx-auth:stock-sale-manage_stock-plan-order.export-stock-plan slot="recycle" class="order-btn" type="primary" plain @click="onExportClick">导出</el-button>
					<el-button v-fx-auth:stock-sale-manage_stock-plan-order.export-stock-plan slot="history" class="order-btn" type="primary" plain @click="onExportClick">导出</el-button>
					<el-button v-fx-auth:stock-sale-manage_stock-plan-order.print-stock-plan slot="history" class="order-btn" type="danger" plain @click="onPrintClick">打印</el-button>
					<el-button v-fx-auth:stock-sale-manage_stock-plan-order.edit-stock-plan class="order-btn" type="primary" plain @click="onSettingMulityClick">批量设置</el-button>
				</fx-list-btn-tools>
			</div>
			<div slot="btn-tools-right" class="tools-right">
				<el-button v-fx-auth:stock-sale-manage_stock-plan-order.add-stock-plan type="primary" slot="reference" @click="onCreateClick">新建</el-button>
			</div>
		</fx-list-virtual-table>
		<settingMulity ref='settingMulity' @refresh-list="onRefresh"></settingMulity>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import filterBar from './FilterBar.vue'
import settingMulity from './SettingMulity.vue'
import FxListStateTag from '@/components/common/Fx-list-state-tag.vue'
import { apiName } from '../../Index.vue'
export const BILL_TYPE = 'StockPlanOrder'
export default {
	name: 'listContainer',
	components: {
		filterBar,
		settingMulity
	},
	data () {
		return {
			tableColumnMap: {
				sysBillCode: { prop: 'sysBillCode', label: '系统单号', required: true, sortable: true, width: '140px' },
				businessDate: { prop: 'businessDate', label: '申请时间', required: true, sortable: true, width: '160px' },
				organName: { prop: 'organName', label: '买方机构', required: true, sortable: true, sortKey: 'organId' },
				buyerOrganStore: {
					prop: 'buyerOrganStore',
					label: '买方仓库',
					required: true,
					formatter: (row) => {
						return row.houseNames ? row.houseNames.join('，') : ''
					}
				},
				stockPlanName: { prop: 'stockPlanName', label: '订货方案', required: true },
				billBizTypeName: { prop: 'billBizTypeName', label: '业务类型', required: true },
				urgentFlag: {
					prop: 'urgentFlag',
					label: '加急状态',
					required: true,
					fxRender: this.urgentRender
				},
				detailAmount: { prop: 'detailAmount', label: '明细数' },
				buyerBillState: {
					prop: 'buyerBillState',
					label: '审核状态',
					required: true,
					fxRender: this.billStateRender
				},
				assignStatusList: {
					prop: 'assignStatus',
					label: '分派状态',
					required: true,
					fxRender: this.assignRender
				},
				billTypeName: {
					prop: 'billTypeName',
					label: '单据类型',
					required: true,
					sortable: true,
					sortKey: 'billType'
				},
				userBillCode: { prop: 'userBillCode', label: '手工单号', sortable: true },
				operateManName: { prop: 'operateManName', label: '经办人' },
				memoList: { prop: 'memo', label: '备注' },
				printState: {
					prop: 'isPrint',
					label: '打印状态',
					fxRender: this.printStateRender
				},
				modifyManName: {
					prop: 'modifyManName',
					label: '最新修改人',
					sortable: true,
					sortKey: 'modifyMan'
				},
				modifyDate: {
					prop: 'modifyDate',
					label: '最新修改时间',
					width: '140px',
					sortable: true,
					sortKey: 'modifyDate',
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.modifyDate)
					}
				},
				createManName: { prop: 'createManName', label: '创建人', sortable: true, sortKey: 'createMan' },
				createDate: {
					prop: 'createDate',
					label: '创建时间',
					width: '140px',
					sortable: true,
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.createDate)
					}
				}
			},
			tableColumn: [
			],
			tableData: [],
			recycleShow: false,
			defaultSortParam: { businessDate: 'desc', sysBillCode: 'desc' },
			historyVisible: false
		}
	},
	computed: {
		billState () {
			return (billState, recheckState, key) => {
				return this.$fxStateMiddleware.getOrderStateById(billState, recheckState)[key]
			}
		},
		urgentState () {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('urgentState')(val)[key]
			}
		},
		assignState () {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('assignState')(val)[key]
			}
		},
		printState () {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('printState')(val)[key]
			}
		},
		...mapGetters(['mainTableColumnVisibleGetter', 'getSysParams']),
		computedColumn () {
			if (this.recycleShow) {
				return this.tableColumn.filter(item => {
					return item.prop !== 'buyerBillState'
				})
			} else {
				return this.tableColumn
			}
		},
		sysAutoMergeOrder () {
			return this.getSysParams('SJXZL_STOCKPLAN_AUTO_MERGE', 'value')
		}
	},
	methods: {
		initTableColumn () {
			return new Promise(resolve => {
				this.tableColumn = []
				const tableColumn = this.mainTableColumnVisibleGetter(BILL_TYPE)(this.tableColumnMap)
				this.$nextTick(() => {
					this.tableColumn = tableColumn
					resolve()
				})
			})
		},
		initFilterBar (routeQuery) {
			this.$refs.filterBar.initFilter()
			this.$refs.filterBar.initSelect()
			return this.$refs.filterBar.getAccountingPeriod(routeQuery)
		},
		refresh () {
			this.$refs.listTable.setPaginationCurrent(1)
			this.$refs.listTable.clearSelected()
			return this.getListData()
		},
		clearSelected () {
			this.$refs.listTable.clearSelected()
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
				history: this.historyVisible
			}
			return {
				...this.$refs.listTable.getPaginationParams(),
				...this.$fxCommon.getSearchParams('stockPlanOrderList')(params)
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
			let api = ''
			if (this.recycleShow) {
				api = 'getPageRecycling'
			} else {
				api = 'getPage'
			}
			return this.$fxApi(`${apiName}.${api}`)({ data: this.getSearchParams() }).then(res => {
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
		onDeletClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定删除所选单据？',
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
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan-order.delete', { orderData: selectRows })
			return this.$fxApi(`${apiName}.deleteMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh', true)
				return Promise.resolve()
			})
		},
		onRecycleDeletClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定删除所选单据？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onRecycleDeleteHandler(res)
				})
			})
		},
		onRecycleDeleteHandler (selectRows) {
			const params = selectRows.map(item => {
				return item.id
			})
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan-order.recyclingDelete', { orderData: selectRows })
			return this.$fxApi(`${apiName}.recyclingDeleteMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh', true)
				return Promise.resolve()
			})
		},
		onSubmitClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定提交所选单据？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onSubmitHandler(res)
				})
			})
		},
		onSubmitHandler (selectRows) {
			const params = selectRows.map(item => {
				return item.id
			})
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan-order.submit', { orderData: selectRows })
			return this.$fxApi(`${apiName}.submitMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onReturnClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定退回所选单据？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onReturnHandler(res)
				})
			})
		},
		onReturnHandler (selectRows) {
			const params = selectRows.map(item => {
				return item.id
			})
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan-order.return', { orderData: selectRows })
			return this.$fxApi(`${apiName}.returnMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onCheckClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定审核所选单据？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onCheckHandler(res)
				})
			})
		},
		onCheckHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan-order.check', { orderData: selectRows })
			return this.$fxApi(`${apiName}.checkMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onUncheckClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定反审所选单据？',
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
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan-order.uncheck', { orderData: selectRows })
			return this.$fxApi(`${apiName}.uncheckMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onRecheckClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定复审所选单据？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onRecheckHandler(res)
				})
			})
		},
		onRecheckHandler (selectRows) {
			const params = selectRows.map(item => {
				return item.id
			})
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan-order.recheck', { orderData: selectRows })
			return this.$fxApi(`${apiName}.recheckMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onUnrecheckClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定取消复审所选单据？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onUnrecheckHandler(res)
				})
			})
		},
		onAssign () {
			this.$fxAppTabs.tabsPush({ path: 'stockPlanAssign' })
		},
		onUnrecheckHandler (selectRows) {
			const params = selectRows.map(item => {
				return item.id
			})
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan-order.unrecheck', { orderData: selectRows })
			return this.$fxApi(`${apiName}.unrecheckMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onExportClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				if (res.length > 20) {
					const error = '最多导出20条明细'
					this.$fxMessage.warning(error)
					return
				}
				this.onExportHandler(res)
			})
		},
		onExportHandler (selectRows) {
			const params = selectRows.map(item => {
				return item.id
			})
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan-order.exportMulity', { orderData: selectRows })
			return this.$fxApi(`${apiName}.exportMulity`)({ data: params, logger }).then(res => {
				this.$fxUtils.downloadFile(res)
			})
		},
		onSettingMulityClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$refs.settingMulity.open(res)
			})
		},
		onRefresh () {
			this.$emit('on-refresh')
		},
		onRecoverClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定恢复所选单据？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onRecoverHandler(res)
				})
			})
		},
		onRecoverHandler (selectRows) {
			const params = selectRows.map(item => {
				return item.id
			})
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan-order.recover', { orderData: selectRows })
			return this.$fxApi(`${apiName}.recoverMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh', true)
				return Promise.resolve()
			})
		},
		onEditClick () {
			this.$refs.listTable.getSingleSelectedRow().then(res => {
				this.$refs.listTable.currentDbclickRow = res
				this.$emit('on-edit', res.id)
			})
		},
		onTableRowDbclick (item) {
			this.$emit('on-edit', item.id)
		},
		billStateRender (h, { row }) {
			return <FxListStateTag
				icon={this.billState(row.billState, row.recheckState, 'icon')}
				label={this.billState(row.billState, row.recheckState, 'label')}
			></FxListStateTag>
		},
		assignRender (h, { row }) {
			return <FxListStateTag
				icon={this.assignState(row.assignStatus, 'icon')}
				label={this.assignState(row.assignStatus, 'label')}
			></FxListStateTag>
		},
		urgentRender (h, { row }) {
			return <FxListStateTag
				icon={this.urgentState(row.urgent, 'icon')}
				label={this.urgentState(row.urgent, 'label')}
			></FxListStateTag>
		},
		printStateRender (h, { row }) {
			return <FxListStateTag
				icon={this.printState(row.isPrint, 'icon')}
				label={this.printState(row.isPrint, 'label')}
			></FxListStateTag>
		},
		onPrintClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定打印所选单据？',
					selectedRowsLength: res.length
				}).then(() => {
					this.$fxGoPrint('StockPlan', res.map(item => item.id))
				})
			})
		},
		onMergeClick () {
			this.$refs.listTable.getSelectedRows().then(selectedRows => {
				if (this.sysAutoMergeOrder) {
					this.onAutoMergeHandler(selectedRows)
				} else {
					this.onHandMergeHandler(selectedRows)
				}
			})
		},
		onAutoMergeHandler (selectedRows) {
			this.$fxConfirm({
				message: '是否确定合并所选单据？',
				selectedRowsLength: selectedRows.length
			}).then(() => {
				const params = selectedRows.map(item => item.id)
				return this.$fxApi(`${apiName}.autoMergeOrder`)({ data: params }).then(res => {
					const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan-order.autoMergeBill', { mergeData: res })
					const loggerInfo = this.$fxLogger.actionInfo(logger)
					loggerInfo.success()
					this.$emit('on-refresh', true)
				})
			})
		},
		onHandMergeHandler (selectedRows) {
			if (selectedRows.length <= 1) {
				this.$fxMessage.warning('请勾选至少两条数据行！')
				return
			}
			if (!selectedRows.every(item => item.billState === 0)) {
				this.$fxMessage.warning('只有未提交的单据才能进行合并，请重新选择！')
				return
			}
			if (!selectedRows.every(item => item.organId === selectedRows[0].organId && item.stockPlanId === selectedRows[0].stockPlanId)) {
				this.$fxMessage.warning('只有待提交、相同买方、相同订货方案或均无订货方案的单据才可以合并！')
				return
			}
			const params = selectedRows.map(item => item.id)
			const codes = selectedRows.map(item => item.sysBillCode)
			const { organId } = selectedRows[0]
			const organData = {
				organId
			}
			this.$fxConfirm({
				message: '是否确定合并所选单据？',
				selectedRowsLength: selectedRows.length
			}).then(() => {
				return this.$fxApi(`${apiName}.getMergeOrder`)({ data: params }).then(res => {
					this.$emit('on-merge', res, params, organData, codes)
				})
			})
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
