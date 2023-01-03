<template>
	<fx-bill-container
		title="价格方案详情"
		:moreBtnOption="moreBtnOption"
	>
		<template slot="sub">
			<fx-details-state-tag :label="currentState.label" :icon="currentState.icon"></fx-details-state-tag>
		</template>
		<div class="create-organ">
			<w-scroll-bar :flex="isFullScreen">
				<basicInfo
					ref="basicInfo"
					v-show="!isFullScreen"
					:isFullScreen="isFullScreen"
					:organDetails="organDetails"
					:sellerSelectList="sellerSelectList"
					:sellerTabSelectList="sellerTabSelectList"
					:buyerTabSelectList="buyerTabSelectList"
					:buyerSelectList="buyerSelectList"
					:disabled="billDisabled"
				></basicInfo>
				<detailsInfo
					ref="detailsInfo"
					:isFullScreen.sync="isFullScreen"
					:organDetails="organDetails"
					:tableDetails="tableDetails"
					:itemList="itemList"
					:fSaveMain="onSaveClickHandler"
					:disabled="billDisabled"
					:delDisabled="delDisabled"
					:canAdd="canAdd"
					@on-details-refresh="onDetailsRefresh"
					@on-mistake-check="onMistakeCheck"
				></detailsInfo>
				<appendInfo
					v-show="!isFullScreen"
					:isFullScreen="isFullScreen"
					:organDetails="organDetails"
					:disabled="billDisabled"
				></appendInfo>
				<mistakeCheck
					ref="mistakeCheck"
					:organDetails="organDetails"
					:tableDetails.sync="tableDetails"
					@on-action="onMistakeCheckAction"
					@on-mistake-close="onMistakeClose"
				></mistakeCheck>
			</w-scroll-bar>
		</div>
		<template v-if="!this.isAdd" slot="footer-left">
			<fx-button
				ref="refreshBtn"
				type="save"
				v-fx-tab:loop.basic-archives_price-plan_details.refreshBtn
				@click="onRefresh"
			>刷新</fx-button>
		</template>
		<template slot="footer-right">
			<el-button
				ref="cancelBtn"
				v-fx-tab:loop.basic-archives_price-plan_details.cancelBtn
				@click="onCancelClick"
			>取消</el-button>
			<el-button
				ref="saveBtn"
				type="primary"
				v-fx-auth:basic-archives_price-plan.edit-price="!isChecked && !isDeleted"
				v-fx-tab:loop.basic-archives_price-plan_details.saveBtn
				@click="onSaveClick"
			>保存</el-button>
			<el-button
				ref="checkBtn"
				type="primary"
				v-fx-auth:basic-archives_price-plan.check-price="(!isChecked && !isAdd && !isDeleted)"
				v-fx-tab:loop.basic-archives_price-plan_details.checkBtn
				@click="onCheckClick"
			>审核</el-button>
			<el-button
				ref="uncheckBtn"
				type="danger"
				v-fx-auth:basic-archives_price-plan.uncheck-price="isChecked"
				v-fx-tab:loop.basic-archives_price-plan_details.uncheckBtn
				@click="onUncheckClick"
			>反审</el-button>
		</template>
	</fx-bill-container>
