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
			billCode: '',
			buyerOrgan: [],
			sellerOrgan: [],
			billBizType: [],
			sendState: '',
			state: [],
			billKind: [],
			memo: '',
			operateMan: [],
			stateSearchList: this.$fxStateMiddleware.getStateConfig('billSearchState'),
			billCreateTypeList: [],
			buyerOrganIdList: [],
			sellerOrganIdList: [],
			billBizTypeList: [],
			sendStateList: this.$fxStateMiddleware.getStateConfig('stockOffersendState'),
			operatorList: [],
			tabStoreFilterKeys: ['name', 'code', 'pinYin', 'organName']
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
			this.sellerOrgan = []
			this.billBizType = []
			this.billKind = []
			this.sendState = ''
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
				organId: this.buyerOrgan,
				otherOrganId: this.sellerOrgan,
				billBizTypeId: this.billBizType,
				billType: this.billKind,
				sendState: this.sendState !== '' ? (this.sendState === 2 ? 0 : this.sendState) : this.sendState,
				memo: this.memo,
				operateMan: this.operateMan
			}
		},
		initSelect () {
			this.getOrganSelect()
			this.getOtherOrganSelect()
			this.getBillBizTypeSelect()
			this.getStockOfferTypeSelect()
			this.getAgentList()
		},
		getOrganSelect () {
			const typeList = ['2', '1']
			return this.$fxApi(`${apiName}.getOrganSelectTab`, typeList).then(res => {
				this.buyerOrganIdList = res
			})
		},
		getOtherOrganSelect () {
			return this.$fxApi(`${apiName}.getOtherOrganSelect`).then(res => {
				this.sellerOrganIdList = res
			})
		},
		getBillBizTypeSelect () {
			return this.$fxApi(`${apiName}.getBusinessList`)({ data: [] }).then(res => {
				this.billBizTypeList = res
			})
		},
		getStockOfferTypeSelect () {
			return this.$fxApi(`${apiName}.getStockOfferTypeSelect`).then(res => {
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
