<template>
	<fx-bill-container
		title="调拨单详情"
		:moreBtnOption="moreBtnOption"
		:billChainOption="billChainOption"
	>
		<template slot="sub">
			<fx-details-state-tag :label="currentApplyType.label" :icon="currentApplyType.color"></fx-details-state-tag>
			<fx-details-state-tag :label="currentState.label" :icon="currentState.icon"></fx-details-state-tag>
			<fx-details-state-tag :label="currentMoveState.label" :icon="currentMoveState.icon"></fx-details-state-tag>
		</template>
		<template slot="parentBill" v-if="!isAdd">
			<template	v-if="hasParentBill">
				上级单据:
			<w-link
				@click="goToBillBlank"
			>{{organDetails.parentBill.sysBillCode}}</w-link>
			</template>
			<span v-else>无上级单据</span>
		</template>
		<div class="create-organ">
			<w-scroll-bar :flex="isFullScreen">
				<basicInfo
					v-show="!isFullScreen"
					ref="basicInfo"
					:isFullScreen="isFullScreen"
					:organDetails="organDetails"
					:tableDetails="tableDetails"
					:businessTypeSelectList="businessSelectList"
					:billtypeSelect="billtypeSelect"
					:organSelectList="organSelectList"
					:allOrganSelectList="allOrganSelectList"
					:storeSelectList.sync="storeSelectList"
					:outStoreSelectList.sync="outStoreSelectList"
					:agentSelectList="agentSelectList"
					:disabled="isDisable || authDisabled"
					:btnAuth="btnAuth"
					@on-refresh-bussiness-type-list="getBusinessTypeList"
					@on-details-refresh="onDetailsRefresh"
					@on-inhouse-save="onInhouseSave"
					@on-outhouse-save="onOuthouseSave"
					@on-basic-instore-change="onBasicInstoreChange"
					@on-clear-details-outstore="onClearDetailsOutstore"
					@on-clear-details-instore="onClearDetailsInstore"
				></basicInfo>
				<detailsInfo
					ref="detailsInfo"
					:organDetails="organDetails"
					:tableDetails="tableDetails"
					:isFullScreen.sync="isFullScreen"
					:outStoreSelectList.sync="outStoreSelectList"
					:storeSelectList.sync="storeSelectList"
					:fSaveMain="onSaveClickHandler"
					:deleteDisabled="isDisable"
					:disabled="isDisable || authDisabled"
					:btnAuth="btnAuth"
					:currentBasicInStoreId="currentBasicInStoreId"
					@on-details-refresh="onDetailsRefresh"
					@on-mistake-check="onMistakeCheck"
				></detailsInfo>
				<appendInfo
					v-show="!isFullScreen"
					:isFullScreen="isFullScreen"
					:organDetails="organDetails"
					:disabled="isDisable || authDisabled"
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
		<template slot="footer-left">
			<fx-button
				ref="refreshBtn"
				type="save"
				v-if="!isAdd"
				v-fx-tab:loop.store-manage_move-order_details.refreshBtn
				@click="onRefresh"
			>刷新</fx-button>
		</template>
		<template slot="footer-right">
			<el-button
				ref="cancelBtn"
				v-fx-tab:loop.store-manage_move-order_details.cancelBtn
				@click="onCancelClick"
			>取消</el-button>
			<fx-button
				ref="saveBtn"
				type="save"
				v-fx-auth:store-manage_move-order.edit-move="!btnAuth.recheck && !isRechecked && !isCarryForward"
				v-fx-tab:loop.store-manage_move-order_details.saveBtn
				@click="onSaveClick"
			>保存</fx-button>
			<fx-button
				ref="submitBtn"
				type="submit"
				v-fx-auth:store-manage_move-order.submit-move="isState(['unSubmit'])"
				v-fx-tab:loop.store-manage_move-order_details.submitBtn
				@click="onSubmitClick"
			>提交</fx-button>
			<fx-button
				ref="returnBtn"
				type="return"
				v-fx-auth:store-manage_move-order.back-move="isState(['unChecked'])"
				v-fx-tab:loop.store-manage_move-order_details.returnBtn
				@click="onReturnClick"
			>退回</fx-button>
			<fx-button
				ref="checkBtn"
				type="check"
				v-fx-auth:store-manage_move-order.check-move="isState(['unSubmit', 'unChecked'])"
				v-fx-tab:loop.store-manage_move-order_details.checkBtn
				@click="onCheckClick"
			>审核</fx-button>
			<fx-button
				ref="uncheckBtn"
				type="uncheck"
				v-fx-auth:store-manage_move-order.uncheck-move="isState(['checked']) && btnAuth.uncheck && !isCarryForward"
				v-fx-tab:loop.store-manage_move-order_details.uncheckBtn
				@click="onUncheckClick"
			>反审</fx-button>
			<fx-button
				ref="recheckBtn"
				type="recheck"
				v-fx-auth:store-manage_move-order.recheck-move="isState(['checked']) && btnAuth.recheck && !isCarryForward"
				v-fx-tab:loop.store-manage_move-order_details.recheckBtn
				@click="onRecheckClick"
			>复审</fx-button>
			<fx-button
				ref="unrecheckBtn"
				type="unrecheck"
				v-fx-auth:store-manage_move-order.unrecheck-move="isRechecked && !isCarryForward"
				v-fx-tab:loop.store-manage_move-order_details.unrecheckBtn
				@click="onUnrecheckClick"
			>取消复审</fx-button>
			<fx-button
				ref="agreeBtn"
				type="agreen"
				v-fx-auth:store-manage_move-order.agree-move="isState(['checked']) && btnAuth.agree && !isCarryForward && !isProduction "
				v-fx-tab:loop.store-manage_move-order_details.agreeBtn
				@click="onAgreenClick"
			>同意</fx-button>
			<fx-button
				ref="rejectBtn"
				type="reject"
				v-fx-auth:store-manage_move-order.reject-move="isState(['checked']) && btnAuth.reject && !isCarryForward && !isProduction"
				v-fx-tab:loop.store-manage_move-order_details.rejectBtn
				@click="onRejectClick"
			>拒绝</fx-button>
		</template>
		<fx-bill-chain
			ref="billChain"
			:billChainData="billChainData"
		>
		</fx-bill-chain>
		<check-err-info ref="checkErrInfo"></check-err-info>
		<uncheck-order-info ref="uncheckOrderInfo" billType="MoveOrder"></uncheck-order-info>
	</fx-bill-container>
