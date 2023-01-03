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
				<div v-show="settingKey===1" class="memo-container">
					<w-input
						v-model="memo"
						type="textarea"
						resize="none"
						:rows="5"
						:maxlength="$fxCommon.getFxInputMaxLength('memo')"
						:regType="$fxCommon.getFxInputReg('memo')"
						placeholder="请输入内容"
					>
					</w-input>
				</div>
			</div>
			<div class="form-footer">
				<fx-button type="danger" plain @click="onCancelClick">取消</fx-button>
				<fx-button type="primary" plain @click="onSaveClick">保存</fx-button>
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
	data () {
		return {
			columnSelectList: [{
				id: 1,
				label: '明细备注'
			}],
			settingKey: 1,
			memo: ''
		}
	},
	watch: {
		visible () {
			this.refreshFormData()
		}
	},
	methods: {
		onSaveClick () {
			const params = {
				type: this.settingKey,
				memo: this.memo
			}
			this.$emit('on-save-click', params)
		},
		onCancelClick () {
			this.$emit('on-cancel-click')
		},
		refreshFormData () {
			this.settingKey = 1
			this.memo = ''
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
			.memo-container {
				padding: 10px
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
