<template>
	<w-dialog v-model="dialogVisible" width="1200px" title="异常警告" heightFullscreen @close="clear">
		<div class="create-organ">
			<fx-mistake-check-step :activeStep="3" type="StockPlan"></fx-mistake-check-step>
			<div class="mistake-check-warning fx-warn-font">注：以下明细中，存在申请数量为0的品项，请修改数量或删除！</div>
			<fx-details-table
				ref="detailsTable"
				v-fx-tab:focus.saveBtn
				:disabled="authDisabled"
				:tableColumn="computedTableColumn"
				:tableValiDate="tableValiDate"
				:tableData="tableData"
				:tableEditColumnProp="tableEditColumnProp"
				:fpBeforeRowEdit="beforeRowEdit"
				:fpSaveDetails="fpSaveDetails"
				:fpDeleteDetails="fpDeleteDetails"
				:fpOnRowEdit="fpOnRowEdit"
				:canAdd="false"
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
import { mapState, mapGetters } from 'vuex'
import { apiName } from '../../Index.vue'
const EDIT_INPUT_TYPE = ['unit', 'amount', 'assistUnitAmount']
export default {
	name: 'mistakeCheckStep2',
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
				{ prop: 'expectArrivalDate', label: '期望到货时间', width: '200px', required: true }
			],
			tableEditColumnProp: EDIT_INPUT_TYPE,
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
						error('申请数量不能为0')
					} else {
						success()
					}
				}
			}],
			tableData: [],
			fxCalculation: this.$fxCalculation('stockPlanOrder')
		}
	},
	computed: {
		...mapState({
			sysPointSize: state => state.system.sysPointSize
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
		computedTableColumn () {
			const column = this.tableColumn
			if (this.authDisabled) {
				column.forEach(item => {
					item.editColumn && (item.editColumn = false)
				})
			}
			return column
		},
		isSingleHouse () {
			return this.organDetails.singleHouseFlag === 1
		}
	},
	methods: {
		async open (tableDetails) {
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
				if (this.authDisabled) {
					const amountFlag = this.tableData.some(item => {
						return `${item.amount}` === '0'
					})
					amountFlag ? this.$fxMessage.warning('申请数量不能为0') : resolve()
				} else {
					this.$refs.detailsTable.checkDetailsUnSaving().then(() => {
						if (this.tableData.some(item => {
							return `${item.amount}` === '0'
						})) {
							this.$fxMessage.warning('申请数量不能为0')
						} else {
							resolve()
						}
					}).catch(() => {
						if (this.authDisabled && this.tableData.some(item => `${item.amount}` === '0')) {
							this.$fxMessage.warning('品项数量为0，无法继续操作，请确定是否拥有对当前单据的编辑权限')
						}
					})
				}
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
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan-order.updateDetails', this.createLoggerParams(params, origin))
			return this.$fxApi(`${apiName}.saveDetails`, params.billId)({ data: params, logger }).then(res => {
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
			return <el-tooltip value={row.mistakeTipFlag && !!row.stockPlanDetail} manual={true} effect="light" placement="top">
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
			row.item.assistUnit ? this.$refs.detailsTable.setListCellFocus('assistUnitAmount') : this.$refs.detailsTable.doRowEditEnter()
		},
		onAmountTab (row, $index) {
			row.item.assistUnit ? this.$refs.detailsTable.setListCellFocus('assistUnitAmount') : this.$refs.detailsTable.doRowEditTab({ row, index: $index })
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
		beforeRowEdit (row) {
			return new Promise(resolve => {
				const storeId = this.isSingleHouse ? this.organDetails.inHouse.id : row.inHouse.id
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
		getItemList (storeId, extraItemId = '') {
			const params = {
				inHouseId: storeId,
				buyerOrganId: this.organDetails.organ.id,
				stockPlanId: this.organDetails.stockPlan.id,
				businessDate: this.organDetails.businessDate,
				urgent: this.organDetails.urgent,
				extraItemId
			}
			return this.$fxApi(`${apiName}.getItemList`)({ data: params })
		},
		fpOnRowEdit (row, $index, type = 'storeCode') {
			return new Promise(resolve => {
				if (type === 'unit' && this.organDetails.stockPlan.id) {
					this.$refs[`amount-${$index}`].focus()
				} else {
					this.$refs[`${type}-${$index}`].focus()
				}
				resolve()
			})
		},
		onCellClick (type) {
			return (row) => {
				this.$refs.detailsTable.setRowEdit(row, type)
			}
		},
		fpDeleteDetails (ids) {
			const deleteItemInfo = this.getDeleteItemInfo(ids)
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan-order.deleteDetails', { deleteItemInfo, orderData: this.organDetails })
			return this.$fxApi(`${apiName}.delDetailMulity`, this.organDetails.id)({ data: ids, logger }).then(res => {
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
				return `买方仓库:${storeName},品项名称:${name},单位:${itemUnit},申请数量:${amount}`
			}).join(';')
		},
		onDetailsRefresh () {
			return this.$fxApi(`${apiName}.getZeroAmount`, this.organDetails.id).then(res => {
				this.tableData = res.errorDetailList || []
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
