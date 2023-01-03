<template>
	<w-collapse ref="collapse" v-model="collapseVisible" disabled :showArrow="false" title="基础信息">
		<el-form ref="form" :model="organDetails" :rules="computedRules" :validate-on-rule-change="false" size="mini" label-width="100px" inline>
			<el-form-item label="系统单号：">
				<w-input
					v-model="organDetails.sysBillCode"
					disabled
					:class="[billSign,'form-item-input']"
				></w-input>
			</el-form-item>
			<el-form-item prop="userBillCode" label="手工单号：">
				<w-input
					ref='userBillCode'
					v-model="organDetails.userBillCode"
					v-fx-tab="userBillCodeTabHandler"
					:maxlength="$fxCommon.getFxInputMaxLength('commonName')"
					:regType="$fxCommon.getFxInputReg('commonName')"
					:disabled="disabled"
					class="form-item-input"
				></w-input>
			</el-form-item>
			<el-form-item prop="billType" label="单据类型：">
				<w-select
					ref="billType"
					:value="organDetails.billType"
					v-fx-tab:focus.billBizTypeId
					:optionlist="billtypeSelect"
					:class="[billSign,'form-item-input']"
					:disabled="disabled || commonLimited"
					@change="onBillTypeChange"
				>
				</w-select>
			</el-form-item>
			<el-form-item prop="billBizTypeId" label="业务类型：">
				<w-select
					ref="billBizTypeId"
					v-model="organDetails.billBizTypeId"
					v-fx-tab="billBizTypeIdTabHandler"
					:optionlist="billBizTypeList"
					:clearable="!computedRules['billBizTypeId']"
					:disabled="disabled"
					class="form-item-input"
				>
				</w-select>
				<w-icon v-fx-auth:basic-archives_support-archives_bussiness-type.add-bussiness="!isChecked" type="add-round" class="form-input-add-btn" pointer @click="onAddBissnessTypeClick"></w-icon>
			</el-form-item>
			<el-form-item prop="businessDate" label="入库时间：">
				<el-date-picker
					ref="businessDate"
					v-model="organDetails.businessDate"
					v-fx-tab="businessDateTabHandler"
					type="datetime"
					align="right"
					value-format="yyyy-MM-dd HH:mm:SS"
					format="yyyy-MM-dd HH:mm"
					placeholder="选择日期"
					:clearable="false"
					:disabled="disabled || isMove || isBeginPeriod || isOffset"
					class="form-item-input"
					@change="onInstoreDateChange"
					@focus="onBusinessDateFocus"
				></el-date-picker>
			</el-form-item>
			<el-form-item prop="inOrgan.id" label="入库方：">
				<w-select-tab
					ref='inOrgan'
					:value="organDetails.inOrgan.id"
					v-fx-tab="inOrganTabHandler"
					:optionlist="buyerSelectList"
					:disabled="disabled || commonLimited"
					class="form-item-input"
					@change="onOrganChange"
				></w-select-tab>
			</el-form-item>
			<el-form-item label="入库方式：">
				<w-switch
					ref="singleHouseFlag"
					class="form-item-input"
					:value="organDetails.singleHouseFlag"
					v-fx-tab="singleHouseFlagHandler"
					active-color="green"
					inactive-color="blue"
					active-text="多仓入库"
					inactive-text="单仓入库"
					:activeValue=0
					:inactiveValue=1
					:width="80"
					:disabled="disabled || isBeginPeriod || (commonLimited && !isOutStoreSub && !isSaleOrderSubOutOrder)"
					@change="singleHouseFlagChange"
				>
				</w-switch>
			</el-form-item>
			<el-form-item prop="inHouse" label="入库仓库：">
				<w-select
					ref="inHouse"
					:value="organDetails.inHouse.id"
					v-fx-tab="inHouseHandler"
					:optionlist="inStoreWareList"
					:disabled="disabled || !isSingleHouse || (commonLimited && !isOutStoreSub && !isSaleOrderSubOutOrder)"
					:placeholder="inHousePlaceholder"
					class="form-item-input"
					dropdownWidth='300px'
					:optionRender='optionRender'
					@change='onInStoreWareChange'
				></w-select>
			</el-form-item>
			<el-form-item prop="otherOrgan.id" label=" 出库方：">
				<w-select-tab
					ref="otherOrgan"
					:value="organDetails.otherOrgan.id"
					v-fx-tab:focus.carriageFee
					:optionlist="sellerSelectList"
					:disabled="disabled || commonLimited || isBeginPeriod"
					:clearable="!computedRules['otherOrgan.id']"
					class="form-item-input"
					@change="onOtherOrganChange"
				>
				</w-select-tab>
			</el-form-item>
			<el-form-item prop="carriageFee" label="整单运费：">
				<w-input-number
					ref="carriageFee"
					v-model="organDetails.carriageFee"
					v-fx-tab:focus.allotFlag
					class="form-item-input"
					:pointSize="sysMoneyPointSize"
					:disabled="disabled || (commonLimited && !isAssign)"
				></w-input-number>
			</el-form-item>
			<el-form-item label="分摊明细：">
				<w-switch
					ref="allotFlag"
					class="form-item-input"
					v-model="organDetails.allotFlag"
					v-fx-tab:focus.operateMan
					active-color="green"
					inactive-color="blue"
					active-text="不分摊明细"
					inactive-text="分摊到明细"
					:active-value=0
					:inactive-value=1
					:disabled="disabled || (commonLimited && !isAssign && !isOutStoreSub && !isSaleOrderSubOutOrder && !isStockOrderSubOutOrder)"
					:width="90"
				>
				</w-switch>
			</el-form-item>
			<el-form-item prop="operateMan.id" label="经办人：">
				<w-select
					ref="operateMan"
					v-model="organDetails.operateMan.id"
					v-fx-tab:focus.memo
					:optionlist="agentSelectList"
					:disabled="disabled"
					class="form-item-input"
				>
				</w-select>
			</el-form-item>
			<el-form-item prop="memo" label="备注：">
				<w-input
					ref="memo"
					v-model="organDetails.memo"
					v-fx-tab:loop.store-manage_in-store-order_details.basicInfo
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
		billtypeSelect: {
			type: Array,
			default: () => {
				return []
			}
		},
		disabled: Boolean,
		billBizTypeList: {
			type: Array,
			default: () => {
				return []
			}
		},
		inStoreWareList: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	data () {
		const checkInHouse = (rule, value, callback) => {
			if (this.isSingleHouse && !this.organDetails.inHouse.id) {
				callback(new Error('该字段不能为空'))
			} else {
				callback()
			}
		}
		return {
			collapseVisible: true,
			rules: {
				userBillCode: [{ required: true, message: '该字段不能为空' }],
				businessDate: [{ required: true, message: '该字段不能为空', trigger: 'blur' }],
				'inOrgan.id': [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				inHouse: [{ required: true, validator: checkInHouse, trigger: 'no' }],
				'operateMan.id': [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				billType: [{ required: true, message: '该字段不能为空', trigger: 'no' }]
			},
			billCreateTypeList: this.$fxTypeMiddleware.getCommonTypeList('inStoreBillType'),
			isCommonTypeByRules: this.$fxTypeMiddleware.isCommonType('inStoreBillGenerateType', 'rules')
		}
	},
	inject: ['$$orderParent'],
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize
		}),
		...mapGetters(['getOrderRequiredList', 'getOrderDataIsRequired']),
		isChecked () {
			return this.$fxStateMiddleware.isState('billState')(['checked'])(this.organDetails.billState)
		},
		isSingleHouse () {
			return this.organDetails.singleHouseFlag === 1
		},
		inHousePlaceholder () {
			return this.isSingleHouse ? '请选择' : '请在明细中选择'
		},
		isMove () {
			return this.isCommonTypeByRules('move')(this.organDetails.billType, this.organDetails.subBillType)
		},
		isReturn () {
			return this.isCommonTypeByRules('return')(this.organDetails.billType, this.organDetails.subBillType)
		},
		isAssign () {
			return this.isCommonTypeByRules(['assignStraight-sub', 'assignCross-sub'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		isAmount () {
			return this.isCommonTypeByRules('amount-sub')(this.organDetails.billType, this.organDetails.subBillType)
		},
		isMoney () {
			return this.isCommonTypeByRules('money-sub')(this.organDetails.billType, this.organDetails.subBillType)
		},
		isBeginPeriod () {
			return this.isCommonTypeByRules('beginPeriod')(this.organDetails.billType, this.organDetails.subBillType)
		},
		isOffset () {
			return this.isCommonTypeByRules(['offset'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		isOutStoreSub () {
			return this.isCommonTypeByRules(['outStore-sub'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		isSaleOrderSubOutOrder () {
			return this.isCommonTypeByRules(['saleOrder-sub-outOrder'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		isStockOrderSubOutOrder () {
			return this.isCommonTypeByRules(['stockOrder-sub-outOrder'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		delSaleReturnOutStoreOrderSubBlueOrder () {
			return this.isCommonTypeByRules(['delSaleReturnOutStoreOrder-sub-blueOrder'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		handReturnSubBlueOrder () {
			return this.isCommonTypeByRules(['handReturn-sub-blueOrder'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		outStoreOrderChildInStoreOrderSubBlueOrder () {
			return this.isCommonTypeByRules(['outStoreOrderChildInStoreOrder-sub-blueOrder'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		assigneSaleOrderInStoreOrderReturnSubBlueOrder () {
			return this.isCommonTypeByRules(['assigneSaleOrderInStoreOrderReturn-sub-blueOrder'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		commonLimited () {
			return this.isMove || this.isAssign || this.isAmount || this.isMoney || this.isReturn || this.isOffset || this.isOutStoreSub || this.isSaleOrderSubOutOrder || this.isStockOrderSubOutOrder || this.delSaleReturnOutStoreOrderSubBlueOrder ||
			this.handReturnSubBlueOrder || this.outStoreOrderChildInStoreOrderSubBlueOrder || this.assigneSaleOrderInStoreOrderReturnSubBlueOrder
		},
		billSign () {
			switch (this.organDetails.billSign) {
			case 1:
				return 'blue-bill'
			case 2:
				return 'red-bill'
			default:
				return ''
			}
		},
		showHouseItemLocation () {
			return this.organDetails.inOrgan.enableLocation === 1
		},
		computedRules () {
			if (this.isHand || this.isReturn) {
				const orderRequiredList = this.getOrderRequiredList('InStore', this.organDetails.billType)
				const orderRequiredSettingRules = {}
				orderRequiredList.forEach(item => {
					orderRequiredSettingRules[item] = [{ required: true, message: '该字段不能为空', trigger: 'no' }]
				})
				return { ...this.rules, ...orderRequiredSettingRules }
			} else {
				return this.rules
			}
		},
		isHand () {
			return this.isCommonTypeByRules(['normal-sub'])(this.organDetails.billType, this.organDetails.subBillType, this.organDetails)
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
			return new Promise((resolve, reject) => {
				this.$refs.form.validate().then(() => {
					if (this.isMove) {
						resolve()
					} else if (this.organDetails.inOrgan.id === this.organDetails.otherOrgan.id) {
						this.$fxMessage.warning('出库方与入库方不能相同')
					} else if (this.isHand && this.getOrderDataIsRequired('InStore', this.organDetails.billType, 'appendixes') && !this.organDetails.appendixes.length) {
						this.$fxMessage.warning('请上传附件')
					} else if (this.isReturn && this.getOrderDataIsRequired('InStore', this.organDetails.billType, 'appendixes', this.organDetails.inOrgan.organType) && !this.organDetails.appendixes.length) {
						this.$fxMessage.warning('请上传附件')
					} else {
						resolve()
					}
				}).catch(reject)
			})
		},
		optionRender (h, { item }) {
			h = this.$createElement
			return <div class="fx-common__cell-select__option fx-ellipsis">
				<span class="fx-common__cell-select__option-left fx-ellipsis" title={item.code}>{ item.code }</span>
				<span class="fx-common__cell-select__option-right fx-ellipsis" title={item.name}>{ item.name }</span>
			</div>
		},
		onInstoreDateChange (date) {
			if (this.tableDetails.length > 0) {
				const ids = []
				const itemNames = []
				this.tableDetails.forEach(item => {
					if (!this.$fxUtils.compareDate(this.organDetails.businessDate, item.productDate)) {
						ids.push(item.id)
						itemNames.push(item.item.name)
					}
				})
				const setting = {
					ids,
					itemNames,
					productDate: date
				}
				this.organDetails.businessDate = date
				this.$emit('on-order-save', setting)
			}
		},
		onBusinessDateFocus () {
			setTimeout(() => {
				this.$$orderParent.$refs.detailsInfo.checkDetailsUnSaving().catch(() => {
					this.$refs.businessDate.hidePicker()
				})
			}, 100)
		},
		// 入库方 变更
		onOrganChange (id, item) {
			this.onOrganChangeConfirm().then(() => {
				this.organDetails.inOrgan = item
				this.organDetails.inHouse = {}
				this.getValidStoreList()
				if (this.isBeginPeriod) {
					this.getBusinessDateByOrgan()
				}
				if (this.organDetails.id) {
					this.$emit('on-details-refresh')
				}
			})
		},
		getBusinessDateByOrgan () {
			return this.$fxApi('inStore.getAccountingPeriod', this.organDetails.inOrgan.id).then(res => {
				this.organDetails.businessDate = res.beginDate
			}).catch(() => {
				this.organDetails.businessDate = ''
			})
		},
		onOrganChangeConfirm () {
			return new Promise(resolve => {
				if (this.tableDetails.length === 0) {
					resolve()
				} else {
					this.$fxConfirm('该操作会清空明细数据，确定更换入库方？').then(() => {
						this.clearDetails().then(resolve)
					})
				}
			})
		},
		getValidStoreList () {
			if (!this.organDetails.inOrgan.id) {
				this.$emit('update:inStoreWareList', [])
				return Promise.resolve()
			}
			const ids = this.organDetails.inHouse ? [this.organDetails.inHouse.id] : []
			return this.$fxApi('inStore.getValidStoreList', this.organDetails.inOrgan.id)({ data: ids }).then(res => {
				this.$emit('update:inStoreWareList', res)
				if (this.isSingleHouse && res.length && !this.organDetails.inHouse.id) {
					this.organDetails.inHouse = res[0]
				}
				return Promise.resolve()
			})
		},
		onOtherOrganChange (id, item) {
			this.organDetails.otherOrgan = item
		},
		clearDetails () {
			const logger = this.$fxLogger.createInfo('store-manage.in-store-order.clearDetails', { orderData: this.organDetails })
			return this.$fxApi('inStore.clear', this.organDetails.id)({ logger }).then(res => {
				return Promise.resolve(res)
			})
		},
		onAddBissnessTypeClick () {
			this.$refs.bussinessTypeCreateDialog.add('100')
		},
		refreshBussinessTypeList () {
			this.$emit('on-refresh-bussiness-type-list')
		},
		singleHouseFlagChange (value) {
			if (this.tableDetails.length && value) {
				this.$fxApi('inStore.checkDetailsHouse', this.organDetails.id).then(res => {
					this.singleHouseFlagChangeHandler(value, res)
				})
			} else {
				this.singleHouseFlagChangeHandler(value)
			}
		},
		singleHouseFlagChangeHandler (value, inHouse = {}) {
			this.organDetails.singleHouseFlag = value
			if (this.organDetails.id) {
				this.$emit('on-details-refresh')
			}
			this.organDetails.inHouse = inHouse
			if (!value) {
				this.$refs.form.clearValidate('inHouse')
			} else {
				this.getValidStoreList()
			}
		},
		// 入库仓库 变更
		onInStoreWareChange (id, item) {
			if (!this.organDetails.inHouse.id || this.tableDetails.length === 0 || !this.showHouseItemLocation) {
				this.organDetails.inHouse = item
			} else {
				this.$fxConfirm({
					message: '切换仓库，会重置明细中品项的收货货位，确认更换仓库？',
					option: {
						confirmButtonText: '是',
						cancelButtonText: '否'
					}
				}).then(() => {
					this.organDetails.inHouse = item
					this.$emit('on-in-store-ware-change', id)
				}).catch(() => {})
			}
		},
		onBillTypeChange (val) {
			if (val === 1001) {
				this.organDetails.otherOrgan.id = ''
				if (this.tableDetails.length !== 0 && !this.isSingleHouse) {
					this.$fxConfirm({
						message: '因期初入库只允许单仓入库，所以确定切换为期初入库，并清空全部明细？',
						option: {
							confirmButtonText: '是',
							cancelButtonText: '否'
						}
					}).then(() => {
						this.clearDetails().then(() => {
							this.organDetails.billType = val
							this.singleHouseFlagChange(1)
						})
					}).catch(() => {})
				} else {
					this.organDetails.billType = val
					this.organDetails.singleHouseFlag = 1
				}
				this.organDetails.billBizTypeId = ''
				this.refreshBussinessTypeList()
				if (this.organDetails.inOrgan.id) {
					return this.getBusinessDateByOrgan()
				}
			} else {
				this.organDetails.billType = val
				this.organDetails.billBizTypeId = ''
				this.refreshBussinessTypeList()
			}
		},
		defaultFocus (refName = 'userBillCode') {
			this.$fxUtils.vDoRefFocus(this, refName)
		},
		userBillCodeTabHandler ({ focus }) {
			this.commonLimited ? focus('billBizTypeId') : focus('billType')
		},
		billBizTypeIdTabHandler ({ focus }) {
			if (this.isMove || this.isBeginPeriod || this.isOffset) {
				if (this.commonLimited) {
					if (this.isAssign) {
						focus('carriageFee')
					} else {
						focus('operateMan')
					}
				} else {
					focus('inOrgan')
				}
			} else {
				focus('businessDate')
			}
		},
		businessDateTabHandler ({ focus }) {
			if (this.isOutStoreSub) {
				focus('singleHouseFlag')
			} else {
				this.commonLimited ? this.isAssign ? focus('carriageFee') : focus('operateMan') : focus('inOrgan')
			}
		},
		inOrganTabHandler ({ focus }) {
			!this.isBeginPeriod ? focus('singleHouseFlag') : focus('inHouse')
		},
		singleHouseFlagHandler ({ focus }) {
			this.isSingleHouse ? focus('inHouse') : this.isOutStoreSub ? focus('allotFlag') : focus('otherOrgan')
		},
		inHouseHandler ({ focus }) {
			if (this.isOutStoreSub) {
				focus('allotFlag')
			} else {
				this.isBeginPeriod ? focus('carriageFee') : focus('otherOrgan')
			}
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
.red-bill {
	>>>input:disabled, input[disabled] {
		-webkit-text-fill-color $fxRed
	}
}
.blue-bill {
	>>>input:disabled, input[disabled] {
		-webkit-text-fill-color $fxBlue
	}
}
</style>
