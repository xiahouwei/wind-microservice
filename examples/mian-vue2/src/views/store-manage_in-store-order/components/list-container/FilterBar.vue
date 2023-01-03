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
import { mapGetters } from 'vuex'
import { filterItemConfig } from './FilterItemConfig'
import { BILL_TYPE } from './Index.vue'
export default {
	name: 'filterBar',
	props: {
		billStateDisabled: {
			type: Boolean,
			default: false
		}
	},
	data () {
		return {
			stateSearchList: this.$fxStateMiddleware.getStateConfig('billSearchState'),
			generateWayList: this.$fxTypeMiddleware.getCommonTypeList('generate_way_in_store'),
			organIdList: [],
			otherOrganIdList: [],
			itemCascaderData: [],
			itemTypeProps: {
				value: 'id',
				label: 'name',
				children: 'children',
				checkStrictly: true,
				multiple: true,
				emitPath: false
			},
			itemList: [],
			billTypeList: [],
			billBizTypeList: [],
			inHouseList: [],
			outHouseList: [],
			otherHouseList: [],
			billtypeSelect: [],
			filter: {
				dateRang: [],
				userBillCode: '',
				sysBillCode: '',
				billState: [],
				organId: [],
				otherOrganId: [],
				itemType: [],
				item: [],
				billBizTypeId: [],
				billType: [],
				operateMan: [],
				inHouse: [],
				otherHouse: [],
				tagKey: '',
				memo: '',
				generateWay: [],
				bdmemo: '',
				sendState: []
			},
			sendStateList: this.$fxStateMiddleware.getStateConfig('sendSrmState'),
			operatorList: [],
			tabStoreFilterKeys: ['name', 'code', 'pinYin', 'organName'],
			pickerOptions: this.$fxGetDatePickerOptionsShortcuts('all'),
			selectLoading: false
		}
	},
	computed: {
		...mapGetters(['mainFilterItemRenderGetter'])
	},
	watch: {
		'filter.userBillCode' (val) {
			this.filter.sysBillCode = val
		}
	},
	created () {
		this.getItemTypeCascader()
	},
	methods: {
		onSearchClick () {
			this.$emit('on-search')
		},
		getAccountingPeriod ({ billState, businessDate, beginDate, endDate, clearDate, organId } = {}) {
			this.filter.billState = billState ? [...billState].map(item => item - 0) : []
			if (organId) {
				this.getOrganList()
			}
			this.filter.organId = organId ? [organId] : []
			if (clearDate) {
				return Promise.resolve()
			}
			if (businessDate) {
				this.filter.dateRang = [businessDate + ' 00:00:00', businessDate + ' 23:59:59']
				return Promise.resolve()
			}
			if (beginDate && endDate) {
				this.filter.dateRang = [beginDate, endDate]
				return Promise.resolve()
			}
			return this.$fxApi('inStore.getFilterAccountingPeriod').then(res => {
				this.filter.dateRang = [res.begin, res.end]
				return Promise.resolve()
			})
		},
		initFilter () {
			this.filter = {
				dateRang: [],
				userBillCode: '',
				sysBillCode: '',
				billState: [],
				organId: [],
				otherOrganId: [],
				itemType: [],
				item: [],
				billBizTypeId: [],
				billType: [],
				operateMan: [],
				inHouse: [],
				otherHouse: [],
				tagKey: '',
				memo: '',
				generateWay: [],
				bdmemo: '',
				businessDate: [],
				sendState: []
			}
		},
		onResetClick () {
			this.initFilter()
			this.getAccountingPeriod()
			this.inHouseList = []
			this.outHouseList = []
		},
		getFilterParams () {
			if (this.filter.dateRang && this.filter.dateRang.length) {
				this.filter.businessDate = [this.filter.dateRang[0], this.filter.dateRang[1]]
			} else {
				this.filter.businessDate = []
			}
			this.filter['detail-memo'] = this.filter.bdmemo
			this.filter['detail-itemTypeId'] = this.filter.itemType
			this.filter['detail-itemId'] = this.filter.item
			this.filter['detail-inHouseId'] = this.filter.inHouse
			this.filter['detail-outHouseId'] = this.filter.otherHouse
			this.filter['bill.memo'] = this.filter.memo
			return this.filter
		},
		organIdChange () {
			this.filter.inHouse = []
			this.getInHouseList()
		},
		otherOrganIdChange () {
			this.filter.otherHouse = []
			this.getOutHouseList()
		},
		getItemTypeCascader () {
			return this.$fxApi('inStore.getItemTypeCascader').then(res => {
				this.itemCascaderData = res
			})
		},
		getItemSelectTab () {
			if (!this.itemList.length) {
				this.selectLoading = true
				return this.$fxApi('inStore.getItemSelectTab')({ loading: false }).then(res => {
					this.itemList = res
					this.selectLoading = false
					return Promise.resolve()
				})
			} else {
				return Promise.resolve()
			}
		},
		getBillBizTypeSelect () {
			if (!this.billBizTypeList.length) {
				this.selectLoading = true
				return this.$fxApi('inStore.getBillBizTypeSelect')({ data: [], loading: false }).then(res => {
					this.billBizTypeList = res
					this.selectLoading = false
					return Promise.resolve()
				})
			} else {
				return Promise.resolve()
			}
		},
		getBilltypeSelect () {
			if (!this.billtypeSelect.length) {
				this.selectLoading = true
				return this.$fxApi('inStore.getBilltypeSelect')({ loading: false }).then(res => {
					this.billtypeSelect = res.map(item => {
						item.visibleFlag = true
						return item
					})
					this.selectLoading = false
					return Promise.resolve()
				})
			} else {
				return Promise.resolve()
			}
		},
		onInHouseSelectShow () {
			if (!this.inHouseList.length) {
				this.selectLoading = true
				return this.getInHouseList().then(() => {
					this.selectLoading = false
					return Promise.resolve()
				})
			} else {
				return Promise.resolve()
			}
		},
		getInHouseList () {
			const params = {
				organIdList: this.filter.organId
			}
			const typeList = [2, 1]
			return this.$fxApi('inStore.getInhouseSelect', typeList)({ data: params, loading: false }).then(res => {
				this.inHouseList = res
				return Promise.resolve()
			})
		},
		onOutHouseSelectShow () {
			if (!this.outHouseList.length) {
				this.selectLoading = true
				return this.getOutHouseList().then(() => {
					this.selectLoading = false
					return Promise.resolve()
				})
			} else {
				return Promise.resolve()
			}
		},
		getOutHouseList () {
			if (this.filter.otherOrganId.length === 1 && this.filter.otherOrganId[0] === 'empty') {
				this.outHouseList = []
				return Promise.resolve()
			}
			const params = {
				organIdList: this.filter.otherOrganId.filter(item => {
					return item !== 'empty'
				})
			}
			return this.$fxApi('inStore.getOuthouseSelect')({ data: params, loading: false }).then(res => {
				this.outHouseList = res
				return Promise.resolve()
			})
		},
		getOrganList () {
			if (!this.organIdList.length) {
				this.selectLoading = true
				const typeList = ['2', '1']
				return this.$fxApi('inStore.getOrganSelectTab', typeList)({ loading: false }).then(res => {
					this.organIdList = res
					this.selectLoading = false
					return Promise.resolve()
				})
			} else {
				return Promise.resolve()
			}
		},
		getOtherOrganList () {
			if (!this.otherOrganIdList.length) {
				this.selectLoading = true
				return this.$fxApi('inStore.getOtherOrganSelect')({ loading: false }).then(res => {
					this.otherOrganIdList = res
					this.selectLoading = false
					return Promise.resolve()
				})
			} else {
				return Promise.resolve()
			}
		},
		getAgentList () {
			if (!this.operatorList.length) {
				this.selectLoading = true
				return this.$fxApi('inStore.getAgentList')({ data: [], loading: false }).then(res => {
					this.operatorList = res
					this.selectLoading = false
					return Promise.resolve()
				})
			} else {
				return Promise.resolve()
			}
		},
		optionRender (h, { item }) {
			h = this.$createElement
			return <div class="fx-common__cell-select__option fx-ellipsis">
				<span class="fx-common__cell-select__option-left fx-ellipsis" title={item.name}>{ item.name }</span>
				<span class="fx-common__cell-select__option-right fx-ellipsis" title={item.organName}>{ item.organName }</span>
			</div>
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
