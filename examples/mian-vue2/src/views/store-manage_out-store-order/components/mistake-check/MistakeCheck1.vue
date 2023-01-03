<template>
	<w-dialog v-model="dialogVisible" title="异常警告" width="1400px" heightFullscreen @close="clear">
		<div class="create-organ">
			<fx-mistake-check-step :activeStep="1" :type="mistakeStepType"></fx-mistake-check-step>
			<div class="mistake-check-warning fx-warn-font">注：以下明细中，存在出库数量为0的品项，请再次确认！</div>
			<fx-details-table
				ref="detailsTable"
				v-fx-tab:focus.saveBtn
				:disabled="authDisabled"
				:tableColumn="computedTableColumn"
				:tableData="tableData"
				:tableValiDate="tableValiDate"
				:fpBeforeRowEdit="beforeRowEdit"
				:tableEditColumnProp="tableEditColumnProp"
				:tableEditEnterColumnProp="tableEditEnterColumnProp"
				:mainId="organDetails.id"
				:fpSaveDetails="fpSaveDetails"
				:fpOnRowEdit="fpOnRowEdit"
				:canAdd="false"
				:showColumnFilterBtn="false"
				:fpDeleteDetails="onDeleteClick"
				@on-details-refresh="onDetailsRefresh"
			></fx-details-table>
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
const EDIT_INPUT_TYPE = ['unit', 'amount', 'salesTaxPrice', 'salesTaxMoney', 'salesTaxRate', 'salesPrice', 'salesMoney', 'assistUnitAmount']
const EDIT_INPUT_ENTER_TYPE = ['salesTaxMoney', 'salesTaxRate', 'salesPrice', 'salesMoney']

