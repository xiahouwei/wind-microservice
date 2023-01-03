<template>
	<w-collapse v-model="collapseVisible" contentHeight="480px" :fullScreen="isFullScreen" disabled :showArrow="false" title="明细信息">
		<fx-details-table
			ref="detailsTable"
			v-fx-tab:loop.financial-manage_receivable-order_details.detailsInfo
			:disabled="disabled"
			:tableColumn="tableColumn"
			:tableData="tableDetails"
			:tableValiDate="tableValiDate"
			:tableEditColumnProp="tableEditColumnProp"
			:mainId="organDetails.id"
			:showFullScreenBtn="!isFullScreen"
			:fpOnRowEdit="fpOnRowEdit"
			:fpSaveDetails="fpSaveDetails"
			:fpSaveMain="fpSaveMain"
			:canAdd="false"
			:showMistakeCheck="false"
			:showDeleteBtn="false"
			:selectable="false"
			:showColumnFilterBtn="false"
			:defaultSortParam="defaultSortParam"
			:cellClassName="cellClassName"
			showSummary
			@on-full-screen-click="onFullScreenClick"
		>
			<fx-button
				slot="btn-tools-left-right"
				type="primary"
				:disabled="disabled"
				@click="onAddClick"
			>新增明细
			</fx-button>
		</fx-details-table>
		<add-details-container
			ref="addDetails"
			:organDetails="organDetails"
			@on-details-refresh="onDetailsRefresh"
		></add-details-container>
	</w-collapse>
