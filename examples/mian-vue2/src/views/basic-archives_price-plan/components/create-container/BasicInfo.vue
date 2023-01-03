<template>
	<w-collapse ref="collapse" v-model="collapseVisible" disabled :showArrow="false" title="基础信息">
		<el-form ref="form" :model="organDetails" :rules="rules" size="mini" label-width="100px" inline>
			<el-form-item prop="code" label="方案编号：" class="form-item-unrequire">
				<w-input
					v-model="organDetails.code"
					disabled
					class="form-item-input"
				></w-input>
			</el-form-item>
			<el-form-item prop="name" label="方案名称：">
				<w-input
					ref='name'
					v-model="organDetails.name"
					v-fx-tab:focus.beginDate
					:maxlength="$fxCommon.getFxInputMaxLength('commonName')"
					:regType="$fxCommon.getFxInputReg('commonName')"
					:disabled="disabled"
					class="form-item-input"
					@focus="onClearValidate('name')"
				></w-input>
			</el-form-item>
			<el-form-item prop="beginDate" label="起始日期：">
				<el-date-picker
					ref="beginDate"
					v-model="organDetails.beginDate"
					v-fx-tab:focus.endDate
					type="date"
					value-format="yyyy-MM-dd"
					placeholder="选择日期"
					:disabled="disabled"
					class="form-item-input"
					@change="onBeginDateChange"
					@focus="onClearValidate('beginDate')"
				>
				</el-date-picker>
			</el-form-item>
			<el-form-item prop="endDate" label="截止日期：">
				<el-date-picker
					ref="endDate"
					v-model="organDetails.endDate"
					v-fx-tab:focus.sellerOrganIds
					type="date"
					value-format="yyyy-MM-dd"
					placeholder="选择日期"
					:disabled="disabled"
					class="form-item-input"
					@change="onEndDateChange"
					@focus="onClearValidate('endDate')"
				>
				</el-date-picker>
			</el-form-item>
			<el-form-item prop="sellerOrganIds" label="卖方机构：">
				<w-select-tab-mulity
					ref="sellerOrganIds"
					v-model="organDetails.sellerOrganIds"
					v-fx-tab:focus.organIds
					:optionlist="sellerTabSelectList"
					:disabled="disabled"
					class="form-item-input-buyer"
					@change="onSellerOrganChange"
					@blur="onClearValidate('sellerOrganIds')"
				></w-select-tab-mulity>
				<w-link @click="onSettingSellerClick">点击查看详情</w-link>
			</el-form-item>
			<el-form-item prop="organIds" label="买方机构：">
				<w-select-tab-mulity
					ref="organIds"
					v-model="organDetails.organIds"
					v-fx-tab="organIdsTabHandler"
					:optionlist="buyerTabSelectList"
					:disabled="disabled"
					class="form-item-input-buyer"
					@change="onOrganChange"
					@blur="onClearValidate('organIds')"
				></w-select-tab-mulity>
				<w-link @click="onSettingBuyerClick">点击查看详情</w-link>
			</el-form-item>
			<el-form-item prop="enableFlag" label="启停状态：">
				<div class='switch-container'>
					<w-switch
						ref="enableFlag"
						v-model="organDetails.enableFlag"
						v-fx-tab:focus.memo
						:active-value="1"
						:inactive-value="0"
						:disabled="enableSwitchDisable"
						:inclusion="false"
						:width="40"
					>
					</w-switch>
				</div>
			</el-form-item>
			<el-form-item label="备注：" class="form-item-unrequire">
				<w-input
					ref="memo"
					v-model="organDetails.memo"
					v-fx-tab:loop.basic-archives_price-plan_details.basicInfo
					:maxlength="$fxCommon.getFxInputMaxLength('memo')"
					:regType="$fxCommon.getFxInputReg('memo')"
					:disabled="disabled"
					class="form-item-input"
				></w-input>
			</el-form-item>
		</el-form>
		<settingBuyer
			ref="setttingBuyer"
			type="buyer"
			:disabled="disabled"
			:listData="buyerSelectList"
			:selectedBuyer="organDetails.organIds"
			@on-save-click="onSaveSettingBuyer"
		></settingBuyer>
		<settingBuyer
			ref="setttingSeller"
			type="seller"
			:disabled="disabled"
			:listData="sellerSelectList"
			:selectedBuyer="organDetails.sellerOrganIds"
			@on-save-click="onSaveSettingSeller"
		></settingBuyer>
	</w-collapse>
