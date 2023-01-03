<template>
	<div class="list-container">
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
				<el-button v-fx-auth:basic-archives_support-archives_other-expense-type-setting.edit-other-expense-type-setting class="order-btn" type="primary" plain @click="onEditClick">编辑</el-button>
				<el-button v-fx-auth:basic-archives_support-archives_other-expense-type-setting.delete-other-expense-type-setting class="order-btn" type="danger" plain @click="onDeletClick">删除</el-button>
				<el-button v-fx-auth:basic-archives_support-archives_other-expense-type-setting.enable-other-expense-type-setting class="order-btn" type="primary" plain @click="onEnableClick">启用</el-button>
				<el-button v-fx-auth:basic-archives_support-archives_other-expense-type-setting.disable-other-expense-type-setting class="order-btn" type="danger" plain @click="onDisableClick">停用</el-button>
			</div>
			<div slot="btn-tools-right" class="tools-right">
				<el-button v-fx-auth:basic-archives_support-archives_other-expense-type-setting.add-other-expense-type-setting type="primary" slot="reference" @click="onCreateClick">新建</el-button>
			</div>
		</fx-list-virtual-table>
	</div>
</template>
<script>
import filterBar from './FilterBar.vue'
import { apiName } from '../../Index.vue'
export default {
	name: 'listContainer',
	components: {
		filterBar
	},
	data () {
		return {
			tableColumn: [
				{ prop: 'code', label: '其他费用类型编号', required: true, sortable: true },
				{ prop: 'name', label: '其他费用类型名称', required: true, sortable: true },
				{
					prop: 'enableFlag',
					label: '启停状态',
					required: true,
					fxRender: this.enableRender
				},
				{
					prop: 'modifyManName',
					label: '最新修改人',
					sortable: true,
					sortKey: 'modifyMan',
					formatter: (row) => {
						return row.modifyManName.length > 0 ? row.modifyManName[0].name : ''
					}
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
				}
			],
			tableData: [],
			defaultSortParam: { 'os.code': 'asc' }
		}
	},
	computed: {
		enableState () {
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
				...this.$fxCommon.getSearchParams('otherExpenseTypeSettingList')(params),
				excate: true
			}
		},
		getListData () {
			return this.$fxApi(`${apiName}.getExpenseTypeList`)({ data: this.getSearchParams() }).then(res => {
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
					message: '是否确定启用所选其他费用类型？',
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
			const logger = this.$fxLogger.createInfo('basic-archives.support-archives.other-expense-type-setting.enable', { name: this.getName(selectRows) })
			return this.$fxApi(`${apiName}.enabelMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onDisableClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定停用所选其他费用类型？',
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
			const logger = this.$fxLogger.createInfo('basic-archives.support-archives.other-expense-type-setting.disable', { name: this.getName(selectRows) })
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
				message: '是否确定删除所选其他费用类型？',
				selectedRowsLength: selectRows.length
			}).then(() => {
				return Promise.resolve({ params, selectRows })
			})
		},
		onDeleteHandler (params) {
			const logger = this.$fxLogger.createInfo('basic-archives.support-archives.other-expense-type-setting.delete', { name: this.getName(params.selectRows) })
			return this.$fxApi(`${apiName}.deleteMulity`)({ data: params.params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onEditClick () {
			this.$refs.listTable.getSingleSelectedRow().then(res => {
				return this.$fxApi(`${apiName}.getExpenseTypeDetails`, res.id).then(res => {
					this.$emit('on-edit', res)
					return Promise.resolve()
				})
			})
		},
		clearSelected () {
			this.$refs.listTable.clearSelected()
		},
		onTableRowDbclick (item) {
			return this.$fxApi(`${apiName}.getExpenseTypeDetails`, item.id).then(res => {
				this.$emit('on-edit', res)
			})
		},
		enableRender (h, { row }) {
			return <fx-list-state-tag
				icon={this.enableState(row.enableFlag, 'icon')}
				label={this.enableState(row.enableFlag, 'label')}
			></fx-list-state-tag>
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.list-container {
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
