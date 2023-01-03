<template>
	<w-app-container>
		<fx-page-header title="价格方案"></fx-page-header>
		<w-app-container direction="row" class="fx-page-first-container">
			<listContainer
				ref="listContainer"
				@on-refresh="initOrganList"
				@on-create="onCreate"
				@on-edit="onEdit"
				@on-search-price="onSearchPrice"
			></listContainer>
			<searchPriceContainer ref="searchPriceContainer"></searchPriceContainer>
		</w-app-container>
	</w-app-container>
</template>
<script>
import listContainer from './components/list-container/Index.vue'
import searchPriceContainer from './components/search-price-container/Index.vue'
export default {
	name: 'pricePlan',
	components: {
		listContainer,
		searchPriceContainer
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
				path: 'pricePlanDetail',
				query: {
					openType: 'add'
				}
			})
		},
		onEdit (id) {
			this.$fxAppTabs.tabsPush({
				path: 'pricePlanDetail',
				query: {
					openType: 'edit',
					id
				}
			})
		},
		onSearchPrice () {
			this.$refs.searchPriceContainer.open()
		}
	}
}
</script>
