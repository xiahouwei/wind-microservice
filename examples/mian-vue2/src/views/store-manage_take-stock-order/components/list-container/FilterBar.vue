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
			sysBillCode: '',
			billState: [],
			organId: [],
			houseId: [],
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
			billType: [],
			entryClerk: [],
			source: [],
			tagKey: '',
			memo: '',
			detailMemo: '',
			stateSearchList: this.$fxStateMiddleware.getStateConfig('billSearchState'),
			billCreateTypeList: this.$fxTypeMiddleware.getCommonTypeList('billCreateType'),
			organIdList: [],
			houseIdList: [],
			itemList: [],
			billBizTypeList: [],
			billtypeSelect: [],
			entryClerkList: [],
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
		getAccountingPeriod ({ billState, businessDate, beginDate, endDate, clearDate, organId } = {}) {
			this.billState = billState ? [...billState].map(item => item - 0) : []
			this.organId = organId ? [organId] : []
			if (clearDate) {
				return Promise.resolve()
			}
			if (businessDate) {
				this.dateRang = [businessDate + ' 00:00:00', businessDate + ' 23:59:59']
				return Promise.resolve()
			}
			if (beginDate && endDate) {
				this.dateRang = [beginDate, endDate]
				return Promise.resolve()
			}
			return this.$fxApi('inStoreAssign.getAccountingPeriod').then(res => {
				this.dateRang = [res.begin, res.end]
				return Promise.resolve()
			})
		},
		initFilter () {
			this.dateRang = []
			this.sysBillCode = ''
			this.billState = []
			this.organId = []
			this.houseId = []
			this.itemType = []
			this.item = []
			this.billBizType = []
			this.billType = []
			this.entryClerk = []
			this.source = []
			this.tagKey = ''
			this.memo = ''
			this.detailMemo = ''
		},
		onResetClick () {
			this.initFilter()
			this.getAccountingPeriod()
		},
		getFilterParams () {
			const businessDate = this.dateRang || []
			return {
				businessDate,
				sysBillCode: this.sysBillCode,
				userBillCode: this.sysBillCode,
				'detail-modifyMan': this.entryClerk,
				billState: this.billState,
				billType: this.billType,
				billBizTypeId: this.billBizType,
				organId: this.organId,
				houseId: this.houseId,
				'detail-itemTypeId': this.itemType,
				'detail-itemId': this.item,
				memo: this.memo,
				'detail-memo': this.detailMemo
			}
		},
		initSelect () {
			this.getOrganSelect()
			this.getHouseSelect()
			this.getItemTypeCascader()
			this.getItemSelect()
			this.getBillBizTypeSelect()
			this.getBillTypeSelect()
			this.getEmployeeSelect()
		},
		getOrganSelect () {
			return this.$fxApi(`${apiName}.getOrganSelect`).then(res => {
				this.organIdList = res
			})
		},
		getHouseSelect (ids = []) {
			const params = { organIdList: ids }
			return this.$fxApi(`${apiName}.getHouseSelect`)({ data: params }).then(res => {
				this.houseIdList = res
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
		getBillBizTypeSelect () {
			return this.$fxApi(`${apiName}.getBillBizTypeSelect`).then(res => {
				this.billBizTypeList = res
			})
		},
		getBillTypeSelect () {
			return this.$fxApi(`${apiName}.getBilltypeSelect`).then(res => {
				this.billtypeSelect = res
			})
		},
		getEmployeeSelect () {
			return this.$fxApi(`${apiName}.getEmployeeSelect`).then(res => {
				this.entryClerkList = res
			})
		},
		onOrganChange (val) {
			this.getHouseSelect(val)
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
