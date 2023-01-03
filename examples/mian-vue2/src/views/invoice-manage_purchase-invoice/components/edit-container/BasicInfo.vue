<template>
	<w-collapse v-model="collapseVisible" disabled :showArrow="false" title="基础信息">
		<el-form ref="form" :model="organDetails" :rules="rules" size="mini" label-width="105px" inline>
			<fx-details-form-row class="form-row">
				<el-form-item prop="invoicingType.id" label="发票类型：">
					<w-select
						v-model="organDetails.invoicingType.id"
						:optionlist="invoiceTypeList"
						:disabled="disabled"
						class="form-item-input"
					>
					</w-select>
				</el-form-item>
				<el-form-item prop="invoicingCode" label="发票号码：">
					<w-input
						ref="code"
						v-model="organDetails.invoicingCode"
						:maxlength="$fxCommon.getFxInputMaxLength('invoicingCode')"
						:regType="$fxCommon.getFxInputReg('invoicingCode')"
						:disabled="disabled"
						class="form-item-input"
					></w-input>
				</el-form-item>
				<el-form-item prop="invoicingDate" label="开票日期：">
					<el-date-picker
						v-model="organDetails.invoicingDate"
						type="date"
						value-format="yyyy-MM-dd"
						:picker-options="pickerOptions"
						:clearable="false"
						:disabled="disabled"
						placeholder="选择日期"
						class="form-item-input"
						@focus="onformInputFocus('invoicingDate')"
					>
					</el-date-picker>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<div slot="left" class="form-row-flex">
					<div class="form-row-flex-label">采购方信息：</div>
					<el-form-item prop="purchaseOrgan.id" label="名称：">
						<w-select-tab
							v-model="organDetails.purchaseOrgan.id"
							:optionlist="buyerOrganList"
							class="form-item-input"
							:disabled="disabled"
							@focus="onformInputFocus('purchaseOrgan.id')"
							@change="onPurchaseOrganChange"
						></w-select-tab>
					</el-form-item>
					<el-form-item prop="purchaseTaxNO" label="税号：">
						<w-input
							v-model="organDetails.purchaseTaxNO"
							:regType="$fxCommon.getFxInputReg('commonCode')"
							:maxlength="18"
							:disabled="disabled"
							class="form-item-input"
						></w-input>
					</el-form-item>
					<el-form-item label="地址/电话：" class="form-label-padding">
						<w-input
							v-model="organDetails.purchaseAddr"
							:maxlength="200"
							:regType="$fxCommon.getFxInputReg('memo')"
							:disabled="disabled"
							class="form-item-input"
						></w-input>
						<span class="divided-symbols">/</span>
						<w-input
							v-model="organDetails.purchasePhone"
							:maxlength="30"
							:regType="$fxCommon.getFxInputReg('memo')"
							:disabled="disabled"
							class="form-item-input"
						></w-input>
					</el-form-item>
					<el-form-item label="开户行/账号：" class="form-label-padding">
						<w-input
							v-model="organDetails.purchaseBankName"
							:maxlength="200"
							:regType="$fxCommon.getFxInputReg('memo')"
							:disabled="disabled"
							class="form-item-input"
						></w-input>
						<span class="divided-symbols">/</span>
						<w-input
							v-model="organDetails.purchaseBankAccount"
							:maxlength="30"
							:regType="$fxCommon.getFxInputReg('phone')"
							:disabled="disabled"
							class="form-item-input"
						></w-input>
					</el-form-item>
				</div>
				<div slot="right" class="form-row-flex">
					<div class="form-row-flex-label">销售方信息：</div>
					<el-form-item prop="salesOrgan.id" label="名称：">
						<w-select-tab
							v-model="organDetails.salesOrgan.id"
							:optionlist="sellerOrganList"
							class="form-item-input"
							:disabled="disabled"
							@focus="onformInputFocus('salesOrgan.id')"
							@change="onSalesOrganChange"
						></w-select-tab>
					</el-form-item>
					<el-form-item prop="salesTaxNO" label="税号：">
						<w-input
							v-model="organDetails.salesTaxNO"
							:regType="$fxCommon.getFxInputReg('commonCode')"
							:maxlength="18"
							:disabled="disabled"
							class="form-item-input"
						></w-input>
					</el-form-item>
					<el-form-item label="地址/电话：" class="form-label-padding">
						<w-input
							v-model="organDetails.salesAddr"
							:maxlength="200"
							:regType="$fxCommon.getFxInputReg('memo')"
							:disabled="disabled"
							class="form-item-input"
						></w-input>
						<span class="divided-symbols">/</span>
						<w-input
							v-model="organDetails.salesPhone"
							:maxlength="30"
							:regType="$fxCommon.getFxInputReg('memo')"
							:disabled="disabled"
							class="form-item-input"
						></w-input>
					</el-form-item>
					<el-form-item label="开户行/账号：" class="form-label-padding">
						<w-input
							v-model="organDetails.salesBankName"
							:maxlength="200"
							:regType="$fxCommon.getFxInputReg('memo')"
							:disabled="disabled"
							class="form-item-input"
						></w-input>
						<span class="divided-symbols">/</span>
						<w-input
							v-model="organDetails.salesBankAccount"
							:maxlength="30"
							:regType="$fxCommon.getFxInputReg('phone')"
							:disabled="disabled"
							class="form-item-input"
						></w-input>
					</el-form-item>
				</div>
			</fx-details-form-row>
		</el-form>
	</w-collapse>
