<template>
	<w-dialog
		v-model="dialogVisible"
		title="财务出库单详情"
		fullscreen
		:beforeClose="onBeforeClose"
		:moreBtnOption="moreBtnOption"
		:billChainOption="billChainOption"
		:titleClass="billSignClass"
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
					:isFullScreen="isFullScreen"
					:visibleFlag="dialogVisible"
					:organDetails="organDetails"
          :disabled="isDisable || authDisabled"
				></basicInfo>
				<detailsInfo
					ref="detailsInfo"
					:organDetails="organDetails"
					:tableDetails="tableDetails"
					:isFullScreen.sync="isFullScreen"
					:disabled="isDisable || authDisabled"
				></detailsInfo>
			</w-scroll-bar>
		</div>
		<template slot="parentBill">
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
				v-fx-tab:loop.financial-manage_financial-in-store_details.refreshBtn
				@click="onRefresh"
			>刷新</fx-button>
			<fx-details-queue-tools
				ref="queueTools"
				v-fx-tab:loop.financial-manage_financial-in-store_details.queueTools
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
				v-fx-tab:loop.financial-manage_financial-out-store_details.cancelBtn
				@click="onCancelClick"
			>取消</fx-button>
			<fx-button
				ref="saveBtn"
				type="save"
				v-fx-auth:store-manage_in-store-order.edit-instore="isUnSubmit"
				v-fx-tab:loop.financial-manage_financial-out-store_details.saveBtn
				@click="onSaveClick"
			>保存</fx-button>
			<fx-button
				ref="submitBtn"
				type="submit"
				v-fx-auth:store-manage_in-store-order.submit-instore="isUnSubmit"
				v-fx-tab:loop.financial-manage_financial-out-store_details.submitBtn
				@click="onBuyerSubmitClick"
			>提交</fx-button>
			<fx-button
				ref="returnBtn"
				type="return"
				v-fx-auth:store-manage_in-store-order.back-instore="showReturnBtn"
				v-fx-tab:loop.financial-manage_financial-out-store_details.returnBtn
				@click="onBuyerReturnClick"
			>退回</fx-button>
			<fx-button
				ref="checkBtn"
				type="check"
				v-fx-auth:store-manage_in-store-order.check-instore="showCheckBtn"
				v-fx-tab:loop.financial-manage_financial-out-store_details.checkBtn
				@click="onBuyerCheckClick"
			>审核</fx-button>
			<fx-button
				ref="uncheckBtn"
				type="uncheck"
				v-fx-auth:store-manage_in-store-order.uncheck-instore="showUncheckBtn"
				v-fx-tab:loop.financial-manage_financial-out-store_details.uncheckBtn
				@click="onBuyerUncheckClick"
			>反审</fx-button>
			<fx-button
				ref="recheckBtn"
				type="recheck"
				v-fx-auth:store-manage_in-store-order.recheck-instore="showRecheckBtn"
				v-fx-tab:loop.financial-manage_financial-out-store_details.recheckBtn
				@click="onBuyerRecheckClick"
			>复审</fx-button>
			<fx-button
				ref="unrecheckBtn"
				type="unrecheck"
				v-fx-auth:store-manage_in-store-order.unrecheck-instore="showUnrecheckBtn"
				v-fx-tab:loop.financial-manage_financial-out-store_details.unrecheckBtn
				@click="onBuyerUnrecheckClick"
			>取消复审</fx-button>
			<!-- <w-popover
				v-model="btnPopperVisible"
				placement="bottom"
				trigger="click"
				popper-class="details-info__btn-popper"
			>
				<fx-button
					ref="pushDownBtn"
					type="primary"
					class="pushdown-btn"
					slot="reference"
					v-fx-auth:store-manage_in-store-order.recheck-instore="showPushDownBtn"
					v-fx-tab:loop.financial-manage_financial-out-store_details.pushDownBtn
				>下推</fx-button>
				<div class="btn-popper-container">
					<fx-button
						class="popper-btn"
						type="primary"
						@click="onEstimationPayableClick"
					>暂估应付单</fx-button>
					<fx-button
						v-if="isCurMonth"
						class="popper-btn"
						type="primary"
						@click="onStandardPayableClick"
					>标准应付单</fx-button>
				</div>
			</w-popover> -->
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
import { apiName } from '../../Index.vue'
export default {
	name: 'createOrder',
	components: {
		basicInfo,
		detailsInfo
	},
	data () {
		return {
			dialogVisible: false,
			organDetails: {},
			tableDetails: [],
			isFullScreen: false,
			showBillQueue: false,
			billChainData: {},
			billDeleteFlag: false,
			btnPopperVisible: false,
			fxDataVerification: this.$fxUtils.fxDataVerification()
		}
	},
	props: {
		tableQueueUtils: null
	},
	computed: {
		...mapGetters(['detailsAuthGetter']),
		isDisable () {
			return !this.isUnSubmit
		},
		isUnSubmit () {
			return this.isState(['unSubmit'])
		},
		isCurMonth () {
			return (new Date()).getFullYear() === (new Date(this.organDetails.businessDate)).getFullYear() &&
			(new Date()).getMonth() + 1 === (new Date(this.organDetails.businessDate)).getMonth() + 1
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
				return this.$fxStateMiddleware.isState('financialOrderState')(type)(this.organDetails.billState)
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
			return this.isState(['checked']) && this.currentState.type !== 'rechecked'
		},
		showRecheckBtn () {
			return this.isState(['checked']) && this.currentState.type !== 'rechecked'
		},
		showPushDownBtn () {
			return this.isState(['checked', 'rechecked'])
		},
		showUnrecheckBtn () {
			return this.currentState.type === 'rechecked'
		},
		moreBtnOption () {
			return [{
				show: !this.isAdd && this.isUnSubmit && this.detailsAuthGetter('store-manage_in-store-order.delete-instore'),
				label: '删除',
				icon: 'delete-trash',
				click: this.onDeleteClick
			// }, {
			// 	show: this.detailsAuthGetter('store-manage_in-store-order.export-instore|export-blank'),
			// 	label: '导出Excel',
			// 	icon: 'export-excel',
			// 	children: [{
			// 		show: this.detailsAuthGetter('store-manage_in-store-order.export-instore'),
			// 		label: '导出明细数据',
			// 		icon: 'export-data',
			// 		click: this.exportData
			// 	}]
			// }, {
			// 	show: this.detailsAuthGetter('store-manage_in-store-order.print-instore'),
			// 	label: '打印',
			// 	icon: 'print',
			// 	click: this.onPrintClick
			}]
		},
		billSignClass () {
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
		billChainOption () {
			return {
				show: true,
				click: this.onBillChainClick
			}
		}
	},
	created () {
		this.$fxTabkey.init('financial-manage_financial-out-store_details', this)
	},
	methods: {
		edit (id, showBillQueue = true) {
			this.getOrganDetails(id).then(() => {
				this.fxDataVerification.resetData(this.organDetails)
				this.showBillQueue = showBillQueue
				this.billDeleteFlag = false
				this.dialogVisible = true
				this.$nextTick(() => {
					if (this.isDisable || this.authDisabled) {
						this.$fxUtils.vDoRefFocus(this, 'refreshBtn')
					} else {
						this.$fxUtils.vDoRefFocus(this, 'cancelBtn')
					}
				})
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
		onDialogClose () {
			this.isFullScreen = false
			this.$emit('on-refresh', this.billDeleteFlag)
		},
		onRefresh () {
			this.verificationDetails('当前页面存在未保存数据，是否确定刷新操作？').then(() => {
				this.edit(this.organDetails.id, this.showBillQueue)
			})
		},
		onSaveClick () {
			return this.$refs.detailsInfo.checkDetailsUnSaving().then(() => {
				if (this.fxDataVerification.checkData(this.organDetails)) {
					this.$fxMessage.success('保存成功')
				} else {
					return this.onSaveClickHandler()
				}
			})
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
			const logger = this.$fxLogger.createInfo('financial-manage.inventory-accounting.financial-out-store.delete', { orderData: this.organDetails })
			return this.$fxApi(`${apiName}.delete`, this.organDetails.id)({ logger }).then(() => {
				this.billDeleteFlag = true
				this.dialogVisible = false
				return Promise.resolve()
			})
		},
		verificationDetails (message = '当前页面存在未保存数据，是否确定取消并退出操作？') {
			return new Promise(resolve => {
				if (this.$refs.detailsInfo.isRowEditing()) {
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
		onDetailsRefresh () {
			return this.getOrganDetails(this.organDetails.id)
		},
		beforeAction (message) {
			return this.$fxConfirm(message).then(() => {
				return this.$refs.detailsInfo.checkDetailsUnSaving().then(this.onSaveClickHandler)
			})
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
		onSaveClickHandler () {
			return this.onValidateFormData().then(this.onSaveHandler)
		},
		onSaveHandler () {
			if (this.fxDataVerification.checkData(this.organDetails)) {
				return Promise.resolve(this.organDetails)
			} else {
				const logger = this.$fxLogger.createInfo('financial-manage.inventory-accounting.financial-out-store.update', this.createLoggerParams())
				return this.$fxApi(`${apiName}.edit`, this.organDetails.id)({ data: this.organDetails, logger }).then(res => {
					this.fxDataVerification.resetData(this.organDetails)
					return Promise.resolve(res)
				})
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
		onBuyerSubmitClick () {
			return this.beforeAction('是否确定提交？').then(this.onBuyerSubmitHandler)
		},
		onBuyerSubmitHandler () {
			const logger = this.$fxLogger.createInfo('financial-manage.inventory-accounting.financial-out-store.submit', { orderData: this.organDetails })
			return this.$fxApi(`${apiName}.submit`, this.organDetails.id)({ logger }).then(this.updateOrganDetails)
		},
		onBuyerReturnClick () {
			return this.$fxConfirm('是否确定退回？').then(() => {
				const logger = this.$fxLogger.createInfo('financial-manage.inventory-accounting.financial-out-store.return', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.return`, this.organDetails.id)({ logger }).then(this.updateOrganDetails)
			})
		},
		onBuyerCheckClick () {
			return this.beforeAction('是否确定审核？').then(this.onBuyerCheckHandler)
		},
		onBuyerCheckHandler () {
			const logger = this.$fxLogger.createInfo('financial-manage.inventory-accounting.financial-out-store.check', { orderData: this.organDetails })
			return this.$fxApi(`${apiName}.check`, this.organDetails.id)({ logger }).then(this.updateOrganDetails)
		},
		onBuyerUncheckClick () {
			return this.$fxConfirm('是否确定反审？').then(() => {
				const logger = this.$fxLogger.createInfo('financial-manage.inventory-accounting.financial-out-store.uncheck', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.uncheck`, this.organDetails.id)({ logger }).then(this.updateOrganDetails)
			})
		},
		onBuyerRecheckClick () {
			return this.$fxConfirm('是否确定复审？').then(() => {
				const logger = this.$fxLogger.createInfo('financial-manage.inventory-accounting.financial-out-store.recheck', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.recheck`, this.organDetails.id)({ logger }).then(this.updateOrganDetails)
			})
		},
		onBuyerUnrecheckClick () {
			return this.$fxConfirm('是否确定取消复审？').then(() => {
				const logger = this.$fxLogger.createInfo('financial-manage.inventory-accounting.financial-out-store.unrecheck', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.unrecheck`, this.organDetails.id)({ logger }).then(this.updateOrganDetails)
			})
		},
		onEstimationPayableClick () {
			return this.$fxConfirm('是否确定下推？').then(() => {
				const logger = this.$fxLogger.createInfo('financial-manage.inventory-accounting.financial-out-store.pushDownEstimationPayable', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.pushDownEstimationPayable`, this.organDetails.id)({ logger }).then(this.updateOrganDetails)
			})
		},
		onStandardPayableClick () {
			return this.$fxConfirm('是否确定下推？').then(() => {
				const logger = this.$fxLogger.createInfo('financial-manage.inventory-accounting.financial-out-store.pushDownStandardPayable', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.pushDownStandardPayable`, this.organDetails.id)({ logger }).then(this.updateOrganDetails)
			})
		},
		updateOrganDetails () {
			return this.getOrganDetails(this.organDetails.id)
		},
		goToBillBlank () {
			const id = this.organDetails.parentBill.id
			const type = this.organDetails.parentBill.billClass
			this.$fxGoToBillBlank(type, { id }, 'detail')
		},
		exportData () {
			// this.onSaveClick().then(() => {
			// 	if (this.tableDetails.length < 1) {
			// 		this.$fxMessage.warning('当前无明细，不允许导出！')
			// 		return false
			// 	} else {
			// 		const logger = this.$fxLogger.createInfo('financial-manage.inventory-accounting.financial-in-store.exportData', { orderData: this.organDetails })
			// 		const id = this.organDetails.id
			// 		return this.$fxApi(`${apiName}.exportData`, id)({ logger }).then(res => {
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
					this.tableQueueUtils.billChange(type)
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
			// 		billClass: 'CWInStoreBill',
			// 		currentBill: true
			// 	}
			// 	this.$refs.billChain.open(billData)
			// })
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
.details-info__btn-popper {
	.btn-popper-container {
		display: flex
		flex-direction: column
		.popper-btn {
			margin-top: 10px
			margin-left: 0px
		}
	}
}
.pushdown-btn{
	margin-left: 10px
}
</style>
