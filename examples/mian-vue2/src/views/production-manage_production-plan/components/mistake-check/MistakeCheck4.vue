<template>
	<w-dialog v-model="dialogVisible" title="异常警告" width="1200px" heightFullscreen @close="clear">
		<div class="create-organ">
			<fx-mistake-check-step :activeStep="4" type="InStore"></fx-mistake-check-step>
			<div class="mistake-check-warning fx-warn-font">注：以下明细中，存在入库成本单价、含税单价、非税单价为0的品项（不包括赠品品项），入库价为0的品项，会导致出库成本也为0，请注意是否输入错误！</div>
			<fx-details-table
				ref="detailsTable"
				v-fx-tab:focus.saveBtn
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
const EDIT_INPUT_TYPE = ['inTaxPrice', 'inTaxMoney', 'taxRate', 'inPrice', 'inMoney']
const EDIT_INPUT_ENTER_TYPE = ['inTaxMoney', 'taxRate', 'inPrice', 'inMoney']

export default {
	name: 'mistakeCheckStep4',
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
				{ prop: 'inHouse.code', label: '仓库编号', width: '150px' },
				{ prop: 'inHouse.name', label: '仓库名称', width: '120px' },
				{ prop: 'item.code', label: '品项编号', width: '150px' },
				{ prop: 'item.name', label: '品项名称', width: '120px' },
				{ prop: 'item.spec', label: '规格', width: '120px' },
				{ prop: 'itemUnit.name', label: '单位' },
				{
					prop: 'amount',
					label: '入库数量',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.amount, this.sysPointSize)
					}
				},
				{
					prop: 'price',
					label: '入库成本单价',
					width: '100px',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.price, this.sysPricePointSize)
					}
				},
				{
					prop: 'money',
					label: '入库成本金额',
					width: '120px',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.money, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'inTaxPrice',
					label: '含税单价',
					required: true,
					editColumn: true,
					fxRender: this.taxPriceRender,
					click: this.onCellClick('inTaxPrice')
				},
				{
					prop: 'inTaxMoney',
					label: '含税金额',
					required: true,
					editColumn: true,
					fxRender: this.taxMoneyRender,
					click: this.onCellClick('inTaxMoney'),
					width: '110px'
				},
				{
					prop: 'taxRate',
					label: '税率',
					width: '100px',
					required: true,
					editColumn: () => {
						return this.organDetails.inOrgan.taxPlayerFlag === 1
					},
					fxRender: this.taxRender,
					click: this.onCellClick('taxRate')
				},
				{
					prop: 'inPrice',
					label: '非税单价',
					required: true,
					editColumn: true,
					fxRender: this.priceRender,
					click: this.onCellClick('inPrice'),
					width: '110px'
				},
				{
					prop: 'inMoney',
					label: '非税金额',
					required: true,
					editColumn: true,
					fxRender: this.moneyRender,
					click: this.onCellClick('inMoney'),
					width: '110px'
				},
				{
					prop: 'inTaxRateMoney',
					label: '税额',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.inTaxRateMoney, this.sysMoneyPointSize)
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
			fxCalculation: this.$fxCalculation('inStore'),
			tableEditEnterColumnProp: EDIT_INPUT_ENTER_TYPE
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize,
			sysPricePointSize: state => state.system.sysPricePointSize,
			sysPointSize: state => state.system.sysPointSize,
			taxesList: state => state.system.taxesList,
			haveCostPower: state => state.loginer.haveCostPower
		}),
		...mapGetters(['detailsAuthGetter']),
		authDisabled () {
			return !this.detailsAuthGetter('store-manage_in-store-order.edit-instore')
		},
		computedTableColumn () {
			let column = this.tableColumn
			const costPower = ['price', 'money', 'inTaxPrice', 'inTaxMoney', 'taxRate', 'inPrice', 'inMoney', 'inTaxRateMoney']
			if (!this.haveCostPower) {
				column = column.filter(item => {
					return !costPower.includes(item.prop)
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
			if (!this.haveCostPower) {
				return []
			} else {
				return EDIT_INPUT_TYPE
			}
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
				this.$emit('on-finish', 'ZeroPrice')
			})
		},
		fpSaveDetails (detail, origin) {
			return this.onSaveDetailsHandler(detail, origin)
		},
		onSaveDetailsHandler (params, origin) {
			const logger = this.$fxLogger.createInfo('production-manage.production-plan.updateDetails', this.createLoggerParams(params, origin))
			return this.$fxApi('inStore.editDetail', this.organDetails.id)({ data: params, logger }).then(res => {
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
		onCellClick (type) {
			return (row) => {
				this.$refs.detailsTable.setRowEdit(row, type)
			}
		},
		taxPriceRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`inTaxPrice-${$index}`}
				vModel={row.inTaxPrice}
				isEdit={row.isEdit && !this.authDisabled}
				row={row}
				rowIndex={$index}
				columnProp='inTaxPrice'
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.inTaxPrice, this.sysPricePointSize)}
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
				ref={`inTaxMoney-${$index}`}
				vModel={row.inTaxMoney}
				isEdit={row.isEdit && !this.authDisabled}
				row={row}
				rowIndex={$index}
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.inTaxMoney, this.sysMoneyPointSize)}
				columnProp='inTaxMoney'
				pointSize={this.sysMoneyPointSize}
				on-on-change={this.onTaxMoneyChange}
				on-on-input-tab={this.onTaxMoneyTab}
			>
			</fx-list-cell-input-number>
		},
		onTaxMoneyChange (val, row) {
			this.fxCalculation.changeSumPriceWithTax(row)
		},
		onTaxMoneyTab (row, $index) {
			if (this.organDetails.inOrgan.taxPlayerFlag !== 1) {
				this.$refs.detailsTable.setListCellFocus('inPrice')
			} else {
				this.$refs.detailsTable.setListCellFocus('taxRate')
			}
		},
		taxRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`taxRate-${$index}`}
				vModel={row.taxRate}
				isEdit={row.isEdit && !this.authDisabled}
				row={row}
				rowIndex={$index}
				columnProp='taxRate'
				selectOptionList={this.taxesList}
				disabled={this.organDetails.inOrgan.taxPlayerFlag !== 1 || row.giftFlag}
				on-on-change={this.onTaxSelectChange}
			></fx-list-cell-select>
		},
		onTaxSelectChange (item, row) {
			this.fxCalculation.changeTaxes(row)
		},
		priceRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`inPrice-${$index}`}
				vModel={row.inPrice}
				isEdit={row.isEdit && !this.authDisabled}
				row={row}
				rowIndex={$index}
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.inPrice, this.sysPricePointSize)}
				columnProp='inPrice'
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
				ref={`inMoney-${$index}`}
				vModel={row.inMoney}
				isEdit={row.isEdit && !this.authDisabled}
				row={row}
				rowIndex={$index}
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.inMoney, this.sysMoneyPointSize)}
				columnProp='inMoney'
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
			this.haveCostPower ? focus('detailsTable') : focus('saveBtn')
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
