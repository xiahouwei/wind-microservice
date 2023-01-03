<template>
	<div class="organ-manage-container">
		<filterBar ref="filterBar" @on-search="refresh" :billStateDisabled="recycleShow"></filterBar>
		<fx-list-virtual-table
			ref="listTable"
			:tableColumn="computedColumn"
			:listData.sync="tableData"
			:fpGetListData="getListDataHandler"
			showIndex
			indexContinuous
			:defaultSortParam="defaultSortParam"
			@on-page-change="onPageChange"
			@on-table-row-dbclick="onTableRowDbclick"
			@on-sort-change="onSortChange"
		>
			<div slot="btn-tools-left" class="tools-left">
				<fx-list-btn-tools v-model="recycleShow" history :historyVisible.sync="historyVisible" @on-recycle-change="refresh" @on-history-change="refresh">
					<el-button class="order-btn" v-fx-auth:store-manage_move-order.edit-move type="primary" plain @click="onEditClick">编辑</el-button>
					<el-button class="order-btn" v-fx-auth:store-manage_move-order.delete-move type="danger" plain @click="onDeletClick">删除</el-button>
					<el-button class="order-btn" v-fx-auth:store-manage_move-order.submit-move type="primary" plain @click="onSubmitClick">提交</el-button>
					<el-button class="order-btn" v-fx-auth:store-manage_move-order.back-move type="danger" plain @click="onReturnClick">退回</el-button>
					<el-button class="order-btn" v-fx-auth:store-manage_move-order.check-move type="primary" plain @click="onCheckClick">审核</el-button>
					<el-button class="order-btn" v-fx-auth:store-manage_move-order.uncheck-move type="danger" plain @click="onUncheckClick">反审</el-button>
					<el-button class="order-btn" v-fx-auth:store-manage_move-order.recheck-move type="primary" plain @click="onRecheckClick">复审</el-button>
					<el-button class="order-btn" v-fx-auth:store-manage_move-order.unrecheck-move type="danger" plain @click="onUnrecheckClick">取消复审</el-button>
					<el-button class="order-btn" v-fx-auth:store-manage_move-order.agree-move type="primary" plain @click="onAgreeClick">同意</el-button>
					<el-button class="order-btn" v-fx-auth:store-manage_move-order.reject-move type="danger" plain @click="onRejectClick">拒绝</el-button>
					<el-button class="order-btn" v-fx-auth:store-manage_move-order.print-move type="danger" plain @click="onPrintClick">打印</el-button>
					<el-button slot="recycle" v-fx-auth:store-manage_move-order.delete-move class="order-btn" type="danger" plain @click="onRecycleDeletClick">删除</el-button>
					<el-button slot="recycle" v-fx-auth:store-manage_move-order.recover-move class="order-btn" type="primary" plain @click="onRecoverClick">恢复</el-button>
					<el-button slot="history" class="order-btn" v-fx-auth:store-manage_move-order.print-move type="danger" plain @click="onPrintClick">打印</el-button>
				</fx-list-btn-tools>
			</div>
			<div slot="btn-tools-right" class="tools-right">
				<w-popover
					placement="bottom"
					trigger="click">
					<div
						v-for="item in moveBillCreateType"
						v-fx-auth="detailsAuthGetter(`store-manage_move-order.add-${item.type}`)"
						:key="item.id"
						class="create-organ-popover"
						@click="onCreateOrganClick(item.type)"
					>
						<w-icon :type="item.icon" class="create-organ-popover__icon" ></w-icon>{{item.label}}
					</div>
					<el-button type="primary" v-fx-auth:store-manage_move-order.add-instore|add-outstore|add-inside slot="reference">新建</el-button>
				</w-popover>
			</div>
		</fx-list-virtual-table>
		<check-err-info ref="checkErrInfo"></check-err-info>
		<uncheck-order-info ref="uncheckOrderInfo" billType="MoveOrder"></uncheck-order-info>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import filterBar from './FilterBar.vue'
