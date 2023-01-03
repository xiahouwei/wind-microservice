<template>
	<div>
		<mistakeCheckStep1
			ref="mistakeCheckStep1"
			:organDetails="organDetails"
			:actionText="actionText"
			:actionType="actionType"
			:systemParamAmountNegative="systemParamAmountNegative"
			@on-finish="onFinish"
			@on-mistake-close="onMistakeClose"
		></mistakeCheckStep1>
		<mistakeCheckStep2
			ref="mistakeCheckStep2"
			:organDetails="organDetails"
			:actionText="actionText"
			:actionType="actionType"
			:systemParamAmountNegative="systemParamAmountNegative"
			@on-finish="onFinish"
			@on-mistake-close="onMistakeClose"
		></mistakeCheckStep2>
		<mistakeCheckStep3
			ref="mistakeCheckStep3"
			:organDetails="organDetails"
			:actionText="actionText"
			:actionType="actionType"
			:systemParamAmountNegative="systemParamAmountNegative"
			@on-finish="onFinish"
			@on-mistake-close="onMistakeClose"
		></mistakeCheckStep3>
		<mistakeCheckStep4
			ref="mistakeCheckStep4"
			:organDetails="organDetails"
			:actionText="actionText"
			:actionType="actionType"
			:systemParamAmountNegative="systemParamAmountNegative"
			@on-finish="onFinish"
			@on-mistake-close="onMistakeClose"
		></mistakeCheckStep4>
    <mistakeCheckStep5
			ref="mistakeCheckStep5"
			:organDetails="organDetails"
			:actionText="actionText"
			:actionType="actionType"
			:systemParamAmountNegative="systemParamAmountNegative"
			@on-finish="onFinish"
			@on-mistake-close="onMistakeClose"
		></mistakeCheckStep5>
		<mistakeCheckStep6
			ref="mistakeCheckStep6"
			:organDetails="organDetails"
			:actionText="actionText"
			:actionType="actionType"
			:systemParamAmountNegative="systemParamAmountNegative"
			@on-finish="onFinish"
			@on-mistake-close="onMistakeClose"
		></mistakeCheckStep6>
		<mistakeCheckStep7
			ref="mistakeCheckStep7"
			:organDetails="organDetails"
			:actionText="actionText"
			:actionType="actionType"
			:systemParamAmountNegative="systemParamAmountNegative"
			@on-finish="onFinish"
			@on-mistake-close="onMistakeClose"
		></mistakeCheckStep7>
		<mistakeCheckStep8
			ref="mistakeCheckStep8"
			:organDetails="organDetails"
			:actionText="actionText"
			:actionType="actionType"
			:systemParamAmountNegative="systemParamAmountNegative"
			@on-finish="onFinish"
			@on-mistake-close="onMistakeClose"
		></mistakeCheckStep8>
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
import mistakeCheckStep7 from './MistakeCheck7.vue'
import mistakeCheckStep8 from './MistakeCheck8.vue'
export default {
	name: 'mistakeCheck',
	components: {
		mistakeCheckStep1,
		mistakeCheckStep2,
		mistakeCheckStep3,
		mistakeCheckStep4,
		mistakeCheckStep5,
		mistakeCheckStep6,
		mistakeCheckStep7,
		mistakeCheckStep8
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
			isCommonTypeByRules: this.$fxTypeMiddleware.isCommonType('outStoreBillGenerateType', 'rules')
		}
	},
	computed: {
		...mapGetters(['getSysParams', 'getOrderMistakeCheckList']),
		systemParamAmountNegative () {
			return this.getSysParams('KCGL_FKC', 'value')
		},
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
		isMove () {
			return this.isCommonTypeByRules('move')(this.organDetails.billType, this.organDetails.subBillType)
		},
		computedMistakeList () {
			if (this.isMove) {
				if (this.systemParamAmountNegative) {
					return this.getOrderMistakeCheckList('OutStore', ['ZeroAmount', 'StockFkc', 'DistributionMarkNull'])
				} else {
					return this.getOrderMistakeCheckList('OutStore', ['ZeroAmount', 'DistributionMarkNull'])
				}
			} else {
				if (this.systemParamAmountNegative) {
					return this.getOrderMistakeCheckList('OutStore', ['ZeroAmount', 'Repeat', 'RelAllGoods', 'StockFkc', 'ZeroSalesPrice', 'DiffPrice', 'DistributionMarkNull'])
				} else {
					return this.getOrderMistakeCheckList('OutStore', ['ZeroAmount', 'Repeat', 'RelAllGoods', 'ZeroSalesPrice', 'DiffPrice', 'DistributionMarkNull'])
				}
			}
		}
	},
	methods: {
		mistakeCheck (type = 'save', mistakeCheckList, flag) {
			this.actionType = type
			if (!this.$fxUtils.isDef(mistakeCheckList)) {
				this.mistakeList = this.$fxUtils.deepClone(this.computedMistakeList)
			}
			return this.checkMistake(mistakeCheckList, flag).then(this.openMistakeCheckDialog)
		},
		checkMistake (data = this.computedMistakeList, flag) {
			return this.$fxApi('outStore.checkMistake', this.organDetails.id, flag)({ data })
		},
		openMistakeCheckDialog (data) {
			return new Promise(resolve => {
				switch (data.minStep) {
				case 'ZeroAmount':
					this.$refs.mistakeCheckStep1.open(data.errorDetailList)
					break
				case 'Repeat':
					this.$refs.mistakeCheckStep2.open(data.errorDetailList)
					break
				case 'RelAllGoods':
					this.$refs.mistakeCheckStep6.open(data.errorDetailList)
					break
				case 'StockFkc':
					this.$refs.mistakeCheckStep7.open(data.errorDetailList)
					break
				case 'ZeroSalesPrice':
					this.$refs.mistakeCheckStep3.open(data.errorDetailList)
					break
				case 'DiffPrice':
					this.$refs.mistakeCheckStep4.open(data.errorDetailList)
					break
				case 'SalesPriceLessThanCostPrice':
					this.$refs.mistakeCheckStep5.open(data.errorDetailList)
					break
				case 'DistributionMarkNull':
					this.$refs.mistakeCheckStep8.open(data.errorDetailList)
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
			return this.$fxApi('outStore.getDetails', this.organDetails.id).then(res => {
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
