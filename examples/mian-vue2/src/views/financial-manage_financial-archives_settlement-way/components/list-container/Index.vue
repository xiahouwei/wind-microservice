<template>
	<div class="organ-manage-container">
		<filterBar ref="filterBar" @on-search="refresh"></filterBar>
		<fx-list-virtual-table
			ref="organList"
			showIndex
			indexContinuous
			:tableColumn="tableColumn"
			:listData="tableData"
			:defaultSortParam="defaultSortParam"
			@on-page-change="onPageChange"
			@on-table-row-dbclick="onTableRowDbclick"
			@on-sort-change="onSortChange"
		>
			<div slot="btn-tools-left" class="tools-left">
				<fx-list-btn-tools :recycle="false">
					<fx-button type="primary" plain @click="onEditClick">编辑</fx-button>
					<fx-button type="primary" plain @click="onEnableClick">启用</fx-button>
					<fx-button type="danger" plain @click="onDisableClick">停用</fx-button>
					<fx-button type="primary" plain @click="onExportDataClick">导出</fx-button>
				</fx-list-btn-tools>
			</div>
			<div slot="btn-tools-right" class="tools-right">
				<fx-button type="primary" @click="onCreateClick">新增</fx-button>
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
				{ prop: 'code', label: '结算方式编号', required: true, sortable: true },
				{ prop: 'name', label: '结算方式名称', required: true, sortable: true },
				{
					prop: 'generateType',
					label: '类型',
					formatter: (row) => {
						return this.$fxTypeMiddleware.getCommonTypeItemById('settlementWayGenerateTypeList')(row.generateType).label
					}
				},
				{
					prop: 'enableFlag',
					label: '状态',
					required: true,
					fxRender: this.enableRender
				},
				{ prop: 'memo', label: '备注' },
				{ prop: 'modifyManName', label: '经办人' },
				{
					prop: 'modifyDate',
					label: '最新修改时间',
					width: '160px',
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.modifyDate || '')
					}
				}
			],
			tableData: [],
			defaultSortParam: { code: 'asc' }
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
				...this.$fxCommon.getSearchParams('settlementWayList')(params)
			}
		},
		getListData () {
			return this.$fxApi(`${apiName}.getPageList`)({ data: this.getSearchParams() }).then(res => {
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
		getItemName (list) {
			return list.map(item => {
				return item.name
			}).join(',')
		},
		onEnableClick () {
			this.$refs.organList.getSelectedRows().then(res => {
				this.$fxConfirm('是否确定启用所选结算方式？').then(() => {
					this.onEnableOrganHandler(res)
				})
			})
		},
		onEnableOrganHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('financial-manage.financial-archives.settlement-way.enable', { names: this.getItemName(selectRows) })
			return this.$fxApi(`${apiName}.onEnable`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onDisableClick () {
			this.$refs.organList.getSelectedRows().then(res => {
				this.$fxConfirm('是否确定停用所选结算方式？').then(() => {
					this.onDisableOrganHandler(res)
				})
			})
		},
		onDisableOrganHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('financial-manage.financial-archives.settlement-way.disable', { names: this.getItemName(selectRows) })
			return this.$fxApi(`${apiName}.onDisable`)({ data: params, logger }).then(res => {
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
			// const logger = this.$fxLogger.createInfo('financial-manage.financial-archives.settlement-way.exportData')
			// return this.$fxApi(`${apiName}.exportData`)({ logger }).then(res => {
			// 	this.$fxUtils.downloadFile(res)
			// })
		},
		onCreateClick () {
			this.$emit('on-create')
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
