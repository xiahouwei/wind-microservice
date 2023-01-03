<template>
	<div>
		<mistakeCheckStep1
			ref="mistakeCheckStep1"
			:organDetails="organDetails"
			:actionText="actionText"
			:actionType="actionType"
			@on-finish="onFinish"
			@on-mistake-close="onMistakeClose"
		></mistakeCheckStep1>
		<mistakeCheckStep2
			ref="mistakeCheckStep2"
			:organDetails="organDetails"
			:actionText="actionText"
			:actionType="actionType"
			@on-finish="onFinish"
			@on-mistake-close="onMistakeClose"
		></mistakeCheckStep2>
		<mistakeCheckStep3
			ref="mistakeCheckStep3"
			:organDetails="organDetails"
			:actionText="actionText"
			:actionType="actionType"
			@on-finish="onFinish"
			@on-mistake-close="onMistakeClose"
		></mistakeCheckStep3>
		<mistakeCheckStep4
			ref="mistakeCheckStep4"
			:organDetails="organDetails"
			:actionText="actionText"
			:actionType="actionType"
			@on-finish="onFinish"
			@on-mistake-close="onMistakeClose"
		></mistakeCheckStep4>
    <mistakeCheckStep5
			ref="mistakeCheckStep5"
			:organDetails="organDetails"
			:actionText="actionText"
			:actionType="actionType"
			@on-finish="onFinish"
			@on-mistake-close="onMistakeClose"
		></mistakeCheckStep5>
	</div>
</template>
<script>
import mistakeCheckStep1 from './MistakeCheck1.vue'
import mistakeCheckStep2 from './MistakeCheck2.vue'
import mistakeCheckStep3 from './MistakeCheck3.vue'
import mistakeCheckStep4 from './MistakeCheck4.vue'
import mistakeCheckStep5 from './MistakeCheck5.vue'
const DEFAULT_MISTAKE_LIST = ['RelAllGoods', 'ZeroAmount', 'RepeatItem', 'ZeroPrice', 'DiffPrice']
export default {
	name: 'mistakeCheck',
	components: {
		mistakeCheckStep1,
		mistakeCheckStep2,
		mistakeCheckStep3,
		mistakeCheckStep4,
		mistakeCheckStep5
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
			mistakeList: []
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
		}
	},
	methods: {
		mistakeCheck (type = 'save', mistakeCheckList, flag) {
			this.actionType = type
			if (!this.$fxUtils.isDef(mistakeCheckList)) {
				this.mistakeList = this.$fxUtils.deepClone(this.computedMistakeList)
			}
			if (this.organDetails.billType === 1006 && !this.$fxUtils.isDef(mistakeCheckList)) {
				this.mistakeList = this.computedMistakeList.slice(0, 4)
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
