<template>
	<w-dialog v-model="dialogVisible" :width="width[step]" title="批量替换配料" positionCenter @close="onClose" :beforeClose="onBeforeClose">
		<div class="setting-container">
			<step :step="step"></step>
			<replaceMulityStep1
				ref="replaceMulityStep1"
				v-show="step === 0"
				:type="type"
			></replaceMulityStep1>
			<replaceMulityStep2
				ref="replaceMulityStep2"
				v-show="step === 1"
				:type="type"
			></replaceMulityStep2>
		</div>
		<template slot="footer">
			<el-button
				ref="cancelBtn"
				v-fx-tab:loop.basic-archives_bom-set_replace.cancelBtn
				@click="onCancelClick"
			>取消</el-button>
			<el-button
				ref="confirmBtn"
				v-if="step === 0"
				v-fx-tab:loop.basic-archives_bom-set_replace.confirmBtn
				type="primary"
				@click="onConfirmClick"
			>确定</el-button>
			<el-button v-if="step === 1" type="primary" @click="onSaveClick">完成</el-button>
		</template>
	</w-dialog>
</template>
<script>
import step from './Step.vue'
import replaceMulityStep1 from './ReplaceMulityStep1.vue'
import replaceMulityStep2 from './ReplaceMulityStep2.vue'
export default {
	name: 'settingMulity',
	components: {
		step,
		replaceMulityStep1,
		replaceMulityStep2
	},
	props: {
		type: String,
		bomDetail: {
			type: Object,
			default: () => {
				return {
					default: 1
				}
			}
		}
	},
	data () {
		return {
			width: {
				0: '550px',
				1: '1200px'
			},
			dialogVisible: false,
			step: 0,
			fxDataVerification: this.$fxUtils.fxDataVerification()
		}
	},
	created () {
		this.$fxTabkey.init('basic-archives_bom-set_replace', this)
	},
	methods: {
		open () {
			this.step = 0
			this.dialogVisible = true
			this.$nextTick(() => {
				this.$refs.replaceMulityStep1.open()
			})
		},
		onClose () {
			this.$refs.replaceMulityStep1.onClose()
			if (this.step === 1) {
				if (this.bomDetail.id) {
					this.$emit('refresh')
				}
			}
		},
		onCancelClick () {
			if (this.step === 0) {
				this.$refs.replaceMulityStep1.verificationDetails().then(() => {
					this.dialogVisible = false
				})
			} else {
				this.dialogVisible = false
				if (this.bomDetail.id) {
					this.$emit('refresh')
				}
			}
		},
		onConfirmClick () {
			this.$refs.replaceMulityStep1.confirmHandler().then(res => {
				this.step = 1
				this.$refs.replaceMulityStep2.open(res)
			})
		},
		onSaveClick () {
			this.dialogVisible = false
			if (this.bomDetail.id) {
				this.$emit('refresh')
			}
		},
		onBeforeClose (close) {
			if (this.step === 0) {
				this.$refs.replaceMulityStep1.verificationDetails().then(close)
			} else {
				close()
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.setting-container {
	flex 1
	display flex
	flex-direction column
	overflow auto
}
</style>
