<template>
	<div class="setting-mulity">
		<el-form size="mini" label-width="80px" class="setting-mulity_form">
			<el-form-item label="将字段：" class="form-item">
				<w-select
					v-model="settingKey"
					:optionlist="columnSelectList"
					:optionProp="optionProp"
					class="form-input"
				>
				</w-select>
			</el-form-item>
			<div class="form-edit-text">修改为</div>
			<div class="form-content">
				<div v-show="settingKey===0">
					<div class="strategy-select">
						<el-radio-group v-model="strategyRadio" @change="onRadioChange">
							<el-radio :label="1" class="strategy-radio-item strategy-radio-fix">按固定价</el-radio>
							<el-radio :label="2" class="strategy-radio-item">按成本价</el-radio>
							<el-radio :label="3" class="strategy-radio-item strategy-radio-proportion">按比例加价</el-radio>
							<el-radio :label="4" class="strategy-radio-item">按金额加价</el-radio>
						</el-radio-group>
					</div>
					<div class="strategy-content">
						<el-checkbox
							v-show="strategyRadio===1"
							v-model="priceWithOutTaxFlag"
							:true-label="1" :false-label="0"
							class="form-input-checkbox"
							@change="onPriceWithOutTaxFlagChange"
						>
							<el-form-item label="非税单价：" class="form-item">
								<w-input-number
									v-model="price"
									class="form-input"
									:pointSize="sysPricePointSize"
									:disabled="!priceWithOutTaxFlag"
									@change="onPriceChange"
								></w-input-number>
							</el-form-item>
						</el-checkbox>
						<el-checkbox v-show="strategyRadio===3" v-model="priceFlag" :true-label="1" :false-label="0" class="form-input-checkbox">
							<el-form-item label="固定比例：" class="form-item">
								<w-input-number
									v-model="price"
									:pointSize="sysMoneyPointSize"
									:disabled="!priceFlag"
									class="form-input"
								>
									<span slot="suffix">%</span>
								</w-input-number>
							</el-form-item>
						</el-checkbox>
						<el-checkbox v-show="strategyRadio===4" v-model="priceFlag" :true-label="1" :false-label="0" class="form-input-checkbox">
							<el-form-item label="固定加价：" class="form-item">
								<w-input-number
									v-model="price"
									:pointSize="sysPricePointSize"
									:disabled="!priceFlag"
									class="form-input"
								></w-input-number>
							</el-form-item>
						</el-checkbox>
						<el-checkbox v-model="taxRateFlag" :true-label="1" :false-label="0" class="form-input-checkbox">
							<el-form-item label="税率：" class="form-item">
								<w-select
									v-model="strategyTax"
									:optionlist="taxesList"
									:disabled="!taxRateFlag"
									class="form-input"
									@change="onTaxChange"
								>
								</w-select>
							</el-form-item>
						</el-checkbox>
						<el-checkbox
							v-show="strategyRadio===1"
							v-model="taxPriceFlag"
							:true-label="1"
							:false-label="0"
							class="form-input-checkbox"
							@change="onTaxPriceFlagChange"
						>
							<el-form-item label="含税单价：" class="form-item">
								<w-input-number
									v-model="taxPrice"
									class="form-input"
									:pointSize="sysPricePointSize"
									:disabled="!taxPriceFlag"
									@change="onTaxPriceChange"
								></w-input-number>
							</el-form-item>
						</el-checkbox>
					</div>
				</div>
				<div v-show="settingKey===1">
					<w-select
						v-model="tax"
						:optionlist="taxesList"
						class="form-input-tax"
						@change="onTaxChange"
					>
					</w-select>
					<div class="tax-memo fx-warn-font">注：批量修改税率后，价格策略为固定价销售的品项，会利用原含税单价，按照修改后的税率，重新计算新的非税单价</div>
				</div>
				<div v-show="settingKey===2" class="memo-container">
					<w-input
						v-model="memo"
						type="textarea"
						:rows="5"
						resize="none"
						:maxlength="300"
						placeholder="请输入内容"
						class="form-input-memo"
					>
					</w-input>
				</div>
			</div>
			<div class="form-footer">
				<el-button type="danger" plain @click="onCancelClick">取消</el-button>
				<el-button type="primary" plain @click="onSaveClick">保存</el-button>
			</div>
		</el-form>
	</div>
