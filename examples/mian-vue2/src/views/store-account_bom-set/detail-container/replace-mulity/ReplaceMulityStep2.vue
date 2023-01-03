<template>
	<div class="setting-step2-container">
		<el-tabs
			v-model="currentTag"
			type="card"
			class="organ-manage__tabs"
		>
			<el-tab-pane
				v-for="(item) in tagData"
				:key="item.name"
				:label="item.title"
				:name="item.name"
				class="organ-manage__pane"
			>
				<fx-render-dom
					:backValue="item"
					:render="tabContextRender"
				></fx-render-dom>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
import tabSuccessList from './TabSuccessList.vue'
import tabFailList from './TabFailList.vue'
export default {
	name: 'replaceMulityStep2',
	props: {
		type: String
	},
	data () {
		return {
			currentTag: 'success',
			tagData: [
				{ title: '成功明细', name: 'success' },
				{ title: '失败明细', name: 'fail' }
			],
			dataInfo: {}
		}
	},
	methods: {
		open (dataInfo) {
			this.dataInfo = dataInfo
		},
		tabContextRender (h, item) {
			h = this.$createElement
			if (item.name === 'success') {
				return (
					<tabSuccessList ref="tabSuccessList" type={this.type} tableData={this.dataInfo.success}></tabSuccessList>
				)
			} else {
				return (
					<tabFailList ref="tabFailList" type={this.type} tableData={this.dataInfo.fail}></tabFailList>
				)
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.setting-step2-container {
	width: 100%
}
.organ-manage__tabs {
	height: 100%
	display: flex
	flex-direction: column
	>>> .el-tabs__content {
		flex: 1
		flex-direction: column
		.organ-manage__pane {
			height: 100%
			flex: 1;
			display: flex;
		}
	}
}
</style>
