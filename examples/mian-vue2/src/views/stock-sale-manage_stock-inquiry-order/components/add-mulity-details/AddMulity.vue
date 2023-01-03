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
				<el-form-item label="卖方机构：">
					<w-select-tab
						v-model="seller"
						:optionlist="sellerSelectList"
						class="form-item-input"
						:optionRender='optionRender'
					>
					</w-select-tab>
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
import { mapState } from 'vuex'
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
		sellerSelectList: {
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
			seller: '',
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			listData: []
		}
	},
	computed: {
		...mapState({
			sysArrivalInterval: state => state.system.sysParamsConfig.CXGL_CGJHD_SJQZL_EXPECTTIME.value
		})
	},
	methods: {
		async open () {
			this.seller = ''
			this.listSelectIds = []
			this.seller = this.sellerSelectList[0].listData[0].id
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
		optionRender (h, { item }) {
			h = this.$createElement
			return <div class="fx-common__cell-select__option fx-ellipsis">
				<span class="fx-common__cell-select__option-left fx-ellipsis" title={item.code}>{ item.code }</span>
				<span class="fx-common__cell-select__option-right fx-ellipsis" title={item.name}>{ item.name }</span>
			</div>
		},
		getItemList () {
			return this.$fxApi(`${apiName}.getItemList`, this.organDetails.id)
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
				const itemUnit = item.itemUnitList[0] || {}
				return {
					billId: this.organDetails.id,
					otherOrgan: {
						id: this.seller
					},
					item,
					itemUnit,
					taxPrice: 0,
					taxRate: 0,
					price: 0,
					isUnique: 0
				}
			})
			const addItemListInfo = this.getAddItemListInfo(selectItems)
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-inquiry-order.addMulityDetails', { orderData: this.organDetails, addItemListInfo })
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
