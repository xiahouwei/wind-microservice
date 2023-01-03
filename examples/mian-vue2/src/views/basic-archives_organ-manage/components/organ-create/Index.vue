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
						:parentOrganList="parentOrganList"
						:areaList="areaList"
						:financialClassList="financialClassList"
						@on-refresh-financial-list="getFinancialList"
					></basicInfo>
					<connectSetting
						v-if="!isWorkshop"
						ref="connectSetting"
						:organType="organDetails.organType"
						:organDetails="organDetails"
						:defaultHouseList="defaultHouseList"
						:disabled="billDisabled"
						@on-connect-click="onConnectClick"
					></connectSetting>
					<otherInfo v-if="!isWorkshop" ref="otherInfo" :organDetails="organDetails" :disabled="billDisabled"></otherInfo>
					<appendInfo v-if="!isWorkshop" ref="appendInfo" :organDetails="organDetails" :disabled="billDisabled"></appendInfo>
					<sourceInfo v-if="!isWorkshop" :organDetails="organDetails"></sourceInfo>
				</div>
			</w-scroll-bar>
		</div>
		<template slot="footer">
			<el-button
				ref="cancelBtn"
				v-fx-tab:loop.basic-archives_organ-manage_details.cancelBtn
				@click="onCancelClick"
			>取消</el-button>
			<el-button
				ref="saveBtn"
				v-fx-auth:basic-archives_organ-manage.edit-organ="!isDel"
				v-fx-tab:loop.basic-archives_organ-manage_details.saveBtn
				type="primary"
				@click="onSaveClick"
			>保存</el-button>
			<el-button
				ref="saveAndAddBtn"
				v-fx-auth:basic-archives_organ-manage="fShowAddAndEditBtn"
				v-fx-tab:loop.basic-archives_organ-manage_details.saveAndAddBtn
				type="primary"
				@click="onSaveAndAddClick"
			>保存并新建</el-button>
		</template>
	</fx-bill-container>
