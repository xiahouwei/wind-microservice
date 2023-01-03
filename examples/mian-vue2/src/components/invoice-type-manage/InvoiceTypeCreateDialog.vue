<template>
	<w-dialog
		v-model="dialogVisible"
		:title="`${dialogTitle}发票类型`"
		width="480px"
		:showMoreBtn="showMoreBtn"
		@close="onRefresh"
		:beforeClose="onBeforeClose"
	>
		<template slot="tools">
			<w-link icon="delete-trash" type="default" @click="onDeleteClick">删除</w-link>
		</template>
		<div class="create-area">
			<el-form ref="form" :model="formData" :rules="rules" size="mini" inline label-width="110px">
				<el-form-item prop="type" label="发票种类：">
					<w-select
						ref="type"
						:disabled="disabled || !hasEditAuth"
						v-model="formData.type"
						v-fx-tab:focus.name
						:optionlist="invoiceTypeSelectList"
						class="form-input"
					>
					</w-select>
				</el-form-item>
				<el-form-item prop="name" label="发票类型：">
					<w-input
						ref="name"
						v-model="formData.name"
						v-fx-tab="nameTabHandler"
						:maxlength="$fxCommon.getFxInputMaxLength('commonName')"
						placeholder="请输入"
						:disabled="!!formData.sysFlag || !hasEditAuth"
						:regType="$fxCommon.getFxInputReg('commonName')"
						class="form-input"
					></w-input>
				</el-form-item>
				<el-form-item  prop="enableFlag" label="启停状态：">
					<w-switch
						ref="enableFlag"
						v-model="formData.enableFlag"
						v-fx-tab:focus.saveBtn
						:disabled="!!formData.sysFlag || switchDisabled"
						:active-value="1"
						:inactive-value="0"
						:inclusion="false"
						:width="40"
					></w-switch>
				</el-form-item>
			</el-form>
		</div>
		<template slot="footer">
			<el-button
				ref="cancelBtn"
				v-fx-tab="cancelBtnTabHandler"
				@click="onCancelClick"
			>取消</el-button>
			<el-button
				ref="saveBtn"
				type="primary"
				v-fx-auth:basic-archives_support-archives_invoice-type.edit-invoice|enable-invoice|disable-invoice="!formData.sysFlag"
				v-fx-tab:focus.cancelBtn
				@click="onSaveClick"
			>保存</el-button>
		</template>
	</w-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
	name: 'createInvoiceType',
	props: {
		type: String
	},
	data () {
		const validateIgnore = (rule, value, callback) => {
			callback()
		}
		return {
			dialogVisible: false,
			formData: {
				type: '',
				name: '',
				enableFlag: 1
			},
			rules: {
				type: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				name: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				enableFlag: [{ required: true, message: '该字段不能为空', trigger: 'no', validator: validateIgnore }]
			},
			invoiceTypeSelectList: this.$fxTypeMiddleware.getCommonTypeList('invoiceTypeList'),
			disabled: true,
			fxDataVerification: this.$fxUtils.fxDataVerification()
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
		hasEditAuth () {
			return this.detailsAuthGetter('basic-archives_support-archives_invoice-type.edit-invoice')
		},
		showMoreBtn () {
			return !this.isAdd && this.detailsAuthGetter('basic-archives_support-archives_invoice-type.delete-invoice') && !this.formData.sysFlag
		},
		switchDisabled () {
			return ((!this.formData.enableFlag && !this.detailsAuthGetter('basic-archives_support-archives_invoice-type.enable-invoice')) || (!!this.formData.enableFlag && !this.detailsAuthGetter('basic-archives_support-archives_invoice-type.disable-invoice')))
		}
	},
	methods: {
		add (typeId = '') {
			let type = typeId
			const valid = this.invoiceTypeSelectList.some(item => {
				return item.id === type
			})
			if (!valid) {
				type = ''
			}
			this.disabled = valid
			this.formData = {
				type,
				name: '',
				enableFlag: 1
			}
			this.dialogVisible = true
			this.$nextTick(() => {
				this.$fxUtils.vDoRefFocus(this, 'name')
				this.$refs.form.clearValidate()
				this.fxDataVerification.resetData(this.formData)
			})
		},
		edit (details) {
			this.disabled = true
			this.formData = details
			this.dialogVisible = true
			this.$nextTick(() => {
				if (this.hasEditAuth && !this.formData.sysFlag) {
					this.$fxUtils.vDoRefFocus(this, 'name')
				} else if (!this.switchDisabled && !this.formData.sysFlag) {
					this.$fxUtils.vDoRefFocus(this, 'enableFlag')
				} else {
					this.$fxUtils.vDoRefFocus(this, 'cancelBtn')
				}
				this.$refs.form.clearValidate()
				this.fxDataVerification.resetData(this.formData)
			})
		},
		onRefresh () {
			this.$emit('on-refresh')
		},
		onSaveClick () {
			this.onValidateFormData().then(this.onSaveHandler)
		},
		onSaveAndAddClick () {
			this.onValidateFormData().then(this.onSaveHandler).then(() => {
				this.add()
			})
		},
		onValidateFormData () {
			return this.$refs.form.validate().then(() => {
				return Promise.resolve()
			})
		},
		onSaveHandler () {
			if (this.isAdd) {
				const logger = this.$fxLogger.createInfo('basic-archives.support-archives.invoice-type.add', { name: this.formData.name })
				return this.$fxApi('invoiceType.add')({ data: this.formData, logger }).then(res => {
					this.formData = res
					this.fxDataVerification.resetData(this.formData)
					return Promise.resolve()
				})
			} else {
				const logger = this.$fxLogger.createInfo('basic-archives.support-archives.invoice-type.update', this.createLoggerParams())
				return this.$fxApi('invoiceType.edit', this.formData.id)({ data: this.formData, logger }).then(res => {
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
				name: organDetails.name
			}
		},
		onCancelClick () {
			this.verificationDetails().then(() => {
				this.dialogVisible = false
			})
		},
		onDeleteClick () {
			this.$fxConfirm('是否确定删除发票类型？').then(() => {
				this.onDeleteHandler().then(this.onCancelClick)
			})
		},
		onDeleteHandler () {
			const logger = this.$fxLogger.createInfo('basic-archives.support-archives.invoice-type.delete', { name: this.formData.name })
			return this.$fxApi('invoiceType.deleteMulity')({ data: [this.formData.id], logger }).then(res => {
				return Promise.resolve()
			})
		},
		verificationDetails () {
			return this.fxDataVerification.checkComfirm(this.formData)
		},
		onBeforeClose (close) {
			this.verificationDetails().then(close)
		},
		nameTabHandler ({ focus }) {
			this.switchDisabled ? focus('saveBtn') : focus('enableFlag')
		},
		cancelBtnTabHandler ({ focus }) {
			this.hasEditAuth ? this.disabled ? focus('name') : focus('type') : this.switchDisabled ? focus('saveBtn') : focus('enableFlag')
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
	.form-input {
		width:280px
	}
}
</style>
