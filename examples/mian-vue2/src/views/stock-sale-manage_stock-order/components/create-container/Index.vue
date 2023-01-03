<template>
	<fx-bill-container
		title="采购订单详情"
		:moreBtnOption="moreBtnOption"
		:billChainOption="billChainOption"
	>
		<template slot="sub">
			<fx-details-state-tag :label="currentState.label" :icon="currentState.icon"></fx-details-state-tag>
		</template>
		<template slot="parentBill" v-if="!isAdd">
			<template	v-if='hasParentBill'>
				上级单据:
			<w-link
				@click='goToBillBlank'
			>{{organDetails.parentBill.sysBillCode}}</w-link>
			</template>
			<span v-else>无上级单据</span>
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
					:buyerSelectList="buyerSelectList"
					:storeSelectList.sync="storeSelectList"
					:agentSelectList="agentSelectList"
					:sellerSelectList="sellerSelectList"
					:planSelectList.sync="planSelectList"
					:disabled="isDisable || isAssign || authDisabled"
					:billCreateTypeList="billCreateTypeList"
					:dateChangeTriggerSave.sync="dateChangeTriggerSave"
					@on-refresh-bussiness-type-list="getBusinessTypeList"
					@on-details-refresh="onDetailsRefresh"
					@on-order-save="onOrderSave"
					@on-organ-change="onOrganChange"
					@on-other-organ-change="onOtherOrganChange"
				></basicInfo>
				<sendInfo
					v-show="!isFullScreen"
					ref="sendInfo"
					:organDetails="organDetails"
					:disabled="isDisable || authDisabled"
				></sendInfo>
				<detailsInfo
					ref="detailsInfo"
					:organDetails="organDetails"
					:tableDetails="tableDetails"
					:isFullScreen.sync="isFullScreen"
					:storeSelectList="storeSelectList"
					:fSaveMain="onSaveClickHandler"
					:disabled="isDisable || authDisabled || isJsdOrder"
					:deleteDisabled="isDisable"
					:mistakeDisabled="isDisable || authDisabled"
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
				v-fx-tab:loop.stock-sale-manage_stock-order_details.refreshBtn
				@click="onRefresh"
			>刷新</fx-button>
		</template>
		<template slot="footer-right">
			<el-button
				ref="cancelBtn"
				v-fx-tab:loop.stock-sale-manage_stock-order_details.cancelBtn
				@click="onCancelClick"
			>取消</el-button>
			<fx-button
				ref="saveBtn"
				type="save"
				v-fx-auth:stock-sale-manage_stock-order.edit-stock="!isDisable"
				v-fx-tab:loop.stock-sale-manage_stock-order_details.saveBtn
				@click="onSaveClick"
			>保存</fx-button>
			<fx-button
				ref="submitBtn"
				type="submit"
				v-fx-auth:stock-sale-manage_stock-order.submit-stock="isState(['unSubmit'])"
				v-fx-tab:loop.stock-sale-manage_stock-order_details.submitBtn
				@click="onBuyerSubmitClick"
			>提交</fx-button>
			<fx-button
				ref="returnBtn"
				type="return"
				v-fx-auth:stock-sale-manage_stock-order.back-stock="isState(['unChecked'])"
				v-fx-tab:loop.stock-sale-manage_stock-order_details.returnBtn
				@click="onBuyerReturnClick"
			>退回</fx-button>
			<fx-button
				ref="checkBtn"
				type="check"
				v-fx-auth:stock-sale-manage_stock-order.check-stock="isState(['unSubmit', 'unChecked'])"
				v-fx-tab:loop.stock-sale-manage_stock-order_details.checkBtn
				@click="onBuyerCheckClick"
			>审核</fx-button>
			<fx-button
				ref="uncheckBtn"
				type="uncheck"
				v-fx-auth:stock-sale-manage_stock-order.uncheck-stock="isState(['checked']) && !isRechecked && !isCarryForward"
				v-fx-tab:loop.stock-sale-manage_stock-order_details.uncheckBtn
				@click="onBuyerUncheckClick"
			>反审</fx-button>
			<fx-button
				ref="recheckBtn"
				type="recheck"
				v-fx-auth:stock-sale-manage_stock-order.recheck-stock="isState(['checked']) && !isRechecked && !isCarryForward"
				v-fx-tab:loop.stock-sale-manage_stock-order_details.recheckBtn
				@click="onBuyerRecheckClick"
			>复审</fx-button>
			<fx-button
				ref="unrecheckBtn"
				type="unrecheck"
				v-fx-auth:stock-sale-manage_stock-order.unrecheck-stock="isRechecked && !isCarryForward"
				v-fx-tab:loop.stock-sale-manage_stock-order_details.unrecheckBtn
				@click="onBuyerUnrecheckClick"
			>取消复审</fx-button>
		</template>
		<fx-bill-chain
			ref="billChain"
			:billChainData="billChainData"
		>
		</fx-bill-chain>
	</fx-bill-container>
