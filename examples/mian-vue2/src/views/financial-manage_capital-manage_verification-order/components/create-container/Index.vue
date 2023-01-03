<template>
	<w-dialog
		v-model="dialogVisible"
		title="应付核销详情"
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
					:payableVerificationDetails="payableTableDetails"
					:paymentVerificationDetails="paymentTableDetails"
					:organList="organList"
					:otherOrganList="otherOrganList"
					:agentSelectList="agentSelectList"
					:billTypeSelect="billTypeSelect"
					:departmentList.sync="departmentList"
					:disabled="isDisable || authDisabled"
					@on-details-refresh="getAllDetails"
				></basicInfo>
				<payableVerificationDetails
					ref="payableVerificationDetails"
					:organDetails="organDetails"
					:tableDetails="payableTableDetails"
					:fpSaveMain="onSaveClickHandler"
					:paymentCheckDetailsUnSaving="paymentCheckDetailsUnSaving"
					:disabled="isDisable || authDisabled"
					@on-details-refresh="getAllDetails"
				>
				</payableVerificationDetails>
				<paymentVerificationDetails
					ref="paymentVerificationDetails"
					:organDetails="organDetails"
					:tableDetails="paymentTableDetails"
					:fpSaveMain="onSaveClickHandler"
					:payableCheckDetailsUnSaving="payableCheckDetailsUnSaving"
					:disabled="isDisable || authDisabled"
					@on-details-refresh="getAllDetails"
				></paymentVerificationDetails>
			</w-scroll-bar>
		</div>
		<template slot="footer-left">
			<fx-button
				ref="refreshBtn"
				type="save"
				v-if="!isAdd"
				v-fx-tab:loop.financial-manage_verification-order_details.refreshBtn
				@click="onRefresh"
			>刷新</fx-button>
			<fx-details-queue-tools
				ref="queueTools"
				v-fx-tab:loop.financial-manage_verification-order_details.queueTools
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
				v-fx-tab:loop.financial-manage_verification-order_details.cancelBtn
				@click="onCancelClick"
			>取消</fx-button>
			<fx-button
				ref="saveBtn"
				type="save"
				v-fx-auth:store-manage_in-store-order.edit-instore="isUnWrittenOff"
				v-fx-tab:loop.financial-manage_verification-order_details.saveBtn
				@click="onSaveClick"
			>保存</fx-button>
			<fx-button
				ref="handVerificationBtn"
				type="check"
				v-fx-auth:store-manage_in-store-order.check-instore="showVerificationBtn"
				v-fx-tab:loop.financial-manage_verification-order_details.handVerificationBtn
				@click="onHandVerificationClick"
			>手动核销</fx-button>
			<fx-button
				ref="diffVerificationBtn"
				type="recheck"
				v-fx-auth:store-manage_in-store-order.check-instore="showVerificationBtn"
				v-fx-tab:loop.financial-manage_verification-order_details.diffVerificationBtn
				@click="onDiffVerificationClick"
			>差异核销</fx-button>
			<fx-button
				ref="unverificationBtn"
				type="uncheck"
				v-fx-auth:store-manage_in-store-order.uncheck-instore="showUnverificationBtn"
				v-fx-tab:loop.financial-manage_verification-order_details.unverificationBtn
				@click="onUnverificationClick"
			>反核销</fx-button>
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
import paymentVerificationDetails from './PaymentVerificationDetails.vue'
import payableVerificationDetails from './PayableVerificationDetails.vue'
import { apiName } from '../../Index.vue'
export default {
	name: 'createOrder',
	components: {
		basicInfo,
		paymentVerificationDetails,
		payableVerificationDetails
	},
	data () {
		return {
			dialogVisible: false,
			organDetails: {},
			paymentTableDetails: [],
			payableTableDetails: [],
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			fxCache: this.$fxUtils.fxCache('verification-order'),
			organList: [],
			agentSelectList: [],
			otherOrganList: [],
			billTypeSelect: [],
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
			return !this.isUnWrittenOff
		},
		isUnWrittenOff () {
			return this.isState(['unWrittenOff'])
		},
		currentState () {
			return this.$fxStateMiddleware.getStateObj('verificationOrderState')(this.organDetails.billState)
		},
		isState () {
			return (type) => {
				return this.$fxStateMiddleware.isState('verificationOrderState')(type)(this.organDetails.billState)
			}
		},
		showVerificationBtn () {
			return this.isState(['unWrittenOff'])
		},
		showUnverificationBtn () {
			return this.isState(['writtenOff'])
		},
		moreBtnOption () {
			return [{
				show: !this.isAdd && this.isUnWrittenOff && this.detailsAuthGetter('store-manage_in-store-order.delete-instore'),
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
		this.$fxTabkey.init('financial-manage_verification-order_details', this)
	},
	methods: {
		async add () {
			await this.getListData()
			this.fxCache.clear()
			this.organDetails = {
				id: '',
				billState: 0,
				recheckState: 0,
				sysBillCode: '',
				userBillCode: this.$fxUtils.createBillCode('YFHX'),
				billType: 101,
				billBizTypeId: '',
				businessDate: this.$fxUtils.setDateTime(new Date()),
				organ: {},
				otherOrgan: {},
				department: {},
				writeOffMan: {},
				writeOffWay: 0,
				writeOffDate: '',
				memo: '',
				autoType: 0
			}
			this.paymentTableDetails = []
			this.payableTableDetails = []
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
				// this.getCurrentUser(),
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
			this.payableTableDetails = organDetails.payableBills || []
			this.paymentTableDetails = organDetails.paymentBills || []
			const data = this.$fxUtils.deepClone(organDetails)
			delete data.payableBills
			delete data.paymentBills
			this.organDetails = data
			this.fxDataVerification.resetData(this.organDetails)
			return Promise.resolve(data)
		},
		getAllDetails () {
			return this.$fxApi(`${apiName}.getBill`, this.organDetails.id).then(res => {
				this.payableTableDetails = res.payableBills || []
				this.paymentTableDetails = res.paymentBills || []
				return Promise.resolve(res)
			})
		},
		getAgentList (organDetails) {
			const params = organDetails ? [organDetails.writeOffMan.id] : []
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
		// getCurrentUser () {
		// 	return this.$fxApi(`${apiName}.getCurrentUser`)
		// },
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
			// this.deleteEmptyBill().then(() => {
			this.$refs.paymentVerificationDetails.clear()
			this.$refs.payableVerificationDetails.clear()
			this.$emit('on-refresh', this.billDeleteFlag)
			// })
		},
		deleteEmptyBill () {
			if (this.organDetails.id && this.paymentTableDetails.length === 0 && (this.payableTableDetails.length === 0 || (this.payableTableDetails.length === 1 && !this.payableTableDetails[0].id))) {
				return this.$fxApi(`${apiName}.delEmptyBill`, this.organDetails.id).then(() => {
					this.billDeleteFlag = true
					return Promise.resolve()
				})
			} else {
				return Promise.resolve()
			}
		},
		onRefresh () {
			this.verificationDetails('当前页面存在未保存数据，是否确定刷新操作？').then(() => {
				this.edit(this.organDetails.id, this.showBillQueue)
			})
		},
		payableCheckDetailsUnSaving () {
			return this.$refs.payableVerificationDetails.checkDetailsUnSaving()
		},
		paymentCheckDetailsUnSaving () {
			return this.$refs.paymentVerificationDetails.checkDetailsUnSaving()
		},
		onSaveClick () {
			return this.$refs.payableVerificationDetails.checkDetailsUnSaving()
				.then(this.$refs.paymentVerificationDetails.checkDetailsUnSaving())
				.then(() => {
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
				let logger = this.$fxLogger.createInfo('financial-manage.capital-manage.verification-order.add', { orderData: this.organDetails, type: typeName })
				return this.$fxApi(`${apiName}.add`)({ data: this.organDetails }).then(res => {
					this.organDetails.id = res.id || ''
					this.organDetails.sysBillCode = res.sysBillCode || ''
					this.organDetails.createMan = res.createMan || ''
					this.organDetails.createDate = res.createDate || ''
					this.fxDataVerification.resetData(this.organDetails)
					logger = this.$fxLogger.createInfo('financial-manage.capital-manage.verification-order.add', { orderData: this.organDetails, type: typeName })
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
					const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.verification-order.update', this.createLoggerParams())
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
			const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.verification-order.delete', { orderData: this.organDetails })
			return this.$fxApi(`${apiName}.del`, this.organDetails.id)({ logger }).then(res => {
				this.billDeleteFlag = true
				this.dialogVisible = false
				return Promise.resolve()
			})
		},
		verificationDetails (message = '当前页面存在未保存数据，是否确定取消并退出操作？') {
			return new Promise(resolve => {
				if (this.$refs.payableVerificationDetails.isRowEditing() ||
				this.$refs.paymentVerificationDetails.isRowEditing() ||
				!this.fxDataVerification.checkData(this.organDetails)) {
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
				return this.$refs.payableVerificationDetails.checkDetailsUnSaving().then(this.onSaveClickHandler)
			})
		},
		onHandVerificationClick () {
			if (this.payableTableDetails.length === 0) {
				return this.$fxMessage.warning('无应付明细不允许核销，请添加应付明细')
			}
			if (this.paymentTableDetails.length === 0) {
				return this.$fxMessage.warning('无付款明细不允许核销，请添加付款明细')
			}
			return this.beforeAction('是否确定手动核销？').then(() => {
				return this.onHandVerificationHandler()
			})
		},
		onHandVerificationHandler () {
			const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.verification-order.handVerification', { orderData: this.organDetails })
			return this.$fxApi(`${apiName}.handVerification`, this.organDetails.id)({ logger }).then(this.updateOrganDetails)
		},
		onDiffVerificationClick () {
			if (this.payableTableDetails.length === 0) {
				return this.$fxMessage.warning('无应付明细不允许核销，请添加应付明细')
			}
			if (this.paymentTableDetails.length === 0) {
				return this.$fxMessage.warning('无付款明细不允许核销，请添加付款明细')
			}
			return this.beforeAction('差异核销主要处理单据尾数的核销等。如果是正常的核销业务，请正常核销进行处理，请确认是否要继续？').then(() => {
				return this.onDiffVerificationHandler()
			})
		},
		onDiffVerificationHandler () {
			const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.verification-order.diffVerification', { orderData: this.organDetails })
			return this.$fxApi(`${apiName}.diffVerification`, this.organDetails.id)({ logger }).then(this.updateOrganDetails)
		},
		onUnverificationClick () {
			return this.$fxConfirm('反核销后单据自动删除，请确认是否要继续？').then(() => {
				const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.verification-order.unverification', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.unverification`, this.organDetails.id)({ logger }).then(this.updateOrganDetails)
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
				this.$refs.payableVerificationDetails.checkDetailsUnSaving().then(() => {
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
