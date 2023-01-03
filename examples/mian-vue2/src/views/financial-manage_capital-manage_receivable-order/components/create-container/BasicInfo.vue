<template>
	<w-collapse ref="collapse" v-model="collapseVisible" disabled :showArrow="false" title="基础信息">
		<el-form ref="form" :model="organDetails" :rules="rules" size="mini" label-width="110px" inline>
			<el-form-item label="系统单号：">
				<w-input
					v-model="organDetails.sysBillCode"
					disabled
					:class="[billTypeClass,'form-item-input']"
				></w-input>
			</el-form-item>
			<el-form-item prop="userBillCode" label="手工单号：">
				<w-input
					ref="userBillCode"
					v-model="organDetails.userBillCode"
					v-fx-tab:focus.businessDate
					:maxlength="$fxCommon.getFxInputMaxLength('commonName')"
					:regType="$fxCommon.getFxInputReg('commonName')"
					:disabled="disabled"
					class="form-item-input"
				></w-input>
			</el-form-item>
			<el-form-item prop="billType" label="单据类型：">
				<w-select
					ref="billType"
					disabled
					:value="organDetails.billType"
					:optionlist="billTypeSelect"
					:class="[billTypeClass,'form-item-input']"
				>
				</w-select>
			</el-form-item>
			<el-form-item prop="billBizTypeId" label="业务类型：">
				<w-select
					ref="billBizTypeId"
					v-model="organDetails.billBizTypeId"
					disabled
					:optionlist="billBizTypeList"
					class="form-item-input"
				>
				</w-select>
			</el-form-item>
			<el-form-item prop="businessDate" label="业务时间：">
				<el-date-picker
					ref="businessDate"
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
				></el-date-picker>
			</el-form-item>
			<el-form-item prop="organ.id" label="收款机构：">
				<w-select-tab
					ref="organ"
					v-fx-tab:focus.otherOrgan
					:value="organDetails.organ.id"
					:optionlist="organList"
					:disabled="disabled"
					class="form-item-input"
					@change="onOrganChange"
				>
				</w-select-tab>
			</el-form-item>
			<el-form-item prop="otherOrgan.id" label="付款机构：">
				<w-select-tab
					ref="otherOrgan"
					v-fx-tab:focus.department
					:value="organDetails.otherOrgan.id"
					:optionlist="otherOrganList"
					:disabled="disabled"
					class="form-item-input"
					@change="onOtherOrganChange"
				></w-select-tab>
			</el-form-item>
			<el-form-item label="核算部门：">
				<w-select
					ref="department"
					v-fx-tab:focus.operateMan
					:value="organDetails.department.id"
					:optionlist="departmentList"
					:disabled="disabled"
					clearable
					class="form-item-input"
					@change="onDepartmentChange"
				>
				</w-select>
			</el-form-item>
			<el-form-item prop="operateMan.id" label="经办人：">
				<w-select
					ref="operateMan"
					v-fx-tab:focus.sourceType
					:value="organDetails.operateMan.id"
					:optionlist="agentSelectList"
					:disabled="disabled"
					class="form-item-input"
					@change="onOperateManChange"
				>
				</w-select>
			</el-form-item>
			<el-form-item prop="sourceType" label="业务来源：">
				<w-select
					ref="sourceType"
					v-fx-tab="sourceTypeTabHandler"
					v-model="organDetails.sourceType"
					:optionlist="sourceTypeList"
					:disabled="disabled"
					class="form-item-input"
				>
				</w-select>
			</el-form-item>
			<el-form-item prop="payWay" label="客户支付方式：">
				<w-select
					ref="payWay"
					v-fx-tab:focus.memo
					v-model="organDetails.payWay"
					:optionlist="payWayList"
					:disabled="disabled || organDetails.sourceType === 1000"
					class="form-item-input"
				>
				</w-select>
			</el-form-item>
			<el-form-item prop="memo" label="备注：">
				<w-input
					ref="memo"
					v-model="organDetails.memo"
					v-fx-tab:loop.financial-manage_receivable-order_details.basicInfo
					:maxlength="$fxCommon.getFxInputMaxLength('memo')"
					:regType="$fxCommon.getFxInputReg('memo')"
					:disabled="disabled"
					class="form-item-input-memo"
				></w-input>
			</el-form-item>
		</el-form>
	</w-collapse>
