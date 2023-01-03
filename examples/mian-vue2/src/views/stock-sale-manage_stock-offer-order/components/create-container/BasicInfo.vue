<template>
	<w-collapse ref="collapse" v-model="collapseVisible" disabled :showArrow="false" title="基础信息">
		<el-form ref="form" :model="organDetails" :rules="rules" :validate-on-rule-change="false" size="mini" label-width="100px" inline>
			<el-form-item label="系统单号：">
				<w-input
					v-model="organDetails.sysBillCode"
					disabled
					class="form-item-input"
				></w-input>
			</el-form-item>
			<el-form-item prop="userBillCode" label="手工单号：">
				<w-input
					ref='userBillCode'
					v-model="organDetails.userBillCode"
					v-fx-tab:focus.operateMan
					:disabled="disabled"
					:maxlength="$fxCommon.getFxInputMaxLength('commonName')"
					:regType="$fxCommon.getFxInputReg('commonName')"
					class="form-item-input"
				></w-input>
			</el-form-item>
			<el-form-item prop="billType" label="单据类型：">
				<w-select
					v-model="organDetails.billType"
					:optionlist="billCreateTypeList"
					disabled
					class="form-item-input"
				>
				</w-select>
			</el-form-item>
			<!-- <el-form-item prop="billBizType.id" label="业务类型：">
				<w-select
					ref='billBizType'
					v-model="organDetails.billBizType.id"
					v-fx-tab:focus.organ
					:disabled="disabled"
					:optionlist="businessTypeSelectList"
					:clearable="!computedRules['billBizType.id']"
					class="form-item-input"
				>
				</w-select>
				<w-icon v-fx-auth:basic-archives_support-archives_bussiness-type.add-bussiness="!isChecked" type="add-round" class="form-input-add-btn" pointer @click="onAddBissnessTypeClick"></w-icon>
			</el-form-item> -->
			<el-form-item prop="organ.id" label="买方机构：">
				<w-select-tab
					ref='organ'
					:value="organDetails.organ.id"
					v-fx-tab:focus.otherOrgan
					:disabled="disabled || hasParentBill"
					:optionlist="buyerSelectList"
					class="form-item-input"
					@change="onOrganChange"
				></w-select-tab>
			</el-form-item>
      <el-form-item prop="otherOrgan.id" label="卖方机构：">
				<w-select-tab
					ref='otherOrgan'
					:value="organDetails.otherOrgan.id"
					v-fx-tab:focus.operateMan
					:disabled="disabled || hasParentBill"
					:optionlist="sellerSelectList"
					class="form-item-input"
					@change="onOtherOrganChange"
				></w-select-tab>
			</el-form-item>
			<el-form-item prop="operateMan.id" label="经办人：">
				<w-select
					ref='operateMan'
					v-model="organDetails.operateMan.id"
					v-fx-tab:focus.beginDate
					:optionlist="agentSelectList"
					:disabled="disabled"
					class="form-item-input"
				>
				</w-select>
			</el-form-item>
			<el-form-item prop="beginDate" label="生效时间：">
				<w-date-picker
					ref="beginDate"
					v-model="organDetails.beginDate"
					v-fx-tab:focus.endDate
					type="datetime"
					align="right"
					value-format="yyyy-MM-dd HH:mm:ss"
					format="yyyy-MM-dd HH:mm:ss"
					placeholder="选择日期"
					:clearable="false"
					:disabled="disabled"
					class="form-item-input"
					@change="onBeginDateChange"
					@focus="onBeginDateFocus"
				></w-date-picker>
			</el-form-item>
			<el-form-item prop="endDate" label="失效时间：">
				<w-date-picker
					ref="endDate"
					v-model="organDetails.endDate"
					v-fx-tab:focus.memo
					type="datetime"
					align="right"
					value-format="yyyy-MM-dd HH:mm:ss"
					format="yyyy-MM-dd HH:mm:ss"
					placeholder="选择日期"
					:clearable="false"
					:disabled="disabled"
					class="form-item-input"
					@change="onEndDateChange"
					@focus="onEndDateFocus"
				></w-date-picker>
			</el-form-item>
			<el-form-item prop="memo" label="备注：">
				<w-input
					ref='memo'
					v-model="organDetails.memo"
					v-fx-tab:loop.stock-sale-manage_stock-offer-order_details.basicInfo
					:maxlength="$fxCommon.getFxInputMaxLength('memo')"
					:regType="$fxCommon.getFxInputReg('memo')"
					:disabled="disabled"
					class="form-item-input-memo"
				></w-input>
			</el-form-item>
		</el-form>
		<bussinessTypeCreateDialog ref="bussinessTypeCreateDialog" @on-refresh="refreshBussinessTypeList"></bussinessTypeCreateDialog>
	</w-collapse>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import bussinessTypeCreateDialog from '@/components/bussiness-type-manage/BussinessTypeCreateDialog.vue'
