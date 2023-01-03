<template>
	<w-app-container>
		<fx-page-header title="客户列表"></fx-page-header>
		<w-app-container direction="row" class="fx-page-first-container">
			<listContainer
				ref="listContainer"
				@on-refresh="initCustomerList"
				@on-edit="onEdit"
			></listContainer>
			<editContainer ref="editContainer" @on-close="onClose"></editContainer>
		</w-app-container>
	</w-app-container>
</template>
<script>
import listContainer from './components/list-container/Index.vue'
import editContainer from './components/edit-container/Index.vue'
export const apiName = 'financialCustomer'
export default {
	name: 'financialCustomerManage',
	components: {
		listContainer,
		editContainer
	},
	mounted () {
		this.initCustomerList()
	},
	methods: {
		initCustomerList () {
			this.$refs.listContainer.refresh()
		},
		onEdit (customerInfo) {
			this.$refs.editContainer.edit(customerInfo)
		},
		onClose (refreshFlag) {
			refreshFlag ? this.$refs.listContainer.refresh() : this.$refs.listContainer.onPageChange()
		}
	}
}
</script>
