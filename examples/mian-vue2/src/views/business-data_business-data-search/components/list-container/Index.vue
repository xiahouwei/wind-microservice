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
			:selectable="false"
			@on-page-change="onPageChange"
			@on-sort-change="onSortChange"
		>
			<div slot="btn-tools-left" class="tools-left">
				<el-button v-fx-auth:cost-manage_business-data-search.see-un-sync class="order-btn" type="primary" plain @click="onSyncClick">查看未同步数据</el-button>
				<el-button v-fx-auth:cost-manage_business-data-search.re-import class="order-btn" type="danger" plain @click="reImport">重新导入</el-button>
				<el-button v-fx-auth:cost-manage_business-data-search.get-business-data class="order-btn" type="primary" plain @click="getBusinessData">立即获取营业数据</el-button>
			</div>
		</fx-list-virtual-table>
		<syncContainer ref='syncContainer'></syncContainer>
	</div>
</template>
<script>
import { apiName } from '../../Index.vue'
import filterBar from './FilterBar.vue'
import syncContainer from '../sync-container/Index.vue'
import FxListStateTag from '@/components/common/Fx-list-state-tag.vue'
export default {
	name: 'listContainer',
	components: {
		filterBar,
		syncContainer
	},
	data () {
		return {
			tableColumn: [
				{ prop: 'createDate', label: '营业时间' },
				{ prop: 'groupName', label: '餐饮集团名称' },
				{ prop: 'organName', label: '营业机构' },
				{ prop: 'salesMoney', label: '上传折前销售金额' },
				{ prop: 'realSalesMoney', label: '上传折后纯收金额' },
				{ prop: 'lossMoney', label: '上传损耗金额' },
				{ prop: 'zqLossMoney', label: '上传折前损耗金额' },
				{ prop: 'totalMoney', label: '上传总金额' },
				{ prop: 'salesTotalMoney', label: '折前上传总金额' },
				{ prop: 'importMoney', label: '导入金额' },
				{ prop: 'diffMoney', label: '差异金额' },
				{
					prop: 'syncFlag',
					label: '状态',
					fxRender: this.enableRender
				}
			],
			tableData: [],
			defaultSortParam: { code: 'asc' }
		}
	},
	computed: {
		enableState () {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('syncState')(val)[key]
			}
		}
	},
	mounted () {
		if (this.$route.query.onSyncClick) {
			this.onSyncClick()
			this.$fxRouter.clearRouterQuery()
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
				...this.$fxCommon.getSearchParams('businessDataSearchList')(params)
			}
		},
		getListData () {
			return this.$fxApi(`${apiName}.getPage`)({ data: this.getSearchParams() }).then(res => {
				this.$refs.listTable.setPaginationTotal(res.total)
				this.tableData = res.result
				return Promise.resolve(res.result)
			})
		},
		onSyncClick () {
			this.$refs.syncContainer.open()
		},
		enableRender (h, { row }) {
			return <FxListStateTag
				icon={this.enableState(row.syncFlag, 'icon')}
				label={this.enableState(row.syncFlag, 'label')}
			></FxListStateTag>
		},
		reImport () {
			return this.$fxApi(`${apiName}.reImport`).then(res => {
				this.getListData()
				return Promise.resolve(res.result)
			})
		},
		getBusinessData () {
			return this.$fxApi(`${apiName}.getBusinessData`).then(res => {
				this.getListData()
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
		margin-left 10px
	}
}
</style>