</template>
<script>
import { mapGetters } from 'vuex'
import basicInfo from './BasicInfo.vue'
import detailsInfo from './DetailsInfo.vue'
import appendInfo from './AppendInfo.vue'
import mistakeCheck from '../mistake-check/MistakeCheck.vue'
export default {
	name: 'createOrgan',
	components: {
		basicInfo,
		detailsInfo,
		appendInfo,
		mistakeCheck
	},
	data () {
		return {
			isFullScreen: false,
			organDetails: {},
			tableDetails: [],
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			itemList: [],
			sellerSelectList: [],
			sellerTabSelectList: [],
			buyerTabSelectList: [],
			buyerSelectList: []
		}
	},
	computed: {
		...mapGetters(['detailsAuthGetter']),
		isAdd () {
			return !this.organDetails.id
		},
		isChecked () {
			return this.$fxStateMiddleware.isState('planState')(['checked'])(this.organDetails.billState)
		},
		isDeleted () {
			return this.$fxStateMiddleware.isState('planState')(['deleted'])(this.organDetails.billState)
		},
		currentState () {
			return this.$fxStateMiddleware.getStateObj('planState')(this.organDetails.billState)
		},
		billDisabled () {
			return !this.detailsAuthGetter('basic-archives_price-plan.edit-price') || this.isChecked || this.isDeleted
		},
		delDisabled () {
			return !(!this.isAdd && !this.isChecked && this.detailsAuthGetter('basic-archives_price-plan.delete-price'))
		},
		canAdd () {
			return this.detailsAuthGetter('basic-archives_price-plan.add-price')
		},
		moreBtnOption () {
			return [{
				show: this.detailsAuthGetter('basic-archives_price-plan.export-blank|export-price'),
				label: '导出Excel',
				icon: 'export-excel',
				children: [{
					show: this.detailsAuthGetter('basic-archives_price-plan.export-blank'),
					label: '导出空白模板',
					icon: 'export-template',
					click: this.exportModel
				}, {
					show: this.detailsAuthGetter('basic-archives_price-plan.export-price'),
					label: '导出明细数据',
					icon: 'export-data',
					click: this.exportData
				}]
			}, {
				show: !this.billDisabled && this.detailsAuthGetter('basic-archives_price-plan.import-price'),
				label: '导入Excel',
				icon: 'import-excel',
				children: [{
					label: '按模板导入数据',
					icon: 'import-template',
					click: this.importModel
				}]
			}, {
				show: !this.isAdd && this.detailsAuthGetter('basic-archives_price-plan.copybill-price'),
				label: '复制方案',
				icon: 'copy-order',
				click: this.onCopyClick
			}, {
				show: !this.isAdd && !this.isChecked && this.detailsAuthGetter('basic-archives_price-plan.delete-price'),
				label: '删除',
				icon: 'delete-trash',
				click: this.onDeleteClick
			}]
		}
	},
	created () {
		this.$fxTabkey.init('basic-archives_price-plan_details', this)
		this.initBill()
		this.bindTabBeforeDeactivated()
	},
	methods: {
		initBill () {
			if (this.$route.query.openType === 'add') {
				this.add()
			} else if (this.$route.query.openType === 'edit') {
				this.onEditHandler(this.$route.query.id).then(this.edit)
			}
		},
		bindTabBeforeDeactivated () {
			this.$fxAppTabs.onTabBeforeDeactivated(() => {
				return this.verificationDetails()
			}, this)
		},
		async add () {
			const date = new Date()
			const beginDate = `${this.$fxUtils.setDate(date)} 00:00:00`
			const endDate = `${this.$fxUtils.setDate(date.setFullYear(date.getFullYear() + 1))} 23:59:59`
			await this.getListData()
			this.organDetails = {
				billState: '0',
				code: '',
				name: '',
				beginDate,
				endDate,
				sellerOrgan: '',
				organIds: [],
				sellerOrganIds: [],
				sellerOrganList: [],
				buyerOrganList: [],
				enableFlag: 1,
				memo: '',
				appendixList: []
			}
			this.tableDetails = []
			this.fxDataVerification.resetData(this.organDetails)
			this.$nextTick(() => {
				this.$refs.basicInfo.defaultFocus()
			})
		},
		async edit ([organDetails, tableDetails]) {
			this.$fxAppTabs.setTabTitle({ code: organDetails.code })
			await this.getListData(organDetails)
			this.organDetails = organDetails
			this.tableDetails = tableDetails
			this.fxDataVerification.resetData(this.organDetails)
			this.$nextTick(() => {
				if (this.billDisabled) {
					this.$fxUtils.vDoRefFocus(this, 'refreshBtn')
				} else {
					this.$refs.basicInfo.defaultFocus()
				}
			})
		},
		async getListData (organDetails = {}) {
			return Promise.all([
				this.getItemList(),
				this.getBuyerTabList(organDetails),
				this.getBuyerList(organDetails),
				this.getSellerList(organDetails),
				this.getSellerTabList(organDetails)
			]).then(([itemList, buyerTabList, buyerList, sellerList, sellerTabList]) => {
				this.itemList = itemList
				this.buyerTabSelectList = buyerTabList
				this.buyerSelectList = buyerList
				this.sellerSelectList = sellerList
				this.sellerTabSelectList = sellerTabList
			})
		},
		getItemList () {
			return this.$fxApi('planPrice.getItemList')
		},
		getBuyerTabList (organDetails) {
			const params = organDetails.buyerOrganList ? organDetails.buyerOrganList.map(item => item.organId) : []
			return this.$fxApi('planPrice.getBuyerTabList')({ data: params })
		},
		getBuyerList (organDetails) {
			const params = organDetails.buyerOrganList ? organDetails.buyerOrganList.map(item => item.organId) : []
			return this.$fxApi('planPrice.getBuyerList')({ data: params })
		},
		getSellerList (organDetails) {
			const params = organDetails.sellerOrganList ? organDetails.sellerOrganList.map(item => item.organId) : []
			return this.$fxApi('planPrice.getSellerList')({ data: params })
		},
		getSellerTabList (organDetails) {
			const params = organDetails.sellerOrganList ? organDetails.sellerOrganList.map(item => item.organId) : []
			return this.$fxApi('planPrice.getSellerTabList')({ data: params })
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
				const logger = this.$fxLogger.createInfo('basic-archives.price-plan.add', { name: this.organDetails.name })
				return this.$fxApi('planPrice.add')({ data: this.organDetails, logger }).then(res => {
					this.$fxAppTabs.setTabTitle({ code: res.code })
					this.$fxAppTabs.setTabPathQuery({ openType: 'edit', id: res.id })
					this.$set(this.organDetails, 'id', res.id)
					this.$set(this.organDetails, 'createMan', res.createMan)
					this.organDetails.code = res.code
					this.organDetails.createManName = res.createManName || ''
					this.organDetails.createDate = res.createDate
					this.fxDataVerification.resetData(this.organDetails)
					return Promise.resolve(res)
				})
			} else {
				if (this.fxDataVerification.checkData(this.organDetails)) {
					return Promise.resolve(this.organDetails)
				} else {
					const logger = this.$fxLogger.createInfo('basic-archives.price-plan.update', this.createLoggerParams())
					return this.$fxApi('planPrice.save', this.organDetails.id)({ data: this.organDetails, logger }).then(res => {
						this.fxDataVerification.resetData(this.organDetails)
						return Promise.resolve(res)
					})
				}
			}
		},
		createLoggerParams () {
			const originData = this.$fxUtils.deepClone(this.fxDataVerification.getOriginData())
			originData.sellerOrganName = this.getSellerOrganNames(originData.sellerOrganIds)
			originData.organName = this.getOrganNames(originData.organIds)
			const organDetails = this.$fxUtils.deepClone(this.organDetails)
			organDetails.sellerOrganName = this.getSellerOrganNames(organDetails.sellerOrganIds)
			organDetails.organName = this.getOrganNames(organDetails.organIds)
			return {
				pre: originData,
				cur: organDetails,
				name: organDetails.name
			}
		},
		getSellerOrganNames (id) {
			return this.$fxUtils.getSelectMulityById(id, this.sellerSelectList).map(item => item.name).join(',')
		},
		getOrganNames (id) {
			return this.$fxUtils.getSelectMulityById(id, this.buyerSelectList).map(item => item.name).join(',')
		},
		onCancelClick () {
			this.$fxAppTabs.tabsRemove()
		},
		onDeleteClick () {
			this.$fxConfirm('是否确定删除当前方案？')
				.then(this.onDeleteHandler)
				.then(this.onCancelClick)
		},
		onDeleteHandler () {
			const delLogger = this.isDeleted ? 'recyclingDelete' : 'delete'
			const delApi = this.isDeleted ? 'recyclingDelete' : 'del'
			const logger = this.$fxLogger.createInfo(`basic-archives.price-plan.${delLogger}`, { names: this.organDetails.name })
			return this.$fxApi(`planPrice.${delApi}`, this.organDetails.id)({ logger }).then(res => {
				this.fxDataVerification.resetData(this.organDetails)
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
		onRefresh () {
			this.verificationDetails('当前页面存在未保存数据，是否确定刷新操作？').then(() => {
				this.onEditHandler(this.organDetails.id).then(this.edit)
			})
		},
		onEditHandler (planId) {
			return Promise.all([this.getPlan(planId), this.getPlanDetails(planId)])
		},
		getPlan (planId) {
			return this.$fxApi('planPrice.get', planId)
		},
		getPlanDetails (planId) {
			return this.$fxApi('planPrice.getDetailsPage', planId)
		},
		onDetailsRefresh () {
			return this.$fxApi('planPrice.getDetailsPage', this.organDetails.id).then(res => {
				res.forEach(item => {
					item.itemUnitList = []
				})
				this.tableDetails = res
				return Promise.resolve(res)
			})
		},
		onCheckClick () {
			return this.$fxConfirm('是否确定审核？').then(() => {
				this.$refs.detailsInfo.checkDetailsUnSaving()
					.then(this.onSaveClickHandler)
					.then(() => {
						return this.$refs.mistakeCheck.mistakeCheck('check')
							.then(this.onCheckHandler)
					})
			})
		},
		onCheckHandler () {
			const logger = this.$fxLogger.createInfo('basic-archives.price-plan.check', { names: this.organDetails.name })
			return this.$fxApi('planPrice.check', this.organDetails.id)({ logger }).then(res => {
				this.organDetails.billState = 1
				this.organDetails.checkManName = res.checkManName || ''
				this.organDetails.checkDate = res.checkDate || ''
				this.fxDataVerification.resetData(this.organDetails)
				return Promise.resolve()
			})
		},
		onUncheckClick () {
			return this.$fxConfirm('是否确定反审？').then(() => {
				const logger = this.$fxLogger.createInfo('basic-archives.price-plan.uncheck', { names: this.organDetails.name })
				return this.$fxApi('planPrice.uncheck', this.organDetails.id)({ logger }).then(() => {
					this.organDetails.billState = 0
					this.organDetails.checkManName = ''
					this.organDetails.checkDate = ''
					this.fxDataVerification.resetData(this.organDetails)
					return Promise.resolve()
				})
			})
		},
		onMistakeClose () {
			this.$refs.detailsInfo.clear()
		},
		onMistakeCheck () {
			this.$refs.mistakeCheck.mistakeCheck().then(() => {
				this.$fxMessage.success('未查询到存在问题的数据')
			})
		},
		onMistakeCheckAction () {
			this.onCheckHandler()
		},
		onCopyClick () {
			const logger = this.$fxLogger.createInfo('basic-archives.price-plan.copy', { names: this.organDetails.name })
			return this.$fxApi('planPrice.copyPlan', this.organDetails.id)({ logger }).then(res => {
				this.$fxMessage.success('方案复制成功')
				this.$fxAppTabs.tabsPush({
					path: 'pricePlanDetail',
					query: {
						openType: 'edit',
						id: res.id
					}
				})
			})
		},
		exportModel () {
			this.onSaveClick().then(() => {
				const logger = this.$fxLogger.createInfo('basic-archives.price-plan.exportModel', { name: this.organDetails.name })
				return this.$fxApi('planPrice.exportModel', this.organDetails.id)({ logger }).then(res => {
					this.$fxUtils.downloadFile(res)
				})
			})
		},
		exportData () {
			this.onSaveClick().then(() => {
				if (this.tableDetails.length < 1) {
					this.$fxMessage.warning('当前无明细，不允许导出数据！')
					return false
				}
				const logger = this.$fxLogger.createInfo('basic-archives.price-plan.exportData', { name: this.organDetails.name })
				return this.$fxApi('planPrice.exportData', this.organDetails.id)({ logger }).then(res => {
					this.$fxUtils.downloadFile(res)
				})
			})
		},
		importModel () {
			this.onSaveClick().then(() => {
				this.$fxUpload({ type: 'excel' }).then(this.importExcelHandler).then(this.confirmWrongData)
			})
		},
		importExcelHandler (file) {
			const params = {
				excelFile: file
			}
			const logger = this.$fxLogger.createInfo('basic-archives.price-plan.importModel', { name: this.organDetails.name, fileName: file.name })
			return this.$fxApi('planPrice.importData', this.organDetails.id)({ data: params, logger })
		},
		confirmWrongData (res) {
			if (!res.result) {
				this.$fxConfirm({
					message: '导入数据存在错误，是否下载错误信息？',
					option: {
						confirmButtonText: '下载',
						cancelButtonText: '取消',
						closeOnClickModal: false,
						closeOnPressEscape: false,
						closeOnHashChange: false
					}
				}).then(() => {
					this.$fxUtils.downloadFile(res)
				})
			} else {
				this.onDetailsRefresh()
			}
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
