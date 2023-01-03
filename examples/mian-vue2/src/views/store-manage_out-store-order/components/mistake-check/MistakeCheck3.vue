<template>
	<w-dialog v-model="dialogVisible" title="异常警告" width="1400px" heightFullscreen @close="clear">
		<div class="create-organ">
			<fx-mistake-check-step :activeStep="mistakeActiveStep" :type="mistakeStepType"></fx-mistake-check-step>
			<div class="mistake-check-warning fx-warn-font">注：以下明细中，存在销售单价为0的品项（不包括赠品品项），请注意是否输入错误！</div>
			<fx-details-table
				ref="detailsTable"
				v-fx-tab:focus.saveBtn
				:disabled="authDisabled"
				:tableColumn="computedTableColumn"
				:tableData="tableData"
				:tableEditColumnProp="tableEditColumnProp"
				:tableEditEnterColumnProp="tableEditEnterColumnProp"
				:mainId="organDetails.id"
				:fpSaveDetails="fpSaveDetails"
				:canAdd="false"
				:showColumnFilterBtn="false"
				:selectable="false"
				:showDeleteBtn="false"
			></fx-details-table>
		</div>
		<template slot="footer">
			<el-button
				ref="saveReturnBtn"
				v-fx-tab="saveReturnBtnTabHandler"
				@click="onSaveReturnClick"
			>保存并返回</el-button>
			<fx-button
				ref="saveBtn"
				:type="actionType"
				v-fx-tab:focus.saveReturnBtn
				@click="onSaveClick"
			>{{actionText}}</fx-button>
		</template>
	</w-dialog>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
const EDIT_INPUT_TYPE = ['salesTaxPrice', 'salesTaxMoney', 'salesTaxRate', 'salesPrice', 'salesMoney']
const EDIT_INPUT_ENTER_TYPE = ['salesTaxMoney', 'salesTaxRate', 'salesPrice', 'salesMoney']

