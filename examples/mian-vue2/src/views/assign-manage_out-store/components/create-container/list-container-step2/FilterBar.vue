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
			<el-form-item label="订货方式">
				<w-select
					v-model="stockWay"
					:optionlist="stockWayList"
					clearable
					class="form-input"
				>
				</w-select>
			</el-form-item>
			<el-form-item label="买方机构">
				<w-select-tab-mulity
					v-model="buyerOrgan"
					:optionlist="organIdList"
					class="form-input"
				>
				</w-select-tab-mulity>
			</el-form-item>
			<el-form-item label="卖方机构">
				<w-select-tab-mulity
					v-model="sellerOrgan"
					:optionlist="organIdList"
					class="form-input"
				>
				</w-select-tab-mulity>
			</el-form-item>
			<el-form-item label="实际供货方" label-width='90'>
				<w-select-tab-mulity
					v-model="crossOrgan"
					:optionlist="organIdList"
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
const apiName = 'outStoreAssign'
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
			organIdList: [],
			sellerOrgan: [],
			buyerOrgan: [],
			crossOrgan: [],
			stockWayList: [{
				id: 1,
				name: '直发'
			}, {
				id: 2,
				name: '越库'
			}],
			billCode: '',
			stockWay: '',
			itemType: [],
			item: []
		}
	},
	props: {
		step2ids: Array
	},
	methods: {
		onSearchClick () {
			this.$emit('on-search')
		},
		onResetClick () {
			this.billCode = ''
			this.buyerOrgan = []
			this.sellerOrgan = []
			this.crossOrgan = []
			this.itemType = []
			this.item = []
			this.stockWay = ''
		},
		getFilterParams () {
			return {
				'bill.id': this.step2ids,
				'bill.otherOrganId': this.buyerOrgan,
				'bill.crossOrgan': this.crossOrgan,
				'bill.organId': this.sellerOrgan,
				'detail-itemTypeId': this.itemType,
				'detail.itemId': this.item,
				'bill.userBillCode': this.billCode,
				'bill.sysBillCode': this.billCode,
				stockWay: this.stockWay
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
		getOrganSelect () {
			return this.$fxApi(`${apiName}.getOrganSelectTab`).then(res => {
				this.organIdList = res
			})
		},
		initSelect () {
			this.getOrganSelect()
			this.getItemTypeCascader()
			this.getItemSelect()
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
