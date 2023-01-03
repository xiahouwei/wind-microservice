<template>
	<fx-bill-container
		title="加工单详情"
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
					:isPlan="isPlan"
					:disabled="!isState(['unSubmit'])|| authDisabled"
					@on-organ-change='onOrganChange'
				></basicInfo>
				<detailsInfo
					ref="detailsInfo"
					:organDetails="organDetails"
					:tableDetails="tableDetails"
					:storeSelectList="storeSelectList"
					:otherChargeTypeList="otherChargeTypeList"
					:isFullScreen.sync="isFullScreen"
					:fSaveMain="onSaveClickHandler"
					:isPlan="isPlan"
					:disabled="!isState(['unSubmit'])|| authDisabled"
					:deleteDisabled="isDisable"
					:itemName="itemName"
					@on-mistake-check="onMistakeCheck"
					@on-details-refresh="getDetails"
					@set-version="setVersion"
				></detailsInfo>
				<appendInfo
					v-show="!isFullScreen"
					:isFullScreen="isFullScreen"
					:organDetails="organDetails"
					:disabled="isDisable || authDisabled"
				></appendInfo>
				<mistakeCheck
					ref="mistakeCheck"
					:organDetails="organDetails"
					:storeSelectList="storeSelectList"
					:otherChargeTypeList="otherChargeTypeList"
					:tableDetails.sync="tableDetails"
					@set-version="setVersion"
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
				v-fx-auth:production-manage_machining-order.edit-machiningOrder="isState(['unSubmit'])"
				@click="onSaveClick"
			>保存</fx-button>
			<fx-button
				ref="submitBtn"
				type="submit"
				v-fx-auth:production-manage_machining-order.submit-machiningOrder="isState(['unSubmit'])"
				@click="onSubmitClick"
			>提交</fx-button>
			<fx-button
				ref="returnBtn"
				type="return"
				v-fx-auth:production-manage_machining-order.back-machiningOrder="isState(['unChecked'])"
				v-fx-tab:loop.store-manage_in-store-order_details.returnBtn
				@click="onReturnClick"
			>退回</fx-button>
			<fx-button
				ref="checkBtn"
				type="check"
				v-fx-auth:production-manage_machining-order.check-machiningOrder="isState(['unSubmit', 'unChecked'])"
				@click="onCheckClick"
			>审核</fx-button>
			<fx-button
				ref="uncheckBtn"
				type="uncheck"
				v-fx-auth:production-manage_machining-order.uncheck-machiningOrder="isState(['checked'])"
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
		<uncheck-order-info ref="uncheckOrderInfo" billType="MachineCompose"></uncheck-order-info>
	</fx-bill-container>
