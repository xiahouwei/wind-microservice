<template>
	<fx-bill-container
		:title="actionText"
	>
		<div class="create-container">
			<w-scroll-bar>
				<div class="create-container__content">
					<basicInfo
						ref="basicInfo"
						:organDetails="organDetails"
						:organSelectList="organSelectList"
						:houseSelectList.sync="houseSelectList"
						:storageRackList.sync="storageRackList"
						:disabled="billDisabled"
						@on-connect-setting="onConnectClick"
					></basicInfo>
					<appendInfo
						ref="appendInfo"
						:organDetails="organDetails"
						:disabled="billDisabled"
					></appendInfo>
				</div>
			</w-scroll-bar>
		</div>
		<template slot="footer">
			<el-button
				ref="cancelBtn"
				v-fx-tab:loop.basic-archives_storage-manage_details.cancelBtn
				@click="onCancelClick"
			>取消</el-button>
			<el-button
				ref="saveBtn"
				v-fx-auth:basic-archives_storage-manage.edit-space="!isSystem"
				v-fx-tab:loop.basic-archives_storage-manage_details.saveBtn
				type="primary"
				@click="onSaveClick"
			>保存</el-button>
			<el-button
				ref="saveAndAddBtn"
				type="primary"
				v-fx-auth:basic-archives_storage-manage.add-space="isAdd"
				v-fx-tab:loop.basic-archives_storage-manage_details.saveAndAddBtn
				@click="onSaveAndAddClick"
			>保存并新建</el-button>
		</template>
		<connectItemDialog ref="connectItemDialog" :storageRackList="storageRackList"></connectItemDialog>
	</fx-bill-container>
