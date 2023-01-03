<template>
	<w-app-container>
		<fx-page-header title="商品管理"></fx-page-header>
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
export const apiName = 'goods'
export default {
	name: 'goodsManage',
	components: {
		listContainer
	},
	activated () {
		if (this.$fxAppTabs.isNewTab()) {
			this.$refs.listContainer.initFilterBar()
			this.initOrganList()
		} else {
			this.$refs.listContainer.clearSelected()
			this.$refs.listContainer.onPageChange()
		}
	},
	methods: {
		initOrganList () {
			return this.$refs.listContainer.refresh()
		},
		onCreate () {
			this.$fxAppTabs.tabsPush({
				path: 'goodsManageDetail',
				query: {
					openType: 'add'
				}
			})
		},
		onEdit (id) {
			this.$fxAppTabs.tabsPush({
				path: 'goodsManageDetail',
				query: {
					openType: 'edit',
					id
				}
			})
		}
	}
}
</script>
