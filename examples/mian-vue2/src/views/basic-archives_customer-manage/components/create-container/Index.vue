<template>
	<fx-bill-container
		:title="actionText"
		:moreBtnOption="moreBtnOption"
	>
		<template slot="sub">
			<span class="create-organ__type-label">{{organTypeLabel}}</span>
		</template>
		<div class="create-organ">
			<w-scroll-bar>
				<div class="create-organ__content">
					<basicInfo
						ref="basicInfo"
						:organDetails="organDetails"
						:disabled='editDisabled'
						:customerTypeList="customerTypeList"
						:customerGroupList="customerGroupList"
						:financialClassList="financialClassList"
						@on-refresh-financial-list="getFinancialList"
					></basicInfo>
					<connectSetting
						ref="connectSetting"
						v-show="!isAdd"
						:organDetails="organDetails"
						:organType="organDetails.organType"
						:relStockPlanList="relStockPlanList"
						:defaultHouseList="defaultHouseList"
						@on-connect-click="onConnectClick"
						:disabled='editDisabled'
					></connectSetting>
					<financialSetting
						ref="financialSetting"
						v-if="isOrganType(['customer'])"
						:organDetails="organDetails"
						:disabled='editDisabled'
					></financialSetting>
					<otherInfo ref="otherInfo" :organDetails="organDetails" :disabled='editDisabled'></otherInfo>
					<appendInfo ref="appendInfo" :organDetails="organDetails" :disabled='editDisabled'></appendInfo>
					<sourceInfo :organDetails="organDetails" :disabled='editDisabled'></sourceInfo>
				</div>
			</w-scroll-bar>
		</div>
		<template slot="footer">
			<el-button
				ref="cancelBtn"
				v-fx-tab:loop.basic-archives_customer-manage_details.cancelBtn
				@click="onCancelClick"
			>取消</el-button>
			<el-button
				ref="saveBtn"
				type="primary"
				v-fx-auth:basic-archives_customer-manage.edit-customer="!isDel"
				v-fx-tab:loop.basic-archives_customer-manage_details.saveBtn
				@click="onSaveClick"
			>保存</el-button>
			<el-button
				ref="saveAndAddBtn"
				type="primary"
				v-fx-auth:basic-archives_customer-manage="fShowAddAndEditBtn"
				v-fx-tab:loop.basic-archives_customer-manage_details.saveAndAddBtn
				@click="onSaveAndAddClick"
			>保存并新建</el-button>
		</template>
	</fx-bill-container>
