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
					<el-button v-fx-auth:basic-archives_customer-manage.edit-customer  class="order-btn" type="primary" plain @click="onEditClick">编辑</el-button>
					<el-button v-fx-auth:basic-archives_customer-manage.delete-customer class="order-btn" type="danger" plain @click="onDeletClick">删除</el-button>
					<el-button v-fx-auth:basic-archives_customer-manage.enable-customer class="order-btn" type="primary" plain @click="onEnableClick">启用</el-button>
					<el-button v-fx-auth:basic-archives_customer-manage.disable-customer class="order-btn" type="danger" plain @click="onDisableClick">停用</el-button>
					<el-button v-fx-auth:basic-archives_customer-manage.export-customer class="order-btn" type="primary" plain @click="onExportDataClick">导出</el-button>
					<el-button v-fx-auth:basic-archives_customer-manage.recover-customer slot="recycle" class="order-btn" type="primary" plain @click="onRecoverClick">恢复</el-button>
					<el-button v-fx-auth:basic-archives_customer-manage.delete-customer slot="recycle" class="order-btn" type="danger" plain @click="onRecycleDeletClick">删除</el-button>
				</fx-list-btn-tools>
				<div class="tools-left-right">
					<w-popover
						v-fx-auth:basic-archives_customer-manage.edit-customer
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
				<w-popover
					placement="bottom"
					trigger="click">
					<template v-for="item in organTypeList" >
						<div
							v-fx-auth="detailsAuthGetter(`basic-archives_customer-manage.add-${item.type}`)"
							:key="item.id"
							class="create-organ-popover"
							@click="onCreateClick(item)"
						>
							<w-icon :type="item.icon" class="create-organ-popover__icon" ></w-icon>{{item.label}}
						</div>
					</template>
					<el-button v-fx-auth:basic-archives_customer-manage.add-customer|add-store|add-section type="primary" slot="reference">新建</el-button>
				</w-popover>
			</div>
		</fx-list-virtual-table>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
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
		getCurrentTreeLv: Function
	},
	data () {
		return {
			tableColumn: [
				{ prop: 'code', label: '客户编号', required: true, sortable: true },
				{ prop: 'name', label: '客户名称', required: true, sortable: true },
				// { prop: 'parentOrgan', label: '上级机构', required: true },
				// {
				// 	prop: 'organType',
				// 	label: '机构类型',
				// 	formatter: (row) => {
				// 		return this.$fxTypeMiddleware.getCommonTypeItemById('customerOrganType')(row.organType).label
				// 	}
				// },
				{
					prop: 'enableFlag',
					label: '启停状态',
					required: true,
					fxRender: this.enableRender
				},
				// { prop: 'tag', label: '标签' },
				{ prop: 'linkMan', label: '联系人' },
				{ prop: 'phone', label: '联系方式' },
				{ prop: 'memo', label: '备注' },
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
			organTypeList: this.$fxTypeMiddleware.getCommonTypeList('customerOrganType'),
			recycleShow: false,
			defaultSortParam: { code: 'asc' },
			settingPopperVisible: false,
			settingMulitySelectRows: []
		}
	},
	computed: {
		enableState () {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('enableState')(val)[key]
			}
		},
		...mapGetters(['detailsAuthGetter'])
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
				...this.$fxCommon.getSearchParams('customerList')(params)
			}
		},
		getListData () {
			let api = ''
			if (this.recycleShow) {
				api = 'customer.getCustomListRecycling'
			} else {
				api = 'customer.getCustomList'
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
					message: '是否确定启用所选客户？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onEnableHandler(res)
				})
			})
		},
		onEnableHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.customer-manage.enable', { customer: this.getCustomerName(selectRows) })
			return this.$fxApi('customer.enabelMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onDisableClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定停用所选客户？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onDisableHandler(res)
				})
			})
		},
		onDisableHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.customer-manage.disable', { customer: this.getCustomerName(selectRows) })
			return this.$fxApi('customer.disableMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onDeletClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定删除所选客户？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onDeleteHandler(res)
				})
			})
		},
		onDeleteHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.customer-manage.delete', { customer: this.getCustomerName(selectRows) })
			return this.$fxApi('customer.deleteMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		getCustomerName (list) {
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
					message: '是否确定恢复所选客户？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onRecoverHandler(res)
				})
			})
		},
		onRecoverHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.customer-manage.recover', { customer: this.getCustomerName(selectRows) })
			return this.$fxApi('customer.recoverMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh', true)
				return Promise.resolve()
			})
		},
		onRecycleDeletClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定删除所选客户？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onRecycleDeleteHandler(res)
				})
			})
		},
		onRecycleDeleteHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.customer-manage.recyclingDelete', { customer: this.getCustomerName(selectRows) })
			return this.$fxApi('customer.recyclingDeleteMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh', true)
				return Promise.resolve()
			})
		},
		onExportDataClick () {
			const logger = this.$fxLogger.createInfo('basic-archives.customer-manage.exportData')
			return this.$fxApi('customer.exportData')({ logger }).then(res => {
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
		onSelectClick () {
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
</style>
