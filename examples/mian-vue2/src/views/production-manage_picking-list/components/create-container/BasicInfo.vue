<template>
	<w-collapse ref="collapse" v-model="collapseVisible" disabled :showArrow="false" title="基础信息">
		<el-form ref="form" :model="organDetails" :rules="rules" size="mini" label-width="100px" inline>
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
					:disabled="disabled || !isHand"
					class="form-item-input"
				></w-input>
			</el-form-item>
			<el-form-item prop="billType" label="单据来源：">
				<w-select
					ref="dataSource"
					:value="organDetails.billType"
					:optionlist="billTypeSelect"
					:disabled="true"
					:optionProp="{name: 'label'}"
					class="form-item-input"
				>
				</w-select>
			</el-form-item>
			<el-form-item prop="businessDate" label="业务时间：">
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
					:disabled="disabled|| !isHand"
					class="form-item-input"
				></el-date-picker>
			</el-form-item>
			<el-form-item prop="checkDate" label="审核时间：">
				<el-date-picker
					ref="checkDate"
					v-model="organDetails.checkDate"
					v-fx-tab="checkDateTabHandler"
					type="datetime"
					align="right"
					value-format="yyyy-MM-dd HH:mm:SS"
					format="yyyy-MM-dd HH:mm"
					:clearable="false"
					:disabled="true"
					class="form-item-input"
				></el-date-picker>
			</el-form-item>
			<el-form-item prop="organ.id" label="加工机构：">
				<w-select-tab
					ref='organ'
					:value="organDetails.organ.id"
					v-fx-tab="organTabHandler"
					:optionlist="organSelectList"
					:disabled="disabled|| !isHand"
					class="form-item-input"
					@change="onOrganChange"
				></w-select-tab>
			</el-form-item>
			<el-form-item prop="operateMan.id" label="经办人：">
				<w-select
					ref="operateMan"
					v-model="organDetails.operateMan.id"
					v-fx-tab:focus.memo
					:optionlist="agentSelectList"
					:disabled="disabled|| !isHand"
					class="form-item-input"
					@change="onOperateManChange"
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
					:disabled="disabled|| !isHand"
					class="form-item-input-memo"
				></w-input>
			</el-form-item>
		</el-form>
	</w-collapse>
</template>
<script>
import { mapState } from 'vuex'
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
		organSelectList: {
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
				userBillCode: [{ required: true, message: '该字段不能为空' }],
				billType: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				businessDate: [{ required: true, message: '该字段不能为空', trigger: 'blur' }],
				'organ.id': [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				'operateMan.id': [{ required: true, message: '该字段不能为空', trigger: 'no' }]
			},
			billCreateTypeList: this.$fxTypeMiddleware.getCommonTypeList('inStoreBillType'),
			billTypeSelect: this.$fxTypeMiddleware.getCommonTypeList('pickingType'),
			planSelectList: [],
			storeWareList: [],
			isCommonTypeByRules: this.$fxTypeMiddleware.isCommonType('pickListGenerateType', 'rules'),
			singleWarnFlag: false
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize
		}),
		isHand () {
			return this.isCommonTypeByRules('hand')(this.organDetails.billType)
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
		refresh () {
			this.collapseVisible = true
			this.$nextTick(() => {
				this.$forceUpdate()
				this.$refs.form.clearValidate()
			})
		},
		validate () {
			return new Promise(resolve => {
				this.$refs.form.validate().then(() => {
					// if (this.organDetails.billType === 1006) {
					// 	resolve()
					// } else {
					resolve()
					// }
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
		// 加工机构 变更
		onOrganChange (id, item) {
			this.onOrganChangeConfirm().then(() => {
				this.$emit('on-organ-change', item)
			})
		},
		onOperateManChange (id, item) {
			this.organDetails.operateMan.name = item.name
		},
		onOrganChangeConfirm () {
			return new Promise(resolve => {
				if (this.tableDetails.length === 0) {
					resolve()
				} else {
					this.$fxConfirm('该操作会清空明细数据，确定更换机构？').then(() => {
						this.clearDetails().then(resolve)
					})
				}
			})
		},
		clearDetails () {
			// const logger = this.$fxLogger.createInfo('store-manage.out-store-order.clearDetails', { orderData: this.organDetails })
			return this.$fxApi('pickingList.clear', this.organDetails.id).then(res => {
				return Promise.resolve(res)
			})
		},
		defaultFocus (refName = 'userBillCode') {
			this.$fxUtils.vDoRefFocus(this, refName)
		},
		userBillCodeTabHandler ({ focus }) {
			focus('businessDate')
		},
		businessDateTabHandler ({ focus }) {
			focus('checkDate')
		},
		checkDateTabHandler ({ focus }) {
			focus('organ')
		},
		organTabHandler ({ focus }) {
			focus('operateMan')
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
