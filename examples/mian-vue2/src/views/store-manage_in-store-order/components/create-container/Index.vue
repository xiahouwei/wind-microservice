<template>
	<fx-bill-container
		title="入库单详情"
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
					:inStoreWareList.sync="inStoreWareList"
					:disabled="!isState(['unSubmit']) || authDisabled"
					:billBizTypeList="billBizTypeList"
					@on-order-save="onOrderSave"
					@on-in-store-ware-change="onInStoreWareChange"
					@on-details-refresh="getDetails"
					@on-refresh-bussiness-type-list="getBillBizTypeSelect"
				></basicInfo>
				<detailsInfo
					ref="detailsInfo"
					:organDetails="organDetails"
					:tableDetails="tableDetails"
					:isFullScreen.sync="isFullScreen"
					:inStoreWareList.sync="inStoreWareList"
					:fSaveMain="onSaveClickHandler"
					:disabled="!isState(['unSubmit']) || authDisabled || isSrmSubInStore"
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
			<template	v-if="hasParentBill">
				上级单据:
			<w-link
				@click="goToBillBlank"
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
				v-fx-auth:store-manage_in-store-order.edit-instore="isState(['unSubmit'])"
				v-fx-tab:loop.store-manage_in-store-order_details.saveBtn
				@click="onSaveClick"
			>保存</fx-button>
			<fx-button
				ref="submitBtn"
				type="submit"
				v-fx-auth:store-manage_in-store-order.submit-instore="isState(['unSubmit'])"
				v-fx-tab:loop.store-manage_in-store-order_details.submitBtn
				@click="onBuyerSubmitClick"
			>提交</fx-button>
			<fx-button
				ref="returnBtn"
				type="return"
				v-fx-auth:store-manage_in-store-order.back-instore="isState(['unChecked'])"
				v-fx-tab:loop.store-manage_in-store-order_details.returnBtn
				@click="onBuyerReturnClick"
			>退回</fx-button>
			<fx-button
				ref="checkBtn"
				type="check"
				v-fx-auth:store-manage_in-store-order.check-instore="showCheckBtn"
				v-fx-tab:loop.store-manage_in-store-order_details.checkBtn
				@click="onBuyerCheckClick"
			>审核</fx-button>
			<fx-button
				ref="uncheckBtn"
				type="uncheck"
				v-fx-auth:store-manage_in-store-order.uncheck-instore="showUncheckBtn"
				v-fx-tab:loop.store-manage_in-store-order_details.uncheckBtn
				@click="onBuyerUncheckClick"
			>反审</fx-button>
			<fx-button
				ref="recheckBtn"
				type="recheck"
				v-fx-auth:store-manage_in-store-order.recheck-instore="showRecheckBtn"
				v-fx-tab:loop.store-manage_in-store-order_details.recheckBtn
				@click="onBuyerRecheckClick"
			>复审</fx-button>
			<fx-button
				ref="unrecheckBtn"
				type="unrecheck"
				v-fx-auth:store-manage_in-store-order.unrecheck-instore="showUnrecheckBtn"
				v-fx-tab:loop.store-manage_in-store-order_details.unrecheckBtn
				@click="onBuyerUnrecheckClick"
			>取消复审</fx-button>
			<fx-button
				ref="endAndcheckBtn"
				type="check"
				v-fx-auth:store-manage_in-store-order.check-instore="showEndCheckBtn"
				v-fx-tab:loop.store-manage_in-store-order_details.endAndcheckBtn
				@click="onBuyerEndAndcheckClick"
			>结束并审核</fx-button>
			<fx-button
				ref="splitAndcheckBtn"
				type="check"
				v-fx-auth:store-manage_in-store-order.check-instore="showSplitCheckBtn"
				v-fx-tab:loop.store-manage_in-store-order_details.splitAndcheckBtn
				@click="onBuyerSplitAndcheckClick"
			>分批并审核</fx-button>
		</template>
		<fx-bill-chain
			ref="billChain"
			:billChainData="billChainData"
		>
		</fx-bill-chain>
		<check-err-info ref="checkErrInfo"></check-err-info>
		<return-goods ref="returnGoods" :organDetails="organDetails"></return-goods>
		<fastOutStore ref="fastOutStore" :organDetails="organDetails" :tableDetails="tableDetails"></fastOutStore>
		<fastMove ref="fastMove" :organDetails="organDetails" :tableDetails="tableDetails"></fastMove>
		<uncheck-order-info ref="uncheckOrderInfo" billType="InStore"></uncheck-order-info>
		<supplierRate ref="supplierRate" :organDetails="organDetails"></supplierRate>
	</fx-bill-container>
