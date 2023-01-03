<template>
	<w-dialog
		v-model="dialogVisible"
		width="1100px"
		title="适用店铺"
		heightFullscreen
		:beforeClose="onBeforeClose"
		@close="onClose"
	>
		<fx-transfer
			ref="transfer"
			v-model="listSelectIds"
			:tableColumn="tableColumn"
			:tableData="tableData"
			leftTitle="全部店铺"
			rightTitle="选定店铺"
		></fx-transfer>
		<template slot="footer">
			<el-button @click="onCancelClick">取消</el-button>
			<el-button type="primary" @click="onSaveClick">保存</el-button>
		</template>
	</w-dialog>
</template>
<script>
export default {
	name: 'connect-store',
	data () {
		return {
			dialogVisible: false,
			itemDetails: {},
			tableColumn: [
				{ prop: 'name', label: '店铺名称', required: true },
				{ prop: 'code', label: '店铺编号', required: true },
				{ prop: 'areaName', label: '地区', required: true, width: '100' },
				{ prop: 'provinceName', label: '省份', required: true, width: '100' },
				{ prop: 'cityName', label: '城市', required: true, width: '100' }
			],
			tableData: [],
			listSelectIds: [],
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			rowDataVerification: this.$fxUtils.fxDataVerification()
		}
	},
	methods: {
		open (item) {
			this.itemDetails = item
			this.refreshConnectList().then(() => {
				this.fxDataVerification.resetData(this.listSelectIds)
				this.dialogVisible = true
				this.$nextTick(() => {
					const selectRows = this.$refs.transfer.getSelectRows()
					this.rowDataVerification.resetData(selectRows)
				})
			})
		},
		onCancelClick () {
			this.verificationSelected().then(() => {
				this.dialogVisible = false
			})
		},
		onSaveClick () {
			if (!this.listSelectIds.length) {
				this.$fxMessage.warning('至少需要选择一个店铺！')
			} else if (this.fxDataVerification.checkData(this.listSelectIds)) {
				this.$emit('save-main')
				return Promise.resolve(this.listSelectIds)
			} else {
				const selectRows = this.$refs.transfer.getSelectRows()
				const logger = this.$fxLogger.createInfo('basic-archives.employee-manage.manageStore', this.createLoggerParams(this.rowDataVerification.getOriginData(), selectRows))
				return this.$fxApi('employee.saveStore', this.itemDetails.id)({ data: this.listSelectIds, logger }).then(res => {
					this.fxDataVerification.resetData(this.listSelectIds)
					this.rowDataVerification.resetData(selectRows)
					this.$emit('save-main')
					return Promise.resolve()
				})
			}
		},
		createLoggerParams (pre, cur) {
			return {
				pre,
				cur,
				name: this.itemDetails.name,
				code: this.itemDetails.code
			}
		},
		refreshConnectList () {
			return this.$fxApi('employee.getStore', this.itemDetails.id).then(res => {
				this.tableData = res
				this.listSelectIds = res.filter(item => {
					return item.related === 1
				}).map(item => {
					return item.id
				})
				return Promise.resolve()
			})
		},
		verificationSelected () {
			return this.fxDataVerification.checkComfirm(this.listSelectIds)
		},
		onBeforeClose (close) {
			this.verificationSelected().then(close)
		},
		onClose () {
			this.$emit('close')
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
</style>
