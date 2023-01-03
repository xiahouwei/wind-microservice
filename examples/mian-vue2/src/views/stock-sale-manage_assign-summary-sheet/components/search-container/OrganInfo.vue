<template>
<div class="organ-container">
	<div class="title">机构信息</div>
	<el-form-item>
		<span slot="label" class="form-label">
			<span>入库方/买方：</span>
		</span>
		<div class="organ-content">
			<w-select-mulity
				v-model="searchData.inOrganType"
				:optionlist="organTypeList"
				:showEmpty="false"
				:disabled="inOrganTypeDisabled"
				clearable
				class="form-item-input"
				@change="onInOrganTypeChange"
			></w-select-mulity>
			<w-select-tab-mulity
				v-model="searchData.inOrgan"
				:optionlist="inOrganSelectComputed"
				:disabled="inOrganDisabled"
				class="form-item-input"
				@change="onInOrganChange"
			></w-select-tab-mulity>
			<el-tooltip
				placement="bottom-start"
				effect="light"
			>
				<div slot="content" class="label-tip">1.当数据来源为“销售订单”时，按“买方”进行查询；<br/>2.当数据来源为“入库单/出库单”时，按“入库方”进行查询</div>
				<w-icon type="question-active" class="mark-icon"></w-icon>
			</el-tooltip>
			<el-checkbox
				v-show="!unShowInOrganDisabled"
				v-model="searchData.showInOrgan"
				:disabled="outStoreShowTypeIsInStore"
				:true-label="0"
				:false-label="1"
				class="check-box"
			>不显示</el-checkbox>
		</div>
	</el-form-item>
	<el-form-item label="客户类别：">
		<w-select-mulity
			v-model="searchData.customerType"
			:optionlist="customerTypeList"
			:showEmpty="false"
			:disabled="customerTypeDisabled"
			clearable
			class="form-item-input"
		></w-select-mulity>
			<el-checkbox
				v-model="searchData.showCustomerType"
				:true-label="0"
				:false-label="1"
				class="check-box"
			>不显示</el-checkbox>
	</el-form-item>
	<el-form-item label="入库仓库：">
		<w-select-tab-mulity
			v-model="searchData.inHouse"
			:optionlist="inHouseSelectComputed"
			:showEmpty="false"
			:disabled="commonDisabled"
			:filterKeys="tabStoreFilterKeys"
			:optionRender="optionRender"
			clearable
			class="form-item-input"
		></w-select-tab-mulity>
	</el-form-item>
	<el-form-item>
		<span slot="label" class="form-label">
			<span>出库方/卖方：</span>
		</span>
		<div class="organ-content">
			<w-select-mulity
				v-model="searchData.outOrganType"
				:optionlist="organTypeList"
				:showEmpty="false"
				:disabled="outOrganTypeDisabled"
				clearable
				class="form-item-input"
				@change="onOutOrganTypeChange"
			></w-select-mulity>
			<w-select-tab-mulity
				v-model="searchData.outOrgan"
				:optionlist="outOrganSelectComputed"
				class="form-item-input"
				@change="onOutOrganChange"
			></w-select-tab-mulity>
			<el-tooltip
				placement="bottom-start"
				effect="light"
			>
				<div slot="content" class="label-tip">1.当数据来源为“销售订单”时，按“卖方”进行查询；<br/>2.当数据来源为“入库单/出库单”时，按“出库方”进行查询</div>
				<w-icon type="question-active" class="mark-icon"></w-icon>
			</el-tooltip>
		</div>
	</el-form-item>
	<el-form-item label="出库仓库：">
		<w-select-tab-mulity
			v-model="searchData.outHouse"
			:optionlist="outHouseSelectComputed"
			:showEmpty="false"
			:disabled="commonDisabled"
			:filterKeys="tabStoreFilterKeys"
			:optionRender="optionRender"
			clearable
			class="form-item-input"
		></w-select-tab-mulity>
	</el-form-item>
	<el-form-item label="其他信息：">
		<el-checkbox
			v-model="searchData.showInHouseName"
			:true-label="1"
			:false-label="0"
			:disabled="inHouseNameDisabled"
		>{{ outStoreShowTypeIsInStore ? '出库仓库名称' : '入库仓库名称'}}</el-checkbox>
		<el-checkbox
			v-model="searchData.showOutHouseName"
			:true-label="1"
			:false-label="0"
			:disabled="outHouseNameDisabled"
		>{{ outStoreShowTypeIsInStore ? '入库仓库名称' : '出库仓库名称'}}</el-checkbox>
	</el-form-item>
</div>
</template>