export default {
	name: 'mistakeCheckStep3',
	components: {
	},
	props: {
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		actionText: String,
		actionType: String
	},
	data () {
		return {
			collapseVisible: true,
			dialogVisible: false,
			tableColumn: [
				{ prop: 'outHouse.code', label: '仓库编号', width: '150px' },
				{ prop: 'outHouse.name', label: '仓库名称', width: '120px' },
				{ prop: 'item.code', label: '品项编号', width: '150px' },
				{ prop: 'item.name', label: '品项名称', width: '120px' },
				{ prop: 'item.spec', label: '规格', width: '120px' },
				{ prop: 'itemUnit.name', label: '单位' },
				{
					prop: 'amount',
					label: '出库数量',
					width: '120px',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.amount, this.sysPointSize)
					}
				},
				{
					prop: 'salesTaxPrice',
					label: '含税销售单价',
					width: '120px',
					editColumn: true,
					fxRender: this.taxPriceRender,
					click: this.onCellClick('salesTaxPrice')
				},
				{
					prop: 'salesTaxMoney',
					label: '含税销售金额',
					width: '120px',
					editColumn: true,
					fxRender: this.taxMoneyRender,
					click: this.onCellClick('salesTaxMoney')
				},
				{
					prop: 'salesTaxRate',
					label: '销项税率',
					width: '100px',
					editColumn: () => {
						return this.organDetails.organ.taxPlayerFlag === 1
					},
					fxRender: this.taxRender,
					click: this.onCellClick('salesTaxRate')
				},
				{
					prop: 'salesPrice',
					label: '非税销售单价',
					width: '120px',
					editColumn: true,
					fxRender: this.priceRender,
					click: this.onCellClick('salesPrice')
				},
				{
					prop: 'salesMoney',
					label: '非税销售金额',
					width: '120px',
					editColumn: true,
					fxRender: this.moneyRender,
					click: this.onCellClick('salesMoney')
				},
				{
					prop: 'salesTaxRateMoney',
					label: '税额',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.salesTaxRateMoney, this.sysMoneyPointSize)
					}
				},
				{ prop: 'item.assistUnit', label: '辅助单位', width: '120px' },
				{
					prop: 'assistUnitAmount',
					label: '辅助数量',
					formatter: (row) => {
						return row.item.assistUnit ? this.$fxCommon.toFixedAutoZeroFill(row.assistUnitAmount, this.sysPointSize) : ''
					}
				}
			],
			tableData: [],
			fxCalculation: this.$fxCalculation('outStore'),
			tableEditEnterColumnProp: EDIT_INPUT_ENTER_TYPE
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize,
			sysPricePointSize: state => state.system.sysPricePointSize,
			sysPointSize: state => state.system.sysPointSize,
			taxesList: state => state.system.taxesList,
			haveMoneyPower: state => state.loginer.haveMoneyPower
		}),
		...mapGetters(['detailsAuthGetter']),
		authDisabled () {
			return !this.detailsAuthGetter('store-manage_out-store-order.edit-outstore')
		},
		computedTableColumn () {
			let column = this.tableColumn
			const moneyPower = ['salesTaxPrice', 'salesTaxMoney', 'salesTaxRate', 'salesPrice', 'salesMoney', 'salesTaxRateMoney']
			if (!this.haveMoneyPower) {
				column = column.filter(item => {
					return !moneyPower.includes(item.prop)
				})
			}
			if (this.authDisabled) {
				column.forEach(item => {
					item.editColumn && (item.editColumn = false)
				})
			}
			return column
		},
		tableEditColumnProp () {
			if (!this.haveMoneyPower) {
				return []
			} else {
				return EDIT_INPUT_TYPE
			}
		},
		mistakeActiveStep () {
			return this.systemParamAmountNegative ? 6 : 5
		},
		mistakeStepType () {
			return this.systemParamAmountNegative ? 'OutStore_AmountNegative' : 'OutStore'
		}
	},
	methods: {
		open (tableData) {
			this.tableData = tableData
			this.dialogVisible = true
			this.$nextTick(() => {
				this.$fxUtils.vDoRefFocus(this, 'saveBtn')
			})
		},
		onSaveReturnClick () {
			this.$refs.detailsTable.checkDetailsUnSaving().then(() => {
				this.dialogVisible = false
			})
		},
		onSaveClick () {
			this.$refs.detailsTable.checkDetailsUnSaving().then(() => {
				this.dialogVisible = false
				this.$emit('on-finish', 'ZeroSalesPrice')
			})
		},
		fpSaveDetails (detail, origin) {
			return this.onSaveDetailsHandler(detail, origin)
		},
		onSaveDetailsHandler (params, origin) {
			const logger = this.$fxLogger.createInfo('store-manage.out-store-order.updateDetails', this.createLoggerParams(params, origin))
			return this.$fxApi('outStore.editDetail', this.organDetails.id, params.id)({ data: params, logger }).then(res => {
				return Promise.resolve(res)
			})
		},
		createLoggerParams (params, origin) {
			const originData = this.$fxUtils.deepClone(origin)
			const organDetails = this.$fxUtils.deepClone(params)
			return {
				pre: originData,
				cur: organDetails,
				itemName: organDetails.item.name,
				orderData: this.organDetails
			}
		},
		onCellClick (type) {
			return (row) => {
				this.$refs.detailsTable.setRowEdit(row, type)
			}
		},
		taxPriceRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`salesTaxPrice-${$index}`}
				vModel={row.salesTaxPrice}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='salesTaxPrice'
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.salesTaxPrice, this.sysPricePointSize)}
				pointSize={this.sysPricePointSize}
				on-on-change={this.onTaxPriceChange}
			>
			</fx-list-cell-input-number>
		},
		onTaxPriceChange (val, row) {
			this.fxCalculation.changePriceWithTax(row)
		},
		taxMoneyRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`salesTaxMoney-${$index}`}
				vModel={row.salesTaxMoney}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='salesTaxMoney'
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.salesTaxMoney, this.sysMoneyPointSize)}
				pointSize={this.sysMoneyPointSize}
				on-on-change={this.onTaxMoneyChange}
				on-on-input-tab={this.onTaxMoneyTab}
			>
			</fx-list-cell-input-number>
		},
		onTaxMoneyTab (row, $index) {
			if (this.organDetails.organ.taxPlayerFlag !== 1) {
				this.$refs.detailsTable.setListCellFocus('salesPrice')
			} else {
				this.$refs.detailsTable.setListCellFocus('salesTaxRate')
			}
		},
		onTaxMoneyChange (val, row) {
			this.fxCalculation.changeSumPriceWithTax(row)
		},
		taxRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`salesTaxRate-${$index}`}
				vModel={row.salesTaxRate}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='salesTaxRate'
				disabled={this.organDetails.organ.taxPlayerFlag !== 1}
				selectOptionList={this.taxesList}
				on-on-change={this.onTaxSelectChange}
			></fx-list-cell-select>
		},
		onTaxSelectChange (item, row) {
			this.fxCalculation.changeTaxes(row)
		},
		priceRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`salesPrice-${$index}`}
				vModel={row.salesPrice}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='salesPrice'
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.salesPrice, this.sysPricePointSize)}
				pointSize={this.sysPricePointSize}
				on-on-change={this.onPriceChange}
			>
			</fx-list-cell-input-number>
		},
		onPriceChange (val, row) {
			this.fxCalculation.changePrice(row)
		},
		moneyRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`salesMoney-${$index}`}
				vModel={row.salesMoney}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='salesMoney'
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.salesMoney, this.sysMoneyPointSize)}
				pointSize={this.sysMoneyPointSize}
				on-on-change={this.onMoneyChange}
			>
			</fx-list-cell-input-number>
		},
		onMoneyChange (val, row) {
			this.fxCalculation.changeSumPrice(row)
		},
		clear () {
			this.$emit('on-mistake-close')
			this.$refs.detailsTable.clear()
		},
		saveReturnBtnTabHandler ({ focus }) {
			this.haveMoneyPower ? focus('detailsTable') : focus('saveBtn')
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.create-organ {
	flex: 1
	display: flex;
	flex-direction: column;
	overflow: auto;
	.mistake-check-warning {
		height: 24px
		line-height: 24px
	}
}
</style>
