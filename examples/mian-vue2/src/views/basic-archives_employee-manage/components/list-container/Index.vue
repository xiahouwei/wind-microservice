<template>
	<div class="organ-manage-container">
		<filterBar ref="filterBar" @on-search="refresh"></filterBar>
		<fx-list-virtual-table
			ref="listTable"
			:tableColumn="tableColumn"
			:listData="tableData"
			showIndex
			indexContinuous
			:defaultSortParam="defaultSortParam"
			@on-page-change="onPageChange"
			@on-table-row-dbclick="onTableRowDbclick"
			@on-sort-change="onSortChange"
		>
			<div slot="btn-tools-left" class="tools-left">
				<el-button v-fx-auth:basic-archives_employee-manage.edit-employee class="order-btn" type="primary" plain @click="onEditClick">编辑</el-button>
				<el-button v-fx-auth:basic-archives_employee-manage.delete-employee class="order-btn" type="danger" plain @click="onDeletClick">删除</el-button>
				<el-button v-fx-auth:basic-archives_employee-manage.enable-employee class="order-btn" type="primary" plain @click="onEnableClick">启用</el-button>
				<el-button v-fx-auth:basic-archives_employee-manage.disable-employee class="order-btn" type="danger" plain @click="onDisableClick">停用</el-button>
				<el-button v-fx-auth:basic-archives_employee-manage.export-employee class="order-btn" type="primary" plain @click="onExportDataClick">导出</el-button>
			</div>
			<div slot="btn-tools-right" class="tools-right">
				<el-button v-fx-auth:basic-archives_employee-manage.add-employee type="primary" @click="onCreateClick">新建</el-button>
			</div>
		</fx-list-virtual-table>
	</div>
</template>
<script>
import filterBar from './FilterBar.vue'
import FxListStateTag from '@/components/common/Fx-list-state-tag.vue'
import { mapGetters } from 'vuex'
export default {
	name: 'listContainer',
	components: {
		filterBar
	},
	props: {
		getCurrentTreeLv: Function,
		getCurrentNodeOrganType: Function
	},
	data () {
		return {
			tableColumn: [
				{ prop: 'code', label: '员工编号', required: true, sortable: true },
				{ prop: 'name', label: '员工名称', required: true, sortable: true },
				{ prop: 'organName', label: '直属机构' },
				{ prop: 'username', label: '用户名', required: true },
				{ prop: 'phone', label: '联系电话' },
				{
					prop: 'enableFlag',
					label: '启停状态',
					required: true,
					fxRender: this.enableRender
				},
				// { prop: 'tag', label: '标签' },
				{ prop: 'sourceName', label: '来源信息' },
				{ prop: 'modifyUserName', label: '最新修改人' },
				{
					prop: 'modifyDate',
					label: '最新修改时间',
					width: '140px',
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.modifyDate)
					}
				},
				{ prop: 'createUserName', label: '创建人' },
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
			organTypeList: this.$fxTypeMiddleware.getCommonTypeList('supplierType'),
			defaultSortParam: { code: 'asc' }
		}
	},
	computed: {
		...mapGetters(['detailsAuthGetter']),
		enableState () {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('enableState')(val)[key]
			}
		}
	},
	methods: {
		initFilterBar () {
			this.$refs.filterBar.onResetClick()
			this.$refs.filterBar.getOrganList()
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
				treeLV: this.getCurrentTreeLv(),
				organType: this.getCurrentNodeOrganType()
			}
			return {
				...this.$refs.listTable.getPaginationParams(),
				...this.$fxCommon.getSearchParams('employeeList')(params)
			}
		},
		getListData () {
			return this.$fxApi('employee.getEmployeeList')({ data: this.getSearchParams() }).then(res => {
				this.$refs.listTable.setPaginationTotal(res.total)
				this.tableData = res.result
				return Promise.resolve(res.result)
			})
		},
		onCreateClick () {
			this.$emit('on-create')
		},
		onEnableClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定启用所选员工？',
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
			const logger = this.$fxLogger.createInfo('basic-archives.employee-manage.enable', { employee: this.getEmployeeName(selectRows) })
			return this.$fxApi('employee.enabelMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onDisableClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定停用所选员工？',
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
			const logger = this.$fxLogger.createInfo('basic-archives.employee-manage.disable', { employee: this.getEmployeeName(selectRows) })
			return this.$fxApi('employee.disableMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onDeletClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定删除所选员工？',
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
			const logger = this.$fxLogger.createInfo('basic-archives.employee-manage.delete', { employee: this.getEmployeeName(selectRows) })
			return this.$fxApi('employee.deleteMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		getEmployeeName (list) {
			return list.map(item => {
				return item.name
			}).join(',')
		},
		onEditClick () {
			this.$refs.listTable.getSingleSelectedRow().then(res => {
				this.$emit('on-edit', res)
			})
		},
		onTableRowDbclick (item) {
			this.$emit('on-edit', item)
		},
		enableRender (h, { row }) {
			return <FxListStateTag
				icon={this.enableState(row.enableFlag, 'icon')}
				label={this.enableState(row.enableFlag, 'label')}
			></FxListStateTag>
		},
		onExportDataClick () {
			const logger = this.$fxLogger.createInfo('basic-archives.employee-manage.exportData')
			return this.$fxApi('employee.exportData')({ logger }).then(res => {
				this.$fxUtils.downloadFile(res)
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
