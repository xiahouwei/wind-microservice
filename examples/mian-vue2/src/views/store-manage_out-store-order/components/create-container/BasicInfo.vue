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
					ref='billType'
					v-model="organDetails.billType"
					v-fx-tab:focus.billBizTypeId
					:optionlist="billtypeSelect"
					:class="[billSign,'form-input']"
					:disabled="disabled || isLimitedEdit"
					class="form-item-input"
					@change="onBillTypeChange"
				>
				</w-select>
			</el-form-item>
			<el-form-item prop="billBizTypeId" label="业务类型：">
				<w-select
					ref='billBizTypeId'
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
			<el-form-item prop="businessDate" label="出库时间：">
				<el-date-picker
					ref='businessDate'
					v-model="organDetails.businessDate"
					v-fx-tab="businessDateTabHandler"
					type="datetime"
					align="right"
					value-format="yyyy-MM-dd HH:mm:SS"
					format="yyyy-MM-dd HH:mm"
					placeholder="选择日期"
					:clearable="false"
					:disabled="disabled || businessDateLimited"
					@change="onOutStoreDateChange"
					@focus="onOutStoreDateFocus"
					class="form-item-input"
				></el-date-picker>
			</el-form-item>
			<el-form-item prop="organ.id" label="出库方：">
				<w-select-tab
					ref='organ'
					:value="organDetails.organ.id"
					v-fx-tab:focus.singleHouseFlag
					:optionlist="sellerSelectList"
					:disabled="disabled || isLimitedEdit"
					class="form-item-input"
					@change="onOrganChange"
				></w-select-tab>
			</el-form-item>
			<el-form-item label="出库方式：">
				<w-switch
					ref='singleHouseFlag'
					class="form-item-input"
					:value="organDetails.singleHouseFlag"
					v-fx-tab="singleHouseFlagTabHandler"
					active-color="green"
					inactive-color="blue"
					active-text="多仓出库"
					inactive-text="单仓出库"
					:activeValue=0
					:inactiveValue=1
					:width="80"
					:disabled="disabled || isLimitedEdit"
					@change="onSingleHouseChange"
				>
				</w-switch>
			</el-form-item>
			<el-form-item prop="outHouse" label="出库仓库：">
				<w-select
					ref='outHouse'
					:value="organDetails.outHouse.id"
					v-fx-tab:focus.otherOrgan
					:optionlist="outStoreWareList"
					:disabled="disabled || !isSingleHouse || isLimitedEdit"
					:placeholder="outHousePlaceholder"
					class="form-item-input"
					dropdownWidth='300px'
					:optionRender='optionRender'
					@change='onOutStoreWareChange'
				></w-select>
			</el-form-item>
			<el-form-item prop="otherOrgan.id" label=" 入库方：">
				<w-select-tab
					ref='otherOrgan'
					v-model="organDetails.otherOrgan.id"
					v-fx-tab:focus.carriageFee
					:optionlist="buyerSelectList"
					:disabled="disabled || isLimitedEdit"
					:clearable="!computedRules['otherOrgan.id']"
					class="form-item-input"
					@change="onOtherOrganChange"
				>
				</w-select-tab>
			</el-form-item>
			<el-form-item prop="carriageFee" label="整单运费：">
				<w-input-number
					ref='carriageFee'
					v-model="organDetails.carriageFee"
					v-fx-tab:focus.operateMan
					class="form-item-input"
					:pointSize="sysMoneyPointSize"
					:disabled="disabled || isLimitedEdit"
				></w-input-number>
			</el-form-item>
			<el-form-item prop="operateMan.id" label="经办人：">
				<w-select
					ref='operateMan'
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
					ref='memo'
					v-model="organDetails.memo"
					v-fx-tab:loop.store-manage_out-store-order_details.basicInfo
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
		outStoreWareList: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	data () {
		const checkoutHouse = (rule, value, callback) => {
			if (this.isSingleHouse && !this.organDetails.outHouse.id) {
				callback(new Error('该字段不能为空'))
			} else {
				callback()
			}
		}
		return {
			collapseVisible: true,
			rules: {
				userBillCode: [{ required: true, message: '该字段不能为空' }],
				businessDate: [{ required: true, message: '该字段不能为空' }],
				'organ.id': [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				outHouse: [{ required: true, validator: checkoutHouse, trigger: 'no' }],
				'operateMan.id': [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				billType: [{ required: true, message: '该字段不能为空', trigger: 'no' }]
			},
			isCommonTypeByRules: this.$fxTypeMiddleware.isCommonType('outStoreBillGenerateType', 'rules')
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
		outHousePlaceholder () {
			return this.isSingleHouse ? '请选择' : '请在明细中选择'
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
		isLimitedEdit () {
			return this.isCommonTypeByRules(['assignStraight-sub', 'assignCross-sub', 'amount-sub', 'money-sub', 'move', 'offset', 'saleReturnStoreAmount'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		businessDateLimited () {
			return this.isCommonTypeByRules(['move', 'stockProfit', 'stockLoss', 'offset'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		isAssign () {
			return this.isCommonTypeByRules('assignStraight-sub')(this.organDetails.billType, this.organDetails.subBillType) && this.$fxStateMiddleware.isState('billState')(['unSubmit'])(this.organDetails.billState)
		},
		computedRules () {
			if (this.isHand) {
				const orderRequiredList = this.getOrderRequiredList('OutStore', this.organDetails.billType)
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
		},
		isMove () {
			return this.isCommonTypeByRules(['move'])(this.organDetails.billType, this.organDetails.subBillType)
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
					if (this.isMove) {
						resolve()
					} else if (this.organDetails.organ.id === this.organDetails.otherOrgan.id) {
						this.$fxMessage.warning('出库方与入库方不能相同')
					} else if (this.isHand && this.getOrderDataIsRequired('OutStore', this.organDetails.billType, 'appendixes') && !this.organDetails.appendixes.length) {
						this.$fxMessage.warning('请上传附件')
					} else {
						resolve()
					}
				})
			})
		},
		optionRender (h, { item }) {
			h = this.$createElement
			return <div class="fx-common__cell-select__option fx-ellipsis">
				<span class="fx-common__cell-select__option-left fx-ellipsis" title={item.code}>{ item.code }</span>
				<span class="fx-common__cell-select__option-right fx-ellipsis" title={item.name}>{ item.name }</span>
			</div>
		},
		onBillTypeChange () {
			this.organDetails.billBizTypeId = ''
			this.refreshBussinessTypeList()
		},
		// 出库方 变更
		onOrganChange (id, item) {
			this.onOrganChangeConfirm().then(() => {
				this.organDetails.organ = item
				this.organDetails.outHouse = {}
				this.getValidStoreList()
				if (this.organDetails.id) {
					this.$emit('on-details-refresh')
				}
			})
		},
		onOrganChangeConfirm () {
			return new Promise(resolve => {
				if (this.tableDetails.length === 0) {
					resolve()
				} else {
					this.$fxConfirm('该操作会清空明细数据，确定更换出库方？').then(() => {
						this.clearDetails().then(resolve)
					})
				}
			})
		},
		onOutStoreDateChange (date) {
			if (this.tableDetails.length > 0) {
				this.$emit('on-order-save')
			}
		},
		onOutStoreDateFocus () {
			setTimeout(() => {
				this.$$orderParent.$refs.detailsInfo.checkDetailsUnSaving().catch(() => {
					this.$refs.businessDate.hidePicker()
				})
			}, 100)
		},
		getValidStoreList () {
			if (!this.organDetails.organ.id) {
				this.$emit('update:outStoreWareList', [])
				return Promise.resolve()
			}
			const ids = this.organDetails.outHouse ? [this.organDetails.outHouse.id] : []
			return this.$fxApi('outStore.getValidStoreList', this.organDetails.organ.id)({ data: ids }).then(res => {
				this.$emit('update:outStoreWareList', res)
				if (this.isSingleHouse && res.length && !this.organDetails.outHouse.id) {
					this.organDetails.outHouse = res[0]
				}
				return Promise.resolve()
			})
		},
		onOtherOrganChange (id, item) {
			this.organDetails.otherOrgan = item
		},
		clearDetails () {
			const logger = this.$fxLogger.createInfo('store-manage.out-store-order.clearDetails', { orderData: this.organDetails })
			return this.$fxApi('outStore.clear', this.organDetails.id)({ logger }).then(res => {
				return Promise.resolve(res)
			})
		},
		onAddBissnessTypeClick () {
			this.$refs.bussinessTypeCreateDialog.add('101')
		},
		refreshBussinessTypeList () {
			this.$emit('on-refresh-bussiness-type-list')
		},
		onSingleHouseChange (val) {
			if (this.tableDetails.length && val) {
				this.$fxApi('outStore.checkDetailsHouse', this.organDetails.id).then(res => {
					this.onSingleHouseChangeHandler(val, res)
				})
			} else {
				this.onSingleHouseChangeHandler(val)
			}
		},
		onSingleHouseChangeHandler (val, outHouse = {}) {
			this.organDetails.singleHouseFlag = val
			if (this.organDetails.id) {
				this.$emit('on-details-refresh')
			}
			this.organDetails.outHouse = outHouse
			if (!val) {
				this.$refs.form.clearValidate('outHouse')
			} else {
				this.getValidStoreList()
			}
		},
		onOutStoreWareChange (id, item) {
			this.organDetails.outHouse = item
			if (this.organDetails.id) {
				this.$emit('on-details-refresh')
			}
		},
		defaultFocus (refName = 'userBillCode') {
			this.$fxUtils.vDoRefFocus(this, refName)
		},
		userBillCodeTabHandler ({ focus }) {
			this.isLimitedEdit ? focus('billBizTypeId') : focus('billType')
		},
		billBizTypeIdTabHandler ({ focus }) {
			this.businessDateLimited ? focus('operateMan') : focus('businessDate')
		},
		businessDateTabHandler ({ focus }) {
			this.isLimitedEdit ? focus('operateMan') : focus('organ')
		},
		singleHouseFlagTabHandler ({ focus }) {
			this.isSingleHouse ? focus('outHouse') : focus('otherOrgan')
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
