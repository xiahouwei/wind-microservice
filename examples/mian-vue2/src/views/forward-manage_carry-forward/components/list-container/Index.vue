<template>
	<div class="organ-manage-container" v-loading="loading">
		<filterBar ref="filterBar" @on-search="refresh"></filterBar>
		<fx-list-virtual-table
			ref="listTable"
			:tableColumn="tableColumn"
			:listData="tableData"
			showIndex
			indexContinuous
			:defaultSortParam="defaultSortParam"
			@on-page-change="onPageChange"
		>
			<div slot="btn-tools-left" class="tools-left">
				<el-button v-fx-auth:financial-manage_carry-forward.carryForward class="order-btn" type="primary" plain @click="onCarryForward">结转</el-button>
				<el-button v-fx-auth:financial-manage_carry-forward.reverseCarryForward class="order-btn" type="danger" plain @click="onReverseCarryForward">反结转</el-button>
			</div>
		</fx-list-virtual-table>
	</div>
</template>
<script>

import filterBar from './FilterBar.vue'
import FxListStateTag from '@/components/common/Fx-list-state-tag.vue'
import { apiName } from '../../Index.vue'
export default {
	name: 'listContainer',
	components: {
		filterBar
	},
	props: {
		getCurrentTreeOrganId: Function
	},
	data () {
		return {
			tableColumn: [
				{ prop: 'CODE', label: '机构编号', required: true },
				{ prop: 'name', label: '机构名称', required: true },
				{
					prop: 'organType',
					label: '机构类型',
					align: 'center',
					headerAlign: 'center',
					width: '100px',
					formatter: (row) => {
						return this.$fxTypeMiddleware.getCommonTypeItemById('allOrganTypeSimple')(row.organType).name
					}
				},
				{
					prop: 'enableFlag',
					label: '启停状态',
					width: '100px',
					required: true,
					fxRender: this.enableRender
				},
				{
					prop: 'kjq',
					label: '会计期',
					align: 'center',
					headerAlign: 'center',
					required: true,
					formatter: (row) => {
						return row.kjq || '未启用会计期'
					}
				},
				{ prop: 'beginDate', label: '开始日期', align: 'center',	headerAlign: 'center', width: '150px' },
				{ prop: 'endDate', label: '结束日期', align: 'center',	headerAlign: 'center', width: '150px' },
				{
					prop: 'accountingState',
					label: '结转状态',
					required: true,
					fxRender: this.accountingStateRender
				}
			],
			tableData: [],
			defaultSortParam: { code: 'desc' },
			loading: false
		}
	},
	computed: {
		accountingState (val, key) {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('carryForwardState')(val)[key]
			}
		},
		enableState (val, key) {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('enableState')(val)[key]
			}
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
		getSearchParams () {
			const params = {
				...this.$refs.filterBar.getFilterParams(),
				sortParams: this.$refs.listTable.getSortKey(),
				'organ.organType': this.getCurrentTreeOrganId()
			}
			return {
				...this.$refs.listTable.getPaginationParams(),
				...this.$fxCommon.getSearchParams('carryForwardList')(params)
			}
		},
		getListData () {
			return this.$fxApi(`${apiName}.getPageList`)({ data: this.getSearchParams() }).then(res => {
				this.$refs.listTable.setPaginationTotal(res.total)
				this.tableData = res.result
				this.tableData.forEach(item => {
					item.id = item.organId
				})
				return Promise.resolve(res.result)
			})
		},
		enableRender (h, { row }) {
			h = this.$createElement
			return <FxListStateTag
				icon={this.enableState(row.enableFlag, 'icon')}
				label={this.enableState(row.enableFlag, 'label')}
			></FxListStateTag>
		},
		accountingStateRender (h, { row }) {
			h = this.$createElement
			return <FxListStateTag
				icon={this.accountingState(row.accountingState, 'icon')}
				label={this.accountingState(row.accountingState, 'label')}
			></FxListStateTag>
		},
		onCarryForward () {
			this.$refs.listTable.getSelectedRows().then(selectedRows => {
				this.$fxConfirm('您确认要对已勾选的机构进行结转吗？').then(() => {
					this.loading = true
					this.onCarryForwardHandler(selectedRows)
					setTimeout(() => {
						this.$emit('on-carry-forward', 'carryForward')
						this.loading = false
					}, 1000)
				})
			})
		},
		onCarryForwardHandler (selectedRows) {
			const params = selectedRows.map(item => {
				return {
					organ: {
						id: item.organId,
						name: item.name
					},
					period: {
						id: item.accountId || '',
						yearMonth: item.kjq || ''
					}
				}
			})
			const logger = this.$fxLogger.createInfo('financial-manage.carry-forward.carryForward', { names: selectedRows.map(item => item.name).join('，') })
			return this.$fxApi(`${apiName}.carryForward`)({ data: params, logger }).then()
		},
		onReverseCarryForward () {
			this.$refs.listTable.getSelectedRows().then(selectedRows => {
				this.$fxConfirm('您确认要对已勾选的机构进行反结转吗？').then(() => {
					this.loading = true
					this.onReverseCarryForwardHandler(selectedRows)
					setTimeout(() => {
						this.$emit('on-carry-forward', 'reverseCarryForward')
						this.loading = false
					}, 1000)
				})
			})
		},
		onReverseCarryForwardHandler (selectedRows) {
			const params = selectedRows.map(item => {
				return {
					organ: {
						id: item.organId,
						name: item.name
					},
					period: {
						id: item.accountId || '',
						yearMonth: item.kjq || ''
					}
				}
			})
			const logger = this.$fxLogger.createInfo('financial-manage.carry-forward.reverseCarryForward', { names: selectedRows.map(item => item.name).join('，') })
			return this.$fxApi(`${apiName}.reverseCarryForward`)({ data: params, logger }).then()
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
