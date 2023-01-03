<template>
	<w-app-container direction="row">
		<listContainer
			ref="listContainer"
			:fGetTreeId="fGetTreeId"
			@on-refresh="initList"
			@on-create="onCreate"
			@on-edit="onEdit"
		></listContainer>
		<createContainer ref="createContainer" @on-refresh="refreshList"></createContainer>
	</w-app-container>
</template>
<script>
import listContainer from './components/list-container/Index.vue'
import createContainer from '@/components/bussiness-type-manage/BussinessTypeCreateDialog.vue'
export default {
	name: 'bussinessType',
	components: {
		listContainer,
		createContainer
	},
	props: {
		fGetTreeId: Function,
		fGetTreeNode: Function
	},
	methods: {
		initList () {
			this.$refs.listContainer.refresh()
		},
		refreshList () {
			return this.$refs.listContainer.onPageChange()
		},
		onTreeItemClick () {
			this.initList()
		},
		onCreate () {
			const treeNode = this.fGetTreeNode()
			const treeId = treeNode.treeType === 'root' ? '' : treeNode.id
			this.$refs.createContainer.add(treeId)
		},
		onEdit (details) {
			this.$refs.createContainer.edit(details)
		}
	}
}
</script>
