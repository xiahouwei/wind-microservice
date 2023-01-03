<template>
	<fx-list-filter @on-enter="onSearchClick">
		<template slot="row-1">
			<el-form-item prop="dateRang" label="开票日期">
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
			<el-form-item label="发票号码">
				<w-input
					v-model="billCode"
					class="form-input"
				/>
			</el-form-item>
			<el-form-item label="发票类型">
				<w-select-mulity
					v-model="invoicingTypeId"
					:optionlist="invoiceTypeList"
					:showEmpty="false"
					class="form-input"
				>
				</w-select-mulity>
			</el-form-item>
			<el-form-item label="采购方">
				<w-select-tab-mulity
					v-model="buyerOrgan"
					:optionlist="buyerOrganList"
					class="form-input"
				></w-select-tab-mulity>
			</el-form-item>
			<el-form-item label="销售方">
				<w-select-tab-mulity
					v-model="sellerOrgan"
					:optionlist="sellerOrganList"
					class="form-input"
				></w-select-tab-mulity>
			</el-form-item>
			<el-form-item label="状态">
				<w-select-mulity
					v-model="status"
					:optionlist="statusList"
					:showEmpty='false'
					:optionProp='{name: "label"}'
					class="form-input"
				>
				</w-select-mulity>
			</el-form-item>
		</template>
		<template slot="row-2">
			<el-form-item label="备注">
				<w-input v-model="memo" class="form-input"/>
			</el-form-item>
			<!-- <el-form-item label="标签">
				<w-input v-model="tagKey" disabled placeholder="请输入" class="form-input"/>
			</el-form-item> -->
		</template>
		<template slot="tools">
			<el-button class="order-btn" type="primary" @click="onSearchClick">查询</el-button>
			<el-button class="order-btn" plain @click="onResetClick">重置</el-button>
		</template>
	</fx-list-filter>
</template>
<script>
import { apiName } from '../../Index.vue'
export default {
	name: 'filterBar',
	data () {
		return {
			dateRang: [],
			billCode: '',
			buyerOrgan: [],
			sellerOrgan: [],
			status: [],
			invoicingTypeId: [],
			tagKey: '',
			memo: '',
			statusList: this.$fxStateMiddleware.getStateConfig('invoiceState'),
			invoiceTypeList: [],
			buyerOrganList: [],
			sellerOrganList: [],
			pickerOptions: this.$fxGetDatePickerOptionsShortcuts('all')
		}
	},
	methods: {
		onSearchClick () {
			this.$emit('on-search')
		},
		getAccountingPeriod () {
			return this.$fxApi('inStoreAssign.getAccountingPeriod').then(res => {
				this.dateRang = [res.begin, res.end]
				return Promise.resolve()
			})
		},
		initFilter () {
			this.billCode = ''
			this.buyerOrgan = []
			this.sellerOrgan = []
			this.status = []
			this.invoicingTypeId = []
			this.tagKey = ''
			this.memo = ''
		},
		onResetClick () {
			this.initFilter()
			this.getAccountingPeriod()
		},
		getFilterParams () {
			return {
				invoicingDate: this.dateRang,
				invoicingCode: this.billCode,
				invoicingTypeId: this.invoicingTypeId,
				state: this.status,
				purchaseOrganId: this.buyerOrgan,
				salesOrganId: this.sellerOrgan,
				tagKey: this.tagKey,
				memo: this.memo
			}
		},
		initSelect () {
			this.getBuyerList()
			this.getSellerList()
			this.getInvoiceTypeList()
		},
		getBuyerList () {
			return this.$fxApi(`${apiName}.getBuyerSelectList`).then(res => {
				this.buyerOrganList = res
			})
		},
		getSellerList () {
			return this.$fxApi(`${apiName}.getSellerSelectList`).then(res => {
				this.sellerOrganList = res
			})
		},
		getInvoiceTypeList () {
			return this.$fxApi(`${apiName}.getInvoiceTypeList`).then(res => {
				this.invoiceTypeList = res
			})
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
