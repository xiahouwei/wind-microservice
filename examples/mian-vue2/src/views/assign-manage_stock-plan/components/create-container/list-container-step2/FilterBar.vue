<template>
	<fx-list-filter @on-enter="onSearchClick">
		<template slot="row-1">
			<el-form-item label="品项分类">
				<w-cascader
					ref="cascader"
					v-model="itemType"
					collapseTags
					checkAllChildNode
					:options="itemCascaderData"
					:optionProps="itemTypeProps"
					:showAllLevels="false"
					:filterable="false"
					class="form-input"
				>
				</w-cascader>
			</el-form-item>
			<el-form-item label="品项">
				<w-select-mulity
					v-model="item"
					:optionlist="itemList"
					class="form-input"
					:showEmpty='false'
				>
				</w-select-mulity>
			</el-form-item>
			<el-form-item label="买方机构">
				<w-select-tab-mulity
					v-model="buyerOrgan"
					:optionlist="otherOrganIdList"
					class="form-input"
					@change='organIdChange'
				>
				</w-select-tab-mulity>
			</el-form-item>
			<el-form-item label="入库仓库">
				<w-select-tab-mulity
					v-model="inHouseId"
					:optionlist="inHouseList"
					:filterKeys="tabStoreFilterKeys"
					:optionRender="optionRender"
					class="form-input"
				>
				</w-select-tab-mulity>
			</el-form-item>
			<el-form-item label="单据号">
				<w-input v-model="billCode" placeholder="请输入" class="form-input"/>
			</el-form-item>
		</template>
		<template slot="tools">
			<el-button class="order-btn" type="primary" @click="onSearchClick">查询</el-button>
			<el-button class="order-btn" plain @click="onResetClick">重置</el-button>
		</template>
	</fx-list-filter>
</template>
<script>
import { apiName } from '../Index.vue'

export default {
	name: 'filterBar',
	data () {
		return {
			itemCascaderData: [],
			itemTypeProps: {
				value: 'id',
				label: 'name',
				children: 'children',
				checkStrictly: true,
				multiple: true,
				emitPath: false
			},
			itemList: [],
			otherOrganIdList: [],
			buyerOrgan: [],
			billCode: '',
			itemType: [],
			item: [],
			inHouseId: [],
			inHouseList: [],
			tabStoreFilterKeys: ['name', 'code', 'pinYin', 'organName']
		}
	},
	props: {
		step2ids: Array
	},
	methods: {
		onSearchClick () {
			this.$emit('on-search')
		},
		resetFilter () {
			this.billCode = ''
			this.buyerOrgan = []
			this.itemType = []
			this.item = []
			this.inHouseId = []
		},
		onResetClick () {
			this.resetFilter()
			this.getInhouseSelect()
		},
		getFilterParams () {
			return {
				'bill.id': this.step2ids,
				'bill.organId': this.buyerOrgan,
				'detail-itemTypeId': this.itemType,
				'detail.itemId': this.item,
				'bill.userBillCode': this.billCode,
				'bill.sysBillCode': this.billCode,
				stockWay: '',
				'detail.inHouseId': this.inHouseId
			}
		},
		getItemTypeCascader () {
			return this.$fxApi(`${apiName}.getItemTypeCascader`).then(res => {
				this.itemCascaderData = res
			})
		},
		getItemSelect () {
			return this.$fxApi(`${apiName}.getItemSelect`).then(res => {
				this.itemList = res
			})
		},
		getOtherOrganSelect () {
			return this.$fxApi(`${apiName}.getOrganSelectTab`).then(res => {
				this.otherOrganIdList = res
			})
		},
		getInhouseSelect () {
			if (this.buyerOrgan.length === 1 && this.buyerOrgan[0] === 'empty') {
				this.buyerHouseList = []
				return false
			}
			const params = {
				organIdList: this.buyerOrgan.filter(item => {
					return item !== 'empty'
				})
			}
			this.$fxApi(`${apiName}.getBuyerHouseSelectTab`)({ data: params, loading: false }).then(res => {
				this.inHouseList = res
			})
		},
		initSelect () {
			this.getOtherOrganSelect()
			this.getItemTypeCascader()
			this.getItemSelect()
			this.getInhouseSelect()
		},
		organIdChange () {
			this.inHouseId = []
			this.getInhouseSelect()
		},
		optionRender (h, { item }) {
			h = this.$createElement
			return <div class="fx-common__cell-select__option fx-ellipsis">
				<span class="fx-common__cell-select__option-left fx-ellipsis" title={item.name}>{ item.name }</span>
				<span class="fx-common__cell-select__option-right fx-ellipsis" title={item.organName}>{ item.organName }</span>
			</div>
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-date-input {
	width: 360px
}
.form-input {
	width: 180px
}
</style>
