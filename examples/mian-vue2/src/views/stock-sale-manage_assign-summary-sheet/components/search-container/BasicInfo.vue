<template>
<div class="basic-container">
	<div class="title">基础信息</div>
	<el-form-item label="数据来源：" required>
		<div class="datasource-content">
			<w-select
				v-model="searchData.datasource"
				:optionlist="datasourceList"
				class="form-item-input"
				@change="onDatasourceChange"
			>
			</w-select>
			<el-checkbox-group
				v-model="searchData.billType"
			>
				<el-checkbox
					v-for="item in billTypeSelectComputed"
					:key="item.id"
					:label="item.id"
					:disabled="billTypeDisabled(item.id)"
				>{{item.name}}</el-checkbox>
			</el-checkbox-group>
		</div>
	</el-form-item>
	<el-form-item>
		<el-radio
			v-for="item in billStateList"
			v-model="searchData.billState"
			:key="item.id"
			:label="item.id"
		>{{item.name}}</el-radio>
	</el-form-item>
	<el-form-item label="查询日期：">
		<w-select
			v-model="searchData.dateType"
			:optionlist="dateTypeList"
			class="form-item-input"
		>
		</w-select>
		<w-date-picker
			v-model="dateRange"
			type="datetimerange"
			range-separator="至"
			start-placeholder="开始日期"
			end-placeholder="结束日期"
			value-format="yyyy-MM-dd HH:mm:ss"
			:default-time="['00:00:00', '23:59:59']"
			:clearable="false"
			:editable="false"
			:picker-options="pickerOptions"
		></w-date-picker>
	</el-form-item>
	<el-form-item label="订货方案：">
		<w-select-mulity
			v-model="searchData.stockPlan"
			:optionlist="stockPlanList"
			:disabled="inStoreDisabled"
			:showEmpty="false"
			clearable
			class="form-item-input"
		></w-select-mulity>
	</el-form-item>
	<el-form-item label="经办人：">
		<w-select-mulity
			v-model="searchData.operator"
			:optionlist="operatorList"
			:showEmpty="false"
			clearable
			class="form-item-input"
		></w-select-mulity>
	</el-form-item>
	<el-form-item label="其他信息：">
		<div class="other-info">
			<el-checkbox-group
				v-model="searchData.stockWay"
				class="stock-way"
			>
				<el-checkbox
					v-for="item in stockWayList"
					:key="item.id"
					:label="item.id"
					:disabled="commonDisabled"
				>{{item.name}}</el-checkbox>
			</el-checkbox-group>
			<el-checkbox-group
				v-model="urgentArr"
			>
				<el-checkbox
					v-for="item in urgentList"
					:key="item.id"
					:label="item.id"
				>{{item.name}}</el-checkbox>
			</el-checkbox-group>
		</div>
	</el-form-item>
</div>
</template>

<script>
import { apiName } from '../../Index.vue'
export default {
	name: 'basicInfo',
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
			dateRange: [],
			urgentArr: [0, 1],
			datasourceList: this.$fxTypeMiddleware.getCommonTypeList('assignSummaryDatasource'),
			billTypeInStoreList: this.$fxTypeMiddleware.getCommonTypeList('billTypeInStore'),
			billTypeOutStoreList: this.$fxTypeMiddleware.getCommonTypeList('billTypeOutStore'),
			billStateList: this.$fxTypeMiddleware.getCommonTypeList('billStateAssignSummaryList'),
			dateTypeList: this.$fxTypeMiddleware.getCommonTypeList('dateType'),
			stockPlanList: [],
			operatorList: [],
			stockWayList: this.$fxTypeMiddleware.getCommonTypeList('stockWayAssignSummaryList'),
			urgentList: this.$fxTypeMiddleware.getCommonTypeList('urgent'),
			pickerOptions: this.$fxGetDatePickerOptionsShortcuts('all'),
			isCommonDatasourceType: this.$fxTypeMiddleware.isCommonType('assignSummaryDatasource')
		}
	},
	computed: {
		billTypeSelectComputed () {
			switch (this.searchData.datasource) {
			case 0:
				return this.billTypeInStoreList
			case 1:
				return this.billTypeOutStoreList
			case 2:
				return []
			default:
				return []
			}
		},
		billTypeDisabled () {
			return (id) => {
				return JSON.stringify(this.searchData.billType) === JSON.stringify([id])
			}
		},
		inStoreDisabled () {
			return this.isCommonDatasourceType(['inStore'])(this.searchData.datasource)
		},
		commonDisabled () {
			return this.isCommonDatasourceType(['inStore', 'outStore'])(this.searchData.datasource)
		}
	},
	watch: {
		dateRange (val) {
			this.searchData.startDate = val[0]
			this.searchData.endDate = val[1]
		},
		urgentArr (val) {
			if (val.length === 0 || val.length === 2) {
				this.searchData.urgent = null
			} else {
				this.searchData.urgent = val[0]
			}
		}
	},
	methods: {
		initData () {
			this.setDateRange()
			this.getStockPlanList()
			this.getOperatorList()
		},
		setDateRange () {
			this.dateRange = [this.$fxUtils.setDate() + ' 00:00:00', this.$fxUtils.setDate() + ' 23:59:59']
		},
		getStockPlanList () {
			return this.$fxApi(`${apiName}.getStockPlanList`).then(res => {
				this.stockPlanList = res
			})
		},
		getOperatorList () {
			return this.$fxApi(`${apiName}.getAgentList`).then(res => {
				this.operatorList = res
			})
		},
		onDatasourceChange (id) {
			this.setDateRange()
			this.$emit('on-datasource-change', id)
		},
		parentGetSelectData () {
			return {
				stockPlanList: this.stockPlanList,
				operatorList: this.operatorList
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.basic-container {
	border-bottom 1px solid $fxBorder
	.title {
		font-size 14px
		line-height 50px
	}
	.form-item-input {
		width 200px
		margin-right 20px
	}
	.datasource-content {
		display flex
	}
	.el-checkbox-group {
		height 28px
	}
	>>>.el-checkbox__label {
		font-size 12px
	}
	.other-info {
		display flex
		.stock-way {
			margin-right 30px
		}
	}
}
</style>
