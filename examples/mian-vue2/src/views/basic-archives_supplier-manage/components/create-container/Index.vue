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
						:disabled="billDisabled"
						:supplierTypeList="supplierTypeList"
						:fatherList="fatherList"
						:financialClassList="financialClassList"
						@on-refresh-financial-list="getFinancialList"
					></basicInfo>
					<connectSetting
						ref="connectSetting"
						:organDetails="organDetails"
						:organType="organDetails.organType"
						:defaultHouseList="defaultHouseList"
						:disabled="billDisabled"
						@on-connect-click="onConnectClick"
						@update-details="updateDetails"
					></connectSetting>
					<financialSetting
						ref="financialSetting"
						v-if="isOrganType(['supplier'])"
						:organDetails="organDetails"
						:disabled='billDisabled'
					></financialSetting>
					<otherInfo ref="otherInfo" :organDetails="organDetails" :disabled="billDisabled"></otherInfo>
					<appendInfo ref="appendInfo" :organDetails="organDetails" :disabled="billDisabled"></appendInfo>
					<sourceInfo :organDetails="organDetails" :disabled="billDisabled"></sourceInfo>
				</div>
			</w-scroll-bar>
		</div>
		<template slot="footer">
			<el-button
				ref="cancelBtn"
				v-fx-tab:loop.basic-archives_supplier-manage_details.cancelBtn
				@click="onCancelClick"
			>取消</el-button>
			<el-button
				ref="saveBtn"
				type="primary"
				v-fx-auth:basic-archives_supplier-manage.edit-supplier="!isDel"
				v-fx-tab:loop.basic-archives_supplier-manage_details.saveBtn
				@click="onSaveClick"
			>保存</el-button>
			<el-button
				ref="saveAndAddBtn"
				type="primary"
				v-fx-auth:basic-archives_supplier-manage="fShowAddAndEditBtn"
				v-fx-tab:loop.basic-archives_supplier-manage_details.saveAndAddBtn
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
			defaultHouseList: [],
			defaultInFlag: 0,
			defaultOutFlag: 0,
			getCommonTypeItemById: this.$fxTypeMiddleware.getCommonTypeItemById('supplierType'),
			supplierTypeList: [],
			fatherList: [],
			financialClassList: []
		}
	},
	computed: {
		...mapGetters(['detailsAuthGetter']),
		isAdd () {
			return !this.organDetails.id
		},
		actionText () {
			return this.isAdd ? '新建' : '编辑'
		},
		organTypeName () {
			return this.$fxTypeMiddleware.getCommonTypeItemById('supplierType')(this.organDetails.organType).type
		},
		organTypeLabel () {
			return this.$fxTypeMiddleware.getCommonTypeItemById('supplierType')(this.organDetails.organType).label
		},
		isSupplierTypeMain () {
			return this.$fxTypeMiddleware.isCommonType('supplierType')(['supplier'])(this.organDetails.organType)
		},
		organLabel () {
			return this.isSupplierTypeMain ? '供货商' : '机构'
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
		billDisabled () {
			return !this.detailsAuthGetter('basic-archives_supplier-manage.edit-supplier')
		},
		moreBtnOption () {
			return [{
				show: !this.isAdd && this.detailsAuthGetter('basic-archives_supplier-manage.delete-supplier'),
				label: '删除',
				icon: 'delete-trash',
				click: this.onDeleteClick
			}, {
				show: !this.isAdd && this.isDel && this.detailsAuthGetter('basic-archives_supplier-manage.recover-organ'),
				label: '恢复',
				icon: 'refresh-grey',
				click: this.onRecoverClick
			}]
		}
	},
	created () {
		this.$fxTabkey.init('basic-archives_supplier-manage_details', this)
		this.initBill()
		this.bindTabBeforeDeactivated()
	},
	methods: {
		async initBill () {
			const { openType, addFlag } = this.$route.query
			if (openType === 'add') {
				if (addFlag === 'again') {
					const { organType, organLevel, organId, fatherId, supplierTypeId } = this.$route.query
					this.add(organType, organLevel, organId, fatherId, supplierTypeId)
				} else {
					const { organType, organLevel, organId, fatherId, supplierTypeId } = this.initDefaultOrganData()
					this.add(organType, organLevel, organId, fatherId, supplierTypeId)
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
		async add (organType, organLevel, organId, fatherId, supplierTypeId) {
			const code = await this.getArchiveCode()
			const organDetails = {
				organType,
				organLevel,
				code,
				pinYin: '',
				defaultInFlag: 0,
				defaultOutFlag: 0,
				supplierTypeId,
				organId,
				fatherId,
				enableFlag: 1,
				relAllGoods: true,
				contactList: [],
				resourceList: [],
				appendixList: [],
				sourceList: [],
				taxPlayerFlag: 1,
				isBindSrm: 0,
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
				treeNodeOrganLevel,
				treeNodeOrganId
			} = this.$route.query
			let supplierTypeId = ''
			let organId = ''
			let fatherId = ''
			if (this.$fxTypeMiddleware.isCommonType('supplierType')(['supplier'])(organType)) {
				supplierTypeId = +treeNodeOrganLevel === 0 ? treeNodeId : ''
			} else {
				organId = +treeNodeOrganLevel === 1 ? treeNodeOrganId : ''
				fatherId = +treeNodeOrganLevel === 1 ? treeNodeId : ''
			}
			return {
				organType,
				organLevel: treeNodeOrganLevel,
				supplierTypeId,
				organId,
				fatherId
			}
		},
		async edit (organDetails) {
			await this.getSelectList(organDetails)
			const organTypeLable = this.getCommonTypeItemById(organDetails.organType).label
			this.$fxAppTabs.setTabTitle({ organTypeLable, name: organDetails.name })
			organDetails.supplierTypeId = organDetails.supplierType ? organDetails.supplierType.id : ''
			this.organDetails = organDetails
			this.defaultInFlag = this.organDetails.defaultInFlag
			this.defaultOutFlag = this.organDetails.defaultOutFlag
			this.defaultHouseList = await this.$fxApi('supplier.getDefaultHouseSelect', this.organDetails.id)({ data: [] })
			this.fxDataVerification.resetData(this.organDetails)
			this.$nextTick(() => {
				if (this.billDisabled) {
					this.$fxUtils.vDoRefFocus(this, 'cancelBtn')
				} else {
					this.$refs.basicInfo.defaultFocus('name')
				}
			})
			return Promise.resolve()
		},
		getArchiveCode () {
			return this.$fxApi('archiveCode.get', 'Supplier_Organ')
		},
		getSupplierTypeList () {
			return this.$fxApi('supplierType.getSupplierTypeList').then(res => {
				this.supplierTypeList = res
				return Promise.resolve()
			})
		},
		getFatherList (organDetails) {
			const organLevel = this.$fxTypeMiddleware.getCommonTypeItemById('supplierType')(organDetails.organType).organLevel
			return this.$fxApi('supplier.getFatherList', organLevel, organDetails.id)({ data: [organDetails.fatherId || ''] }).then(res => {
				this.fatherList = res
				return Promise.resolve(res)
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
				this.getSupplierTypeList(),
				this.getFatherList(organDetails),
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
					resolve()
				}).catch(() => {
					this.$fxMessage.warning('请填写必填信息')
				})
			})
		},
		onSaveOrganHandler () {
			if (!this.organDetails.id) {
				const logger = this.$fxLogger.createInfo('basic-archives.supplier-manage.add', { supplier: this.organDetails.name, type: this.organTypeLabel })
				return this.$fxApi('supplier.add')({ data: this.organDetails, logger }).then(this.getSource).then(res => {
					const organTypeLable = this.getCommonTypeItemById(res.organType).label
					this.$fxAppTabs.setTabTitle({ organTypeLable, name: res.name })
					this.$fxAppTabs.setTabPathQuery({ openType: 'edit', id: res.id, organType: res.organType })
					this.$set(this.organDetails, 'id', res.id)
					this.$set(this.organDetails, 'sourceList', res.sourceList)
					this.$set(this.organDetails, 'createMan', res.createMan)
					this.fxDataVerification.resetData(this.organDetails)
					return Promise.resolve()
				})
			} else {
				if (this.fxDataVerification.checkData(this.organDetails)) {
					this.$fxMessage.success('保存成功')
					return Promise.resolve(this.organDetails)
				} else {
					const logger = this.$fxLogger.createInfo('basic-archives.supplier-manage.update', this.createLoggerParams())
					return this.$fxApi('supplier.saveDetails', this.organDetails.id)({ data: this.organDetails, logger }).then(res => {
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
			originData.supplierTypeName = this.getSupplierTypeName(originData.supplierType)
			originData.financeSortName = this.getFinanceSortName(originData.financeSortId)
			if (this.isOrganType(['supplier'])) {
				originData.defaultInHouseName = this.getDefaultHouseName(originData.defaultInHouseId)
				originData.defaultOutHouseName = this.getDefaultHouseName(originData.defaultOutHouseId)
				originData.accountPeriod = originData.financeSetting.accountPeriod
				originData.monthBalanceWay = originData.financeSetting.monthBalanceWay
				originData.monthBalanceCycle = originData.financeSetting.monthBalanceCycle
			}
			originData.resourceList.forEach(item => {
				item.typeName || (item.typeName = this.getResourceTypeName(item.type))
			})
			const organDetails = this.$fxUtils.deepClone(this.organDetails)
			organDetails.fatherName = this.getFatherName(organDetails.fatherId)
			organDetails.supplierTypeName = this.getSupplierTypeName(organDetails.supplierType)
			organDetails.financeSortName = this.getFinanceSortName(organDetails.financeSortId)
			if (this.isOrganType(['supplier'])) {
				organDetails.defaultInHouseName = this.getDefaultHouseName(organDetails.defaultInHouseId)
				organDetails.defaultOutHouseName = this.getDefaultHouseName(organDetails.defaultOutHouseId)
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
			return (this.fatherList.find(item => {
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
		getSupplierTypeName (id) {
			if (!id) {
				return ''
			}
			return (this.supplierTypeList.find(item => {
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
				message: `该操作会替换该供货商已有默认${this.confirmInfo}仓库，是否确定更换？`,
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
		updateDetails () {
			this.getDetails(this.organDetails.id).then(this.getSource).then(res => {
				this.organDetails = res
			})
		},
		getSource (organDetails) {
			return this.$fxApi('source.getSupplierList', organDetails.organType, organDetails.id).then(sourceList => {
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
			this.$fxConfirm(`是否确定删除当前${this.organLabel}?`)
				.then(this.onDeleteHandler)
				.then(this.onCancelClick)
		},
		onDeleteHandler () {
			const api = !this.isDel ? 'delete' : 'recyclingDelete'
			const del = !this.isDel ? 'delete' : 'recyclingDelete'
			const logger = this.$fxLogger.createInfo(`basic-archives.supplier-manage.${del}`, { supplier: this.organDetails.name })
			return this.$fxApi(`supplier.${api}`, this.organDetails.organType, this.organDetails.id)({ logger }).then(res => {
				this.fxDataVerification.resetData(this.organDetails)
				return Promise.resolve()
			})
		},
		onRecoverClick () {
			this.$fxConfirm(`是否确定恢复当前${this.organLabel}？`)
				.then(this.onRecoverHandler)
				.then(this.onCancelClick)
		},
		onRecoverHandler () {
			const logger = this.$fxLogger.createInfo('basic-archives.supplier-manage.recover', { supplier: this.organDetails.name })
			return this.$fxApi('supplier.recover', this.organDetails.organType, this.organDetails.id)({ logger }).then(res => {
				this.fxDataVerification.resetData(this.organDetails)
				return Promise.resolve()
			})
		},
		onConnectClick (next) {
			this.onSaveClick().then(next)
		},
		verificationDetails () {
			return this.isDel ? Promise.resolve() : this.fxDataVerification.checkComfirm(this.organDetails)
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
			const api = isRecycle === 'true' ? 'getSupplierDetailsRecycling' : 'getSupplierDetails'
			return this.$fxApi(`supplier.${api}`, id).then(res => {
				return Promise.resolve(res)
			})
		},
		getSourceHandler (organType, id) {
			return this.$fxApi('source.getSupplierList', organType, id).then(res => {
				return Promise.resolve(res)
			})
		},
		addOrganAgain () {
			const {
				organType,
				organLevel,
				organId,
				fatherId,
				supplierTypeId
			} = this.organDetails
			this.$fxAppTabs.tabsPush({
				path: 'supplierManageDetail',
				query: {
					openType: 'add',
					addFlag: 'again',
					organType,
					organLevel,
					organId,
					fatherId,
					supplierTypeId
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
