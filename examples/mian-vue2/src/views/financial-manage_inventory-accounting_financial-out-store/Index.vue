<template>
	<w-app-container>
		<fx-page-header title="财务出库单列表"></fx-page-header>
		<w-app-container direction="row" class="fx-page-first-container">
			<listContainer
				ref="listContainer"
				:tableQueueUtils="tableQueueUtils"
				@on-refresh="refreshOrderList"
				@on-edit="onEdit"
			></listContainer>
			<createContainer
				ref="createContainer"
				:tableQueueUtils="tableQueueUtils"
				@on-refresh="refreshOrderList"
			></createContainer>
		</w-app-container>
	</w-app-container>
</template>
<script>
import listContainer from './components/list-container/Index.vue'
import createContainer from './components/create-container/Index.vue'
export const apiName = 'financialOutStore'
export default {
	name: 'financialOutStore',
	components: {
		listContainer,
		createContainer
	},
	data () {
		return {
			tableQueueUtils: this.$fxUtils.tableQueueUtils({
				prevErrorMessage: '当前为第一张单据',
				nextErrorMessage: '当前为最后一张单据'
			})
		}
	},
	mounted () {
		if (this.$route.query.id) {
			this.$refs.listContainer.onTableRowDbclickOriginal(this.$route.query)
		}
		this.$refs.listContainer.$refs.filterBar.getAccountingPeriod(this.$route.query).then(() => {
			this.initOrderList()
			this.$fxRouter.clearRouterQuery()
		})
	},
	methods: {
		initOrderList () {
			return this.$refs.listContainer.refresh()
		},
		onEdit (id, showBillQueue) {
			this.$refs.createContainer.edit(id, showBillQueue)
		},
		refreshOrderList (initFlag = false) {
			return initFlag ? this.$refs.listContainer.refreshPageData() : this.$refs.listContainer.onPageChange()
		}
	}
}
</script>