</template>
<script>
import { mapGetters } from 'vuex'
import basicInfo from './BasicInfo.vue'
import appendInfo from './AppendInfo.vue'
import detailsInfo from './DetailsInfo.vue'
import mistakeCheck from '../mistake-check/MistakeCheck.vue'
import checkErrInfo from '@/components/common/Fx-check-err-info.vue'
import uncheckOrderInfo from '@/components/common/Fx-uncheck-order-info.vue'
import { apiName } from '../../Index.vue'
export default {
	name: 'createOrgan',
	components: {
		basicInfo,
		appendInfo,
		detailsInfo,
		mistakeCheck,
		checkErrInfo,
		uncheckOrderInfo
	},
	data () {
		return {
			organDetails: {
				organ: {},
				otherOrgan: {},
				inHouse: {},
				otherHouse: {},
				operateMan: {}
			},
			tableDetails: [],
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			isFullScreen: false,
			businessSelectList: [],
			billtypeSelect: [],
			organSelectList: [],
			allOrganSelectList: [],
			agentSelectList: [],
			sellerSelectList: [],
			storeSelectList: [],
			outStoreSelectList: [],
			btnAuth: {},
			currentBasicInStoreId: '',
			fxCache: this.$fxUtils.fxCache('move-order'),
			billChainData: {}
		}
	},
	provide () {
		return {
			$$orderParent: this
		}
	},
	computed: {
		...mapGetters(['detailsAuthGetter']),
		moreBtnOption () {
			return [{
				show: !this.isAdd && !this.isDisable && !this.isProduction && this.detailsAuthGetter('store-manage_move-order.delete-move'),
				label: '删除',
				icon: 'delete-trash',
				click: this.onDeleteClick
			}, {
				label: '导出Excel',
				icon: 'export-excel',
				show: !this.isProduction && this.detailsAuthGetter('store-manage_move-order.export-move|export-blank'),
				children: [{
					show: this.detailsAuthGetter('store-manage_move-order.export-blank'),
					label: '导出空白模板',
					icon: 'export-template',
					click: this.exportModel
				}, {
					show: !this.isAdd && this.detailsAuthGetter('store-manage_move-order.export-move'),
					label: '导出明细数据',
					icon: 'export-data',
					click: this.exportData
				}]
			}, {
				show: !this.isDisable && !this.isProduction && this.detailsAuthGetter('store-manage_move-order.import-move'),
				label: '导入Excel',
				icon: 'import-excel',
				children: [{
					label: '按模板导入数据',
					icon: 'import-template',
					click: this.importModel
				}]
			}, {
				show: !this.isAdd && !this.isProduction && this.detailsAuthGetter('store-manage_move-order.copy-move'),
				label: '复制单据',
				icon: 'copy-order',
				click: this.onCopyClick
			}, {
				show: !this.isAdd && !this.isProduction && this.detailsAuthGetter('store-manage_move-order.print-move'),
				label: '打印',
				icon: 'print',
				click: this.onPrintClick
			}]
		},
		isAdd () {
			return !this.organDetails.id
		},
		isChecked () {
			return this.$fxStateMiddleware.isState('billState')(['checked'])(this.organDetails.billState)
		},
		isRechecked () {
			return this.$fxStateMiddleware.isState('recheckState')(['rechecked'])(this.organDetails.recheckState)
		},
		currentState () {
			return this.$fxStateMiddleware.getOrderStateById(this.organDetails.billState, this.organDetails.recheckState, this.organDetails.deleteState)
		},
		isState () {
			return (type) => {
				return this.$fxStateMiddleware.isState('billState')(type)(this.organDetails.billState)
			}
		},
		isDisable () {
			return this.$fxStateMiddleware.isState('billState')(['unChecked', 'checked', 'deleted'])(this.organDetails.billState)
		},
		isDelete () {
			return this.$fxStateMiddleware.isState('billState')(['deleted'])(this.organDetails.billState)
		},
		currentApplyType () {
			return this.$fxTypeMiddleware.getCommonTypeItemByRule('moveBillCreateType')(this.organDetails.billType, this.organDetails.applyMode)
		},
		currentMoveState () {
			return this.$fxStateMiddleware.getStateObj('moveState')(this.organDetails.moveState)
		},
		isProduction () {
			return this.currentApplyType.type === 'production'
		},
		outStoreSelectListComputed () {
			if (this.currentApplyType.type === 'inside') {
				return this.storeSelectList
			} else {
				return this.outStoreSelectList
			}
		},
		authDisabled () {
			return !this.detailsAuthGetter('store-manage_move-order.edit-move')
		},
		isCarryForward () {
			return this.organDetails.balanceFlag === 1
		},
		billChainOption () {
			return {
				show: !this.isAdd,
				click: this.onBillChainClick
			}
		},
		hasParentBill () {
			return !!this.organDetails.parentBill
		}
	},
	created () {
		this.$fxEventBus.initEvent(this, 'app-visible', this.appVisibleHandler)
		this.$fxTabkey.init('store-manage_move-order_details', this)
		this.initBill()
		this.bindTabBeforeDeactivated()
	},
	methods: {
		initBill () {
			if (this.$route.query.openType === 'add') {
				this.add(this.$route.query.moveBillCreateType)
			} else if (this.$route.query.openType === 'edit') {
				this.edit(this.$route.query.id)
			}
		},
		bindTabBeforeDeactivated () {
			this.$fxAppTabs.onTabBeforeDeactivated(() => {
				return this.verificationDetails()
			}, this)
		},
		async add (moveBillCreateType) {
			const businessDate = this.$fxUtils.setDateTime(new Date())
			const { currentOrgan, currentUser } = await this.getListData()
			let billType = null
			let applyMode = null
			let organId = ''
			let otherOrganId = ''
			let storeSelectList = []
			let outStoreSelectList = []
			let btnAuth = {}
			const inOrgan = this.$fxUtils.getSelectTagById(currentOrgan.id, this.organSelectList)
			switch (moveBillCreateType) {
			case 'instore':
				billType = 3001
				applyMode = 0
				organId = inOrgan.id
				storeSelectList = this.getStoreList(this.organSelectList, organId)
				btnAuth = {
					agree: true,
					inHouse: true,
					inMode: true,
					outHouse: false,
					outMode: false,
					recheck: false,
					reject: false,
					uncheck: false
				}
				break
			case 'outstore':
				billType = 3001
				applyMode = 1
				otherOrganId = inOrgan.id
				outStoreSelectList = this.getStoreList(this.organSelectList, otherOrganId)
				btnAuth = {
					agree: true,
					inHouse: false,
					inMode: false,
					outHouse: true,
					outMode: true,
					recheck: false,
					reject: false,
					uncheck: false
				}
				break
			case 'inside':
				billType = 3002
				organId = inOrgan.id
				otherOrganId = inOrgan.id
				storeSelectList = this.getStoreList(this.organSelectList, organId)
				btnAuth = {
					agree: true,
					inHouse: true,
					inMode: true,
					outHouse: true,
					outMode: true,
					recheck: false,
					reject: false,
					uncheck: false
				}
				break
			}
			this.storeSelectList = storeSelectList
			this.outStoreSelectList = outStoreSelectList
			this.organDetails = {
				organ: {
					id: organId
				},
				otherOrgan: {
					id: otherOrganId
				},
				inHouse: {
					id: ''
				},
				otherHouse: {
					id: ''
				},
				operateMan: {
					id: currentUser.id
				},
				singleInHouseFlag: 0,
				singleOutHouseFlag: 0,
				allotFlag: 0,
				businessDate,
				billState: 0,
				sysBillCode: '',
				userBillCode: this.$fxUtils.createBillCode('DB'),
				billType,
				moveState: 0,
				applyMode,
				billBizTypeId: '',
				carriageFee: 0,
				balanceFlag: 0,
				memo: '',
				appendixList: [],
				details: [],
				autoType: 0
			}
			await this.getBusinessTypeList(this.organDetails)
			this.fxCache.clear()
			this.tableDetails = []
			this.btnAuth = btnAuth
			this.fxDataVerification.resetData(this.organDetails)
			this.$nextTick(() => {
				this.$refs.basicInfo.defaultFocus()
			})
		},
		async edit (id) {
			const organDetails = await this.getDetails(id)
			this.$fxAppTabs.setTabTitle({ sysBillCode: organDetails.sysBillCode })
			this.fxCache.clear()
			await this.getListData(organDetails)
			await this.getBtnAuth(organDetails)
			await this.getBusinessTypeList(organDetails)
			this.outStoreSelectList = this.getStoreList(this.organSelectList, organDetails.otherOrgan.id)
			this.getinStoreList(this.organSelectList, organDetails.organ.id)
			this.tableDetails = organDetails.details
			delete organDetails.details
			this.organDetails = organDetails
			this.fxDataVerification.resetData(this.organDetails)
			this.$nextTick(() => {
				if (this.isDisable || this.authDisabled) {
					this.$fxUtils.vDoRefFocus(this, 'refreshBtn')
				} else {
					this.$refs.basicInfo.defaultFocus()
				}
			})
		},
		getDetails (id) {
			return this.$fxApi(`${apiName}.get`, id)
		},
		async getListData (organDetails) {
			return Promise.all([
				this.getCurrentUser(),
				this.getBillTypeSelect(),
				this.getOrganList(organDetails),
				this.getAllOrganList(organDetails),
				this.getAgentList(organDetails)
			]).then(([userData]) => {
				return Promise.resolve(userData)
			})
		},
		getCurrentUser () {
			return this.$fxApi('common.getCurrentUser')
		},
		getAgentList (organDetails) {
			const params = organDetails ? [organDetails.operateMan.id] : []
			return this.$fxApi(`${apiName}.getAgentList`)({ data: params }).then(res => {
				this.agentSelectList = res
				return Promise.resolve(res)
			})
		},
		getBillTypeSelect () {
			return this.$fxApi(`${apiName}.getBilltypeSelect`).then(res => {
				this.billtypeSelect = res
				return Promise.resolve(res)
			})
		},
		getBusinessTypeList (organDetails = this.organDetails) {
			const params = organDetails ? [organDetails.billBizTypeId] : []
			return this.$fxApi(`${apiName}.getBillDetailBizTypeSelect`, organDetails.billType)({ data: params }).then(res => {
				this.businessSelectList = res
				return Promise.resolve(res)
			})
		},
		getOrganList (organDetails) {
			const ids = []
			this.pushCurrentDetailParamId(ids, organDetails, 'organ.id')
			this.pushCurrentDetailParamId(ids, organDetails, 'otherOrgan.id')
			this.pushCurrentDetailParamId(ids, organDetails, 'inHouse.id')
			this.pushCurrentDetailParamId(ids, organDetails, 'otherHouse.id')
			return this.$fxApi(`${apiName}.getOrganTabList`, ids).then(res => {
				this.organSelectList = res
				return Promise.resolve(res)
			})
		},
		getAllOrganList (organDetails) {
			const ids = []
			this.pushCurrentDetailParamId(ids, organDetails, 'organ.id')
			this.pushCurrentDetailParamId(ids, organDetails, 'otherOrgan.id')
			return this.$fxApi(`${apiName}.getAllOrganTabList`, ids).then(res => {
				this.allOrganSelectList = res
				return Promise.resolve(res)
			})
		},
		pushCurrentDetailParamId (ids, detail = {}, key) {
			const id = this.$fxUtils.getObjDeepValue(detail, key)
			if (id) {
				ids.push(id)
			}
		},
		getStoreList (organList, organId) {
			for (let i = 0; i < organList.length; i++) {
				const _organ = organList[i].listData.find(item => {
					return item.id === organId
				})
				if (_organ) {
					return _organ.store
				}
			}
			return []
		},
		async getBtnAuth (organDetails) {
			return this.$fxApi(`${apiName}.getBtnAuth`, organDetails.id).then(res => {
				this.btnAuth = res
				return Promise.resolve(res)
			})
		},
		deleteEmptyBill () {
			if (this.organDetails.id && (this.tableDetails.length === 0 || (this.tableDetails.length === 1 && !this.tableDetails[0].id))) {
				return this.$fxApi(`${apiName}.delEmptyBill`, this.organDetails.id)
			} else {
				return Promise.resolve()
			}
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
				})
			})
		},
		onSaveOrganHandler () {
			if (this.isAdd) {
				const typeName = this.currentApplyType.label
				let logger = this.$fxLogger.createInfo('store-manage.move-order.add', { orderData: this.organDetails, type: typeName })
				return this.$fxApi(`${apiName}.add`)({ data: this.organDetails }).then(res => {
					this.$fxAppTabs.setTabTitle({ sysBillCode: res.sysBillCode })
					this.$fxAppTabs.setTabPathQuery({ openType: 'edit', id: res.id })
					this.$set(this.organDetails, 'id', res.id)
					this.organDetails.createDate = res.createDate
					this.organDetails.createUserName = res.createUserName || ''
					this.organDetails.createMan = res.createMan || ''
					this.organDetails.sysBillCode = res.sysBillCode
					this.organDetails.systemMemo = res.systemMemo || ''
					this.fxDataVerification.resetData(this.organDetails)
					logger = this.$fxLogger.createInfo('store-manage.move-order.add', { orderData: this.organDetails, type: typeName })
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
					const logger = this.$fxLogger.createInfo('store-manage.move-order.update', this.createLoggerParams())
					return this.$fxApi(`${apiName}.save`, this.organDetails.id)({ data: this.organDetails, logger }).then(res => {
						this.getBusinessTypeList(this.organDetails)
						this.fxDataVerification.resetData(this.organDetails)
						return Promise.resolve(res)
					})
				}
			}
		},
		createLoggerParams () {
			const originData = this.fxDataVerification.getOriginData()
			originData.billTypeName = this.$fxTypeMiddleware.getCommonTypeItemByRule('moveBillCreateType')(originData.billType, originData.applyMode).label
			originData.billBizTypeName = this.getNameById(originData.billBizTypeId, this.businessSelectList)
			originData.organName = this.getOrganNameById(originData.organ.id, this.organSelectList)
			originData.inHouseName = this.getNameById(originData.inHouse.id, this.storeSelectList)
			originData.operatorName = this.getNameById(originData.operateMan.id, this.agentSelectList)
			originData.otherOrganName = this.getOrganNameById(originData.otherOrgan.id, this.organSelectList)
			originData.otherHouseName = this.getNameById(originData.otherHouse.id, this.outStoreSelectListComputed)
			const organDetails = this.$fxUtils.deepClone(this.organDetails)
			organDetails.billTypeName = this.currentApplyType.label
			organDetails.billBizTypeName = this.getNameById(organDetails.billBizTypeId, this.businessSelectList)
			organDetails.organName = this.getOrganNameById(organDetails.organ.id, this.organSelectList)
			organDetails.inHouseName = this.getNameById(organDetails.inHouse.id, this.storeSelectList)
			organDetails.operatorName = this.getNameById(organDetails.operateMan.id, this.agentSelectList)
			organDetails.otherOrganName = this.getOrganNameById(organDetails.otherOrgan.id, this.organSelectList)
			organDetails.otherHouseName = this.getNameById(organDetails.otherHouse.id, this.outStoreSelectListComputed)
			return {
				pre: originData,
				cur: organDetails,
				code: organDetails.sysBillCode,
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
		getOrganNameById (id, list) {
			return this.$fxUtils.getSelectTagById(id, list).name || ''
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
			const api = this.isDelete ? 'recyclingDelete' : 'del'
			const del = this.isDelete ? 'recyclingDelete' : 'delete'
			const logger = this.$fxLogger.createInfo(`store-manage.move-order.${del}`, { orderData: this.organDetails })
			return this.$fxApi(`${apiName}.${api}`, this.organDetails.id)({ logger }).then(res => {
				this.fxDataVerification.resetData(this.organDetails)
				return Promise.resolve()
			})
		},
		onRefresh () {
			this.verificationDetails('当前页面存在未保存数据，是否确定刷新操作？').then(() => {
				this.edit(this.organDetails.id)
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
		clearValidate () {
			this.$refs.basicInfo.$refs.form.clearValidate()
		},
		onBasicInstoreChange (basicInStoreId) {
			this.currentBasicInStoreId = basicInStoreId
		},
		onDetailsRefresh () {
			return this.$fxApi(`${apiName}.getDetails`, this.organDetails.id).then(res => {
				this.tableDetails = res
				return Promise.resolve(res)
			})
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
				return this.$refs.mistakeCheck.mistakeCheck('submit').then(this.submitHandler)
			})
		},
		submitHandler () {
			const logger = this.$fxLogger.createInfo('store-manage.move-order.submit', { orderData: this.organDetails })
			return this.$fxApi(`${apiName}.submit`, this.organDetails.id)({ logger }).then(res => {
				this.updateBillState(res)
				this.fxDataVerification.resetData(this.organDetails)
				this.onDetailsRefresh()
				return this.getBtnAuth(this.organDetails)
			})
		},
		onReturnClick () {
			return this.$fxConfirm('是否确定退回？').then(() => {
				const logger = this.$fxLogger.createInfo('store-manage.move-order.return', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.return`, this.organDetails.id)({ logger }).then(res => {
					this.updateBillState(res)
					this.fxDataVerification.resetData(this.organDetails)
					this.onDetailsRefresh()
					return this.getBtnAuth(this.organDetails)
				})
			})
		},
		onCheckClick () {
			if (this.tableDetails.length === 0) {
				return this.$fxMessage.warning('无明细不允许审核，请添加明细')
			}
			return this.beforeAction('是否确定审核？').then(() => {
				if (this.$fxStateMiddleware.isState('billState')(['unSubmit'])(this.organDetails.billState)) {
					return this.$refs.mistakeCheck.mistakeCheck('check').then(this.checkHandler)
				} else {
					return this.checkHandler()
				}
			})
		},
		checkHandler () {
			const api = this.currentApplyType.type !== 'inside' ? 'checkOut' : 'checkIn'
			const logger = this.$fxLogger.createInfo('store-manage.move-order.check', { orderData: this.organDetails })
			return this.$fxApi(`${apiName}.${api}`, this.organDetails.id)({ logger }).then(res => {
				this.updateBillState(res)
				this.onDetailsRefresh()
				this.fxDataVerification.resetData(this.organDetails)
				return this.getBtnAuth(this.organDetails)
			}).catch(err => {
				if (err.code === 1) {
					const errMessage = this.$fxUtils.JSONparse(err.message) || []
					this.$refs.checkErrInfo.open(errMessage)
				} else if (err.code === 3) {
					const errMessage = this.$fxUtils.JSONparse(err.message) || []
					this.$refs.uncheckOrderInfo.open(errMessage)
				} else {
					return this.$fxMessage.error(err.message || '审核失败，请稍后再试')
				}
			})
		},
		onUncheckClick () {
			return this.beforeAction('是否确定反审？').then(this.uncheckHandler)
		},
		uncheckHandler () {
			const api = this.currentApplyType.type === 'production' ? 'uncheckPick' : this.currentApplyType.type !== 'inside' ? 'uncheckOut' : 'uncheckIn'
			const logger = this.$fxLogger.createInfo('store-manage.move-order.uncheck', { orderData: this.organDetails })
			return this.$fxApi(`${apiName}.${api}`, this.organDetails.id)({ logger }).then(res => {
				this.updateBillState(res)
				this.fxDataVerification.resetData(this.organDetails)
				if (this.currentApplyType.type === 'production') {
					this.dialogVisible = false
				} else {
					this.onDetailsRefresh()
				}
				return this.getBtnAuth(this.organDetails)
			}).catch(err => {
				if (err.code === 1) {
					const errMessage = this.$fxUtils.JSONparse(err.message) || []
					this.$refs.checkErrInfo.open(errMessage)
				} else if (err.code === 3) {
					const errMessage = this.$fxUtils.JSONparse(err.message) || []
					this.$refs.uncheckOrderInfo.open(errMessage)
				} else {
					return this.$fxMessage.error(err.message)
				}
			})
		},
		onRecheckClick () {
			return this.beforeAction('是否确定复审？').then(() => {
				const logger = this.$fxLogger.createInfo('store-manage.move-order.recheck', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.recheck`, this.organDetails.id)({ logger }).then(res => {
					this.updateBillState(res)
					this.fxDataVerification.resetData(this.organDetails)
					return this.getBtnAuth(this.organDetails)
				})
			})
		},
		onUnrecheckClick () {
			return this.$fxConfirm('是否确定取消复审？').then(() => {
				const logger = this.$fxLogger.createInfo('store-manage.move-order.unrecheck', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.unrecheck`, this.organDetails.id)({ logger }).then(res => {
					this.updateBillState(res)
					this.fxDataVerification.resetData(this.organDetails)
					return this.getBtnAuth(this.organDetails)
				})
			})
		},
		onAgreenClick () {
			return this.beforeAction('是否确定同意？').then(() => {
				const logger = this.$fxLogger.createInfo('store-manage.move-order.agree', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.agree`, this.organDetails.id)({ logger }).then(res => {
					this.updateBillState(res)
					this.fxDataVerification.resetData(this.organDetails)
					return this.getBtnAuth(this.organDetails)
				}).catch(err => {
					if (err.code === 1) {
						const writteInfo = {
							title: '出库仓库品项库存不足',
							warnFont: '注：以下明细中，出库方库存不足，无法自动执行调拨流程并审核相关单据'
						}
						const errMessage = this.$fxUtils.JSONparse(err.message) || []
						this.$refs.checkErrInfo.open(errMessage, writteInfo)
					} else if (err.code === 3) {
						const errMessage = this.$fxUtils.JSONparse(err.message) || []
						this.$refs.uncheckOrderInfo.open(errMessage)
					} else {
						return this.$fxMessage.error(err.message || '操作失败，请稍后再试')
					}
				})
			})
		},
		onRejectClick () {
			return this.beforeAction('是否确定拒绝？').then(() => {
				const logger = this.$fxLogger.createInfo('store-manage.move-order.reject', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.reject`, this.organDetails.id)({ logger }).then(res => {
					this.updateBillState(res)
					this.fxDataVerification.resetData(this.organDetails)
					return this.getBtnAuth(this.organDetails)
				})
			})
		},
		onMistakeCheck () {
			this.$refs.mistakeCheck.mistakeCheck().then(() => {
				this.$fxMessage.success('未查询到存在问题的数据')
			})
		},
		onMistakeCheckAction (type) {
			if (type === 'submit') {
				this.submitHandler()
			} else {
				this.checkHandler()
			}
		},
		onMistakeClose () {
			this.$refs.detailsInfo.clear()
			this.onDetailsRefresh()
		},
		onInhouseSave () {
			this.onSaveClickHandler().then(this.onDetailsRefresh)
		},
		onOuthouseSave () {
			this.onSaveClickHandler().then(this.onDetailsRefresh)
		},
		updateBillState ({ billState, moveState, recheckState, submitMan = {}, submitDate = '', checkMan = {}, checkDate = '', systemMemo = '' }) {
			this.organDetails.billState = billState
			this.organDetails.moveState = moveState
			this.organDetails.recheckState = recheckState
			this.$set(this.organDetails, 'submitMan', submitMan)
			this.$set(this.organDetails, 'submitDate', submitDate)
			this.$set(this.organDetails, 'checkMan', checkMan)
			this.$set(this.organDetails, 'checkDate', checkDate)
			this.$set(this.organDetails, 'systemMemo', systemMemo)
		},
		goToBillBlank () {
			const id = this.organDetails.parentBill.id
			const type = this.organDetails.parentBill.billClass
			this.$fxGoToBillBlank(type, { id }, 'detail')
		},
		exportModel () {
			this.onSaveClick().then(() => {
				const logger = this.$fxLogger.createInfo('store-manage.move-order.exportModel', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.exportModel`, this.organDetails.id)({ logger }).then(res => {
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
				const logger = this.$fxLogger.createInfo('store-manage.move-order.exportData', { orderData: this.organDetails })
				return this.$fxApi(`${apiName}.exportData`, this.organDetails.id)({ logger }).then(res => {
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
			const logger = this.$fxLogger.createInfo('store-manage.move-order.importModel', { orderData: this.organDetails, name: file.name })
			return this.$fxApi(`${apiName}.importData`, this.organDetails.id)({ data: params, logger })
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
		},
		onPrintClick () {
			const billType = this.currentApplyType.type === 'inside' ? 'ReceivingApply' : 'MoveApply'
			this.$fxGoPrint(billType, this.organDetails.id)
		},
		onCopyClick () {
			const logger = this.$fxLogger.createInfo('store-manage.move-order.copy', { orderData: this.organDetails })
			return this.$fxApi(`${apiName}.copyOrder`, this.organDetails.id)({ logger }).then(res => {
				this.$fxMessage.success('单据复制成功')
				this.$fxAppTabs.tabsPush({
					path: 'moveOrderDetail',
					query: {
						openType: 'edit',
						id: res.id
					}
				})
			})
		},
		onClearDetailsOutstore () {
			const logger = this.$fxLogger.createInfo('store-manage.move-order.clearDetailsOutstore', { orderData: this.organDetails })
			return this.$fxApi(`${apiName}.clearDetailsOutstore`, this.organDetails.id)({ logger }).then(res => {
				return this.onDetailsRefresh()
			})
		},
		onClearDetailsInstore () {
			const logger = this.$fxLogger.createInfo('store-manage.move-order.clearDetailsInstore', { orderData: this.organDetails })
			return this.$fxApi(`${apiName}.clearDetailsInstore`, this.organDetails.id)({ logger }).then(res => {
				return this.onDetailsRefresh()
			})
		},
		onBillChainClick () {
			return this.$fxApi(`${apiName}.getBillChain`, this.organDetails.id).then(res => {
				this.billChainData = res
				const billData = {
					businessDate: this.organDetails.businessDate,
					sysBillCode: this.organDetails.sysBillCode,
					billState: this.organDetails.billState,
					moveState: this.organDetails.moveState,
					id: this.organDetails.id,
					billClass: 'MoveApply',
					currentBill: true
				}
				this.$refs.billChain.open(billData)
			})
		},
		appVisibleHandler () {
			this.fxCache.clear()
			this.getBusinessTypeList(this.organDetails)
			this.getBillTypeSelect()
			this.getAgentList(this.organDetails)
			this.getAllOrganList(this.organDetails)
			this.getOrganList(this.organDetails).then(this.updateStoreList)
		},
		updateStoreList (organList) {
			if (this.organDetails.organ.id) {
				this.getinStoreList(organList, this.organDetails.organ.id)
			}
			if (this.organDetails.otherOrgan.id) {
				this.outStoreSelectList = this.getStoreList(organList, this.organDetails.otherOrgan.id)
			}
		},
		getinStoreList (organList, organId) {
			if (this.isChecked && this.currentApplyType.type === 'outstore' && this.tableDetails.length > 0) {
				if (this.organDetails.singleInHouseFlag === 1) {
					const itemIdList = this.tableDetails.map(item => {
						return item.item.id
					})
					this.getValidOrganItemInStore(itemIdList, this.organDetails.inHouse.id).then(res => {
						this.storeSelectList = res
					})
				} else {
					this.$nextTick(() => {
						if (this.$refs.detailsInfo.isRowEditing()) {
							const itemIdList = [this.$refs.detailsInfo.getEditingRowData().item.id]
							this.getValidOrganItemInStore(itemIdList, this.$refs.detailsInfo.getEditingRowData().inHouse.id).then(res => {
								this.storeSelectList = res
							})
						}
					})
				}
			} else {
				this.storeSelectList = this.getStoreList(organList, organId)
			}
		},
		async getValidOrganItemInStore (itemIdList, mustShowHouseId) {
			const data = {
				organId: this.organDetails.organ.id,
				itemIdList: itemIdList
			}
			if (mustShowHouseId) {
				data.mustShowHouseIdList = [mustShowHouseId]
			}
			const storeSelectList = await this.$fxApi(`${apiName}.getValidOrganItemInStoreList`)({ data })
			return Promise.resolve(storeSelectList)
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
