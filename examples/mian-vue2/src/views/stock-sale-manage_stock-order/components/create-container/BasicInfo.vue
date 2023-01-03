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
					v-fx-tab:focus.billBizTypeId
					:maxlength="$fxCommon.getFxInputMaxLength('commonName')"
					:regType="$fxCommon.getFxInputReg('commonName')"
					:disabled="disabled && !isAssign"
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
			<el-form-item prop="billBizTypeId" label="业务类型：">
				<w-select
					ref='billBizTypeId'
					v-model="organDetails.billBizTypeId"
					v-fx-tab="billBizTypeIdTabHandler"
					:optionlist="businessTypeSelectList"
					:clearable="!computedRules['billBizTypeId']"
					:disabled="disabled && !isAssign"
					class="form-item-input"
				>
				</w-select>
				<w-icon v-fx-auth:basic-archives_support-archives_bussiness-type.add-bussiness="!isChecked" type="add-round" class="form-input-add-btn" pointer @click="onAddBissnessTypeClick"></w-icon>
			</el-form-item>
			<el-form-item prop="orderDate" label="订货时间：">
				<w-date-picker
					ref="orderDate"
					v-model="organDetails.orderDate"
					v-fx-tab:focus.organ
					type="datetime"
					align="right"
					value-format="yyyy-MM-dd HH:mm"
					format="yyyy-MM-dd HH:mm"
					placeholder="选择日期"
					:clearable="false"
					:disabled="disabled"
					class="form-item-input"
					@change="onOrderDateChange"
					@focus="onOrderDateFocus"
				></w-date-picker>
			</el-form-item>
			<el-form-item prop="organ.id" label="买方机构：">
				<w-select-tab
					ref='organ'
					v-fx-tab:focus.singleHouse
					:value="organDetails.organ.id"
					:optionlist="buyerSelectList"
					:disabled="disabled"
					class="form-item-input"
					@change="onOrganChange"
				></w-select-tab>
			</el-form-item>
			<el-form-item label="入库方式：">
				<w-switch
					ref='singleHouse'
					class="form-item-input"
					:value="organDetails.singleHouse"
					v-fx-tab="singleHouseTabHandler"
					active-color="blue"
					inactive-color="green"
					active-text="单仓入库"
					inactive-text="多仓入库"
					:width="80"
					:disabled="disabled"
					@change="onSingleHouseChange"
				>
				</w-switch>
			</el-form-item>
			<el-form-item prop="inHouse" label="买方仓库：">
				<w-select
					ref='inHouse'
					:value="organDetails.inHouse"
					v-fx-tab:focus.operator
					:optionlist="storeSelectList"
					:disabled="disabled || !isSingleHouse"
					:placeholder="inHousePlaceholder"
					class="form-item-input"
					dropdownWidth='300px'
					:optionRender='optionRender'
					@change="onChangeInHouse"
				>
				</w-select>
			</el-form-item>
			<el-form-item prop="operator" label="经办人：">
				<w-select
					ref='operator'
					v-model="organDetails.operator"
					v-fx-tab="operatorTabHandler"
					:optionlist="agentSelectList"
					:disabled="disabled && !isAssign"
					class="form-item-input"
				>
				</w-select>
			</el-form-item>
			<el-form-item prop="otherOrganId" label="卖方机构：">
				<w-select-tab
					ref='otherOrganId'
					:value="organDetails.otherOrganId"
					v-fx-tab:focus.purchasePlan
					:optionlist="sellerSelectList"
					:disabled="disabled"
					class="form-item-input"
					@change="onOtherOrganChange"
				></w-select-tab>
			</el-form-item>
			<el-form-item prop="purchasePlan" label="订货方案：">
				<w-select
					ref='purchasePlan'
					:value="isAssignCross ? '' : organDetails.purchasePlan"
					v-fx-tab:focus.carriageFee
					:optionlist="planSelectList"
					:disabled="disabled"
					:clearable="!computedRules['purchasePlan']"
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
					v-fx-tab:focus.urgent
					:pointSize="sysMoneyPointSize"
					:disabled="disabled"
					class="form-item-input"
				></w-input-number>
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
					v-fx-tab:loop.stock-sale-manage_stock-order_details.basicInfo
					:maxlength="$fxCommon.getFxInputMaxLength('memo')"
					:regType="$fxCommon.getFxInputReg('memo')"
					:disabled="disabled && !isAssign"
					class="form-item-input-memo"
				></w-input>
			</el-form-item>
		</el-form>
		<bussinessTypeCreateDialog ref="bussinessTypeCreateDialog" @on-refresh="refreshBussinessTypeList"></bussinessTypeCreateDialog>
	</w-collapse>
