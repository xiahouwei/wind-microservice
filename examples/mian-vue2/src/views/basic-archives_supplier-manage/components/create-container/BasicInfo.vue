<template>
	<w-collapse v-model="collapseVisible" disabled :showArrow="false" title="基础信息">
		<el-form ref="form" :model="organDetails" :rules="rules" size="mini" label-width="100px" inline>
			<fx-details-form-row>
				<el-form-item slot="left" prop="code" :label="`${organLabel}编号：`">
					<w-input
						ref='code'
						v-model="organDetails.code"
						v-fx-tab:focus.name
						:disabled="disabled"
						:maxlength="$fxCommon.getFxInputMaxLength('commonCode')"
						placeholder="请输入"
						:regType="$fxCommon.getFxInputReg('commonCode')"
						class="form-item-input"
					></w-input>
				</el-form-item>
				<el-form-item slot="right" prop="name" :label="`${organLabel}名称：`">
					<w-input
						ref='name'
						:maxlength="100"
						:disabled="disabled"
						v-model="organDetails.name"
						v-fx-tab="nameTabHandler"
						placeholder="请输入"
						class="form-item-input"
						@blur="onOrganNameChange"
					/>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item v-show="isSupplierTypeMain" slot="left" prop="supplierTypeId" label="所属类别：">
					<w-select
						ref='supplierTypeId'
						v-model="organDetails.supplierTypeId"
						v-fx-tab:focus.financeSortId
						:disabled="disabled"
						:optionlist="supplierTypeList"
						class="form-item-input"
					>
					</w-select>
				</el-form-item>
				<el-form-item v-show="!isSupplierTypeMain" slot="left" prop="fatherId" label="上级机构：">
					<w-select
						ref='fatherId'
						v-model="organDetails.fatherId"
						v-fx-tab:focus.financeSortId
						:disabled="disabled"
						:optionlist="fatherList"
						class="form-item-input"
						@change="onFatherIdChange"
					>
					</w-select>
				</el-form-item>
				<el-form-item slot="right" label="财务分类：" class="form-item-finance">
					<w-select
						ref='financeSortId'
						v-model="organDetails.financeSortId"
						v-fx-tab:focus.pinYin
						:disabled="disabled"
						:optionlist="financialClassList"
						clearable
						class="form-item-input"
					>
					</w-select>
					<w-icon v-fx-auth:basic-archives_support-archives_financial-class.add-financial type="add-round" :disabled="disabled" class="form-input-add-btn" pointer @click="onAddFinancialClick"></w-icon>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item slot="left" label="助记符：" prop="pinYin">
					<w-input
						ref='pinYin'
						v-model="organDetails.pinYin"
						v-fx-tab="pinYinTabHandler"
						:disabled="disabled"
						:maxlength="50"
						placeholder="请输入"
						class="form-item-input"
					/>
				</el-form-item>
				<el-form-item slot="right" prop="enableFlag" label="启停状态：">
					<w-switch
						ref='enableFlag'
						v-model="organDetails.enableFlag"
						v-fx-tab="enableFlagTabHandler"
						:disabled="fDisabledEnableFlagSwitch"
						:active-value="1"
						:inactive-value="0"
						:inclusion="false"
						:width="40"
					></w-switch>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item v-if='isSupplierTypeMain'  prop='taxPlayerFlag' slot="left" label="计价方式：" class="form-item-region" label-width="100px">
					<w-select
						ref='taxPlayerFlag'
						v-model="organDetails.taxPlayerFlag"
						v-fx-tab:loop.basic-archives_supplier-manage_details.basicInfo
						:disabled="disabled"
						:optionlist="taxPlayerFlagSelectList"
						class="form-item-input"
					>
					</w-select>
				</el-form-item>
			</fx-details-form-row>
		</el-form>
		<createFinancial ref="createFinancial" @on-refresh="onRefreshFinancialList"></createFinancial>
	</w-collapse>
