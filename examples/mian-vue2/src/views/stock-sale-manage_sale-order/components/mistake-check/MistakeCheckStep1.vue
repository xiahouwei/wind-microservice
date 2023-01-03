<template>
	<w-dialog v-model="dialogVisible" width="1200px" title="异常警告" heightFullscreen @close="clear">
		<div class="create-organ">
			<fx-mistake-check-step :activeStep="1" type="SalesOrder"></fx-mistake-check-step>
			<div class="mistake-check-warning fx-warn-font">注：以下品项为当前订货方案规定必须要订货的品项，请填写销售数量！</div>
			<fx-details-table
				ref="detailsTable"
				v-fx-tab:focus.saveBtn
				:disabled="authDisabled"
				:tableColumn="computedColumn"
				:tableValiDate="tableValiDate"
				:tableData="tableData"
				:tableEditColumnProp="computedEditColumn"
				:tableEditEnterColumnProp="tableEditEnterColumnProp"
				:canAdd="false"
				:selectable="false"
				:showTools="false"
			>
			</fx-details-table>
		</div>
		<template slot="footer">
			<el-button
				ref="saveReturnBtn"
				v-fx-tab:focus.detailsTable
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
import { apiName } from '../../Index.vue'
const EDIT_INPUT_TYPE = ['amount', 'taxPrice', 'taxMoney', 'taxRate', 'price', 'money', 'assistUnitAmount', 'expectArrivalDate']
const EDIT_INPUT_ENTER_TYPE = ['taxMoney', 'taxRate', 'price', 'money', 'assistUnitAmount']
export default {
	name: 'mistakeCheckStep1',
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
				{
					prop: 'item.code',
					label: '品项编号',
					width: '150px',
					required: true
				},
				{ prop: 'item.name', label: '品项名称' },
				{ prop: 'item.spec', label: '规格', width: '100px' },
				{
					prop: 'unit',
					label: '单位',
					width: '120px',
					required: true,
					editColumn: () => {
						return !this.organDetails.stockPlan.id
					},
					fxRender: this.unitRender,
					click: this.onCellClick('unit')
				},
				{
					prop: 'amount',
					label: '销售数量',
					width: '140px',
					required: true,
					editColumn: true,
					fxRender: this.amountRender,
					click: this.onCellClick('amount')
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
				{ prop: 'taxRateMoney', label: '税额', width: '120px' },
				{ prop: 'item.assistUnit', label: '辅助单位', width: '120px' },
				{
					prop: 'assistUnitAmount',
					label: '辅助数量',
					width: '120px',
					required: true,
					editColumn: (row) => {
						return row.item && row.item.assistUnit
					},
					fxRender: this.assistUnitAmountRender,
					click: this.onCellClick('assistUnitAmount')
				},
				{
					prop: 'expectArrivalDate',
					label: '期望到货时间',
					width: '200px',
					required: true,
					editColumn: true,
					fxRender: this.expectArrivalDateRender,
					click: this.onCellClick('expectArrivalDate')
				}
			],
			tableValiDate: [{
				columnProp: 'unit',
				rule (row, success, error) {
					if (!row.itemUnit.id) {
						error('单位不能为空')
					} else {
						success()
					}
				}
			}, {
				columnProp: 'amount',
				rule (row, success, error) {
					if (`${row.amount}` === '0') {
						error('销售数量不能为0')
					} else if (row.stockPlanDetail) {
						if (
							row.amount < row.stockPlanDetail.lowerLimit ||
							(row.stockPlanDetail.supperLimit > 0 && row.amount > row.stockPlanDetail.supperLimit) ||
							(row.stockPlanDetail.roundingWay && row.amount % row.stockPlanDetail.roundingNum !== 0)
						) {
							error()
						} else {
							success()
						}
					} else {
						success()
					}
				}
			}, {
				columnProp: 'expectArrivalDate',
				rule: (row, success, error) => {
					if (!row.expectArrivalDate) {
						error('期望到货日期不能为空')
					} else if (!this.$fxUtils.compareDate(row.expectArrivalDate, this.organDetails.businessDate)) {
						error('期望到货时间不得小于订货时间')
					} else {
						success()
					}
				}
			}],
			fxCalculation: this.$fxCalculation('common'),
			itemUnitList: [],
			tableData: [],
			tableEditEnterColumnProp: EDIT_INPUT_ENTER_TYPE
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize,
			sysPricePointSize: state => state.system.sysPricePointSize,
			sysPointSize: state => state.system.sysPointSize,
			haveMoneyPower: state => state.loginer.haveMoneyPower,
			taxesList: state => state.system.taxesList
		}),
		...mapGetters(['getSysParams', 'detailsAuthGetter']),
		mainAssistAmountTogether () {
			return this.getSysParams('SJXZL_ASSIST_MAIN_TOGETER', 'value') || true
		},
		authDisabled () {
			return !this.detailsAuthGetter('stock-sale-manage_sale-order.edit-sale')
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
				return ['amount', 'assistUnitAmount', 'expectArrivalDate']
			} else {
				return EDIT_INPUT_TYPE
			}
		}
	},
	methods: {
		open (mustItemList) {
			this.tableData = mustItemList.map(item => {
				const	arrivalDate = new Date(this.organDetails.businessDate).getTime() + this.$fxUtils.h2ms(item.stockPlanDetail.arrivalCycle)
				const itemUnit = item.itemUnit || item.itemUnitList[0]
				return {
					id: this.$fxUtils.createUUID(),
					billId: this.organDetails.id,
					item,
					itemUnit,
					mainUnitId: '',
					amount: 0,
					taxPrice: item.taxPrice || 0,
					taxMoney: 0,
					taxRate: item.taxRate || 0,
					price: item.price || 0,
					money: 0,
					taxRateMoney: 0,
					assistUnitAmount: '',
					expectArrivalDate: this.$fxUtils.setDateTime(new Date(arrivalDate)),
					abortAssign: 0,
					itemUnitList: item.itemUnitList,
					stockPlanDetail: item.stockPlanDetail,
					memo: '',
					storeSelectList: [],
					tipFlag: false
				}
			})
			this.dialogVisible = true
			this.$nextTick(() => {
				this.$fxUtils.vDoRefFocus(this, 'detailsTable')
			})
		},
		onSaveReturnClick () {
			this.onSaveTableListCheck().then(this.onSaveHandler).then(() => {
				this.dialogVisible = false
			})
		},
		onSaveClick () {
			this.onSaveTableListCheck().then(this.onSaveHandler).then(() => {
				this.dialogVisible = false
				this.$emit('on-finish')
			})
		},
		onSaveTableListCheck () {
			return new Promise(resolve => {
				this.$refs.detailsTable.checkDetailsUnSaving().then(() => {
					if (this.tableData.some(item => {
						return `${item.amount}` === '0'
					})) {
						this.$fxMessage.warning('品项数量不能为0')
					} else {
						resolve()
					}
				})
			})
		},
		onSaveHandler () {
			const addItemInfo = this.getAddItemInfo()
			const logger = this.$fxLogger.createInfo('stock-sale-manage.sale-order.addDetails', { orderData: this.organDetails, addItemInfo })
			return this.$fxApi(`${apiName}.addMustDetailsMulity`, this.organDetails.id, this.tableData)({ logger }).then(res => {
				return Promise.resolve(res)
			})
		},
		getAddItemInfo () {
			return this.tableData.map(item => {
				const name = item.item.name
				const itemUnit = item.itemUnit.name
				const amount = item.amount
				const taxPrice = item.taxPrice
				return `品项名称:${name},单位:${itemUnit},销售数量:${amount},含税单价:${taxPrice}`
			}).join(';')
		},
		onCellClick (type) {
			return (row) => {
				this.$refs.detailsTable.setRowEdit(row, type)
			}
		},
		unitRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`unit-${$index}`}
				value={row.itemUnit.id}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='unit'
				cellText={row.itemUnit.name}
				selectOptionList={row.itemUnitList}
				disabled={!!this.organDetails.stockPlan.id}
				vOn:on-change={this.onUnitSelectChange}
			></fx-list-cell-select>
		},
		onUnitSelectChange (item, row) {
			this.fxCalculation.changeUnit(row, item)
		},
		amountRender (h, { row, $index }) {
			h = this.$createElement
			return <el-tooltip value={row.tipFlag} manual={true} effect="light" placement="top">
				<div slot="content">
					<span>上限:{row.stockPlanDetail && row.stockPlanDetail.supperLimit}</span>
					<span>下限:{row.stockPlanDetail && row.stockPlanDetail.lowerLimit}</span>
					<br/>
					<span>取整:{(row.stockPlanDetail && row.stockPlanDetail.roundingWay) ? row.stockPlanDetail.roundingNum : '不取整'}</span>
				</div>
				<fx-list-cell-input-number
					ref={`amount-${$index}`}
					vModel={row.amount}
					isEdit={row.isEdit}
					row={row}
					rowIndex={$index}
					columnProp='amount'
					cellText={this.$fxCommon.toFixedAutoZeroFill(row.amount, this.sysPointSize)}
					pointSize={this.sysPointSize}
					class="cell-amount__input"
					vOn:on-change={this.onAmountChange}
					vOn:focus={this.onAmountFocus}
					vOn:blur={this.onAmountBlur}
					vOn:on-input-enter={this.onAmountEnter}
					vOn:on-input-tab={this.onAmountTab}
				>
				</fx-list-cell-input-number>
			</el-tooltip>
		},
		onAmountFocus (row, index) {
			row.tipFlag = true
		},
		onAmountBlur (row, index) {
			row.tipFlag = false
		},
		onAmountChange (val, row, { oldVal }) {
			this.fxCalculation.changeAmount(row)
			if (`${oldVal}` === '0' || this.mainAssistAmountTogether) {
				this.fxCalculation.calculateAssistAmount(row, row.itemUnitList)
			}
		},
		onAmountEnter (row, index) {
			if (!this.haveMoneyPower) {
				this.$refs.detailsTable.doRowEditEnter()
			} else {
				this.$refs.detailsTable.setListCellFocus('taxPrice')
			}
		},
		onAmountTab (row, index) {
			if (!this.haveMoneyPower) {
				if (row.item.assistUnit) {
					this.$refs.detailsTable.setListCellFocus('assistUnitAmount')
				} else {
					this.$refs.detailsTable.setListCellFocus('expectArrivalDate')
				}
			} else {
				this.$refs.detailsTable.setListCellFocus('taxPrice')
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
				vOn:on-input-tab={this.onMoneyTab}
			>
			</fx-list-cell-input-number>
		},
		onMoneyChange (val, row) {
			this.fxCalculation.changeSumPrice(row)
		},
		onMoneyTab (row, $index) {
			if (row.item.assistUnit) {
				this.$refs.detailsTable.setListCellFocus('assistUnitAmount')
			} else {
				this.$refs.detailsTable.setListCellFocus('expectArrivalDate')
			}
		},
		assistUnitAmountRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`assistUnitAmount-${$index}`}
				vModel={row.assistUnitAmount}
				isEdit={row.isEdit && !!row.item.assistUnit}
				row={row}
				rowIndex={$index}
				columnProp='assistUnitAmount'
				cellText={row.item.assistUnit ? this.$fxCommon.toFixedAutoZeroFill(row.assistUnitAmount, this.sysPointSize) : ''}
				pointSize={this.sysPointSize}
				on-on-change={this.onAssistUnitAmountChange}
			>
			</fx-list-cell-input-number>
		},
		onAssistUnitAmountChange (val, row) {
			if (row.itemUnit.assistFlag) {
				this.fxCalculation.changeAssistAmount(row)
			}
		},
		expectArrivalDateRender (h, { row, $index }) {
			h = this.$createElement
			const pickerOptions = {
				disabledDate: (time) => {
					return time.getTime() < this.$fxUtils.getTimeBeforeDay(this.organDetails.businessDate)
				}
			}
			return <fx-list-cell-date
				ref={`expectArrivalDate-${$index}`}
				vModel={row.expectArrivalDate}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				valueFormat='yyyy-MM-dd HH:mm:SS'
				columnProp='expectArrivalDate'
				cellText={this.$fxUtils.formatterDateTime(row.expectArrivalDate)}
				pickerOptions={pickerOptions}
			>
			</fx-list-cell-date>
		},
		clear () {
			this.$emit('on-mistake-close')
			this.$refs.detailsTable.clear()
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
