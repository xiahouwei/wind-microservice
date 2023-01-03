<template>
	<w-dialog v-model="dialogVisible" width="1200px" title="关联品项" heightFullscreen @close="close">
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
			<el-button
				v-fx-auth:basic-archives_support-archives_take-stock-class.edit-take-stock-class
				type="primary"
				@click="onSaveClick"
			>保存</el-button>
		</template>
	</w-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import connectByItem from './connect-by-item.vue'
import connectByClass from './connect-by-class.vue'
import { apiName } from '../TakeStockClassCreateDialog.vue'
const connectRefsList = [
	{ ref: 'connectByItem', dataKey: 'item', text: '品项' },
	{ ref: 'connectByClass', dataKey: 'itemType', text: '品项类别' }
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
			fxDataVerification: this.$fxUtils.fxDataVerification()
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
			this.initOrganTree().then(this.refreshConnectList).then(() => {
				this.setChildData()
				this.$nextTick(() => {
					const selectRows = {}
					connectRefsList.forEach(item => {
						selectRows[item.dataKey] = this.$refs[item.ref].$refs.transfer.getSelectRows()
					})
					this.fxDataVerification.resetData(selectRows)
				})
			})
		},
		close () {
			connectRefsList.forEach(item => {
				this.listSelectIds[item.dataKey] = []
				this.tableTreeData = []
				this.tableData[item.dataKey] = []
				this.$refs[item.ref].clear()
			})
			this.setChildData()
		},
		onCancelClick () {
			this.dialogVisible = false
		},
		onSaveClick () {
			connectRefsList.forEach(item => {
				this.listSelectIds[item.dataKey] = this.$refs[item.ref].listSelectIds
			})
			const itemMap = this.$refs.connectByItem.$refs.transfer.getSelectRows().map(item => {
				return {
					itemId: item.id,
					mustFlag: item.mustFlag
				}
			})
			const itemTypeMap = this.$refs.connectByClass.$refs.transfer.getSelectRows().map(item => {
				return {
					itemTypeId: item.id
				}
			})
			const data = [...itemMap, ...itemTypeMap]
			return new Promise(resolve => {
				const selectRows = {}
				connectRefsList.forEach(item => {
					selectRows[item.dataKey] = this.$refs[item.ref].$refs.transfer.getSelectRows()
				})
				const logger = this.$fxLogger.createInfo('basic-archives.support-archives.take-stock-class.item', this.createLoggerParams(this.fxDataVerification.getOriginData(), selectRows))
				this.$fxApi(`${apiName}.settingItem`, this.itemDetails.id)({ data, logger }).then(() => {
					this.fxDataVerification.resetData(selectRows)
					resolve()
				})
			})
		},
		createLoggerParams (pre, cur) {
			return {
				pre,
				cur,
				name: this.itemDetails.name,
				code: this.itemDetails.code
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
			return this.$fxApi(`${apiName}.getItemById`, this.itemDetails.id).then(res => {
				this.tableData = res
				connectRefsList.forEach(item => {
					this.listSelectIds[item.dataKey] = res[item.dataKey].filter(item => {
						return item.depositFlag === 1
					}).map(item => {
						return item.id
					})
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
			} else {
				return (
					<connectByClass ref="connectByClass"></connectByClass>
				)
			}
		},
		setChildData () {
			connectRefsList.forEach(item => {
				this.$refs[item.ref].setData({
					listSelectIds: this.listSelectIds[item.dataKey],
					tableTreeData: this.tableTreeData,
					tableData: this.tableData[item.dataKey]
				})
			})
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
