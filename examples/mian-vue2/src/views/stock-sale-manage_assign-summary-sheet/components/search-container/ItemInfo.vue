<template>
<div class="item-container">
	<div class="title">品项信息</div>
	<el-form-item label="品项分类：">
		<div class="item-type-content">
			<w-cascader
				ref="cascader"
				v-model="searchData.itemType"
				collapseTags
				checkAllChildNode
				:options="itemCascaderData"
				:optionProps="itemTypeProps"
				:showAllLevels="false"
				:filterable="false"
				class="form-item-input"
			>
			</w-cascader>
			<el-checkbox v-model="searchData.showItemType" :true-label="0" :false-label="1">不显示</el-checkbox>
		</div>
	</el-form-item>
	<el-form-item label="品项财务分类：">
		<div class="item-type-content">
			<w-select-mulity
				v-model="searchData.itemFinanceSortList"
				:optionlist="itemFinanceData"
				:showEmpty="false"
				clearable
				class="form-item-input"
			>
			</w-select-mulity>
			<el-checkbox v-model="searchData.showItemFinanceSort" :true-label="0" :false-label="1">不显示</el-checkbox>
		</div>
	</el-form-item>
	<el-form-item label="品项类型：">
		<div class="item-type-content">
			<w-select-mulity
				v-model="searchData.itemCategory"
				:optionlist="itemCategoryList"
				:showEmpty="false"
				clearable
				class="form-item-input"
			></w-select-mulity>
			<el-checkbox v-model="searchData.showItemCategory" :true-label="0" :false-label="1">不显示</el-checkbox>
		</div>
	</el-form-item>
	<el-form-item label="品项单位：">
		<div class="item-type-content">
			<w-select
				v-model="searchData.itemUnit"
				:optionlist="itemUnitList"
				class="form-item-input"
			>
			</w-select>
			<el-checkbox v-model="searchData.showItemUnit" :true-label="0" :false-label="1">不显示</el-checkbox>
		</div>
	</el-form-item>
	<el-form-item label="品项自定义分组：">
		<div class="item-type-content">
			<w-select-mulity
				v-model="searchData.customGroupIdList"
				:optionlist="itemCustomGroupList"
				:showEmpty="false"
				clearable
				class="form-item-input"
			></w-select-mulity>
		</div>
	</el-form-item>
	<el-form-item label="其他信息：">
		<el-checkbox v-model="searchData.showItemCode" :true-label="1" :false-label="0">品项编号</el-checkbox>
		<el-checkbox v-model="searchData.showItemSpec" :true-label="1" :false-label="0">品项规格</el-checkbox>
		<el-checkbox v-model="searchData.showAssistUnit" :true-label="1" :false-label="0">辅助单位</el-checkbox>
		<el-checkbox v-model="searchData.showShelfLifeDays" :true-label="1" :false-label="0">保质期天数</el-checkbox>
		<el-checkbox v-model="searchData.showItemMemo" :true-label="1" :false-label="0">品项备注</el-checkbox>
		<el-checkbox v-model="searchData.showPutShelf" v-show="showPutShelf" :true-label="1" :false-label="0">货位</el-checkbox>
	</el-form-item>
</div>
</template>

<script>
import { apiName } from '../../Index.vue'
export default {
	name: 'itemInfo',
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
			itemCascaderData: [],
			itemFinanceData: [],
			itemTypeProps: {
				value: 'id',
				label: 'name',
				children: 'children',
				checkStrictly: true,
				multiple: true,
				emitPath: false
			},
			itemCategoryList: this.$fxTypeMiddleware.getCommonTypeList('itemCategoryAssignSummaryList'),
			itemUnitList: this.$fxTypeMiddleware.getCommonTypeList('itemUnitAssignSummaryList'),
			isCommonDatasourceType: this.$fxTypeMiddleware.isCommonType('assignSummaryDatasource'),
			itemCustomGroupList: []
		}
	},
	computed: {
		showPutShelf () {
			return this.isCommonDatasourceType(['inStore', 'outStore'])(this.searchData.datasource)
		}
	},
	methods: {
		initData () {
			this.getItemTypeCascader()
			this.getItemFinanceType()
			this.getItemCustomGroup()
		},
		getItemTypeCascader () {
			return this.$fxApi(`${apiName}.getItemTypeCascader`).then(res => {
				this.itemCascaderData = res
			})
		},
		getItemFinanceType () {
			return this.$fxApi(`${apiName}.getItemFinanceType`).then(res => {
				this.itemFinanceData = res
			})
		},
		getItemCustomGroup () {
			return this.$fxApi(`${apiName}.getItemCustomGroup`).then(res => {
				this.itemCustomGroupList = res
			})
		},
		parentGetSelectData () {
			return {
				itemCascaderData: this.itemCascaderData,
				itemFinanceData: this.itemFinanceData,
				itemCustomGroupList: this.itemCustomGroupList
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.item-container {
	border-bottom 1px solid $fxBorder
	.title {
		font-size 14px
		line-height 50px
	}
	.form-item-input {
		width 200px
		margin-right 20px
	}
	.item-type-content {
		display flex
	}
	>>>.el-checkbox__label {
		font-size 12px
	}
}
</style>
