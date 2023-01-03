<template>
	<div class="order-manage-container">
		<filterBar ref="filterBar" @on-search="refreshPageData"></filterBar>
		<fx-list-virtual-table
			ref="listTable"
			:tableColumn="tableColumn"
			:listData.sync="tableData"
			:summaryData="summaryData"
			:defaultSortParam="defaultSortParam"
			:fpGetListData="getListDataHandler"
			showIndex
			showSummaryTools
			indexContinuous
			@on-page-change="onPageChange"
			@on-table-row-dbclick="onTableRowDbclick"
			@on-sort-change="onSortChange"
		>
			<div slot="btn-tools-left" class="tools-left">
				<fx-list-btn-tools :recycle="false">
					<fx-button class="order-btn" v-fx-auth:store-manage_in-store-order.edit-instore type="primary" plain @click="onEditClick">编辑</fx-button>
					<fx-button class="order-btn" v-fx-auth:store-manage_in-store-order.delete-instore type="danger" plain @click="onDeletClick">删除</fx-button>
					<fx-button class="order-btn" v-fx-auth:store-manage_in-store-order.submit-instore type="primary" plain @click="onSubmitClick">提交</fx-button>
					<fx-button class="order-btn" v-fx-auth:store-manage_in-store-order.back-instore type="danger" plain @click="onReturnClick">退回</fx-button>
					<fx-button class="order-btn" v-fx-auth:store-manage_in-store-order.check-instore type="primary" plain @click="onCheckClick">审核</fx-button>
					<fx-button class="order-btn" v-fx-auth:store-manage_in-store-order.uncheck-instore type="danger" plain @click="onUncheckClick">反审</fx-button>
					<fx-button class="order-btn" v-fx-auth:store-manage_in-store-order.recheck-instore type="primary" plain @click="onRecheckClick">复审</fx-button>
					<fx-button class="order-btn" v-fx-auth:store-manage_in-store-order.unrecheck-instore type="danger" plain @click="onUnrecheckClick">取消复审</fx-button>
					<!-- <fx-button class="order-btn" v-fx-auth:store-manage_in-store-order.recheck-instore type="primary" plain @click="onDismantleClick">拆单</fx-button> -->
					<!-- <w-popover
						v-model="btnPopperVisible"
						placement="bottom"
						trigger="click"
						popper-class="details-info__btn-popper"
					>
						<fx-button class="order-btn" slot="reference" v-fx-auth:store-manage_in-store-order.recheck-instore type="primary" plain>下推</fx-button>
						<div class="btn-popper-container">
							<fx-button class="order-btn popper-btn" type="primary" plain @click="onEstimationPayableClick">暂估应付单</fx-button>
							<fx-button class="order-btn popper-btn" type="primary" plain @click="onStandardPayableClick">标准应付单</fx-button>
						</div>
					</w-popover> -->
				</fx-list-btn-tools>
			</div>
		</fx-list-virtual-table>
	</div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import filterBar from './FilterBar.vue'
