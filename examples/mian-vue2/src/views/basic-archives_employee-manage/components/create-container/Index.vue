<template>
	<fx-bill-container
		:title="actionText"
		:moreBtnOption="moreBtnOption"
	>
		<div class="create-organ">
			<w-scroll-bar>
				<div class="create-organ__content">
					<basicInfo
						ref="basicInfo"
						:organDetails="organDetails"
						:disabled="billDisabled"
						:directOrganData="directOrganData"
						:roleSelectList="roleSelectList"
					></basicInfo>
					<authSetting
						:organDetails="organDetails"
						:disabled="billDisabled"
						@on-connect-click="onConnectClick"
					></authSetting>
					<otherInfo ref="otherInfo" :organDetails="organDetails" :disabled="billDisabled"></otherInfo>
					<shoppingOnline
						ref="shoppingOnline"
						:organDetails="organDetails"
						:disabled="billDisabled"
						@on-connect-click="onConnectClick"
					></shoppingOnline>
					<!-- <alertSetting ref="alertSetting" :organDetails="organDetails" :disabled="billDisabled"></alertSetting> -->
					<appendInfo ref="appendInfo" :organDetails="organDetails" :disabled="billDisabled"></appendInfo>
					<sourceInfo :organDetails="organDetails"></sourceInfo>
				</div>
			</w-scroll-bar>
		</div>
		<template slot="footer">
			<w-link
				icon="copy-mulity"
				v-fx-auth:basic-archives_employee-manage.edit-employee
				class="copy-employee-btn"
				@click="onCopyEmployee"
			>复制员工</w-link>
			<el-button
				ref="cancelBtn"
				v-fx-tab:loop.basic-archives_employee-manage_details.cancelBtn
				@click="onCancelClick"
			>取消</el-button>
			<el-button
				ref="saveBtn"
				type="primary"
				v-fx-auth:basic-archives_employee-manage.edit-employee
				v-fx-tab:loop.basic-archives_employee-manage_details.saveBtn
				@click="onSaveClick"
			>保存</el-button>
			<el-button
				ref="saveAndAddBtn"
				type="primary"
				v-fx-auth:basic-archives_employee-manage.add-employee="!isSystemUser"
				v-fx-tab:loop.basic-archives_employee-manage_details.saveAndAddBtn
				@click="onSaveAndAddClick"
			>保存并新建</el-button>
		</template>
		<copyEmployeeDialog ref="copyEmployeeDialog"></copyEmployeeDialog>
	</fx-bill-container>
