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
			@on-select="onSelectClick"
		>
			<div slot="btn-tools-left" class="tools-left">
				<fx-list-btn-tools v-model="recycleShow" @on-recycle-change="refresh">
					<el-button v-fx-auth:basic-archives_item-manage.edit-item class="order-btn" type="primary" plain @click="onEditClick">编辑</el-button>
					<el-button v-fx-auth:basic-archives_item-manage.delete-item class="order-btn" type="danger" plain @click="onDeletClick">删除</el-button>
					<el-button v-fx-auth:basic-archives_item-manage.enable-item class="order-btn" type="primary" plain @click="onEnableClick">启用</el-button>
					<el-button v-fx-auth:basic-archives_item-manage.disable-item class="order-btn" type="danger" plain @click="onDisableClick">停用</el-button>
					<el-button class="order-btn" type="primary" plain @click="onImportDataClick">导入</el-button>
					<el-button v-fx-auth:basic-archives_item-manage.export-item class="order-btn" type="primary" plain @click="onExportDataClick">导出</el-button>
					<el-button v-fx-auth:basic-archives_item-manage.recover-organ slot="recycle" class="order-btn" type="primary" plain @click="onRecoverClick">恢复</el-button>
					<el-button v-fx-auth:basic-archives_item-manage.delete-item slot="recycle" class="order-btn" type="danger" plain @click="onRecycleDeletClick">删除</el-button>
				</fx-list-btn-tools>
				<div class="tools-left-right">
					<w-popover
						v-fx-auth:basic-archives_item-manage.edit-item
						v-model="settingPopperVisible"
						trigger="click"
						placement="bottom"
						width="300"
						:scrollClose="false"
					>
						<w-link
							slot="reference"
							type="primary"
							icon="table-details-setting"
							class="setting-mulity-btn"
							@click="onMulitySettingClick"
						>批量设置</w-link>
						<setting-mulity
							:visible.sync="settingPopperVisible"
							:settingMulitySelectRows="settingMulitySelectRows"
							@on-setting-mulity-save="getListData"
						></setting-mulity>
					</w-popover>
				</div>
			</div>
			<div slot="btn-tools-right" class="tools-right">
				<el-button v-fx-auth:basic-archives_item-manage.add-item type="primary" @click="onCreateClick">新建</el-button>
			</div>
		</fx-list-virtual-table>
		<w-image-preview
			v-model="itemImgVisible"
			:imageUrl="itemImgImgUrl"
			disabled
		></w-image-preview>
	</div>
