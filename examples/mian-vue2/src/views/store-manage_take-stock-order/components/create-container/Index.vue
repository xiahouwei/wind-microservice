<template>
	<fx-bill-container
		title="盘点单详情"
		:moreBtnOption="moreBtnOption"
		:billChainOption="billChainOption"
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
					:businessTypeSelectList="businessSelectList"
					:organSelectList="organSelectList"
					:storeSelectList.sync="storeSelectList"
					:agentSelectList="agentSelectList"
					:checkClassSelectList="checkClassSelectList"
					:disabled="isDisable || authDisabled"
					:systemParam="systemParamAccountingWay"
					@on-refresh-bussiness-type-list="getBusinessTypeList"
					@on-refresh-check-class-list="getCheckClassList"
					@on-details-refresh="onDetailsRefresh"
					@update-verification="onUpdateVerification"
				></basicInfo>
				<detailsInfo
					ref="detailsInfo"
					:organDetails="organDetails"
					:tableDetails="tableDetails"
					:isFullScreen.sync="isFullScreen"
					:storeSelectList="storeSelectList"
					:fSaveMain="onSaveClickHandler"
					:deleteDisabled="isDisable"
					:disabled="isDisable || authDisabled"
					@on-details-refresh="onDetailsRefresh"
					@on-mistake-check="onMistakeCheck"
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
					:tableDetails.sync="tableDetails"
					:disabled="isDisable || authDisabled"
					@on-action="onMistakeCheckAction"
					@on-mistake-close="onMistakeClose"
				></mistakeCheck>
			</w-scroll-bar>
		</div>
		<template slot="footer-left">
			<fx-button
				ref="refreshBtn"
				type="save"
				v-if="!isAdd"
				v-fx-tab:loop.store-manage_take-stock-order_details.refreshBtn
				@click="onRefresh"
			>刷新</fx-button>
		</template>
		<template slot="footer-right">
			<el-button
				ref="cancelBtn"
				v-fx-tab:loop.store-manage_take-stock-order_details.cancelBtn
				@click="onCancelClick"
			>取消</el-button>
			<fx-button
				ref="saveBtn"
				type="save"
				v-fx-auth:store-manage_take-stock-order.edit-order="!isRechecked && isState(['unSubmit'])"
				v-fx-tab:loop.store-manage_take-stock-order_details.saveBtn
				@click="onSaveClick"
			>保存</fx-button>
			<fx-button
				ref="submitBtn"
				type="submit"
				v-fx-auth:store-manage_take-stock-order.submit-order="isState(['unSubmit'])"
				v-fx-tab:loop.store-manage_take-stock-order_details.submitBtn
				@click="onSubmitClick"
			>提交</fx-button>
			<fx-button
				ref="returnBtn"
				type="return"
				v-fx-auth:store-manage_take-stock-order.back-order="isState(['unChecked'])"
				v-fx-tab:loop.store-manage_take-stock-order_details.returnBtn
				@click="onReturnClick"
			>退回</fx-button>
			<fx-button
				ref="checkBtn"
				type="check"
				v-fx-auth:store-manage_take-stock-order.check-order="isState(['unSubmit', 'unChecked'])"
				v-fx-tab:loop.store-manage_take-stock-order_details.checkBtn
				@click="onCheckClick"
			>审核</fx-button>
			<fx-button
				ref="uncheckBtn"
				type="uncheck"
				v-fx-auth:store-manage_take-stock-order.uncheck-order="isState(['checked']) && !isRechecked && !isCarryForward"
				v-fx-tab:loop.store-manage_take-stock-order_details.uncheckBtn
				@click="onUncheckClick"
			>反审</fx-button>
			<fx-button
				ref="recheckBtn"
				type="recheck"
				v-fx-auth:store-manage_take-stock-order.recheck-order="isState(['checked']) && !isRechecked && !isCarryForward"
				v-fx-tab:loop.store-manage_take-stock-order_details.recheckBtn
				@click="onRecheckClick"
			>复审</fx-button>
			<fx-button
				ref="unrecheckBtn"
				type="unrecheck"
				v-fx-auth:store-manage_take-stock-order.unrecheck-order="isRechecked && !isCarryForward"
				v-fx-tab:loop.store-manage_take-stock-order_details.unrecheckBtn
				@click="onUnrecheckClick"
			>取消复审</fx-button>
		</template>
		<fx-bill-chain
			ref="billChain"
			:billChainData="billChainData"
		>
		</fx-bill-chain>
		<check-err-info ref="checkErrInfo"></check-err-info>
		<uncheck-order-info ref="uncheckOrderInfo" billType="CheckBill"></uncheck-order-info>
	</fx-bill-container>
