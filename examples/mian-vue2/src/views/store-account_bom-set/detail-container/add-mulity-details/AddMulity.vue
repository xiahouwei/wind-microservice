<template>
	<w-dialog
		v-model="dialogVisible"
		width="1200px"
		title="添加品项"
		heightFullscreen
		@close="close"
		:beforeClose="onBeforeClose"
	>
		<div class="create-organ">
			<div class="add-mulity__container">
				<treeContainer
					ref="treeContainer"
					:data="tableTreeData"
					showCheckbox
					readonly
					:showTreeWidthExtendBtn="false"
					@check="onTreeCheck"
				></treeContainer>
				<fx-transfer
					v-model="listSelectIds"
					:tableColumn="tableColumn"
					:tableData="listData"
					:filter="transferFilter"
					leftTitle="全部品项"
					rightTitle="选定品项"
				></fx-transfer>
			</div>
		</div>
		<template slot="footer">
			<el-button @click="onCancelClick">取消</el-button>
			<el-button type="primary" @click="onSaveClick">保存</el-button>
		</template>
	</w-dialog>
</template>
<script>
import treeContainer from '@/components/tree-container/tree-item/Index.vue'
export default {
	name: 'addMulity',
	components: {
		treeContainer
	},
	props: {
		type: String,
		bomDetail: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	data () {
		return {
			dialogVisible: false,
			tableTreeData: [],
			treeCheckedKeys: [],
			tableColumn: [
				{ prop: 'name', label: '名称', required: true },
				{ prop: 'spec', label: '规格', required: true }
			],
			listSelectIds: [],
			store: '',
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			listData: [],
			refreshBomCard: false
		}
	},
	computed: {
	},
	methods: {
		async open (data) {
			this.refreshBomCard = false
			if (data) {
				this.refreshBomCard = true
			}
			this.listData = []
			this.listSelectIds = []
			await this.getItemList(this.bomDetail.id)
			return this.initOrganTree().then(() => {
				this.dialogVisible = true
				this.fxDataVerification.resetData(this.listSelectIds)
				return Promise.resolve()
			})
		},
		initOrganTree () {
			return this.$fxApi('itemType.getItemTree').then(res => {
				this.treeCheckedKeys = []
				this.tableTreeData = res
				return Promise.resolve()
			})
		},
		onStoreChange (id) {
			this.listSelectIds = []
			this.getItemList(id)
		},
		getItemList (storeId) {
			if (this.type === 'compose_bom') {
				return this.$fxApi('bom.addMulityGetItem4batch', this.type, this.bomDetail.id).then(res => {
					this.listData = res
					return Promise.resolve(res)
				})
			} else {
				return this.$fxApi('bom.addMulityGetItem', this.type, this.bomDetail.id).then(res => {
					this.listData = res
					return Promise.resolve(res)
				})
			}
		},
		onTreeCheck (data, { checkedKeys }) {
			this.treeCheckedKeys = checkedKeys
		},
		transferFilter (item) {
			return this.treeCheckedKeys.length === 0 || this.treeCheckedKeys.includes(item.itemType)
		},
		close () {
			this.$refs.treeContainer.clearSearchInput()
		},
		onCancelClick () {
			this.verificationDetails().then(() => {
				this.dialogVisible = false
			})
		},
		onSaveClick () {
			if (this.listSelectIds.length === 0) {
				this.$fxMessage.warning('请选择添加品项')
				return false
			}
			const selectItems = this.listData.filter(item => {
				return this.listSelectIds.includes(item.id)
			})
			const submitData = selectItems.map(item => {
				return {
					item: { id: item.id },
					unit: item.itemUnitList[0]
				}
			})
			const addItemInfo = this.getAddItemListInfo(selectItems)
			const logger = this.$fxLogger.createInfo('basic-archives.bom.addMulityDetails', { code: this.bomDetail.code, name: this.bomDetail.name, addItemInfo })
			this.$fxApi('bom.addDetailsMulity', this.type, this.bomDetail.id)({ data: submitData, logger }).then(res => {
				this.dialogVisible = false
				this.$emit('on-details-refresh', res, this.refreshBomCard)
			})
		},
		verificationDetails () {
			return this.fxDataVerification.checkComfirm(this.listSelectIds)
		},
		onBeforeClose (close) {
			this.verificationDetails().then(close)
		},
		getAddItemListInfo (selectItems) {
			const names = selectItems.map(item => item.name).join(',')
			return `品项名称:${names}`
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.create-organ {
	flex: 1
	display: flex;
	flex-direction: column;
	overflow: auto;
	.add-mulity__container {
		flex: 1
		display: flex;
		flex-direction: row;
		overflow hidden
		.tree-container {
			margin-top:21px
		}
	}
}
</style>
