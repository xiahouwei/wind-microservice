<template>
	<w-collapse v-model="collapseVisible" disabled :showArrow="false">
		<div slot="title-slot" class="setting-title">{{settingTitle}}<span class="setting-tip">{{settingTip}}</span></div>
		<el-form v-if="!isCheckBill" ref="form" :model="organDetails" size="mini" label-width="100px" inline label-position="left">
			<el-form-item v-for="billType in currentBillTypes" :key="billType.id" :label="billType.name">
				<el-form-item label="配送中心单位：" class="unit-setting-content">
					<el-radio :disabled="disabled" v-model="organDetails.params[billType.id][0].customFlag" :label="true">全部</el-radio>
					<w-select
						v-model="organDetails.params[billType.id][0].unitId"
						clearable
						:disabled="disabled || !organDetails.params[billType.id][0].customFlag"
						:optionlist="computedUnitList"
						class="form-item-input"
					>
					</w-select>
					<el-radio :disabled="disabled" v-model="organDetails.params[billType.id][0].customFlag" :label="false" @change="(val) => onCustomFlagChange(val,organDetails.params[billType.id][0])">自定义</el-radio>
					<transition name="el-zoom-in-center">
						<el-button :disabled="disabled" type="primary" v-show="!organDetails.params[billType.id][0].customFlag" class="setting-btn" @click="onSettingClick(billType.id,1)">点击设置</el-button>
					</transition>
				</el-form-item>
				<el-form-item label="门店单位：" class="unit-setting-content">
					<el-radio :disabled="disabled" v-model="organDetails.params[billType.id][1].customFlag" :label="true">全部</el-radio>
					<w-select
						v-model="organDetails.params[billType.id][1].unitId"
						clearable
						:disabled="disabled || !organDetails.params[billType.id][1].customFlag"
						:optionlist="computedUnitList"
						class="form-item-input"
					>
					</w-select>
					<el-radio :disabled="disabled" v-model="organDetails.params[billType.id][1].customFlag" :label="false" @change="(val) => onCustomFlagChange(val,organDetails.params[billType.id][1])">自定义</el-radio>
					<transition name="el-zoom-in-center">
						<el-button :disabled="disabled" type="primary" v-show="!organDetails.params[billType.id][1].customFlag" class="setting-btn" @click="onSettingClick(billType.id,2)">点击设置</el-button>
					</transition>
				</el-form-item>
			</el-form-item>
		</el-form>
		<!-- 盘点单 -->
		<el-form v-else ref="checkBillForm" :model="organDetails" size="mini" label-width="140px" label-position="left">
			<el-form-item label="盘点单" label-width="100px">
				<el-form-item label="配送中心盘点设置：">
					<el-radio :disabled="disabled" v-model="organDetails.params[4001][0].setType" :label="1" @change="onCheckUnitSetTypeChange(organDetails.params[4001][0])">单单位盘点</el-radio>
					<el-radio :disabled="disabled" v-model="organDetails.params[4001][0].setType" :label="2" @change="onCheckUnitSetTypeChange(organDetails.params[4001][0])">双单位盘点</el-radio>
				</el-form-item>
			</el-form-item>
			<el-form-item label-width="100px">
				<el-form-item label="配送中心单位：" prop="params[4001][0].customFlag" :rules="rules.checkBillRdcUnit" class="unit-setting-content">
					<el-radio :disabled="disabled" v-model="organDetails.params[4001][0].customFlag" :label="true">全部</el-radio>
					<w-select
						v-model="organDetails.params[4001][0].unitIdBig"
						clearable
						placeholder="请选择大单位"
						:disabled="disabled || !organDetails.params[4001][0].customFlag"
						:optionlist="computedBigUnitList(organDetails.params[4001][0].unitIdSmall, organDetails.params[4001][0].setType)"
						class="form-item-input"
					>
					</w-select>
					<w-select
						v-model="organDetails.params[4001][0].unitIdSmall"
						clearable
						placeholder="请选择小单位"
						:disabled="disabled || !organDetails.params[4001][0].customFlag || organDetails.params[4001][0].setType === 1"
						:optionlist="computedSmallUnitList(organDetails.params[4001][0].unitIdBig)"
						class="form-item-input"
					>
					</w-select>
					<el-radio :disabled="disabled" v-model="organDetails.params[4001][0].customFlag" :label="false" @change="(val) => onCustomFlagChange(val,organDetails.params[4001][0])">自定义</el-radio>
					<transition name="el-zoom-in-center">
						<el-button :disabled="disabled" type="primary" v-show="!organDetails.params[4001][0].customFlag" class="setting-btn" @click="onSettingClick(4001,1,organDetails.params[4001][0].setType)">点击设置</el-button>
					</transition>
				</el-form-item>
			</el-form-item>
			<el-form-item label-width="100px">
				<el-form-item label="门店盘点设置：">
					<el-radio :disabled="disabled" v-model="organDetails.params[4001][1].setType" :label="1" @change="onCheckUnitSetTypeChange(organDetails.params[4001][1])">单单位盘点</el-radio>
					<el-radio :disabled="disabled" v-model="organDetails.params[4001][1].setType" :label="2" @change="onCheckUnitSetTypeChange(organDetails.params[4001][1])">双单位盘点</el-radio>
				</el-form-item>
			</el-form-item>
			<el-form-item label-width="100px">
				<el-form-item label="门店单位：" prop="params[4001][1].customFlag" :rules="rules.checkBillShopUnit">
					<el-radio :disabled="disabled" v-model="organDetails.params[4001][1].customFlag" :label="true">全部</el-radio>
					<w-select
						v-model="organDetails.params[4001][1].unitIdBig"
						clearable
						placeholder="请选择大单位"
						:disabled="disabled || !organDetails.params[4001][1].customFlag"
						:optionlist="computedBigUnitList(organDetails.params[4001][1].unitIdSmall, organDetails.params[4001][1].setType)"
						class="form-item-input"
					>
					</w-select>
					<w-select
						v-model="organDetails.params[4001][1].unitIdSmall"
						clearable
						placeholder="请选择小单位"
						:disabled="disabled || !organDetails.params[4001][1].customFlag || organDetails.params[4001][1].setType === 1"
						:optionlist="computedSmallUnitList(organDetails.params[4001][1].unitIdBig)"
						class="form-item-input"
					>
					</w-select>
					<el-radio :disabled="disabled" v-model="organDetails.params[4001][1].customFlag" :label="false" @change="(val) => onCustomFlagChange(val,organDetails.params[4001][1])">自定义</el-radio>
					<transition name="el-zoom-in-center">
						<el-button :disabled="disabled" type="primary" v-show="!organDetails.params[4001][1].customFlag" class="setting-btn" @click="onSettingClick(4001,2,organDetails.params[4001][1].setType)">点击设置</el-button>
					</transition>
				</el-form-item>
			</el-form-item>
			<el-form-item label-width="100px">
				<div class="check-bill-tip">温馨提示：1.盘点小单位必须选择换算系数小于等于盘点大单位换算系数的单位/或者选择最小单位；2.双单位盘点：大单位不允许选择最小单位；</div>
			</el-form-item>
		</el-form>
	</w-collapse>