import FxListStateTag from '@/components/common/Fx-list-state-tag.vue'
import checkErrInfo from '@/components/common/Fx-check-err-info.vue'
import uncheckOrderInfo from '@/components/common/Fx-uncheck-order-info.vue'
import { apiName } from '../../Index.vue'
export const BILL_TYPE = 'MoveOrder'
export default {
	name: 'listContainer',
	components: {
		filterBar,
		checkErrInfo,
		uncheckOrderInfo
	},
	data () {
		return {
			tableColumnMap: {
				sysBillCode: { prop: 'sysBillCode', label: '系统单号', required: true, sortable: true, width: '140px' },
				businessDate: {
					prop: 'businessDate',
					label: '调拨时间',
					required: true,
					sortable: true,
					width: '160px',
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.businessDate)
					}
				},
				organName: { prop: 'organName', label: '入库方', required: true, sortable: true, sortKey: 'organId' },
				inHouseNames: {
					prop: 'inHouseNames',
					label: '入库仓库',
					required: true,
					formatter: row => {
						return (row.inHouseNames || []).join(',')
					}
				},
				otherOrganName: { prop: 'otherOrganName', label: '出库方', required: true, sortable: true, sortKey: 'otherOrganId' },
				outHouseNames: {
					prop: 'outHouseNames',
					label: '出库仓库',
					required: true,
					formatter: row => {
						return (row.outHouseNames || []).join(',')
					}
				},
				billTypeName: {
					prop: 'billTypeName',
					label: '单据类型',
					required: true,
					sortable: true,
					sortKey: 'billType'
				},
				billBizTypeName: { prop: 'billBizTypeName', label: '业务类型', required: true },
				detailAmount: { prop: 'detailAmount', label: '明细数' },
				buyerBillState: {
					prop: 'buyerBillState',
					label: '审核状态',
					required: true,
					fxRender: this.billStateRender
				},
				moveState: {
					prop: 'moveState',
					label: '同意状态',
					required: true,
					fxRender: this.moveStateRender
				},
				userBillCodeList: { prop: 'userBillCode', label: '手工单号', sortable: true },
				operateManName: { prop: 'operateManName', label: '经办人' },
				memoList: { prop: 'memo', label: '备注' },
				printState: {
					prop: 'isPrint',
					label: '打印状态',
					fxRender: this.printStateRender
				},
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
				createManName: { prop: 'createManName', label: '创建人', sortable: true, sortKey: 'createMan' },
				createDate: {
					prop: 'createDate',
					label: '创建时间',
					width: '140px',
					sortable: true,
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.createDate)
					}
				}
			},
			tableColumn: [],
			tableData: [],
			recycleShow: false,
			moveBillCreateType: this.$fxTypeMiddleware.getCommonTypeList('moveBillCreateType'),
			defaultSortParam: { businessDate: 'desc', sysBillCode: 'desc' },
			historyVisible: false
		}
	},
	computed: {
		billState () {
			return (billState, recheckState, key) => {
				return this.$fxStateMiddleware.getOrderStateById(billState, recheckState)[key]
			}
		},
		moveState () {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('moveState')(val)[key]
			}
		},
		printState () {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('printState')(val)[key]
			}
		},
		...mapGetters(['mainTableColumnVisibleGetter', 'detailsAuthGetter']),
		computedColumn () {
			if (this.recycleShow) {
				return this.tableColumn.filter(item => {
					return item.prop !== 'buyerBillState'
				})
			} else {
				return this.tableColumn
			}
		}
	},
	methods: {
		initTableColumn () {
			return new Promise(resolve => {
				this.tableColumn = []
				const tableColumn = this.mainTableColumnVisibleGetter(BILL_TYPE)(this.tableColumnMap)
				this.$nextTick(() => {
					this.tableColumn = tableColumn
					resolve()
				})
			})
		},
		initFilterBar (routeQuery) {
			this.$refs.filterBar.initFilter()
			this.$refs.filterBar.initSelect()
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
				sortParams: this.$refs.listTable.getSortKey(),
				history: this.historyVisible
			}
			return {
				...this.$refs.listTable.getPaginationParams(),
				...this.$fxCommon.getSearchParams('moveList')(params)
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
			let api = ''
			if (this.recycleShow) {
				api = `${apiName}.getPageRecycling`
			} else {
				api = `${apiName}.getPage`
			}
			return this.$fxApi(api)({ data: this.getSearchParams() }).then(res => {
				return Promise.resolve(res)
			})
		},
		onCreateOrganClick (moveBillCreateType) {
			this.$emit('on-create', moveBillCreateType)
		},
		createMulityParams (selectRows) {
			const outMoveApplyIds = selectRows.filter(item => {
				return item.billType === '3001'
			}).map(item => {
				return item.id
			})
			const inMoveApplyIds = selectRows.filter(item => {
				return item.billType === '3002'
			}).map(item => {
				return item.id
			})
			const pickMoveApplyIds = selectRows.filter(item => {
				return item.billType === '3003'
			}).map(item => {
				return item.id
			})
			return {
				outMoveApplyIds,
				inMoveApplyIds,
				pickMoveApplyIds
			}
		},
		onDeletClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定删除所选单据？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onDeleteHandler(res)
				})
			})
		},
		onDeleteHandler (selectRows) {
			const params = selectRows.map(item => {
				return item.id
			})
			const logger = this.$fxLogger.createInfo('store-manage.move-order.delete', { orderData: selectRows })
			return this.$fxApi(`${apiName}.deleteMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh', true)
				return Promise.resolve()
			})
		},
		onRecycleDeletClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定删除所选单据？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onRecycleDeleteHandler(res)
				})
			})
		},
		onRecycleDeleteHandler (selectRows) {
			const params = selectRows.map(item => {
				return item.id
			})
			const logger = this.$fxLogger.createInfo('store-manage.move-order.recyclingDelete', { orderData: selectRows })
			return this.$fxApi(`${apiName}.recyclingDeleteMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh', true)
				return Promise.resolve()
			})
		},
		onSubmitClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定提交所选单据？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onSubmitHandler(res)
				})
			})
		},
		onSubmitHandler (selectRows) {
			const params = selectRows.map(item => {
				return item.id
			})
			const logger = this.$fxLogger.createInfo('store-manage.move-order.submit', { orderData: selectRows })
			return this.$fxApi(`${apiName}.submitMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onReturnClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定退回所选单据？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onReturnHandler(res)
				})
			})
		},
		onReturnHandler (selectRows) {
			const params = selectRows.map(item => {
				return item.id
			})
			const logger = this.$fxLogger.createInfo('store-manage.move-order.return', { orderData: selectRows })
			return this.$fxApi(`${apiName}.returnMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onCheckClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定审核所选单据？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onCheckHandler(res)
				})
			})
		},
		onCheckHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('store-manage.move-order.check', { orderData: selectRows })
			return this.$fxApi(`${apiName}.checkMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			}).catch(err => {
				if (err.code === 1) {
					const errMessage = this.$fxUtils.JSONparse(err.message) || []
					this.$refs.checkErrInfo.open(errMessage)
				} else	if (err.code === 3) {
					const errMessage = this.$fxUtils.JSONparse(err.message) || []
					this.$refs.uncheckOrderInfo.open(errMessage)
				} else {
					return this.$fxMessage.error(err.message || '审核失败，请稍后再试')
				}
			})
		},
		onUncheckClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定反审所选单据？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onUncheckHandler(res)
				})
			})
		},
		onUncheckHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('store-manage.move-order.uncheck', { orderData: selectRows })
			return this.$fxApi(`${apiName}.uncheckMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			}).catch(err => {
				if (err.code === 1) {
					const errMessage = this.$fxUtils.JSONparse(err.message) || []
					this.$refs.checkErrInfo.open(errMessage)
				} else if (err.code === 3) {
					const errMessage = this.$fxUtils.JSONparse(err.message) || []
					this.$refs.uncheckOrderInfo.open(errMessage)
				} else {
					return this.$fxMessage.error(err.message)
				}
			})
		},
		onRecheckClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定复审所选单据？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onRecheckHandler(res)
				})
			})
		},
		onRecheckHandler (selectRows) {
			const params = selectRows.map(item => {
				return item.id
			})
			const logger = this.$fxLogger.createInfo('store-manage.move-order.recheck', { orderData: selectRows })
			return this.$fxApi(`${apiName}.recheckMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onUnrecheckClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定取消复审所选单据？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onUnrecheckHandler(res)
				})
			})
		},
		onUnrecheckHandler (selectRows) {
			const params = selectRows.map(item => {
				return item.id
			})
			const logger = this.$fxLogger.createInfo('store-manage.move-order.unrecheck', { orderData: selectRows })
			return this.$fxApi(`${apiName}.unrecheckMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onRecoverClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定恢复所选单据？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onRecoverHandler(res)
				})
			})
		},
		onRecoverHandler (selectRows) {
			const params = selectRows.map(item => {
				return item.id
			})
			const logger = this.$fxLogger.createInfo('store-manage.move-order.recover', { orderData: selectRows })
			return this.$fxApi(`${apiName}.recoverMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh', true)
				return Promise.resolve()
			})
		},
		onEditClick () {
			this.$refs.listTable.getSingleSelectedRow().then(res => {
				this.$emit('on-edit', res.id)
				return Promise.resolve()
			})
		},
		onTableRowDbclick (item) {
			this.$emit('on-edit', item.id)
		},
		billStateRender (h, { row }) {
			return <FxListStateTag
				icon={this.billState(row.billState, row.recheckState, 'icon')}
				label={this.billState(row.billState, row.recheckState, 'label')}
			></FxListStateTag>
		},
		moveStateRender (h, { row }) {
			return <FxListStateTag
				icon={this.moveState(row.moveState, 'icon')}
				label={this.moveState(row.moveState, 'label')}
			></FxListStateTag>
		},
		printStateRender (h, { row }) {
			return <FxListStateTag
				icon={this.printState(row.isPrint, 'icon')}
				label={this.printState(row.isPrint, 'label')}
			></FxListStateTag>
		},
		onAgreeClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定同意所选单据？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onAgreeHandler(res)
				})
			})
		},
		onAgreeHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('store-manage.move-order.agree', { orderData: selectRows })
			return this.$fxApi(`${apiName}.agreeMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			}).catch(err => {
				if (err.code === 1) {
					const writteInfo = {
						title: '出库仓库品项库存不足',
						warnFont: '注：以下明细中，出库方库存不足，无法自动执行调拨流程并审核相关单据'
					}
					const errMessage = this.$fxUtils.JSONparse(err.message) || []
					this.$refs.checkErrInfo.open(errMessage, writteInfo)
				} else {
					return this.$fxMessage.error(err.message || '操作失败，请稍后再试')
				}
			})
		},
		onRejectClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定拒绝所选单据？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onRejectHandler(res)
				})
			})
		},
		onRejectHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('store-manage.move-order.reject', { orderData: selectRows })
			return this.$fxApi(`${apiName}.rejectMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onPrintClick () {
			this.$refs.listTable.getSelectedRows().then(this.checkPrintBillType).then(res => {
				this.$fxConfirm({
					message: '是否确定打印所选单据？',
					selectedRowsLength: res.length
				}).then(() => {
					const billType = res[0].billTypeName === '领用申请' ? 'ReceivingApply' : 'MoveApply'
					this.$fxGoPrint(billType, res.map(item => item.id))
				})
			})
		},
		checkPrintBillType (rows) {
			return new Promise(resolve => {
				if (this.$fxUtils.arrDedup(rows.map(item => item.billType)).length > 1) {
					this.$fxMessage.warning('请选择同一类型单据进行打印!')
				} else {
					resolve(rows)
				}
			})
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
.create-organ-popover {
	font-size: 12px
	height: 24px;
	line-height: 24px;
	display: flex;
	align-items: center;
	cursor: pointer
	&:hover {
		color: $fxDefaultColor
	}
	&__icon {
		margin-right: 10px
	}
}
</style>
