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
				<el-button v-fx-auth:basic-archives_role-manage.edit-role class="order-btn" type="primary" plain @click="onEditClick">编辑</el-button>
				<el-button v-fx-auth:basic-archives_role-manage.delete-role class="order-btn" type="danger" plain @click="onDeletClick">删除</el-button>
			</div>
			<div slot="btn-tools-right" class="tools-right">
				<el-button v-fx-auth:basic-archives_role-manage.add-role type="primary" slot="reference" @click="onCreateClick">新建</el-button>
			</div>
		</fx-list-virtual-table>
		<connectEmpoyeeDialog ref="connectEmpoyeeDialog" @on-auth-refresh="onAuthRefresh"></connectEmpoyeeDialog>
		<connectAuthDialog ref="connectAuthDialog" @on-auth-refresh="onAuthRefresh"></connectAuthDialog>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import filterBar from './FilterBar.vue'
import connectEmpoyeeDialog from '../connect-container/connect-employee.vue'
import connectAuthDialog from '../connect-container/connect-auth.vue'
export default {
	name: 'listContainer',
	components: {
		filterBar,
		connectEmpoyeeDialog,
		connectAuthDialog
	},
	data () {
		return {
			tableColumn: [
				{ prop: 'code', label: '角色编号', sortable: true },
				{ prop: 'name', label: '角色名称', required: true, sortable: true },
				{
					prop: 'connectEmployee',
					label: '关联员工',
					width: '80px',
					align: 'center',
					headerAlign: 'center',
					required: true,
					fxRender: this.connectEmployeeRender
				},
				{
					prop: 'authSetting',
					label: '权限设置',
					width: '80px',
					align: 'center',
					headerAlign: 'center',
					required: true,
					fxRender: this.authSettingRender
				},
				{ prop: 'modifyMan', label: '最新修改人' },
				{
					prop: 'modifyDate',
					label: '最新修改时间',
					width: '140px',
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.modifyDate)
					}
				},
				{ prop: 'createMan', label: '创建人' },
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
		...mapGetters(['detailsAuthGetter']),
		canEdit () {
			return this.detailsAuthGetter('basic-archives_role-manage.edit-role')
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
				...this.$fxCommon.getSearchParams('roleList')(params)
			}
		},
		getListData () {
			return this.$fxApi('role.getPage')({ data: this.getSearchParams() }).then(res => {
				this.$refs.listTable.setPaginationTotal(res.total)
				this.tableData = res.result
				return Promise.resolve(res.result)
			})
		},
		onCreateClick () {
			this.$emit('on-create')
		},
		onDeletClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定删除所选角色？',
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
			const logger = this.$fxLogger.createInfo('basic-archives.role-manage.delete', { role: this.getRoleName(selectRows) })
			return this.$fxApi('role.deleteMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		getRoleName (list) {
			return list.map(item => {
				return item.name
			}).join(',')
		},
		onEditClick () {
			this.$refs.listTable.getSingleSelectedRow().then(res => {
				return this.$fxApi('role.getDetail', res.id).then(res => {
					this.$emit('on-edit', res)
					return Promise.resolve()
				})
			})
		},
		clearSelected () {
			this.$refs.listTable.clearSelected()
		},
		onTableRowDbclick (item) {
			return this.$fxApi('role.getDetail', item.id).then(res => {
				this.$emit('on-edit', res)
			})
		},
		connectEmployeeRender (h, { row, $index }) {
			h = this.$createElement
			return <w-icon
				type="connect-employee"
				verticalAlign
				pointer
				disabled={!this.canEdit}
				vOn:click={this.onConnectEmployClick(row)}
			></w-icon>
		},
		onConnectEmployClick (row) {
			return () => {
				event.stopPropagation()
				this.$refs.connectEmpoyeeDialog.open(row)
			}
		},
		onConnectEmpoyeeDialog (data) {
			this.$refs.connectEmpoyeeDialog.open(data)
		},
		authSettingRender (h, { row, $index }) {
			h = this.$createElement
			return <w-icon
				type="auth-setting"
				verticalAlign
				pointer
				disabled={!this.canEdit}
				vOn:click={this.onAuthSettingClick(row)}
			></w-icon>
		},
		onAuthSettingClick (row) {
			return () => {
				event.stopPropagation()
				this.$refs.connectAuthDialog.open(row)
			}
		},
		onAuthRefresh () {
			return this.getModuleAuth().then(this.getDetailsAuth)
		},
		getModuleAuth () {
			return this.$store.dispatch('syncModuleAuth')
		},
		getDetailsAuth () {
			return this.$store.dispatch('syncDetailsAuth', { moduleName: this.$route.meta.authModuleList })
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
