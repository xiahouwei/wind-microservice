<template>
	<w-app-container direction="row" class="fx-page-first-container">
		<treeContainer
			ref="storageRackTree"
			:canAdd="detailsAuthGetter('basic-archives_storage-manage.add-rack')"
			:canEdit="detailsAuthGetter('basic-archives_storage-manage.edit-rack')"
			:canDelete="detailsAuthGetter('basic-archives_storage-manage.delete-rack')"
			@on-tree-item-click="initStorageList"
			@on-refresh-list="initStorageList"
		></treeContainer>
		<listContainer
			ref="listContainer"
			:getCurrentTreeLv="getCurrentTreeLv"
			@on-refresh="initStorageList"
			@on-create-click="onCreateClick"
			@on-edit-click="onEditClick"
		></listContainer>
	</w-app-container>
</template>
<script>
import { mapGetters } from 'vuex'
import treeContainer from '@/components/tree-container/tree-storage-rack/Index.vue'
import listContainer from './components/list-container/Index.vue'
export const apiName = 'storageManage'
export default {
	name: 'storageManage',
	components: {
		treeContainer,
		listContainer
	},
	computed: {
		...mapGetters(['detailsAuthGetter'])
	},
	activated () {
		if (this.$fxAppTabs.isNewTab()) {
			this.$refs.listContainer.initFilterBar()
			this.initTree()
		} else {
			this.$refs.listContainer.clearSelected()
			this.$refs.listContainer.onPageChange()
		}
	},
	methods: {
		initTree () {
			this.$refs.storageRackTree.getTreeData().then(this.initStorageList)
		},
		initStorageList () {
			this.$refs.listContainer.refresh()
		},
		getCurrentTreeLv () {
			return this.$refs.storageRackTree.getCurrentNodeTreeLv()
		},
		onCreateClick () {
			const treeNode = this.$refs.storageRackTree.getCurrentNode()
			this.$fxAppTabs.tabsPush({
				path: 'storageManageDetail',
				query: {
					openType: 'add',
					treeNodeFatherId: treeNode.fatherId,
					treeNodeCode: treeNode.code,
					treeNodeId: treeNode.id,
					treeNodeRelated: treeNode.related,
					treeNodeOrganType: treeNode.organType,
					treeNodeOrganId: treeNode.organId
				}
			})
		},
		onEditClick (selectRow) {
			this.$fxAppTabs.tabsPush({
				path: 'storageManageDetail',
				query: {
					openType: 'edit',
					id: selectRow.id
				}
			})
		}
	}
}
</script>
