<template>
	<w-dialog v-model="dialogVisible" width="1200px" title="关联品项" heightFullscreen @close="close">
		<el-tabs
			v-model="currentTag"
			type="card"
			class="supplier-manage__tabs"
		>
			<el-tab-pane
				v-for="(item) in tagData"
				:key="item.name"
				:label="item.title"
				:name="item.name"
				class="supplier-manage__pane"
			>
				<fx-render-dom
					:backValue="item"
					:render="tabContextRender"
				></fx-render-dom>
			</el-tab-pane>
		</el-tabs>
		<template slot="footer">
			<w-link icon="export-excel-blue" @click="onExport">导出关联关系</w-link>
			<w-link v-fx-auth:basic-archives_supplier-manage.edit-supplier icon="copy-single" @click="onConnectItemWithStore">与其他{{organTypeLabel}}一致</w-link>
			<w-link v-fx-auth:basic-archives_supplier-manage.edit-supplier icon="copy-mulity" @click="onCopyConnect">复制关系</w-link>
			<el-button @click="onCancelClick">取消</el-button>
			<el-button v-fx-auth:basic-archives_supplier-manage.edit-supplier type="primary" @click="onSaveClick">保存</el-button>
		</template>
		<copyWithStoreDialog ref="copyWithStoreDialog" @do-close="doClose" :organTypeLabel="organTypeLabel"></copyWithStoreDialog>
		<copyConnectDialog ref="copyConnectDialog" :organTypeLabel="organTypeLabel"></copyConnectDialog>
	</w-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import copyWithStoreDialog from '../copy-with-store.vue'
import copyConnectDialog from '../copy-connect.vue'
import connectByItem from './connect-by-item.vue'
import connectByClass from './connect-by-class.vue'
const connectRefsList = [
	{ ref: 'connectByItem', dataKey: 'item', text: '品项' },
	{ ref: 'connectByClass', dataKey: 'itemType', text: '品项类别' }
]
export default {
	name: 'connect-item',
	components: {
		copyWithStoreDialog,
		copyConnectDialog
	},
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
		...mapGetters(['detailsAuthGetter']),
		organTypeLabel () {
			return this.$fxTypeMiddleware.getCommonTypeItemById('supplierType')(this.itemDetails.organType).label
		}
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
				this.$refs[item.ref].treeCheckedKeys = []
				this.$refs[item.ref].$refs.treeContainer.clearSearchInput()
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
			return new Promise(resolve => {
				const selectRows = {}
				connectRefsList.forEach(item => {
					selectRows[item.dataKey] = this.$refs[item.ref].$refs.transfer.getSelectRows()
				})
				const logger = this.$fxLogger.createInfo('basic-archives.supplier-manage.connectItem', this.createLoggerParams(this.fxDataVerification.getOriginData(), selectRows))
				this.$fxApi('supplier.saveConnectItem', this.itemDetails.organType, this.itemDetails.id)({ data: this.listSelectIds, logger }).then(() => {
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
				type: this.organTypeLabel
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
			return this.$fxApi('supplier.getConnectItem', this.itemDetails.id).then(res => {
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
		onConnectItemWithStore () {
			this.$refs.copyWithStoreDialog.open(this.itemDetails)
		},
		onExport () {
			const logger = this.$fxLogger.createInfo('basic-archives.supplier-manage.exportConnectItem')
			return this.$fxApi('supplier.exportConnectItem', this.itemDetails.id)({ logger }).then(res => {
				this.$fxUtils.downloadFile(res)
			})
		},
		onCopyConnect () {
			this.onSaveClick().then(() => {
				this.$refs.copyConnectDialog.open(this.itemDetails)
			})
		},
		doClose (relAllGoods) {
			if (relAllGoods) {
				this.itemDetails.relAllGoods = !!relAllGoods
				this.dialogVisible = false
			} else {
				this.refreshConnectList().then(this.setChildData).then(() => {
					const selectRows = {}
					connectRefsList.forEach(item => {
						selectRows[item.dataKey] = this.$refs[item.ref].$refs.transfer.getSelectRows()
					})
					this.fxDataVerification.resetData(selectRows)
				})
			}
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
.supplier-manage__tabs {
	height: 100%
	display: flex
	flex-direction: column
	>>> .el-tabs__content {
		flex: 1
		flex-direction: column
		.supplier-manage__pane {
			height: 100%
			flex: 1;
			display: flex;
		}
	}
}
</style>
