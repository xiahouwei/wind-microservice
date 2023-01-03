<template>
	<div class="import-container">
		<step :step="step"></step>
		<importStep1
			ref="importStep1"
			v-show="step === 0"
			:file.sync="file"
		></importStep1>
		<importStep2
			ref="importStep2"
			v-show="step === 1"
			:errorData="errorData"
		></importStep2>
		<importStep3
			ref="importStep3"
			v-show="step === 2"
		></importStep3>
		<div class="foot-btn">
			<el-button v-show="step === 1" class="order-btn" type="defalut" plain @click="onPreviousClick">上一步</el-button>
			<el-button v-fx-auth:system-setting_import-manage.import-basic="step !== 2" :disabled="errorData.length !== 0" class="order-btn" type="primary" @click="onNextClick">下一步</el-button>
    </div>
	</div>
</template>
<script>
import step from './step/Index.vue'
import importStep1 from './import-step1/Index.vue'
import importStep2 from './import-step2/Index.vue'
import importStep3 from './import-step3/Index.vue'
import { apiName } from '../../Index.vue'
export default {
	name: 'importContainer',
	components: {
		step,
		importStep1,
		importStep2,
		importStep3
	},
	data () {
		return {
			step: 0,
			file: null,
			errorData: []
		}
	},
	methods: {
		onPreviousClick () {
			this.errorData = []
			this.step--
		},
		onNextClick () {
			if (this.step === 0 && !this.$refs.importStep1.checkedDatas.length) {
				return this.$fxMessage.warning('请设置需要导入的数据')
			} else if (this.step === 0 && this.file === null) {
				return this.$fxMessage.warning('请先上传文件')
			}	else if (this.step === 0) {
				return this.checkFileChange().then(this.onImportData)
			} else if (this.step === 1) {
				this.step = 2
				this.$refs.importStep3.onUpload(this.file.name)
			}
		},
		onImportData () {
			const params = {
				excelFile: this.file,
				param: this.$refs.importStep1.checkedDatas
			}
			const logger = this.$fxLogger.createInfo('system-setting.import-manage.importData', { name: this.file.name })
			this.$fxApi(`${apiName}.importData`)({ data: params, logger }).then(this.onCheckData).catch(res => {
				if (res.data) {
					this.errorData = res.data
					this.step = 1
					this.$fxMessage.error('基本档案存在错误信息，请修改后重试！')
				} else if (res.message) {
					this.$fxMessage.error(res.message)
				}
			})
		},
		onCheckData () {
			const logger = this.$fxLogger.createInfo('system-setting.import-manage.checkData', { name: this.file.name })
			return this.$fxApi(`${apiName}.checkData`)({ logger }).then(res => {
				this.errorData = []
				this.step = 1
			})
		},
		checkFileChange () {
			return new Promise(resolve => {
				this.file.slice(0, 1).arrayBuffer()
					.then(() => {
						resolve()
					})
					.catch(() => {
						this.$fxMessage.error('本地文件已被修改，请重新上传！')
						this.file = null
					})
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.import-container {
	width 80%
	.foot-btn {
		display flex
		justify-content center
		.order-btn {
			width 100px
		}
	}
}
</style>
