<template>
	<w-dialog v-model="dialogVisible" width="1200px" title="异常警告" heightFullscreen @close="clear">
		<div class="create-organ">
			<fx-mistake-check-step :activeStep="1" type="CheckBill"></fx-mistake-check-step>
			<div class="mistake-check-warning fx-warn-font">注：以下品项明细为当前盘点分类中的必盘品项，请继续完成盘点！</div>
			<fx-details-table
				ref="detailsTable"
				v-fx-tab:focus.saveBtn
				:disabled="authDisabled"
				:tableColumn="computedTableColumn"
				:tableData="tableData"
				:tableEditColumnProp="tableEditColumnProp"
				:fpOnRowEdit="fpOnRowEdit"
				:expandRows="expandRows"
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
const EDIT_INPUT_TYPE = ['realCheckAmount1', 'realCheckAmount2', 'realCheckMoney', 'checkCause', 'assistUnitAmount']
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
		actionType: String,
		disabled: Boolean
	},
	data () {
		return {
			dialogVisible: false,
			tableColumn: [
				{ prop: 'item.code', label: '品项编号', width: '150px' },
				{ prop: 'item.name', label: '品项名称' },
				{ prop: 'item.spec', label: '规格' },
				{
					prop: 'checkUnit1',
					label: '盘点单位1',
					width: '120px',
					required: true,
					formatter: (row) => {
						return (row.checkUnit1 && row.checkUnit1.name) || ''
					}
				},
				{
					prop: 'stockAmount1',
					label: '账存数量',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.stockAmount1, this.sysPointSize)
					}
				},
				{
					prop: 'realCheckAmount1',
					label: '实盘数量',
					width: '140px',
					required: true,
					editColumn: true,
					fxRender: this.amount1Render,
					click: this.onCellClick('realCheckAmount1')
				},
				{
					prop: 'checkUnit2',
					label: '盘点单位2',
					width: '120px',
					required: true,
					formatter: (row) => {
						return (row.checkUnit2 && row.checkUnit2.name) || ''
					}
				},
				{
					prop: 'stockAmount2',
					label: '账存数量',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.stockAmount2, this.sysPointSize)
					}
				},
				{
					prop: 'realCheckAmount2',
					label: '实盘数量',
					width: '140px',
					required: true,
					editColumn: true,
					fxRender: this.amount2Render,
					click: this.onCellClick('realCheckAmount2')
				},
				{
					prop: 'stockMoney',
					label: '账存金额',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.stockMoney, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'realCheckMoney',
					label: '实盘金额',
					required: true,
					editColumn: (row, rowIndex, column) => {
						return !this.disabled && !row.stockAmount1 && !row.stockAmount2
					},
					fxRender: this.realCheckMoneyRender,
					click: this.onCellClick('realCheckMoney')
				},
				{
					prop: 'diffAmount',
					label: '差异数量',
					width: '180px',
					required: true,
					fxRender: this.diffAmountRender
				},
				{
					prop: 'diffMoney',
					label: '差异金额',
					required: true,
					fxRender: this.diffMoneyRender
				},
				{
					prop: 'checkCause',
					label: '盘盈原因',
					width: '160px',
					required: true,
					editColumn: (row, rowIndex, column) => {
						const diffAmount = this.fxCalculation.computeDiffAmount(row)
						return !this.disabled && (diffAmount > 0)
					},
					fxRender: this.checkCauseRender,
					click: this.onCellClick('checkCause')
				},
				{ prop: 'item.assistUnit', label: '辅助单位', width: '120px', required: true },
				{
					prop: 'assistUnitAmount',
					label: '实盘辅助数量',
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
			expandRows: [
				{ prop: 'sendRow1', label: '品项信息', render: this.renderExpand1, visible: true },
				{ prop: 'sendRow2', label: '单位信息', render: this.renderExpand2, visible: true },
				{ prop: 'sendRow3', label: '录入人', render: this.renderExpand3, visible: true },
				{ prop: 'sendRow4', label: '称重信息', render: this.renderExpand4, visible: true }
			],
			tableData: [],
			fxCalculation: this.$fxCalculation('takeStock'),
			checkCauseList: []
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize,
			sysPricePointSize: state => state.system.sysPricePointSize,
			sysPointSize: state => state.system.sysPointSize,
			haveCostPower: state => state.loginer.haveCostPower
		}),
		...mapGetters(['getSysParams', 'detailsAuthGetter']),
		mainAssistAmountTogether () {
			return this.getSysParams('SJXZL_ASSIST_MAIN_TOGETER', 'value') || true
		},
		authDisabled () {
			return !this.detailsAuthGetter('store-manage_take-stock-order.edit-order')
		},
		computedTableColumn () {
			let column = this.tableColumn
			const costPower = ['stockMoney', 'realCheckMoney', 'diffMoney']
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
		}
	},
	methods: {
		open (tableData) {
			tableData.forEach(item => {
				item.id = this.$fxUtils.createUUID()
			})
			this.tableData = tableData
			this.dialogVisible = true
			this.$nextTick(() => {
				this.$refs.detailsTable.setRowEdit(this.tableData[0], 'realCheckAmount1')
			})
		},
		onSaveReturnClick () {
			this.onSaveTableListCheck().then(this.onSaveHandler).then(() => {
				this.dialogVisible = false
			})
		},
		onSaveTableListCheck () {
			return this.$refs.detailsTable.checkDetailsUnSaving()
		},
		onSaveClick () {
			this.onSaveTableListCheck().then(this.onSaveHandler).then(() => {
				this.dialogVisible = false
				this.$emit('on-finish')
			})
		},
		onSaveHandler () {
			const addItemInfo = this.getAddItemInfo()
			const logger = this.$fxLogger.createInfo('store-manage.take-stock-order.addDetails', { orderData: this.organDetails, addItemInfo })
			return this.$fxApi(`${apiName}.addMustItemMulity`, this.organDetails.id)({ data: this.tableData, logger }).then(res => {
				return Promise.resolve(res)
			})
		},
		getAddItemInfo () {
			return this.tableData.map(item => {
				const name = item.item.name
				const checkUnit1 = item.checkUnit1.name
				const amount = item.realCheckAmount1
				return `品项名称:${name},盘点单位1:${checkUnit1},实盘数量:${amount}`
			}).join(';')
		},
		amount1Render (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`realCheckAmount1-${$index}`}
				vModel={row.realCheckAmount1}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='realCheckAmount1'
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.realCheckAmount1, this.sysPointSize)}
				pointSize={this.sysPointSize}
				class="cell-amount__input"
				vOn:on-change={this.onAmountChange}
			>
			</fx-list-cell-input-number>
		},
		onAmountChange (val, row, { oldVal }) {
			this.fxCalculation.computeRealCheckMoney(row)
			if (`${oldVal}` === '0' || this.mainAssistAmountTogether) {
				this.fxCalculation.computeAssistAmount(row)
			}
			const diffAmount = this.fxCalculation.computeDiffAmount(row)
			if (diffAmount > 0) {
				row.checkCause = this.checkCauseList.find(item => {
					return item.defaultFlag
				})
			} else {
				row.checkCause = {
					id: '',
					name: '无'
				}
			}
			this.setTableEditColumnProp(row)
		},
		amount2Render (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`realCheckAmount2-${$index}`}
				vModel={row.realCheckAmount2}
				isEdit={row.isEdit && !!row.checkUnit2}
				row={row}
				rowIndex={$index}
				columnProp='realCheckAmount2'
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.realCheckAmount2, this.sysPointSize)}
				pointSize={this.sysPointSize}
				class="cell-amount__input"
				vOn:on-change={this.onAmountChange}
			>
			</fx-list-cell-input-number>
		},
		realCheckMoneyRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`realCheckMoney-${$index}`}
				vModel={row.realCheckMoney}
				isEdit={row.isEdit && !row.stockAmount1 && !row.stockAmount2}
				row={row}
				rowIndex={$index}
				columnProp='realCheckMoney'
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.realCheckMoney, this.sysMoneyPointSize)}
				pointSize={this.sysMoneyPointSize}
			>
			</fx-list-cell-input-number>
		},
		diffAmountRender (h, { row, $index }) {
			h = this.$createElement
			if (!row.checkUnit1) {
				return <span></span>
			}
			const diffAmount = this.fxCalculation.computeDiffAmount(row)
			const fontClass = {
				'fx-default-font': diffAmount > 0,
				'fx-warn-font': diffAmount < 0
			}
			const cellValue = diffAmount > 0 ? `+${diffAmount}${row.mainUnit.name}` : `${diffAmount}${row.mainUnit.name}`
			if (row.checkUnit1.id === row.mainUnit.id) {
				return <span class={[fontClass, 'fx-list-table__cell-span']}>{cellValue}</span>
			} else {
				const mainAmount = this.fxCalculation.computedCheckUnit1Amount(diffAmount, row)
				return <span class="fx-list-table__cell-span">
					<span class={fontClass}>{cellValue}={mainAmount}{row.checkUnit1.name}</span>
				</span>
			}
		},
		checkCauseRender (h, { row, $index }) {
			h = this.$createElement
			const diffAmount = this.fxCalculation.computeDiffAmount(row)
			return <fx-list-cell-select
				ref={`checkCause-${$index}`}
				value={row.checkCause && row.checkCause.id}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='checkCause'
				cellText={row.checkCause ? row.checkCause.name : '无'}
				disabled={diffAmount <= 0}
				selectOptionList={this.checkCauseList}
				asyncChange={this.onCauseSelectChange}
			></fx-list-cell-select>
		},
		onCauseSelectChange (item, row) {
			row.checkCause = item
		},
		getCheckCauseList () {
			if (this.checkCauseList.length) return Promise.resolve()
			return this.$fxApi(`${apiName}.getCheckCauseList`).then(res => {
				this.checkCauseList = res
				return Promise.resolve()
			})
		},
		diffMoneyRender (h, { row, $index }) {
			h = this.$createElement
			const diffMoney = this.fxCalculation.computedDiffMoney(row)
			const cellValue = diffMoney > 0 ? `+${diffMoney}` : diffMoney
			return <span class={[{
				'fx-default-font': diffMoney > 0,
				'fx-warn-font': diffMoney < 0
			}, 'fx-list-table__cell-span']}>{this.$fxCommon.toFixedAutoZeroFill(cellValue, this.sysMoneyPointSize)}</span>
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
			>
			</fx-list-cell-input-number>
		},
		onCellClick (type) {
			return (row) => {
				this.$refs.detailsTable.setRowEdit(row, type)
			}
		},
		renderExpand1 (h, { row, $index }) {
			h = this.$createElement
			const price = this.$fxCommon.toFixedAutoZeroFill((row.mainUnitPrice * row.checkUnit1.ratio), this.sysPricePointSize)
			return (
				<fx-list-extend-row>
					<fx-list-extend-cell title="品项类别：">{row.item && row.item.itemTypeRef.name}</fx-list-extend-cell>
					<fx-list-extend-cell title="参考均价：">{price}</fx-list-extend-cell>
					<fx-list-extend-cell title="批次号：">{row.batchCode}</fx-list-extend-cell>
					<fx-list-extend-cell title="存放位置："></fx-list-extend-cell>
					<fx-list-extend-cell title="明细备注：" width = { 200 }>
						<fx-list-cell-input
							vModel = { row.memo }
							isEdit = { row.isEdit }
							row = { row }
							rowIndex = { $index }
							columnProp = 'memo'
							maxlength = { this.$fxCommon.getFxInputMaxLength('memo') }
							regType = { this.$fxCommon.getFxInputReg('memo') }
						></fx-list-cell-input>
					</fx-list-extend-cell>
				</fx-list-extend-row>
			)
		},
		renderExpand2 (h, { row, $index }) {
			h = this.$createElement
			const diffAmount = this.fxCalculation.computeDiffAmount(row)
			return (
				<fx-list-extend-row>
					<fx-list-extend-cell title="最小单位：">{row.mainUnit.name}</fx-list-extend-cell>
					<fx-list-extend-cell title="最小单位差异数量：" labelWidth="120px">{diffAmount}</fx-list-extend-cell>
				</fx-list-extend-row>
			)
		},
		renderExpand3 (h, { row, $index }) {
			h = this.$createElement
			return (
				<fx-list-extend-row>
					<fx-list-extend-cell title="录入人：">{row.inputMan && row.inputMan.name}</fx-list-extend-cell>
					<fx-list-extend-cell title="录入方式：">{row.inputModeName}</fx-list-extend-cell>
					<fx-list-extend-cell title="盘点终端：">{row.terminalName}</fx-list-extend-cell>
				</fx-list-extend-row>
			)
		},
		renderExpand4 (h, { row, $index }) {
			h = this.$createElement
			return (
				<fx-list-extend-row>
					<fx-list-extend-cell title="称重数量："></fx-list-extend-cell>
					<fx-list-extend-cell title="净重量："></fx-list-extend-cell>
					<fx-list-extend-cell title="皮重量："></fx-list-extend-cell>
					<fx-list-extend-cell title="称重单位："></fx-list-extend-cell>
				</fx-list-extend-row>
			)
		},
		fpOnRowEdit (row, $index, type) {
			if (!row.checkCause) {
				row.checkCause = {
					id: '',
					name: '无'
				}
			}
			this.setTableEditColumnProp(row)
			return new Promise(resolve => {
				this.getCheckCauseList().then(() => {
					this.$refs[`${type}-${$index}`].focus()
					resolve()
				})
			})
		},
		setTableEditColumnProp (row) {
			const _column = this.$fxUtils.deepClone(EDIT_INPUT_TYPE)
			if (!row.checkUnit2) {
				const index = _column.findIndex(item => {
					return item === 'realCheckAmount2'
				})
				_column.splice(index, 1)
			}
			if (row.stockAmount1 || row.stockAmount2 || !this.haveCostPower) {
				const index = _column.findIndex(item => {
					return item === 'realCheckMoney'
				})
				_column.splice(index, 1)
			}
			if (!row.item.assistUnit) {
				const index = _column.findIndex(item => {
					return item === 'assistUnitAmount'
				})
				_column.splice(index, 1)
			}
			if (!(row.checkCause && row.checkCause.id)) {
				const index = _column.findIndex(item => {
					return item === 'checkCause'
				})
				_column.splice(index, 1)
			}
			this.tableEditColumnProp = _column
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
