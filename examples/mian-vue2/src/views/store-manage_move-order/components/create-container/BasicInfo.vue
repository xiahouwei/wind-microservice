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
					v-fx-tab:focus.billBizTypeId
					:maxlength="$fxCommon.getFxInputMaxLength('commonName')"
					:regType="$fxCommon.getFxInputReg('commonName')"
					:disabled="disabled"
					class="form-item-input"
				></w-input>
			</el-form-item>
			<el-form-item prop="billType" label="单据类型：">
				<w-select
					v-model="organDetails.billType"
					:optionlist="billtypeSelect"
					disabled
					class="form-item-input"
				>
				</w-select>
			</el-form-item>
			<el-form-item prop="billBizTypeId" label="业务类型：">
				<w-select
					ref='billBizTypeId'
					v-model="organDetails.billBizTypeId"
					v-fx-tab:focus.orderDate
					:optionlist="businessTypeSelectList"
					:clearable="!computedRules['billBizTypeId']"
					:disabled="disabled"
					class="form-item-input"
				>
				</w-select>
				<w-icon v-fx-auth:basic-archives_support-archives_bussiness-type.add-bussiness="!isChecked" type="add-round" class="form-input-add-btn" pointer @click="onAddBissnessTypeClick"></w-icon>
			</el-form-item>
			<el-form-item prop="businessDate" label="调拨时间：">
				<el-date-picker
					ref="orderDate"
					v-model="organDetails.businessDate"
					v-fx-tab:focus.organ
					type="datetime"
					align="right"
					value-format="yyyy-MM-dd HH:mm:ss"
					format="yyyy-MM-dd HH:mm"
					placeholder="选择日期"
					:clearable="false"
					:disabled="disabled"
					class="form-item-input"
					@focus="onOrderDateFocus"
				></el-date-picker>
			</el-form-item>
			<el-form-item prop="organ.id" :label="organLabel">
				<w-select-tab
					ref='organ'
					:value="organDetails.organ.id"
					v-fx-tab="organTabHandler"
					:optionlist="inOrganSelectListComputed"
					:disabled="disabled"
					class="form-item-input"
					@change="onOrganChange"
				></w-select-tab>
			</el-form-item>
			<el-form-item label="入库方式：">
				<w-switch
					ref='singleInHouseFlag'
					class="form-item-input"
					:value="organDetails.singleInHouseFlag"
					v-fx-tab="singleInHouseFlagTabHandler"
					active-color="blue"
					inactive-color="green"
					active-text="单仓入库"
					inactive-text="多仓入库"
					:width="80"
					:disabled="inHouseTypeDisabled"
					@change="onSingleInHouseChange"
				>
				</w-switch>
			</el-form-item>
			<el-form-item prop="inHouse.id" label="入库仓库：">
				<w-select
					ref='inHouse'
					:value="organDetails.inHouse.id"
					v-fx-tab:focus.operateMan
					:optionlist="storeSelectList"
					:disabled="inHouseDisabled"
					:placeholder="inHousePlaceholder"
					class="form-item-input"
					dropdownWidth='300px'
					:optionRender='optionRender'
					@change="onInStoreChange"
				>
				</w-select>
			</el-form-item>
			<el-form-item prop="operateMan.id" label="经办人：">
				<w-select
					ref='operateMan'
					v-model="organDetails.operateMan.id"
					v-fx-tab="operateManTabHandler"
					:optionlist="agentSelectList"
					:disabled="disabled"
					class="form-item-input"
				>
				</w-select>
			</el-form-item>
			<el-form-item v-if="!isInside" prop="otherOrgan.id" label="出库方：">
				<w-select-tab
					ref='otherOrgan'
					:value="organDetails.otherOrgan.id"
					v-fx-tab="otherOrganTabHandler"
					:optionlist="outOrganSelectListComputed"
					:disabled="disabled"
					class="form-item-input"
					@change="onOtherOrganChange"
				></w-select-tab>
			</el-form-item>
			<el-form-item label="出库方式：">
				<w-switch
					ref='singleOutHouseFlag'
					class="form-item-input"
					:value="organDetails.singleOutHouseFlag"
					v-fx-tab="singleOutHouseFlagTabHandler"
					active-color="blue"
					inactive-color="green"
					active-text="单仓出库"
					inactive-text="多仓出库"
					:width="80"
					:disabled="outHouseTypeDisabled"
					@change="onSingleOutHouseChange"
				>
				</w-switch>
			</el-form-item>
			<el-form-item prop="otherHouse.id" label="出库仓库：">
				<w-select
					ref='otherHouse'
					:value="organDetails.otherHouse.id"
					v-fx-tab:focus.memo
					:optionlist="outStoreSelectListComputed"
					:disabled="outHouseDisabled"
					:placeholder="outHousePlaceholder"
					class="form-item-input"
					dropdownWidth='300px'
					:optionRender='optionRender'
					@change="onOutStoreChange"
				>
				</w-select>
			</el-form-item>
			<el-form-item prop="memo" label="备注：">
				<w-input
					ref='memo'
					v-model="organDetails.memo"
					v-fx-tab:loop.store-manage_move-order_details.basicInfo
					:maxlength="$fxCommon.getFxInputMaxLength('memo')"
					:regType="$fxCommon.getFxInputReg('memo')"
					:disabled="disabled"
					class="form-item-input-memo"
				></w-input>
			</el-form-item>
		</el-form>
		<bussinessTypeCreateDialog
			ref="bussinessTypeCreateDialog"
			type="103"
			@on-refresh="refreshBussinessTypeList"
		></bussinessTypeCreateDialog>
	</w-collapse>
