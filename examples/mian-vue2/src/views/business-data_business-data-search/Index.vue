<template>
	<w-app-container>
		<fx-page-header title="营业数据查询"></fx-page-header>
		<w-app-container direction="row" class="fx-page-first-container">
			<listContainer
				ref="listContainer"
			></listContainer>
		</w-app-container>
	</w-app-container>
</template>
<script>
import listContainer from './components/list-container/Index.vue'
export const apiName = 'businessDataSearch'
export default {
	name: 'businessDataSearch',
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