</template>
<script>
import { mapState } from 'vuex'
export default {
	name: 'settingMulity',
	props: {
		visible: Boolean
	},
	data () {
		return {
			columnSelectList: [{
				id: 0,
				label: '价格策略'
			}, {
				id: 1,
				label: '税率'
			}, {
				id: 2,
				label: '明细备注'
			}],
			settingKey: 0,
			strategyRadio: 1,
			price: 0,
			strategyTax: 0,
			taxPrice: 0,
			priceFlag: 0,
			taxRateFlag: 0,
			taxPriceFlag: 0,
			priceWithOutTaxFlag: 0,
			tax: 0,
			memo: '',
			optionProp: {
				name: 'label'
			}
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize,
			sysPricePointSize: state => state.system.sysPricePointSize,
			taxesList: state => state.system.taxesList
		})
	},
	watch: {
		visible (val) {
			if (!val) {
				this.refreshFormData()
			}
		}
	},
	methods: {
		onSaveClick () {
			const params = {
				type: this.settingKey,
				strategyRadio: this.strategyRadio,
				price: this.price,
				strategyTax: this.strategyTax,
				taxPrice: this.taxPrice,
				tax: this.tax,
				memo: this.memo,
				priceFlag: this.priceFlag || this.priceWithOutTaxFlag,
				taxRateFlag: this.taxRateFlag,
				taxPriceFlag: this.taxPriceFlag || (this.taxRateFlag && this.priceWithOutTaxFlag)
			}
			this.$emit('on-save-click', params)
		},
		onRadioChange () {
			this.price = 0
			this.strategyTax = 0
			this.taxPrice = 0
			this.priceFlag = 0
			this.taxRateFlag = 0
			this.taxPriceFlag = 0
			this.priceWithOutTaxFlag = 0
		},
		onPriceChange () {
			this.taxPrice = this.$fxUtils.toFixed(this.price * (1 + this.strategyTax), this.sysPricePointSize, false)
		},
		onPriceWithOutTaxFlagChange () {
			if (this.priceWithOutTaxFlag) {
				this.taxPriceFlag = 0
			}
		},
		onTaxChange () {
			if ([3, 4].includes(this.strategyRadio)) return
			this.price = this.$fxUtils.toFixed(this.taxPrice / (1 + this.strategyTax), this.sysPricePointSize, false)
		},
		onTaxPriceChange () {
			this.price = this.$fxUtils.toFixed(this.taxPrice / (1 + this.strategyTax), this.sysPricePointSize, false)
		},
		onTaxPriceFlagChange () {
			if (this.taxPriceFlag) {
				this.priceWithOutTaxFlag = 0
			}
		},
		onCancelClick () {
			this.$emit('on-cancel-click')
		},
		refreshFormData () {
			this.settingKey = 0
			this.strategyRadio = 1
			this.price = 0
			this.strategyTax = 0
			this.taxPrice = 0
			this.priceFlag = 0
			this.taxRateFlag = 0
			this.taxPriceFlag = 0
			this.priceWithOutTaxFlag = 0
			this.tax = 0
			this.memo = ''
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.setting-mulity {
	display: flex
	flex-direction: column
	height: 300px
	font-size: 12px
	.setting-mulity_form {
		display: flex
		flex-direction: column
		flex: 1
		.form-input {
			width: 150px
		}
		.form-item {
			margin-bottom: 10px
		}
		.form-input-tax {
			margin-top: 20px
			margin-left: 40px
			width: 200px
		}
		.form-input-checkbox {
			margin-left: 5px
		}
		.form-edit-text {
			height: 26px
			line-height:26px
			padding-left: 20px
		}
		.form-content {
			flex: 1
			border: 1px solid #eee
			.strategy-select {
				border-bottom: 1px dashed #eee
				.strategy-radio-item {
					margin-top: 5px
					margin-bottom: 5px
				}
				.strategy-radio-fix {
					margin-right: 42px
					margin-left: 10px
				}
				.strategy-radio-proportion {
					margin-left: 10px
				}
			}
			.strategy-content {
				padding-top: 10px
			}
			.tax-memo {
				padding: 0 20px
				margin-top: 50px
			}
			.memo-container {
				padding: 5px
			}
		}
		.form-footer {
			text-align: right
			margin-top: 10px
			margin-bottom: 5px
		}
	}
}
</style>
