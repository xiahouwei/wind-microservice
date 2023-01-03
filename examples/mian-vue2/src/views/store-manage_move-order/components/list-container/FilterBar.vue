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
import { apiName } from '../../Index.vue'
export default {
	name: 'filterBar',
	data () {
		return {
			dateRang: [],
			billCode: '',
			billState: [],
			inOrganId: [],
			outOrganId: [],
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
			moveState: [],
			billBizType: [],
			billType: [],
			operateMan: [],
			inHouse: [],
			outHouse: [],
			source: [],
			tagKey: '',
			memo: '',
			detailMemo: '',
			stateSearchList: this.$fxStateMiddleware.getStateConfig('billSearchState'),
			moveStateList: this.$fxStateMiddleware.getStateConfig('moveState'),
			billCreateTypeList: this.$fxTypeMiddleware.getCommonTypeList('billCreateType'),
			organIdList: [],
			outOrganIdList: [],
			itemList: [],
			billBizTypeList: [],
			billtypeSelect: [],
			inhouseSelect: [],
			outhouseSelect: [],
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
		getAccountingPeriod ({ billState, businessDate, beginDate, endDate, clearDate, organId, otherOrganId } = {}) {
			this.billState = billState ? [...billState].map(item => item - 0) : []
			this.inOrganId = organId ? [organId] : []
			this.outOrganId = otherOrganId ? [otherOrganId] : []
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
			this.billCode = ''
			this.billState = []
			this.inOrganId = []
			this.outOrganId = []
			this.itemType = []
			this.item = []
			this.moveState = []
			this.billBizType = []
			this.billType = []
			this.inHouse = []
			this.outHouse = []
			this.source = []
			this.tagKey = ''
			this.memo = ''
			this.detailMemo = ''
			this.operateMan = []
		},
		onResetClick () {
			this.initFilter()
			this.getAccountingPeriod()
			this.getInHouseList()
			this.getOutHouseList()
		},
		getFilterParams () {
			const businessDate = this.dateRang || []
			return {
				businessDate,
				userBillCode: this.billCode,
				sysBillCode: this.billCode,
				billState: this.billState,
				organId: this.inOrganId,
				otherOrganId: this.outOrganId,
				'detail-itemTypeId': this.itemType,
				'detail-itemId': this.item,
				moveState: this.moveState,
				billBizTypeId: this.billBizType,
				billType: this.billType,
				'detail-inHouseId': this.inHouse,
				'detail-outHouseId': this.outHouse,
				memo: this.memo,
				'detail-memo': this.detailMemo,
				operateMan: this.operateMan
			}
		},
		initSelect () {
			this.getInOrganSelect()
			this.getOutOrganSelect()
			this.getItemTypeCascader()
			this.getItemSelect()
			this.getBillBizTypeSelect()
			this.getBillTypeSelect()
			this.getInHouseList()
			this.getOutHouseList()
			this.getAgentList()
		},
		getInOrganSelect () {
			return this.$fxApi(`${apiName}.getInOrganSelect`).then(res => {
				this.organIdList = res
			})
		},
		getOutOrganSelect () {
			return this.$fxApi(`${apiName}.getOutOrganSelect`).then(res => {
				this.outOrganIdList = res
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
			const params = []
			return this.$fxApi(`${apiName}.getBillBizTypeSelect`)({ data: params }).then(res => {
				this.billBizTypeList = res
			})
		},
		getBillTypeSelect () {
			return this.$fxApi(`${apiName}.getBilltypeSelect`).then(res => {
				this.billtypeSelect = res
			})
		},
		inOrganIdChange () {
			this.inHouse = []
			this.getInHouseList()
		},
		outOrganIdChange () {
			this.outHouse = []
			this.getOutHouseList()
		},
		getInHouseList () {
			this.$fxApi(`${apiName}.getInhouseSelect`)({
				data: {
					organIdList: this.inOrganId
				},
				loading: false
			}).then(res => {
				this.inhouseSelect = res
			})
		},
		getOutHouseList () {
			this.$fxApi(`${apiName}.getOuthouseSelect`)({
				data: {
					organIdList: this.outOrganId
				},
				loading: false
			}).then(res => {
				this.outhouseSelect = res
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