<script>
import { apiName } from '../../Index.vue'
export default {
	name: 'organInfo',
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
			organTypeList: this.$fxTypeMiddleware.getCommonTypeList('organTypeAssignSummaryList'),
			inOrganList: [],
			customerTypeList: [],
			inHouseList: [],
			outOrganList: [],
			outHouseList: [],
			tabStoreFilterKeys: ['name', 'code', 'pinYin', 'organName'],
			isCommonDatasourceType: this.$fxTypeMiddleware.isCommonType('assignSummaryDatasource'),
			isCommonShowTypeOutStoreType: this.$fxTypeMiddleware.isCommonType('showTypeOutStore')
		}
	},
	computed: {
		commonDisabled () {
			return this.isCommonDatasourceType(['saleOrder'])(this.searchData.datasource)
		},
		inHouseNameDisabled () {
			return this.isCommonDatasourceType(['inStore', 'saleOrder'])(this.searchData.datasource)
		},
		outHouseNameDisabled () {
			return this.isCommonDatasourceType(['outStore', 'saleOrder'])(this.searchData.datasource)
		},
		inOrganSelectComputed () {
			return this.inOrganList.filter(item => {
				return !this.searchData.inOrganType.length || this.searchData.inOrganType.includes(item.id)
			})
		},
		inHouseSelectComputed () {
			return this.inHouseList.filter(item => {
				return !this.searchData.inOrganType.length || this.searchData.inOrganType.includes(item.id)
			})
		},
		outOrganSelectComputed () {
			return this.outOrganList.filter(item => {
				return !this.searchData.outOrganType.length || this.searchData.outOrganType.includes(item.id)
			})
		},
		outHouseSelectComputed () {
			return this.outHouseList.filter(item => {
				return !this.searchData.outOrganType.length || this.searchData.outOrganType.includes(item.id)
			})
		},
		inOrganTypeDisabled () {
			return (!this.searchData.inOrganType.length && !!this.searchData.inOrgan.length) || !!this.searchData.customerType.length
		},
		outOrganTypeDisabled () {
			return !this.searchData.outOrganType.length && !!this.searchData.outOrgan.length
		},
		inOrganDisabled () {
			return !!this.searchData.customerType.length
		},
		customerTypeDisabled () {
			return !!this.searchData.inOrganType.length || !!this.searchData.inOrgan.length
		},
		unShowInOrganDisabled () {
			return this.isCommonDatasourceType(['inStore', 'saleOrder'])(this.searchData.datasource)
		},
		outStoreShowTypeIsInStore () {
			return this.isCommonShowTypeOutStoreType(['outStore_itemCol_inOrganRow', 'outStore_itemRow_inOrganCol'])(this.searchData.showType)
		}
	},
	methods: {
		initData () {
			this.getOrganList()
			this.getCustomerTypeList()
			this.getInHouseList()
			this.getOutHouseList()
		},
		getOrganList () {
			return this.$fxApi(`${apiName}.getOrganSelectTab`).then(res => {
				this.inOrganList = res
				this.outOrganList = res
			})
		},
		onInOrganTypeChange () {
			this.searchData.inOrgan = []
			this.searchData.inHouse = []
			this.getInHouseList()
		},
		getCustomerTypeList () {
			return this.$fxApi(`${apiName}.getCustomerTypeList`).then(res => {
				this.customerTypeList = res
			})
		},
		onInOrganChange () {
			this.searchData.inHouse = []
			this.getInHouseList()
		},
		onOutOrganTypeChange () {
			this.searchData.outOrgan = []
			this.searchData.outHouse = []
			this.getOutHouseList()
		},
		onOutOrganChange () {
			this.searchData.outHouse = []
			this.getOutHouseList()
		},
		getInHouseList () {
			const params = {
				organIdList: this.searchData.inOrgan
			}
			this.$fxApi(`${apiName}.getHouseList`)({ data: params, loading: false }).then(res => {
				this.inHouseList = res
			})
		},
		getOutHouseList () {
			const params = {
				organIdList: this.searchData.outOrgan
			}
			this.$fxApi(`${apiName}.getHouseList`)({ data: params, loading: false }).then(res => {
				this.outHouseList = res
			})
		},
		optionRender (h, { item }) {
			h = this.$createElement
			return <div class="fx-common__cell-select__option fx-ellipsis">
				<span class="fx-common__cell-select__option-left fx-ellipsis" title={item.name}>{ item.name }</span>
				<span class="fx-common__cell-select__option-right fx-ellipsis" title={item.organName}>{ item.organName }</span>
			</div>
		},
		parentGetSelectData () {
			return {
				inOrganList: this.inOrganList,
				customerTypeList: this.customerTypeList,
				inHouseList: this.inHouseList,
				outOrganList: this.outOrganList,
				outHouseList: this.outHouseList
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.organ-container {
	border-bottom 1px solid $fxBorder
	.title {
		font-size 14px
		line-height 50px
	}
	.form-item-input {
		width 200px
		margin-right 20px
	}
	.organ-content {
		display flex
		.check-box {
			margin-left 20px
		}
	}
	>>>.el-checkbox__label {
		font-size 12px
	}
	.form-label {
		position relative
	}
	.mark-icon {
		width: 16px
		height: 16px
		position: absolute
		left: 430px
	}
}
</style>
<style lang="stylus">
.label-tip {
	color #606266 !important
}
</style>
