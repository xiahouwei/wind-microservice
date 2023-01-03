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
import { mapState } from 'vuex'
import { apiName } from '../../Index.vue'
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
			sysArrivalInterval: state => state.system.sysParamsConfig.CXGL_XSDD_SJQZL_EXPECTTIME.value
		}),
		isHand () {
			return this.isCommonTypeByRules('hand')(this.organDetails.billType, this.organDetails.subBillType, this.organDetails)
		},
		isSupplier () {
			return this.$fxTypeMiddleware.isCommonType('allOrganType')('supplier')(this.organDetails.organ.organType)
		}
	},
	methods: {
		async open () {
			this.listSelectIds = []
			const listData = await this.getItemList()
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
		getItemList () {
			const params = {
				urgent: this.organDetails.urgent,
				stockPlanId: this.organDetails.stockPlan.id,
				sellerOrganId: this.organDetails.organ.id,
				orderDate: this.organDetails.businessDate
			}
			if (this.isHand && this.isSupplier && !this.organDetails.stockPlan.id) {
				params.supplierId = this.organDetails.organ.id
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
		onSaveClick () {
			if (this.listSelectIds.length === 0) {
				this.$fxMessage.warning('请选择添加品项')
				return false
			}
			const listDataMap = this.$fxUtils.compareArrayUtils(this.listData, { key: 'id' })
			const selectItems = this.listSelectIds.map(id => {
				return listDataMap.get(id)
			})
			const params = selectItems.map(item => {
				const itemUnit = item.itemUnitList[0] || {}
				return {
					item,
					itemUnit
				}
			})
			const addItemListInfo = this.getAddItemListInfo(selectItems)
			const logger = this.$fxLogger.createInfo('stock-sale-manage.sale-order.addMulityDetails', { orderData: this.organDetails, addItemListInfo })
			this.$fxApi(`${apiName}.addDetailsMulity`, this.organDetails.id, params)({ logger }).then(res => {
				this.dialogVisible = false
				this.$emit('on-details-refresh', res)
			})
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
