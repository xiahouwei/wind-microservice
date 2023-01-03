<template>
	<w-dialog v-model="dialogVisible" width="1200px" title="异常警告" heightFullscreen @close="clear">
		<div class="create-organ">
			<fx-mistake-check-step :activeStep="4" type="CheckBill"></fx-mistake-check-step>
			<div class="mistake-check-warning fx-warn-font">注：以下品项明细盘盈生成的入库单中，入库成本单价为0，请注意！</div>
			<fx-details-table
				ref="detailsTable"
				v-fx-tab:focus.saveBtn
				:disabled="authDisabled"
				:tableColumn="computedTableColumn"
				:tableData="tableData"
				:tableEditColumnProp="tableEditColumnProp"
				:fpSaveDetails="fpSaveDetails"
				:canAdd="false"
				:selectable="false"
				:showTools="false"
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
import { mapState, mapGetters } from 'vuex'
import { apiName } from '../../Index.vue'
const EDIT_INPUT_TYPE = ['realCheckMoney']
export default {
	name: 'mistakeCheckStep4',
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
					required: true,
					width: '140px',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.realCheckAmount1, this.sysPointSize)
					}
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
					required: true,
					width: '140px',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.realCheckAmount2, this.sysPointSize)
					}
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
					width: '140px',
					editColumn: (row, rowIndex, column) => {
						return !this.disabled && !row.stockAmount1 && !row.stockAmount2
					},
					fxRender: this.realCheckMoneyRender,
					click: this.onCellClick('realCheckMoney')
				},
				{ prop: 'diffAmount', label: '差异数量', width: '180px', required: true, fxRender: this.diffAmountRender },
				{ prop: 'diffMoney', label: '差异金额', required: true, fxRender: this.diffMoneyRender },
				{ prop: 'item.assistUnit', label: '辅助单位', width: '120px', required: true },
				{
					prop: 'assistUnitAmount',
					label: '实盘辅助数量',
					required: true,
					width: '140px',
					formatter: (row) => {
						return row.item.assistUnit ? this.$fxCommon.toFixedAutoZeroFill(row.assistUnitAmount, this.sysPointSize) : ''
					}
				}
			],
			tableData: [],
			fxCalculation: this.$fxCalculation('takeStock')
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize,
			sysPointSize: state => state.system.sysPointSize,
			haveCostPower: state => state.loginer.haveCostPower
		}),
		...mapGetters(['detailsAuthGetter']),
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
		},
		currentApplyType () {
			return this.$fxTypeMiddleware.getCommonTypeItemByRule('moveBillCreateType')(this.organDetails.billType, this.organDetails.applyMode)
		},
		tableEditColumnProp () {
			if (!this.haveCostPower) {
				return []
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
				this.$fxUtils.vDoRefFocus(this, 'saveBtn')
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
				this.$emit('on-finish', 'PyZeroPrice')
			})
		},
		fpSaveDetails (detail, origin) {
			detail.billId = this.organDetails.id
			return this.onSaveDetailsHandler(detail, origin)
		},
		onSaveDetailsHandler (params, origin) {
			const logger = this.$fxLogger.createInfo('store-manage.take-stock-order.updateDetails', this.createLoggerParams(params, origin))
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
				orderData: this.organDetails,
				itemName: organDetails.item.name
			}
		},
		realCheckMoneyRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`realCheckMoney-${$index}`}
				vModel={row.realCheckMoney}
				isEdit={row.isEdit}
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
		diffMoneyRender (h, { row, $index }) {
			h = this.$createElement
			const diffMoney = this.fxCalculation.computedDiffMoney(row)
			const cellValue = diffMoney > 0 ? `+${diffMoney}` : diffMoney
			return <span class={[{
				'fx-default-font': diffMoney > 0,
				'fx-warn-font': diffMoney < 0
			}, 'fx-list-table__cell-span']}>{this.$fxCommon.toFixedAutoZeroFill(cellValue, this.sysMoneyPointSize)}</span>
		},
		onCellClick (type) {
			return (row) => {
				this.$refs.detailsTable.setRowEdit(row, type)
			}
		},
		clear () {
			this.$emit('on-mistake-close')
			this.$refs.detailsTable.clear()
		},
		saveReturnBtnTabHandler ({ focus }) {
			this.haveCostPower ? focus('detailsTable') : focus('saveBtn')
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
