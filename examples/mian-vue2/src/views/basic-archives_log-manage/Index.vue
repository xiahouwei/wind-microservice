<template>
	<w-app-container>
		<fx-page-header title="操作日志"></fx-page-header>
		<w-app-container direction="row" class="fx-page-first-container">
			<listContainer
				ref="listContainer"
			></listContainer>
		</w-app-container>
	</w-app-container>
</template>
<script>
import listContainer from './components/list-container/Index.vue'
export default {
	name: 'logManage',
	components: {
		listContainer
	},
	mounted () {
		this.$refs.listContainer.$refs.filterBar.getAccountingPeriod().then(() => {
			this.initList()
		})
	},
	methods: {
		initList () {
			this.$refs.listContainer.refresh()
		}
	}
}
</script>
