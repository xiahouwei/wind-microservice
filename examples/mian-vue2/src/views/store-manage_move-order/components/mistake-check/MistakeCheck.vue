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
	</div>
</template>
<script>
import mistakeCheckStep1 from '../mistake-check/MistakeCheckStep1.vue'
import mistakeCheckStep2 from '../mistake-check/MistakeCheckStep2.vue'
import mistakeCheckStep3 from '../mistake-check/MistakeCheckStep3.vue'
import { apiName } from '../../Index.vue'
const DEFAULT_MISTAKE_LIST = ['ZeroAmount', 'Belong', 'Repeat']
export default {
	name: 'mistakeCheck',
	components: {
		mistakeCheckStep1,
		mistakeCheckStep2,
		mistakeCheckStep3
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
		mistakeCheck (type = 'save', mistakeCheckList) {
			this.actionType = type
			if (!this.$fxUtils.isDef(mistakeCheckList)) {
				this.mistakeList = this.$fxUtils.deepClone(this.computedMistakeList)
			}
			return this.checkMistake(mistakeCheckList).then(this.openMistakeCheckDialog)
		},
		checkMistake (data = this.computedMistakeList) {
			return this.$fxApi(`${apiName}.checkMistake`, this.organDetails.id)({ data })
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
				case 'Belong':
					this.$refs.mistakeCheckStep3.open(data.errorDetailList)
					break
				default:
					resolve()
				}
			})
		},
		onFinish (mistakeType) {
			const mistakeCheckList = this.getMistakeCheckList(mistakeType)
			this.doDetailsRefresh().then(() => {
				this.mistakeCheck(this.actionType, mistakeCheckList).then(() => {
					if (this.actionType !== 'save') {
						this.$emit('on-action', this.actionType)
					} else {
						this.$fxMessage.success('当前数据全部正确')
					}
				})
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
			return this.$fxApi(`${apiName}.getDetails`, this.organDetails.id).then(res => {
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
