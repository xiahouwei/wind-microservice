<template>
	<fx-bill-container
		title="采购报价单详情"
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
					:sellerSelectList="sellerSelectList"
					:agentSelectList="agentSelectList"
					:disabled="isDisable || authDisabled"
					:billCreateTypeList="billCreateTypeList"
					@on-refresh-bussiness-type-list="getBusinessTypeList"
					@on-details-refresh="onDetailsRefresh"
					@on-organ-change="onOrganChange"
					@on-other-organ-change="onOtherOrganChange"
				></basicInfo>
				<detailsInfo
					ref="detailsInfo"
					:organDetails="organDetails"
					:tableDetails="tableDetails"
					:isFullScreen.sync="isFullScreen"
					@on-details-refresh="onDetailsRefresh"
				></detailsInfo>
			</w-scroll-bar>
		</div>
		<template slot="footer-left">
			<fx-button
				ref="refreshBtn"
				type="save"
				v-if="!isAdd"
				v-fx-tab:loop.stock-sale-manage_stock-offer-order_details.refreshBtn
				@click="onRefresh"
			>刷新</fx-button>
		</template>
		<template slot="footer-right">
			<el-button
				ref="cancelBtn"
				v-fx-tab:loop.stock-sale-manage_stock-offer-order_details.cancelBtn
				@click="onCancelClick"
			>取消</el-button>
			<fx-button
				ref="saveBtn"
				type="save"
				v-fx-auth:stock-sale-manage_stock-offer-order.edit-stock-offer="!isDisable"
				v-fx-tab:loop.stock-sale-manage_stock-offer-order_details.saveBtn
				@click="onSaveClick"
			>保存</fx-button>
			<fx-button
				ref="submitBtn"
				type="submit"
				v-fx-auth:stock-sale-manage_stock-offer-order.submit-stock-offer="isState(['unSubmit'])"
				v-fx-tab:loop.stock-sale-manage_stock-offer-order_details.submitBtn
				@click="onBuyerSubmitClick"
			>提交</fx-button>
			<fx-button
				ref="returnBtn"
				type="return"
				v-fx-auth:stock-sale-manage_stock-offer-order.back-stock-offer="isState(['unChecked'])"
				v-fx-tab:loop.stock-sale-manage_stock-offer-order_details.returnBtn
				@click="onBuyerReturnClick"
			>退回</fx-button>
			<fx-button
				ref="checkBtn"
				type="check"
				v-fx-auth:stock-sale-manage_stock-offer-order.check-stock-offer="isState(['unSubmit', 'unChecked'])"
				v-fx-tab:loop.stock-sale-manage_stock-offer-order_details.checkBtn
				@click="onBuyerCheckClick"
			>审核</fx-button>
			<fx-button
				ref="uncheckBtn"
				type="uncheck"
				v-fx-auth:stock-sale-manage_stock-offer-order.uncheck-stock-offer="isState(['checked']) && !isRechecked && !isCarryForward"
				v-fx-tab:loop.stock-sale-manage_stock-offer-order_details.uncheckBtn
				@click="onBuyerUncheckClick"
			>反审</fx-button>
			<fx-button
				ref="recheckBtn"
				type="recheck"
				v-fx-auth:stock-sale-manage_stock-offer-order.recheck-stock-offer="isState(['checked']) && !isRechecked && !isCarryForward"
				v-fx-tab:loop.stock-sale-manage_stock-offer-order_details.recheckBtn
				@click="onBuyerRecheckClick"
			>复审</fx-button>
			<fx-button
				ref="unrecheckBtn"
				type="unrecheck"
				v-fx-auth:stock-sale-manage_stock-offer-order.unrecheck-stock-offer="isRechecked && !isCarryForward"
				v-fx-tab:loop.stock-sale-manage_stock-offer-order_details.unrecheckBtn
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
import { mapGetters } from 'vuex'
import basicInfo from './BasicInfo.vue'
import detailsInfo from './DetailsInfo.vue'
import { apiName } from '../../Index.vue'
export default {
	name: 'createOrgan',
	components: {
		basicInfo,
		detailsInfo
	},
	data () {
		return {
			organDetails: {
				organ: {},
				otherOrgan: {},
				operateMan: {}
			},
			tableDetails: [],
			sellerSelectList: [],
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			isFullScreen: false,
			businessSelectList: [],
			buyerSelectList: [],
			agentSelectList: [],
			billCreateTypeList: [],
			billChainData: {},
			fxCache: this.$fxUtils.fxCache('stock-offer')
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
				show: this.detailsAuthGetter('stock-sale-manage_stock-offer-order.export-stock-offer'),
				label: '导出Excel',
				icon: 'export-excel',
				click: this.exportData
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
		hasParentBill () {
			return !!this.organDetails.parentBill
		},
		authDisabled () {
			return !this.detailsAuthGetter('stock-sale-manage_stock-offer-order.edit-stock-offer')
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
		this.$fxTabkey.init('stock-sale-manage_stock-offer-order_details', this)
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
			const { currentOrgan, currentUser } = await this.getListData()
			const inOrgan = this.$fxUtils.getSelectTagById(currentOrgan.id, this.buyerSelectList)
			this.organDetails = {
				billState: 0,
				recheckState: 0,
				sysBillCode: '',
				userBillCode: this.$fxUtils.createBillCode('CB'),
				billType: 6000,
				billBizType: { id: '' },
				organ: inOrgan || {},
				operateMan: { id: currentUser.id },
				urgent: 0,
				memo: '',
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
				// this.getBusinessTypeList(organDetails),
				this.getBuyerList(organDetails),
				this.getSellerList(organDetails),
				this.getAgentList(organDetails)
			]).then(([userData]) => {
				return Promise.resolve(userData)
			})
		},
		getCurrentUser () {
			return this.$fxApi(`${apiName}.getCurrentUser`)
		},
		getBusinessTypeList (organDetails = { billType: 6000 }) {
			const params = (organDetails && organDetails.billBizType) ? [organDetails.billBizType.id] : []
			return this.$fxApi(`${apiName}.getDetailBusinessList`, organDetails.billType)({ data: params }).then(res => {
				this.businessSelectList = res
				return Promise.resolve(res)
			})
		},
		getBillTypeList () {
			return this.$fxApi(`${apiName}.getStockOfferTypeSelect`).then(res => {
				this.billCreateTypeList = res
				return Promise.resolve(res)
			})
		},
		getBuyerList (organDetails) {
			const data = {
				billType: 'StockOffer',
				otherOrganId: '',
				disabledIdList: organDetails ? [organDetails.organ.id] : []
			}
			return this.$fxApi(`${apiName}.getBuyerListNew`)({ data }).then(res => {
				this.buyerSelectList = res
				return Promise.resolve(res)
			})
		},
		getSellerList (organDetails) {
			const data = {
				billType: 'StockOffer',
				otherOrganId: organDetails ? organDetails.organ.id : '',
				disabledIdList: organDetails ? [organDetails.otherOrgan.id] : []
			}
			return this.$fxApi(`${apiName}.getSellerListNew`)({ data }).then(res => {
				this.sellerSelectList = res
				return Promise.resolve(res)
			})
		},
		getAgentList (organDetails) {
			const params = organDetails && organDetails.operateMan ? [organDetails.operateMan.id] : []
			return this.$fxApi(`${apiName}.getAgentList`)({ data: params }).then(res => {
				this.agentSelectList = res
				return Promise.resolve(res)
			})
		},
		// 买方机构发生变动，重新获取卖方机构列表
		onOrganChange () {
			this.getSellerList(this.organDetails)
		},
		// 卖方机构发生变动，重新获取买方机构列表
		onOtherOrganChange () {
			this.getBuyerList(this.organDetails)
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
				const typeName = this.getNameById(this.organDetails.billType, this.billCreateTypeList)
				let logger = this.$fxLogger.createInfo('stock-sale-manage.stock-offer-order.add', { orderData: this.organDetails, type: typeName })
				return this.$fxApi(`${apiName}.add`)({ data: this.organDetails }).then(res => {
					this.$fxAppTabs.setTabTitle({ sysBillCode: res.sysBillCode })
					this.$fxAppTabs.setTabPathQuery({ openType: 'edit', id: res.id })
					this.$set(this.organDetails, 'id', res.id)
					this.organDetails.sysBillCode = res.sysBillCode
					this.organDetails.createDate = res.createDate
					this.organDetails.createMan = res.createMan || ''
					this.organDetails.createUserName = res.createUserName || ''
					this.fxDataVerification.resetData(this.organDetails)
					logger = this.$fxLogger.createInfo('stock-sale-manage.stock-offer-order.add', { orderData: this.organDetails, type: typeName })
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
					const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-offer-order.update', this.createLoggerParams())
					return this.$fxApi(`${apiName}.save`, this.organDetails.id)({ data: this.organDetails, logger }).then(res => {
						// this.getBusinessTypeList(this.organDetails)
						this.fxDataVerification.resetData(this.organDetails)
						return Promise.resolve(res)
					})
				}
			}
		},
		createLoggerParams () {
			const originData = this.fxDataVerification.getOriginData()
			originData.billTypeName = this.getNameById(originData.billType, this.billCreateTypeList)
			originData.billBizTypeName = this.getNameById(originData.billBizType.id, this.businessSelectList)
			originData.organName = this.getOrganNameById(originData.organ.id, this.buyerSelectList)
			originData.operatorName = this.getNameById(originData.operator, this.agentSelectList)
			const organDetails = this.$fxUtils.deepClone(this.organDetails)
			organDetails.billTypeName = this.getNameById(organDetails.billType, this.billCreateTypeList)
			organDetails.billBizTypeName = this.getNameById(organDetails.billBizType.id, this.businessSelectList)
			organDetails.organName = this.getOrganNameById(organDetails.organ.id, this.buyerSelectList)
			organDetails.operatorName = this.getNameById(organDetails.operator, this.agentSelectList)
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
				return this.onBuyerSubmitHandler()
			})
		},
		onBuyerSubmitHandler () {
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-offer-order.submit', { orderData: this.organDetails })
			return this.$fxApi(`${apiName}.submit`, this.organDetails.id)({ logger }).then(res => {
				this.updateBillState(res)
				this.fxDataVerification.resetData(this.organDetails)
				this.tableDetails = res.details
				return Promise.resolve()
			})
		},
		onBuyerReturnClick () {
			return this.$fxConfirm('是否确定退回？').then(() => {
				const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-offer-order.return', { orderData: this.organDetails })
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
				// if (this.$fxStateMiddleware.isState('billState')(['unSubmit'])(this.organDetails.billState)) {
				// 	return this.$refs.mistakeCheck.mistakeCheck('check').then(this.onBuyerCheckHandler)
				// } else {
				return this.onBuyerCheckHandler()
				// }
			})
		},
		onBuyerCheckHandler () {
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-offer-order.check', { orderData: this.organDetails })
			return this.$fxApi(`${apiName}.check`, this.organDetails.id)({ logger }).then(res => {
				this.updateBillState(res)
				this.fxDataVerification.resetData(this.organDetails)
				this.tableDetails = res.details
				return Promise.resolve()
			})
		},
		onBuyerUncheckClick () {
			return this.$fxConfirm('是否确定反审？').then(() => {
				const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-offer-order.uncheck', { orderData: this.organDetails })
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
				const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-offer-order.recheck', { orderData: this.organDetails })
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
				const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-offer-order.unrecheck', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.unrecheck`, this.organDetails.id)({ logger }).then(res => {
					this.updateBillState(res)
					this.fxDataVerification.resetData(this.organDetails)
					return Promise.resolve()
				})
			})
		},
		updateBillState ({ billState, recheckState, submitMan = {}, submitDate = '', checkMan = {}, checkDate = '' }) {
			this.organDetails.billState = billState
			this.organDetails.recheckState = recheckState
			this.$set(this.organDetails, 'submitMan', submitMan)
			this.$set(this.organDetails, 'submitDate', submitDate)
			this.$set(this.organDetails, 'checkMan', checkMan)
			this.$set(this.organDetails, 'checkDate', checkDate)
		},
		goToBillBlank () {
			const id = this.organDetails.parentBill.id
			const billType = this.organDetails.parentBill.billClass
			this.$fxGoToBillBlank(billType, { id }, 'detail')
		},
		exportModel () {
			this.onSaveClick().then(() => {
				const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-offer-order.exportModel', { orderData: this.organDetails })
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
				const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-offer-order.exportData', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.exportData`, this.organDetails.id)({ logger }).then(res => {
					this.$fxUtils.downloadFile(res)
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
					billClass: 'StockOffer',
					currentBill: true
				}
				this.$refs.billChain.open(billData)
			})
		},
		appVisibleHandler () {
			this.fxCache.clear()
			this.getBillTypeList()
			// this.getBusinessTypeList(this.organDetails)
			this.getAgentList(this.organDetails)
			this.getBuyerList(this.organDetails)
			this.getSellerList(this.organDetails)
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
