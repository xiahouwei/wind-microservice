<template>
	<w-dialog v-model="dialogVisible" width="360px" positionCenter @close="close">
		<template slot="title">
			<h3 class="title">批量设置</h3>
			<span>（已选择{{selectedRows.length}}条）</span>
		</template>
		<div class="create-area">
			<el-form ref="form" :model="formData" :rules="rules" size="mini" inline label-width="80px">
				<el-form-item prop="field" label="字段名">
					<w-select
						ref="field"
						v-model="formData.field"
						v-fx-tab:focus.operateMan
						:optionlist="fieldList"
						class="form-input"
					>
					</w-select>
				</el-form-item>
				<el-form-item prop="operateMan" label="经办人">
					<w-select
						ref="operateMan"
						v-model="formData.operateMan"
						v-fx-tab:focus.saveBtn
						:optionlist="operatorList"
						@change="changeOperateMan"
						class="form-input"
					>
					</w-select>
				</el-form-item>
			</el-form>
		</div>
		<template slot="footer">
			<el-button
				ref="saveBtn"
				type="primary"
				v-fx-tab:focus.field
				@click="onConfirmClick"
			>确定</el-button>
		</template>
	</w-dialog>
</template>
<script>
import { apiName } from '../../Index.vue'
export default {
	name: 'settingMulity',
	data () {
		return {
			rules: {
				field: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				operateMan: [{ required: true, message: '该字段不能为空', trigger: 'no' }]
			},
			dialogVisible: false,
			fieldList: [
				{ id: 'operateMan', name: '经办人' }
			],
			operatorList: [],
			formData: {
				field: 'operateMan',
				fieldName: '经办人',
				operateMan: '',
				operateManName: ''
			},
			selectedRows: []
		}
	},
	methods: {
		open (selectedRows) {
			this.selectedRows = selectedRows
			this.getAgentList()
			this.dialogVisible = true
		},
		close () {
			this.formData = {
				field: 'operateMan',
				fieldName: '经办人',
				operateMan: '',
				operateManName: ''
			}
			this.$refs.form.clearValidate()
		},
		getAgentList () {
			return this.$fxApi(`${apiName}.getAgentList`)({ data: [] }).then(res => {
				this.operatorList = res
			})
		},
		changeOperateMan (val, item) {
			this.formData.operateManName = item.name
		},
		onConfirmClick () {
			return this.$refs.form.validate().then(this.onConfirmHandler)
		},
		onConfirmHandler () {
			const ids = this.selectedRows.map(item => {
				return item.id
			})
			const data = {
				ids,
				filedType: this.formData.field,
				filedValue: this.formData.operateMan
			}
			return this.$fxApi(`${apiName}.settingMulityBill`)({ data }).then(res => {
				const loggerObj = {
					orderData: this.selectedRows,
					settingInfo: this.formData,
					success: res.success,
					failed: res.failed
				}
				const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan-order.settingMulityBill', loggerObj)
				const loggerInfo = this.$fxLogger.actionInfo(logger)
				loggerInfo.success()
				this.dialogVisible = false
				this.$emit('refresh-list')
				return Promise.resolve()
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.title {
	font-size: 15px
}
.create-area {
	width: 100%
	height: 100px
	.form-input {
		width:200px
	}
}
</style>
