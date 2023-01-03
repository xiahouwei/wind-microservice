<template>
	<w-dialog v-model="dialogVisible" :title="`${dialogTitle}所属企业`" width="460px">
		<div class="create-area">
			<el-form ref="form" :model="formData" :rules="rules" size="mini" inline>
				<el-form-item label="当前类别编号：" label-width="110px">
					<w-input v-model="formData.customerTypeCode" class="form-item-input" disabled/>
				</el-form-item>
				<el-form-item label="当前类别名称：" label-width="110px">
					<w-select
						ref="customerType"
						v-model="formData.customerTypeId"
						v-fx-enter:focus.code
						v-fx-tab:focus.code
						class="form-item-input"
						:optionlist="customerTypeList"
						@change="onCustomerTypeChange"
					>
					</w-select>
				</el-form-item>
				<el-form-item prop="code" label="所属企业编号：" label-width="110px">
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
				<el-form-item prop="name" label="所属企业名称：" label-width="110px">
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
			<el-button ref="cancelBtn" v-fx-tab:focus.customerType @click="onCancelClick">取消</el-button>
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
				customerTypeCode: '',
				customerTypeId: '',
				code: '',
				name: ''
			},
			rules: {
				code: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				name: [{ required: true, message: '该字段不能为空', trigger: 'no' }]
			},
			customerTypeList: []
		}
	},
	computed: {
		dialogTitle () {
			return this.actionType === 'add' ? '新建' : '编辑'
		}
	},
	methods: {
		add (treeNode) {
			this.actionType = 'add'
			this.getCustomerTypeList().then(() => {
				this.refreshFormData(treeNode.id).then(() => {
					this.dialogVisible = true
					this.$nextTick(() => {
						this.$refs.form.clearValidate()
						this.$refs.code.focus()
					})
				})
			})
		},
		async refreshFormData (customerTypeId) {
			const customerType = this.getCustomerTypeById(customerTypeId)
			const code = await this.getArchiveCode()
			this.formData = {
				customerTypeCode: customerType.code,
				customerTypeId,
				code,
				name: ''
			}
			return Promise.resolve()
		},
		edit (details) {
			this.actionType = 'edit'
			this.getCustomerTypeList().then(() => {
				const customerType = this.getCustomerTypeById(details.customerTypeId)
				this.formData = {
					customerTypeCode: customerType.code,
					...this.$fxUtils.deepClone(details)
				}
				this.dialogVisible = true
				this.$nextTick(() => {
					this.$refs.form.clearValidate()
					this.$refs.name.focus()
				})
			})
		},
		getArchiveCode () {
			return this.$fxApi('archiveCode.get', 'Customer_Group')
		},
		getCustomerTypeList () {
			return new Promise(resolve => {
				this.$fxApi('customerType.getList').then(res => {
					this.customerTypeList = res
					resolve()
				})
			})
		},
		getCustomerTypeById (id) {
			return this.customerTypeList.find(item => {
				return item.id === id
			})
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
				const logger = this.$fxLogger.createInfo('basic-archives.customer-manage.customerGroupAdd', { name: this.formData.name })
				return this.$fxApi('customerGroup.add')({ data: this.formData, logger }).then(res => {
					return Promise.resolve()
				})
			} else {
				const logger = this.$fxLogger.createInfo('basic-archives.customer-manage.customerGroupUpdate', { name: this.formData.name })
				return this.$fxApi('customerGroup.save', this.formData.id)({ data: this.formData, logger }).then(res => {
					return Promise.resolve()
				})
			}
		},
		onCancelClick () {
			this.dialogVisible = false
		},
		onCustomerTypeChange (item) {
			const customerType = this.getCustomerTypeById(item)
			this.formData.customerTypeCode = customerType.code
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
