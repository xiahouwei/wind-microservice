<template>
	<w-dialog v-model="dialogVisible" title="异常警告" width="1200px" heightFullscreen @close="clear">
		<div class="create-organ">
			<fx-mistake-check-step :activeStep="1" type="InStore"></fx-mistake-check-step>
			<div class="mistake-check-warning fx-warn-font">注：以下明细中，存在入库数量为0的品项，请修改数量或删除！</div>
			<fx-details-table
				ref="detailsTable"
				v-fx-tab:focus.saveBtn
				:tableColumn="computedTableColumn"
				:tableData="tableData"
				:tableValiDate="tableValiDate"
				:fpBeforeRowEdit="beforeRowEdit"
				:tableEditColumnProp="tableEditColumnProp"
				:tableEditEnterColumnProp="tableEditEnterColumnProp"
				:mainId="organDetails.id"
				:fpSaveDetails="fpSaveDetails"
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
const EDIT_INPUT_TYPE = ['unit', 'amount', 'inTaxPrice', 'inTaxMoney', 'taxRate', 'inPrice', 'inMoney', 'assistUnitAmount']
const EDIT_INPUT_ENTER_TYPE = ['inTaxMoney', 'taxRate', 'inPrice', 'inMoney']

export default {
	name: 'mistakeCheckStep2',
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
				{
					prop: 'unit',
					label: '单位',
					editColumn: true,
					fxRender: this.unitRender,
					click: this.onCellClick('unit')
				},
				{
					prop: 'amount',
					label: '入库数量',
					editColumn: true,
					fxRender: this.amountRender,
					click: this.onCellClick('amount')
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
					editColumn: (row) => {
						return row.item && row.item.assistUnit
					},
					fxRender: this.assistUnitAmountRender,
					click: this.onCellClick('assistUnitAmount')
				}
			],
			tableData: [],
			tableValiDate: [{
				columnProp: 'amount',
				rule (row, success, error) {
					if (row.amount === 0) {
						error('入库数量不能为0')
					} else {
						success()
					}
				}
			}, {
				columnProp: 'assistUnitAmount',
				rule (row, success, error) {
					if (row.item.assistUnit && !Number(row.assistUnitAmount)) {
						error('辅助数量不能为0')
					} else {
						success()
					}
				}
			}],
			fxCalculation: this.$fxCalculation('inStore'),
			tableEditEnterColumnProp: EDIT_INPUT_ENTER_TYPE,
			itemUnitList: [],
			unitSelectLoading: false,
			fxCache: this.$fxUtils.fxCache('in-store')
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
				return ['unit', 'amount', 'assistUnitAmount']
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
					if (this.tableData.length === 0) {
						resolve()
					} else if (this.tableData.some(item => {
						return `${item.amount}` === '0'
					})) {
						this.$fxMessage.warning('入库数量不能为0')
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
		onDetailsRefresh () {
			this.$fxApi('inStore.getZeroAmount', this.organDetails.id).then(res => {
				this.tableData = res.errorDetailList || []
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
		onDeleteClick (delData) {
			const deleteItemInfo = this.getDeleteItemInfo(delData)
			const logger = this.$fxLogger.createInfo('production-manage.production-plan.deleteDetails', { deleteItemInfo, orderData: this.organDetails })
			return this.$fxApi('inStore.delDetailMulity', this.organDetails.id, true)({ data: delData, logger }).then(res => {
				return Promise.resolve(res)
			})
		},
		getDeleteItemInfo (ids) {
			return this.tableData.filter(item => {
				return ids.includes(item.id)
			}).map(item => {
				const storeName = item.inHouse.name
				const name = item.item.name
				const itemUnit = item.itemUnit.name
				const amount = item.amount
				const taxPrice = item.inTaxPrice
				return `入库仓库:${storeName},品项名称:${name},单位:${itemUnit},入库数量:${amount},含税单价:${taxPrice}`
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
				isEdit={row.isEdit && !this.authDisabled}
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
			this.fxCalculation.changeUnit(row, item)
			this.fxCalculation.calculateAssistAmount(row, this.itemUnitList)
			this.fxCalculation.changePrice(row)
		},
		onUnitSelectShow (row) {
			return () => {
				return new Promise(resolve => {
					this.unitSelectLoading = true
					this.getUnitList(row.item.id, row.itemUnit.id).then(res => {
						this.unitSelectLoading = false
						this.itemUnitList = res
						resolve()
					})
				})
			}
		},
		getUnitList (itemId, itemUnitId = '') {
			const key = `unitList.${itemId}`
			const data = itemUnitId ? { itemUnitId } : {}
			return this.fxCache.cacher(key, this.$fxApi('inStore.getUnitList', itemId, this.organDetails.id)({ data }))
		},
		amountRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`amount-${$index}`}
				vModel={row.amount}
				isEdit={row.isEdit && !this.authDisabled}
				row={row}
				rowIndex={$index}
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.amount, this.sysPointSize)}
				columnProp='amount'
				pointSize={this.sysPointSize}
				on-on-change={this.onAmountChange}
				on-on-input-enter={this.onAmountEnter}
				on-on-input-tab={this.onAmountTab}
			>
			</fx-list-cell-input-number>
		},
		onAmountChange (val, row) {
			this.fxCalculation.changeAmount(row)
			if (!row.preDetailIsAssistUnit) {
				this.fxCalculation.calculateAssistAmount(row, this.itemUnitList)
			}
		},
		onAmountEnter (row) {
			(row.giftFlag || !this.haveCostPower) ? this.$refs.detailsTable.doRowEditEnter() : this.$refs.detailsTable.setListCellFocus('inTaxPrice')
		},
		onAmountTab (row, $index) {
			(row.giftFlag || !this.haveCostPower) ? row.item.assistUnit ? this.$refs.detailsTable.setListCellFocus('assistUnitAmount') : this.$refs.detailsTable.doRowEditTab({ row, index: $index }) : this.$refs.detailsTable.setListCellFocus('inTaxPrice')
		},
		taxPriceRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`inTaxPrice-${$index}`}
				vModel={row.inTaxPrice}
				isEdit={row.isEdit && !this.authDisabled}
				row={row}
				rowIndex={$index}
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.inTaxPrice, this.sysPricePointSize)}
				columnProp='inTaxPrice'
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
				columnProp='inPrice'
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.inPrice, this.sysPricePointSize)}
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
				columnProp='inMoney'
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.inMoney, this.sysMoneyPointSize)}
				pointSize={this.sysMoneyPointSize}
				on-on-change={this.onMoneyChange}
				on-on-input-tab={this.onMoneyTab}
			>
			</fx-list-cell-input-number>
		},
		onMoneyChange (val, row) {
			this.fxCalculation.changeSumPrice(row)
		},
		onMoneyTab (row, $index) {
			row.item.assistUnit ? this.$refs.detailsTable.setListCellFocus('assistUnitAmount') : this.$refs.detailsTable.doRowEditTab({ row, index: $index })
		},
		assistUnitAmountRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`assistUnitAmount-${$index}`}
				vModel={row.assistUnitAmount}
				isEdit={row.isEdit && !!row.item.assistUnit && !this.authDisabled}
				row={row}
				rowIndex={$index}
				columnProp='assistUnitAmount'
				cellText={row.item.assistUnit ? this.$fxCommon.toFixedAutoZeroFill(row.assistUnitAmount, this.sysPointSize) : ''}
				pointSize={this.sysPointSize}
			>
			</fx-list-cell-input-number>
		},
		beforeRowEdit (row) {
			this.itemUnitList = this.$fxUtils.isEmptyObj(row.itemUnit) ? [] : [row.itemUnit]
			return Promise.resolve()
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
