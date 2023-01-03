<template>
	<div class="organ-manage-container">
		<filterBar ref="filterBar" @on-search="refresh"></filterBar>
		<fx-list-virtual-table
			ref="listTable"
			:tableColumn="tableColumnComputed"
			:listData="tableData"
			:selectMulity="false"
			showIndex
			indexContinuous
			:defaultSortParam="defaultSortParam"
			@on-page-change="onPageChange"
			@on-table-row-dbclick="onTableRowDbclick"
			@on-sort-change="onSortChange"
		>
			<div slot="btn-tools-left" class="tools-left">
				<el-button v-fx-auth:financial-manage_account-period.edit-account-period="isRoot" class="order-btn" type="primary" plain @click="onEditClick">编辑</el-button>
				<el-button v-fx-auth:financial-manage_account-period.delete-account-period="isRoot" class="order-btn" type="danger" plain @click="onDeletClick">删除</el-button>
				<el-button v-fx-auth:financial-manage_account-period.enable-account-period="!isRoot" class="order-btn" type="primary" plain @click="onEnableClick">启用</el-button>
				<el-button v-fx-auth:financial-manage_account-period.enable-account-period="isRoot" class="order-btn" type="primary" plain @click="onMulityEnableClick">启用</el-button>
				<el-button v-fx-auth:financial-manage_account-period.unable-account-period="!isRoot" class="order-btn" type="danger" plain @click="onDisableClick">取消启用</el-button>
				<el-button v-fx-auth:financial-manage_account-period.unable-account-period="isRoot" class="order-btn" type="danger" plain @click="onMulityDisableClick">取消启用</el-button>
			</div>
			<div slot="btn-tools-right" class="tools-right">
				<el-button v-fx-auth:financial-manage_account-period.add-account-period type="primary" @click="onCreateClick">新建</el-button>
			</div>
		</fx-list-virtual-table>
	</div>
</template>
<script>

