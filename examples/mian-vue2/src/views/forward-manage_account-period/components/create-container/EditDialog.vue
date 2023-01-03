<template>
	<w-dialog
		v-model="dialogVisible"
		title="编辑"
		width="480px"
		@close="onRefresh"
	>
		<div class="create-area">
			<el-form ref="form" :model="formData" size="mini" :disabled='disabled'>
				<div class="form-item-title">请选择要修改本会计期结束日期：</div>
				<el-form-item label="原始结束日期：" label-width="100px" class="form-item-year">
					<div>{{formData.endDate}}</div>
				</el-form-item>
				<div class="form-item-title-2">修改后日期：</div>
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
				<div class="form-item-title">备注说明：</div>
				<div>1、只能修改当前会计期的结束日期</div>
				<div>2、本会计期的结束日期,不能小于本会计期的开始日期,也不能大于本会计月所在自然月的结束日期</div>
			</el-form>
		</div>
		<template slot="footer">
			<el-button @click="onCancelClick">取消</el-button>
			<el-button type="primary" @click="onSaveClick" :disabled='disabled'>保存</el-button>
		</template>
	</w-dialog>
</template>
<script>
export default {
	name: 'edit-account',
	data () {
		return {
			dialogVisible: false,
			formData: {},
			radio: 1
		}
	},
	props: {
		disabled: Boolean
	},
	methods: {
		open (details) {
			this.formData = {
				id: details.id,
				endDate: details.endDate,
				endDay: '0',
				year: details.year
			}
			this.radio = 1
			this.dialogVisible = true
		},
		onRefresh () {
			this.$emit('on-refresh')
		},
		onSaveClick () {
			const logger = this.$fxLogger.createInfo('financial-manage.account-period.edit', { endDate: this.formData.endDate, endDay: this.formData.endDay })
			this.$fxApi('account.edit', this.formData.id)({ data: this.formData, logger }).then(res => {
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
	.form-item-title {
		font-size: 15px
		font-weight:900
		height: 40px;
		line-height: 40px;
	}
	.form-item-title-2 {
		margin-bottom: 20px
	}
	.form-item-year {
		>>>.el-form-item__label {
			text-align: left
		}
	}
	.form-item-input-date {
		width:120px
	}
}
</style>
