<template>
	<w-dialog
		v-model="dialogVisible"
		width="1100px"
		title="供货商信息"
		heightFullscreen
		:beforeClose="onBeforeClose"
		@close="onClose"
	>
		<div class="edit-supplier">
			<w-scroll-bar>
				<basicInfo
					ref="basicInfo"
					:visibleFlag="dialogVisible"
					:organDetails="organDetails"
					:disabled="authDisabled"
				></basicInfo>
				<invoiceInfo
					ref="invoiceInfo"
					:visibleFlag="dialogVisible"
					:organDetails="organDetails"
					:taxTypeList="taxTypeList"
					:invoiceTypeList="invoiceTypeList"
					:disabled="authDisabled"
				></invoiceInfo>
				<settlementInfo
					ref="settlementInfo"
					:visibleFlag="dialogVisible"
					:organDetails="organDetails"
					:tableDetails="tableDetails"
					:fpSaveMain="onSaveClickHandler"
					:disabled="authDisabled"
					@on-details-refresh="getDetails"
				></settlementInfo>
			</w-scroll-bar>
		</div>
		<template slot="footer-right">
			<fx-button
				ref="cancelBtn"
				v-fx-tab:loop.financial-manage_financial-supplier-manage_details.cancelBtn
				@click="onCancelClick"
			>取消</fx-button>
			<fx-button
				ref="saveBtn"
				v-fx-auth:basic-archives_organ-manage.edit-organ
				v-fx-tab:loop.financial-manage_financial-supplier-manage_details.saveBtn
				type="primary"
				@click="onSaveClick"
			>保存</fx-button>
		</template>
	</w-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import basicInfo from './BasicInfo.vue'
import invoiceInfo from './InvoiceInfo.vue'
import settlementInfo from './SettlementInfo'
import { apiName } from '../../Index.vue'
export default {
	name: 'editFinancialSupplier',
	components: {
		basicInfo,
		invoiceInfo,
		settlementInfo
	},
	data () {
		return {
			dialogVisible: false,
			organDetails: {},
			tableDetails: [],
			fxCache: this.$fxUtils.fxCache('financial-supplier'),
			taxTypeList: this.$fxTypeMiddleware.getCommonTypeList('taxTypeList'),
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			invoiceTypeList: []
		}
	},
	computed: {
		...mapGetters(['detailsAuthGetter']),
		authDisabled () {
			return !this.detailsAuthGetter('basic-archives_organ-manage.edit-organ')
		}
	},
	created () {
		this.$fxTabkey.init('financial-manage_financial-supplier-manage_details', this)
	},
	methods: {
		edit (supplierInfo) {
			this.getOrganDetails(supplierInfo.id).then(this.initSelect).then(() => {
				this.fxCache.clear()
				this.dialogVisible = true
				this.$nextTick(() => {
					if (this.authDisabled) {
						this.$fxUtils.vDoRefFocus(this, 'cancelBtn')
					} else {
						this.$refs.invoiceInfo.defaultFocus()
					}
				})
			})
		},
		initSelect (organDetails = {}) {
			return this.getInvoiceTypeList(organDetails)
		},
		getInvoiceTypeList (organDetails) {
			const namedIdList = [organDetails.invoicingTypeId] || []
			return this.$fxApi(`${apiName}.getInvoiceTypeList`)({ data: namedIdList }).then(res => {
				this.invoiceTypeList = res
				return Promise.resolve()
			})
		},
		onClose () {
			this.$refs.settlementInfo.clear()
			this.$emit('on-close', !this.organDetails.enableFlag)
		},
		onSaveClick () {
			return this.$refs.settlementInfo.checkDetailsUnSaving().then(() => {
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
				if (this.organDetails.enableFlag) {
					this.$refs.invoiceInfo.validate().then(() => {
						resolve()
					}).catch(() => {
						this.$fxMessage.warning('请填写必填信息')
					})
				} else {
					resolve()
				}
			})
		},
		onSaveOrganHandler () {
			if (this.fxDataVerification.checkData(this.organDetails)) {
				return Promise.resolve(this.organDetails)
			}
			const logger = this.$fxLogger.createInfo('financial-manage.financial-archives.financial-supplier-manage.update', this.createLoggerParams())
			return this.$fxApi(`${apiName}.saveDetails`)({ data: this.organDetails, logger }).then(res => {
				this.fxDataVerification.resetData(this.organDetails)
				return Promise.resolve()
			})
		},
		createLoggerParams () {
			const originData = this.fxDataVerification.getOriginData()
			originData.taxTypeName = this.getNameById(originData.taxType, this.taxTypeList, 'label')
			originData.invoicingTypeName = this.getNameById(originData.invoicingTypeId, this.invoiceTypeList, 'name')
			const organDetails = this.$fxUtils.deepClone(this.organDetails)
			organDetails.taxTypeName = this.getNameById(organDetails.taxType, this.taxTypeList, 'label')
			organDetails.invoicingTypeName = this.getNameById(organDetails.invoicingTypeId, this.invoiceTypeList, 'name')

			return {
				pre: originData,
				cur: organDetails,
				name: organDetails.name
			}
		},
		getNameById (id, list, prop = 'name') {
			if (!id && id !== 0) {
				return ''
			}
			const selectedItem = list.find(item => item.id === id)
			return selectedItem ? selectedItem[prop] : ''
		},
		onCancelClick () {
			this.verificationDetails().then(() => {
				this.dialogVisible = false
			})
		},
		getOrganDetails (id) {
			return this.$fxApi(`${apiName}.getSupplierDetails`, id).then(res => {
				this.tableDetails = res.settlementWayList || []
				const data = this.$fxUtils.deepClone(res)
				delete data.settlementWayList
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
		verificationDetails (message = '当前页面存在未保存数据，是否确定取消并退出操作？') {
			return new Promise(resolve => {
				if (this.$refs.settlementInfo.isRowEditing() || !this.fxDataVerification.checkData(this.organDetails)) {
					this.$fxConfirm(message).then(resolve)
				} else {
					resolve()
				}
			})
		},
		onBeforeClose (close) {
			this.verificationDetails().then(close)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.edit-supplier {
	flex: 1
	display: flex;
	flex-direction: column;
	overflow: auto;
}
</style>
