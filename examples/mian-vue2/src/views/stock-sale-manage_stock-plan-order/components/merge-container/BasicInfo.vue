<template>
	<w-collapse v-model="collapseVisible" disabled :showArrow="false" title="基础信息">
		<el-form ref="form" :model="organDetails" :rules="rules" size="mini" label-width="100px" inline>
			<el-form-item prop="applyDate" label="申请时间：">
				<el-date-picker
					ref="orderDate"
					required
					v-model="organDetails.applyDate"
					v-fx-tab:focus.organ
					type="datetime"
					value-format="yyyy-MM-dd HH:mm:ss"
					format="yyyy-MM-dd HH:mm"
					placeholder="选择日期"
					:clearable="false"
					class="form-item-input"
				></el-date-picker>
			</el-form-item>
			<el-form-item prop="organ.name" label="买方机构：">
				<w-select-tab
					ref='organ'
					:value="organDetails.organ.name"
					required
					disabled
					class="form-item-input"
				></w-select-tab>
			</el-form-item>
			<el-form-item label="业务类型：">
				<w-select
					ref="billBizTypeId"
					v-model="organDetails.billBizTypeId"
					v-fx-tab:focus.operator
					:optionlist="businessTypeSelectList"
					:required="getFormPropIsRequired('billBizType.id')"
					:clearable="!getFormPropIsRequired('billBizType.id')"
					:rules="computedRules.memo"
					class="form-item-input"
				>
				</w-select>
			</el-form-item>
			<el-form-item prop="operator" label="经办人：">
				<w-select
					ref="operator"
					v-fx-tab:focus.urgent
					v-model="organDetails.operator"
					:optionlist="agentSelectList"
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
					:disabled="isUrgentStockDisable"
				>
				</w-switch>
			</el-form-item>
			<el-form-item prop="memo" label="备注：">
				<w-input
					ref="memo"
					v-model="organDetails.memo"
					v-fx-tab:focus.linkman
					:maxlength="$fxCommon.getFxInputMaxLength('memo')"
					:regType="$fxCommon.getFxInputReg('memo')"
					:required="getFormPropIsRequired('memo')"
					:clearable="!getFormPropIsRequired('memo')"
					:rules="computedRules.memo"
					class="form-item-input-memo"
				></w-input>
			</el-form-item>
			<el-form-item prop="linkman" label="联系人：">
				<w-input
					ref="linkman"
					v-model="organDetails.linkman"
					v-fx-tab:focus.phone
					:maxlength="$fxCommon.getFxInputMaxLength('linkMan')"
					:regType="$fxCommon.getFxInputReg('linkMan')"
					class="form-item-input"
				></w-input>
			</el-form-item>
			<el-form-item prop="phone" label="联系电话：">
				<w-input
					ref="phone"
					v-model="organDetails.phone"
					v-fx-tab:focus.deliveryAddr
					:maxlength="$fxCommon.getFxInputMaxLength('phone')"
					:regType="$fxCommon.getFxInputReg('phone')"
					class="form-item-input"
				></w-input>
			</el-form-item>
			<el-form-item prop="deliveryAddr" label="送货地址：">
				<w-input
					ref="deliveryAddr"
					v-model="organDetails.deliveryAddr"
					v-fx-tab:loop.stock-sale-manage_stock-plan-order_merge.cancelBtn
					:maxlength="$fxCommon.getFxInputMaxLength('deliveryAddr')"
					:regType="$fxCommon.getFxInputReg('deliveryAddr')"
					class="form-item-input"
				></w-input>
			</el-form-item>
		</el-form>
	</w-collapse>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
	name: 'basicInfo',
	components: {
	},
	props: {
		visibleFlag: Boolean,
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		businessTypeSelectList: {
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
		}
	},
	data () {
		return {
			collapseVisible: true,
			rules: {
				applyDate: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				'organ.name': [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				operator: [{ required: true, message: '该字段不能为空', trigger: 'no' }]
			}
		}
	},
	inject: ['$$orderParent'],
	computed: {
		...mapGetters(['getOrderRequiredList', 'getOrderDataIsRequired', 'detailsAuthGetter']),
		isUrgentStockDisable () {
			return !this.detailsAuthGetter('stock-sale-manage_stock-plan-order.urgent-stock')
		},
		getFormPropIsRequired () {
			return prop => {
				return this.getOrderDataIsRequired('StockPlanOrder', this.organDetails.billType, prop)
			}
		},
		computedRules () {
			const orderRequiredList = this.getOrderRequiredList('StockPlanOrder', this.organDetails.billType)
			const orderRequiredSettingRules = {}
			orderRequiredList.forEach(item => {
				orderRequiredSettingRules[item] = [{ required: true, message: '该字段不能为空' }]
			})
			return orderRequiredSettingRules
		}
	},
	watch: {
		visibleFlag: {
			immediate: true,
			handler (val) {
				if (val) {
					this.refresh()
				}
			}
		}
	},
	methods: {
		refresh () {
			this.$nextTick(() => {
				this.$refs.form.clearValidate()
			})
		},
		validate () {
			return this.$refs.form.validate()
		},
		defaultFocus (refName = 'organ') {
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
.form-item-tips {
	transform: scale(0.9)
	font-size: 12px
	margin: -5px -13px -20px -88px
	color: #999
}
.form-item-input-memo {
	width: 460px
}
</style>
