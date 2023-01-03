<template>
	<fx-list-filter label-width="95px" @on-enter="onSearchClick">
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
			processSearchList: this.$fxStateMiddleware.getStateConfig('processSearchState'),
			filter: {
				dateRang: [],
				userBillCode: '',
				billState: [],
				createMachiningFlag: [],
				createPickingFlag: [],
				createProcedureTaskFlag: [],
				organId: [],
				house: [],
				operateMan: []
			},
			organList: [],
			houseList: [],
			itemList: [],
			operatorList: [],
			organListLoading: false,
			selectLoading: false,
			tabStoreFilterKeys: ['name', 'code', 'pinYin', 'organName'],
			pickerOptions: this.$fxGetDatePickerOptionsShortcuts('all')
		}
	},
	computed: {
		...mapGetters(['mainFilterItemRenderGetter', 'isProductionPro'])
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
				return Promise.resolve()
			})
		},
		initFilter () {
			this.filter = {
				dateRang: [],
				userBillCode: '',
				sysBillCode: '',
				billState: [],
				createMachiningFlag: [],
				createPickingFlag: [],
				createProcedureTaskFlag: [],
				organId: [],
				house: [],
				item: []
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
			return this.filter
		},
		getSelectData () {
			this.getFilterOrganSelectList()
		},
		// 机构
		getFilterOrganSelectList () {
			this.organListLoading = true
			return this.$fxApi('productionPlan.getFilterOrganSelectList').then(res => {
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
			this.filter.house = []
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
		getItemSelectShow () {
			if (!this.itemList.length) {
				this.selectLoading = true
				return this.$fxApi('productionPlan.getItemSelectTab')({ loading: false }).then(res => {
					this.itemList = res
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
			return this.$fxApi('productionPlan.getHouseSelect', typeList)({ data: params, loading: false }).then(res => {
				this.houseList = res
				return Promise.resolve()
			})
		},
		optionRender (h, { item }) {
			h = this.$createElement
			return <div class="fx-common__cell-select__option fx-ellipsis">
				<span class="fx-common__cell-select__option-left fx-ellipsis" title={item.name}>{ item.name }</span>
				<span class="fx-common__cell-select__option-right fx-ellipsis" title={item.organName}>{ item.organName }</span>
			</div>
		},
		filterItemRender () {
			if (!this.isProductionPro()) {
				const costPower = ['生成工序任务']
				let filterBar = this.mainFilterItemRenderGetter(BILL_TYPE)('basic', filterItemConfig)
				filterBar = filterBar.filter(item => {
					return !costPower.includes(item.componentOptions.propsData.label)
				})
				return filterBar
			} else {
				return this.mainFilterItemRenderGetter(BILL_TYPE)('basic', filterItemConfig)
			}
		},
		filterItemMoreRender () {
			return this.mainFilterItemRenderGetter(BILL_TYPE)('more', filterItemConfig)
		},
		getAgentList () {
			if (!this.operatorList.length) {
				this.selectLoading = true
				return this.$fxApi('productionPlan.getAgentList')({ data: [], loading: false }).then(res => {
					this.operatorList = res
					this.selectLoading = false
					return Promise.resolve()
				})
			} else {
				return Promise.resolve()
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-date-input {
	width: 405px
}
.form-input {
	width: 150px
}
</style>
