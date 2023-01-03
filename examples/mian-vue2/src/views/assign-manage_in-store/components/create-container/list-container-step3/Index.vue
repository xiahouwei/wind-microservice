<template>
	<div class="organ-manage-container">
		<div class="tools-left">
			<el-button class="order-btn" type="primary" plain @click="toInStoreOrder">返回入库单列表</el-button>
			<el-button class="order-btn" type="danger" plain @click="toStep1">返回入库分派</el-button>
		</div>
		<fx-list-virtual-table
			ref="listTable"
			:tableColumn="computedTableColumn"
			:listData="tableData"
			showIndex
			indexContinuous
			:showTools='false'
			:selectable='false'
			@on-page-change="onPageChange"
			@on-sort-change="onSortChange"
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
	components: {
	},
	data () {
		return {
			tableColumn: [
				{ prop: 'sysBillCode', label: '系统单号', sortable: true, width: '160px', fxRender: this.sysBillCodeRender },
				{
					prop: 'businessDate',
					label: '入库时间',
					sortable: true,
					width: '160px',
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.businessDate)
					}
				},
				{ prop: 'organName', label: '入库方', required: true, sortable: true, sortKey: 'organId' },
				{
					prop: 'buyerOrganStore',
					label: '入库仓库',
					formatter: (row) => {
						const inHouseList = row.inHouseList
						return Array.isArray(inHouseList) ? inHouseList.map(item => item.name).join(',') : ''
					}
				},
				{ prop: 'otherOrganName', label: '出库方' },
				{ prop: 'billTypeName', label: '单据类型' },
				{ prop: 'billBizTypeName', label: '业务类型' },
				{
					prop: 'buyerBillState',
					label: '审核状态',
					fxRender: this.billStateRender
				},
				{
					prop: 'sumMoney',
					label: '入库成本总金额',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.sumMoney, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'sumInTaxMoney',
					label: '含税总金额',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.sumInTaxMoney, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'carriageFee',
					label: '整单运费',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.carriageFee, this.sysMoneyPointSize)
					}
				},
				{ prop: 'userBillCode', label: '手工单号' },
				{ prop: 'operateManName', label: '经办人' },
				{ prop: 'memo', label: '整单备注' },
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
			haveCostPower: state => state.loginer.haveCostPower
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
			const costPower = ['sumMoney', 'sumInTaxMoney']
			if (!this.haveCostPower) {
				return this.tableColumn.filter(item => {
					return !costPower.includes(item.prop)
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
		toInStoreOrder () {
			this.$fxAppTabs.tabsPush({
				path: 'inStoreOrder'
			})
		},
		toStep1 () {
			this.$emit('toStep1')
		},
		goToBillBlank (item) {
			const id = item.id
			const type = 'InStore'
			this.$fxGoToBillBlank(type, { id }, 'detail')
		},
		sysBillCodeRender (h, { row, $index }) {
			h = this.$createElement
			return <p
				class='link fx-default-font'
				onClick={() => { this.goToBillBlank(row) }}
			>{ row.sysBillCode }</p>
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
	.tools-left {
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
