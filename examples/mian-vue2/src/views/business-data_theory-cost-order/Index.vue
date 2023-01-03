<template>
	<w-app-container>
		<fx-page-header title="理论耗用单"></fx-page-header>
		<w-app-container direction="row" class="fx-page-first-container">
			<listContainer
				ref="listContainer"
				@on-refresh="initOrganList"
				@on-edit="onEdit"
			></listContainer>
		</w-app-container>
	</w-app-container>
</template>
<script>
import listContainer from './components/list-container/Index.vue'
export const apiName = 'theoryCostOrder'
export default {
	name: 'theoryCostOrder',
	components: {
		listContainer
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
		onEdit (id) {
			this.$fxAppTabs.tabsPush({
				path: 'theoryCostOrderDetail',
				query: {
					openType: 'edit',
					id
				}
			})
		}
	}
}
</script>
