<template>
	<w-collapse ref="collapse" v-model="collapseVisible" disabled :showArrow="false" title="基础信息">
		<el-form ref="form" :model="organDetails" :rules="rules" size="mini" label-width="100px" inline>
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
					:disabled="disabled"
					class="form-item-input"
				></w-input>
			</el-form-item>
			<el-form-item prop="billType" label="单据类型：">
				<w-select
					:value="organDetails.billTypeName"
					disabled
					class="form-item-input"
				>
				</w-select>
			</el-form-item>
			<el-form-item prop="billBizTypeId" label="业务类型：">
				<w-select
					ref='billBizTypeId'
					v-model="organDetails.billBizTypeId"
					v-fx-tab:focus.operateMan
					:optionlist="billBizTypeList"
					clearable
					:disabled="disabled"
					:loading="billBizTypeIdLoading"
					:fpSelectShow="onBillBizTypeIdSelectShow"
					class="form-item-input"
				>
				</w-select>
				<w-icon v-show="!disabled" type="add-round" class="form-input-add-btn" pointer @click="onAddBissnessTypeClick"></w-icon>
			</el-form-item>
			<el-form-item prop="businessDate" label="出库时间：">
				<el-date-picker
					v-model="organDetails.businessDate"
					type="datetime"
					align="right"
					value-format="yyyy-MM-dd HH:mm:SS"
					format="yyyy-MM-dd HH:mm"
					placeholder="选择日期"
					:clearable="false"
					disabled
					class="form-item-input"
				></el-date-picker>
			</el-form-item>
			<el-form-item prop="organ" label="出库方：">
				<w-select-tab
					ref='organ'
					:value="organDetails.organ.name"
					disabled
					class="form-item-input"
				></w-select-tab>
			</el-form-item>
			<el-form-item label="出库方式：">
				<w-switch
					class="form-item-input"
					v-model="organDetails.singleHouseFlag"
					active-color="green"
					inactive-color="blue"
					active-text="多仓出库"
					inactive-text="单仓出库"
					:activeValue=0
					:inactiveValue=1
					:width="80"
					disabled
				>
				</w-switch>
			</el-form-item>
			<el-form-item prop="outHouse" label="出库仓库：">
				<w-select
					:value="organDetails.outHouse.name"
					:placeholder="outHousePlaceholder"
					disabled
					class="form-item-input"
				></w-select>
			</el-form-item>
			<el-form-item prop="code" label="整单运费：">
				<w-input-number
					v-model="organDetails.carriageFee"
					class="form-item-input"
					disabled
				></w-input-number>
			</el-form-item>
			<el-form-item prop="operateMan" label="经办人：">
				<w-select
					ref='operateMan'
					v-model="organDetails.operateMan.id"
					v-fx-tab:focus.memo
					:optionlist="agentSelectList"
					:disabled="disabled"
					:loading="operateManSelectLoading"
					:fpSelectShow="onOperateManSelectShow"
					class="form-item-input"
				>
				</w-select>
			</el-form-item>
			<el-form-item prop="memo" label="备注：">
				<w-input
					ref='memo'
					v-model="organDetails.memo"
					v-fx-tab:loop.business-data_theory-cost-order_details.basicInfo
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
		agentSelectList: {
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
				organ: [{ required: true, message: '该字段不能为空' }],
				outHouse: [{ required: true, validator: checkoutHouse, trigger: 'no' }],
				operator: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				billType: [{ required: true, message: '该字段不能为空', trigger: 'no' }]
			},
			operateManSelectLoading: false,
			billBizTypeIdLoading: false,
			fxCache: this.$fxUtils.fxCache('theory-cost')
		}
	},
	computed: {
		isSingleHouse () {
			return this.organDetails.singleHouseFlag === 1
		},
		outHousePlaceholder () {
			return this.isSingleHouse ? '请选择' : '请在明细中选择'
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
			return this.$refs.form.validate()
		},
		onAddBissnessTypeClick () {
			this.$refs.bussinessTypeCreateDialog.add('301')
		},
		refreshBussinessTypeList () {
			const key = 'theoryCost.billBizTypeList'
			const data = [this.organDetails.billBizTypeId || '']
			return this.$fxApi(`${apiName}.getBillDetailBizTypeSelect`, this.organDetails.billType)({ data }).then(res => {
				this.fxCache.setCache(key, res)
				return Promise.resolve(res)
			})
		},
		onOperateManSelectShow () {
			const key = 'theoryCost.agentSelectList'
			const data = [this.organDetails.operateMan.id || '']
			return this.fxCache.cacher(key, this.$fxApi(`${apiName}.getAgentList`)({ data })).then(res => {
				this.$emit('update:agentSelectList', res)
				this.operateManSelectLoading = false
				return Promise.resolve(res)
			})
		},
		onBillBizTypeIdSelectShow () {
			const key = 'theoryCost.billBizTypeList'
			const data = [this.organDetails.billBizTypeId || '']
			return this.fxCache.cacher(key, this.$fxApi(`${apiName}.getBillDetailBizTypeSelect`, this.organDetails.billType)({ data })).then(res => {
				this.$emit('update:billBizTypeList', res)
				this.billBizTypeIdLoading = false
				return Promise.resolve(res)
			})
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
