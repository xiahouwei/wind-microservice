<template>
	<div class="organ-manage-container">
		<filterBar ref="filterBar" @on-search="getListData" :billStateDisabled='recycleShow'></filterBar>
		<fx-list-virtual-table
			ref="listTable"
			:tableColumn="computedColumn"
			:summaryData="summaryData"
			:extraSummaryColumns="extraSummaryColumns"
			:listData.sync="tableData"
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
					<el-button class="order-btn" v-fx-auth:store-manage_out-store-order.edit-outstore type="primary" plain @click="onEditClick">编辑</el-button>
					<el-button class="order-btn" v-fx-auth:store-manage_out-store-order.delete-outstore type="danger" plain @click="onDeletClick">删除</el-button>
					<el-button class="order-btn" v-fx-auth:store-manage_out-store-order.submit-outstore type="primary" plain @click="onSubmitClick">提交</el-button>
					<el-button class="order-btn" v-fx-auth:store-manage_out-store-order.back-outstore type="danger" plain @click="onReturnClick">退回</el-button>
					<el-button class="order-btn" v-fx-auth:store-manage_out-store-order.check-outstore type="primary" plain @click="onCheckClick">审核</el-button>
					<el-button class="order-btn" v-fx-auth:store-manage_out-store-order.uncheck-outstore type="danger" plain @click="onUncheckClick">反审</el-button>
					<el-button class="order-btn" v-fx-auth:store-manage_out-store-order.recheck-outstore type="primary" plain @click="onRecheckClick">复审</el-button>
					<el-button class="order-btn" v-fx-auth:store-manage_out-store-order.unrecheck-outstore type="danger" plain @click="onUnrecheckClick">取消复审</el-button>
					<el-button class="order-btn" v-fx-auth:store-manage_out-store-order.export-outstore type="primary" plain @click="onExportClick">导出</el-button>
					<el-button class="order-btn" v-fx-auth:store-manage_out-store-order.print-outstore type="danger" plain @click="onPrintClick">打印</el-button>
					<el-button slot="recycle" v-fx-auth:store-manage_out-store-order.delete-outstore class="order-btn" type="danger" plain @click="onRemoveClick">删除</el-button>
					<el-button slot="recycle" v-fx-auth:store-manage_out-store-order.recover-outstore class="order-btn" type="primary" plain @click="onRecoverClick">恢复</el-button>
					<el-button slot="recycle" class="order-btn" v-fx-auth:store-manage_out-store-order.export-outstore type="primary" plain @click="onExportClick">导出</el-button>
					<el-button slot="history" class="order-btn" v-fx-auth:store-manage_out-store-order.export-outstore type="primary" plain @click="onExportClick">导出</el-button>
					<el-button slot="history" class="order-btn" v-fx-auth:store-manage_out-store-order.print-outstore type="danger" plain @click="onPrintClick">打印</el-button>
				</fx-list-btn-tools>
			</div>
			<div slot="btn-tools-right" class="tools-right">
				<el-button type="primary" v-fx-auth:store-manage_out-store-order.add-outstore slot="reference" @click="onCreateClick">新建</el-button>
			</div>
		</fx-list-virtual-table>
		<check-err-info ref="checkErrInfo"></check-err-info>
		<uncheck-order-info ref="uncheckOrderInfo" billType="OutStore"></uncheck-order-info>
	</div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import filterBar from './FilterBar.vue'
