<template>
	<w-collapse ref="collapse" v-model="collapseVisible" disabled :showArrow="false" title="基础信息">
		<el-form ref="form" :model="organDetails" :rules="computedRules" :validate-on-rule-change="false" size="mini" label-width="100px" inline>
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
					v-fx-tab:focus.billBizType
					:maxlength="$fxCommon.getFxInputMaxLength('commonName')"
					:regType="$fxCommon.getFxInputReg('commonName')"
					:disabled="disabled && !hasParentBill && !isJsdOrder"
					class="form-item-input"
				></w-input>
			</el-form-item>
			<el-form-item prop="billType" label="单据类型：">
				<w-select
					v-model="organDetails.billType"
					class="form-item-input"
					disabled
					:optionlist="billCreateTypeList"
				>
				</w-select>
			</el-form-item>
			<el-form-item prop="billBizType.id" label="业务类型：">
				<w-select
					ref='billBizType'
					v-model="organDetails.billBizType.id"
					v-fx-tab="billBizTypeTabHandler"
					:optionlist="businessTypeSelectList"
					:clearable="!computedRules['billBizType.id']"
					:disabled="disabled && !hasParentBill && !isJsdOrder"
					class="form-item-input"
				>
				</w-select>
				<w-icon v-fx-auth:basic-archives_support-archives_bussiness-type.add-bussiness="!isChecked" type="add-round" class="form-input-add-btn" pointer @click="onAddBissnessTypeClick"></w-icon>
			</el-form-item>
			<el-form-item prop="businessDate" label="订货时间：">
				<w-date-picker
					ref="orderDate"
					v-model="organDetails.businessDate"
					v-fx-tab:focus.organ
					type="datetime"
					align="right"
					value-format="yyyy-MM-dd HH:mm:SS"
					format="yyyy-MM-dd HH:mm"
					placeholder="选择日期"
					:clearable="false"
					:disabled="disabled"
					class="form-item-input"
					@change="onOrderDateChange"
					@focus="onOrderDateFocus"
				></w-date-picker>
			</el-form-item>
			<el-form-item prop="organ.id" label="卖方机构：">
				<w-select-tab
					ref='organ'
					:value="organDetails.organ.id"
					v-fx-tab:focus.otherOrgan
					:optionlist="sellerSelectList"
					:disabled="disabled"
					class="form-item-input"
					@change="onOrganChange"
				></w-select-tab>
			</el-form-item>
			<el-form-item prop="otherOrgan.id" label="买方机构：">
				<w-select-tab
					ref='otherOrgan'
					:value="organDetails.otherOrgan.id"
					v-fx-tab:focus.stockPlan
					:optionlist="buyerSelectList"
					:disabled="disabled"
					class="form-item-input"
					@change="onOtherOrganChange"
				></w-select-tab>
			</el-form-item>
			<el-form-item prop="stockPlan.id" label="订货方案：">
				<w-select
					ref='stockPlan'
					:value="isAssign ? '' : organDetails.stockPlan.id"
					v-fx-tab:focus.carriageFee
					:optionlist="planSelectList"
					:disabled="disabled"
					:clearable="!computedRules['stockPlan.id']"
					class="form-item-input"
					@change="onPlanChange"
				>
				</w-select>
				<div v-show="currentPlan.limitFlag" class="form-item__plan-message fx-warn-font">
					<span>订货时间限制</span>
					<span>{{currentPlan.limitBeginTime}}-{{currentPlan.limitEndTime}}</span>
				</div>
			</el-form-item>
			<el-form-item prop="carriageFee" label="整单运费：">
				<w-input-number
					ref='carriageFee'
					v-model="organDetails.carriageFee"
					v-fx-tab:focus.operateMan
					:pointSize="sysMoneyPointSize"
					:disabled="disabled"
					class="form-item-input"
				></w-input-number>
			</el-form-item>
			<el-form-item prop="operateMan.id" label="经办人：">
				<w-select
					ref='operateMan'
					v-model="organDetails.operateMan.id"
					v-fx-tab="operateManTabHandler"
					:optionlist="agentSelectList"
					:disabled="disabled && !hasParentBill && !isJsdOrder"
					class="form-item-input"
				>
				</w-select>
			</el-form-item>
			<el-form-item label="采购加急：">
				<w-switch
					ref='urgent'
					class="form-item-input"
					v-model="organDetails.urgent"
					v-fx-tab:focus.memo
					active-color="red"
					inactive-color="green"
					active-text="加急"
					inactive-text="不加急"
					:width="65"
					:disabled="disabled"
					@change="onUrgentChange"
				>
				</w-switch>
			</el-form-item>
			<el-form-item prop="memo" label="备注：">
				<w-input
					ref='memo'
					v-model="organDetails.memo"
					v-fx-tab:loop.stock-sale-manage_sale-order_details.basicInfo
					:maxlength="$fxCommon.getFxInputMaxLength('memo')"
					:regType="$fxCommon.getFxInputReg('memo')"
					:disabled="disabled && !hasParentBill && !isJsdOrder"
					class="form-item-input-memo"
				></w-input>
			</el-form-item>
		</el-form>
		<bussinessTypeCreateDialog ref="bussinessTypeCreateDialog" @on-refresh="refreshBussinessTypeList"></bussinessTypeCreateDialog>
	</w-collapse>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import { apiName } from '../../Index.vue'
