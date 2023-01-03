<template>
	<div class="area-manage-container">
		<filterBar ref="filterBar" @on-search="refresh"></filterBar>
		<fx-list-virtual-table
			ref="areaList"
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
				<el-button v-fx-auth:basic-archives_support-archives_sales-area.edit-sales-area class="order-btn" type="primary" plain @click="onEditClick">编辑</el-button>
				<el-button v-fx-auth:basic-archives_support-archives_sales-area.delete-sales-area class="order-btn" type="danger" plain @click="onDeletClick">删除</el-button>
				<el-button v-fx-auth:basic-archives_support-archives_sales-area.enable-sales-area class="order-btn" type="primary" plain @click="onEnableClick">启用</el-button>
				<el-button v-fx-auth:basic-archives_support-archives_sales-area.disable-sales-area class="order-btn" type="danger" plain @click="onDisableClick">停用</el-button>
				<el-button v-fx-auth:basic-archives_support-archives_sales-area.edit-sales-area class="order-btn" type="primary" plain @click="onMulitySettingClick">批量设置</el-button>
			</div>
			<div slot="btn-tools-right" class="tools-right">
				<el-button v-fx-auth:basic-archives_support-archives_sales-area.add-sales-area type="primary" @click="onCreateClick">新建</el-button>
			</div>
		</fx-list-virtual-table>
		<settingStore ref="settingStore" @on-close="onSettingClose"></settingStore>
		<settingMulityStore ref="settingMulityStore" @on-close="onSettingClose"></settingMulityStore>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import filterBar from './FilterBar.vue'
import FxListStateTag from '@/components/common/Fx-list-state-tag.vue'
import settingStore from '../setting-container/SettingStore.vue'
import settingMulityStore from '../setting-mulity-container/Index.vue'
import { apiName } from '../../Index.vue'
export default {
	name: 'listContainer',
	components: {
		filterBar,
		settingStore,
		settingMulityStore
	},
	props: {
		getCurrentTreeLv: Function
	},
	data () {
		return {
			tableColumn: [
				{ prop: 'code', label: '销售区域编号', required: true, sortable: true },
				{ prop: 'name', label: '销售区域名称', required: true, sortable: true },
				{ prop: 'pinYin', label: '销售区域助记符' },
				{ prop: 'organCode', label: '所属机构编号', sortable: true },
				{ prop: 'organName', label: '所属机构名称', required: true, sortable: true },
				{
					prop: 'store',
					label: '冲减仓库',
					align: 'center',
					headerAlign: 'center',
					required: true,
					fxRender: this.storeSettingRender
				},
				{
					prop: 'enableFlag',
					label: '启停状态',
					required: true,
					fxRender: this.enableRender
				},
				{ prop: 'sourceTypeName', label: '数据来源', required: true, width: '140px' },
				{ prop: 'modifyManName', label: '最新修改人' },
				{
					prop: 'modifyDate',
					label: '最新修改时间',
					width: '160px',
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.modifyDate)
					}
				},
				{ prop: 'createManName', label: '创建人' },
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
			defaultSortParam: { code: 'asc' }
		}
	},
	computed: {
		...mapGetters(['detailsAuthGetter']),
		enableState (val, key) {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('enableState')(val)[key]
			}
		},
		hasEditAuth () {
			return this.detailsAuthGetter('basic-archives_support-archives_sales-area.edit-sales-area')
		}
	},
	methods: {
		refresh () {
			this.$refs.areaList.setPaginationCurrent(1)
			this.$refs.areaList.clearSelected()
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
				sortParams: this.$refs.areaList.getSortKey(),
				treeLV: this.getCurrentTreeLv()
			}
			return {
				...this.$refs.areaList.getPaginationParams(),
				...this.$fxCommon.getSearchParams('salesAreaList')(params)
			}
		},
		getListData () {
			return this.$fxApi(`${apiName}.getPageList`)({ data: this.getSearchParams() }).then(res => {
				this.$refs.areaList.setPaginationTotal(res.total)
				this.tableData = res.result
				return Promise.resolve(res.result)
			})
		},
		onCreateClick () {
			this.$emit('on-create-area')
		},
		createMulityParams (selectRows) {
			return selectRows.map(item => {
				return item.id
			})
		},
		onEnableClick () {
			this.$refs.areaList.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定启用所选销售区域？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onEnableAreaHandler(res)
				})
			})
		},
		onEnableAreaHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.support-archives.sales-area.enable', { selectRows })
			return this.$fxApi(`${apiName}.enableMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onDisableClick () {
			this.$refs.areaList.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定停用所选销售区域？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onDisableAreaHandler(res)
				})
			})
		},
		onDisableAreaHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.support-archives.sales-area.disable', { selectRows })
			return this.$fxApi(`${apiName}.disableMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onDeletClick () {
			this.$refs.areaList.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定删除所选销售区域？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onDeleteAreaHandler(res)
				})
			})
		},
		onDeleteAreaHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.support-archives.sales-area.delete', { selectRows })
			return this.$fxApi(`${apiName}.deleteMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onEditClick () {
			this.onEditHandler().then(res => {
				this.$emit('on-area-edit', res)
			})
		},
		onTableRowDbclick (item) {
			this.getDetails(item).then(res => {
				this.$emit('on-area-edit', res)
			})
		},
		onEditHandler () {
			return this.$refs.areaList.getSingleSelectedRow().then(this.getDetails)
		},
		getDetails (item) {
			const salesAreaDetails = this.$fxUtils.deepClone(item)
			return Promise.resolve(salesAreaDetails)
		},
		enableRender (h, { row }) {
			return <FxListStateTag
				icon={this.enableState(row.enableFlag, 'icon')}
				label={this.enableState(row.enableFlag, 'label')}
			></FxListStateTag>
		},
		onMulitySettingClick () {
			this.$refs.settingMulityStore.open()
		},
		storeSettingRender (h, { row, $index }) {
			h = this.$createElement
			return <w-icon
				type="auth-setting"
				verticalAlign
				pointer
				stop
				disabled={!this.hasEditAuth}
				vOn:click={this.onStoreSettingClick(row)}
			></w-icon>
		},
		onStoreSettingClick (row) {
			return () => {
				this.$refs.settingStore.open(row)
			}
		},
		onSettingClose () {
			this.$emit('on-setting-close')
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.area-manage-container {
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
