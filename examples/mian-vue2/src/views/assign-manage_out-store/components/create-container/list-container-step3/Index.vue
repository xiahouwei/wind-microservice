<template>
	<div class="organ-manage-container">
		<el-tabs class="el-tabs" v-model='tabValue'>
			<el-tab-pane :label='`出库单（${this.outStoreTotal}）`' class="tabpane" name='out'>
				<div class="tools-left">
					<el-button class="order-btn" type="primary" plain @click="toOutStoreOrder">返回出库单列表</el-button>
					<el-button class="order-btn" type="danger" plain @click="toStep1">返回出库分派</el-button>
				</div>
				<fx-list-virtual-table
					ref="listTable1"
					:tableColumn="computedOutStoreTableColumn"
					:listData="outStoreTableData"
					showIndex
					indexContinuous
					:selectable='false'
					:showTools='false'
					@on-page-change="onPageChange"
				>
				</fx-list-virtual-table>
			</el-tab-pane>
			<el-tab-pane :label='`采购订单（${this.stockTotal}）`' class="tabpane" name='stock'>
				<div class="tools-left">
					<el-button class="order-btn" type="primary" plain @click="toStockOrder">返回采购订单列表</el-button>
					<el-button class="order-btn" type="danger" plain @click="toStep1">返回出库分派</el-button>
				</div>
				<fx-list-virtual-table
					ref="listTable2"
					:tableColumn="stockOrderTableColumn"
					:listData="stockOrderTableData"
					showIndex
					indexContinuous
					:selectable='false'
					:showTools='false'
					@on-page-change="onPageChange"
				>
				</fx-list-virtual-table>
			</el-tab-pane>
		</el-tabs>
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
			ids: [],
			outStoreTableColumn: [
				{ prop: 'sysBillCode', label: '系统单号', width: '160px', fxRender: this.sysBillCodeRender },
				{
					prop: 'businessDate',
					label: '出库时间',
					width: '160px',
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.businessDate)
					}
				},
				{ prop: 'organName', label: '出库方', required: true },
				{
					prop: 'buyerOrganStore',
					label: '出库仓库',
					formatter: (row) => {
						const outHouseList = row.outHouseNames
						return Array.isArray(outHouseList) ? outHouseList.join(',') : ''
					}
				},
				{ prop: 'billTypeName', label: '单据类型' },
				{ prop: 'billBizTypeName', label: '业务类型' },
				{
					prop: 'buyerBillState',
					label: '审核状态',
					required: true,
					fxRender: this.billStateRender
				},
				{
					prop: 'sumMoney',
					label: '出库成本总金额',
					required: true,
					fxRender: this.sumMoneyRender
				},
				{
					prop: 'sumSalesTaxMoney',
					label: '含税销售总金额',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.sumSalesTaxMoney, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'carriageFee',
					label: '整单运费',
					required: true
				},
				{ prop: 'otherOrganName', label: '入库方' },
				{ prop: 'userBillCode', label: '手工单号' },
				{ prop: 'operateManName', label: '经办人' },
				{ prop: 'memo', label: '整单备注' },
				{ prop: 'modifyManName', label: '最新修改人' },
				{
					prop: 'modifyDate',
					label: '最新修改时间',
					width: '140px',
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
			stockOrderTableColumn: [
				{ prop: 'sysBillCode', label: '系统单号', width: '160px', fxRender: this.sysStockBillCodeRender },
				{
					prop: 'businessDate',
					label: '订货时间',
					width: '160px'
				},
				{ prop: 'organName', label: '买方机构' },
				{ prop: 'buyerOrganStore', label: '买方仓库' },
				{ prop: 'otherOrganName', label: '卖方机构' },
				{ prop: 'stockPlan', label: '订货方案' },
				{ prop: 'billBizTypeName', label: '业务类型' },
				{
					prop: 'urgentFlag',
					label: '加急状态',
					fxRender: this.urgentRender
				},
				{
					prop: 'buyerBillState',
					label: '审核状态',
					fxRender: this.billStateRender
				},
				{ prop: 'sendFlag', label: '发单状态' },
				{ prop: 'billTypeName', label: '单据类型' },
				{ prop: 'userBillCode', label: '手工单号' },
				{ prop: 'memo', label: '备注' },
				{ prop: 'modifyManName', label: '最新修改人' },
				{
					prop: 'modifyDate',
					label: '最新修改时间',
					width: '140px',
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
			outStoreTableData: [],
			stockOrderTableData: [],
			stockTotal: 0,
			outStoreTotal: 0,
			tabValue: 'out'
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize,
			haveMoneyPower: state => state.loginer.haveMoneyPower,
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
		checkWay () {
			return (val, key) => {
				return this.$fxTypeMiddleware.getCommonTypeItemById('checkWay')(val)[key]
			}
		},
		computedOutStoreTableColumn () {
			let outStoreTableColumn = this.$fxUtils.deepClone(this.outStoreTableColumn)
			const moneyPower = ['sumSalesTaxMoney']
			const costPower = ['sumMoney']
			if (!this.haveMoneyPower) {
				outStoreTableColumn = outStoreTableColumn.filter(item => {
					return !moneyPower.includes(item.prop)
				})
			}
			if (!this.haveCostPower) {
				outStoreTableColumn = outStoreTableColumn.filter(item => {
					return !costPower.includes(item.prop)
				})
			}
			return outStoreTableColumn
		}
	},
	methods: {
		onPageChange () {
			return this.getListData()
		},
		getListData (ids) {
			if (ids) {
				this.ids = ids
			}
			const outStore = this.ids.OutStore ? {
				...this.$refs.listTable1.getPaginationParams(),
				i: {
					id: this.ids.OutStore
				}
			} : null
			const stockOrder = this.ids.StockOrder ? {
				...this.$refs.listTable2.getPaginationParams(),
				i: {
					id: this.ids.StockOrder
				}
			} : null
			const params = {
				outStore,
				stockOrder
			}
			return this.$fxApi(`${apiName}.assignedQuery`)({ data: params }).then(res => {
				if (res.outStoreResult) {
					this.outStoreTableData = res.outStoreResult.result
					this.outStoreTotal = res.outStoreResult.total
					this.$refs.listTable1.setPaginationTotal(res.outStoreResult.total)
					this.tabValue = 'out'
				} else {
					this.outStoreTableData = []
					this.outStoreTotal = 0
					this.$refs.listTable1.setPaginationTotal(0)
					this.tabValue = 'stock'
				}
				if (res.stockOrderResult) {
					this.stockOrderTableData = res.stockOrderResult.result
					this.stockTotal = res.stockOrderResult.total
					this.$refs.listTable2.setPaginationTotal(res.stockOrderResult.total)
				} else {
					this.stockOrderTableData = []
					this.stockTotal = 0
					this.$refs.listTable2.setPaginationTotal(0)
				}
				this.$forceUpdate()
				return Promise.resolve(res)
			})
		},
		checkWayRender (h, { row }) {
			return <FxListStateTag
				icon={this.checkWay(row.checkWay, 'icon')}
				label={this.checkWay(row.checkWay, 'label')}
			></FxListStateTag>
		},
		diffMoneyRender (h, { row }) {
			return <span class={['fx-list-table__cell-span', {
				'fx-default-font': row.diffMoney > 0,
				'fx-warn-font': row.diffMoney < 0
			}]}>{row.diffMoney}</span>
		},
		billStateRender (h, { row }) {
			return <FxListStateTag
				icon={this.billState(row.billState, row.recheckState, 'icon')}
				label={this.billState(row.billState, row.recheckState, 'label')}
			></FxListStateTag>
		},
		sumMoneyRender (h, { row }) {
			if (row.billTypeName === '盘盈入库') { return <span class={['fx-warn-font', 'fx-list-table__cell-span']}>{this.$fxCommon.toFixedAutoZeroFill(row.sumMoney, this.sysMoneyPointSize)}</span> } else {
				return <span>{this.$fxCommon.toFixedAutoZeroFill(row.sumMoney, this.sysMoneyPointSize)}</span>
			}
		},
		toOutStoreOrder () {
			this.$fxAppTabs.tabsPush({
				path: 'outStoreOrder'
			})
		},
		toStockOrder () {
			this.$fxAppTabs.tabsPush({
				path: 'stockOrder'
			})
		},
		toStep1 () {
			this.$emit('toStep1')
		},
		urgentRender (h, { row }) {
			return <FxListStateTag
				icon={this.urgentState(row.urgent, 'icon')}
				label={this.urgentState(row.urgent, 'label')}
			></FxListStateTag>
		},
		goToOutBillBlank (item) {
			const id = item.id
			const type = 'OutStore'
			this.$fxGoToBillBlank(type, { id }, 'detail')
		},
		goToStockBillBlank (item) {
			const id = item.id
			const type = 'StockOrder'
			this.$fxGoToBillBlank(type, { id }, 'detail')
		},
		sysBillCodeRender (h, { row, $index }) {
			h = this.$createElement
			return <p
				class='link fx-default-font'
				onClick={() => { this.goToOutBillBlank(row) }}
			>{ row.sysBillCode }</p>
		},
		sysStockBillCodeRender (h, { row, $index }) {
			h = this.$createElement
			return <p
				class='link fx-default-font'
				onClick={() => { this.goToStockBillBlank(row) }}
			>{ row.sysBillCode }</p>
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.organ-manage-container {
	flex 1
	display flex
	flex-direction: column
	overflow: auto
	.tools-left {
		display:flex
		flex-direction: row
		align-items: center
		margin-bottom 10px
	}
}
.el-tabs {
	flex 1
	display:flex
	flex-direction: column
	>>>.el-tabs__content {
		flex 1
		display:flex
	}
}
.tabpane {
	flex 1
	display:flex
	flex-direction: column
}
.link {
	text-decoration underline
	cursor pointer
}
</style>
