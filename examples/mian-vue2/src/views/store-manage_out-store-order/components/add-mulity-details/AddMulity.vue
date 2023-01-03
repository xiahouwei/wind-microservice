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
			<el-form size="mini" label-position="left" label-width="75px" inline class="add-mulity__store">
				<el-form-item label="出库仓库：">
					<w-select
						:value="store"
						:optionlist="outStoreWareList"
						:disabled="isSingleHouse"
						class="form-item-input"
						@change="onStoreChange"
						dropdownWidth='300px'
						:optionRender='optionRender'
					>
					</w-select>
				</el-form-item>
			</el-form>
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
					selectDataSort
					leftTitle="全部品项"
					rightTitle="选定品项"
				></fx-transfer>
			</div>
		</div>
		<template slot="footer">
			<el-button @click="onCancelClick">取消</el-button>
			<fx-button type="save" @click="onSaveClick">保存</fx-button>
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
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		outStoreWareList: {
			type: Array,
			default: () => {
				return []
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
			listData: []
		}
	},
	computed: {
		isSingleHouse () {
			return this.organDetails.singleHouseFlag === 1
		}
	},
	methods: {
		async open () {
			this.store = ''
			this.listSelectIds = []
			if (this.isSingleHouse) {
				this.store = this.organDetails.outHouse.id
			} else if (this.outStoreWareList.length === 1) {
				this.store = this.outStoreWareList[0].id
			} else if (this.outStoreWareList.length > 1) {
				const defaultStroe = this.outStoreWareList.find(item => {
					return item.defaultOutFlag
				})
				this.store = defaultStroe ? defaultStroe.id : this.outStoreWareList[0].id
			}
			const listData = this.store ? await this.getItemListMulity(this.store) : []
			return this.initOrganTree().then(() => {
				this.listData = listData
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
		optionRender (h, { item }) {
			h = this.$createElement
			return <div class="fx-common__cell-select__option fx-ellipsis">
				<span class="fx-common__cell-select__option-left fx-ellipsis" title={item.code}>{ item.code }</span>
				<span class="fx-common__cell-select__option-right fx-ellipsis" title={item.name}>{ item.name }</span>
			</div>
		},
		onStoreChange (id) {
			if (this.listSelectIds.length) {
				this.$fxConfirm({
					message: '切换仓库后，已添加至右侧的数据如何处理？',
					option: {
						confirmButtonText: '按原仓库进行保存',
						cancelButtonText: '清空已选数据',
						showClose: false,
						closeOnClickModal: false,
						closeOnPressEscape: false
					}
				}).then(() => {
					this.onSaveClick(false)
					this.storeChangeHandler(id)
				}).catch(()	=> {
					this.storeChangeHandler(id)
				})
			} else {
				this.storeChangeHandler(id)
			}
		},
		storeChangeHandler (id) {
			this.listSelectIds = []
			this.getItemListMulity(id).then(res => {
				this.listData = res
				this.store = id
				return Promise.resolve(res)
			})
		},
		getItemListMulity (storeId) {
			return this.$fxApi('outStore.getItemListMulity', this.organDetails.id, storeId)
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
		onSaveClick (close = true) {
			if (this.listSelectIds.length === 0) {
				this.$fxMessage.warning('请选择添加品项')
				return false
			}
			const listDataMap = this.$fxUtils.compareArrayUtils(this.listData, { key: 'id' })
			const selectItems = this.listSelectIds.map(id => {
				return listDataMap.get(id)
			})
			const submitData = selectItems.map(item => {
				const mainUnitId = item.itemUnitList.find(item => {
					return item.mainFlag === 1
				}).id
				return {
					item: { id: item.id },
					mainUnitId,
					outHouse: {
						id: this.store
					},
					itemUnit: {
						id: item.itemUnitList[0].id
					}
				}
			})
			const addItemListInfo = this.getAddItemListInfo(selectItems)
			const logger = this.$fxLogger.createInfo('store-manage.out-store-order.addMulityDetails', { orderData: this.organDetails, addItemListInfo })
			this.$fxApi('outStore.addDetailsMulity', this.organDetails.id, submitData)({ logger }).then(res => {
				if (close) {
					this.dialogVisible = false
				}
				this.$emit('on-details-refresh', res)
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
			const outHouse = this.outStoreWareList.find(item => item.id === this.store).name
			return `出库仓库:${outHouse},品项名称:${names}`
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
