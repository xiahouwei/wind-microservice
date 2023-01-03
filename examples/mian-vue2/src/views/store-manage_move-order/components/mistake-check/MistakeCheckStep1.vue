<template>
	<w-dialog v-model="dialogVisible" width="1200px" title="异常警告" heightFullscreen @close="clear">
		<div class="create-organ">
			<fx-mistake-check-step :activeStep="1" type="MoveApply"></fx-mistake-check-step>
			<div class="mistake-check-warning fx-warn-font">注：以下明细中，存在调拨数量为0的品项，请修改数量或删除！</div>
			<fx-details-table
				ref="detailsTable"
				v-fx-tab:focus.saveBtn
				:disabled="authDisabled"
				:tableColumn="computedColumn"
				:tableValiDate="tableValiDate"
				:tableData="tableData"
				:tableEditColumnProp="tableEditColumnProp"
				:fpBeforeRowEdit="beforeRowEdit"
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
import { mapState, mapGetters } from 'vuex'
import { apiName } from '../../Index.vue'
const EDIT_INPUT_TYPE = ['unit', 'amount', 'assistUnitAmount']
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
				{ prop: 'outHouse.code', label: '出库仓库编号', width: '150px' },
				{ prop: 'outHouse.name', label: '出库仓库' },
				{ prop: 'inHouse.code', label: '入库仓库编号', width: '150px' },
				{ prop: 'inHouse.name', label: '入库仓库' },
				{ prop: 'item.code', label: '品项编号', width: '150px' },
				{ prop: 'item.name', label: '品项名称' },
				{ prop: 'item.spec', label: '规格' },
				{
					prop: 'unit',
					label: '单位',
					width: '120px',
					required: true,
					editColumn: true,
					fxRender: this.unitRender,
					click: this.onCellClick('unit')
				},
				{
					prop: 'amount',
					label: '调拨数量',
					width: '140px',
					required: true,
					editColumn: true,
					fxRender: this.amountRender,
					click: this.onCellClick('amount')
				},
				{ prop: 'item.assistUnit', label: '辅助单位', width: '120px', required: true },
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
						error('调拨数量不能为0')
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
			sysPointSize: state => state.system.sysPointSize
		}),
		...mapGetters(['getSysParams', 'detailsAuthGetter']),
		mainAssistAmountTogether () {
			return this.getSysParams('SJXZL_ASSIST_MAIN_TOGETER', 'value') || true
		},
		authDisabled () {
			return !this.detailsAuthGetter('store-manage_move-order.edit-move')
		},
		computedColumn () {
			let _column = null
			switch (this.currentApplyType.type) {
			case 'instore':
				_column = this.deleteOutStoreColumn(this.tableColumn)
				break
			case 'outstore' :
				_column = this.deleteInStoreColumn(this.tableColumn)
				break
			case 'inside' :
				_column = this.tableColumn
				break
			default :
				_column = this.tableColumn
			}
			if (this.authDisabled) {
				_column.forEach(item => {
					item.editColumn && (item.editColumn = false)
				})
			}
			return _column
		},
		isSingleInHouse () {
			return this.organDetails.singleInHouseFlag === 1
		},
		isSingleOutHouse () {
			return this.organDetails.singleOutHouseFlag === 1
		},
		currentApplyType () {
			return this.$fxTypeMiddleware.getCommonTypeItemByRule('moveBillCreateType')(this.organDetails.billType, this.organDetails.applyMode)
		}
	},
	methods: {
		open (tableDetails) {
			this.tableData = this.getAmountZero(tableDetails)
			this.dialogVisible = true
			this.$nextTick(() => {
				this.$refs.detailsTable.setRowEdit(this.tableData[0], 'amount')
			})
		},
		getAmountZero (tableDetails) {
			return tableDetails.filter(item => {
				return `${item.amount}` === '0'
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
						this.$fxMessage.warning('调拨数量不能为0')
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
			const logger = this.$fxLogger.createInfo('store-manage.move-order.updateDetails', this.createLoggerParams(params, origin))
			return this.$fxApi(`${apiName}.saveDetails`, this.organDetails.id, params.id)({ data: params, logger }).then(res => {
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
				vOn:on-change={this.onUnitSelectChange}
			></fx-list-cell-select>
		},
		onUnitSelectChange (item, row) {
			this.fxCalculation.changeUnit(row, item)
		},
		amountRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
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
				on-on-input-enter={this.onAmountEnter}
				on-on-input-tab={this.onAmountTab}
			>
			</fx-list-cell-input-number>
		},
		onAmountChange (val, row, { oldVal }) {
			this.fxCalculation.changeAmount(row)
			if (`${oldVal}` === '0' || this.mainAssistAmountTogether) {
				this.fxCalculation.calculateAssistAmount(row, row.itemUnitList)
			}
		},
		onAmountEnter (row, $index) {
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
				cellText={row.item.assistUnit ? this.$fxCommon.toFixedAutoZeroFill(row.assistUnitAmount, this.sysPointSize) : ''}
				rowIndex={$index}
				columnProp='assistUnitAmount'
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
				let storeId = ''
				if (this.currentApplyType.type === 'outstore') {
					storeId = this.isSingleOutHouse ? this.organDetails.otherHouse.id : row.outHouse.id
				} else {
					storeId = this.isSingleInHouse ? this.organDetails.inHouse.id : row.inHouse.id
				}
				this.getItemList(storeId, row.item.id).then(res => {
					this.itemList = res
					const _item = res.find(item => {
						return item.id === row.item.id
					}) || {}
					row.itemUnitList = _item.itemUnitList || []
					resolve()
				})
			})
		},
		getItemList (storeId, itemId) {
			return this.$fxApi(`${apiName}.getItemByStore`, this.organDetails.id, storeId, itemId)
		},
		onCellClick (type) {
			return (row) => {
				this.$refs.detailsTable.setRowEdit(row, type)
			}
		},
		fpDeleteDetails (ids) {
			const deleteItemInfo = this.getDeleteItemInfo(ids)
			const logger = this.$fxLogger.createInfo('store-manage.move-order.deleteDetails', { deleteItemInfo, orderData: this.organDetails })
			if (ids.length > 0) {
				return this.$fxApi(`${apiName}.delDetailMulity`, this.organDetails.id)({ data: ids, logger }).then(res => {
					return Promise.resolve(res)
				})
			} else {
				return this.$fxApi(`${apiName}.delDetail`, this.organDetails.id, ids[0])({ logger }).then(res => {
					return Promise.resolve(res)
				})
			}
		},
		getDeleteItemInfo (ids) {
			return this.tableData.filter(item => {
				return ids.includes(item.id)
			}).map(item => {
				const name = item.item.name
				const itemUnit = item.itemUnit.name
				const amount = item.amount
				const assistUnitAmount = item.assistUnitAmount || ''
				return `品项名称:${name},单位:${itemUnit},调拨数量:${amount},辅助数量:${assistUnitAmount}`
			}).join(';')
		},
		onDetailsRefresh () {
			return this.$fxApi(`${apiName}.getZeroAmount`, this.organDetails.id).then(res => {
				this.tableData = res.errorDetailList || []
				return Promise.resolve(res)
			})
		},
		clear () {
			this.$emit('on-mistake-close')
			this.$refs.detailsTable.clear()
		},
		deleteInStoreColumn (column) {
			const _column = this.$fxUtils.deepClone(column)
			const index = _column.findIndex(item => {
				return item.prop === 'inHouse.code'
			})
			if (~index) {
				_column.splice(index, 2)
			}
			return _column
		},
		deleteOutStoreColumn (column) {
			const _column = this.$fxUtils.deepClone(column)
			const index = _column.findIndex(item => {
				return item.prop === 'outHouse.code'
			})
			if (~index) {
				_column.splice(index, 2)
			}
			return _column
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