export default {
	name: 'mistakeCheckStep1',
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
		actionType: String,
		systemParamAmountNegative: Boolean
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
				{
					prop: 'unit',
					label: '单位',
					editColumn: (row) => {
						return (this.isHand || row.preDetailIsAssistUnit)
					},
					fxRender: this.unitRender,
					click: this.onCellClick('unit')
				},
				{
					prop: 'amount',
					label: '出库数量',
					width: '120px',
					editColumn: true,
					fxRender: this.amountRender,
					click: this.onCellClick('amount')
				},
				{
					prop: 'price',
					label: '成本单价',
					width: '120px',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.price, this.sysPricePointSize)
					}
				},
				{
					prop: 'money',
					label: '成本金额',
					width: '120px',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.money, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'salesTaxPrice',
					label: '含税销售单价',
					width: '120px',
					editColumn: () => {
						return !this.isMove
					},
					fxRender: this.taxPriceRender,
					click: this.onCellClick('salesTaxPrice')
				},
				{
					prop: 'salesTaxMoney',
					label: '含税销售金额',
					width: '120px',
					editColumn: () => {
						return !this.isMove
					},
					fxRender: this.taxMoneyRender,
					click: this.onCellClick('salesTaxMoney')
				},
				{
					prop: 'salesTaxRate',
					label: '销项税率',
					width: '100px',
					editColumn: () => {
						return this.organCanChangeTax && !this.isMove
					},
					fxRender: this.taxRender,
					click: this.onCellClick('salesTaxRate')
				},
				{
					prop: 'salesPrice',
					label: '非税销售单价',
					width: '120px',
					editColumn: () => {
						return !this.isMove
					},
					fxRender: this.priceRender,
					click: this.onCellClick('salesPrice')
				},
				{
					prop: 'salesMoney',
					label: '非税销售金额',
					width: '120px',
					editColumn: () => {
						return !this.isMove
					},
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
					width: '120px',
					editColumn: (row) => {
						return row.item && row.item.assistUnit
					},
					fxRender: this.assistUnitAmountRender,
					click: this.onCellClick('assistUnitAmount')
				}
			],
			tableData: [],
			tableValiDate: [{
				columnProp: 'assistUnitAmount',
				rule (row, success, error) {
					if (row.amount && row.item.assistUnit && !Number(row.assistUnitAmount)) {
						error('辅助数量不能为0')
					} else {
						success()
					}
				}
			}],
			fxCalculation: this.$fxCalculation('outStore'),
			tableEditEnterColumnProp: EDIT_INPUT_ENTER_TYPE,
			itemUnitList: [],
			unitSelectLoading: false,
			fxCache: this.$fxUtils.fxCache('out-store'),
			isCommonTypeByRules: this.$fxTypeMiddleware.isCommonType('outStoreBillGenerateType', 'rules')
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize,
			sysPricePointSize: state => state.system.sysPricePointSize,
			sysPointSize: state => state.system.sysPointSize,
			taxesList: state => state.system.taxesList,
			haveMoneyPower: state => state.loginer.haveMoneyPower,
			haveCostPower: state => state.loginer.haveCostPower
		}),
		...mapGetters(['detailsAuthGetter', 'getSysParams']),
		authDisabled () {
			return !this.detailsAuthGetter('store-manage_out-store-order.edit-outstore')
		},
		mainAssistAmountTogether () {
			return this.getSysParams('SJXZL_ASSIST_MAIN_TOGETER', 'value') || true
		},
		computedTableColumn () {
			let column = this.tableColumn
			const moneyPower = ['salesTaxPrice', 'salesTaxMoney', 'salesTaxRate', 'salesPrice', 'salesMoney', 'salesTaxRateMoney']
			const costPower = ['price', 'money']
			if (!this.haveMoneyPower) {
				column = column.filter(item => {
					return !moneyPower.includes(item.prop)
				})
			}
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
			if (this.isAssign && !this.isCrossAssign && this.systemParamMoneyEdit) {
				return ['amount', 'salesTaxPrice', 'salesTaxMoney', 'salesTaxRate', 'salesPrice', 'salesMoney', 'assistUnitAmount']
			} else if (this.isAssign && !this.isCrossAssign && !this.systemParamMoneyEdit) {
				return ['amount', 'assistUnitAmount']
			} else if (this.isMove) {
				return ['amount', 'assistUnitAmount']
			} else {
				return EDIT_INPUT_TYPE
			}
		},
		systemParamMoneyEdit () {
			return this.getSysParams('SJXZL_OUTSTORE_MONEY_AUTH', 'value')
		},
		strategyMoneyEdit () {
			return (row) => {
				return [0, 1].includes(row.strategy)
			}
		},
		organCanChangeTax () {
			return this.organDetails.organ.taxPlayerFlag === 1
		},
		isCrossAssign () {
			return this.organDetails.sourceBillType === 'InStore'
		},
		isMove () {
			return this.isCommonTypeByRules('move')(this.organDetails.billType, this.organDetails.subBillType)
		},
		isHand () {
			return !this.organDetails.parentBill
		},
		isAssign () {
			return this.isCommonTypeByRules(['assignStraight-sub', 'assignCross-sub'])(this.organDetails.billType, this.organDetails.subBillType)
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
				if (this.authDisabled) {
					this.$fxUtils.vDoRefFocus(this, 'saveBtn')
				} else {
					this.$refs.detailsTable.setRowEdit(this.tableData[0], 'amount')
				}
			})
		},
		onSaveReturnClick () {
			this.onSaveTableListCheck().then(() => {
				this.dialogVisible = false
			})
		},
		onSaveTableListCheck () {
			return this.$refs.detailsTable.checkDetailsUnSaving()
		},
		onSaveClick () {
			this.onSaveTableListCheck().then(() => {
				this.dialogVisible = false
				this.$emit('on-finish', 'ZeroAmount')
			})
		},
		onDetailsRefresh () {
			this.$fxApi('outStore.getZeroAmount', this.organDetails.id).then(res => {
				this.tableData = res.errorDetailList || []
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
		onDeleteClick (delData) {
			const deleteItemInfo = this.getDeleteItemInfo(delData)
			const logger = this.$fxLogger.createInfo('store-manage.out-store-order.deleteDetails', { deleteItemInfo, orderData: this.organDetails })
			return this.$fxApi('outStore.delDetailMulity', this.organDetails.id, true)({ data: delData, logger }).then(res => {
				return Promise.resolve(res)
			})
		},
		getDeleteItemInfo (ids) {
			return this.tableData.filter(item => {
				return ids.includes(item.id)
			}).map(item => {
				const storeName = item.outHouse.name
				const name = item.item.name
				const itemUnit = item.itemUnit.name
				const amount = item.amount
				const taxPrice = item.salesTaxPrice
				return `出库仓库:${storeName},品项名称:${name},单位:${itemUnit},出库数量:${amount},含税销售单价:${taxPrice}`
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
				isEdit={row.isEdit && (this.tableEditColumnProp.includes('unit') || row.preDetailIsAssistUnit)}
				row={row}
				rowIndex={$index}
				columnProp='unit'
				cellText={row.itemUnit.name}
				loading={this.unitSelectLoading}
				selectOptionList={this.itemUnitList}
				on-on-change={this.onUnitSelectChange}
				fpSelectShow={this.onUnitSelectShow(row)}
			></fx-list-cell-select>
		},
		onUnitSelectChange (item, row) {
			if (row.preDetailIsAssistUnit) {
				this.fxCalculation.changeUnitNotCalculateAssistAmount(row, item)
			} else {
				this.fxCalculation.changeUnit(row, item)
			}
		},
		onUnitSelectShow (row) {
			return () => {
				return new Promise(resolve => {
					this.unitSelectLoading = true
					if (row.item.id) {
						this.getUnitList(row.item.id, row.itemUnit.id).then(res => {
							this.unitSelectLoading = false
							this.itemUnitList = res
							resolve()
						})
					} else {
						this.$fxMessage.warning('请先选择品项')
					}
				})
			}
		},
		getUnitList (itemId, itemUnitId = '') {
			const key = `unitList.${itemId}`
			const data = itemUnitId ? { itemUnitId } : {}
			return this.fxCache.cacher(key, this.$fxApi('outStore.getUnitList', itemId, this.organDetails.id)({ data }))
		},
		amountRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`amount-${$index}`}
				vModel={row.amount}
				isEdit={row.isEdit && this.tableEditColumnProp.includes('amount')}
				row={row}
				rowIndex={$index}
				columnProp='amount'
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.amount, this.sysPointSize)}
				pointSize={this.sysPointSize}
				on-on-change={this.onAmountChange}
				vOn:on-input-enter={this.onAmountEnter}
				vOn:on-input-tab={this.onAmountTab}
			>
			</fx-list-cell-input-number>
		},
		onAmountChange (val, row, { oldVal }) {
			this.fxCalculation.changeAmount(row)
			if (!row.preDetailIsAssistUnit && (`${oldVal}` === '0' || this.mainAssistAmountTogether)) {
				this.fxCalculation.calculateAssistAmount(row, this.itemUnitList)
			}
		},
		onAmountEnter (row, index) {
			if (row.giftFlag || !this.haveMoneyPower || this.isMove) {
				this.$refs.detailsTable.doRowEditEnter()
			} else if (this.strategyMoneyEdit(row)) {
				this.$refs.detailsTable.setListCellFocus('salesTaxPrice')
			} else if (this.organCanChangeTax) {
				this.$refs.detailsTable.setListCellFocus('salesTaxRate')
			} else {
				this.$refs.detailsTable.doRowEditEnter()
			}
		},
		onAmountTab (row, $index) {
			if (row.giftFlag || !this.haveMoneyPower || this.isMove) {
				if (row.item.assistUnit) {
					this.$refs.detailsTable.setListCellFocus('assistUnitAmount')
				} else {
					this.$refs.detailsTable.doRowEditTab({ row, index: $index })
				}
			} else if (this.strategyMoneyEdit(row)) {
				this.$refs.detailsTable.setListCellFocus('salesTaxPrice')
			} else if (this.organCanChangeTax) {
				this.$refs.detailsTable.setListCellFocus('salesTaxRate')
			} else {
				this.$refs.detailsTable.doRowEditTab({ row, index: $index })
			}
		},
		taxPriceRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`salesTaxPrice-${$index}`}
				vModel={row.salesTaxPrice}
				isEdit={row.isEdit && this.tableEditColumnProp.includes('salesTaxPrice')}
				row={row}
				rowIndex={$index}
				columnProp='salesTaxPrice'
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.salesTaxPrice, this.sysPricePointSize)}
				pointSize={this.sysPricePointSize}
				disabled={row.giftFlag}
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
				isEdit={row.isEdit && this.tableEditColumnProp.includes('salesTaxMoney')}
				row={row}
				rowIndex={$index}
				columnProp='salesTaxMoney'
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.salesTaxMoney, this.sysMoneyPointSize)}
				pointSize={this.sysMoneyPointSize}
				disabled={row.giftFlag}
				on-on-change={this.onTaxMoneyChange}
				on-on-input-tab={this.onTaxMoneyTab}
			>
			</fx-list-cell-input-number>
		},
		onTaxMoneyTab (row, $index) {
			if (!this.organCanChangeTax) {
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
				isEdit={row.isEdit && this.tableEditColumnProp.includes('salesTaxRate')}
				row={row}
				rowIndex={$index}
				columnProp='salesTaxRate'
				disabled={!this.organCanChangeTax}
				selectOptionList={this.taxesList}
				disabled={row.giftFlag}
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
				isEdit={row.isEdit && this.tableEditColumnProp.includes('salesPrice')}
				row={row}
				rowIndex={$index}
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.salesPrice, this.sysPricePointSize)}
				columnProp='salesPrice'
				pointSize={this.sysPricePointSize}
				disabled={row.giftFlag}
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
				isEdit={row.isEdit && this.tableEditColumnProp.includes('salesMoney')}
				row={row}
				rowIndex={$index}
				columnProp='salesMoney'
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.salesMoney, this.sysMoneyPointSize)}
				pointSize={this.sysMoneyPointSize}
				disabled={row.giftFlag}
				on-on-change={this.onMoneyChange}
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
				this.$refs.detailsTable.doRowEditTab({ row, index: $index })
			}
		},
		assistUnitAmountRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`assistUnitAmount-${$index}`}
				vModel={row.assistUnitAmount}
				isEdit={row.isEdit && !!row.item.assistUnit && this.tableEditColumnProp.includes('assistUnitAmount')}
				row={row}
				rowIndex={$index}
				cellText={row.item.assistUnit ? this.$fxCommon.toFixedAutoZeroFill(row.assistUnitAmount, this.sysPointSize) : ''}
				columnProp='assistUnitAmount'
				pointSize={this.sysPointSize}
			>
			</fx-list-cell-input-number>
		},
		beforeRowEdit (row) {
			this.itemUnitList = this.$fxUtils.isEmptyObj(row.itemUnit) ? [] : [row.itemUnit]
			return Promise.resolve()
		},
		fpOnRowEdit (row, $index, type) {
			return new Promise(resolve => {
				if (type === 'unit' && this.isMove && !row.preDetailIsAssistUnit) {
					this.$refs.detailsTable.setListCellFocus('amount')
				} else {
					this.$refs.detailsTable.setListCellFocus(type)
				}
				resolve()
			})
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
