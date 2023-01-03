<template>
	<div class="storage-manage-container">
		<fx-page-header title="货位管理"></fx-page-header>
		<filterBar ref="filterBar" @on-search="refresh"></filterBar>
		<fx-list-virtual-table
			ref="storageSpaceList"
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
					<el-button v-fx-auth:basic-archives_storage-manage.edit-space class="order-btn" type="primary" plain @click="onEditClick">编辑</el-button>
					<el-button v-fx-auth:basic-archives_storage-manage.delete-space class="order-btn" type="danger" plain @click="onDeletClick">删除</el-button>
					<el-button v-fx-auth:basic-archives_storage-manage.enable-space class="order-btn" type="primary" plain @click="onEnableClick">启用</el-button>
					<el-button v-fx-auth:basic-archives_storage-manage.disable-space class="order-btn" type="danger" plain @click="onDisableClick">停用</el-button>
					<el-button v-fx-auth:basic-archives_storage-manage.import-space class="order-btn" type="primary" plain @click="onImportDataClick">导入</el-button>
					<el-button v-fx-auth:basic-archives_storage-manage.export-space class="order-btn" type="danger" plain @click="onExportDataClick">导出</el-button>
				</fx-list-btn-tools>
			</div>
			<div slot="btn-tools-right" class="tools-right">
				<el-button v-fx-auth:basic-archives_storage-manage.add-space type="primary" @click="onCreateClick">新建</el-button>
			</div>
		</fx-list-virtual-table>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import { apiName } from '../../Index.vue'
import filterBar from './FilterBar.vue'
export default {
	name: 'listContainer',
	components: {
		filterBar
	},
	props: {
		getCurrentTreeLv: Function
	},
	data () {
		return {
			tableColumn: [
				{ prop: 'code', label: '货位编码', required: true, sortable: true, sortKey: 'hil.code' },
				{ prop: 'shelfCode', label: '货架编码', required: true, sortable: true, sortKey: 'hs.code' },
				{ prop: 'organName', label: '机构', required: true },
				{ prop: 'houseName', label: '仓库', required: true },
				{
					prop: 'organType',
					label: '货位类型',
					formatter: (row) => {
						return this.$fxTypeMiddleware.getCommonTypeItemById('storageSpaceTypeList')(row.locationCategory).label
					}
				},
				{
					prop: 'enableFlag',
					label: '货位状态',
					required: true,
					fxRender: this.enableRender
				},
				{ prop: 'modifyMan', label: '最新修改人' },
				{
					prop: 'modifyDate',
					label: '最新修改时间',
					width: '160px',
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.modifyDate)
					}
				},
				{ prop: 'createMan', label: '创建人' },
				{
					prop: 'createDate',
					label: '创建时间',
					width: '160px',
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.createDate)
					}
				}
			],
			tableData: [],
			defaultSortParam: { 'hil.code': 'asc' }
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
			this.$refs.filterBar.initFilter()
			this.$refs.filterBar.initSelect()
		},
		refresh () {
			this.$refs.storageSpaceList.setPaginationCurrent(1)
			this.$refs.storageSpaceList.clearSelected()
			return this.getListData()
		},
		clearSelected () {
			this.$refs.storageSpaceList.clearSelected()
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
				sortParams: this.$refs.storageSpaceList.getSortKey(),
				treeLV: this.getCurrentTreeLv()
			}
			return {
				...this.$refs.storageSpaceList.getPaginationParams(),
				...this.$fxCommon.getSearchParams('storageManageList')(params)
			}
		},
		getListData () {
			return this.$fxApi(`${apiName}.getListData`)({ data: this.getSearchParams() }).then(res => {
				this.$refs.storageSpaceList.setPaginationTotal(res.total)
				this.tableData = res.result
				return Promise.resolve(res.result)
			})
		},
		onCreateClick () {
			this.$emit('on-create-click')
		},
		createMulityParams (selectRows) {
			const ids = selectRows.map(item => {
				return item.id
			})
			return ids
		},
		getCodes (list) {
			return list.map(item => {
				return item.code
			}).join('，')
		},
		onEnableClick () {
			this.$refs.storageSpaceList.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定启用所选货位？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onEnableHandler(res)
				})
			})
		},
		onEnableHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.storage-manage.enable', { code: this.getCodes(selectRows) })
			return this.$fxApi(`${apiName}.enable`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onDisableClick () {
			this.$refs.storageSpaceList.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定停用所选货位？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onDisableHandler(res)
				})
			})
		},
		onDisableHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.storage-manage.disable', { code: this.getCodes(selectRows) })
			return this.$fxApi(`${apiName}.disable`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onDeletClick () {
			this.$refs.storageSpaceList.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定删除所选货位？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onDeleteHandler(res)
				})
			})
		},
		onDeleteHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.storage-manage.delete', { code: this.getCodes(selectRows) })
			return this.$fxApi(`${apiName}.delete`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onEditClick () {
			this.$refs.storageSpaceList.getSingleSelectedRow().then(row => {
				this.$emit('on-edit-click', row)
			})
		},
		onImportDataClick () {
			this.$fxUpload({ type: 'excel' }).then(this.importExcelHandler).then(this.confirmWrongData)
		},
		importExcelHandler (file) {
			const params = {
				excelFile: file
			}
			const logger = this.$fxLogger.createInfo('basic-archives.storage-manage.importData', { name: file.name })
			return this.$fxApi(`${apiName}.importData`)({ data: params, logger })
		},
		confirmWrongData (res) {
			if (!res.result) {
				this.$fxConfirm({
					message: '导入数据存在错误，是否下载错误信息？',
					option: {
						confirmButtonText: '下载',
						cancelButtonText: '取消',
						closeOnClickModal: false,
						closeOnPressEscape: false,
						closeOnHashChange: false
					}
				}).then(() => {
					this.$fxUtils.downloadFile(res)
				})
			} else {
				this.$emit('on-refresh', true)
			}
		},
		onExportDataClick () {
			const logger = this.$fxLogger.createInfo('basic-archives.storage-manage.exportData')
			return this.$fxApi(`${apiName}.exportData`)({ logger }).then(res => {
				this.$fxUtils.downloadFile(res)
			})
		},
		onTableRowDbclick (item) {
			this.$emit('on-edit-click', item)
		},
		enableRender (h, { row }) {
			return <fx-list-state-tag
				icon={this.enableState(row.enableFlag ? 1 : 0, 'icon')}
				label={this.enableState(row.enableFlag ? 1 : 0, 'label')}
			></fx-list-state-tag>
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.storage-manage-container {
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