</template>
<script>
import { mapGetters } from 'vuex'
import basicInfo from './BasicInfo.vue'
import appendInfo from './AppendInfo.vue'
import detailsInfo from './DetailsInfo.vue'
import mistakeCheck from '../mistake-check/MistakeCheck.vue'
import checkErrInfo from '@/components/common/Fx-check-err-info.vue'
import uncheckOrderInfo from '@/components/common/Fx-uncheck-order-info.vue'
import { apiName } from '../../Index.vue'
export default {
	name: 'createOrgan',
	components: {
		basicInfo,
		appendInfo,
		detailsInfo,
		mistakeCheck,
		checkErrInfo,
		uncheckOrderInfo
	},
	data () {
		return {
			organDetails: {
				organ: {},
				house: {},
				checkClass: {},
				operateMan: {}
			},
			tableDetails: [],
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			isFullScreen: false,
			businessSelectList: [],
			organSelectList: [],
			agentSelectList: [],
			sellerSelectList: [],
			storeSelectList: [],
			checkClassSelectList: [],
			showExport: false,
			checkWaySelectList: this.$fxTypeMiddleware.getCommonTypeList('checkWay'),
			notCheckTypeSelectList: this.$fxTypeMiddleware.getCommonTypeList('notCheckType'),
			fxCache: this.$fxUtils.fxCache('take-stock-order'),
			billChainData: {}
		}
	},
	provide () {
		return {
			$$orderParent: this
		}
	},
	computed: {
		...mapGetters(['getSysParams', 'detailsAuthGetter']),
		moreBtnOption () {
			return [{
				show: !this.isAdd && !this.isDisable && this.detailsAuthGetter('store-manage_take-stock-order.delete-order'),
				label: '删除',
				icon: 'delete-trash',
				click: this.onDeleteClick
			}, {
				show: !this.isDisable && this.detailsAuthGetter('store-manage_take-stock-order.add-order'),
				label: '导入必盘',
				icon: 'import-must',
				click: this.onImportMustClick
			}, {
				show: this.isState(['unChecked', 'unSubmit']),
				label: '刷新账存',
				icon: 'refresh-grey',
				click: this.onRefreshStockClick
			}, {
				label: '导出Excel',
				icon: 'export-excel',
				show: !(!this.organDetails.checkWay && this.isAdd) && this.detailsAuthGetter('store-manage_take-stock-order.export-order|export-blank'),
				children: [{
					show: this.organDetails.checkWay && this.detailsAuthGetter('store-manage_take-stock-order.export-blank'),
					label: '导出空白模板',
					icon: 'export-template',
					click: this.exportModel
				}, {
					show: !this.isAdd && this.detailsAuthGetter('store-manage_take-stock-order.export-order'),
					label: '导出明细数据',
					icon: 'export-data',
					click: this.exportData
				}]
			}, {
				show: !this.isDisable && this.organDetails.checkWay && this.detailsAuthGetter('store-manage_take-stock-order.import-order'),
				label: '导入Excel',
				icon: 'import-excel',
				children: [{
					label: '按模板导入数据',
					icon: 'import-template',
					click: this.importModel
				}]
			}, {
				show: !this.isAdd && this.detailsAuthGetter('store-manage_take-stock-order.print-order'),
				label: '打印',
				icon: 'print',
				click: this.onPrintClick
			}]
		},
		isAdd () {
			return !this.organDetails.id
		},
		isRechecked () {
			return this.$fxStateMiddleware.isState('recheckState')(['rechecked'])(this.organDetails.recheckState)
		},
		currentState () {
			return this.$fxStateMiddleware.getOrderStateById(this.organDetails.billState, this.organDetails.recheckState, this.organDetails.deleteState)
		},
		isState () {
			return (type) => {
				return this.$fxStateMiddleware.isState('billState')(type)(this.organDetails.billState)
			}
		},
		isDisable () {
			return this.$fxStateMiddleware.isState('billState')(['unChecked', 'checked', 'deleted'])(this.organDetails.billState)
		},
		isDelete () {
			return this.$fxStateMiddleware.isState('billState')(['deleted'])(this.organDetails.billState)
		},
		checkClassSelectListComputed () {
			return [{
				id: '1',
				name: '全盘'
			}, ...this.checkClassSelectList]
		},
		systemParamAccountingWay () {
			return this.getSysParams('JCHS_HSFS', 'value')
		},
		authDisabled () {
			return !this.detailsAuthGetter('store-manage_take-stock-order.edit-order')
		},
		systemParamCheckDate () {
			return this.getSysParams('CHECK_DATE', 'value')
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
		this.$fxTabkey.init('store-manage_take-stock-order_details', this)
		this.initBill()
		this.bindTabBeforeDeactivated()
	},
	methods: {
		initBill () {
			if (this.$route.query.openType === 'add') {
				const { checkClassId, organId, houseId } = this.$route.query
				this.add({ checkClassId, organId, houseId })
			} else if (this.$route.query.openType === 'edit') {
				this.edit(this.$route.query.id)
			}
		},
		bindTabBeforeDeactivated () {
			this.$fxAppTabs.onTabBeforeDeactivated(() => {
				return this.verificationDetails()
			}, this)
		},
		async add ({ checkClassId, organId, houseId }) {
			const userBillCode = this.$fxUtils.createBillCode('PD')
			const { currentOrgan, currentUser } = await this.getListData({ billType: 4001 })
			await this.getStoreList(organId || currentOrgan.id)
			const house = (houseId && { id: houseId }) || this.storeSelectList[0] || {
				id: ''
			}
			const inOrgan = this.$fxUtils.getSelectTagById(currentOrgan.id, this.organSelectList)
			const businessDate = await this.getBusinessDate(organId || inOrgan.id)
			await this.getCheckClassList(organId || currentOrgan.id, house.id, businessDate)
			this.organDetails = {
				userBillCode,
				billType: 4001,
				billBizTypeId: '',
				businessDate,
				operateMan: {
					id: currentUser.id
				},
				memo: '',
				organ: {
					id: organId || inOrgan.id
				},
				house,
				checkClass: {
					id: checkClassId || '1'
				},
				checkWay: 1,
				notCheck: 0,
				billState: 0,
				sysBillCode: '',
				appendixList: [],
				details: [],
				appendices: [],
				autoType: 0
			}
			this.fxCache.clear()
			this.tableDetails = []
			this.fxDataVerification.resetData(this.organDetails)
			this.$nextTick(() => {
				this.$refs.basicInfo.defaultFocus()
			})
		},
		async edit (id) {
			const organDetails = await this.getDetails(id)
			this.$fxAppTabs.setTabTitle({ sysBillCode: organDetails.sysBillCode })
			await this.getListDataEdit(organDetails)
			this.fxCache.clear()
			this.tableDetails = organDetails.details
			delete organDetails.details
			this.organDetails = organDetails
			this.fxDataVerification.resetData(this.organDetails)
			this.$nextTick(() => {
				if (this.isDisable || this.authDisabled) {
					this.$fxUtils.vDoRefFocus(this, 'refreshBtn')
				} else {
					this.$refs.basicInfo.defaultFocus()
				}
			})
		},
		getBusinessDate (organId) {
			let businessDate = this.$fxUtils.setDateTime(new Date())
			if (this.systemParamCheckDate || !organId) {
				return Promise.resolve(businessDate)
			} else {
				return this.$fxApi(`${apiName}.getAccountingPeriod`, organId).then(res => {
					businessDate = `${res.endDate} 23:59:59`
					return Promise.resolve(businessDate)
				}).catch(() => {
					return Promise.resolve(businessDate)
				})
			}
		},
		async getListData (organDetails) {
			return Promise.all([
				this.getCurrentUser(),
				this.getBusinessTypeList(organDetails),
				this.getOrganList(),
				this.getAgentList()
			]).then(([userData]) => {
				return Promise.resolve(userData)
			})
		},
		async getListDataEdit (organDetails) {
			return Promise.all([
				this.getCurrentUser(),
				this.getBusinessTypeList(organDetails),
				this.getOrganList(organDetails),
				this.getAgentList(organDetails),
				this.getStoreList(organDetails.organ.id, organDetails),
				this.getCheckClassList(organDetails.organ.id, organDetails.house.id, organDetails.businessDate, organDetails.checkClass.id)
			]).then(() => {
				return Promise.resolve()
			})
		},
		getCurrentUser () {
			return this.$fxApi('common.getCurrentUser')
		},
		getAgentList (organDetails) {
			const params = organDetails ? [organDetails.operateMan.id] : []
			return this.$fxApi(`${apiName}.getAgentList`)({ data: params }).then(res => {
				this.agentSelectList = res
				return Promise.resolve(res)
			})
		},
		getBusinessTypeList (organDetails = { billType: 4001 }) {
			const params = organDetails && organDetails.billBizTypeId ? [organDetails.billBizTypeId] : []
			return this.$fxApi(`${apiName}.getBillDetailBizTypeSelect`, organDetails.billType)({ data: params }).then(res => {
				this.businessSelectList = res
				return Promise.resolve(res)
			})
		},
		getOrganList (organDetails) {
			const ids = organDetails ? [organDetails.organ.id] : []
			if (organDetails && organDetails.house) {
				ids.push(organDetails.house.id)
			}
			const params = { ids, names: ['Shop', 'Center'] }
			return this.$fxApi(`${apiName}.getOrganTabList`)({ data: params }).then(res => {
				this.organSelectList = res
				return Promise.resolve(res)
			})
		},
		getStoreList (organId, organDetails) {
			if (!organId) {
				this.storeSelectList = []
				return Promise.resolve()
			}
			const params = organDetails ? [organDetails.house.id] : []
			return this.$fxApi(`${apiName}.getCheckHouseList`, organId)({ data: params }).then(res => {
				this.storeSelectList = res
				return Promise.resolve(res)
			})
		},
		getCheckClassList (organId, houseId, checkDate, checkClass = '') {
			if (!organId || !houseId || !checkDate) {
				this.checkClassSelectList = []
				return Promise.resolve()
			}
			const params = {
				organId,
				houseId,
				checkDate,
				namedIdList: [checkClass]
			}
			return this.$fxApi(`${apiName}.getCheckClassList`)({ data: params }).then(res => {
				this.checkClassSelectList = res
				return Promise.resolve(res)
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
			return this.$refs.basicInfo.validate()
		},
		onSaveOrganHandler () {
			if (this.isAdd) {
				const typeName = this.$fxTypeMiddleware.getCommonTypeItemById('takeStockBillType')(this.organDetails.billType).label
				let logger = this.$fxLogger.createInfo('store-manage.take-stock-order.add', { orderData: this.organDetails, type: typeName })
				return this.$fxApi(`${apiName}.add`)({ data: this.organDetails }).then(res => {
					this.$fxAppTabs.setTabTitle({ sysBillCode: res.sysBillCode })
					this.$fxAppTabs.setTabPathQuery({ openType: 'edit', id: res.id })
					this.$set(this.organDetails, 'id', res.id)
					this.organDetails.businessDate = res.businessDate
					this.organDetails.createDate = res.createDate
					this.organDetails.createMan = res.createMan || ''
					this.organDetails.createUserName = res.createUserName || ''
					this.organDetails.sysBillCode = res.sysBillCode
					this.organDetails.systemMemo = res.systemMemo || ''
					this.fxDataVerification.resetData(this.organDetails)
					logger = this.$fxLogger.createInfo('store-manage.take-stock-order.add', { orderData: this.organDetails, type: typeName })
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
					const logger = this.$fxLogger.createInfo('store-manage.take-stock-order.update', this.createLoggerParams())
					return this.$fxApi(`${apiName}.save`, this.organDetails.id)({ data: this.organDetails, logger }).then(res => {
						this.organDetails.businessDate = res.businessDate
						const organDetails = this.organDetails
						this.getCheckClassList(organDetails.organ.id, organDetails.house.id, organDetails.businessDate, organDetails.checkClass.id)
						this.getBusinessTypeList(this.organDetails)
						this.fxDataVerification.resetData(this.organDetails)
						return Promise.resolve(res)
					})
				}
			}
		},
		createLoggerParams () {
			const originData = this.fxDataVerification.getOriginData()
			originData.billTypeName = this.$fxTypeMiddleware.getCommonTypeItemById('takeStockBillType')(originData.billType).label
			originData.billBizTypeName = this.getNameById(originData.billBizTypeId, this.businessSelectList)
			originData.organName = this.getOrganNameById(originData.organ.id, this.organSelectList)
			originData.houseName = this.getNameById(originData.house.id, this.storeSelectList)
			originData.operatorName = this.getNameById(originData.operateMan.id, this.agentSelectList)
			originData.checkClassName = this.getNameById(originData.checkClass.id, this.checkClassSelectListComputed)
			originData.checkWayName = this.getLabelById(originData.checkWay, this.checkWaySelectList)
			originData.notCheckName = this.getLabelById(originData.notCheck, this.notCheckTypeSelectList)
			const organDetails = this.$fxUtils.deepClone(this.organDetails)
			organDetails.billTypeName = this.$fxTypeMiddleware.getCommonTypeItemById('takeStockBillType')(organDetails.billType).label
			organDetails.billBizTypeName = this.getNameById(organDetails.billBizTypeId, this.businessSelectList)
			organDetails.organName = this.getOrganNameById(organDetails.organ.id, this.organSelectList)
			organDetails.houseName = this.getNameById(organDetails.house.id, this.storeSelectList)
			organDetails.operatorName = this.getNameById(organDetails.operateMan.id, this.agentSelectList)
			organDetails.checkClassName = this.getNameById(organDetails.checkClass.id, this.checkClassSelectListComputed)
			organDetails.checkWayName = this.getLabelById(organDetails.checkWay, this.checkWaySelectList)
			organDetails.notCheckName = this.getLabelById(organDetails.notCheck, this.notCheckTypeSelectList)
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
		getLabelById (id, list) {
			const selectedItem = list.find(item => item.id === id)
			return selectedItem ? selectedItem.label : ''
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
			const api = this.isDelete ? 'recyclingDelete' : 'del'
			const del = this.isDelete ? 'recyclingDelete' : 'delete'
			const logger = this.$fxLogger.createInfo(`store-manage.take-stock-order.${del}`, { orderData: this.organDetails })
			return this.$fxApi(`${apiName}.${api}`, this.organDetails.id)({ logger }).then(res => {
				this.fxDataVerification.resetData(this.organDetails)
				return Promise.resolve()
			})
		},
		onRefresh () {
			this.verificationDetails('当前页面存在未保存数据，是否确定刷新操作？').then(() => {
				this.edit(this.organDetails.id)
			})
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
		getDetails (id) {
			return this.$fxApi(`${apiName}.get`, id)
		},
		onDetailsRefresh () {
			return this.$fxApi(`${apiName}.getDetails`, this.organDetails.id).then(res => {
				this.tableDetails = res
				return Promise.resolve(res)
			})
		},
		beforeAction (message) {
			return this.$fxConfirm(message).then(() => {
				return this.$refs.detailsInfo.checkDetailsUnSaving().then(this.onSaveClickHandler)
			})
		},
		onSubmitClick () {
			return this.beforeAction('是否确定提交？').then(() => {
				if (this.tableDetails.length === 0) {
					return this.onBeforeSubmit().then(() => {
						return this.$refs.mistakeCheck.mistakeCheck('submit').then(this.onSubmitHandler)
					})
				} else {
					return this.$refs.mistakeCheck.mistakeCheck('submit').then(this.onSubmitHandler)
				}
			}).catch(() => {})
		},
		onSubmitHandler () {
			const logger = this.$fxLogger.createInfo('store-manage.take-stock-order.submit', { orderData: this.organDetails })
			return this.$fxApi(`${apiName}.submit`, this.organDetails.id)({ logger }).then(res => {
				this.updateBillState(res)
				this.fxDataVerification.resetData(this.organDetails)
				return this.onDetailsRefresh()
			}).catch(err => {
				if (err.code === 2) {
					const errMessage = this.$fxUtils.JSONparse(err.message) || []
					this.$refs.uncheckOrderInfo.open(errMessage)
				} else {
					return this.$fxMessage.error(err.message || '提交失败，请稍后再试')
				}
			})
		},
		onBeforeSubmit () {
			return this.$fxApi(`${apiName}.beforeSubmit`, this.organDetails.id).then(res => {
				return Promise.resolve(res)
			})
		},
		onReturnClick () {
			return this.$fxConfirm('是否确定退回？').then(() => {
				const logger = this.$fxLogger.createInfo('store-manage.take-stock-order.return', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.return`, this.organDetails.id)({ logger }).then(res => {
					this.updateBillState(res)
					this.fxDataVerification.resetData(this.organDetails)
					return this.onDetailsRefresh()
				})
			})
		},
		onCheckClick () {
			return this.beforeAction('是否确定审核？').then(() => {
				if (this.$fxStateMiddleware.isState('billState')(['unSubmit'])(this.organDetails.billState)) {
					if (this.tableDetails.length === 0) {
						return this.onBeforeCheck().then(() => {
							return this.$refs.mistakeCheck.mistakeCheck('check').then(this.onCheckHandler)
						})
					} else {
						return this.$refs.mistakeCheck.mistakeCheck('check').then(this.onCheckHandler)
					}
				} else {
					return this.onCheckHandler()
				}
			})
		},
		onBeforeCheck () {
			return this.$fxApi(`${apiName}.beforeCheck`, this.organDetails.id).then(res => {
				return Promise.resolve(res)
			})
		},
		onCheckHandler () {
			const logger = this.$fxLogger.createInfo('store-manage.take-stock-order.check', { orderData: this.organDetails })
			return this.$fxApi(`${apiName}.check`, this.organDetails.id)({ logger }).then(res => {
				this.updateBillState(res)
				this.fxDataVerification.resetData(this.organDetails)
				return this.onDetailsRefresh()
			}).catch(err => {
				if (err.code === 1) {
					const errMessage = this.$fxUtils.JSONparse(err.message) || []
					this.$refs.checkErrInfo.open(errMessage)
				} else if (err.code === 2 || err.code === 3) {
					const errMessage = this.$fxUtils.JSONparse(err.message) || []
					this.$refs.uncheckOrderInfo.open(errMessage, err.code)
				} else {
					return this.$fxMessage.error(err.message || '审核失败，请稍后再试')
				}
			})
		},
		onUncheckClick () {
			return this.$fxConfirm('是否确定反审？').then(this.uncheckHandler)
		},
		uncheckHandler () {
			const logger = this.$fxLogger.createInfo('store-manage.take-stock-order.uncheck', { orderData: this.organDetails })
			return this.$fxApi(`${apiName}.uncheck`, this.organDetails.id)({ logger }).then(res => {
				this.updateBillState(res)
				this.fxDataVerification.resetData(this.organDetails)
				return this.onDetailsRefresh()
			}).catch(err => {
				if (err.code === 1) {
					const errMessage = this.$fxUtils.JSONparse(err.message) || []
					this.$refs.checkErrInfo.open(errMessage)
				} else if (err.code === 2 || err.code === 3) {
					const errMessage = this.$fxUtils.JSONparse(err.message) || []
					this.$refs.uncheckOrderInfo.open(errMessage, err.code)
				} else {
					return this.$fxMessage.error(err.message || '反审核失败，请稍后再试')
				}
			})
		},
		onRecheckClick () {
			return this.beforeAction('是否确定复审？').then(() => {
				const logger = this.$fxLogger.createInfo('store-manage.take-stock-order.recheck', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.recheck`, this.organDetails.id)({ logger }).then(res => {
					this.updateBillState(res)
					this.fxDataVerification.resetData(this.organDetails)
					return Promise.resolve()
				})
			})
		},
		onUnrecheckClick () {
			return this.$fxConfirm('是否确定取消复审？').then(() => {
				const logger = this.$fxLogger.createInfo('store-manage.take-stock-order.unrecheck', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.unrecheck`, this.organDetails.id)({ logger }).then(res => {
					this.updateBillState(res)
					this.fxDataVerification.resetData(this.organDetails)
					return Promise.resolve()
				})
			})
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
		onImportMustClick () {
			return this.beforeAction('是否确定导入必盘品项？').then(() => {
				const logger = this.$fxLogger.createInfo('store-manage.take-stock-order.importMust', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.importMustCheckItem`, this.organDetails.id)({ data: this.organDetails, logger }).then(this.onDetailsRefresh)
			})
		},
		onUpdateVerification () {
			this.fxDataVerification.resetData(this.organDetails)
		},
		onRefreshStockClick () {
			if (this.tableDetails.length < 1) return false
			return this.beforeAction('是否确定刷新账存？').then(this.refreshStockHandler)
		},
		refreshStockHandler () {
			return this.$fxApi(`${apiName}.refreshStock`, this.organDetails.id).then(this.onDetailsRefresh)
		},
		exportModel () {
			this.onSaveClick().then(() => {
				const logger = this.$fxLogger.createInfo('store-manage.take-stock-order.exportModel', { orderData: this.organDetails })
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
				const logger = this.$fxLogger.createInfo('store-manage.take-stock-order.exportData', { orderData: this.organDetails })
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
			const logger = this.$fxLogger.createInfo('store-manage.take-stock-order.importModel', { orderData: this.organDetails, name: file.name })
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
		},
		onPrintClick () {
			this.$fxGoPrint('CheckBill', this.organDetails.id)
		},
		onBillChainClick () {
			return this.$fxApi(`${apiName}.getBillChain`, this.organDetails.id).then(res => {
				this.billChainData = res
				const billData = {
					businessDate: this.organDetails.businessDate,
					sysBillCode: this.organDetails.sysBillCode,
					billState: this.organDetails.billState,
					id: this.organDetails.id,
					billClass: 'CheckBill',
					currentBill: true
				}
				this.$refs.billChain.open(billData)
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
}
.export-link {
	position: absolute
	bottom: 0
	right: 0
}
</style>
