<template>
	<w-dialog v-model="dialogVisible" width="1200px" title="批量设置冲减仓库" heightFullscreen @close="onClose" :beforeClose="onBeforeClose">
		<div class="setting-container">
			<step :step="step"></step>
			<settingMulityStep1
				ref="settingMulityStep1"
				v-show="step === 0"
				:listSelectIds.sync="listSelectIds"
			></settingMulityStep1>
			<settingMulityStep2
				ref="settingMulityStep2"
				v-show="step === 1"
				@on-save="onSaveHandler"
			></settingMulityStep2>
		</div>
		<template slot="footer">
			<el-button @click="onCancelClick">取消</el-button>
			<el-button v-if="step === 0" type="primary" @click="onNextStepClick">下一步</el-button>
			<el-button v-if="step === 1" type="primary" @click="onSaveClick">保存</el-button>
		</template>
	</w-dialog>
</template>
<script>
import step from './Step.vue'
import settingMulityStep1 from './SettingMulityStep1.vue'
import settingMulityStep2 from './SettingMulityStep2.vue'
export default {
	name: 'settingMulity',
	components: {
		step,
		settingMulityStep1,
		settingMulityStep2
	},
	data () {
		return {
			dialogVisible: false,
			step: 0,
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			listSelectIds: []
		}
	},
	methods: {
		open () {
			this.step = 0
			this.listSelectIds = []
			this.dialogVisible = true
			this.$nextTick(() => {
				this.$refs.settingMulityStep1.open()
				this.fxDataVerification.resetData(this.listSelectIds)
			})
		},
		onClose () {
			this.$refs.settingMulityStep1.onClose()
			this.$refs.settingMulityStep2.onClose()
			this.$emit('on-close')
		},
		onCancelClick () {
			this.verificationDetails().then(() => {
				this.dialogVisible = false
			})
		},
		onNextStepClick () {
			if (this.listSelectIds.length === 0) {
				this.$fxMessage.warning('请选择添加品项')
				return false
			}
			const selectItemsName = this.$refs.settingMulityStep1.getSelectItems().map(item => item.name).join(',')
			this.step = 1
			this.$nextTick(() => {
				this.$refs.settingMulityStep2.open(this.listSelectIds, selectItemsName)
			})
		},
		onSaveClick () {
			this.$refs.settingMulityStep2.onSaveClick()
		},
		onSaveHandler () {
			this.dialogVisible = false
		},
		verificationDetails () {
			return this.fxDataVerification.checkComfirm(this.listSelectIds)
		},
		onBeforeClose (close) {
			this.verificationDetails().then(close)
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
