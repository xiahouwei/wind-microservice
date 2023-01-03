<template>
	<fx-bill-container
		title="快速出库方案详情"
		:moreBtnOption="moreBtnOption"
	>
		<template slot="sub">
			<fx-details-state-tag :label="currentState.label" :icon="currentState.icon"></fx-details-state-tag>
		</template>
		<div class="create-plan">
			<w-scroll-bar :flex="isFullScreen">
				<basicInfo
					ref="basicInfo"
					v-show="!isFullScreen"
					:isFullScreen="isFullScreen"
					:organDetails="organDetails"
					:disabled="billDisabled"
				></basicInfo>
				<detailsInfo
					ref="detailsInfo"
					:isFullScreen.sync="isFullScreen"
					:organDetails="organDetails"
					:tableDetails="tableDetails"
					:fSaveMain="onSaveClickHandler"
					:disabled="billDisabled"
					:delDisabled="delDisabled"
					:canAdd="canAdd"
					@on-details-refresh="onDetailsRefresh"
				></detailsInfo>
				<appendInfo
					v-show="!isFullScreen"
					:isFullScreen="isFullScreen"
					:organDetails="organDetails"
					:disabled="billDisabled"
				></appendInfo>
			</w-scroll-bar>
		</div>
		<template v-if="!this.isAdd" slot="footer-left">
			<fx-button
				ref="refreshBtn"
				type="save"
				v-fx-tab:loop.basic-archives_quick-out-plan_details.refreshBtn
				@click="onRefresh"
			>刷新</fx-button>
		</template>
		<template slot="footer-right">
			<fx-button
				ref="cancelBtn"
				v-fx-tab:loop.basic-archives_quick-out-plan_details.cancelBtn
				@click="onCancelClick"
			>取消</fx-button>
			<fx-button
				ref="saveBtn"
				type="primary"
				v-fx-auth:basic-archives_quick-out-plan.edit-quick-out|enable-quick-out|disable-quick-out="!isDeleted"
				v-fx-tab:loop.basic-archives_quick-out-plan_details.saveBtn
				@click="onSaveClick"
			>保存</fx-button>
			<fx-button
				ref="checkBtn"
				type="primary"
				v-fx-auth:basic-archives_quick-out-plan.check-quick-out="(!isChecked && !isAdd && !isDeleted)"
				v-fx-tab:loop.basic-archives_quick-out-plan_details.checkBtn
				@click="onCheckClick"
			>审核</fx-button>
			<fx-button
				ref="uncheckBtn"
				type="danger"
				v-fx-auth:basic-archives_quick-out-plan.uncheck-quick-out="isChecked && !isDeleted"
				v-fx-tab:loop.basic-archives_quick-out-plan_details.uncheckBtn
				@click="onUncheckClick"
			>反审</fx-button>
		</template>
	</fx-bill-container>
