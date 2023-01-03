<template>
	<w-dialog
		v-model="dialogVisible"
		heightFullscreen
		width='1300px'
		title="基础信息同步"
	>
		<el-tabs v-model="activeName" @tab-click="handleClick" class="tabs">
			<el-tab-pane :label='itemSyncName' name="item" class="tabpane">
				<itemSync
					ref='itemSync'
					:itemSyncData='itemSyncData'
					:itemList='itemList'
					@updateData='updateData'
					@refreshItem='getItemListData'
				></itemSync>
			</el-tab-pane>
		</el-tabs>
	</w-dialog>
</template>
<script>
import itemSync from './ItemSync.vue'
import { apiName } from '../../Index.vue'
export default {
	name: 'Index',
	components: {
		itemSync
	},
	data () {
		return {
			dialogVisible: false,
			activeName: 'item',
			itemSyncData: [],
			itemList: []
		}
	},
	computed: {
		itemSyncName () {
			return `待同步品项信息（${this.itemSyncData.length || 0}）`
		}
	},
	methods: {
		open () {
			this.dialogVisible = true
			this.getItemListData()
		},
		handleClick () {},
		getItemListData (message = '') {
			this.$fxApi(`${apiName}.getNotSyncCPList`).then(res => {
				for (const i of res) {
					i.method = 1
					i.relItem = ''
				}
				this.itemSyncData = res
				if (message) {
					this.$fxMessage.success(message)
				}
			})
			this.$fxApi(`${apiName}.getItemList`).then(res => {
				this.itemList = res
			})
		},
		updateData (data) {
			this.itemSyncData = data
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.tabs {
	height 100%
}
>>>.el-tabs__content {
	height 90%
}
.tabpane {
	height 100%
	>>>.el-scrollbar__view {
	height 100%
	}
}
</style>
