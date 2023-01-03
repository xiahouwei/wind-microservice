<template>
	<w-dialog v-model="dialogVisible" title="新建区域" width="460px">
		<div class="create-area">
			<el-form ref="areaForm" :model="areaForm" :rules="rules" size="mini" inline>
				<el-form-item label="上级区域编号：" label-width="110px">
					<w-input v-model="parentOrgan.code" class="form-item-input" disabled/>
				</el-form-item>
				<el-form-item label="上级区域名称：" label-width="110px">
					<w-select
						ref="parentName"
						v-model="parentOrgan.id"
						v-fx-enter:focus.code
						v-fx-tab:focus.code
						class="form-item-input"
						:optionlist="areaList"
						@change="onAreaChange"
					>
					</w-select>
				</el-form-item>
				<el-form-item prop="code" label="当前区域编号：" label-width="110px">
					<w-input
						ref='code'
						v-model="areaForm.code"
						v-fx-enter:focus.areaName
						v-fx-tab:focus.areaName
						:maxlength="$fxCommon.getFxInputMaxLength('commonCode')"
						:regType="$fxCommon.getFxInputReg('commonCode')"
						class="form-item-input"
					></w-input>
				</el-form-item>
				<el-form-item prop="name" label="当前区域名称：" label-width="110px">
					<w-input
						ref="areaName"
						v-model="areaForm.name"
						v-fx-enter="onSubmitClick"
						v-fx-tab:focus.saveBtn
						:maxlength="$fxCommon.getFxInputMaxLength('commonName')"
						:regType="$fxCommon.getFxInputReg('commonName')"
						class="form-item-input"
					></w-input>
				</el-form-item>
			</el-form>
		</div>
		<template slot="footer">
			<el-button ref="cancelBtn" v-fx-tab:focus.parentName @click="onCancelClick">取消</el-button>
			<el-button ref="saveBtn" v-fx-tab:focus.cancelBtn type="primary" @click="onSubmitClick">保存</el-button>
		</template>
	</w-dialog>
</template>
<script>
export default {
	name: 'createArea',
	data () {
		return {
			dialogVisible: false,
			areaForm: {
				code: '',
				name: ''
			},
			rules: {
				code: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				name: [{ required: true, message: '该字段不能为空', trigger: 'no' }]
			},
			parentOrgan: {},
			areaList: []
		}
	},
	methods: {
		open (area) {
			if (area.treeType === 'root') {
				area.id = ''
				area.code = ''
			}
			this.getAreaList().then(this.refreshFormData).then(() => {
				this.parentOrgan = this.$fxUtils.deepClone(area)
				this.dialogVisible = true
				this.$nextTick(() => {
					if (this.$refs.areaForm) {
						this.$refs.areaForm.clearValidate()
						this.$refs.code.focus()
					}
				})
			})
		},
		getArchiveCode () {
			return this.$fxApi('archiveCode.get', 'Region')
		},
		async refreshFormData () {
			const code = await this.getArchiveCode()
			this.areaForm = {
				code,
				name: ''
			}
		},
		onSubmitClick () {
			this.$refs.areaForm.validate()
				.then(this.onCreateArea)
				.then(this.updateTree)
		},
		onCreateArea () {
			const params = {
				code: this.areaForm.code,
				name: this.areaForm.name,
				fatherId: this.parentOrgan.id
			}
			const logger = this.$fxLogger.createInfo('basic-archives.organ-manage.organTreeAdd', { name: params.name })
			return this.$fxApi('region.regionAdd')({ data: params, logger }).then(res => {
				this.$fxMessage.success('新建成功')
				return Promise.resolve(res)
			})
		},
		updateTree (res) {
			this.dialogVisible = false
			this.$emit('on-update')
		},
		getAreaList () {
			return this.$fxApi('region.getFathersList').then(res => {
				res.unshift({
					id: '',
					name: '无',
					code: ''
				})
				this.areaList = res
				return Promise.resolve(res)
			})
		},
		onAreaChange (id) {
			this.parentOrgan.code = this.areaList.find(item => {
				return item.id === id
			}).code
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
	height: 200px
	box-sizing: border-box
	.form-item-input {
		width:280px
	}
}
</style>
