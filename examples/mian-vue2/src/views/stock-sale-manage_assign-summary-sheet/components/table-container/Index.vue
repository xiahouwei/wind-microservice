<template>
	<div class="table-container">
		<div class="table-title">
			<div class="table-title-text">
				{{tableTitle}}
				<fx-details-state-tag :label="currentState.label" :icon="currentState.icon" class="state-tag"></fx-details-state-tag>
			</div>
			<div class="table-title-tools">
				冻结至第
				<w-select
					v-model="fixedColumn"
					:optionlist="fixedColumnOptionList"
					class="form-item-input"
					@change="onFixedColumnChange"
				>
				</w-select>
				列
			</div>
		</div>
		<fx-list-virtual-table
			ref="listTable"
      :tableColumn="tableColumn"
      :listData="tableData"
      border
      :showIndex="false"
      :selectable="false"
      :showTools="false"
			:highlightCurrentRow="false"
			:showPagination="false"
    >
    </fx-list-virtual-table>
		<details-info
			ref="detailsInfo"
			:searchData="searchData"
			@on-refresh="onRefresh"
		></details-info>
		<print-container
			ref="printContainer"
		></print-container>
	</div>
</template>

<script>
import detailsInfo from './DetailsInfo.vue'
import printContainer from '../print-container/Index.vue'
import { apiName } from '../../Index.vue'
export default {
	name: 'tableContainer',
	components: {
		detailsInfo,
		printContainer
	},
	props: {
		summaryData: {
			type: Object,
			default: () => {
				return {}
			}
		},
		searchData: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	data () {
		return {
			tableColumn: [],
			tableData: [],
			fixedColumn: 0
		}
	},
	computed: {
		tableTitle () {
			switch (this.searchData.datasource) {
			case 0:
				return '入库分派汇总'
			case 1:
				return '出库分派汇总'
			case 2:
				return '销售订单汇总'
			default:
				return []
			}
		},
		currentState () {
			switch (this.searchData.billState) {
			case 0:
				return {
					label: '未审核',
					icon: 'orange'
				}
			case 1:
				return {
					label: '已审核',
					icon: 'green'
				}
			default:
				return {}
			}
		},
		fixedColumnOptionList () {
			return Array.from({ length: 11 }, (item, index) => {
				return {
					id: index,
					name: index + ''
				}
			})
		}
	},
	methods: {
		setTableData () {
			const columnData = this.summaryData.columnData
			this.tableColumn = []
			this.fixedColumn = 0
			this.$nextTick(() => {
				this.tableColumn = this.setTableColumn(columnData)
				this.tableData = this.summaryData.tableData
				this.$refs.listTable.scrollToIndex(0)
			})
		},
		setTableColumn (columnData) {
			return columnData.map(col => {
				if (col.children) {
					return {
						prop: col.colProp,
						label: col.diagonal ? col.diagonalText : col.colName,
						headerAlign: 'center',
						diagonal: col.diagonal || false,
						child: this.setTableColumn(col.children)
					}
				} else {
					return {
						prop: col.colProp,
						label: col.diagonal ? col.diagonalText : col.colName,
						headerAlign: 'center',
						align: 'center',
						width: col.colWidth || '120',
						rowMerge: col.rowMerge || null,
						diagonal: col.diagonal || false,
						fxRender: (h, { row, $index }) => this.tableCellRender(h, { row, $index }, col)
					}
				}
			})
		},
		tableCellRender (h, { row, $index }, col) {
			h = this.$createElement
			if ((col.canEdit || row.canEdit) && col.colProp !== 'c0') {
				return <span
					class='fx-list-table__cell-span'
				>
					<w-link
						class="check-link"
						on-click={() => this.onCheckLink(row, col)}
					>
						{row[col.colProp]}
					</w-link>
				</span>
			} else {
				return <span class='fx-list-table__cell-span'>{row[col.colProp]}</span>
			}
		},
		onCheckLink (row, col) {
			const billDetailIds = row.ids || row[col.colProp + 'ids']
			let getAssignSummaryDetailsApi = ''
			switch (this.searchData.datasource) {
			case 0:
				getAssignSummaryDetailsApi = 'getAssignSummaryInStoreDetails'
				break
			case 1:
				getAssignSummaryDetailsApi = 'getAssignSummaryOutStoreDetails'
				break
			case 2:
				getAssignSummaryDetailsApi = 'getAssignSummarySaleOrderDetails'
				break
			}
			return this.$fxApi(`${apiName}.${getAssignSummaryDetailsApi}`)({ data: billDetailIds }).then(res => {
				this.$refs.detailsInfo.open(res)
			})
		},
		onRefresh () {
			this.$emit('on-refresh')
		},
		onPrint () {
			if (this.tableData.length) {
				const tableColumn = this.$fxUtils.deepClone(this.tableColumn)
				this.$refs.printContainer.open(this.searchData, this.tableData, tableColumn)
			} else {
				this.$fxMessage.warning('当前无明细，不允许打印！')
			}
		},
		onFixedColumnChange () {
			const tableColumn = this.tableColumn
			this.tableColumn = []
			const maxlength = Math.min(this.fixedColumnOptionList[this.fixedColumnOptionList.length - 1].id, tableColumn.length)
			for (let i = 0; i < maxlength; i++) {
				if (i < this.fixedColumn) {
					tableColumn[i].fixed = true
				} else {
					tableColumn[i].fixed = false
				}
			}
			this.$refs.listTable.scrollToIndex(0)
			this.$nextTick(() => {
				this.tableColumn = tableColumn
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.table-container {
	display flex
	flex-direction column
	width 100%
	padding 0 20px 20px 25px
	.table-title {
		display flex
		justify-content space-between
		align-items center
		font-size 14px
		line-height 60px
		.state-tag {
			margin-left 15px
		}
		.form-item-input {
			width 70px
			>>>input {
				padding-right 30px
			}
		}
	}
}
.check-link {
	color $fxBlue5
	text-decoration-line underline
}
</style>
