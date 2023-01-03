<template>
	<w-dialog
		v-model="dialogVisible"
		:title="`${dialogTitle}盘盈原因`"
		width="480px"
		:showMoreBtn="showMoreBtn"
		:beforeClose="onBeforeClose"
		@close="onRefresh"
	>
		<template slot="tools">
			<w-link icon="delete-trash" type="default" @click="onDeleteClick">删除</w-link>
		</template>
		<div class="create-area">
			<el-form ref="form" :model="formData" :rules="rules" size="mini" inline>
				<el-form-item prop="code" label="盘盈原因编号：" label-width="110px">
					<w-input
						ref="code"
						v-model="formData.code"
						v-fx-tab:focus.name
						:maxlength="$fxCommon.getFxInputMaxLength('shortCode')"
						placeholder="请输入盘盈原因编号"
						:regType="$fxCommon.getFxInputReg('shortCode')"
						:disabled="!hasEditAuth || isSystem"
						class="form-item-input"
					></w-input>
				</el-form-item>
				<el-form-item prop="name" label="盘盈原因名称：" label-width="110px">
					<w-input
						ref="name"
						v-model="formData.name"
						v-fx-tab:focus.generateType
						:maxlength="50"
						:disabled="!hasEditAuth || isSystem"
						class="form-item-input"
						placeholder="请输入盘盈原因名称"
					/>
				</el-form-item>
				<el-form-item label="默认盘盈原因：" label-width="110px">
					<el-checkbox
						ref="defaultFlag"
						v-model="formData.defaultFlag"
						:true-label="1"
						:false-label="0"
						:disabled="!hasEditAuth"
					>
					</el-checkbox>
				</el-form-item>
				<el-form-item label="盘盈生成方式：" label-width="110px">
					<w-select
						ref="generateType"
						v-model="formData.generateType"
						v-fx-tab="typeTabHandler"
						class="form-item-input"
						placeholder="请选择"
						:optionlist="inventoryProfitTypeList"
						:disabled="!hasEditAuth || isSystem"
					>
					</w-select>
				</el-form-item>
				<el-form-item  prop="enableFlag" label="启停状态：" label-width="110px">
					<w-switch
						ref="enableFlag"
						v-model="formData.enableFlag"
						v-fx-tab="enableFlagTabHandler"
						:active-value="1"
						:inactive-value="0"
						:disabled="switchDisabled || isSystem"
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
				v-fx-auth:basic-archives_support-archives_inventory-profit-reason.edit-inventory-profit-reason|enable-inventory-profit-reason|disable-inventory-profit-reason
				v-fx-tab:focus.cancelBtn
				@click="onSaveClick"
			>保存</el-button>
			<el-button
				ref="saveAndAddBtn"
				type="primary"
				v-fx-auth:basic-archives_support-archives_inventory-profit-reason.edit-inventory-profit-reason|enable-inventory-profit-reason|disable-inventory-profit-reason="isAdd"
				v-fx-tab:focus.saveBtn
				@click="onSaveAndAddClick"
			>保存并新建</el-button>
		</template>
	</w-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
	name: 'createFinancial',
	data () {
		const validateIgnore = (rule, value, callback) => {
			callback()
		}
		return {
			dialogVisible: false,
			formData: {
				code: '',
				name: '',
				enableFlag: '',
				defaultFlag: 0,
				generateType: '0001'
			},
			rules: {
				code: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				name: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				enableFlag: [{ required: true, message: '该字段不能为空', trigger: 'no', validator: validateIgnore }]
			},
			inventoryProfitTypeList: this.$fxTypeMiddleware.getCommonTypeList('inventoryProfitType'),
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
			return this.detailsAuthGetter('basic-archives_support-archives_inventory-profit-reason.edit-inventory-profit-reason')
		},
		showMoreBtn () {
			return !this.isAdd && this.detailsAuthGetter('basic-archives_support-archives_inventory-profit-reason.delete-inventory-profit-reason') && !this.isSystem
		},
		switchDisabled () {
			return ((!this.formData.enableFlag && !this.detailsAuthGetter('basic-archives_support-archives_inventory-profit-reason.enable-inventory-profit-reason')) || (!!this.formData.enableFlag && !this.detailsAuthGetter('basic-archives_support-archives_inventory-profit-reason.disable-inventory-profit-reason')))
		},
		isSystem () {
			return ['0001', '0002'].includes(this.formData.code)
		}
	},
	methods: {
		async add () {
			this.billDeleteFlag = false
			const code = await this.getArchiveCode()
			this.formData = {
				code,
				name: '',
				defaultFlag: 0,
				generateType: '0001',
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
				if (this.hasEditAuth && !this.isSystem) {
					this.$fxUtils.vDoRefFocus(this, 'name')
				} else if (!this.switchDisabled && !this.isSystem) {
					this.$fxUtils.vDoRefFocus(this, 'enableFlag')
				} else {
					this.$fxUtils.vDoRefFocus(this, 'cancelBtn')
				}
				this.$refs.form.clearValidate()
				this.fxDataVerification.resetData(this.formData)
			})
		},
		getArchiveCode () {
			return this.$fxApi('archiveCode.get', 'CheckCause')
		},
		onRefresh () {
			this.$emit('on-refresh', this.billDeleteFlag)
		},
		onCodeInput (val) {
			this.formData.code = val.replace(/[^A-Za-z0-9]/g, '')
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
				const logger = this.$fxLogger.createInfo('basic-archives.support-archives.inventory-profit-reason.add', { name: this.formData.name, code: this.formData.code })
				return this.$fxApi('inventoryProfitReason.addReason')({ data: this.formData, logger }).then(res => {
					this.$fxMessage.success('新建盘盈原因成功')
					this.formData = res
					this.fxDataVerification.resetData(this.formData)
					return Promise.resolve()
				})
			} else {
				const logger = this.$fxLogger.createInfo('basic-archives.support-archives.inventory-profit-reason.update', this.createLoggerParams())
				return this.$fxApi('inventoryProfitReason.editReason', this.formData.id)({ data: this.formData, logger }).then(res => {
					this.$fxMessage.success('保存盘盈原因成功')
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
			this.$fxConfirm('是否确定删除盘盈原因？').then(() => {
				this.onDeleteHandler().then(this.onCancelClick)
			})
		},
		onDeleteHandler () {
			const logger = this.$fxLogger.createInfo('basic-archives.support-archives.inventory-profit-reason.delete', { name: this.formData.name, code: this.formData.code })
			return this.$fxApi('inventoryProfitReason.delete', this.formData.id)({ logger }).then(res => {
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
		typeTabHandler ({ focus }) {
			this.switchDisabled ? this.isAdd ? focus('saveAndAddBtn') : focus('saveBtn') : focus('enableFlag')
		},
		enableFlagTabHandler ({ focus }) {
			this.isAdd ? focus('saveAndAddBtn') : focus('saveBtn')
		},
		cancelBtnTabHandler ({ focus }) {
			(this.hasEditAuth && !this.isSystem) ? focus('code') : (this.switchDisabled || this.isSystem) ? focus('saveBtn') : focus('enableFlag')
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.create-area {
	width: 100%
	height: 240px
	box-sizing: border-box
	.form-item-input {
		width:280px
	}
}
</style>
