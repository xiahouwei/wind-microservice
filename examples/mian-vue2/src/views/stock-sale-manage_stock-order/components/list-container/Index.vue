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
					<el-button v-fx-auth:stock-sale-manage_stock-order.edit-stock class="order-btn" type="primary" plain @click="onEditClick">编辑</el-button>
					<el-button v-fx-auth:stock-sale-manage_stock-order.delete-stock class="order-btn" type="danger" plain @click="onDeletClick">删除</el-button>
					<el-button v-fx-auth:stock-sale-manage_stock-order.submit-stock class="order-btn" type="primary" plain @click="onSubmitClick">提交</el-button>
					<el-button v-fx-auth:stock-sale-manage_stock-order.back-stock class="order-btn" type="danger" plain @click="onReturnClick">退回</el-button>
					<el-button v-fx-auth:stock-sale-manage_stock-order.check-stock class="order-btn" type="primary" plain @click="onCheckClick">审核</el-button>
					<el-button v-fx-auth:stock-sale-manage_stock-order.uncheck-stock class="order-btn" type="danger" plain @click="onUncheckClick">反审</el-button>
					<el-button v-fx-auth:stock-sale-manage_stock-order.recheck-stock class="order-btn" type="primary" plain @click="onRecheckClick">复审</el-button>
					<el-button v-fx-auth:stock-sale-manage_stock-order.unrecheck-stock class="order-btn" type="danger" plain @click="onUnrecheckClick">取消复审</el-button>
					<el-button v-fx-auth:stock-sale-manage_stock-order.export-stock class="order-btn" type="primary" plain @click="onExportClick">导出</el-button>
					<el-button v-fx-auth:stock-sale-manage_stock-order.send-srm class="order-btn" type="primary" plain @click="onSendSrm">发单至SRM</el-button>
					<el-button v-fx-auth:stock-sale-manage_stock-order.print-stock class="order-btn" type="danger" plain @click="onPrintClick">打印</el-button>
					<el-button v-fx-auth:stock-sale-manage_stock-order.recover-stock slot="recycle" class="order-btn" type="primary" plain @click="onRecoverClick">恢复</el-button>
					<el-button v-fx-auth:stock-sale-manage_stock-order.delete-stock slot="recycle" class="order-btn" type="danger" plain @click="onRecycleDeletClick">删除</el-button>
					<el-button v-fx-auth:stock-sale-manage_stock-order.export-stock slot="recycle" class="order-btn" type="primary" plain @click="onExportClick">导出</el-button>
					<el-button v-fx-auth:stock-sale-manage_stock-order.export-stock slot="history" class="order-btn" type="primary" plain @click="onExportClick">导出</el-button>
					<el-button v-fx-auth:stock-sale-manage_stock-order.print-stock slot="history" class="order-btn" type="danger" plain @click="onPrintClick">打印</el-button>
				</fx-list-btn-tools>
			</div>
			<div slot="btn-tools-right" class="tools-right">
				<el-button v-fx-auth:stock-sale-manage_stock-order.add-stock type="primary" slot="reference" @click="onCreateClick">新建</el-button>
			</div>
		</fx-list-virtual-table>
	</div>
</template>
<script>
import { apiName } from '../../Index.vue'
import { mapState, mapGetters } from 'vuex'
import filterBar from './FilterBar.vue'
import FxListStateTag from '@/components/common/Fx-list-state-tag.vue'
export const BILL_TYPE = 'StockOrder'
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
				organName: { prop: 'organName', label: '买方机构', required: true, sortable: true, sortKey: 'organId' },
				buyerOrganStore: {
					prop: 'buyerOrganStore',
					label: '买方仓库',
					required: true,
					formatter: (row) => {
						return row.inHouseNames ? row.inHouseNames.join('，') : ''
					}
				},
				otherOrganName: { prop: 'otherOrganName', label: '卖方机构', required: true, sortable: true, sortKey: 'otherOrganId' },
				purchasePlanName: { prop: 'purchasePlanName', label: '订货方案', sortable: true, sortKey: 'purchasePlan' },
				billBizTypeName: { prop: 'billBizTypeName', label: '业务类型' },
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
				sendFlag: {
					prop: 'sendState',
					label: '发单状态',
					fxRender: this.sendFlagRender
				},
				srmReceiveState: {
					prop: 'srmReceiveState',
					label: '接单状态',
					fxRender: this.srmReceiveStateRender
				},
				sumTaxMoney: {
					prop: 'sumTaxMoney',
					label: '含税总金额',
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
					label: '非税总金额',
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
			tableColumn: [],
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
			haveMoneyPower: state => state.loginer.haveMoneyPower
		}),
		...mapGetters(['mainTableColumnVisibleGetter']),
		billState () {
			return (billState, recheckState, key) => {
				return this.$fxStateMiddleware.getOrderStateById(billState, recheckState)[key]
			}
		},
		sendSrmState () {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('sendSrmState')(val)[key]
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
		srmReceiveState () {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('srmReceiveState')(val)[key]
			}
		},
		computedColumn () {
			if (this.recycleShow) {
				return this.tableColumn.filter(item => {
					return item.prop !== 'buyerBillState'
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
				...this.$fxCommon.getSearchParams('stockList')(params),
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
			const api = this.recycleShow ? 'getPageRecycling' : 'getPage'
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
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-order.delete', { orderData: selectRows })
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
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-order.recyclingDelete', { orderData: selectRows })
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
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-order.submit', { orderData: selectRows })
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
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-order.return', { orderData: selectRows })
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
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-order.check', { orderData: selectRows })
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
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-order.uncheck', { orderData: selectRows })
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
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-order.recheck', { orderData: selectRows })
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
			const params = selectRows.map(item => {
				return item.id
			})
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-order.unrecheck', { orderData: selectRows })
			return this.$fxApi(`${apiName}.unrecheckMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onSendSrm () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定发单至SRM所选单据？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onSendSrmHandler(res)
				})
			})
		},
		onSendSrmHandler (selectRows) {
			const params = selectRows.map(item => {
				return item.id
			})
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-order.sendSrm', { orderData: selectRows })
			return this.$fxApi(`${apiName}.sendSrmMulity`)({ data: params, logger }).then(res => {
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
			const params = selectRows.map(item => {
				return item.id
			})
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-order.recover', { orderData: selectRows })
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
		sendFlagRender (h, { row }) {
			return <FxListStateTag
				icon={this.sendSrmState(row.sendState, 'icon')}
				label={this.sendSrmState(row.sendState, 'label')}
			></FxListStateTag>
		},
		srmReceiveStateRender (h, { row }) {
			return <FxListStateTag
				icon={this.srmReceiveState(row.srmReceiveState, 'icon')}
				label={this.srmReceiveState(row.srmReceiveState, 'label')}
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
					this.$fxGoPrint('StockOrder', res.map(item => item.id))
				})
			})
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
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-order.exportMulity', { orderData: selectRows })
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