</template>
<script>
import { apiName } from '../../Index.vue'
import { mapGetters } from 'vuex'
import basicInfo from './BasicInfo.vue'
import sendInfo from './SendInfo.vue'
import appendInfo from './AppendInfo.vue'
import detailsInfo from './DetailsInfo.vue'
import mistakeCheck from '../mistake-check/MistakeCheck.vue'
export default {
	name: 'createOrgan',
	components: {
		basicInfo,
		sendInfo,
		appendInfo,
		detailsInfo,
		mistakeCheck
	},
	data () {
		return {
			organDetails: {
				organ: {}
			},
			tableDetails: [],
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			isFullScreen: false,
			businessSelectList: [],
			buyerSelectList: [],
			agentSelectList: [],
			sellerSelectList: [],
			storeSelectList: [],
			planSelectList: [],
			billCreateTypeList: [],
			billChainData: {},
			isCommonTypeByRules: this.$fxTypeMiddleware.isCommonType('stockOrderGenerateType', 'rules'),
			fxCache: this.$fxUtils.fxCache('stock-order'),
			dateChangeTriggerSave: false
		}
	},
	provide () {
		return {
			$$orderParent: this
		}
	},
	computed: {
		...mapGetters(['detailsAuthGetter']),
		moreBtnOption () {
			return [{
				show: !this.isAdd && !this.isChecked && this.detailsAuthGetter('stock-sale-manage_stock-order.delete-stock'),
				label: '删除',
				icon: 'delete-trash',
				click: this.onDeleteClick
			}, {
				show: this.detailsAuthGetter('stock-sale-manage_stock-order.export-blank|export-stock'),
				label: '导出Excel',
				icon: 'export-excel',
				children: [{
					show: this.detailsAuthGetter('stock-sale-manage_stock-order.export-blank'),
					label: '导出空白模板',
					icon: 'export-template',
					click: this.exportModel
				}, {
					show: this.detailsAuthGetter('stock-sale-manage_stock-order.export-stock'),
					label: '导出明细数据',
					icon: 'export-data',
					click: this.exportData
				}]
			}, {
				show: !this.isDisable && !this.isAssign && this.detailsAuthGetter('stock-sale-manage_stock-order.import-stock'),
				label: '导入Excel',
				icon: 'import-excel',
				children: [{
					label: '按模板导入数据',
					icon: 'import-template',
					click: this.importModel
				}]
			}, {
				show: !this.isAdd && this.detailsAuthGetter('stock-sale-manage_stock-order.copy-stock'),
				label: '复制单据',
				icon: 'copy-order',
				click: this.onCopyClick
			}, {
				show: !this.isAdd && this.detailsAuthGetter('stock-sale-manage_stock-order.send-srm') && this.showSendSrm,
				label: '发单至SRM',
				icon: 'fasong-trash',
				click: this.onSendSrmClick
			}, {
				show: !this.isAdd && this.detailsAuthGetter('stock-sale-manage_stock-order.print-stock'),
				label: '打印',
				icon: 'print',
				click: this.onPrintClick
			}, {
				show: !this.isAdd && this.tableDetails.length > 0 && !this.isCarryForward,
				label: '查询库存',
				icon: 'query-stock',
				click: this.onStockClick
			}]
		},
		isAdd () {
			return !this.organDetails.id
		},
		isChecked () {
			return this.$fxStateMiddleware.isState('billState')(['unChecked', 'checked'])(this.organDetails.billState)
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
		isOrganType (type = []) {
			return (type, organ) => {
				return this.$fxTypeMiddleware.isCommonType('allOrganType')(type)(organ)
			}
		},
		showSendSrm () {
			return this.isOrganType(['shop', 'rdc'], this.organDetails.organ.organType) &&
			this.isOrganType(['supplier'], this.organDetails.otherOrganType) &&
			this.$fxStateMiddleware.isState('sendSrmState')(['unsend'])(this.organDetails.sendState)
		},
		hasParentBill () {
			return !!this.organDetails.parentBill
		},
		isAssign () {
			return this.isCommonTypeByRules(['assignCross-sub', 'assignStockPlan-sub'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		authDisabled () {
			return !this.detailsAuthGetter('stock-sale-manage_stock-order.edit-stock')
		},
		isCarryForward () {
			return this.organDetails.balanceFlag === 1
		},
		billChainOption () {
			return {
				show: !this.isAdd,
				click: this.onBillChainClick
			}
		},
		isJsdOrder () {
			return this.isCommonTypeByRules('jsd-sub')(this.organDetails.sourceType)
		}
	},
	created () {
		this.$fxEventBus.initEvent(this, 'app-visible', this.appVisibleHandler)
		this.$fxTabkey.init('stock-sale-manage_stock-order_details', this)
		this.initBill()
		this.bindTabBeforeDeactivated()
	},
	methods: {
		initBill () {
			if (this.$route.query.openType === 'add') {
				this.add()
			} else if (this.$route.query.openType === 'edit') {
				this.edit(this.$route.query.id)
			}
		},
		bindTabBeforeDeactivated () {
			this.$fxAppTabs.onTabBeforeDeactivated(() => {
				return this.verificationDetails()
			}, this)
		},
		async add () {
			const orderDate = this.$fxUtils.setDateTime(new Date(), '时分')
			const { currentOrgan, currentUser } = await this.getListData()
			await this.getStoreList(currentOrgan.id)
			let linkman = ''
			let phone = ''
			let deliveryAddr = ''
			const inOrgan = this.$fxUtils.getSelectTagById(currentOrgan.id, this.buyerSelectList)
			if (Array.isArray(inOrgan.contactList) && inOrgan.contactList.length > 0) {
				const sendInfo = inOrgan.contactList[0]
				linkman = sendInfo.linkMan
				phone = sendInfo.tel
				deliveryAddr = sendInfo.location
			}
			this.organDetails = {
				billState: 0,
				recheckState: 0,
				sysBillCode: '',
				userBillCode: this.$fxUtils.createBillCode('CG'),
				billType: 1,
				billBizTypeId: '',
				orderDate,
				organ: inOrgan || {},
				singleHouse: 0,
				inHouse: '',
				operator: currentUser.id,
				otherOrganId: '',
				purchasePlan: '',
				carriageFee: 0,
				urgent: 0,
				linkman,
				phone,
				deliveryAddr,
				memo: '',
				appendixList: [],
				details: [],
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
			this.fxCache.clear()
			await this.getListData(organDetails)
			await this.getStoreList(organDetails.organ.id, organDetails)
			await this.getPlanList(organDetails)
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
		getDetails (id) {
			return this.$fxApi(`${apiName}.get`, id)
		},
		async getListData (organDetails) {
			return Promise.all([
				this.getCurrentUser(),
				this.getBillTypeList(),
				this.getBusinessTypeList(organDetails),
				this.getBuyerList(organDetails),
				this.getAgentList(organDetails),
				this.getSellerList(organDetails)
			]).then(([userData]) => {
				return Promise.resolve(userData)
			})
		},
		getCurrentUser () {
			return this.$fxApi(`${apiName}.getCurrentUser`)
		},
		getBillTypeList () {
			return this.$fxApi(`${apiName}.getBillTypeList`).then(res => {
				this.billCreateTypeList = res
				return Promise.resolve(res)
			})
		},
		getBusinessTypeList (organDetails = { billType: 1 }) {
			const params = (organDetails && organDetails.billBizTypeId) ? [organDetails.billBizTypeId] : []
			return this.$fxApi(`${apiName}.getDetailBusinessList`, organDetails.billType)({ data: params }).then(res => {
				this.businessSelectList = res
				return Promise.resolve(res)
			})
		},
		// 卖方机构发生变动，重新获取买方机构列表
		onOtherOrganChange () {
			this.getBuyerList(this.organDetails)
		},
		getBuyerList (organDetails) {
			const data = {
				billType: 'StockOrder',
				otherOrganId: organDetails ? organDetails.otherOrganId : '',
				disabledIdList: organDetails ? [organDetails.organId] : []
			}
			return this.$fxApi(`${apiName}.getBuyerListNew`)({ data }).then(res => {
				this.buyerSelectList = res.filter(item => {
					return item.id !== '5' && item.id !== '6'
				})
				return Promise.resolve(res)
			})
		},
		getStoreList (id, organDetails) {
			if (!id) {
				this.storeSelectList = []
				return Promise.resolve()
			}
			const params = organDetails && organDetails.inHouse ? [organDetails.inHouse] : []
			return this.$fxApi(`${apiName}.getStoreList`, id)({ data: params }).then(res => {
				this.storeSelectList = res
				return Promise.resolve(res)
			})
		},
		getAgentList (organDetails) {
			const params = organDetails ? [organDetails.operator] : []
			return this.$fxApi(`${apiName}.getAgentList`)({ data: params }).then(res => {
				this.agentSelectList = res
				return Promise.resolve(res)
			})
		},
		// 买方机构发生变动，重新获取卖方机构列表
		onOrganChange () {
			this.getSellerList(this.organDetails)
		},
		getSellerList (organDetails) {
			const data = {
				billType: 'StockOrder',
				otherOrganId: organDetails ? organDetails?.organ?.id : '',
				disabledIdList: organDetails ? [organDetails.otherOrganId] : []
			}
			return this.$fxApi(`${apiName}.getSellerListNew`)({ data }).then(res => {
				this.sellerSelectList = res
				return Promise.resolve(res)
			})
		},
		getPlanList (organDetails) {
			const params = {
				orderDate: organDetails.orderDate,
				buyerOrganId: organDetails.organ.id,
				sellerOrganId: organDetails.otherOrganId,
				urgent: organDetails.urgent,
				planIdList: [organDetails.purchasePlan || '']
			}
			return this.$fxApi(`${apiName}.getPlanList`)({ data: params, loading: true }).then(res => {
				this.planSelectList = res
				return Promise.resolve(res)
			})
		},
		deleteEmptyBill () {
			if (this.organDetails.id && (this.tableDetails.length === 0 || (this.tableDetails.length === 1 && !this.tableDetails[0].id))) {
				return this.$fxApi(`${apiName}.delEmptyBill`, this.organDetails.id).then(res => {
					return Promise.resolve()
				})
			} else {
				return Promise.resolve()
			}
		},
		onSaveClick () {
			if (this.dateChangeTriggerSave) return
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
				const typeName = this.getNameById(this.organDetails.billType, this.billCreateTypeList)
				let logger = this.$fxLogger.createInfo('stock-sale-manage.stock-order.add', { orderData: this.organDetails, type: typeName })
				return this.$fxApi(`${apiName}.add`)({ data: this.organDetails }).then(res => {
					this.$fxAppTabs.setTabTitle({ sysBillCode: res.sysBillCode })
					this.$fxAppTabs.setTabPathQuery({ openType: 'edit', id: res.id })
					this.$set(this.organDetails, 'id', res.id)
					this.organDetails.sysBillCode = res.sysBillCode
					this.organDetails.createDate = res.createDate
					this.organDetails.createMan = res.createMan || ''
					this.organDetails.createUserName = res.createUserName || ''
					this.organDetails.systemMemo = res.systemMemo || ''
					this.fxDataVerification.resetData(this.organDetails)
					logger = this.$fxLogger.createInfo('stock-sale-manage.stock-order.add', { orderData: this.organDetails, type: typeName })
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
					const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-order.update', this.createLoggerParams())
					return this.$fxApi(`${apiName}.save`, this.organDetails.id)({ data: this.organDetails, logger }).then(res => {
						this.getBusinessTypeList(this.organDetails)
						this.fxDataVerification.resetData(this.organDetails)
						this.dateChangeTriggerSave = false
						return Promise.resolve(res)
					})
				}
			}
		},
		createLoggerParams () {
			const originData = this.fxDataVerification.getOriginData()
			originData.billTypeName = this.getNameById(originData.billType, this.billCreateTypeList)
			originData.billBizTypeName = this.getNameById(originData.billBizTypeId, this.businessSelectList)
			originData.organName = this.getOrganNameById(originData.organ.id, this.buyerSelectList)
			originData.inHouseName = this.getNameById(originData.inHouse, this.storeSelectList)
			originData.operatorName = this.getNameById(originData.operator, this.agentSelectList)
			originData.otherOrganName = this.getOrganNameById(originData.otherOrganId, this.sellerSelectList)
			originData.purchasePlanName = this.getNameById(originData.purchasePlan, this.planSelectList)
			const organDetails = this.$fxUtils.deepClone(this.organDetails)
			organDetails.billTypeName = this.getNameById(organDetails.billType, this.billCreateTypeList)
			organDetails.billBizTypeName = this.getNameById(organDetails.billBizTypeId, this.businessSelectList)
			organDetails.organName = this.getOrganNameById(organDetails.organ.id, this.buyerSelectList)
			organDetails.inHouseName = this.getNameById(organDetails.inHouse, this.storeSelectList)
			organDetails.operatorName = this.getNameById(organDetails.operator, this.agentSelectList)
			organDetails.otherOrganName = this.getOrganNameById(organDetails.otherOrganId, this.sellerSelectList)
			organDetails.purchasePlanName = this.getNameById(organDetails.purchasePlan, this.planSelectList)
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
			const api = this.isDelete ? 'recyclingDelete' : 'del'
			const del = this.isDelete ? 'recyclingDelete' : 'delete'
			const logger = this.$fxLogger.createInfo(`stock-sale-manage.stock-order.${del}`, { orderData: this.organDetails })
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
		clearValidate () {
			this.$refs.basicInfo.$refs.form.clearValidate()
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
		onBuyerSubmitClick () {
			if (this.tableDetails.length === 0) {
				return this.$fxMessage.warning('无明细不允许提交，请添加明细')
			}
			return this.beforeAction('是否确定提交？').then(() => {
				return this.$refs.mistakeCheck.mistakeCheck('submit').then(this.onBuyerSubmitHandler)
			})
		},
		onBuyerSubmitHandler () {
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-order.submit', { orderData: this.organDetails })
			return this.$fxApi(`${apiName}.submit`, this.organDetails.id)({ logger }).then(res => {
				this.updateBillState(res)
				this.fxDataVerification.resetData(this.organDetails)
				this.tableDetails = res.details
				return Promise.resolve()
			})
		},
		onBuyerReturnClick () {
			return this.$fxConfirm('是否确定退回？').then(() => {
				const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-order.return', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.return`, this.organDetails.id)({ logger }).then(res => {
					this.updateBillState(res)
					this.fxDataVerification.resetData(this.organDetails)
					return this.onDetailsRefresh()
				})
			})
		},
		onBuyerCheckClick () {
			if (this.tableDetails.length === 0) {
				return this.$fxMessage.warning('无明细不允许审核，请添加明细')
			}
			return this.beforeAction('是否确定审核？').then(() => {
				if (this.$fxStateMiddleware.isState('billState')(['unSubmit'])(this.organDetails.billState)) {
					return this.$refs.mistakeCheck.mistakeCheck('check').then(this.onBuyerCheckHandler)
				} else {
					return this.onBuyerCheckHandler()
				}
			})
		},
		onBuyerCheckHandler () {
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-order.check', { orderData: this.organDetails })
			return this.$fxApi(`${apiName}.check`, this.organDetails.id)({ logger }).then(res => {
				this.updateBillState(res)
				this.fxDataVerification.resetData(this.organDetails)
				this.tableDetails = res.details
				return Promise.resolve()
			})
		},
		onBuyerUncheckClick () {
			return this.$fxConfirm('是否确定反审？').then(() => {
				const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-order.uncheck', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.uncheck`, this.organDetails.id)({ logger }).then(res => {
					this.updateBillState(res)
					this.fxDataVerification.resetData(this.organDetails)
					this.tableDetails = res.details
					return Promise.resolve()
				})
			})
		},
		onBuyerRecheckClick () {
			return this.$fxConfirm('是否确定复审？').then(() => {
				const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-order.recheck', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.recheck`, this.organDetails.id)({ logger }).then(res => {
					this.updateBillState(res)
					this.fxDataVerification.resetData(this.organDetails)
					this.tableDetails = res.details
					return Promise.resolve()
				})
			})
		},
		onBuyerUnrecheckClick () {
			return this.$fxConfirm('是否确定取消复审？').then(() => {
				const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-order.unrecheck', { orderData: this.organDetails })
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
		onOrderSave () {
			this.onSaveClickHandler().then(this.onDetailsRefresh)
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
				this.onBuyerSubmitHandler()
			} else {
				this.onBuyerCheckHandler()
			}
		},
		goToBillBlank () {
			const id = this.organDetails.parentBill.id
			const billType = this.organDetails.parentBill.billClass
			this.$fxGoToBillBlank(billType, { id }, 'detail')
		},
		exportModel () {
			this.onSaveClick().then(() => {
				const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-order.exportModel', { orderData: this.organDetails })
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
				const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-order.exportData', { orderData: this.organDetails })
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
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-order.importModel', { orderData: this.organDetails, name: file.name })
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
		onSendSrmClick () {
			return this.$fxConfirm('是否确定发单至SRM？').then(() => {
				const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-order.sendSrm', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.sendSrm`, this.organDetails.id)({ logger }).then(res => {
					this.updateBillState(res)
					this.fxDataVerification.resetData(this.organDetails)
					this.tableDetails = res.details
					return Promise.resolve()
				})
			})
		},
		onPrintClick () {
			this.$fxGoPrint('StockOrder', this.organDetails.id)
		},
		onStockClick () {
			return this.$refs.detailsInfo.checkDetailsUnSaving().then(() => {
				const billId = this.organDetails.id
				const organId = this.organDetails.organ.id
				const params = this.tableDetails.map(item => item.id)
				return this.$fxApi('stockOrder.stockAmount', billId, organId)({ data: params }).then(res => {
					this.tableDetails.forEach(item => {
						this.$set(item, 'organAmount', res[item.id].organAmount || 0)
						this.$set(item, 'otherOrganAmount', res[item.id].otherOrganAmount || 0)
					})
					return Promise.resolve()
				})
			})
		},
		onCopyClick () {
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-order.copy', { orderData: this.organDetails })
			const continueFlag = 0
			return this.$fxApi(`${apiName}.copyOrder`, this.organDetails.id, continueFlag)({ logger }).then(res => {
				const { code, data, message } = res
				if (code === 2) {
					this.$fxConfirm({
						message,
						option: {
							confirmButtonText: '继续复制',
							cancelButtonText: '取消复制'
						}
					}).then(() => {
						this.onContinueCopyClick()
					})
				} else {
					this.$fxMessage.success('单据复制成功')
					this.$fxAppTabs.tabsPush({
						path: 'stockOrderDetail',
						query: {
							openType: 'edit',
							id: data.id
						}
					})
				}
			})
		},
		onContinueCopyClick () {
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-order.copy', { orderData: this.organDetails })
			const continueFlag = 1
			return this.$fxApi(`${apiName}.copyOrder`, this.organDetails.id, continueFlag)({ logger }).then(res => {
				const { data } = res
				this.$fxMessage.success('单据复制成功')
				this.$fxAppTabs.tabsPush({
					path: 'stockOrderDetail',
					query: {
						openType: 'edit',
						id: data.id
					}
				})
			})
		},
		onBillChainClick () {
			return this.$fxApi(`${apiName}.getBillChain`, this.organDetails.id).then(res => {
				this.billChainData = res
				const billData = {
					businessDate: this.organDetails.businessDate,
					sysBillCode: this.organDetails.sysBillCode,
					billState: this.organDetails.billState,
					id: this.organDetails.id,
					billClass: 'StockOrder',
					currentBill: true
				}
				this.$refs.billChain.open(billData)
			})
		},
		appVisibleHandler () {
			this.fxCache.clear()
			this.getBillTypeList()
			this.getBusinessTypeList(this.organDetails)
			this.getAgentList(this.organDetails)
			this.getSellerList(this.organDetails)
			this.getBuyerList(this.organDetails).then(this.updateStoreList)
			this.getPlanList(this.organDetails)
		},
		updateStoreList () {
			if (this.organDetails.organ.id) {
				this.getStoreList(this.organDetails.organ.id, this.organDetails)
			}
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
