<template>
	<div class="setting-mulity">
		<el-form size="mini" label-width="80px" class="setting-mulity_form">
			<el-form-item label="将字段：" class="form-item">
				<w-select
					v-model="settingKey"
					class="form-input"
					:optionlist="computedColumnSelectList"
					:optionProp="{name:'label'}"
					@change="onSettingKeyChange"
				>
				</w-select>
			</el-form-item>
			<div class="form-edit-text">修改为</div>
			<div class="form-content">
				<div v-show="settingKey===0">
					<w-select
						v-model="tax"
						class="form-input-tax"
						:optionlist="taxesList"
					>
					</w-select>
					<div class="tax-memo fx-warn-font">注：批量修改销项税率后，会利用原含税销售单价，按照修改后的销项税率，重新计算新的非税销售单价。</div>
				</div>
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
				<div v-show="settingKey===3">
					<w-select
						:value="outReason.id"
						class="form-input-tax"
						:optionlist="outReasonList"
						@change="onOutReasonChange"
					>
					</w-select>
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
	data () {
		return {
			columnSelectList: [{
				id: 0,
				label: '销项税率'
			}, {
				id: 2,
				label: '明细备注'
			}, {
				id: 3,
				label: '出库原因'
			}],
			settingKey: null,
			tax: 0,
			outReason: {},
			isCommonTypeByRules: this.$fxTypeMiddleware.isCommonType('outStoreBillGenerateType', 'rules'),
			memo: '',
			outReasonList: []
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize,
			taxesList: state => state.system.taxesList,
			haveMoneyPower: state => state.loginer.haveMoneyPower
		}),
		...mapGetters(['getSysParams']),
		computedColumnSelectList () {
			if (this.canEditTaxRate) {
				return this.columnSelectList
			} else {
				return this.columnSelectList.slice(1)
			}
		},
		canEditTaxRate () {
			return this.organDetails.organ.taxPlayerFlag === 1 && (this.isHand || (this.isAssign && this.systemParamMoneyEdit) || (this.isAmount && this.systemParamMoneyEdit)) && !!this.haveMoneyPower
		},
		isHand () {
			return this.isCommonTypeByRules(['normal-sub'])(this.organDetails.billType, this.organDetails.subBillType, this.organDetails)
		},
		isAssign () {
			return this.isCommonTypeByRules(['assignStraight-sub', 'assignCross-sub'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		isAmount () {
			return this.isCommonTypeByRules('amount-sub')(this.organDetails.billType, this.organDetails.subBillType)
		},
		systemParamMoneyEdit () {
			return this.getSysParams('SJXZL_OUTSTORE_MONEY_AUTH', 'value')
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
				memo: this.memo,
				outReason: this.outReason
			}
			this.$emit('on-save-click', params)
		},
		onCancelClick () {
			this.$emit('on-cancel-click')
		},
		refreshFormData () {
			this.settingKey = this.canEditTaxRate ? 0 : 2
			this.tax = 0
			this.memo = ''
			this.outReason = { id: '', name: '' }
		},
		onOutReasonChange (id, item) {
			this.outReason = item
		},
		onSettingKeyChange (val) {
			if (val === 3) {
				this.getOutReasonList()
			}
		},
		getOutReasonList () {
			return this.$fxApi('outStore.getOutReasonList', '').then(res => {
				this.outReasonList = res
			})
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
