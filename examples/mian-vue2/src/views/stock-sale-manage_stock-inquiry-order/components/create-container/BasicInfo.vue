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
					v-fx-tab:focus.organ
					:maxlength="$fxCommon.getFxInputMaxLength('commonName')"
					:regType="$fxCommon.getFxInputReg('commonName')"
					:disabled="disabled"
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
			<el-form-item v-if="false" prop="billBizType.id" label="业务类型：">
				<w-select
					ref='billBizType'
					v-model="organDetails.billBizType.id"
					v-fx-tab:focus.organ
					:optionlist="businessTypeSelectList"
					:clearable="!computedRules['billBizType.id']"
					:disabled="disabled"
					class="form-item-input"
				>
				</w-select>
				<w-icon v-fx-auth:basic-archives_support-archives_bussiness-type.add-bussiness="!isChecked" type="add-round" class="form-input-add-btn" pointer @click="onAddBissnessTypeClick"></w-icon>
			</el-form-item>
			<el-form-item prop="organ.id" label="买方机构：">
				<w-select-tab
					ref='organ'
					:value="organDetails.organ.id"
					v-fx-tab:focus.operateMan
					:optionlist="buyerSelectList"
					:disabled="disabled || isStockPlanSub"
					class="form-item-input"
					@change="onOrganChange"
				></w-select-tab>
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
					v-fx-tab:loop.stock-sale-manage_stock-inquiry-order_details.basicInfo
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
			isCommonTypeByRules: this.$fxTypeMiddleware.isCommonType('stockInquiryOrderGenerateType', 'rules'),
			rules: {
				userBillCode: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				'organ.id': [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				'operateMan.id': [{ required: true, message: '该字段不能为空', trigger: 'no' }]
			}
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
		isHand () {
			return this.isCommonTypeByRules('hand')(this.organDetails)
		},
		isStockPlanSub () {
			return this.isCommonTypeByRules('stockPlanSub')(this.organDetails)
		},
		computedRules () {
			return this.rules
			// if (this.isHand) {
			// 	const orderRequiredList = this.getOrderRequiredList('StockPlanOrder', this.organDetails.billType)
			// 	const orderRequiredSettingRules = {}
			// 	orderRequiredList.forEach(item => {
			// 		orderRequiredSettingRules[item] = [{ required: true, message: '该字段不能为空', trigger: 'no' }]
			// 	})
			// 	return { ...this.rules, ...orderRequiredSettingRules }
			// } else {
			// 	return this.rules
			// }
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
					resolve()
				})
			})
		},
		clearDetails () {
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-inquiry-order.clearDetails', { orderData: this.organDetails })
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
			this.organDetails.organ = selectItem
			// this.onOrganChangeConfirm('买方').then(() => {
			// 	this.organDetails.organ = selectItem
			// })
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