</template>
<script>
import { mapGetters } from 'vuex'
import createFinancial from '@/components/financial-manage/FinancialCreateDialog.vue'
export default {
	name: 'basicInfo',
	components: {
		createFinancial
	},
	props: {
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		disabled: Boolean,
		financialClassList: {
			type: Array,
			default: () => {
				return []
			}
		},
		supplierTypeList: {
			type: Array,
			default: () => {
				return []
			}
		},
		fatherList: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	data () {
		const validateIgnore = (rule, value, callback) => {
			callback()
		}
		return {
			collapseVisible: true,
			rules: {
				code: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				name: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				pinYin: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				supplierTypeId: [{ required: true, message: '该字段不能为空', trigger: 'no', validator: this.validateSupplierType }],
				fatherId: [{ required: true, message: '该字段不能为空', trigger: 'no', validator: this.validatefather }],
				accountingPeriod: [{ required: true, message: '该字段不能为空', trigger: 'no', validator: validateIgnore }],
				enableFlag: [{ required: true, message: '该字段不能为空', trigger: 'no', validator: validateIgnore }],
				taxPlayerFlag: [{ required: true, message: '该字段不能为空', trigger: 'no' }]
			},
			taxPlayerFlagSelectList: this.$fxTypeMiddleware.getCommonTypeList('taxPlayerType')
		}
	},
	computed: {
		...mapGetters(['detailsAuthGetter']),
		isSupplierTypeMain () {
			return this.$fxTypeMiddleware.isCommonType('supplierType')(['supplier'])(this.organDetails.organType)
		},
		organLabel () {
			return this.isSupplierTypeMain ? '供货商' : '机构'
		},
		fDisabledEnableFlagSwitch () {
			return this.disabled || (this.organDetails.enableFlag && !this.detailsAuthGetter('basic-archives_supplier-manage.disable-supplier')) || (!this.organDetails.enableFlag && !this.detailsAuthGetter('basic-archives_supplier-manage.enable-supplier'))
		}
	},
	methods: {
		onRefreshFinancialList () {
			this.$emit('on-refresh-financial-list')
		},
		onAddFinancialClick () {
			this.$refs.createFinancial.add()
		},
		validate () {
			return this.$refs.form.validate()
		},
		onOrganNameChange (e) {
			const name = e.target.value
			if (!this.organDetails.pinYin) {
				const pinyin = this.$fxUtils.chinese2Pinyin(name, true)
				this.organDetails.pinYin = pinyin
			}
		},
		validateSupplierType (rule, value, callback) {
			if (this.isSupplierTypeMain && !value) {
				callback(new Error(rule.message))
				return false
			}
			callback()
		},
		validatefather (rule, value, callback) {
			if (!this.isSupplierTypeMain && !value) {
				callback(new Error(rule.message))
				return false
			}
			callback()
		},
		onFatherIdChange (id) {
			const father = this.fatherList.find(item => {
				return item.id === id
			})
			if (father.organId) {
				this.organDetails.organId = father.organId || ''
			}
		},
		defaultFocus (refName = 'code') {
			this.$fxUtils.vDoRefFocus(this, refName)
		},
		nameTabHandler ({ focus }) {
			this.isSupplierTypeMain ? focus('supplierTypeId') : focus('fatherId')
		},
		pinYinTabHandler ({ focus, loop }) {
			this.fDisabledEnableFlagSwitch ? this.isSupplierTypeMain ? focus('taxPlayerFlag') : loop('basic-archives_supplier-manage_details', 'basicInfo') : focus('enableFlag')
		},
		enableFlagTabHandler ({ focus, loop }) {
			if (this.isSupplierTypeMain) {
				focus('taxPlayerFlag')
			} else {
				loop('basic-archives_supplier-manage_details', 'basicInfo')
			}
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
.form-input-add-btn {
	position: relative
	top: 5px
	left: 5px
}
.form-item-finance {
	>>>.el-form-item__label {
		padding-left:10px
	}
}
</style>
