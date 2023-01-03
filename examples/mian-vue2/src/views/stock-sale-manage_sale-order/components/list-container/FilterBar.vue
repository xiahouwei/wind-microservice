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
			stockPlanId: [],
			state: [],
			billKind: [],
			inAssignStatus: [],
			outAssignStatus: [],
			supplierState: [],
			urgent: [],
			generateWay: [],
			tagKey: '',
			memo: '',
			bdmemo: '',
			operateMan: [],
			stateSearchList: this.$fxStateMiddleware.getStateConfig('billSearchState'),
			inAssignStateList: this.$fxStateMiddleware.getStateConfig('inAssignState'),
			outAssignStateList: this.$fxStateMiddleware.getStateConfig('outAssignState'),
			sendStateList: this.$fxStateMiddleware.getStateConfig('sendState'),
			urgentStateList: this.$fxStateMiddleware.getStateConfig('urgentState'),
			generateWayList: this.$fxTypeMiddleware.getCommonTypeList('generate_way'),
			billCreateTypeList: [],
			otherOrganIdList: [],
			organIdList: [],
			itemList: [],
			billBizTypeList: [],
			purchasePlanList: [],
			operatorList: [],
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
		getAccountingPeriod ({ billState, inAssignStatus, outAssignStatus, businessDate, clearDate, organId } = {}) {
			this.state = billState ? [...billState].map(item => item - 0) : []
			this.inAssignStatus = inAssignStatus ? [...inAssignStatus].map(item => item - 0) : []
			this.outAssignStatus = outAssignStatus ? [...outAssignStatus].map(item => item - 0) : []
			this.sellerOrgan = organId ? [organId] : []
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
			this.stockPlanId = []
			this.billKind = []
			this.inAssignStatus = []
			this.outAssignStatus = []
			this.supplierState = []
			this.urgent = []
			this.generateWay = []
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
				otherOrganId: this.buyerOrgan,
				organId: this.sellerOrgan,
				'detail-itemTypeId': this.itemType,
				'detail-itemId': this.item,
				billBizTypeId: this.billBizType,
				billType: this.billKind,
				stockPlanId: this.stockPlanId,
				inAssignStatus: this.inAssignStatus,
				outAssignStatus: this.outAssignStatus,
				srmState: this.supplierState,
				urgent: this.urgent,
				generateWay: this.generateWay,
				tagKey: this.tagKey,
				memo: this.memo,
				'detail-memo': this.bdmemo,
				operateMan: this.operateMan
			}
		},
		initSelect () {
			this.getOrganSelect()
			this.getItemTypeCascader()
			this.getItemSelect()
			this.getBillBizTypeSelect()
			this.getPurchasePlanSelect()
			this.getBillTypeList()
			this.getAgentList()
		},
		getOrganSelect () {
			return this.$fxApi(`${apiName}.getOrganSelectTab`).then(res => {
				this.organIdList = res
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
		getBillBizTypeSelect () {
			return this.$fxApi(`${apiName}.getBusinessList`)({ data: [] }).then(res => {
				this.billBizTypeList = res
			})
		},
		getBillTypeList () {
			return this.$fxApi(`${apiName}.getBillTypeList`).then(res => {
				this.billCreateTypeList = res
				return Promise.resolve(res)
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
