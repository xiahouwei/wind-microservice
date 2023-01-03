<template>
	<w-dialog
		v-model="dialogVisible"
		title="付款单详情"
		fullscreen
		:beforeClose="onBeforeClose"
		:moreBtnOption="moreBtnOption"
		:billChainOption="billChainOption"
		@close="onDialogClose"
	>
		<template slot="sub">
			<fx-details-state-tag :label="currentState.label" :icon="currentState.icon"></fx-details-state-tag>
		</template>
		<div class="create-order">
			<w-scroll-bar>
				<basicInfo
					ref="basicInfo"
					:visibleFlag="dialogVisible"
					:organDetails="organDetails"
					:settlementDetails="settlementDetails"
					:connectBillDetails="connectBillDetails"
					:organList="organList"
					:otherOrganList="otherOrganList"
					:agentSelectList="agentSelectList"
					:billTypeSelect="billTypeSelect"
					:billBizTypeList="billBizTypeList"
					:departmentList.sync="departmentList"
					:disabled="isDisable || authDisabled"
					@on-details-refresh="getAllDetails"
					@on-connect-details-refresh="getConnectBillDetails"
				></basicInfo>
				<payeeInfo
					ref="payeeInfo"
					:visibleFlag="dialogVisible"
					:organDetails="organDetails"
					:disabled="isDisable || authDisabled"
				>
				</payeeInfo>
				<settlementDetails
					ref="settlementDetails"
					:organDetails="organDetails"
					:tableDetails="settlementDetails"
					:fpSaveMain="onSaveClickHandler"
					:disabled="isDisable || authDisabled"
					@on-details-refresh="getSettlementDetails"
				>
				</settlementDetails>
				<connectBill
					ref="connectBill"
					:organDetails="organDetails"
					:tableDetails="connectBillDetails"
					:fpSaveMain="onSaveClick"
					:disabled="isDisable || authDisabled"
					@on-details-refresh="getConnectBillDetails"
				></connectBill>
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
				v-fx-tab:loop.financial-manage_payment-order_details.refreshBtn
				@click="onRefresh"
			>刷新</fx-button>
			<fx-details-queue-tools
				ref="queueTools"
				v-fx-tab:loop.financial-manage_payment-order_details.queueTools
				v-if="showBillQueue"
				:billId="organDetails.id"
				:tableQueueUtils="tableQueueUtils"
				prevTip="显示上一张单据"
				nextTip="显示下一张单据"
				checkTip="该单据已在列表中被选中"
				uncheckTip="该单据未在列表中被选中"
				@on-bill-change="onBillChange"
			></fx-details-queue-tools>
		</template>
		<template slot="footer-right">
			<fx-button
				ref="cancelBtn"
				v-fx-tab:loop.financial-manage_payment-order_details.cancelBtn
				@click="onCancelClick"
			>取消</fx-button>
			<fx-button
				ref="saveBtn"
				type="save"
				v-fx-auth:store-manage_in-store-order.edit-instore="isUnSubmit"
				v-fx-tab:loop.financial-manage_payment-order_details.saveBtn
				@click="onSaveClick"
			>保存</fx-button>
			<fx-button
				ref="submitBtn"
				type="submit"
				v-fx-auth:store-manage_in-store-order.submit-instore="isUnSubmit"
				v-fx-tab:loop.financial-manage_payment-order_details.submitBtn
				@click="onSubmitClick"
			>提交</fx-button>
			<fx-button
				ref="returnBtn"
				type="return"
				v-fx-auth:store-manage_in-store-order.back-instore="showReturnBtn"
				v-fx-tab:loop.financial-manage_payment-order_details.returnBtn
				@click="onReturnClick"
			>退回</fx-button>
			<fx-button
				ref="checkBtn"
				type="check"
				v-fx-auth:store-manage_in-store-order.check-instore="showCheckBtn"
				v-fx-tab:loop.financial-manage_payment-order_details.checkBtn
				@click="onCheckClick"
			>审核</fx-button>
			<fx-button
				ref="uncheckBtn"
				type="uncheck"
				v-fx-auth:store-manage_in-store-order.uncheck-instore="showUncheckBtn"
				v-fx-tab:loop.financial-manage_payment-order_details.uncheckBtn
				@click="onUncheckClick"
			>反审</fx-button>
			<fx-button
				ref="recheckBtn"
				type="recheck"
				v-fx-auth:store-manage_in-store-order.recheck-instore="showRecheckBtn"
				v-fx-tab:loop.financial-manage_payment-order_details.recheckBtn
				@click="onRecheckClick"
			>复审</fx-button>
			<fx-button
				ref="unrecheckBtn"
				type="unrecheck"
				v-fx-auth:store-manage_in-store-order.unrecheck-instore="showUnrecheckBtn"
				v-fx-tab:loop.financial-manage_payment-order_details.unrecheckBtn
				@click="onUnrecheckClick"
			>取消复审</fx-button>
		</template>
		<fx-bill-chain
			ref="billChain"
			:billChainData="billChainData"
		>
		</fx-bill-chain>
	</w-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import basicInfo from './BasicInfo.vue'
