<template>
	<div>
		<mistakeCheckStep1
			ref="mistakeCheckStep1"
			:organDetails="organDetails"
			:otherChargeTypeList="otherChargeTypeList"
			:actionText="actionText"
			:actionType="actionType"
			@set-version="setVersion"
			@on-finish="onFinish"
			@on-mistake-close="onMistakeClose"
		></mistakeCheckStep1>
		<mistakeCheckStep2
			ref="mistakeCheckStep2"
			:organDetails="organDetails"
			:otherChargeTypeList="otherChargeTypeList"
			:storeSelectList="storeSelectList"
			:actionText="actionText"
			:actionType="actionType"
			@set-version="setVersion"
			@on-finish="onFinish"
			@on-mistake-close="onMistakeClose"
		></mistakeCheckStep2>
		<mistakeCheckStep3
			ref="mistakeCheckStep3"
			:organDetails="organDetails"
			:otherChargeTypeList="otherChargeTypeList"
			:storeSelectList="storeSelectList"
			:actionText="actionText"
			:actionType="actionType"
			@set-version="setVersion"
			@on-finish="onFinish"
			@on-mistake-close="onMistakeClose"
		></mistakeCheckStep3>
		<mistakeCheckStep4
			ref="mistakeCheckStep4"
			:organDetails="organDetails"
			:otherChargeTypeList="otherChargeTypeList"
			:actionText="actionText"
			:actionType="actionType"
			@set-version="setVersion"
			@on-finish="onFinish"
			@on-mistake-close="onMistakeClose"
		></mistakeCheckStep4>
    <mistakeCheckStep5
			ref="mistakeCheckStep5"
			:organDetails="organDetails"
			:otherChargeTypeList="otherChargeTypeList"
			:storeSelectList="storeSelectList"
			:actionText="actionText"
			:actionType="actionType"
			@set-version="setVersion"
			@on-finish="onFinish"
			@on-mistake-close="onMistakeClose"
		></mistakeCheckStep5>
		<mistakeCheckStep6
			ref="mistakeCheckStep6"
			:organDetails="organDetails"
			:otherChargeTypeList="otherChargeTypeList"
			:actionText="actionText"
			:actionType="actionType"
			@set-version="setVersion"
			@on-finish="onFinish"
			@on-mistake-close="onMistakeClose"
		></mistakeCheckStep6>
	</div>
</template>
<script>
import mistakeCheckStep1 from './MistakeCheck1.vue'
import mistakeCheckStep2 from './MistakeCheck2.vue'
import mistakeCheckStep3 from './MistakeCheck3.vue'
import mistakeCheckStep4 from './MistakeCheck4.vue'
import mistakeCheckStep5 from './MistakeCheck5.vue'
import mistakeCheckStep6 from './MistakeCheck6.vue'
const DEFAULT_MISTAKE_LIST = ['ActualZeroAmount', 'HouseNotHaveNull', 'Belong', 'RepeatItem', 'ProductNotHaveDosing', 'CostZero']
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
		otherChargeTypeList: {
			type: Array,
			default: () => {
				return {}
			}
		},
		storeSelectList: {
			type: Array,
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
		actionText () {
			let text = ''
			switch (this.actionType) {
			case 'submit':
				text = '继续提交'
				break
			case 'check':
				text = '继续审核'
				break
			default:
				text = '下一步'
			}
			return text
		},
		computedMistakeList () {
			return DEFAULT_MISTAKE_LIST
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
		isSaleOrderSub () {
			return this.isCommonTypeByRules(['saleOrder-sub'])(this.organDetails.billType, this.organDetails.subBillType)
		},
		isStockOrderSub () {
			return this.isCommonTypeByRules(['stockOrder-sub'])(this.organDetails.billType, this.organDetails.subBillType)
		}
	},
	methods: {
		mistakeCheck (type = 'save', mistakeCheckList, flag) {
			this.actionType = type
			if (this.isOffset) return Promise.resolve()
			if (!this.$fxUtils.isDef(mistakeCheckList)) {
				this.mistakeList = this.$fxUtils.deepClone(this.computedMistakeList)
			}
			return this.checkMistake(mistakeCheckList, flag).then(this.openMistakeCheckDialog)
		},
		checkMistake (data = this.mistakeList, flag) {
			return this.$fxApi('machiningOrder.checkMistake', this.organDetails.id, flag)({ data })
		},
		openMistakeCheckDialog (data) {
			return new Promise(resolve => {
				switch (data.minStep) {
				case 'ActualZeroAmount':
					this.$refs.mistakeCheckStep1.open(data.errorDetailList)
					break
				case 'HouseNotHaveNull':
					this.$refs.mistakeCheckStep2.open(data.errorDetailList)
					break
				case 'Belong':
					this.$refs.mistakeCheckStep3.open(data.errorDetailList)
					break
				case 'RepeatItem':
					this.$refs.mistakeCheckStep4.open(data.errorDetailList)
					break
				case 'ProductNotHaveDosing':
					this.$refs.mistakeCheckStep5.open(data.errorDetailList)
					break
				case 'CostZero':
					this.$refs.mistakeCheckStep6.open(data.errorDetailList)
					break
				default:
					resolve()
				}
			})
		},
		setVersion (v) {
			this.$emit('set-version', v)
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
			return this.$fxApi('machiningOrder.getDetails', this.organDetails.id).then(res => {
				this.$emit('update:tableDetails', res.details)
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
