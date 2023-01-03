<template>
	<w-dialog
		v-model="dialogVisible"
		title="明细信息"
		heightFullscreen
		width="1200px"
	>
		<filterBar ref="filterBar" :organDetails="organDetails" @on-search="getListData"></filterBar>
		<div class="table-container">
			<fx-details-table
				ref="listTable"
				:tableColumn="tableColumn"
				:tableData="tableData"
				:showColumnFilterBtn="false"
				:canAdd="false"
				:showMistakeCheck="false"
				:showDeleteBtn="false"
				:fullScreenBtn="false"
				:tableSearchInput="false"
				showIndex
				showSummary
				indexContinuous
				showPagination
				@on-page-change="onPageChange"
			>
				<div slot="btn-tools-left-right" class="tools-right">
					<fx-button v-fx-auth:store-manage_in-store-order.add-instore type="primary" @click="onCreateClick">确定新增</fx-button>
				</div>
			</fx-details-table>
		</div>
	</w-dialog>
</template>
<script>
import { mapState } from 'vuex'
import filterBar from './FilterBar.vue'
import { apiName } from '../../Index.vue'
export default {
	name: 'addDetailsContainer',
	components: {
		filterBar
	},
	props: {
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	data () {
		return {
			dialogVisible: false,
			tableColumn: [
				{
					prop: 'sysBillCode',
					label: '出库单号',
					required: true,
					width: '140px',
					fxRender: this.sysBillCodeRender
				},
				{
					prop: 'businessDate',
					label: '出库时间',
					required: true,
					width: '160px',
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.businessDate)
					}
				},
				{
					prop: 'billTypeName',
					label: '单据类型',
					required: true,
					sortKey: 'billType',
					fxRender: this.billTypeNameRender
				},
				{ prop: 'billBizTypeName', label: '业务类型', required: true },
				{
					prop: 'sumInMoney',
					label: '非税金额',
					required: true,
					summary: true,
					fxRender: this.sumInMoneyRender,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'sumInTaxRateMoney',
					label: '税额',
					required: true,
					summary: true,
					fxRender: this.sumInTaxRateMoneyRender,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'sumInTaxMoney',
					label: '含税金额',
					required: true,
					summary: true,
					fxRender: this.sumInTaxMoneyRender,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				}
			],
			tableData: [],
			defaultSortParam: { businessDate: 'desc', sysBillCode: 'desc' }
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize
		})
	},
	methods: {
		open () {
			this.tableData = []
			this.dialogVisible = true
			this.$nextTick(() => {
				this.refreshPageData()
			})
		},
		refreshPageData () {
			this.$refs.listTable.setPaginationCurrent(1)
			this.$refs.listTable.clearSelected()
			this.getListData()
		},
		onPageChange () {
			return this.getListData()
		},
		getSearchParams () {
			const params = {
				...this.$refs.filterBar.getFilterParams(),
				sortParams: this.defaultSortParam
			}
			return {
				...this.$refs.listTable.getPaginationParams(),
				...this.$fxCommon.getSearchParams('receivableOrderOutStoreList')(params)
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
			return this.$fxApi(`${apiName}.getFinancialOutStorePage`)({ data: this.getSearchParams() })
		},
		onCreateClick () {
			this.$refs.listTable.getSelectRows().then(selectRows => {
				const ids = selectRows.map(item => item.id)
				const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.receivable-order.addDetails', { orderData: this.organDetails, inStoreOrders: selectRows })
				return this.$fxApi(`${apiName}.addDetails`, this.organDetails.id)({ data: ids, logger }).then(() => {
					this.dialogVisible = false
					this.$emit('on-details-refresh')
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
		sumInMoneyRender (h, { row }) {
			return <span class={['fx-list-table__cell-span', this.billClass(row)]}>{this.$fxCommon.toFixedAutoZeroFill(row.sumInMoney, this.sysMoneyPointSize)}</span>
		},
		sumInTaxRateMoneyRender (h, { row }) {
			return <span class={['fx-list-table__cell-span', this.billClass(row)]}>{this.$fxCommon.toFixedAutoZeroFill(row.sumInTaxRateMoney, this.sysMoneyPointSize)}</span>
		},
		sumInTaxMoneyRender (h, { row }) {
			return <span class={['fx-list-table__cell-span', this.billClass(row)]}>{this.$fxCommon.toFixedAutoZeroFill(row.sumInTaxMoney, this.sysMoneyPointSize)}</span>
		},
		billTypeNameRender (h, { row }) {
			return <span class={['fx-list-table__cell-span', this.billClass(row)]}>{row.billTypeName}</span>
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.table-container {
	flex 1
	padding 0 16px 0 10px
}
</style>
