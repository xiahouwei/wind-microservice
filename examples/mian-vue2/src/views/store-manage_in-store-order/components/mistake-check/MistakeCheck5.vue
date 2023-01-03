<template>
	<w-dialog v-model="dialogVisible" title="异常警告" width="1200px" heightFullscreen @close="clear">
		<div class="create-organ">
			<fx-mistake-check-step :activeStep="mistakeStep" :type="mistakeStepType"></fx-mistake-check-step>
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
	name: 'mistakeCheckStep5',
	props: {
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		actionText: String,
		actionType: String,
		isInStoreHandWithSupplier: Boolean
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
					label: '入库数量',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.amount, this.sysPointSize)
					}
				},
				{
					prop: 'inTaxPrice',
					label: '含税单价',
					width: '100px',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.inTaxPrice, this.sysPricePointSize)
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
					prop: 'inPrice',
					label: '非税单价',
					width: '100px',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.inPrice, this.sysPricePointSize)
					}
				},
				{
					prop: 'lastTaxPrice',
					label: '最新含税单价',
					width: '120px',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.lastTaxPrice, this.sysPricePointSize)
					}
				},
				{
					prop: 'lastTaxRate',
					label: '最新税率',
					width: '100px',
					formatter: (row) => {
						return (row.lastTaxRate * 100) + '%'
					}
				},
				{
					prop: 'lastPrice',
					label: '最新非税单价',
					width: '120px',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.lastPrice, this.sysPricePointSize)
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
			haveCostPower: state => state.loginer.haveCostPower
		}),
		computedTableColumn () {
			let column = this.tableColumn
			const costPower = ['inTaxPrice', 'taxRate', 'inPrice', 'lastTaxPrice', 'lastTaxRate', 'lastPrice']
			if (!this.haveCostPower) {
				column = column.filter(item => {
					return !costPower.includes(item.prop)
				})
			}
			return column
		},
		syncPriceDisabled () {
			return !this.haveCostPower
		},
		mistakeStepType () {
			return this.isInStoreHandWithSupplier ? 'InStoreWithSupplier' : 'InStore'
		},
		mistakeStep () {
			return this.isInStoreHandWithSupplier ? 6 : 5
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
			const logger = this.$fxLogger.createInfo('store-manage.in-store-order.syncPrice', { itemNames: this.getItemNames(details), orderData: this.organDetails })
			return this.$fxApi('inStore.agreement', this.organDetails.id)({ data: ids, logger })
		},
		getItemNames (details) {
			return details.map(item => item.item.name).join(',')
		},
		getDiffDetails () {
			return this.$fxApi('inStore.getDiffPrice', this.organDetails.id).then(res => {
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
