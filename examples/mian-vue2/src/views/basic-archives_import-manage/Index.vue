<template>
	<w-app-container>
		<fx-page-header title="基础数据导入"></fx-page-header>
		<w-app-container direction="row" class="fx-page-first-container">
			<importContainer></importContainer>
		</w-app-container>
	</w-app-container>
</template>
<script>
import importContainer from './components/import-container/Index.vue'
export const apiName = 'import'
export default {
	name: 'importManage',
	components: {
		importContainer
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.fx-page-first-container {
	justify-content center
}
</style>
