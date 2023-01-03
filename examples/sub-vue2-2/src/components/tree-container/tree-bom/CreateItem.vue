<template>
	<w-dialog v-model="dialogVisible" :title="`${dialogTitle}BOM`" width="500px">
		<div class="create-area">
			<el-form ref="form" :model="formData" :rules="rules" size="mini" inline>
				<el-form-item  prop="code" label="BOM编号：" label-width="140px">
					<w-input v-model="formData.code" class="form-item-input"/>
				</el-form-item>
				<el-form-item  prop="bomName" label="BOM名称：" label-width="140px">
					<w-input v-model="formData.bomName" class="form-item-input"/>
				</el-form-item>
			</el-form>
		</div>
		<template slot="footer">
			<el-button @click="onCancelClick">取消</el-button>
			<el-button type="primary" @click="onSaveClick">保存</el-button>
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
				code: '',
				bomName: ''
			},
			rules: {
				code: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				bomName: [{ required: true, message: '该字段不能为空', trigger: 'no' }]
			},
			itemTypeList: [],
			bomDetail: {},
			fxDataVerification: this.$fxUtils.fxDataVerification()
		}
	},
	props: {
		type: String
	},
	computed: {
		dialogTitle () {
			return this.actionType === 'add' ? '新建' : '编辑'
		},
		checkData () {
			const data = this.$fxUtils.deepClone(this.bomDetail)
			delete data.details
			return data
		}
	},
	methods: {
		add (data) {
			this.actionType = 'add'
			this.itemId = data.id
			this.refreshFormData(data).then(() => {
				if (this.$refs.form) {
					this.$refs.form.clearValidate()
				}
				this.dialogVisible = true
			})
		},
		async refreshFormData (data) {
			const code = await this.getBomCode(data.id)
			this.formData = {
				code,
				bomName: ''
			}
		},
		edit (details) {
			this.actionType = 'edit'
			this.formData = {
				id: details.id,
				code: details.code,
				bomName: details.name
			}
			this.bomDetail = details
			this.fxDataVerification.resetData(this.checkData)
			if (this.$refs.form) {
				this.$refs.form.clearValidate()
			}
			this.dialogVisible = true
		},
		getBomCode (itemId) {
			return this.$fxApi('bom.getCode', this.type, itemId)
		},
		onSaveClick () {
			this.onValidateFormData().then(this.onSaveHandler).then(() => {
				this.dialogVisible = false
			})
		},
		onValidateFormData () {
			return this.$refs.form.validate().then(() => {
				return Promise.resolve()
			})
		},
		onSaveHandler () {
			if (this.actionType === 'add') {
				const logger = this.$fxLogger.createInfo('basic-archives.bom.add', {
					code: this.formData.code,
					name: this.formData.bomName
				})
				return this.$fxApi('bom.addBom', this.type)({
					data: {
						code: this.formData.code,
						bomName: this.formData.bomName,
						itemId: this.itemId
					},
					logger
				}).then(res => {
					this.$emit('refresh', res.id)
					return Promise.resolve()
				})
			} else {
				this.bomDetail.code = this.formData.code
				this.bomDetail.name = this.formData.bomName
				const logger = this.$fxLogger.createInfo('basic-archives.bom.update', this.createLoggerParams())
				return this.$fxApi('bom.editBom', this.type)({
					data: this.bomDetail,
					logger
				}).then(res => {
					this.fxDataVerification.resetData(this.checkData)
					this.$emit('refresh', res.id)
					return Promise.resolve(res)
				})
			}
		},
		createLoggerParams () {
			const originData = this.fxDataVerification.getOriginData()
			const bomDetail = this.$fxUtils.deepClone(this.bomDetail)
			return {
				pre: originData,
				cur: bomDetail,
				name: bomDetail.name
			}
		},
		onCancelClick () {
			this.dialogVisible = false
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.create-area {
	width: 100%
	box-sizing: border-box
	.form-item {
		margin: 25px 0
	}
	.form-item-input {
		width:280px
	}
}
</style>
