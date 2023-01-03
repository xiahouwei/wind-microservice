<template>
	<w-app-container>
		<fx-page-header title="权限管理"></fx-page-header>
		<w-app-container direction="row" class="fx-page-first-container">
			<listContainer
				ref="listContainer"
				@on-refresh="initList"
				@on-create="onCreate"
				@on-edit="onEdit"
			></listContainer>
			<createContainer ref="createContainer" @on-close="refreshList" @goto-connect-employee="gotoConnectEmployee"></createContainer>
		</w-app-container>
	</w-app-container>
</template>
<script>
import listContainer from './components/list-container/Index.vue'
import createContainer from './components/create-container/Index.vue'
export default {
	name: 'financialClass',
	components: {
		listContainer,
		createContainer
	},
	mounted () {
		this.initList()
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
		},
		gotoConnectEmployee (data) {
			this.$refs.listContainer.onConnectEmpoyeeDialog(data)
		}
	}
}
</script>
