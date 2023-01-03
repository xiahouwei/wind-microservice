<template>
	<w-dialog
		v-model="dialogVisible"
		width="480px"
		:title="`${dialogTitle}结算方式`"
		:beforeClose="onBeforeClose"
		@close="onClose"
	>
		<div class="create-container">
			<el-form ref="form" :model="formData" :rules="rules" size="mini" inline label-width="120px">
				<el-form-item prop="code" label="结算方式编码：">
					<w-input
						ref="code"
						v-model="formData.code"
						v-fx-tab:focus.name
						:regType="$fxCommon.getFxInputReg('phone')"
						:disabled="isSystem || !hasEditAuth"
						class="form-input"
					>
					</w-input>
				</el-form-item>
				<el-form-item prop="name" label="结算方式名称：">
					<w-input
						ref="name"
						v-model="formData.name"
						v-fx-tab:focus.memo
						placeholder="请输入"
						:maxlength="$fxCommon.getFxInputMaxLength('commonName')"
						:regType="$fxCommon.getFxInputReg('commonName')"
						:disabled="isSystem || !hasEditAuth"
						class="form-input"
					></w-input>
				</el-form-item>
				<el-form-item prop="memo" label="备注：">
					<w-input
						ref="memo"
						v-model="formData.memo"
						v-fx-tab="memoTabHandler"
						placeholder="请输入"
						:maxlength="20"
						:regType="$fxCommon.getFxInputReg('memo')"
						:disabled="isSystem || !hasEditAuth"
						class="form-input"
					></w-input>
				</el-form-item>
				<el-form-item  prop="enableFlag" label="启停状态：">
					<w-switch
						ref="enableFlag"
						v-model="formData.enableFlag"
						v-fx-tab:focus.saveBtn
						:disabled="isSystem || switchDisabled"
						:active-value="1"
						:inactive-value="0"
						:inclusion="false"
						:width="40"
					></w-switch>
				</el-form-item>
			</el-form>
		</div>
		<template slot="footer">
			<fx-button
				ref="cancelBtn"
				v-fx-tab="cancelBtnTabHandler"
				@click="onCancelClick"
			>取消</fx-button>
			<fx-button
				ref="saveBtn"
				type="primary"
				v-if="!isSystem"
				v-fx-tab:focus.cancelBtn
				@click="onSaveClick"
			>保存</fx-button>
		</template>
	</w-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import { apiName } from '../../Index.vue'
export default {
	name: 'editContianer',
	data () {
		const validateIgnore = (rule, value, callback) => {
			callback()
		}
		return {
			dialogVisible: false,
			formData: {
				code: '',
				name: '',
				memo: '',
				enableFlag: 1
			},
			rules: {
				code: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				name: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				enableFlag: [{ required: true, message: '该字段不能为空', trigger: 'no', validator: validateIgnore }]
			},
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
			// return this.detailsAuthGetter('basic-archives_support-archives_invoice-type.edit-invoice')
			return true
		},
		isSystem () {
			return this.formData.generateType === 0
		},
		switchDisabled () {
			// return ((!this.formData.enableFlag && !this.detailsAuthGetter('basic-archives_support-archives_invoice-type.enable-invoice')) || (!!this.formData.enableFlag && !this.detailsAuthGetter('basic-archives_support-archives_invoice-type.disable-invoice')))
			return false
		}
	},
	methods: {
		async add () {
			const code = await this.getCode()
			this.formData = {
				code,
				name: '',
				memo: '',
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
			this.formData = this.$fxUtils.deepClone(details)
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
		getCode () {
			return this.$fxApi(`${apiName}.getCode`)
		},
		onClose () {
			this.$emit('on-close', !this.formData.enableFlag)
		},
		onSaveClick () {
			this.onValidateFormData().then(this.onSaveHandler)
		},
		onValidateFormData () {
			return this.$refs.form.validate()
		},
		onSaveHandler () {
			if (this.isAdd) {
				const logger = this.$fxLogger.createInfo('financial-manage.financial-archives.settlement-way.add', { name: this.formData.name })
				return this.$fxApi(`${apiName}.addDetails`)({ data: this.formData, logger }).then(res => {
					this.formData = res
					this.fxDataVerification.resetData(this.formData)
					return Promise.resolve()
				})
			} else {
				const logger = this.$fxLogger.createInfo('financial-manage.financial-archives.settlement-way.update', this.createLoggerParams())
				return this.$fxApi(`${apiName}.saveDetails`, this.formData.id)({ data: this.formData, logger }).then(res => {
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
		verificationDetails () {
			return this.fxDataVerification.checkComfirm(this.formData)
		},
		onBeforeClose (close) {
			this.verificationDetails().then(close)
		},
		memoTabHandler ({ focus }) {
			this.switchDisabled ? focus('saveBtn') : focus('enableFlag')
		},
		cancelBtnTabHandler ({ focus }) {
			if (this.hasEditAuth) {
				!this.isSystem && focus('code')
			} else if (this.switchDisabled) {
				focus('saveBtn')
			} else {
				focus('enableFlag')
			}
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
	.form-input {
		width:280px
	}
}
</style>