</template>
<script>
import { mapGetters } from 'vuex'
import basicInfo from './BasicInfo.vue'
import detailsInfo from './DetailsInfo.vue'
import appendInfo from './AppendInfo.vue'
import mistakeCheck from '../mistake-check/MistakeCheck.vue'
import checkErrInfo from './checkErrInfo'
import uncheckOrderInfo from '@/components/common/Fx-uncheck-order-info.vue'
export default {
	name: 'createOrgan',
	components: {
		basicInfo,
		detailsInfo,
		appendInfo,
		mistakeCheck,
		checkErrInfo,
		uncheckOrderInfo
	},
	data () {
		return {
			organDetails: {
				organ: {},
				operateMan: {}
			},
			tableDetails: [],
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			isFullScreen: false,
			organSelectList: [],
			agentSelectList: [],
			storeSelectList: [],
			otherChargeTypeList: [],
			billDeleteFlag: false,
			fxCache: this.$fxUtils.fxCache('in-store'),
			billChainData: {},
			isCommonTypeByRules: this.$fxTypeMiddleware.isCommonType('inStoreBillGenerateType', 'rules'),
			originDetail: [],
			fxCalculation: this.$fxCalculation('inStore'),
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
		isPlan () {
			return !!this.organDetails.parentBill
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
				show: !this.isAdd && !this.isChecked && this.detailsAuthGetter('production-manage_machining-order.delete-machiningOrder'),
				label: '删除',
				icon: 'delete-trash',
				click: this.onDeleteClick
			}, {
				show: this.detailsAuthGetter('production-manage_machining-order.export-machiningOrder'),
				label: '导出Excel',
				icon: 'export-excel',
				click: this.exportData
			}, {
				show: this.detailsAuthGetter('production-manage_machining-order.print-machiningOrder'),
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
			return !this.detailsAuthGetter('production-manage_machining-order.edit-machiningOrder')
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
			this.organDetails = {
				billState: 0, // 单据状态
				sysBillCode: '', // 系统单号
				userBillCode: this.$fxUtils.createBillCode('JG'), // 手工单号
				billType: 9200, //  单据类型
				businessDate: this.$fxUtils.setDateTime(new Date()), // 生产计划日期
				checkDate: '', // 生产计划日期
				organ: {
					id: ''
				}, // 生产机构
				operateMan: {
					id: currentUser.id
				},
				memo: '', // 整单备注，
				appendixes: []
			}
			this.billDeleteFlag = false
			this.fxCache.clear()
			this.tableDetails = []
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
			this.getStore(organDetails.organ.id)
			this.tableDetails = organDetails.details
			delete organDetails.details
			this.organDetails = organDetails
			this.fxDataVerification.resetData(this.organDetails)
			this.$nextTick(() => {
				if (!this.isState(['unSubmit']) || this.authDisabled) {
					this.$fxUtils.vDoRefFocus(this, 'refreshBtn')
				} else {
					this.$refs.basicInfo.defaultFocus()
				}
			})
		},
		async getListData (organDetails) {
			return Promise.all([
				this.getCurrentUser(),
				this.getOtherChargeTypeList(),
				this.getAgentList(organDetails),
				this.getOrgan(organDetails)
			]).then(([userData]) => {
				return Promise.resolve(userData)
			})
		},
		getOrganDetails (id) {
			return this.$fxApi('machiningOrder.getDetails', id)
		},
		getDetails () {
			return this.$fxApi('machiningOrder.getDetails', this.organDetails.id).then(res => {
				this.setVersion(res.version)
				this.tableDetails = res.details
				return Promise.resolve(res)
			})
		},
		setVersion (v) {
			this.organDetails.version = v
			this.fxDataVerification.resetData(this.organDetails)
		},
		// 获取经办人
		getAgentList (organDetails) {
			const params = organDetails ? [organDetails.operateMan.id] : []
			return this.$fxApi('inStore.getAgentList')({ data: params }).then(res => {
				this.agentSelectList = res
				return Promise.resolve(res)
			})
		},
		async getOtherChargeTypeList () {
			this.otherChargeTypeList = await this.$fxApi('machiningOrder.other_cost_type')
		},
		async getOrgan (organDetails) {
			const ids = []
			if (organDetails && organDetails.organ.id) { ids.push(organDetails.organ.id) }
			if (this.originDetail) {
				for (const i of this.originDetail) {
					if (i.house.id && !ids.includes(i.house.id)) {
						ids.push(i.house.id)
					}
				}
			}
			const organ = await this.getStoreOrganList({ ids, names: ['Shop', 'Center'] })
			this.organSelectList = organ
			return Promise.resolve(organ)
		},
		getStoreOrganList (data) {
			return this.$fxApi('outStore.getInStoreOrganList')({ data }).then(res => {
				return Promise.resolve(res)
			})
		},
		getCurrentUser () {
			return this.$fxApi('inStore.getCurrentUser')
		},
		// 删除明细为空的神产计划
		deleteEmptyBill () {
			if (this.organDetails.id && (this.tableDetails.length === 0 || (this.tableDetails.length === 1 && !this.tableDetails[0].id))) {
				return this.$fxApi('machiningOrder.delEmptyBill', this.organDetails.id).then(res => {
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
				this.$nextTick(() => {
					this.$refs.detailsInfo.$refs.detailsTable.clearExpanded()
					this.$refs.detailsInfo.$refs.detailsTable.clearSubSelection()
				})
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
				return this.$fxApi('machiningOrder.add')({ data: this.organDetails }).then(res => {
					this.$fxAppTabs.setTabTitle({ sysBillCode: res.sysBillCode })
					this.$fxAppTabs.setTabPathQuery({ openType: 'edit', id: res.id })
					this.$set(this.organDetails, 'id', res.id)
					this.$set(this.organDetails, 'recheckState', res.recheckState)
					this.$set(this.organDetails, 'sysBillCode', res.sysBillCode)
					this.$set(this.organDetails, 'createDate', res.createDate)
					this.$set(this.organDetails, 'version', res.version)
					this.organDetails.createMan = res.createMan || ''
					this.$set(this.organDetails, 'createUserName', res.createUserName || '')
					this.$set(this.organDetails, 'systemMemo', res.systemMemo)
					this.fxDataVerification.resetData(this.organDetails)
					const logger = this.$fxLogger.createInfo('production-manage.machining-order.add', { orderData: this.organDetails, type: '加工单' })
					const loggerInfo = this.$fxLogger.actionInfo(logger)
					loggerInfo.success()
					return Promise.resolve(res)
				}).catch(error => {
					const logger = this.$fxLogger.createInfo('production-manage.machining-order.add', { orderData: this.organDetails, type: '加工单' })
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
					const logger = this.$fxLogger.createInfo('production-manage.machining-order.update', this.createLoggerParams())
					return this.$fxApi('machiningOrder.edit', this.organDetails.id)({ data: this.organDetails, logger }).then(res => {
						this.$set(this.organDetails, 'version', res.version)
						this.fxDataVerification.resetData(this.organDetails)
						return Promise.resolve(res)
					})
				}
			}
		},
		createLoggerParams () {
			const originData = this.fxDataVerification.getOriginData()
			// originData.billBizTypeName = this.getNameById(originData.billBizTypeId, this.busTypeList)
			originData.operateMan.name = this.getNameById(originData.operateMan.id, this.agentSelectList)
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
			const logger = this.$fxLogger.createInfo(`production-manage.machining-order.${del}`, { orderData: this.organDetails })
			if (this.organDetails.billState === 3) {
				return this.$fxApi('machiningOrder.recyclingDelete', this.organDetails.id)({ logger }).then(res => {
					this.billDeleteFlag = true
					this.fxDataVerification.resetData(this.organDetails)
					return Promise.resolve()
				})
			} else {
				return this.$fxApi('machiningOrder.delete', this.organDetails.id)({ logger }).then(res => {
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
				return this.$refs.mistakeCheck.mistakeCheck('submit').then(this.onSubmitHandler)
				// return this.onSubmitHandler()
			})
		},
		onSubmitHandler () {
			const logger = this.$fxLogger.createInfo('production-manage.machining-order.submit', { orderData: this.organDetails })
			return this.$fxApi('machiningOrder.submit', this.organDetails.id)({ logger }).then(res => {
				this.updateOrganDetails(res)
				return Promise.resolve()
			})
		},
		onReturnClick () {
			return this.$fxConfirm('是否确定退回？').then(() => {
				const logger = this.$fxLogger.createInfo('production-manage.machining-order.return', { orderData: this.organDetails })
				return this.$fxApi('machiningOrder.return', this.organDetails.id)({ logger }).then(res => {
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
					return this.$refs.mistakeCheck.mistakeCheck('check').then(this.onCheckHandler)
				} else {
					return this.onCheckHandler()
				}
			})
		},
		onCheckHandler () {
			const logger = this.$fxLogger.createInfo('production-manage.machining-order.check', { orderData: this.organDetails })
			return this.$fxApi('machiningOrder.check', this.organDetails.id)({ logger }).then(res => {
				this.updateOrganDetails(res)
				return Promise.resolve()
			}).catch(err => {
				if (err.code === 1) {
					const errMessage = this.$fxUtils.JSONparse(err.message) || []
					this.$refs.checkErrInfo.open(errMessage)
				} else if (err.code === 3) {
					const errMessage = this.$fxUtils.JSONparse(err.message) || []
					this.$refs.uncheckOrderInfo.open(errMessage)
				} else {
					return this.$fxMessage.error(err.message || '审核失败，请稍后再试')
				}
			})
		},
		onUncheckClick () {
			return this.$fxConfirm('是否确定反审？').then(() => {
				const logger = this.$fxLogger.createInfo('production-manage.machining-order.uncheck', { orderData: this.organDetails })
				return this.$fxApi('machiningOrder.uncheck', this.organDetails.id)({ logger }).then(res => {
					this.updateOrganDetails(res)
					return Promise.resolve()
				}).catch(err => {
					if (err.code === 1) {
						const errMessage = this.$fxUtils.JSONparse(err.message) || []
						this.$refs.checkErrInfo.open(errMessage)
					} else if (err.code === 3) {
						const errMessage = this.$fxUtils.JSONparse(err.message) || []
						this.$refs.uncheckOrderInfo.open(errMessage)
					} else {
						return this.$fxMessage.error(err.message || '反审失败，请稍后再试')
					}
				})
			})
		},
		onMistakeCheckAction (type) {
			if (type === 'submit') {
				this.onSubmitHandler()
			} else {
				this.onCheckHandler()
			}
		},
		onMistakeClose () {
			this.doDetailsRefresh()
			this.$refs.detailsInfo.clear()
		},
		onMistakeCheck () {
			this.$refs.mistakeCheck.mistakeCheck().then(() => {
				this.$fxMessage.success('未查询到存在问题的数据')
			})
		},
		doDetailsRefresh () {
			// return this.getDetails()
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
		onOrganChange (item) {
			this.storeSelectList = item.store
			if (this.organDetails.id) {
				this.getDetails().then(() => {
					this.organDetails.organ = item
				})
			} else {
				this.organDetails.organ = item
			}
		},
		getStore (organId) {
			const organList = [...this.organSelectList[0].listData, ...this.organSelectList[1].listData]
			this.storeSelectList = organList.find(item => {
				return item.id === organId
			}).store
		},
		clearValidate () {
			this.$refs.basicInfo.$refs.form.clearValidate()
		},
		goToBillBlank () {
			const id = this.organDetails.parentBill.id
			const type = this.organDetails.parentBill.billClass
			this.$fxGoToBillBlank(type, { id }, 'detail')
		},
		exportModel () {
			this.onSaveClick().then(() => {
				const logger = this.$fxLogger.createInfo('production-manage.machining-order.exportModel', { orderData: this.organDetails })
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
					const logger = this.$fxLogger.createInfo('production-manage.machining-order.exportData', { orderData: this.organDetails })
					const id = this.organDetails.id
					return this.$fxApi('machiningOrder.exportData', id)({ logger }).then(res => {
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
			const logger = this.$fxLogger.createInfo('production-manage.machining-order.importModel', { orderData: this.organDetails, name: file.name })
			return this.$fxApi('inStore.importData', this.organDetails.id)({ data: params, logger })
		},
		onPrintClick () {
			this.$fxGoPrintNested('MachineCompose', this.organDetails.id)
		},
		onCopyClick () {
			const logger = this.$fxLogger.createInfo('production-manage.machining-order.copy', { orderData: this.organDetails })
			return this.$fxApi('machiningOrder.copyOrder', this.organDetails.id)({ logger }).then(res => {
				this.$fxMessage.success('单据复制成功')
				this.$emit('on-copy', res.id)
			})
		},
		onBillChainClick () {
			return this.$fxApi('machiningOrder.getBillChain', this.organDetails.id).then(res => {
				this.billChainData = res
				const billData = {
					businessDate: this.organDetails.businessDate,
					sysBillCode: this.organDetails.sysBillCode,
					billState: this.organDetails.billState,
					id: this.organDetails.id,
					billClass: 'MachineCompose',
					currentBill: true
				}
				this.$refs.billChain.open(billData)
			})
		},
		appVisibleHandler () {
			this.fxCache.clear()
			this.getAgentList(this.organDetails)
			this.getOrgan(this.organDetails)
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
