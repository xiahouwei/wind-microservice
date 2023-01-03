<template>
	<div>
		<mistakeCheckStep1
			ref="mistakeCheckStep1"
			:organDetails="organDetails"
			:actionText="actionText"
			:actionType="actionType"
			:isInStoreHandWithSupplier="isInStoreHandWithSupplier"
			@on-finish="onFinish"
			@on-mistake-close="onMistakeClose"
		></mistakeCheckStep1>
		<mistakeCheckStep2
			ref="mistakeCheckStep2"
			:organDetails="organDetails"
			:actionText="actionText"
			:actionType="actionType"
			:isInStoreHandWithSupplier="isInStoreHandWithSupplier"
			@on-finish="onFinish"
			@on-mistake-close="onMistakeClose"
		></mistakeCheckStep2>
		<mistakeCheckStep3
			ref="mistakeCheckStep3"
			:organDetails="organDetails"
			:actionText="actionText"
			:actionType="actionType"
			:isInStoreHandWithSupplier="isInStoreHandWithSupplier"
			@on-finish="onFinish"
			@on-mistake-close="onMistakeClose"
		></mistakeCheckStep3>
		<mistakeCheckStep4
			ref="mistakeCheckStep4"
			:organDetails="organDetails"
			:actionText="actionText"
			:actionType="actionType"
			:isInStoreHandWithSupplier="isInStoreHandWithSupplier"
			@on-finish="onFinish"
			@on-mistake-close="onMistakeClose"
		></mistakeCheckStep4>
    <mistakeCheckStep5
			ref="mistakeCheckStep5"
			:organDetails="organDetails"
			:actionText="actionText"
			:actionType="actionType"
			:isInStoreHandWithSupplier="isInStoreHandWithSupplier"
			@on-finish="onFinish"
			@on-mistake-close="onMistakeClose"
		></mistakeCheckStep5>
		<mistakeCheckStep6
			ref="mistakeCheckStep6"
			:organDetails="organDetails"
			:actionText="actionText"
			:actionType="actionType"
			@on-finish="onFinish"
			@on-mistake-close="onMistakeClose"
		></mistakeCheckStep6>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import mistakeCheckStep1 from './MistakeCheck1.vue'
