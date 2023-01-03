<template>
	<div class="create-organ">
		<step :step="step"></step>
		<listContainerStep1
			ref="listContainerStep1"
			@nextStep="nextStep"
			v-show="step===0"
		></listContainerStep1>
		<listContainerStep2
			ref="listContainerStep2"
			:step2ids="step2ids"
			@nextStep="nextStep"
			@onLastStep="toStep1"
			v-show="step===1"
		></listContainerStep2>
		<listContainerStep3
			ref="listContainerStep3"
			v-show="step===2"
			@toStep1="toStep1"
		></listContainerStep3>
	</div>
</template>
<script>
import step from './step/Index.vue'
import listContainerStep1 from './list-container-step1/Index.vue'
import listContainerStep2 from './list-container-step2/Index.vue'
import listContainerStep3 from './list-container-step3/Index.vue'
export const apiName = 'stockPlanAssign'
export default {
	name: 'createOrgan',
	components: {
		step,
		listContainerStep1,
		listContainerStep2,
		listContainerStep3
	},
	data () {
		return {
			step: 0,
			step2ids: []
		}
	},
	methods: {
		initData () {
			this.$refs.listContainerStep1.refresh(this.$route.query)
			this.$fxRouter.clearRouterQuery()
		},
		nextStep (data, sysBillCodes) {
			this.step++
			if (this.step === 1) {
				this.step2ids = data
				this.$refs.listContainerStep2.resetFilter()
				this.$refs.listContainerStep2.initSelect()
				this.$refs.listContainerStep2.sysBillCodes = sysBillCodes
				this.$nextTick(() => {
					this.$refs.listContainerStep2.getListData(true, true)
				})
			} else {
				this.$refs.listContainerStep3.getListData(data)
			}
		},
		toStep1 () {
			this.step = 0
			this.initData()
		},
		assignOneOrder (data) {
			this.step = 0
			this.$fxRouter.clearRouterQuery()
			this.nextStep([data.id], [data.sysBillCode])
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
	padding 0 20px
}
</style>
