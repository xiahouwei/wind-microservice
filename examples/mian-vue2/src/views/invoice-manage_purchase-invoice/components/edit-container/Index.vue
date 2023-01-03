<template>
	<fx-bill-container
		title="发票预览"
		:moreBtnOption="moreBtnOption"
	>
		<template slot="sub">
			<fx-details-state-tag :label="currentState.label" :icon="currentState.icon"></fx-details-state-tag>
		</template>
		<div class="create-organ">
			<w-scroll-bar :flex="isFullScreen">
				<basicInfo
					v-show="!isFullScreen"
					ref="basicInfo"
					:invoiceTypeList="invoiceTypeList"
					:sellerOrganList="sellerOrganList"
					:buyerOrganList="buyerOrganList"
					:organDetails="organDetails"
					:disabled="isDisable || authDisabled"
					:accountingPeriodBeginDate.sync="accountingPeriodBeginDate"
				></basicInfo>
				<detailsInfo
					ref="detailsInfo"
					:isFullScreen.sync="isFullScreen"
					:organDetails="organDetails"
					:tableDetails="tableDetails"
					:disabled="isDisable"
				></detailsInfo>
				<otherInfo
					v-show="!isFullScreen"
					ref="otherInfo"
					:organDetails="organDetails"
					:agentSelectList="agentSelectList"
					:disabled="isDisable || authDisabled"
				></otherInfo>
			</w-scroll-bar>
		</div>
		<template slot="footer-right">
			<el-button @click="onCancelClick">取消</el-button>
			<el-button v-fx-auth:financial-manage_invoice-manage_purchase-invoice.edit-purchase-invoice="!isDisable" type="primary" @click="onSaveClick">保存</el-button>
		</template>
	</fx-bill-container>
