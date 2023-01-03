<template>
	<w-dialog
		v-model="dialogVisible"
		:title="`${dialogTitle}`"
		:showMoreBtn="!isAdd"
		:beforeClose="onBeforeClose"
		:moreBtnOption="moreBtnOption"
		width="480px"
		@close="onClose"

	>
		<div class="create-area">
			<el-form ref="form" :model="formData" :rules="rules" size="mini" inline>
				<el-form-item prop="code" label="角色编号：" label-width="110px" class="form-item">
					<w-input
						ref='code'
						v-model="formData.code"
						v-fx-tab:focus.name
						:maxlength="$fxCommon.getFxInputMaxLength('commonCode')"
						:regType="$fxCommon.getFxInputReg('commonCode')"
						:disabled="billDisabled"
						class="form-item-input"
					></w-input>
				</el-form-item>
				<el-form-item prop="name" label="角色名称：" label-width="110px" class="form-item">
					<w-input
						ref='name'
						v-model="formData.name"
						v-fx-tab:focus.saveBtn
						:maxlength="$fxCommon.getFxInputMaxLength('commonName')"
						:regType="$fxCommon.getFxInputReg('commonName')"
						:disabled="billDisabled"
						class="form-item-input"
					></w-input>
				</el-form-item>
			</el-form>
		</div>
		<template slot="footer">
			<el-button
				ref="cancelBtn"
				v-fx-tab:focus.code
				@click="onCancelClick"
			>取消</el-button>
			<el-button
				ref="saveBtn"
				v-fx-auth:basic-archives_role-manage.edit-role
				v-fx-tab:focus.cancelBtn
				type="primary"
				@click="onSaveClick"
			>保存</el-button>
		</template>
	</w-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
	name: 'createFinancial',
	data () {
		return {
			dialogVisible: false,
			formData: {
				code: '',
				name: ''
			},
			rules: {
				code: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				name: [{ required: true, message: '该字段不能为空', trigger: 'no' }]
			},
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			billDeleteFlag: false
		}
	},
	computed: {
		...mapGetters(['detailsAuthGetter']),
		isAdd () {
			return !this.formData.id
		},
		dialogTitle () {
			return this.isAdd ? '新建' : '编辑'
		},
		billDisabled () {
			return !this.detailsAuthGetter('basic-archives_role-manage.edit-role')
		},
		moreBtnOption () {
			return [{
				show: !this.isAdd && this.detailsAuthGetter('basic-archives_role-manage.delete-role'),
				label: '删除',
				icon: 'delete-trash',
				click: this.onDeleteClick
			}]
		}
	},
	methods: {
		async add () {
			const code = await this.getArchiveCode()
			this.formData = {
				code,
				name: ''
			}
			this.billDeleteFlag = false
			this.dialogVisible = true
			this.$nextTick(() => {
				this.$refs.form.clearValidate()
				this.$fxUtils.vDoRefFocus(this, 'code')
				this.fxDataVerification.resetData(this.formData)
			})
		},
		edit (details) {
			this.formData = details
			this.billDeleteFlag = false
			this.dialogVisible = true
			this.$nextTick(() => {
				this.$refs.form.clearValidate()
				if (this.billDisabled) {
					this.$fxUtils.vDoRefFocus(this, 'cancelBtn')
				} else {
					this.$fxUtils.vDoRefFocus(this, 'name')
				}
				this.fxDataVerification.resetData(this.formData)
			})
		},
		getArchiveCode () {
			return this.$fxApi('archiveCode.get', 'Role')
		},
		onClose () {
			this.$emit('on-close', this.billDeleteFlag)
		},
		onSaveClick () {
			this.onValidateFormData().then(this.onSaveHandler).then(res => {
				this.$fxConfirm({
					message: '立即前往设置关联员工',
					title: '提示信息',
					option: {
						confirmButtonText: '是',
						cancelButtonText: '否',
						closeOnClickModal: false
					}
				}).then(() => {
					this.dialogVisible = false
					this.$emit('on-refresh')
					this.$emit('goto-connect-employee', this.formData)
				}).catch(() => {
					this.dialogVisible = false
					this.$emit('on-refresh')
				})
			}).catch(() => {})
		},
		onValidateFormData () {
			return this.$refs.form.validate().then(() => {
				return Promise.resolve()
			})
		},
		onSaveHandler () {
			if (this.isAdd) {
				const logger = this.$fxLogger.createInfo('basic-archives.role-manage.add', { role: this.formData.name, code: this.formData.code })
				return this.$fxApi('role.add')({ data: this.formData, logger }).then(res => {
					this.formData = res
					this.fxDataVerification.resetData(this.formData)
					return Promise.resolve()
				})
			} else {
				const logger = this.$fxLogger.createInfo('basic-archives.role-manage.update', this.createLoggerParams())
				return this.$fxApi('role.edit', this.formData.id)({ data: this.formData, logger }).then(res => {
					this.fxDataVerification.resetData(this.formData)
					return Promise.resolve()
				})
			}
		},
		createLoggerParams () {
			const originData = this.fxDataVerification.getOriginData()
			const organDetails = this.$fxUtils.deepClone(this.formData)
			return {
				pre: originData,
				cur: organDetails,
				name: organDetails.name,
				code: organDetails.code
			}
		},
		onCancelClick () {
			this.dialogVisible = false
		},
		onDeleteClick () {
			this.$fxConfirm('是否确定删除当前角色')
				.then(this.onDeleteHandler)
				.then(this.onCancelClick)
		},
		onDeleteHandler () {
			const logger = this.$fxLogger.createInfo('basic-archives.role-manage.delete', { role: this.formData.name })
			return this.$fxApi('role.delete', this.formData.id)({ logger }).then(res => {
				this.billDeleteFlag = true
				return Promise.resolve()
			})
		},
		verificationDetails () {
			return this.fxDataVerification.checkComfirm(this.formData)
		},
		onBeforeClose (close) {
			this.verificationDetails().then(close)
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
		margin-top: 30px
	}
	.form-item-input {
		width:280px
	}
}
.reverse {
	display flex
	flex-direction: row-reverse
	button {
		margin-left 10px
	}
}
</style>
