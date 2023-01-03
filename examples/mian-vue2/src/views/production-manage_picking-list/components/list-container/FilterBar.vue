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
			pickingList: this.$fxTypeMiddleware.getCommonTypeList('pickingType'),
			pickCompleteList: this.$fxTypeMiddleware.getCommonTypeList('pickCompleteType'),
			filter: {
				dateRang: [],
				userBillCode: '',
				billState: [],
				billType: [],
				organId: [],
				pickComplete: []
			},
			organList: [],
			houseList: [],
			itemList: [],
			operatorList: [],
			organListLoading: false,
			selectLoading: false,
			itemSelectLoading: false,
			tabStoreFilterKeys: ['name', 'code', 'pinYin', 'organName'],
			pickerOptions: this.$fxGetDatePickerOptionsShortcuts('all')
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
	methods: {
		onSearchClick () {
			this.$emit('on-search', this.filter)
		},
		getAccountingPeriod ({ billState, businessDate, beginDate, endDate, clearDate, organId } = {}) {
			this.filter.billState = billState ? [...billState].map(item => item - 0) : []
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
			return this.$fxApi('inStoreAssign.getAccountingPeriod').then(res => {
				this.filter.dateRang = [res.begin, res.end]
			})
		},
		initFilter () {
			this.filter = {
				dateRang: [],
				userBillCode: '',
				sysBillCode: '',
				billState: [],
				billType: [],
				organId: [],
				inHouse: [],
				outHouse: [],
				product: [],
				dosing: [],
				operateMan: [],
				pickComplete: []
			}
		},
		onResetClick () {
			this.initFilter()
			this.getAccountingPeriod()
		},
		getFilterParams () {
			if (this.filter.dateRang && this.filter.dateRang.length) {
				this.filter.businessDate = [this.filter.dateRang[0], this.filter.dateRang[1]]
			} else {
				this.filter.businessDate = []
			}
			this.filter['detail-inHouseId'] = this.filter.inHouse
			this.filter['detail-outHouseId'] = this.filter.outHouse
			this.filter['product-itemId'] = this.filter.product
			this.filter['dosing-itemId'] = this.filter.dosing
			return this.filter
		},
		getSelectData () {
			this.getFilterOrganSelectList()
			this.getItemSelectList()
		},
		// 机构
		getFilterOrganSelectList () {
			this.organListLoading = true
			return this.$fxApi('pickingList.getFilterOrganSelectList').then(res => {
				this.organList = res
				this.organListLoading = false
			})
		},
		onOrganListVisibleChange (flag) {
			if (flag) {
				this.getFilterOrganSelectList()
			}
		},
		otherOrganIdChange () {
			this.filter.inHouse = []
			this.filter.outHouse = []
			this.getHouseList()
		},
		onHouseSelectShow () {
			if (!this.houseList.length) {
				this.selectLoading = true
				return this.getHouseList().then(() => {
					this.selectLoading = false
					return Promise.resolve()
				})
			} else {
				return Promise.resolve()
			}
		},
		getHouseList () {
			const params = {
				organIdList: this.filter.organId
			}
			const typeList = [1]
			return this.$fxApi('pickingList.getHouseSelect', typeList)({ data: params, loading: false }).then(res => {
				this.houseList = res
				return Promise.resolve()
			})
		},
		// 品项列表
		getItemSelectList () {
			this.itemSelectLoading = true
			return this.$fxApi('pickingList.getItemSelectTab').then(res => {
				this.itemList = res
				this.itemSelectLoading = false
				return Promise.resolve()
			})
		},
		// 经办人
		getAgentList () {
			if (!this.operatorList.length) {
				this.selectLoading = true
				return this.$fxApi('pickingList.getAgentList')({ data: [], loading: false }).then(res => {
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
	width: 150px
}
</style>
