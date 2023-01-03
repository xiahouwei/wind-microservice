<template>
	<fx-bill-container
		title="理论耗用单详情"
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
					:agentSelectList.sync="agentSelectList"
					:disabled="basicInfoDisabled"
					:billBizTypeList.sync='billBizTypeList'
				></basicInfo>
				<detailsInfo
					ref="detailsInfo"
					:organDetails="organDetails"
					:tableDetails="tableDetails"
					:isFullScreen.sync="isFullScreen"
					:fSaveMain="onSaveClickHandler"
					:disabled="detailsInfoDisabled"
					@on-details-refresh="getDetails"
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
				v-fx-tab:loop.business-data_theory-cost-order_details.refreshBtn
				@click="onRefresh"
			>刷新</fx-button>
		</template>
		<template slot="footer-right">
			<el-button
				ref="cancelBtn"
				v-fx-tab:loop.business-data_theory-cost-order_details.cancelBtn
				@click="onCancelClick"
			>取消</el-button>
			<fx-button
				ref="saveBtn"
				type="save"
				v-fx-auth:cost-manage_theory-cost-order.edit-bill="isState(['unSubmit'])"
				v-fx-tab:loop.business-data_theory-cost-order_details.saveBtn
				@click="onSaveClick"
			>保存</fx-button>
			<fx-button
				ref="submitBtn"
				type="submit"
				v-fx-auth:cost-manage_theory-cost-order.submit-bill="isState(['unSubmit'])"
				v-fx-tab:loop.business-data_theory-cost-order_details.submitBtn
				@click="onBuyerSubmitClick"
			>提交</fx-button>
			<fx-button
				ref="returnBtn"
				type="return"
				v-fx-auth:cost-manage_theory-cost-order.return-bill="isState(['unChecked'])"
				v-fx-tab:loop.business-data_theory-cost-order_details.returnBtn
				@click="onBuyerReturnClick"
			>退回</fx-button>
			<fx-button
				ref="checkBtn"
				type="check"
				v-fx-auth:cost-manage_theory-cost-order.check-bill="isState(['unSubmit', 'unChecked'])"
				v-fx-tab:loop.business-data_theory-cost-order_details.checkBtn
				@click="onBuyerCheckClick"
			>审核</fx-button>
			<fx-button
				ref="uncheckBtn"
				type="uncheck"
				v-fx-auth:cost-manage_theory-cost-order.uncheck-bill="showUncheckBtn"
				v-fx-tab:loop.business-data_theory-cost-order_details.uncheckBtn
				@click="onBuyerUncheckClick"
			>反审</fx-button>
			<fx-button
				ref="recheckBtn"
				type="recheck"
				v-fx-auth:cost-manage_theory-cost-order.recheck-bill="showRecheckBtn"
				v-fx-tab:loop.business-data_theory-cost-order_details.recheckBtn
				@click="onBuyerRecheckClick"
			>复审</fx-button>
			<fx-button
				ref="unrecheckBtn"
				type="unrecheck"
				v-fx-auth:cost-manage_theory-cost-order.unrecheck-bill="showUnrecheckBtn"
				v-fx-tab:loop.business-data_theory-cost-order_details.unrecheckBtn
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
import appendInfo from './AppendInfo.vue'
import { apiName } from '../../Index.vue'
export default {
	name: 'createOrgan',
	components: {
		basicInfo,
		detailsInfo,
		appendInfo
	},
	data () {
		return {
			organDetails: {
				organ: {},
				outHouse: {},
				operateMan: {}
			},
			tableDetails: [],
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			isFullScreen: false,
			agentSelectList: [],
			billBizTypeList: [],
			fxCache: this.$fxUtils.fxCache('theory-cost'),
			billChainData: {}
		}
	},
	computed: {
		...mapGetters(['detailsAuthGetter']),
		isChecked () {
			return this.$fxStateMiddleware.isState('billState')(['checked'])(this.organDetails.billState)
		},
		isDisable () {
			return this.$fxStateMiddleware.isState('billState')(['unChecked', 'checked', 'deleted'])(this.organDetails.billState)
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
			return this.isState(['checked']) && this.currentState.type !== 'rechecked'
		},
		showRecheckBtn () {
			return this.isState(['checked']) && this.currentState.type !== 'rechecked'
		},
		showUnrecheckBtn () {
			return this.currentState.type === 'rechecked'
		},
		moreBtnOption () {
			return [{
				show: this.detailsAuthGetter('cost-manage_theory-cost-order.export-bill'),
				label: '导出Excel',
				icon: 'export-excel',
				children: [{
					show: this.detailsAuthGetter('cost-manage_theory-cost-order.export-bill'),
					label: '导出明细数据',
					icon: 'export-data',
					click: this.exportData
				}]
			}, {
				show: this.detailsAuthGetter('cost-manage_theory-cost-order.print-bill'),
				label: '打印',
				icon: 'print',
				click: this.onPrintClick
			}, {
				show: this.detailsAuthGetter('cost-manage_theory-cost-order.del-bill'),
				label: '删除',
				icon: 'delete-trash',
				click: this.onDeleteClick
			}]
		},
		billChainOption () {
			return {
				show: true,
				click: this.onBillChainClick
			}
		},
		detailsInfoDisabled () {
			return !(this.isState(['unSubmit']) && this.detailsAuthGetter('cost-manage_theory-cost-order.edit-bill'))
		},
		basicInfoDisabled () {
			return !(this.isState(['unSubmit']) && this.detailsAuthGetter('cost-manage_theory-cost-order.edit-bill'))
		}
	},
	created () {
		this.$fxTabkey.init('business-data_theory-cost-order_details', this)
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
			this.fxCache.clear()
			this.agentSelectList = [organDetails.operateMan]
			this.billBizTypeList = organDetails.billBizTypeId ? [organDetails.billBizType] : []
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
		getDetails () {
			return this.$fxApi(`${apiName}.getDetails`, this.organDetails.id).then(res => {
				this.tableDetails = res
				return Promise.resolve(res)
			})
		},
		onRefreshOrganDetails (res) {
			if (!('outHouse' in res)) {
				res.outHouse = {}
			}
			this.tableDetails = res.details
			delete res.details
			this.organDetails = res
			this.fxDataVerification.resetData(this.organDetails)
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
				const logger = this.$fxLogger.createInfo('cost-manage.theory-cost-order.update', this.createLoggerParams())
				return this.$fxApi(`${apiName}.edit`, this.organDetails.id)({ data: this.organDetails, logger }).then(res => {
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
		onDeleteClick () {
			this.$fxConfirm('是否确定删除当前单据？')
				.then(this.onDeleteHandler)
				.then(this.onCancelClick)
		},
		onDeleteHandler () {
			const logger = this.$fxLogger.createInfo('cost-manage.theory-cost-order.delete', { orderData: this.organDetails })
			return this.$fxApi(`${apiName}.delete`, this.organDetails.id)({ logger }).then(() => {
				this.fxDataVerification.resetData(this.organDetails)
				return Promise.resolve()
			})
		},
		onRefresh () {
			this.verificationDetails('当前页面存在未保存数据，是否确定刷新操作？').then(() => {
				this.edit(this.organDetails.id)
			})
		},
		getOrganDetails (id) {
			return this.$fxApi(`${apiName}.getBill`, id)
		},
		verificationDetails (message) {
			return this.fxDataVerification.checkComfirm(this.organDetails, message)
		},
		beforeAction (message) {
			return this.$fxConfirm(message).then(() => {
				return this.$refs.detailsInfo.checkDetailsUnSaving().then(this.onSaveClickHandler)
			})
		},
		onBuyerSubmitClick () {
			return this.beforeAction('是否确定提交？').then(() => {
				return this.onBuyerSubmitHandler()
			})
		},
		onBuyerSubmitHandler () {
			const logger = this.$fxLogger.createInfo('cost-manage.theory-cost-order.submit', { orderData: this.organDetails })
			return this.$fxApi(`${apiName}.submit`, this.organDetails.id)({ logger }).then(res => {
				this.onRefreshOrganDetails(res)
				return Promise.resolve()
			})
		},
		onBuyerReturnClick () {
			return this.$fxConfirm('是否确定退回？').then(() => {
				const logger = this.$fxLogger.createInfo('cost-manage.theory-cost-order.return', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.return`, this.organDetails.id)({ logger }).then(res => {
					this.onRefreshOrganDetails(res)
					return Promise.resolve()
				})
			})
		},
		onBuyerCheckClick () {
			return this.beforeAction('是否确定审核？').then(() => {
				return this.onBuyerCheckHandler()
			})
		},
		onBuyerCheckHandler () {
			const logger = this.$fxLogger.createInfo('cost-manage.theory-cost-order.check', { orderData: this.organDetails })
			return this.$fxApi(`${apiName}.check`, this.organDetails.id)({ logger }).then(res => {
				this.onRefreshOrganDetails(res)
				return Promise.resolve()
			})
		},
		onBuyerUncheckClick () {
			return this.$fxConfirm('是否确定反审？').then(() => {
				const logger = this.$fxLogger.createInfo('cost-manage.theory-cost-order.uncheck', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.uncheck`, this.organDetails.id)({ logger }).then(res => {
					this.onRefreshOrganDetails(res)
					return Promise.resolve()
				})
			})
		},
		onBuyerRecheckClick () {
			return this.$fxConfirm('是否确定复审？').then(() => {
				const logger = this.$fxLogger.createInfo('cost-manage.theory-cost-order.recheck', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.recheck`, this.organDetails.id)({ logger }).then(res => {
					this.onRefreshOrganDetails(res)
					return Promise.resolve()
				})
			})
		},
		onBuyerUnrecheckClick () {
			return this.$fxConfirm('是否确定取消复审？').then(() => {
				const logger = this.$fxLogger.createInfo('cost-manage.theory-cost-order.unrecheck', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.unrecheck`, this.organDetails.id)({ logger }).then(res => {
					this.onRefreshOrganDetails(res)
					return Promise.resolve()
				})
			})
		},
		goToBillBlank () {
			const id = this.organDetails.parentBill.id
			const type = this.organDetails.parentBill.billClass
			this.$fxGoToBillBlank(type, { id }, 'detail')
		},
		exportData () {
			this.onSaveClick().then(() => {
				const logger = this.$fxLogger.createInfo('cost-manage.theory-cost-order.exportData', { orderData: this.organDetails })
				const id = this.organDetails.id
				return this.$fxApi(`${apiName}.exportData`, id)({ logger }).then(res => {
					this.$fxUtils.downloadFile(res)
				})
			})
		},
		onPrintClick () {
			this.$fxGoPrint('TheoryExpend', this.organDetails.id)
		},
		onBillChainClick () {
			return this.$fxApi(`${apiName}.getBillChain`, this.organDetails.id).then(res => {
				this.billChainData = res
				const billData = {
					businessDate: this.organDetails.businessDate,
					sysBillCode: this.organDetails.sysBillCode,
					billState: this.organDetails.billState,
					id: this.organDetails.id,
					billClass: 'TheoryExpend',
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
