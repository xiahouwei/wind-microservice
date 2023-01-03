<template>
	<w-dialog v-model="dialogVisible" width="1200px" title="异常警告" heightFullscreen @close="clear">
		<div class="create-organ">
			<fx-mistake-check-step :activeStep="3" type="SalesOrder"></fx-mistake-check-step>
			<div class="mistake-check-warning fx-warn-font">注：以下明细中，存在销售数量为0的品项，请修改数量或删除！</div>
			<fx-details-table
				ref="detailsTable"
				v-fx-tab:focus.saveBtn
				:disabled="authDisabled"
				:tableColumn="computedColumn"
				:tableValiDate="tableValiDate"
				:tableData="tableData"
				:tableEditColumnProp="tableEditColumnProp"
				:fpBeforeRowEdit="beforeRowEdit"
				:fpOnRowEdit="fpOnRowEdit"
				:fpSaveDetails="fpSaveDetails"
				:fpDeleteDetails="fpDeleteDetails"
				@on-details-refresh="onDetailsRefresh"
				:canAdd="false"
				:showColumnFilterBtn="false"
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
const EDIT_INPUT_TYPE = ['unit', 'amount']
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
				{ prop: 'item.code', label: '品项编号', width: '150px' },
				{ prop: 'item.name', label: '品项名称' },
				{ prop: 'item.spec', label: '规格' },
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
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.taxPrice, this.sysPricePointSize)
					}
				},
				{
					prop: 'taxMoney',
					label: '含税金额',
					width: '120px',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.taxMoney, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'taxRate',
					label: '税率',
					width: '100px',
					formatter: (row) => {
						return (row.taxRate * 100) + '%'
					}
				},
				{
					prop: 'price',
					label: '非税单价',
					width: '120px',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.price, this.sysPricePointSize)
					}
				},
				{
					prop: 'money',
					label: '非税金额',
					width: '120px',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.money, this.sysMoneyPointSize)
					}
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
					formatter: (row) => {
						return row.item.assistUnit ? this.$fxCommon.toFixedAutoZeroFill(row.assistUnitAmount, this.sysPointSize) : ''
					}
				},
				{
					prop: 'expectArrivalDate',
					label: '期望到货时间',
					width: '200px',
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.expectArrivalDate)
					}
				}
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
						error('销售数量不能为0')
					} else {
						success()
					}
				}
			}],
			tableData: [],
			fxCalculation: this.$fxCalculation('common')
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize,
			sysPricePointSize: state => state.system.sysPricePointSize,
			sysPointSize: state => state.system.sysPointSize,
			haveMoneyPower: state => state.loginer.haveMoneyPower
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
					if (this.tableData.length === 0) {
						resolve()
					} else if (this.tableData.some(item => {
						return `${item.amount}` === '0'
					})) {
						this.$fxMessage.warning('销售数量不能为0')
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
			const logger = this.$fxLogger.createInfo('stock-sale-manage.sale-order.updateDetails', this.createLoggerParams(params, origin))
			return this.$fxApi(`${apiName}.saveDetails`, this.organDetails.id)({ data: params, logger }).then(res => {
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
				disabled={!!this.organDetails.stockPlan.id}
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
				buyerOrganId: this.organDetails.organId,
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
		beforeRowEdit (row) {
			return new Promise(resolve => {
				this.getItemList(row.item.id).then(res => {
					const _item = res.find(item => {
						return item.id === row.item.id
					})
					row.itemUnitList = _item.itemUnitList
					row.stockPlanDetail = _item.stockPlanDetail
					resolve()
				})
			})
		},
		fpOnRowEdit (row, $index, type = 'unit') {
			return new Promise(resolve => {
				if (type === 'unit' && this.organDetails.stockPlan.id) {
					this.$refs.detailsTable.setListCellFocus('amount')
				} else {
					this.$refs.detailsTable.setListCellFocus(type)
				}
				resolve()
			})
		},
		getItemList (extraItemId = '') {
			const params = {
				urgent: this.organDetails.urgent,
				stockPlanId: this.organDetails.stockPlan.id,
				sellerOrganId: this.organDetails.organ.id,
				orderDate: this.organDetails.businessDate,
				extraItemId
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
			const logger = this.$fxLogger.createInfo('stock-sale-manage.sale-order.deleteDetails', { deleteItemInfo, orderData: this.organDetails })
			return this.$fxApi(`${apiName}.delDetail`, this.organDetails.id)({ data: ids, logger }).then(res => {
				return Promise.resolve(res)
			})
		},
		getDeleteItemInfo (ids) {
			return this.tableData.filter(item => {
				return ids.includes(item.id)
			}).map(item => {
				const name = item.item.name
				const itemUnit = item.itemUnit.name
				const amount = item.amount
				const taxPrice = item.taxPrice
				return `品项名称:${name},单位:${itemUnit},销售数量:${amount},含税单价:${taxPrice}`
			}).join(';')
		},
		onDetailsRefresh () {
			this.$fxApi(`${apiName}.getZeroAmount`, this.organDetails.id).then(res => {
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
