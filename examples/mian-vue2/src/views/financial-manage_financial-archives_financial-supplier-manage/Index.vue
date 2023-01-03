<template>
	<w-app-container>
		<fx-page-header title="供货商列表"></fx-page-header>
		<w-app-container direction="row" class="fx-page-first-container">
			<listContainer
				ref="listContainer"
				@on-refresh="initSupplierList"
				@on-edit="onEdit"
			></listContainer>
			<editContainer ref="editContainer" @on-close="onClose"></editContainer>
		</w-app-container>
	</w-app-container>
</template>
<script>
import listContainer from './components/list-container/Index.vue'
import editContainer from './components/edit-container/Index.vue'
export const apiName = 'financialSupplier'
export default {
	name: 'financialSupplierManage',
	components: {
		listContainer,
		editContainer
	},
	mounted () {
		this.initSupplierList()
	},
	methods: {
		initSupplierList () {
			this.$refs.listContainer.refresh()
		},
		onEdit (supplierInfo) {
			this.$refs.editContainer.edit(supplierInfo)
		},
		onClose (refreshFlag) {
			refreshFlag ? this.$refs.listContainer.refresh() : this.$refs.listContainer.onPageChange()
		}
	}
}
</script>
