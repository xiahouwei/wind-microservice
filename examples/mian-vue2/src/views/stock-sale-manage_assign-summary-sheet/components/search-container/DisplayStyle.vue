<template>
<div class="display-container">
	<div class="title">显示样式</div>
	<el-form-item label="显示方式：">
		<w-select
			v-model="searchData.showType"
			:optionlist="showTypeSelectComputed"
			class="form-item-input no-clear"
			@change="changeShowType"
		>
		</w-select>
	</el-form-item>
	<el-form-item label="汇总方式：">
		<w-select
			v-model="searchData.summaryType"
			:optionlist="summaryTypeSelectComputed"
			class="form-item-input"
		>
		</w-select>
	</el-form-item>
	<el-form-item label="排序规则：">
		<div class="sort-content">
			<w-select
				v-model="searchData.itemOrderRule"
				:optionlist="itemOrderRuleList"
				class="form-item-input"
			>
			</w-select>
			<w-select
				v-model="searchData.inOrderRule"
				:optionlist="inOrderRuleList"
				class="form-item-input"
			>
			</w-select>
			<w-select
				v-model="searchData.outOrderRule"
				:optionlist="outOrderRuleList"
				class="form-item-input"
			>
			</w-select>
		</div>
	</el-form-item>
	<el-form-item label="汇总类型：">
		<w-select
			v-model="searchData.summaryCategory"
			:optionlist="summaryCategoryList"
			class="form-item-input"
		>
		</w-select>
	</el-form-item>
	<el-form-item label="空白行/列：">
		<div class="sort-content">
			<w-select
				v-model="searchData.nullRow"
				:optionlist="blankRowList"
				class="form-item-input"
				clearable
			>
			</w-select>
		</div>
	</el-form-item>
	<el-form-item label="其他信息：">
		<el-checkbox v-model="searchData.showBillDetail" :true-label="1" :false-label="0">单据明细</el-checkbox>
		<el-checkbox
			v-model="searchData.showRowIndex"
			:disabled="!isItemDirection"
			:true-label="1"
			:false-label="0"
		>显示序号</el-checkbox>
		<el-checkbox v-model="searchData.showRowSum" :true-label="1" :false-label="0">显示合计</el-checkbox>
	</el-form-item>
</div>
</template>

<script>
export default {
	name: 'displayStyle',
	props: {
		searchData: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	data () {
		return {
			showTypeInStoreList: this.$fxTypeMiddleware.getCommonTypeList('showTypeInStore'),
			showTypeOutStoreList: this.$fxTypeMiddleware.getCommonTypeList('showTypeOutStore'),
			showTypeSaleOrderList: this.$fxTypeMiddleware.getCommonTypeList('showTypeSaleOrder'),
			summaryTypeInStoreList: this.$fxTypeMiddleware.getCommonTypeList('summaryTypeInStore'),
			summaryTypeOutStoreList: this.$fxTypeMiddleware.getCommonTypeList('summaryTypeOutStore'),
			summaryTypeSaleOrderList: this.$fxTypeMiddleware.getCommonTypeList('summaryTypeSaleOrder'),
			summaryCategoryList: this.$fxTypeMiddleware.getCommonTypeList('summaryCategory'),
			itemOrderRuleList: this.$fxTypeMiddleware.getCommonTypeList('itemOrderRule'),
			inOrderRuleList: this.$fxTypeMiddleware.getCommonTypeList('inOrderRule'),
			outOrderRuleList: this.$fxTypeMiddleware.getCommonTypeList('outOrderRule'),
			blankRowList: this.$fxTypeMiddleware.getCommonTypeList('blankRow'),
			isCommonShowTypeInStoreType: this.$fxTypeMiddleware.isCommonType('showTypeInStore'),
			isCommonShowTypeOutStoreType: this.$fxTypeMiddleware.isCommonType('showTypeOutStore'),
			isCommonShowTypeSaleOrderType: this.$fxTypeMiddleware.isCommonType('showTypeSaleOrder')
		}
	},
	computed: {
		showTypeSelectComputed () {
			switch (this.searchData.datasource) {
			case 0:
				return this.showTypeInStoreList
			case 1:
				return this.showTypeOutStoreList
			case 2:
				return this.showTypeSaleOrderList
			default:
				return []
			}
		},
		summaryTypeSelectComputed () {
			switch (this.searchData.datasource) {
			case 0:
				return this.summaryTypeInStoreList
			case 1:
				return this.outStoreShowTypeIsInStore ? this.summaryTypeInStoreList : this.summaryTypeOutStoreList
			case 2:
				return this.summaryTypeSaleOrderList
			default:
				return []
			}
		},
		isItemDirection () {
			return this.isCommonShowTypeInStoreType(['inStore_itemCol_inOrganRow'])(this.searchData.showType) ||
			this.isCommonShowTypeOutStoreType(['outStore_itemCol_outOrganRow', 'outStore_itemCol_inOrganRow'])(this.searchData.showType) ||
			this.isCommonShowTypeSaleOrderType(['saleOrder_itemOutOrganCol_inOrganRow', 'saleOrder_itemInOrganCol_outOrganRow'])(this.searchData.showType)
		},
		outStoreShowTypeIsInStore () {
			return this.isCommonShowTypeOutStoreType(['outStore_itemCol_inOrganRow', 'outStore_itemRow_inOrganCol'])(this.searchData.showType)
		}
	},
	methods: {
		changeShowType (val) {
			const isItemDirection = this.isCommonShowTypeInStoreType(['inStore_itemCol_inOrganRow'])(val) ||
			this.isCommonShowTypeOutStoreType(['outStore_itemCol_outOrganRow', 'outStore_itemCol_inOrganRow'])(val) ||
			this.isCommonShowTypeSaleOrderType(['saleOrder_itemOutOrganCol_inOrganRow', 'saleOrder_itemInOrganCol_outOrganRow'])(val)
			if (!isItemDirection) {
				this.searchData.showRowIndex = 0
			}
			if (this.outStoreShowTypeIsInStore) {
				this.searchData.showInOrgan = 1
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.display-container {
	.title {
		font-size 14px
		line-height 50px
	}
	.form-item-input {
		width 200px
		margin-right 20px
	}
	.sort-content {
		display flex
	}
	>>>.el-checkbox__label {
		font-size 12px
	}
	.no-clear {
		>>>.el-input__inner {
			padding-right 20px
		}
	}
}
</style>
