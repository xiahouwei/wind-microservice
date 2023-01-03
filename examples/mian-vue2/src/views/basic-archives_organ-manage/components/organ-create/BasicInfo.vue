<template>
	<w-collapse v-model="collapseVisible" disabled :showArrow="false" title="基础信息">
		<el-form ref="form" :model="organDetails" :rules="rules" size="mini" label-width="110px" inline>
			<fx-details-form-row>
				<el-form-item slot="left" prop="fatherId" label="上级机构：">
					<w-select
						ref="fatherId"
						v-model="organDetails.fatherId"
						v-fx-tab="fatherIdTabHandler"
						:optionlist="parentOrganList"
						:disabled="disabled"
						class="form-item-input"
						@change="onFatherIdChange"
					>
					</w-select>
				</el-form-item>
				<el-form-item slot="right" label="所属区域：" class="form-item-region">
					<w-select
						ref="regionId"
						v-model="organDetails.regionId"
						v-fx-tab:focus.financeSortId
						:optionlist="regionSelectList"
						:disabled="regionDisabled||disabled"
						class="form-item-input"
					>
					</w-select>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item slot="left" prop="code" label="机构编号：">
					<w-input
						ref='code'
						v-model="organDetails.code"
						v-fx-tab:focus.name
						:maxlength="$fxCommon.getFxInputMaxLength('commonCode')"
						:regType="$fxCommon.getFxInputReg('commonCode')"
						:disabled="disabled||isShopOrRdc"
						placeholder="请输入"
						class="form-item-input fx-test-organ-code-input"
					></w-input>
				</el-form-item>
				<el-form-item slot="right" prop="name" label="机构名称：">
					<w-input
						ref='name'
						v-model="organDetails.name"
						v-fx-tab:focus.financeSortId
						:maxlength="100"
						:disabled="disabled||isShopOrRdc"
						placeholder="请输入"
						class="form-item-input"
						@blur="onOrganNameChange"
					/>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item slot="left" label="财务分类：" class="form-item-finance">
					<w-select
						ref="financeSortId"
						v-model="organDetails.financeSortId"
						v-fx-tab:focus.pinYin
						:optionlist="financialClassList"
						:disabled="disabled"
						clearable
						class="form-item-input"
					>
					</w-select>
					<w-icon v-fx-auth:basic-archives_support-archives_financial-class.add-financial type="add-round" class="form-input-add-btn" pointer @click="onAddFinancialClick"></w-icon>
				</el-form-item>
				<el-form-item slot="right" label="助记符：" prop="pinYin">
					<w-input
							ref="pinYin"
							v-model="organDetails.pinYin"
							v-fx-tab="pinYinTabHandler"
							:maxlength="50"
							:disabled="disabled"
							placeholder="请输入"
							class="form-item-input"
						/>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item slot="left" prop="enableFlag" label="启停状态：">
					<el-tooltip
						placement="top"
						class="subName"
						:content='enableSwitchDisableReason'
						:disabled="!enableSwitchDisableReason"
					>
						<w-switch
							ref="enableFlag"
							v-model="organDetails.enableFlag"
							v-fx-tab="enableFlagTabHandler"
							activeColor="blue"
							:active-value="1"
							:inactive-value="0"
							:inclusion="false"
							:width="40"
							:disabled="enableSwitchDisable"
						></w-switch>
					</el-tooltip>
				</el-form-item>
				<el-form-item v-if="isStore && realtimeStock" prop="stockFlag" slot="right" label="开启实时库存：">
					<w-switch
						ref="stockFlag"
						v-model="organDetails.stockFlag"
						v-fx-tab:loop.basic-archives_organ-manage_details.basicInfo
						activeColor="blue"
						:active-value="1"
						:inactive-value="0"
						:inclusion="false"
						:width="40"
						:disabled="disabled"
					></w-switch>
				</el-form-item>
				<el-form-item v-if="isShopOrRdc" prop="taxPlayerFlag" slot="right" label="计价方式：">
					<w-select
						ref="taxPlayerFlag"
						v-model="organDetails.taxPlayerFlag"
						v-fx-tab:focus.offsetFlag
						:optionlist="taxPlayerFlagSelectList"
						:disabled="disabled"
						class="form-item-input"
					>
					</w-select>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row v-if="isShopOrRdc">
				<el-form-item slot="left" prop="offsetFlag" label="参与冲减：">
					<w-switch
						ref="offsetFlag"
						v-model="organDetails.offsetFlag"
						v-fx-tab="offsetFlagTabHandler"
						activeColor="blue"
						:active-value="1"
						:inactive-value="0"
						:inclusion="false"
						:width="40"
						:disabled="disabled"
					></w-switch>
				</el-form-item>
				<el-form-item v-if="hasLocationModule" required slot="right" prop="enableLocation" label="开启货位管理：">
					<w-switch
						ref="enableLocation"
						v-model="organDetails.enableLocation"
						v-fx-tab="enableLocationTabHandler"
						activeColor="blue"
						:active-value="1"
						:inactive-value="0"
						:inclusion="false"
						:width="40"
						:disabled="disabled"
					></w-switch>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row v-if="isShopOrRdc && organDetails.enableLocation && hasLocationModule">
				<el-form-item required slot="left" prop="shelfFlag" label="开启上架管理：">
					<w-switch
						ref="shelfFlag"
						v-model="organDetails.shelfFlag"
						v-fx-tab:loop.basic-archives_organ-manage_details.basicInfo
						activeColor="blue"
						:active-value="1"
						:inactive-value="0"
						:inclusion="false"
						:width="40"
						:disabled="disabled"
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
		parentOrganList: {
			type: Array,
			default: () => {
				return []
			}
		},
		areaList: {
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
				fatherId: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				code: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				name: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				pinYin: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				accountingPeriod: [{ required: true, message: '该字段不能为空', trigger: 'no', validator: validateIgnore }],
				enableFlag: [{ required: true, trigger: 'no', validator: validateIgnore }],
				stockFlag: [{ required: true, trigger: 'no', validator: validateIgnore }],
				offsetFlag: [{ required: true, trigger: 'no', validator: validateIgnore }],
				taxPlayerFlag: [{ required: true, message: '该字段不能为空', trigger: 'no' }]
			},
			taxPlayerFlagSelectList: this.$fxTypeMiddleware.getCommonTypeList('taxPlayerType')
		}
	},
	computed: {
		...mapGetters(['detailsAuthGetter', 'getSysParams']),
		regionDisabled () {
			return this.$fxTypeMiddleware.getCommonTypeItemById('organType')(this.organDetails.organType).organLevel === '2'
		},
		regionSelectList () {
			return [{
				id: '',
				name: '无'
			}, ...this.areaList]
		},
		enableSwitchDisable () {
			return this.disabled || this.organDetails.returnFlag !== 0 || (this.organDetails.enableFlag && !this.detailsAuthGetter('basic-archives_organ-manage.disable-organ')) || (!this.organDetails.enableFlag && !this.detailsAuthGetter('basic-archives_organ-manage.enable-organ'))
		},
		isOrganType () {
			return (type) => {
				return this.$fxTypeMiddleware.isCommonType('organType')(type)(this.organDetails.organType)
			}
		},
		isShopOrRdc () {
			return this.isOrganType(['shop', 'rdc'])
		},
		isStore () {
			return this.isOrganType(['store'])
		},
		realtimeStock () {
			return this.getSysParams('XTGF_ITEM_STOCK', 'value')
		},
		enableSwitchDisableReason () {
			const disabledReasonList = {
				1: '当前机构已退货，无法启用',
				2: '当前机构开通时间已到期，无法启用'
			}
			return disabledReasonList[this.organDetails.returnFlag]
		},
		hasLocationModule () {
			return this.organDetails.subProductList.some(item => {
				return item.subProductCode === '620014'
			})
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
		onFatherIdChange (id) {
			const father = this.parentOrganList.find(item => {
				return item.id === id
			})
			if (father.organId) {
				this.organDetails.organId = father.organId || ''
				this.$fxApi('organ.getOrganDetails', father.organId).then(res => {
					this.organDetails.regionId = res.regionId || ''
				})
			}
		},
		onOrganNameChange (e) {
			const name = e.target.value
			if (!this.organDetails.pinYin) {
				const pinyin = this.$fxUtils.chinese2Pinyin(name, true)
				this.organDetails.pinYin = pinyin
			}
		},
		defaultFocus (refName = 'fatherId') {
			this.$fxUtils.vDoRefFocus(this, refName)
		},
		fatherIdTabHandler ({ focus }) {
			this.regionDisabled ? focus('code') : focus('regionId')
		},
		pinYinTabHandler ({ focus, loop }) {
			this.enableSwitchDisable
				? this.isShopOrRdc
					? focus('taxPlayerFlag')
					: loop('basic-archives_organ-manage_details', 'basicInfo')
				: focus('enableFlag')
		},
		enableFlagTabHandler ({ focus, loop }) {
			if (this.isShopOrRdc) {
				focus('taxPlayerFlag')
			} else if (this.isStore && this.realtimeStock) {
				focus('stockFlag')
			} else {
				loop('basic-archives_organ-manage_details', 'basicInfo')
			}
		},
		offsetFlagTabHandler ({ focus, loop }) {
			if (this.hasLocationModule) {
				focus('enableLocation')
			} else {
				loop('basic-archives_organ-manage_details', 'basicInfo')
			}
		},
		enableLocationTabHandler ({ focus, loop }) {
			if (this.organDetails.enableLocation) {
				focus('shelfFlag')
			} else {
				loop('basic-archives_organ-manage_details', 'basicInfo')
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
.form-item-finance, .form-item-region {
	>>>.el-form-item__label {
		padding-left:10px
	}
}
.no-margin-right{
	>>>.details-form-row__left{
		margin-right 10px
	}
}
</style>
