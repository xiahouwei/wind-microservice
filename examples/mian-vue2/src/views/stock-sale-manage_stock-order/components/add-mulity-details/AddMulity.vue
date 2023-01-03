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
				<el-form-item label="买方仓库：">
					<w-select
						:value="store"
						:optionlist="storeSelectList"
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
					selectDataSort
					leftTitle="全部品项"
					rightTitle="选定品项"
				></fx-transfer>
			</div>
		</div>
		<template slot="footer">
			<el-button @click="onCancelClick">取消</el-button>
			<fx-button type="primary" @click="onSaveClick">保存</fx-button>
		</template>
	</w-dialog>
</template>
<script>
import { apiName } from '../../Index.vue'
import { mapState } from 'vuex'
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
		storeSelectList: {
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
			isCommonTypeByRules: this.$fxTypeMiddleware.isCommonType('saleOrderGenerateType', 'rules'),
			listData: []
		}
	},
	computed: {
		...mapState({
			sysArrivalInterval: state => state.system.sysParamsConfig.CXGL_CGDD_SJQZL_EXPECTTIME.value
		}),
		isSingleHouse () {
			return this.organDetails.singleHouse === 1
		},
		isHand () {
			return this.isCommonTypeByRules('hand')(this.organDetails.billType, this.organDetails.subBillType, this.organDetails)
		},
		isSupplier () {
			return this.$fxTypeMiddleware.isCommonType('allOrganType')('supplier')(this.organDetails.otherOrganType)
		}
	},
	methods: {
		async open () {
			this.store = ''
			this.listSelectIds = []
			if (this.isSingleHouse) {
				this.store = this.organDetails.inHouse
			} else if (this.storeSelectList.length === 1) {
				this.store = this.storeSelectList[0].id
			} else if (this.storeSelectList.length > 1) {
				const defaultStroe = this.storeSelectList.find(item => {
					return item.defaultInFlag
				})
				this.store = defaultStroe ? defaultStroe.id : this.storeSelectList[0].id
			}
			const listData = this.store ? await this.getItemList(this.store) : []
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
					this.onSaveClick(false).then(() => {
						this.storeChangeHandler(id)
					})
				}).catch(()	=> {
					this.storeChangeHandler(id)
				})
			} else {
				this.storeChangeHandler(id)
			}
		},
		storeChangeHandler (id) {
			this.store = id
			this.listSelectIds = []
			this.getItemList(id).then(res => {
				this.listData = res
				return Promise.resolve(res)
			})
		},
		getItemList (storeId, extraItemId = '') {
			const params = {
				houseId: storeId,
				extraItemId,
				buyerOrganId: this.organDetails.organ.id,
				stockPlanId: this.organDetails.purchasePlan,
				sellerOrganId: this.organDetails.otherOrganId,
				orderDate: this.organDetails.orderDate
			}
			if (this.isHand && this.isSupplier && !this.organDetails.purchasePlan) {
				params.supplierId = this.organDetails.otherOrganId
			}
			return this.$fxApi(`${apiName}.getItemList`)({ data: params })
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
		verificationDetails () {
			return this.fxDataVerification.checkComfirm(this.listSelectIds)
		},
		onBeforeClose (close) {
			this.verificationDetails().then(close)
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
			const params = selectItems.map(item => {
				const arrivalDate = new Date(this.organDetails.orderDate).getTime() + this.$fxUtils.h2ms(this.sysArrivalInterval)
				const itemUnit = item.itemUnitList[0] || {}
				return {
					billId: this.organDetails.id,
					inHouse: {
						id: this.store
					},
					item,
					itemUnit,
					mainUnitId: '',
					amount: 0,
					taxPrice: 0,
					taxMoney: 0,
					taxRate: 0,
					price: 0,
					money: 0,
					taxRateMoney: 0,
					assistUnitAmount: item.assistUnit ? 0 : '',
					expectArrivalDate: this.$fxUtils.setDateTime(new Date(arrivalDate), '时分'),
					abortAssign: 0,
					itemUnitList: item.itemUnitList,
					stockPlanDetail: item.stockPlanDetail,
					memo: ''
				}
			})
			const addItemListInfo = this.getAddItemListInfo(selectItems)
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-order.addMulityDetails', { orderData: this.organDetails, addItemListInfo })
			return this.$fxApi(`${apiName}.addDetailsMulity`, this.organDetails.id, params)({ logger }).then(res => {
				if (close) {
					this.dialogVisible = false
				}
				this.$emit('on-details-refresh', res)
				return Promise.resolve()
			})
		},
		getAddItemListInfo (selectItems) {
			const names = selectItems.map(item => item.name).join(',')
			const storeName = this.storeSelectList.find(item => item.id === this.store).name
			return `买方仓库:${storeName},品项名称:${names}`
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
