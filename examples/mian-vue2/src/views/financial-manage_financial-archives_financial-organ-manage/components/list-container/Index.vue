<template>
	<div class="organ-manage-container">
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
					<fx-button v-fx-auth:basic-archives_organ-manage.edit-organ type="primary" plain @click="onEditOrganClick">编辑</fx-button>
					<fx-button v-fx-auth:basic-archives_organ-manage.enable-organ type="primary" plain @click="onEnableOrganClick">启用</fx-button>
					<fx-button v-fx-auth:basic-archives_organ-manage.disable-organ type="danger" plain @click="onDisableOrganClick">停用</fx-button>
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
	name: 'organListContainer',
	components: {
		filterBar
	},
	data () {
		return {
			tableColumn: [
				{ prop: 'code', label: '机构编号', required: true },
				{ prop: 'name', label: '机构名称', required: true },
				{
					prop: 'organType',
					label: '机构类型',
					formatter: (row) => {
						return this.$fxTypeMiddleware.getCommonTypeItemById('organType')(row.organType).label
					}
				},
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
				...this.$fxCommon.getSearchParams('financialOrganList')(params)
			}
		},
		getListData () {
			return this.$fxApi(`${apiName}.getOrganList`)({ data: this.getSearchParams() }).then(res => {
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
		getOrganName (list) {
			return list.map(item => {
				return item.name
			}).join(',')
		},
		onEnableOrganClick () {
			this.$refs.organList.getSelectedRows().then(res => {
				this.$fxConfirm('是否确定启用所选机构？').then(() => {
					this.onEnableOrganHandler(res)
				})
			})
		},
		onEnableOrganHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('financial-manage.financial-archives.financial-organ-manage.enable', { names: this.getOrganName(selectRows) })
			return this.$fxApi(`${apiName}.organEnable`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onDisableOrganClick () {
			this.$refs.organList.getSelectedRows().then(res => {
				this.$fxConfirm('是否确定停用所选机构？').then(() => {
					this.onDisableOrganHandler(res)
				})
			})
		},
		onDisableOrganHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('financial-manage.financial-archives.financial-organ-manage.disable', { names: this.getOrganName(selectRows) })
			return this.$fxApi(`${apiName}.organDisable`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onEditOrganClick () {
			this.$refs.organList.getSingleSelectedRow().then(res => {
				this.$emit('on-organ-edit', res)
			})
		},
		onTableRowDbclick (item) {
			this.$emit('on-organ-edit', item)
		},
		enableRender (h, { row }) {
			return <fx-list-state-tag
				icon={this.enableState(row.enableFlag, 'icon')}
				label={this.enableState(row.enableFlag, 'label')}
			></fx-list-state-tag>
		},
		onExportDataClick () {
			// const logger = this.$fxLogger.createInfo('financial-manage.financial-archives.financial-organ-manage.exportData')
			// return this.$fxApi(`${apiName}.exportData`)({ logger }).then(res => {
			// 	this.$fxUtils.downloadFile(res)
			// })
		},
		onImportClick () {
			return this.$fxApi(`${apiName}.importMulity`).then(this.refresh).then(() => {
				this.$refs.filterBar.getFilterOrganSelectList()
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
