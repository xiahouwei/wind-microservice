<template>
	<div class="organ-manage-container">
		<filterBar ref="filterBar" @on-search="refresh"></filterBar>
		<fx-list-virtual-table
			ref="listTable"
			:tableColumn="tableColumn"
			:listData="tableData"
			:defaultSortParam="defaultSortParam"
			showIndex
			indexContinuous
			@on-page-change="onPageChange"
			@on-table-row-dbclick="onTableRowDbclick"
			@on-sort-change="onSortChange"
		>
			<div slot="btn-tools-left" class="tools-left">
				<el-button v-fx-auth:basic-archives_support-archives_inventory-profit-reason.edit-inventory-profit-reason class="order-btn" type="primary" plain @click="onEditClick">编辑</el-button>
				<el-button v-fx-auth:basic-archives_support-archives_inventory-profit-reason.delete-inventory-profit-reason class="order-btn" type="danger" plain @click="onDeletClick">删除</el-button>
				<el-button v-fx-auth:basic-archives_support-archives_inventory-profit-reason.enable-inventory-profit-reason class="order-btn" type="primary" plain @click="onEnableClick">启用</el-button>
				<el-button v-fx-auth:basic-archives_support-archives_inventory-profit-reason.disable-inventory-profit-reason class="order-btn" type="danger" plain @click="onDisableClick">停用</el-button>
			</div>
			<div slot="btn-tools-right" class="tools-right">
				<el-button v-fx-auth:basic-archives_support-archives_inventory-profit-reason.add-inventory-profit-reason type="primary" slot="reference" @click="onCreateClick">新建</el-button>
			</div>
		</fx-list-virtual-table>
	</div>
</template>
<script>
import filterBar from './FilterBar.vue'
import FxListStateTag from '@/components/common/Fx-list-state-tag.vue'
import { apiName } from '../../Index.vue'
export default {
	name: 'listContainer',
	components: {
		filterBar
	},
	data () {
		return {
			tableColumn: [
				{ prop: 'code', label: '盘盈原因编号', required: true, sortable: true },
				{ prop: 'name', label: '盘盈原因名称', required: true },
				{
					prop: 'defaultReason',
					label: '默认盘盈原因',
					align: 'center',
					headerAlign: 'center',
					width: '100px',
					fxRender: this.defaultReasonRender
				},
				{
					prop: 'enableFlag',
					label: '启停状态',
					required: true,
					fxRender: this.enableRender
				},
				{
					prop: 'inventoryProfitType',
					label: '盘盈生成方式',
					formatter: (row) => {
						return this.$fxTypeMiddleware.getCommonTypeItemById('inventoryProfitType')(row.generateType).name
					}
				},
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
			defaultSortParam: { code: 'asc' }
		}
	},
	computed: {
		enableState (val, key) {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('enableState')(val)[key]
			}
		}
	},
	methods: {
		refresh () {
			this.$refs.listTable.setPaginationCurrent(1)
			this.$refs.listTable.clearSelected()
			return this.getListData()
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
				...this.$fxCommon.getSearchParams('inventoryProfitList')(params)
			}
		},
		getListData () {
			return this.$fxApi(`${apiName}.getReasonList`)({ data: this.getSearchParams() }).then(res => {
				this.$refs.listTable.setPaginationTotal(res.total)
				this.tableData = res.result
				return Promise.resolve(res.result)
			})
		},
		onCreateClick () {
			this.$emit('on-create')
		},
		getName (list) {
			return list.map(item => {
				return item.name
			}).join(',')
		},
		onEnableClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定启用所选盘盈原因？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onEnableHandler(res)
				})
			})
		},
		onEnableHandler (selectRows) {
			const params = selectRows.map(item => {
				return item.id
			})
			const logger = this.$fxLogger.createInfo('basic-archives.support-archives.inventory-profit-reason.enable', { name: this.getName(selectRows) })
			return this.$fxApi(`${apiName}.enabelMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onDisableClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定停用所选盘盈原因？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onDisableHandler(res)
				})
			})
		},
		onDisableHandler (selectRows) {
			const params = selectRows.map(item => {
				return item.id
			})
			const logger = this.$fxLogger.createInfo('basic-archives.support-archives.inventory-profit-reason.disable', { name: this.getName(selectRows) })
			return this.$fxApi(`${apiName}.disableMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onDeletClick () {
			this.$refs.listTable.getSelectedRows()
				.then(this.deleteCheck)
				.then(this.onDeleteHandler)
		},
		deleteCheck (selectRows) {
			const params = selectRows.map(item => {
				return item.id
			})
			return this.$fxConfirm({
				message: '是否确定删除所选盘盈原因？',
				selectedRowsLength: selectRows.length
			}).then(() => {
				return Promise.resolve({ params, selectRows })
			})
		},
		onDeleteHandler (params) {
			const logger = this.$fxLogger.createInfo('basic-archives.support-archives.inventory-profit-reason.delete', { name: this.getName(params.selectRows) })
			return this.$fxApi(`${apiName}.deleteMulity`)({ data: params.params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onEditClick () {
			this.$refs.listTable.getSingleSelectedRow().then(res => {
				return this.$fxApi(`${apiName}.getReasonDetails`, res.id).then(res => {
					this.$emit('on-edit', res)
					return Promise.resolve()
				})
			})
		},
		clearSelected () {
			this.$refs.listTable.clearSelected()
		},
		onTableRowDbclick (item) {
			return this.$fxApi(`${apiName}.getReasonDetails`, item.id).then(res => {
				this.$emit('on-edit', res)
			})
		},
		enableRender (h, { row }) {
			return <FxListStateTag
				icon={this.enableState(row.enableFlag, 'icon')}
				label={this.enableState(row.enableFlag, 'label')}
			></FxListStateTag>
		},
		defaultReasonRender (h, { row }) {
			return <el-checkbox
				value={row.defaultFlag}
				true-label={1}
				false-label={0}
				disabled
				class='list-cell-checkbox'
			></el-checkbox>
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
<style lang="stylus">
.list-cell-checkbox {
	display block
	cursor default
}
</style>
