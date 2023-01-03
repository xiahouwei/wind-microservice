<template>
	<w-dialog v-model="dialogVisible" :title="title" width="1200px" heightFullscreen>
		<div class="details-container">
			<div class="check-err-warning fx-warn-font">{{ warnFont }}</div>
			<fx-details-table
				ref="detailsTable"
				:tableColumn="tableColumn"
				:tableData="tableData"
				:canAdd="false"
				:showDeleteBtn="false"
				:selectable="false"
				:fullScreenBtn="false"
				:showColumnFilterBtn="false"
			></fx-details-table>
		</div>
		<template slot="footer">
			<el-button @click="onCancelClick">取消</el-button>
		</template>
	</w-dialog>
</template>
<script>
import { mapState } from 'vuex'
export default {
	name: 'checkErrInfo',
	data () {
		return {
			dialogVisible: false,
			tableColumn: [
				{ prop: 'house.code', label: '仓库编号', width: '150px' },
				{ prop: 'house.name', label: '仓库名称', width: '120px' },
				{ prop: 'item.code', label: '配料编号', width: '150px' },
				{ prop: 'item.name', label: '配料名称', width: '120px' },
				{ prop: 'itemUnit.name', label: '单位' },
				{
					prop: 'outAmount',
					label: '本次出库数量',
					width: '120px',
					labelClassName: 'amount-label',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.outAmount, this.sysPointSize)
					}
				}, {
					prop: 'storeAmount',
					label: '当前库存剩余库存',
					width: '120px',
					labelClassName: 'amount-label',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.storeAmount, this.sysPointSize)
					}
				}
			],
			tableData: [],
			title: '配料库存不足',
			warnFont: '注：以下明细中，存在配料库存不足的品项，请补充库存！'
		}
	},
	computed: {
		...mapState({
			sysPointSize: state => state.system.sysPointSize
		})
	},
	methods: {
		open (errDetails, writteInfo = {}) {
			this.tableData = errDetails
			if (!this.$fxUtils.isEmptyObj(writteInfo)) {
				writteInfo.title && (this.title = writteInfo.title)
				writteInfo.warnFont && (this.warnFont = writteInfo.warnFont)
			}
			this.dialogVisible = true
		},
		onCancelClick () {
			this.dialogVisible = false
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.details-container {
	flex: 1
	display: flex;
	flex-direction: column;
	overflow: auto;
	.check-err-warning {
		line-height: 30px
	}
}
</style>
<style lang="stylus">
@import '~$assets/stylus/varsty.styl'
.amount-label {
	font-weight bold
}
</style>
