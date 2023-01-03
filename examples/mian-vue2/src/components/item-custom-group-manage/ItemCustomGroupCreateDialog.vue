<template>
	<w-dialog
		v-model="dialogVisible"
		:title="`${dialogTitle}品项自定义分组`"
		width="480px"
		:showMoreBtn="showMoreBtn"
		:beforeClose="onBeforeClose"
		@close="onRefresh"
	>
		<template slot="tools">
			<w-link icon="delete-trash" type="default" @click="onDeleteClick">删除</w-link>
		</template>
		<div class="create-area">
			<el-form ref="form" :model="formData" :rules="rules" size="mini" label-width="100px" inline>
				<el-form-item prop="code" label="分组编号：">
					<w-input
						ref="code"
						v-model="formData.code"
						v-fx-tab:focus.name
						:maxlength="$fxCommon.getFxInputMaxLength('shortCode')"
						placeholder="请输分组编号"
						:regType="$fxCommon.getFxInputReg('shortCode')"
						:disabled="!hasEditAuth"
						class="form-item-input"
					></w-input>
				</el-form-item>
				<el-form-item prop="name" label="分组名称：">
					<w-input
						ref="name"
						v-model="formData.name"
						v-fx-tab="enableFlagTabHandler"
						:maxlength="50"
						:disabled="!hasEditAuth"
						class="form-item-input"
						placeholder="请输入分组名称"
					/>
				</el-form-item>
				<el-form-item prop="relAllGoods" label="适用品项：">
					<el-radio :disabled="!hasEditAuth" v-model="formData.relAllGoods" :label="1">全部品项</el-radio>
					<el-radio :disabled="!hasEditAuth" v-model="formData.relAllGoods" :label="0">自定义</el-radio>
					<el-button type="primary" :disabled="!!formData.relAllGoods || !hasEditAuth" @click="onSettingItem">设置关联品项</el-button>
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
				v-fx-auth:basic-archives_support-archives_item-custom-group.edit-item-custom-group
				v-fx-tab:focus.cancelBtn
				@click="onSaveClick"
			>保存</el-button>
			<el-button
				ref="saveAndAddBtn"
				type="primary"
				v-fx-auth:basic-archives_support-archives_item-custom-group.edit-item-custom-group="isAdd"
				v-fx-tab:focus.saveBtn
				@click="onSaveAndAddClick"
			>保存并新建</el-button>
		</template>
		<connectItemDialog ref="connectItemDialog"></connectItemDialog>
	</w-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import connectItemDialog from './connect-item/connect-item.vue'
export const apiName = 'itemCustomGroup'
export default {
	name: 'createItemCustomGroup',
	components: {
		connectItemDialog
	},
	data () {
		const validateIgnore = (rule, value, callback) => {
			callback()
		}
		return {
			dialogVisible: false,
			formData: {
				code: '',
				name: '',
				relAllGoods: 1
			},
			rules: {
				code: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				name: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				relAllGoods: [{ required: true, trigger: 'no', validator: validateIgnore }]
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
			return this.detailsAuthGetter('basic-archives_support-archives_item-custom-group.edit-item-custom-group')
		},
		showMoreBtn () {
			return !this.isAdd && this.detailsAuthGetter('basic-archives_support-archives_item-custom-group.delete-item-custom-group')
		}
	},
	methods: {
		async add () {
			this.billDeleteFlag = false
			const code = await this.getArchiveCode()
			this.formData = {
				code,
				name: '',
				relAllGoods: 1
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
				} else {
					this.$fxUtils.vDoRefFocus(this, 'cancelBtn')
				}
				this.$refs.form.clearValidate()
				this.fxDataVerification.resetData(this.formData)
			})
		},
		getArchiveCode () {
			return this.$fxApi('archiveCode.get', 'Custom_Group')
		},
		onSettingItem () {
			this.onSaveClick().then(() => {
				this.$refs.connectItemDialog.open(this.formData)
			})
		},
		onRefresh () {
			this.$emit('on-refresh', this.billDeleteFlag)
		},
		onCodeInput (val) {
			this.formData.code = val.replace(/[^A-Za-z0-9]/g, '')
		},
		onSaveClick () {
			return this.onValidateFormData().then(this.onSaveHandler)
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
				const logger = this.$fxLogger.createInfo('basic-archives.support-archives.item-custom-group.add', { name: this.formData.name, code: this.formData.code })
				return this.$fxApi(`${apiName}.add`)({ data: this.formData, logger }).then(res => {
					this.formData = res
					this.fxDataVerification.resetData(this.formData)
					return Promise.resolve()
				})
			} else {
				const data = Object.assign(this.formData, { id: this.formData.id })
				const logger = this.$fxLogger.createInfo('basic-archives.support-archives.item-custom-group.update', this.createLoggerParams())
				return this.$fxApi(`${apiName}.save`)({ data, logger }).then(res => {
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
			this.$fxConfirm('是否确定删除品项自定义分组？').then(() => {
				this.onDeleteHandler().then(this.onCancelClick)
			})
		},
		onDeleteHandler () {
			const data = [this.formData.id]
			const logger = this.$fxLogger.createInfo('basic-archives.support-archives.item-custom-group.delete', { name: this.formData.name, code: this.formData.code })
			return this.$fxApi(`${apiName}.delete`)({ data, logger }).then(res => {
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
		enableFlagTabHandler ({ focus }) {
			this.isAdd ? focus('saveAndAddBtn') : focus('saveBtn')
		},
		cancelBtnTabHandler ({ focus }) {
			this.hasEditAuth ? focus('code') : focus('saveBtn')
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
	.form-item-input {
		width:280px
	}
}
</style>
