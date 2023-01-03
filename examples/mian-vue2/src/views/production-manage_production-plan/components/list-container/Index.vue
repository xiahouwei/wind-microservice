<template>
	<div class="organ-manage-container">
		<filterBar ref="filterBar" @on-search="getListData" :billStateDisabled='recycleShow'></filterBar>
		<fx-list-virtual-table
			ref="listTable"
			:tableColumn="computedColumn"
			:listData.sync="tableData"
			:defaultSortParam="defaultSortParam"
			:fpGetListData="getListDataHandler"
			showIndex
			indexContinuous
			@on-page-change="onPageChange"
			@on-table-row-dbclick="onTableRowDbclick"
			@on-sort-change="onSortChange"
		>
			<div slot="btn-tools-left" class="tools-left">
				<fx-list-btn-tools v-model="recycleShow" :historyVisible.sync="historyVisible" @on-recycle-change="refresh" @on-history-change="refresh">
					<el-button v-fx-auth:production-manage_production-plan.edit-productionPlan class="order-btn" type="primary" plain @click="onEditClick">编辑</el-button>
					<el-button v-fx-auth:production-manage_production-plan.delete-productionPlan class="order-btn" type="danger" plain @click="onDeletClick">删除</el-button>
					<el-button v-fx-auth:production-manage_production-plan.submit-productionPlan class="order-btn" type="primary" plain @click="onSubmitClick">提交</el-button>
					<el-button v-fx-auth:production-manage_production-plan.back-productionPlan class="order-btn" type="danger" plain @click="onReturnClick">退回</el-button>
					<el-button v-fx-auth:production-manage_production-plan.check-productionPlan class="order-btn" type="primary" plain @click="onCheckClick">审核</el-button>
					<el-button v-fx-auth:production-manage_production-plan.uncheck-productionPlan class="order-btn" type="danger" plain @click="onUncheckClick">反审</el-button>
					<el-button v-fx-auth:production-manage_production-plan.create-pickingBill class="order-btn" type="primary" plain @click="onCreatePickingBillClick">生成领料单</el-button>
					<el-button v-fx-auth:production-manage_production-plan.create-machiningBill class="order-btn" type="primary" plain @click="onCreateMachiningOrderClick">生成加工单</el-button>
					<el-button class="order-btn" type="primary" plain @click="onCreateProcedureTaskBillClick">生成工序任务</el-button>
					<el-button v-fx-auth:production-manage_production-plan.delete-productionPlan slot="recycle" class="order-btn" type="danger" plain @click="onRemoveClick">删除</el-button>
					<el-button v-fx-auth:production-manage_production-plan.recover-productionPlan slot="recycle" class="order-btn" type="primary" plain @click="onRecoverClick">恢复</el-button>
				</fx-list-btn-tools>
			</div>
			<div slot="btn-tools-right" class="tools-right">
				<el-button type="primary" v-fx-auth:production-manage_production-plan.add-productionPlan @click="onCreateClick">新建</el-button>
			</div>
		</fx-list-virtual-table>
		<check-err-info ref="checkErrInfo"></check-err-info>
	</div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import filterBar from './FilterBar.vue'
