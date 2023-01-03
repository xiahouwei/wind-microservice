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
					v-fx-tab:focus.billType
					:maxlength="$fxCommon.getFxInputMaxLength('commonName')"
					:regType="$fxCommon.getFxInputReg('commonName')"
					:disabled="disabled"
					class="form-item-input"
				></w-input>
			</el-form-item>
			<el-form-item prop="billType" label="单据类型：">
				<w-select
					ref='billType'
					v-model="organDetails.billType"
					v-fx-tab:focus.billBizTypeId
					:optionlist="billtypeSelect"
					:optionProp="{name: 'label'}"
					:disabled="disabled"
					class="form-item-input"
					@change="onBillTypeChange"
				>
				</w-select>
			</el-form-item>
			<el-form-item prop="billBizTypeId" label="业务类型：">
				<w-select
					ref='billBizTypeId'
					v-model="organDetails.billBizTypeId"
					v-fx-tab:focus.organ
					:optionlist="businessTypeSelectList"
					:clearable="!computedRules['billBizTypeId']"
					:disabled="disabled"
					class="form-item-input"
				>
				</w-select>
				<w-icon v-fx-auth:basic-archives_support-archives_bussiness-type.add-bussiness="!isChecked" type="add-round" class="form-input-add-btn" pointer @click="onAddBissnessTypeClick"></w-icon>
			</el-form-item>
			<el-form-item prop="organ.id" label="盘点机构：">
				<w-select-tab
					ref='organ'
					:value="organDetails.organ.id"
					v-fx-tab:focus.orderDate
					:optionlist="organSelectList"
					:disabled="disabled"
					class="form-item-input"
					@change="onOrganChange"
				></w-select-tab>
			</el-form-item>
			<el-form-item prop="businessDate" label="盘点时间：">
				<w-date-picker
					ref="orderDate"
					v-model="organDetails.businessDate"
					v-fx-tab:focus.houseSelect
					type="datetime"
					align="right"
					value-format="yyyy-MM-dd HH:mm:ss"
					format="yyyy-MM-dd HH:mm"
					placeholder="选择日期"
					:clearable="false"
					:disabled="disabled"
					class="form-item-input"
					@change="onOrderDateChange"
					@focus="onOrderDateFocus"
				></w-date-picker>
			</el-form-item>
			<el-form-item prop="house.id" label="盘点仓库：">
				<w-select
					ref="houseSelect"
					:value="organDetails.house.id"
					v-fx-tab:focus.checkClass
					:optionlist="storeSelectList"
					:disabled="disabled"
					class="form-item-input"
					dropdownWidth='300px'
					:optionRender='optionRender'
					@change="onStoreChange"
				></w-select>
			</el-form-item>
			<el-form-item prop="checkClass.id" label="盘点分类：">
				<w-select
					ref='checkClass'
					:value="organDetails.checkClass.id"
					v-fx-tab="checkClassTabHanlder"
					:optionlist="checkClassSelectListComputed"
					:disabled="disabled"
					class="form-item-input"
					@change="onCheckClassChange"
				>
				</w-select>
				<w-icon  v-fx-auth:basic-archives_support-archives_take-stock-class.add-take-stock-class="!isChecked" type="add-round" class="form-input-add-btn" pointer @click="onAddCheckClassClick"></w-icon>
			</el-form-item>
			<el-form-item prop="checkWay" label="盘点方式：">
				<w-select
					ref='checkWay'
					v-model="organDetails.checkWay"
					v-fx-tab:focus.notCheck
					:optionlist="checkWaySelectList"
					:optionProp="{name: 'label'}"
					:disabled="disabled || checkWayDisabled"
					class="form-item-input"
				>
				</w-select>
			</el-form-item>
			<el-form-item prop="notCheck" label="未盘品项：">
				<w-select
					ref='notCheck'
					:value="organDetails.notCheck"
					v-fx-tab:focus.operateMan
					:optionlist="notCheckTypeSelectList"
					:optionProp="{name: 'label'}"
					:disabled="disabled"
					class="form-item-input"
					@change="onNotCheckChange"
				>
				</w-select>
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
					v-fx-tab:loop.store-manage_take-stock-order_details.basicInfo
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
		<takeStockClassCreateDialog
			ref="takeStockClassCreateDialog"
			@on-refresh="refreshCheckClassList"
		></takeStockClassCreateDialog>
	</w-collapse>