</template>
<script>
import { mapGetters } from 'vuex'
import basicInfo from './BasicInfo.vue'
import detailsInfo from './DetailsInfo.vue'
import otherInfo from './OtherInfo.vue'
import { apiName } from '../../Index.vue'
export default {
	name: 'editContainer',
	components: {
		basicInfo,
		detailsInfo,
		otherInfo
	},
	data () {
		return {
			organDetails: {
				invoicingType: {},
				purchaseOrgan: {},
				salesOrgan: {},
				operatorMan: {}
			},
			tableDetails: [],
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			isFullScreen: false,
			invoiceTypeList: [],
			sellerOrganList: [],
			buyerOrganList: [],
			agentSelectList: [],
			accountingPeriodBeginDate: ''
		}
	},
	computed: {
		...mapGetters(['detailsAuthGetter']),
		moreBtnOption () {
			return [{
				show: this.detailsAuthGetter('financial-manage_invoice-manage_purchase-invoice.delete-purchase-invoice'),
				label: '删除',
				icon: 'delete-trash',
				click: this.onDeleteClick
			}, {
				show: !this.isDel && this.detailsAuthGetter('financial-manage_invoice-manage_purchase-invoice.print-purchase-invoice'),
				label: '打印',
				icon: 'print',
				click: this.onPrintClick
			}, {
				show: this.isDel && this.detailsAuthGetter('financial-manage_invoice-manage_purchase-invoice.recover-purchase-invoice'),
				label: '恢复',
				icon: 'refresh-grey',
				click: this.onRecoverClick
			}]
		},
		currentState () {
			return this.$fxStateMiddleware.getStateObj('invoiceState')(this.organDetails.state)
		},
		isDisable () {
			return this.$fxStateMiddleware.isState('invoiceState')(['Articulation', 'cancellation', 'redMark'])(this.organDetails.state) || !!this.organDetails.delFlag
		},
		isDel () {
			return !!this.organDetails.delFlag
		},
		authDisabled () {
			return !this.detailsAuthGetter('financial-manage_invoice-manage_purchase-invoice.edit-purchase-invoice')
		}
	},
	created () {
		this.edit(this.$route.query.id)
		this.bindTabBeforeDeactivated()
	},
	methods: {
		bindTabBeforeDeactivated () {
			this.$fxAppTabs.onTabBeforeDeactivated(() => {
				return this.verificationDetails()
			}, this)
		},
		async edit (id) {
			const organDetails = await this.getDetails(id)
			this.$fxAppTabs.setTabTitle({ invoicingCode: organDetails.invoicingCode })
			await this.initSelect(organDetails)
			this.organDetails = organDetails
			this.tableDetails = []
			this.fxDataVerification.resetData(this.organDetails)
			this.$nextTick(() => {
				this.$refs.basicInfo.defaultFocus()
			})
		},
		getDetails (id) {
			return this.$fxApi(`${apiName}.getDetails`, id)
		},
		initSelect (organDetails = {}) {
			return Promise.all([
				this.getBuyerList(organDetails),
				this.getSellerList(organDetails),
				this.getAgentList(organDetails),
				this.getInvoiceTypeList(organDetails)])
		},
		getBuyerList (organDetails) {
			const ids = organDetails.purchaseOrgan ? [organDetails.purchaseOrgan.id] : []
			return this.$fxApi(`${apiName}.getBuyerList`)({ data: { ids, names: ['Shop', 'Center'] } }).then(res => {
				this.buyerOrganList = res
			})
		},
		getSellerList (organDetails) {
			const ids = organDetails.salesOrgan ? [organDetails.salesOrgan.id] : []
			return this.$fxApi(`${apiName}.getSellerList`)({ data: { ids, names: ['Shop', 'Center', 'Supplier', 'Customer'] } }).then(res => {
				this.sellerOrganList = res
			})
		},
		getInvoiceTypeList (organDetails) {
			const namedIdList = [organDetails.invoicingType.id] || []
			return this.$fxApi(`${apiName}.getInvoiceType4List`)({ data: namedIdList }).then(res => {
				this.invoiceTypeList = res
			})
		},
		getAgentList (organDetails) {
			const params = organDetails.operatorMan ? [organDetails.operatorMan.id] : []
			return this.$fxApi(`${apiName}.getAgentList`)({ data: params }).then(res => {
				this.agentSelectList = res
			})
		},
		onSaveClick () {
			this.onValidateFormData().then(this.onSaveClickHandler)
		},
		onValidateFormData () {
			return new Promise(resolve => {
				this.$refs.basicInfo.validate().then(
					this.$refs.detailsInfo.validate
				).then(() => {
					if (this.organDetails.salesOrgan.id === this.organDetails.purchaseOrgan.id) {
						this.$fxMessage.warning('销售方与采购方不能相同')
					} else if (!this.accountingPeriodBeginDate) {
						this.$fxMessage.warning('采购方未启用会计期，不能创建发票')
					} else if (this.organDetails.invoicingDate < this.accountingPeriodBeginDate) {
						this.$fxMessage.warning('开票日期不能小于采购方的当前会计期的开始日期')
					} else {
						resolve()
					}
				}).catch(() => {
					this.$fxMessage.warning('请填写必填信息')
				})
			})
		},
		onSaveClickHandler () {
			const logger = this.$fxLogger.createInfo('financial-manage.invoice-manage.purchase-invoice.update', this.createLoggerParams())
			return this.$fxApi(`${apiName}.save`, this.organDetails.id)({ data: this.organDetails, logger }).then(res => {
				this.$fxAppTabs.setTabTitle({ invoicingCode: res.invoicingCode })
				this.getInvoiceTypeList(this.organDetails)
				this.fxDataVerification.resetData(this.organDetails)
				return Promise.resolve()
			})
		},
		createLoggerParams () {
			const originData = this.fxDataVerification.getOriginData()
			originData.invoiceTypeName = this.invoiceTypeList.find(item => item.id === originData.invoicingType.id).name
			originData.salesOrganName = this.getOrganNameById(originData.salesOrgan.id, this.sellerOrganList)
			originData.purchaseOrganName = this.getOrganNameById(originData.purchaseOrgan.id, this.buyerOrganList)
			const organDetails = this.$fxUtils.deepClone(this.organDetails)
			organDetails.invoiceTypeName = this.invoiceTypeList.find(item => item.id === organDetails.invoicingType.id).name
			organDetails.salesOrganName = this.getOrganNameById(organDetails.salesOrgan.id, this.sellerOrganList)
			organDetails.purchaseOrganName = this.getOrganNameById(organDetails.purchaseOrgan.id, this.buyerOrganList)
			return {
				pre: originData,
				cur: organDetails,
				code: organDetails.invoicingCode
			}
		},
		getOrganNameById (id, list) {
			return this.$fxUtils.getSelectTagById(id, list).name || ''
		},
		onCancelClick () {
			this.$fxAppTabs.tabsRemove()
		},
		onDeleteClick () {
			this.$fxConfirm('是否确定删除当前发票？')
				.then(this.onDeleteHandler)
				.then(this.onCancelClick)
		},
		onDeleteHandler () {
			const logger = this.$fxLogger.createInfo('financial-manage.invoice-manage.purchase-invoice.delete', { codes: this.organDetails.invoicingCode })
			return this.$fxApi(`${apiName}.del`, this.organDetails.id)({ logger }).then(res => {
				this.fxDataVerification.resetData(this.organDetails)
				return Promise.resolve()
			})
		},
		onRecoverClick () {
			this.$fxConfirm('是否确定恢复当前发票？')
				.then(this.onRecoverHandler)
				.then(this.onCancelClick)
		},
		onRecoverHandler () {
			const logger = this.$fxLogger.createInfo('financial-manage.invoice-manage.purchase-invoice.recover', { codes: this.organDetails.invoicingCode })
			return this.$fxApi(`${apiName}.restore`, this.organDetails.id)({ logger }).then(res => {
				this.fxDataVerification.resetData(this.organDetails)
				return Promise.resolve()
			})
		},
		verificationDetails () {
			return this.fxDataVerification.checkComfirm(this.organDetails)
		},
		onPrintClick () {
			this.$fxGoPrint('PurchaseInvoice', this.organDetails.id)
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
