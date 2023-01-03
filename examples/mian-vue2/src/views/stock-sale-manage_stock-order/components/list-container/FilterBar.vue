<template>
	<fx-list-filter @on-enter="onSearchClick">
		<template slot="row-1">
			<fx-render-dom :render="filterItemRender"></fx-render-dom>
		</template>
		<template slot="row-2">
			<fx-render-dom :render="filterItemMoreRender"></fx-render-dom>
		</template>
		<template slot="tools">
			<el-button class="order-btn" type="primary" @click="onSearchClick">查询</el-button>
			<el-button class="order-btn" plain @click="onResetClick">重置</el-button>
		</template>
	</fx-list-filter>
</template>
<script>
import { apiName } from '../../Index.vue'
import { mapGetters } from 'vuex'
import { filterItemConfig } from './FilterItemConfig'
import { BILL_TYPE } from './Index.vue'
export default {
	name: 'filterBar',
	data () {
		return {
			dateRang: [],
			billCode: '',
			buyerOrgan: [],
			sellerOrgan: [],
			itemCascaderData: [],
			itemTypeProps: {
				value: 'id',
				label: 'name',
				children: 'children',
				checkStrictly: true,
				multiple: true,
				emitPath: false
			},
			itemType: [],
			item: [],
			billBizType: [],
			buyerHouse: [],
			purchasePlan: [],
			state: [],
			billKind: [],
			sendState: [],
			urgent: [],
			tagKey: '',
			memo: '',
			bdmemo: '',
			operateMan: [],
			stateSearchList: this.$fxStateMiddleware.getStateConfig('billSearchState'),
			sendStateList: this.$fxStateMiddleware.getStateConfig('sendSrmState'),
			urgentStateList: this.$fxStateMiddleware.getStateConfig('urgentState'),
			billCreateTypeList: [],
			organIdList: [],
			otherOrganIdList: [],
			buyerHouseList: [],
			itemList: [],
			billBizTypeList: [],
			purchasePlanList: [],
			operatorList: [],
			tabStoreFilterKeys: ['name', 'code', 'pinYin', 'organName'],
			pickerOptions: this.$fxGetDatePickerOptionsShortcuts('all')
		}
	},
	props: {
		billStateDisabled: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		...mapGetters(['mainFilterItemRenderGetter'])
	},
	methods: {
		onSearchClick () {
			this.$emit('on-search')
		},
		getAccountingPeriod ({ billState, businessDate, clearDate, organId } = {}) {
			this.state = billState ? [...billState].map(item => item - 0) : []
			this.buyerOrgan = organId ? [organId] : []
			if (clearDate) {
				return Promise.resolve()
			}
			if (businessDate) {
				this.dateRang = [businessDate + ' 00:00:00', businessDate + ' 23:59:59']
				return Promise.resolve()
			}
			return this.$fxApi(`${apiName}.getAccountingPeriod`).then(res => {
				this.dateRang = [res.begin, res.end]
				return Promise.resolve()
			})
		},
		initFilter () {
			this.billCode = ''
			this.state = []
			this.buyerOrgan = []
			this.sellerOrgan = []
			this.itemType = []
			this.item = []
			this.billBizType = []
			this.buyerHouse = []
			this.purchasePlan = []
			this.billKind = []
			this.sendState = []
			this.urgent = []
			this.tagKey = ''
			this.memo = ''
			this.bdmemo = ''
			this.operateMan = []
		},
		onResetClick () {
			this.initFilter()
			this.getAccountingPeriod()
		},
		getFilterParams () {
			return {
				businessDate: this.dateRang,
				userBillCode: this.billCode,
				sysBillCode: this.billCode,
				billState: this.state,
				sendState: this.sendState,
				billType: this.billKind,
				billBizTypeId: this.billBizType,
				organId: this.buyerOrgan,
				otherOrganId: this.sellerOrgan,
				purchasePlan: this.purchasePlan,
				urgent: this.urgent,
				tagKey: this.tagKey,
				memo: this.memo,
				'detail-memo': this.bdmemo,
				'detail-inHouseId': this.buyerHouse,
				'detail-itemTypeId': this.itemType,
				'detail-itemId': this.item,
				operateMan: this.operateMan
			}
		},
		initSelect () {
			this.getOrganSelect()
			this.getOtherOrganSelect()
			this.getItemTypeCascader()
			this.getItemSelect()
			this.getBillBizTypeSelect()
			this.getPurchasePlanSelect()
			this.getHouseList()
			this.getBillTypeList()
			this.getAgentList()
		},
		getOrganSelect () {
			return this.$fxApi(`${apiName}.getOrganSelect`).then(res => {
				this.organIdList = res
			})
		},
		getOtherOrganSelect () {
			return this.$fxApi(`${apiName}.getOtherOrganSelect`).then(res => {
				this.otherOrganIdList = res
			})
		},
		getItemTypeCascader () {
			return this.$fxApi(`${apiName}.getItemTypeCascader`).then(res => {
				this.itemCascaderData = res
			})
		},
		getItemSelect () {
			return this.$fxApi(`${apiName}.getItemSelectTab`).then(res => {
				this.itemList = res
			})
		},
		getBillTypeList () {
			return this.$fxApi(`${apiName}.getBillTypeList`).then(res => {
				this.billCreateTypeList = res
				this.billCreateTypeList.forEach(item => {
					item.visibleFlag = true
				})
				return Promise.resolve(res)
			})
		},
		getBillBizTypeSelect () {
			return this.$fxApi(`${apiName}.getBusinessList`)({ data: [] }).then(res => {
				this.billBizTypeList = res
			})
		},
		getHouseList () {
			if (this.buyerOrgan.length === 1 && this.buyerOrgan[0] === 'empty') {
				this.buyerHouseList = []
				return false
			}
			const params = {
				organIdList: this.buyerOrgan.filter(item => {
					return item !== 'empty'
				})
			}
			this.$fxApi(`${apiName}.getBuyerHouseSelectTab`)({ data: params, loading: false }).then(res => {
				this.buyerHouseList = res
			})
		},
		getPurchasePlanSelect () {
			return this.$fxApi(`${apiName}.getPurchasePlanSelect`).then(res => {
				this.purchasePlanList = res
			})
		},
		getAgentList () {
			return this.$fxApi(`${apiName}.getAgentList`)({ data: [] }).then(res => {
				this.operatorList = res
			})
		},
		optionRender (h, { item }) {
			h = this.$createElement
			return <div class="fx-common__cell-select__option fx-ellipsis">
				<span class="fx-common__cell-select__option-left fx-ellipsis" title={item.name}>{ item.name }</span>
				<span class="fx-common__cell-select__option-right fx-ellipsis" title={item.organName}>{ item.organName }</span>
			</div>
		},
		onOrganChange () {
			this.buyerHouse = []
			this.getHouseList()
		},
		filterItemRender () {
			return this.mainFilterItemRenderGetter(BILL_TYPE)('basic', filterItemConfig)
		},
		filterItemMoreRender () {
			return this.mainFilterItemRenderGetter(BILL_TYPE)('more', filterItemConfig)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-date-input {
	width: 380px
}
.form-input {
	width: 180px
}
</style>