</template>
<script>
import { apiName } from '../../Index.vue'
export default {
	name: 'basicInfo',
	props: {
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		invoiceTypeList: {
			type: Array,
			default: () => {
				return []
			}
		},
		sellerOrganList: {
			type: Array,
			default: () => {
				return []
			}
		},
		buyerOrganList: {
			type: Array,
			default: () => {
				return []
			}
		},
		disabled: Boolean,
		accountingPeriodBeginDate: String
	},
	data () {
		const validateInvoiceCode = (rule, value, callback) => {
			if (!value || value.length !== 8) {
				callback(new Error('发票号码有误，请重新输入'))
			} else {
				callback()
			}
		}
		const validateTaxId = (rule, value, callback) => {
			if (!value || value.length > 18) {
				callback(new Error('税号有误，请重新输入'))
			} else {
				callback()
			}
		}
		return {
			collapseVisible: true,
			rules: {
				invoicingDate: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				'invoicingType.id': [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				invoicingCode: [{ required: true, trigger: 'blur', validator: validateInvoiceCode }],
				'salesOrgan.id': [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				salesTaxNO: [{ required: true, trigger: 'blur', validator: validateTaxId }],
				'purchaseOrgan.id': [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				purchaseTaxNO: [{ required: true, trigger: 'blur', validator: validateTaxId }]
			},
			pickerOptions: {
				disabledDate: (time) => {
					return time.getTime() > new Date().getTime()
				}
			}
		}
	},
	mounted () {
		this.getAccountingPeriod(this.organDetails.purchaseOrgan.id)
	},
	methods: {
		validate () {
			return this.$refs.form.validate()
		},
		onformInputFocus (prop) {
			this.$refs.form.clearValidate(prop)
		},
		onPurchaseOrganChange (organId) {
			this.getResource(organId).then((taxCode) => {
				this.organDetails.purchaseTaxNO = taxCode ? taxCode.code : ''
				this.getAccountingPeriod(organId)
			})
		},
		getResource (organId) {
			return this.$fxApi(`${apiName}.getResource`)({ data: [organId] }).then(res => {
				const taxCode = res.find(item => item.type === '1')
				return Promise.resolve(taxCode)
			})
		},
		getAccountingPeriod (organId) {
			return this.$fxApi(`${apiName}.getAccountingPeriod`, organId).then(res => {
				this.$emit('update:accountingPeriodBeginDate', res.beginDate)
			}).catch(() => {
				this.$emit('update:accountingPeriodBeginDate', '')
			})
		},
		onSalesOrganChange (organId) {
			this.getResource(organId).then((taxCode) => {
				this.organDetails.salesTaxNO = taxCode ? taxCode.code : ''
			})
		},
		defaultFocus (refName = 'code') {
			this.$fxUtils.vDoRefFocus(this, refName)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-row {
	justify-content space-between
}
.form-row-flex {
	display flex
	flex-direction column
	&-label {
		padding-left 10px
		margin-bottom 10px
		line-height 28px
	}
}
.form-item-input {
	width: 175px
	box-sizing: border-box
}
.form-label-padding {
	>>>.el-form-item__label {
		padding-left 10px
	}
}
.divided-symbols {
	display inline-block
	width 22px
	text-align center
}
</style>
