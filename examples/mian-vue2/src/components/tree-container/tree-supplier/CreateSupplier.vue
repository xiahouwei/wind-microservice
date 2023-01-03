<template>
	<w-dialog v-model="dialogVisible" :title="`${dialogTitle}类别`" width="480px">
		<div class="create-area">
			<el-form ref="form" :model="formData" :rules="rules" size="mini" inline>
				<el-form-item prop="code" label="类别编号：" label-width="90px" class="form-item">
					<w-input
						ref='code'
						v-model="formData.code"
						v-fx-enter:focus.name
						v-fx-tab:focus.name
						:maxlength="$fxCommon.getFxInputMaxLength('commonCode')"
						:regType="$fxCommon.getFxInputReg('commonCode')"
						class="form-item-input"
					></w-input>
				</el-form-item>
				<el-form-item prop="name" label="类别名称：" label-width="90px" class="form-item">
					<w-input
						ref='name'
						v-model="formData.name"
						v-fx-enter="onSaveClick"
						v-fx-tab:focus.saveBtn
						:maxlength="$fxCommon.getFxInputMaxLength('commonName')"
						:regType="$fxCommon.getFxInputReg('commonName')"
						class="form-item-input"
					></w-input>
				</el-form-item>
			</el-form>
		</div>
		<template slot="footer">
			<el-button ref="cancelBtn" v-fx-tab:focus.code @click="onCancelClick">取消</el-button>
			<el-button ref="saveBtn" v-fx-tab:focus.cancelBtn type="primary" @click="onSaveClick">保存</el-button>
		</template>
	</w-dialog>
</template>
<script>
export default {
	name: 'createSupplier',
	data () {
		return {
			dialogVisible: false,
			actionType: '',
			formData: {
				code: '',
				name: ''
			},
			rules: {
				code: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				name: [{ required: true, message: '该字段不能为空', trigger: 'no' }]
			}
		}
	},
	computed: {
		dialogTitle () {
			return this.actionType === 'add' ? '新建' : '编辑'
		}
	},
	methods: {
		async add () {
			this.actionType = 'add'
			const code = await this.getArchiveCode()
			this.formData = {
				code,
				name: ''
			}
			this.dialogVisible = true
			this.$nextTick(() => {
				this.$refs.form.clearValidate()
				this.$refs.code.focus()
			})
		},
		edit (details) {
			this.actionType = 'edit'
			this.formData = this.$fxUtils.deepClone(details)
			this.dialogVisible = true
			this.$nextTick(() => {
				if (this.$refs.form) {
					this.$refs.name.focus()
					this.$refs.form.clearValidate()
				}
			})
		},
		getArchiveCode () {
			return this.$fxApi('archiveCode.get', 'Supplier_Type')
		},
		onSaveClick () {
			this.onValidateFormData().then(this.onSaveHandler).then(() => {
				this.dialogVisible = false
				this.$emit('on-refresh')
			})
		},
		onSaveAndAddClick () {
			this.onValidateFormData().then(this.onSaveHandler).then(() => {
				this.$emit('on-refresh')
				this.add()
			})
		},
		onValidateFormData () {
			return this.$refs.form.validate().then(() => {
				return Promise.resolve()
			})
		},
		onSaveHandler () {
			if (this.actionType === 'add') {
				const logger = this.$fxLogger.createInfo('basic-archives.supplier-manage.supplierTreeAdd', { name: this.formData.name })
				return this.$fxApi('supplierType.add')({ data: this.formData, logger }).then(res => {
					return Promise.resolve()
				})
			} else {
				const logger = this.$fxLogger.createInfo('basic-archives.supplier-manage.supplierTreeUpdate', { name: this.formData.name })
				return this.$fxApi('supplierType.save', this.formData.id)({ data: this.formData, logger }).then(res => {
					return Promise.resolve()
				})
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
	height: 200px
	box-sizing: border-box
	.form-item {
		margin: 25px 0
	}
	.form-item-input {
		width:280px
	}
}
</style>
