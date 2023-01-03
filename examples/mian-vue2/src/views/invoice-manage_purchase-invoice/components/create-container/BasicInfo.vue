<template>
	<w-collapse v-model="collapseVisible" disabled :showArrow="false" title="基础信息">
		<el-form ref="form" :model="organDetails" :rules="rules" size="mini" label-width="100px" inline>
			<fx-details-form-row>
				<el-form-item slot="left" prop="invoicingDate" label="开票日期：">
					<el-date-picker
						v-model="organDetails.invoicingDate"
						type="date"
						value-format="yyyy-MM-dd"
						:picker-options="pickerOptions"
						:clearable="false"
						placeholder="选择日期"
						class="form-item-input"
						@focus="onformInputFocus('invoicingDate')"
					>
					</el-date-picker>
				</el-form-item>
				<el-form-item slot="right" prop="invoicingType.id" label="发票类型：">
					<w-select
						v-model="organDetails.invoicingType.id"
						:optionlist="invoiceTypeList"
						class="form-item-input"
					>
					</w-select>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item slot="left" prop="totalMoney" label="价税合计：">
					<w-input-number
						ref='money'
						v-model="organDetails.totalMoney"
						pointSize="2"
						class="form-item-input"
					></w-input-number>
				</el-form-item>
				<el-form-item slot="right" prop="invoicingCode" label="发票号码：">
					<w-input
						v-model="organDetails.invoicingCode"
						:maxlength="$fxCommon.getFxInputMaxLength('invoicingCode')"
						:regType="$fxCommon.getFxInputReg('invoicingCode')"
						class="form-item-input"
					></w-input>
				</el-form-item>
			</fx-details-form-row>
		</el-form>
	</w-collapse>
</template>
<script>
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
		}
	},
	data () {
		const validateInvoiceCode = (rule, value, callback) => {
			if (!value || value.length !== 8) {
				callback(new Error('发票号码有误，请重新输入'))
			} else {
				callback()
			}
		}
		const validateTotalMoney = (rule, value, callback) => {
			if (!value || value === 0) {
				callback(new Error('价税合计必须大于0'))
			} else {
				callback()
			}
		}
		return {
			collapseVisible: true,
			rules: {
				invoicingDate: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				'invoicingType.id': [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				totalMoney: [{ required: true, trigger: 'no', validator: validateTotalMoney }],
				invoicingCode: [{ required: true, trigger: 'blur', validator: validateInvoiceCode }]
			},
			pickerOptions: {
				disabledDate: (time) => {
					return time.getTime() > new Date().getTime()
				}
			}
		}
	},
	methods: {
		validate () {
			return this.$refs.form.validate()
		},
		onformInputFocus (prop) {
			this.$refs.form.clearValidate(prop)
		},
		defaultFocus (refName = 'money') {
			this.$fxUtils.vDoRefFocus(this, refName)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-item-input {
	width: 175px
	box-sizing: border-box
}
</style>
