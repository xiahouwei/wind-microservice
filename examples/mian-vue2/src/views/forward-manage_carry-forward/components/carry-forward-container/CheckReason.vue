<template>
	<w-dialog
		v-model="dialogVisible"
		title="查看原因"
		:width="dialogWidth"
	>
		<div class="check-reason-container">
			<div class="fail-message">{{computedFailMessage}}</div>
			<fx-list-virtual-table
				ref="detailsTable"
				v-if="showTable"
				:tableColumn="tableColumn"
				:listData="tableData"
				:canAdd="false"
				:selectable="false"
				:showTools="false"
				:showPagination="false"
				:stripe="false"
				border
				showIndex
				minHeight="360px"
			>
			</fx-list-virtual-table>
			<!-- <div v-if="type === 4">
				<w-link class="check-link" @click="onGoToSalesBill">点击前往查看</w-link>
			</div> -->
		</div>
		<template slot="footer">
			<el-button @click="onCancelClick">取消</el-button>
		</template>
	</w-dialog>
</template>

<script>
import BILL_ROUTER_CONFIG from '@/router/billRouterConfig.js'
export default {
	name: 'checkReason',
	data () {
		return {
			dialogVisible: false,
			type: 'table',
			tableData: [],
			tableColumn: [
				{ prop: 'billType', label: '单据种类', width: '160px', align: 'center',	headerAlign: 'center' },
				{ prop: 'billAmount', label: '数量', width: '80px', align: 'center', headerAlign: 'center' },
				{ prop: 'operation', label: '操作', width: '200px', align: 'center',	headerAlign: 'center', fxRender: this.operationRender }
			],
			tableColumnSales: [
				{ prop: 'sysBillCode', label: '销售订单单号', width: '140px', align: 'center', headerAlign: 'center' },
				{ prop: 'uncheckedOrder', label: '下级未审核单据', width: '450px', align: 'center',	headerAlign: 'center', fxRender: this.uncheckedOrderRender }
			],
			failMessage: '',
			reasonData: {},
			carryForwardType: ''
		}
	},
	computed: {
		computedFailMessage () {
			switch (this.type) {
			case 'table':
				return this.carryForwardType === 'carryForward' ? '当前会计期内存在单据未审核' : '当前会计期内存在已审核单据'
			case 'text':
				return this.failMessage
			default:
				return ''
			}
		},
		showTable () {
			return this.type === 'table'
		},
		dialogWidth () {
			return this.showTable ? '750px' : '550px'
		}
	},
	methods: {
		open (data, carryForwardType) {
			this.type = data.reasonType
			this.carryForwardType = carryForwardType
			this.reasonData = data
			switch (this.type) {
			case 'table':
				this.tableData = data.reason.split(';').map(item => {
					const itemDate = item.split('-')
					const moveBillOrganTypeName = itemDate[2] ? itemDate[2] === 'outApply' ? '（出库方）' : '（入库方）' : ''
					return {
						billType: (BILL_ROUTER_CONFIG[itemDate[0]] && BILL_ROUTER_CONFIG[itemDate[0]].name) + moveBillOrganTypeName,
						billClass: itemDate[0],
						billAmount: itemDate[1],
						moveBillOrganType: itemDate[2]
					}
				}).filter(item => item.billClass)
				break
			case 'text':
				this.failMessage = data.reason
				break
			default:
				break
			}
			this.dialogVisible = true
		},
		onCancelClick () {
			this.dialogVisible = false
		},
		operationRender (h, { row, $index }) {
			h = this.$createElement
			return <w-link class="check-link" on-click={() => this.onGoToBill(row)}>点击前往查看</w-link>
		},
		uncheckedOrderRender (h, { row, $index }) {
			h = this.$createElement
			return <div class="fx-ellipsis">
				{row.uncheckedOrder.map((item, index) => {
					if (index === row.uncheckedOrder.length - 1) {
						return <w-link class="check-link" on-click={() => this.onJumpLink(item)}>{item.sysBillCode}</w-link>
					}
					return <span><w-link class="check-link" on-click={() => this.onJumpLink(item)}>{item.sysBillCode}</w-link>、</span>
				})}
			</div>
		},
		onGoToBill (row) {
			let organData = {}
			if (row.moveBillOrganType && row.moveBillOrganType === 'outApply') {
				organData = {
					otherOrganId: this.reasonData.organId
				}
			} else {
				organData = {
					organId: this.reasonData.organId
				}
			}
			if (this.carryForwardType === 'carryForward') {
				this.$fxGoToBillBlank(row.billClass, { billState: [0, 1], ...organData, beginDate: this.reasonData.beginDate, endDate: this.reasonData.endDate })
			} else {
				this.$fxGoToBillBlank(row.billClass, { billState: [2], ...organData, beginDate: this.reasonData.beginDate, endDate: this.reasonData.endDate })
			}
		},
		onJumpLink (item) {
			this.$fxGoToBillBlank(item.billClass, { id: item.id }, 'detail')
		},
		onGoToSalesBill () {
			this.$fxGoToBillBlank('SalesOrder', { inAssignStatus: [0, 1], outAssignStatus: [1] })
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.check-reason-container {
	display flex
	flex-direction column
	.fail-message {
		margin-bottom 10px
		color $fxRed
		font-weight bold
	}
	.check-link {
		color $fxBlue5
		text-decoration-line underline
	}
}
>>>.el-dialog__body {
	padding 20px 40px 10px !important
}
</style>
