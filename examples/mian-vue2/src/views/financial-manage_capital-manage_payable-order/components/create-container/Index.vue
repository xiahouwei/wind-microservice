<template>
	<w-dialog
		v-model="dialogVisible"
		title="应付单详情"
		fullscreen
		:beforeClose="onBeforeClose"
		:moreBtnOption="moreBtnOption"
		:billChainOption="billChainOption"
		:titleClass="billTypeClass"
		@close="onDialogClose"
	>
		<template slot="sub">
			<fx-details-state-tag :label="currentState.label" :icon="currentState.icon"></fx-details-state-tag>
		</template>
		<div class="create-order">
			<w-scroll-bar :flex="isFullScreen">
				<basicInfo
					v-show="!isFullScreen"
					ref="basicInfo"
					:visibleFlag="dialogVisible"
					:isFullScreen="isFullScreen"
					:organDetails="organDetails"
					:tableDetails="tableDetails"
					:organList="organList"
					:otherOrganList="otherOrganList"
					:agentSelectList="agentSelectList"
					:billTypeSelect="billTypeSelect"
					:billBizTypeList="billBizTypeList"
					:departmentList.sync="departmentList"
					:disabled="isDisable || authDisabled"
					@on-details-refresh="getDetails"
				></basicInfo>
				<invoiceInfo
					ref="invoiceInfo"
					v-show="!isFullScreen"
					:visibleFlag="dialogVisible"
					:isFullScreen="isFullScreen"
					:organDetails="organDetails"
				>
				</invoiceInfo>
				<detailsInfo
					ref="detailsInfo"
					:organDetails="organDetails"
					:tableDetails="tableDetails"
					:isFullScreen.sync="isFullScreen"
					:fpSaveMain="onSaveClickHandler"
					:disabled="isDisable || authDisabled"
					:billColor="billTypeClass"
					:isRedPayableOrder="isRedPayableOrder"
					@on-details-refresh="getDetails"
				></detailsInfo>
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
				v-fx-tab:loop.financial-manage_payable-order_details.refreshBtn
				@click="onRefresh"
			>刷新</fx-button>
			<fx-details-queue-tools
				ref="queueTools"
				v-fx-tab:loop.financial-manage_payable-order_details.queueTools
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
				v-fx-tab:loop.financial-manage_payable-order_details.cancelBtn
				@click="onCancelClick"
			>取消</fx-button>
			<fx-button
				ref="saveBtn"
				type="save"
				v-fx-auth:store-manage_in-store-order.edit-instore="isUnSubmit"
				v-fx-tab:loop.financial-manage_payable-order_details.saveBtn
				@click="onSaveClick"
			>保存</fx-button>
			<fx-button
				ref="submitBtn"
				type="submit"
				v-fx-auth:store-manage_in-store-order.submit-instore="isUnSubmit"
				v-fx-tab:loop.financial-manage_payable-order_details.submitBtn
				@click="onBuyerSubmitClick"
			>提交</fx-button>
			<fx-button
				ref="returnBtn"
				type="return"
				v-fx-auth:store-manage_in-store-order.back-instore="showReturnBtn"
				v-fx-tab:loop.financial-manage_payable-order_details.returnBtn
				@click="onBuyerReturnClick"
			>退回</fx-button>
			<fx-button
				ref="checkBtn"
				type="check"
				v-fx-auth:store-manage_in-store-order.check-instore="showCheckBtn"
				v-fx-tab:loop.financial-manage_payable-order_details.checkBtn
				@click="onBuyerCheckClick"
			>审核</fx-button>
			<fx-button
				ref="uncheckBtn"
				type="uncheck"
				v-fx-auth:store-manage_in-store-order.uncheck-instore="showUncheckBtn"
				v-fx-tab:loop.financial-manage_payable-order_details.uncheckBtn
				@click="onBuyerUncheckClick"
			>反审</fx-button>
			<fx-button
				ref="recheckBtn"
				type="recheck"
				v-fx-auth:store-manage_in-store-order.recheck-instore="showRecheckBtn"
				v-fx-tab:loop.financial-manage_payable-order_details.recheckBtn
				@click="onBuyerRecheckClick"
			>复审</fx-button>
			<fx-button
				ref="unrecheckBtn"
				type="unrecheck"
				v-fx-auth:store-manage_in-store-order.unrecheck-instore="showUnrecheckBtn"
				v-fx-tab:loop.financial-manage_payable-order_details.unrecheckBtn
				@click="onBuyerUnrecheckClick"
			>取消复审</fx-button>
			<fx-button
				ref="pushDownBtn"
				type="primary"
				class="pushdown-btn"
				v-fx-auth:store-manage_in-store-order.recheck-instore="showPushDownBtn"
				v-fx-tab:loop.financial-manage_payable-order_details.pushDownBtn
				@click="onPushDownClick"
			>下推</fx-button>
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
import detailsInfo from './DetailsInfo.vue'
import invoiceInfo from './InvoiceInfo.vue'
import { apiName } from '../../Index.vue'
export default {
	name: 'createOrder',
	components: {
		basicInfo,
		detailsInfo,
		invoiceInfo
	},
	data () {
		return {
			dialogVisible: false,
			organDetails: {},
			tableDetails: [],
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			isFullScreen: false,
			organList: [],
			agentSelectList: [],
			otherOrganList: [],
			billTypeSelect: [],
			billBizTypeList: [],
			departmentList: [],
			showBillQueue: false,
			billChainData: {},
			billDeleteFlag: false,
			isCommonTypeByRules: this.$fxTypeMiddleware.isCommonType('peyableOrderGenerateType', 'rules')
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
			if (Number(this.organDetails.recheckState) === 1) {
				return this.$fxStateMiddleware.getStateObj('recheckState')(this.organDetails.recheckState)
			} else {
				return this.$fxStateMiddleware.getStateObj('financialOrderState')(this.organDetails.billState)
			}
		},
		isState () {
			return (type) => {
				return this.$fxStateMiddleware.isState('billState')(type)(this.organDetails.billState)
			}
		},
		hasParentBill () {
			return !!this.organDetails.parentBill
		},
		showReturnBtn () {
			return this.isState(['unChecked'])
		},
		showCheckBtn () {
			return this.isState(['unSubmit', 'unChecked'])
		},
		showUncheckBtn () {
			return this.isState(['checked']) && this.currentState.type !== 'rechecked' && !this.isRedPayableOrder
		},
		showRecheckBtn () {
			return this.isState(['checked']) && this.currentState.type !== 'rechecked' && !this.isRedPayableOrder
		},
		showUnrecheckBtn () {
			return this.currentState.type === 'rechecked'
		},
		showPushDownBtn () {
			return this.isState(['checked', 'rechecked']) && !this.isRedPayableOrder
		},
		moreBtnOption () {
			return [{
				show: !this.isAdd && this.isUnSubmit && !this.isRedPayableOrder && this.detailsAuthGetter('store-manage_in-store-order.delete-instore'),
				label: '删除',
				icon: 'delete-trash',
				click: this.onDeleteClick
			}, {
				show: !this.isAdd && this.detailsAuthGetter('store-manage_in-store-order.export-instore'),
				label: '导出Excel',
				icon: 'export-excel',
				children: [{
					show: !this.isAdd && this.detailsAuthGetter('store-manage_in-store-order.export-instore'),
					label: '导出明细数据',
					icon: 'export-data',
					click: this.exportData
				}]
			}, {
				show: !this.isAdd && this.detailsAuthGetter('store-manage_in-store-order.print-instore'),
				label: '打印',
				icon: 'print',
				click: this.onPrintClick
			}]
		},
		billTypeClass () {
			switch (this.organDetails.billType) {
			case 103:
				return 'fx-warn-font'
			default:
				return ''
			}
		},
		authDisabled () {
			return !this.detailsAuthGetter('store-manage_in-store-order.edit-instore')
		},
		billChainOption () {
			return {
				show: !this.isAdd,
				click: this.onBillChainClick
			}
		},
		isRedPayableOrder () {
			return this.isCommonTypeByRules('red-payable-order')(this.organDetails.billType)
		}
	},
	created () {
		this.$fxEventBus.initEvent(this, 'app-visible', this.appVisibleHandler)
		this.$fxTabkey.init('financial-manage_payable-order_details', this)
	},
	methods: {
		async add () {
			const { currentUser } = await this.getListData()
			this.organDetails = {
				id: '',
				billState: 0,
				recheckState: 0,
				sysBillCode: '',
				userBillCode: this.$fxUtils.createBillCode('YF'),
				billType: 101,
				billBizTypeId: '',
				businessDate: this.$fxUtils.setDateTime(new Date()),
				organ: {},
				otherOrgan: {},
				department: {},
				operateMan: {
					id: currentUser.id
				},
				memo: '',
				autoType: 0
			}
			this.tableQueueUtils.setChecked(false)
			this.showBillQueue = false
			this.billDeleteFlag = false
			this.tableDetails = []
			this.dialogVisible = true
			this.$nextTick(() => {
				this.fxDataVerification.resetData(this.organDetails)
				this.$refs.basicInfo.defaultFocus()
			})
		},
		async edit (id, showBillQueue = true) {
			const organDetails = await this.getOrganDetails(id)
			this.showBillQueue = showBillQueue
			this.billDeleteFlag = false
			await this.getListData(organDetails)
			this.dialogVisible = true
			this.fxDataVerification.resetData(this.organDetails)
			this.$nextTick(() => {
				this.$refs.basicInfo.refresh()
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
				this.tableDetails = res.details
				const data = this.$fxUtils.deepClone(res)
				delete data.details
				this.organDetails = data
				this.fxDataVerification.resetData(this.organDetails)
				return Promise.resolve(data)
			})
		},
		getDetails () {
			return this.$fxApi(`${apiName}.getDetails`, this.organDetails.id).then(res => {
				this.tableDetails = res
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
			return this.$fxApi(`${apiName}.getOrganSelectTab`)(ids).then(res => {
				this.organList = res
				return Promise.resolve(res)
			})
		},
		getOtherOrganList (organDetails) {
			const ids = organDetails && organDetails.otherOrgan.id ? [organDetails.otherOrgan.id] : []
			return this.$fxApi(`${apiName}.getOtherOrganSelect`)(ids).then(res => {
				this.otherOrganList = res
				return Promise.resolve(res)
			})
		},
		getCurrentUser () {
			return this.$fxApi(`${apiName}.getCurrentUser`)
		},
		getDepartmentList (organDetails) {
			if (!organDetails || !organDetails.organ.id) {
				return Promise.resolve()
			} else {
				const ids = organDetails && organDetails.department.id ? [organDetails.department.id] : []
				return this.$fxApi(`${apiName}.getDepartmentList`, organDetails.organ.organ.id)({ data: ids }).then(res => {
					this.departmentList = res
					return Promise.resolve(res)
				})
			}
		},
		onDialogClose () {
			this.deleteEmptyBill().then(() => {
				this.isFullScreen = false
				this.$refs.detailsInfo.clear()
				this.$emit('on-refresh', this.billDeleteFlag)
			})
		},
		deleteEmptyBill () {
			if (this.organDetails.id && this.tableDetails.length === 0) {
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
				const typeName = this.getNameById(this.organDetails.billType, this.billTypeSelect)
				let logger = this.$fxLogger.createInfo('financial-manage.capital-manage.payable-order.add', { orderData: this.organDetails, type: typeName })
				return this.$fxApi(`${apiName}.add`)({ data: this.organDetails }).then(res => {
					this.organDetails.id = res.id || ''
					this.organDetails.sysBillCode = res.sysBillCode || ''
					this.organDetails.createMan = res.createMan || ''
					this.organDetails.createDate = res.createDate || ''
					this.fxDataVerification.resetData(this.organDetails)
					logger = this.$fxLogger.createInfo('financial-manage.capital-manage.payable-order.add', { orderData: this.organDetails, type: typeName })
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
					const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.payable-order.update', this.createLoggerParams())
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
			const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.payable-order.delete', { orderData: this.organDetails })
			return this.$fxApi(`${apiName}.delete`, this.organDetails.id)({ logger }).then(() => {
				this.billDeleteFlag = true
				this.dialogVisible = false
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
		onBeforeClose (close) {
			this.verificationDetails().then(() => {
				this.clearValidate()
				close()
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
		onBuyerSubmitClick () {
			if (this.tableDetails.length === 0) {
				return this.$fxMessage.warning('无明细不允许提交，请添加明细')
			}
			return this.beforeAction('是否确定提交？').then(() => {
				return this.onBuyerSubmitHandler()
			})
		},
		onBuyerSubmitHandler () {
			const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.payable-order.submit', { orderData: this.organDetails })
			return this.$fxApi(`${apiName}.submit`, this.organDetails.id)({ logger }).then(this.updateOrganDetails)
		},
		onBuyerReturnClick () {
			return this.$fxConfirm('是否确定退回？').then(() => {
				const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.payable-order.return', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.return`, this.organDetails.id)({ logger }).then(this.updateOrganDetails)
			})
		},
		onBuyerCheckClick () {
			if (this.tableDetails.length === 0) {
				return this.$fxMessage.warning('无明细不允许审核，请添加明细')
			}
			return this.beforeAction('是否确定审核？').then(() => {
				return this.onBuyerCheckHandler()
			})
		},
		onBuyerCheckHandler () {
			const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.payable-order.check', { orderData: this.organDetails })
			return this.$fxApi(`${apiName}.check`, this.organDetails.id)({ logger }).then(this.updateOrganDetails)
		},
		onBuyerUncheckClick () {
			return this.$fxConfirm('是否确定反审？').then(() => {
				const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.payable-order.uncheck', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.uncheck`, this.organDetails.id)({ logger }).then(this.updateOrganDetails)
			})
		},
		onBuyerRecheckClick () {
			return this.$fxConfirm('是否确定复审？').then(() => {
				const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.payable-order.recheck', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.recheck`, this.organDetails.id)({ logger }).then(this.updateOrganDetails)
			})
		},
		onBuyerUnrecheckClick () {
			return this.$fxConfirm('是否确定取消复审？').then(() => {
				const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.payable-order.unrecheck', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.unrecheck`, this.organDetails.id)({ logger }).then(this.updateOrganDetails)
			})
		},
		onPushDownClick () {
			return this.$fxConfirm('是否确定下推？').then(() => {
				const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.payable-order.pushdown', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.pushdown`, this.organDetails.id)({ logger }).then(this.updateOrganDetails)
			})
		},
		updateOrganDetails () {
			return this.getOrganDetails(this.organDetails.id)
		},
		clearValidate () {
			this.$refs.basicInfo.$refs.form.clearValidate()
		},
		goToBillBlank () {
			const id = this.organDetails.parentBill.id
			const type = this.organDetails.parentBill.billClass
			this.$fxGoToBillBlank(type, { id })
		},
		exportData () {
			// this.onSaveClick().then(() => {
			// 	if (this.tableDetails.length < 1) {
			// 		this.$fxMessage.warning('当前无明细，不允许导出！')
			// 		return false
			// 	} else {
			// 		const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.payable-order.exportData', { orderData: this.organDetails })
			// 		return this.$fxApi(`${apiName}.exportData`, this.organDetails.id)({ logger }).then(res => {
			// 			this.$fxUtils.downloadFile(res)
			// 		})
			// 	}
			// })
		},
		onPrintClick () {
			// this.$fxGoPrint('InStore', this.organDetails.id)
		},
		onBillChange (type) {
			if (this.isDisable) {
				this.tableQueueUtils.billChange(type)
			} else {
				this.$refs.detailsInfo.checkDetailsUnSaving().then(() => {
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
			// 		billClass: 'PayableBill',
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
