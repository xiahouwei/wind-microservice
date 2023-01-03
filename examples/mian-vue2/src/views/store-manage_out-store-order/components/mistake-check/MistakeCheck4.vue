<template>
	<w-dialog v-model="dialogVisible" title="异常警告" width="1400px" heightFullscreen @close="clear">
		<div class="create-organ">
			<fx-mistake-check-step :activeStep="mistakeActiveStep" :type="mistakeStepType"></fx-mistake-check-step>
			<div class="mistake-check-warning fx-warn-font">注：以下明细中，价格与当前最新价格不一致，请确认！</div>
			<w-link icon="refresh-blue" iconClass="refresh-icon" class="sync-price" :disabled="syncPriceDisabled" @click="onSyncPriceClick">与价格档案保持一致</w-link>
			<fx-details-table
				ref="detailsTable"
				:tableColumn="computedTableColumn"
				:tableData="tableData"
				:mainId="organDetails.id"
				:canAdd="false"
				:showTools="false"
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
import { mapState } from 'vuex'
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
		actionType: String
	},
	data () {
		return {
			collapseVisible: true,
			dialogVisible: false,
			tableColumn: [
				{ prop: 'outHouse.code', label: '仓库编号', width: '150px' },
				{ prop: 'outHouse.name', label: '仓库名称', width: '120px' },
				{ prop: 'item.code', label: '品项编号', width: '150px' },
				{ prop: 'item.name', label: '品项名称', width: '120px' },
				{ prop: 'item.spec', label: '规格', width: '120px' },
				{ prop: 'itemUnit.name', label: '单位' },
				{
					prop: 'amount',
					label: '出库数量',
					width: '120px',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.amount, this.sysPointSize)
					}
				},
				{
					prop: 'salesTaxPrice',
					label: '含税销售单价',
					width: '120px',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.salesTaxPrice, this.sysPricePointSize)
					}
				},
				{
					prop: 'salesTaxRate',
					label: '销项税率',
					width: '100px',
					formatter: (row) => {
						return (row.salesTaxRate * 100) + '%'
					}
				},
				{
					prop: 'salesPrice',
					label: '非税销售单价',
					width: '110px',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.salesPrice, this.sysPricePointSize)
					}
				},
				{
					prop: 'latestPrice.taxPrice',
					label: '最新含税销售单价',
					width: '120px',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.latestPrice.taxPrice, this.sysPricePointSize)
					}
				},
				{
					prop: 'latestPrice.taxRate',
					label: '最新税率',
					width: '100px',
					formatter: (row) => {
						return (row.latestPrice.taxRate * 100) + '%'
					}
				},
				{
					prop: 'latestPrice.price',
					label: '最新非税销售单价',
					width: '120px',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.latestPrice.price, this.sysPricePointSize)
					}
				}
			],
			tableData: []
		}
	},
	computed: {
		...mapState({
			sysPricePointSize: state => state.system.sysPricePointSize,
			sysPointSize: state => state.system.sysPointSize,
			taxesList: state => state.system.taxesList,
			haveMoneyPower: state => state.loginer.haveMoneyPower
		}),
		computedTableColumn () {
			let column = this.tableColumn
			const moneyPower = ['salesTaxPrice', 'salesTaxRate', 'salesPrice', 'latestPrice.taxPrice', 'latestPrice.taxRate', 'latestPrice.price']
			if (!this.haveMoneyPower) {
				column = column.filter(item => {
					return !moneyPower.includes(item.prop)
				})
			}
			return column
		},
		syncPriceDisabled () {
			return !this.haveMoneyPower
		},
		mistakeActiveStep () {
			return this.systemParamAmountNegative ? 7 : 6
		},
		mistakeStepType () {
			return this.systemParamAmountNegative ? 'OutStore_AmountNegative' : 'OutStore'
		}
	},
	methods: {
		open (diffDetails) {
			this.tableData = diffDetails
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
			this.$emit('on-finish', 'DiffPrice')
		},
		onSyncPriceClick () {
			this.$refs.detailsTable.getSelectRows().then(res => {
				this.$fxConfirm('确定明细中的价格修改为最新价格？').then(() => {
					this.onSyncPriceHandler(res).then(() => {
						this.getDiffDetails().then(res => {
							this.$refs.detailsTable.clear()
							this.tableData = res
						})
					})
				})
			})
		},
		onSyncPriceHandler (details) {
			const ids = details.map(item => item.id)
			const logger = this.$fxLogger.createInfo('store-manage.out-store-order.syncPrice', { itemNames: this.getItemNames(details), orderData: this.organDetails })
			return this.$fxApi('outStore.agreement', this.organDetails.id)({ data: ids, logger })
		},
		getItemNames (details) {
			return details.map(item => item.item.name).join(',')
		},
		getDiffDetails () {
			return this.$fxApi('outStore.getDiffPrice', this.organDetails.id).then(res => {
				return Promise.resolve(res.errorDetailList)
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
	>>>.refresh-icon {
		height: 14px
		width: 14px
		top: 3px
	}
	.sync-price {
		height: 24px
	}
}
</style>
