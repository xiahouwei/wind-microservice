<template>
	<w-app-container>
		<fx-page-header title="入库分派"></fx-page-header>
		<createContainer ref="createContainer"></createContainer>
	</w-app-container>
</template>
<script>
import createContainer from './components/create-container/Index.vue'
export default {
	name: 'inStoreAssign',
	components: {
		createContainer
	},
	activated () {
		if (this.$route.query.id) {
			this.$refs.createContainer.assignOneOrder(this.$route.query)
		} else if (this.$fxAppTabs.isNewTab()) {
			this.$refs.createContainer.toStep1()
		} else {
			this.$refs.createContainer.initData()
		}
	}
}
</script>
