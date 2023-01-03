<template>
	<fx-bill-container
		title="菜品营业单据"
		:moreBtnOption="moreBtnOption"
		:billChainOption="billChainOption"
	>
		<template slot="sub">
			<fx-details-state-tag :label="currentState.label" :icon="currentState.icon"></fx-details-state-tag>
			<fx-details-state-tag :label="offsetState.label" :icon="offsetState.icon"></fx-details-state-tag>
		</template>
		<div class="create-organ">
			<w-scroll-bar :flex="isFullScreen">
				<basicInfo
					v-show="!isFullScreen"
					ref="basicInfo"
					:isFullScreen="isFullScreen"
					:organDetails="organDetails"
					:tableDetails="tableDetails"
					:agentSelectList="agentSelectList"
					:disabled="basicInfoDisabled"
					:billBizTypeList='billBizTypeList'
					@on-refresh-bussiness-type-list='getBillBizTypeSelect'
				></basicInfo>
				<detailsInfo
					ref="detailsInfo"
					:organDetails="organDetails"
					:tableDetails="tableDetails"
					:isFullScreen.sync="isFullScreen"
					:fSaveMain="onSaveClickHandler"
					:disabled="billDisabled"
					:selectedRows="selectedRows"
					@on-details-refresh="onItemDetailsRefresh"
				></detailsInfo>
				<appendInfo
					v-show="!isFullScreen"
					:isFullScreen="isFullScreen"
					:organDetails="organDetails"
					:disabled="!isState(['unSubmit'])"
				></appendInfo>
			</w-scroll-bar>
		</div>
		<template slot="parentBill">
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
				v-fx-tab:loop.business-data_food-business-order_details.refreshBtn
				@click="onRefresh"
			>刷新</fx-button>
		</template>
		<template slot="footer-right">
			<el-button
				ref="cancelBtn"
				v-fx-tab:loop.business-data_food-business-order_details.cancelBtn
				@click="onCancelClick"
			>取消</el-button>
			<fx-button
				ref="saveBtn"
				type="save"
				v-fx-auth:cost-manage_food-business-order.edit-bill="isState(['unSubmit'])"
				v-fx-tab:loop.business-data_food-business-order_details.saveBtn
				@click="onSaveClick"
			>保存</fx-button>
			<fx-button
				ref="submitBtn"
				type="submit"
				v-fx-auth:cost-manage_food-business-order.submit-bill="isState(['unSubmit'])"
				v-fx-tab:loop.business-data_food-business-order_details.submitBtn
				@click="onSubmitClick"
			>提交</fx-button>
			<fx-button
				ref="returnBtn"
				type="return"
				v-fx-auth:cost-manage_food-business-order.return-bill="isState(['unChecked'])"
				v-fx-tab:loop.business-data_food-business-order_details.returnBtn
				@click="onReturnClick"
			>退回</fx-button>
			<fx-button
				ref="checkBtn"
				type="check"
				v-fx-auth:cost-manage_food-business-order.check-bill="isState(['unSubmit', 'unChecked'])"
				v-fx-tab:loop.business-data_food-business-order_details.checkBtn
				@click="onCheckClick"
			>审核</fx-button>
			<fx-button
				ref="uncheckBtn"
				type="uncheck"
				v-fx-auth:cost-manage_food-business-order.uncheck-bill="isState(['checked'])"
				v-fx-tab:loop.business-data_food-business-order_details.uncheckBtn
				@click="onUncheckClick"
			>反审</fx-button>
		</template>
		<fx-bill-chain
			ref="billChain"
			:billChainData="billChainData"
		>
		</fx-bill-chain>
		<uncheck-order-info ref="uncheckOrderInfo" billType="BusinessOrder"></uncheck-order-info>
	</fx-bill-container>
