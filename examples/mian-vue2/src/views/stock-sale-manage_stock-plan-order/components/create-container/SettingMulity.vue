<template>
	<div class="setting-mulity">
		<el-form size="mini" label-width="80px" class="setting-mulity_form">
			<el-form-item label="将字段：" class="form-item">
				<w-select
					v-model="settingKey"
					class="form-input"
					:optionlist="columnSelectList"
					:optionProp="{name:'label'}"
				>
				</w-select>
			</el-form-item>
			<div class="form-edit-text">修改为</div>
			<div class="form-content">
				<div v-show="settingKey===1">
					<w-date-picker
						ref="datePicker"
						v-model="expectArrivalDate"
						type="datetime"
						align="right"
						value-format="yyyy-MM-dd HH:mm"
						format="yyyy-MM-dd HH:mm"
						placeholder="选择日期"
						:clearable="false"
						:picker-options="pickerOptions"
						class="form-input-date"
						@visible-change="onDatePickerVisibleChange"
					></w-date-picker>
				</div>
				<div v-show="settingKey===2" class="memo-container">
					<w-input
						v-model="memo"
						type="textarea"
						:rows="5"
						resize="none"
						:maxlength="300"
						placeholder="请输入内容"
						class="form-input-memo"
					>
					</w-input>
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
				id: 1,
				label: '期望到货时间'
			}, {
				id: 2,
				label: '明细备注'
			}],
			settingKey: 1,
			expectArrivalDate: '',
			memo: '',
			pickerOptions: {
				disabledDate: (time) => {
					return time.getTime() < this.$fxUtils.getTimeBeforeDay(this.organDetails.businessDate)
				}
			}
		}
	},
	computed: {
	},
	watch: {
		visible () {
			this.refreshFormData()
		}
	},
	methods: {
		onSaveClick () {
			if (this.settingKey === 1 && this.$fxUtils.compareDate(this.organDetails.businessDate, this.expectArrivalDate)) {
				this.$fxMessage.warning('期望到货时间不得小于订货时间')
				return false
			}
			const params = {
				type: this.settingKey,
				expectArrivalDate: this.expectArrivalDate,
				memo: this.memo
			}
			this.$emit('on-save-click', params)
		},
		onCancelClick () {
			this.$emit('on-cancel-click')
		},
		refreshFormData () {
			this.settingKey = 1
			this.expectArrivalDate = ''
			this.memo = ''
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
		.form-input-tax {
			margin-top: 20px
			margin-left: 40px
			width: 200px
		}
		.form-input-date {
			margin-top: 20px
			margin-left: 40px
			width: 200px
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
		.form-footer {
			text-align: right
			margin-top: 10px
			margin-bottom: 5px
		}
	}
}
</style>
