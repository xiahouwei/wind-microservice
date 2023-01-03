<template>
	<w-app-container>
		<fx-page-header title="单位使用场景设置"></fx-page-header>
		<w-app-container direction="row" class="fx-page-first-container">
			<treeContainer
				ref="treeContainer"
				readonly
				@on-tree-item-click="initItemList"
			></treeContainer>
			<listContainer
				ref="listContainer"
				:getCurrentNode="getCurrentTreeNode"
				@on-create="onCreate"
				@on-edit="onEdit"
				@on-refresh="initItemList"
				@on-multiple-import-click="onMultipleImportClick"
			></listContainer>
			<multipleImport ref="multipleImport" @on-refresh="initItemList"></multipleImport>
		</w-app-container>
	</w-app-container>
</template>
<script>
import { mapGetters } from 'vuex'
import treeContainer from '@/components/tree-container/tree-item/Index.vue'
import listContainer from './components/list-container/Index.vue'
import multipleImport from './components/multiple-import/MultipleImport.vue'
export const apiName = 'unitSetting'
export default {
	name: 'unitSetting',
	components: {
		treeContainer,
		listContainer,
		multipleImport
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
			this.$refs.treeContainer.getTreeData().then(this.initItemList)
		},
		initItemList () {
			this.$refs.listContainer.refresh()
		},
		getCurrentTreeNode () {
			return this.$refs.treeContainer.getCurrentNode()
		},
		onCreate () {
			this.$fxAppTabs.tabsPush({
				path: 'unitSettingDetail',
				query: {
					openType: 'add'
				}
			})
		},
		onEdit (selectRow) {
			this.$fxAppTabs.tabsPush({
				path: 'unitSettingDetail',
				query: {
					openType: 'edit',
					id: selectRow.itemId,
					itemId: selectRow.itemId,
					billClass: 'InStore'
				}
			})
		},
		onMultipleImportClick () {
			this.$refs.multipleImport.open()
		}
	}
}
</script>
