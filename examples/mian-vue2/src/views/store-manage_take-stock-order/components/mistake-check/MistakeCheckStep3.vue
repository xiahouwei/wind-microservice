<template>
	<w-dialog v-model="dialogVisible" width="1200px" title="异常警告" heightFullscreen @close="clear">
		<div class="create-organ">
			<fx-mistake-check-step :activeStep="3" type="CheckBill"></fx-mistake-check-step>
			<div class="mistake-check-warning fx-warn-font">注：以下品项为当前盘点仓库未关联品项，继续提交或审核，可能会导致盘盈的品项在后续出库业务中，由于没有仓库存放关系而无法手工出库，请注意！</div>
			<fx-details-table
				ref="detailsTable"
				:tableColumn="computedTableColumn"
				:tableData="tableData"
				:fpDeleteDetails="fpDeleteDetails"
				:canAdd="false"
				:showColumnFilterBtn="false"
			>
			</fx-details-table>
		</div>
		<template slot="footer">
			<el-button
				ref="saveReturnBtn"
				v-fx-tab:focus.saveBtn
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
import { mapState } from 'vuex'
import { apiName } from '../../Index.vue'
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
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.realCheckMoney, this.sysMoneyPointSize)
					}
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
		computedTableColumn () {
			let column = this.tableColumn
			const costPower = ['stockMoney', 'realCheckMoney', 'diffMoney']
			if (!this.haveCostPower) {
				column = column.filter(item => {
					return !costPower.includes(item.prop)
				})
			}
			return column
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
			this.dialogVisible = false
		},
		onSaveClick () {
			this.dialogVisible = false
			this.$emit('on-finish', 'ItemHouse')
		},
		fpDeleteDetails (ids) {
			const deleteItemInfo = this.getDeleteItemInfo(ids)
			const logger = this.$fxLogger.createInfo('store-manage.take-stock-order.deleteDetails', { deleteItemInfo, orderData: this.organDetails })
			return this.$fxApi(`${apiName}.delDetailMulity`, this.organDetails.id)({ data: ids, logger }).then(res => {
				this.onDetailsRefresh(ids)
				return Promise.resolve(res)
			})
		},
		getDeleteItemInfo (ids) {
			return this.tableData.filter(item => {
				return ids.includes(item.id)
			}).map(item => {
				const name = item.item.name
				const checkUnit1 = item.checkUnit1.name
				const amount = item.realCheckAmount1
				return `品项名称:${name},盘点单位1:${checkUnit1},实盘数量:${amount}`
			}).join(';')
		},
		onDetailsRefresh (ids) {
			this.tableData = this.tableData.filter(item => {
				return !ids.includes(item.id)
			})
		},
		clear () {
			this.$emit('on-mistake-close')
			this.$refs.detailsTable.clear()
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
