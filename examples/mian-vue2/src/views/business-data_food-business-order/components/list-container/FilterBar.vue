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
			stateSearchList: this.$fxStateMiddleware.getStateConfig('foodBusinessBillSearchState'),
			offsetSearchList: this.$fxStateMiddleware.getStateConfig('billOffsetState'),
			organIdList: [],
			salesRegionList: [],
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
				offsetState: [],
				organId: [],
				otherOrganId: [],
				item: [],
				billBizTypeId: [],
				billType: [],
				tagKey: '',
				memo: '',
				bdmemo: ''
			},
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
				offsetState: [],
				organId: [],
				salesRegionId: [],
				item: [],
				billBizTypeId: [],
				billType: [],
				tagKey: '',
				memo: '',
				bdmemo: '',
				businessDate: []
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
			this.filter['detail-memo'] = this.filter.bdmemo
			this.filter['detail-itemId'] = this.filter.item
			return this.filter
		},
		getSelectData () {
			this.getOrganList()
			this.getSalesRegionList()
			this.getBillType()
			this.getBillBizTypeSelect()
			this.getItemSelect()
		},
		getOrganList () {
			return this.$fxApi(`${apiName}.getOrganSelect`).then(res => {
				this.organIdList = res
			})
		},
		getSalesRegionList (ids = []) {
			const params = {
				organIdList: ids,
				organTypeList: [1, 2],
				enableFlag: 1
			}
			return this.$fxApi(`${apiName}.getSalesRegionList`)({ data: params }).then(res => {
				this.salesRegionList = res
			})
		},
		getBillType () {
			return this.$fxApi(`${apiName}.getBillType`).then(res => {
				this.billtypeSelect = res
			})
		},
		getBillBizTypeSelect () {
			this.$fxApi(`${apiName}.getBillBizTypeSelect`)({ data: [] }).then(res => {
				this.billBizTypeList = res
			})
		},
		getItemSelect () {
			this.$fxApi(`${apiName}.getItemSelect`).then(res => {
				this.itemList = res
			})
		},
		optionRender (h, { item }) {
			h = this.$createElement
			return <div class="fx-common__cell-select__option fx-ellipsis">
				<span class="fx-common__cell-select__option-left fx-ellipsis" title={item.name}>{ item.name }</span>
				<span class="fx-common__cell-select__option-right fx-ellipsis" title={item.organName}>{ item.organName }</span>
			</div>
		},
		changeOrgan (e) {
			this.getSalesRegionList(e)
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
