<template>
	<w-dialog
		v-model="dialogVisible"
		title="导入"
		width="300px"
	>
		<div class="create-area">
			<el-button type="primary" @click="onImportClick">导入{{bomType}}成本卡</el-button>
			<el-button type="primary" @click="onExportClick">导出模板</el-button>
		</div>
	</w-dialog>
</template>
<script>
export default {
	name: 'multipleImport',
	props: {
		importId: {
			type: String,
			default: ''
		},
		type: {
			type: String,
			default: ''
		}
	},
	data () {
		return {
			dialogVisible: false
		}
	},
	computed: {
		bomType () {
			switch (this.type) {
			case 'food_bom':
				return '菜品'
			case 'compose_bom':
				return '组合'
			case 'split_bom':
				return '拆分'
			default:
				return ''
			}
		}
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
			const bomType = this.type.split('_')[0]
			const logger = this.$fxLogger.createInfo('basic-archives.bom.importModel', { name: file.name })
			return this.$fxApi('bom.importData', bomType)({ data: params, logger })
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
				if (this.importId) {
					this.$emit('on-refresh', this.importId)
				}
			}
		},
		onExportClick () {
			const logger = this.$fxLogger.createInfo('basic-archives.bom.exportModel')
			const bomType = this.type.split('_')[0]
			return this.$fxApi('bom.exportModel', bomType)({ logger }).then(res => {
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
	width 100%
	height 110px
	box-sizing: border-box
	.el-button {
		width 116px
		margin-left 0
		margin-bottom 20px
	}
}
</style>
