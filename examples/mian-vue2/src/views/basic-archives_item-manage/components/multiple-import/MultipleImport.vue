<template>
	<w-dialog
		v-model="dialogVisible"
		title="导入"
		width="300px"
	>
		<el-tabs v-model="excelType">
			<el-tab-pane label="可存放仓库" name="house"></el-tab-pane>
			<el-tab-pane label="默认货位" name="location"></el-tab-pane>
		</el-tabs>
		<div class="create-area">
			<el-button type="primary" @click="onImportClick">导入数据</el-button>
			<el-button type="primary" @click="onExportClick">导出模板</el-button>
		</div>
	</w-dialog>
</template>
<script>
export default {
	name: 'multipleImport',
	props: {
		selectRowsArr: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	data () {
		return {
			dialogVisible: false,
			excelType: 'house'
		}
	},
	methods: {
		open () {
			this.excelType = 'house'
			this.dialogVisible = true
		},
		onImportClick () {
			this.$fxUpload({ type: 'excel' }).then(this.importExcelHandler).then(this.confirmWrongData)
		},
		importExcelHandler (file) {
			const params = {
				excelFile: file
			}
			const logger = this.$fxLogger.createInfo('basic-archives.item-manage.importModel', { name: file.name })
			return this.$fxApi('item.importData', this.excelType)({ data: params, logger })
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
			if (this.selectRowsArr.length === 0) {
				this.$fxMessage.warning('请选择一条明细')
				return false
			}
			if (this.selectRowsArr.length > 20) {
				this.$fxMessage.warning('最多导出20条明细')
				return false
			}
			const logger = this.$fxLogger.createInfo('basic-archives.item-manage.exportModel')
			return this.$fxApi('item.exportModel', this.excelType)({ data: this.selectRowsArr, logger }).then(res => {
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
>>>.el-tabs__nav-wrap::after {
	width: 0
}
</style>