</template>
<script>
import { apiName } from '../../Index.vue'
export default {
	name: 'basicInfo',
	props: {
		visibleFlag: Boolean,
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
		organList: {
			type: Array,
			default: () => {
				return []
			}
		},
		otherOrganList: {
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
		billTypeSelect: {
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
		departmentList: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	data () {
		const checkPayWay = (rule, value, callback) => {
			if (this.organDetails.sourceType === 1002) {
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
				'organ.id': [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				'otherOrgan.id': [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				'operateMan.id': [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				billType: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				sourceType: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				payWay: [{ required: true, validator: checkPayWay, trigger: 'no' }]
			},
			payWayList: this.$fxTypeMiddleware.getCommonTypeList('payWayList'),
			sourceTypeList: this.$fxTypeMiddleware.getCommonTypeList('sourceTypeList'),
			isCommonTypeByRules: this.$fxTypeMiddleware.isCommonType('receivableOrderGenerateType', 'rules')
		}
	},
	computed: {
		billTypeClass () {
			switch (this.organDetails.billType) {
			case 103:
				return 'red-bill'
			default:
				return ''
			}
		}
	},
	watch: {
		visibleFlag (val) {
			if (val) {
				this.$nextTick(() => this.$refs.collapse.resize())
			}
		},
		isFullScreen (val) {
			if (!val) {
				this.$nextTick(() => this.$refs.collapse.resize())
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
			return new Promise((resolve, reject) => {
				this.$refs.form.validate().then(() => {
					if (this.organDetails.organ.id === this.organDetails.otherOrgan.id) {
						this.$fxMessage.warning('付款机构与收款机构不能相同')
					} else {
						resolve()
					}
				}).catch(reject)
			})
		},
		onOrganChange (id, item) {
			this.onOrganChangeConfirm('收款机构').then(() => {
				this.organDetails.organ = item
				this.organDetails.department = {}
				this.getDepartmentList(item.id)
				if (this.organDetails.id) {
					this.$emit('on-details-refresh')
				}
			})
		},
		onOtherOrganChange (id, item) {
			this.onOrganChangeConfirm('付款机构').then(() => {
				this.organDetails.otherOrgan = item
				if (this.organDetails.id) {
					this.$emit('on-details-refresh')
				}
			})
		},
		onOrganChangeConfirm (organMessage) {
			return new Promise(resolve => {
				if (this.tableDetails.length === 0) {
					resolve()
				} else {
					this.$fxConfirm(`该操作会清空明细数据，确定更换${organMessage}？`).then(() => {
						this.clearDetails().then(resolve)
					})
				}
			})
		},
		getDepartmentList (organId) {
			const ids = []
			return this.$fxApi(`${apiName}.getDepartmentList`, organId)({ data: ids }).then(res => {
				this.$emit('update:departmentList', res)
				return Promise.resolve(res)
			})
		},
		onDepartmentChange (id, item) {
			this.organDetails.department = item
		},
		onOperateManChange (id, item) {
			this.organDetails.operateMan = item
		},
		clearDetails () {
			const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.receivable-order.clearDetails', { orderData: this.organDetails })
			return this.$fxApi(`${apiName}.clear`, this.organDetails.id)({ logger })
		},
		defaultFocus (refName = 'userBillCode') {
			this.$fxUtils.vDoRefFocus(this, refName)
		},
		sourceTypeTabHandler ({ focus }) {
			this.organDetails.sourceType === 1000 ? focus('memo') : focus('payWay')
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
