<template>
	<fx-list-filter @on-enter="onSearchClick">
		<template slot="row-1">
			<el-form-item label="方案">
				<w-input v-model="planKey" placeholder="请输入" class="form-input"/>
			</el-form-item>
			<el-form-item label="买方机构">
				<w-select-tab-mulity
					v-model="buyer"
					:optionlist="organListTab"
					:loading="selectLoading"
					:fpSelectShow="onOrganListTabSelectShow"
					class="form-input"
				></w-select-tab-mulity>
			</el-form-item>
			<el-form-item label="卖方机构">
				<w-select-tab-mulity
					v-model="seller"
					:optionlist="organListTab"
					:loading="selectLoading"
					:fpSelectShow="onOrganListTabSelectShow"
					class="form-input"
				></w-select-tab-mulity>
			</el-form-item>
			<el-form-item label="品项">
				<w-select-mulity
					v-model="item"
					:optionlist="itemList"
					:loading="selectLoading"
					:showEmpty="false"
					:fpSelectShow="onItemListSelectShow"
					class="form-input"
				>
				</w-select-mulity>
			</el-form-item>
			<el-form-item label="审核状态">
				<w-select
					v-model="planState"
					:optionlist="stockPlanStateSelectList"
					:optionProp="optionProp"
					:disabled="billStateDisabled"
					class="form-input"
				>
				</w-select>
			</el-form-item>
			<el-form-item label="启停状态">
				<w-select
					v-model="enableFlag"
					:optionlist="enableStateSelectList"
					:optionProp="optionProp"
					class="form-input"
				>
				</w-select>
			</el-form-item>
		</template>
		<template slot="row-2">
			<el-form-item label="备注">
				<w-input v-model="memo" placeholder="请输入" class="form-input"/>
			</el-form-item>
			<el-form-item label="明细备注">
				<w-input v-model="pdmemo" placeholder="请输入" class="form-input"/>
			</el-form-item>
			<el-form-item label="标签">
				<w-input disabled v-model="tagKey" placeholder="请输入" class="form-input"/>
			</el-form-item>
		</template>
		<template slot="tools">
			<el-button class="order-btn" type="primary" @click="onSearchClick">查询</el-button>
			<el-button class="order-btn" plain @click="onResetClick">重置</el-button>
		</template>
	</fx-list-filter>
</template>
<script>
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
			seller: [],
			buyer: [],
			planKey: '',
			item: [],
			planState: '',
			enableFlag: 1,
			tagKey: '',
			memo: '',
			pdmemo: '',
			enableStateList: this.$fxStateMiddleware.getStateConfig('enableState'),
			stockPlanStateList: this.$fxStateMiddleware.getStateConfig('planSearchState'),
			optionProp: {
				name: 'label'
			},
			organListTab: [],
			itemList: [],
			selectLoading: false
		}
	},
	computed: {
		enableStateSelectList () {
			return [{
				id: '',
				label: '全部'
			}, ...this.enableStateList]
		},
		stockPlanStateSelectList () {
			return [{
				id: '',
				label: '全部'
			}, ...this.stockPlanStateList]
		}
	},
	methods: {
		onSearchClick () {
			this.$emit('on-search')
		},
		onResetClick () {
			this.seller = []
			this.buyer = []
			this.planKey = ''
			this.item = []
			this.planState = ''
			this.enableFlag = 1
			this.tagKey = ''
			this.memo = ''
			this.pdmemo = ''
		},
		getFilterParams () {
			return {
				'pd-sellerOrgan': this.seller,
				'pb-buyerOrgan': this.buyer,
				planKey: this.planKey,
				'pd-itemId': this.item,
				planState: this.planState,
				enableFlag: this.enableFlag,
				tagKey: this.tagKey,
				memo: this.memo,
				'pd-memo': this.pdmemo
			}
		},
		onOrganListTabSelectShow () {
			if (!this.organListTab.length) {
				this.selectLoading = true
				return this.$fxApi('planStock.getOrganSelectTab')({ loading: false }).then(res => {
					this.organListTab = res
					this.selectLoading = false
					return Promise.resolve()
				})
			} else {
				return Promise.resolve()
			}
		},
		onItemListSelectShow () {
			if (!this.itemList.length) {
				this.selectLoading = true
				return this.$fxApi('planStock.getItemSelect')({ loading: false }).then(res => {
					this.itemList = res
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
.form-input {
	width: 150px
}
</style>
