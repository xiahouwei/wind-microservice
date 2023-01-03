<template>
	<w-collapse v-model="collapseVisible" title="销售方信息">
		<el-form ref="form" :model="organDetails" :rules="rules" size="mini" label-width="100px" inline>
			<fx-details-form-row>
				<el-form-item slot="left" prop="salesOrgan.id" label="销售方：">
					<w-select-tab
					v-model="organDetails.salesOrgan.id"
					:optionlist="sellerOrganList"
					class="form-item-input"
					@focus="onformInputFocus('salesOrgan.id')"
					@change="onSalesOrganChange"
				></w-select-tab>
				</el-form-item>
				<el-form-item slot="right" prop="salesTaxNO" label="销售方税号：">
					<w-input
						v-model="organDetails.salesTaxNO"
						:regType="$fxCommon.getFxInputReg('commonCode')"
						:maxlength="18"
						class="form-item-input"
					></w-input>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item slot="left" label="联系地址：" class="form-label-padding">
					<w-input
						v-model="organDetails.salesAddr"
						:maxlength="200"
						:regType="$fxCommon.getFxInputReg('memo')"
						class="form-item-input"
					></w-input>
				</el-form-item>
				<el-form-item slot="right" label="联系电话：" class="form-label-padding">
					<w-input
						v-model="organDetails.salesPhone"
						:maxlength="30"
						:regType="$fxCommon.getFxInputReg('memo')"
						class="form-item-input"
					></w-input>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item slot="left" label="开户行：" class="form-label-padding">
					<w-input
						v-model="organDetails.salesBankName"
						:maxlength="200"
						:regType="$fxCommon.getFxInputReg('memo')"
						class="form-item-input"
					></w-input>
				</el-form-item>
				<el-form-item slot="right" label="开户账号：" class="form-label-padding">
					<w-input
						v-model="organDetails.salesBankAccount"
						:maxlength="30"
						:regType="$fxCommon.getFxInputReg('phone')"
						class="form-item-input"
					></w-input>
				</el-form-item>
			</fx-details-form-row>
		</el-form>
	</w-collapse>
</template>
<script>
import { apiName } from '../../Index.vue'
export default {
	name: 'sellerInfo',
	props: {
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		sellerOrganList: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	data () {
		const validateSellerTaxId = (rule, value, callback) => {
			if (!value || value.length > 18) {
				callback(new Error('税号有误，请重新输入'))
			} else {
				callback()
			}
		}
		return {
			collapseVisible: false,
			rules: {
				'salesOrgan.id': [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				salesTaxNO: [{ required: true, trigger: 'blur', validator: validateSellerTaxId }]
			}
		}
	},
	methods: {
		validate () {
			return new Promise((resolve, reject) => {
				this.$refs.form.validate().then(resolve).catch(() => {
					this.collapseVisible = true
					reject(new Error())
				})
			})
		},
		onformInputFocus (prop) {
			this.$refs.form.clearValidate(prop)
		},
		onSalesOrganChange (organId) {
			return this.$fxApi(`${apiName}.getResource`)({ data: [organId] }).then(res => {
				const salesTax = res.find(item => item.type === '1')
				this.organDetails.salesTaxNO = salesTax ? salesTax.code : ''
			})
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
.form-label-padding {
	>>>.el-form-item__label {
		padding-left 10px
	}
}
</style>
