<template>
	<w-app-container direction="row">
		<listContainer
			ref="listContainer"
			@on-refresh="initList"
			@on-create="onCreateFinancial"
			@on-edit="onEditFinancial"
		></listContainer>
		<createFinancial ref="createFinancial" @on-refresh="refreshList"></createFinancial>
	</w-app-container>
</template>
<script>
import listContainer from './components/list-container/Index.vue'
import createFinancial from '@/components/financial-manage/FinancialCreateDialog.vue'
export default {
	name: 'financialClass',
	components: {
		listContainer,
		createFinancial
	},
	methods: {
		initList () {
			this.$refs.listContainer.refresh()
		},
		refreshList (delFlag) {
			return delFlag ? this.initList() : this.$refs.listContainer.onPageChange()
		},
		onCreateFinancial () {
			this.$refs.createFinancial.add()
		},
		onEditFinancial (details) {
			this.$refs.createFinancial.edit(details)
		}
	}
}
</script>
