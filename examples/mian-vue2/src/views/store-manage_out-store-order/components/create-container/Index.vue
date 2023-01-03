<template>
	<fx-bill-container
		title="出库单详情"
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
					:buyerSelectList="buyerSelectList"
					:agentSelectList="agentSelectList"
					:sellerSelectList="sellerSelectList"
					:billtypeSelect="billtypeSelect"
					:disabled="!isState(['unSubmit']) || authDisabled"
					:billBizTypeList='billBizTypeList'
					:outStoreWareList.sync="outStoreWareList"
					@on-details-refresh="getDetails"
					@on-order-save="onOrderSave"
					@on-refresh-bussiness-type-list='getBillBizTypeSelect'
				></basicInfo>
				<detailsInfo
					ref="detailsInfo"
					:organDetails="organDetails"
					:tableDetails="tableDetails"
					:isFullScreen.sync="isFullScreen"
					:outStoreWareList.sync="outStoreWareList"
					:fSaveMain="onSaveClickHandler"
					:disabled="!isState(['unSubmit']) || authDisabled"
					:deleteDisabled="isDisable"
					:itemName="itemName"
					@on-details-refresh="getDetails"
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
		<template slot="parentBill" v-if="!isAdd">
			<template	v-if='hasParentBill'>
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
				v-fx-tab:loop.store-manage_out-store-order_details.refreshBtn
				@click="onRefresh"
			>刷新</fx-button>
		</template>
		<template slot="footer-right">
			<el-button
				ref="cancelBtn"
				v-fx-tab:loop.store-manage_out-store-order_details.cancelBtn
				@click="onCancelClick"
			>取消</el-button>
			<fx-button
				ref="saveBtn"
				type="save"
				v-fx-auth:store-manage_out-store-order.edit-outstore="isState(['unSubmit'])"
				v-fx-tab:loop.store-manage_out-store-order_details.saveBtn
				@click="onSaveClick"
			>保存</fx-button>
			<fx-button
				ref="submitBtn"
				type="submit"
				v-fx-auth:store-manage_out-store-order.submit-outstore="isState(['unSubmit'])"
				v-fx-tab:loop.store-manage_out-store-order_details.submitBtn
				@click="onBuyerSubmitClick"
			>提交</fx-button>
			<fx-button
				ref="returnBtn"
				type="return"
				v-fx-auth:store-manage_out-store-order.back-outstore="isState(['unChecked'])"
				v-fx-tab:loop.store-manage_out-store-order_details.returnBtn
				@click="onBuyerReturnClick"
			>退回</fx-button>
			<fx-button
				ref="checkBtn"
				type="check"
				v-fx-auth:store-manage_out-store-order.check-outstore="isState(['unSubmit', 'unChecked'])"
				v-fx-tab:loop.store-manage_out-store-order_details.checkBtn
				@click="onBuyerCheckClick"
			>审核</fx-button>
			<fx-button
				ref="uncheckBtn"
				type="uncheck"
				v-fx-auth:store-manage_out-store-order.uncheck-outstore="showUncheckBtn"
				v-fx-tab:loop.store-manage_out-store-order_details.uncheckBtn
				@click="onBuyerUncheckClick"
			>反审</fx-button>
			<fx-button
				ref="recheckBtn"
				type="recheck"
				v-fx-auth:store-manage_out-store-order.recheck-outstore="showRecheckBtn"
				v-fx-tab:loop.store-manage_out-store-order_details.recheckBtn
				@click="onBuyerRecheckClick"
			>复审</fx-button>
			<fx-button
				ref="unrecheckBtn"
				type="unrecheck"
				v-fx-auth:store-manage_out-store-order.unrecheck-outstore="showUnrecheckBtn"
				v-fx-tab:loop.store-manage_out-store-order_details.unrecheckBtn
				@click="onBuyerUnrecheckClick"
			>取消复审</fx-button>
		</template>
		<fx-bill-chain
			ref="billChain"
			:billChainData="billChainData"
		>
		</fx-bill-chain>
		<check-err-info ref="checkErrInfo"></check-err-info>
		<uncheck-order-info ref="uncheckOrderInfo" billType="OutStore"></uncheck-order-info>
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
				outHouse: {},
				otherOrgan: {},
				operateMan: {}
			},
			tableDetails: [],
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			isFullScreen: false,
			buyerSelectList: [],
			agentSelectList: [],
			sellerSelectList: [], // 出库方
			billBizTypeList: [],
			outStoreWareList: [], // 出库仓库
			billtypeSelect: [],
			fxCache: this.$fxUtils.fxCache('out-store'),
			billChainData: {},
			isCommonTypeByRules: this.$fxTypeMiddleware.isCommonType('outStoreBillGenerateType', 'rules'),
			itemName: '',
			dateChangeTriggerSave: false,
			syncBusinessDate: false,
			defaultBillType: 2001
		}
	},
	provide () {
		return {
			$$orderParent: this
		}
	},
	computed: {
		...mapGetters(['detailsAuthGetter', 'getOrderMistakeCheckList']),
		isAdd () {
			return !this.organDetails.id
		},
		isChecked () {
			return this.$fxStateMiddleware.isState('billState')(['checked'])(this.organDetails.billState)
		},
		isDisable () {
			return this.$fxStateMiddleware.isState('billState')(['unChecked', 'checked', 'deleted'])(this.organDetails.billState) || this.isSaleReturnAmount
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
		showUncheckBtn () {
			return this.isState(['checked']) && this.currentState.type !== 'rechecked' &&
			!this.isCommonTypeByRules(['stockLoss', 'stockProfit'])(this.organDetails.billType, this.organDetails.subBillType) &&
			!this.isCarryForward && !this.isOvercharge
		},
		showRecheckBtn () {
			return this.isState(['checked']) && this.currentState.type !== 'rechecked' && !this.isCommonTypeByRules(['stockLoss', 'stockProfit'])(this.organDetails.billType, this.organDetails.subBillType) && !this.isCarryForward
		},
		showUnrecheckBtn () {
			return this.currentState.type === 'rechecked' && !this.isCommonTypeByRules(['stockLoss', 'stockProfit'])(this.organDetails.billType, this.organDetails.subBillType) && !this.isCarryForward
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
		isLimitedEdit () {
			return this.isCommonTypeByRules(['assignStraight-sub', 'assignCross-sub', 'amount-sub', 'money-sub', 'move', 'offset'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		isAssign () {
			return this.isCommonTypeByRules('assignStraight-sub')(this.organDetails.billType, this.organDetails.subBillType)
		},
		isOther () {
			return this.isCommonTypeByRules('other')(this.organDetails.billType, this.organDetails.subBillType)
		},
		isOvercharge () {
			return this.isCommonTypeByRules('overcharge-sub')(this.organDetails.billType, this.organDetails.subBillType)
		},
		moreBtnOption () {
			return [{
				show: !this.isAdd && !this.isChecked && this.detailsAuthGetter('store-manage_out-store-order.delete-outstore') && !this.isCrossAssign,
				label: '删除',
				icon: 'delete-trash',
				click: this.onDeleteClick
			}, {
				label: '导出Excel',
				icon: 'export-excel',
				show: this.detailsAuthGetter('store-manage_out-store-order.export-outstore|export-blank'),
				children: [{
					show: this.detailsAuthGetter('store-manage_out-store-order.export-blank'),
					label: '导出空白模板',
					icon: 'export-template',
					click: this.exportModel
				}, {
					show: !this.isAdd && this.detailsAuthGetter('store-manage_out-store-order.export-outstore'),
					label: '导出明细数据',
					icon: 'export-data',
					click: this.exportData
				}]
			}, {
				label: '导入Excel',
				icon: 'import-excel',
				show: !this.isLimitedEdit && this.isState(['unSubmit']) && !this.isAssign && this.detailsAuthGetter('store-manage_out-store-order.import-outstore') && !this.isSaleReturnAmount,
				children: [{
					label: '按模板导入数据',
					icon: 'import-template',
					click: this.importModel
				}]
			}, {
				show: !this.isAdd && this.detailsAuthGetter('store-manage_out-store-order.copy-outstore'),
				label: '复制单据',
				icon: 'copy-order',
				click: this.onCopyClick
			}, {
				show: !this.isAdd && this.detailsAuthGetter('store-manage_out-store-order.print-outstore'),
				label: '打印',
				icon: 'print',
				click: this.onPrintClick
			}]
		},
		authDisabled () {
			return !this.detailsAuthGetter('store-manage_out-store-order.edit-outstore')
		},
		isCrossAssign () {
			return this.organDetails.sourceBillType === 'InStore'
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
		isSaleReturnAmount () {
			return this.isCommonTypeByRules('saleReturnStoreAmount')(this.organDetails.billType, this.organDetails.subBillType)
		}
	},
	created () {
		this.$fxEventBus.initEvent(this, 'app-visible', this.appVisibleHandler)
		this.$fxTabkey.init('store-manage_out-store-order_details', this)
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
			const { currentOrgan, currentUser } = await this.getListData()
			const organ = this.$fxUtils.getSelectTagById(currentOrgan.id, this.sellerSelectList)
			const organDetails = {
				billState: 0,
				sysBillCode: '',
				userBillCode: this.$fxUtils.createBillCode('CK'),
				billType: this.defaultBillType,
				billBizTypeId: '',
				businessDate: this.$fxUtils.setDateTime(new Date()),
				organ,
				outHouse: {},
				singleHouseFlag: 0,
				otherOrgan: {},
				operateMan: {
					id: currentUser.id
				},
				carriageFee: 0,
				allotFlag: 0,
				memo: '',
				planState: 0,
				recheckState: 0,
				detailAmount: 0,
				balanceFlag: 0,
				appendixes: [],
				appendixList: [],
				autoType: 0
			}
			await this.getValidStoreList(organDetails)
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
			await this.getListData(organDetails)
			await this.getValidStoreList(organDetails, organDetails.details)
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
		getListData (organDetails) {
			return Promise.all([
				this.getCurrentUser(),
				this.getBillBizTypeSelect(organDetails),
				this.getAgentList(organDetails),
				this.getInStore(organDetails),
				this.getOutStore(organDetails),
				this.getBillType()
			]).then(([userData]) => {
				return Promise.resolve(userData)
			})
		},
		getOrganDetails (id) {
			return this.$fxApi('outStore.getBill', id)
		},
		onMistakeClose () {
			this.$refs.detailsInfo.clear()
		},
		getDetails () {
			return this.$fxApi('outStore.getDetails', this.organDetails.id).then(res => {
				this.tableDetails = res
				return Promise.resolve(res)
			})
		},
		onRefresh () {
			this.verificationDetails('当前页面存在未保存数据，是否确定刷新操作？').then(() => {
				this.edit(this.organDetails.id)
			})
		},
		getAgentList (organDetails) {
			const params = organDetails ? [organDetails.operateMan.id] : []
			return this.$fxApi('stockOrder.getAgentList')({ data: params }).then(res => {
				this.agentSelectList = res
				return Promise.resolve(res)
			})
		},
		getBillBizTypeSelect (organDetails = this.organDetails) {
			const billType = organDetails.billType || this.defaultBillType
			const data = organDetails.billBizTypeId ? [organDetails.billBizTypeId] : []
			return this.$fxApi('outStore.getBillDetailBizTypeSelect', billType)({ data }).then(res => {
				this.billBizTypeList = res
				return Promise.resolve(res)
			})
		},
		getBillType () {
			return this.$fxApi('outStore.getBilltypeSelect').then(res => {
				this.billtypeSelect = res[0]
				return Promise.resolve()
			})
		},
		getInStore (organDetails) {
			const ids = organDetails && organDetails.otherOrgan.id ? [organDetails.otherOrgan.id] : []
			return this.$fxApi('outStore.getInStoreOrganList')({ data: { ids, names: ['Shop', 'Center', 'Customer', 'Supplier'] } }).then(res => {
				this.buyerSelectList = res
				return Promise.resolve(res)
			})
		},
		getOutStore (organDetails) {
			const ids = organDetails && organDetails.organ.id ? [organDetails.organ.id] : []
			return this.$fxApi('outStore.getInStoreOrganList')({ data: { ids, names: ['Shop', 'Center'] } }).then(res => {
				this.sellerSelectList = res
				return Promise.resolve(res)
			})
		},
		getValidStoreList (organDetails, tableDetails = []) {
			if (!organDetails.organ.id) {
				this.outStoreWareList = []
				return Promise.resolve()
			}
			let ids = organDetails && organDetails.outHouse.id ? [organDetails.outHouse.id] : []
			const detailsOutHouseIds = tableDetails.map(item => item.outHouse.id)
			ids = this.$fxUtils.arrDedup(ids.concat(detailsOutHouseIds))
			return this.$fxApi('outStore.getValidStoreList', organDetails.organ.id)({ data: ids }).then(res => {
				this.outStoreWareList = res
				return Promise.resolve()
			})
		},
		getCurrentUser () {
			return this.$fxApi('outStore.getCurrentUser')
		},
		deleteEmptyBill () {
			if (this.organDetails.id && (this.tableDetails.length === 0 || (this.tableDetails.length === 1 && !this.tableDetails[0].id))) {
				return this.$fxApi('outStore.delEmptyBill', this.organDetails.id)
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
		onOrderSave () {
			this.dateChangeTriggerSave = true
			this.onSaveClickHandler().then(this.getDetails)
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
				const typeName = this.getNameById(this.organDetails.billType, this.billtypeSelect)
				let logger = this.$fxLogger.createInfo('store-manage.out-store-order.add', { orderData: this.organDetails, type: typeName })
				return this.$fxApi('outStore.add')({ data: this.organDetails }).then(res => {
					this.$fxAppTabs.setTabTitle({ sysBillCode: res.sysBillCode })
					this.$fxAppTabs.setTabPathQuery({ openType: 'edit', id: res.id })
					this.$set(this.organDetails, 'id', res.id)
					this.$set(this.organDetails, 'recheckState', res.recheckState)
					this.$set(this.organDetails, 'sysBillCode', res.sysBillCode)
					this.$set(this.organDetails, 'createDate', res.createDate)
					this.organDetails.createMan = res.createMan || ''
					this.$set(this.organDetails, 'createUserName', res.createUserName || '')
					this.$set(this.organDetails, 'systemMemo', res.systemMemo)
					this.fxDataVerification.resetData(this.organDetails)
					logger = this.$fxLogger.createInfo('store-manage.out-store-order.add', { orderData: this.organDetails, type: typeName })
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
					const logger = this.$fxLogger.createInfo('store-manage.out-store-order.update', this.createLoggerParams())
					return this.$fxApi('outStore.edit', this.organDetails.id)({ data: this.organDetails, logger }).then(res => {
						const originData = this.fxDataVerification.getOriginData()
						if (this.isOther && (originData.organ.id !== this.organDetails.organ.id || originData.outHouse.id !== this.organDetails.outHouse.id)) {
							this.clearBatchCode().then(res => {
								this.tableDetails = res
							})
						}
						this.getBillBizTypeSelect(this.organDetails)
						this.fxDataVerification.resetData(this.organDetails)
						this.dateChangeTriggerSave = false
						return Promise.resolve(res)
					})
				}
			}
		},
		createLoggerParams () {
			const originData = this.fxDataVerification.getOriginData()
			originData.billTypeName = this.getNameById(originData.billType, this.billtypeSelect)
			originData.billBizTypeName = this.getNameById(originData.billBizTypeId, this.billBizTypeList)
			originData.organName = this.getOrganNameById(originData.organ.id, this.sellerSelectList)
			originData.outHouseName = this.getNameById(originData.outHouse.id, this.outStoreWareList)
			originData.operatorName = this.getNameById(originData.operateMan.id, this.agentSelectList)
			originData.otherOrganName = this.getOrganNameById(originData.otherOrgan.id, this.buyerSelectList)
			const organDetails = this.$fxUtils.deepClone(this.organDetails)
			organDetails.billTypeName = this.getNameById(organDetails.billType, this.billtypeSelect)
			organDetails.billBizTypeName = this.getNameById(organDetails.billBizTypeId, this.billBizTypeList)
			organDetails.organName = this.getOrganNameById(organDetails.organ.id, this.sellerSelectList)
			organDetails.outHouseName = this.getNameById(organDetails.outHouse.id, this.outStoreWareList)
			organDetails.operatorName = this.getNameById(organDetails.operateMan.id, this.agentSelectList)
			organDetails.otherOrganName = this.getOrganNameById(organDetails.otherOrgan.id, this.buyerSelectList)
			return {
				pre: originData,
				cur: organDetails,
				orderData: organDetails
			}
		},
		clearBatchCode () {
			return this.$fxApi('outStore.clearBatchCode', this.organDetails.id).then(res => {
				return Promise.resolve(res)
			})
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
			const logger = this.$fxLogger.createInfo(`store-manage.out-store-order.${del}`, { orderData: this.organDetails })
			if (this.organDetails.billState === 3) {
				return this.$fxApi('outStore.remove', this.organDetails.id)({ logger }).then(res => {
					this.fxDataVerification.resetData(this.organDetails)
					return Promise.resolve()
				})
			} else {
				return this.$fxApi('outStore.del', this.organDetails.id)({ logger }).then(res => {
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
		resetOrganDetails (res) {
			if (!('outHouse' in res)) {
				res.outHouse = {}
			}
			if (!('otherOrgan' in res)) {
				res.otherOrgan = {}
			}
			this.tableDetails = res.details
			this.updateBillState(res)
			this.fxDataVerification.resetData(this.organDetails)
		},
		updateBillState ({ billState, recheckState, businessDate, submitMan = {}, submitDate = '', checkMan = {}, checkDate = '', systemMemo = '' }) {
			this.organDetails.billState = billState
			this.organDetails.recheckState = recheckState
			this.organDetails.businessDate = businessDate
			this.$set(this.organDetails, 'submitMan', submitMan)
			this.$set(this.organDetails, 'submitDate', submitDate)
			this.$set(this.organDetails, 'checkMan', checkMan)
			this.$set(this.organDetails, 'checkDate', checkDate)
			this.$set(this.organDetails, 'systemMemo', systemMemo)
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
			const logger = this.$fxLogger.createInfo('store-manage.out-store-order.submit', { orderData: this.organDetails })
			return this.$fxApi('outStore.submit', this.organDetails.id)({ logger }).then(res => {
				this.resetOrganDetails(res)
				return Promise.resolve()
			})
		},
		onBuyerReturnClick () {
			return this.$fxConfirm('是否确定退回？').then(() => {
				const logger = this.$fxLogger.createInfo('store-manage.out-store-order.return', { orderData: this.organDetails })
				return this.$fxApi('outStore.return', this.organDetails.id)({ logger }).then(res => {
					this.resetOrganDetails(res)
					return Promise.resolve()
				})
			})
		},
		onBuyerCheckClick () {
			if (this.tableDetails.length === 0) {
				return this.$fxMessage.warning('无明细不允许审核，请添加明细')
			}
			if (this.$fxUtils.compareDate(this.$fxUtils.setDateTime(), this.organDetails.businessDate)) {
				return this.beforeAction('是否确定审核？').then(() => {
					this.syncBusinessDate = false
					this.onCheck()
				})
			} else {
				const confirmInfo = {
					message: '当前单据业务时间在审核时间之后，请确认！',
					option: {
						confirmButtonText: '按审核时间更改业务时间',
						cancelButtonText: '继续审核，无需处理'
					}
				}
				return this.beforeAction(confirmInfo).then(() => {
					this.syncBusinessDate = true
					this.onCheck()
				}).catch(() => {
					this.syncBusinessDate = false
					this.$refs.detailsInfo.checkDetailsUnSaving().then(this.onSaveClickHandler).then(this.onCheck)
				})
			}
		},
		onCheck () {
			if (this.$fxStateMiddleware.isState('billState')(['unSubmit'])(this.organDetails.billState)) {
				return this.$refs.mistakeCheck.mistakeCheck('check').then(() => {
					this.onBuyerCheckHandler()
				})
			} else {
				return this.onBuyerCheckHandler()
			}
		},
		onBuyerCheckHandler () {
			const data = {
				syncBusinessDate: this.syncBusinessDate
			}
			const logger = this.$fxLogger.createInfo('store-manage.out-store-order.check', { orderData: this.organDetails })
			return this.$fxApi('outStore.check', this.organDetails.id)({ data, logger }).then(res => {
				if (this.syncBusinessDate) {
					const logger = this.$fxLogger.createInfo('store-manage.out-store-order.updateBusinessDate', { orderData: this.organDetails, result: res })
					const loggerInfo = this.$fxLogger.actionInfo(logger)
					loggerInfo.success()
				}
				this.resetOrganDetails(res)
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
		onBuyerUncheckClick () {
			return this.$fxConfirm('是否确定反审？').then(() => {
				const logger = this.$fxLogger.createInfo('store-manage.out-store-order.uncheck', { orderData: this.organDetails })
				return this.$fxApi('outStore.uncheck', this.organDetails.id)({ logger }).then(res => {
					this.resetOrganDetails(res)
					return Promise.resolve()
				}).catch(err => {
					if (err.code === 3) {
						const errMessage = this.$fxUtils.JSONparse(err.message) || []
						this.$refs.uncheckOrderInfo.open(errMessage)
					} else {
						return this.$fxMessage.error(err.message || '反审失败，请稍后再试')
					}
				})
			})
		},
		onBuyerRecheckClick () {
			return this.$fxConfirm('是否确定复审？').then(() => {
				const logger = this.$fxLogger.createInfo('store-manage.out-store-order.recheck', { orderData: this.organDetails })
				return this.$fxApi('outStore.recheck', this.organDetails.id)({ logger }).then(res => {
					this.resetOrganDetails(res)
					return Promise.resolve()
				})
			})
		},
		onBuyerUnrecheckClick () {
			return this.$fxConfirm('是否确定取消复审？').then(() => {
				const logger = this.$fxLogger.createInfo('store-manage.out-store-order.unrecheck', { orderData: this.organDetails })
				return this.$fxApi('outStore.unrecheck', this.organDetails.id)({ logger }).then(res => {
					this.resetOrganDetails(res)
					return Promise.resolve()
				})
			})
		},
		onMistakeCheck () {
			if (this.isState(['checked'])) {
				this.$refs.mistakeCheck.mistakeCheck('save', this.getOrderMistakeCheckList('OutStore', ['SalesPriceLessThanCostPrice']), false).then(() => {
					this.$fxMessage.success('未查询到存在问题的数据')
				})
			} else {
				this.$refs.mistakeCheck.mistakeCheck().then(() => {
					this.$fxMessage.success('未查询到存在问题的数据')
				})
			}
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
			const type = this.organDetails.parentBill.billClass
			this.$fxGoToBillBlank(type, { id }, 'detail')
		},
		exportModel () {
			this.onSaveClick().then(() => {
				const logger = this.$fxLogger.createInfo('store-manage.out-store-order.exportModel', { orderData: this.organDetails })
				const id = this.organDetails.id
				return this.$fxApi('outStore.exportModal', id)({ logger }).then(res => {
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
					const logger = this.$fxLogger.createInfo('store-manage.out-store-order.exportData', { orderData: this.organDetails })
					const id = this.organDetails.id
					return this.$fxApi('outStore.exportData', id)({ logger }).then(res => {
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
				this.getDetails()
			}
		},
		importExcelHandler (file) {
			const params = {
				excelFile: file
			}
			const logger = this.$fxLogger.createInfo('store-manage.out-store-order.importModel', { orderData: this.organDetails, name: file.name })
			return this.$fxApi('outStore.importData', this.organDetails.id)({ data: params, logger })
		},
		onPrintClick () {
			this.$fxGoPrint('OutStore', this.organDetails.id)
		},
		onCopyClick () {
			const logger = this.$fxLogger.createInfo('store-manage.out-store-order.copy', { orderData: this.organDetails })
			return this.$fxApi('outStore.copyOrder', this.organDetails.id)({ logger }).then(res => {
				this.$fxMessage.success('单据复制成功')
				this.$fxAppTabs.tabsPush({
					path: 'outStoreOrderDetail',
					query: {
						openType: 'edit',
						id: res.id
					}
				})
			})
		},
		onBillChainClick () {
			return this.$fxApi('outStore.getBillChain', this.organDetails.id).then(res => {
				this.billChainData = res
				const billData = {
					businessDate: this.organDetails.businessDate,
					sysBillCode: this.organDetails.sysBillCode,
					billState: this.organDetails.billState,
					id: this.organDetails.id,
					billClass: 'OutStore',
					currentBill: true
				}
				this.$refs.billChain.open(billData)
			})
		},
		appVisibleHandler () {
			this.fxCache.clear()
			this.getBillBizTypeSelect()
			this.getAgentList(this.organDetails)
			this.getInStore(this.organDetails)
			this.getBillType()
			this.getOutStore(this.organDetails)
			this.getValidStoreList(this.organDetails, this.tableDetails)
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
