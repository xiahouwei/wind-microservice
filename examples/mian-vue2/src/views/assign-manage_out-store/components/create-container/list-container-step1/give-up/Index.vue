<template>
	<w-dialog
		v-model="dialogVisible"
		title="查看放弃"
		fullscreen
		:showMoreBtn="false"
		@close='close'
	>
		<div class="organ-manage-container">
			<filterBar ref="filterBar" @on-search="refresh"></filterBar>
			<fx-details-table
				ref="detailsTable"
				:tableColumn="tableColumn"
				:tableData="tableData"
				:collectionCellRender="collectionCellRender"
				:fpOnRowEdit="fpOnRowEdit"
				:fullScreenBtn='false'
				:showColumnFilterBtn='false'
				:showDeleteBtn='false'
				:canAdd='false'
				:tableSearchInput='false'
				:tableValiDate="tableValiDate"
			>
				<div slot="btn-tools-left" class="tools-left">
					<el-button v-fx-auth:stock-sale-manage_assign-manage_out-store.recover-outstore class="order-btn" type="primary" plain @click='onRecover'>恢复</el-button>
				</div>
			</fx-details-table>
		</div>
	</w-dialog>
</template>
<script>
import { mapState } from 'vuex'
import { apiName } from '../../Index.vue'
import filterBar from './FilterBar.vue'
export default {
	name: 'listContainer',
	components: {
		filterBar
	},
	data () {
		return {
			dialogVisible: false,
			tableColumn: [
				{ prop: 'itemName', label: '品项名称', width: '160px' },
				{ prop: 'itemSpec', label: '规格' },
				{ prop: 'unitName', label: '单位' },
				{ prop: 'stockWay', label: '订货方式', fxRender: this.stockWayRender },
				{ prop: 'expectArrivalDate', label: '期望到货时间' },
				{
					prop: 'amount',
					label: '订货数量',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.amount, this.sysPointSize)
					}
				},
				{
					prop: 'thisAmount',
					label: '本次恢复放弃数量 ',
					fxRender: this.thisAmountRender,
					click: this.onCellClick('thisAmount')
				},
				{
					prop: 'outGiveUpAmount',
					label: '已放弃数量',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.outGiveUpAmount, this.sysPointSize)
					}
				},
				{ prop: 'assistUnit', label: '辅助单位 ' },
				{
					prop: 'assistUnitAmount',
					label: '订货辅助数量 ',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.assistUnitAmount, this.sysPointSize)
					}
				},
				{ prop: 'memo', label: '明细备注 ' }
			],
			ids: [],
			tableData: [],
			listData: [],
			tableValiDate: [{
				columnProp: 'thisAmount',
				rule: (row, success, error) => {
					if (row.thisAmount > row.outGiveUpAmount) {
						error('本次恢复放弃数量不能大于已放弃数量！')
					} else {
						success()
					}
				}
			}]
		}
	},
	computed: {
		...mapState({
			sysPointSize: state => state.system.sysPointSize
		}),
		stockWayState () {
			return (val, key) => {
				return this.$fxTypeMiddleware.getCommonTypeItemById('stockWay')(val)[key]
			}
		}
	},
	methods: {
		open (ids) {
			this.ids = ids
			this.dialogVisible = true
			this.$nextTick(() => {
				this.getListData(ids)
				this.$refs.filterBar.onResetClick()
			})
		},
		getAccountingPeriod () {
			return this.$fxApi(`${apiName}.getAccountingPeriod`).then(res => {
				return Promise.resolve(res)
			})
		},
		collectionCellRender (h, data) {
			h = this.$createElement
			return <div>
				<span class="collection-cell">系统单号:{data.sysBillCode}</span>
				<span class="collection-cell">手工单号:{data.userBillCode}</span>
				<span class="collection-cell">订货时间:{data.businessDate}</span>
				<span class="collection-cell">买方机构:{data.otherOrganName}</span>
				<span class="collection-cell">卖方机构:{data.organName}</span>
			</div>
		},
		refresh () {
			return this.getListDataHandler(this.ids)
		},
		getSearchParams () {
			const params = {
				...this.$refs.filterBar.getFilterParams()
			}
			return params
		},
		getListData (ids) {
			this.$refs.detailsTable.clear()
			this.getAccountingPeriod().then(res => {
				this.$refs.filterBar.dateRang = [res.begin, res.end]
				this.getListDataHandler(ids)
			})
		},
		getListDataHandler (ids = []) {
			const api = `${apiName}.giveUpList`
			const data = this.getSearchParams()
			if (ids.length) {
				data.i['bill.sysBillCode'] = ids
			}
			return this.$fxApi(api)({ data }).then(res => {
				for (const i of res) {
					i.thisAmount = i.outGiveUpAmount
				}
				this.tableData = res
				return Promise.resolve(res)
			})
		},
		onRecover () {
			return this.$refs.detailsTable.getSelectRows().then(res => {
				let flag = true
				for (const item of res) {
					if (item.thisAmount > item.outGiveUpAmount) {
						this.$refs.detailsTable.setRowEdit(item, 'thisAmount').then(() => {
							this.$refs.detailsTable.$refs.listTable.verificationRowData(item)
						})
						flag = false
						return false
					}
				}
				if (flag) {
					this.$fxConfirm({
						message: '是否确定恢复所选品项？',
						selectedRowsLength: res.length
					}).then(() => {
						const data = res.map(item => {
							return {
								billId: item.collectionData.id,
								detailId: item.id,
								amount: item.thisAmount
							}
						})
						const logger = this.$fxLogger.createInfo('stock-sale-manage.assign-manage.out-assign.recover', { data: res })
						this.$fxApi(`${apiName}.recover`)({ data, logger }).then(res => {
							this.refresh()
							this.$emit('on-refresh')
						})
					})
				}
			})
		},
		onCellClick (type) {
			return (row) => {
				this.$refs.detailsTable.setRowEdit(row, type)
			}
		},
		fpOnRowEdit (row, $index, type) {
			return new Promise(resolve => {
				this.$refs[`${type}-${$index}`].focus()
				resolve()
			})
		},
		thisAmountRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`thisAmount-${$index}`}
				vModel={row.thisAmount}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='thisAmount'
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.thisAmount, this.sysPointSize)}
				pointSize={this.sysPointSize}
				on-on-change={this.onThisAmountChange}
			>
			</fx-list-cell-input-number>
		},
		onThisAmountChange (val, row) {
			row.thisAmount = val
		},
		stockWayRender (h, { row }) {
			h = this.$createElement
			return <span>{this.stockWayState(row.stockWay, 'label')}</span>
		},
		close () {
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.organ-manage-container {
	flex: 1;
	display:flex
	flex-direction: column
	overflow: auto
	.tools-right {
		display:flex
		flex-direction: row
		align-items: center
	}
}
.collection-cell {
	margin-right: 35px
}
</style>
