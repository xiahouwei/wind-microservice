<template>
	<w-dialog
		v-model="dialogVisible"
		title="新建"
		width="480px"
		@close="onRefresh"
	>
		<div class="create-area">
			<el-form ref="form" :model="formData" size="mini">
				<div class="form-item-title">选择会计年：</div>
				<el-form-item label="会计年度：" label-width="100px" class="form-item-year">
					<w-year-stepper v-model="formData.year"></w-year-stepper>
				</el-form-item>
				<div class="form-item-title computed-type">核算方式：</div>
				<el-form-item>
					<el-radio v-model="radio" :label="1">自然月</el-radio>
				</el-form-item>
				<el-form-item>
					<el-radio v-model="radio" :label="2">截止日期</el-radio>
					<w-input-number
						v-model="formData.endDay"
						:min="1"
						:max="31"
						:intLength="2"
						:disabled="radio===1"
						integer
						class="form-item-input-date"
					></w-input-number>
					<span>（日）</span>
				</el-form-item>
			</el-form>
		</div>
		<template slot="footer">
			<el-button @click="onCancelClick">取消</el-button>
			<el-button type="primary" @click="onSaveClick">保存</el-button>
		</template>
	</w-dialog>
</template>
<script>
export default {
	name: 'add-account',
	data () {
		return {
			dialogVisible: false,
			formData: {
				year: '',
				endDay: ''
			},
			radio: 1
		}
	},
	methods: {
		open (maxYear) {
			this.radio = 1
			this.formData = {
				year: maxYear,
				endDay: '0'
			}
			this.dialogVisible = true
		},
		onRefresh () {
			this.$emit('on-refresh')
		},
		onSaveClick () {
			const endDay = this.radio === 1 ? '0' : this.formData.endDay
			const formData = {
				year: this.formData.year,
				endDay
			}
			const logger = this.$fxLogger.createInfo('financial-manage.account-period.add', formData)
			this.$fxApi('account.add')({ data: formData, logger }).then(res => {
				this.dialogVisible = false
			})
		},
		onCancelClick () {
			this.dialogVisible = false
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.create-area {
	width: 100%
	height: 300px
	box-sizing: border-box
	padding-left:40px
	.form-item-title {
		font-size: 15px
		font-weight:900
		height: 40px;
		line-height: 40px;
	}
	.form-item-year {
		>>>.el-form-item__label {
			text-align: left
		}
	}
	.form-item-input-date {
		width:120px
	}
	.computed-type {
		margin-top: 50px
	}
}
</style>
