<template>
	<w-dialog v-model="dialogVisible" width="460px" title="编辑区域">
		<div class="create-area">
			<el-form ref="areaForm" :model="areaForm" :rules="rules" size="mini" inline>
				<el-form-item label="上级区域编号：" label-width="110px">
					<w-input v-model="parentOrgan.code" class="form-item-input" disabled/>
				</el-form-item>
				<el-form-item label="上级区域名称：" label-width="110px">
					<w-select
						ref="parentName"
						v-model="parentOrgan.id"
						v-fx-tab:focus.areaCode
						v-fx-enter:focus.areaCode
						class="form-item-input"
						:optionlist="areaList"
						@change="onAreaChange"
					>
					</w-select>
				</el-form-item>
				<el-form-item prop="code" label="当前区域编号："  label-width="110px">
					<w-input
						ref="areaCode"
						v-model="areaForm.code"
						v-fx-enter:focus.name
						v-fx-tab:focus.name
						:maxlength="$fxCommon.getFxInputMaxLength('commonCode')"
						:regType="$fxCommon.getFxInputReg('commonCode')"
						class="form-item-input"
					></w-input>
				</el-form-item>
				<el-form-item prop="name" label="当前区域名称："  label-width="110px">
					<w-input
						ref='name'
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
			<div class="reverse">
				<el-button
					ref="saveBtn"
					slot="footer"
					v-fx-tab:focus.cancelBtn
					type="primary"
					@click="onSubmitClick"
				>保存</el-button>
				<el-button ref="cancelBtn" v-fx-tab:focus.parentName @click="onCancelClick">取消</el-button>
			</div>
		</template>
	</w-dialog>
</template>
<script>
export default {
	name: 'editArea',
	data () {
		return {
			dialogVisible: false,
			areaForm: {
				code: '',
				name: '',
				id: ''
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
			this.getAreaList(area.id).then(() => {
				area.fatherId = area.fatherId || ''
				const parentOrgan = this.areaList.find(item => {
					return item.id === area.fatherId
				})
				this.parentOrgan = this.$fxUtils.deepClone(parentOrgan)
				this.areaForm = this.$fxUtils.deepClone(area)
				this.dialogVisible = true
				this.$nextTick(() => {
					if (this.$refs.areaForm) {
						this.$refs.areaForm.clearValidate()
						this.$refs.name.focus()
					}
				})
			})
		},
		onSubmitClick () {
			this.$refs.areaForm.validate()
				.then(this.onSaveArea)
				.then(this.updateTree)
		},
		onSaveArea () {
			const params = {
				code: this.areaForm.code,
				name: this.areaForm.name,
				fatherId: this.parentOrgan.id
			}
			const logger = this.$fxLogger.createInfo('basic-archives.organ-manage.organTreeUpdate', { name: params.name })
			return this.$fxApi('region.regionSave', this.areaForm.id)({ data: params, logger }).then(res => {
				this.$fxMessage.success('修改成功')
				return Promise.resolve(res)
			})
		},
		updateTree (res) {
			this.dialogVisible = false
			this.$emit('on-update')
		},
		getAreaList (id) {
			return this.$fxApi('region.getFathersList', id).then(res => {
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
.reverse {
	display flex
	flex-direction: row-reverse
	button {
		margin-left 10px
	}
}
</style>
