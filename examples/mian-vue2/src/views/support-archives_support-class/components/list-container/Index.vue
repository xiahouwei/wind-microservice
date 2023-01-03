<template>
	<div class="organ-manage-container">
		<filterBar ref="filterBar" @on-search="refresh"></filterBar>
		<fx-list-virtual-table
			ref="listTable"
			:tableColumn="tableColumn"
			:listData="tableData"
			showIndex
			indexContinuous
			@on-page-change="onPageChange"
			@on-table-row-dbclick="onTableRowDbclick"
			@on-sort-change="onSortChange"
		>
			<div slot="btn-tools-left" class="tools-left">
				<el-button class="order-btn" type="primary" plain @click="onEditClick">编辑</el-button>
				<el-button class="order-btn" type="danger" plain @click="onDeletClick">删除</el-button>
				<el-button class="order-btn" type="primary" plain @click="onEnableClick">启用</el-button>
				<el-button class="order-btn" type="danger" plain @click="onDisableClick">停用</el-button>
			</div>
			<div slot="btn-tools-right" class="tools-right">
				<el-button type="primary" @click="onCreateClick">新建</el-button>
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
	props: {
		columnType: {
			type: String,
			default: 'root'
		},
		fGetTreeId: Function
	},
	data () {
		return {
			tableColumn: [
				{ prop: 'pname', label: '单据种类', required: true, sortable: true },
				{ prop: 'name', label: '业务类型', required: true, sortable: true },
				{
					prop: 'enableFlag',
					label: '启停状态',
					required: true,
					fxRender: this.enableRender
				},
				{ prop: 'modifyUserName', label: '最新修改人' },
				{ prop: 'modifyDate', label: '最新修改时间', width: '160px' },
				{ prop: 'createUserName', label: '创建人' },
				{ prop: 'createDate', label: '创建时间', width: '160px' }
			],
			tableData: []
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
				sortParams: this.$refs.listTable.getSortKey(),
				pid: this.fGetTreeId()
			}
			return {
				...this.$refs.listTable.getPaginationParams(),
				...this.$fxCommon.getSearchParams('bussinessTypeList')(params)
			}
		},
		getListData () {
			return this.$fxApi('bussinessType.getPageList')({ data: this.getSearchParams() }).then(res => {
				this.$refs.listTable.setPaginationTotal(res.total)
				this.tableData = res.result
				return Promise.resolve(res.result)
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
				this.$fxConfirm({
					message: '是否确定删除所选业务类型？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onDeleteHandler(res)
				})
			})
		},
		getName (list) {
			return list.map(item => {
				return item.name
			}).join(',')
		},
		onDeleteHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.support-archives.bussiness-type.delete', { name: this.getName(selectRows) })
			return this.$fxApi('bussinessType.deleteMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onEnableClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定启用所选业务类型？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onEnableHandler(res)
				})
			})
		},
		onEnableHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.support-archives.bussiness-type.enable', { name: this.getName(selectRows) })
			return this.$fxApi('bussinessType.enabelMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onDisableClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定停用所选业务类型？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onDisableHandler(res)
				})
			})
		},
		onDisableHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.support-archives.bussiness-type.disable', { name: this.getName(selectRows) })
			return this.$fxApi('bussinessType.disableMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onEditClick () {
			this.$refs.listTable.getSelectedRows().then(([item]) => {
				this.$emit('on-edit', item)
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
