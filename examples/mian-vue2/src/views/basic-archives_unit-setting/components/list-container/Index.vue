<template>
	<div class="unit-setting-container">
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
				<fx-list-btn-tools :recycle="false">
					<el-button v-fx-auth:basic-archives_unit-setting.edit-unit class="order-btn" type="primary" plain @click="onEditClick">编辑</el-button>
					<el-button v-fx-auth:basic-archives_unit-setting.delete-unit class="order-btn" type="danger" plain @click="onDeletClick">删除</el-button>
					<el-button v-fx-auth:basic-archives_unit-setting.import-unit class="order-btn" type="danger" plain @click="onImportClick">导入</el-button>
				</fx-list-btn-tools>
			</div>
			<div slot="btn-tools-right" class="tools-right">
				<el-button v-fx-auth:basic-archives_unit-setting.add-unit type="primary" @click="onCreateClick">新建</el-button>
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
	props: {
		getCurrentNode: Function
	},
	data () {
		return {
			tableColumn: [
				{ prop: 'code', label: '品项编号', required: true, sortable: true },
				{ prop: 'name', label: '品项名称', required: true, sortable: true },
				{ prop: 'spec', label: '品项规格', required: true },
				{ prop: 'modifyUserName', label: '最新修改人' },
				{
					prop: 'modifyDate',
					label: '最新修改时间',
					width: '140px',
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.modifyDate || '')
					}
				// },
				// { prop: 'creatUserName', label: '创建人' },
				// {
				// 	prop: 'createDate',
				// 	label: '创建时间',
				// 	width: '140px',
				// 	formatter: (row) => {
				// 		return this.$fxUtils.formatterDateTime(row.createDate || '')
				// 	}
				}
			],
			tableData: [],
			defaultSortParam: { code: 'asc' }
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
			const itemTypeId = this.getCurrentNode().id
			const params = {
				...this.$refs.filterBar.getFilterParams(),
				sortParams: this.$refs.listTable.getSortKey(),
				'item.itemType': itemTypeId === '1' ? null : itemTypeId
			}
			return {
				...this.$refs.listTable.getPaginationParams(),
				...this.$fxCommon.getSearchParams('unitSettingList')(params)
			}
		},
		getListData () {
			return this.$fxApi(`${apiName}.getPage`)({ data: this.getSearchParams() }).then(res => {
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
				return item.itemId
			})
		},
		onDeletClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定删除所选品项单位使用场景设置？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onDeleteHandler(res)
				})
			})
		},
		onDeleteHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.unit-setting.delete', { item: this.getItemName(selectRows) })
			return this.$fxApi(`${apiName}.deleteMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		getItemName (list) {
			return list.map(item => {
				return item.name
			}).join(',')
		},
		onEditClick () {
			this.$refs.listTable.getSingleSelectedRow().then(row => {
				this.$emit('on-edit', row)
			})
		},
		onTableRowDbclick (item) {
			this.$emit('on-edit', item)
		},
		onExportDataClick () {
			const logger = this.$fxLogger.createInfo('basic-archives.unit-setting.exportData')
			return this.$fxApi(`${apiName}.exportData`)({ logger }).then(res => {
				this.$fxUtils.downloadFile(res)
			})
		},
		onImportClick () {
			this.$emit('on-multiple-import-click')
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.unit-setting-container {
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
