<template>
	<w-dialog v-model="dialogVisible" :title="dialogTitle" width="520px" :beforeClose="onBeforeClose">
		<div class="create-area">
			<el-form ref="areaForm" :model="certificatForm" :rules="rules" size="mini">
				<el-form-item prop="type" label="证照类型：" label-width="100px">
					<w-select
						ref="certificatType"
						v-model="certificatForm.type"
						v-fx-tab:focus.nameInput
						class="form-item-input"
						:optionlist="certificatTypeList"
					>
					</w-select>
				</el-form-item>
				<el-form-item prop="name" label="证照名称：" label-width="100px">
					<w-input
						v-model="certificatForm.name"
						v-fx-tab:focus.certificatCode
						:maxlength="150"
						class="form-item-input"
						placeholder="请输入证照名称"
						ref='nameInput'
					/>
				</el-form-item>
				<el-form-item prop="code" label="证照编号：" label-width="100px">
					<w-input
						ref="certificatCode"
						v-model="certificatForm.code"
						v-fx-tab:focus.certificatDate
						:maxlength="codeMaxlength"
						placeholder="请输入证照编号"
						:regType="$fxCommon.getFxInputReg('shortCode')"
						class="form-item-input"
					></w-input>
				</el-form-item>
				<el-form-item prop="dateRang" label="证照有效期：" label-width="100px">
					<w-date-picker
						ref="certificatDate"
						v-model="certificatForm.dateRang"
						v-fx-tab:focus.saveBtn
						type="daterange"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						format="yyyy 年 MM 月 dd 日"
						value-format="yyyy-MM-dd"
						class="form-item-input"
					></w-date-picker>
				</el-form-item>
				<el-form-item prop="fileList" label="附件：" label-width="100px">
					<fx-upload :fileList="certificatForm.fileList" type="image" :limit="1"></fx-upload>
				</el-form-item>
			</el-form>
		</div>
		<template slot="footer">
			<el-button ref="cancelBtn" v-fx-tab:focus.certificatType @click="onCancelClick">取消</el-button>
			<el-button ref="saveBtn" v-fx-tab:focus.cancelBtn type="primary" @click="onSubmitClick">保存</el-button>
		</template>
	</w-dialog>
</template>
<script>
export default {
	name: 'certificateEditDialog',
	props: {
		resourceTypeList: {
			type: Array,
			default: () => {
				return []
			}
		},
		resourceList: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	data () {
		const validateCode = (rule, value, callback) => {
			if (value.length > 18 && this.certificatForm.type === '1') {
				callback(new Error('【社会统一信用代码】最大为18位'))
			} else {
				callback()
			}
		}
		return {
			dialogVisible: false,
			title: '',
			certificatForm: {
				type: '',
				name: '',
				code: '',
				dateRang: [],
				fileList: []
			},
			rules: {
				type: [{ required: true, message: '请选择证照类型', trigger: 'no' }],
				name: [{ required: true, message: '请输入证照名称', trigger: 'no' }],
				code: [{ validator: validateCode, trigger: 'no' }]
			},
			actionType: '',
			actionIndex: 0,
			fxDataVerification: this.$fxUtils.fxDataVerification()
		}
	},
	computed: {
		dialogTitle () {
			return this.actionType === 'add' ? '新增资质' : '编辑资质'
		},
		certificatTypeList () {
			if (this.resourceList.find(item => item.type === '1') && this.certificatForm.type !== '1' && this.resourceList.find(item => item.type === '2') && this.certificatForm.type !== '2') {
				return this.resourceTypeList.slice(2)
			} else if (this.resourceList.find(item => item.type === '1') && this.certificatForm.type !== '1') {
				return this.resourceTypeList.slice(1)
			} else if (this.resourceList.find(item => item.type === '2') && this.certificatForm.type !== '2') {
				return this.resourceTypeList.slice(0, 1)
			} else {
				return this.resourceTypeList
			}
		},
		codeMaxlength () {
			return this.certificatForm.type === '1' ? 18 : this.$fxCommon.getFxInputMaxLength('shortCode')
		}
	},
	methods: {
		addOpen () {
			this.actionType = 'add'
			this.certificatForm = {
				type: '',
				name: '',
				code: '',
				date: '',
				fileList: [],
				dateRang: []
			}
			this.fxDataVerification.resetData(this.certificatForm)
			this.dialogVisible = true
			this.$nextTick(() => {
				this.$refs.areaForm.clearValidate()
				this.$refs.nameInput.focus()
			})
		},
		editOpen (params, index) {
			this.actionType = 'edit'
			this.actionIndex = index
			this.certificatForm = {
				...this.$fxUtils.deepClone(params),
				fileList: params.appendixUrl ? [params.appendixUrl] : [],
				dateRang: (params.begin && params.end) ? [params.begin, params.end] : []
			}
			this.fxDataVerification.resetData(this.certificatForm)
			this.dialogVisible = true
			this.$nextTick(() => {
				this.$refs.areaForm.clearValidate()
				this.$refs.nameInput.focus()
			})
		},
		onSubmitClick () {
			this.$refs.areaForm.validate().then(() => {
				const certificat = {
					id: this.certificatForm.id,
					type: this.certificatForm.type,
					name: this.certificatForm.name,
					code: this.certificatForm.code,
					begin: this.certificatForm.dateRang[0],
					end: this.certificatForm.dateRang[1],
					appendixUrl: this.certificatForm.fileList[0]
				}
				this.onSubmitHandler(certificat)
				this.dialogVisible = false
			})
		},
		onSubmitHandler (certificat) {
			if (this.actionType === 'add') {
				this.$emit('on-add-submit', certificat)
			} else {
				this.$emit('on-edit-submit', certificat, this.actionIndex)
			}
		},
		verificationDetails () {
			return this.fxDataVerification.checkComfirm(this.certificatForm)
		},
		onBeforeClose (close) {
			this.verificationDetails().then(close)
		},
		onCancelClick () {
			this.verificationDetails().then(() => {
				this.dialogVisible = false
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.create-area {
	width: 100%
	height: 350px
	box-sizing: border-box
	.form-item-input {
		width:320px
	}
}
</style>
