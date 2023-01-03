<template>
	<w-app-container>
		<fx-page-header title="单据展示设置"></fx-page-header>
		<w-app-container direction="column" class="fx-page-first-container">
			<el-tabs
				v-model="currentTag"
				type="card"
				class="filter-setting__tabs"
				@tab-remove="onTabRemove"
			>
				<el-tab-pane
					v-for="(item) in tagData"
					:key="item.name"
					:label="item.title"
					:name="item.name"
					:closable="item.closable"
					class="filter-setting__pane"
				>
					<fx-render-dom :backValue="item" :render="tabContextRender"></fx-render-dom>
				</el-tab-pane>
			</el-tabs>
		</w-app-container>
	</w-app-container>
</template>
<script>
import OrderManage from './components/OrderManage.vue'
import OrderFilterSetting from './components/OrderFilterSetting.vue'
export default {
	name: 'filterSetting',
	data () {
		return {
			currentTag: 'manage',
			tagData: [{
				title: '单据管理',
				name: 'manage'
			}]
		}
	},
	methods: {
		onTabRemove (tabName) {
			const index = this.tagData.findIndex(item => item.name === tabName)
			if (~index) {
				this.tagData.splice(index, 1)
				this.currentTag = this.tagData[index - 1].name
			}
		},
		tabContextRender (h, item) {
			h = this.$createElement
			if (item.name === 'manage') {
				return (
					<OrderManage on-on-click={this.onFilterSettingModuleClick}></OrderManage>
				)
			} else {
				return (
					<OrderFilterSetting options={item.options}></OrderFilterSetting>
				)
			}
		},
		onFilterSettingModuleClick (moduleItem) {
			const current = this.tagData.find(item => item.name === moduleItem.id)
			if (!current) {
				const tagParams = {
					title: moduleItem.label,
					name: moduleItem.id,
					closable: true,
					options: moduleItem
				}
				this.tagData.push(tagParams)
			}
			this.currentTag = moduleItem.id
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.filter-setting{
	&__tabs {
		flex: 1
		display: flex;
		flex-direction: column;
		overflow-x: auto
		>>>.el-tabs__header {
			margin-left: 20px
			.el-tabs__nav {
				border: none !important
			}
			}
		>>>.el-tabs__item {
			width: 150px
			text-align: center
			border-top-left-radius: 6px
			border-top-right-radius: 6px
			background-color: #eee
			border: none
			margin-right: 4px
			position:relative
			font-weight: normal
			&.is-active {
				background-color: $fxBlue9
				border-bottom: 1px solid $fxBlue9
				font-weight: bold
			}
			&:hover {
				font-weight: bold
			}
			.el-icon-close {
				position: absolute;
				right: 10px;
				top: 50%
				transform: translateY(-50%)
			}
		}
		>>>.el-tabs__content {
			flex: 1
			display: flex;
			flex-direction: column;
			.filter-setting__pane {
				flex: 1
				display: flex;
				flex-direction: column;
				overflow-x: auto
			}
		}
	}
}
</style>

