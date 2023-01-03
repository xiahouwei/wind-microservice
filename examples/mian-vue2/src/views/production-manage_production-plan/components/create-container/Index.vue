<template>
	<fx-bill-container
		title="生产计划详情"
		:moreBtnOption="moreBtnOption"
		:billChainOption="billChainOption"
		:titleClass="billSign"
	>
		<template slot="sub">
			<fx-details-state-tag :label="currentState.label" :icon="currentState.icon"></fx-details-state-tag>
		</template>
		<div class="create-organ">
			<w-scroll-bar :flex="isFullScreen">
				<basicInfo
					v-show="!isFullScreen"
					ref="basicInfo"
					:isFullScreen="isFullScreen"
					:organDetails="organDetails"
					:tableDetails="tableDetails"
					:organSelectList="organSelectList"
					:agentSelectList="agentSelectList"
					:disabled="!isState(['unSubmit'])|| authDisabled"
					@on-single-house-change='onSingleHouseChange'
					@on-store-ware-change='onStoreWareChange'
					@on-organ-change='onOrganChange'
				></basicInfo>
				<detailsInfo
					ref="detailsInfo"
					:organDetails="organDetails"
					:tableDetails="tableDetails"
					:isFullScreen.sync="isFullScreen"
					:fSaveMain="onSaveClickHandler"
					:disabled="!isState(['unSubmit'])|| authDisabled"
					:deleteDisabled="isDisable"
					:itemName="itemName"
					@on-details-refresh="getDetails"
					@on-mistake-check="onMistakeCheck"
				></detailsInfo>
				<mistakeCheck
					ref="mistakeCheck"
					:organDetails="organDetails"
					:tableDetails.sync="tableDetails"
					@on-action="onMistakeCheckAction"
					@on-mistake-close="onMistakeClose"
				></mistakeCheck>
			</w-scroll-bar>
		</div>
		<template slot="parentBill" v-if="!isAdd">
			<template v-if='hasParentBill'>
				上级单据:
			<w-link
				@click='goToBillBlank'
			>{{organDetails.parentBill.sysBillCode}}</w-link>
			</template>
			<span v-else>无上级单据</span>
		</template>
		<template slot="footer-left">
			<fx-button
				ref="refreshBtn"
				type="save"
				v-if="!isAdd"
				v-fx-tab:loop.store-manage_in-store-order_details.refreshBtn
				@click="onRefresh"
			>刷新</fx-button>
		</template>
		<template slot="footer-right">
			<el-button
				ref="cancelBtn"
				v-fx-tab:loop.store-manage_in-store-order_details.cancelBtn
				@click="onCancelClick"
			>取消</el-button>
			<fx-button
				ref="saveBtn"
				type="save"
				v-fx-auth:production-manage_production-plan.edit-productionPlan="isState(['unSubmit'])"
				@click="onSaveClick"
			>保存</fx-button>
			<fx-button
				ref="submitBtn"
				type="submit"
				v-fx-auth:production-manage_production-plan.submit-productionPlan="isState(['unSubmit'])"
				@click="onSubmitClick"
			>提交</fx-button>
			<fx-button
				ref="returnBtn"
				type="return"
				v-fx-auth:production-manage_production-plan.back-productionPlan="isState(['unChecked'])"
				v-fx-tab:loop.store-manage_in-store-order_details.returnBtn
				@click="onReturnClick"
			>退回</fx-button>
			<fx-button
				ref="checkBtn"
				type="check"
				v-fx-auth:production-manage_production-plan.check-productionPlan="isState(['unSubmit', 'unChecked'])"
				@click="onCheckClick"
			>审核</fx-button>
			<fx-button
				ref="uncheckBtn"
				type="uncheck"
				v-fx-auth:production-manage_production-plan.uncheck-productionPlan="isState(['checked'])"
				v-fx-tab:loop.store-manage_in-store-order_details.uncheckBtn
				@click="onUncheckClick"
			>反审</fx-button>
		</template>
		<fx-bill-chain
			ref="billChain"
			:billChainData="billChainData"
		>
		</fx-bill-chain>
		<check-err-info ref="checkErrInfo"></check-err-info>
		<return-goods ref="returnGoods" :organDetails="organDetails"></return-goods>
	</fx-bill-container>
