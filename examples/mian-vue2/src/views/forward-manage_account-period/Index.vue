<template>
	<w-app-container>
		<fx-page-header title="会计期"></fx-page-header>
		<w-app-container direction="row" class="fx-page-first-container">
			<treeContainer
				ref="treeContainer"
				@on-tree-item-click="onTreeItemClick"
			></treeContainer>
			<listContainer
				ref="listContainer"
				:getCurrentTreeOrganId="getCurrentTreeOrganId"
				:getCurrentNode="getCurrentNode"
				:columnType="columnType"
				@on-refresh="initOrganList"
				@on-create="onCreate"
				@on-edit="onEdit"
			></listContainer>
			<addContainer ref="addContainer" @on-refresh="refreshList"></addContainer>
			<editContainer ref="editContainer" @on-refresh="refreshList" :disabled='editDisabled'></editContainer>
		</w-app-container>
	</w-app-container>
</template>
<script>
import { mapGetters } from 'vuex'
import treeContainer from '@/components/tree-container/tree-account/Index.vue'
import listContainer from './components/list-container/Index.vue'
import addContainer from './components/create-container/AddDialog.vue'
import editContainer from './components/create-container/EditDialog.vue'
export default {
	name: 'accountPeriod',
	components: {
		treeContainer,
		listContainer,
		addContainer,
		editContainer
	},
	data () {
		return {
			columnType: 'root'
		}
	},
	mounted () {
		this.initTree()
	},
	computed: {
		...mapGetters(['detailsAuthGetter']),
		editDisabled () {
			return !this.detailsAuthGetter('financial-manage_account-period.edit-account-period')
		}
	},
	methods: {
		initTree () {
			this.$refs.treeContainer.getTreeData().then(this.initOrganList)
		},
		initOrganList () {
			this.$refs.listContainer.refresh()
		},
		refreshList (delFlag) {
			return this.$refs.listContainer.onPageChange()
		},
		onTreeItemClick (organId) {
			this.columnType = !organId ? 'root' : 'organ'
			this.initOrganList()
		},
		getCurrentTreeOrganId () {
			return this.$refs.treeContainer.getCurrentTreeOrganId()
		},
		getCurrentNode () {
			return this.$refs.treeContainer.getCurrentNode()
		},
		onCreate () {
			this.getAccountMaxYear().then(res => {
				this.$refs.addContainer.open(res)
			})
		},
		onEdit (details) {
			this.$refs.editContainer.open(details)
		},
		getAccountMaxYear () {
			return this.$fxApi('account.getAccountMaxYear').then(res => {
				return Promise.resolve(res)
			})
		}
	}
}
</script>
