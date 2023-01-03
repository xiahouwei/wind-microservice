<template>
	<w-dialog
		v-model="dialogVisible"
		title="明细信息"
		heightFullscreen
		width="1200px"
		@close="close"
	>
		<filterBar
			ref="filterBar"
			:organDetails="organDetails"
			@on-search="getListData"
		></filterBar>
		<div class="table-container">
			<fx-list-virtual-table
				ref="listTable"
				:tableColumn="tableColumn"
				:listData="tableData"
				:summaryData="summaryData"
				:defaultSortParam="defaultSortParam"
				:fpGetListData="getListDataHandler"
				:showColumnFilterBtn="false"
				showIndex
				showSummaryTools
				indexContinuous
				@on-page-change="onPageChange"
			>
			</fx-list-virtual-table>
		</div>
		<template slot="footer">
			<el-button @click="onCancelClick">取消</el-button>
			<el-button type="primary" @click="onSaveClick">确定</el-button>
		</template>
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
		payableTableDetails: {
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
					prop: 'sumTotalMoney',
					label: '价税合计',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.sumTotalMoney, this.sysMoneyPointSize)
					},
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'sumPaidMoney',
					label: '已核销金额',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.sumPayMoney, this.sysMoneyPointSize)
					},
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'waitWriteOffMoney',
					label: '待核销金额',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.waitWriteOffMoney, this.sysMoneyPointSize)
					},
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				}
			],
			tableData: [],
			defaultSortParam: { businessDate: 'desc', sysBillCode: 'desc' },
			summaryData: {}
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
			const payableIds = this.payableTableDetails.map(item => {
				return item.payableId
			})
			if (payableIds.length > 0) {
				params.id = payableIds
			}
			const sumCols = this.tableColumn.filter(item => !!item.summary).map(item => item.prop)
			return {
				...this.$refs.listTable.getPaginationParams(),
				...this.$fxCommon.getSearchParams('verificationDetailsList')(params),
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
			return this.$fxApi(`${apiName}.getPayableOrderPage`, this.organDetails.id)({ data: this.getSearchParams() })
		},
		onCancelClick () {
			this.dialogVisible = false
		},
		onSaveClick () {
			this.$refs.listTable.getSelectedRows().then(selectRows => {
				const data = selectRows.map(item => {
					return {
						billId: this.organDetails.id,
						payableId: item.id
					}
				})
				const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.verification-order.addPayableVerificationDetails', { orderData: this.organDetails, payableOrders: selectRows })
				return this.$fxApi(`${apiName}.addPayableVerificationDetails`, this.organDetails.id)({ data, logger }).then(() => {
					this.dialogVisible = false
					this.$emit('on-details-refresh')
				})
			})
		},
		close () {
			this.$refs.listTable.clearSelected()
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