</template>
<script>
import { mapGetters } from 'vuex'
import settingBuyer from './SettingBuyer.vue'
export default {
	name: 'createPricePlan',
	components: {
		settingBuyer
	},
	props: {
		isFullScreen: Boolean,
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		sellerSelectList: {
			type: Array,
			default: () => {
				return []
			}
		},
		buyerSelectList: {
			type: Array,
			default: () => {
				return []
			}
		},
		buyerTabSelectList: {
			type: Array,
			default: () => {
				return []
			}
		},
		sellerTabSelectList: {
			type: Array,
			default: () => {
				return []
			}
		},
		disabled: Boolean
	},
	data () {
		const validateIgnore = (rule, value, callback) => {
			callback()
		}
		return {
			collapseVisible: true,
			rules: {
				name: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				beginDate: [{ required: true, trigger: 'no', validator: this.validateDate }],
				endDate: [{ required: true, trigger: 'no', validator: this.validateDate }],
				sellerOrganIds: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				organIds: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				enableFlag: [{ required: true, message: '该字段不能为空', trigger: 'no', validator: validateIgnore }]
			}
		}
	},
	computed: {
		...mapGetters(['detailsAuthGetter']),
		enableSwitchDisable () {
			return this.disabled || (this.organDetails.enableFlag && !this.detailsAuthGetter('basic-archives_price-plan.disable-price')) || (!this.organDetails.enableFlag && !this.detailsAuthGetter('basic-archives_price-plan.enable-price'))
		}
	},
	watch: {
		isFullScreen (val) {
			if (!val) {
				this.$nextTick(() => this.$refs.collapse.resize())
			}
		}
	},
	methods: {
		validate () {
			return this.$refs.form.validate()
		},
		onBeginDateChange (item) {
			this.organDetails.beginDate = `${item} 00:00:00`
		},
		onEndDateChange (item) {
			this.organDetails.endDate = `${item} 23:59:59`
		},
		onSellerOrganChange (ids) {
			this.organDetails.sellerOrganList = ids.map(id => {
				return {
					organId: id
				}
			})
		},
		onOrganChange (ids) {
			this.organDetails.buyerOrganList = ids.map(id => {
				return {
					organId: id
				}
			})
		},
		validateDate (rule, value, callback) {
			const dateResult = this.$fxUtils.compareDate(this.organDetails.endDate, this.organDetails.beginDate)
			if (!value) {
				callback(new Error('该字段不能为空'))
			} else if (!dateResult) {
				callback(new Error('起始日期不能大于截止日期'))
			} else {
				callback()
			}
		},
		onSettingBuyerClick () {
			this.$refs.setttingBuyer.open()
		},
		onSettingSellerClick () {
			this.$refs.setttingSeller.open()
		},
		onSaveSettingSeller (item) {
			this.organDetails.sellerOrganIds = item
			this.organDetails.sellerOrganList = item.map(id => {
				return {
					organId: id
				}
			})
		},
		onSaveSettingBuyer (item) {
			this.organDetails.organIds = item
			this.organDetails.buyerOrganList = item.map(id => {
				return {
					organId: id
				}
			})
		},
		onClearValidate (prop) {
			this.$refs.form.clearValidate(prop)
		},
		defaultFocus (refName = 'name') {
			this.$fxUtils.vDoRefFocus(this, refName)
		},
		organIdsTabHandler ({ focus }) {
			this.enableSwitchDisable ? focus('memo') : focus('enableFlag')
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-item-input {
	width: 275px
	box-sizing: border-box
}
.form-item-input-buyer {
	width: 193px
}
.form-item-unrequire {
	>>>.el-form-item__label {
		padding-left:10px
	}
}
.switch-container {
	width 275px
}
</style>
