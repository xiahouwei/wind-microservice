<template>
	<w-app-container>
		<fx-page-header title="订货方案"></fx-page-header>
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
export const apiName = 'planStock'
export default {
	name: 'stockPlan',
	components: {
		listContainer
	},
	activated () {
		if (this.$fxAppTabs.isNewTab()) {
			this.$refs.listContainer.initFilterBar()
			this.initOrganList()
		} else {
			this.initOrganList(false)
		}
	},
	methods: {
		initOrganList (initFlag = true) {
			if (initFlag) {
				this.$refs.listContainer.refresh()
			} else {
				this.$refs.listContainer.clearSelected()
				this.$refs.listContainer.onPageChange()
			}
		},
		onCreate () {
			this.$fxAppTabs.tabsPush({
				path: 'stockPlanDetail',
				query: {
					openType: 'add'
				}
			})
		},
		onEdit (id) {
			this.$fxAppTabs.tabsPush({
				path: 'stockPlanDetail',
				query: {
					openType: 'edit',
					id
				}
			})
		}
	}
}
</script>
