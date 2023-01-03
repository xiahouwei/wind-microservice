<template>
	<div class="setting-mulity">
		<el-form size="mini" label-width="80px" class="setting-mulity_form">
			<el-form-item label="将字段：" class="form-item">
				<w-select
					v-model="settingKey"
					class="form-input"
					:optionlist="computedColumnSelectList"
					:optionProp="{name:'label'}"
				>
				</w-select>
			</el-form-item>
			<div class="form-edit-text">修改为</div>
			<div class="form-content">
				<div v-show="settingKey===2" class="memo-container">
					<w-input
						v-model="memo"
						type="textarea"
						:rows="5"
						resize="none"
						:maxlength="300"
						placeholder="请输入内容"
						class="form-input-memo"
					>
					</w-input>
				</div>
			</div>
			<div class="form-footer">
				<el-button type="danger" plain @click="onCancelClick">取消</el-button>
				<el-button type="primary" plain @click="onSaveClick">保存</el-button>
			</div>
		</el-form>
	</div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
export default {
	name: 'settingMulity',
	props: {
		visible: Boolean,
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	inject: ['initPopoverConnectTarget', 'removePopoverConnectTarget'],
	data () {
		return {
			columnSelectList: [{
				id: 2,
				label: '明细备注'
			}],
			settingKey: 2,
			tax: 0,
			productDate: '',
			memo: '',
			isCommonTypeByRules: this.$fxTypeMiddleware.isCommonType('inStoreBillGenerateType', 'rules'),
			pickerOptions: {
				disabledDate: (time) => {
					return time.getTime() < (new Date(this.organDetails.orderDate).getTime() - 0)
				}
			}
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize,
			taxesList: state => state.system.taxesList,
			haveCostPower: state => state.loginer.haveCostPower
		}),
		...mapGetters(['getSysParams']),
		computedColumnSelectList () {
			// if (this.canEditTaxRate) {
			// 	return this.columnSelectList
			// } else if (this.canEditDate) {
			// 	return this.columnSelectList.slice(1)
			// } else {
			// 	return this.columnSelectList.slice(2)
			// }
			return this.columnSelectList
		},
		canEditTaxRate () {
			return this.organDetails.inOrgan.taxPlayerFlag === 1 && (this.isHand || (this.isAssign && this.systemParamMoneyEdit) || (this.isAmount && this.systemParamMoneyEdit)) && !!this.haveCostPower
		},
		systemParamMoneyEdit () {
			return this.getSysParams('SJXZL_INSTORE_MONEY_AUTH', 'value')
		},
		isHand () {
			return this.isCommonTypeByRules('normal-sub')(this.organDetails.billType, this.organDetails.subBillType)
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
		isMove () {
			return this.isCommonTypeByRules('move')(this.organDetails.billType, this.organDetails.subBillType)
		},
		isReturn () {
			return this.isCommonTypeByRules('return')(this.organDetails.billType, this.organDetails.subBillType)
		},
		isOffset () {
			return this.isCommonTypeByRules(['offset'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		canEditDate () {
			return !(this.isMoney || this.isMove || this.isReturn || this.isOffset)
		}
	},
	watch: {
		visible () {
			this.refreshFormData()
		}
	},
	methods: {
		onSaveClick () {
			const params = {
				type: this.settingKey,
				tax: this.tax,
				productDate: this.productDate,
				memo: this.memo
			}
			this.$emit('on-save-click', params)
		},
		onCancelClick () {
			this.$emit('on-cancel-click')
		},
		refreshFormData () {
			this.settingKey = 2
			this.tax = 0
			this.productDate = ''
			this.memo = ''
		},
		onDatePickerVisibleChange (val) {
			val ? this.initPopoverConnectTarget(this.$refs.datePicker) : this.removePopoverConnectTarget(this.$refs.datePicker)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.setting-mulity {
	display: flex
	flex-direction: column
	height: 300px
	font-size: 12px
	.setting-mulity_form {
		display: flex
		flex-direction: column
		flex: 1
		.form-input {
			width: 150px
		}
		.form-item {
			margin-bottom: 10px
		}
		.form-input-tax {
			margin-top: 20px
			margin-left: 40px
			width: 200px
		}
		.form-input-date {
			margin-top: 20px
			margin-left: 40px
			width: 200px
		}
		.form-edit-text {
			height: 26px
			line-height:26px
			padding-left: 20px
		}
		.form-content {
			flex: 1
			border: 1px solid #eee
			.tax-memo {
				padding: 0 20px
				margin-top: 50px
			}
			.memo-container {
				padding: 5px
			}
		}
		.form-footer {
			text-align: right
			margin-top: 10px
			margin-bottom: 5px
		}
	}
}
>>>.el-textarea__inner {
	font-size 12px
	font-family '微软雅黑'!important
}
</style>
