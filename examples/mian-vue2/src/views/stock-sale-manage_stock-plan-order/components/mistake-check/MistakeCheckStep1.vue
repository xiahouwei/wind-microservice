<template>
	<w-dialog v-model="dialogVisible" width="1200px" title="异常警告" heightFullscreen @close="clear">
		<div class="create-organ">
			<fx-mistake-check-step :activeStep="1" type="StockPlan"></fx-mistake-check-step>
			<div class="mistake-check-warning fx-warn-font">注：以下品项为当前订货方案规定必须要订货的品项，请填写订货数量！</div>
			<fx-details-table
				ref="detailsTable"
				v-fx-tab:focus.saveBtn
				:disabled="authDisabled"
				:tableColumn="computedColumn"
				:tableValiDate="tableValiDate"
				:tableData="tableData"
				:tableEditColumnProp="computedEditColumn"
				:canAdd="false"
				:selectable="false"
				:showTools="false"
				:fpBeforeRowEdit="beforeRowEdit"
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
const EDIT_INPUT_TYPE = ['storeCode', 'amount', 'assistUnitAmount', 'expectArrivalDate']
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
					prop: 'storeCode',
					label: '仓库编号',
					width: '150px',
					required: true,
					editColumn: true,
					fxRender: this.storeCodeRender,
					click: this.onCellClick('storeCode')
				},
				{ prop: 'inHouse.name', label: '仓库名称' },
				{ prop: 'item.code', label: '品项编号', width: '150px', required: true },
				{ prop: 'item.name', label: '品项名称' },
				{ prop: 'item.spec', label: '规格', width: '100px' },
				{
					prop: 'unit',
					label: '单位',
					width: '120px',
					required: true,
					editColumn: () => {
						return this.sysStockPlanEditUnit || !this.organDetails.stockPlan.id
					},
					fxRender: this.unitRender,
					click: this.onCellClick('unit')
				},
				{
					prop: 'amount',
					label: '申请数量',
					width: '140px',
					required: true,
					editColumn: true,
					fxRender: this.amountRender,
					click: this.onCellClick('amount')
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
			tableEditColumnProp: EDIT_INPUT_TYPE,
			tableValiDate: [{
				columnProp: 'storeCode',
				rule: (row, success, error) => {
					if (!row.inHouse.id && !this.isSingleHouse) {
						error('仓库编号不能为空')
					} else {
						success()
					}
				}
			}, {
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
						error('申请数量不能为0')
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
			fxCalculation: this.$fxCalculation('stockPlanOrder'),
			itemUnitList: [],
			tableData: [],
			selectOptionProp: {
				name: 'code',
				disabled: 'disabled',
				visibleFlag: 'visibleFlag'
			}
		}
	},
	computed: {
		...mapState({
			sysPointSize: state => state.system.sysPointSize,
			taxesList: state => state.system.taxesList,
			sysArrivalInterval: state => state.system.sysParamsConfig.CXGL_CGJHD_SJQZL_EXPECTTIME.value
		}),
		...mapGetters(['detailsAuthGetter', 'getSysParams']),
		authDisabled () {
			return !this.detailsAuthGetter('stock-sale-manage_stock-plan-order.edit-stock-plan')
		},
		mainAssistAmountTogether () {
			return this.getSysParams('SJXZL_ASSIST_MAIN_TOGETER', 'value') || true
		},
		sysStockPlanEditUnit () {
			return this.getSysParams('SJXZL_STOCK_SALES_CHANGE_PLAN_UNIT', 'value')
		},
		computedColumn () {
			const column = this.isSingleHouse ? this.tableColumn.slice(2) : this.tableColumn
			if (this.authDisabled) {
				column.forEach(item => {
					item.editColumn && (item.editColumn = false)
				})
			}
			return column
		},
		computedEditColumn () {
			return this.isSingleHouse ? this.tableEditColumnProp.slice(1) : this.tableEditColumnProp
		},
		isSingleHouse () {
			return this.organDetails.singleHouseFlag === 1
		}
	},
	methods: {
		open (tableData) {
			this.tableData = tableData.map(item => {
				let arrivalDate = ''
				if (item.stockPlanDetail) {
					arrivalDate = new Date(this.organDetails.businessDate).getTime() + this.$fxUtils.h2ms(item.stockPlanDetail.arrivalCycle)
				} else {
					arrivalDate = new Date(this.organDetails.businessDate).getTime() + this.$fxUtils.h2ms(this.sysArrivalInterval)
				}
				const itemUnit = item.itemUnit || item.itemUnitList[0]
				const inHouse = this.isSingleHouse ? this.organDetails.inHouse : {
					code: '请选择',
					name: '请选择'
				}
				return {
					id: this.$fxUtils.createUUID(),
					billId: this.organDetails.id,
					inHouse,
					item,
					itemUnit,
					mainUnitId: '',
					amount: 0,
					assistUnitAmount: '',
					expectArrivalDate: this.$fxUtils.setDateTime(new Date(arrivalDate)),
					abortAssign: 0,
					assignState: 0,
					itemUnitList: item.itemUnitList,
					stockPlanDetail: item.stockPlanDetail,
					memo: '',
					storeSelectList: [],
					tipFlag: false
				}
			})
			this.dialogVisible = true
			this.$nextTick(() => {
				if (this.isSingleHouse) {
					this.$refs.detailsTable.setRowEdit(this.tableData[0], 'amount')
				} else {
					this.$refs.detailsTable.setRowEdit(this.tableData[0], 'storeCode')
				}
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
					if (!this.isSingleHouse && this.tableData.some(item => {
						return !item.inHouse.id
					})) {
						this.$fxMessage.warning('请选择仓库')
					} else if (this.tableData.some(item => {
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
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan-order.addDetails', { orderData: this.organDetails, addItemInfo })
			return this.$fxApi(`${apiName}.addDetailsMulity`, this.organDetails.id, this.tableData)({ logger }).then(res => {
				return Promise.resolve(res)
			})
		},
		getAddItemInfo () {
			return this.tableData.map(item => {
				const	storeName = item.inHouse.name
				const name = item.item.name
				const itemUnit = item.itemUnit.name
				const amount = item.amount
				return `买方仓库:${storeName},品项名称:${name},单位:${itemUnit},申请数量:${amount}`
			}).join(';')
		},
		onCellClick (type) {
			return (row) => {
				this.$refs.detailsTable.setRowEdit(row, type)
			}
		},
		optionRender (h, { item }) {
			h = this.$createElement
			return <div class="fx-common__cell-select__option fx-ellipsis">
				<span class="fx-common__cell-select__option-left fx-ellipsis" title={item.code}>{ item.code }</span>
				<span class="fx-common__cell-select__option-right fx-ellipsis" title={item.name}>{ item.name }</span>
			</div>
		},
		storeCodeRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`storeCode-${$index}`}
				value={row.inHouse.id}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='storeCode'
				dropdownWidth='300px'
				optionRender={this.optionRender}
				selectOptionProp={this.selectOptionProp}
				cellText={row.inHouse.code}
				selectOptionList={row.storeSelectList}
				on-on-change={this.onStoreCodeSelectChange}
			></fx-list-cell-select>
		},
		onStoreCodeSelectChange (item, row) {
			row.inHouse = item
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
				disabled={!this.sysStockPlanEditUnit && !!this.organDetails.stockPlan.id}
				vOn:on-change={this.onUnitSelectChange}
			></fx-list-cell-select>
		},
		onUnitSelectChange (item, row) {
			if (this.organDetails.stockPlan && this.organDetails.stockPlan.id) {
				this.fxCalculation.changeUnitCompSupperLimitOrLowerLimit(row, item)
			}
			this.fxCalculation.changeUnit(row, item)
		},
		amountRender (h, { row, $index }) {
			h = this.$createElement
			return <el-tooltip value={row.tipFlag} manual={true} effect="light" placement="top">
				<div slot="content">
					<span>上限:{this.$fxCommon.toFixedAutoZeroFill(row.stockPlanDetail && row.stockPlanDetail.supperLimit, this.sysPointSize)}</span>
					<span>下限:{this.$fxCommon.toFixedAutoZeroFill(row.stockPlanDetail && row.stockPlanDetail.lowerLimit, this.sysPointSize)}</span>
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
					vOn:on-input-tab={this.onAmountEnter}
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
			row.item.assistUnit ? this.$refs.detailsTable.setListCellFocus('assistUnitAmount') : this.$refs.detailsTable.setListCellFocus('expectArrivalDate')
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
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.assistUnitAmount, this.sysPointSize)}
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
				columnProp='expectArrivalDate'
				valueFormat='yyyy-MM-dd HH:mm:SS'
				pickerOptions={pickerOptions}
				cellText={this.$fxUtils.formatterDateTime(row.expectArrivalDate)}
			>
			</fx-list-cell-date>
		},
		beforeRowEdit (row) {
			return new Promise(resolve => {
				if (row.storeSelectList.length === 0) {
					this.getStoreByItem(row.item.id).then(res => {
						row.storeSelectList = res
						resolve()
					})
				} else {
					resolve()
				}
			})
		},
		getStoreByItem (itemId) {
			const params = {
				billId: this.organDetails.id,
				itemId
			}
			return this.$fxApi(`${apiName}.getMustItemStore`)({ data: params }).then(res => {
				return Promise.resolve(res)
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
