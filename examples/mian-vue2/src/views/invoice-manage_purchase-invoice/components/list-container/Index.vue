<template>
	<div class="organ-manage-container">
		<filterBar ref="filterBar" @on-search="refresh"></filterBar>
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
				<fx-list-btn-tools v-model="recycleShow" @on-recycle-change="refresh">
					<el-button v-fx-auth:financial-manage_invoice-manage_purchase-invoice.edit-purchase-invoice class="order-btn" type="primary" plain @click="onEditClick">编辑</el-button>
					<el-button v-fx-auth:financial-manage_invoice-manage_purchase-invoice.articulation-purchase-invoice class="order-btn" type="primary" plain @click="onArticulationClick">勾稽</el-button>
					<el-button v-fx-auth:financial-manage_invoice-manage_purchase-invoice.delete-purchase-invoice class="order-btn" type="danger" plain @click="onDeleteClick">删除</el-button>
					<el-button v-fx-auth:financial-manage_invoice-manage_purchase-invoice.AccountingScarletLetter-purchase-invoice class="order-btn" type="primary" plain @click="onRedMarkClick">红字</el-button>
					<el-button v-fx-auth:financial-manage_invoice-manage_purchase-invoice.print-purchase-invoice class="order-btn" type="danger" plain @click="onPrintClick">打印</el-button>
					<el-button v-fx-auth:financial-manage_invoice-manage_purchase-invoice.export-purchase-invoice class="order-btn" type="primary" plain @click="onExportClick">导出</el-button>
					<el-button v-fx-auth:financial-manage_invoice-manage_purchase-invoice.import-purchase-invoice class="order-btn" type="danger" plain @click="onMultipleImportClick">批量导入</el-button>
					<el-button v-fx-auth:financial-manage_invoice-manage_purchase-invoice.recover-purchase-invoice slot="recycle" class="order-btn" type="primary" plain @click="onRecoverClick">恢复</el-button>
					<el-button v-fx-auth:financial-manage_invoice-manage_purchase-invoice.delete-purchase-invoice slot="recycle" class="order-btn" type="danger" plain @click="onRecycleDeleteClick">删除</el-button>
				</fx-list-btn-tools>
			</div>
			<div slot="btn-tools-right" class="tools-right">
				<el-button v-fx-auth:financial-manage_invoice-manage_purchase-invoice.add-purchase-invoice type="primary" slot="reference" @click="onCreateClick">新建</el-button>
			</div>
		</fx-list-virtual-table>
	</div>
</template>
<script>
import { mapState } from 'vuex'
import filterBar from './FilterBar.vue'
import FxListStateTag from '@/components/common/Fx-list-state-tag.vue'
import { apiName } from '../../Index.vue'
export default {
	name: 'listContainer',
	components: {
		filterBar
	},
	data () {
		return {
			tableColumn: [
				{ prop: 'invoicingCode', label: '发票号码', required: true, sortable: true, width: '120px' },
				{
					prop: 'invoicingDate',
					label: '开票日期',
					required: true,
					sortable: true,
					width: '120px',
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.invoicingDate, 'YYYY:MM:DD')
					}
				},
				{ prop: 'invoiceTypeName', label: '发票类型', required: true },
				{ prop: 'purchaseOrganName', label: '采购方', required: true, sortable: true, sortKey: 'purchaseOrganId' },
				{ prop: 'salesOrganName', label: '销售方', required: true, sortable: true, sortKey: 'salesOrganId' },
				{
					prop: 'state',
					label: '状态',
					required: true,
					fxRender: this.stateRender
				},
				{
					prop: 'totalMoney',
					label: '价税合计',
					required: true,
					summary: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.totalMoney, this.sysMoneyPointSize)
					},
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				{ prop: 'memo', label: '备注' }
			],
			tableData: [],
			recycleShow: false,
			summaryData: {},
			defaultSortParam: { invoicingCode: 'desc' }
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize
		}),
		invoiceState () {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('invoiceState')(val)[key]
			}
		},
		computedColumn () {
			if (this.recycleShow) {
				const columns = this.$fxUtils.deepClone(this.tableColumn)
				columns.splice(5, 1)
				return columns
			} else {
				return this.tableColumn
			}
		}
	},
	methods: {
		initFilterBar () {
			this.$refs.filterBar.initFilter()
			this.$refs.filterBar.initSelect()
			return this.$refs.filterBar.getAccountingPeriod()
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
				sortParams: this.$refs.listTable.getSortKey()
			}
			const sumCols = this.computedColumn.filter(item => !!item.summary).map(item => item.prop)
			return {
				...this.$refs.listTable.getPaginationParams(),
				...this.$fxCommon.getSearchParams('purchaseInvoiceList')(params),
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
		onDeleteClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm('是否确定删除所选发票？').then(() => {
					this.onDeleteHandler(res)
				})
			})
		},
		onDeleteHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('financial-manage.invoice-manage.purchase-invoice.delete', { codes: this.getOrderCode(selectRows) })
			return this.$fxApi(`${apiName}.deleteMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh', true)
				return Promise.resolve()
			})
		},
		getOrderCode (list) {
			return list.map(item => {
				return item.invoicingCode
			}).join(',')
		},
		onRecycleDeleteClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm('是否确定删除所选发票？').then(() => {
					this.onRecycleDeleteHandler(res)
				})
			})
		},
		onRecycleDeleteHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('financial-manage.invoice-manage.purchase-invoice.recyclingDelete', { codes: this.getOrderCode(selectRows) })
			return this.$fxApi(`${apiName}.removeMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh', true)
				return Promise.resolve()
			})
		},
		onRecoverClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm('是否确定恢复所选发票？').then(() => {
					this.onRecoverHandler(res)
				})
			})
		},
		onRecoverHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('financial-manage.invoice-manage.purchase-invoice.recover', { codes: this.getOrderCode(selectRows) })
			if (params.length === 1) {
				return this.$fxApi(`${apiName}.restore`, params[0])({ logger }).then(res => {
					this.$emit('on-refresh', true)
					return Promise.resolve()
				})
			} else {
				return this.$fxApi(`${apiName}.restoreMulity`)({ data: params, logger }).then(res => {
					this.$emit('on-refresh', true)
					return Promise.resolve()
				})
			}
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
		stateRender (h, { row }) {
			return <FxListStateTag
				icon={this.invoiceState(row.state, 'icon')}
				label={this.invoiceState(row.state, 'label')}
			></FxListStateTag>
		},
		onArticulationClick () {

		},
		onRedMarkClick () {

		},
		onExportClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm('是否确定导出所选发票？').then(() => {
					this.onExportClickHandler(res)
				})
			})
		},
		onExportClickHandler (selectRows) {
			const ids = selectRows.map(item => item.id).join(',')
			const logger = this.$fxLogger.createInfo('financial-manage.invoice-manage.purchase-invoice.exportData', { codes: this.getOrderCode(selectRows) })
			return this.$fxApi(`${apiName}.exportData`, ids)({ logger }).then(res => {
				this.$fxUtils.downloadFile(res)
			})
		},
		onMultipleImportClick () {
			this.$emit('on-multiple-import-click')
		},
		onPrintClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm('是否确定打印所选发票？').then(() => {
					this.$fxGoPrint('PurchaseInvoice', res.map(item => item.id))
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
