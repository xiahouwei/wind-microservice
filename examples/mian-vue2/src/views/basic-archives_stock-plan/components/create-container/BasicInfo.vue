<template>
	<w-collapse ref="collapse" v-model="collapseVisible" disabled :showArrow="false" title="基础信息">
		<el-form ref="form" :model="organDetails" :rules="rules" size="mini" label-width="100px" inline>
				<el-form-item prop="code" label="方案编号：">
					<w-input
						v-model="organDetails.code"
						:maxlength="$fxCommon.getFxInputMaxLength('commonCode')"
						:regType="$fxCommon.getFxInputReg('commonCode')"
						class="form-item-input"
						disabled
					></w-input>
				</el-form-item>
				<el-form-item prop="name" label="方案名称：">
					<w-input
						ref='name'
						v-model="organDetails.name"
						v-fx-tab:focus.beginDate
						:maxlength="$fxCommon.getFxInputMaxLength('commonName')"
						:regType="$fxCommon.getFxInputReg('commonName')"
						class="form-item-input"
						:disabled="disabled"
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
						class="form-item-input"
						@change="onBeginDateChange"
						:disabled="disabled"
					>
					</el-date-picker>
				</el-form-item>
				<el-form-item prop="endDate" label="截止日期：">
					<el-date-picker
						ref="endDate"
						v-model="organDetails.endDate"
						v-fx-tab="endDateTabHandler"
						type="date"
						value-format="yyyy-MM-dd"
						placeholder="选择日期"
						class="form-item-input"
						@change="onEndDateChange"
						:disabled="disabled"
					>
					</el-date-picker>
				</el-form-item>
				<el-form-item prop="limitFlag" label="订货时间：" class="stock-time">
					<div class="stock-time-container">
						<el-radio v-model="organDetails.limitFlag" :label="0" :disabled="disabled">不限制</el-radio>
						<el-radio v-model="organDetails.limitFlag" :label="1" :disabled="disabled">限制订货时间</el-radio>
						<el-time-picker
							ref="limitBeginTime"
							v-model="organDetails.limitBeginTime"
							v-fx-tab:focus.limitEndTime
							placeholder="选择时间"
							:disabled='!organDetails.limitFlag || disabled'
							size='mini'
							class="time-picker"
							format='HH:mm'
							value-format="HH:mm:ss"
							:clearable=false
						>
						</el-time-picker>
						<span class='time-to'>至</span>
						<el-time-picker
							ref="limitEndTime"
							v-model="organDetails.limitEndTime"
							v-fx-tab:focus.organIds
							placeholder="选择时间"
							:disabled='!organDetails.limitFlag || disabled'
							size='mini'
							class="time-picker"
							format='HH:mm'
							value-format="HH:mm:ss"
							:clearable=false
						>
						</el-time-picker>
					</div>
				</el-form-item>
				<el-form-item prop="organIds" label="买方机构：">
					<w-select-tab-mulity
						ref="organIds"
						v-model="organDetails.organIds"
						v-fx-tab="organIdsTabHandler"
						:optionlist="buyerTabSelectList"
						:disabled="disabled"
						:canCloseTag="!isPlanUsed"
						:clearable="!isPlanUsed"
						:showUnselectAllBtn="!isPlanUsed"
						class="form-item-input-buyer"
						@change="onOrganChange"
					>
					</w-select-tab-mulity>
					<w-link @click="onSettingBuyerClick">{{settingBuyerText}}</w-link>
				</el-form-item>
				<el-form-item prop="enableFlag" label="启停状态：">
					<w-switch
						ref="enableFlag"
						class="form-item-input"
						v-model="organDetails.enableFlag"
						v-fx-tab:focus.memo
						:active-value="1"
						:inactive-value="0"
						:disabled="enableSwitchDisable"
						:inclusion="false"
						:width="40"
					></w-switch>
				</el-form-item>
				<el-form-item label="备注：" class="form-item-memo">
					<w-input
						ref="memo"
						v-model="organDetails.memo"
						v-fx-tab:loop.basic-archives_stock-plan_details.basicInfo
						:maxlength="$fxCommon.getFxInputMaxLength('memo')"
						:regType="$fxCommon.getFxInputReg('memo')"
						class="form-item-input-full"
						:disabled="disabled"
					></w-input>
				</el-form-item>
		</el-form>
		<settingBuyer
			ref="setttingBuyer"
			:disabled="disabled"
			:listData="buyerSelectList"
			:selectedBuyer="organDetails.organIds"
			@on-save-click="onSaveSettingBuyer"
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
		organType: String,
		organDetails: {
			type: Object,
			default: () => {
				return {}
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
		disabled: Boolean
	},
	data () {
		const validateIgnore = (rule, value, callback) => {
			callback()
		}
		return {
			switchName: '1',
			collapseVisible: true,
			rules: {
				code: [{ required: true, message: '该字段不能为空', trigger: 'no', validator: this.validatePass }],
				name: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				beginDate: [{ required: true, validator: this.validateDate, trigger: 'no' }],
				endDate: [{ required: true, validator: this.validateDate, trigger: 'no' }],
				limitFlag: [{ required: true, trigger: 'no' }],
				organIds: [{ required: true, trigger: 'no', validator: this.validateBuyers }],
				enableFlag: [{ required: true, message: '该字段不能为空', trigger: 'no', validator: validateIgnore }]
			}
		}
	},
	watch: {
		isFullScreen (val) {
			if (!val) {
				this.$nextTick(() => this.$refs.collapse.resize())
			}
		}
	},
	computed: {
		...mapGetters(['detailsAuthGetter']),
		enableSwitchDisable () {
			return this.disabled || (this.organDetails.enableFlag && !this.detailsAuthGetter('stock-sale-manage_stock-plan.disable-stock')) || (!this.organDetails.enableFlag && !this.detailsAuthGetter('stock-sale-manage_stock-plan.enable-stock'))
		},
		settingBuyerText () {
			return this.disabled ? '点击查看' : '点击设置'
		},
		isPlanUsed () {
			return !!this.organDetails.useFlag
		}
	},
	methods: {
		onBeginDateChange (item) {
			this.organDetails.beginDate = `${item} 00:00:00`
		},
		onEndDateChange (item) {
			this.organDetails.endDate = `${item} 23:59:59`
		},
		validate () {
			return this.$refs.form.validate()
		},
		validatePass (rule, value, callback) {
			callback()
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
		validateBuyers (rule, value, callback) {
			if (value.length) {
				callback()
			} else {
				callback(new Error('请选择买方机构'))
			}
		},
		onSettingBuyerClick () {
			this.$refs.setttingBuyer.open()
		},
		onOrganChange (ids) {
			this.organDetails.buyers = this.buyerSelectList.filter(item => {
				return ids.includes(item.id)
			}).map(item => {
				return {
					buyerOrgan: item.id,
					useFlag: item.useFlag || 0
				}
			})
		},
		onSaveSettingBuyer (ids) {
			this.organDetails.organIds = ids
			this.organDetails.buyers = this.buyerSelectList.filter(item => {
				return ids.includes(item.id)
			}).map(item => {
				return {
					buyerOrgan: item.id,
					useFlag: item.useFlag || 0
				}
			})
		},
		getOrganNames (id) {
			return this.$fxUtils.getSelectMulityById(id, this.buyerSelectList).map(item => item.name).join(',')
		},
		defaultFocus (refName = 'name') {
			this.$fxUtils.vDoRefFocus(this, refName)
		},
		endDateTabHandler ({ focus }) {
			this.organDetails.limitFlag === 1 ? focus('limitBeginTime') : focus('organIds')
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
	width: 217px
}
.stock-time{
	/deep/.el-radio {
	}
	.time-picker{
		width 130px
	}
	.urgent-switch{
		margin-left 30px
	}
}
.form-item-input-full {
	width:660px
}
.form-item-memo {
	>>>.el-form-item__label {
		padding-left:10px
	}
}
.time-to{
	font-size 12px
	padding 0 20px
}
/deep/ .el-switch {
    position: relative;
    height: 24px;
    line-height: 24px;
    &.is-checked {
      .el-switch__core {
        background: #179bff;
        &:after {
          margin-left: -22px;
        }
      }
    }
    .el-switch__label,
    .el-switch__core {
      height: 24px;
    }
    .el-switch__core {
      border-radius: 12px;
      border: none;
      background: #f1f1f1;
      &:after {
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.3);
        width: 22px;
        height: 22px;
      }
    }
    .el-switch__label.is-active {
      color: #333;
    }
    .el-switch__label--right {
      margin-left: 0px;
      &.is-active {
        color: #fff;
        right: 24px;
      }
      position: absolute;
      right: 5px;
      top: -1px;
      color: #999;
      > span {
        font-size: 12px;
      }
    }
  }
.stock-time-container {
	width 660px
}
</style>


