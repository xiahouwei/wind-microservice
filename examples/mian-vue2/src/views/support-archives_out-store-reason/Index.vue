<template>
	<w-app-container direction="row">
		<listContainer
			ref="listContainer"
			@on-refresh="initList"
			@on-create="onCreateReason"
			@on-edit="onEditReason"
		></listContainer>
		<createReason ref="createReason" @on-refresh="refreshList"></createReason>
	</w-app-container>
</template>
<script>
import listContainer from './components/list-container/Index.vue'
import createReason from '@/components/out-store-reason-manage/outStoreReasonCreateDialog.vue'
export const apiName = 'outStoreReason'
export default {
	name: 'outStoreReason',
	components: {
		listContainer,
		createReason
	},
	methods: {
		initList () {
			this.$refs.listContainer.refresh()
		},
		refreshList (delFlag) {
			return delFlag ? this.initList() : this.$refs.listContainer.onPageChange()
		},
		onCreateReason () {
			this.$refs.createReason.add()
		},
		onEditReason (details) {
			this.$refs.createReason.edit(details)
		}
	}
}
</script>