import filterBar from './FilterBar.vue'
import FxListStateTag from '@/components/common/Fx-list-state-tag.vue'
const COLUMN_PROPS = {
	root: ['year', 'month', 'beginDate', 'endDate', 'modifyUserName', 'modifyDate', 'createUserName', 'createDate'],
	organ: ['year', 'month', 'beginDate', 'endDate', 'accountingState', 'modifyUserName', 'modifyDate']
}
export default {
	name: 'listContainer',
	components: {
		filterBar
	},
	props: {
		getCurrentTreeOrganId: Function,
		getCurrentNode: Function,
		columnType: {
			type: String,
			default: 'root'
		}
	},
	data () {
		return {
			tableColumn: [
				{ prop: 'year', label: '会计年', required: true, sortable: true },
				{ prop: 'month', label: '会计月', required: true, sortable: true },
				{ prop: 'beginDate', label: '开始日期', width: '160px' },
				{ prop: 'endDate', label: '结束日期', width: '160px' },
				{
					prop: 'accountingState',
					label: '月结状态',
					fxRender: this.accountingRender
				},
				{ prop: 'modifyUserName', label: '最新修改人' },
				{
					prop: 'modifyDate',
					label: '最新修改时间',
					width: '140px',
					formatter: (row) => {
						return row.modifyDate && this.$fxUtils.formatterDateTime(row.modifyDate)
					}
				},
				{ prop: 'createUserName', label: '创建人' },
				{
					prop: 'createDate',
					label: '创建时间',
					width: '140px',
					formatter: (row) => {
						return row.createDate && this.$fxUtils.formatterDateTime(row.createDate)
					}
				}
			],
			tableData: [],
			defaultSortParam: { year: 'desc', month: 'desc' }
		}
	},
	computed: {
		accountingState (val, key) {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('accountingState')(val)[key]
			}
		},
		tableColumnComputed () {
			return COLUMN_PROPS[this.columnType].map(item => {
				return this.tableColumn.find(colItem => {
					return colItem.prop === item
				})
			})
		},
		isRoot () {
			const organId = this.getCurrentTreeOrganId()
			return !organId
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
				organId: this.getCurrentTreeOrganId()
			}
			return {
				...this.$refs.listTable.getPaginationParams(),
				...this.$fxCommon.getSearchParams('accountList')(params)
			}
		},
		getListData () {
			return this.$fxApi('account.getPageList')({ data: this.getSearchParams() }).then(res => {
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
			this.$refs.listTable.getSelectedRows().then(([account]) => {
				this.$fxConfirm(`您是否确认把【${account.year}年-第${account.month}期】启用为【当前会计期】？`).then(() => {
					this.onEnableHandler(account)
				})
			})
		},
		onEnableHandler (selectRow) {
			const organName = this.getCurrentNode().name
			const logger = this.$fxLogger.createInfo('financial-manage.account-period.enable', { organName, account: selectRow })
			const organId = this.getCurrentTreeOrganId()
			return this.$fxApi('account.enabel', selectRow.id, organId)({ logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onDisableClick () {
			this.checkAccountByOneOrgan().then(res => {
				if (!res) {
					this.$fxMessage.error('没有启用的会计期')
				} else {
					this.$fxConfirm('您确认要取消已经启用的会计期吗？').then(this.onDisableHandler)
				}
			})
		},
		onDisableHandler () {
			const organName = this.getCurrentNode().name
			const logger = this.$fxLogger.createInfo('financial-manage.account-period.disable', { organName })
			const organId = this.getCurrentTreeOrganId()
			return this.$fxApi('account.cancelEnabel', organId)({ logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onDeletClick () {
			this.$refs.listTable.getSelectedRows().then(([account]) => {
				this.$fxConfirm(`警告：会计期的删除只能删除整个会计年，确定要删除【${account.year}】会计年吗？`).then(() => {
					this.onDeleteHandler(account)
				})
			})
		},
		onDeleteHandler (selectRow) {
			const logger = this.$fxLogger.createInfo('financial-manage.account-period.delete', { year: selectRow.year })
			return this.$fxApi('account.delete', selectRow.id)({ logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onEditClick () {
			this.$refs.listTable.getSelectedRows().then(([item]) => {
				this.$emit('on-edit', item)
			})
		},
		onTableRowDbclick (item) {
			if (!this.isRoot) {
				return false
			}
			this.$emit('on-edit', item)
		},
		onMulityEnableClick () {
			this.$refs.listTable.getSelectedRows().then(([account]) => {
				this.checkAccountOrgan().then(res => {
					const message = res ? `重要提示：部分机构已经使用过会计期，本次启用只针对尚未启用会计期的机构，您是否确认把【${account.year}年-第${account.month}期】启用为【当前会计期】？` : `您是否确认把【${account.year}年-第${account.month}期】启用为【当前会计期】？`
					this.$fxConfirm(message).then(() => {
						this.onMulityEnableHandler(account)
					})
				})
			})
		},
		onMulityEnableHandler (selectRow) {
			const logger = this.$fxLogger.createInfo('financial-manage.account-period.mulityEnable', { account: selectRow })
			return this.$fxApi('account.enabelMulity', selectRow.id)({ logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		onMulityDisableClick () {
			this.checkAccountOrgan().then(res => {
				if (!res) {
					this.$fxMessage.error('没有启用的会计期')
				} else {
					this.$fxConfirm('您确认要取消已经启用的会计期吗？').then(this.onMulityDisableHandler)
				}
			})
		},
		onMulityDisableHandler () {
			const logger = this.$fxLogger.createInfo('financial-manage.account-period.mulityDisable', {})
			return this.$fxApi('account.disableMulity')({ logger }).then(res => {
				this.$emit('on-refresh')
				return Promise.resolve()
			})
		},
		checkAccountOrgan () {
			return this.$fxApi('account.checkAccountOrgan')
		},
		checkAccountByOneOrgan () {
			const organId = this.getCurrentTreeOrganId()
			return this.$fxApi('account.checkAccountByOneOrgan', organId)
		},
		accountingRender (h, { row }) {
			return <FxListStateTag
				icon={this.accountingState(row.accountingState, 'icon')}
				label={this.accountingState(row.accountingState, 'label')}
			></FxListStateTag>
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
