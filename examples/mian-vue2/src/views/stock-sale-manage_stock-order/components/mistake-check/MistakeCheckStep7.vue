<template>
	<w-dialog v-model="dialogVisible" title="异常警告" width="1400px" heightFullscreen @close="clear">
		<div class="create-organ">
			<fx-mistake-check-step :activeStep="5" type="StockOrder"></fx-mistake-check-step>
			<div class="mistake-check-warning fx-warn-font">注：以下品项为当前供货商未关联品项，请确认！</div>
			<fx-details-table
				ref="detailsTable"
				:tableColumn="computedTableColumn"
				:tableData="tableData"
				:mainId="organDetails.id"
				:canAdd="false"
				:showColumnFilterBtn="false"
				:fpDeleteDetails="onDeleteClick"
				@on-details-refresh="getSupplierRefItem"
			></fx-details-table>
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
import { apiName } from '../../Index.vue'
import { mapState } from 'vuex'
export default {
	name: 'mistakeCheckStep7',
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
				{ prop: 'itemUnit.name', label: '单位' },
				{
					prop: 'amount',
					label: '订货数量',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.amount, this.sysPointSize)
					}
				},
				{
					prop: 'taxPrice',
					label: '含税单价',
					width: '100px',
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
					width: '100px',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.price, this.sysPricePointSize)
					}
				},
				{
					prop: 'money',
					label: '非税金额',
					width: '100px',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.money, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'taxRateMoney',
					label: '税额',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.taxRateMoney, this.sysMoneyPointSize)
					}
				},
				{ prop: 'item.assistUnit', label: '辅助单位', width: '100px' },
				{
					prop: 'assistUnitAmount',
					label: '辅助数量',
					formatter: (row) => {
						return row.item.assistUnit ? this.$fxCommon.toFixedAutoZeroFill(row.assistUnitAmount, this.sysPointSize) : ''
					}
				},
				{
					prop: 'expectArrivalDate',
					label: '期望到货时间',
					width: '200px'
				}
			],
			tableData: []
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize,
			sysPricePointSize: state => state.system.sysPricePointSize,
			sysPointSize: state => state.system.sysPointSize,
			haveMoneyPower: state => state.loginer.haveMoneyPower
		}),
		computedTableColumn () {
			let column = this.tableColumn
			const moneyPower = ['price', 'money', 'taxPrice', 'taxMoney', 'taxRate', 'taxRateMoney']
			if (!this.haveMoneyPower) {
				column = column.filter(item => {
					return !moneyPower.includes(item.prop)
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
			this.$emit('on-finish', 'SupplierItem')
		},
		getSupplierRefItem () {
			return this.$fxApi('stockOrder.getSupplierRefItem', this.organDetails.id).then(res => {
				this.tableData = res.errorDetailList ? res.errorDetailList.details : []
			})
		},
		onDeleteClick (delData) {
			const deleteItemInfo = this.getDeleteItemInfo(delData)
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-order.deleteDetails', { deleteItemInfo, orderData: this.organDetails })
			return this.$fxApi(`${apiName}.delDetailMulity`, this.organDetails.id, true)({ data: delData, logger }).then(res => {
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
				const taxPrice = item.taxPrice
				return `买方仓库:${storeName},品项名称:${name},单位:${itemUnit},采购数量:${amount},含税单价:${taxPrice}`
			}).join(';')
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
