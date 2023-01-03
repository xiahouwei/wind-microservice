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
				<fx-list-btn-tools v-model="recycleShow" @on-recycle-change="refresh">
					<el-button v-fx-auth:basic-archives_supplier-manage.edit-supplier class="order-btn" type="primary" plain @click="onEditClick">编辑</el-button>
					<el-button v-fx-auth:basic-archives_supplier-manage.delete-supplier class="order-btn" type="danger" plain @click="onDeletClick">删除</el-button>
					<el-button v-fx-auth:basic-archives_supplier-manage.enable-supplier class="order-btn" type="primary" plain @click="onEnableClick">启用</el-button>
					<el-button v-fx-auth:basic-archives_supplier-manage.disable-supplier class="order-btn" type="danger" plain @click="onDisableClick">停用</el-button>
					<el-button v-fx-auth:basic-archives_supplier-manage.export-supplier class="order-btn" type="primary" plain @click="onExportDataClick">导出</el-button>
					<el-button v-fx-auth:basic-archives_supplier-manage.recover-organ slot="recycle" class="order-btn" type="primary" plain @click="onRecoverClick">恢复</el-button>
					<el-button v-fx-auth:basic-archives_supplier-manage.delete-supplier slot="recycle" class="order-btn" type="danger" plain @click="onRecycleDeletClick">删除</el-button>
				</fx-list-btn-tools>
			</div>
			<div slot="btn-tools-right" class="tools-right">
				<w-popover
					placement="bottom"
					trigger="click">
					<template v-for="item in organTypeList" >
						<div
							v-fx-auth="detailsAuthGetter(`basic-archives_supplier-manage.add-${item.type}`)"
							:key="item.id"
							class="create-organ-popover"
							@click="onCreateClick(item)"
						>
							<w-icon :type="item.icon" class="create-organ-popover__icon" ></w-icon>{{item.label}}
						</div>
					</template>
					<el-button  v-fx-auth:basic-archives_supplier-manage.add-supplier|add-store|add-section type="primary" slot="reference">新建</el-button>
				</w-popover>
			</div>
		</fx-list-virtual-table>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import filterBar from './FilterBar.vue'
import FxListStateTag from '@/components/common/Fx-list-state-tag.vue'
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
				{ prop: 'code', label: '供货商编号', required: true, sortable: true },
				{ prop: 'name', label: '供货商名称', required: true, sortable: true },
				{
					prop: 'enableFlag',
					label: '启停状态',
					required: true,
					fxRender: this.enableRender
				},
				{ prop: 'linkMan', label: '联系人' },
				{ prop: 'phone', label: '联系方式' },
				{ prop: 'memo', label: '备注' },
				{ prop: 'modifyUserName', label: '最新修改人' },
				{
					rop: 'modifyDate',
					label: '最新修改时间',
					width: '160px',
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.modifyDate)
					}
				},
				{ prop: 'createUserName', label: '创建人' },
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
			organTypeList: this.$fxTypeMiddleware.getCommonTypeList('supplierType'),
			recycleShow: false,
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
			this.$refs.filterBar.initSelect()
		},
		refresh () {
			this.$refs.listTable.setPaginationCurrent(1)
			this.$refs.listTable.clearSelected()
			return this.getListData()
		},
		clearSelected () {
			this.$refs.listTable.clearSelected()
			return Promise.resolve()
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
				treeLV: this.getCurrentTreeLv()
			}
			return {
				...this.$refs.listTable.getPaginationParams(),
				...this.$fxCommon.getSearchParams('supplierList')(params)
			}
		},
		getListData () {
			let api = ''
			if (this.recycleShow) {
				api = 'supplier.getSupplierListRecycling'
			} else {
				api = 'supplier.getSupplierList'
			}
			return this.$fxApi(api)({ data: this.getSearchParams() }).then(res => {
				this.$refs.listTable.setPaginationTotal(res.total)
				this.tableData = res.result
				return Promise.resolve(res.result)
			})
		},
		onCreateClick (type) {
			this.$emit('on-create', type)
		},
		createMulityParams (selectRows) {
			const organIds = selectRows.filter(item => {
				return item.organLevel === '1'
			}).map(item => {
				return item.id
			})
			const subOrganIds = selectRows.filter(item => {
				return item.organLevel === '2'
			}).map(item => {
				return item.id
			})
			return {
				organIds,
				subOrganIds
			}
		},
		onEnableClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定启用所选供货商？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onEnableHandler(res)
				})
			})
		},
		onEnableHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.supplier-manage.enable', { supplier: this.getSupplierName(selectRows) })
			return this.$fxApi('supplier.enabelMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onDisableClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定停用所选供货商？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onDisableHandler(res)
				})
			})
		},
		onDisableHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.supplier-manage.disable', { supplier: this.getSupplierName(selectRows) })
			return this.$fxApi('supplier.disableMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onDeletClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定删除所选供货商？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onDeleteHandler(res)
				})
			})
		},
		onDeleteHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.supplier-manage.delete', { supplier: this.getSupplierName(selectRows) })
			return this.$fxApi('supplier.deleteMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		getSupplierName (list) {
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
		onRecoverClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定恢复所选供货商？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onRecoverHandler(res)
				})
			})
		},
		onRecoverHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.supplier-manage.recover', { supplier: this.getSupplierName(selectRows) })
			return this.$fxApi('supplier.recoverMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh', true)
				return Promise.resolve()
			})
		},
		onRecycleDeletClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定删除所选供货商？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onRecycleDeleteHandler(res)
				})
			})
		},
		onRecycleDeleteHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.supplier-manage.recyclingDelete', { supplier: this.getSupplierName(selectRows) })
			return this.$fxApi('supplier.recyclingDeleteMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh', true)
				return Promise.resolve()
			})
		},
		onExportDataClick () {
			const logger = this.$fxLogger.createInfo('basic-archives.supplier-manage.exportData')
			return this.$fxApi('supplier.exportData')({ logger }).then(res => {
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
</style>
