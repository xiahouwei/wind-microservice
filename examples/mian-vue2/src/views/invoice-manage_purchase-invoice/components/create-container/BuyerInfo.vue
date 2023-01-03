<template>
	<w-collapse v-model="collapseVisible" title="采购方信息">
		<el-form ref="form" :model="organDetails" :rules="rules" size="mini" label-width="100px" inline>
			<fx-details-form-row>
				<el-form-item slot="left" prop="purchaseOrgan.id" label="采购方：">
					<w-select-tab
					v-model="organDetails.purchaseOrgan.id"
					:optionlist="buyerOrganList"
					class="form-item-input"
					@focus="onformInputFocus('purchaseOrgan.id')"
					@change="onPurchaseOrganChange"
				></w-select-tab>
				</el-form-item>
				<el-form-item slot="right" prop="purchaseTaxNO" label="采购方税号：">
					<w-input
						v-model="organDetails.purchaseTaxNO"
						:regType="$fxCommon.getFxInputReg('commonCode')"
						:maxlength="18"
						class="form-item-input"
					></w-input>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item slot="left" label="联系地址：" class="form-label-padding">
					<w-input
						v-model="organDetails.purchaseAddr"
						:maxlength="200"
						:regType="$fxCommon.getFxInputReg('memo')"
						class="form-item-input"
					></w-input>
				</el-form-item>
				<el-form-item slot="right" label="联系电话：" class="form-label-padding">
					<w-input
						v-model="organDetails.purchasePhone"
						:maxlength="30"
						:regType="$fxCommon.getFxInputReg('memo')"
						class="form-item-input"
					></w-input>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item slot="left" label="开户行：" class="form-label-padding">
					<w-input
						v-model="organDetails.purchaseBankName"
						:maxlength="200"
						:regType="$fxCommon.getFxInputReg('memo')"
						class="form-item-input"
					></w-input>
				</el-form-item>
				<el-form-item slot="right" label="开户账号：" class="form-label-padding">
					<w-input
						v-model="organDetails.purchaseBankAccount"
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
	name: 'buyerInfo',
	props: {
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		buyerOrganList: {
			type: Array,
			default: () => {
				return []
			}
		},
		accountingPeriodBeginDate: String
	},
	data () {
		const validateBuyerTaxId = (rule, value, callback) => {
			if (!value || value.length > 18) {
				callback(new Error('税号有误，请重新输入'))
			} else {
				callback()
			}
		}
		return {
			collapseVisible: false,
			rules: {
				'purchaseOrgan.id': [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				purchaseTaxNO: [{ required: true, trigger: 'blur', validator: validateBuyerTaxId }]
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
		onPurchaseOrganChange (organId) {
			this.getResource(organId).then(this.getAccountingPeriod)
		},
		getResource (organId) {
			return this.$fxApi(`${apiName}.getResource`)({ data: [organId] }).then(res => {
				const purchaseTax = res.find(item => item.type === '1')
				this.organDetails.purchaseTaxNO = purchaseTax ? purchaseTax.code : ''
				return Promise.resolve(organId)
			})
		},
		getAccountingPeriod (organId) {
			return this.$fxApi(`${apiName}.getAccountingPeriod`, organId).then(res => {
				this.$emit('update:accountingPeriodBeginDate', res.beginDate)
			}).catch(() => {
				this.$emit('update:accountingPeriodBeginDate', '')
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
