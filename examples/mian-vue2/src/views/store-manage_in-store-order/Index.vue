<template>
	<w-app-container>
		<fx-page-header title="入库单"></fx-page-header>
		<w-app-container direction="row" class="fx-page-first-container">
			<listContainer
				ref="listContainer"
				@on-refresh="initOrganList"
				@on-create="onCreate"
				@on-edit="onEdit"
			></listContainer>
		</w-app-container>
	</w-app-container>
</template>
<script>
import listContainer from './components/list-container/Index.vue'
export default {
	name: 'inStoreOrder',
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
		onCreate () {
			this.$fxAppTabs.tabsPush({
				path: 'inStoreOrderDetail',
				query: {
					openType: 'add'
				}
			})
		},
		onEdit (id) {
			this.$fxAppTabs.tabsPush({
				path: 'inStoreOrderDetail',
				query: {
					openType: 'edit',
					id
				}
			})
		}
	}
}
</script>