import mistakeCheckStep2 from './MistakeCheck2.vue'
import mistakeCheckStep3 from './MistakeCheck3.vue'
import mistakeCheckStep4 from './MistakeCheck4.vue'
import mistakeCheckStep5 from './MistakeCheck5.vue'
import mistakeCheckStep6 from './MistakeCheck6.vue'
export default {
	name: 'mistakeCheck',
	components: {
		mistakeCheckStep1,
		mistakeCheckStep2,
		mistakeCheckStep3,
		mistakeCheckStep4,
		mistakeCheckStep5,
		mistakeCheckStep6
	},
	props: {
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		tableDetails: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	data () {
		return {
			actionType: '',
			mistakeList: [],
			isCommonTypeByRules: this.$fxTypeMiddleware.isCommonType('inStoreBillGenerateType', 'rules')
		}
	},
	computed: {
		...mapGetters(['getOrderMistakeCheckList']),
		actionText () {
			let text = ''
			switch (this.actionType) {
			case 'submit':
				text = '继续提交'
				break
			case 'check':
				text = '继续审核'
				break
			case 'endcheck':
				text = '继续审核'
				break
			case 'splitcheck':
				text = '继续审核'
				break
			default:
				text = '下一步'
			}
			return text
		},
		computedMistakeList () {
			if (this.isMove) {
				return this.getOrderMistakeCheckList('InStore', ['RelAllGoods', 'ZeroAmount', 'RepeatItem', 'ZeroPrice'])
			} else if (this.isSaleOrderSubOutOrder || this.isStockOrderSubOutOrder) {
				return this.getOrderMistakeCheckList('InStore', ['ZeroAmount'])
			} else if (this.isOutStoreSub) {
				return []
			} else if (this.handReturnSubBlueOrder || this.assigneSaleOrderInStoreOrderReturnSubBlueOrder) {
				return this.getOrderMistakeCheckList('InStore', ['RelAllGoods'])
			} else if (this.isInStoreHandWithSupplier) {
				return this.getOrderMistakeCheckList('InStore')
			} else if (this.isSrmSubInStore) {
				return this.getOrderMistakeCheckList('InStore', ['RelAllGoods', 'RepeatItem', 'ZeroPrice', 'DiffPrice'])
			} else {
				return this.getOrderMistakeCheckList('InStore', ['RelAllGoods', 'ZeroAmount', 'RepeatItem', 'ZeroPrice', 'DiffPrice'])
			}
		},
		isSrmSubInStore () {
			return this.isCommonTypeByRules(['srm-sub-inStore'])(this.organDetails.sourceBillType)
		},
		isMove () {
			return this.isCommonTypeByRules('move')(this.organDetails.billType, this.organDetails.subBillType)
		},
		isOffset () {
			return this.isCommonTypeByRules('offset')(this.organDetails.billType, this.organDetails.subBillType)
		},
		isOutStoreSub () {
			return this.isCommonTypeByRules(['outStore-sub'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		isSaleOrderSubOutOrder () {
			return this.isCommonTypeByRules(['saleOrder-sub-outOrder'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		isStockOrderSubOutOrder () {
			return this.isCommonTypeByRules(['stockOrder-sub-outOrder'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		handReturnSubBlueOrder () {
			return this.isCommonTypeByRules(['handReturn-sub-blueOrder'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		outStoreOrderChildInStoreOrderSubBlueOrder () {
			return this.isCommonTypeByRules(['outStoreOrderChildInStoreOrder-sub-blueOrder'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		assigneSaleOrderInStoreOrderReturnSubBlueOrder () {
			return this.isCommonTypeByRules(['assigneSaleOrderInStoreOrderReturn-sub-blueOrder'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		isHand () {
			return this.isCommonTypeByRules(['normal-sub'])(this.organDetails.billType, this.organDetails.subBillType, this.organDetails)
		},
		isOtherOrganSupplier () {
			return this.$fxTypeMiddleware.isCommonType('allOrganType')('supplier')(this.organDetails.otherOrgan.organType)
		},
		isInStoreHandWithSupplier () {
			return this.isHand && this.isOtherOrganSupplier
		}
	},
	methods: {
		mistakeCheck (type = 'save', mistakeCheckList, flag) {
			this.actionType = type
			if (this.isOffset || this.outStoreOrderChildInStoreOrderSubBlueOrder) return Promise.resolve()
			if (!this.$fxUtils.isDef(mistakeCheckList)) {
				this.mistakeList = this.$fxUtils.deepClone(this.computedMistakeList)
			}
			return this.checkMistake(mistakeCheckList, flag).then(this.openMistakeCheckDialog)
		},
		checkMistake (data = this.mistakeList, flag) {
			return this.$fxApi('inStore.checkMistake', this.organDetails.id, flag)({ data })
		},
		openMistakeCheckDialog (data) {
			return new Promise(resolve => {
				switch (data.minStep) {
				case 'RelAllGoods':
					this.$refs.mistakeCheckStep1.open(data.errorDetailList)
					break
				case 'ZeroAmount':
					this.$refs.mistakeCheckStep2.open(data.errorDetailList)
					break
				case 'RepeatItem':
					this.$refs.mistakeCheckStep3.open(data.errorDetailList)
					break
				case 'ZeroPrice':
					this.$refs.mistakeCheckStep4.open(data.errorDetailList)
					break
				case 'DiffPrice':
					this.$refs.mistakeCheckStep5.open(data.errorDetailList)
					break
				case 'SupplierItem':
					this.$refs.mistakeCheckStep6.open(data.errorDetailList)
					break
				default:
					resolve()
				}
			})
		},
		onFinish (mistakeType) {
			const mistakeCheckList = this.getMistakeCheckList(mistakeType)
			this.mistakeCheck(this.actionType, mistakeCheckList).then(() => {
				if (this.actionType !== 'save') {
					this.$emit('on-action', this.actionType)
				} else {
					this.$fxMessage.success('当前数据全部正确')
				}
			})
		},
		getMistakeCheckList (mistakeType) {
			const index = this.mistakeList.findIndex(item => item === mistakeType)
			if (~index) {
				this.mistakeList.splice(index, 1)
				return this.mistakeList
			} else {
				return this.mistakeList
			}
		},
		doDetailsRefresh () {
			return this.$fxApi('inStore.getDetails', this.organDetails.id).then(res => {
				this.$emit('update:tableDetails', res)
				return Promise.resolve(res)
			})
		},
		onMistakeClose () {
			this.doDetailsRefresh().then(() => {
				this.$emit('on-mistake-close')
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
</style>
