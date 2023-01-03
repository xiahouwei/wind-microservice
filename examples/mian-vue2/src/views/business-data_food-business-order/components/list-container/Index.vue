<template>
	<div class="organ-manage-container">
		<filterBar ref="filterBar" @on-search="refresh"></filterBar>
		<fx-list-virtual-table
			ref="listTable"
			:tableColumn="tableColumn"
			:listData.sync="tableData"
			:summaryData="summaryData"
			:defaultSortParam="defaultSortParam"
			:fpGetListData="getListDataHandler"
			showIndex
			showSummaryTools
			indexContinuous
			@on-page-change="onPageChange"
			@on-table-row-dbclick="onTableRowDbclick"
			@on-sort-change="onSortChange"
		>
			<div slot="btn-tools-left" class="tools-left">
				<el-button v-fx-auth:cost-manage_food-business-order.edit-bill class="order-btn" type="primary" plain @click="onEditClick">编辑</el-button>
				<el-button v-fx-auth:cost-manage_food-business-order.submit-bill class="order-btn" type="primary" plain @click="onSubmitClick">提交</el-button>
				<el-button v-fx-auth:cost-manage_food-business-order.return-bill class="order-btn" type="danger" plain @click="onReturnClick">退回</el-button>
				<el-button v-fx-auth:cost-manage_food-business-order.check-bill class="order-btn" type="primary" plain @click="onCheckClick">审核</el-button>
				<el-button v-fx-auth:cost-manage_food-business-order.uncheck-bill class="order-btn" type="danger" plain @click="onUncheckClick">反审</el-button>
				<el-button v-fx-auth:cost-manage_food-business-order.print-bill class="order-btn" type="danger" plain @click="onPrintClick">打印</el-button>
				<el-button v-fx-auth:cost-manage_food-business-order.offset-bill class="order-btn" type="primary" plain @click="onOffset">冲减</el-button>
			</div>
		</fx-list-virtual-table>
		<uncheck-order-info ref="uncheckOrderInfo" billType="BusinessOrder"></uncheck-order-info>
	</div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import filterBar from './FilterBar.vue'
