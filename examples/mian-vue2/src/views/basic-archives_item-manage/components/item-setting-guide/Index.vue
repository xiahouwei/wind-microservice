<template>
	<w-dialog
		v-model="dialogVisible"
		title="品项设置向导"
		fullscreen
	>
		<div class="setting-container">
			<tree-container :treeData="treeData" :visibleFlag="dialogVisible" @on-tree-item-click="onTreeItemClick"></tree-container>
			<div class="list-container">
				<div class="list-container__title">
					<span class="list-container__title-name">品项名称：<i class="list-container__title-heightline">{{itemDetails.name}}</i></span>
				</div>
				<component
					ref="listContainer"
					:is="currentSettingType.component"
					:itemDetails="itemDetails"
				></component>
			</div>
		</div>
		<template slot="footer">
			<fx-button @click="onCancelClick">取消</fx-button>
		</template>
	</w-dialog>
</template>
<script>
import treeContainer from '@/components/tree-container/tree-item-setting-guide/Index.vue'
import stockPlanSetting from './stock-plan-setting/StockPlanSetting.vue'
import pricePlanSetting from './price-plan-setting/PricePlanSetting.vue'
import takeStockClassSetting from './TakeStockClassSetting.vue'
export default {
	name: 'itemSettingGuide',
	components: {
		treeContainer,
		stockPlanSetting,
		pricePlanSetting,
		takeStockClassSetting
	},
	data () {
		return {
			dialogVisible: false,
			itemDetails: {},
			currentSettingType: {},
			treeData: this.$fxTypeMiddleware.getCommonTypeList('itemSettingGuideList')
		}
	},
	methods: {
		open (itemDetails) {
			this.itemDetails = itemDetails
			this.currentSettingType = this.treeData[0]
			this.dialogVisible = true
			this.$nextTick(() => {
				this.$refs.listContainer.initData()
			})
		},
		onCancelClick () {
			this.dialogVisible = false
		},
		onTreeItemClick (settingType) {
			this.currentSettingType = settingType
			this.$nextTick(() => {
				this.$refs.listContainer.initData()
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.setting-container {
	flex: 1
	display: flex;
	flex-direction: row;
	overflow: auto;
	.list-container {
		flex: 1
		overflow:auto
		display: flex;
		flex-direction: column;
		&__title {
			padding-left: 10px
			margin-bottom 10px
			&-heightline {
				font-size: 14px
				font-weight: 700
			}
			&-name {
				margin-right: 30px
			}
		}
	}
}
</style>
