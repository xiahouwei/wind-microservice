<template>
	<w-collapse v-model="collapseVisible" disabled :showArrow="false" title="基础信息">
		<el-form ref="form" :model="organDetails" :rules="rules" size="mini" label-width="100px" inline>
			<fx-details-form-row>
				<el-form-item slot="left" prop="code" :label="`${organTypeLabel}编号：`">
					<w-input
						ref='code'
						v-model="organDetails.code"
						v-fx-tab:focus.name
						:maxlength="$fxCommon.getFxInputMaxLength('commonCode')"
						placeholder="请输入"
						:regType="$fxCommon.getFxInputReg('commonCode')"
						class="form-item-input"
						:disabled='disabled'
					></w-input>
				</el-form-item>
				<el-form-item slot="right" prop="name" :label="`${organTypeLabel}名称：`">
					<w-input
						ref='name'
						v-model="organDetails.name"
						v-fx-tab="nameTabHandler"
						placeholder="请输入"
						:maxlength="100"
						class="form-item-input"
						:disabled='disabled'
						@blur="onOrganNameChange"
					/>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item v-show="isCustomerMain" slot="left" prop="customerTypeId" label="所属类别：">
					<w-select
						ref='customerTypeId'
						v-model="organDetails.customerTypeId"
						disabled
						:optionlist="customerTypeSelectList"
						class="form-item-input">
					</w-select>
				</el-form-item>
				<el-form-item v-show="!isCustomerMain" slot="left" prop="fatherId" label="上级机构：">
					<w-select
						ref='fatherId'
						v-model="organDetails.fatherId"
						v-fx-tab:focus.financeSortId
						class="form-item-input"
						:disabled='disabled'
						:optionlist="customerGroupList"
						@change="onFatherChange"
					>
					</w-select>
				</el-form-item>
				<el-form-item slot="right" label="财务分类：" class="form-item-finance">
					<w-select
						ref='financeSortId'
						v-model="organDetails.financeSortId"
						v-fx-tab="financeSortIdTabHandler"
						:optionlist="financialClassList"
						clearable
						:disabled='disabled'
						class="form-item-input"
					>
					</w-select>
					<w-icon v-fx-auth:basic-archives_support-archives_financial-class.add-financial type="add-round" class="form-input-add-btn" pointer @click="onAddFinancialClick" v-if='canAddFinancial'></w-icon>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item v-if="isCustomerMain" slot="left" prop="customerGroupId" label="所属企业：">
					<w-select
						ref='customerGroupId'
						v-model="organDetails.customerGroupId"
						v-fx-tab:focus.pinYin
						:optionlist="customerGroupList"
						class="form-item-input"
						:disabled='disabled'
						@change="onCustomerGroupChange"
					>
					</w-select>
				</el-form-item>
				<el-form-item v-if="isCustomerMain" slot="right" label="助记符：" prop="pinYin">
					<w-input
						ref='pinYin'
						v-model="organDetails.pinYin"
						v-fx-tab:focus.taxPlayerFlag
						:maxlength="50"
						placeholder="请输入"
						:disabled='disabled'
						class="form-item-input"
					/>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item v-if="!isCustomerMain" slot="left" label="助记符：" prop="pinYin">
					<w-input
						ref='pinYin'
						v-model="organDetails.pinYin"
						v-fx-tab="pinYinTabHandler"
						:maxlength="50"
						placeholder="请输入"
						:disabled='disabled'
						class="form-item-input"
					/>
				</el-form-item>
				<el-form-item v-if="isCustomerMain" prop='taxPlayerFlag' slot="left" label="计价方式：" class="form-item-region" label-width="100px">
					<w-select
						ref='taxPlayerFlag'
						v-model="organDetails.taxPlayerFlag"
						v-fx-tab="taxPlayerFlagTabHandler"
						:optionlist="taxPlayerFlagSelectList"
						:disabled='disabled'
						class="form-item-input"
					>
					</w-select>
				</el-form-item>
				<el-form-item slot="right" prop="enableFlag" label="启停状态：">
					<w-switch
						ref='enableFlag'
						v-model="organDetails.enableFlag"
						v-fx-tab:loop.basic-archives_customer-manage_details.basicInfo
						:disabled="fDisabledEnableFlagSwitch"
						:active-value="1"
						:inactive-value="0"
						:inclusion="false"
						:width="40"
					></w-switch>
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
	name: 'createOrgan',
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
		customerTypeList: {
			type: Array,
			default: () => {
				return []
			}
		},
		customerGroupList: {
			type: Array,
			default: () => {
				return []
			}
		},
		financialClassList: {
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
				customerTypeId: [{ required: true, message: '该字段不能为空', trigger: 'no', validator: validateIgnore }],
				fatherId: [{ required: true, message: '该字段不能为空', trigger: 'no', validator: this.validateFather }],
				pinYin: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				accountingPeriod: [{ required: true, message: '该字段不能为空', trigger: 'no', validator: validateIgnore }],
				enableFlag: [{ required: true, message: '该字段不能为空', trigger: 'no', validator: validateIgnore }],
				customerGroupId: [{ required: true, message: '该字段不能为空', trigger: 'no', validator: this.validateGroup }],
				taxPlayerFlag: [{ required: true, message: '该字段不能为空', trigger: 'no' }]
			},
			taxPlayerFlagSelectList: this.$fxTypeMiddleware.getCommonTypeList('taxPlayerType')
		}
	},
	computed: {
		...mapGetters(['detailsAuthGetter']),
		customerTypeSelectList () {
			return [{
				id: '',
				name: '无'
			}, ...this.customerTypeList]
		},
		isCustomerMain () {
			return this.$fxTypeMiddleware.isCommonType('customerOrganType')(['customer'])(this.organDetails.organType)
		},
		organTypeLabel () {
			return this.isCustomerMain ? '客户' : '机构'
		},
		fDisabledEnableFlagSwitch () {
			return this.disabled || (this.organDetails.enableFlag && !this.detailsAuthGetter('basic-archives_customer-manage.disable-customer')) || (!this.organDetails.enableFlag && !this.detailsAuthGetter('basic-archives_customer-manage.enable-customer'))
		},
		canAddFinancial () {
			return this.detailsAuthGetter('basic-archives_support-archives_financial-class.add-financial')
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
		onCustomerGroupChange (id) {
			const group = this.customerGroupList.find(item => {
				return item.id === id
			})
			this.organDetails.customerTypeId = group.customerTypeId || ''
		},
		onFatherChange (id) {
			const group = this.customerGroupList.find(item => {
				return item.id === id
			})
			this.organDetails.organId = group.organId || ''
		},
		validateFather (rule, value, callback) {
			if (!this.isCustomerMain && !value) {
				callback(new Error(rule.message))
			}
			callback()
		},
		validateGroup (rule, value, callback) {
			if (this.isCustomerMain && !value) {
				callback(new Error(rule.message))
			}
			callback()
		},
		defaultFocus (refName = 'code') {
			this.$fxUtils.vDoRefFocus(this, refName)
		},
		nameTabHandler ({ focus }) {
			this.isCustomerMain ? focus('financeSortId') : focus('fatherId')
		},
		financeSortIdTabHandler ({ focus }) {
			this.isCustomerMain ? focus('customerGroupId') : focus('pinYin')
		},
		pinYinTabHandler ({ focus, loop }) {
			this.fDisabledEnableFlagSwitch ? loop('basic-archives_customer-manage_details', 'basicInfo') : focus('enableFlag')
		},
		taxPlayerFlagTabHandler ({ focus, loop }) {
			this.fDisabledEnableFlagSwitch ? loop('basic-archives_customer-manage_details', 'basicInfo') : focus('enableFlag')
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
