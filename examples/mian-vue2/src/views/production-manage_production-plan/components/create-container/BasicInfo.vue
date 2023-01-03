<template>
	<w-collapse ref="collapse" v-model="collapseVisible" disabled :showArrow="false" title="基础信息">
		<el-form ref="form" :model="organDetails" :rules="rules" size="mini" label-width="120px" inline>
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
			<el-form-item prop="billType" label="单据类型："><w-select
					ref="billType"
					:value="organDetails.billType"
					:optionlist="billtypeSelect"
					:disabled="true"
					:optionProp="{name: 'label'}"
					class="form-item-input"
				>
				</w-select>
			</el-form-item>
			<el-form-item prop="dataSource" label="数据来源：">
				<w-select
					ref="dataSource"
					:value="organDetails.dataSource"
					:optionlist="dataSourceTypeSelect"
					:disabled="true"
					:optionProp="{name: 'label'}"
					class="form-item-input"
				>
				</w-select>
			</el-form-item>
			<el-form-item prop="businessDate" label="生产计划日期：" label-width="120px">
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
					:disabled="disabled"
					class="form-item-input"
				></el-date-picker>
			</el-form-item>
			<el-form-item prop="organ.id" label="加工机构：">
				<w-select-tab
					ref='organ'
					:value="organDetails.organ.id"
					v-fx-tab="organTabHandler"
					:optionlist="organSelectList"
					:disabled="disabled"
					class="form-item-input"
					@change="onOrganChange"
				></w-select-tab>
			</el-form-item>
			<el-form-item prop="house" label="仓库：">
				<w-select
					ref="house"
					:value="organDetails.house.id"
					:optionlist="storeWareList"
					:disabled="disabled"
					placeholder="请选择仓库"
					class="form-item-input"
					dropdownWidth='300px'
					:optionRender='optionRender'
					@change='onStoreWareChange'
				></w-select>
			</el-form-item>
			<el-form-item prop="operateMan.id" label="经办人：">
				<w-select
					ref="operateMan"
					v-model="organDetails.operateMan.id"
					v-fx-tab:focus.memo
					:optionlist="agentSelectList"
					:disabled="disabled"
					class="form-item-input"
					@change='onOperateManChange'
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
					:disabled="disabled"
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
		const checkHouse = (rule, value, callback) => {
			if (!this.organDetails.house.id) {
				callback(new Error('该字段不能为空'))
			} else {
				callback()
			}
		}
		return {
			collapseVisible: true,
			rules: {
				userBillCode: [{ required: true, message: '该字段不能为空' }],
				billType: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				businessDate: [{ required: true, message: '该字段不能为空', trigger: 'blur' }],
				'organ.id': [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				house: [{ required: true, validator: checkHouse, message: '该字段不能为空', trigger: 'no' }],
				'operateMan.id': [{ required: true, message: '该字段不能为空', trigger: 'no' }]
			},
			billCreateTypeList: this.$fxTypeMiddleware.getCommonTypeList('inStoreBillType'),
			dataSourceTypeSelect: this.$fxTypeMiddleware.getCommonTypeList('dataSource'),
			billtypeSelect: this.$fxTypeMiddleware.getCommonTypeList('productionPlanBilltype'),
			planSelectList: [],
			storeWareList: [],
			singleFlag: this.organDetails.singleHouseFlag === 1,
			isCommonTypeByRules: this.$fxTypeMiddleware.isCommonType('inStoreBillGenerateType', 'rules'),
			singleWarnFlag: false
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize
		}),
		isSingleHouse () {
			return this.organDetails.singleHouseFlag === 0
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
				this.organDetails.organ.id = item.id
				this.organDetails.organ.name = item.name
				this.organDetails.house = {}
				this.storeWareList = item.store
				this.$emit('on-organ-change', item)
			})
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
			// const logger = this.$fxLogger.createInfo('store-manage.in-store-order.clearDetails', { orderData: this.organDetails })
			return this.$fxApi('productionPlan.clear', this.organDetails.id).then(res => {
				return Promise.resolve(res)
			})
		},
		// 仓库 变更
		onStoreWareChange (id, item) {
			// this.onHouseChangeConfirm(id).then(obj => {
			this.organDetails.house = item
			this.$emit('on-store-ware-change', item.id)
			// })
		},
		onOperateManChange (id, item) {
			this.organDetails.operateMan.name = item.name
		},
		refreshInStoreWareList () {
			this.storeWareList = this.$fxUtils.getSelectTagById(this.organDetails.organ.id, this.organSelectList).store
		},
		onHouseChangeConfirm (id) {
			const obj = this.storeWareList.find(i => {
				return i.id === id
			})
			return new Promise(resolve => {
				if (this.tableDetails.length === 0 || obj.relAllGoods) {
					resolve(obj)
				} else {
					this.$fxConfirm('该操作会清空明细数据，确定更换入库仓库？').then(() => {
						this.clearDetails().then(() => { resolve(obj) })
					})
				}
			})
		},
		onBillTypeChange (val) {
			if (val === 1001) {
				if (this.tableDetails.length !== 0 && this.organDetails.singleHouseFlag === 0) {
					this.$fxConfirm({
						message: '因期初入库只允许单仓入库，所以确定切换为期初入库，并清空全部明细？',
						option: {
							confirmButtonText: '是',
							cancelButtonText: '否'
						}
					}).then(() => {
						this.clearDetails().then(() => {
							this.organDetails.billType = val
							this.singleHouseFlagChange(1)
						})
					}).catch(() => {})
				} else {
					this.organDetails.billType = val
					this.organDetails.singleHouseFlag = 1
				}
				if (this.organDetails.organ.id) {
					return this.$fxApi('inStore.getAccountingPeriod', this.organDetails.organ.id).then(res => {
						this.organDetails.businessDate = res.beginDate
					}).catch(() => {
						this.organDetails.businessDate = ''
					})
				}
			} else {
				this.organDetails.billType = val
			}
		},
		defaultFocus (refName = 'userBillCode') {
			this.$fxUtils.vDoRefFocus(this, refName)
		},
		userBillCodeTabHandler ({ focus }) {
			focus('businessDate')
		},
		businessDateTabHandler ({ focus }) {
			focus('organ')
		},
		organTabHandler ({ focus }) {
			focus('house')
		}
		// singleHouseFlagHandler ({ focus }) {
		// 	this.isSingleHouse ? focus('inHouse') : focus('otherOrgan')
		// }
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-item-input {
	width: 175px
}
.form-item-input-memo {
	width: 480px
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
