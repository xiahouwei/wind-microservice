<template>
	<w-dialog v-model="dialogVisible" width="1400px" title="异常警告" heightFullscreen @close="clear">
		<div class="create-organ">
			<fx-mistake-check-step :activeStep="6" type="StockOrder"></fx-mistake-check-step>
			<div class="mistake-check-warning fx-warn-font">注：以下明细中，价格与当前最新价格不一致，请确认！</div>
			<w-link icon="refresh-blue" iconClass="refresh-icon" class="sync-price" :disabled="syncPriceDisabled" @click="onSyncPriceClick">与最新价格保持一致</w-link>
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
import { apiName } from '../../Index.vue'
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
			dialogVisible: false,
			tableColumn: [
				{ prop: 'inHouse.code', label: '仓库编号' },
				{ prop: 'inHouse.name', label: '仓库名称' },
				{ prop: 'item.code', label: '品项编号' },
				{ prop: 'item.name', label: '品项名称' },
				{ prop: 'item.spec', label: '规格' },
				{ prop: 'itemUnit.name', label: '单位', width: '110px' },
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
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-order.syncPrice', { itemNames: this.getItemNames(details), orderData: this.organDetails })
			return this.$fxApi(`${apiName}.saveDetailsMulity`)({ data: details, logger })
		},
		getItemNames (details) {
			return details.map(item => item.item.name).join(',')
		},
		getDiffDetails () {
			return this.$fxApi(`${apiName}.getDiff`, this.organDetails.id).then(res => {
				return Promise.resolve(res.errorDetailList ? res.errorDetailList.details : [])
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
