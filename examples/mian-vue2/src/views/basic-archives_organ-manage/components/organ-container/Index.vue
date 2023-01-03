<template>
	<div class="organ-manage-container">
		<filterBar ref="filterBar" @on-search="refresh"></filterBar>
		<fx-list-virtual-table
			ref="organList"
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
					<el-button v-fx-auth:basic-archives_organ-manage.edit-organ class="order-btn" type="primary" plain @click="onEditOrganClick">编辑</el-button>
					<el-button v-fx-auth:basic-archives_organ-manage.delete-organ class="order-btn" type="danger" plain @click="onDeletOrganClick">删除</el-button>
					<el-button v-fx-auth:basic-archives_organ-manage.enable-organ class="order-btn" type="primary" plain @click="onEnableOrganClick">启用</el-button>
					<el-button v-fx-auth:basic-archives_organ-manage.disable-organ class="order-btn" type="danger" plain @click="onDisableOrganClick">停用</el-button>
					<el-button v-fx-auth:basic-archives_organ-manage.export-organ class="order-btn" type="primary" plain @click="onExportDataClick">导出</el-button>
					<el-button v-fx-auth:basic-archives_organ-manage.recover-organ slot="recycle" class="order-btn" type="primary" plain @click="onRecoverClick">恢复</el-button>
					<el-button v-fx-auth:basic-archives_organ-manage.delete-organ slot="recycle" class="order-btn" type="danger" plain @click="onRecycleDeletClick">删除</el-button>
				</fx-list-btn-tools>
			</div>
			<div slot="btn-tools-right" class="tools-right">
				<w-popover
					placement="bottom"
					trigger="click">
					<template v-for="item in organTypeList" >
						<div
							:key="item.id"
							v-fx-auth="detailsAuthGetter(`basic-archives_organ-manage.add-${item.type}`)"
							class="create-organ-popover"
							@click="onCreateOrganClick(item)"
						>
							<w-icon :type="item.icon" class="create-organ-popover__icon" ></w-icon>{{item.label}}
						</div>
					</template>
					<el-button v-fx-auth:basic-archives_organ-manage.add-shop|add-rdc|add-store|add-section type="primary" slot="reference">新建</el-button>
				</w-popover>
			</div>
		</fx-list-virtual-table>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import filterBar from './FilterBar.vue'
import FxListStateTag from '@/components/common/Fx-list-state-tag.vue'

export const BILL_TYPE = 'OrganManage'
export default {
	name: 'organContainer',
	components: {
		filterBar
	},
	props: {
		getCurrentTreeLv: Function
	},
	data () {
		return {
			tableColumn: [
				{ prop: 'code', label: '机构编号', required: true, sortable: true },
				{ prop: 'name', label: '机构名称', required: true, sortable: true },
				{ prop: 'parentOrgan', label: '上级机构', required: true },
				{
					prop: 'organType',
					label: '机构类型',
					formatter: (row) => {
						return this.$fxTypeMiddleware.getCommonTypeItemById('organType')(row.organType).label
					}
				},
				{ prop: 'accounting', label: '会计期' },
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
				{
					prop: 'endDate',
					label: '到期时间',
					width: '160px',
					sortable: true,
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.endDate)
					}
				},
				{ prop: 'modifyUserName', label: '最新修改人' },
				{
					prop: 'modifyDate',
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
			organTypeList: this.$fxTypeMiddleware.getCommonTypeList('organType'),
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
			this.$refs.filterBar.getFilterOrganSelectList()
		},
		refresh () {
			this.$refs.organList.setPaginationCurrent(1)
			this.$refs.organList.clearSelected()
			return this.getListData()
		},
		clearSelected () {
			this.$refs.organList.clearSelected()
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
				sortParams: this.$refs.organList.getSortKey(),
				treeLV: this.getCurrentTreeLv()
			}
			return {
				...this.$refs.organList.getPaginationParams(),
				...this.$fxCommon.getSearchParams('organList')(params)
			}
		},
		getListData () {
			let api = ''
			if (this.recycleShow) {
				api = 'organ.getOrganListRecycling'
			} else {
				api = 'organ.getOrganList'
			}
			return this.$fxApi(api)({ data: this.getSearchParams() }).then(res => {
				this.$refs.organList.setPaginationTotal(res.total)
				this.tableData = res.result
				return Promise.resolve(res.result)
			})
		},
		onCreateOrganClick (organType) {
			this.$emit('on-create-organ', organType)
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
		getShopName (list) {
			return list.map(item => {
				return item.name
			}).join(',')
		},
		onEnableOrganClick () {
			this.$refs.organList.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定启用所选机构？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onEnableOrganHandler(res)
				})
			})
		},
		onEnableOrganHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.organ-manage.enable', { shop: this.getShopName(selectRows) })
			return this.$fxApi('organ.organEnable')({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onDisableOrganClick () {
			this.$refs.organList.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定停用所选机构？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onDisableOrganHandler(res)
				})
			})
		},
		onDisableOrganHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.organ-manage.disable', { shop: this.getShopName(selectRows) })
			return this.$fxApi('organ.organDisable')({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onDeletOrganClick () {
			this.$refs.organList.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定删除所选机构？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onDeleteOrganHandler(res)
				})
			})
		},
		onDeleteOrganHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.organ-manage.delete', { shop: this.getShopName(selectRows) })
			return this.$fxApi('organ.organDelete')({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onEditOrganClick () {
			this.$refs.organList.getSingleSelectedRow().then(res => {
				this.$emit('on-organ-edit', res, this.recycleShow)
			})
		},
		onTableRowDbclick (item) {
			this.$emit('on-organ-edit', item, this.recycleShow)
		},
		enableRender (h, { row }) {
			return <FxListStateTag
				icon={this.enableState(row.enableFlag, 'icon')}
				label={this.enableState(row.enableFlag, 'label')}
			></FxListStateTag>
		},
		onRecoverClick () {
			this.$refs.organList.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定恢复所选机构？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onRecoverHandler(res)
				})
			})
		},
		onRecoverHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.organ-manage.recover', { shop: this.getShopName(selectRows) })
			return this.$fxApi('organ.recoverMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh', true)
				return Promise.resolve()
			})
		},
		onRecycleDeletClick () {
			this.$refs.organList.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定删除所选机构？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onRecycleDeleteHandler(res)
				})
			})
		},
		onRecycleDeleteHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.organ-manage.recyclingDelete', { shop: this.getShopName(selectRows) })
			return this.$fxApi('organ.recyclingDeleteMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh', true)
				return Promise.resolve()
			})
		},
		onExportDataClick () {
			const logger = this.$fxLogger.createInfo('basic-archives.organ-manage.exportData')
			return this.$fxApi('organ.exportData')({ logger }).then(res => {
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