</template>
<script>
import addDetailsContainer from '../add-details-container/Index.vue'
import { mapState, mapGetters } from 'vuex'
import { apiName } from '../../Index.vue'
const EDIT_INPUT_TYPE = ['discountRate', 'discountMoney']
export default {
	name: 'detailsInfo',
	components: {
		addDetailsContainer
	},
	props: {
		isFullScreen: Boolean,
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
		isRedReceivableOrder: Boolean
	},
	data () {
		return {
			collapseVisible: true,
			tableColumn: [
				{ prop: 'outBillCode', label: '出库单号', width: '150px' },
				{ prop: 'item.code', label: '品项编号', required: true, sortable: true },
				{ prop: 'item.name', label: '品项名称', required: true, sortable: true },
				{ prop: 'item.spec', label: '规格', width: '100px' },
				{ prop: 'itemUnit.name', label: '单位', required: true },
				{
					prop: 'amount',
					label: '数量',
					required: true,
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysPointSize)
					},
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.amount, this.sysPointSize)
					}
				},
				{
					prop: 'salesPrice',
					label: '非税销售单价',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.salesPrice, this.sysPricePointSize)
					}
				},
				{
					prop: 'taxSalesPrice',
					label: '含税销售单价',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.taxSalesPrice, this.sysPricePointSize)
					}
				},
				{
					prop: 'taxRate',
					label: '税率',
					required: true,
					width: '100px',
					editColumn: (row) => {
						return !this.disabled && !this.isEstimationReceivableOrder
					},
					fxRender: this.taxRateRender,
					click: this.onCellClick('taxRate')
				},
				{
					prop: 'discountRate',
					label: '折扣率%',
					required: true,
					width: '100px',
					editColumn: true,
					fxRender: this.discountRateRender,
					click: this.onCellClick('discountRate')
				},
				{
					prop: 'discountMoney',
					label: '折扣额',
					required: true,
					editColumn: true,
					fxRender: this.discountMoneyRender,
					click: this.onCellClick('discountMoney'),
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'salesMoney',
					label: '非税销售金额',
					required: true,
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					},
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.salesMoney, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'taxRateMoney',
					label: '税额',
					required: true,
					editColumn: (row) => {
						return !this.disabled && !this.isEstimationReceivableOrder
					},
					summary: true,
					fxRender: this.taxRateMoneyRender,
					click: this.onCellClick('taxRateMoney'),
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'totalMoney',
					label: '价税合计',
					required: true,
					editColumn: (row) => {
						return !this.disabled && !this.isEstimationReceivableOrder
					},
					summary: true,
					fxRender: this.totalMoneyRender,
					click: this.onCellClick('totalMoney'),
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				}
			],
			tableValiDate: [{
				columnProp: 'discountRate',
				rule: (row, success, error) => {
					if (row.discountRate > 100) {
						error('折扣率不可大于100%')
					} else if (row.discountRate < 0) {
						error('折扣率不可小于0%')
					} else {
						success()
					}
				}
			}],
			fxCalculation: this.$fxCalculation('receivableOrder'),
			isCommonTypeByRules: this.$fxTypeMiddleware.isCommonType('receivableOrderGenerateType', 'rules')
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize,
			sysPricePointSize: state => state.system.sysPricePointSize,
			sysPointSize: state => state.system.sysPointSize,
			taxesList: state => state.system.taxesList
		}),
		...mapGetters(['getSysParams']),
		tableEditColumnProp () {
			return EDIT_INPUT_TYPE
		},
		billColor () {
			switch (this.organDetails.billType) {
			case 103:
				return 'fx-warn-font'
			default:
				return ''
			}
		},
		defaultSortParam () {
			return this.getSysParams('SJXZL_INSTORE_ITEM_ORDER', 'value')
		},
		isEstimationReceivableOrder () {
			return this.isCommonTypeByRules('estimation-receivable-order')(this.organDetails.billType)
		}
	},
	methods: {
		cellClassName (row, rowIndex, column) {
			if (['amount', 'salesPrice', 'taxSalesPrice', 'taxRate', 'salesMoney', 'taxRateMoney', 'totalMoney'].includes(column.prop)) {
				return this.billColor
			} else {
				return ''
			}
		},
		taxRateRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`taxRate-${$index}`}
				vModel={row.taxRate}
				isEdit={row.isEdit && !this.isRedReceivableOrder && !this.isEstimationReceivableOrder}
				row={row}
				rowIndex={$index}
				columnProp='taxRate'
				selectOptionList={this.taxesList}
				on-on-change={this.onTaxSelectChange}
			>
			</fx-list-cell-select>
		},
		onTaxSelectChange (item, row) {
			this.fxCalculation.changeTaxes(row)
			row.discountRate = 0
			row.discountMoney = 0
		},
		discountRateRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`discountRate-${$index}`}
				vModel={row.discountRate}
				isEdit={row.isEdit && !this.isRedReceivableOrder}
				row={row}
				rowIndex={$index}
				columnProp='discountRate'
				min={-Infinity}
				pointSize={this.sysMoneyPointSize}
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.discountRate, this.sysMoneyPointSize)}
				disabled={row.giftFlag}
				on-on-change={this.onDiscountRateChange}
			>
			</fx-list-cell-input-number>
		},
		onDiscountRateChange (val, row) {
			this.fxCalculation.changeDiscountRate(row)
		},
		discountMoneyRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`discountMoney-${$index}`}
				vModel={row.discountMoney}
				isEdit={row.isEdit && !this.isRedReceivableOrder}
				row={row}
				rowIndex={$index}
				columnProp='discountMoney'
				min={-Infinity}
				pointSize={this.sysMoneyPointSize}
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.discountMoney, this.sysMoneyPointSize)}
				disabled={row.giftFlag}
				on-on-change={this.onDiscountMoneyChange}
			>
			</fx-list-cell-input-number>
		},
		onDiscountMoneyChange (val, row) {
			this.fxCalculation.changeDiscountMoney(row)
		},
		taxRateMoneyRender (h, { row, $index }) {
			h = this.$createElement
			return <div class='flex-box'>
				<div class='minus-box'> {this.isRedReceivableOrder && row.isEdit ? '-' : ''} </div>
				<fx-list-cell-input-number
					ref={`inTaxRateMoney-${$index}`}
					vModel={row.taxRateMoney}
					isEdit={row.isEdit && !this.isEstimationReceivableOrder}
					row={row}
					rowIndex={$index}
					columnProp='taxRateMoney'
					pointSize={this.sysMoneyPointSize}
					cellText={this.$fxCommon.toFixedAutoZeroFill(row.taxRateMoney, this.sysMoneyPointSize)}
					on-on-change={this.onTaxRateMoneyChange}
				>
				</fx-list-cell-input-number>
			</div>
		},
		onTaxRateMoneyChange (val, row) {
			this.fxCalculation.changeTaxMoney(row)
			row.discountRate = 0
			row.discountMoney = 0
		},
		totalMoneyRender (h, { row, $index }) {
			h = this.$createElement
			return <div class='flex-box'>
				<div class='minus-box'> {this.isRedReceivableOrder && row.isEdit ? '-' : ''} </div>
				<fx-list-cell-input-number
					ref={`totalMoney-${$index}`}
					vModel={row.totalMoney}
					isEdit={row.isEdit && !this.isEstimationReceivableOrder}
					row={row}
					rowIndex={$index}
					columnProp='totalMoney'
					pointSize={this.sysMoneyPointSize}
					cellText={this.$fxCommon.toFixedAutoZeroFill(row.totalMoney, this.sysMoneyPointSize)}
					on-on-change={this.onTaxMoneyChange}
				>
				</fx-list-cell-input-number>
			</div>
		},
		onTaxMoneyChange (val, row) {
			this.fxCalculation.changeSumPriceWithTax(row)
			row.discountRate = 0
			row.discountMoney = 0
		},
		fpOnRowEdit (row, $index, type) {
			return new Promise(resolve => {
				this.$refs.detailsTable.setListCellFocus(type)
				resolve()
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
			const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.receivable-order.updateDetails', this.createLoggerParams(params, origin))
			return this.$fxApi(`${apiName}.editDetail`, this.organDetails.id)({ data: params, logger }).then(res => {
				return Promise.resolve(res)
			})
		},
		createLoggerParams (params, origin) {
			const originData = this.$fxUtils.deepClone(origin)
			const organDetails = this.$fxUtils.deepClone(params)
			return {
				pre: originData,
				cur: organDetails,
				code: this.organDetails.sysBillCode,
				itemName: organDetails.item.name,
				orderData: this.organDetails
			}
		},
		checkDetailsUnSaving () {
			return this.$refs.detailsTable.checkDetailsUnSaving()
		},
		onFullScreenClick (flag) {
			this.$emit('update:isFullScreen', flag)
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
</style>