</template>
<script>
import basicInfo from './BasicInfo.vue'
import authSetting from './AuthSetting.vue'
import otherInfo from './OtherInfo.vue'
import shoppingOnline from './ShoppingOnline.vue'
// import alertSetting from './AlertSetting.vue'
import appendInfo from './AppendInfo.vue'
import sourceInfo from './SourceInfo.vue'
import copyEmployeeDialog from './CopyEmployee.vue'
import { mapState, mapGetters } from 'vuex'
export default {
	name: 'createContainer',
	components: {
		basicInfo,
		authSetting,
		otherInfo,
		shoppingOnline,
		// alertSetting,
		appendInfo,
		sourceInfo,
		copyEmployeeDialog
	},
	data () {
		return {
			organDetails: {},
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			directOrganData: [],
			roleSelectList: []
		}
	},
	computed: {
		...mapState({
			userId: state => state.loginer.userId,
			hostId: state => state.loginer.hostId
		}),
		...mapGetters(['detailsAuthGetter']),
		isAdd () {
			return !this.organDetails.id
		},
		actionText () {
			return this.isAdd ? '新建' : '编辑'
		},
		isSystemUser () {
			return !!this.organDetails.systemFlag
		},
		billDisabled () {
			return !this.detailsAuthGetter('basic-archives_employee-manage.edit-employee')
		},
		moreBtnOption () {
			return [{
				show: !this.isAdd && this.detailsAuthGetter('basic-archives_employee-manage.delete-employee'),
				label: '删除',
				icon: 'delete-trash',
				click: this.onDeleteClick
			}]
		}
	},
	created () {
		this.$fxTabkey.init('basic-archives_employee-manage_details', this)
		this.initBill()
		this.bindTabBeforeDeactivated()
	},
	methods: {
		async initBill () {
			const { openType, addFlag } = this.$route.query
			if (openType === 'add') {
				if (addFlag === 'again') {
					const { organId, organIds, organType } = this.$route.query
					this.add(organId, organIds, organType)
				} else {
					const { organId, organIds, organType } = await this.initDefaultOrganData()
					this.add(organId, organIds, organType)
				}
			} else if (openType === 'edit') {
				const { id } = this.$route.query
				this.onEditHandler({ id }).then(this.edit)
			}
		},
		bindTabBeforeDeactivated () {
			this.$fxAppTabs.onTabBeforeDeactivated(() => {
				return this.verificationDetails().then(this.stopPolling)
			}, this)
		},
		stopPolling () {
			this.$refs.shoppingOnline.stopCountdown()
			return Promise.resolve()
		},
		async add (organId, organIds, organType) {
			const code = await this.getArchiveCode()
			const organDetails = {
				organIds,
				organId,
				organType,
				code,
				imageUrl: '',
				name: '',
				username: '',
				password: 1,
				phone: '',
				enableFlag: 1,
				manageAllOrgan: 1,
				manageAllSupplier: 1,
				manageAllCustom: 1,
				toDealWorkType: 1,
				haveCostPower: 1,
				haveMoneyPower: 1,
				appendixList: [],
				manageSubordinates: 0,
				applyStore: 1,
				employeeType: 0,
				autoPrint: 0,
				isReceiveInformation: 0,
				roleList: []
			}
			await this.getSelectList(organDetails)
			this.organDetails = organDetails
			this.fxDataVerification.resetData(this.organDetails)
			this.$nextTick(() => {
				this.$refs.basicInfo.defaultFocus('code')
			})
		},
		async edit (organDetails) {
			await this.getSelectList(organDetails)
			this.$fxAppTabs.setTabTitle({ name: organDetails.name })
			this.organDetails = organDetails
			this.fxDataVerification.resetData(this.organDetails)
			this.$nextTick(() => {
				this.$refs.basicInfo.refreshPasswordInput()
				this.$refs.shoppingOnline.setApplyStore()
				if (this.billDisabled) {
					this.$fxUtils.vDoRefFocus(this, 'cancelBtn')
				} else {
					this.$refs.basicInfo.defaultFocus('name')
				}
			})
		},
		async initDefaultOrganData () {
			const {
				treeNodeId,
				treeNodeOrganType,
				treeNodeOrganLevel
			} = this.$route.query
			let organId = ''
			let organIds = []
			let organType = ''
			if (treeNodeOrganType) {
				if (treeNodeOrganLevel === 2) {
					organIds = await this.getFatherIdsById(treeNodeId)
					organId = treeNodeId
					organType = treeNodeOrganType
				} else {
					organIds = [treeNodeId]
					organId = treeNodeId
					organType = treeNodeOrganType
				}
			}
			return {
				organId,
				organType,
				organIds
			}
		},
		getArchiveCode () {
			return this.$fxApi('employee.getDefaultCode')
		},
		getFatherIdsById (id) {
			return this.$fxApi('organ.getFatherIdsById', id)
		},
		getDirectOrgan (organDetails) {
			return this.$fxApi('employee.getDirectOrgan', [organDetails.organId]).then(res => {
				this.directOrganData = res
				return Promise.resolve()
			})
		},
		getRoleList () {
			return this.$fxApi('role.getRoleSelectList').then(res => {
				this.roleSelectList = res
				return Promise.resolve(res)
			})
		},
		getSelectList (organDetails) {
			return Promise.all([
				this.getDirectOrgan(organDetails),
				this.getRoleList()
			])
		},
		onSaveClick () {
			return this.onValidateFormData().then(this.onSaveOrganHandler)
		},
		onSaveAndAddClick () {
			this.onValidateFormData()
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
				const logger = this.$fxLogger.createInfo('basic-archives.employee-manage.add', { employee: this.organDetails.name, code: this.organDetails.code })
				return this.$fxApi('employee.add')({ data: this.organDetails, logger }).then(this.getSource).then(res => {
					this.$fxAppTabs.setTabTitle({ name: res.name })
					this.$fxAppTabs.setTabPathQuery({ openType: 'edit', id: res.id })
					this.organDetails = res
					this.$set(this.organDetails, 'sourceList', res.sourceList)
					this.fxDataVerification.resetData(this.organDetails)
					this.$refs.basicInfo.refreshPasswordInput()
					return Promise.resolve()
				})
			} else {
				if (this.fxDataVerification.checkData(this.organDetails)) {
					this.$fxMessage.success('保存成功')
					return Promise.resolve(this.organDetails)
				} else {
					const logger = this.$fxLogger.createInfo('basic-archives.employee-manage.update', this.createLoggerParams())
					return this.$fxApi('employee.saveDetails', this.organDetails.id)({ data: this.organDetails, logger }).then(res => {
						this.$fxAppTabs.setTabTitle({ name: res.name })
						this.fxDataVerification.resetData(this.organDetails)
						if (this.userId === res.id) {
							this.$store.dispatch('syncLoginer', this.hostId)
						}
						this.$refs.basicInfo.refreshPasswordInput()
						return Promise.resolve()
					})
				}
			}
		},
		createLoggerParams () {
			const originData = this.fxDataVerification.getOriginData()
			originData.organName = this.getOrganName(originData.organId)
			originData.roleList = this.getRoleLsitName(originData.roleList)
			const organDetails = this.$fxUtils.deepClone(this.organDetails)
			organDetails.organName = this.getOrganName(organDetails.organId)
			organDetails.roleList = this.getRoleLsitName(organDetails.roleList)
			return {
				pre: originData,
				cur: organDetails,
				name: organDetails.name,
				code: organDetails.code
			}
		},
		getOrganName (id) {
			if (!id) {
				return ''
			}
			return this.$fxUtils.getSelectTagById(id, this.directOrganData).name || ''
		},
		getRoleLsitName (id) {
			return this.$fxUtils.getSelectMulityById(id, this.roleSelectList).map(item => item.name).join(',')
		},
		getSource (organDetails) {
			return this.$fxApi('source.getEmployeeList', organDetails.id).then(sourceList => {
				return Promise.resolve({
					...organDetails,
					sourceList
				})
			})
		},
		onCopyEmployee () {
			this.onSaveClick().then(() => {
				this.$refs.copyEmployeeDialog.open(this.organDetails)
			})
		},
		onCancelClick () {
			this.$fxAppTabs.tabsRemove()
		},
		onDeleteClick () {
			this.$fxConfirm('是否确定删除当前员工？')
				.then(this.onDeleteHandler)
				.then(this.onCancelClick)
		},
		onDeleteHandler () {
			const logger = this.$fxLogger.createInfo('basic-archives.employee-manage.delete', { employee: this.organDetails.name })
			return this.$fxApi('employee.delete', this.organDetails.id)({ logger }).then(res => {
				this.fxDataVerification.resetData(this.organDetails)
				return Promise.resolve()
			})
		},
		onConnectClick (next) {
			this.onSaveClick().then(next)
		},
		verificationDetails () {
			return this.fxDataVerification.checkComfirm(this.organDetails)
		},
		onEditHandler ({ id }) {
			return Promise.all([
				this.getDetails(id),
				this.getSourceHandler(id)])
				.then(([details, sourceList]) => {
					return Promise.resolve({
						...details,
						sourceList
					})
				})
		},
		getDetails (id) {
			return this.$fxApi('employee.getDetails', id).then(res => {
				return Promise.resolve(res)
			})
		},
		getSourceHandler (id) {
			return this.$fxApi('source.getEmployeeList', id).then(res => {
				return Promise.resolve(res)
			})
		},
		addOrganAgain () {
			const {
				organId,
				organType,
				organIds
			} = this.organDetails
			this.$fxAppTabs.tabsPush({
				path: 'employeeManageDetail',
				query: {
					openType: 'add',
					addFlag: 'again',
					organId,
					organType,
					organIds
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
	&__content {
		flex: 1
		overflow:auto
		padding-right: 10px
	}
}
.copy-employee-btn {
	margin-right 10px
}
</style>
