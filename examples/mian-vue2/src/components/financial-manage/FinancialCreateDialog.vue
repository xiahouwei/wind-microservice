<template>
	<w-dialog
		v-model="dialogVisible"
		:title="`${dialogTitle}财务分类`"
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
				<el-form-item prop="code" label="财务分类编号：" label-width="110px">
					<w-input
						ref="code"
						v-model="formData.code"
						v-fx-tab:focus.name
						:maxlength="$fxCommon.getFxInputMaxLength('shortCode')"
						placeholder="请输入财务分类编号"
						:regType="$fxCommon.getFxInputReg('shortCode')"
						:disabled="!hasEditAuth"
						class="form-item-input"
					></w-input>
				</el-form-item>
				<el-form-item prop="name" label="财务分类名称：" label-width="110px">
					<w-input
						ref="name"
						v-model="formData.name"
						v-fx-tab:focus.subject
						:maxlength="50"
						:disabled="!hasEditAuth"
						class="form-item-input"
						placeholder="请输入财务分类名称"
					/>
				</el-form-item>
				<el-form-item prop="subject" label="财务分类类型：" label-width="110px">
					<w-select
						ref="subject"
						v-model="formData.subject"
						v-fx-tab:focus.memo
						class="form-item-input"
						placeholder="请选择"
						:optionlist="financialTypeList"
						:optionProp="{name:'label'}"
						:disabled="!hasEditAuth"
					>
					</w-select>
				</el-form-item>
				<el-form-item label="备注：" label-width="110px">
					<el-input
						ref="memo"
						v-model="formData.memo"
						v-fx-tab="memoTabHandler"
						type="textarea"
						:rows="5"
						:maxlength="400"
						placeholder="请输备注"
						class="form-item-input"
						show-word-limit
						resize="none"
						:disabled="!hasEditAuth"
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
				v-fx-auth:basic-archives_support-archives_financial-class.edit-financial|enable-financial|disable-financial
				v-fx-tab:focus.cancelBtn
				@click="onSaveClick"
			>保存</el-button>
			<el-button
				ref="saveAndAddBtn"
				type="primary"
				v-fx-auth:basic-archives_support-archives_financial-class.edit-financial|enable-financial|disable-financial="isAdd"
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
				subject: '',
				memo: '',
				enableFlag: ''
			},
			rules: {
				code: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				name: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				subject: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				enableFlag: [{ required: true, message: '该字段不能为空', trigger: 'no', validator: validateIgnore }]
			},
			financialTypeList: this.$fxTypeMiddleware.getCommonTypeList('financialType'),
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
			return this.detailsAuthGetter('basic-archives_support-archives_financial-class.edit-financial')
		},
		showMoreBtn () {
			return !this.isAdd && this.detailsAuthGetter('basic-archives_support-archives_financial-class.delete-financial')
		},
		switchDisabled () {
			return ((!this.formData.enableFlag && !this.detailsAuthGetter('basic-archives_support-archives_financial-class.enable-financial')) || (!!this.formData.enableFlag && !this.detailsAuthGetter('basic-archives_support-archives_financial-class.disable-financial')))
		}
	},
	methods: {
		async add () {
			this.billDeleteFlag = false
			const code = await this.getArchiveCode()
			this.formData = {
				code,
				name: '',
				memo: '',
				subject: '1',
				enableFlag: 1,
				tag: []
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
			return this.$fxApi('archiveCode.get', 'FinanceSort')
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
			return this.$refs.form.validate().then(() => {
				return Promise.resolve()
			})
		},
		onSaveHandler () {
			if (this.isAdd) {
				const logger = this.$fxLogger.createInfo('basic-archives.support-archives.financial-class.add', { name: this.formData.name, code: this.formData.code })
				return this.$fxApi('finance.addFinancel')({ data: this.formData, logger }).then(res => {
					this.$fxMessage.success('新建财务分类成功')
					this.formData = res
					this.fxDataVerification.resetData(this.formData)
					return Promise.resolve()
				})
			} else {
				const logger = this.$fxLogger.createInfo('basic-archives.support-archives.financial-class.update', this.createLoggerParams())
				return this.$fxApi('finance.editFinancel', this.formData.id)({ data: this.formData, logger }).then(res => {
					this.$fxMessage.success('保存财务分类成功')
					this.fxDataVerification.resetData(this.formData)
					return Promise.resolve()
				})
			}
		},
		createLoggerParams () {
			const originData = this.fxDataVerification.getOriginData()
			originData.subjectName = this.getSubjectName(originData.subject)
			const organDetails = this.$fxUtils.deepClone(this.formData)
			organDetails.subjectName = this.getSubjectName(organDetails.subject)
			return {
				pre: originData,
				cur: organDetails,
				name: organDetails.name
			}
		},
		getSubjectName (id) {
			return this.$fxTypeMiddleware.getCommonTypeItemById('financialType')(id).label
		},
		onCancelClick () {
			this.verificationDetails().then(() => {
				this.dialogVisible = false
			})
		},
		onDeleteClick () {
			this.deleteCheck()
				.then(this.onDeleteHandler)
				.then(this.onCancelClick)
		},
		onDeleteHandler () {
			const logger = this.$fxLogger.createInfo('basic-archives.support-archives.financial-class.delete', { name: this.formData.name, code: this.formData.code })
			return this.$fxApi('finance.delete', this.formData.id)({ logger }).then(res => {
				this.billDeleteFlag = true
				return Promise.resolve()
			})
		},
		deleteCheck () {
			const params = [this.formData.id]
			return this.deletSingleAlert(params).then(() => {
				return Promise.resolve(params)
			})
		},
		deletSingleAlert (params) {
			return new Promise(resolve => {
				this.$fxApi('finance.deleteCheck')({ data: params }).then(res => {
					if (this.$fxUtils.isEmptyObj(res)) {
						this.$fxConfirm('是否确定删除所选财务分类？').then(() => {
							resolve()
						})
					} else {
						const goods = res.Goods ? `品项类：${res.Goods}个品项使用，` : ''
						const organ = res.Organ ? `机构类：${res.Organ}个机构使用，` : ''
						const Supplier = res.Supplier ? `供货商类：${res.Supplier}个品项使用，` : ''
						const customer = res.Customer ? `客户类：${res.Customer}个机构使用` : ''
						this.$fxConfirm(`该财务分类已经被 ${goods}${organ}${Supplier}${customer}。删除后涉及该所属财务分类下的品项的财务分类均会变更为“无财务分类”，是否继续？`).then(() => {
							resolve()
						})
					}
				})
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
		memoTabHandler ({ focus }) {
			this.switchDisabled ? this.isAdd ? focus('saveAndAddBtn') : focus('saveBtn') : focus('enableFlag')
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
.create-area {
	width: 100%
	height: 320px
	box-sizing: border-box
	.form-item-input {
		width:280px
	}
}
</style>
