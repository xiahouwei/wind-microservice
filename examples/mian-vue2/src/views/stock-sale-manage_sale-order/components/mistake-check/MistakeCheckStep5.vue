<template>
	<w-dialog v-model="dialogVisible" width="1200px" title="异常警告" heightFullscreen @close="clear">
		<div class="create-organ">
			<fx-mistake-check-step :activeStep="5" type="SalesOrder"></fx-mistake-check-step>
			<div class="mistake-check-warning fx-warn-font">注：以下明细汇中，销售价格与价格档案不一致，请确认！</div>
			<w-link icon="refresh-blue" iconClass="refresh-icon" class="sync-price" :disabled="syncPriceDisabled" @click="onSyncPriceClick">与价格档案保持一致</w-link>
			<fx-details-table
				ref="detailsTable"
				:tableColumn="computedColumn"
				:tableData="tableData"
				:canAdd="false"
				:showTools="false"
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
	name: 'mistakeCheckStep5',
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
				{ prop: 'itemUnit.name', label: '单位' },
				{
					prop: 'amount',
					label: '销售数量',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.amount, this.sysPointSize)
					}
				},
				{
					prop: 'taxPrice',
					label: '含税单价',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.taxPrice, this.sysPricePointSize)
					}
				},
				{
					prop: 'latestPrice.taxPrice',
					label: '最新含税单价',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.latestPrice.taxPrice, this.sysPricePointSize)
					}
				}
			],
			tableData: []
		}
	},
	computed: {
		...mapState({
			sysPointSize: state => state.system.sysPointSize,
			sysPricePointSize: state => state.system.sysPricePointSize,
			haveMoneyPower: state => state.loginer.haveMoneyPower
		}),
		computedColumn () {
			let column = this.tableColumn
			const moneyPower = ['taxPrice', 'latestPrice.taxPrice']
			if (!this.haveMoneyPower) {
				column = column.filter(item => {
					return !moneyPower.includes(item.prop)
				})
			}
			return column
		},
		syncPriceDisabled () {
			return !this.haveMoneyPower
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
			const logger = this.$fxLogger.createInfo('stock-sale-manage.sale-order.syncPrice', { itemNames: this.getItemNames(details), orderData: this.organDetails })
			return this.$fxApi(`${apiName}.saveDetailsMulity`, this.organDetails.id)({ data: details, logger })
		},
		getItemNames (details) {
			return details.map(item => item.item.name).join(',')
		},
		getDiffDetails () {
			return this.$fxApi(`${apiName}.getDiff`, this.organDetails.id).then(res => {
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