import FxListStateTag from '@/components/common/Fx-list-state-tag.vue'
import uncheckOrderInfo from '@/components/common/Fx-uncheck-order-info.vue'
import { apiName } from '../../Index.vue'
export const BILL_TYPE = 'FoodBusinessOrder'
export default {
	name: 'listContainer',
	components: {
		filterBar,
		uncheckOrderInfo
	},
	data () {
		return {
			tableColumnMap: {
				sysBillCode: {
					prop: 'sysBillCode',
					label: '系统单号',
					required: true,
					sortable: true,
					width: '140px'
				},
				businessDate: {
					prop: 'businessDate',
					label: '营业时间',
					required: true,
					sortable: true,
					width: '160px',
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.businessDate)
					}
				},
				organName: { prop: 'organName', label: '营业机构', required: true, sortable: true, sortKey: 'organId' },
				salesRegionName: {
					prop: 'salesRegionName',
					label: '销售区域',
					required: true
				},
				billTypeName: { prop: 'billTypeName', label: '单据类型', required: true },
				billBizTypeName: { prop: 'billBizTypeName', label: '业务类型' },
				buyerBillState: {
					prop: 'buyerBillState',
					label: '审核状态',
					required: true,
					fxRender: this.buyerBillStateRender
				},
				offsetState: {
					prop: 'offsetState',
					label: '冲减状态',
					required: true,
					fxRender: this.offsetStateRender
				},
				salesMoney: {
					prop: 'salesMoney',
					label: '折前销售额',
					required: true,
					summary: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.salesMoney, this.sysMoneyPointSize)
					},
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				realSalesMoney: {
					prop: 'realSalesMoney',
					label: '实际销售额',
					required: true,
					summary: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.realSalesMoney, this.sysMoneyPointSize)
					},
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				dishAmount: {
					prop: 'dishAmount',
					label: '菜品总数',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.dishAmount, this.sysPointSize)
					}
				},
				dishNumber: {
					prop: 'dishNumber',
					label: '菜品种数',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.dishNumber, this.sysPointSize)
					}
				},
				dataReasource: { prop: 'sourceTypeName', label: '数据来源', required: true },
				billCode: { prop: 'userBillCode', label: '手工单号' },
				operateManName: { prop: 'operateManName', label: '经办人' },
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
			defaultSortParam: { businessDate: 'desc', sysBillCode: 'desc' },
			summaryData: {}
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize,
			sysPointSize: state => state.system.sysPointSize
		}),
		...mapGetters(['mainTableColumnVisibleGetter']),
		offsetState () {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('billOffsetState')(val)[key]
			}
		},
		buyerBillState () {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('foodBusinessBillSearchState')(val)[key]
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
			const sumCols = this.tableColumn.filter(item => !!item.summary).map(item => item.prop)
			return {
				...this.$refs.listTable.getPaginationParams(),
				...this.$fxCommon.getSearchParams('foodBusinessList')(params),
				sumMoney: sumCols
			}
		},
		getListData () {
			return this.getListDataHandler().then(res => {
				this.$refs.listTable.setPaginationTotal(res.total)
				this.tableData = res.result
				this.summaryData = res.sumMoneyMap
				return Promise.resolve(res.result)
			})
		},
		getListDataHandler () {
			return this.$fxApi(`${apiName}.getPage`)({ data: this.getSearchParams() }).then(res => {
				return Promise.resolve(res)
			})
		},
		onTableRowDbclick (item) {
			return this.$emit('on-edit', item.id)
		},
		offsetStateRender (h, { row }) {
			return <FxListStateTag
				icon={this.offsetState(row.offsetState, 'icon')}
				label={this.offsetState(row.offsetState, 'label')}
			></FxListStateTag>
		},
		buyerBillStateRender (h, { row }) {
			return <FxListStateTag
				icon={this.buyerBillState(row.billState, 'icon')}
				label={this.buyerBillState(row.billState, 'label')}
			></FxListStateTag>
		},
		onEditClick () {
			this.$refs.listTable.getSingleSelectedRow().then(res => {
				this.$refs.listTable.currentDbclickRow = res
				this.$emit('on-edit', res.id)
			})
		},
		onSubmitClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm('是否确定提交所选单据？').then(() => {
					this.onSubmitHandler(res)
				})
			})
		},
		createMulityParams (selectRows) {
			return selectRows.map(item => {
				return item.id
			})
		},
		onSubmitHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('cost-manage.food-business.submit', { orderData: selectRows })
			return this.$fxApi(`${apiName}.submitMulity`)({ data: params, logger }).then(res => {
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
			const logger = this.$fxLogger.createInfo('cost-manage.food-business.return', { orderData: selectRows })
			return this.$fxApi(`${apiName}.backMulity`)({ data: params, logger }).then(res => {
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
			const logger = this.$fxLogger.createInfo('cost-manage.food-business.check', { orderData: selectRows })
			return this.$fxApi(`${apiName}.checkMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
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
			const logger = this.$fxLogger.createInfo('cost-manage.food-business.uncheck', { orderData: selectRows })
			return this.$fxApi(`${apiName}.uncheckMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			}).catch(err => {
				if (err.code === 2) {
					const errMessage = this.$fxUtils.JSONparse(err.message) || []
					this.$refs.uncheckOrderInfo.open(errMessage)
				} else {
					return this.$fxMessage.error(err.message || '反审失败，请稍后再试')
				}
			})
		},
		onPrintClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm('是否确定打印所选单据？').then(() => {
					this.$fxGoPrint('DishBusinessBill', res.map(item => item.id))
				})
			})
		},
		onOffset () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm('是否确定冲减所选单据？').then(() => {
					this.onOffsetHandler(res)
				})
			})
		},
		onOffsetHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('cost-manage.food-business.offset', { orderData: selectRows })
			return this.$fxApi(`${apiName}.offsetMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			}).catch((err) => {
				if (err.code === 2) {
					const errMessage = this.$fxUtils.JSONparse(err.message) || []
					this.$refs.uncheckOrderInfo.open(errMessage)
				} else {
					return this.$fxMessage.error(err.message || '冲减失败，请稍后再试')
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
</style>
