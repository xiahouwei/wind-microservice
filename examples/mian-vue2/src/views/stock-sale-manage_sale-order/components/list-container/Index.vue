<template>
	<div class="organ-manage-container">
		<filterBar ref="filterBar" @on-search="refresh" :billStateDisabled="recycleShow"></filterBar>
		<fx-list-virtual-table
			ref="listTable"
			:tableColumn="computedColumn"
			:listData.sync="tableData"
			:summaryData="summaryData"
			:fpGetListData="getListDataHandler"
			showIndex
			showSummaryTools
			indexContinuous
			:defaultSortParam="defaultSortParam"
			@on-page-change="onPageChange"
			@on-table-row-dbclick="onTableRowDbclick"
			@on-sort-change="onSortChange"
		>
			<div slot="btn-tools-left" class="tools-left">
				<fx-list-btn-tools v-model="recycleShow" history :historyVisible.sync="historyVisible" @on-recycle-change="refresh" @on-history-change="refresh">
					<el-button v-fx-auth:stock-sale-manage_sale-order.edit-sale class="order-btn" type="primary" plain @click="onEditClick">编辑</el-button>
					<el-button v-fx-auth:stock-sale-manage_sale-order.delete-sale class="order-btn" type="danger" plain @click="onDeletClick">删除</el-button>
					<el-button v-fx-auth:stock-sale-manage_sale-order.submit-sale class="order-btn" type="primary" plain @click="onSubmitClick">提交</el-button>
					<el-button v-fx-auth:stock-sale-manage_sale-order.back-sale class="order-btn" type="danger" plain @click="onReturnClick">退回</el-button>
					<el-button v-fx-auth:stock-sale-manage_sale-order.check-sale class="order-btn" type="primary" plain @click="onCheckClick">审核</el-button>
					<el-button v-fx-auth:stock-sale-manage_sale-order.uncheck-sale class="order-btn" type="danger" plain @click="onUncheckClick">反审</el-button>
					<el-button v-fx-auth:stock-sale-manage_sale-order.recheck-sale class="order-btn" type="primary" plain @click="onRecheckClick">复审</el-button>
					<el-button v-fx-auth:stock-sale-manage_sale-order.unrecheck-sale class="order-btn" type="danger" plain @click="onUnrecheckClick">取消复审</el-button>
					<el-button v-fx-auth:stock-sale-manage_sale-order.export-sale class="order-btn" type="primary" plain @click="onExportClick">导出</el-button>
					<el-button v-fx-auth:stock-sale-manage_sale-order.assign-in-sale class="order-btn" type="primary" plain @click="onAssignClick('inStoreAssign')">入库分派</el-button>
					<el-button v-fx-auth:stock-sale-manage_sale-order.assign-out-sale class="order-btn" type="primary" plain @click="onAssignClick('outStoreAssign')">出库分派</el-button>
					<el-button v-fx-auth:stock-sale-manage_sale-order.print-sale class="order-btn" type="danger" plain @click="onPrintClick">打印</el-button>
					<el-button v-fx-auth:stock-sale-manage_sale-order.recover-sale slot="recycle" class="order-btn" type="primary" plain @click="onRecoverClick">恢复</el-button>
					<el-button v-fx-auth:stock-sale-manage_sale-order.delete-sale slot="recycle" class="order-btn" type="danger" plain @click="onRecycleDeletClick">删除</el-button>
					<el-button v-fx-auth:stock-sale-manage_sale-order.export-sale slot="recycle" class="order-btn" type="primary" plain @click="onExportClick">导出</el-button>
					<el-button v-fx-auth:stock-sale-manage_sale-order.export-sale slot="history" class="order-btn" type="primary" plain @click="onExportClick">导出</el-button>
					<el-button v-fx-auth:stock-sale-manage_sale-order.print-sale slot="history" class="order-btn" type="danger" plain @click="onPrintClick">打印</el-button>
				</fx-list-btn-tools>
			</div>
			<div slot="btn-tools-right" class="tools-right">
				<el-button v-fx-auth:stock-sale-manage_sale-order.add-sale type="primary" slot="reference" @click="onCreateClick">新建</el-button>
			</div>
		</fx-list-virtual-table>
	</div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import filterBar from './FilterBar.vue'
