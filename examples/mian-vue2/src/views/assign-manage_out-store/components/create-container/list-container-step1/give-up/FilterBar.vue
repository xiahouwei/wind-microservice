<template>
	<fx-list-filter @on-enter="onSearchClick">
		<template slot="row-1">
			<el-form-item prop="dateRang" label="订货时间">
				<w-date-picker
					v-model="dateRang"
					type="daterange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					format="yyyy 年 MM 月 dd 日"
					value-format="yyyy-MM-dd HH:mm:ss"
					:default-time="['00:00:00', '23:59:59']"
					:picker-options="pickerOptions"
					class="form-date-input"
				></w-date-picker>
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
					class="form-input"
				>
				</w-select>
			</el-form-item>
			<el-form-item label="买方机构">
				<w-select-tab-mulity
					v-model="buyerOrgan"
					:optionlist="otherOrganIdList"
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
const apiName = 'saleOrder'
export default {
	name: 'filterBar',
	data () {
		return {
			itemList: [],
			otherOrganIdList: [],
			organIdList: [],
			sellerOrgan: [],
			buyerOrgan: [],
			stockWayList: [{
				id: 1,
				name: '直发'
			}, {
				id: 2,
				name: '越库'
			}],
			billCode: '',
			stockWay: '',
			item: [],
			dateRang: [],
			crossOrgan: [],
			pickerOptions: this.$fxGetDatePickerOptionsShortcuts('all')
		}
	},
	mounted () {
		this.initSelect()
	},
	methods: {
		onSearchClick () {
			this.$emit('on-search', this.getFilterParams())
		},
		onResetClick () {
			this.getAccountingPeriod()
			this.dateRang = []
			this.billCode = ''
			this.stockWay = ''
			this.buyerOrgan = []
			this.sellerOrgan = []
			this.crossOrgan = []
			this.item = []
		},
		getAccountingPeriod () {
			return this.$fxApi('outStoreAssign.getAccountingPeriod').then(res => {
				this.dateRang = [res.begin, res.end]
			})
		},
		getFilterParams () {
			return {
				e: {
					stockWay: this.stockWay
				},
				r: {
					businessDate: this.dateRang
				},
				orl: {
					sysBillCode: this.billCode,
					userBillCode: this.billCode
				},
				i: {
					otherOrganId: this.buyerOrgan,
					organId: this.sellerOrgan,
					crossOrgan: this.crossOrgan
				},
				ri: {
					'detail-itemId': this.item
				}
			}
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
		getOtherOrganSelect () {
			return this.$fxApi(`${apiName}.getOrganSelectTab`).then(res => {
				this.otherOrganIdList = res
			})
		},
		initSelect () {
			this.getOrganSelect()
			this.getOtherOrganSelect()
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
	width: 140px
}
</style>
