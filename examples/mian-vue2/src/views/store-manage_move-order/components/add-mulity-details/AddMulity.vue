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
				<el-form-item v-if="showInHouse" label="入库仓库：">
					<w-select
						:value="inHouseId"
						:optionlist="inHouseSelectList"
						:disabled="isSingleInHouse"
						class="form-item-input"
						@change="onInHouseChange"
						dropdownWidth='300px'
						:optionRender='optionRender'
					>
					</w-select>
				</el-form-item>
				<el-form-item v-if="showOutHouse" label="出库仓库：">
					<w-select
						:value="outHouseId"
						:optionlist="outHouseSelectList"
						:disabled="isSingleOutHouse"
						class="form-item-input"
						@change="onOutHouseChange"
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
import { apiName } from '../../Index.vue'
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
		inHouseSelectList: {
			type: Array,
			default: () => {
				return []
			}
		},
		outHouseSelectList: {
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
			listData: [],
			inHouseId: '',
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			outHouseId: ''
		}
	},
	computed: {
		isSingleInHouse () {
			return this.organDetails.singleInHouseFlag === 1
		},
		isSingleOutHouse () {
			return this.organDetails.singleOutHouseFlag === 1
		},
		currentApplyType () {
			return this.$fxTypeMiddleware.getCommonTypeItemByRule('moveBillCreateType')(this.organDetails.billType, this.organDetails.applyMode)
		},
		showInHouse () {
			return this.currentApplyType.type !== 'outstore'
		},
		showOutHouse () {
			return this.currentApplyType.type !== 'instore'
		}
	},
	methods: {
		async open (inHouseId, outHouseId) {
			this.inHouseId = ''
			this.outHouseId = ''
			this.listSelectIds = []
			let listData = null
			if (this.currentApplyType.type === 'outstore') {
				if (this.isSingleOutHouse) {
					this.outHouseId = outHouseId
				} else if (this.outHouseSelectList.length === 1) {
					this.outHouseId = this.outHouseSelectList[0].id
				} else if (this.outHouseSelectList.length > 1) {
					const defaultStroe = this.outHouseSelectList.find(item => {
						return item.defaultOutFlag
					})
					this.outHouseId = defaultStroe ? defaultStroe.id : this.outHouseSelectList[0].id
				}
				listData = this.outHouseId ? await this.getItemList(this.outHouseId) : []
			} else {
				if (this.isSingleInHouse) {
					this.inHouseId = inHouseId
				} else if (this.inHouseSelectList.length === 1) {
					this.inHouseId = this.inHouseSelectList[0].id
				} else if (this.inHouseSelectList.length > 1) {
					const defaultStroe = this.inHouseSelectList.find(item => {
						return item.defaultInFlag
					})
					this.inHouseId = defaultStroe ? defaultStroe.id : this.inHouseSelectList[0].id
				}
				listData = this.inHouseId ? await this.getItemList(this.inHouseId) : []
				if (this.currentApplyType.type === 'inside') {
					if (this.isSingleOutHouse) {
						this.outHouseId = outHouseId
					} else if (this.outHouseSelectList.length === 1) {
						this.outHouseId = this.outHouseSelectList[0].id
					} else if (this.outHouseSelectList.length > 1) {
						const defaultStroe = this.outHouseSelectList.find(item => {
							return item.defaultOutFlag
						})
						this.outHouseId = defaultStroe ? defaultStroe.id : this.outHouseSelectList[0].id
					}
				}
			}
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
		onInHouseChange (id) {
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
					this.onSaveClick(false).then(() => {
						this.storeChangeHandler(id).then(() => {
							this.inHouseId = id
						})
					})
				}).catch(()	=> {
					this.storeChangeHandler(id).then(() => {
						this.inHouseId = id
					})
				})
			} else {
				this.storeChangeHandler(id).then(() => {
					this.inHouseId = id
				})
			}
		},
		onOutHouseChange (id) {
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
					this.outHouseChangeHandler(id)
				}).catch(()	=> {
					this.outHouseChangeHandler(id)
				})
			} else {
				this.outHouseChangeHandler(id)
			}
		},
		outHouseChangeHandler (id) {
			if (this.currentApplyType.type !== 'inside') {
				this.storeChangeHandler(id).then(() => {
					this.outHouseId = id
				})
			} else {
				this.listSelectIds = []
				this.outHouseId = id
			}
		},
		storeChangeHandler (id) {
			this.listSelectIds = []
			return this.getItemList(id).then(res => {
				this.listData = res
				return Promise.resolve(res)
			})
		},
		getItemList (storeId) {
			return this.$fxApi(`${apiName}.getItemByStore`, this.organDetails.id, storeId)
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
			if (this.inHouseId === this.outHouseId) {
				this.$fxMessage.warning('入库仓库与出库仓库不能相同')
				return false
			}
			const listDataMap = this.$fxUtils.compareArrayUtils(this.listData, { key: 'id' })
			const selectItems = this.listSelectIds.map(id => {
				return listDataMap.get(id)
			})
			const params = selectItems.map(item => {
				const itemUnit = item.itemUnitList[0] || {}
				const mainUnitId = (item.itemUnitList.find(item => {
					return !!item.mainFlag
				}) || {}).id
				return {
					inHouse: {
						id: this.inHouseId
					},
					outHouse: {
						id: this.outHouseId
					},
					item,
					itemUnit,
					amount: 0,
					assistUnitAmount: '',
					memo: '',
					mainUnitId
				}
			})
			const addItemListInfo = this.getAddItemListInfo(selectItems)
			const logger = this.$fxLogger.createInfo('store-manage.move-order.addMulityDetails', { orderData: this.organDetails, addItemListInfo })
			return this.$fxApi(`${apiName}.addDetailsMulity`, this.organDetails.id, params)({ logger }).then(res => {
				if (close) {
					this.dialogVisible = false
				}
				this.$emit('on-details-refresh', res)
				return Promise.resolve()
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