import connectBill from './ConnectBill.vue'
import payeeInfo from './PayeeInfo.vue'
import settlementDetails from './SettlementDetails.vue'
import { apiName } from '../../Index.vue'
export default {
	name: 'createOrder',
	components: {
		basicInfo,
		connectBill,
		payeeInfo,
		settlementDetails
	},
	data () {
		return {
			dialogVisible: false,
			organDetails: {},
			connectBillDetails: [],
			settlementDetails: [],
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			fxCache: this.$fxUtils.fxCache('payment-order'),
			organList: [],
			agentSelectList: [],
			otherOrganList: [],
			billTypeSelect: [],
			billBizTypeList: [],
			departmentList: [],
			showBillQueue: false,
			billChainData: {},
			billDeleteFlag: false
		}
	},
	props: {
		tableQueueUtils: null
	},
	computed: {
		...mapGetters(['detailsAuthGetter']),
		isAdd () {
			return !this.organDetails.id
		},
		isDisable () {
			return !this.isUnSubmit
		},
		isUnSubmit () {
			return this.isState(['unSubmit'])
		},
		currentState () {
			return this.$fxStateMiddleware.getOrderStateById(this.organDetails.billState, this.organDetails.recheckState)
		},
		isState () {
			return (type) => {
				return this.$fxStateMiddleware.isState('billState')(type)(this.organDetails.billState)
			}
		},
		showReturnBtn () {
			return this.isState(['unChecked'])
		},
		showCheckBtn () {
			return this.isState(['unSubmit', 'unChecked'])
		},
		showUncheckBtn () {
			return this.isState(['checked']) && this.currentState.type !== 'rechecked'
		},
		showRecheckBtn () {
			return this.isState(['checked']) && this.currentState.type !== 'rechecked'
		},
		showUnrecheckBtn () {
			return this.currentState.type === 'rechecked'
		},
		hasParentBill () {
			return !!this.organDetails.parentBill
		},
		moreBtnOption () {
			return [{
				show: !this.isAdd && this.isUnSubmit && this.detailsAuthGetter('store-manage_in-store-order.delete-instore'),
				label: '删除',
				icon: 'delete-trash',
				click: this.onDeleteClick
			}, {
				show: !this.isAdd && this.detailsAuthGetter('store-manage_in-store-order.print-instore'),
				label: '打印',
				icon: 'print',
				click: this.onPrintClick
			}]
		},
		authDisabled () {
			return !this.detailsAuthGetter('store-manage_in-store-order.edit-instore')
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
		this.$fxTabkey.init('financial-manage_payment-order_details', this)
	},
	methods: {
		async add () {
			const { currentUser } = await this.getListData()
			this.fxCache.clear()
			this.organDetails = {
				id: '',
				billState: 0,
				recheckState: 0,
				sysBillCode: '',
				userBillCode: this.$fxUtils.createBillCode('FK'),
				billType: 301,
				billBizTypeId: '',
				businessDate: this.$fxUtils.setDateTime(new Date()),
				organ: {},
				otherOrgan: {},
				department: {},
				operateMan: {
					id: currentUser.id
				},
				memo: '',
				otherOrganName: '',
				otherOrganBank: '',
				otherOrganAccount: '',
				otherOrganBankNum: '',
				autoType: 0
			}
			this.connectBillDetails = []
			this.settlementDetails = []
			this.tableQueueUtils.setChecked(false)
			this.showBillQueue = false
			this.billDeleteFlag = false
			this.dialogVisible = true
			this.$nextTick(() => {
				this.fxDataVerification.resetData(this.organDetails)
				this.$refs.basicInfo.defaultFocus()
			})
		},
		async edit (id, showBillQueue = true) {
			const organDetails = await this.getOrganDetails(id)
			this.showBillQueue = showBillQueue
			await this.getListData(organDetails)
			this.fxCache.clear()
			this.billDeleteFlag = false
			this.dialogVisible = true
			this.fxDataVerification.resetData(this.organDetails)
			this.$nextTick(() => {
				if (this.isDisable || this.authDisabled) {
					this.$fxUtils.vDoRefFocus(this, 'refreshBtn')
				} else {
					this.$refs.basicInfo.defaultFocus()
				}
			})
		},
		async getListData (organDetails) {
			return Promise.all([
				this.getCurrentUser(),
				this.getAgentList(organDetails),
				this.getOrganList(organDetails),
				this.getOtherOrganList(organDetails),
				this.getBillType(),
				this.getDepartmentList(organDetails)
			]).then(([userData]) => {
				return Promise.resolve(userData)
			})
		},
		getOrganDetails (id) {
			return this.$fxApi(`${apiName}.getBill`, id).then(res => {
				return this.setOrganDetails(res)
			})
		},
		setOrganDetails (organDetails) {
			this.connectBillDetails = organDetails.mpaymentPayableDetails || []
			this.settlementDetails = organDetails.details || []
			const data = this.$fxUtils.deepClone(organDetails)
			delete data.details
			delete data.mpaymentPayableDetails
			this.organDetails = data
			this.fxDataVerification.resetData(this.organDetails)
			return Promise.resolve(data)
		},
		getAllDetails () {
			return this.$fxApi(`${apiName}.getBill`, this.organDetails.id).then(res => {
				this.connectBillDetails = res.mpaymentPayableDetails || []
				this.settlementDetails = res.details || []
				return Promise.resolve(res)
			})
		},
		getConnectBillDetails () {
			return this.$fxApi(`${apiName}.getConnectBillDetails`, this.organDetails.id).then(res => {
				this.connectBillDetails = res
				return Promise.resolve(res)
			})
		},
		getSettlementDetails () {
			return this.$fxApi(`${apiName}.getSettlementDetails`, this.organDetails.id).then(res => {
				this.settlementDetails = res
				return Promise.resolve(res)
			})
		},
		getAgentList (organDetails) {
			const params = organDetails ? [organDetails.operateMan.id] : []
			return this.$fxApi(`${apiName}.getAgentList`)({ data: params }).then(res => {
				this.agentSelectList = res
				return Promise.resolve(res)
			})
		},
		getBillType () {
			return this.$fxApi(`${apiName}.getBillTypeSelect`).then(res => {
				this.billTypeSelect = res
				return Promise.resolve(res)
			})
		},
		getOrganList (organDetails) {
			const ids = organDetails && organDetails.organ.id ? [organDetails.organ.id] : []
			return this.$fxApi(`${apiName}.getOrganList`)({ data: ids }).then(res => {
				this.organList = res
				return Promise.resolve(res)
			})
		},
		getOtherOrganList (organDetails) {
			const ids = organDetails && organDetails.otherOrgan.id ? [organDetails.otherOrgan.id] : []
			return this.$fxApi(`${apiName}.getOtherOrganList`)({ data: ids }).then(res => {
				this.otherOrganList = res
				return Promise.resolve(res)
			})
		},
		getCurrentUser () {
			return this.$fxApi(`${apiName}.getCurrentUser`)
		},
		getDepartmentList (organDetails) {
			if (!organDetails || !organDetails.organ.organId) {
				return Promise.resolve()
			} else {
				const ids = organDetails && organDetails.department.id ? [organDetails.department.id] : []
				return this.$fxApi(`${apiName}.getDepartmentList`, organDetails.organ.organId)({ data: ids }).then(res => {
					this.departmentList = res
					return Promise.resolve(res)
				})
			}
		},
		onDialogClose () {
			this.deleteEmptyBill().then(() => {
				this.$refs.connectBill.clear()
				this.$refs.settlementDetails.clear()
				this.$emit('on-refresh', this.billDeleteFlag)
			})
		},
		deleteEmptyBill () {
			if (this.organDetails.id && this.connectBillDetails.length === 0 && (this.settlementDetails.length === 0 || (this.settlementDetails.length === 1 && !this.settlementDetails[0].id))) {
				return this.$fxApi(`${apiName}.delEmptyBill`, this.organDetails.id).then(() => {
					this.billDeleteFlag = true
					return Promise.resolve()
				})
			} else {
				return Promise.resolve()
			}
		},
		goToBillBlank () {
			const id = this.organDetails.parentBill.id
			const type = this.organDetails.parentBill.billClass
			this.$fxGoToBillBlank(type, { id })
		},
		onRefresh () {
			this.verificationDetails('当前页面存在未保存数据，是否确定刷新操作？').then(() => {
				this.edit(this.organDetails.id, this.showBillQueue)
			})
		},
		onSaveClick () {
			return this.$refs.settlementDetails.checkDetailsUnSaving().then(() => {
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
				const typeName = this.getNameById(this.organDetails.billType, this.billTypeSelect)
				let logger = this.$fxLogger.createInfo('financial-manage.capital-manage.payment-order.add', { orderData: this.organDetails, type: typeName })
				return this.$fxApi(`${apiName}.add`)({ data: this.organDetails }).then(res => {
					this.organDetails.id = res.id || ''
					this.organDetails.sysBillCode = res.sysBillCode || ''
					this.organDetails.createMan = res.createMan || ''
					this.organDetails.createDate = res.createDate || ''
					this.fxDataVerification.resetData(this.organDetails)
					logger = this.$fxLogger.createInfo('financial-manage.capital-manage.payment-order.add', { orderData: this.organDetails, type: typeName })
					const loggerInfo = this.$fxLogger.actionInfo(logger)
					loggerInfo.success()
					return Promise.resolve(res)
				}).catch(error => {
					const loggerInfo = this.$fxLogger.actionInfo(logger)
					loggerInfo.error(error.message)
					return Promise.reject(error)
				})
			} else {
				if (this.fxDataVerification.checkData(this.organDetails)) {
					return Promise.resolve(this.organDetails)
				} else {
					const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.payment-order.update', this.createLoggerParams())
					return this.$fxApi(`${apiName}.edit`, this.organDetails.id)({ data: this.organDetails, logger }).then(res => {
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
		onCancelClick () {
			this.verificationDetails().then(() => {
				this.dialogVisible = false
			})
		},
		onDeleteClick () {
			this.$fxConfirm('是否确定删除当前单据？').then(this.onDeleteHandler)
		},
		onDeleteHandler () {
			const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.payment-order.delete', { orderData: this.organDetails })
			return this.$fxApi(`${apiName}.del`, this.organDetails.id)({ logger }).then(res => {
				this.billDeleteFlag = true
				this.dialogVisible = false
				return Promise.resolve()
			})
		},
		verificationDetails (message = '当前页面存在未保存数据，是否确定取消并退出操作？') {
			return new Promise(resolve => {
				if (this.$refs.settlementDetails.isRowEditing() || !this.fxDataVerification.checkData(this.organDetails)) {
					this.$fxConfirm(message).then(resolve)
				} else {
					resolve()
				}
			})
		},
		onBeforeClose (close) {
			this.verificationDetails().then(() => {
				close()
			})
		},
		beforeAction (message) {
			return this.$fxConfirm(message).then(() => {
				return this.$refs.settlementDetails.checkDetailsUnSaving().then(this.onSaveClickHandler)
			})
		},
		onSubmitClick () {
			if (this.settlementDetails.length === 0) {
				return this.$fxMessage.warning('无结算明细不允许提交，请添加结算明细')
			}
			if (this.connectBillDetails.length === 0) {
				return this.$fxMessage.warning('无关联单据不允许提交，请添加关联单据')
			}
			return this.beforeAction('是否确定提交？').then(() => {
				return this.onSubmitHandler()
			})
		},
		onSubmitHandler () {
			const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.payment-order.submit', { orderData: this.organDetails })
			return this.$fxApi(`${apiName}.submit`, this.organDetails.id)({ logger }).then(this.updateOrganDetails)
		},
		onReturnClick () {
			return this.$fxConfirm('是否确定退回？').then(() => {
				const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.payment-order.return', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.return`, this.organDetails.id)({ logger }).then(this.updateOrganDetails)
			})
		},
		onCheckClick () {
			if (this.settlementDetails.length === 0) {
				return this.$fxMessage.warning('无结算明细不允许提交，请添加结算明细')
			}
			if (this.connectBillDetails.length === 0) {
				return this.$fxMessage.warning('无关联单据不允许审核，请添加关联单据')
			}
			return this.beforeAction('是否确定审核？').then(() => {
				return this.onCheckHandler()
			})
		},
		onCheckHandler () {
			const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.payment-order.check', { orderData: this.organDetails })
			return this.$fxApi(`${apiName}.check`, this.organDetails.id)({ logger }).then(this.updateOrganDetails)
		},
		onUncheckClick () {
			return this.$fxConfirm('是否确定反审？').then(() => {
				const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.payment-order.uncheck', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.uncheck`, this.organDetails.id)({ logger }).then(this.updateOrganDetails)
			})
		},
		onRecheckClick () {
			return this.$fxConfirm('是否确定复审？').then(() => {
				const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.payment-order.recheck', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.recheck`, this.organDetails.id)({ logger }).then(this.updateOrganDetails)
			})
		},
		onUnrecheckClick () {
			return this.$fxConfirm('是否确定取消复审？').then(() => {
				const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.payment-order.unrecheck', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.unrecheck`, this.organDetails.id)({ logger }).then(this.updateOrganDetails)
			})
		},
		updateOrganDetails (res) {
			!res.department && (res.department = {})
			return this.setOrganDetails(res)
		},
		onPrintClick () {
			// this.$fxGoPrint('InStore', this.organDetails.id)
		},
		onBillChange (type) {
			if (this.isDisable) {
				this.tableQueueUtils.billChange(type)
			} else {
				this.$refs.settlementDetails.checkDetailsUnSaving().then(() => {
					if (this.fxDataVerification.checkData(this.organDetails)) {
						this.tableQueueUtils.billChange(type)
					} else {
						this.onSaveClickHandler().then(() => {
							this.tableQueueUtils.billChange(type)
						})
					}
				})
			}
		},
		onBillChainClick () {
			// return this.$fxApi(`${apiName}.getBillChain`, this.organDetails.id).then(res => {
			// 	this.billChainData = res
			// 	const billData = {
			// 		businessDate: this.organDetails.businessDate,
			// 		sysBillCode: this.organDetails.sysBillCode,
			// 		billState: this.organDetails.billState,
			// 		id: this.organDetails.id,
			// 		billClass: 'CWPaymentBill',
			// 		currentBill: true
			// 	}
			// 	this.$refs.billChain.open(billData)
			// })
		},
		appVisibleHandler () {
			if (this.dialogVisible) {
				this.getAgentList(this.organDetails)
				this.getOtherOrganList(this.organDetails)
				this.getOrganList(this.organDetails)
				this.getDepartmentList(this.organDetails)
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.create-order {
	flex: 1
	display: flex;
	flex-direction: column;
	overflow: auto;
}
</style>
