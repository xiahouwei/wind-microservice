<template>
	<fx-bill-container
		title='订货方案详情'
		:moreBtnOption="moreBtnOption"
	>
		<template slot="sub">
			<fx-details-state-tag :label="currentState.label" :icon="currentState.icon"></fx-details-state-tag>
		</template>
		<div class='create-stock'>
			<w-scroll-bar :flex="isFullScreen">
				<basicInfo
					ref='basicInfo'
					v-show="!isFullScreen"
					:isFullScreen="isFullScreen"
					:organDetails='organDetails'
					:buyerSelectList='buyerSelectList'
					:buyerTabSelectList="buyerTabSelectList"
					:disabled="billDisabled"
				></basicInfo>
				<detailsInfo
					ref='detailsInfo'
					:isFullScreen.sync="isFullScreen"
					:organDetails='organDetails'
					:tableDetails='tableDetails'
					:itemList='itemList'
					:sellerSelectList='sellerSelectList'
					:sellerTabSelectList="sellerTabSelectList"
					:fSaveMain="onSaveClickHandler"
					:disabled="billDisabled"
					:delDisabled="delDisabled"
					:canAdd="canAdd"
					@on-mistake-check="onMistakeCheck"
					@on-details-refresh="onDetailsRefresh"
					@get-supplier-item-list="getSupplierItemList"
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
					:tableDetails="tableDetails"
					@on-action="onMistakeCheckAction"
					@on-mistake-close="onMistakeClose"
				></mistakeCheck>
			</w-scroll-bar>
		</div>
		<template v-if="!this.isAdd" slot="footer-left">
			<fx-button
				ref="refreshBtn"
				type="save"
				v-fx-tab:loop.basic-archives_stock-plan_details.refreshBtn
				@click="onRefresh"
			>刷新</fx-button>
		</template>
		<template slot='footer-right'>
			<el-button
				ref="cancelBtn"
				v-fx-tab:loop.basic-archives_stock-plan_details.cancelBtn
				@click='onCancelClick'
			>取消</el-button>
			<el-button
				ref="saveBtn"
				type='primary'
				v-fx-auth:stock-sale-manage_stock-plan.edit-stock="!isChecked && !isDeleted"
				v-fx-tab:loop.basic-archives_stock-plan_details.saveBtn
				@click='onSaveClick'
			>保存</el-button>
			<el-button
				ref="checkBtn"
				type="primary"
				v-fx-auth:stock-sale-manage_stock-plan.check-stock="(!isChecked && !isAdd && !isDeleted)"
				v-fx-tab:loop.basic-archives_stock-plan_details.checkBtn
				@click="onCheckClick"
			>审核</el-button>
			<el-button
				ref="uncheckBtn"
				type="danger"
				v-fx-auth:stock-sale-manage_stock-plan.uncheck-stock="isChecked"
				v-fx-tab:loop.basic-archives_stock-plan_details.uncheckBtn
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
	name: 'createStock',
	components: {
		basicInfo,
		detailsInfo,
		appendInfo,
		mistakeCheck
	},
	data () {
		return {
			organDetails: {
				id: '',
				code: '',
				name: '',
				beginDate: '',
				endDate: '',
				limitFlag: 0,
				enableFlag: 1,
				limitBeginTime: '00:00:00',
				limitEndTime: '23:59:59',
				planState: 0,
				urgent: 0,
				memo: '',
				appendixList: [],
				details: [],
				organIds: []
			},
			tableDetails: [],
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			itemList: [],
			buyerSelectList: [],
			sellerSelectList: [],
			buyerTabSelectList: [],
			sellerTabSelectList: [],
			isFullScreen: false
		}
	},
	computed: {
		...mapGetters(['detailsAuthGetter']),
		isAdd () {
			return !this.organDetails.id
		},
		isChecked () {
			return this.$fxStateMiddleware.isState('planState')(['checked'])(this.organDetails.planState)
		},
		isDeleted () {
			return this.$fxStateMiddleware.isState('planState')(['deleted'])(this.organDetails.planState)
		},
		currentState () {
			return this.$fxStateMiddleware.getStateObj('planState')(this.organDetails.planState)
		},
		billDisabled () {
			return !this.detailsAuthGetter('stock-sale-manage_stock-plan.edit-stock') || this.isChecked || this.isDeleted
		},
		delDisabled () {
			return !(!this.isAdd && !this.isChecked && this.detailsAuthGetter('stock-sale-manage_stock-plan.delete-stock'))
		},
		canAdd () {
			return this.detailsAuthGetter('stock-sale-manage_stock-plan.add-stock')
		},
		moreBtnOption () {
			return [{
				show: this.detailsAuthGetter('stock-sale-manage_stock-plan.export-blank|export-stock'),
				label: '导出Excel',
				icon: 'export-excel',
				children: [{
					show: this.detailsAuthGetter('stock-sale-manage_stock-plan.export-blank'),
					label: '导出空白模板',
					icon: 'export-template',
					click: this.exportModel
				}, {
					show: this.detailsAuthGetter('stock-sale-manage_stock-plan.export-stock'),
					label: '导出明细数据',
					icon: 'export-data',
					click: this.exportData
				}]
			}, {
				show: !this.billDisabled && !this.isPlanUsed && this.detailsAuthGetter('stock-sale-manage_stock-plan.import-stock'),
				label: '导入Excel',
				icon: 'import-excel',
				children: [{
					label: '按模板导入数据',
					icon: 'import-template',
					click: this.importModel
				}]
			}, {
				show: !this.isAdd && !this.isChecked && !this.isPlanUsed && this.detailsAuthGetter('stock-sale-manage_stock-plan.delete-stock'),
				label: '删除',
				icon: 'delete-trash',
				click: this.onDeleteClick
			}]
		},
		isPlanUsed () {
			return !!this.organDetails.useFlag
		}
	},
	created () {
		this.$fxTabkey.init('basic-archives_stock-plan_details', this)
		this.initBill()
		this.bindTabBeforeDeactivated()
	},
	methods: {
		initBill () {
			if (this.$route.query.openType === 'add') {
				this.add()
			} else if (this.$route.query.openType === 'edit') {
				this.edit(this.$route.query.id)
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
				id: '',
				code: '',
				name: '',
				beginDate,
				endDate,
				limitFlag: 0,
				enableFlag: 1,
				limitBeginTime: '00:00:00',
				limitEndTime: '23:59:59',
				planState: 0,
				urgent: 0,
				memo: '',
				appendixes: [],
				details: [],
				organIds: []
			}
			this.tableDetails = []
			this.fxDataVerification.resetData(this.organDetails)
			this.$nextTick(() => {
				this.$refs.basicInfo.defaultFocus()
			})
		},
		async edit (planId) {
			const organDetails = await this.getPlan(planId)
			this.$fxAppTabs.setTabTitle({ code: organDetails.code })
			await this.getListData(organDetails)
			this.tableDetails = organDetails.details
			delete organDetails.details
			this.organDetails = organDetails
			this.setBuyerSelectOptionDisabled()
			this.fxDataVerification.resetData(this.organDetails)
			this.$nextTick(() => {
				if (this.billDisabled) {
					this.$fxUtils.vDoRefFocus(this, 'refreshBtn')
				} else {
					this.$refs.basicInfo.defaultFocus()
				}
			})
		},
		getPlan (planId) {
			return this.$fxApi('planStock.get', planId)
		},
		getListData (organDetails = {}) {
			return Promise.all([
				this.getItemList(),
				this.getBuyerList(organDetails),
				this.getSellerList(organDetails),
				this.getBuyerTabList(organDetails),
				this.getSellerTabList(organDetails)])
				.then(([itemList, buyerList, sellerList, buyerTabList, sellerTabList]) => {
					this.itemList = itemList
					this.buyerSelectList = buyerList
					this.sellerSelectList = sellerList
					this.buyerTabSelectList = buyerTabList
					this.sellerTabSelectList = sellerTabList
					return Promise.resolve()
				})
		},
		getItemList () {
			return this.$fxApi('planStock.getItemList')
		},
		getSupplierItemList (sellerOrganIds, sellerHouseIds) {
			const params = {
				supplierIds: sellerOrganIds
			}
			if (sellerHouseIds.length > 0) {
				params.houseIds = sellerHouseIds
			}
			this.$refs.detailsInfo.getSupplierItemList(params).then((res) => {
				if (res.code === 0) {
					const supplierItemList = res.data
					this.itemList = supplierItemList
				} else if (res.code === 1) {
					if (sellerHouseIds.length > 0) {
						const responseComplete = true
						this.$refs.detailsInfo.getQueryHouseItemList(sellerHouseIds, responseComplete).then((res) => {
							if (res.code === 0) {
								this.itemList = res.data
							} else if (res.code === 1) {
								this.getItemList().then(res => {
									this.itemList = res
								})
							}
						})
					} else {
						this.getItemList().then(res => {
							this.itemList = res
						})
					}
				}
			})
		},
		getBuyerList (organDetails) {
			const params = organDetails.buyers ? organDetails.buyers.map(item => item.buyerOrgan) : []
			return this.$fxApi('planStock.getBuyerList')({ data: params })
		},
		getSellerList (organDetails) {
			const params = organDetails.sellers || []
			return this.$fxApi('planStock.getSellerList')({ data: params })
		},
		getBuyerTabList (organDetails) {
			const params = organDetails.buyers ? organDetails.buyers.map(item => item.buyerOrgan) : []
			return this.$fxApi('planStock.getBuyerTabList')({ data: params })
		},
		getSellerTabList (organDetails) {
			const params = organDetails.sellers || []
			return this.$fxApi('planStock.getSellerTabList')({ data: params })
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
			return this.onValidateFormData().then(this.onSaveOrganHandler)
		},
		onSaveOrganHandler () {
			if (this.isAdd) {
				const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan.add', { name: this.organDetails.name })
				return this.$fxApi('planStock.add')({ data: this.organDetails, logger }).then(res => {
					this.$fxAppTabs.setTabTitle({ code: res.code })
					this.$fxAppTabs.setTabPathQuery({ openType: 'edit', id: res.id })
					this.organDetails.id = res.id
					this.organDetails.code = res.code
					this.$set(this.organDetails, 'createDate', res.createDate)
					this.$set(this.organDetails, 'createMan', res.createMan)
					this.$set(this.organDetails, 'createManName', res.createManName)
					this.fxDataVerification.resetData(this.organDetails)
					return Promise.resolve(res)
				})
			} else {
				if (this.fxDataVerification.checkData(this.organDetails)) {
					return Promise.resolve(this.organDetails)
				} else {
					const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan.update', this.createLoggerParams())
					return this.$fxApi('planStock.save', this.organDetails.id)({ data: this.organDetails, logger }).then(res => {
						this.fxDataVerification.resetData(this.organDetails)
						return Promise.resolve(res)
					})
				}
			}
		},
		createLoggerParams () {
			const originData = this.fxDataVerification.getOriginData()
			originData.organName = this.$refs.basicInfo.getOrganNames(originData.organIds)
			const organDetails = this.$fxUtils.deepClone(this.organDetails)
			organDetails.organName = this.$refs.basicInfo.getOrganNames(organDetails.organIds)
			return {
				pre: originData,
				cur: organDetails,
				name: organDetails.name
			}
		},
		onDeleteClick () {
			this.$fxConfirm('是否确定删除当前方案？')
				.then(this.onDeleteHandler)
				.then(this.onCancelClick)
		},
		onDeleteHandler () {
			const delLogger = this.isDeleted ? 'recyclingDelete' : 'delete'
			const delApi = this.isDeleted ? 'recyclingDelete' : 'delBill'
			const logger = this.$fxLogger.createInfo(`stock-sale-manage.stock-plan.${delLogger}`, { names: this.organDetails.name })
			return this.$fxApi(`planStock.${delApi}`, this.organDetails.id)({ logger }).then(res => {
				this.organDetails.id = ''
				this.fxDataVerification.resetData(this.organDetails)
				return Promise.resolve()
			})
		},
		onCancelClick () {
			this.$fxAppTabs.tabsRemove()
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
		onAddItem () {
			this.$refs.addItemStep1.open()
		},
		onRefresh () {
			this.verificationDetails('当前页面存在未保存数据，是否确定刷新操作？').then(() => {
				this.edit(this.organDetails.id)
			})
		},
		onCheckClick () {
			if (this.tableDetails.length === 0) {
				this.$fxMessage.warning('明细为空，不能审核')
			} else {
				return this.$fxConfirm('是否确定审核？').then(() => {
					return this.$refs.detailsInfo.checkDetailsUnSaving()
						.then(this.onSaveClickHandler)
						.then(() => {
							return this.$refs.mistakeCheck.mistakeCheck('check')
						})
						.then(this.onCheckHandler)
				})
			}
		},
		onCheckHandler () {
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan.check', { names: this.organDetails.name })
			return this.$fxApi('planStock.check', this.organDetails.id)({ logger }).then(res => {
				this.organDetails.planState = 1
				this.organDetails.checkManName = res.checkManName || ''
				this.organDetails.checkDate = res.checkDate || ''
				this.fxDataVerification.resetData(this.organDetails)
				return Promise.resolve()
			})
		},
		onUncheckClick () {
			return this.$fxConfirm('是否确定反审？').then(() => {
				const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan.uncheck', { names: this.organDetails.name })
				return this.$fxApi('planStock.uncheck', this.organDetails.id)({ logger }).then(res => {
					this.tableDetails = res.details
					delete res.details
					this.organDetails = res
					this.setBuyerSelectOptionDisabled()
					this.fxDataVerification.resetData(this.organDetails)
					return Promise.resolve()
				})
			})
		},
		setBuyerSelectOptionDisabled () {
			this.organDetails.buyers.forEach(item => {
				if (item.useFlag) {
					const usedBuyerTabOption = this.$fxUtils.getSelectTagById(item.buyerOrgan, this.buyerTabSelectList)
					usedBuyerTabOption.disabled = true
					usedBuyerTabOption.useFlag = 1
					const usedBuyerOption = this.buyerSelectList.find(_item => _item.id === item.buyerOrgan)
					usedBuyerOption.disabled = true
					usedBuyerOption.useFlag = 1
				}
			})
		},
		onMistakeClose () {
			this.onDetailsRefresh()
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
		onDetailsRefresh () {
			return this.$fxApi('planStock.getDetails', this.organDetails.id).then(res => {
				this.tableDetails = res
				return Promise.resolve()
			})
		},
		clearValidate () {
			this.$refs.basicInfo.$refs.form.clearValidate()
		},
		exportModel () {
			this.onSaveClick().then(() => {
				const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan.exportModel', { name: this.organDetails.name })
				return this.$fxApi('planStock.exportModel', this.organDetails.id)({ logger }).then(res => {
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
				const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan.exportData', { name: this.organDetails.name })
				return this.$fxApi('planStock.exportData', this.organDetails.id)({ logger }).then(res => {
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
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan.importModel', { name: this.organDetails.name, fileName: file.name })
			return this.$fxApi('planStock.importData', this.organDetails.id)({ data: params, logger })
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
.<style lang='stylus' scoped>
@import '~$assets/stylus/varsty.styl'
.create-stock {
	flex: 1
	display: flex;
	flex-direction: column;
	overflow: auto;
}
>>>.el-table__fixed::before {
	background: none
}
.wind-collapse{
	margin-top 0
}
</style>
