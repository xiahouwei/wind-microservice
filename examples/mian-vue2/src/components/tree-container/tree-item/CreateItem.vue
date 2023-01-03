<template>
	<w-dialog v-model="dialogVisible" :title="`${dialogTitle}品项类别`" width="500px">
		<div class="create-area">
			<el-form ref="form" :model="formData" :rules="rules" size="mini" inline>
				<el-form-item label="上级品项类别编号：" label-width="140px">
					<w-input v-model="formData.fatherCode" class="form-item-input" disabled/>
				</el-form-item>
				<el-form-item label="上级品项类别名称：" label-width="140px">
					<w-select
						ref="fatherName"
						v-model="formData.fatherId"
						v-fx-enter:focus.code
						v-fx-tab:focus.code
						class="form-item-input"
						:optionlist="itemTypeList"
						@change="onItemTypeChange"
					>
					</w-select>
				</el-form-item>
				<el-form-item prop="code" label="当前品项类别编号：" label-width="140px">
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
				<el-form-item prop="name" label="当前品项类别名称：" label-width="140px">
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
			<el-button ref="cancelBtn" v-fx-tab:focus.fatherName @click="onCancelClick">取消</el-button>
			<el-button ref="saveBtn" v-fx-tab:focus.cancelBtn type="primary" @click="onSaveClick">保存</el-button>
		</template>
	</w-dialog>
</template>
<script>
export default {
	name: 'createItem',
	data () {
		return {
			dialogVisible: false,
			actionType: '',
			formData: {
				fatherCode: '',
				fatherId: '',
				code: '',
				name: ''
			},
			rules: {
				code: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				name: [{ required: true, message: '该字段不能为空', trigger: 'no' }]
			},
			itemTypeList: []
		}
	},
	computed: {
		dialogTitle () {
			return this.actionType === 'add' ? '新建' : '编辑'
		}
	},
	methods: {
		add (data) {
			this.actionType = 'add'
			this.getitemTypeList().then(() => {
				return this.refreshFormData(data)
			}).then(() => {
				this.dialogVisible = true
				this.$nextTick(() => {
					this.$refs.form.clearValidate()
					this.$refs.code.focus()
				})
			})
		},
		async refreshFormData (data) {
			const fatherId = data.id === '1' ? '' : data.id
			const code = await this.getArchiveCode(fatherId)
			this.formData = {
				fatherId,
				fatherCode: this.getFather(data.id).code,
				code,
				name: ''
			}
			return Promise.resolve()
		},
		edit (details) {
			this.actionType = 'edit'
			this.getitemTypeList().then(() => {
				this.formData = this.$fxUtils.deepClone(details)
				this.formData = {
					...this.$fxUtils.deepClone(details),
					fatherCode: this.getFather(details.fatherId).code
				}
				this.dialogVisible = true
				this.$nextTick(() => {
					this.$refs.form.clearValidate()
					this.$refs.name.focus()
				})
			})
		},
		getArchiveCode (fatherId) {
			return this.$fxApi('itemType.getItemTypeCode')({ data: { fatherId } })
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
				const logger = this.$fxLogger.createInfo('basic-archives.item-manage.itemTypeAdd', { name: this.formData.name })
				return this.$fxApi('itemType.add')({ data: this.formData, logger }).then(res => {
					this.$fxMessage.success('新建品项分类成功')
					return Promise.resolve()
				})
			} else {
				const logger = this.$fxLogger.createInfo('basic-archives.item-manage.itemTypeUpdate', { name: this.formData.name })
				return this.$fxApi('itemType.save', this.formData.id)({ data: this.formData, logger }).then(res => {
					this.$fxMessage.success('保存品项分类成功')
					return Promise.resolve()
				})
			}
		},
		onCancelClick () {
			this.dialogVisible = false
		},
		async onItemTypeChange (id) {
			this.formData.fatherId = id
			this.formData.fatherCode = this.getFather(id).code
			if (this.actionType === 'add') {
				this.formData.code = await this.getArchiveCode(id)
			}
		},
		getitemTypeList () {
			return this.$fxApi('itemType.getFatherList').then(res => {
				res.unshift({
					id: '',
					name: '无',
					code: ''
				})
				this.itemTypeList = res
				return Promise.resolve(res)
			})
		},
		getFather (id) {
			if (!id) {
				return ''
			}
			return this.itemTypeList.find(item => {
				return item.id === id
			}) || {}
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
