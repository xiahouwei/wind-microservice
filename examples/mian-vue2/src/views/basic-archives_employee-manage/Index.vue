<template>
	<w-app-container>
		<fx-page-header title="员工"></fx-page-header>
		<w-app-container direction="row" class="fx-page-first-container">
			<treeContainer
				ref="treeContainer"
				:data="tableTreeData"
				showAllBtn
				readonly
				@on-tree-item-click="initOrganList"
			></treeContainer>
			<listContainer
				ref="listContainer"
				:getCurrentTreeLv="getCurrentTreeLv"
				:getCurrentNodeOrganType="getCurrentNodeOrganType"
				@on-refresh="initOrganList"
				@on-create="onCreate"
				@on-edit="onEdit"
			></listContainer>
		</w-app-container>
	</w-app-container>
</template>
<script>
import treeContainer from '@/components/tree-container/tree-organ-all/Index.vue'
import listContainer from './components/list-container/Index.vue'
export default {
	name: 'employeeManage',
	components: {
		treeContainer,
		listContainer
	},
	data () {
		return {
			tableTreeData: []
		}
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
			return this.$fxApi('common.getTreeByType')({
				data: [{
					type: 'Organ',
					level: 1
				}, {
					type: 'Supplier',
					level: 1
				}, {
					type: 'Customer',
					level: 1
				}]
			}).then(res => {
				this.tableTreeData = [{
					id: '',
					name: '全部',
					treeType: 'root',
					children: res
				}]
				return Promise.resolve()
			}).then(this.initOrganList)
		},
		initOrganList () {
			this.$refs.listContainer.refresh()
		},
		getCurrentTreeLv () {
			return this.$refs.treeContainer.getCurrentNodeTreeLv()
		},
		getCurrentNodeOrganType () {
			return this.$refs.treeContainer.getCurrentNodeOrganType()
		},
		onCreate () {
			const treeNode = this.$refs.treeContainer.getCurrentNode()
			this.$fxAppTabs.tabsPush({
				path: 'employeeManageDetail',
				query: {
					openType: 'add',
					treeNodeId: treeNode.id,
					treeNodeOrganLevel: treeNode && treeNode.organLevel,
					treeNodeOrganType: treeNode && treeNode.organType
				}
			})
		},
		onEdit (selectRow) {
			this.$fxAppTabs.tabsPush({
				path: 'employeeManageDetail',
				query: {
					openType: 'edit',
					id: selectRow.id
				}
			})
		}
	}
}
</script>
