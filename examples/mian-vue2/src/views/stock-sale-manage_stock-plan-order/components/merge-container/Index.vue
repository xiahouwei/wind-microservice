<template>
	<w-dialog
		v-model="dialogVisible"
		width="750px"
		title="合并采购计划单"
		heightFullscreen
		:beforeClose="onBeforeClose"
		@close="onRefresh"
	>
		<div class="merge-organ">
			<w-scroll-bar>
				<basicInfo
					ref="basicInfo"
					:visibleFlag="dialogVisible"
					:organDetails="organDetails"
					:businessTypeSelectList="businessSelectList"
					:agentSelectList="agentSelectList"
					@on-refresh-bussiness-type-list="getBusinessList"
				></basicInfo>
				<appendInfo
					:visibleFlag="dialogVisible"
					:organDetails="organDetails"
				></appendInfo>
			</w-scroll-bar>
		</div>
		<template slot="footer">
			<el-button
				ref="cancelBtn"
				v-fx-tab:loop.stock-sale-manage_stock-plan-order_merge.cancelBtn
				@click="onCancelClick"
			>取消</el-button>
			<fx-button
				ref="saveBtn"
				type="save"
				v-fx-tab:loop.stock-sale-manage_stock-plan-order_merge.saveBtn
				@click="onSaveClick"
			>生成采购计划单</fx-button>
		</template>
	</w-dialog>
</template>
<script>
import basicInfo from './BasicInfo.vue'
import appendInfo from './AppendInfo.vue'
import { apiName } from '../../Index.vue'
export default {
	name: 'mergeOrgan',
	components: {
		basicInfo,
		appendInfo
	},
	data () {
		return {
			dialogVisible: false,
			organDetails: {},
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			businessSelectList: [],
			agentSelectList: [],
			operateManId: '',
			mergeOrderIds: [],
			codes: [],
			mergeFinished: false
		}
	},
	provide () {
		return {
			$$orderParent: this
		}
	},
	created () {
		this.$fxTabkey.init('stock-sale-manage_stock-plan-order_merge', this)
	},
	methods: {
		async open (mergeOrderData, mergeOrderIds, organData, codes) {
			await this.getListDataEdit()
			this.organDetails = {
				userBillCode: this.$fxUtils.createBillCode('CJ'),
				billBizTypeId: '',
				billType: 6000,
				applyDate: mergeOrderData.applyDate,
				operator: this.operateManId,
				memo: mergeOrderData.memo ? mergeOrderData.memo.slice(0, 300) : '',
				appendixList: mergeOrderData.appendixList,
				linkman: mergeOrderData.linkman,
				phone: mergeOrderData.phone,
				deliveryAddr: mergeOrderData.deliveryAddr,
				organ: mergeOrderData.organ,
				organId: mergeOrderData.organ.id,
				stockPlanId: mergeOrderData.stockPlanId ? mergeOrderData.stockPlanId : ''
			}
			this.mergeOrderIds = mergeOrderIds
			this.codes = codes
			this.fxDataVerification.resetData(this.organDetails)
			this.mergeFinished = false
			this.dialogVisible = true
			this.$nextTick(() => {
				this.$refs.basicInfo.defaultFocus()
			})
		},
		getListDataEdit () {
			return Promise.all([
				this.getCurrentUser(),
				this.getBusinessList(),
				this.getAgentList()
			])
		},
		getCurrentUser () {
			return this.$fxApi('common.getCurrentUser').then(res => {
				this.operateManId = res.currentUser.id
				return Promise.resolve(res)
			})
		},
		getAgentList () {
			return this.$fxApi('common.getAgentList').then(res => {
				this.agentSelectList = res
				return Promise.resolve(res)
			})
		},
		getBusinessList () {
			return this.$fxApi(`${apiName}.getBusinessList`).then(res => {
				this.businessSelectList = res
				return Promise.resolve(res)
			})
		},
		onRefresh () {
			this.$emit('on-refresh', this.mergeFinished)
		},
		onSaveClick () {
			this.$refs.basicInfo.validate().then(this.checkAppendices).then(this.onSaveOrganHandler).then(res => {
				this.$fxAppTabs.tabsPush({
					path: 'stockPlanOrderDetail',
					query: {
						openType: 'edit',
						id: res.id
					}
				})
			}).catch(res => {})
		},
		checkAppendices () {
			if (this.organDetails.appendixList.length > 9) {
				this.$fxMessage.warning('附件数量不得大于9个，请删除！')
				return Promise.reject(new Error())
			} else {
				return Promise.resolve()
			}
		},
		onSaveOrganHandler () {
			const params = {
				billIds: this.mergeOrderIds,
				appendixList: this.organDetails.appendixList
			}
			const oldBillCodes = this.codes.map(item => item)
			let logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan-order.mergeBill', { oldBillCodes })
			return this.$fxApi(`${apiName}.saveMergeOrder`)({ data: { ...params, ...this.organDetails } }).then(res => {
				logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan-order.mergeBill', { oldBillCodes, newOrderData: res })
				const loggerInfo = this.$fxLogger.actionInfo(logger)
				loggerInfo.success()
				this.mergeFinished = true
				this.dialogVisible = false
				return Promise.resolve(res)
			}).catch(error => {
				const loggerInfo = this.$fxLogger.actionInfo(logger)
				loggerInfo.error(error.message)
			})
		},
		onCancelClick () {
			this.verificationDetails().then(() => {
				this.dialogVisible = false
			})
		},
		verificationDetails () {
			return this.fxDataVerification.checkComfirm(this.organDetails)
		},
		onBeforeClose (close) {
			this.verificationDetails().then(close)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.merge-organ {
	flex: 1
	display: flex;
	flex-direction: column;
	overflow: auto;
}
</style>
