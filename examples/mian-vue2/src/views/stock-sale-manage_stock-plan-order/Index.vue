<template>
	<w-app-container>
		<fx-page-header title="采购计划单"></fx-page-header>
		<w-app-container direction="row" class="fx-page-first-container">
			<listContainer
				ref="listContainer"
				@on-refresh="initOrganList"
				@on-create="onCreate"
				@on-edit="onEdit"
				@on-merge="onMerge"
			></listContainer>
			<mergeContainer
				ref="mergeContainer"
				@on-refresh="initOrganList"
			>
			</mergeContainer>
		</w-app-container>
	</w-app-container>
</template>
<script>
import listContainer from './components/list-container/Index.vue'
import mergeContainer from './components/merge-container/Index.vue'
export const apiName = 'stockPlanOrder'
export default {
	name: 'stockPlanOrder',
	components: {
		listContainer,
		mergeContainer
	},
	activated () {
		if (this.$fxAppTabs.isNewTab() || !this.$fxUtils.isEmptyObj(this.$route.query)) {
			this.$refs.listContainer.initFilterBar(this.$route.query).then(this.initTableColumn).then(() => {
				this.initOrganList(true)
				this.$fxRouter.clearRouterQuery()
			})
		} else {
			this.initTableColumn().then(() => {
				this.initOrganList(false)
			})
		}
	},
	methods: {
		initTableColumn () {
			return this.$refs.listContainer.initTableColumn()
		},
		initOrganList (initFlag = false) {
			if (initFlag) {
				this.$refs.listContainer.refresh()
			} else {
				this.$refs.listContainer.clearSelected()
				this.$refs.listContainer.onPageChange()
			}
		},
		onCreate () {
			this.$fxAppTabs.tabsPush({
				path: 'stockPlanOrderDetail',
				query: {
					openType: 'add'
				}
			})
		},
		onMerge (mergeOrderData, mergeOrderIds, organData, codes) {
			this.$refs.mergeContainer.open(mergeOrderData, mergeOrderIds, organData, codes)
		},
		onEdit (id) {
			this.$fxAppTabs.tabsPush({
				path: 'stockPlanOrderDetail',
				query: {
					openType: 'edit',
					id
				}
			})
		}
	}
}
</script>