</template>
<script>
export default {
	name: 'settingInfo',
	props: {
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		disabled: Boolean,
		unitList: {
			type: Array,
			default: () => {
				return []
			}
		},
		billClass: String
	},
	data () {
		return {
			collapseVisible: true,
			billClassList: this.$fxTypeMiddleware.getCommonTypeList('unitSettingBillClassList'),
			rules: {
				checkBillRdcUnit: [{ validator: this.checkBillRdcUnitValidate, trigger: 'no' }],
				checkBillShopUnit: [{ validator: this.checkBillShopUnitValidate, trigger: 'no' }]
			}
		}
	},
	computed: {
		settingTitle () {
			return '设置' + this.currentBillClass.name
		},
		settingTip () {
			if (['InStore', 'OutStore', 'CheckBill'].includes(this.billClass)) {
				return `不允许设置辅助单位为${this.currentBillClass.name.slice(0, 2)}单位`
			} else {
				return ''
			}
		},
		currentBillClass () {
			return this.billClassList.find(item => item.id === this.billClass)
		},
		currentBillTypes () {
			return this.currentBillClass.billtype
		},
		computedUnitList () {
			if (['InStore', 'OutStore'].includes(this.billClass)) {
				return this.unitList.filter(unit => {
					return !unit.assistFlag
				})
			} else {
				return this.unitList
			}
		},
		computedBigUnitList () {
			return (unitIdSmall, setType) => {
				if (unitIdSmall) {
					const unitSmall = this.unitList.find(unit => unit.id === unitIdSmall)
					return this.unitList.filter(unit => {
						return unit.ratio >= unitSmall.ratio && !unit.assistFlag && unit.id !== unitIdSmall && !unit.mainFlag
					})
				} else if (setType === 1) {
					return this.unitList.filter(unit => {
						return !unit.assistFlag
					})
				} else {
					return this.unitList.filter(unit => {
						return !unit.assistFlag && !unit.mainFlag
					})
				}
			}
		},
		computedSmallUnitList () {
			return (unitIdBig) => {
				if (unitIdBig) {
					const unitBig = this.unitList.find(unit => unit.id === unitIdBig)
					return this.unitList.filter(unit => {
						return unit.ratio <= unitBig.ratio && !unit.assistFlag && unit.id !== unitIdBig
					})
				} else {
					return this.unitList.filter(unit => {
						return !unit.assistFlag
					})
				}
			}
		},
		isCheckBill () {
			return this.billClass === 'CheckBill'
		}
	},
	methods: {
		validate () {
			return new Promise(resolve => {
				if (!this.isCheckBill) {
					resolve()
				} else {
					return this.$refs.checkBillForm.validate().then(() => {
						resolve()
					}).catch(() => {
						this.$fxMessage.warning('请按要求选择单位')
					})
				}
			})
		},
		onCustomFlagChange (val, data) {
			if (!val) {
				data.unitId = ''
				if (this.isCheckBill) {
					data.unitIdBig = ''
					data.unitIdSmall = ''
				}
			}
		},
		onCheckUnitSetTypeChange (data) {
			data.unitIdSmall = ''
			data.unitIdBig = ''
		},
		onSettingClick (billType, organType, setType = null) {
			this.$emit('on-setting-click', billType, organType, setType)
		},
		checkBillRdcUnitValidate (rule, value, callback) {
			if (!this.organDetails.params[4001][0].customFlag) {
				callback()
			} else {
				if (this.organDetails.params[4001][0].setType === 2 && ((!this.organDetails.params[4001][0].unitIdBig && this.organDetails.params[4001][0].unitIdSmall) || (this.organDetails.params[4001][0].unitIdBig && !this.organDetails.params[4001][0].unitIdSmall))) {
					callback(new Error('请选择盘点大单位/盘点小单位'))
				} else {
					callback()
				}
			}
		},
		checkBillShopUnitValidate (rule, value, callback) {
			if (!this.organDetails.params[4001][1].customFlag) {
				callback()
			} else {
				if (this.organDetails.params[4001][1].setType === 2 && ((!this.organDetails.params[4001][1].unitIdBig && this.organDetails.params[4001][1].unitIdSmall) || (this.organDetails.params[4001][1].unitIdBig && !this.organDetails.params[4001][1].unitIdSmall))) {
					callback(new Error('请选择盘点大单位/盘点小单位'))
				} else {
					callback()
				}
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.setting-title {
	font-size 14px
	margin-left 20px
}
.setting-tip {
	font-size 12px
	color $fxRed
	margin-left 30px
}
.form-item-input {
	width: 150px
	box-sizing: border-box
	margin-right 20px
}
.setting-btn {
	position absolute
}
.unit-setting-content {
	padding-right 120px
}
.check-bill-tip {
	font-size 12px
	color $fxRed
}
</style>
