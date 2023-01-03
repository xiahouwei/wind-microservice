<template>
	<div class="organ-manage-container">
		<filterBar ref="filterBar" @on-search="refresh"></filterBar>
		<fx-list-virtual-table
			ref="listTable"
			:tableColumn="tableColumn"
			:listData.sync="tableData"
			:fpGetListData="getListDataHandler"
			showIndex
			indexContinuous
			:defaultSortParam="defaultSortParam"
			@on-page-change="onPageChange"
			@on-table-row-dbclick="onTableRowDbclick"
			@on-sort-change="onSortChange"
		>
			<div slot="btn-tools-left" class="tools-left">
				<el-button v-fx-auth:basic-archives_goods-manage.edit-goods class="order-btn" type="primary" plain @click="onEditClick">编辑</el-button>
				<el-button v-fx-auth:basic-archives_goods-manage.delete-goods class="order-btn" type="danger" plain @click="onDeleteClick">删除</el-button>
				<el-button v-fx-auth:basic-archives_goods-manage.enable-goods class="order-btn" type="primary" plain @click="onEnableClick">启用</el-button>
				<el-button v-fx-auth:basic-archives_goods-manage.disable-goods class="order-btn" type="danger" plain @click="onDisableClick">停用</el-button>
				<el-button v-fx-auth:basic-archives_goods-manage.push-goods class="order-btn" type="primary" plain @click="onPushClick">推送</el-button>
				<el-button v-fx-auth:basic-archives_goods-manage.import-goods class="order-btn" type="primary" plain @click="onImportClick">导入</el-button>
				<el-button v-fx-auth:basic-archives_goods-manage.unbind-goods class="order-btn" type="danger" plain @click="onUnbindClick">解绑</el-button>
			</div>
			<div slot="btn-tools-right" class="tools-right">
				<el-button v-fx-auth:basic-archives_goods-manage.add-goods type="primary" slot="reference" @click="onCreateClick">新建</el-button>
			</div>
		</fx-list-virtual-table>
		<importItem
			ref='importItem'
			@refresh='refresh'
		></importItem>
	</div>
</template>
<script>
import filterBar from './FilterBar.vue'
import FxListStateTag from '@/components/common/Fx-list-state-tag.vue'
import { apiName } from '../../Index.vue'
import importItem from '../import-container/Index.vue'
export default {
	name: 'listContainer',
	components: {
		filterBar,
		importItem
	},
	data () {
		return {
			tableColumn: [
				{ prop: 'code', label: '商品编码', required: true, sortable: true, width: '140px' },
				{ prop: 'name', label: '商品名称', required: true, sortable: true },
				{ prop: 'secondary_name', label: '副名称', required: true, sortable: true, sortKey: 'secondary_name' },
				{
					prop: 'spec_count',
					label: '规格数量',
					required: true
				},
				{ prop: 'channel', label: '销售渠道', fxRender: this.channelRender },
				{
					prop: 'enableFlag',
					label: '启停状态',
					required: true,
					fxRender: this.enableRender
				},
				{
					prop: 'source',
					label: '来源',
					formatter: (row) => {
						return this.$fxTypeMiddleware.getCommonTypeItemById('create_type')(row.create_type).name
					}
				},
				{
					prop: 'create_date',
					label: '创建时间',
					width: '140px'
				}
			],
			tableData: [],
			defaultSortParam: { code: 'desc' }
		}
	},
	computed: {
		enableState () {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('enableState')(val ? 1 : 0)[key]
			}
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
			const params = {
				...this.$refs.filterBar.getFilterParams(),
				sortParams: this.$refs.listTable.getSortKey()
			}
			return {
				...this.$refs.listTable.getPaginationParams(),
				...this.$fxCommon.getSearchParams('goodsList')(params)
			}
		},
		getListData () {
			return this.getListDataHandler().then(res => {
				this.$refs.listTable.setPaginationTotal(res.total)
				this.tableData = res.result
				return Promise.resolve(res.result)
			})
		},
		getListDataHandler () {
			return this.$fxApi(`${apiName}.getPage`)({ data: this.getSearchParams() }).then(res => {
				return Promise.resolve(res)
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
		getName (list) {
			return list.map(item => {
				return item.name
			}).join(',')
		},
		onEnableClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定启用所选商品？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onEnableHandler(res)
				})
			})
		},
		onEnableHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.goods-manage.enable', { names: this.getName(selectRows) })
			return this.$fxApi(`${apiName}.enabelMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onDisableClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定停用所选商品？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onDisableHandler(res)
				})
			})
		},
		onDisableHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.goods-manage.disable', { names: this.getName(selectRows) })
			return this.$fxApi(`${apiName}.disableMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onDeleteClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定删除所选商品？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onDeleteHandler(res)
				})
			})
		},
		onDeleteHandler (selectRows) {
			const params = selectRows.map(item => {
				return item.id
			})
			const logger = this.$fxLogger.createInfo('basic-archives.goods-manage.delete', { names: this.getName(selectRows) })
			return this.$fxApi(`${apiName}.deleteMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onUnbindClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定解绑所选商品？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onUnbindHandler(res)
				})
			})
		},
		onUnbindHandler (selectRows) {
			const params = selectRows.map(item => {
				return item.id
			})
			const logger = this.$fxLogger.createInfo('basic-archives.goods-manage.unbind', { names: this.getName(selectRows) })
			return this.$fxApi(`${apiName}.unbindMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onPushClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定推送所选商品？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onPushHandler(res)
				})
			})
		},
		onPushHandler (selectRows) {
			const params = selectRows.map(item => {
				return item.id
			})
			const logger = this.$fxLogger.createInfo('basic-archives.goods-manage.push', { names: this.getName(selectRows) })
			return this.$fxApi(`${apiName}.pushMulity`)({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onEditClick () {
			this.$refs.listTable.getSingleSelectedRow().then(res => {
				this.$emit('on-edit', res.id)
			})
		},
		onTableRowDbclick (item) {
			this.$emit('on-edit', item.id)
		},
		enableRender (h, { row }) {
			return <FxListStateTag
				icon={this.enableState(row.enable_flag, 'icon')}
				label={this.enableState(row.enable_flag, 'label')}
			></FxListStateTag>
		},
		channelRender (h, { row }) {
			const count = row.channel_types && row.channel_types.length
			if (count) {
				return <div
				>
					<div class='channel_icon'>极</div>
					共{count}个
				</div>
			} else {
				return <span>未推送</span>
			}
		},
		onImportClick () {
			this.$refs.importItem.open()
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
>>>.channel_icon {
	display: inline-block
	width: 20px
	height: 20px
	text-align: center
	line-height: 20px
	border-radius: 4px
	margin-right: 4px
	background-color $fxBlue
	color: #fff
}
</style>
