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
					<fx-button class="order-btn" v-fx-auth:store-manage_in-store-order.recheck-instore="false" type="primary" plain @click="onPushDownClick">下推</fx-button>
				</fx-list-btn-tools>
			</div>
			<div slot="btn-tools-right" class="tools-right">
				<fx-button v-fx-auth:store-manage_in-store-order.add-instore type="primary" slot="reference" @click="onCreateClick">新建</fx-button>
			</div>
		</fx-list-virtual-table>
	</div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import filterBar from './FilterBar.vue'
import { apiName } from '../../Index.vue'
export const BILL_TYPE = 'ReceivableOrder'
export default {
	name: 'listContainer',
	components: {
		filterBar
	},
	data () {
		return {
			tableColumnMap: {
				sysBillCode: {
					prop: 'sysBillCode',
					label: '单据编号',
					required: true,
					sortable: true,
					width: '140px',
					fxRender: this.sysBillCodeRender
				},
				businessDate: {
					prop: 'businessDate',
					label: '业务时间',
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
					label: '收款机构',
					required: true,
					sortable: true,
					sortKey: 'organId'
				},
				otherOrganName: {
					prop: 'otherOrganName',
					label: '付款机构',
					required: true,
					sortable: true,
					sortKey: 'otherOrganId'
				},
				departmentName: {
					prop: 'departmentName',
					label: '核算部门',
					required: true
				},
				sumTotalMoney: {
					prop: 'sumTotalMoney',
					label: '应收金额',
					required: true,
					summary: true,
					fxRender: this.sumTotalMoneyRender,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				invoiceCode: { prop: 'invoiceCode', label: '发票号码' },
				sourceTypeName: { prop: 'sourceTypeName', label: '业务来源' },
				payWay: {
					prop: 'payWay',
					label: '客户支付方式',
					formatter: (row) => {
						return this.$fxTypeMiddleware.getCommonTypeItemById('payWayList')(row.payWay).name
					}
				},
				memoList: { prop: 'memo', label: '备注' },
				operateManName: { prop: 'operateManName', label: '经办人' },
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
				sortParams: this.$refs.listTable.getSortKey()
			}
			const sumCols = this.tableColumn.filter(item => !!item.summary).map(item => item.prop)
			return {
				...this.$refs.listTable.getPaginationParams(),
				...this.$fxCommon.getSearchParams('receivableOrderList')(params),
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
			const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.receivable-order.delete', { orderData: selectRows })
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
			const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.receivable-order.submit', { orderData: selectRows })
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
			const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.receivable-order.return', { orderData: selectRows })
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
			const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.receivable-order.check', { orderData: selectRows })
			return this.$fxApi(`${apiName}.checkMulity`)({ data: params, logger }).then(res => {
				this.clearSelected()
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
			const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.receivable-order.uncheck', { orderData: selectRows })
			return this.$fxApi(`${apiName}.uncheckMulity`)({ data: params, logger }).then(res => {
				this.clearSelected()
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
			const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.receivable-order.recheck', { orderData: selectRows })
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
			const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.receivable-order.unrecheck', { orderData: selectRows })
			return this.$fxApi(`${apiName}.unrecheckMulity`)({ data: params, logger }).then(res => {
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
		onCreateClick () {
			this.$emit('on-create')
		},
		createMulityPushDownParams () {

		},
		onPushDownClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定下推所选单据？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onPushDownHandler(res)
				})
			})
		},
		onPushDownHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.receivable-order.pushdown', { orderData: selectRows })
			return this.$fxApi(`${apiName}.pushdownMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		billClass (row) {
			switch (row.billType) {
			case '103':
				return 'fx-warn-font'
			default:
				return ''
			}
		},
		sysBillCodeRender (h, { row }) {
			return <span class={['fx-list-table__cell-span', this.billClass(row)]}>{row.sysBillCode}</span>
		},
		sumTotalMoneyRender (h, { row }) {
			return <span class={['fx-list-table__cell-span', this.billClass(row)]}>{this.$fxCommon.toFixedAutoZeroFill(row.sumTotalMoney, this.sysMoneyPointSize)}</span>
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
</style>
