<template>
	<w-collapse v-model="collapseVisible" contentHeight="480px" :fullScreen="isFullScreen" disabled :showArrow="false" title="明细信息">
		<fx-details-table
			ref="detailsTable"
			v-fx-tab:loop.financial-manage_financial-out-store_details.detailsInfo
			:disabled="disabled"
			:tableColumn="tableColumn"
			:tableData="tableDetails"
			:tableValiDate="tableValiDate"
			:tableEditColumnProp="tableEditColumnProp"
			:mainId="organDetails.id"
			:showFullScreenBtn="!isFullScreen"
			:fpOnRowEdit="fpOnRowEdit"
			:fpSaveDetails="fpSaveDetails"
			:canAdd="false"
			:showMistakeCheck="false"
			:showDeleteBtn="false"
			:selectable="false"
			:defaultSortParam="defaultSortParam"
			:cellClassName="cellClassName"
			showSummary
			@on-full-screen-click="onFullScreenClick"
		>
		</fx-details-table>
	</w-collapse>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import { apiName } from '../../Index.vue'
const EDIT_INPUT_TYPE = ['salesTaxRate', 'salesTaxRateMoney', 'salesTaxMoney']
export default {
	name: 'detailsInfo',
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
		disabled: Boolean
	},
	data () {
		return {
			collapseVisible: true,
			tableColumn: [
				{ prop: 'outHouse.code', label: '仓库编号', width: '150px' },
				{ prop: 'outHouse.name', label: '仓库名称' },
				{ prop: 'item.code', label: '品项编号', width: '150px', required: true, sortable: true },
				{ prop: 'item.name', label: '品项名称', required: true, sortable: true },
				{ prop: 'item.spec', label: '规格', width: '100px' },
				{ prop: 'itemUnit.name', label: '单位', width: '120px', required: true },
				{
					prop: 'amount',
					label: '数量',
					width: '120px',
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
					prop: 'price',
					label: '实际成本单价',
					width: '120px',
					sortable: true,
					fxRender: this.costPriceRender
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
					prop: 'salesTaxPrice',
					label: '含税销售单价',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.salesTaxPrice, this.sysPricePointSize)
					}
				},
				{
					prop: 'salesTaxRate',
					label: '税率',
					required: true,
					width: '100px',
					editColumn: (row) => {
						return !this.disabled && !row.giftFlag
					},
					fxRender: this.salesTaxRateRender,
					click: this.onCellClick('salesTaxRate')
				},
				{
					prop: 'money',
					label: '实际成本金额',
					width: '120px',
					sortable: true,
					fxRender: this.costMoneyRender,
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
					prop: 'salesTaxRateMoney',
					label: '税额',
					required: true,
					editColumn: (row) => {
						return !this.disabled && !row.giftFlag
					},
					fxRender: this.salesTaxRateMoneyRender,
					click: this.onCellClick('salesTaxRateMoney'),
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'salesTaxMoney',
					label: '价税合计',
					required: true,
					editColumn: (row) => {
						return !this.disabled && !row.giftFlag
					},
					fxRender: this.salesTaxMoneyRender,
					click: this.onCellClick('salesTaxMoney'),
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				}
			],
			tableValiDate: [{
				columnProp: 'salesTaxRateMoney',
				rule: (row, success, error) => {
					if (row.salesTaxRateMoneyClone > row.salesTaxMoneyClone) {
						error('税额不可大于价税合计')
					} else {
						success()
					}
				}
			}],
			fxCalculation: this.$fxCalculation('financialOutStore')
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
			switch (this.organDetails.billSign) {
			case 1:
				return 'fx-default-font'
			case 2:
				return 'fx-warn-font'
			default:
				return ''
			}
		},
		defaultSortParam () {
			return this.getSysParams('SJXZL_INSTORE_ITEM_ORDER', 'value')
		}
	},
	methods: {
		cellClassName (row, rowIndex, column) {
			if (['amount', 'salesPrice', 'salesTaxPrice', 'salesMoney'].includes(column.prop)) {
				return this.billColor
			} else {
				return ''
			}
		},
		costPriceRender (h, { row, $index }) {
			h = this.$createElement
			return <span class={[this.billColor, 'fx-list-table__cell-span']}>{row.price ? this.$fxCommon.toFixedAutoZeroFill(row.price, this.sysPricePointSize) : ''}</span>
		},
		costMoneyRender (h, { row, $index }) {
			h = this.$createElement
			return <span class={[this.billColor, 'fx-list-table__cell-span']}>{row.money ? this.$fxCommon.toFixedAutoZeroFill(row.money, this.sysMoneyPointSize) : ''}</span>
		},
		salesTaxRateRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`salesTaxRate-${$index}`}
				vModel={row.salesTaxRate}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='salesTaxRate'
				selectOptionList={this.taxesList}
				class={this.billColor}
				on-on-change={this.onTaxSelectChange}
			></fx-list-cell-select>
		},
		onTaxSelectChange (item, row) {
			this.fxCalculation.changeTaxes(row)
			row.salesTaxRateMoneyClone = row.salesTaxRateMoney
			row.salesTaxMoneyClone = row.salesTaxMoney
		},
		salesTaxRateMoneyRender (h, { row, $index }) {
			h = this.$createElement
			return <div class='flex-box'>
				<fx-list-cell-input-number
					ref={`salesTaxRateMoney-${$index}`}
					vModel={row.salesTaxRateMoneyClone}
					isEdit={row.isEdit}
					row={row}
					rowIndex={$index}
					columnProp='salesTaxRateMoney'
					pointSize={this.sysMoneyPointSize}
					cellText={this.$fxCommon.toFixedAutoZeroFill(row.salesTaxRateMoney, this.sysMoneyPointSize)}
					disabled={row.giftFlag}
					class={this.billColor}
					on-on-change={this.onSalesTaxRateMoneyChange}
				>
				</fx-list-cell-input-number>
			</div>
		},
		onSalesTaxRateMoneyChange (val, row) {
			row.salesTaxRateMoney = val
			this.fxCalculation.changeTaxMoney(row)
		},
		salesTaxMoneyRender (h, { row, $index }) {
			h = this.$createElement
			return <div class='flex-box'>
				<fx-list-cell-input-number
					ref={`salesTaxMoney-${$index}`}
					vModel={row.salesTaxMoneyClone}
					isEdit={row.isEdit}
					row={row}
					rowIndex={$index}
					columnProp='salesTaxMoney'
					pointSize={this.sysMoneyPointSize}
					cellText={this.$fxCommon.toFixedAutoZeroFill(row.salesTaxMoney, this.sysMoneyPointSize)}
					disabled={row.giftFlag}
					class={this.billColor}
					on-on-change={this.onTaxMoneyChange}
				>
				</fx-list-cell-input-number>
			</div>
		},
		onTaxMoneyChange (val, row) {
			row.salesTaxMoney = val
			this.fxCalculation.changeSumPriceWithTax(row)
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
			const logger = this.$fxLogger.createInfo('financial-manage.inventory-accounting.financial-out-store.updateDetails', this.createLoggerParams(params, origin))
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
		defaultFocus () {
			this.$refs.detailsTable.focus()
		},
		isRowEditing () {
			return this.$refs.detailsTable.isRowEditing()
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.flex-box {
	display flex
}
.minus-box {
	font-size 22px
	margin-right 3px
}
</style>
