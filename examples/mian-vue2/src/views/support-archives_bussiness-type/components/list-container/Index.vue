<template>
	<div class="organ-manage-container">
		<filterBar ref="filterBar" @on-search="refresh"></filterBar>
		<fx-list-virtual-table
			ref="listTable"
			:tableColumn="computedTableColumn"
			:listData="tableData"
			showIndex
			indexContinuous
			@on-page-change="onPageChange"
			@on-table-row-dbclick="onTableRowDbclick"
			@on-sort-change="onSortChange"
		>
			<div slot="btn-tools-left" class="tools-left">
				<el-button v-fx-auth:basic-archives_support-archives_bussiness-type.edit-bussiness class="order-btn" type="primary" plain @click="onEditClick">编辑</el-button>
				<el-button v-fx-auth:basic-archives_support-archives_bussiness-type.delete-bussiness class="order-btn" type="danger" plain @click="onDeletClick">删除</el-button>
				<el-button v-fx-auth:basic-archives_support-archives_bussiness-type.enable-bussiness class="order-btn" type="primary" plain @click="onEnableClick">启用</el-button>
				<el-button v-fx-auth:basic-archives_support-archives_bussiness-type.disable-bussiness class="order-btn" type="danger" plain @click="onDisableClick">停用</el-button>
			</div>
			<div slot="btn-tools-right" class="tools-right">
				<el-button v-fx-auth:basic-archives_support-archives_bussiness-type.add-bussiness type="primary" @click="onCreateClick">新建</el-button>
			</div>
		</fx-list-virtual-table>
		<SettingCorrespondingRelation ref="settingCorrespondingRelation" @again-get-list="getListData"></SettingCorrespondingRelation>
	</div>
</template>
<script>

import filterBar from './FilterBar.vue'
import FxListStateTag from '@/components/common/Fx-list-state-tag.vue'
import SettingCorrespondingRelation from './SettingCorrespondingRelation.vue'
export default {
	name: 'listContainer',
	components: {
		filterBar,
		SettingCorrespondingRelation
	},
	props: {
		columnType: {
			type: String,
			default: 'root'
		},
		fGetTreeId: Function
	},
	data () {
		return {
			tableColumn: [
				{ prop: 'pname', label: '单据种类', required: true, sortable: true },
				{ prop: 'name', label: '业务类型', required: true, sortable: true },
				{
					prop: 'enableFlag',
					label: '启停状态',
					required: true,
					fxRender: this.enableRender
				},
				{
					prop: 'relAllFlag',
					label: '适用单据类型',
					required: true,
					fxRender: this.relAllFlagRender
				},
				{
					prop: 'outInBizTypeRelation',
					label: '对应关系',
					fxRender: this.outInBizTypeRelationRender
				},
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
			tableData: []
		}
	},
	computed: {
		enableState (val, key) {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('enableState')(val)[key]
			}
		},
		computedTableColumn () {
			let column = this.tableColumn
			if (this.fGetTreeId() !== '101') {
				column = column.filter(item => {
					return !['outInBizTypeRelation'].includes(item.prop)
				})
			}
			return column
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
				sortParams: this.$refs.listTable.getSortKey(),
				pid: this.fGetTreeId()
			}
			return {
				...this.$refs.listTable.getPaginationParams(),
				...this.$fxCommon.getSearchParams('bussinessTypeList')(params)
			}
		},
		getListData () {
			return this.$fxApi('bussinessType.getPageList')({ data: this.getSearchParams() }).then(res => {
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
		onDeletClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定删除所选业务类型？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onDeleteHandler(res)
				})
			})
		},
		getName (list) {
			return list.map(item => {
				return item.name
			}).join(',')
		},
		onDeleteHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.support-archives.bussiness-type.delete', { name: this.getName(selectRows) })
			return this.$fxApi('bussinessType.deleteMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onEnableClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定启用所选业务类型？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onEnableHandler(res)
				})
			})
		},
		onEnableHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.support-archives.bussiness-type.enable', { name: this.getName(selectRows) })
			return this.$fxApi('bussinessType.enabelMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onDisableClick () {
			this.$refs.listTable.getSelectedRows().then(res => {
				this.$fxConfirm({
					message: '是否确定停用所选业务类型？',
					selectedRowsLength: res.length
				}).then(() => {
					this.onDisableHandler(res)
				})
			})
		},
		onDisableHandler (selectRows) {
			const params = this.createMulityParams(selectRows)
			const logger = this.$fxLogger.createInfo('basic-archives.support-archives.bussiness-type.disable', { name: this.getName(selectRows) })
			return this.$fxApi('bussinessType.disableMulity')({ data: params, logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onEditClick () {
			this.$refs.listTable.getSingleSelectedRow().then(item => {
				this.$emit('on-edit', item)
			})
		},
		onTableRowDbclick (item) {
			this.$emit('on-edit', item)
		},
		enableRender (h, { row }) {
			return <FxListStateTag
				icon={this.enableState(row.enableFlag, 'icon')}
				label={this.enableState(row.enableFlag, 'label')}
			></FxListStateTag>
		},
		outInBizTypeRelationRender (h, { row }) {
			return <w-link
				vOn:click={this.onOutInBizTypeRelationSettingClick(row)}
			>点击设置</w-link>
		},
		onOutInBizTypeRelationSettingClick (row) {
			return () => {
				event.stopPropagation()
				this.$refs.settingCorrespondingRelation.open(row)
			}
		},
		relAllFlagRender (h, { row }) {
			return <span>{this.relAllFlagText(row)}</span>
		},
		relAllFlagText (row) {
			switch (row.relAllFlag) {
			case 0:
				return '自定义'
			case 1:
				return '全部'
			default:
				return ''
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
