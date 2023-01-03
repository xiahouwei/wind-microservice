<template>
	<w-app-container direction="row">
		<listContainer
			ref="listContainer"
			@on-refresh="initList"
			@on-create="oncreateContainer"
			@on-edit="onEditReason"
		></listContainer>
		<createContainer ref="createContainer" @on-refresh="refreshList"></createContainer>
	</w-app-container>
</template>
<script>
import listContainer from './components/list-container/Index.vue'
import createContainer from '@/components/other-expense-type-setting/otherExpenseTypeSettingCreateDialog.vue'
export const apiName = 'otherExpenseTypeSetting'
export default {
	name: 'otherExpenseTypeSetting',
	components: {
		listContainer,
		createContainer
	},
	methods: {
		initList () {
			this.$refs.listContainer.refresh()
		},
		refreshList (delFlag) {
			return delFlag ? this.initList() : this.$refs.listContainer.onPageChange()
		},
		oncreateContainer () {
			this.$refs.createContainer.add()
		},
		onEditReason (details) {
			this.$refs.createContainer.edit(details)
		}
	}
}
</script>
