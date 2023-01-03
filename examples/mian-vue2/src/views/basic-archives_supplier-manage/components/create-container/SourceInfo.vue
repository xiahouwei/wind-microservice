<template>
	<w-collapse v-model="collapseVisible" title="来源信息">
		<div class="source-info">
			<sourceManageList v-model="organDetails.sourceList"></sourceManageList>
		</div>
	</w-collapse>
</template>
<script>
import sourceManageList from '@/components/source-manage/SourceManageList.vue'
export default {
	name: 'otherInfo',
	components: {
		sourceManageList
	},
	props: {
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	data () {
		return {
			collapseVisible: false,
			sourceList: []
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
</style>
