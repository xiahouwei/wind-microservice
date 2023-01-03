<template>
	<w-app-container>
		<fx-page-header title="品项"></fx-page-header>
		<w-app-container direction="row" class="fx-page-first-container">
			<treeContainer
				ref="treeContainer"
				:canAdd="detailsAuthGetter('basic-archives_item-manage.add-itemCategory')"
				:canEdit="detailsAuthGetter('basic-archives_item-manage.edit-itemCategory')"
				:canDelete="detailsAuthGetter('basic-archives_item-manage.delete-itemCategory')"
				@on-tree-item-click="initOrganList"
			></treeContainer>
			<listContainer
				ref="listContainer"
				:getCurrentNode="getCurrentTreeNode"
				@on-multiple-import-click="onMultipleImportClick"
				@on-refresh="onOrganListRefresh"
				@on-create="onCreate"
				@on-edit="onEdit"
			></listContainer>
			<multipleImport ref="multipleImport" :selectRowsArr="selectRowsArr" @on-refresh="getRefresh"></multipleImport>
		</w-app-container>
	</w-app-container>
</template>
<script>
import { mapGetters } from 'vuex'
import treeContainer from '@/components/tree-container/tree-item/Index.vue'
import listContainer from './components/list-container/Index.vue'
import multipleImport from './components/multiple-import/MultipleImport.vue'
export default {
	name: 'itemManage',
	components: {
		treeContainer,
		listContainer,
		multipleImport
	},
	data () {
		return {
			selectRowsArr: []
		}
	},
	computed: {
		...mapGetters(['detailsAuthGetter'])
	},
	activated () {
		if (this.$fxAppTabs.isNewTab()) {
			this.$refs.listContainer.initFilterBar()
			this.initTree()
		} else {
			this.$refs.treeContainer.onUpdate().then(() => {
				this.$refs.listContainer.clearSelected()
				this.$refs.listContainer.onPageChange()
			})
		}
	},
	methods: {
		initTree () {
			this.$refs.treeContainer.getTreeData().then(this.initOrganList)
		},
		initOrganList () {
			this.$refs.listContainer.refresh()
		},
		getCurrentTreeNode () {
			return this.$refs.treeContainer.getCurrentNode()
		},
		onCreate () {
			const treeNode = this.$refs.treeContainer.getCurrentNode()
			this.$fxAppTabs.tabsPush({
				path: 'itemManageDetail',
				query: {
					openType: 'add',
					treeNodeId: treeNode.id
				}
			})
		},
		onEdit (selectRow, isRecycle) {
			this.$fxAppTabs.tabsPush({
				path: 'itemManageDetail',
				query: {
					openType: 'edit',
					id: selectRow.id,
					isRecycle
				}
			})
		},
		onOrganListRefresh () {
			this.$refs.treeContainer.onUpdate().then(this.initOrganList)
		},
		onMultipleImportClick (val) {
			this.selectRowsArr = val
			this.$refs.multipleImport.open()
		},
		getRefresh () {
			this.$refs.listContainer.refresh()
		}
	}
}
</script>
