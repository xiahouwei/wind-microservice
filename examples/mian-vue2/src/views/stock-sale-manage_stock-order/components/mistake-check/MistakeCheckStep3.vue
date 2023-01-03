<template>
	<w-dialog v-model="dialogVisible" width="1400px" title="异常警告" heightFullscreen @close="clear">
		<div class="create-organ">
			<fx-mistake-check-step :activeStep="3" type="StockOrder"></fx-mistake-check-step>
			<div class="mistake-check-warning fx-warn-font">注：以下明细中，存在订货数量为0的品项，请修改数量或删除！</div>
			<fx-details-table
				ref="detailsTable"
				v-fx-tab:focus.saveBtn
				:disabled="authDisabled"
				:tableColumn="computedColumn"
				:tableValiDate="tableValiDate"
				:tableData="tableData"
				:tableEditColumnProp="computedEditColumn"
				:tableEditEnterColumnProp="tableEditEnterColumnProp"
				:fpBeforeRowEdit="beforeRowEdit"
				:fpOnRowEdit="fpOnRowEdit"
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
import { apiName } from '../../Index.vue'
import { mapState, mapGetters } from 'vuex'
const EDIT_INPUT_TYPE = ['unit', 'amount', 'taxPrice', 'taxMoney', 'taxRate', 'price', 'money', 'assistUnitAmount']
const EDIT_INPUT_ENTER_TYPE = ['taxMoney', 'taxRate', 'price', 'money']
export default {
	name: 'mistakeCheckStep3',
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
				{ prop: 'inHouse.name', label: '仓库名称' },
				{ prop: 'item.code', label: '品项编号', width: '150px' },
				{ prop: 'item.name', label: '品项名称' },
				{ prop: 'item.spec', label: '规格' },
				{
					prop: 'unit',
					label: '单位',
					width: '120px',
					required: true,
					editColumn: () => {
						return !this.organDetails.purchasePlan
					},
					fxRender: this.unitRender,
					click: this.onCellClick('unit')
				},
				{
					prop: 'amount',
					label: '订货数量',
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
					editColumn: (row) => {
						return !row.giftFlag
					},
					fxRender: this.taxPriceRender,
					click: this.onCellClick('taxPrice')
				},
				{
					prop: 'taxMoney',
					label: '含税金额',
					width: '120px',
					required: true,
					editColumn: (row) => {
						return !row.giftFlag
					},
					fxRender: this.taxMoneyRender,
					click: this.onCellClick('taxMoney')
				},
				{
					prop: 'taxRate',
					label: '税率',
					width: '100px',
					required: true,
					editColumn: (row) => {
						return this.organDetails.organ.taxPlayerFlag === 1 && !row.giftFlag
					},
					fxRender: this.taxRender,
					click: this.onCellClick('taxRate')
				},
				{
					prop: 'price',
					label: '非税单价',
					width: '120px',
					required: true,
					editColumn: (row) => {
						return !row.giftFlag
					},
					fxRender: this.priceRender,
					click: this.onCellClick('price')
				},
				{
					prop: 'money',
					label: '非税金额',
					width: '120px',
					required: true,
					editColumn: (row) => {
						return !row.giftFlag
					},
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
					width: '120px',
					required: true,
					editColumn: (row) => {
						return row.item && row.item.assistUnit
					},
					fxRender: this.assistUnitAmountRender,
					click: this.onCellClick('assistUnitAmount')
				},
				{ prop: 'expectArrivalDate', label: '期望到货时间', width: '200px', required: true }
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
					if (row.amount === 0) {
						error('订货数量不能为0')
					} else {
						success()
					}
				}
			}],
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
			haveMoneyPower: state => state.loginer.haveMoneyPower,
			sysArrivalInterval: state => state.system.sysParamsConfig.CXGL_CGDD_SJQZL_EXPECTTIME.value
		}),
		...mapGetters(['getSysParams', 'detailsAuthGetter']),
		mainAssistAmountTogether () {
			return this.getSysParams('SJXZL_ASSIST_MAIN_TOGETER', 'value') || true
		},
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
				return ['unit', 'amount', 'assistUnitAmount']
			} else {
				return EDIT_INPUT_TYPE
			}
		},
		isSingleHouse () {
			return this.organDetails.singleHouse === 1
		}
	},
	methods: {
		open (tableDetails) {
			this.tableData = tableDetails
			this.dialogVisible = true
			this.$nextTick(() => {
				this.$refs.detailsTable.setRowEdit(this.tableData[0], 'amount')
			})
		},
		onSaveReturnClick () {
			this.onSaveTableListCheck().then(() => {
				this.dialogVisible = false
			})
		},
		onSaveTableListCheck () {
			return new Promise(resolve => {
				this.$refs.detailsTable.checkDetailsUnSaving().then(() => {
					if (this.tableData.some(item => {
						return `${item.amount}` === '0'
					})) {
						this.$fxMessage.warning('订货数量不能为0')
					} else {
						resolve()
					}
				}).catch(() => {
					if (this.authDisabled && this.tableData.some(item => `${item.amount}` === '0')) {
						this.$fxMessage.warning('品项数量为0，无法继续操作，请确定是否拥有对当前单据的编辑权限')
					}
				})
			})
		},
		onSaveClick () {
			this.onSaveTableListCheck().then(() => {
				this.dialogVisible = false
				this.$emit('on-finish')
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
				disabled={!!this.organDetails.purchasePlan}
				vOn:on-change={this.onUnitSelectChange}
			></fx-list-cell-select>
		},
		onUnitSelectChange (item, row) {
			if (row.itemUnit.id) {
				this.fxCalculation.changeUnit(row, item)
			} else {
				this.getItemPrice(row.item.id, item.id).then(res => {
					this.fxCalculation.changeUnit(row, item)
					row.taxPrice = res.taxPrice
					row.price = res.price
					row.taxRate = res.taxRate
				})
			}
		},
		getItemPrice (itemId, unitId) {
			const params = {
				buyerOrganId: this.organDetails.organ.id,
				sellerOrganId: this.organDetails.otherOrganId,
				bizDate: this.organDetails.orderDate,
				itemId: itemId,
				unitId: unitId
			}
			return this.$fxApi(`${apiName}.getItemPirce`)({ data: params })
		},
		amountRender (h, { row, $index }) {
			h = this.$createElement
			return <el-tooltip value={row.mistakeTipFlag && !!row.stockPlanDetail} manual={true} effect="light" placement="top">
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
			this.$set(this.tableData[index], 'mistakeTipFlag', true)
		},
		onAmountBlur (row, index) {
			row.mistakeTipFlag = false
		},
		onAmountChange (val, row, { oldVal }) {
			this.fxCalculation.changeAmount(row)
			if (`${oldVal}` === '0' || this.mainAssistAmountTogether) {
				this.fxCalculation.calculateAssistAmount(row, row.itemUnitList)
			}
		},
		onAmountEnter (row, index) {
			if (row.giftFlag || !this.haveMoneyPower) {
				this.$refs.detailsTable.doRowEditEnter()
			} else {
				this.$refs.detailsTable.setListCellFocus('taxPrice')
			}
		},
		onAmountTab (row, $index) {
			if (row.giftFlag || !this.haveMoneyPower) {
				if (row.item.assistUnit) {
					this.$refs.detailsTable.setListCellFocus('assistUnitAmount')
				} else {
					this.$refs.detailsTable.doRowEditTab({ row, index: $index })
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
				disabled={!!row.giftFlag}
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
				disabled={!!row.giftFlag}
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
				disabled={!!row.giftFlag}
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
				disabled={!!row.giftFlag}
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
				this.$refs.detailsTable.doRowEditTab({ row, index: $index })
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
					return time.getTime() < this.$fxUtils.getTimeBeforeDay(this.organDetails.orderDate)
				}
			}
			return <fx-list-cell-date
				ref={`expectArrivalDate-${$index}`}
				vModel={row.expectArrivalDate}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='expectArrivalDate'
				pickerOptions={pickerOptions}
			>
			</fx-list-cell-date>
		},
		beforeRowEdit (row) {
			return new Promise(resolve => {
				const storeId = this.isSingleHouse ? this.organDetails.inHouse : row.inHouse.id
				this.getItemList(storeId, row.item.id).then(res => {
					const _item = res.find(item => {
						return item.id === row.item.id
					}) || {}
					row.itemUnitList = _item.itemUnitList || []
					row.stockPlanDetail = _item.stockPlanDetail
					resolve()
				})
			})
		},
		fpOnRowEdit (row, $index, type = 'unit') {
			return new Promise(resolve => {
				if (type === 'unit' && this.organDetails.purchasePlan) {
					this.$refs.detailsTable.setListCellFocus('amount')
				} else {
					this.$refs.detailsTable.setListCellFocus(type)
				}
				resolve()
			})
		},
		getItemList (storeId, extraItemId = '') {
			const params = {
				houseId: storeId,
				extraItemId,
				buyerOrganId: this.organDetails.organ.id,
				stockPlanId: this.organDetails.purchasePlan,
				sellerOrganId: this.organDetails.otherOrganId,
				orderDate: this.organDetails.orderDate
			}
			return this.$fxApi(`${apiName}.getItemList`)({ data: params })
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
			return this.$fxApi(`${apiName}.getZeroAmount`, this.organDetails.id).then(res => {
				this.tableData = res.errorDetailList ? res.errorDetailList.details : []
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
