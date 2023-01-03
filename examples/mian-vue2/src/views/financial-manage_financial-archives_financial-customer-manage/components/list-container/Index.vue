<template>
	<div class="list-container">
		<filterBar ref="filterBar" @on-search="refresh"></filterBar>
		<fx-list-virtual-table
			ref="organList"
			showIndex
			indexContinuous
			:tableColumn="tableColumn"
			:listData="tableData"
			@on-page-change="onPageChange"
			@on-table-row-dbclick="onTableRowDbclick"
			@on-sort-change="onSortChange"
		>
			<div slot="btn-tools-left" class="tools-left">
				<fx-list-btn-tools :recycle="false">
					<fx-button v-fx-auth:basic-archives_organ-manage.edit-organ type="primary" plain @click="onEditClick">编辑</fx-button>
					<fx-button v-fx-auth:basic-archives_organ-manage.enable-organ type="primary" plain @click="onEnableClick">启用</fx-button>
					<fx-button v-fx-auth:basic-archives_organ-manage.disable-organ type="danger" plain @click="onDisableClick">停用</fx-button>
					<fx-button v-fx-auth:basic-archives_organ-manage.export-organ type="primary" plain @click="onExportDataClick">导出</fx-button>
					<fx-button v-fx-auth:basic-archives_organ-manage.export-organ type="primary" plain @click="onImportClick">批量导入</fx-button>
				</fx-list-btn-tools>
			</div>
		</fx-list-virtual-table>
	</div>
</template>
<script>
import filterBar from './FilterBar.vue'
import { apiName } from '../../Index.vue'
export default {
	name: 'customerListContainer',
	components: {
		filterBar
	},
	data () {
		return {
			tableColumn: [
				{ prop: 'code', label: '客户编号', required: true },
				{ prop: 'name', label: '客户名称', required: true },
				{ prop: 'cwCustomerType.name', label: '客户类别' },
				{
					prop: 'enableFlag',
					label: '状态',
					required: true,
					fxRender: this.enableRender
				},
				{ prop: 'modifyManName', label: '经办人' },
				{
					prop: 'modifyDate',
					label: '最新修改时间',
					width: '160px',
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.modifyDate)
					}
				}
			],
			tableData: []
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
			this.$refs.organList.setPaginationCurrent(1)
			this.$refs.organList.clearSelected()
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
				sortParams: this.$refs.organList.getSortKey()
			}
			return {
				...this.$refs.organList.getPaginationParams(),
				...this.$fxCommon.getSearchParams('financialCustomerList')(params)
			}
		},
		getListData () {
			return this.$fxApi(`${apiName}.getCustomerList`)({ data: this.getSearchParams() }).then(res => {
				this.$refs.organList.setPaginationTotal(res.total)
				this.tableData = res.result
				return Promise.resolve(res.result)
			})
		},
		createMulityParams (selectRows) {
			return selectRows.map(item => {
				return item.id
			})
		},
		getCustomerNames (list) {
			return list.map(item => {
				return item.name
			}).join(',')
		},
		onEnableClick () {
			this.$refs.organList.getSelectedRows().then(res => {
				this.$fxConfirm('是否确定启用所选客户？').then(() => {
					this.onEnableHandler(res)
				})
			})
		},
		onEnableHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('financial-manage.financial-archives.financial-customer-manage.enable', { names: this.getCustomerNames(selectRows) })
			return this.$fxApi(`${apiName}.enabelMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onDisableClick () {
			this.$refs.organList.getSelectedRows().then(res => {
				this.$fxConfirm('是否确定停用所选客户？').then(() => {
					this.onDisableHandler(res)
				})
			})
		},
		onDisableHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('financial-manage.financial-archives.financial-customer-manage.disable', { names: this.getCustomerNames(selectRows) })
			return this.$fxApi(`${apiName}.disableMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onEditClick () {
			this.$refs.organList.getSingleSelectedRow().then(res => {
				this.$emit('on-edit', res)
			})
		},
		onTableRowDbclick (item) {
			this.$emit('on-edit', item)
		},
		enableRender (h, { row }) {
			return <fx-list-state-tag
				icon={this.enableState(row.enableFlag, 'icon')}
				label={this.enableState(row.enableFlag, 'label')}
			></fx-list-state-tag>
		},
		onExportDataClick () {
			// const logger = this.$fxLogger.createInfo('financial-manage.financial-archives.financial-customer-manage.exportData')
			// return this.$fxApi(`${apiName}.exportData`)({ logger }).then(res => {
			// 	this.$fxUtils.downloadFile(res)
			// })
		},
		onImportClick () {
			return this.$fxApi(`${apiName}.importMulity`).then(this.refresh).then(() => {
				this.$refs.filterBar.getSelectList()
			})
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