</template>
<script>
import { mapGetters } from 'vuex'
import bussinessTypeCreateDialog from '@/components/bussiness-type-manage/BussinessTypeCreateDialog.vue'
import takeStockClassCreateDialog from '@/components/take-stock-class-manage/TakeStockClassCreateDialog.vue'
import { apiName } from '../../Index.vue'
export default {
	name: 'basicInfo',
	components: {
		bussinessTypeCreateDialog,
		takeStockClassCreateDialog
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
		organSelectList: {
			type: Array,
			default: () => {
				return []
			}
		},
		storeSelectList: {
			type: Array,
			default: () => {
				return []
			}
		},
		checkClassSelectList: {
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
		systemParam: Boolean
	},
	data () {
		return {
			collapseVisible: true,
			rules: {
				userBillCode: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				billType: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				businessDate: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				'organ.id': [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				'house.id': [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				'checkClass.id': [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				checkWay: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				notCheck: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				'operateMan.id': [{ required: true, message: '该字段不能为空', trigger: 'no' }]
			},
			billtypeSelect: this.$fxTypeMiddleware.getCommonTypeList('takeStockBillType'),
			checkWaySelectList: this.$fxTypeMiddleware.getCommonTypeList('checkWay'),
			notCheckTypeSelectList: this.$fxTypeMiddleware.getCommonTypeList('notCheckType')
		}
	},
	inject: ['$$orderParent'],
	computed: {
		...mapGetters(['getOrderRequiredList', 'getSysParams']),
		isChecked () {
			return this.$fxStateMiddleware.isState('billState')(['checked'])(this.organDetails.billState)
		},
		checkClassSelectListComputed () {
			return [{
				id: '1',
				name: '全盘'
			}, ...this.checkClassSelectList]
		},
		checkWayDisabled () {
			return !!this.tableDetails.length || !this.systemParam
		},
		systemParamCheckDate () {
			return this.getSysParams('CHECK_DATE', 'value')
		},
		computedRules () {
			if (this.isHand) {
				const orderRequiredList = this.getOrderRequiredList('TakeStockOrder', this.organDetails.billType)
				const orderRequiredSettingRules = {}
				orderRequiredList.forEach(item => {
					orderRequiredSettingRules[item] = [{ required: true, message: '该字段不能为空', trigger: 'no' }]
				})
				return { ...this.rules, ...orderRequiredSettingRules }
			} else {
				return this.rules
			}
		},
		isHand () {
			return this.organDetails.autoType === 0
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
		clearDetails () {
			const logger = this.$fxLogger.createInfo('store-manage.take-stock-order.clearDetails', { orderData: this.organDetails })
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
			this.onOrganChangeConfirm().then(async () => {
				this.organDetails.organ = selectItem
				this.organDetails.house = {
					id: ''
				}
				this.organDetails.checkClass = {
					id: '1'
				}
				this.organDetails.businessDate = await this.getBusinessDate(id)
				return this.getStoreList(id)
			})
		},
		onOrganChangeConfirm () {
			return new Promise(resolve => {
				if (this.tableDetails.length === 0) {
					resolve()
				} else {
					this.$fxConfirm({
						message: '成功更换机构后，会自动清空盘点仓库，并重置盘点分类为【全盘】，是否同时清空明细？',
						option: {
							confirmButtonText: '清空明细',
							cancelButtonText: '取消操作',
							closeOnClickModal: false,
							closeOnPressEscape: false,
							closeOnHashChange: false
						}
					}).then(() => {
						this.clearDetails().then(resolve)
					}).catch(() => {})
				}
			})
		},
		getBusinessDate (organId) {
			let businessDate = this.$fxUtils.setDateTime(new Date())
			if (this.systemParamCheckDate || !organId) {
				return Promise.resolve(businessDate)
			} else {
				return this.$fxApi(`${apiName}.getAccountingPeriod`, organId).then(res => {
					businessDate = res.endDate
					return Promise.resolve(businessDate)
				}).catch(() => {
					return Promise.resolve(businessDate)
				})
			}
		},
		getStoreList (id) {
			return this.$fxApi(`${apiName}.getCheckHouseList`, id)({ data: [] }).then(res => {
				this.$emit('update:storeSelectList', res)
				if (res.length === 1) {
					this.organDetails.house = res[0]
				}
				this.refreshCheckClassList()
				return Promise.resolve(res)
			})
		},
		onStoreChange (id, selectItem) {
			if (this.tableDetails.length === 0) {
				this.organDetails.house = selectItem
				this.organDetails.checkClass = {
					id: '1'
				}
				this.refreshCheckClassList()
			} else if (this.organDetails.checkWay) {
				this.$fxConfirm({
					message: '因盘点方式为【合批】，成功更换盘点仓库后，会自动重置盘点分类为【全盘】，是否同时清空明细？',
					option: {
						confirmButtonText: '更换仓库并清空明细',
						cancelButtonText: '仅更换仓库',
						closeOnClickModal: false,
						closeOnPressEscape: false,
						distinguishCancelAndClose: true,
						closeOnHashChange: false
					}
				}).then(() => {
					this.organDetails.house = selectItem
					this.organDetails.checkClass = {
						id: '1'
					}
					this.clearDetails()
					this.refreshCheckClassList()
				}).catch(action => {
					if (action === 'cancel') {
						this.onStoreChangeHandle(selectItem)
					}
				})
			} else {
				this.$fxConfirm({
					message: '因盘点方式为【分批】，成功更换盘点仓库后，会清空明细，并重置盘点分类为【全盘】，是否更换盘点仓库？',
					option: {
						confirmButtonText: '更换仓库',
						cancelButtonText: '取消操作',
						closeOnClickModal: false,
						closeOnPressEscape: false,
						closeOnHashChange: false
					}
				}).then(() => {
					this.organDetails.house = selectItem
					this.organDetails.checkClass = {
						id: '1'
					}
					this.clearDetails()
					this.refreshCheckClassList()
				}).catch(() => {})
			}
		},
		onStoreChangeHandle (selectItem) {
			const params = {
				checkBillId: this.organDetails.id,
				houseId: selectItem.id
			}
			return this.$fxApi(`${apiName}.changeHouse`)({ data: params }).then(() => {
				this.organDetails.house = selectItem
				this.organDetails.checkClass = {
					id: '1'
				}
				this.$emit('on-details-refresh')
				this.$emit('update-verification', this.organDetails)
				this.refreshCheckClassList()
			}).catch(() => {})
		},
		onCheckClassChange (id, selectItem) {
			if (this.tableDetails.length > 0) {
				this.$fxConfirm({
					message: '成功更换盘点分类后，是否同时清空明细？',
					option: {
						confirmButtonText: '清空明细',
						cancelButtonText: '不清空明细',
						closeOnClickModal: false,
						closeOnPressEscape: false,
						distinguishCancelAndClose: true,
						closeOnHashChange: false
					}
				}).then(() => {
					this.organDetails.checkClass.id = id
					this.clearDetails()
				}).catch(action => {
					if (action === 'cancel') {
						this.organDetails.checkClass.id = id
						this.refreshCheckClassList()
						this.updateMustCheckFlag()
					}
				})
			} else {
				this.organDetails.checkClass.id = id
			}
		},
		onOrderDateChange () {
			if (this.tableDetails.length > 0) {
				this.$fxConfirm({
					message: '成功更换盘点时间后，会自动重置盘点分类为【全盘】，是否同时清空明细？',
					option: {
						confirmButtonText: '清空明细',
						cancelButtonText: '不清空明细',
						closeOnClickModal: false,
						closeOnPressEscape: false,
						distinguishCancelAndClose: true,
						closeOnHashChange: false
					}
				}).then(() => {
					this.organDetails.checkClass = {
						id: '1'
					}
					this.refreshCheckClassList()
					this.clearDetails()
				}).catch(action => {
					if (action === 'cancel') {
						this.organDetails.checkClass = {
							id: '1'
						}
						this.refreshCheckClassList()
						this.updateMustCheckFlag()
					} else {
						this.organDetails.businessDate = this.$refs.orderDate.getOldValue()
					}
				})
			} else {
				this.refreshCheckClassList()
			}
		},
		onNotCheckChange (val) {
			if (this.tableDetails.length > 0) {
				this.$fxConfirm({
					message: '更换未盘品项后，是否同时清空明细？',
					option: {
						confirmButtonText: '清空明细',
						cancelButtonText: '不清空明细',
						closeOnClickModal: false,
						closeOnPressEscape: false,
						distinguishCancelAndClose: true,
						closeOnHashChange: false
					}
				}).then(() => {
					this.organDetails.notCheck = val
					this.clearDetails()
				}).catch(action => {
					if (action === 'cancel') {
						this.organDetails.notCheck = val
						this.updateMustCheckFlag()
					}
				})
			} else {
				this.organDetails.notCheck = val
			}
		},
		onOrderDateFocus () {
			setTimeout(() => {
				this.$$orderParent.$refs.detailsInfo.checkDetailsUnSaving().catch(() => {
					this.$refs.orderDate.hidePicker()
				})
			}, 100)
		},
		onAddBissnessTypeClick () {
			this.$refs.bussinessTypeCreateDialog.add()
		},
		onBillTypeChange () {
			this.organDetails.billBizTypeId = ''
			this.refreshBussinessTypeList()
		},
		refreshBussinessTypeList () {
			this.$emit('on-refresh-bussiness-type-list', this.organDetails)
		},
		onAddCheckClassClick () {
			this.$refs.takeStockClassCreateDialog.add()
		},
		refreshCheckClassList () {
			this.$emit('on-refresh-check-class-list', this.organDetails.organ.id, this.organDetails.house.id, this.organDetails.businessDate, this.organDetails.checkClass.id)
		},
		updateMustCheckFlag () {
			return this.$fxApi(`${apiName}.saveBeforeUpdateMustCheckFlag`, this.organDetails.id)({ data: this.organDetails }).then(res => {
				this.$emit('update-verification', this.organDetails)
				return this.$fxApi(`${apiName}.updateMustCheckFlag`, this.organDetails.id).then(res => {
					this.$emit('on-details-refresh')
					return Promise.resolve(res)
				})
			})
		},
		defaultFocus (refName = 'userBillCode') {
			this.$fxUtils.vDoRefFocus(this, refName)
		},
		checkClassTabHanlder ({ focus }) {
			this.checkWayDisabled ? focus('notCheck') : focus('checkWay')
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
.form-input-add-btn {
	position: absolute
	top: 3px
	right: -25px
}
</style>