import FxListStateTag from '@/components/common/Fx-list-state-tag.vue'
import checkErrInfo from '@/components/common/Fx-check-err-info.vue'
import uncheckOrderInfo from '@/components/common/Fx-uncheck-order-info.vue'
export const BILL_TYPE = 'OutStore'
export default {
	name: 'listContainer',
	components: {
		filterBar,
		checkErrInfo,
		uncheckOrderInfo
	},
	data () {
		return {
			tableColumnMap: {
				sysBillCode: {
					prop: 'sysBillCode',
					label: '系统单号',
					required: true,
					sortable: true,
					width: '140px',
					fxRender: this.sysBillCodeRender
				},
				businessDate: {
					prop: 'businessDate',
					label: '出库时间',
					required: true,
					sortable: true,
					width: '160px',
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.businessDate)
					}
				},
				organName: { prop: 'organName', label: '出库方', required: true, sortable: true, sortKey: 'organId' },
				buyerOrganStore: {
					prop: 'buyerOrganStore',
					label: '出库仓库',
					required: true,
					formatter: (row) => {
						const outHouseList = row.outHouseNames
						return Array.isArray(outHouseList) ? outHouseList.join(',') : ''
					}
				},
				billTypeName: {
					prop: 'billTypeName',
					label: '单据类型',
					required: true,
					sortable: true,
					sortKey: 'billType',
					fxRender: this.billTypeNameRender
				},
				billBizTypeName: { prop: 'billBizTypeName', label: '业务类型', required: true },
				detailAmount: { prop: 'detailAmount', label: '明细数' },
				buyerBillState: {
					prop: 'buyerBillState',
					label: '审核状态',
					required: true,
					fxRender: this.billStateRender
				},
				sumMoney: {
					prop: 'sumMoney',
					label: '出库成本总金额',
					required: true,
					fxRender: this.sumMoneyRender,
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				sumSalesTaxMoney: {
					prop: 'sumSalesTaxMoney',
					label: '含税销售总金额',
					required: true,
					summary: true,
					fxRender: this.sumSalesTaxMoneyRender,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				carriageFee: {
					prop: 'carriageFee',
					label: '整单运费',
					required: true,
					summary: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.carriageFee, this.sysMoneyPointSize)
					},
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				otherOrganName: {
					prop: 'otherOrganName',
					label: '入库方',
					required: true,
					sortable: true,
					sortKey: 'otherOrganId'
				},
				userBillCodeList: { prop: 'userBillCode', label: '手工单号', sortable: true },
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
			defaultSortParam: { businessDate: 'desc', sysBillCode: 'desc' },
			summaryData: {},
			historyVisible: false,
			extraSummaryColumns: [{
				prop: 'amount',
				label: '出库数量',
				summaryType: 'amount',
				summaryFormatter: (val) => {
					return this.$fxCommon.toFixedAutoZeroFill(val, this.sysPointSize)
				}
			}]
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize,
			sysPointSize: state => state.system.sysPointSize,
			haveMoneyPower: state => state.loginer.haveMoneyPower,
			haveCostPower: state => state.loginer.haveCostPower
		}),
		...mapGetters(['mainTableColumnVisibleGetter']),
		billTypeState () {
			return (val, key) => {
				return this.$fxTypeMiddleware.getCommonTypeItemById('outStoreBillType')(val)[key]
			}
		},
		billState () {
			return (billState, recheckState, key) => {
				return this.$fxStateMiddleware.getOrderStateById(billState, recheckState)[key]
			}
		},
		printState () {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('printState')(val)[key]
			}
		},
		computedColumn () {
			if (!this.recycleShow) {
				return this.tableColumn
			} else {
				return this.tableColumn.filter(item => {
					return item.prop !== 'buyerBillState'
				})
			}
		}
	},
	methods: {
		initTableColumn () {
			return new Promise(resolve => {
				this.tableColumn = []
				let tableColumn = this.mainTableColumnVisibleGetter(BILL_TYPE)(this.tableColumnMap)
				const moneyPower = ['sumSalesTaxMoney']
				const costPower = ['sumMoney']
				if (!this.haveMoneyPower) {
					tableColumn = tableColumn.filter(item => {
						return !moneyPower.includes(item.prop)
					})
				}
				if (!this.haveCostPower) {
					tableColumn = tableColumn.filter(item => {
						return !costPower.includes(item.prop)
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
			this.$refs.filterBar.getSelectData()
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
			const extraSumCols = this.extraSummaryColumns.map(item => item.prop)
			return {
				...this.$refs.listTable.getPaginationParams(),
				...this.$fxCommon.getSearchParams('outStoreList')(params),
				sumMoney: sumCols,
				sumDetailMoney: extraSumCols
			}
		},
		getListData () {
			return this.getListDataHandler().then(res => {
				this.$refs.listTable.setPaginationTotal(res.total)
				this.tableData = res.result
				this.summaryData = { ...res.sumMoneyMap, ...res.sumDetailMoneyMap }
				return Promise.resolve(res.result)
			})
		},
		getListDataHandler () {
			let api = ''
			if (this.recycleShow) {
				api = 'outStore.getDelPage'
			} else {
				api = 'outStore.getPage'
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
			const params = selectRows.map(item => {
				return item.id
			})
			const logger = this.$fxLogger.createInfo('store-manage.out-store-order.delete', { orderData: selectRows })
			return this.$fxApi('outStore.deleteMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh', true)
				return Promise.resolve()
			})
		},
		getOrderCode (list) {
			return list.map(item => {
				return item.sysBillCode
			}).join(',')
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
			const logger = this.$fxLogger.createInfo('store-manage.out-store-order.submit', { orderData: selectRows })
			return this.$fxApi('outStore.submitMulity')({ data: params, logger }).then(res => {
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
			const logger = this.$fxLogger.createInfo('store-manage.out-store-order.return', { orderData: selectRows })
			return this.$fxApi('outStore.returnMulity')({ data: params, logger }).then(res => {
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
			const logger = this.$fxLogger.createInfo('store-manage.out-store-order.check', { orderData: selectRows })
			return this.$fxApi('outStore.checkMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			}).catch(err => {
				if (err.code === 1) {
					const errMessage = this.$fxUtils.JSONparse(err.message) || []
					this.$refs.checkErrInfo.open(errMessage)
				} else if (err.code === 3) {
					const errMessage = this.$fxUtils.JSONparse(err.message) || []
					this.$refs.uncheckOrderInfo.open(errMessage)
				} else {
					return this.$fxMessage.error(err.message || '审核失败，请稍后再试')
				}
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
			const logger = this.$fxLogger.createInfo('store-manage.out-store-order.uncheck', { orderData: selectRows })
			return this.$fxApi('outStore.uncheckMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			}).catch(err => {
				if (err.code === 3) {
					const errMessage = this.$fxUtils.JSONparse(err.message) || []
					this.$refs.uncheckOrderInfo.open(errMessage)
				} else {
					return this.$fxMessage.error(err.message || '反审失败，请稍后再试')
				}
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
			const logger = this.$fxLogger.createInfo('store-manage.out-store-order.recheck', { orderData: selectRows })
			return this.$fxApi('outStore.recheckMulity')({ data: params, logger }).then(res => {
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
			const logger = this.$fxLogger.createInfo('store-manage.out-store-order.unrecheck', { orderData: selectRows })
			return this.$fxApi('outStore.unrecheckMulity')({ data: params, logger }).then(res => {
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
			const logger = this.$fxLogger.createInfo('store-manage.out-store-order.exportMulity', { orderData: selectRows })
			return this.$fxApi('outStore.exportMulity')({ data: params, logger }).then(res => {
				this.$fxUtils.downloadFile(res)
			})
		},
		onEditClick () {
			this.$refs.listTable.getSingleSelectedRow().then(res => {
				this.$emit('on-edit', res.id)
			})
		},
		onTableRowDbclick (item) {
			return this.$emit('on-edit', item.id)
		},
		billStateRender (h, { row }) {
			return <FxListStateTag
				icon={this.billState(row.billState, row.recheckState, 'icon')}
				label={this.billState(row.billState, row.recheckState, 'label')}
			></FxListStateTag>
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
			const logger = this.$fxLogger.createInfo('store-manage.out-store-order.recover', { orderData: selectRows })
			return this.$fxApi('outStore.restoreMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh', true)
				return Promise.resolve()
			})
		},
		onRemoveClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定删除所选单据？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onRemoveHandler(res)
				})
			})
		},
		onRemoveHandler (selectRows) {
			const params = selectRows.map(item => {
				return item.id
			})
			const logger = this.$fxLogger.createInfo('store-manage.out-store-order.recyclingDelete', { orderData: selectRows })
			return this.$fxApi('outStore.removeMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh', true)
				return Promise.resolve()
			})
		},
		onPrintClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定打印所选单据？',
					selectedRowsLength: res.length
				}).then(() => {
					this.$fxGoPrint('OutStore', res.map(item => item.id))
				})
			})
		},
		billClass (row) {
			switch (row.billSign) {
			case 1:
				return 'fx-default-font'
			case 2:
				return 'fx-warn-font'
			default:
				return ''
			}
		},
		sysBillCodeRender (h, { row }) {
			return <span class={['fx-list-table__cell-span', this.billClass(row)]}>{row.sysBillCode}</span>
		},
		sumMoneyRender (h, { row }) {
			return <span class={['fx-list-table__cell-span', this.billClass(row)]}>{this.$fxCommon.toFixedAutoZeroFill(row.sumMoney, this.sysMoneyPointSize)}</span>
		},
		sumSalesTaxMoneyRender (h, { row }) {
			return <span class={['fx-list-table__cell-span', this.billClass(row)]}>{this.$fxCommon.toFixedAutoZeroFill(row.sumSalesTaxMoney, this.sysMoneyPointSize)}</span>
		},
		printStateRender (h, { row }) {
			return <FxListStateTag
				icon={this.printState(row.isPrint, 'icon')}
				label={this.printState(row.isPrint, 'label')}
			></FxListStateTag>
		},
		billTypeNameRender (h, { row }) {
			return <span class={['fx-list-table__cell-span', this.billClass(row)]}>{row.billTypeName}</span>
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