</template>
<script>
import filterBar from './FilterBar.vue'
import FxListStateTag from '@/components/common/Fx-list-state-tag.vue'
import settingMulity from './SettingMulity.vue'
export default {
	name: 'listContainer',
	components: {
		filterBar,
		settingMulity
	},
	props: {
		getCurrentNode: Function
	},
	data () {
		return {
			tableColumn: [
				{ prop: 'code', label: '品项编号', required: true, sortable: true },
				{ prop: 'name', label: '品项名称', required: true, sortable: true },
				{ prop: 'itemTypeName', label: '所属类别', required: true, sortable: true },
				{ prop: 'unit', label: '最小单位', required: true },
				{ prop: 'spec', label: '品项规格' },
				{ prop: 'assistUnit', label: '辅助单位' },
				{
					prop: 'offsetMethod',
					label: '耗用方式',
					width: '100px',
					formatter: (row) => {
						return this.$fxTypeMiddleware.getCommonTypeItemById('offsetMethodType')(row.offsetMethod).label
					}
				},
				{
					prop: 'consumptionMethod',
					label: '冲减方式',
					width: '160px',
					formatter: (row) => {
						return this.$fxTypeMiddleware.getCommonTypeItemById('consumptionMethodType')(row.consumptionMethod).label
					}
				},
				{ prop: 'financeSort', label: '财务分类' },
				{
					prop: 'enableFlag',
					label: '启停状态',
					required: true,
					fxRender: this.enableRender
				},
				{
					prop: 'haveImage',
					label: '图片上传',
					width: '80px',
					fxRender: this.haveImageRender
				},
				{ prop: 'memo', label: '备注' },
				{ prop: 'sourceName', label: '来源信息' },
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
			organTypeList: this.$fxTypeMiddleware.getCommonTypeList('customerOrganType'),
			recycleShow: false,
			defaultSortParam: { code: 'asc' },
			settingPopperVisible: false,
			settingMulitySelectRows: [],
			itemImgVisible: false,
			itemImgImgUrl: '',
			selectRowsArr: []
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
		initFilterBar () {
			this.$refs.filterBar.onResetClick()
			this.$refs.filterBar.initSelect()
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
				itemTypeId: itemTypeId === '1' ? null : itemTypeId
			}
			return {
				...this.$refs.listTable.getPaginationParams(),
				...this.$fxCommon.getSearchParams('itemList')(params)
			}
		},
		getListData () {
			let api = ''
			if (this.recycleShow) {
				api = 'item.getItemListRecycling'
			} else {
				api = 'item.getItemList'
			}
			return this.$fxApi(api)({ data: this.getSearchParams() }).then(res => {
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
		onEnableClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定启用所选品项？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onEnableHandler(res)
				})
			})
		},
		onEnableHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.item-manage.enable', { item: this.getItemName(selectRows) })
			return this.$fxApi('item.enabelMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onDisableClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定停用所选品项？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onDisableHandler(res)
				})
			})
		},
		onDisableHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.item-manage.disable', { item: this.getItemName(selectRows) })
			return this.$fxApi('item.disableMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onDeletClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定删除所选品项？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onDeleteHandler(res)
				})
			})
		},
		onDeleteHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.item-manage.delete', { item: this.getItemName(selectRows) })
			return this.$fxApi('item.deleteMulity')({ data: params, logger }).then(res => {
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
			this.$refs.listTable.getSingleSelectedRow().then(res => {
				this.$emit('on-edit', res)
			})
		},
		onTableRowDbclick (item) {
			this.$emit('on-edit', item, this.recycleShow)
		},
		enableRender (h, { row }) {
			return <FxListStateTag
				icon={this.enableState(row.enableFlag, 'icon')}
				label={this.enableState(row.enableFlag, 'label')}
			></FxListStateTag>
		},
		haveImageRender (h, { row }) {
			if (row.imageUrl) {
				return <div class="have-image-content">
					<span class="have-image-content-text">是</span>
					<w-icon
						type="image-watch"
						verticalAlign
						pointer
						stop
						class="have-image-content-image"
						vOn:click={this.onWatchImageClick(row)}
					></w-icon></div>
			} else {
				return <span>否</span>
			}
		},
		onWatchImageClick (row) {
			return () => {
				this.itemImgImgUrl = row.imageUrl
				this.$nextTick(() => {
					this.itemImgVisible = true
				})
			}
		},
		onRecoverClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定恢复所选品项？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onRecoverHandler(res)
				})
			})
		},
		onRecoverHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.item-manage.recover', { item: this.getItemName(selectRows) })
			return this.$fxApi('item.recoverMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh', true)
				return Promise.resolve()
			})
		},
		onRecycleDeletClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定删除所选品项？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onRecycleDeleteHandler(res)
				})
			})
		},
		onRecycleDeleteHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.item-manage.recyclingDelete', { item: this.getItemName(selectRows) })
			return this.$fxApi('item.recyclingDeleteMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh', true)
				return Promise.resolve()
			})
		},
		onImportDataClick () {
			this.$emit('on-multiple-import-click', this.selectRowsArr)
		},
		onExportDataClick () {
			const logger = this.$fxLogger.createInfo('basic-archives.item-manage.exportData')
			return this.$fxApi('item.exportData')({ logger }).then(res => {
				this.$fxUtils.downloadFile(res)
			})
		},
		onMulitySettingClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.settingMulitySelectRows = this.$fxUtils.deepClone(res)
			}).catch(() => {
				setTimeout(() => {
					this.settingPopperVisible = false
				}, 0)
			})
		},
		onSelectClick (val) {
			this.selectRowsArr = val.selectedArr
			this.settingPopperVisible = false
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
		justify-content space-between
		.tools-left-right {
			.setting-mulity-btn {
				line-height 32px
			}
		}
	}
}
.create-organ-popover {
	font-size: 12px
	height: 24px;
	line-height: 24px;
	display: flex;
	align-items: center;
	cursor: pointer
	&:hover {
		color: $fxDefaultColor
	}
	&__icon {
		margin-right: 10px
	}
}
>>>.have-image-content {
	display flex
	align-items center
	&-text {
		margin-right 5px
	}
	&-image {
		flex none
	}
}
</style>
