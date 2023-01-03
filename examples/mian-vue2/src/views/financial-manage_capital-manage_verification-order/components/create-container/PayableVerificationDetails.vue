<template>
	<w-collapse v-model="collapseVisible" contentHeight="320px" disabled :showArrow="false" title="应付核销">
		<fx-details-table
			ref="detailsTable"
			v-fx-tab:loop.financial-manage_verification-order_details.payableVerificationDetails
			showSummary
			:disabled="disabled"
			:tableColumn="tableColumnComputed"
			:tableData="tableDetails"
			:tableEditColumnProp="tableEditColumnProp"
			:mainId="organDetails.id"
			:fpSaveDetails="fpSaveDetails"
			:fpOnRowEdit="fpOnRowEdit"
			:showFullScreenBtn="false"
			:canAdd="false"
			:showMistakeCheck="false"
			:showColumnFilterBtn="false"
			:fullScreenBtn="false"
      :tableSearchInput="false"
			:fpDeleteDetails="fpDeleteDetails"
			@on-details-refresh="onDetailsRefresh"
		>
			<fx-button
				slot="btn-tools-left-right"
				type="primary"
				class="add-btn"
				:disabled="disabled"
				@click="onAddClick"
			>新增应付明细</fx-button>
		</fx-details-table>
		<add-details-container
			ref="addDetails"
			:organDetails="organDetails"
			:payableTableDetails="tableDetails"
			@on-details-refresh="onDetailsRefresh"
		></add-details-container>
	</w-collapse>
</template>
<script>
import addDetailsContainer from '../add-details-payable-container/Index.vue'
import { mapState } from 'vuex'
import { apiName } from '../../Index.vue'
const EDIT_INPUT_TYPE = ['writeOffMoney']
export default {
	name: 'payableVerificationDetails',
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
		fpSaveMain: Function,
		paymentCheckDetailsUnSaving: Function
	},
	data () {
		return {
			collapseVisible: true,
			fxCalculation: this.$fxCalculation('verificationOrder'),
			tableColumn: [
				{ prop: 'payableBill.sysBillCode', label: '单据编号', width: '150px', required: true },
				{ prop: 'payableBill.billTypeName', label: '单据类型', required: true },
				{
					prop: 'payableBill.businessDate',
					label: '业务时间',
					required: true,
					sortable: true,
					width: '160px',
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.payableBill.businessDate)
					}
				},
				{
					prop: 'payableBill.sumTotalMoney',
					label: '价税合计',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.payableBill.sumTotalMoney, this.sysMoneyPointSize)
					},
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'payableBill.sumPaidMoney',
					label: '已核销金额',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.payableBill.sumPaidMoney, this.sysMoneyPointSize)
					},
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'payableBill.waitWriteOffMoney',
					label: '待核销金额',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.payableBill.waitWriteOffMoney, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'writeOffMoney',
					label: '本次核销金额',
					required: true,
					editColumn: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.writeOffMoney, this.sysMoneyPointSize)
					},
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					},
					fxRender: this.writeOffMoneyRender,
					click: this.onCellClick('writeOffMoney')
				},
				{
					prop: 'noWriteOffMoney',
					label: '未核销金额',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.noWriteOffMoney, this.sysMoneyPointSize)
					}
				}
			]
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize
		}),
		tableEditColumnProp () {
			return EDIT_INPUT_TYPE
		},
		isUnWrittenOff () {
			return this.$fxStateMiddleware.isState('verificationOrderState')('unWrittenOff')(this.organDetails.billState)
		},
		tableColumnComputed () {
			return this.isUnWrittenOff ? this.tableColumn : this.tableColumn.slice(0, -1)
		}
	},
	methods: {
		writeOffMoneyRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`writeOffMoney-${$index}`}
				vModel={row.writeOffMoney}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='writeOffMoney'
				min={0}
				pointSize={this.sysMoneyPointSize}
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.writeOffMoney, this.sysMoneyPointSize)}
				disabled={row.giftFlag}
				on-on-change={this.onWriteOffMoneyChange}
			>
			</fx-list-cell-input-number>
		},
		onWriteOffMoneyChange (val, row) {
			this.fxCalculation.changeWriteOffMoney(row, 'payableBill')
		},
		fpOnRowEdit (row, $index, type) {
			return new Promise(resolve => {
				this.paymentCheckDetailsUnSaving().then(() => {
					this.$refs.detailsTable.setListCellFocus(type)
					resolve()
				})
			})
		},
		onCellClick (type) {
			return (row) => {
				this.$refs.detailsTable.setRowEdit(row, type)
			}
		},
		fpSaveDetails (detail, origin) {
			return this.onSaveDetailsHandler(detail, origin)
		},
		onSaveDetailsHandler (params, origin) {
			if (params.id) {
				const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.verification-order.updatePayableVerificationDetails', this.createLoggerParams(params, origin))
				return this.$fxApi(`${apiName}.updatePayableVerificationDetails`, this.organDetails.id)({ data: params, logger })
			}
		},
		createLoggerParams (params, origin) {
			const originData = this.$fxUtils.deepClone(origin)
			const organDetails = this.$fxUtils.deepClone(params)
			return {
				pre: originData,
				cur: organDetails,
				orderData: this.organDetails
			}
		},
		fpDeleteDetails (ids) {
			const payableOrders = this.getDeleteItemInfo(ids)
			const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.verification-order.deletePayableVerificationDetails', { payableOrders, orderData: this.organDetails })
			return this.$fxApi(`${apiName}.deletePayableVerificationDetails`, this.organDetails.id)({ data: ids, logger }).then(res => {
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
					sysBillCode: item.payableBill.sysBillCode
				}
			})
		},
		checkDetailsUnSaving () {
			return this.$refs.detailsTable.checkDetailsUnSaving()
		},
		clear () {
			this.$refs.detailsTable.clear()
		},
		defaultFocus () {
			this.$refs.detailsTable.focus()
		},
		isRowEditing () {
			return this.$refs.detailsTable.isRowEditing()
		},
		onAddClick () {
			this.fpSaveMain().then(this.paymentCheckDetailsUnSaving).then(() => {
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
