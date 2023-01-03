<template>
	<w-app-container>
		<fx-page-header title="采购发票"></fx-page-header>
		<w-app-container direction="row" class="fx-page-first-container">
			<listContainer
				ref="listContainer"
				@on-refresh="initOrganList"
				@on-create="onCreate"
				@on-edit="onEdit"
				@on-multiple-import-click="onMultipleImportClick"
			></listContainer>
			<multipleImport
				ref="multipleImport"
				@on-refresh="initOrganList"
			></multipleImport>
		</w-app-container>
	</w-app-container>
</template>
<script>
import listContainer from './components/list-container/Index.vue'
import multipleImport from './components/multiple-import/MultipleImport.vue'
export const apiName = 'purchaseInvoice'
export default {
	name: 'purchaseInvoice',
	components: {
		listContainer,
		multipleImport
	},
	activated () {
		if (this.$fxAppTabs.isNewTab()) {
			this.$refs.listContainer.initFilterBar().then(() => {
				this.initOrganList(true)
			})
		} else {
			this.initOrganList(false)
		}
	},
	methods: {
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
				path: 'purchaseInvoiceCreate'
			})
		},
		onEdit (id) {
			this.$fxAppTabs.tabsPush({
				path: 'purchaseInvoiceDetail',
				query: { id }
			})
		},
		onMultipleImportClick () {
			this.$refs.multipleImport.open()
		}
	}
}
</script>
