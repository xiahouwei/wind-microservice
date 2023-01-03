<template>
	<div class="organ-manage-container">
		<div class="tools-left">
			<el-button class="order-btn" type="primary" plain @click="toStockOrder">返回采购订单列表</el-button>
			<el-button class="order-btn" type="danger" plain @click="toStep1">返回采购计划单分派</el-button>
		</div>
		<fx-list-virtual-table
			ref="listTable"
			:tableColumn="computedTableColumn"
			:listData="tableData"
			showIndex
			:selectable='false'
			:showTools='false'
			@on-sort-change="onSortChange"
			@on-page-change="onPageChange"
		>
		</fx-list-virtual-table>
	</div>
</template>
<script>
import { mapState } from 'vuex'
import { apiName } from '../Index.vue'
import FxListStateTag from '@/components/common/Fx-list-state-tag.vue'
export default {
	name: 'listContainer',
	data () {
		return {
			tableColumn: [
				{ prop: 'sysBillCode', label: '系统单号', required: true, sortable: true, width: '140px', fxRender: this.sysBillCodeRender },
				{ prop: 'businessDate', label: '订货时间', required: true, sortable: true, width: '160px' },
				{ prop: 'organName', label: '买方机构', required: true, sortable: true, sortKey: 'organId' },
				{
					prop: 'buyerOrganStore',
					label: '买方仓库',
					required: true,
					formatter: (row) => {
						return row.inHouseNames ? row.inHouseNames.join('，') : ''
					}
				},
				{ prop: 'otherOrganName', label: '卖方机构', required: true, sortable: true, sortKey: 'otherOrganId' },
				{ prop: 'purchasePlanName', label: '订货方案', required: true },
				{ prop: 'billBizTypeName', label: '业务类型', required: true },
				{
					prop: 'urgentFlag',
					label: '加急状态',
					required: true,
					fxRender: this.urgentRender
				},
				{
					prop: 'buyerBillState',
					label: '审核状态',
					required: true,
					fxRender: this.billStateRender
				},
				{ prop: 'sendFlag', label: '发单状态' },
				{
					prop: 'sumTaxMoney',
					label: '含税总金额',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.sumTaxMoney, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'sumMoney',
					label: '非税总金额',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.sumMoney, this.sysMoneyPointSize)
					}
				},
				{ prop: 'billTypeName', label: '单据类型', required: true },
				{ prop: 'userBillCode', label: '手工单号' },
				{ prop: 'memo', label: '备注' },
				{
					prop: 'modifyManName',
					label: '最新修改人',
					sortable: true,
					sortKey: 'modifyMan'
				},
				{
					prop: 'modifyDate',
					label: '最新修改时间',
					width: '140px',
					sortable: true,
					sortKey: 'modifyDate',
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.modifyDate)
					}
				},
				{ prop: 'createManName', label: '创建人' },
				{
					prop: 'createDate',
					label: '创建时间',
					width: '140px',
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.createDate)
					}
				}
			],
			tableData: [],
			ids: []
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize,
			haveMoneyPower: state => state.loginer.haveMoneyPower
		}),
		billState () {
			return (billState, recheckState, key) => {
				return this.$fxStateMiddleware.getOrderStateById(billState, recheckState)[key]
			}
		},
		urgentState () {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('urgentState')(val)[key]
			}
		},
		assignState () {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('assignState')(val)[key]
			}
		},
		computedTableColumn () {
			const moneyPower = ['sumTaxMoney', 'sumMoney']
			if (!this.haveMoneyPower) {
				return this.tableColumn.filter(item => {
					return !moneyPower.includes(item.prop)
				})
			} else {
				return this.tableColumn
			}
		}
	},
	methods: {
		onPageChange () {
			return this.getListData()
		},
		onSortChange () {
			return this.getListData()
		},
		getListData (data) {
			if (data) {
				this.ids = data
			}
			const api = `${apiName}.getAssigned`
			return this.$fxApi(api)({
				data: {
					...this.$refs.listTable.getPaginationParams(),
					i: {
						id: this.ids
					},
					o: this.$refs.listTable.getSortKey()
				}
			}).then(res => {
				this.$refs.listTable.setPaginationTotal(res.total)
				this.tableData = res.result
				return Promise.resolve(res.result)
			})
		},
		billStateRender (h, { row }) {
			return <FxListStateTag
				icon={this.billState(row.billState, row.recheckState, 'icon')}
				label={this.billState(row.billState, row.recheckState, 'label')}
			></FxListStateTag>
		},
		urgentRender (h, { row }) {
			return <FxListStateTag
				icon={this.urgentState(row.urgent, 'icon')}
				label={this.urgentState(row.urgent, 'label')}
			></FxListStateTag>
		},
		toStep1 () {
			this.$emit('toStep1')
		},
		goToBillBlank (item) {
			const id = item.id
			const type = 'StockOrder'
			this.$fxGoToBillBlank(type, { id }, 'detail')
		},
		sysBillCodeRender (h, { row, $index }) {
			h = this.$createElement
			return <p
				class='link fx-default-font'
				onClick={() => { this.goToBillBlank(row) }}
			>{ row.sysBillCode }</p>
		},
		toStockOrder () {
			this.$fxAppTabs.tabsPush({
				path: 'stockOrder'
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.organ-manage-container {
	flex: 1
	display: flex
	flex-direction: column
	overflow: auto
	.tools-left{
		display:flex
		flex-direction: row
		align-items: center
		margin-bottom 10px
	}
}
.link {
	text-decoration underline
	cursor pointer
}
</style>
