<template>
	<div class="order-manage-container">
		<filterBar ref="filterBar" @on-search="refreshPageData"></filterBar>
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
				<fx-list-btn-tools :recycle="false">
					<!-- <fx-button class="order-btn" v-fx-auth:store-manage_in-store-order.edit-instore type="primary" plain @click="onEditClick">编辑</fx-button> -->
					<fx-button class="order-btn" v-fx-auth:store-manage_in-store-order.delete-instore type="danger" plain @click="onDeletClick">删除</fx-button>
					<fx-button class="order-btn" v-fx-auth:store-manage_in-store-order.uncheck-instore type="danger" plain @click="onUnverificationClick">反核销</fx-button>
				</fx-list-btn-tools>
			</div>
			<div slot="btn-tools-right" class="tools-right">
				<fx-button v-fx-auth:store-manage_in-store-order.add-instore type="primary" @click="onCreateClick">新建</fx-button>
			</div>
		</fx-list-virtual-table>
	</div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import filterBar from './FilterBar.vue'
import { apiName } from '../../Index.vue'
export const BILL_TYPE = 'VerificationOrder'
export default {
	name: 'listContainer',
	components: {
		filterBar
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
					label: '业务时间',
					required: true,
					sortable: true,
					width: '160px',
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.businessDate)
					}
				},
				billTypeName: {
					prop: 'billTypeName',
					label: '单据类型',
					required: true,
					sortable: true,
					sortKey: 'billType'
				},
				writeOffWay: {
					prop: 'writeOffWay',
					label: '核销方式',
					equired: true,
					formatter: (row) => {
						return this.getWriteOffWay(row.writeOffWay)
					}
				},
				billState: {
					prop: 'billState',
					label: '单据状态',
					required: true,
					fxRender: this.billStateRender
				},
				organName: {
					prop: 'organName',
					label: '付款机构',
					required: true,
					sortable: true,
					sortKey: 'organId'
				},
				otherOrganName: {
					prop: 'otherOrganName',
					label: '收款机构',
					required: true,
					sortable: true,
					sortKey: 'otherOrganId'
				},
				departmentName: {
					prop: 'departmentName',
					label: '核算部门',
					required: true
				},
				writeOffMoney: {
					prop: 'writeOffMoney',
					label: '本次核销金额',
					required: true,
					summary: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.writeOffMoney, this.sysMoneyPointSize)
					},
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				writeOffMan: { prop: 'writeOffManName', label: '核销人' },
				modifyDate: {
					prop: 'modifyDate',
					label: '最新修改时间',
					width: '140px',
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.modifyDate)
					}
				}
			},
			tableColumn: [],
			tableData: [],
			defaultSortParam: { businessDate: 'desc', sysBillCode: 'desc' },
			summaryData: {}
		}
	},
	props: {
		tableQueueUtils: null
	},
	created () {
		this.initTableColumn()
		this.tableQueueUtils.init(this, {
			listRefName: 'listTable',
			billChange: this.onTableRowDbclick
		})
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize
		}),
		...mapGetters(['mainTableColumnVisibleGetter']),
		billState () {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('verificationOrderState')(val)[key]
			}
		},
		getWriteOffWay () {
			return (val) => {
				const writeOffWay = this.$fxStateMiddleware.getStateConfig('verificationWay').find(item => {
					return item.id === val
				})
				return writeOffWay.label
			}
		}
	},
	methods: {
		initTableColumn () {
			this.tableColumn = this.mainTableColumnVisibleGetter(BILL_TYPE)(this.tableColumnMap)
		},
		refresh () {
			this.$refs.filterBar.getSelectData()
			this.refreshPageData()
		},
		refreshPageData () {
			this.$refs.listTable.setPaginationCurrent(1)
			this.$refs.listTable.clearSelected()
			this.getListData()
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
				...this.$fxCommon.getSearchParams('verificationOrderList')(params),
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
		createMulityParams (selectRows) {
			return selectRows.map(item => {
				return item.id
			})
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
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.verification-order.delete', { orderData: selectRows })
			return this.$fxApi(`${apiName}.deleteMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh', true)
				return Promise.resolve()
			})
		},
		onUnverificationClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否反核销所选单据？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onUnverificationHandler(res)
				})
			})
		},
		onUnverificationHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.verification-order.uncheck', { orderData: selectRows })
			return this.$fxApi(`${apiName}.unverificationMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onEditClick () {
			this.$refs.listTable.getSingleSelectedRow().then(res => {
				const selected = this.$refs.listTable.isSelected(res)
				this.tableQueueUtils.setChecked(selected)
				this.$refs.listTable.currentDbclickRow = res
				this.$emit('on-edit', res.id)
			})
		},
		onTableRowDbclick (item, showBillQueue) {
			const selected = this.$refs.listTable.isSelected(item)
			this.tableQueueUtils.setChecked(selected)
			return this.$emit('on-edit', item.id, showBillQueue)
		},
		onTableRowDbclickOriginal (item) {
			this.onTableRowDbclick(item, false)
		},
		billStateRender (h, { row }) {
			return <fx-list-state-tag
				icon={this.billState(row.billState, 'icon')}
				label={this.billState(row.billState, 'label')}
			></fx-list-state-tag>
		},
		onCreateClick () {
			this.$emit('on-create')
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.order-manage-container {
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
