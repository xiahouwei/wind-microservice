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
				:selectable='false'
			>
			</fx-details-table>
		</div>
	</w-dialog>
</template>
<script>
import { apiName } from '../../Index.vue'
import { mapState } from 'vuex'
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
				{ prop: 'inHouseName', label: '入库仓库', width: '140px' },
				{ prop: 'itemName', label: '品项名称', width: '160px' },
				{ prop: 'itemSpec', label: '规格' },
				{ prop: 'unitName', label: '单位' },
				{ prop: 'stockWay', label: '订货方式', fxRender: this.stockWayRender },
				{ prop: 'expectArrivalDate', label: '期望到货时间' },
				{
					prop: 'amount',
					label: '订货数量 ',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.amount, this.sysPointSize)
					}
				},
				{
					prop: 'giveUpAmount',
					label: '已放弃数量 ',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.giveUpAmount, this.sysPointSize)
					}
				},
				{
					prop: 'assistUnit',
					label: '辅助单位 '
				},
				{
					prop: 'assistUnitAmount',
					label: '订货辅助数量 ',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.assistUnitAmount, this.sysPointSize)
					}
				},
				{ prop: 'memo', label: '明细备注 ' }
			],
			tableData: [],
			listData: [],
			ids: []
		}
	},
	computed: {
		stockWayState () {
			return (val, key) => {
				return this.$fxTypeMiddleware.getCommonTypeItemById('stockWay')(val)[key]
			}
		},
		...mapState({
			sysPointSize: state => state.system.sysPointSize
		})
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
				<span class="collection-cell">买方机构:{data.organName}</span>
			</div>
		},
		refresh () {
			this.tableData = []
			return this.getListData(this.ids)
		},
		getSearchParams () {
			const params = {
				...this.$refs.filterBar.getFilterParams()
			}
			return params
		},
		getListData (ids = []) {
			this.$refs.detailsTable.clear()
			this.getAccountingPeriod().then(res => {
				this.$refs.filterBar.dateRang = [res.begin, res.end]
				const api = `${apiName}.giveUpList`
				const data = this.getSearchParams()
				if (ids.length) {
					data.i['bill.sysBillCode'] = ids
				}
				return this.$fxApi(api)({ data }).then(res => {
					for (const i of res) {
						i.thisAmount = i.amount
					}
					this.tableData = res
					return Promise.resolve(res)
				})
			})
		},
		createMessage (data) {
			return data.map(i => {
				return `系统单号：${i.collectionData.sysBillCode}，品项名称：${i.itemName}，单位：${i.unitName}，恢复放弃数量：${i.thisAmount}`
			}).join('；')
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
		stockWayRender (h, { row }) {
			h = this.$createElement
			return <span>{this.stockWayState(row.stockWay, 'label')}</span>
		},
		close () {
			this.$emit('on-refresh')
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
