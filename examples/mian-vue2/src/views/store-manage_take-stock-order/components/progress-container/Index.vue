<template>
	<w-dialog
		v-model="dialogVisible"
		title="盘点进度查询"
		width="940px"
		@close="onRefresh"
	>
		<listPage
			v-show="showList"
			ref="listPage"
			@on-click="onClick"
			:checkClassSelectList='checkClassSelectList'
		>
		</listPage>
    <detailPage
			v-show="!showList"
			:visible.sync="showList"
			ref="detailPage"
			:detailData="detailData"
		>
		</detailPage>
	</w-dialog>
</template>
<script>
import listPage from './ListPage.vue'
import detailPage from './DetailPage.vue'
import { apiName } from '../../Index.vue'
export default {
	name: 'checkProgress',
	components: {
		listPage,
		detailPage
	},
	data () {
		return {
			dialogVisible: false,
			showList: true,
			detailData: [],
			checkClassSelectList: []
		}
	},
	methods: {
		open () {
			this.dialogVisible = true
			this.getCheckList()
			this.$nextTick(() => {
				this.$refs.listPage.onSearch()
			})
		},
		onRefresh () {
			this.showList = true
			this.$refs.listPage.onRefresh()
			this.$emit('on-refresh')
		},
		onClick (params) {
			this.$fxApi(`${apiName}.getCheckProgressDetail`)({ data: params }).then(res => {
				this.detailData = res
				this.showList = false
			})
		},
		getCheckList () {
			return this.$fxApi(`${apiName}.getCheckClassList`)({
				data: {}
			}).then(res => {
				this.checkClassSelectList = res
				return Promise.resolve(res)
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
>>>.el-dialog__body{
	padding: 10px 30px 20px 30px !important;
}
</style>