</template>
<script>
import { mapGetters } from 'vuex'
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
		businessTypeSelectList: {
			type: Array,
			default: () => {
				return []
			}
		},
		billtypeSelect: {
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
		allOrganSelectList: {
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
		outStoreSelectList: {
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
		btnAuth: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	data () {
		return {
			collapseVisible: true,
			rules: {
				userBillCode: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				billType: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				orderDate: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				'organ.id': [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				'inHouse.id': [{ required: true, trigger: 'no', validator: this.validateInHouse }],
				'otherHouse.id': [{ required: true, trigger: 'no', validator: this.validateOutHouse }],
				'otherOrgan.id': [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				'operateMan.id': [{ required: true, message: '该字段不能为空', trigger: 'no' }]
			}
		}
	},
	inject: ['$$orderParent'],
	computed: {
		...mapGetters(['getOrderRequiredList', 'detailsAuthGetter']),
		isChecked () {
			return this.$fxStateMiddleware.isState('billState')(['checked'])(this.organDetails.billState)
		},
		isInHouse () {
			return this.organDetails.applyMode === 0
		},
		isOutHouse () {
			return this.organDetails.applyMode === 1
		},
		isInside () {
			return this.organDetails.billType === 3002 || this.organDetails.billType === 3003
		},
		isSingleInHouse () {
			return this.organDetails.singleInHouseFlag === 1
		},
		inHouseTypeDisabled () {
			return !this.btnAuth.inMode || this.authDisabled
		},
		inHouseDisabled () {
			return !this.btnAuth.inHouse || !this.isSingleInHouse || this.authDisabled
		},
		inHousePlaceholder () {
			return this.isSingleInHouse ? '请选择' : '请在明细中选择'
		},
		isSingleOutHouse () {
			return this.organDetails.singleOutHouseFlag === 1
		},
		outHousePlaceholder () {
			return this.isSingleOutHouse ? '请选择' : '请在明细中选择'
		},
		outHouseTypeDisabled () {
			return !this.btnAuth.outMode || this.authDisabled
		},
		outHouseDisabled () {
			return !this.btnAuth.outHouse || !this.isSingleOutHouse || this.authDisabled
		},
		organLabel () {
			return this.isInside ? '调拨机构：' : '入库方：'
		},
		currentApplyType () {
			return this.$fxTypeMiddleware.getCommonTypeItemByRule('moveBillCreateType')(this.organDetails.billType, this.organDetails.applyMode)
		},
		outStoreSelectListComputed () {
			if (this.currentApplyType.type === 'inside') {
				return this.storeSelectList
			} else {
				return this.outStoreSelectList
			}
		},
		inOrganSelectListComputed () {
			if (this.currentApplyType.type === 'outstore') {
				return this.allOrganSelectList
			} else {
				return this.organSelectList
			}
		},
		outOrganSelectListComputed () {
			if (this.currentApplyType.type === 'instore') {
				return this.allOrganSelectList
			} else {
				return this.organSelectList
			}
		},
		authDisabled () {
			return !this.detailsAuthGetter('store-manage_move-order.edit-move')
		},
		computedRules () {
			if (this.isHand) {
				const orderRequiredList = this.getOrderRequiredList('MoveOrder', this.organDetails.billType)
				const orderRequiredSettingRules = {}
				orderRequiredList.forEach(item => {
					orderRequiredSettingRules[item] = [{ required: true, trigger: 'no', validator: this.validateComputedRules }]
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
		},
		'organDetails.inHouse.id': {
			immediate: true,
			handler (val) {
				this.$emit('on-basic-instore-change', val)
			}
		}
	},
	methods: {
		validate () {
			return new Promise(resolve => {
				this.$refs.form.validate().then(() => {
					if (this.organDetails.organ.id === this.organDetails.otherOrgan.id && !this.isInside) {
						this.$fxMessage.error('入库方与出库方不能相同')
					} else if (this.organDetails.inHouse.id === this.organDetails.otherHouse.id && !!this.organDetails.inHouse.id) {
						this.$fxMessage.error('入库仓库与出库仓库不能相同')
					} else {
						resolve()
					}
				})
			})
		},
		clearDetails () {
			const logger = this.$fxLogger.createInfo('store-manage.move-order.clearDetails', { orderData: this.organDetails })
			return this.$fxApi(`${apiName}.clearDetails`, this.organDetails.id)({ logger }).then(() => {
				this.$emit('on-details-refresh', this.organDetails)
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
			if (this.currentApplyType.type === 'instore' || this.currentApplyType.type === 'inside') {
				this.onOrganChangeConfirm().then(() => {
					this.organDetails.organ = selectItem
					if (this.currentApplyType.type === 'inside') {
						this.organDetails.otherOrgan = selectItem
					}
					this.organDetails.inHouse.id = ''
					this.organDetails.otherHouse.id = ''
					if (this.organDetails.singleInHouseFlag && selectItem.store.length) {
						this.organDetails.inHouse.id = selectItem.store[0].id
					}
					if (this.organDetails.singleOutHouseFlag && selectItem.store.length) {
						this.organDetails.otherHouse.id = selectItem.store[0].id
					}
					this.$emit('update:storeSelectList', selectItem.store)
				})
			} else {
				this.organDetails.organ = selectItem
				this.organDetails.inHouse.id = ''
				console.log(selectItem)
				this.$emit('update:storeSelectList', selectItem.store)
				if (this.currentApplyType.type === 'outstore') {
					const hasInStore = this.tableDetails.some(item => {
						return item.inHouse && item.inHouse.id
					})
					if (hasInStore) {
						this.$emit('on-clear-details-instore')
					}
				}
			}
		},
		onOrganChangeConfirm () {
			return new Promise(resolve => {
				if (this.tableDetails.length === 0) {
					resolve()
				} else {
					let confirmMessage = ''
					switch (this.currentApplyType.type) {
					case 'instore':
						confirmMessage = '更换入库方后，会自动清空入库仓库和明细数据，是否确定更换？'
						break
					case 'inside':
						confirmMessage = '更换调拨机构后，会自动清空入库仓库、出库仓库和明细数据，是否确定更换？'
						break
					case 'outstore':
						confirmMessage = '更换出库方后，会自动清空出库仓库和明细数据，是否确定更换？'
						break
					default:
						break
					}
					this.$fxConfirm(`${confirmMessage}`).then(() => {
						this.clearDetails().then(resolve)
					})
				}
			})
		},
		onOtherOrganChange (id, selectItem) {
			if (this.currentApplyType.type === 'outstore') {
				this.onOrganChangeConfirm().then(() => {
					this.organDetails.otherOrgan = selectItem
					this.organDetails.otherHouse.id = ''
					if (this.organDetails.singleOutHouseFlag && selectItem.store.length) {
						this.organDetails.otherHouse.id = selectItem.store[0].id
					}
					this.$emit('update:outStoreSelectList', selectItem.store)
				})
			} else {
				this.organDetails.otherOrgan = selectItem
				this.organDetails.otherHouse.id = ''
				this.$emit('update:outStoreSelectList', selectItem.store)
				if (this.currentApplyType.type === 'instore') {
					const hasOutStore = this.tableDetails.some(item => {
						return item.outHouse && item.outHouse.id
					})
					if (hasOutStore) {
						this.$emit('on-clear-details-outstore')
					}
				}
			}
		},
		onChangeInHouse (id, item) {
			this.organDetails.inHouse = id
		},
		onAddBissnessTypeClick () {
			this.$refs.bussinessTypeCreateDialog.add()
		},
		refreshBussinessTypeList () {
			this.$emit('on-refresh-bussiness-type-list', this.organDetails)
		},
		onSingleInHouseChange (val) {
			if (!val && this.organDetails.singleOutHouseFlag && this.organDetails.inHouse.id && this.organDetails.inHouse.id === this.organDetails.otherHouse.id) {
				this.$fxMessage.error('当前入库仓库与出库仓库一致,不允许进行多仓切换')
			} else if (val && this.tableDetails.length) {
				this.$fxApi(`${apiName}.checkDetailsHouse`, this.organDetails.id, 'inHouse').then(res => {
					this.onSingleInHouseChangeHandler(val, res)
				})
			} else {
				this.onSingleInHouseChangeHandler(val)
			}
		},
		onSingleInHouseChangeHandler (val, inHouse = { id: '' }) {
			this.organDetails.singleInHouseFlag = val
			if (val && this.currentApplyType.type === 'outstore' && this.tableDetails.length > 0) {
				this.getValidOrganItemInStore().then(() => {
					const itemIndex = this.storeSelectList.findIndex(item => item.id === inHouse.id)
					itemIndex >= 0 ? this.organDetails.inHouse.id = inHouse.id : this.organDetails.inHouse.id = ''
				})
			} else {
				this.organDetails.inHouse.id = inHouse.id
			}
			if (!val) {
				this.$refs.form.clearValidate('inHouse.id')
			}
			if (this.organDetails.id) {
				this.$emit('on-details-refresh')
			}
			if (val && this.storeSelectList.length === 1) {
				this.organDetails.inHouse.id = this.storeSelectList[0].id
			}
		},
		onSingleOutHouseChange (val) {
			if (!val && this.organDetails.singleInHouseFlag && this.organDetails.inHouse.id && this.organDetails.inHouse.id === this.organDetails.otherHouse.id) {
				this.$fxMessage.error('当前入库仓库与出库仓库一致,不允许进行多仓切换')
			} else if (val && this.tableDetails.length) {
				this.$fxApi(`${apiName}.checkDetailsHouse`, this.organDetails.id, 'outHouse').then(res => {
					this.onSingleOutHouseChangeHandler(val, res)
				})
			} else {
				this.onSingleOutHouseChangeHandler(val)
			}
		},
		onSingleOutHouseChangeHandler (val, otherHouse = { id: '' }) {
			this.organDetails.singleOutHouseFlag = val
			if (val && this.currentApplyType.type === 'instore' && this.tableDetails.length > 0) {
				this.getOutStore().then(() => {
					const itemIndex = this.outStoreSelectListComputed.findIndex(item => item.id === otherHouse.id)
					itemIndex >= 0 ? this.organDetails.otherHouse.id = otherHouse.id : this.organDetails.otherHouse.id = ''
				})
			} else {
				this.organDetails.otherHouse.id = otherHouse.id
			}
			if (!val) {
				this.$refs.form.clearValidate('otherHouse.id')
			}
			if (this.organDetails.id) {
				this.$emit('on-details-refresh')
			}
			if (val && this.outStoreSelectListComputed.length === 1) {
				this.organDetails.otherHouse.id = this.outStoreSelectListComputed[0].id
			}
		},
		validateInHouse (rule, value, callback) {
			if (this.organDetails.singleInHouseFlag === 1 && !value) {
				callback(new Error('该字段不能为空'))
			} else {
				callback()
			}
		},
		validateOutHouse (rule, value, callback) {
			if (this.organDetails.singleOutHouseFlag === 1 && !value) {
				callback(new Error('该字段不能为空'))
			} else {
				callback()
			}
		},
		validateComputedRules (rule, value, callback) {
			if (!this.isChecked && !value) {
				callback(new Error('该字段不能为空'))
			} else {
				callback()
			}
		},
		onOrderDateFocus () {
			setTimeout(() => {
				this.$$orderParent.$refs.detailsInfo.checkDetailsUnSaving().catch(() => {
					this.$refs.orderDate.hidePicker()
				})
			}, 100)
		},
		onInStoreChange (id, selectedStore) {
			if (this.currentApplyType.type === 'outstore') {
				this.organDetails.inHouse.id = id
				this.$emit('on-inhouse-save')
				this.getValidOrganItemInStore()
			} else {
				this.organDetails.inHouse.id = id
				this.getInStore(id)
			}
		},
		onOutStoreChange (id, selectedStore) {
			if (this.currentApplyType.type === 'instore') {
				this.organDetails.otherHouse.id = id
				this.getOutStore(id)
				this.$emit('on-outhouse-save')
			} else {
				this.organDetails.otherHouse.id = id
				this.getOutStore(id)
			}
		},
		async getInStore (id) {
			const ids = [id]
			const storeSelectList = await this.$fxApi(`${apiName}.getValidStoreList`, this.organDetails.organ.id)({ data: ids })
			this.$emit('update:storeSelectList', storeSelectList)
			return Promise.resolve()
		},
		async getValidOrganItemInStore () {
			const itemIdList = this.tableDetails.map(item => {
				return item.item.id
			})
			const data = {
				organId: this.organDetails.organ.id,
				itemIdList: itemIdList
			}
			if (this.organDetails.inHouse.id) {
				data.mustShowHouseIdList = [this.organDetails.inHouse.id]
			}
			const storeSelectList = await this.$fxApi(`${apiName}.getValidOrganItemInStoreList`)({ data })
			this.$emit('update:storeSelectList', storeSelectList)
			return Promise.resolve()
		},
		async getOutStore (id) {
			const ids = [id]
			const outStoreSelectList = await this.$fxApi(`${apiName}.getValidStoreList`, this.organDetails.otherOrgan.id)({ data: ids })
			this.$emit('update:outStoreSelectList', outStoreSelectList)
			return Promise.resolve()
		},
		defaultFocus (refName = 'userBillCode') {
			this.$fxUtils.vDoRefFocus(this, refName)
		},
		organTabHandler ({ focus }) {
			this.inHouseTypeDisabled ? this.inHouseDisabled ? focus('operateMan') : focus('inHouse') : focus('singleInHouseFlag')
		},
		singleInHouseFlagTabHandler ({ focus }) {
			this.inHouseDisabled ? focus('operateMan') : focus('inHouse')
		},
		operateManTabHandler ({ focus }) {
			if (!this.isInside) {
				focus('otherOrgan')
			} else if (!this.outHouseTypeDisabled) {
				focus('singleOutHouseFlag')
			} else if (!this.outHouseDisabled) {
				focus('otherHouse')
			} else {
				focus('memo')
			}
		},
		otherOrganTabHandler ({ focus }) {
			this.outHouseTypeDisabled ? this.outHouseDisabled ? focus('memo') : focus('otherHouse') : focus('singleOutHouseFlag')
		},
		singleOutHouseFlagTabHandler ({ focus }) {
			this.outHouseDisabled ? focus('memo') : focus('otherHouse')
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-item-input {
	width: 175px;
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
.form-item__plan-message {
	font-size: 10px;
    position: absolute;
    height: 16px;
    line-height: 16px;
	display: flex;
    width: 175px;
    justify-content: space-between;
}
</style>
