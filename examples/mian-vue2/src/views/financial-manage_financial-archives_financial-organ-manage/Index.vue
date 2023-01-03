<template>
	<w-app-container>
		<fx-page-header title="机构管理列表"></fx-page-header>
		<w-app-container direction="row" class="fx-page-first-container">
			<listContainer
				ref="listContainer"
				@on-refresh="initOrganList"
				@on-organ-edit="onOrganEdit"
			></listContainer>
			<editContainer ref="editContainer" @on-close="onClose"></editContainer>
		</w-app-container>
	</w-app-container>
</template>
<script>
import listContainer from './components/list-container/Index.vue'
import editContainer from './components/edit-container/Index.vue'
export const apiName = 'financialOrgan'
export default {
	name: 'financialOrganManage',
	components: {
		listContainer,
		editContainer
	},
	mounted () {
		this.initOrganList()
	},
	methods: {
		initOrganList () {
			this.$refs.listContainer.refresh()
		},
		onOrganEdit (organInfo) {
			this.$refs.editContainer.edit(organInfo)
		},
		onClose (refreshFlag) {
			refreshFlag ? this.$refs.listContainer.refresh() : this.$refs.listContainer.onPageChange()
		}
	}
}
</script>
