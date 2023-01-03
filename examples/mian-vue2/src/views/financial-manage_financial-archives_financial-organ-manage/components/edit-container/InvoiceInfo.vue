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
					v-fx-tab:focus.invoiceAddress
					:maxlength="$fxCommon.getFxInputMaxLength('shortCode')"
					:regType="$fxCommon.getFxInputReg('shortCode')"
					:disabled="disabled"
					class="form-item-input"
				/>
			</el-form-item>
			<el-form-item label="开票地址：">
				<w-input
					ref="invoiceAddress"
					v-model="organDetails.invoiceAddress"
					v-fx-tab:focus.bank
					:maxlength="$fxCommon.getFxInputMaxLength('deliveryAddr')"
					:regType="$fxCommon.getFxInputReg('deliveryAddr')"
					:disabled="disabled"
					class="form-item-input"
				/>
			</el-form-item>
			<el-form-item label="开户行：">
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
			<el-form-item label="开户账号：">
				<w-input
					ref="bankAccount"
					v-model="organDetails.bankAccount"
					v-fx-tab:focus.phone
					:maxlength="20"
					:regType="$fxCommon.getFxInputReg('phone')"
					:disabled="disabled"
					class="form-item-input"
				/>
			</el-form-item>
			<el-form-item label="联系电话：">
				<w-input
					ref="phone"
					v-model="organDetails.phone"
					v-fx-tab:loop.financial-manage_financial-organ-manage_details.invoiceInfo
					:maxlength="$fxCommon.getFxInputMaxLength('phone')"
					:regType="$fxCommon.getFxInputReg('phone')"
					:disabled="disabled"
					class="form-item-input"
				/>
			</el-form-item>
		</el-form>
	</w-collapse>
</template>
<script>
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
		disabled: Boolean
	},
	data () {
		return {
			collapseVisible: true,
			rules: {
				legalMan: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				taxPayerNum: [{ required: true, message: '该字段不能为空', trigger: 'no' }]
			}
		}
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