</template>
<script>
import { mapGetters } from 'vuex'
import basicInfo from './BasicInfo.vue'
import detailsInfo from './DetailsInfo.vue'
import mistakeCheck from '../mistake-check/MistakeCheck.vue'
import checkErrInfo from '@/components/common/Fx-check-err-info.vue'
import returnGoods from './ReturnGoods.vue'
export default {
	name: 'createOrgan',
	components: {
		basicInfo,
		detailsInfo,
		mistakeCheck,
		checkErrInfo,
		returnGoods
	},
	data () {
		return {
			organDetails: {
				organ: {},
				house: {},
				operateMan: {}
			},
			tableDetails: [],
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			isFullScreen: false,
			organSelectList: [],
			agentSelectList: [],
			billDeleteFlag: false,
			fxCache: this.$fxUtils.fxCache('in-store'),
			billChainData: {},
			isCommonTypeByRules: this.$fxTypeMiddleware.isCommonType('inStoreBillGenerateType', 'rules'),
			originDetail: [],
			itemName: ''
		}
	},
	computed: {
		...mapGetters(['detailsAuthGetter']),
		isAdd () {
			return !this.organDetails.id
		},
		isChecked () {
			return this.$fxStateMiddleware.isState('billState')(['unChecked', 'checked'])(this.organDetails.billState)
		},
		isDisable () {
			return this.$fxStateMiddleware.isState('billState')(['unChecked', 'checked', 'deleted'])(this.organDetails.billState)
		},
		currentState () {
			return this.$fxStateMiddleware.getOrderStateById(this.organDetails.billState, this.organDetails.recheckState)
		},
		isState () {
			return (type) => {
				return this.$fxStateMiddleware.isState('billState')(type)(this.organDetails.billState)
			}
		},
		hasParentBill () {
			return !!this.organDetails.parentBill
		},
		moreBtnOption () {
			return [{
				show: !this.isAdd && !this.isChecked && this.detailsAuthGetter('production-manage_production-plan.delete-productionPlan'),
				label: '删除',
				icon: 'delete-trash',
				click: this.onDeleteClick
			}, {
				show: !this.isAdd && this.detailsAuthGetter('production-manage_production-plan.copy-productionPlan'),
				label: '复制单据',
				icon: 'copy-order',
				click: this.onCopyClick
			}, {
				show: false,
				label: '打印',
				icon: 'print',
				click: this.onPrintClick
			}]
		},
		billSign () {
			// 判断红蓝字
			switch (this.organDetails.billSign) {
			case 1:
				return 'fx-default-font'
			case 2:
				return 'fx-warn-font'
			default:
				return ''
			}
		},
		authDisabled () {
			return !this.detailsAuthGetter('production-manage_production-plan.edit-productionPlan')
		},
		isCarryForward () {
			return this.organDetails.balanceFlag === 1
		},
		billChainOption () {
			return {
				show: !this.isAdd,
				click: this.onBillChainClick
			}
		}
	},
	created () {
		this.$fxEventBus.initEvent(this, 'app-visible', this.appVisibleHandler)
		this.$fxTabkey.init('store-manage_in-store-order_details', this)
		this.initBill()
		this.bindTabBeforeDeactivated()
	},
	methods: {
		initBill () {
			if (this.$route.query.openType === 'add') {
				this.add()
			} else if (this.$route.query.openType === 'edit') {
				this.edit(this.$route.query.id, this.$route.query.itemName)
			}
		},
		bindTabBeforeDeactivated () {
			this.$fxAppTabs.onTabBeforeDeactivated(() => {
				return this.verificationDetails()
			}, this)
		},
		async add () {
			const { currentUser } = await this.getListData()
			const organDetails = {
				billState: 0, // 单据状态
				sysBillCode: '', // 系统单号
				userBillCode: this.$fxUtils.createBillCode('SC'), // 手工单号
				billType: 9000, //  单据类型
				dataSource: 'MANUAL',
				busType: '', // 业务类型
				businessDate: this.$fxUtils.setDateTime(new Date()), // 生产计划日期
				organ: {
					id: ''
				}, // 加工机构
				house: {}, // 仓库
				operateMan: {
					id: currentUser.id
				},
				memo: '' // 整单备注
			}
			this.billDeleteFlag = false
			this.fxCache.clear()
			this.tableDetails = []
			this.organDetails = organDetails
			this.$nextTick(() => {
				this.fxDataVerification.resetData(this.organDetails)
				this.$refs.basicInfo.defaultFocus()
			})
		},
		async edit (id, itemName = '') {
			const organDetails = await this.getOrganDetails(id)
			this.$fxAppTabs.setTabTitle({ sysBillCode: organDetails.sysBillCode })
			this.itemName = itemName
			this.fxCache.clear()
			this.billDeleteFlag = false
			await this.getListData(organDetails)
			this.tableDetails = organDetails.details
			delete organDetails.details
			this.organDetails = organDetails
			this.fxDataVerification.resetData(this.organDetails)
			this.$nextTick(() => {
				this.getLineAuth()
				this.$refs.basicInfo.refreshInStoreWareList()
				if (!this.isState(['unSubmit']) || this.authDisabled) {
					this.$fxUtils.vDoRefFocus(this, 'refreshBtn')
				} else {
					this.$refs.basicInfo.defaultFocus()
				}
			})
		},
		getListData (organDetails) {
			return Promise.all([
				this.getCurrentUser(),
				this.getAgentList(organDetails),
				this.getStore(organDetails)
			]).then(([userData]) => {
				return Promise.resolve(userData)
			})
		},
		getOrganDetails (id) {
			return this.$fxApi('productionPlan.getDetails', id)
		},
		getLineAuth () {
			this.$fxApi('productionPlan.getListSubProduct')({ data: { organId: this.organDetails.organ.id, subProduct: ['SCJG_PRO'] } }).then(res => {
				this.$refs.detailsInfo.subProductHasLine = res.length > 0 ? this.$refs.detailsInfo.subProductHasLine = true : this.$refs.detailsInfo.subProductHasLine = false
			})
		},
		onStoreWareChange (item) {
			if (this.organDetails.id) {
				this.getDetails()
				return this.$refs.detailsInfo.setItemList(item)
			}
		},
		getDetails () {
			return this.$fxApi('productionPlan.getDetails', this.organDetails.id).then(res => {
				this.tableDetails = res.details
				return Promise.resolve(res)
			})
		},
		// 获取经办人
		getAgentList (organDetails) {
			const params = organDetails ? [organDetails.operateMan.id] : []
			return this.$fxApi('inStore.getAgentList')({ data: params }).then(res => {
				this.agentSelectList = res
				return Promise.resolve(res)
			})
		},
		async getStore (organDetails) {
			const ids = []
			if (organDetails && organDetails.organ.id) { ids.push(organDetails.organ.id) }
			if (organDetails && organDetails.house.id) {
				ids.push(organDetails.house.id)
			} else if (this.originDetail) {
				for (const i of this.originDetail) {
					if (i.house.id && !ids.includes(i.house.id)) {
						ids.push(i.house.id)
					}
				}
			}
			const organ = await this.getStoreOrganList({ ids, names: ['Center'] })
			this.organSelectList = organ
			return Promise.resolve(organ)
		},
		getStoreOrganList (data) {
			return this.$fxApi('inStore.getOrganList')({ data }).then(res => {
				return Promise.resolve(res)
			})
		},
		getCurrentUser () {
			return this.$fxApi('inStore.getCurrentUser')
		},
		// 删除明细为空的神产计划
		deleteEmptyBill () {
			if (this.organDetails.id && (this.tableDetails.length === 0 || (this.tableDetails.length === 1 && !this.tableDetails[0].id))) {
				return this.$fxApi('productionPlan.delEmptyBill', this.organDetails.id).then(res => {
					this.billDeleteFlag = true
					return Promise.resolve()
				})
			} else {
				return Promise.resolve()
			}
		},
		onRefresh () {
			this.verificationDetails('当前页面存在未保存数据，是否确定刷新操作？').then(() => {
				this.edit(this.organDetails.id)
			})
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
			return this.onValidateFormData().then(this.onSaveOrganHandler)
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
			if (this.isAdd) {
				const typeName = this.getNameById(this.organDetails.billType, this.$refs.basicInfo.billtypeSelect)
				let logger = this.$fxLogger.createInfo('production-manage.production-plan.add', { orderData: this.organDetails, type: typeName })
				return this.$fxApi('productionPlan.add')({ data: this.organDetails }).then(res => {
					this.$fxAppTabs.setTabTitle({ sysBillCode: res.sysBillCode })
					this.$fxAppTabs.setTabPathQuery({ openType: 'edit', id: res.id })
					this.$set(this.organDetails, 'id', res.id)
					this.$set(this.organDetails, 'recheckState', res.recheckState)
					this.$set(this.organDetails, 'sysBillCode', res.sysBillCode)
					this.$set(this.organDetails, 'createDate', res.createDate)
					this.organDetails.createMan = res.createMan || ''
					this.organDetails.house = res.house || {}
					this.$set(this.organDetails, 'createUserName', res.createUserName || '')
					if (this.organDetails.singleHouseFlag === 1) {
						this.$refs.detailsInfo.setItemList(this.organDetails.house.id)
					}
					this.fxDataVerification.resetData(this.organDetails)
					logger = this.$fxLogger.createInfo('production-manage.production-plan.add', { orderData: this.organDetails, type: typeName })
					const loggerInfo = this.$fxLogger.actionInfo(logger)
					loggerInfo.success()
					return Promise.resolve(res)
				}).catch(error => {
					const loggerInfo = this.$fxLogger.actionInfo(logger)
					loggerInfo.error(error.message)
					return new Promise(() => {})
				})
			} else {
				if (this.fxDataVerification.checkData(this.organDetails)) {
					return Promise.resolve(this.organDetails)
				} else {
					delete this.organDetails.modifyMan
					delete this.organDetails.modifyDate
					const logger = this.$fxLogger.createInfo('production-manage.production-plan.update', this.createLoggerParams())
					return this.$fxApi('productionPlan.edit', this.organDetails.id)({ data: this.organDetails, logger }).then(res => {
						if (this.organDetails.singleHouseFlag === 1) {
							this.$refs.detailsInfo.setItemList(this.organDetails.house.id)
						}
						this.fxDataVerification.resetData(this.organDetails)
						return Promise.resolve(res)
					})
				}
			}
		},
		createLoggerParams () {
			const originData = this.fxDataVerification.getOriginData()
			const organDetails = this.$fxUtils.deepClone(this.organDetails)
			return {
				pre: originData,
				cur: organDetails,
				orderData: organDetails
			}
		},
		getNameById (id, list) {
			if (!id) {
				return ''
			}
			const selectedItem = list.find(item => item.id === id)
			return selectedItem ? selectedItem.name : ''
		},
		getOrganNameById (id, list) {
			return this.$fxUtils.getSelectTagById(id, list).name || ''
		},
		onCancelClick () {
			this.$fxAppTabs.tabsRemove()
		},
		onDeleteClick () {
			this.$fxConfirm('是否确定删除当前单据？')
				.then(this.onDeleteHandler)
				.then(this.onCancelClick)
		},
		onDeleteHandler () {
			const del = this.organDetails.billState === 3 ? 'recyclingDelete' : 'delete'
			const logger = this.$fxLogger.createInfo(`production-manage.production-plan.${del}`, { orderData: this.organDetails })
			if (this.organDetails.billState === 3) {
				return this.$fxApi('productionPlan.recyclingDelete', this.organDetails.id)({ logger }).then(res => {
					this.billDeleteFlag = true
					this.fxDataVerification.resetData(this.organDetails)
					return Promise.resolve()
				})
			} else {
				return this.$fxApi('productionPlan.delete', this.organDetails.id)({ logger }).then(res => {
					this.billDeleteFlag = true
					this.fxDataVerification.resetData(this.organDetails)
					return Promise.resolve()
				})
			}
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
		onDetailsRefresh () {
			return this.getOrganDetails(this.organDetails.id)
		},
		beforeAction (message) {
			return this.$fxConfirm(message).then(() => {
				return this.$refs.detailsInfo.checkDetailsUnSaving().then(this.onSaveClickHandler)
			})
		},
		onSubmitClick () {
			if (this.tableDetails.length === 0) {
				return this.$fxMessage.warning('无明细不允许提交，请添加明细')
			}
			return this.beforeAction('是否确定提交？').then(() => {
				// return this.$refs.mistakeCheck.mistakeCheck('submit').then(this.onSubmitHandler)
				return this.onSubmitHandler()
			}).catch(() => {
			})
		},
		onSubmitHandler () {
			const logger = this.$fxLogger.createInfo('production-manage.production-plan.submit', { orderData: this.organDetails })
			return this.$fxApi('productionPlan.submit', this.organDetails.id)({ logger }).then(res => {
				this.updateOrganDetails(res)
				return Promise.resolve()
			})
		},
		onReturnClick () {
			return this.$fxConfirm('是否确定退回？').then(() => {
				const logger = this.$fxLogger.createInfo('production-manage.production-plan.return', { orderData: this.organDetails })
				return this.$fxApi('productionPlan.return', this.organDetails.id)({ logger }).then(res => {
					this.updateOrganDetails(res)
					return Promise.resolve()
				})
			})
		},
		onCheckClick () {
			if (this.tableDetails.length === 0) {
				return this.$fxMessage.warning('无明细不允许审核，请添加明细')
			}
			return this.beforeAction('是否确定审核？').then(() => {
				if (this.$fxStateMiddleware.isState('billState')(['unSubmit'])(this.organDetails.billState)) {
					// return this.$refs.mistakeCheck.mistakeCheck('check').then(this.onCheckHandler)
					return this.onCheckHandler()
				} else {
					return this.onCheckHandler()
				}
			})
		},
		onCheckHandler () {
			const logger = this.$fxLogger.createInfo('production-manage.production-plan.check', { orderData: this.organDetails })
			return this.$fxApi('productionPlan.check', this.organDetails.id)({ logger }).then(res => {
				this.updateOrganDetails(res)
				return Promise.resolve()
			}).catch(err => {
				if (err.code === 1) {
					const errMessage = this.$fxUtils.JSONparse(err.message) || []
					this.$refs.checkErrInfo.open(errMessage)
				} else if (err.code === 2) {
					const errMessage = this.$fxUtils.JSONparse(err.message) || []
					this.$refs.uncheckOrderInfo.open(errMessage)
				} else {
					return this.$fxMessage.error(err.message || '审核失败，请稍后再试')
				}
			})
		},
		onUncheckClick () {
			return this.$fxConfirm('是否确定反审？').then(() => {
				const logger = this.$fxLogger.createInfo('production-manage.production-plan.uncheck', { orderData: this.organDetails })
				return this.$fxApi('productionPlan.uncheck', this.organDetails.id)({ logger }).then(res => {
					this.updateOrganDetails(res)
					return Promise.resolve()
				}).catch(err => {
					if (err.code === 1) {
						const errMessage = this.$fxUtils.JSONparse(err.message) || []
						this.$refs.checkErrInfo.open(errMessage)
					} else if (err.code === 2) {
						const errMessage = this.$fxUtils.JSONparse(err.message) || []
						this.$refs.uncheckOrderInfo.open(errMessage)
					} else {
						return this.$fxMessage.error(err.message || '反审失败，请稍后再试')
					}
				})
			})
		},
		updateOrganDetails (res) {
			this.getDetails()
			this.updateBillState(res)
			this.fxDataVerification.resetData(this.organDetails)
		},
		updateBillState ({ billState, recheckState, submitMan = {}, submitDate = '', checkMan = {}, checkDate = '', systemMemo = '' }) {
			this.organDetails.billState = billState
			this.organDetails.recheckState = recheckState
			this.$set(this.organDetails, 'submitMan', submitMan)
			this.$set(this.organDetails, 'submitDate', submitDate)
			this.$set(this.organDetails, 'checkMan', checkMan)
			this.$set(this.organDetails, 'checkDate', checkDate)
			this.$set(this.organDetails, 'systemMemo', systemMemo)
		},
		onMistakeClose () {
			this.$refs.detailsInfo.clear()
		},
		onMistakeCheck () {
			this.$refs.mistakeCheck.mistakeCheck().then(() => {
				this.$fxMessage.success('未查询到存在问题的数据')
			})
		},
		onMistakeCheckAction (type) {
			if (type === 'submit') {
				this.onSubmitHandler()
			} else {
				this.onCheckHandler()
			}
		},
		onSingleHouseChange () {
			if (this.organDetails.id) {
				this.getDetails()
			}
		},
		onOrganChange (item) {
			this.$fxApi('productionPlan.getListSubProduct')({ data: { organId: item.id, subProduct: ['SCJG_PRO'] } }).then(res => {
				this.$refs.detailsInfo.subProductHasLine = res.length > 0 ? this.$refs.detailsInfo.subProductHasLine = true : this.$refs.detailsInfo.subProductHasLine = false
			})
			if (this.organDetails.id) {
				this.getDetails()
			}
		},
		goToBillBlank () {
			const id = this.organDetails.parentBill.id
			const type = this.organDetails.parentBill.billClass
			this.$fxGoToBillBlank(type, { id }, 'detail')
		},
		exportModel () {
			this.onSaveClick().then(() => {
				const logger = this.$fxLogger.createInfo('production-manage.production-plan.exportModel', { orderData: this.organDetails })
				const id = this.organDetails.id
				return this.$fxApi('inStore.exportModal', id)({ logger }).then(res => {
					this.$fxUtils.downloadFile(res)
				})
			})
		},
		exportData () {
			this.onSaveClick().then(() => {
				if (this.tableDetails.length < 1) {
				// 没有明细则不允许导出
					this.$fxMessage.warning('当前无明细，不允许导出！')
					return false
				} else {
					const logger = this.$fxLogger.createInfo('production-manage.production-plan.exportData', { orderData: this.organDetails })
					const id = this.organDetails.id
					return this.$fxApi('productionPlan.exportData', id)({ logger }).then(res => {
						this.$fxUtils.downloadFile(res)
					})
				}
			})
		},
		importModel () {
			this.onSaveClick().then(() => {
				this.$fxUpload({ type: 'excel' }).then(this.importExcelHandler).then(this.confirmWrongData)
			})
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
		},
		importExcelHandler (file) {
			const params = {
				excelFile: file
			}
			const logger = this.$fxLogger.createInfo('production-manage.production-plan.importModel', { orderData: this.organDetails, name: file.name })
			return this.$fxApi('inStore.importData', this.organDetails.id)({ data: params, logger })
		},
		onPrintClick () {
			this.$fxGoPrint('InStore', this.organDetails.id)
		},
		onCopyClick () {
			const logger = this.$fxLogger.createInfo('production-manage.production-plan.copy', { orderData: this.organDetails })
			return this.$fxApi('productionPlan.copyOrder', this.organDetails.id)({ logger }).then(res => {
				this.$fxMessage.success('单据复制成功')
				this.$fxAppTabs.tabsPush({
					path: 'productionPlanDetail',
					query: {
						openType: 'edit',
						id: res.id
					}
				})
			})
		},
		onBillChainClick () {
			return this.$fxApi('productionPlan.getBillChain', this.organDetails.id).then(res => {
				this.billChainData = res
				const billData = {
					businessDate: this.organDetails.businessDate,
					sysBillCode: this.organDetails.sysBillCode,
					billState: this.organDetails.billState,
					id: this.organDetails.id,
					billClass: 'ProductionPlan',
					currentBill: true
				}
				this.$refs.billChain.open(billData)
			})
		},
		appVisibleHandler () {
			this.fxCache.clear()
			this.getAgentList(this.organDetails)
			this.getStore(this.organDetails)
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
}
</style>
