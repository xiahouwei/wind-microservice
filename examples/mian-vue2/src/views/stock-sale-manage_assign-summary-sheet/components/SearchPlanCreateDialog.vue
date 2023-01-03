<template>
	<w-dialog
		v-model="dialogVisible"
		width="400px"
		:title="`${dialogTitle}查询方案`"
	>
		<div class="create-area">
			<el-form ref="form" :model="searchPlan" :rules="rules" size="mini" inline label-width="110px">
				<el-form-item prop="name" label="方案名称：">
					<w-input
						ref="name"
						v-model="searchPlan.name"
						v-fx-tab:focus.saveBtn
						:maxlength="$fxCommon.getFxInputMaxLength('commonName')"
						:regType="$fxCommon.getFxInputReg('commonName')"
						:disabled="inputDisabled"
						placeholder="请输入"
						class="form-input"
					></w-input>
				</el-form-item>
			</el-form>
		</div>
		<template slot="footer">
			<el-button
				ref="cancelBtn"
				v-fx-tab:focus.name
				@click="onCancelClick"
			>取消</el-button>
			<el-button
				ref="saveBtn"
				type="primary"
				v-fx-tab:focus.cancelBtn
				@click="onSaveClick"
			>{{saveBtnText}}</el-button>
		</template>
	</w-dialog>
</template>
<script>
export default {
	name: 'createSearchPlan',
	data () {
		return {
			dialogVisible: false,
			searchPlan: { name: '' },
			dialogType: 'add',
			rules: {
				name: [{ required: true, message: '该字段不能为空', trigger: 'no' }]
			}
		}
	},
	computed: {
		dialogTitle () {
			switch (this.dialogType) {
			case 'add':
				return '新建'
			case 'edit':
				return '编辑'
			case 'del':
				return '删除'
			default:
				return ''
			}
		},
		saveBtnText () {
			return this.dialogType === 'del' ? '确定' : '保存'
		},
		inputDisabled () {
			return this.dialogType === 'del'
		}
	},
	methods: {
		open (searchPlanName, dialogType) {
			this.searchPlan.name = searchPlanName
			this.dialogType = dialogType
			this.dialogVisible = true
			this.$nextTick(() => {
				if (dialogType === 'del') {
					this.$fxUtils.vDoRefFocus(this, 'saveBtn')
				} else {
					this.$fxUtils.vDoRefFocus(this, 'name')
				}
				this.$refs.form.clearValidate()
			})
		},
		onSaveClick () {
			this.onValidateFormData().then(this.onSaveHandler)
		},
		onValidateFormData () {
			return this.$refs.form.validate()
		},
		onSaveHandler () {
			if (this.dialogType === 'del') {
				this.$emit('on-del-plan', this.searchPlan.name)
				this.dialogVisible = false
			} else {
				this.$emit('on-save-plan', this.searchPlan.name)
				this.dialogVisible = false
			}
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
	height: 50px
	box-sizing: border-box
	.form-input {
		width: 200px
	}
}
</style>
