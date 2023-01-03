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
				<el-form-item label="入库仓库：">
					<w-select
						:value="store"
						:optionlist="inStoreWareList"
						:disabled="isSingleHouse"
						class="form-item-input"
						dropdownWidth='300px'
						:optionRender='optionRender'
						@change="onStoreChange"
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
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		inStoreWareList: {
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
				this.store = this.organDetails.inHouse.id
			} else if (this.inStoreWareList.length === 1) {
				this.store = this.inStoreWareList[0].id
			} else if (this.inStoreWareList.length > 1) {
				const defaultStroe = this.inStoreWareList.find(item => {
					return item.defaultInFlag
				})
				this.store = defaultStroe ? defaultStroe.id : this.inStoreWareList[0].id
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
		optionRender (h, { item }) {
			h = this.$createElement
			return <div class="fx-common__cell-select__option fx-ellipsis">
				<span class="fx-common__cell-select__option-left fx-ellipsis" title={item.code}>{ item.code }</span>
				<span class="fx-common__cell-select__option-right fx-ellipsis" title={item.name}>{ item.name }</span>
			</div>
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
			return this.$fxApi('inStore.getItemListMulity', this.organDetails.id, storeId)
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
			const selectItems = this.listData.filter(item => {
				return this.listSelectIds.includes(item.id)
			})
			const submitData = selectItems.map(item => {
				const mainUnitId = item.itemUnitList.find(item => {
					return item.mainFlag === 1
				}).id
				return {
					item: { id: item.id },
					mainUnitId,
					inHouse: {
						id: this.store
					},
					itemUnit: {
						id: item.itemUnitList[0].id
					}
				}
			})
			const addItemListInfo = this.getAddItemListInfo(selectItems)
			const logger = this.$fxLogger.createInfo('production-manage.production-plan.addMulityDetails', { orderData: this.organDetails, addItemListInfo })
			this.$fxApi('inStore.addDetailsMulity', this.organDetails.id, submitData)({ logger }).then(res => {
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
			const inHouse = this.inStoreWareList.find(item => item.id === this.store).name
			return `入库仓库:${inHouse},品项名称:${names}`
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
