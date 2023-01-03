<template>
	<fx-bill-container
		title="新建发票"
	>
		<div class="create-organ">
			<w-scroll-bar>
				<div class="create-organ__content">
					<basicInfo
						ref="basicInfo"
						:invoiceTypeList="invoiceTypeList"
						:organDetails="organDetails"
					></basicInfo>
					<sellerInfo
						ref="sellerInfo"
						:sellerOrganList="sellerOrganList"
						:organDetails="organDetails"
					></sellerInfo>
					<buyerInfo
						ref="buyerInfo"
						:buyerOrganList="buyerOrganList"
						:organDetails="organDetails"
						:accountingPeriodBeginDate.sync="accountingPeriodBeginDate"
					></buyerInfo>
					<appendInfo
						:organDetails="organDetails"
					></appendInfo>
				</div>
			</w-scroll-bar>
		</div>
		<template slot="footer">
			<el-button @click="onCancelClick">取消</el-button>
			<el-button type="primary" @click="onSaveClick">保存</el-button>
		</template>
	</fx-bill-container>
</template>
<script>
import basicInfo from './BasicInfo.vue'
import sellerInfo from './SellerInfo.vue'
import buyerInfo from './BuyerInfo.vue'
import appendInfo from './AppendInfo.vue'
import { apiName } from '../../Index.vue'
export default {
	name: 'createContainer',
	components: {
		basicInfo,
		sellerInfo,
		buyerInfo,
		appendInfo
	},
	data () {
		return {
			organDetails: {
				invoicingType: {},
				purchaseOrgan: {},
				salesOrgan: {},
				operatorMan: {}
			},
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			invoiceTypeList: [],
			sellerOrganList: [],
			buyerOrganList: [],
			accountingPeriodBeginDate: ''
		}
	},
	created () {
		this.add()
		this.bindTabBeforeDeactivated()
	},
	methods: {
		bindTabBeforeDeactivated () {
			this.$fxAppTabs.onTabBeforeDeactivated(() => {
				return this.verificationDetails()
			}, this)
		},
		async add () {
			await this.initSelect()
			const { currentUser } = await this.getCurrentUser()
			this.organDetails = {
				invoicingDate: this.$fxUtils.setDate(),
				invoicingType: { id: '2147483648' },
				totalMoney: 0,
				invoicingCode: null,
				state: 0,
				salesOrgan: { id: '' },
				salesTaxNO: '',
				salesAddr: '',
				salesPhone: '',
				salesBankName: '',
				salesBankAccount: '',
				purchaseOrgan: { id: '' },
				purchaseTaxNO: '',
				purchaseAddr: '',
				purchasePhone: '',
				purchaseBankName: '',
				purchaseBankAccount: '',
				mappendixList: [],
				memo: '',
				operatorMan: { id: currentUser.id }
			}
			this.fxDataVerification.resetData(this.organDetails)
			this.$nextTick(() => {
				this.$refs.basicInfo.defaultFocus()
			})
		},
		initSelect () {
			return Promise.all([
				this.getBuyerList(),
				this.getSellerList(),
				this.getInvoiceTypeList()])
		},
		getBuyerList () {
			return this.$fxApi(`${apiName}.getBuyerList`)({ data: { ids: [], names: ['Shop', 'Center'] } }).then(res => {
				this.buyerOrganList = res
			})
		},
		getSellerList () {
			return this.$fxApi(`${apiName}.getSellerList`)({ data: { ids: [], names: ['Shop', 'Center', 'Supplier', 'Customer'] } }).then(res => {
				this.sellerOrganList = res
			})
		},
		getInvoiceTypeList () {
			return this.$fxApi(`${apiName}.getInvoiceTypeListForCreate`).then(res => {
				this.invoiceTypeList = res
			})
		},
		getCurrentUser () {
			return this.$fxApi(`${apiName}.getCurrentUser`)
		},
		onSaveClick () {
			this.onValidateFormData().then(this.onSaveClickHandler).then(res => {
				this.$fxAppTabs.tabsRemove()
				this.$fxAppTabs.tabsPush({
					path: 'purchaseInvoiceDetail',
					query: { id: res.id }
				})
			})
		},
		onValidateFormData () {
			return new Promise(resolve => {
				this.$refs.basicInfo.validate().then(
					this.$refs.sellerInfo.validate
				).then(
					this.$refs.buyerInfo.validate
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
			const invoiceType = this.invoiceTypeList.find(item => item.id === this.organDetails.invoicingType.id).name
			const logger = this.$fxLogger.createInfo('financial-manage.invoice-manage.purchase-invoice.add', { code: this.organDetails.invoicingCode, type: invoiceType })
			this.organDetails.generateDate = null
			return this.$fxApi(`${apiName}.add`)({ data: this.organDetails, logger }).then(res => {
				this.organDetails = res
				this.fxDataVerification.resetData(this.organDetails)
				return Promise.resolve(res)
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
		verificationDetails () {
			return this.fxDataVerification.checkComfirm(this.organDetails)
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
	&__content {
		flex: 1
		overflow:auto
		padding-right: 10px
	}
}
</style>
