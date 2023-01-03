<template>
	<w-app-container>
		<fx-page-header title="调拨单"></fx-page-header>
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
export const apiName = 'moveOrder'
export default {
	name: 'moveOrder',
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
		onCreate (moveBillCreateType) {
			this.$fxAppTabs.tabsPush({
				path: 'moveOrderDetail',
				query: {
					openType: 'add',
					moveBillCreateType
				}
			})
		},
		onEdit (id) {
			this.$fxAppTabs.tabsPush({
				path: 'moveOrderDetail',
				query: {
					openType: 'edit',
					id
				}
			})
		}
	}
}
</script>