</template>
<script>
import { mapGetters } from 'vuex'
import basicInfo from './BasicInfo.vue'
import connectSetting from './ConnectSetting.vue'
import financialSetting from './FinancialSetting.vue'
import otherInfo from './OtherInfo.vue'
import appendInfo from './AppendInfo.vue'
import sourceInfo from './SourceInfo.vue'
export default {
	name: 'createContainer',
	components: {
		basicInfo,
		connectSetting,
		financialSetting,
		otherInfo,
		appendInfo,
		sourceInfo
	},
	data () {
		return {
			organDetails: {},
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			relStockPlanList: [],
			defaultHouseList: [],
			defaultInFlag: 0,
			defaultOutFlag: 0,
			getCommonTypeItemById: this.$fxTypeMiddleware.getCommonTypeItemById('customerOrganType'),
			customerTypeList: [],
			customerGroupList: [],
			financialClassList: []
		}
	},
	computed: {
		...mapGetters(['detailsAuthGetter']),
		isAdd () {
			return !this.organDetails.id
		},
		actionText () {
			return !this.organDetails.id ? '新建' : '编辑'
		},
		organTypeName () {
			return this.$fxTypeMiddleware.getCommonTypeItemById('customerOrganType')(this.organDetails.organType).type
		},
		organTypeLabel () {
			return this.$fxTypeMiddleware.getCommonTypeItemById('customerOrganType')(this.organDetails.organType).label
		},
		confirmInfo () {
			return this.organDetails.defaultInFlag ? (this.organDetails.defaultOutFlag ? '入库/出库' : '入库') : '出库'
		},
		isOrganType () {
			return (type) => {
				return this.$fxTypeMiddleware.isCommonType('allOrganType')(type)(this.organDetails.organType)
			}
		},
		isDel () {
			return !!this.organDetails.delFlag
		},
		editDisabled () {
			return !this.detailsAuthGetter('basic-archives_customer-manage.edit-customer')
		},
		moreBtnOption () {
			return [{
				show: !this.isAdd && !this.isJsdCustomer && this.detailsAuthGetter('basic-archives_customer-manage.delete-customer'),
				label: '删除',
				icon: 'delete-trash',
				click: this.onDeleteClick
			}, {
				show: !this.isAdd && this.isDel && this.detailsAuthGetter('basic-archives_customer-manage.recover-customer'),
				label: '恢复',
				icon: 'refresh-grey',
				click: this.onRecoverClick
			}]
		},
		isJsdCustomer () {
			return this.organDetails.sourceList[0].sourceType === 3
		}
	},
	created () {
		this.$fxTabkey.init('basic-archives_customer-manage_details', this)
		this.initBill()
		this.bindTabBeforeDeactivated()
	},
	methods: {
		async initBill () {
			const { openType, addFlag } = this.$route.query
			if (openType === 'add') {
				if (addFlag === 'again') {
					const { organType, organLevel, organId, fatherId, customerTypeId, customerGroupId } = this.$route.query
					this.add(organType, organLevel, organId, fatherId, customerTypeId, customerGroupId)
				} else {
					const { organType, organLevel, organId, fatherId, customerTypeId, customerGroupId } = this.initDefaultOrganData()
					this.add(organType, organLevel, organId, fatherId, customerTypeId, customerGroupId)
				}
			} else if (openType === 'edit') {
				const { id, isRecycle, organType } = this.$route.query
				this.onEditHandler({ id, organType, isRecycle }).then(this.edit)
			}
		},
		bindTabBeforeDeactivated () {
			this.$fxAppTabs.onTabBeforeDeactivated(() => {
				return this.verificationDetails()
			}, this)
		},
		async add (organType, organLevel, organId, fatherId, customerTypeId, customerGroupId) {
			const code = await this.getArchiveCode()
			const organDetails = {
				organType,
				organLevel,
				code,
				pinYin: '',
				customerTypeId,
				customerGroupId,
				defaultInFlag: 0,
				defaultOutFlag: 0,
				relStockPlanFlag: 0,
				stockPlanId: '',
				fatherId,
				organId,
				enableFlag: 1,
				relAllGoods: true,
				contactList: [],
				resourceList: [],
				appendixList: [],
				taxPlayerFlag: 1,
				financeSetting: {
					accountPeriod: 1,
					monthBalanceWay: '2-1',
					monthBalanceCycle: 1
				}
			}
			await this.getSelectList(organDetails)
			this.organDetails = organDetails
			this.defaultInFlag = 0
			this.defaultOutFlag = 0
			this.defaultHouseList = []
			this.fxDataVerification.resetData(this.organDetails)
			this.$nextTick(() => {
				this.$refs.basicInfo.defaultFocus('code')
			})
		},
		initDefaultOrganData () {
			const {
				organType,
				treeNodeId,
				treeNodeTypeId,
				treeNodeOrganLevel,
				treeNodeOrganId
			} = this.$route.query
			let customerTypeId = ''
			let customerGroupId = ''
			let fatherId = ''
			let organId = ''
			if (this.$fxTypeMiddleware.isCommonType('customerOrganType')(['customer'])(organType)) {
				if (+treeNodeOrganLevel === 0.5) {
					customerTypeId = treeNodeTypeId
					customerGroupId = treeNodeId
				}
			} else {
				if (+treeNodeOrganLevel === 1) {
					fatherId = treeNodeId
					organId = treeNodeOrganId
				}
			}
			return {
				organType,
				organLevel: treeNodeOrganLevel,
				customerTypeId,
				customerGroupId,
				organId,
				fatherId
			}
		},
		async edit (organDetails) {
			await this.getSelectList(organDetails)
			const organTypeLable = this.getCommonTypeItemById(organDetails.organType).label
			this.$fxAppTabs.setTabTitle({ organTypeLable, name: organDetails.name })
			this.organDetails = organDetails
			this.defaultInFlag = this.organDetails.defaultInFlag
			this.defaultOutFlag = this.organDetails.defaultOutFlag
			this.defaultHouseList = await this.$fxApi('customer.getDefaultHouseSelect', this.organDetails.id)({ data: [] })
			this.relStockPlanList = await this.$fxApi('customer.getCustomerStockPlan', this.organDetails.id)
			this.fxDataVerification.resetData(this.organDetails)
			this.$nextTick(() => {
				if (this.editDisabled) {
					this.$fxUtils.vDoRefFocus(this, 'cancelBtn')
				} else {
					this.$refs.basicInfo.defaultFocus('name')
				}
			})
		},
		getArchiveCode () {
			return this.$fxApi('archiveCode.get', 'Customer_Organ')
		},
		getCustomerTypeList () {
			return this.$fxApi('customerType.getList').then(res => {
				this.customerTypeList = res
				return Promise.resolve()
			})
		},
		getCustomerGroupList (organDetails) {
			const organLevel = this.$fxTypeMiddleware.getCommonTypeItemById('customerOrganType')(organDetails.organType).organLevel
			return this.$fxApi('customerType.getFatherList', organLevel, organDetails.id)({ data: [organDetails.fatherId || ''] }).then(res => {
				this.customerGroupList = res
				return Promise.resolve()
			})
		},
		getFinancialList (organDetails = this.organDetails) {
			const data = organDetails.financeSortId ? [organDetails.financeSortId] : []
			return this.$fxApi('finance.getFinancialList')({ data }).then(res => {
				this.financialClassList = res
				return Promise.resolve(res)
			})
		},
		getSelectList (organDetails) {
			return Promise.all([
				this.getCustomerTypeList(),
				this.getCustomerGroupList(organDetails),
				this.getFinancialList(organDetails)
			])
		},
		onSaveClick () {
			return this.onValidateFormData().then(this.onChangeDefaultStoreConfirm).then(this.onSaveOrganHandler)
		},
		onSaveAndAddClick () {
			this.onValidateFormData()
				.then(this.onChangeDefaultStoreConfirm)
				.then(this.onSaveOrganHandler)
				.then(this.addOrganAgain)
		},
		onValidateFormData () {
			return new Promise(resolve => {
				this.$refs.basicInfo.validate().then(() => {
					this.$refs.connectSetting.validate().then(() => {
						resolve()
					}).catch(() => {
						this.$fxMessage.warning('请填写必填信息')
					})
				}).catch(() => {
					this.$fxMessage.warning('请填写必填信息')
				})
			})
		},
		onSaveOrganHandler () {
			if (!this.organDetails.id) {
				const logger = this.$fxLogger.createInfo('basic-archives.customer-manage.add', { customer: this.organDetails.name, type: this.organTypeLabel })
				return this.$fxApi('customer.add')({ data: this.organDetails, logger }).then(this.getSource).then(res => {
					const organTypeLable = this.getCommonTypeItemById(res.organType).label
					this.$fxAppTabs.setTabTitle({ organTypeLable, name: res.name })
					this.$fxAppTabs.setTabPathQuery({ openType: 'edit', id: res.id, organType: res.organType })
					this.organDetails = res
					this.$set(this.organDetails, 'sourceList', res.sourceList)
					this.fxDataVerification.resetData(this.organDetails)
					return Promise.resolve()
				})
			} else {
				if (this.fxDataVerification.checkData(this.organDetails)) {
					this.$fxMessage.success('保存成功')
					return Promise.resolve(this.organDetails)
				} else {
					const logger = this.$fxLogger.createInfo('basic-archives.customer-manage.update', this.createLoggerParams())
					return this.$fxApi('customer.saveDetails', this.organDetails.id)({ data: this.organDetails, logger }).then(res => {
						this.$fxAppTabs.setTabTitle({ organTypeLable: this.organTypeLabel, name: res.name })
						this.defaultInFlag = this.organDetails.defaultInFlag
						this.defaultOutFlag = this.organDetails.defaultOutFlag
						this.fxDataVerification.resetData(this.organDetails)
						return Promise.resolve()
					})
				}
			}
		},
		createLoggerParams () {
			const originData = this.fxDataVerification.getOriginData()
			originData.fatherName = this.getFatherName(originData.fatherId)
			originData.customerTypeName = this.getCustomerTypeName(originData.customerTypeId)
			originData.financeSortName = this.getFinanceSortName(originData.financeSortId)
			originData.customerGroupName = this.getFatherName(originData.customerGroupId)
			if (this.isOrganType(['customer'])) {
				originData.defaultInHouseName = this.getDefaultHouseName(originData.defaultInHouseId)
				originData.defaultOutHouseName = this.getDefaultHouseName(originData.defaultOutHouseId)
				originData.stockPlanName = this.getStockPlanName(originData.stockPlanId)
				originData.accountPeriod = originData.financeSetting.accountPeriod
				originData.monthBalanceWay = originData.financeSetting.monthBalanceWay
				originData.monthBalanceCycle = originData.financeSetting.monthBalanceCycle
			}
			originData.resourceList.forEach(item => {
				item.typeName || (item.typeName = this.getResourceTypeName(item.type))
			})
			const organDetails = this.$fxUtils.deepClone(this.organDetails)
			organDetails.fatherName = this.getFatherName(organDetails.fatherId)
			organDetails.customerTypeName = this.getCustomerTypeName(organDetails.customerTypeId)
			organDetails.financeSortName = this.getFinanceSortName(organDetails.financeSortId)
			organDetails.customerGroupName = this.getFatherName(organDetails.customerGroupId)
			if (this.isOrganType(['customer'])) {
				organDetails.defaultInHouseName = this.getDefaultHouseName(organDetails.defaultInHouseId)
				organDetails.defaultOutHouseName = this.getDefaultHouseName(organDetails.defaultOutHouseId)
				organDetails.stockPlanName = this.getStockPlanName(organDetails.stockPlanId)
				organDetails.accountPeriod = organDetails.financeSetting.accountPeriod
				organDetails.monthBalanceWay = organDetails.financeSetting.monthBalanceWay
				organDetails.monthBalanceCycle = organDetails.financeSetting.monthBalanceCycle
			}
			organDetails.resourceList.forEach(item => {
				item.typeName || (item.typeName = this.getResourceTypeName(item.type))
			})
			return {
				pre: originData,
				cur: organDetails,
				name: organDetails.name,
				type: this.organTypeLabel
			}
		},
		getFatherName (id) {
			if (!id) {
				return ''
			}
			return (this.customerGroupList.find(item => {
				return item.id === id
			}) || {}).name
		},
		getFinanceSortName (id) {
			if (!id) {
				return ''
			}
			return (this.financialClassList.find(item => {
				return item.id === id
			}) || {}).name
		},
		getCustomerTypeName (id) {
			if (!id) {
				return ''
			}
			return (this.customerTypeList.find(item => {
				return item.id === id
			}) || {}).name
		},
		getDefaultHouseName (id) {
			if (!id) {
				return ''
			}
			return (this.defaultHouseList.find(item => {
				return item.id === id
			}) || {}).name
		},
		getStockPlanName (id) {
			if (!id) {
				return ''
			}
			return (this.relStockPlanList.find(item => {
				return item.id === id
			}) || {}).name
		},
		getResourceTypeName (type) {
			const resourceTypeList = this.$refs.otherInfo.getResourceTypeList()
			const resourceType = resourceTypeList.find(item => item.id === type)
			return resourceType ? resourceType.name : ''
		},
		onChangeDefaultStoreConfirm () {
			if (!this.organDetails.defaultInFlag && !this.organDetails.defaultOutFlag) return Promise.resolve()
			if (this.defaultInFlag && this.defaultOutFlag) return Promise.resolve()
			if (this.organDetails.defaultInFlag === this.defaultInFlag && this.organDetails.defaultOutFlag === this.defaultOutFlag) return Promise.resolve()
			return this.$fxConfirm({
				message: `该操作会替换该客户已有默认${this.confirmInfo}仓库，是否确定更换？`,
				option: {
					confirmButtonText: '是',
					cancelButtonText: '否'
				}
			}).catch(() => {
				this.organDetails.defaultInFlag = this.defaultInFlag
				this.organDetails.defaultOutFlag = this.defaultOutFlag
				return new Promise(() => {})
			})
		},
		getSource (organDetails) {
			return this.$fxApi('source.getCustomerList', organDetails.organType, organDetails.id).then(sourceList => {
				return Promise.resolve({
					...organDetails,
					sourceList
				})
			})
		},
		onCancelClick () {
			this.$fxAppTabs.tabsRemove()
		},
		onDeleteClick () {
			this.$fxConfirm('是否确定删除当前客户')
				.then(this.onDeleteHandler)
				.then(this.onCancelClick)
		},
		onDeleteHandler () {
			const api = !this.isDel ? 'delete' : 'recyclingDelete'
			const del = !this.isDel ? 'delete' : 'recyclingDelete'
			const logger = this.$fxLogger.createInfo(`basic-archives.customer-manage.${del}`, { customer: this.organDetails.name })
			return this.$fxApi(`customer.${api}`, this.organDetails.organType, this.organDetails.id)({ logger }).then(res => {
				this.fxDataVerification.resetData(this.organDetails)
				return Promise.resolve()
			})
		},
		onRecoverClick () {
			this.$fxConfirm('是否确定恢复当前客户？')
				.then(this.onRecoverHandler)
				.then(this.onCancelClick)
		},
		onRecoverHandler () {
			const logger = this.$fxLogger.createInfo('basic-archives.customer-manage.recover', { customer: this.organDetails.name })
			return this.$fxApi('customer.recover', this.organDetails.organType, this.organDetails.id)({ logger }).then(res => {
				this.fxDataVerification.resetData(this.organDetails)
				return Promise.resolve()
			})
		},
		verificationDetails () {
			return this.isDel ? Promise.resolve() : this.fxDataVerification.checkComfirm(this.organDetails)
		},
		onConnectClick (next) {
			this.onSaveClick().then(next)
		},
		fShowAddAndEditBtn (hasAuthByDetails) {
			if (this.isDel) {
				return false
			}
			return hasAuthByDetails(`add-${this.organTypeName}`)
		},
		onEditHandler ({ id, organType, isRecycle }) {
			return Promise.all([
				this.getDetails(id, isRecycle),
				this.getSourceHandler(organType, id)])
				.then(([details, sourceList]) => {
					return Promise.resolve({
						...details,
						sourceList
					})
				})
		},
		getDetails (id, isRecycle) {
			const api = isRecycle === 'true' ? 'customer.getDetailsRecycling' : 'customer.getDetails'
			return this.$fxApi(api, id).then(res => {
				return Promise.resolve(res)
			})
		},
		getSourceHandler (organType, id) {
			return this.$fxApi('source.getCustomerList', organType, id).then(res => {
				return Promise.resolve(res)
			})
		},
		addOrganAgain () {
			const {
				organType,
				organLevel,
				customerTypeId,
				customerGroupId,
				organId,
				fatherId
			} = this.organDetails
			this.$fxAppTabs.tabsPush({
				path: 'customerManageDetail',
				query: {
					openType: 'add',
					addFlag: 'again',
					organType,
					organLevel,
					customerTypeId,
					customerGroupId,
					organId,
					fatherId
				}
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.create-organ {
	flex: 1
	display: flex;
	flex-direction: column;
	overflow: auto;
	&__type {
		height: 30px
		line-height: 30px
		padding-left: 20px
		&-label {
			color: $fxDefaultColor
			font-size: 15px
			font-weight: 900
		}
	}
	&__content {
		flex: 1
		overflow:auto
		padding-right: 10px
	}
}
</style>
