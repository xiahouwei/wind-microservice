<template>
	<w-dialog
		v-model="dialogVisible"
		:title="title"
		fullscreen
		@close="onDialogClose"
	>
		<filterBar
			ref="filterBar"
			:tableData="tableData"
			@on-search="getListData"
		>
		</filterBar>
		<fx-list-virtual-table
			ref="listTable"
			:tableColumn="tableColumn"
			:listData="tableData"
			:showColumnFilterBtn="false"
			:selectable="false"
			:selectMulity="false"
			:showPagination="false"
			showIndex
		>
		</fx-list-virtual-table>
	</w-dialog>
</template>
<script>
import filterBar from './FilterBar.vue'
export const apiName = 'warn'
export default {
	name: 'listContainer',
	components: {
		filterBar
	},
	data () {
		return {
			tableColumn: [
				{ prop: 'organName', label: '机构', required: true },
				{ prop: 'houseName', label: '仓库', required: true },
				{ prop: 'itemTypeName', label: '品项类别', required: true },
				{ prop: 'itemCode', label: '品项编号', required: true, width: '140px' },
				{ prop: 'itemName', label: '品项名称', required: true },
				{ prop: 'spec', label: '品项规格', required: true },
				{ prop: 'unitName', label: '品项单位', required: true },
				{ prop: 'amount', label: '库存余量', required: true },
				{
					prop: 'maxStoreAmount',
					label: '库存上限',
					required: true,
					formatter: (row) => {
						return row.maxStoreAmount === 0 ? '无上限' : row.maxStoreAmount
					}
				},
				{
					prop: 'minStoreAmount',
					label: '库存下限',
					required: true,
					formatter: (row) => {
						return row.minStoreAmount === 0 ? '无下限' : row.minStoreAmount
					}
				},
				{ prop: 'highStoreAmount', label: '高于库存上限数量', required: true },
				{ prop: 'lowStoreAmount', label: '低于库存下限数量', required: true },
				{
					prop: 'wornState',
					label: '预警状态',
					required: true,
					fxRender: this.wornStateRender
				}
			],
			title: '',
			tableData: [],
			dialogVisible: false
		}
	},
	methods: {
		open (item) {
			this.tableData = []
			this.title = item.label
			this.dialogVisible = true
			this.$nextTick(() => {
				this.refresh()
			})
		},
		refresh () {
			this.$refs.filterBar.initFilter()
		},
		getSearchParams () {
			const params = {
				...this.$refs.filterBar.getFilterParams()
			}
			return params
		},
		getListData () {
			return this.getListDataHandler().then(res => {
				this.tableData = res
				return Promise.resolve(res)
			})
		},
		getListDataHandler () {
			return this.$fxApi(`${apiName}.getStoreWarnListData`)({ data: this.getSearchParams() })
		},
		onDialogClose () {
			this.$emit('on-refresh')
		},
		wornStateClass (row) {
			switch (row.wornState) {
			case 0:
				return 'warn-state'
			case 1:
				return 'normal-state'
			default:
				return ''
			}
		},
		wornStateText (row) {
			switch (row.wornState) {
			case 0:
				return '预警'
			case 1:
				return '正常'
			default:
				return ''
			}
		},
		wornStateRender (h, { row }) {
			return <span class={['fx-list-table__cell-span', this.wornStateClass(row)]}>{this.wornStateText(row)}</span>
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
>>>.normal-state {
	color $fxGreen2
}
>>>.warn-state {
	color $fxOrange4
}
</style>
