<template>
	<w-app-container>
		<fx-page-header title="机构"></fx-page-header>
		<w-app-container direction="row" class="fx-page-first-container">
			<treeContainer
				ref="organTree"
				:canAdd="detailsAuthGetter('basic-archives_organ-manage.add-region')"
				:canEdit="detailsAuthGetter('basic-archives_organ-manage.edit-region')"
				:canDelete="detailsAuthGetter('basic-archives_organ-manage.delete-region')"
				@on-tree-item-click="initOrganList"
			></treeContainer>
			<organContainer
				ref="organContainer"
				:getCurrentTreeLv="getCurrentTreeLv"
				@on-refresh="onOrganListRefresh"
				@on-create-organ="onCreateOrgan"
				@on-organ-edit="onOrganEdit"
			></organContainer>
		</w-app-container>
	</w-app-container>
</template>
<script>
import { mapGetters } from 'vuex'
import treeContainer from '@/components/tree-container/tree-organ/Index.vue'
import organContainer from './components/organ-container/Index.vue'
export default {
	name: 'organManage',
	components: {
		treeContainer,
		organContainer
	},
	computed: {
		...mapGetters(['detailsAuthGetter'])
	},
	activated () {
		if (this.$fxAppTabs.isNewTab()) {
			this.$refs.organContainer.initFilterBar()
			this.initTree()
		} else {
			this.$refs.organTree.getTreeDataHandler()
				.then(this.$refs.organTree.onUpdateTree)
				.then(this.$refs.organContainer.clearSelected)
				.then(this.$refs.organContainer.onPageChange)
		}
	},
	methods: {
		initTree () {
			this.$refs.organTree.getTreeData().then(this.initOrganList)
		},
		initOrganList () {
			this.$refs.organContainer.refresh()
		},
		getCurrentTreeLv () {
			return this.$refs.organTree.getCurrentNodeTreeLv()
		},
		onCreateOrgan (item) {
			const treeNode = this.$refs.organTree.getCurrentNode()
			const rootData = this.$refs.organTree.getRootData()
			if (item.type === 'workshop' && treeNode.organType !== '1') {
				this.$fxConfirm('必须在配送中心下添加车间。')
				return false
			}
			this.$fxAppTabs.tabsPush({
				path: 'organManageDetail',
				query: {
					openType: 'add',
					organType: item.id,
					treeNodeId: treeNode.id,
					treeNodeOrganLevel: treeNode && treeNode.organLevel,
					treeNodeOrganType: treeNode && treeNode.organType,
					treeNodeOrganId: treeNode && treeNode.organId,
					treeNodeTreeType: treeNode && treeNode.treeType,
					rootDataId: rootData.id
				}
			})
		},
		onOrganEdit (selectRow, isRecycle) {
			this.$fxAppTabs.tabsPush({
				path: 'organManageDetail',
				query: {
					openType: 'edit',
					id: selectRow.id,
					organType: selectRow.organType,
					isRecycle
				}
			})
		},
		onOrganListRefresh () {
			this.$refs.organTree.getTreeDataHandler()
				.then(this.$refs.organTree.onUpdateTree)
				.then(this.initOrganList)
		}
	}
}
</script>
