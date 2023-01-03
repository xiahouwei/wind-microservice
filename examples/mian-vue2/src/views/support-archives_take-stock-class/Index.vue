<template>
	<w-app-container direction="row">
		<listContainer
			ref="listContainer"
			@on-refresh="initList"
			@on-create="onCreate"
			@on-edit="onEdit"
		></listContainer>
		<createContainer ref="createContainer" @on-refresh="refreshList"></createContainer>
	</w-app-container>
</template>
<script>
import listContainer from './components/list-container/Index.vue'
import createContainer from '@/components/take-stock-class-manage/TakeStockClassCreateDialog.vue'
export const apiName = 'takeStockClass'
export default {
	name: 'takeStockClass',
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
		onCreate () {
			this.$refs.createContainer.add()
		},
		onEdit (details) {
			this.$refs.createContainer.edit(details)
		}
	}
}
</script>
