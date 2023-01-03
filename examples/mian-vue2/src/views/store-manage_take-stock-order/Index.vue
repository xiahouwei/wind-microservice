<template>
	<w-app-container>
		<fx-page-header title="盘点单"></fx-page-header>
		<w-app-container direction="row" class="fx-page-first-container">
			<listContainer
				ref="listContainer"
				@on-refresh="initOrganList"
				@on-create="onCreate"
				@on-edit="onEdit"
				@on-merge="onMerge"
				@on-check-progress="onCheckProgress"
			></listContainer>
			<mergeContainer ref="mergeContainer" @on-refresh="initOrganList"></mergeContainer>
			<progressContainer ref="progressContainer" @on-refresh="initOrganList"></progressContainer>
		</w-app-container>
	</w-app-container>
</template>
<script>
import listContainer from './components/list-container/Index.vue'
import mergeContainer from './components/merge-container/Index.vue'
import progressContainer from './components/progress-container/Index.vue'
export const apiName = 'takeStockOrder'
export default {
	name: 'takeStockOrder',
	components: {
		listContainer,
		mergeContainer,
		progressContainer
	},
	activated () {
		if (this.$route.query.checkProgress) {
			this.onCheckProgress()
		}
		if (this.$fxAppTabs.isNewTab() || !this.$fxUtils.isEmptyObj(this.$route.query)) {
			this.$refs.listContainer.initFilterBar(this.$route.query).then(this.initTableColumn).then(() => {
				this.initOrganList(true)
			})
		} else {
			this.initTableColumn().then(() => {
				this.initOrganList(false)
			})
		}
		this.$fxRouter.clearRouterQuery()
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
		onCreate ({ checkClassId, organId, houseId } = {}) {
			this.$fxAppTabs.tabsPush({
				path: 'takeStockOrderDetail',
				query: {
					openType: 'add',
					checkClassId,
					organId,
					houseId
				}
			})
		},
		onEdit (id) {
			this.$fxAppTabs.tabsPush({
				path: 'takeStockOrderDetail',
				query: {
					openType: 'edit',
					id
				}
			})
		},
		onMerge (mergeOrderData, mergeOrderIds, organData, codes) {
			this.$refs.mergeContainer.open(mergeOrderData, mergeOrderIds, organData, codes)
		},
		onCheckProgress () {
			this.$refs.progressContainer.open()
		}
	}
}
</script>
