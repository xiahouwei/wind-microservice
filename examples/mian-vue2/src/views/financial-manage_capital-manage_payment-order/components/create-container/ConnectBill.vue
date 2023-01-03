<template>
	<w-collapse v-model="collapseVisible" contentHeight="320px" disabled :showArrow="false" title="关联单据">
		<fx-details-table
			ref="detailsTable"
			showSummary
			:disabled="disabled"
			:tableColumn="tableColumn"
			:tableData="tableDetails"
			:mainId="organDetails.id"
			:showFullScreenBtn="false"
			:canAdd="false"
			:showMistakeCheck="false"
			:showColumnFilterBtn="false"
			:fullScreenBtn="false"
      :tableSearchInput="false"
			:fpDeleteDetails="fpDeleteDetails"
			:deleteDisabled="isPushDownSubPaymentOrder"
			@on-details-refresh="onDetailsRefresh"
		>
			<fx-button
				slot="btn-tools-left-right"
				type="primary"
				class="add-btn"
				:disabled="disabled"
				@click="onAddClick"
			>新增明细</fx-button>
			<div slot="empty">暂无关联单据</div>
		</fx-details-table>
		<add-details-container
			ref="addDetails"
			:organDetails="organDetails"
			:connectBillDetails="tableDetails"
			@on-details-refresh="onDetailsRefresh"
		></add-details-container>
	</w-collapse>
</template>
<script>
import addDetailsContainer from '../add-details-container/Index.vue'
import { mapState } from 'vuex'
import { apiName } from '../../Index.vue'
export default {
	name: 'detailsInfo',
	components: {
		addDetailsContainer
	},
	props: {
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		tableDetails: {
			type: Array,
			default: () => {
				return []
			}
		},
		disabled: Boolean,
		fpSaveMain: Function
	},
	data () {
		return {
			collapseVisible: true,
			tableColumn: [
				{ prop: 'sysBillCode', label: '单据编号', width: '150px', required: true },
				{ prop: 'billTypeName', label: '单据类型', required: true },
				{
					prop: 'payMoney',
					label: '应付金额',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.payMoney, this.sysMoneyPointSize)
					},
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'discountMoney',
					label: '折扣金额',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.discountMoney, this.sysMoneyPointSize)
					},
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'paidMoney',
					label: '已付金额',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.paidMoney, this.sysMoneyPointSize)
					},
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'unPayMoney',
					label: '未付金额',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.unPayMoney, this.sysMoneyPointSize)
					},
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				}
			],
			isCommonTypeByRules: this.$fxTypeMiddleware.isCommonType('paymentOrderGenerateType', 'rules')
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize
		}),
		isPushDownSubPaymentOrder () {
			return this.isCommonTypeByRules('push-down-sub-payment-order')(this.organDetails.subBillType)
		}
	},
	methods: {
		fpDeleteDetails (ids) {
			const payableOrders = this.getDeleteItemInfo(ids)
			const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.payment-order.deleteConnectBillDetails', { payableOrders, orderData: this.organDetails })
			return this.$fxApi(`${apiName}.deleteConnectBillDetails`, this.organDetails.id)({ data: ids, logger }).then(res => {
				this.$refs.detailsTable.clearSelected()
				return Promise.resolve(res)
			})
		},
		getDeleteItemInfo (ids) {
			return this.tableDetails.filter(item => {
				return ids.includes(item.id)
			}).map(item => {
				return {
					id: item.payableId,
					sysBillCode: item.sysBillCode
				}
			})
		},
		clear () {
			this.$refs.detailsTable.clear()
		},
		onAddClick () {
			this.fpSaveMain().then(() => {
				this.$refs.addDetails.open()
			})
		},
		onDetailsRefresh () {
			this.$emit('on-details-refresh')
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.add-btn {
	margin-left 10px
}
</style>
