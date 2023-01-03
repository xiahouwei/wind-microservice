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
				<div v-show="settingKey===0">
					<w-select
						v-model="tax"
						class="form-input-tax"
						:optionlist="taxesList"
					>
					</w-select>
					<div class="tax-memo fx-warn-font">注：批量修改税率后，会利用原含税单价，按照修改后的税率，重新计算新的非税单价</div>
				</div>
				<div v-show="settingKey===1">
					<w-date-picker
						ref="datePicker"
						v-model="productDate"
						type="datetime"
						align="right"
						value-format="yyyy-MM-dd HH:mm:ss"
						format="yyyy-MM-dd HH:mm:ss"
						placeholder="选择日期"
						:clearable="false"
						:picker-options="pickerOptions"
						class="form-input-date"
						@visible-change="onDatePickerVisibleChange"
					></w-date-picker>
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
						class="form-input-inStore"
						:value="store"
						:optionlist="inStoreWareList"
						@change="onStoreChange"
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
		},
		inStoreWareList: {
			type: Array,
			default: () => {
				return []
			}
		},
		canSetMulityInStore: Boolean,
		commonPriceEditState: Boolean
	},
	inject: ['initPopoverConnectTarget', 'removePopoverConnectTarget'],
	data () {
		return {
			columnSelectList: [{
				id: 3,
				label: '入库仓库'
			}, {
				id: 0,
				label: '税率'
			}, {
				id: 1,
				label: '生产日期'
			}, {
				id: 2,
				label: '明细备注'
			}],
			settingKey: null,
			tax: 0,
			productDate: '',
			memo: '',
			store: '',
			isCommonTypeByRules: this.$fxTypeMiddleware.isCommonType('inStoreBillGenerateType', 'rules'),
			pickerOptions: {
				disabledDate: date => {
					return date.getTime() > new Date(this.organDetails.businessDate).getTime()
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
			if (this.canSetMulityInStore) {
				return this.columnSelectList
			} else if (this.canEditTaxRate) {
				return this.columnSelectList.slice(1)
			} else if (this.canEditDate) {
				return this.columnSelectList.slice(2)
			} else {
				return this.columnSelectList.slice(3)
			}
		},
		canEditTaxRate () {
			return this.organDetails.inOrgan.taxPlayerFlag === 1 && this.commonPriceEditState
		},
		systemParamMoneyEdit () {
			return this.getSysParams('SJXZL_INSTORE_MONEY_AUTH', 'value')
		},
		isHand () {
			return this.isCommonTypeByRules('normal-sub')(this.organDetails.billType, this.organDetails.subBillType, this.organDetails)
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
		isOutStoreSub () {
			return this.isCommonTypeByRules(['outStore-sub'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		canEditDate () {
			return !(this.isMoney || this.isMove || this.isReturn || this.isOffset || this.isOutStoreSub)
		},
		settingMulitySelectedHouse () {
			return this.inStoreWareList.find(item => item.id === this.store)
		}
	},
	watch: {
		visible () {
			this.refreshFormData()
			this.open()
		}
	},
	methods: {
		open () {
			this.store = ''
			if (this.organDetails.singleHouseFlag) {
				this.store = this.organDetails.inHouse.id
			} else if (this.inStoreWareList.length === 1) {
				this.store = this.inStoreWareList[0].id
			} else if (this.inStoreWareList.length > 1) {
				const defaultStroe = this.inStoreWareList.find(item => {
					return item.defaultInFlag
				})
				this.store = defaultStroe ? defaultStroe.id : this.inStoreWareList[0].id
			}
		},
		onStoreChange (id) {
			this.store = id
		},
		onSaveClick () {
			const checkProductDate = this.settingKey === 1 && this.productDate && !this.$fxUtils.compareDate(this.organDetails.businessDate, this.productDate)
			if (checkProductDate) {
				return this.$fxMessage.warning('生产日期不能大于入库时间')
			}
			const params = {
				type: this.settingKey,
				tax: this.tax,
				productDate: this.productDate,
				memo: this.memo,
				houseId: this.store
			}
			this.$emit('on-save-click', params, this.settingMulitySelectedHouse)
		},
		onCancelClick () {
			this.$emit('on-cancel-click')
		},
		refreshFormData () {
			if (this.canSetMulityInStore) {
				this.settingKey = 3
			} else if (this.canEditTaxRate) {
				this.settingKey = 0
			} else if (this.canEditDate) {
				this.settingKey = 1
			} else {
				this.settingKey = 2
			}
			this.tax = 0
			this.productDate = ''
			this.memo = ''
			this.store = ''
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
		.form-input-inStore {
			margin-top: 20px
			margin-left: 40px
			width: 200px
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
