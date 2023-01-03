<template>
	<w-dialog v-model="dialogVisible" :title="computedTitle" width="700px" positionCenter>
		<div class="details-container">
			<div class="check-err-warning fx-warn-font">{{computedTip}}</div>
			<fx-details-table
				ref="detailsTable"
				:tableColumn="tableColumn"
				:tableData="tableData"
				:canAdd="false"
				:showDeleteBtn="false"
				:selectable="false"
				:fullScreenBtn="false"
				:showTools="false"
			></fx-details-table>
		</div>
		<template slot="footer">
			<el-button @click="onCancelClick">取消</el-button>
		</template>
	</w-dialog>
</template>
<script>
export default {
	name: 'uncheckOrderList',
	props: {
		billType: String
	},
	data () {
		return {
			dialogVisible: false,
			tableColumn: [
				{
					prop: 'sysBillCode',
					label: '系统单号',
					fxRender: this.sysBillCodeRender
				},
				{ prop: 'businessDate', label: '业务时间' },
				{
					prop: 'buyerBillState',
					label: '审核状态',
					required: true,
					fxRender: this.billStateRender
				}
			],
			tableData: [],
			errCode: 2
		}
	},
	computed: {
		billState () {
			return (billState, recheckState, key) => {
				return this.$fxStateMiddleware.getOrderStateById(billState, recheckState)[key]
			}
		},
		computedTitle () {
			switch (this.billType) {
			case 'CheckBill':
				switch (this.errCode) {
				case 2:
					return '未审核单据'
				case 3:
					return '已审核盘点单'
				default:
					return ''
				}
			case 'InStore':
				return '已审核盘点单'
			case 'OutStore':
				return '已审核盘点单'
			case 'MoveOrder':
				return '已审核盘点单'
			case 'BusinessOrder':
				return '已审核盘点单'
			case 'Pick':
				return '已审核盘点单'
			case 'MachineCompose':
				return '已审核盘点单'
			default:
				return ''
			}
		},
		computedTip () {
			switch (this.billType) {
			case 'CheckBill':
				switch (this.errCode) {
				case 2:
					return '注：盘点时间前存在未审核的出入库单据'
				case 3:
					return '注：业务日期后存在已审核的盘点单据'
				default:
					return ''
				}
			case 'InStore':
				return '注：业务日期后存在已审核的盘点单据'
			case 'OutStore':
				return '注：业务日期后存在已审核的盘点单据'
			case 'MoveOrder':
				return '注：该单据审核后生成的下级单据，业务日期后存在已审核的盘点单'
			case 'BusinessOrder':
				return '注：该单据审核后生成的下级单据，业务日期后存在已审核的盘点单'
			case 'Pick':
				return '注：该单据审核后生成的下级单据，业务日期后存在已审核的盘点单'
			case 'MachineCompose':
				return '注：业务日期后存在已审核的盘点单据'
			default:
				return ''
			}
		}
	},
	methods: {
		open (errDetails, errCode = 2) {
			this.tableData = errDetails
			this.errCode = errCode
			this.dialogVisible = true
		},
		onCancelClick () {
			this.dialogVisible = false
		},
		sysBillCodeRender (h, { row, $index }) {
			h = this.$createElement
			return <w-link class="check-link" on-click={() => this.onJumpLink(row)}>{row.sysBillCode}</w-link>
		},
		onJumpLink (row) {
			this.$fxGoToBillBlank(row.billClass, { id: row.id }, 'detail')
		},
		billStateRender (h, { row }) {
			h = this.$createElement
			return <fx-list-state-tag
				icon={this.billState(row.billState, row.recheckState, 'icon')}
				label={this.billState(row.billState, row.recheckState, 'label')}
			></fx-list-state-tag>
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.details-container {
	display: flex;
	flex-direction: column;
	overflow: auto;
	height 50vh
	.check-err-warning {
		line-height: 30px
	}
	.check-link {
		color $fxBlue5
		text-decoration-line underline
	}
}
</style>
