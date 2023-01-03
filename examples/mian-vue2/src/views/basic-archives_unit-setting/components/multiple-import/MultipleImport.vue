<template>
	<w-dialog
		v-model="dialogVisible"
		title="导入"
		width="300px"
	>
		<div class="create-area">
			<el-button type="primary" @click="onImportClick">导入单位</el-button>
			<el-button type="primary" @click="onExportClick">导出模板</el-button>
		</div>
	</w-dialog>
</template>
<script>
import { apiName } from '../../Index.vue'
export default {
	name: 'multipleImport',
	props: {
	},
	data () {
		return {
			dialogVisible: false
		}
	},
	computed: {
	},
	methods: {
		open () {
			this.dialogVisible = true
		},
		onImportClick () {
			this.$fxUpload({ type: 'excel' }).then(this.importExcelHandler).then(this.confirmWrongData)
		},
		importExcelHandler (file) {
			const params = {
				excelFile: file
			}
			const logger = this.$fxLogger.createInfo('basic-archives.unit-setting.importModel', { name: file.name })
			return this.$fxApi(`${apiName}.importData`)({ data: params, logger })
		},
		confirmWrongData (res) {
			if (!res.result) {
				this.$fxConfirm({
					message: '导入数据存在错误，是否下载错误信息？',
					option: {
						confirmButtonText: '下载',
						cancelButtonText: '取消',
						closeOnClickModal: false,
						closeOnPressEscape: false,
						closeOnHashChange: false
					}
				}).then(() => {
					this.$fxUtils.downloadFile(res)
				})
			} else {
				this.$emit('on-refresh', true)
			}
		},
		onExportClick () {
			const logger = this.$fxLogger.createInfo('basic-archives.unit-setting.exportModel')
			return this.$fxApi(`${apiName}.exportModel`)({ logger }).then(res => {
				this.$fxUtils.downloadFile(res)
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.create-area {
	display flex
	flex-direction column
	justify-content center
	align-items center
	width: 100%
	height 110px
	box-sizing: border-box
	.el-button {
		margin-left 0
		margin-bottom 20px
	}
}
</style>