</template>
<script>
import { mapGetters } from 'vuex'
import basicInfo from './BasicInfo.vue'
import appendInfo from './AppendInfo.vue'
import { apiName } from '../../Index.vue'
import connectItemDialog from '../connect-container/connect-item.vue'
export default {
	name: 'createOrgan',
	components: {
		basicInfo,
		appendInfo,
		connectItemDialog
	},
	data () {
		return {
			organDetails: {},
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			organSelectList: [],
			houseSelectList: [],
			storageRackList: []
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
		billDisabled () {
			return !this.detailsAuthGetter('basic-archives_storage-manage.edit-space') || this.isSystem
		},
		isSystem () {
			return !!this.organDetails.sysFlag
		}
	},
	created () {
		this.$fxTabkey.init('basic-archives_storage-manage_details', this)
		this.initBill()
		this.bindTabBeforeDeactivated()
	},
	methods: {
		initBill () {
			const { openType, addFlag } = this.$route.query
			if (openType === 'add') {
				if (addFlag === 'again') {
					const { shelfId, houseId, organId } = this.$route.query
					this.add({ shelfId, houseId, organId })
				} else {
					const { shelfId, houseId, organId } = this.initDefaultOrganData()
					this.add({ shelfId, houseId, organId })
				}
			} else if (openType === 'edit') {
				const { id } = this.$route.query
				this.onEditHandler({ id }).then(this.edit)
			}
		},
		bindTabBeforeDeactivated () {
			this.$fxAppTabs.onTabBeforeDeactivated(() => {
				return this.verificationDetails()
			}, this)
		},
		onEditHandler (item) {
			return this.$fxApi(`${apiName}.getDetails`, item.id)
		},
		initDefaultOrganData () {
			const { treeNodeFatherId, treeNodeCode, treeNodeId, treeNodeRelated, treeNodeOrganType, treeNodeOrganId } = this.$route.query
			const shelfId = (treeNodeFatherId && treeNodeCode !== 'STAGE') ? treeNodeId : ''
			const houseId = (treeNodeOrganType === '3' && treeNodeRelated === 1) ? treeNodeId : (treeNodeFatherId && treeNodeRelated === 1) ? treeNodeFatherId : ''
			const organId = (treeNodeOrganId && treeNodeRelated === 1) ? treeNodeOrganId : ''
			return { shelfId, houseId, organId }
		},
		async add ({ shelfId, houseId, organId }) {
			const organDetails = {
				id: '',
				code: '',
				organId,
				houseId,
				shelfId,
				shelfOrder: '',
				pickingOrder: '',
				locationCategory: '0',
				enableFlag: 1,
				relAllItem: true,
				volumeLimit: '',
				weightLimit: '',
				amountLimit: '',
				length: '',
				width: '',
				height: '',
				sysFlag: 0
			}
			await this.getSelectList(organDetails)
			this.organDetails = organDetails
			this.fxDataVerification.resetData(this.organDetails)
			this.$nextTick(() => {
				this.$refs.basicInfo.defaultFocus('code')
			})
		},
		async edit (organDetails) {
			this.$fxAppTabs.setTabTitle({ code: organDetails.code })
			await this.getSelectList(organDetails)
			this.organDetails = organDetails
			this.fxDataVerification.resetData(this.organDetails)
			this.$nextTick(() => {
				if (this.billDisabled) {
					this.$fxUtils.vDoRefFocus(this, 'cancelBtn')
				} else {
					this.$refs.basicInfo.defaultFocus('code')
				}
			})
		},
		getSelectList (organDetails = {}) {
			return Promise.all([
				this.getOrganList(organDetails),
				this.getHouseList(organDetails),
				this.getRackList(organDetails)
			])
		},
		getOrganList (organDetails) {
			const ids = organDetails.organId ? [organDetails.organId] : []
			return this.$fxApi(`${apiName}.getOrganList`)({ data: { ids, names: ['Shop', 'Center'] } }).then(res => {
				this.organSelectList = res
				return Promise.resolve(res)
			})
		},
		getHouseList (organDetails) {
			if (!organDetails.organId) return false
			const ids = organDetails.houseId ? [organDetails.houseId] : []
			return this.$fxApi(`${apiName}.getHouseList`, organDetails.organId)({ data: ids }).then(res => {
				this.houseSelectList = res
				return Promise.resolve(res)
			})
		},
		getRackList (organDetails) {
			if (!organDetails.houseId) return false
			return this.$fxApi(`${apiName}.getRackList`, organDetails.houseId, organDetails.shelfId).then(res => {
				this.storageRackList = res
				return Promise.resolve(res)
			})
		},
		onSaveClick () {
			return this.onValidateFormData().then(this.onSaveHandler)
		},
		onSaveAndAddClick () {
			this.onValidateFormData()
				.then(this.onSaveHandler)
				.then(this.addStorageAgain)
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
		onSaveHandler () {
			if (this.isAdd) {
				const type = this.$fxTypeMiddleware.getCommonTypeItemById('storageSpaceTypeList')(this.organDetails.locationCategory).label
				const shelfCode = this.getNameById(this.organDetails.shelfId, this.storageRackList, 'code')
				const logger = this.$fxLogger.createInfo('basic-archives.storage-manage.add', { code: this.organDetails.code, type, shelfCode })
				return this.$fxApi(`${apiName}.add`)({ data: this.organDetails, logger }).then(res => {
					this.$fxAppTabs.setTabTitle({ code: res.code })
					this.$fxAppTabs.setTabPathQuery({ openType: 'edit', id: res.id })
					this.organDetails.id = res.id
					this.organDetails.createMan = res.createMan
					this.$fxMessage.success('新建成功')
					this.fxDataVerification.resetData(this.organDetails)
					return Promise.resolve()
				})
			} else {
				if (this.fxDataVerification.checkData(this.organDetails)) {
					this.$fxMessage.success('保存成功')
					return Promise.resolve()
				}
				const logger = this.$fxLogger.createInfo('basic-archives.storage-manage.update', this.createLoggerParams())
				return this.$fxApi(`${apiName}.update`, this.organDetails.id)({ data: this.organDetails, logger }).then(res => {
					this.$fxAppTabs.setTabTitle({ code: res.code })
					this.$fxMessage.success('保存成功')
					this.fxDataVerification.resetData(this.organDetails)
					return Promise.resolve()
				})
			}
		},
		createLoggerParams () {
			const originData = this.fxDataVerification.getOriginData()
			originData.organName = this.$fxUtils.getSelectTagById(originData.organId, this.organSelectList).name || ''
			originData.houseName = this.getNameById(originData.houseId, this.houseSelectList, 'name')
			originData.shelfCode = this.getNameById(originData.shelfId, this.storageRackList, 'code')
			const organDetails = this.$fxUtils.deepClone(this.organDetails)
			organDetails.organName = this.$fxUtils.getSelectTagById(organDetails.organId, this.organSelectList).name || ''
			organDetails.houseName = this.getNameById(organDetails.houseId, this.houseSelectList, 'name')
			organDetails.shelfCode = this.getNameById(organDetails.shelfId, this.storageRackList, 'code')
			return {
				pre: originData,
				cur: organDetails,
				code: organDetails.code,
				shelfCode: organDetails.shelfCode
			}
		},
		getNameById (id, list, label = 'name') {
			if (!id) {
				return ''
			}
			const selectedItem = list.find(item => item.id === id)
			return selectedItem ? selectedItem[label] : ''
		},
		onCancelClick () {
			this.$fxAppTabs.tabsRemove()
		},
		addStorageAgain () {
			const { shelfId, houseId, organId } = this.organDetails
			this.$fxAppTabs.tabsPush({
				path: 'storageManageDetail',
				query: {
					openType: 'add',
					addFlag: 'again',
					shelfId,
					houseId,
					organId
				}
			})
		},
		onConnectClick () {
			if (!this.organDetails.id) {
				this.$fxMessage.warning('请先保存货位信息')
				return false
			}
			this.onSaveClick().then(() => {
				this.$refs.connectItemDialog.open(this.organDetails)
			})
		},
		verificationDetails () {
			return this.fxDataVerification.checkComfirm(this.organDetails)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.create-container {
	flex: 1
	display: flex;
	flex-direction: column;
	overflow: auto;
	&__content {
		flex: 1
		overflow: auto
		padding-right: 10px
	}
}
</style>
