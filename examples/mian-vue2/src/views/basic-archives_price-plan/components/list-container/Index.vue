<template>
	<div class="organ-manage-container">
		<filterBar ref="filterBar" @on-search="refresh" :billStateDisabled="recycleShow"></filterBar>
		<fx-list-virtual-table
			ref="listTable"
			:tableColumn="tableColumn"
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
				<fx-list-btn-tools v-model="recycleShow" @on-recycle-change="refresh">
					<el-button v-fx-auth:basic-archives_price-plan.edit-price class="order-btn" type="primary" plain @click="onEditClick">编辑</el-button>
					<el-button v-fx-auth:basic-archives_price-plan.delete-price class="order-btn" type="danger" plain @click="onDeletClick">删除</el-button>
					<el-button v-fx-auth:basic-archives_price-plan.enable-price class="order-btn" type="primary" plain @click="onEnableClick">启用</el-button>
					<el-button v-fx-auth:basic-archives_price-plan.disable-price class="order-btn" type="danger" plain @click="onDisableClick">停用</el-button>
					<el-button v-fx-auth:basic-archives_price-plan.check-price class="order-btn" type="primary" plain @click="onCheckClick">审核</el-button>
					<el-button v-fx-auth:basic-archives_price-plan.uncheck-price class="order-btn" type="danger" plain @click="onUncheckClick">反审</el-button>
					<el-button v-fx-auth:basic-archives_price-plan.recover-price slot="recycle" class="order-btn" type="primary" plain @click="onRecoverClick">恢复</el-button>
					<el-button v-fx-auth:basic-archives_price-plan.delete-price slot="recycle" class="order-btn" type="danger" plain @click="onRecycleDeletClick">删除</el-button>
				</fx-list-btn-tools>
			</div>
			<div slot="btn-tools-right" class="tools-right">
				<el-button v-fx-auth:basic-archives_price-plan.add-price type="primary" slot="reference" @click="onCreateClick">新建</el-button>
				<el-button type="primary" slot="reference" @click="onSearchPriceClick">查询价格</el-button>
			</div>
		</fx-list-virtual-table>
	</div>
</template>
<script>
import filterBar from './FilterBar.vue'
import FxListStateTag from '@/components/common/Fx-list-state-tag.vue'
export default {
	name: 'listContainer',
	components: {
		filterBar
	},
	data () {
		return {
			tableColumn: [
				{ prop: 'code', label: '方案编号', required: true, sortable: true, width: '140px' },
				{ prop: 'name', label: '方案名称', required: true, sortable: true },
				{
					prop: 'sellerOrganName',
					label: '卖方机构',
					required: true,
					formatter: (row) => {
						return row.sellerOrganNames && row.sellerOrganNames.join(',')
					}
				},
				{
					prop: 'buyerOrganName',
					label: '买方机构',
					required: true,
					formatter: (row) => {
						return row.buyerOrganList.map(item => {
							return item.organName
						}).join(',')
					}
				},
				{ prop: 'beginDate', label: '起始日期', sortable: true },
				{ prop: 'endDate', label: '截止日期', sortable: true },
				{
					prop: 'billState',
					label: '审核状态',
					required: true,
					fxRender: this.billStateRender
				},
				{
					prop: 'enableFlag',
					label: '启停状态',
					required: true,
					fxRender: this.enableRender
				},
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
			tableData: [],
			recycleShow: false,
			defaultSortParam: { code: 'desc' }
		}
	},
	computed: {
		enableState () {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('enableState')(val)[key]
			}
		},
		billState () {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('planState')(val)[key]
			}
		}
	},
	methods: {
		initFilterBar () {
			this.$refs.filterBar.onResetClick()
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
				delFlag: this.recycleShow ? 1 : 0
			}
			params.billState = this.recycleShow ? '' : params.billState
			return {
				...this.$refs.listTable.getPaginationParams(),
				...this.$fxCommon.getSearchParams('planPriceList')(params)
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
			return this.$fxApi('planPrice.getPage')({ data: this.getSearchParams() }).then(res => {
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
		getPlanName (list) {
			return list.map(item => {
				return item.name
			}).join(',')
		},
		onEnableClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定启用所选方案？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onEnableHandler(res)
				})
			})
		},
		onEnableHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.price-plan.enable', { names: this.getPlanName(selectRows) })
			return this.$fxApi('planPrice.enabelMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onDisableClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定停用所选方案？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onDisableHandler(res)
				})
			})
		},
		onDisableHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.price-plan.disable', { names: this.getPlanName(selectRows) })
			return this.$fxApi('planPrice.disableMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onDeletClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定删除所选方案？',
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
			const logger = this.$fxLogger.createInfo('basic-archives.price-plan.delete', { names: this.getPlanName(selectRows) })
			return this.$fxApi('planPrice.deleteMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onCheckClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定审核所选方案？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onCheckHandler(res)
				})
			})
		},
		onCheckHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.price-plan.check', { names: this.getPlanName(selectRows) })
			return this.$fxApi('planPrice.checkMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh', false)
				return Promise.resolve()
			})
		},
		onUncheckClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定反审所选方案？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onUncheckHandler(res)
				})
			})
		},
		onUncheckHandler (selectRows) {
			const params = selectRows.map(item => {
				return item.id
			})
			const logger = this.$fxLogger.createInfo('basic-archives.price-plan.uncheck', { names: this.getPlanName(selectRows) })
			return this.$fxApi('planPrice.uncheckMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh', false)
				return Promise.resolve()
			})
		},
		onRecoverClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定恢复所选价格方案？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onRecoverHandler(res)
				})
			})
		},
		onRecoverHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.price-plan.recover', { names: this.getPlanName(selectRows) })
			return this.$fxApi('planPrice.recoverMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh', true)
				return Promise.resolve()
			})
		},
		onRecycleDeletClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定删除所选价格方案？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onRecycleDeleteHandler(res)
				})
			})
		},
		onRecycleDeleteHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.price-plan.recyclingDelete', { names: this.getPlanName(selectRows) })
			return this.$fxApi('planPrice.recyclingDeleteMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh', true)
				return Promise.resolve()
			})
		},
		onEditClick () {
			this.$refs.listTable.getSingleSelectedRow().then(res => {
				this.$emit('on-edit', res.id)
			})
		},
		onTableRowDbclick (item) {
			this.$emit('on-edit', item.id)
		},
		onSearchPriceClick () {
			this.$emit('on-search-price')
		},
		enableRender (h, { row }) {
			return <FxListStateTag
				icon={this.enableState(row.enableFlag, 'icon')}
				label={this.enableState(row.enableFlag, 'label')}
			></FxListStateTag>
		},
		billStateRender (h, { row }) {
			return <FxListStateTag
				icon={this.billState(row.billState, 'icon')}
				label={this.billState(row.billState, 'label')}
			></FxListStateTag>
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
