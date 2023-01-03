<template>
	<w-dialog
		v-model="dialogVisible"
		title="明细信息"
		heightFullscreen
		width="1200px"
	>
		<filterBar
			ref="filterBar"
			:organDetails="organDetails"
			:connectBillDetails="connectBillDetails"
			@on-search="getListData"
		></filterBar>
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
		},
		connectBillDetails: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	data () {
		return {
			dialogVisible: false,
			tableColumn: [
				{ prop: 'sysBillCode', label: '单据编号', required: true, width: '140px' },
				{
					prop: 'businessDate',
					label: '业务时间',
					required: true,
					width: '160px',
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.businessDate)
					}
				},
				{ prop: 'billTypeName', label: '单据类型', required: true, sortKey: 'billType' },
				{ prop: 'billBizTypeName', label: '业务类型', required: true },
				{
					prop: 'sumMoney',
					label: '非税金额',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.sumMoney, this.sysMoneyPointSize)
					},
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'sumTaxRateMoney',
					label: '税额',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.sumTaxRateMoney, this.sysMoneyPointSize)
					},
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'sumTaxMoney',
					label: '含税金额',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.sumTaxMoney, this.sysMoneyPointSize)
					},
					summary: true,
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
				...this.$fxCommon.getSearchParams('payableOrderList')(params)
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
			return this.$fxApi(`${apiName}.getPayableOrderPage`, this.organDetails.id)({ data: this.getSearchParams() })
		},
		onCreateClick () {
			this.$refs.listTable.getSelectRows().then(selectRows => {
				const ids = selectRows.map(item => item.id)
				const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.payment-order.addPayableOrderDetails', { orderData: this.organDetails, payableOrders: selectRows })
				return this.$fxApi(`${apiName}.addPayableOrderDetails`, this.organDetails.id)({ data: ids, logger }).then(() => {
					this.dialogVisible = false
					this.$emit('on-details-refresh')
				})
			})
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