</template>
<script>
import { mapGetters } from 'vuex'
import basicInfo from './BasicInfo.vue'
import appendInfo from './AppendInfo.vue'
import detailsInfo from './DetailsInfo.vue'
import mistakeCheck from '../mistake-check/MistakeCheck.vue'
import checkErrInfo from '@/components/common/Fx-check-err-info.vue'
import returnGoods from './ReturnGoods.vue'
import uncheckOrderInfo from '@/components/common/Fx-uncheck-order-info.vue'
import fastOutStore from '../fast-out-store/fastOutStore.vue'
import fastMove from '../fast-out-store/fastMove.vue'
import supplierRate from './SupplierRateDialog.vue'
export default {
	name: 'createOrgan',
	components: {
		basicInfo,
		appendInfo,
		detailsInfo,
		mistakeCheck,
		checkErrInfo,
		returnGoods,
		uncheckOrderInfo,
		fastOutStore,
		fastMove,
		supplierRate
	},
	data () {
		return {
			organDetails: {
				inOrgan: {},
				inHouse: {},
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
			inStoreWareList: [], // 入库仓库
			billtypeSelect: [],
			fxCache: this.$fxUtils.fxCache('in-store'),
			billChainData: {},
			isCommonTypeByRules: this.$fxTypeMiddleware.isCommonType('inStoreBillGenerateType', 'rules'),
			fxCalculation: this.$fxCalculation('inStore'),
			itemName: '',
			dateChangeTriggerSave: false,
			defaultBillType: 1002,
			syncBusinessDate: false
		}
	},
	provide () {
		return {
			$$orderParent: this
		}
	},
	computed: {
		...mapGetters(['detailsAuthGetter', 'getSysParams']),
		isAdd () {
			return !this.organDetails.id
		},
		isChecked () {
			return this.$fxStateMiddleware.isState('billState')(['checked'])(this.organDetails.billState)
		},
		isDisable () {
			return this.$fxStateMiddleware.isState('billState')(['unChecked', 'checked', 'deleted'])(this.organDetails.billState) || this.isSaleOrderSubOutOrder || this.isStockOrderSubOutOrder || this.delSaleReturnOutStoreOrderSubBlueOrder ||
			this.handReturnSubBlueOrder ||
			this.outStoreOrderChildInStoreOrderSubBlueOrder ||
			this.assigneSaleOrderInStoreOrderReturnSubBlueOrder
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
		sysSupplierRate () {
			return this.getSysParams('YWLJL_INSTORE_SUPPLIER_EVALUEATE', 'value')
		},
		showCheckBtn () {
			if (this.isSaleOrderSubOutOrder || this.isStockOrderSubOutOrder || this.isOutStoreSub) {
				return this.isState(['unSubmit', 'unChecked']) && this.getSysParams('SJXZL_INSTORE_CHECKED_BUTTON', 'value')('check')
			} else {
				return this.isState(['unSubmit', 'unChecked'])
			}
		},
		showUncheckBtn () {
			// 盘盈入库单，自动生成的期初入库单不允许反审
			return (this.isState(['checked']) && this.currentState.type !== 'rechecked') &&
			!(this.isBeginPeriod && !!this.organDetails.autoType) && !this.isStockProfit &&
			!this.isCarryForward && !this.isJsdReturnSubSaleBackInStore
		},
		showRecheckBtn () {
			return (this.isState(['checked']) && this.currentState.type !== 'rechecked') && !this.isStockProfit && !this.isCarryForward
		},
		showUnrecheckBtn () {
			return this.currentState.type === 'rechecked' && !this.isStockProfit && !this.isCarryForward
		},
		showEndCheckBtn () {
			return this.isState(['unSubmit', 'unChecked']) && (this.isSaleOrderSubOutOrder || this.isStockOrderSubOutOrder || this.isOutStoreSub) && this.getSysParams('SJXZL_INSTORE_CHECKED_BUTTON', 'value')('endCheck')
		},
		showSplitCheckBtn () {
			return this.isState(['unSubmit', 'unChecked']) && (this.isSaleOrderSubOutOrder || this.isStockOrderSubOutOrder || this.isOutStoreSub) && this.getSysParams('SJXZL_INSTORE_CHECKED_BUTTON', 'value')('splitCheck')
		},
		isStockReturn () {
			return this.isCommonTypeByRules('return')(this.organDetails.billType, this.organDetails.subBillType)
		},
		isStockProfit () {
			return this.isCommonTypeByRules('stockProfit')(this.organDetails.billType, this.organDetails.subBillType)
		},
		isBeginPeriod () {
			return this.isCommonTypeByRules('beginPeriod')(this.organDetails.billType, this.organDetails.subBillType)
		},
		isMove () {
			return this.isCommonTypeByRules('move')(this.organDetails.billType, this.organDetails.subBillType)
		},
		isAssign () {
			return this.isCommonTypeByRules('assignStraight-sub')(this.organDetails.billType, this.organDetails.subBillType)
		},
		isCross () {
			return this.isCommonTypeByRules(['assignCross-sub'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		isPurchase () {
			return this.isCommonTypeByRules(['purchase'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		isOffset () {
			return this.isCommonTypeByRules(['offset'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		isDiff () {
			return this.isCommonTypeByRules(['diff'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		isHand () {
			return this.isCommonTypeByRules('normal-sub')(this.organDetails.billType, this.organDetails.subBillType, this.organDetails)
		},
		isOutStoreSub () {
			return this.isCommonTypeByRules(['outStore-sub'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		isSaleOrderSubOutOrder () {
			return this.isCommonTypeByRules(['saleOrder-sub-outOrder'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		isStockOrderSubOutOrder () {
			return this.isCommonTypeByRules(['stockOrder-sub-outOrder'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		delSaleReturnOutStoreOrderSubBlueOrder () {
			return this.isCommonTypeByRules(['delSaleReturnOutStoreOrder-sub-blueOrder'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		handReturnSubBlueOrder () {
			return this.isCommonTypeByRules(['handReturn-sub-blueOrder'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		outStoreOrderChildInStoreOrderSubBlueOrder () {
			return this.isCommonTypeByRules(['outStoreOrderChildInStoreOrder-sub-blueOrder'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		assigneSaleOrderInStoreOrderReturnSubBlueOrder () {
			return this.isCommonTypeByRules(['assigneSaleOrderInStoreOrderReturn-sub-blueOrder'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		isSalesReturn () {
			return this.isCommonTypeByRules(['salesReturn'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		isSrmSubInStore () {
			return this.isCommonTypeByRules(['srm-sub-inStore'])(this.organDetails.sourceBillType)
		},
		isRedInStore () {
			return this.isCommonTypeByRules(['red-inStore'])(this.organDetails.billSign)
		},
		isJsdReturnSubSaleBackInStore () {
			return this.isCommonTypeByRules(['jsd-return-sub-sale-back-inStore'])(this.organDetails.sourceType)
		},
		canReturnGoods () {
			return this.isPurchase && !!this.organDetails.otherOrgan.id && (this.isHand || this.isOutStoreSub || this.isSaleOrderSubOutOrder || this.isStockOrderSubOutOrder || this.isAssign || this.isCross)
		},
		isSupplier () {
			return this.$fxTypeMiddleware.isCommonType('allOrganType')('supplier')(this.organDetails.otherOrgan.organType)
		},
		moreBtnOption () {
			return [{
				show: !this.isAdd && !this.isChecked && !this.isCross &&
				this.detailsAuthGetter('store-manage_in-store-order.delete-instore') &&
				!this.delSaleReturnOutStoreOrderSubBlueOrder && !this.isSrmSubInStore &&
				!this.isSaleOrderSubOutOrder && !this.isStockOrderSubOutOrder,
				label: '删除',
				icon: 'delete-trash',
				click: this.onDeleteClick
			}, {
				show: this.detailsAuthGetter('store-manage_in-store-order.export-instore|export-blank'),
				label: '导出Excel',
				icon: 'export-excel',
				children: [{
					show: this.detailsAuthGetter('store-manage_in-store-order.export-blank'),
					label: '导出空白模板',
					icon: 'export-template',
					click: this.exportModel
				}, {
					show: !this.isAdd && this.detailsAuthGetter('store-manage_in-store-order.export-instore'),
					label: '导出明细数据',
					icon: 'export-data',
					click: this.exportData
				}]
			}, {
				label: '导入Excel',
				icon: 'import-excel',
				show: !this.isMove && this.isState(['unSubmit']) && !this.isAssign &&
				this.detailsAuthGetter('store-manage_in-store-order.import-instore') && !this.isOffset &&
				!this.isOutStoreSub && !this.isSaleOrderSubOutOrder && !this.isStockOrderSubOutOrder &&
				!this.delSaleReturnOutStoreOrderSubBlueOrder && !this.isDiff && !this.isStockReturn &&
				!this.isSalesReturn,
				children: [{
					label: '按模板导入数据',
					icon: 'import-template',
					click: this.importModel
				}]
			}, {
				show: this.isState(['checked', 'rechecked']) && this.canReturnGoods && this.detailsAuthGetter('store-manage_in-store-order.returnGoods-instore'),
				label: '退货',
				icon: 'bill-chain',
				click: this.onReturnGoodsClick
			}, {
				show: !this.isAdd && this.detailsAuthGetter('store-manage_in-store-order.copy-instore') && !this.isOffset,
				label: '复制单据',
				icon: 'copy-order',
				click: this.onCopyClick
			}, {
				show: !this.isAdd && this.isState(['checked', 'rechecked']) && !this.isRedInStore && this.detailsAuthGetter('store-manage_in-store-order.fastOutStore-instore'),
				label: '快速出库',
				icon: 'fast-outStore',
				disabled: this.isCarryForward,
				children: [{
					label: '快速出库',
					icon: 'child-fast-outStore',
					click: this.fastOutStore
				}, {
					label: '快速调拨',
					icon: 'child-fast-move',
					click: this.fastMove
				}]
			}, {
				show: !this.isAdd && this.detailsAuthGetter('store-manage_in-store-order.print-instore'),
				label: '打印',
				icon: 'print',
				click: this.onPrintClick
			}, {
				show: !this.isAdd && this.detailsAuthGetter('store-manage_in-store-order.send-srm') && this.showSendSrm,
				label: '发单至SRM',
				icon: 'fasong-trash',
				click: this.onSendSrmClick
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
			return !this.detailsAuthGetter('store-manage_in-store-order.edit-instore')
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
		unSendSrm () {
			return this.$fxStateMiddleware.isState('sendSrmState')(['unsend'])(this.organDetails.sendState)
		},
		sourceBillTypeIsSrm () {
			return this.organDetails.sourceBillType === 'SRM_Bill'
		},
		showSendSrm () {
			return this.isChecked && this.unSendSrm && this.isStockReturn && this.sourceBillTypeIsSrm
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
			const { currentOrgan, currentUser } = await this.getListData()
			const inOrgan = this.$fxUtils.getSelectTagById(currentOrgan.id, this.buyerSelectList)
			const organDetails = {
				billState: 0,
				sysBillCode: '',
				userBillCode: this.$fxUtils.createBillCode('RK'),
				billType: 1002,
				billBizTypeId: '',
				businessDate: this.$fxUtils.setDateTime(new Date()),
				inOrgan,
				inHouse: {},
				singleHouseFlag: 0,
				otherOrgan: {},
				operateMan: {
					id: currentUser.id
				},
				carriageFee: 0,
				allotFlag: 0,
				memo: '',
				detailAmount: 0,
				balanceFlag: 0,
				appendixes: [],
				appendixList: [],
				autoType: 0
			}
			await	this.getValidStoreList(organDetails)
			this.fxCache.clear()
			this.tableDetails = []
			this.organDetails = organDetails
			this.$nextTick(() => {
				this.fxDataVerification.resetData(this.organDetails)
				this.$refs.basicInfo.defaultFocus()
			})
		},
		async edit (id, itemName) {
			const organDetails = await this.getOrganDetails(id)
			this.$fxAppTabs.setTabTitle({ sysBillCode: organDetails.sysBillCode })
			this.itemName = itemName
			this.fxCache.clear()
			await this.getListData(organDetails)
			await	this.getValidStoreList(organDetails, organDetails.details)
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
				this.getBillBizTypeSelect(organDetails),
				this.getAgentList(organDetails),
				this.getOutStore(organDetails),
				this.getInStore(organDetails),
				this.getBillType()
			]).then(([userData]) => {
				return Promise.resolve(userData)
			})
		},
		getOrganDetails (id) {
			return this.$fxApi('inStore.getBill', id)
		},
		getDetails () {
			return this.$fxApi('inStore.getDetails', this.organDetails.id).then(res => {
				this.tableDetails = res
				return Promise.resolve(res)
			})
		},
		getAgentList (organDetails) {
			const params = organDetails ? [organDetails.operateMan.id] : []
			return this.$fxApi('inStore.getAgentList')({ data: params }).then(res => {
				this.agentSelectList = res
				return Promise.resolve(res)
			})
		},
		getBillBizTypeSelect (organDetails = this.organDetails) {
			const billType = organDetails.billType || this.defaultBillType
			const data = organDetails.billBizTypeId ? [organDetails.billBizTypeId] : []
			this.$fxApi('inStore.getBillDetailBizTypeSelect', billType)({ data }).then(res => {
				this.billBizTypeList = res
				return Promise.resolve(res)
			})
		},
		getBillType () {
			this.$fxApi('inStore.getBilltypeSelect').then(res => {
				this.billtypeSelect = res
				return Promise.resolve(res)
			})
		},
		getInStore (organDetails) {
			const ids = organDetails && organDetails.inOrgan.id ? [organDetails.inOrgan.id] : []
			return this.$fxApi('inStore.getOrganList')({ data: { ids, names: ['Shop', 'Center'] } }).then(res => {
				this.buyerSelectList = res
				return Promise.resolve(res)
			})
		},
		getOutStore (organDetails) {
			const ids = organDetails && organDetails.otherOrgan.id ? [organDetails.otherOrgan.id] : []
			return this.$fxApi('inStore.getOrganList')({ data: { ids, names: ['Shop', 'Center', 'Supplier', 'Customer'] } }).then(res => {
				this.sellerSelectList = res
				return Promise.resolve(res)
			})
		},
		getValidStoreList (organDetails, tableDetails = []) {
			if (!organDetails.inOrgan.id) {
				this.inStoreWareList = []
				return Promise.resolve()
			}
			let ids = organDetails && organDetails.inHouse.id ? [organDetails.inHouse.id] : []
			const detailsInHouseIds = tableDetails.map(item => item.inHouse.id)
			ids = this.$fxUtils.arrDedup(ids.concat(detailsInHouseIds))
			return this.$fxApi('inStore.getValidStoreList', organDetails.inOrgan.id)({ data: ids }).then(res => {
				this.inStoreWareList = res
				return Promise.resolve()
			})
		},
		getCurrentUser () {
			return this.$fxApi('inStore.getCurrentUser')
		},
		deleteEmptyBill () {
			if (this.organDetails.id && (this.tableDetails.length === 0 || (this.tableDetails.length === 1 && !this.tableDetails[0].id))) {
				return this.$fxApi('inStore.delEmptyBill', this.organDetails.id)
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
			if (this.dateChangeTriggerSave) return
			const checkProductDate = this.tableDetails.some(item => {
				return item.productDate && !this.$fxUtils.compareDate(this.organDetails.businessDate, item.productDate)
			})
			if (checkProductDate) {
				return this.$fxMessage.warning('生产日期不能大于入库时间')
			}
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
		onOrderSave (setting) {
			this.dateChangeTriggerSave = true
			this.onSaveClickHandler().then(() => {
				if (setting.ids.length > 0) {
					this.onSettingMulityDateSave(setting)
				} else {
					this.getDetails()
				}
			})
		},
		onSettingMulityDateSave (setting) {
			const itemNames = setting.itemNames
			const params = {
				ids: setting.ids,
				operColumn: 'productDate',
				productDate: setting.productDate
			}
			const settingInfo = `生产日期:${setting.productDate}`
			const logger = this.$fxLogger.createInfo('store-manage.in-store-order.settingMulityDetails', { settingInfo, orderData: this.organDetails, itemNames })
			this.$fxApi('inStore.setMulity', this.organDetails.id)({ data: params, logger, autoSuccessMsg: false }).then(this.getDetails)
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
				let logger = this.$fxLogger.createInfo('store-manage.in-store-order.add', { orderData: this.organDetails, type: typeName })
				return this.$fxApi('inStore.add')({ data: this.organDetails }).then(res => {
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
					logger = this.$fxLogger.createInfo('store-manage.in-store-order.add', { orderData: this.organDetails, type: typeName })
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
					const logger = this.$fxLogger.createInfo('store-manage.in-store-order.update', this.createLoggerParams())
					return this.$fxApi('inStore.edit', this.organDetails.id)({ data: this.organDetails, logger }).then(res => {
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
			originData.inOrganName = this.getOrganNameById(originData.inOrgan.id, this.buyerSelectList)
			originData.inHouseName = this.getNameById(originData.inHouse.id, this.inStoreWareList)
			originData.operatorName = this.getNameById(originData.operateMan.id, this.agentSelectList)
			originData.otherOrganName = this.getOrganNameById(originData.otherOrgan.id, this.sellerSelectList)
			const organDetails = this.$fxUtils.deepClone(this.organDetails)
			organDetails.billTypeName = this.getNameById(organDetails.billType, this.billtypeSelect)
			organDetails.billBizTypeName = this.getNameById(organDetails.billBizTypeId, this.billBizTypeList)
			organDetails.inOrganName = this.getOrganNameById(organDetails.inOrgan.id, this.buyerSelectList)
			organDetails.inHouseName = this.getNameById(organDetails.inHouse.id, this.inStoreWareList)
			organDetails.operatorName = this.getNameById(organDetails.operateMan.id, this.agentSelectList)
			organDetails.otherOrganName = this.getOrganNameById(organDetails.otherOrgan.id, this.sellerSelectList)
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
			const del = this.isState('deleted') ? 'recyclingDelete' : 'delete'
			const api = this.isState('deleted') ? 'remove' : 'del'
			const logger = this.$fxLogger.createInfo(`store-manage.in-store-order.${del}`, { orderData: this.organDetails })
			return this.$fxApi(`inStore.${api}`, this.organDetails.id)({ logger }).then(res => {
				this.fxDataVerification.resetData(this.organDetails)
				return Promise.resolve()
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
		beforeAction (message) {
			return this.$fxConfirm(message).then(() => {
				return this.$refs.detailsInfo.checkDetailsUnSaving().then(this.onSaveClickHandler)
			})
		},
		onBuyerSubmitClick () {
			if (this.tableDetails.length === 0) {
				return this.$fxMessage.warning('无明细不允许提交，请添加明细')
			}
			const checkProductDate = this.tableDetails.some(item => {
				return item.productDate && !this.$fxUtils.compareDate(this.organDetails.businessDate, item.productDate)
			})
			if (checkProductDate) {
				return this.$fxMessage.warning('生产日期不能大于入库时间')
			}
			return this.beforeAction('是否确定提交？').then(() => {
				if (!this.isStockReturn) {
					return this.$refs.mistakeCheck.mistakeCheck('submit').then(this.onBuyerSubmitHandler)
				} else {
					this.onBuyerSubmitHandler()
				}
			})
		},
		onBuyerSubmitHandler () {
			const logger = this.$fxLogger.createInfo('store-manage.in-store-order.submit', { orderData: this.organDetails })
			return this.$fxApi('inStore.submit', this.organDetails.id)({ logger }).then(res => {
				this.updateOrganDetails(res)
				return Promise.resolve()
			})
		},
		onBuyerReturnClick () {
			return this.$fxConfirm('是否确定退回？').then(() => {
				const logger = this.$fxLogger.createInfo('store-manage.in-store-order.return', { orderData: this.organDetails })
				return this.$fxApi('inStore.return', this.organDetails.id)({ logger }).then(res => {
					this.updateOrganDetails(res)
					return Promise.resolve()
				})
			})
		},
		onBuyerCheckClick () {
			if (this.tableDetails.length === 0) {
				return this.$fxMessage.warning('无明细不允许审核，请添加明细')
			}
			const checkProductDate = this.tableDetails.some(item => {
				return item.productDate && !this.$fxUtils.compareDate(this.organDetails.businessDate, item.productDate)
			})
			if (checkProductDate) {
				return this.$fxMessage.warning('生产日期不能大于入库时间')
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
			if (this.isState(['unSubmit']) && !this.isStockReturn) {
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
			const logger = this.$fxLogger.createInfo('store-manage.in-store-order.check', { orderData: this.organDetails })
			return this.$fxApi('inStore.check', this.organDetails.id)({ data, logger }).then(res => {
				if (this.syncBusinessDate) {
					const logger = this.$fxLogger.createInfo('store-manage.in-store-order.updateBusinessDate', { orderData: this.organDetails, result: res })
					const loggerInfo = this.$fxLogger.actionInfo(logger)
					loggerInfo.success()
				}
				this.updateOrganDetails(res)
				if (this.sysSupplierRate && this.isSupplier && res.otherOrgan.isBindSrm && this.isPurchase && this.organDetails.billSign === 0) {
					this.$refs.supplierRate.open()
				}
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
				const logger = this.$fxLogger.createInfo('store-manage.in-store-order.uncheck', { orderData: this.organDetails })
				return this.$fxApi('inStore.uncheck', this.organDetails.id)({ logger }).then(res => {
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
		onBuyerRecheckClick () {
			return this.$fxConfirm('是否确定复审？').then(() => {
				const logger = this.$fxLogger.createInfo('store-manage.in-store-order.recheck', { orderData: this.organDetails })
				return this.$fxApi('inStore.recheck', this.organDetails.id)({ logger }).then(res => {
					this.updateOrganDetails(res)
					return Promise.resolve()
				})
			})
		},
		onBuyerUnrecheckClick () {
			return this.$fxConfirm('是否确定取消复审？').then(() => {
				const logger = this.$fxLogger.createInfo('store-manage.in-store-order.unrecheck', { orderData: this.organDetails })
				return this.$fxApi('inStore.unrecheck', this.organDetails.id)({ logger }).then(res => {
					this.updateOrganDetails(res)
					return Promise.resolve()
				})
			})
		},
		onBuyerEndAndcheckClick () {
			if (this.tableDetails.length === 0) {
				return this.$fxMessage.warning('无明细不允许审核，请添加明细')
			}
			const checkProductDate = this.tableDetails.some(item => {
				return item.productDate && !this.$fxUtils.compareDate(this.organDetails.businessDate, item.productDate)
			})
			if (checkProductDate) {
				return this.$fxMessage.warning('生产日期不能大于入库时间')
			}
			return this.beforeAction('是否确定审核？').then(() => {
				if (this.isState(['unSubmit']) && !this.isStockReturn) {
					return this.$refs.mistakeCheck.mistakeCheck('endcheck').then(this.onBuyerEndAndcheckHandler)
				} else {
					return this.onBuyerEndAndcheckHandler()
				}
			})
		},
		onBuyerEndAndcheckHandler () {
			const logger = this.$fxLogger.createInfo('store-manage.in-store-order.endcheck', { orderData: this.organDetails })
			return this.$fxApi('inStore.endcheck', this.organDetails.id)({ logger }).then(res => {
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
		onBuyerSplitAndcheckClick () {
			if (this.tableDetails.length === 0) {
				return this.$fxMessage.warning('无明细不允许审核，请添加明细')
			}
			const checkProductDate = this.tableDetails.some(item => {
				return item.productDate && !this.$fxUtils.compareDate(this.organDetails.businessDate, item.productDate)
			})
			if (checkProductDate) {
				return this.$fxMessage.warning('生产日期不能大于入库时间')
			}
			return this.beforeAction('是否确定审核？').then(() => {
				if (this.isState(['unSubmit']) && !this.isStockReturn) {
					return this.$refs.mistakeCheck.mistakeCheck('splitcheck').then(this.onBuyerSplitAndcheckHandler)
				} else {
					return this.onBuyerSplitAndcheckHandler()
				}
			})
		},
		onBuyerSplitAndcheckHandler () {
			const logger = this.$fxLogger.createInfo('store-manage.in-store-order.splitcheck', { orderData: this.organDetails })
			return this.$fxApi('inStore.splitcheck', this.organDetails.id)({ logger }).then(res => {
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
		updateOrganDetails (res) {
			this.getDetails()
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
			} else if (type === 'endcheck') {
				this.onBuyerEndAndcheckHandler()
			} else if (type === 'splitcheck') {
				this.onBuyerSplitAndcheckHandler()
			} else {
				this.onBuyerCheckHandler()
			}
		},
		onInStoreWareChange () {
			if (this.organDetails.id) {
				this.onSaveClick().then(this.clearShelf).then(this.getDetails)
			}
		},
		clearShelf () {
			const logger = this.$fxLogger.createInfo('store-manage.in-store-order.clearShelf', { orderData: this.organDetails })
			return this.$fxApi('inStore.clearShelf', this.organDetails.id)({ logger })
		},
		goToBillBlank () {
			const id = this.organDetails.parentBill.id
			const type = this.organDetails.parentBill.billClass
			this.$fxGoToBillBlank(type, { id }, 'detail')
		},
		exportModel () {
			this.onSaveClick().then(() => {
				const logger = this.$fxLogger.createInfo('store-manage.in-store-order.exportModel', { orderData: this.organDetails })
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
					const logger = this.$fxLogger.createInfo('store-manage.in-store-order.exportData', { orderData: this.organDetails })
					const id = this.organDetails.id
					return this.$fxApi('inStore.exportData', id)({ logger }).then(res => {
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
			const logger = this.$fxLogger.createInfo('store-manage.in-store-order.importModel', { orderData: this.organDetails, name: file.name })
			return this.$fxApi('inStore.importData', this.organDetails.id)({ data: params, logger })
		},
		fastOutStore () {
			this.$refs.fastOutStore.open()
		},
		fastMove () {
			this.$refs.fastMove.open()
		},
		onPrintClick () {
			this.$fxGoPrint('InStore', this.organDetails.id)
		},
		onSendSrmClick () {
			return this.$fxConfirm('是否确定发单至SRM？').then(() => {
				const logger = this.$fxLogger.createInfo('store-manage.in-store-order.sendSrm', { orderData: this.organDetails })
				return this.$fxApi('inStore.sendSrm', this.organDetails.id)({ logger }).then(res => {
					this.updateBillState(res)
					this.fxDataVerification.resetData(this.organDetails)
					this.tableDetails = res.details
					return Promise.resolve()
				})
			})
		},
		onCopyClick () {
			const logger = this.$fxLogger.createInfo('store-manage.in-store-order.copy', { orderData: this.organDetails })
			return this.$fxApi('inStore.copyOrder', this.organDetails.id)({ logger }).then(res => {
				this.$fxMessage.success('单据复制成功')
				this.$fxAppTabs.tabsPush({
					path: 'inStoreOrderDetail',
					query: {
						openType: 'edit',
						id: res.id
					}
				})
			})
		},
		onBillChainClick () {
			return this.$fxApi('inStore.getBillChain', this.organDetails.id).then(res => {
				this.billChainData = res
				const billData = {
					businessDate: this.organDetails.businessDate,
					sysBillCode: this.organDetails.sysBillCode,
					billState: this.organDetails.billState,
					id: this.organDetails.id,
					billClass: 'InStore',
					currentBill: true
				}
				this.$refs.billChain.open(billData)
			})
		},
		appVisibleHandler () {
			this.fxCache.clear()
			this.getBillBizTypeSelect(this.organDetails)
			this.getAgentList(this.organDetails)
			this.getOutStore(this.organDetails)
			this.getBillType()
			this.getInStore(this.organDetails)
			this.getValidStoreList(this.organDetails, this.tableDetails)
			if (!this.isAdd) {
				this.$refs.detailsInfo.syncEditItemUnitList()
			}
		},
		onReturnGoodsClick () {
			const tableDetails = this.$fxUtils.deepClone(this.tableDetails)
			const billId = this.organDetails.id
			const organId = this.organDetails.inOrgan.id
			const params = tableDetails.map(item => item.id)
			return this.$fxApi('inStore.stockAmount', billId, organId)({ data: params }).then(res => {
				tableDetails.forEach(item => {
					item.storeAmount = res[item.id] || 0
					item.inStoreAmount = item.amount
					item.inStoreAssistUnitAmount = item.assistUnitAmount
					if (item.storeAmount < 0) {
						item.amount = 0
					} else {
						item.amount = item.storeAmount
					}
					this.fxCalculation.calculateAssistAmount(item)
				})
				this.$refs.returnGoods.open(tableDetails)
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
</style>