</template>
<script>
import { mapGetters } from 'vuex'
import basicInfo from './BasicInfo.vue'
import connectSetting from './ConnectSetting.vue'
import otherInfo from './OtherInfo.vue'
import appendInfo from './AppendInfo.vue'
import sourceInfo from './SourceInfo.vue'
export default {
	name: 'createOrgan',
	components: {
		basicInfo,
		connectSetting,
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
			getCommonTypeItemById: this.$fxTypeMiddleware.getCommonTypeItemById('organType'),
			parentOrganList: [],
			areaList: [],
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
		isWorkshop () {
			return this.isOrganType('workshop')
		},
		organTypeName () {
			return this.getCommonTypeItemById(this.organDetails.organType).type
		},
		organTypeLabel () {
			return this.getCommonTypeItemById(this.organDetails.organType).label
		},
		isOrganType () {
			return (type) => {
				return this.$fxTypeMiddleware.isCommonType('organType')(type)(this.organDetails.organType)
			}
		},
		confirmInfo () {
			return this.organDetails.defaultInFlag ? (this.organDetails.defaultOutFlag ? '入库/出库' : '入库') : '出库'
		},
		isDel () {
			return !!this.organDetails.delFlag
		},
		billDisabled () {
			return !this.detailsAuthGetter('basic-archives_organ-manage.edit-organ')
		},
		moreBtnOption () {
			return [{
				show: !this.isAdd && this.detailsAuthGetter('basic-archives_organ-manage.delete-organ') && !this.isShopOrRdc,
				label: '删除',
				icon: 'delete-trash',
				click: this.onDeleteClick
			}, {
				show: !this.isAdd && this.isDel && this.detailsAuthGetter('basic-archives_organ-manage.recover-organ'),
				label: '恢复',
				icon: 'refresh-grey',
				click: this.onRecoverClick
			}]
		},
		isShopOrRdc () {
			return this.isOrganType(['shop', 'rdc'])
		}
	},
	created () {
		this.$fxTabkey.init('basic-archives_organ-manage_details', this)
		this.initBill()
		this.bindTabBeforeDeactivated()
	},
	methods: {
		async initBill () {
			const { openType, addFlag } = this.$route.query
			if (openType === 'add') {
				if (addFlag === 'again') {
					const { organType, organLevel, organId, fatherId, regionId } = this.$route.query
					this.add(organType, organLevel, organId, fatherId, regionId)
				} else {
					const { organType, organLevel, organId, fatherId, regionId } = await this.initDefaultOrganData()
					this.add(organType, organLevel, organId, fatherId, regionId)
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
		async add (organType, organLevel, organId, fatherId, regionId) {
			const code = await this.getArchiveCode()
			const organDetails = {
				organType,
				organLevel,
				organId,
				code,
				pinYin: '',
				defaultInFlag: 0,
				defaultOutFlag: 0,
				enableFlag: 1,
				stockFlag: 0,
				offsetFlag: 1,
				fatherId,
				regionId,
				relAllGoods: true,
				contactList: [],
				resourceList: [],
				appendixList: [],
				sourceList: [],
				taxPlayerFlag: 1,
				enableLocation: 0,
				shelfFlag: 0
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
			return Promise.resolve()
		},
		async initDefaultOrganData () {
			const {
				organType,
				rootDataId,
				treeNodeId,
				treeNodeOrganLevel,
				treeNodeOrganType,
				treeNodeOrganId,
				treeNodeTreeType
			} = this.$route.query
			const treeNode = {
				id: treeNodeId,
				organLevel: treeNodeOrganLevel,
				organType: treeNodeOrganType,
				organId: treeNodeOrganId,
				treeType: treeNodeTreeType
			}
			let fatherId = ''
			let regionId = ''
			if (this.$fxTypeMiddleware.isCommonType('organType')(['store', 'section', 'workshop'])(organType)) {
				if (treeNode && treeNode.organType) {
					const organInfo = await this.getOrganDetails(treeNode.organId)
					regionId = organInfo.regionId
					fatherId = treeNode.id
				}
			} else if (this.$fxTypeMiddleware.isCommonType('organType')(['shop', 'rdc'])(organType)) {
				fatherId = rootDataId
				if (treeNode && !treeNode.organType && !treeNode.treeType) {
					regionId = treeNode.id
				} else if (treeNode && treeNode.organType) {
					const organInfo = await this.getOrganDetails(treeNode.organId)
					regionId = organInfo.regionId
				}
			}
			return {
				organType,
				organLevel: treeNode && treeNode.organLevel,
				organId: treeNode.organId || '',
				fatherId,
				regionId
			}
		},
		async edit (organDetails) {
			await this.getSelectList(organDetails)
			const organTypeLable = this.getCommonTypeItemById(organDetails.organType).label
			this.$fxAppTabs.setTabTitle({ organTypeLable, name: organDetails.name })
			organDetails.regionId = organDetails.regionId || ''
			this.organDetails = organDetails
			this.defaultInFlag = this.organDetails.defaultInFlag
			this.defaultOutFlag = this.organDetails.defaultOutFlag
			this.defaultHouseList = await this.$fxApi('organ.getDefaultHouseSelect', this.organDetails.id)({ data: [] })
			this.fxDataVerification.resetData(this.organDetails)
			this.$nextTick(() => {
				if (this.billDisabled) {
					this.$fxUtils.vDoRefFocus(this, 'cancelBtn')
				} else if (this.isShopOrRdc) {
					this.$refs.basicInfo.defaultFocus('pinYin')
				} else {
					this.$refs.basicInfo.defaultFocus('name')
				}
			})
			return Promise.resolve()
		},
		getArchiveCode () {
			return this.$fxApi('archiveCode.get', 'Organ')
		},
		getParentOrganList (organDetails) {
			const organLevel = this.$fxTypeMiddleware.getCommonTypeItemById('organType')(organDetails.organType).organLevel
			return this.$fxApi('organ.getParentOrgan', organLevel, this.organDetails.id).then(res => {
				if (this.$fxTypeMiddleware.isCommonType('organType')('workshop')(organDetails.organType)) {
					// 新建车间时，上级机构只能是 配送中心
					this.parentOrganList = res.filter(item => item.organType === '1')
				} else {
					this.parentOrganList = res
				}
				return Promise.resolve(res)
			})
		},
		getAreaList () {
			return this.$fxApi('region.getAreaList').then(res => {
				this.areaList = res
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
				this.getParentOrganList(organDetails),
				this.getAreaList(),
				this.getFinancialList(organDetails)
			])
		},
		onSaveClick () {
			return this.onValidateFormData()
				.then(this.onChangeDefaultStoreConfirm)
				.then(this.onSaveOrganHandler)
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
				const logger = this.$fxLogger.createInfo('basic-archives.organ-manage.add', { shop: this.organDetails.name, type: this.organTypeLabel })
				return this.$fxApi('organ.addOrganDetails')({ data: this.organDetails, logger }).then(this.mergeSource2OrganDetail).then(res => {
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
					const logger = this.$fxLogger.createInfo('basic-archives.organ-manage.update', this.createLoggerParams())
					return this.$fxApi('organ.saveOrganDetails', this.organDetails.id)({ data: this.organDetails, logger }).then(res => {
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
			originData.regionName = this.getRegionName(originData.regionId)
			originData.financeSortName = this.getFinanceSortName(originData.financeSortId)
			if (this.isOrganType(['shop', 'rdc'])) {
				originData.defaultInHouseName = this.getDefaultHouseName(originData.defaultInHouseId)
				originData.defaultOutHouseName = this.getDefaultHouseName(originData.defaultOutHouseId)
			}
			originData.resourceList.forEach(item => {
				item.typeName || (item.typeName = this.getResourceTypeName(item.type))
			})
			const organDetails = this.$fxUtils.deepClone(this.organDetails)
			organDetails.fatherName = this.getFatherName(organDetails.fatherId)
			organDetails.regionName = this.getRegionName(organDetails.regionId)
			organDetails.financeSortName = this.getFinanceSortName(organDetails.financeSortId)
			if (this.isOrganType(['shop', 'rdc'])) {
				organDetails.defaultInHouseName = this.getDefaultHouseName(organDetails.defaultInHouseId)
				organDetails.defaultOutHouseName = this.getDefaultHouseName(organDetails.defaultOutHouseId)
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
			return (this.parentOrganList.find(item => {
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
		getRegionName (id) {
			if (!id) {
				return ''
			}
			return (this.areaList.find(item => {
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
				message: `该操作会替换该机构已有默认${this.confirmInfo}仓库，是否确定更换？`,
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
		mergeSource2OrganDetail (organDetails) {
			return this.$fxApi('source.getOrganList', organDetails.organType, organDetails.id).then(sourceList => {
				return Promise.resolve({
					...organDetails,
					sourceList
				})
			})
		},
		onCancelClick () {
			this.$fxAppTabs.tabsRemove()
		},
		getOrganDetails (organId) {
			return this.$fxApi('organ.getOrganDetails', organId)
		},
		addOrganAgain () {
			const {
				organType,
				organLevel,
				organId,
				fatherId,
				regionId
			} = this.organDetails
			this.$fxAppTabs.tabsPush({
				path: 'organManageDetail',
				query: {
					openType: 'add',
					addFlag: 'again',
					organType,
					organLevel,
					organId,
					fatherId,
					regionId
				}
			})
		},
		onDeleteClick () {
			this.$fxConfirm('是否确定删除当前机构？')
				.then(this.onDeleteHandler)
				.then(this.onCancelClick)
		},
		onDeleteHandler () {
			const api = !this.isDel ? 'delDetails' : 'recyclingDelete'
			const del = !this.isDel ? 'delete' : 'recyclingDelete'
			const logger = this.$fxLogger.createInfo(`basic-archives.organ-manage.${del}`, { shop: this.organDetails.name })
			return this.$fxApi(`organ.${api}`, this.organDetails.organType, this.organDetails.id)({ logger }).then(res => {
				this.fxDataVerification.resetData(this.organDetails)
				return Promise.resolve()
			})
		},
		onRecoverClick () {
			this.$fxConfirm('是否确定恢复当前机构？')
				.then(this.onRecoverHandler)
				.then(this.onCancelClick)
		},
		onRecoverHandler () {
			const logger = this.$fxLogger.createInfo('basic-archives.organ-manage.recover', { shop: this.organDetails.name })
			return this.$fxApi('organ.recover', this.organDetails.organType, this.organDetails.id)({ logger }).then(res => {
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
				this.getSourceHandler(organType, id)
			]).then(([details, sourceList]) => {
				return Promise.resolve({
					...details,
					sourceList
				})
			})
		},
		getDetails (id, isRecycle) {
			const api = isRecycle === 'true' ? 'getOrganDetailsRecycling' : 'getOrganDetails'
			return this.$fxApi(`organ.${api}`, id).then(res => {
				return Promise.resolve(res)
			})
		},
		getSourceHandler (organType, id) {
			return this.$fxApi('source.getOrganList', organType, id).then(res => {
				return Promise.resolve(res)
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
