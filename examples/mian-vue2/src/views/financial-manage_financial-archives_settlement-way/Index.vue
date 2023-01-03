<template>
	<w-app-container>
		<fx-page-header title="结算方式列表"></fx-page-header>
		<w-app-container direction="row" class="fx-page-first-container">
			<listContainer
				ref="listContainer"
				@on-refresh="initOrganList"
				@on-edit="onEditClick"
				@on-create="onAddClick"
			></listContainer>
			<editContainer ref="editContainer" @on-close="onClose"></editContainer>
		</w-app-container>
	</w-app-container>
</template>
<script>
import listContainer from './components/list-container/Index.vue'
import editContainer from './components/edit-container/Index.vue'
export const apiName = 'settlementWay'
export default {
	name: 'settlementWay',
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
		onEditClick (itemInfo) {
			this.$refs.editContainer.edit(itemInfo)
		},
		onClose (refreshFlag) {
			refreshFlag ? this.$refs.listContainer.refresh() : this.$refs.listContainer.onPageChange()
		},
		onAddClick () {
			this.$refs.editContainer.add()
		}
	}
}
</script>