import { apiName } from '../../Index.vue'
export const BILL_TYPE = 'FinancialOutStore'
export default {
	name: 'listContainer',
	components: {
		filterBar
	},
	data () {
		return {
			btnPopperVisible: false,
			tableColumnMap: {
				sysBillCode: {
					prop: 'sysBillCode',
					label: '单据编号',
					required: true,
					sortable: true,
					width: '150px',
					fxRender: this.sysBillCodeRender
				},
				businessDate: {
					prop: 'businessDate',
					label: '单据时间',
					required: true,
					sortable: true,
					width: '160px',
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.businessDate)
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
				buyerBillState: {
					prop: 'buyerBillState',
					label: '单据状态',
					required: true,
					fxRender: this.billStateRender
				},
				organName: {
					prop: 'organName',
					label: '出库方',
					required: true,
					sortable: true,
					sortKey: 'organId'
				},
				buyerOrganStore: {
					prop: 'buyerOrganStore',
					label: '出库仓库',
					required: true,
					formatter: (row) => {
						const outHouseList = row.outHouseList
						return Array.isArray(outHouseList) ? outHouseList.map(item => item.name).join(',') : ''
					}
				},
				otherOrganName: {
					prop: 'otherOrganName',
					label: '入库方',
					required: true,
					sortable: true,
					sortKey: 'otherOrganId'
				},
				sumSalesTaxMoney: {
					prop: 'sumSalesTaxMoney',
					label: '含税总金额',
					required: true,
					summary: true,
					fxRender: this.sumSalesTaxMoneyRender,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				memoList: { prop: 'memo', label: '备注' },
				operateManName: { prop: 'operateManName', label: '经办人' },
				checkManName: { prop: 'checkManName', label: '审核人' },
				modifyDate: {
					prop: 'modifyDate',
					label: '最新修改时间',
					width: '140px',
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.modifyDate)
					}
				}
			},
			tableColumn: [],
			tableData: [],
			defaultSortParam: { businessDate: 'desc', sysBillCode: 'desc' },
			summaryData: {}
		}
	},
	props: {
		tableQueueUtils: null
	},
	created () {
		this.initTableColumn()
		this.tableQueueUtils.init(this, {
			listRefName: 'listTable',
			billChange: this.onTableRowDbclick
		})
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize
		}),
		...mapGetters(['mainTableColumnVisibleGetter']),
		billState () {
			return (billState, recheckState, key) => {
				if (Number(recheckState) === 1) {
					return this.$fxStateMiddleware.getStateObj('recheckState')(recheckState)[key]
				} else {
					return this.$fxStateMiddleware.getStateObj('financialOrderState')(billState)[key]
				}
			}
		}
	},
	methods: {
		initTableColumn () {
			this.tableColumn = this.mainTableColumnVisibleGetter(BILL_TYPE)(this.tableColumnMap)
		},
		refresh () {
			this.$refs.filterBar.getSelectData()
			this.refreshPageData()
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
			const sumCols = this.tableColumn.filter(item => !!item.summary).map(item => item.prop)
			return {
				...this.$refs.listTable.getPaginationParams(),
				...this.$fxCommon.getSearchParams('financialOutStoreList')(params),
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
			return this.$fxApi(`${apiName}.getPage`)({ data: this.getSearchParams() }).then(res => {
				return Promise.resolve(res)
			})
		},
		createMulityParams (selectRows) {
			return selectRows.map(item => {
				return item.id
			})
		},
		onDeletClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm('是否确定删除所选单据？').then(() => {
					this.onDeleteHandler(res)
				})
			})
		},
		onDeleteHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('financial-manage.inventory-accounting.financial-out-store.delete', { orderData: selectRows })
			return this.$fxApi(`${apiName}.deleteMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh', true)
				return Promise.resolve()
			})
		},
		onSubmitClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm('是否确定提交所选单据？').then(() => {
					this.onSubmitHandler(res)
				})
			})
		},
		onSubmitHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('financial-manage.inventory-accounting.financial-out-store.submit', { orderData: selectRows })
			return this.$fxApi(`${apiName}.submitMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onReturnClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm('是否确定退回所选单据？').then(() => {
					this.onReturnHandler(res)
				})
			})
		},
		onReturnHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('financial-manage.inventory-accounting.financial-out-store.return', { orderData: selectRows })
			return this.$fxApi(`${apiName}.returnMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onCheckClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm('是否确定审核所选单据？').then(() => {
					this.onCheckHandler(res)
				})
			})
		},
		onCheckHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('financial-manage.inventory-accounting.financial-out-store.check', { orderData: selectRows })
			return this.$fxApi(`${apiName}.checkMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onUncheckClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm('是否确定反审所选单据？').then(() => {
					this.onUncheckHandler(res)
				})
			})
		},
		onUncheckHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('financial-manage.inventory-accounting.financial-out-store.uncheck', { orderData: selectRows })
			return this.$fxApi(`${apiName}.uncheckMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onRecheckClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm('是否确定复审所选单据？').then(() => {
					this.onRecheckHandler(res)
				})
			})
		},
		onRecheckHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('financial-manage.inventory-accounting.financial-out-store.recheck', { orderData: selectRows })
			return this.$fxApi(`${apiName}.recheckMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onUnrecheckClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm('是否确定取消复审所选单据？').then(() => {
					this.onUnrecheckHandler(res)
				})
			})
		},
		onUnrecheckHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('financial-manage.inventory-accounting.financial-out-store.unrecheck', { orderData: selectRows })
			return this.$fxApi(`${apiName}.unrecheckMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onEstimationPayableClick  () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定下推所选单据？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onEstimationPayableHandler(res)
				})
			})
		},
		onEstimationPayableHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('financial-manage.inventory-accounting.financial-out-store.pushDownEstimationPayable', { orderData: selectRows })
			return this.$fxApi(`${apiName}.pushDownEstimationPayableMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onStandardPayableClick  () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定下推所选单据？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onStandardPayableHandler(res)
				})
			})
		},
		onStandardPayableHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('financial-manage.inventory-accounting.financial-out-store.pushDownStandardPayable', { orderData: selectRows })
			return this.$fxApi(`${apiName}.pushDownStandardPayableMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onEditClick () {
			this.$refs.listTable.getSingleSelectedRow().then(res => {
				const selected = this.$refs.listTable.isSelected(res)
				this.tableQueueUtils.setChecked(selected)
				this.$refs.listTable.currentDbclickRow = res
				this.$emit('on-edit', res.id)
			})
		},
		onTableRowDbclick (item, showBillQueue) {
			const selected = this.$refs.listTable.isSelected(item)
			this.tableQueueUtils.setChecked(selected)
			return this.$emit('on-edit', item.id, showBillQueue)
		},
		onTableRowDbclickOriginal (item) {
			this.onTableRowDbclick(item, false)
		},
		billStateRender (h, { row }) {
			return <fx-list-state-tag
				icon={this.billState(row.billState, row.recheckState, 'icon')}
				label={this.billState(row.billState, row.recheckState, 'label')}
			></fx-list-state-tag>
		},
		onDismantleClick () {},
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
		sumSalesTaxMoneyRender (h, { row }) {
			return <span class={['fx-list-table__cell-span', this.billClass(row)]}>{this.$fxCommon.toFixedAutoZeroFill(row.sumSalesTaxMoney, this.sysMoneyPointSize)}</span>
		},
		billTypeNameRender (h, { row }) {
			return <span class={['fx-list-table__cell-span', this.billClass(row)]}>{row.billTypeName}</span>
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.order-manage-container {
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
.details-info__btn-popper {
	.btn-popper-container {
		display: flex
		flex-direction: column
		.popper-btn {
			margin-top: 10px
			margin-left: 0px
		}
	}
}
</style>
