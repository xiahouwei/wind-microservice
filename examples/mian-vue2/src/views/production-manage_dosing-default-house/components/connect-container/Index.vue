<template>
	<w-dialog v-model="dialogVisible" width="1200px" title="关联品项" heightFullscreen :beforeClose="onBeforeClose" @close="close">
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
		<template slot="footer">
			<el-button @click="onCancelClick">取消</el-button>
			<el-button type="primary" @click="onSaveClick">保存</el-button>
		</template>
	</w-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import connectByItem from './connect-by-item.vue'
const connectRefsList = [
	{ ref: 'connectByItem', dataKey: 'item', text: '品项' }
]
export default {
	name: 'connect-item',
	data () {
		return {
			dialogVisible: false,
			currentTag: 'connectByItem',
			tagData: connectRefsList.map(item => ({ title: `按${item.text}关联`, name: item.ref })),
			itemDetails: {},
			tableTreeData: [],
			treeCheckedKeys: [],
			tableData: {},
			tableSearchKey: '',
			listSelectIds: {},
			itemIds: [],
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			rowDataVerification: this.$fxUtils.fxDataVerification()
		}
	},
	computed: {
		...mapGetters(['detailsAuthGetter'])
	},
	methods: {
		open (item) {
			this.currentTag = 'connectByItem'
			this.dialogVisible = true
			this.itemDetails = item
			this.itemDetails.organType = 3
			this.initOrganTree().then(this.refreshConnectList).then(() => {
				this.fxDataVerification.resetData(this.itemIds)
				this.setChildData()
			})
		},
		close () {
			connectRefsList.forEach(item => {
				this.itemIds = []
				this.listSelectIds[item.dataKey] = []
				this.tableTreeData = []
				this.tableData[item.dataKey] = []
				this.$refs[item.ref].clear()
			})
			this.setChildData()
		},
		onCancelClick () {
			this.verificationSelected().then(() => {
				this.close()
				this.dialogVisible = false
			})
		},
		onSaveClick () {
			connectRefsList.forEach(item => {
				this.itemIds = this.$refs[item.ref].listSelectIds
			})
			return new Promise(resolve => {
				// const logger = this.$fxLogger.createInfo('basic-archives.role-manage.connectEmployee', this.createLoggerParams(this.rowDataVerification.getOriginData(), selectRows))
				return this.$fxApi('dosingDefaultHouse.saveRelationItem', this.itemDetails.id)({ data: this.itemIds }).then(res => {
					this.fxDataVerification.resetData(this.itemIds)
					this.emitAuthRefresh()
					return Promise.resolve()
				})
			})
		},
		createLoggerParams (pre, cur) {
			return {
				pre,
				cur,
				name: this.itemDetails.name
			}
		},
		initOrganTree () {
			return this.$fxApi('itemType.getItemTree').then(res => {
				this.treeCheckedKeys = []
				this.tableTreeData = res
				return Promise.resolve()
			})
		},
		refreshConnectList () {
			return this.$fxApi('dosingDefaultHouse.getHouseSelectItem', this.itemDetails.id).then(res => {
				this.tableData = res
				this.itemIds = res.filter(item => {
					return item.selectFlag === true
				}).map(item => {
					return item.id
				})
				return Promise.resolve()
			})
		},
		tabContextRender (h, item) {
			h = this.$createElement
			if (item.name === 'connectByItem') {
				return (
					<connectByItem ref="connectByItem"></connectByItem>
				)
			}
		},
		setChildData () {
			connectRefsList.forEach(item => {
				this.$refs[item.ref].setData({
					listSelectIds: this.itemIds,
					tableTreeData: this.tableTreeData,
					tableData: this.tableData
				})
			})
		},
		verificationSelected () {
			connectRefsList.forEach(item => {
				this.itemIds = this.$refs[item.ref].listSelectIds
			})
			return this.fxDataVerification.checkComfirm(this.itemIds)
		},
		onBeforeClose (close) {
			this.verificationSelected().then(close)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
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