</template>
<script>
import { mapGetters } from 'vuex'
import basicInfo from './BasicInfo.vue'
import detailsInfo from './DetailsInfo.vue'
import appendInfo from './AppendInfo.vue'
import { apiName } from '../../Index.vue'
export default {
	name: 'createPlan',
	components: {
		basicInfo,
		detailsInfo,
		appendInfo
	},
	data () {
		return {
			isFullScreen: false,
			organDetails: {},
			tableDetails: [],
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			fxCache: this.$fxUtils.fxCache('quick-out-plan')
		}
	},
	computed: {
		...mapGetters(['detailsAuthGetter']),
		isAdd () {
			return !this.organDetails.id
		},
		isChecked () {
			return this.$fxStateMiddleware.isState('planState')(['checked'])(this.organDetails.billState)
		},
		isDeleted () {
			return this.$fxStateMiddleware.isState('planState')(['deleted'])(this.organDetails.billState)
		},
		currentState () {
			return this.$fxStateMiddleware.getStateObj('planState')(this.organDetails.billState)
		},
		billDisabled () {
			return !this.detailsAuthGetter('basic-archives_quick-out-plan.edit-quick-out') || this.isChecked || this.isDeleted
		},
		delDisabled () {
			return this.isChecked || !this.detailsAuthGetter('basic-archives_quick-out-plan.delete-quick-out') || this.isDeleted
		},
		canAdd () {
			return this.detailsAuthGetter('basic-archives_quick-out-plan.add-quick-out')
		},
		moreBtnOption () {
			return [{
				show: this.detailsAuthGetter('basic-archives_quick-out-plan.export-blank|export-quick-out'),
				label: '导出Excel',
				icon: 'export-excel',
				children: [{
					show: this.detailsAuthGetter('basic-archives_quick-out-plan.export-blank'),
					label: '导出空白模板',
					icon: 'export-template',
					click: this.exportModel
				}, {
					show: this.detailsAuthGetter('basic-archives_quick-out-plan.export-quick-out'),
					label: '导出明细数据',
					icon: 'export-data',
					click: this.exportData
				}]
			}, {
				show: !this.billDisabled && this.detailsAuthGetter('basic-archives_quick-out-plan.import-quick-out'),
				label: '导入Excel',
				icon: 'import-excel',
				children: [{
					label: '按模板导入数据',
					icon: 'import-template',
					click: this.importModel
				}]
			}, {
				show: !this.isAdd && !this.isChecked && this.detailsAuthGetter('basic-archives_quick-out-plan.delete-quick-out'),
				label: '删除',
				icon: 'delete-trash',
				click: this.onDeleteClick
			}]
		}
	},
	created () {
		this.$fxTabkey.init('basic-archives_quick-out-plan_details', this)
		this.initBill()
		this.bindTabBeforeDeactivated()
	},
	methods: {
		initBill () {
			if (this.$route.query.openType === 'add') {
				this.add()
			} else if (this.$route.query.openType === 'edit') {
				this.onEditHandler(this.$route.query.id).then(this.edit)
			}
		},
		bindTabBeforeDeactivated () {
			this.$fxAppTabs.onTabBeforeDeactivated(() => {
				return this.verificationDetails()
			}, this)
		},
		add () {
			this.organDetails = {
				id: '',
				billState: 0,
				code: '',
				name: '',
				enableFlag: 1,
				memo: '',
				appendixList: [],
				createManName: '',
				createDate: '',
				checkManName: '',
				checkDate: '',
				delFlag: 0
			}
			this.fxCache.clear()
			this.tableDetails = []
			this.fxDataVerification.resetData(this.organDetails)
			this.$nextTick(() => {
				this.$refs.basicInfo.defaultFocus()
			})
		},
		edit ([organDetails, tableDetails]) {
			this.$fxAppTabs.setTabTitle({ code: organDetails.code })
			this.organDetails = organDetails
			this.tableDetails = tableDetails
			this.fxCache.clear()
			this.fxDataVerification.resetData(this.organDetails)
			this.$nextTick(() => {
				if (this.billDisabled) {
					this.$fxUtils.vDoRefFocus(this, 'refreshBtn')
				} else {
					this.$refs.basicInfo.defaultFocus()
				}
			})
		},
		deleteEmptyBill () {
			if (this.organDetails.id && this.tableDetails.length === 0) {
				return this.$fxApi(`${apiName}.delEmptyBill`, this.organDetails.id)
			} else {
				return Promise.resolve()
			}
		},
		onSaveClick () {
			return this.$refs.detailsInfo.checkDetailsUnSaving().then(() => {
				if (this.fxDataVerification.checkData(this.organDetails) && !this.isAdd) {
					this.$fxMessage.success('保存成功')
				} else {
					return this.onSaveClickHandler()
				}
			})
		},
		onSaveClickHandler () {
			return this.onValidateFormData().then(this.onSavePlanHandler)
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
		onSavePlanHandler () {
			if (this.isAdd) {
				const logger = this.$fxLogger.createInfo('basic-archives.quick-out-plan.add', { name: this.organDetails.name })
				return this.$fxApi(`${apiName}.add`)({ data: this.organDetails, logger }).then(res => {
					this.$fxAppTabs.setTabTitle({ code: res.code })
					this.$fxAppTabs.setTabPathQuery({ openType: 'edit', id: res.id })
					this.organDetails = res
					this.fxDataVerification.resetData(this.organDetails)
					return Promise.resolve(res)
				})
			} else {
				if (this.fxDataVerification.checkData(this.organDetails)) {
					return Promise.resolve(this.organDetails)
				} else {
					if (this.isChecked) {
						this.onSavePlanIsCheckedHandler()
					} else {
						const logger = this.$fxLogger.createInfo('basic-archives.quick-out-plan.update', this.createLoggerParams())
						return this.$fxApi(`${apiName}.save`, this.organDetails.id)({ data: this.organDetails, logger }).then(res => {
							this.fxDataVerification.resetData(this.organDetails)
							return Promise.resolve(res)
						})
					}
				}
			}
		},
		createLoggerParams () {
			const originData = this.$fxUtils.deepClone(this.fxDataVerification.getOriginData())
			const organDetails = this.$fxUtils.deepClone(this.organDetails)
			return {
				pre: originData,
				cur: organDetails,
				name: organDetails.name
			}
		},
		onSavePlanIsCheckedHandler () {
			if (this.organDetails.enableFlag) {
				const logger = this.$fxLogger.createInfo('basic-archives.quick-out-plan.enable', { names: this.organDetails.name })
				return this.$fxApi(`${apiName}.enable`, this.organDetails.id)({ logger }).then(res => {
					this.fxDataVerification.resetData(this.organDetails)
					return Promise.resolve(res)
				})
			} else {
				const logger = this.$fxLogger.createInfo('basic-archives.quick-out-plan.disable', { names: this.organDetails.name })
				return this.$fxApi(`${apiName}.disable`, this.organDetails.id)({ logger }).then(res => {
					this.fxDataVerification.resetData(this.organDetails)
					return Promise.resolve(res)
				})
			}
		},
		onCancelClick () {
			this.$fxAppTabs.tabsRemove()
		},
		onDeleteClick () {
			this.$fxConfirm('是否确定删除当前方案？')
				.then(this.onDeleteHandler)
				.then(this.onCancelClick)
		},
		onDeleteHandler () {
			const delLogger = this.isDeleted ? 'recyclingDelete' : 'delete'
			const delApi = this.isDeleted ? 'recyclingDelete' : 'del'
			const logger = this.$fxLogger.createInfo(`basic-archives.quick-out-plan.${delLogger}`, { names: this.organDetails.name })
			return this.$fxApi(`${apiName}.${delApi}`, this.organDetails.id)({ logger })
		},
		verificationDetails (message = '当前页面存在未保存数据，是否确定取消并退出操作？') {
			return new Promise(resolve => {
				if (this.$refs.detailsInfo.isRowEditing() || !this.fxDataVerification.checkData(this.organDetails)) {
					this.$fxConfirm(message).then(resolve)
				} else {
					resolve()
				}
			})
		},
		onRefresh () {
			this.verificationDetails('当前页面存在未保存数据，是否确定刷新操作？').then(() => {
				this.onEditHandler(this.organDetails.id).then(this.edit)
			})
		},
		onEditHandler (planId) {
			return Promise.all([
				this.getPlan(planId),
				this.getPlanDetails(planId)
			])
		},
		getPlan (planId) {
			return this.$fxApi(`${apiName}.get`, planId)
		},
		getPlanDetails (planId) {
			return this.$fxApi(`${apiName}.getDetailsPage`, planId)
		},
		onDetailsRefresh () {
			return this.getPlanDetails(this.organDetails.id).then(res => {
				this.tableDetails = res
				return Promise.resolve(res)
			})
		},
		onCheckClick () {
			return this.$fxConfirm('是否确定审核？').then(() => {
				this.$refs.detailsInfo.checkDetailsUnSaving()
					.then(this.onSaveClickHandler)
					.then(this.onCheckHandler)
			})
		},
		onCheckHandler () {
			const logger = this.$fxLogger.createInfo('basic-archives.quick-out-plan.check', { names: this.organDetails.name })
			return this.$fxApi(`${apiName}.check`, this.organDetails.id)({ logger }).then(res => {
				this.organDetails = res
				this.fxDataVerification.resetData(this.organDetails)
				return Promise.resolve()
			})
		},
		onUncheckClick () {
			return this.$fxConfirm('是否确定反审？').then(() => {
				const logger = this.$fxLogger.createInfo('basic-archives.quick-out-plan.uncheck', { names: this.organDetails.name })
				return this.$fxApi(`${apiName}.uncheck`, this.organDetails.id)({ logger }).then(res => {
					this.organDetails = res
					this.fxDataVerification.resetData(this.organDetails)
					return Promise.resolve()
				})
			})
		},
		exportModel () {
			this.onSaveClick().then(() => {
				const logger = this.$fxLogger.createInfo('basic-archives.quick-out-plan.exportModel', { name: this.organDetails.name })
				return this.$fxApi(`${apiName}.exportModel`, this.organDetails.id)({ logger }).then(res => {
					this.$fxUtils.downloadFile(res)
				})
			})
		},
		exportData () {
			this.onSaveClick().then(() => {
				if (this.tableDetails.length < 1) {
					this.$fxMessage.warning('当前无明细，不允许导出数据！')
					return false
				}
				const logger = this.$fxLogger.createInfo('basic-archives.quick-out-plan.exportData', { name: this.organDetails.name })
				return this.$fxApi(`${apiName}.exportData`, this.organDetails.id)({ logger }).then(res => {
					this.$fxUtils.downloadFile(res)
				})
			})
		},
		importModel () {
			this.onSaveClick().then(() => {
				this.$fxUpload({ type: 'excel' }).then(this.importExcelHandler).then(this.confirmWrongData)
			})
		},
		importExcelHandler (file) {
			const params = {
				excelFile: file
			}
			const logger = this.$fxLogger.createInfo('basic-archives.quick-out-plan.importModel', { name: this.organDetails.name, fileName: file.name })
			return this.$fxApi(`${apiName}.importData`, this.organDetails.id)({ data: params, logger })
		},
		confirmWrongData (res) {
			if (!res.result) {
				this.$fxConfirm({
					message: '导入数据存在错误，是否下载错误信息？',
					option: {
						confirmButtonText: '下载',
						cancelButtonText: '取消',
						closeOnClickModal: false,
						closeOnPressEscape: false,
						closeOnHashChange: false
					}
				}).then(() => {
					this.$fxUtils.downloadFile(res)
				})
			} else {
				this.onDetailsRefresh()
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.create-plan {
	flex: 1
	display: flex;
	flex-direction: column;
	overflow: auto;
}
</style>
