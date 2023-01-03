<template>
	<div class="organ-manage-container">
		<filterBar ref="filterBar" @on-search="getListData"></filterBar>
		<fx-list-virtual-table
			ref="listTable"
			:tableColumn="tableColumn"
			:listData="tableData"
			showIndex
			indexContinuous
			:rowClassName='rowClassName'
			:showColumnFilterBtn='false'
			:defaultSortParam="defaultSortParam"
			@on-sort-change="onSortChange"
			@on-table-row-dbclick="goToBillBlank"
			@on-page-change="onPageChange"
		>
			<div slot="btn-tools-left" class="tools-left">
				<el-button v-fx-auth:stock-sale-manage_assign-manage_out-store.lock-summary class="order-btn" type="primary" plain @click='onLockAssign'>锁定并汇总</el-button>
				<el-button v-fx-auth:stock-sale-manage_assign-manage_out-store.unlock-outstore class="order-btn" type="danger" plain @click='onUnlock'>解除锁定</el-button>
				<el-button v-fx-auth:stock-sale-manage_assign-manage_out-store.giveup-outstore class="order-btn" type="primary" plain @click='onGiveupAll'>整单放弃</el-button>
				<el-button v-fx-auth:stock-sale-manage_assign-manage_out-store.show-giveup class="order-btn" type="danger" plain @click='showGiveup'>查看放弃</el-button>
			</div>
		</fx-list-virtual-table>
		<giveUp ref='giveUp' @on-refresh='refresh'></giveUp>
	</div>
</template>
<script>
import { apiName } from '../Index.vue'
import filterBar from './FilterBar.vue'
import giveUp from './give-up/Index.vue'
import FxListStateTag from '@/components/common/Fx-list-state-tag.vue'
export default {
	name: 'listContainer',
	components: {
		filterBar,
		giveUp
	},
	data () {
		return {
			tableColumn: [
				{ prop: 'sysBillCode', label: '系统单号', width: '140px', sortable: true },
				{
					prop: 'businessDate',
					label: '订货时间',
					width: '140px',
					sortable: true,
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.businessDate)
					}
				},
				{ prop: 'organName', label: '卖方机构', sortable: true, sortKey: 'organId' },
				{ prop: 'otherOrganName', label: '买方机构', sortable: true, sortKey: 'otherOrganId' },
				{ prop: 'stockPlanName', label: '订货方案' },
				{ prop: 'billBizTypeName', label: '业务类型' },
				{
					prop: 'expectArrivalDate',
					label: '最近期望到货时间',
					sortable: true,
					width: '160px',
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.expectArrivalDate)
					}
				},
				{
					prop: 'billState',
					label: '审核状态',
					fxRender: this.billStateRender
				},
				{
					prop: 'outAssignStatus',
					label: '出库分派状态',
					fxRender: this.outAssignRender
				},
				{
					prop: 'urgent',
					label: '加急状态',
					fxRender: this.urgentRender
				},
				{ prop: 'userBillCode', label: '手工单号' },
				{
					prop: 'billTypeName',
					label: '单据类型'
				},
				{ prop: 'operateManName', label: '经办人' },
				{ prop: 'memo', label: '备注' },
				// { prop: 'tagKey', label: '标签', fxRender: this.tagKeyRender, width: '200px' },
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
			defaultSortParam: { expectArrivalDate: 'desc' }
		}
	},
	computed: {
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
		inAssignState () {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('inAssignState')(val)[key]
			}
		},
		outAssignState () {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('outAssignState')(val)[key]
			}
		},
		billTypeState () {
			return (val, key) => {
				return this.$fxTypeMiddleware.getCommonTypeItemById('billCreateType')(val)[key]
			}
		}
	},
	methods: {
		refresh (queryData = {}) {
			this.clearSelected()
			this.$refs.filterBar.initSelect()
			this.$refs.filterBar.onResetClick(queryData).then(() => {
				return this.getListData()
			})
		},
		clearSelected () {
			this.$refs.listTable.clearSelected()
		},
		getSearchParams () {
			const params = {
				...this.$refs.filterBar.getFilterParams(),
				sortParams: this.$refs.listTable.getSortKey()
			}
			return {
				...this.$refs.listTable.getPaginationParams(),
				...this.$fxCommon.getSearchParams('inStoreAssignList')(params)
			}
		},
		onSortChange () {
			return this.getListData()
		},
		onPageChange () {
			return this.getListData()
		},
		getListData () {
			const api = `${apiName}.getPage`
			return this.$fxApi(api)({ data: this.getSearchParams() }).then(res => {
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
		outAssignRender (h, { row }) {
			return <FxListStateTag
				icon={this.outAssignState(row.outAssignStatus, 'icon')}
				label={this.outAssignState(row.outAssignStatus, 'label')}
			></FxListStateTag>
		},
		urgentRender (h, { row }) {
			return <FxListStateTag
				icon={this.urgentState(row.urgent, 'icon')}
				label={this.urgentState(row.urgent, 'label')}
			></FxListStateTag>
		},
		onLockAssign () {
			this.$refs.listTable.getSelectedRows().then(res => {
				const data = res.map(item => item.id)
				const sysBillCodes = res.map(item => item.sysBillCode)
				this.$emit('nextStep', data, sysBillCodes)
			})
		},
		showGiveup () {
			this.$refs.giveUp.open()
		},
		onGiveupAll () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定将所选单据中可放弃的品项全部进行放弃分派操作？',
					selectedRowsLength: res.length
				}).then(() => {
					const path = 'giveupBills'
					const params = res.map(item => item.id)
					const logger = this.$fxLogger.createInfo('stock-sale-manage.assign-manage.out-assign.giveUpAll', { data: res })
					return this.$fxApi(`${apiName}.${path}`)({ data: params, logger }).then(res => {
						this.clearSelected()
						this.getListData()
						return Promise.resolve()
					})
				})
			})
		},
		onUnlock () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '确定对所选单据进行解锁操作？',
					selectedRowsLength: res.length
				}).then(() => {
					const data = res.map(item => {
						return item.id
					})
					const logger = this.$fxLogger.createInfo('stock-sale-manage.assign-manage.out-assign.unlock', { data: res })
					return this.$fxApi(`${apiName}.unlock`)({ data, logger }).then(res => {
						this.refresh()
						return Promise.resolve()
					})
				})
			})
		},
		rowClassName (row) {
			if (row.lockFlag) {
				return 'warning'
			}
		},
		goToBillBlank (item) {
			const id = item.id
			const type = 'SalesOrder'
			this.$fxGoToBillBlank(type, { id }, 'detail')
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
	.tools-left, .tools-right {
		display:flex
		flex-direction: row
		align-items: center
	}
	.tools-left {
		flex: 1
	}
}
>>>.warning {
	color: #ed6e31
}
</style>
