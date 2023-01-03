<template>
	<div class="setting-mulity">
		<el-form size="mini" label-width="80px" class="setting-mulity_form">
			<el-form-item label="将字段：" class="form-item">
				<w-select
					v-model="settingKey"
					class="form-input"
					:optionlist="columnSelectList"
					:optionProp="{name:'label'}"
					disabled
				>
				</w-select>
			</el-form-item>
			<div class="form-edit-text">修改为</div>
			<div class="form-content">
				<w-date-picker
					ref="datePicker"
					v-model="productDate"
					type="datetime"
					align="right"
					value-format="yyyy-MM-dd HH:mm:ss"
					format="yyyy-MM-dd HH:mm"
					placeholder="选择日期"
					:picker-options="pickerOptions"
					class="form-input-date"
					@visible-change="onDatePickerVisibleChange"
				></w-date-picker>
			</div>
			<div class="form-footer">
				<el-button type="danger" plain @click="onCancelClick">取消</el-button>
				<el-button type="primary" plain @click="onSaveClick">保存</el-button>
			</div>
		</el-form>
	</div>
</template>
<script>
export default {
	name: 'settingMulity',
	props: {
		visible: Boolean,
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	inject: ['initPopoverConnectTarget', 'removePopoverConnectTarget'],
	data () {
		return {
			columnSelectList: [{
				id: 'productDate',
				label: '生产日期'
			}],
			settingKey: 'productDate',
			productDate: '',
			pickerOptions: {
				disabledDate: date => {
					return date.getTime() > new Date(this.organDetails.businessDate).getTime()
				}
			}
		}
	},
	watch: {
		visible (val) {
			if (!val) {
				this.refreshFormData()
			} else {
				this.productDate = this.organDetails.businessDate
			}
		}
	},
	methods: {
		onSaveClick () {
			const params = {
				type: this.settingKey,
				productDate: this.productDate
			}
			if (this.productDate && !this.$fxUtils.compareDate(this.organDetails.businessDate, this.productDate)) {
				this.$fxMessage.warning('生产日期不能大于盘点日期')
			} else {
				this.$emit('on-save-click', params)
			}
		},
		onCancelClick () {
			this.$emit('on-cancel-click')
		},
		refreshFormData () {
			this.productDate = ''
		},
		onDatePickerVisibleChange (val) {
			val ? this.initPopoverConnectTarget(this.$refs.datePicker) : this.removePopoverConnectTarget(this.$refs.datePicker)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.setting-mulity {
	display: flex
	flex-direction: column
	height: 300px
	font-size: 12px
	.setting-mulity_form {
		display: flex
		flex-direction: column
		flex: 1
		.form-input {
			width: 150px
		}
		.form-item {
			margin-bottom: 10px
		}
		.form-edit-text {
			height: 26px
			line-height:26px
			padding-left: 20px
		}
		.form-content {
			flex: 1
			border: 1px solid #eee
			padding 20px
			.form-input-date {
				width 100%
			}
		}
		.form-footer {
			text-align: right
			margin-top: 10px
			margin-bottom: 5px
		}
	}
}
</style>