</template>
<script>
import { mapGetters } from 'vuex'
import basicInfo from './BasicInfo.vue'
import detailsInfo from './DetailsInfo.vue'
import appendInfo from './AppendInfo.vue'
import uncheckOrderInfo from '@/components/common/Fx-uncheck-order-info.vue'
import { apiName } from '../../Index.vue'
export default {
	name: 'createOrgan',
	components: {
		basicInfo,
		detailsInfo,
		appendInfo,
		uncheckOrderInfo
	},
	data () {
		return {
			organDetails: {
				organ: {},
				salesRegion: {},
				operateMan: {}
			},
			tableDetails: [],
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			isFullScreen: false,
			agentSelectList: [],
			billBizTypeList: [],
			selectedRows: [],
			billChainData: {}
		}
	},
	computed: {
		...mapGetters(['detailsAuthGetter']),
		currentState () {
			return this.$fxStateMiddleware.getOrderStateById(this.organDetails.billState, this.organDetails.recheckState)
		},
		offsetState () {
			return this.$fxStateMiddleware.getStateObj('billOffsetState')(this.organDetails.offsetState)
		},
		isState () {
			return (type) => {
				return this.$fxStateMiddleware.isState('billState')(type)(this.organDetails.billState)
			}
		},
		moreBtnOption () {
			return [{
				label: '冲减',
				icon: 'print',
				show: this.showOffsetBtn,
				click: this.onOffsetClick
			}, {
				show: this.detailsAuthGetter('cost-manage_food-business-order.export-bill'),
				label: '导出Excel',
				icon: 'export-excel',
				children: [{
					show: this.detailsAuthGetter('cost-manage_food-business-order.export-bill'),
					label: '导出明细数据',
					icon: 'export-data',
					click: this.exportData
				}]
			}, {
				show: this.detailsAuthGetter('cost-manage_food-business-order.print-bill'),
				label: '打印',
				icon: 'print',
				click: this.onPrintClick
			}]
		},
		showOffsetBtn () {
			return this.organDetails.offsetState !== 1 && this.currentState.label === '已审核' &&
				this.detailsAuthGetter('cost-manage_food-business-order.offset-bill')
		},
		hasParentBill () {
			return !!this.organDetails.parentBill
		},
		billChainOption () {
			return {
				show: true,
				click: this.onBillChainClick
			}
		},
		billDisabled () {
			return !(this.isState(['unSubmit']) && this.detailsAuthGetter('cost-manage_food-business-order.edit-bill'))
		},
		basicInfoDisabled () {
			return !(this.isState(['unSubmit']) && this.detailsAuthGetter('cost-manage_food-business-order.edit-bill'))
		}
	},
	created () {
		this.$fxTabkey.init('business-data_food-business-order_details', this)
		this.initBill()
		this.bindTabBeforeDeactivated()
	},
	methods: {
		initBill () {
			if (this.$route.query.openType === 'edit') {
				this.edit(this.$route.query.id)
			}
		},
		bindTabBeforeDeactivated () {
			this.$fxAppTabs.onTabBeforeDeactivated(() => {
				return this.verificationDetails()
			}, this)
		},
		async edit (id) {
			const organDetails = await this.getOrganDetails(id)
			this.$fxAppTabs.setTabTitle({ sysBillCode: organDetails.sysBillCode })
			await this.getListData(organDetails)
			this.tableDetails = organDetails.details
			delete organDetails.details
			this.organDetails = organDetails
			this.fxDataVerification.resetData(this.organDetails)
			this.$nextTick(() => {
				if (!this.isState(['unSubmit'])) {
					this.$fxUtils.vDoRefFocus(this, 'refreshBtn')
				} else {
					this.$refs.basicInfo.defaultFocus()
				}
			})
		},
		async getListData (organDetails) {
			return Promise.all([
				this.getBillBizTypeSelect(organDetails),
				this.getAgentList(organDetails)
			]).then(([userData]) => {
				return Promise.resolve(userData)
			})
		},
		getOrganDetails (id) {
			return this.$fxApi(`${apiName}.getBill`, id)
		},
		getDetails () {
			return this.$fxApi(`${apiName}.getBill`, this.organDetails.id).then(res => {
				this.tableDetails = res.details
				return Promise.resolve(res)
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
			const data = organDetails.billBizTypeId ? [organDetails.billBizTypeId] : []
			this.$fxApi(`${apiName}.getBillDetailBizTypeSelect`, organDetails.billType)({ data }).then(res => {
				this.billBizTypeList = res
				return Promise.resolve(res)
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
			if (this.fxDataVerification.checkData(this.organDetails)) {
				return Promise.resolve(this.organDetails)
			} else {
				const logger = this.$fxLogger.createInfo('cost-manage.food-business.update', this.createLoggerParams())
				return this.$fxApi(`${apiName}.edit`, this.organDetails.id)({ data: this.organDetails, logger }).then(res => {
					this.getBillBizTypeSelect(this.organDetails)
					this.fxDataVerification.resetData(this.organDetails)
					return Promise.resolve(res)
				})
			}
		},
		createLoggerParams () {
			const originData = this.fxDataVerification.getOriginData()
			originData.billBizTypeName = this.getNameById(originData.billBizTypeId, this.billBizTypeList)
			originData.operatorName = this.getNameById(originData.operateMan.id, this.agentSelectList)
			const organDetails = this.$fxUtils.deepClone(this.organDetails)
			organDetails.billBizTypeName = this.getNameById(organDetails.billBizTypeId, this.billBizTypeList)
			organDetails.operatorName = this.getNameById(organDetails.operateMan.id, this.agentSelectList)
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
			this.$fxAppTabs.tabsRemove()
		},
		onRefresh () {
			this.verificationDetails('当前页面存在未保存数据，是否确定刷新操作？').then(() => {
				this.edit(this.organDetails.id)
			})
		},
		verificationDetails (message) {
			return this.fxDataVerification.checkComfirm(this.organDetails, message)
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
				return this.onSubmitHandler()
			})
		},
		onSubmitHandler () {
			const logger = this.$fxLogger.createInfo('cost-manage.food-business.submit', { orderData: this.organDetails })
			return this.$fxApi(`${apiName}.submit`, this.organDetails.id)({ logger }).then((res) => {
				this.updateBillDeatil(res)
				return Promise.resolve()
			})
		},
		onReturnClick () {
			return this.$fxConfirm('是否确定退回？').then(() => {
				const logger = this.$fxLogger.createInfo('cost-manage.food-business.return', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.back`, this.organDetails.id)({ logger }).then((res) => {
					this.updateBillDeatil(res)
					return Promise.resolve()
				})
			})
		},
		onCheckClick () {
			if (this.tableDetails.length === 0) {
				return this.$fxMessage.warning('无明细不允许审核，请添加明细')
			}
			return this.beforeAction('是否确定审核？').then(() => {
				return this.onCheckHandler()
			})
		},
		onCheckHandler () {
			const logger = this.$fxLogger.createInfo('cost-manage.food-business.check', { orderData: this.organDetails })
			return this.$fxApi(`${apiName}.check`, this.organDetails.id)({ logger }).then((res) => {
				this.updateBillDeatil(res)
				return Promise.resolve()
			})
		},
		onUncheckClick () {
			return this.$fxConfirm('是否确定反审？').then(() => {
				const logger = this.$fxLogger.createInfo('cost-manage.food-business.uncheck', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.uncheck`, this.organDetails.id)({ logger }).then((res) => {
					this.updateBillDeatil(res)
					return Promise.resolve()
				}).catch(err => {
					if (err.code === 2) {
						const errMessage = this.$fxUtils.JSONparse(err.message) || []
						this.$refs.uncheckOrderInfo.open(errMessage)
					} else {
						return this.$fxMessage.error(err.message || '反审失败，请稍后再试')
					}
				})
			})
		},
		updateBillDeatil (res) {
			this.updateBillState(res)
			this.fxDataVerification.resetData(this.organDetails)
		},
		updateBillState ({ billState, recheckState, offsetState, checkMan = {}, checkDate = '' }) {
			this.organDetails.billState = billState
			this.organDetails.recheckState = recheckState
			this.organDetails.offsetState = offsetState
			this.$set(this.organDetails, 'checkMan', checkMan)
			this.$set(this.organDetails, 'checkDate', checkDate)
		},
		exportData () {
			this.onSaveClick().then(() => {
				if (this.tableDetails.length < 1) {
					this.$fxMessage.warning('当前无明细，不允许导出数据！')
					return false
				}
				const logger = this.$fxLogger.createInfo('cost-manage.food-business.exportData', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.exportData`, this.organDetails.id)({ logger }).then(res => {
					this.$fxUtils.downloadFile(res)
				})
			})
		},
		onPrintClick () {
			this.$fxGoPrint('DishBusinessBill', this.organDetails.id)
		},
		onItemDetailsRefresh (selectedRows) {
			return this.getDetails().then(res => {
				if (this.$fxUtils.isDef(selectedRows) && Array.isArray(selectedRows)) {
					this.selectedRows = selectedRows
				}
				return Promise.resolve(res)
			})
		},
		onOffsetClick () {
			return this.$fxConfirm('是否确定冲减？').then(() => {
				const logger = this.$fxLogger.createInfo('cost-manage.food-business.offset', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.offset`, this.organDetails.id)({ logger }).then((res) => {
					this.updateBillDeatil(res)
					return Promise.resolve()
				}).catch((err) => {
					if (err.code === 2) {
						const errMessage = this.$fxUtils.JSONparse(err.message) || []
						this.$refs.uncheckOrderInfo.open(errMessage)
					} else {
						return this.$fxMessage.error(err.message || '冲减失败，请稍后再试')
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
					offsetState: this.organDetails.offsetState,
					id: this.organDetails.id,
					billClass: 'DishBusinessBill',
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
</style>