import { apiName } from '../../Index.vue'
export default {
	name: 'basicInfo',
	components: {
		bussinessTypeCreateDialog
	},
	props: {
		isFullScreen: Boolean,
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		tableDetails: {
			type: Array,
			default: () => {
				return []
			}
		},
		businessTypeSelectList: {
			type: Array,
			default: () => {
				return []
			}
		},
		billCreateTypeList: {
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
		sellerSelectList: {
			type: Array,
			default: () => {
				return []
			}
		},
		agentSelectList: {
			type: Array,
			default: () => {
				return []
			}
		},
		disabled: Boolean
	},
	data () {
		return {
			collapseVisible: true,
			isCommonTypeByRules: this.$fxTypeMiddleware.isCommonType('stockOfferOrderGenerateType', 'rules'),
			rules: {
				userBillCode: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				billType: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				beginDate: [{ required: true, trigger: 'no', validator: this.validateDate }],
				endDate: [{ required: true, trigger: 'no', validator: this.validateDate }],
				'organ.id': [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				'otherOrgan.id': [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				'operateMan.id': [{ required: true, message: '该字段不能为空', trigger: 'no' }]
			}
		}
	},
	inject: ['$$orderParent'],
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize
		}),
		...mapGetters(['detailsAuthGetter']),
		isUrgentStockDisable () {
			return !this.detailsAuthGetter('stock-sale-manage_stock-offer-order.urgent-stock')
		},
		hasParentBill () {
			return !!this.organDetails.parentBill
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
			return new Promise(resolve => {
				this.$refs.form.validate().then(() => {
					if (this.organDetails.otherOrgan.id === this.organDetails.organ.id) {
						this.$fxMessage.warning('买方机构与卖方机构不能相同')
					} else {
						resolve()
					}
				})
			})
		},
		validateDate (rule, value, callback) {
			const dateResult = this.$fxUtils.compareDate(this.organDetails.endDate, this.organDetails.beginDate)
			if (!value) {
				callback(new Error('该字段不能为空'))
			} else if (!dateResult) {
				callback(new Error('生效时间不能大于失效时间'))
			} else {
				callback()
			}
		},
		clearDetails () {
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-offer-order.clearDetails', { orderData: this.organDetails })
			return this.$fxApi(`${apiName}.clearDetails`, this.organDetails.id)({ logger }).then(() => {
				this.$emit('on-details-refresh')
				return Promise.resolve()
			})
		},
		onOrganChange (id, selectItem) {
			this.onOrganChangeConfirm('买方').then(() => {
				this.organDetails.organ = selectItem
				this.$emit('on-organ-change')
			})
		},
		onOtherOrganChange (id, selectItem) {
			this.onOrganChangeConfirm('卖方').then(() => {
				this.organDetails.otherOrganId = id
				this.$emit('on-other-organ-change')
			})
		},
		onOrganChangeConfirm (name) {
			return new Promise(resolve => {
				if (this.tableDetails.length === 0) {
					resolve()
				} else {
					this.$fxConfirm(`该操作会清空明细数据，确定更换${name}机构？`).then(() => {
						this.clearDetails().then(resolve)
					})
				}
			})
		},
		onAddBissnessTypeClick () {
			this.$refs.bussinessTypeCreateDialog.add('200')
		},
		refreshBussinessTypeList () {
			this.$emit('on-refresh-bussiness-type-list', this.organDetails)
		},
		onBeginDateChange (date) {
			this.organDetails.beginDate = date
		},
		onBeginDateFocus () {
			// setTimeout(() => {
			// 	this.$$orderParent.$refs.detailsInfo.checkDetailsUnSaving().catch(() => {
			// 		this.$refs.beginDate.hidePicker()
			// 	})
			// }, 100)
		},
		onEndDateChange (date) {
			this.organDetails.endDate = date
		},
		onEndDateFocus () {
			// setTimeout(() => {
			// 	this.$$orderParent.$refs.detailsInfo.checkDetailsUnSaving().catch(() => {
			// 		this.$refs.endDate.hidePicker()
			// 	})
			// }, 100)
		},
		defaultFocus (refName = 'userBillCode') {
			this.$fxUtils.vDoRefFocus(this, refName)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-item-input {
	width: 175px
}
.form-item-input-memo {
	width: 460px
}
.form-switch-input {
	width: 275px
}
.form-input-add-btn {
	position: absolute
	top: 3px
	right: -25px
}
</style>
