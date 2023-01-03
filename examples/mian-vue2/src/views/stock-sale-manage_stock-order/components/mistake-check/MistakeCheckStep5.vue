<template>
	<w-dialog v-model="dialogVisible" width="1400px" title="异常警告" heightFullscreen @close="clear">
		<div class="create-organ">
			<fx-mistake-check-step :activeStep="7" type="StockOrder"></fx-mistake-check-step>
			<div class="mistake-check-warning fx-warn-font">注：以下明细中，品项为非赠品，但价格为0，请注意！</div>
			<fx-details-table
				ref="detailsTable"
				v-fx-tab:focus.saveBtn
				:disabled="authDisabled"
				:tableColumn="computedColumn"
				:tableData="tableData"
				:tableEditColumnProp="computedEditColumn"
				:tableEditEnterColumnProp="tableEditEnterColumnProp"
				:fpSaveDetails="fpSaveDetails"
				:fpDeleteDetails="fpDeleteDetails"
				:canAdd="false"
				:showColumnFilterBtn="false"
				@on-details-refresh="onDetailsRefresh"
			>
			</fx-details-table>
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
import { apiName } from '../../Index.vue'
import { mapState, mapGetters } from 'vuex'
const EDIT_INPUT_TYPE = ['taxPrice', 'taxMoney', 'taxRate', 'price', 'money']
const EDIT_INPUT_ENTER_TYPE = ['taxMoney', 'taxRate', 'price']
export default {
	name: 'mistakeCheckStep5',
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
			dialogVisible: false,
			tableColumn: [
				{ prop: 'inHouse.code', label: '仓库编号', width: '150px' },
				{ prop: 'inHouse.name', label: '仓库名称', required: true },
				{ prop: 'item.code', label: '品项编号', width: '150px' },
				{ prop: 'item.name', label: '品项名称', required: true },
				{ prop: 'item.spec', label: '规格' },
				{ prop: 'itemUnit.name', label: '单位', required: true },
				{
					prop: 'amount',
					label: '订货数量',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.amount, this.sysPointSize)
					}
				},
				{
					prop: 'taxPrice',
					label: '含税单价',
					width: '120px',
					required: true,
					editColumn: true,
					fxRender: this.taxPriceRender,
					click: this.onCellClick('taxPrice')
				},
				{
					prop: 'taxMoney',
					label: '含税金额',
					width: '120px',
					required: true,
					editColumn: true,
					fxRender: this.taxMoneyRender,
					click: this.onCellClick('taxMoney')
				},
				{
					prop: 'taxRate',
					label: '税率',
					width: '100px',
					required: true,
					editColumn: () => {
						return this.organDetails.organ.taxPlayerFlag === 1
					},
					fxRender: this.taxRender,
					click: this.onCellClick('taxRate')
				},
				{
					prop: 'price',
					label: '非税单价',
					width: '120px',
					required: true,
					editColumn: true,
					fxRender: this.priceRender,
					click: this.onCellClick('price')
				},
				{
					prop: 'money',
					label: '非税金额',
					width: '120px',
					required: true,
					editColumn: true,
					fxRender: this.moneyRender,
					click: this.onCellClick('money')
				},
				{
					prop: 'taxRateMoney',
					label: '税额',
					width: '120px',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.taxRateMoney, this.sysMoneyPointSize)
					}
				},
				{ prop: 'item.assistUnit', label: '辅助单位', width: '120px' },
				{
					prop: 'assistUnitAmount',
					label: '辅助数量',
					formatter: (row) => {
						return row.item.assistUnit ? this.$fxCommon.toFixedAutoZeroFill(row.assistUnitAmount, this.sysPointSize) : ''
					}
				},
				{ prop: 'expectArrivalDate', label: '期望到货时间', width: '150px' }
			],
			tableData: [],
			fxCalculation: this.$fxCalculation('common'),
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
			return !this.detailsAuthGetter('stock-sale-manage_stock-order.edit-stock')
		},
		computedColumn () {
			let column = this.tableColumn
			const moneyPower = ['taxPrice', 'taxMoney', 'taxRate', 'price', 'money', 'taxRateMoney']
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
		computedEditColumn () {
			if (!this.haveMoneyPower) {
				return []
			} else {
				return EDIT_INPUT_TYPE
			}
		}
	},
	methods: {
		open (tableDetails) {
			this.tableData = tableDetails
			this.dialogVisible = true
			this.$nextTick(() => {
				if (this.haveMoneyPower) {
					this.$fxUtils.vDoRefFocus(this, 'detailsTable')
				} else {
					this.$fxUtils.vDoRefFocus(this, 'saveBtn')
				}
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
			detail.billId = this.organDetails.id
			return this.onSaveDetailsHandler(detail, origin)
		},
		onSaveDetailsHandler (params, origin) {
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-order.updateDetails', this.createLoggerParams(params, origin))
			return this.$fxApi(`${apiName}.saveDetails`, params.id, params.billId)({ data: params, logger }).then(res => {
				return Promise.resolve(res)
			})
		},
		createLoggerParams (params, origin) {
			const originData = this.$fxUtils.deepClone(origin)
			const organDetails = this.$fxUtils.deepClone(params)
			return {
				pre: originData,
				cur: organDetails,
				orderData: this.organDetails,
				itemName: organDetails.item.name
			}
		},
		taxPriceRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`taxPrice-${$index}`}
				vModel={row.taxPrice}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='taxPrice'
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.taxPrice, this.sysPricePointSize)}
				pointSize={this.sysPricePointSize}
				vOn:on-change={this.onTaxPriceChange}
			>
			</fx-list-cell-input-number>
		},
		onTaxPriceChange (val, row) {
			this.fxCalculation.changePriceWithTax(row)
		},
		taxMoneyRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`taxMoney-${$index}`}
				vModel={row.taxMoney}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='taxMoney'
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.taxMoney, this.sysMoneyPointSize)}
				pointSize={this.sysMoneyPointSize}
				vOn:on-change={this.onTaxMoneyChange}
				on-on-input-tab={this.onTaxMoneyTab}
			>
			</fx-list-cell-input-number>
		},
		onTaxMoneyChange (val, row) {
			this.fxCalculation.changeSumPriceWithTax(row)
		},
		onTaxMoneyTab (row, $index) {
			if (this.organDetails.organ.taxPlayerFlag !== 1) {
				this.$refs.detailsTable.setListCellFocus('price')
			} else {
				this.$refs.detailsTable.setListCellFocus('taxRate')
			}
		},
		taxRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`taxRate-${$index}`}
				vModel={row.taxRate}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='taxRate'
				selectOptionList={this.taxesList}
				disabled={this.organDetails.organ.taxPlayerFlag !== 1 || !!row.giftFlag}
				vOn:on-change={this.onTaxSelectChange}
			></fx-list-cell-select>
		},
		onTaxSelectChange (item, row) {
			this.fxCalculation.changeTaxes(row)
		},
		priceRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`price-${$index}`}
				vModel={row.price}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='price'
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.price, this.sysPricePointSize)}
				pointSize={this.sysPricePointSize}
				vOn:on-change={this.onPriceChange}
			>
			</fx-list-cell-input-number>
		},
		onPriceChange (val, row) {
			this.fxCalculation.changePrice(row)
		},
		moneyRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`money-${$index}`}
				vModel={row.money}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='money'
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.money, this.sysMoneyPointSize)}
				pointSize={this.sysMoneyPointSize}
				vOn:on-change={this.onMoneyChange}
			>
			</fx-list-cell-input-number>
		},
		onMoneyChange (val, row) {
			this.fxCalculation.changeSumPrice(row)
		},
		onCellClick (type) {
			return (row) => {
				this.$refs.detailsTable.setRowEdit(row, type)
			}
		},
		fpDeleteDetails (ids) {
			const deleteItemInfo = this.getDeleteItemInfo(ids)
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-order.deleteDetails', { deleteItemInfo, orderData: this.organDetails })
			if (ids.length > 0) {
				return this.$fxApi(`${apiName}.delDetailMulity`)({ data: ids, logger }).then(res => {
					return Promise.resolve(res)
				})
			} else {
				return this.$fxApi(`${apiName}.delDetail`, ids[0])({ logger }).then(res => {
					return Promise.resolve(res)
				})
			}
		},
		getDeleteItemInfo (ids) {
			return this.tableData.filter(item => {
				return ids.includes(item.id)
			}).map(item => {
				const storeName = item.inHouse.name
				const name = item.item.name
				const itemUnit = item.itemUnit.name
				const amount = item.amount
				const taxPrice = item.taxPrice
				return `买方仓库:${storeName},品项名称:${name},单位:${itemUnit},采购数量:${amount},含税单价:${taxPrice}`
			}).join(';')
		},
		onDetailsRefresh () {
			return this.$fxApi(`${apiName}.getZeroPrice`, this.organDetails.id).then(res => {
				this.tableData = res.errorDetailList ? res.errorDetailList.details : []
			})
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
