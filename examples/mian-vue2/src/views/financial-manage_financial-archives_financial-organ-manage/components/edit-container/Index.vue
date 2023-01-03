<template>
	<w-dialog
		v-model="dialogVisible"
		width="1100px"
		title="机构财务信息"
		heightFullscreen
		:beforeClose="onBeforeClose"
		@close="onClose"
	>
		<div class="create-organ">
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
			<el-button
				ref="cancelBtn"
				v-fx-tab:loop.financial-manage_financial-organ-manage_details.cancelBtn
				@click="onCancelClick"
			>取消</el-button>
			<el-button
				ref="saveBtn"
				v-fx-auth:basic-archives_organ-manage.edit-organ
				v-fx-tab:loop.financial-manage_financial-organ-manage_details.saveBtn
				type="primary"
				@click="onSaveClick"
			>保存</el-button>
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
	name: 'editFinancialOrgan',
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
			fxCache: this.$fxUtils.fxCache('financial-organ'),
			fxDataVerification: this.$fxUtils.fxDataVerification()
		}
	},
	computed: {
		...mapGetters(['detailsAuthGetter']),
		authDisabled () {
			return !this.detailsAuthGetter('basic-archives_organ-manage.edit-organ')
		}
	},
	created () {
		this.$fxTabkey.init('financial-manage_financial-organ-manage_details', this)
	},
	methods: {
		edit (organInfo) {
			this.getOrganDetails(organInfo.id).then(() => {
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
			const logger = this.$fxLogger.createInfo('financial-manage.financial-archives.financial-organ-manage.update', this.createLoggerParams())
			return this.$fxApi(`${apiName}.saveOrganDetails`, this.organDetails.id)({ data: this.organDetails, logger }).then(res => {
				this.fxDataVerification.resetData(this.organDetails)
				return Promise.resolve()
			})
		},
		createLoggerParams () {
			const originData = this.fxDataVerification.getOriginData()
			const organDetails = this.$fxUtils.deepClone(this.organDetails)
			return {
				pre: originData,
				cur: organDetails,
				name: organDetails.name
			}
		},
		onCancelClick () {
			this.verificationDetails().then(() => {
				this.dialogVisible = false
			})
		},
		getOrganDetails (id) {
			return this.$fxApi(`${apiName}.getOrganDetails`, id).then(res => {
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
.create-organ {
	flex: 1
	display: flex;
	flex-direction: column;
	overflow: auto;
}
</style>
