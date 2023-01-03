<template>
	<fx-list-filter @on-enter="onSearchClick">
		<template slot="row-1">
			<fx-render-dom :render="filterItemRender"></fx-render-dom>
		</template>
		<template slot="row-2">
			<fx-render-dom :render="filterItemMoreRender"></fx-render-dom>
		</template>
		<template slot="tools">
			<fx-button class="order-btn" type="primary" @click="onSearchClick">查询</fx-button>
			<fx-button class="order-btn" plain @click="onResetClick">重置</fx-button>
		</template>
	</fx-list-filter>
</template>
<script>
import { mapGetters } from 'vuex'
import { filterItemConfig } from './FilterItemConfig'
import { BILL_TYPE } from './Index.vue'
import { apiName } from '../../Index.vue'
export default {
	name: 'filterBar',
	data () {
		return {
			stateSearchList: this.$fxStateMiddleware.getStateConfig('billSearchState'),
			organIdList: [],
			otherOrganIdList: [],
			billBizTypeList: [],
			billTypeList: [],
			departmentList: [],
			operatorList: [],
			sourceTypeList: this.$fxTypeMiddleware.getCommonTypeList('sourceTypeList'),
			payWayList: this.$fxTypeMiddleware.getCommonTypeList('payWayList'),
			filter: {
				dateRang: [],
				userBillCode: '',
				sysBillCode: '',
				billState: [],
				organId: [],
				otherOrganId: [],
				billBizTypeId: [],
				billType: [],
				memo: '',
				invoiceCode: '',
				operateman: [],
				sourceType: [],
				payWay: [],
				departmentId: [],
				businessDate: []
			},
			emptyItem: {
				id: 'empty',
				name: '供应链'
			},
			labelWidth: '90px',
			pickerOptions: this.$fxGetDatePickerOptionsShortcuts('all'),
			departmentFilterKeys: ['name', 'code', 'pinYin', 'organName']
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
			return this.$fxApi(`${apiName}.getFilterAccountingPeriod`).then(res => {
				this.filter.dateRang = [res.begin, res.end]
			})
		},
		onResetClick () {
			this.filter = {
				dateRang: [],
				userBillCode: '',
				sysBillCode: '',
				billState: [],
				organId: [],
				otherOrganId: [],
				billBizTypeId: [],
				billType: [],
				memo: '',
				invoiceCode: '',
				operateman: [],
				departmentId: [],
				businessDate: []
			}
			this.getAccountingPeriod()
		},
		getFilterParams () {
			if (this.filter.dateRang && this.filter.dateRang.length) {
				this.filter.businessDate = [this.filter.dateRang[0], this.filter.dateRang[1]]
			} else {
				this.filter.businessDate = []
			}
			this.filter.sysBillCode = this.filter.userBillCode
			return this.filter
		},
		getSelectData () {
			this.getOrganList()
			this.getOtherOrganList()
			this.getAgentList()
			this.getBillBizTypeSelect()
			this.getBillTypeSelect()
			this.getDepartmentSelect()
		},
		getOrganList () {
			const ids = this.filter && this.filter.organId ? [this.filter.organId] : []
			return this.$fxApi(`${apiName}.getOrganSelectTab`)(ids).then(res => {
				this.organIdList = res
			})
		},
		getOtherOrganList () {
			const ids = this.filter && this.filter.otherOrganId ? [this.filter.otherOrganId] : []
			return this.$fxApi(`${apiName}.getOtherOrganSelect`)(ids).then(res => {
				this.otherOrganIdList = res
			})
		},
		getAgentList () {
			return this.$fxApi(`${apiName}.getAgentList`)({ data: [] }).then(res => {
				this.operatorList = res
			})
		},
		getBillBizTypeSelect () {
			// return this.$fxApi(`${apiName}.getBillBizTypeSelect`)({ data: [] }).then(res => {
			this.billBizTypeList = []
			// })
		},
		getBillTypeSelect () {
			return this.$fxApi(`${apiName}.getBillTypeSelect`).then(res => {
				this.billTypeList = res.map(item => {
					item.visibleFlag = true
					return item
				})
			})
		},
		getDepartmentSelect () {
			const basicArchivesOrganId = this.$fxUtils.getSelectTabMulityByIds(this.filter.organId, this.organIdList).map(item => item.organId)
			const params = { organIdList: basicArchivesOrganId }
			return this.$fxApi(`${apiName}.getDepartmentSelect`)({ data: params }).then(res => {
				this.departmentList = res
			})
		},
		organIdChange () {
			this.filter.departmentId = []
			this.getDepartmentSelect()
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
