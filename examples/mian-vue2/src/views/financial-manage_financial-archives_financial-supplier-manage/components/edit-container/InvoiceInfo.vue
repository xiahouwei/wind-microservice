<template>
	<w-collapse ref="collapse" v-model="collapseVisible" disabled :showArrow="false" title="发票信息">
		<el-form ref="form" :model="organDetails" :rules="rules" size="mini" label-width="120px" inline>
			<el-form-item prop="legalMan" label="法人代表：">
				<w-input
					ref="legalMan"
					v-model="organDetails.legalMan"
					v-fx-tab:focus.taxPayerNum
					:maxlength="$fxCommon.getFxInputMaxLength('commonName')"
					:regType="$fxCommon.getFxInputReg('commonName')"
					:disabled="disabled"
					class="form-item-input"
				></w-input>
			</el-form-item>
			<el-form-item prop="taxPayerNum" label="纳税人识别号：">
				<w-input
					ref="taxPayerNum"
					v-model="organDetails.taxPayerNum"
					v-fx-tab:focus.taxType
					:maxlength="$fxCommon.getFxInputMaxLength('shortCode')"
					:regType="$fxCommon.getFxInputReg('shortCode')"
					:disabled="disabled"
					class="form-item-input"
				/>
			</el-form-item>
			<el-form-item prop="taxType" label="税务分类：">
				<w-select
					ref="taxType"
					v-fx-tab:focus.bank
					v-model="organDetails.taxType"
					:optionlist="taxTypeList"
					:optionProp="optionProp"
					:disabled="disabled"
					class="form-item-input"
				>
				</w-select>
			</el-form-item>
			<el-form-item prop="bank" label="开户行：">
				<w-input
					ref="bank"
					v-model="organDetails.bank"
					v-fx-tab:focus.bankAccount
					:maxlength="$fxCommon.getFxInputMaxLength('commonName')"
					:regType="$fxCommon.getFxInputReg('commonName')"
					:disabled="disabled"
					class="form-item-input"
				/>
			</el-form-item>
			<el-form-item prop="bankAccount" label="开户账号：">
				<w-input
					ref="bankAccount"
					v-model="organDetails.bankAccount"
					v-fx-tab:focus.taxRate
					:maxlength="20"
					:regType="$fxCommon.getFxInputReg('phone')"
					:disabled="disabled"
					class="form-item-input"
				/>
			</el-form-item>
			<el-form-item prop="taxRate" label="默认税率：">
				<w-select
					ref="taxRate"
					v-model="organDetails.taxRate"
					v-fx-tab:focus.invoiceAddress
					:optionlist="taxesList"
					:disabled="disabled"
					class="form-item-input"
				>
				</w-select>
			</el-form-item>
			<el-form-item prop="invoiceAddress" label="开票地址：">
				<w-input
					ref="invoiceAddress"
					v-model="organDetails.invoiceAddress"
					v-fx-tab:focus.phone
					:maxlength="$fxCommon.getFxInputMaxLength('deliveryAddr')"
					:regType="$fxCommon.getFxInputReg('deliveryAddr')"
					:disabled="disabled"
					class="form-item-input"
				/>
			</el-form-item>
			<el-form-item prop="phone" label="联系电话：">
				<w-input
					ref="phone"
					v-model="organDetails.phone"
					v-fx-tab:focus.invoicingType
					:maxlength="$fxCommon.getFxInputMaxLength('phone')"
					:regType="$fxCommon.getFxInputReg('phone')"
					:disabled="disabled"
					class="form-item-input"
				/>
			</el-form-item>
			<el-form-item prop="invoicingTypeId" label="发票类型：">
				<w-select
					ref="invoicingType"
					v-fx-tab:loop.financial-manage_financial-supplier-manage_details.invoiceInfo
					v-model="organDetails.invoicingTypeId"
					:optionlist="invoiceTypeList"
					:disabled="disabled"
					class="form-item-input"
				>
				</w-select>
			</el-form-item>
		</el-form>
	</w-collapse>
</template>
<script>
import { mapState } from 'vuex'
export default {
	name: 'invoiceInfo',
	props: {
		visibleFlag: Boolean,
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		disabled: Boolean,
		invoiceTypeList: {
			type: Array,
			default: () => {
				return []
			}
		},
		taxTypeList: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	data () {
		return {
			collapseVisible: true,
			rules: {
				legalMan: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				taxPayerNum: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				taxType: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				taxRate: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				invoicingTypeId: [{ required: true, message: '该字段不能为空', trigger: 'no' }]
			},
			optionProp: {
				name: 'label'
			}
		}
	},
	computed: {
		...mapState({
			taxesList: state => state.system.taxesList
		})
	},
	watch: {
		visibleFlag (val) {
			if (val) {
				this.$nextTick(() => {
					this.$refs.form.clearValidate()
					this.$refs.collapse.resize()
				})
			}
		}
	},
	methods: {
		validate () {
			return this.$refs.form.validate()
		},
		defaultFocus (refName = 'legalMan') {
			this.$fxUtils.vDoRefFocus(this, refName)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-item-input {
	width: 200px
	box-sizing: border-box
}
</style>
