<template>
	<w-dialog
		v-model="dialogVisible"
		:title="`${dialogTitle}出库原因`"
		width="480px"
		:moreBtnOption="moreBtnOption"
		:beforeClose="onBeforeClose"
		@close="onRefresh"
	>
		<div class="create-container">
			<el-form ref="form" :model="formData" :rules="rules" size="mini" inline>
				<el-form-item prop="code" label="出库原因编号：" label-width="110px">
					<w-input
						ref="code"
						v-model="formData.code"
						v-fx-tab:focus.name
						:maxlength="$fxCommon.getFxInputMaxLength('shortCode')"
						placeholder="请输入出库原因编号"
						:regType="$fxCommon.getFxInputReg('shortCode')"
						:disabled="!hasEditAuth"
						class="form-item-input"
					></w-input>
				</el-form-item>
				<el-form-item prop="name" label="出库原因名称：" label-width="110px">
					<w-input
						ref="name"
						v-model="formData.name"
						v-fx-tab="nameTabHandler"
						:maxlength="50"
						:disabled="!hasEditAuth"
						class="form-item-input"
						placeholder="请输入出库原因名称"
					/>
				</el-form-item>
				<el-form-item  prop="enableFlag" label="启停状态：" label-width="110px">
					<w-switch
						ref="enableFlag"
						v-model="formData.enableFlag"
						v-fx-tab="enableFlagTabHandler"
						:active-value="1"
						:inactive-value="0"
						:disabled="switchDisabled"
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
				v-fx-auth:basic-archives_support-archives_out-store-reason.edit-out-store-reason|enable-out-store-reason|disable-out-store-reason
				v-fx-tab:focus.cancelBtn
				@click="onSaveClick"
			>保存</el-button>
			<el-button
				ref="saveAndAddBtn"
				type="primary"
				v-fx-auth:basic-archives_support-archives_out-store-reason.edit-out-store-reason|enable-out-store-reason|disable-out-store-reason="isAdd"
				v-fx-tab:focus.saveBtn
				@click="onSaveAndAddClick"
			>保存并新建</el-button>
		</template>
	</w-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
	name: 'createDialog',
	data () {
		const validateIgnore = (rule, value, callback) => {
			callback()
		}
		return {
			dialogVisible: false,
			formData: {
				code: '',
				name: '',
				enableFlag: 1
			},
			rules: {
				code: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				name: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				enableFlag: [{ required: true, message: '该字段不能为空', trigger: 'no', validator: validateIgnore }]
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
		hasEditAuth () {
			return this.detailsAuthGetter('basic-archives_support-archives_out-store-reason.edit-out-store-reason')
		},
		moreBtnOption () {
			return [{
				show: !this.isAdd && this.detailsAuthGetter('basic-archives_support-archives_out-store-reason.delete-out-store-reason'),
				label: '删除',
				icon: 'delete-trash',
				click: this.onDeleteClick
			}]
		},
		switchDisabled () {
			return (!this.formData.enableFlag && !this.detailsAuthGetter('basic-archives_support-archives_out-store-reason.enable-out-store-reason')) || (!!this.formData.enableFlag && !this.detailsAuthGetter('basic-archives_support-archives_out-store-reason.disable-out-store-reason'))
		}
	},
	methods: {
		async add () {
			this.billDeleteFlag = false
			const code = await this.getArchiveCode()
			this.formData = {
				code,
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
			this.billDeleteFlag = false
			this.formData = details
			this.dialogVisible = true
			this.$nextTick(() => {
				if (this.hasEditAuth) {
					this.$fxUtils.vDoRefFocus(this, 'name')
				} else if (!this.switchDisabled) {
					this.$fxUtils.vDoRefFocus(this, 'enableFlag')
				} else {
					this.$fxUtils.vDoRefFocus(this, 'cancelBtn')
				}
				this.$refs.form.clearValidate()
				this.fxDataVerification.resetData(this.formData)
			})
		},
		getArchiveCode () {
			return this.$fxApi('archiveCode.get', 'Out_Reason')
		},
		onRefresh () {
			this.$emit('on-refresh', this.billDeleteFlag)
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
			return this.$refs.form.validate()
		},
		onSaveHandler () {
			if (this.isAdd) {
				const logger = this.$fxLogger.createInfo('basic-archives.support-archives.out-store-reason.add', { name: this.formData.name, code: this.formData.code })
				return this.$fxApi('outStoreReason.addReason')({ data: this.formData, logger }).then(res => {
					this.$fxMessage.success('新建出库原因成功')
					this.formData = res
					this.fxDataVerification.resetData(this.formData)
					return Promise.resolve()
				})
			} else {
				const logger = this.$fxLogger.createInfo('basic-archives.support-archives.out-store-reason.update', this.createLoggerParams())
				return this.$fxApi('outStoreReason.editReason', this.formData.id)({ data: this.formData, logger }).then(res => {
					this.$fxMessage.success('保存出库原因成功')
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
			this.$fxConfirm('是否确定删除出库原因？').then(() => {
				this.onDeleteHandler().then(this.onCancelClick)
			})
		},
		onDeleteHandler () {
			const logger = this.$fxLogger.createInfo('basic-archives.support-archives.out-store-reason.delete', { name: this.formData.name, code: this.formData.code })
			return this.$fxApi('outStoreReason.delete', this.formData.id)({ logger }).then(res => {
				this.billDeleteFlag = true
				return Promise.resolve()
			})
		},
		verificationDetails () {
			return this.fxDataVerification.checkComfirm(this.formData)
		},
		onBeforeClose (close) {
			this.verificationDetails().then(() => {
				close()
			})
		},
		nameTabHandler ({ focus }) {
			!this.switchDisabled ? focus('enableFlag') : this.isAdd ? focus('saveAndAddBtn') : focus('saveBtn')
		},
		enableFlagTabHandler ({ focus }) {
			this.isAdd ? focus('saveAndAddBtn') : focus('saveBtn')
		},
		cancelBtnTabHandler ({ focus }) {
			this.hasEditAuth ? focus('code') : this.switchDisabled ? focus('saveBtn') : focus('enableFlag')
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.create-container {
	width: 100%
	height: 200px
	box-sizing: border-box
	.form-item-input {
		width:280px
	}
}
</style>
