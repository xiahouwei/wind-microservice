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
				<el-button v-fx-auth:production-manage_dosing-default-house.edit-dosingDefaultHouse class="order-btn" type="primary" plain @click="onEditClick">编辑</el-button>
				<el-button v-fx-auth:production-manage_dosing-default-house.delete-dosingDefaultHouse class="order-btn" type="danger" plain @click="onDeletClick">删除</el-button>
			</div>
			<div slot="btn-tools-right" class="tools-right">
				<el-button v-fx-auth:production-manage_dosing-default-house.add-dosingDefaultHouse type="primary" slot="reference" @click="onCreateClick">新建</el-button>
			</div>
		</fx-list-virtual-table>
		<connectItemDialog ref="connectItemDialog"></connectItemDialog>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import filterBar from './FilterBar.vue'
import connectItemDialog from '../connect-container/Index.vue'
export default {
	name: 'listContainer',
	components: {
		filterBar,
		connectItemDialog
	},
	data () {
		return {
			tableColumn: [
				{ prop: 'organCode', label: '加工机构编号' },
				{ prop: 'organName', label: '加工机构名称', required: true },
				{
					prop: 'defaultHouseType',
					label: '默认仓库类型',
					formatter: (row) => {
						return row.defaultHouseType ? this.defaultHouseTypeList[1].label : this.defaultHouseTypeList[0].label
					}
				},
				{ prop: 'houseCode', label: '仓库编号' },
				{ prop: 'houseName', label: '仓库名称', required: true },
				{
					prop: 'connectEmployee',
					label: '关联配料品项',
					width: '80px',
					align: 'center',
					headerAlign: 'center',
					required: true,
					fxRender: this.connectItemRender
				},
				{ prop: 'modifyManName', label: '最新修改人' },
				{
					prop: 'modifyDate',
					label: '最新修改时间',
					width: '140px',
					sortable: true,
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.modifyDate)
					}
				},
				{ prop: 'createManName', label: '创建人' },
				{
					prop: 'createDate',
					label: '创建时间',
					width: '140px',
					sortable: true,
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.createDate)
					}
				}
			],
			defaultHouseTypeList: this.$fxTypeMiddleware.getCommonTypeList('defaultHouseType'),
			tableData: [],
			defaultSortParam: { modifyDate: 'desc' }
		}
	},
	computed: {
		...mapGetters(['detailsAuthGetter']),
		canEdit () {
			return this.detailsAuthGetter('production-manage_dosing-default-house.edit-dosingDefaultHouse')
		},
		canConnect () {
			return this.detailsAuthGetter('production-manage_dosing-default-house.connect-dosingDefaultHouse')
		}
	},
	methods: {
		refresh () {
			this.$refs.listTable.setPaginationCurrent(1)
			this.$refs.listTable.clearSelected()
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
				sortParams: this.$refs.listTable.getSortKey()
			}
			return {
				...this.$refs.listTable.getPaginationParams(),
				...this.$fxCommon.getSearchParams('dosingDefaultHouseList')(params)
			}
		},
		getListData () {
			return this.$fxApi('dosingDefaultHouse.getPage')({ data: this.getSearchParams() }).then(res => {
				this.$refs.listTable.setPaginationTotal(res.total)
				this.tableData = res.result
				return Promise.resolve(res.result)
			})
		},
		onCreateClick () {
			this.$emit('on-create')
		},
		onDeletClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm('是否确定删除所选数据？').then(() => {
					this.onDeleteHandler(res)
				})
			})
		},
		onDeleteHandler (selectRows) {
			const params = selectRows.map(item => {
				return item.id
			})
			const logger = this.$fxLogger.createInfo('production-manage.dosing-default-house.deleteMulity', { loggerInfo: this.getLoggerInfo(selectRows) })
			return this.$fxApi('dosingDefaultHouse.deleteMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		getLoggerInfo (list) {
			return list.map(item => {
				const defaultHouseTypeLogger = item.defaultHouseType ? '默认领用出库仓库' : '默认加工出库仓库'
				return `加工机构名称:${item.organName},默认仓库类型:${defaultHouseTypeLogger},仓库名称:${item.houseName}`
			}).join(';')
		},
		onEditClick () {
			this.$refs.listTable.getSingleSelectedRow().then(res => {
				return this.$fxApi('dosingDefaultHouse.getDetails', res.id).then(res => {
					this.$emit('on-edit', res)
					return Promise.resolve()
				})
			})
		},
		clearSelected () {
			this.$refs.listTable.clearSelected()
		},
		onTableRowDbclick (item) {
			return this.$fxApi('dosingDefaultHouse.getDetails', item.id).then(res => {
				this.$emit('on-edit', res)
			})
		},
		connectItemRender (h, { row, $index }) {
			h = this.$createElement
			return <w-icon
				type="connect-item"
				verticalAlign
				pointer
				disabled={!this.canConnect}
				vOn:click={this.onConnectItemClick(row)}
			></w-icon>
		},
		onConnectItemClick (row) {
			return () => {
				event.stopPropagation()
				this.$refs.connectItemDialog.open(row)
			}
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
