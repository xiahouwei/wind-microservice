<template>
	<w-app-container>
		<fx-page-header title="客户"></fx-page-header>
		<w-app-container direction="row" class="fx-page-first-container">
			<treeContainer
				ref="treeContainer"
				:canAdd="detailsAuthGetter('basic-archives_customer-manage.add-customer-category')"
				:canEdit="detailsAuthGetter('basic-archives_customer-manage.edit-customer-category')"
				:canDelete="detailsAuthGetter('basic-archives_customer-manage.delete-customer-category')"
				:canAddCompany="detailsAuthGetter('basic-archives_customer-manage.add-customer-company')"
				:canEditCompany="detailsAuthGetter('basic-archives_customer-manage.edit-customer-company')"
				:canDeleteCompany="detailsAuthGetter('basic-archives_customer-manage.delete-customer-company')"
				@on-tree-item-click="initOrganList"
			></treeContainer>
			<listContainer
				ref="listContainer"
				:getCurrentTreeLv="getCurrentTreeLv"
				@on-refresh="onOrganListRefresh"
				@on-create="onCreate"
				@on-edit="onEdit"
			></listContainer>
		</w-app-container>
	</w-app-container>
</template>
<script>
import { mapGetters } from 'vuex'
import treeContainer from '@/components/tree-container/tree-customer/Index.vue'
import listContainer from './components/list-container/Index.vue'
export default {
	name: 'customerManage',
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
			this.$refs.treeContainer.onUpdate()
				.then(this.$refs.listContainer.clearSelected)
				.then(this.$refs.listContainer.onPageChange)
		}
	},
	methods: {
		initTree () {
			this.$refs.treeContainer.getTreeData().then(this.initOrganList)
		},
		initOrganList () {
			this.$refs.listContainer.refresh()
		},
		getCurrentTreeLv () {
			return this.$refs.treeContainer.getCurrentNodeTreeLv()
		},
		onCreate (item) {
			const treeNode = this.$refs.treeContainer.getCurrentNode()
			this.$fxAppTabs.tabsPush({
				path: 'customerManageDetail',
				query: {
					openType: 'add',
					organType: item.id,
					treeNodeId: treeNode.id,
					treeNodeTypeId: treeNode && treeNode.customerTypeId,
					treeNodeOrganLevel: treeNode && treeNode.organLevel,
					treeNodeOrganId: treeNode && treeNode.organId
				}
			})
		},
		onEdit (selectRow, isRecycle) {
			this.$fxAppTabs.tabsPush({
				path: 'customerManageDetail',
				query: {
					openType: 'edit',
					id: selectRow.id,
					organType: selectRow.organType,
					isRecycle
				}
			})
		},
		onOrganListRefresh () {
			this.$refs.treeContainer.onUpdate().then(this.initOrganList)
		}
	}
}
</script>
