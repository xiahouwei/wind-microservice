<template>
	<div class="setting-mulity">
		<el-form size="mini" label-width="80px" class="setting-mulity_form">
			<el-form-item label="将字段：" class="form-item">
				<w-select
					v-model="settingKey"
					class="form-input"
					:optionlist="computedColumnSelectList"
					:optionProp="{name:'label'}"
				>
				</w-select>
			</el-form-item>
			<div class="form-edit-text">修改为</div>
			<div class="form-content">
				<div v-show="settingKey===0">
					<div class="checkbox_container">
						<el-checkbox
							v-model="beginDateCheckbox"
							class="form-input-checkbox"
						></el-checkbox>
						<el-form-item label="生效日期：" class="form-item">
							<w-date-picker
								ref="beginDatePicker"
								v-model="beginDate"
								type="datetime"
								align="right"
								value-format="yyyy-MM-dd HH:mm:ss"
								:clearable="false"
								format="yyyy-MM-dd HH:mm"
								placeholder="选择日期"
								@visible-change="onBeginDatePickerVisibleChange"
								class="form-input-date"
							></w-date-picker>
						</el-form-item>
					</div>
					<div class="checkbox_container">
						<el-checkbox
							v-model="endDateCheckbox"
							class="form-input-checkbox"
						>
						</el-checkbox>
						<el-form-item label="失效日期：" class="form-item">
							<w-date-picker
								ref="endDatePicker"
								v-model="endDate"
								type="datetime"
								align="right"
								value-format="yyyy-MM-dd HH:mm:ss"
								format="yyyy-MM-dd HH:mm"
								placeholder="选择日期"
								@visible-change="onEndDatePickerVisibleChange"
								class="form-input-date"
							></w-date-picker>
						</el-form-item>
					</div>
				</div>
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
		type: String,
		visible: Boolean,
		bomDetail: {
			type: Object,
			default: () => {
				return {
					default: 1
				}
			}
		}
	},
	inject: ['initPopoverConnectTarget', 'removePopoverConnectTarget'],
	data () {
		return {
			columnSelectList: [{
				id: 0,
				code: 0,
				label: '有效日期'
			}],
			settingKey: 0,
			beginDateCheckbox: false,
			endDateCheckbox: false,
			beginDate: '',
			endDate: ''
		}
	},
	computed: {
		computedColumnSelectList () {
			return this.columnSelectList
		}
	},
	watch: {
		visible () {
			this.refreshFormData()
		}
	},
	methods: {
		onSaveClick () {
			const params = {}
			if (!this.beginDateCheckbox && !this.endDateCheckbox) {
				this.$fxMessage.warning('请选择一项')
				return false
			}
			if (this.beginDateCheckbox) {
				params.beginDate = this.beginDate
			}
			if (this.endDateCheckbox) {
				params.endDate = this.endDate
			}
			this.$emit('set-mulity', params)
		},
		onCancelClick () {
			this.$emit('on-cancel-click')
		},
		refreshFormData () {
			this.settingKey = 0
			this.beginDate = ''
			this.endDate = ''
			this.beginDateCheckbox = false
			this.endDateCheckbox = false
		},
		onBeginDatePickerVisibleChange (val) {
			val ? this.initPopoverConnectTarget(this.$refs.beginDatePicker) : this.removePopoverConnectTarget(this.$refs.beginDatePicker)
		},
		onEndDatePickerVisibleChange (val) {
			val ? this.initPopoverConnectTarget(this.$refs.endDatePicker) : this.removePopoverConnectTarget(this.$refs.endDatePicker)
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
			margin: 10px 0
		}
		.form-input-date {
			width: 165px
		}
		.checkbox_container {
			display: flex
		}
		.form-input-checkbox {
			margin-top 15px
			margin-left: 7px
		}
		.form-edit-text {
			height: 26px
			line-height:26px
			padding-left: 20px
		}
		.form-content {
			flex: 1
			border: 1px solid #eee
			.tax-memo {
				padding: 0 20px
				margin-top: 50px
			}
			.memo-container {
				padding: 5px
			}
		}
		>>>.el-checkbox__label {
			padding-left 0
		}
		.form-footer {
			text-align: right
			margin-top: 10px
			margin-bottom: 5px
		}
	}
}
>>>.el-textarea__inner {
	font-size 12px
	font-family '微软雅黑'!important
}
</style>