import FxListStateTag from '@/components/common/Fx-list-state-tag.vue'
import checkErrInfo from '@/components/common/Fx-check-err-info.vue'
export const BILL_TYPE = 'ProductionPlan'
export default {
	name: 'listContainer',
	components: {
		filterBar,
		checkErrInfo
	},
	data () {
		return {
			tableColumnMap: {
				sysBillCode: {
					prop: 'sysBillCode',
					label: '系统单号',
					required: true,
					sortable: true,
					width: '140px',
					fxRender: this.sysBillCodeRender
				},
				businessDate: {
					prop: 'businessDate',
					label: '生产计划日期',
					required: true,
					sortable: true,
					width: '160px',
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.businessDate)
					}
				},
				organName: {
					prop: 'organName',
					label: '生产机构',
					required: true,
					sortable: true,
					sortKey: 'organId'
				},
				buyerBillState: {
					prop: 'buyerBillState',
					label: '审核状态',
					required: true,
					fxRender: this.billStateRender
				},
				detailAmount: { prop: 'detailAmount', label: '明细数' },
				progress: { prop: 'processingProgress', label: '生产进度', fxRender: this.processingPercentRender },
				createPickingFlag: { prop: 'createPickingFlag', label: '是否生成领料单', formatter: this.pickingFlagmatter },
				createMachiningFlag: { prop: 'createMachiningFlag', label: '是否生成加工单', formatter: this.machiningFlagmatter },
				createProcedureTaskFlag: { prop: 'createProcedureTaskFlag', label: '是否生成工序任务', formatter: this.taskFlagmatter },
				pickState: { prop: 'pickState', label: '领用状态', formatter: this.pickStateFlagmatter },
				userBillCodeList: { prop: 'userBillCode', label: '手工单号' },
				operateManName: { prop: 'operateManName', label: '经办人' },
				memoList: { prop: 'memo', label: '备注' },
				modifyManName: {
					prop: 'modifyManName',
					label: '最新修改人',
					sortable: true,
					sortKey: 'modifyMan'
				},
				modifyDate: {
					prop: 'modifyDate',
					label: '最新修改时间',
					width: '140px',
					sortable: true,
					sortKey: 'modifyDate',
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.modifyDate)
					}
				},
				createManName: { prop: 'createManName', label: '创建人', sortKey: 'createMan' },
				createDate: {
					prop: 'createDate',
					label: '创建时间',
					width: '140px',
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.createDate)
					}
				}
			},
			tableColumn: [],
			tableData: [],
			recycleShow: false,
			defaultSortParam: { businessDate: 'desc', sysBillCode: 'desc' },
			historyVisible: false
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize,
			haveCostPower: state => state.loginer.haveCostPower,
			organId: state => state.loginer.organId
		}),
		...mapGetters(['mainTableColumnVisibleGetter', 'isProductionPro']),
		billState (val, key) {
			return (billState, recheckState, key) => {
				return this.$fxStateMiddleware.getOrderStateById(billState, recheckState)[key]
			}
		},
		computedColumn () {
			return this.tableColumn
		}
	},
	methods: {
		initTableColumn () {
			return new Promise(resolve => {
				this.tableColumn = []
				let tableColumn = this.mainTableColumnVisibleGetter(BILL_TYPE)(this.tableColumnMap)
				if (!this.isProductionPro()) {
					const costPower = ['createProcedureTaskFlag']
					tableColumn = tableColumn.filter(item => {
						return !costPower.includes(item.prop)
					})
				}
				this.$nextTick(() => {
					this.tableColumn = tableColumn
					resolve()
				})
			})
		},
		initFilterBar (routeQuery) {
			this.$refs.filterBar.initFilter()
			this.$refs.filterBar.getSelectData()
			return this.$refs.filterBar.getAccountingPeriod(routeQuery)
		},
		refresh () {
			this.$refs.listTable.setPaginationCurrent(1)
			this.$refs.listTable.clearSelected()
			return this.getListData()
		},
		clearSelected () {
			this.$refs.listTable.clearSelected()
		},
		onPageChange () {
			return this.getListData()
		},
		onSortChange () {
			return this.getListData()
		},
		getSearchParams () {
			const params = {
				...this.$refs.filterBar.getFilterParams(),
				sortParams: this.$refs.listTable.getSortKey()
			}
			return {
				...this.$refs.listTable.getPaginationParams(),
				...this.$fxCommon.getSearchParams('productionPlan')(params)
			}
		},
		getListData () {
			return this.getListDataHandler().then(res => {
				this.$refs.listTable.setPaginationTotal(res.total)
				this.tableData = res.result
				return Promise.resolve(res.result)
			})
		},
		getListDataHandler () {
			const api = this.recycleShow ? 'productionPlan.getDelPage' : 'productionPlan.getPage'
			return this.$fxApi(api)({ data: this.getSearchParams() }).then(res => {
				return Promise.resolve(res)
			})
		},
		onCreateClick () {
			this.$emit('on-create')
		},
		createMulityParams (selectRows) {
			return selectRows.map(item => {
				return item.id
			})
		},
		onDeletClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm('是否确定删除所选单据？').then(() => {
					this.onDeleteHandler(res)
				})
			})
		},
		onDeleteHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('production-manage.production-plan.delete', { orderData: selectRows })
			return this.$fxApi('productionPlan.deleteMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh', true)
				return Promise.resolve()
			})
		},
		getOrderCode (list) {
			return list.map(item => {
				return item.sysBillCode
			}).join(',')
		},
		onSubmitClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm('是否确定提交所选单据？').then(() => {
					this.onSubmitHandler(res)
				})
			})
		},
		onSubmitHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('production-manage.production-plan.submit', { orderData: selectRows })
			return this.$fxApi('productionPlan.submitMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onReturnClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm('是否确定退回所选单据？').then(() => {
					this.onReturnHandler(res)
				})
			})
		},
		onReturnHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('production-manage.production-plan.return', { orderData: selectRows })
			return this.$fxApi('productionPlan.returnMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onCheckClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm('是否确定审核所选单据？').then(() => {
					this.onCheckHandler(res)
				})
			})
		},
		onCheckHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('production-manage.production-plan.check', { orderData: selectRows })
			return this.$fxApi('productionPlan.checkMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			}).catch(err => {
				if (err.code === 1) {
					const errMessage = this.$fxUtils.JSONparse(err.message) || []
					this.$refs.checkErrInfo.open(errMessage)
				} else if (err.code === 2) {
					const errMessage = this.$fxUtils.JSONparse(err.message) || []
					this.$refs.uncheckOrderInfo.open(errMessage)
				} else {
					return this.$fxMessage.error(err.message || '审核失败，请稍后再试')
				}
			})
		},
		onUncheckClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm('是否确定反审所选单据？').then(() => {
					this.onUncheckHandler(res)
				})
			})
		},
		onUncheckHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('production-manage.production-plan.uncheck', { orderData: selectRows })
			return this.$fxApi('productionPlan.uncheckMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			}).catch(err => {
				if (err.code === 1) {
					const errMessage = this.$fxUtils.JSONparse(err.message) || []
					this.$refs.checkErrInfo.open(errMessage)
				} else if (err.code === 2) {
					const errMessage = this.$fxUtils.JSONparse(err.message) || []
					this.$refs.uncheckOrderInfo.open(errMessage)
				} else {
					return this.$fxMessage.error(err.message || '反审失败，请稍后再试')
				}
			})
		},
		onRecheckClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm('是否确定复审所选单据？').then(() => {
					this.onRecheckHandler(res)
				})
			})
		},
		onRecheckHandler (selectRows) {
			const params = selectRows.map(item => {
				return item.id
			})
			const logger = this.$fxLogger.createInfo('production-manage.production-plan.recheck', { orderData: selectRows })
			return this.$fxApi('inStore.recheckMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onUnrecheckClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm('是否确定取消复审所选单据？').then(() => {
					this.onUnrecheckHandler(res)
				})
			})
		},
		onUnrecheckHandler (selectRows) {
			const params = selectRows.map(item => {
				return item.id
			})
			const logger = this.$fxLogger.createInfo('production-manage.production-plan.unrecheck', { orderData: selectRows })
			return this.$fxApi('inStore.unrecheckMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onCreatePickingBillClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm('是否确定生成领料单？').then(() => {
					this.onCreatePickingBillHandler(res)
				})
			})
		},
		onCreatePickingBillHandler (selectRows) {
			const params = selectRows.map(item => {
				return item.id
			})
			const logger = this.$fxLogger.createInfo('production-manage.production-plan.createPickingList', { orderData: selectRows })
			return this.$fxApi('productionPlan.createPick')({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onCreateMachiningOrderClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm('是否确定生成加工单？').then(() => {
					this.onCreateMachiningOrderHandler(res)
				})
			})
		},
		onCreateMachiningOrderHandler (selectRows) {
			const params = selectRows.map(item => {
				return item.id
			})
			const logger = this.$fxLogger.createInfo('production-manage.production-plan.createMachiningOrder', { orderData: selectRows })
			return this.$fxApi('productionPlan.createMachineCompose')({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onCreateProcedureTaskBillClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm('是否确定生成工序任务？').then(() => {
					this.onCreateProcedureTaskBillHandler(res)
				})
			})
		},
		onCreateProcedureTaskBillHandler (selectRows) {
			const params = selectRows.map(item => {
				return item.id
			})
			const logger = this.$fxLogger.createInfo('production-manage.production-plan.createProcedureTask', { orderData: selectRows })
			// 生成工序任务
			return this.$fxApi('productionPlan.createProcedureTask')({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onEditClick () {
			this.$refs.listTable.getSingleSelectedRow().then(res => {
				this.$emit('on-edit', res.id)
			})
		},
		onTableRowDbclick (item) {
			return this.$emit('on-edit', item.id)
		},
		billStateRender (h, { row }) {
			return <FxListStateTag
				icon={this.billState(row.billState, row.recheckState, 'icon')}
				label={this.billState(row.billState, row.recheckState, 'label')}
			></FxListStateTag>
		},
		onRecoverClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm('是否确定恢复所选单据？').then(() => {
					this.onRecoverHandler(res)
				})
			})
		},
		onRecoverHandler (selectRows) {
			const params = selectRows.map(item => {
				return item.id
			})
			const logger = this.$fxLogger.createInfo('production-manage.production-plan.recover', { orderData: selectRows })
			return this.$fxApi('productionPlan.recoverMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh', true)
				return Promise.resolve()
			})
		},
		onRemoveClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm('是否确定删除所选单据？').then(() => {
					this.onRemoveHandler(res)
				})
			})
		},
		onRemoveHandler (selectRows) {
			const params = selectRows.map(item => {
				return item.id
			})
			const logger = this.$fxLogger.createInfo('production-manage.production-plan.recyclingDelete', { orderData: selectRows })
			return this.$fxApi('productionPlan.recyclingDeleteMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh', true)
				return Promise.resolve()
			})
		},
		onPrintClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm('是否确定打印所选单据？').then(() => {
					this.$fxGoPrint('InStore', res.map(item => item.id))
				})
			})
		},
		billClass (row) {
			switch (row.billSign) {
			case 1:
				return 'fx-default-font'
			case 2:
				return 'fx-warn-font'
			default:
				return ''
			}
		},
		sysBillCodeRender (h, { row }) {
			return <span class={['fx-list-table__cell-span', this.billClass(row)]}>{row.sysBillCode}</span>
		},
		billTypeNameRender (h, { row }) {
			return <span class={['fx-list-table__cell-span', this.billClass(row)]}>{row.billTypeName}</span>
		},
		machiningFlagmatter (row) {
			return row.createMachiningFlag ? '是' : '否'
		},
		pickingFlagmatter (row) {
			return row.createPickingFlag ? '是' : '否'
		},
		taskFlagmatter (row) {
			return row.createProcedureTaskFlag ? '是' : '否'
		},
		pickStateFlagmatter (row) {
			return row.pickState ? '已领用' : '未领用'
		},
		processingPercentRender (h, { row }) {
			return <el-progress percentage={row.processingProgress || 0}
			></el-progress>
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.organ-manage-container {
	flex: 1;
	display:flex
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
</style>
