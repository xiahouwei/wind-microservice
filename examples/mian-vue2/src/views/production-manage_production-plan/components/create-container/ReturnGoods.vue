<template>
	<w-dialog v-model="dialogVisible" title="选择退货品项" width="1200px" heightFullscreen>
		<div class="details-container">
			<div class="check-err-warning fx-warn-font">注：退货品项数量不能超过当前库存剩余量！</div>
			<fx-details-table
				ref="detailsTable"
				v-fx-tab:focus.saveBtn
				:tableColumn="tableColumn"
				:tableEditColumnProp="tableEditColumnProp"
				:tableData="tableData"
				:tableValiDate="tableValiDate"
				:canAdd="false"
				:showDeleteBtn="false"
				:showColumnFilterBtn="false"
				:fpOnRowEdit="fpOnRowEdit"
				showSummary
			></fx-details-table>
		</div>
		<template slot="footer">
			<el-button
				ref="saveReturnBtn"
				v-fx-tab:focus.detailsTable
				@click="onCancelClick"
			>取消</el-button>
			<fx-button
				ref="saveBtn"
				type="save"
				v-fx-tab:focus.saveReturnBtn
				@click="onSaveClick"
			>确认退货</fx-button>
		</template>
	</w-dialog>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
const EDIT_INPUT_TYPE = ['amount', 'assistUnitAmount']
export default {
	name: 'returnGoods',
	props: {
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	data () {
		return {
			dialogVisible: false,
			tableColumn: [
				{ prop: 'inHouse.code', label: '仓库编号', width: '150px' },
				{ prop: 'inHouse.name', label: '仓库名称', width: '120px' },
				{ prop: 'item.code', label: '品项编号', width: '150px' },
				{ prop: 'item.name', label: '品项名称', width: '120px' },
				{ prop: 'item.spec', label: '规格', width: '120px' },
				{ prop: 'itemUnit.name', label: '单位' },
				{
					prop: 'amount',
					label: '本次退货数量',
					width: '120px',
					className: 'bold-text',
					labelClassName: 'amount-label',
					editColumn: (row) => {
						return this.canEditAmount(row)
					},
					fxRender: this.amountRender,
					click: this.onCellClick('amount')
				}, {
					prop: 'storeAmount',
					label: '当前剩余数量',
					width: '120px',
					className: 'bold-text',
					labelClassName: 'amount-label',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.storeAmount, this.sysPointSize)
					}
				},
				{
					prop: 'inStoreAmount',
					label: '入库数量',
					width: '120px',
					required: true,
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysPointSize)
					},
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.inStoreAmount, this.sysPointSize)
					}
				},
				{
					prop: 'price',
					label: '入库成本单价',
					width: '120px',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.price, this.sysPricePointSize)
					}
				},
				{
					prop: 'money',
					label: '入库成本金额',
					width: '120px',
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					},
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.money, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'inTaxPrice',
					label: '含税单价',
					width: '120px',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.inTaxPrice, this.sysPricePointSize)
					}
				},
				{
					prop: 'inTaxMoney',
					label: '含税金额',
					width: '120px',
					required: true,
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					},
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.inTaxMoney, this.sysMoneyPointSize)
					}
				},
				{ prop: 'item.assistUnit', label: '辅助单位', width: '120px', required: true },
				{
					prop: 'assistUnitAmount',
					label: '辅助退货数量',
					width: '120px',
					required: true,
					editColumn: (row) => {
						return row.item && row.item.assistUnit && this.canEditAmount(row)
					},
					fxRender: this.assistUnitAmountRender,
					click: this.onCellClick('assistUnitAmount'),
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysPointSize)
					}
				},
				{
					prop: 'taxRate',
					label: '税率',
					width: '100px',
					required: true,
					formatter: (row) => {
						return row.taxRate * 100 + '%'
					}
				},
				{
					prop: 'inPrice',
					label: '非税单价',
					width: '120px',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.inPrice, this.sysPricePointSize)
					}
				},
				{
					prop: 'inMoney',
					label: '非税金额',
					width: '120px',
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					},
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.inMoney, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'inTaxRateMoney',
					label: '税额',
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					},
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.inTaxRateMoney, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'inStoreAssistUnitAmount',
					label: '辅助数量',
					width: '120px',
					required: true,
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysPointSize)
					},
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.inStoreAssistUnitAmount, this.sysPointSize)
					}
				}
			],
			tableValiDate: [
				{
					columnProp: 'amount',
					rule: (row, success, error) => {
						if (!this.systemParamAmountNegative && row.amount > row.storeAmount) {
							error(`本次退货数量不可大于${row.storeAmount}`)
						} else {
							success()
						}
					}
				}],
			tableData: [],
			tableEditColumnProp: EDIT_INPUT_TYPE,
			fxCalculation: this.$fxCalculation('inStore')
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize,
			sysPricePointSize: state => state.system.sysPricePointSize,
			sysPointSize: state => state.system.sysPointSize
		}),
		...mapGetters(['getSysParams']),
		systemParamAmountNegative () {
			return this.getSysParams('KCGL_FKC', 'value')
		},
		canEditAmount () {
			return (row) => {
				return !!row.storeAmount || this.systemParamAmountNegative
			}
		}
	},
	methods: {
		open (tableData) {
			this.tableData = tableData
			this.$refs.detailsTable &&	this.$refs.detailsTable.clear()
			this.dialogVisible = true
			this.$nextTick(() => {
				this.$fxUtils.vDoRefFocus(this, 'saveBtn')
			})
		},
		onCancelClick () {
			this.dialogVisible = false
		},
		onSaveClick () {
			this.checkDetailsUnSaving().then(() => {
				this.$refs.detailsTable.getSelectRows().then(this.onSaveHandler)
			})
		},
		onSaveHandler (items) {
			const details = items.filter(item => !!item.amount).map(item => {
				return {
					detailId: item.id,
					returnAmount: item.amount,
					returnAssistUnitAmount: item.assistUnitAmount || 0
				}
			})
			const params = {
				billId: this.organDetails.id,
				details
			}
			const info = this.createLogInfo(items)
			const logger = this.$fxLogger.createInfo('production-manage.production-plan.returnGoods', { orderData: this.organDetails, info })
			return this.$fxApi('inStore.returnGoods', this.organDetails.id)({ data: params, logger }).then(() => {
				this.$fxMessage.success('退货成功')
				this.dialogVisible = false
			})
		},
		createLogInfo (items) {
			return items.map(_item => {
				return `仓库名称:${_item.inHouse.name},退货品项:${_item.item.name},本次退货数量:${_item.amount},辅助退货数量:${_item.assistUnitAmount}`
			}).join('；')
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
				pointSize={this.sysPointSize}
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.amount, this.sysPointSize)}
				on-on-change={this.onAmountChange}
				on-on-input-enter={this.onAmountEnter}
				on-on-input-tab={this.onAmountTab}
			>
			</fx-list-cell-input-number>
		},
		onAmountChange (val, row) {
			this.fxCalculation.calculateAssistAmount(row)
		},
		onAmountEnter (row) {
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
				pointSize={this.sysPointSize}
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.assistUnitAmount, this.sysPointSize)}
			>
			</fx-list-cell-input-number>
		},
		onCellClick (type) {
			return (row) => {
				if (this.canEditAmount(row)) {
					this.$refs.detailsTable.setRowEdit(row, type)
				}
			}
		},
		checkDetailsUnSaving () {
			return this.$refs.detailsTable.checkDetailsUnSaving()
		},
		fpOnRowEdit (row, $index, type) {
			return new Promise(resolve => {
				if (this.canEditAmount(row)) {
					this.$refs.detailsTable.setListCellFocus('amount')
					resolve()
				} else {
					this.$refs.detailsTable.doRowEditTab({ row, index: $index })
				}
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.details-container {
	flex: 1
	display: flex;
	flex-direction: column;
	overflow: auto;
	.check-err-warning {
		line-height: 30px
	}
}
</style>
<style lang="stylus">
@import '~$assets/stylus/varsty.styl'
.amount-label {
	font-weight bold
}
.bold-text {
	font-weight bold
}
</style>
