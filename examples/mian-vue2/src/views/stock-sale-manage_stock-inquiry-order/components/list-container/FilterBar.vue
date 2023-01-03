<template>
	<fx-list-filter @on-enter="onSearchClick">
		<template slot="row-1">
			<fx-render-dom :render="filterItemRender"></fx-render-dom>
		</template>
		<!-- <template slot="row-2">
			<fx-render-dom :render="filterItemMoreRender"></fx-render-dom>
		</template> -->
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
			billCode: '',
			buyerOrgan: [],
			billBizType: [],
			state: [],
			isStockOffer: [],
			billKind: [],
			memo: '',
			operateMan: [],
			stateSearchList: this.$fxStateMiddleware.getStateConfig('billSearchState'),
			offerSearchList: this.$fxStateMiddleware.getStateConfig('billSearchOfferState'),
			billCreateTypeList: [],
			buyerOrganIdList: [],
			billBizTypeList: [],
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
		initFilter () {
			this.billCode = ''
			this.state = []
			this.buyerOrgan = []
			this.billBizType = []
			this.billKind = []
			this.isStockOffer = []
			this.memo = ''
			this.operateMan = []
		},
		onResetClick () {
			this.initFilter()
		},
		getFilterParams () {
			return {
				userBillCode: this.billCode,
				sysBillCode: this.billCode,
				billState: this.state,
				isStockOffer: this.isStockOffer,
				organId: this.buyerOrgan,
				billBizTypeId: this.billBizType,
				billType: this.billKind,
				memo: this.memo,
				operateMan: this.operateMan
			}
		},
		initSelect () {
			this.getOrganSelect()
			this.getBillBizTypeSelect()
			this.getStockInquiryTypeSelect()
			this.getAgentList()
		},
		getOrganSelect () {
			const typeList = ['2', '1']
			return this.$fxApi(`${apiName}.getOrganSelectTab`, typeList).then(res => {
				this.buyerOrganIdList = res
			})
		},
		getBillBizTypeSelect () {
			return this.$fxApi(`${apiName}.getBusinessList`)({ data: [] }).then(res => {
				this.billBizTypeList = res
			})
		},
		getStockInquiryTypeSelect () {
			return this.$fxApi(`${apiName}.getStockInquiryTypeSelect`).then(res => {
				this.billCreateTypeList = res
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
