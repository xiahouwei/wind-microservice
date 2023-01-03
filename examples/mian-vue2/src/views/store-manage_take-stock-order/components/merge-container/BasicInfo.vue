<template>
	<w-collapse v-model="collapseVisible" disabled :showArrow="false" title="基础信息">
		<el-form ref="form" :model="organDetails" :rules="rules" size="mini" label-width="100px" inline>
			<el-form-item prop="userBillCode" label="手工单号：">
				<w-input
					ref="userBillCode"
					v-model="organDetails.userBillCode"
					v-fx-tab:focus.billType
					:maxlength="$fxCommon.getFxInputMaxLength('commonName')"
					:regType="$fxCommon.getFxInputReg('commonName')"
					:disabled="disabled"
					class="form-item-input"
				></w-input>
			</el-form-item>
			<el-form-item prop="billType" label="单据类型：">
				<w-select
					ref="billType"
					v-model="organDetails.billType"
					v-fx-tab:focus.billBizTypeId
					:optionlist="billtypeSelect"
					:optionProp="{name: 'label'}"
					:disabled="disabled"
					class="form-item-input"
				>
				</w-select>
			</el-form-item>
			<el-form-item label="业务类型：">
				<w-select
					ref="billBizTypeId"
					v-model="organDetails.billBizTypeId"
					v-fx-tab:focus.orderDate
					:optionlist="businessTypeSelectList"
					clearable
					:disabled="disabled"
					class="form-item-input"
				>
				</w-select>
				<w-icon type="add-round" class="form-input-add-btn" pointer @click="onAddBissnessTypeClick"></w-icon>
			</el-form-item>
			<el-form-item prop="businessDate" label="盘点时间：">
				<el-date-picker
					ref="orderDate"
					v-model="organDetails.businessDate"
					v-fx-tab:focus.notCheck
					type="datetime"
					value-format="yyyy-MM-dd HH:mm:ss"
					format="yyyy-MM-dd HH:mm"
					placeholder="选择日期"
					:clearable="false"
					:disabled="disabled"
					class="form-item-input"
				></el-date-picker>
				<div class="form-item-tips">盘点时间默认为被合并盘点单中靠后的时间，可修改</div>
			</el-form-item>
			<el-form-item prop="notCheck" label="未盘品项：">
				<w-select
					ref="notCheck"
					v-model="organDetails.notCheck"
					v-fx-tab:focus.operateMan
					:optionlist="notCheckTypeSelectList"
					:optionProp="{name: 'label'}"
					:disabled="disabled"
					class="form-item-input"
				>
				</w-select>
			</el-form-item>
			<el-form-item prop="operateMan.id" label="经办人：">
				<w-select
					ref="operateMan"
					v-fx-tab:focus.memo
					v-model="organDetails.operateMan.id"
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
					v-fx-tab:loop.store-manage_take-stock-order_merge.basicInfo
					:maxlength="$fxCommon.getFxInputMaxLength('memo')"
					:regType="$fxCommon.getFxInputReg('memo')"
					:disabled="disabled"
					class="form-item-input-memo"
				></w-input>
			</el-form-item>
		</el-form>
		<bussinessTypeCreateDialog
			ref="bussinessTypeCreateDialog"
			type="102"
			@on-refresh="refreshBussinessTypeList"
		></bussinessTypeCreateDialog>
	</w-collapse>
</template>
<script>
import bussinessTypeCreateDialog from '@/components/bussiness-type-manage/BussinessTypeCreateDialog.vue'
export default {
	name: 'basicInfo',
	components: {
		bussinessTypeCreateDialog
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
		},
		disabled: Boolean
	},
	data () {
		return {
			collapseVisible: true,
			rules: {
				userBillCode: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				billType: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				businessDate: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				notCheck: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				'operateMan.id': [{ required: true, message: '该字段不能为空', trigger: 'no' }]
			},
			billtypeSelect: this.$fxTypeMiddleware.getCommonTypeList('takeStockBillType'),
			notCheckTypeSelectList: this.$fxTypeMiddleware.getCommonTypeList('notCheckType')
		}
	},
	inject: ['$$orderParent'],
	computed: {
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
		onAddBissnessTypeClick () {
			this.$refs.bussinessTypeCreateDialog.add()
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
.form-item-tips {
	transform: scale(0.9)
	font-size: 12px
	margin: -5px -13px -20px -88px
	color: #999
}
.form-item-input-memo {
	width: 460px
}
.form-input-add-btn {
	position: absolute
	top: 3px
	right: -25px
}
</style>