import FxListStateTag from '@/components/common/Fx-list-state-tag.vue'
import { apiName } from '../../Index.vue'
export const BILL_TYPE = 'SaleOrder'
export default {
	name: 'listContainer',
	components: {
		filterBar
	},
	data () {
		return {
			tableColumnMap: {
				sysBillCode: { prop: 'sysBillCode', label: '系统单号', required: true, sortable: true, width: '140px' },
				businessDate: {
					prop: 'businessDate',
					label: '订货时间',
					required: true,
					sortable: true,
					width: '160px',
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.businessDate)
					}
				},
				organName: { prop: 'organName', label: '卖方机构', required: true, sortable: true, sortKey: 'organId' },
				otherOrganName: { prop: 'otherOrganName', label: '买方机构', required: true, sortable: true, sortKey: 'otherOrganId' },
				stockPlanName: { prop: 'stockPlanName', label: '订货方案', required: true, sortable: true, sortKey: 'stockPlanId' },
				billBizTypeName: { prop: 'billBizTypeName', label: '业务类型', required: true },
				urgentFlag: {
					prop: 'urgent',
					label: '加急状态',
					required: true,
					fxRender: this.urgentRender
				},
				detailAmount: { prop: 'detailAmount', label: '明细数' },
				billState: {
					prop: 'billState',
					label: '审核状态',
					required: true,
					fxRender: this.billStateRender
				},
				inAssignStatus: {
					prop: 'inAssignStatus',
					label: '入库状态',
					required: true,
					fxRender: this.inAssignRender
				},
				outAssignStatus: {
					prop: 'outAssignStatus',
					label: '出库状态',
					required: true,
					fxRender: this.outAssignRender
				},
				sumTaxMoney: {
					prop: 'sumTaxMoney',
					label: '含税销售总金额',
					required: true,
					summary: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.sumTaxMoney, this.sysMoneyPointSize)
					},
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				sumMoney: {
					prop: 'sumMoney',
					label: '非税销售总金额',
					required: true,
					summary: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.sumMoney, this.sysMoneyPointSize)
					},
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
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
				generateWay: { prop: 'generateWayName', label: '单据来源', sortable: true, sortKey: 'generateWay' },
				// { prop: 'tagKey', label: '标签' },
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
					sortable: true,
					width: '140px',
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.createDate)
					}
				}
			},
			tableColumn: [
			],
			tableData: [],
			recycleShow: false,
			summaryData: {},
			defaultSortParam: { businessDate: 'desc', sysBillCode: 'desc' },
			historyVisible: false
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize,
			haveMoneyPower: state => Number(state.loginer.haveMoneyPower)
		}),
		...mapGetters(['mainTableColumnVisibleGetter']),
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
		printState () {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('printState')(val)[key]
			}
		},
		inAssignState () {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('inAssignState')(val)[key]
			}
		},
		outAssignState () {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('outAssignState')(val)[key]
			}
		},
		computedColumn () {
			if (this.recycleShow) {
				return this.tableColumn.filter(item => {
					return item.prop !== 'billState'
				})
			} else {
				return this.tableColumn
			}
		}
	},
	methods: {
		initTableColumn () {
			return new Promise(resolve => {
				this.tableColumn = []
				let tableColumn = this.mainTableColumnVisibleGetter(BILL_TYPE)(this.tableColumnMap)
				const moneyPower = ['sumTaxMoney', 'sumMoney']
				if (!this.haveMoneyPower) {
					tableColumn = tableColumn.filter(item => {
						return !moneyPower.includes(item.prop)
					})
				}
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
			const sumCols = this.computedColumn.filter(item => !!item.summary).map(item => item.prop)
			return {
				...this.$refs.listTable.getPaginationParams(),
				...this.$fxCommon.getSearchParams('saleList')(params),
				sumMoney: sumCols
			}
		},
		getListData () {
			return this.getListDataHandler().then(res => {
				this.$refs.listTable.setPaginationTotal(res.total)
				this.tableData = res.result
				this.summaryData = res.sumMoneyMap
				return Promise.resolve(res.result)
			})
		},
		getListDataHandler () {
			let api = ''
			if (this.recycleShow) {
				api = `${apiName}.getPageRecycling`
			} else {
				api = `${apiName}.getPage`
			}
			return this.$fxApi(api)({ data: this.getSearchParams() }).then(res => {
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
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('stock-sale-manage.sale-order.delete', { orderData: selectRows })
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
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('stock-sale-manage.sale-order.recyclingDelete', { orderData: selectRows })
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
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('stock-sale-manage.sale-order.submit', { orderData: selectRows })
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
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('stock-sale-manage.sale-order.return', { orderData: selectRows })
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
			const logger = this.$fxLogger.createInfo('stock-sale-manage.sale-order.check', { orderData: selectRows })
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
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('stock-sale-manage.sale-order.uncheck', { orderData: selectRows })
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
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('stock-sale-manage.sale-order.recheck', { orderData: selectRows })
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
		onUnrecheckHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('stock-sale-manage.sale-order.unrecheck', { orderData: selectRows })
			return this.$fxApi(`${apiName}.unrecheckMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
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
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('stock-sale-manage.sale-order.recover', { orderData: selectRows })
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
		inAssignRender (h, { row }) {
			return <FxListStateTag
				icon={this.inAssignState(row.inAssignStatus, 'icon')}
				label={this.inAssignState(row.inAssignStatus, 'label')}
			></FxListStateTag>
		},
		outAssignRender (h, { row }) {
			return <FxListStateTag
				icon={this.outAssignState(row.outAssignStatus, 'icon')}
				label={this.outAssignState(row.outAssignStatus, 'label')}
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
		// tagKeyRender (h, { row }) {
		// 	return <div class="fx-ellipsis">
		// 		{row.tagKey.map(item => {
		// 			return <el-tag style="marginRight:5px">{item.label}</el-tag>
		// 		})}
		// 	</div>
		// },
		onPrintClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定打印所选单据？',
					selectedRowsLength: res.length
				}).then(() => {
					this.$fxGoPrint('SalesOrder', res.map(item => item.id))
				})
			})
		},
		onAssignClick (path) {
			this.$fxAppTabs.tabsPush({ path })
		},
		onExportClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				if (res.length > 20) {
					this.$fxMessage.warning('最多导出20条明细')
					return false
				}
				this.onExportHandler(res)
			})
		},
		onExportHandler (selectRows) {
			const params = selectRows.map(item => {
				return item.id
			})
			const logger = this.$fxLogger.createInfo('stock-sale-manage.sale-order.exportMulity', { orderData: selectRows })
			return this.$fxApi(`${apiName}.exportMulity`)({ data: params, logger }).then(res => {
				this.$fxUtils.downloadFile(res)
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
