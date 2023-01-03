<template>
	<w-dialog
		v-model="dialogVisible"
		title="选择批次号"
		heightFullscreen
		width="800px"
		@close="close"
	>
		<div class="table-container">
			<fx-list-virtual-table
				ref="listTable"
				:tableColumn="tableColumn"
				:listData="tableData"
				:fpGetListData="getListDataHandler"
				:selectMulity="false"
				:showColumnFilterBtn="false"
				showIndex
				:showSummaryTools="false"
				:showPagination="false"
			>
			</fx-list-virtual-table>
		</div>
		<template slot="footer">
			<el-button @click="onCancelClick">取消</el-button>
			<el-button type="primary" @click="onSaveClick">确定</el-button>
		</template>
	</w-dialog>
</template>
<script>
import { mapState } from 'vuex'
export default {
	name: 'batchCodeDialog',
	props: {
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	data () {
		return {
			dialogVisible: false,
			tableColumn: [
				{ prop: 'batchCode', label: '批次号', required: true, width: '140px' },
				{
					prop: 'productDate',
					label: '生产日期',
					required: true,
					width: '160px',
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.productDate)
					}
				},
				{ prop: 'amount', label: '当前结余', required: true },
				{
					prop: 'price',
					label: '成本单价',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.price, this.sysPricePointSize)
					}
				}
			],
			tableData: [],
			curRow: {}
		}
	},
	computed: {
		...mapState({
			sysPricePointSize: state => state.system.sysPricePointSize
		})
	},
	methods: {
		open (curRow) {
			this.curRow = curRow
			this.tableData = []
			this.dialogVisible = true
			this.$nextTick(() => {
				this.refreshPageData()
			})
		},
		refreshPageData () {
			this.$refs.listTable.clearSelected()
			this.getListData()
		},
		onPageChange () {
			return this.getListData()
		},
		getListData () {
			return this.getListDataHandler().then(res => {
				this.tableData = res
				this.$refs.listTable.setPaginationTotal(res.length)
				return Promise.resolve(res)
			})
		},
		getListDataHandler () {
			const data = {
				organId: this.organDetails.organ.id,
				itemId: this.curRow.item.id,
				unitId: this.curRow.itemUnit.id
			}
			if (this.organDetails.singleHouseFlag) {
				data.houseId = this.organDetails.outHouse.id
			} else {
				data.houseId = this.curRow.outHouse.id
			}
			return this.$fxApi('outStore.getBatchCodeList', this.organDetails.id)({ data })
		},
		onCancelClick () {
			this.dialogVisible = false
		},
		onSaveClick () {
			this.$refs.listTable.getSelectedRows().then(selectRows => {
				this.$set(this.curRow, 'batchCode', selectRows[0].batchCode)
				this.$set(this.curRow, 'chooseBatch', 1)
				this.dialogVisible = false
			})
		},
		close () {
			this.$refs.listTable.clearSelected()
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.table-container {
	flex 1
	padding 0 16px 0 10px
}
</style>
