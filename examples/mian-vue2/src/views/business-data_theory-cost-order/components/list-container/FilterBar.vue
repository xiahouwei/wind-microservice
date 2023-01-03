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
			stateSearchList: this.$fxStateMiddleware.getStateConfig('billSearchState'),
			billCreateTypeList: this.$fxTypeMiddleware.getCommonTypeList('billCreateType'),
			otherOrganIdList: [],
			itemList: [],
			billTypeList: [],
			billBizTypeList: [],
			outHouseList: [],
			billtypeSelect: [],
			filter: {
				dateRang: [],
				userBillCode: '',
				sysBillCode: '',
				billState: [],
				organId: [],
				'detail-outHouseId': [],
				'detail-itemId': [],
				billBizTypeId: [],
				billType: [],
				tagKey: '',
				memo: '',
				source: [],
				bdmemo: '',
				businessDate: []
			},
			tabStoreFilterKeys: ['name', 'code', 'pinYin', 'organName'],
			pickerOptions: this.$fxGetDatePickerOptionsShortcuts('all')
		}
	},
	watch: {
		'filter.userBillCode' (val) {
			this.filter.sysBillCode = val
		}
	},
	computed: {
		...mapGetters(['mainFilterItemRenderGetter'])
	},
	methods: {
		onSearchClick () {
			this.$emit('on-search')
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
			return this.$fxApi(`${apiName}.getAccountingPeriod`).then(res => {
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
				'detail-outHouseId': [],
				'detail-itemId': [],
				billBizTypeId: [],
				billType: [],
				tagKey: '',
				memo: '',
				source: [],
				bdmemo: '',
				businessDate: []
			}
		},
		onResetClick () {
			this.initFilter()
			this.getAccountingPeriod()
			this.getOutHouseList()
		},
		getFilterParams () {
			if (this.filter.dateRang && this.filter.dateRang.length) {
				this.filter.businessDate[0] = this.filter.dateRang[0]
				this.filter.businessDate[1] = this.filter.dateRang[1]
			} else {
				this.filter.businessDate = []
			}
			this.filter['detail-memo'] = this.filter.bdmemo
			return this.filter
		},
		getSelectData () {
			this.getOtherOrganList()
			this.$fxApi(`${apiName}.getItemSelect`).then(res => {
				this.itemList = res
			})
			this.$fxApi(`${apiName}.getBillBizTypeSelect`)({ data: [] }).then(res => {
				this.billBizTypeList = res
			})
			// this.$fxApi(`${apiName}.getBilltypeSelect`).then(res => {
			// 	this.billtypeSelect = res[0].map(item => {
			// 		item.visibleFlag = true
			// 		return item
			// 	})
			// })
			this.getOutHouseList()
		},
		organIdChange () {
			this.filter['detail-outHouseId'] = []
			this.getOutHouseList()
		},
		getOutHouseList () {
			const params = {
				organIdList: this.filter.organId
			}
			this.$fxApi(`${apiName}.getOuthouseSelect`)({ data: params, loading: false }).then(res => {
				this.outHouseList = res
			})
		},
		getOtherOrganList () {
			return this.$fxApi(`${apiName}.getOtherOrganSelect`).then(res => {
				this.otherOrganIdList = res
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
