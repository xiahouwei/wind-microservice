<template>
	<w-dialog v-model="dialogVisible" title="新建模板" width="460px">
		<div class="create-template">
			<el-form ref="templateForm" :model="templateForm" :rules="rules" size="mini" inline>
				<el-form-item prop="name" label="模板名称：" label-width="110px">
					<w-input
						v-model="templateForm.name"
						:maxlength="$fxCommon.getFxInputMaxLength('commonName')"
						:regType="$fxCommon.getFxInputReg('commonName')"
						class="form-item-input"
					></w-input>
				</el-form-item>
			</el-form>
		</div>
		<el-button slot="footer" type="primary" @click="onSubmitClick">保存</el-button>
	</w-dialog>
</template>
<script>
export default {
	name: 'createPrintTemplate',
	data () {
		return {
			dialogVisible: false,
			templateForm: {
				name: ''
			},
			rules: {
				name: [{ required: true, message: '该字段不能为空', trigger: 'no' }]
			}
		}
	},
	methods: {
		open () {
			this.templateForm.name = ''
			this.dialogVisible = true
			this.$nextTick(() => {
				if (this.$refs.templateForm) {
					this.$refs.templateForm.clearValidate()
				}
			})
		},
		onSubmitClick () {
			this.$refs.templateForm.validate()
				.then(this.onCreateHandler)
		},
		onCreateHandler () {
			this.$emit('on-save', this.templateForm.name)
			this.dialogVisible = false
		}
	}
}
</script>
<style id="printStyle" title="printStyle" lang="stylus">
@import '~$assets/stylus/varsty.styl'
.create-template {
	.form-item-input {
		width: 200px
	}
}
</style>