import bussinessTypeCreateDialog from '@/components/bussiness-type-manage/BussinessTypeCreateDialog.vue'
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
		agentSelectList: {
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
		planSelectList: {
			type: Array,
			default: () => {
				return []
			}
		},
		disabled: Boolean,
		dateChangeTriggerSave: Boolean
	},
	data () {
		return {
			collapseVisible: true,
			rules: {
				userBillCode: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				billType: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				orderDate: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				'organ.id': [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				'operateMan.id': [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				'otherOrgan.id': [{ required: true, message: '该字段不能为空', trigger: 'no' }]
			},
			isCommonTypeByRules: this.$fxTypeMiddleware.isCommonType('saleOrderGenerateType', 'rules')
		}
	},
	inject: ['$$orderParent'],
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize
		}),
		...mapGetters(['getOrderRequiredList']),
		isChecked () {
			return this.$fxStateMiddleware.isState('billState')(['checked'])(this.organDetails.billState)
		},
		currentPlan () {
			if (this.organDetails.stockPlan.id) {
				return this.planSelectList.find(item => {
					return item.id === this.organDetails.stockPlan.id
				}) || {}
			} else {
				return {}
			}
		},
		hasParentBill () {
			return !!this.organDetails.parentBill && this.$fxStateMiddleware.isState('billState')(['unSubmit'])(this.organDetails.billState)
		},
		isAssign () {
			return this.isCommonTypeByRules(['assign-sub'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		isJsdOrder () {
			return this.isCommonTypeByRules('jsd-sub')(this.organDetails.sourceType) && this.$fxStateMiddleware.isState('billState')(['unSubmit'])(this.organDetails.billState)
		},
		isHand () {
			return this.isCommonTypeByRules('hand')(this.organDetails.billType, this.organDetails.subBillType, this.organDetails)
		},
		computedRules () {
			if (this.isHand) {
				const orderRequiredList = this.getOrderRequiredList('SaleOrder', this.organDetails.billType, this.organDetails.organ.organType)
				const orderRequiredSettingRules = {}
				orderRequiredList.forEach(item => {
					orderRequiredSettingRules[item] = [{ required: true, message: '该字段不能为空', trigger: 'no' }]
				})
				return { ...this.rules, ...orderRequiredSettingRules }
			} else {
				return this.rules
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
		clearDetails () {
			const logger = this.$fxLogger.createInfo('stock-sale-manage.sale-order.clearDetails', { orderData: this.organDetails })
			return this.$fxApi(`${apiName}.clearDetails`, this.organDetails.id)({ logger }).then(() => {
				this.$emit('on-details-refresh')
				return Promise.resolve()
			})
		},
		onOrganChange (id, selectItem) {
			this.onOrganChangeConfirm('卖方').then(() => {
				this.$refs.form.clearValidate('stockPlan.id')
				this.organDetails.organ = selectItem
				this.organDetails.stockPlan.id = ''
				this.$emit('on-organ-change')
				if (this.organDetails.otherOrgan.id) { this.getPlanList() }
			})
		},
		onOrganChangeConfirm (name) {
			return new Promise(resolve => {
				if (this.tableDetails.length === 0) {
					resolve()
				} else {
					this.$fxConfirm(`该操作会清空明细数据，确定更换${name}机构？`).then(() => {
						this.clearDetails().then(resolve)
					}).catch(() => {})
				}
			})
		},
		onOtherOrganChange (id, selectItem) {
			this.onOrganChangeConfirm('买方').then(() => {
				if (Array.isArray(selectItem.contactList) && selectItem.contactList.length > 0) {
					const sendInfo = selectItem.contactList[0]
					this.organDetails.linkman = sendInfo.linkMan
					this.organDetails.phone = sendInfo.tel
					this.organDetails.deliveryAddr = sendInfo.location
				} else {
					this.organDetails.linkman = ''
					this.organDetails.phone = ''
					this.organDetails.deliveryAddr = ''
				}
				this.organDetails.otherOrgan = selectItem
				this.organDetails.stockPlan.id = ''
				this.$emit('on-other-organ-change')
				this.getPlanList()
			})
		},
		getPlanList () {
			const params = {
				orderDate: this.organDetails.businessDate,
				buyerOrganId: this.organDetails.otherOrgan.id,
				sellerOrganId: this.organDetails.organ.id,
				urgent: this.organDetails.urgent
			}
			return this.$fxApi(`${apiName}.getPlanList`)({ data: params }).then(res => {
				this.$emit('update:planSelectList', res)
				return Promise.resolve(res)
			})
		},
		onPlanChange (id, selectItem) {
			if (this.tableDetails.length > 0) {
				this.$fxConfirm('此操作会清空销售明细，确定更换订货方案？').then(() => {
					this.clearDetails()
					this.organDetails.stockPlan.id = id
				}).catch(() => {})
			} else {
				this.organDetails.stockPlan.id = id
			}
		},
		onAddBissnessTypeClick () {
			this.$refs.bussinessTypeCreateDialog.add('202')
		},
		refreshBussinessTypeList () {
			this.$emit('on-refresh-bussiness-type-list', this.organDetails)
		},
		onOrderDateChange (date) {
			if (this.$fxUtils.isEmptyObj(this.currentPlan)) {
				if (this.tableDetails.length > 0) {
					this.$emit('update:dateChangeTriggerSave', true)
					this.$fxConfirm('此操作会重新计算期望到货时间，确定更换订货时间？').then(() => {
						this.organDetails.businessDate = date
						this.$emit('on-order-save')
					}).catch(() => {
						this.$emit('update:dateChangeTriggerSave', false)
						this.organDetails.businessDate = this.$refs.orderDate.getOldValue()
					})
				} else {
					this.organDetails.businessDate = date
					!this.organDetails.otherOrgan.id || this.getPlanList()
				}
			} else {
				if (this.tableDetails.length > 0) {
					this.$fxConfirm('此操作会清空订货方案、买方机构、销售明细，确定更换订货时间？').then(() => {
						this.clearDetails().then(() => {
							this.organDetails.businessDate = date
							this.organDetails.otherOrgan = { id: '' }
							this.organDetails.stockPlan.id = ''
						})
					}).catch(() => {
						this.organDetails.businessDate = this.$refs.orderDate.getOldValue()
					})
				} else {
					this.organDetails.businessDate = date
					this.organDetails.stockPlan.id = ''
					this.getPlanList()
				}
			}
		},
		onOrderDateFocus () {
			setTimeout(() => {
				this.$$orderParent.$refs.detailsInfo.checkDetailsUnSaving().catch(() => {
					this.$refs.orderDate.hidePicker()
				})
			}, 100)
		},
		onUrgentChange (val) {
			if (!val && this.organDetails.stockPlan.id && this.tableDetails.length > 0) {
				this.$fxConfirm('此操作会清空订货方案、销售明细，确定切换加急状态？').then(this.clearDetails).then(() => {
					this.organDetails.urgent = 0
					this.organDetails.stockPlan.id = ''
					this.getPlanList()
				}).catch(() => {
					this.organDetails.urgent = 1
				})
			} else if (!val && this.organDetails.stockPlan.id) {
				this.$fxConfirm('此操作会清空订货方案，确定切换加急状态？').then(() => {
					this.organDetails.urgent = 0
					this.organDetails.stockPlan.id = ''
					this.getPlanList()
				}).catch(() => {
					this.organDetails.urgent = 1
				})
			} else if (this.organDetails.otherOrgan.id) {
				this.organDetails.urgent = val
				this.getPlanList()
			} else {
				this.organDetails.urgent = val
			}
		},
		defaultFocus (refName = 'userBillCode') {
			this.$fxUtils.vDoRefFocus(this, refName)
		},
		billBizTypeTabHandler ({ focus }) {
			this.hasParentBill ? focus('operateMan') : focus('orderDate')
		},
		operateManTabHandler ({ focus }) {
			this.hasParentBill ? focus('memo') : focus('urgent')
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
.form-item__plan-message {
	font-size: 10px;
  position: absolute;
  height: 16px;
  line-height: 16px;
	display: flex;
	width: 175px;
	justify-content: space-between;
}
</style>