</template>
<script>
import { apiName } from '../../Index.vue'
import { mapState, mapGetters } from 'vuex'
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
		billCreateTypeList: {
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
		buyerSelectList: {
			type: Array,
			default: () => {
				return []
			}
		},
		storeSelectList: {
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
				inHouse: [{ required: true, trigger: 'no', validator: this.validateInHouse }],
				operator: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				otherOrganId: [{ required: true, message: '该字段不能为空', trigger: 'no' }]
			},
			isCommonTypeByRules: this.$fxTypeMiddleware.isCommonType('stockOrderGenerateType', 'rules')
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
		isSingleHouse () {
			return this.organDetails.singleHouse === 1
		},
		inHousePlaceholder () {
			return this.isSingleHouse ? '请选择' : '请在明细中选择'
		},
		currentPlan () {
			if (this.organDetails.purchasePlan) {
				return this.planSelectList.find(item => {
					return item.id === this.organDetails.purchasePlan
				}) || {}
			} else {
				return {}
			}
		},
		isAssign () {
			return this.isCommonTypeByRules(['assignCross-sub', 'assignStockPlan-sub'])(this.organDetails.billType, this.organDetails.subBillType) && this.$fxStateMiddleware.isState('billState')(['unSubmit'])(this.organDetails.billState)
		},
		isAssignCross () {
			return this.isCommonTypeByRules(['assignCross-sub'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		isHand () {
			return this.isCommonTypeByRules('hand')(this.organDetails.billType, this.organDetails.subBillType, this.organDetails)
		},
		computedRules () {
			if (this.isHand) {
				const otherOrganType = this.$fxUtils.getSelectTagById(this.organDetails.otherOrganId, this.sellerSelectList).organType
				const orderRequiredList = this.getOrderRequiredList('StockOrder', this.organDetails.billType, otherOrganType)
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
					if (this.organDetails.otherOrganId === this.organDetails.organ.id) {
						this.$fxMessage.warning('买方机构与卖方机构不能相同')
					} else {
						resolve()
					}
				})
			})
		},
		clearDetails () {
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-order.clearDetails', { orderData: this.organDetails })
			return this.$fxApi(`${apiName}.clearDetails`, this.organDetails.id)({ logger }).then(() => {
				this.$emit('on-details-refresh')
				return Promise.resolve()
			})
		},
		optionRender (h, { item }) {
			h = this.$createElement
			return <div class="fx-common__cell-select__option fx-ellipsis">
				<span class="fx-common__cell-select__option-left fx-ellipsis" title={item.code}>{ item.code }</span>
				<span class="fx-common__cell-select__option-right fx-ellipsis" title={item.name}>{ item.name }</span>
			</div>
		},
		onOrganChange (id, selectItem) {
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
				this.organDetails.organ = selectItem
				this.organDetails.inHouse = ''
				this.organDetails.purchasePlan = ''
				this.getStoreList(id)
				this.$emit('on-organ-change')
				if (this.organDetails.otherOrganId) {
					this.getPlanList()
				}
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
		onOtherOrganChange (id, selectItem) {
			this.onOrganChangeConfirm('卖方').then(() => {
				this.$refs.form.clearValidate('purchasePlan')
				this.organDetails.otherOrganId = id
				this.organDetails.otherOrganType = selectItem.organType
				this.organDetails.purchasePlan = ''
				this.$emit('on-other-organ-change')
				if (this.organDetails.organ.id) {
					this.getPlanList()
				}
			})
		},
		getStoreList (id) {
			return this.$fxApi(`${apiName}.getStoreList`, id)({ data: [this.organDetails.inHouse || ''] }).then(res => {
				this.$emit('update:storeSelectList', res)
				if (res.length === 1 && this.organDetails.singleHouse === 1) {
					this.organDetails.inHouse = res[0].id
				}
				return Promise.resolve(res)
			})
		},
		getPlanList () {
			const params = {
				orderDate: this.organDetails.orderDate,
				buyerOrganId: this.organDetails.organ.id,
				sellerOrganId: this.organDetails.otherOrganId,
				urgent: this.organDetails.urgent
			}
			return this.$fxApi(`${apiName}.getPlanList`)({ data: params }).then(res => {
				this.$emit('update:planSelectList', res)
				return Promise.resolve(res)
			})
		},
		onPlanChange (id, selectItem) {
			if (this.tableDetails.length > 0) {
				this.$fxConfirm('此操作会清空采购明细，确定更换订货方案？').then(() => {
					this.clearDetails()
					this.organDetails.purchasePlan = id
					this.updateEnablePlanList()
				}).catch(() => {})
			} else {
				this.organDetails.purchasePlan = id
				this.updateEnablePlanList()
			}
		},
		updateEnablePlanList () {
			const enablePlanList = this.planSelectList.filter(item => !!item.enableFlag)
			this.$emit('update:planSelectList', enablePlanList)
		},
		onChangeInHouse (id, item) {
			this.organDetails.inHouse = id
		},
		onAddBissnessTypeClick () {
			this.$refs.bussinessTypeCreateDialog.add('201')
		},
		refreshBussinessTypeList () {
			this.$emit('on-refresh-bussiness-type-list', this.organDetails)
		},
		onSingleHouseChange (value) {
			if (this.tableDetails.length && value) {
				this.$fxApi(`${apiName}.checkDetailsHouse`, this.organDetails.id).then(res => {
					this.onSingleHouseChangeHandler(value, res.id)
				})
			} else {
				this.onSingleHouseChangeHandler(value)
			}
		},
		onSingleHouseChangeHandler (value, inHouse = '') {
			this.organDetails.singleHouse = value
			if (!value) {
				this.$refs.form.clearValidate('inHouse')
			}
			this.organDetails.inHouse = inHouse
			if (this.organDetails.organ.id) {
				this.getStoreList(this.organDetails.organ.id)
			}
			if (this.organDetails.id) {
				this.$emit('on-details-refresh')
			}
		},
		validateInHouse (rule, value, callback) {
			if (this.organDetails.singleHouse === 1 && !value) {
				callback(new Error('该字段不能为空'))
			} else {
				callback()
			}
		},
		onOrderDateChange (date) {
			if (this.$fxUtils.isEmptyObj(this.currentPlan)) {
				if (this.tableDetails.length > 0) {
					this.$emit('update:dateChangeTriggerSave', true)
					this.$fxConfirm('此操作会重新计算期望到货时间，确定更换订货时间？').then(() => {
						this.organDetails.orderDate = date
						this.$emit('on-order-save')
					}).catch(() => {
						this.$emit('update:dateChangeTriggerSave', false)
						this.organDetails.orderDate = this.$refs.orderDate.getOldValue()
					})
				} else {
					this.organDetails.orderDate = date
					!this.organDetails.otherOrganId || this.getPlanList()
				}
			} else {
				if (this.tableDetails.length > 0) {
					this.$fxConfirm('此操作会清空订货方案、卖方机构、采购明细，确定更换订货时间？').then(() => {
						this.clearDetails().then(() => {
							this.organDetails.orderDate = date
							this.organDetails.otherOrganId = ''
							this.organDetails.purchasePlan = ''
						})
					}).catch(() => {
						this.organDetails.orderDate = this.$refs.orderDate.getOldValue()
					})
				} else {
					this.organDetails.orderDate = date
					this.organDetails.purchasePlan = ''
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
			if (!val && this.organDetails.purchasePlan && this.tableDetails.length > 0) {
				this.$fxConfirm('此操作会清空订货方案、采购明细，确定切换加急状态？').then(this.clearDetails).then(() => {
					this.organDetails.urgent = 0
					this.organDetails.purchasePlan = ''
					this.getPlanList()
				}).catch(() => {
					this.organDetails.urgent = 1
				})
			} else if (!val && this.organDetails.purchasePlan) {
				this.$fxConfirm('此操作会清空订货方案，确定切换加急状态？').then(() => {
					this.organDetails.urgent = 0
					this.organDetails.purchasePlan = ''
					this.getPlanList()
				}).catch(() => {
					this.organDetails.urgent = 1
				})
			} else if (this.organDetails.otherOrganId) {
				this.organDetails.urgent = val
				this.getPlanList()
			} else {
				this.organDetails.urgent = val
			}
		},
		defaultFocus (refName = 'userBillCode') {
			this.$fxUtils.vDoRefFocus(this, refName)
		},
		billBizTypeIdTabHandler ({ focus }) {
			this.isAssign ? focus('operator') : focus('orderDate')
		},
		singleHouseTabHandler ({ focus }) {
			this.isSingleHouse ? focus('inHouse') : focus('operator')
		},
		operatorTabHandler ({ focus }) {
			this.isAssign ? focus('memo') : focus('otherOrganId')
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
