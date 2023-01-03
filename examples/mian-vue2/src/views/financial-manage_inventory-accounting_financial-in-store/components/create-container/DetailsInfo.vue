<template>
	<w-collapse v-model="collapseVisible" contentHeight="480px" :fullScreen="isFullScreen" disabled :showArrow="false" title="明细信息">
		<fx-details-table
			ref="detailsTable"
			v-fx-tab:loop.financial-manage_financial-in-store_details.detailsInfo
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
const EDIT_INPUT_TYPE = ['taxRate', 'inTaxRateMoney', 'inTaxMoney']
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
				{ prop: 'inHouse.code', label: '仓库编号', width: '150px' },
				{ prop: 'inHouse.name', label: '仓库名称' },
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
					prop: 'inPrice',
					label: '非税单价',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.inPrice, this.sysPricePointSize)
					}
				},
				{
					prop: 'inTaxPrice',
					label: '含税单价',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.inTaxPrice, this.sysPricePointSize)
					}
				},
				{
					prop: 'taxRate',
					label: '税率',
					required: true,
					width: '100px',
					editColumn: (row) => {
						return !this.disabled && !row.giftFlag
					},
					fxRender: this.taxRateRender,
					click: this.onCellClick('taxRate')
				},
				{
					prop: 'inMoney',
					label: '非税金额',
					required: true,
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					},
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.inMoney, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'inTaxRateMoney',
					label: '税额',
					required: true,
					editColumn: (row) => {
						return !this.disabled && !row.giftFlag
					},
					fxRender: this.inTaxRateMoneyRender,
					click: this.onCellClick('inTaxRateMoney'),
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'inTaxMoney',
					label: '价税合计',
					required: true,
					editColumn: (row) => {
						return !this.disabled && !row.giftFlag
					},
					fxRender: this.taxMoneyRender,
					click: this.onCellClick('inTaxMoney'),
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				}
			],
			tableValiDate: [{
				columnProp: 'inTaxRateMoney',
				rule: (row, success, error) => {
					if (row.inTaxRateMoneyClone > row.inTaxMoneyClone) {
						if (this.isRedOrder) {
							error('税额不可小于价税合计')
						} else {
							error('税额不可大于价税合计')
						}
					} else {
						success()
					}
				}
			}],
			fxCalculation: this.$fxCalculation('inStore')
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
		},
		isRedOrder () {
			return this.organDetails.billSign === 2
		}
	},
	methods: {
		cellClassName (row, rowIndex, column) {
			if (['amount', 'inPrice', 'inTaxPrice', 'inMoney'].includes(column.prop)) {
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
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='taxRate'
				selectOptionList={this.taxesList}
				class={this.billColor}
				on-on-change={this.onTaxSelectChange}
			></fx-list-cell-select>
		},
		onTaxSelectChange (item, row) {
			this.fxCalculation.changeTaxes(row)
			row.inTaxRateMoneyClone = this.isRedOrder ? -row.inTaxRateMoney : row.inTaxRateMoney
			row.inTaxMoneyClone = this.isRedOrder ? -row.inTaxMoney : row.inTaxMoney
		},
		inTaxRateMoneyRender (h, { row, $index }) {
			h = this.$createElement
			return <div class='flex-box'>
				<div class='minus-box'> {this.isRedOrder && row.isEdit ? '-' : ''} </div>
				<fx-list-cell-input-number
					ref={`inTaxRateMoney-${$index}`}
					vModel={row.inTaxRateMoneyClone}
					isEdit={row.isEdit}
					row={row}
					rowIndex={$index}
					columnProp='inTaxRateMoney'
					pointSize={this.sysMoneyPointSize}
					cellText={this.$fxCommon.toFixedAutoZeroFill(row.inTaxRateMoney, this.sysMoneyPointSize)}
					disabled={row.giftFlag}
					class={this.billColor}
					on-on-change={this.onInTaxRateMoneyChange}
				>
				</fx-list-cell-input-number>
			</div>
		},
		onInTaxRateMoneyChange (val, row) {
			row.inTaxRateMoney = this.isRedOrder ? -val : val
			this.fxCalculation.changeFinancialTaxMoney(row)
		},
		taxMoneyRender (h, { row, $index }) {
			h = this.$createElement
			return <div class='flex-box'>
				<div class='minus-box'> {this.isRedOrder && row.isEdit ? '-' : ''} </div>
				<fx-list-cell-input-number
					ref={`inTaxMoney-${$index}`}
					vModel={row.inTaxMoneyClone}
					isEdit={row.isEdit}
					row={row}
					rowIndex={$index}
					columnProp='inTaxMoney'
					pointSize={this.sysMoneyPointSize}
					cellText={this.$fxCommon.toFixedAutoZeroFill(row.inTaxMoney, this.sysMoneyPointSize)}
					disabled={row.giftFlag}
					class={this.billColor}
					on-on-change={this.onTaxMoneyChange}
				>
				</fx-list-cell-input-number>
			</div>
		},
		onTaxMoneyChange (val, row) {
			row.inTaxMoney = this.isRedOrder ? -val : val
			this.fxCalculation.changeFinancialSumPriceWithTax(row)
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
			const logger = this.$fxLogger.createInfo('financial-manage.inventory-accounting.financial-in-store.updateDetails', this.createLoggerParams(params, origin))
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
