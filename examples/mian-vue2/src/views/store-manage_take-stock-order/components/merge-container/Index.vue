<template>
	<w-dialog
		v-model="dialogVisible"
		title="合并盘点单"
		fullscreen
		:beforeClose="onBeforeClose"
		@close="onRefresh"
	>
		<div class="merge-organ">
			<w-scroll-bar :flex="isFullScreen">
				<basicInfo
					ref="basicInfo"
					:visibleFlag="dialogVisible"
					:organDetails="organDetails"
					:businessTypeSelectList="businessSelectList"
					:agentSelectList="agentSelectList"
					@on-refresh-bussiness-type-list="getBusinessTypeList"
				></basicInfo>
				<detailsInfo
					ref="detailsInfo"
					:visibleFlag="dialogVisible"
					:tableDetails="tableDetails"
				></detailsInfo>
				<appendInfo
					:visibleFlag="dialogVisible"
					:organDetails="organDetails"
				></appendInfo>
			</w-scroll-bar>
		</div>
		<template slot="footer">
			<el-button
				ref="cancelBtn"
				v-fx-tab:loop.store-manage_take-stock-order_merge.cancelBtn
				@click="onCancelClick"
			>取消</el-button>
			<fx-button
				ref="saveBtn"
				type="save"
				v-fx-tab:loop.store-manage_take-stock-order_merge.saveBtn
				@click="onSaveClick"
			>生成盘点单</fx-button>
		</template>
	</w-dialog>
</template>
<script>
import basicInfo from './BasicInfo.vue'
import appendInfo from './AppendInfo.vue'
import detailsInfo from './DetailsInfo.vue'
import { apiName } from '../../Index.vue'
export default {
	name: 'mergeOrgan',
	components: {
		basicInfo,
		appendInfo,
		detailsInfo
	},
	data () {
		return {
			dialogVisible: false,
			organDetails: {},
			tableDetails: [],
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			isFullScreen: false,
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
		this.$fxTabkey.init('store-manage_take-stock-order_merge', this)
	},
	methods: {
		async open (mergeOrderData, mergeOrderIds, organData, codes) {
			await this.getListDataEdit()
			this.organDetails = {
				userBillCode: this.$fxUtils.createBillCode('PD'),
				billBizTypeId: '',
				billType: 4001,
				businessDate: mergeOrderData.businessDate,
				operateMan: {
					id: this.operateManId
				},
				memo: mergeOrderData.memo ? mergeOrderData.memo.slice(0, 300) : '',
				notCheck: 0,
				appendices: mergeOrderData.appendices,
				checkWay: organData.checkWay,
				checkClass: { id: organData.checkClassId },
				house: { id: organData.houseId },
				organ: { id: organData.organId }
			}
			this.mergeOrderIds = mergeOrderIds
			this.codes = codes
			this.tableDetails = mergeOrderData.details
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
				this.getBusinessTypeList(),
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
		getBusinessTypeList () {
			return this.$fxApi(`${apiName}.getBillBizTypeSelect`).then(res => {
				this.businessSelectList = res
				return Promise.resolve(res)
			})
		},
		onRefresh () {
			this.$refs.detailsInfo.clear()
			this.$emit('on-refresh', this.mergeFinished)
		},
		onSaveClick () {
			this.$refs.basicInfo.validate().then(this.checkAppendices).then(this.onSaveOrganHandler).catch(res => {})
		},
		checkAppendices () {
			if (this.organDetails.appendices.length > 9) {
				this.$fxMessage.warning('附件数量不得大于9个，请删除！')
				return Promise.reject(new Error())
			} else {
				return Promise.resolve()
			}
		},
		onSaveOrganHandler () {
			this.$refs.detailsInfo.getSelectDetails().then(res => {
				const params = {
					billIds: this.mergeOrderIds,
					main: this.organDetails,
					details: res
				}
				const logger = this.$fxLogger.createInfo('store-manage.take-stock-order.mergeOrder', { oldCodes: this.codes, newCode: this.organDetails.userBillCode })
				this.$fxApi(`${apiName}.saveMergeOrder`)({ data: params, logger }).then(res => {
					this.mergeFinished = true
					this.dialogVisible = false
					return Promise.resolve(res)
				})
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
