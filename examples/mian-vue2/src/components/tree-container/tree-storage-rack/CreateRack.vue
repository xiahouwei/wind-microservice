<template>
	<w-dialog v-model="dialogVisible" :title="`${dialogTitle}货架`" width="460px" :beforeClose="onBeforeClose">
		<div class="create-area">
			<el-form ref="rackForm" :model="rackForm" :rules="rules" size="mini" inline label-width="110px">
				<el-form-item prop="organId" label="所属机构：">
					<w-select-tab
						ref="organId"
						v-model="rackForm.organId"
						v-fx-enter:focus.houseId
						v-fx-tab:focus.houseId
						:optionlist="organSelectList"
						:disabled="isSystem"
						class="form-item-input"
						@change="onOrganChange"
					></w-select-tab>
				</el-form-item>
				<el-form-item prop="houseId" label="所属仓库：">
					<w-select
						ref="houseId"
						v-model="rackForm.houseId"
						v-fx-enter:focus.code
						v-fx-tab:focus.code
						class="form-item-input"
						:optionlist="houseSelectList"
						:disabled="isSystem"
					>
					</w-select>
				</el-form-item>
				<el-form-item prop="code" label="货架编码：">
					<w-input
						ref='code'
						v-model="rackForm.code"
						v-fx-enter:focus.name
						v-fx-tab:focus.name
						:maxlength="$fxCommon.getFxInputMaxLength('storageCode')"
						:regType="$fxCommon.getFxInputReg('storageCode')"
						:disabled="isSystem"
						class="form-item-input"
					></w-input>
				</el-form-item>
				<el-form-item prop="name" label="货架名称：">
					<w-input
						ref="name"
						v-model="rackForm.name"
						v-fx-enter:focus.shelfType
						v-fx-tab:focus.shelfType
						:maxlength="$fxCommon.getFxInputMaxLength('commonName')"
						:regType="$fxCommon.getFxInputReg('commonName')"
						:disabled="isSystem"
						class="form-item-input"
					></w-input>
				</el-form-item>
				<el-form-item label="货架类型：">
					<w-select
						ref="shelfType"
						v-model="rackForm.shelfType"
						v-fx-enter:focus.enableFlag
						v-fx-tab:focus.enableFlag
						class="form-item-input"
						:optionlist="shelfTypeSelectList"
						:optionProp="optionProp"
						:disabled="isSystem"
					>
					</w-select>
				</el-form-item>
				<el-form-item label="货架状态：">
					<w-select
						ref="enableFlag"
						v-model="rackForm.enableFlag"
						v-fx-enter:focus.saveBtn
						v-fx-tab:focus.saveBtn
						class="form-item-input"
						:optionlist="enableFlagList"
						:optionProp="optionProp"
						:disabled="isSystem"
					>
					</w-select>
				</el-form-item>
			</el-form>
		</div>
		<template slot="footer">
			<el-button ref="cancelBtn" v-fx-tab:focus.organId @click="onCancelClick">取消</el-button>
			<el-button ref="saveBtn" v-show="!isSystem" v-fx-tab:focus.cancelBtn type="primary" @click="onSubmitClick">保存</el-button>
		</template>
	</w-dialog>
</template>
<script>
import { apiName } from './Index.vue'
export default {
	name: 'createRack',
	data () {
		return {
			dialogVisible: false,
			rackForm: {},
			rules: {
				organId: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				houseId: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				code: [{ required: true, message: '该字段不能为空', trigger: 'no' }]
			},
			organSelectList: [],
			houseSelectList: [],
			actionType: 'add',
			shelfTypeSelectList: this.$fxTypeMiddleware.getCommonTypeList('storageRackTypeList'),
			enableFlagList: this.$fxStateMiddleware.getStateConfig('enableState'),
			optionProp: {
				name: 'label'
			},
			fxDataVerification: this.$fxUtils.fxDataVerification()
		}
	},
	computed: {
		dialogTitle () {
			return this.actionType === 'add' ? '新建' : '编辑'
		},
		isSystem () {
			return !!this.rackForm.sysFlag
		}
	},
	methods: {
		add (data) {
			this.actionType = 'add'
			this.rackForm = {
				id: '',
				code: '',
				name: '',
				enableFlag: 1,
				houseId: data.id,
				organId: data.organId,
				organType: data.organType,
				shelfType: 1000,
				sysFlag: 0
			}
			this.getOrganList().then(this.getHouseList).then(() => {
				this.dialogVisible = true
				this.$nextTick(() => {
					this.fxDataVerification.resetData(this.rackForm)
					this.$refs.rackForm && this.$refs.rackForm.clearValidate()
					this.$refs.code.focus()
				})
			})
		},
		edit (data) {
			this.actionType = 'edit'
			this.rackForm = data
			this.getOrganList().then(this.getHouseList).then(() => {
				this.dialogVisible = true
				this.$nextTick(() => {
					this.fxDataVerification.resetData(this.rackForm)
					this.$refs.rackForm && this.$refs.rackForm.clearValidate()
					if (this.isSystem) {
						this.$fxUtils.vDoRefFocus(this, 'cancelBtn')
					} else {
						this.$refs.code.focus()
					}
				})
			})
		},
		onSubmitClick () {
			this.$refs.rackForm.validate()
				.then(this.onSubmitHandler)
				.then(this.updateTree)
		},
		onSubmitHandler () {
			if (this.actionType === 'add') {
				const type = this.$fxTypeMiddleware.getCommonTypeItemById('storageRackTypeList')(this.rackForm.shelfType).label
				const logger = this.$fxLogger.createInfo('basic-archives.storage-manage.addRack', { code: this.rackForm.code, name: this.rackForm.name, type })
				return this.$fxApi(`${apiName}.addRack`)({ data: this.rackForm, logger }).then(() => {
					this.fxDataVerification.resetData(this.rackForm)
					return Promise.resolve()
				})
			} else {
				if (!this.rackForm.enableFlag) {
					return this.$fxConfirm('货架停用后入库单和出库单将无法选到对应的货位，您确认要停用吗？').then(() => {
						return this.onSaveHandler()
					})
				} else {
					return this.onSaveHandler()
				}
			}
		},
		onSaveHandler () {
			const logger = this.$fxLogger.createInfo('basic-archives.storage-manage.updateRack', this.createLoggerParams())
			return this.$fxApi(`${apiName}.editRack`, this.rackForm.id)({ data: this.rackForm, logger }).then(() => {
				this.fxDataVerification.resetData(this.rackForm)
				return Promise.resolve()
			})
		},
		createLoggerParams () {
			const originData = this.fxDataVerification.getOriginData()
			originData.organName = this.$fxUtils.getSelectTagById(originData.organId, this.organSelectList).name || ''
			originData.houseName = this.getNameById(originData.houseId, this.houseSelectList)
			const rackForm = this.$fxUtils.deepClone(this.rackForm)
			rackForm.organName = this.$fxUtils.getSelectTagById(rackForm.organId, this.organSelectList).name || ''
			rackForm.houseName = this.getNameById(rackForm.houseId, this.houseSelectList)
			return {
				pre: originData,
				cur: rackForm,
				name: this.rackForm.name,
				code: this.rackForm.code
			}
		},
		getNameById (id, list) {
			if (!id) {
				return ''
			}
			const selectedItem = list.find(item => item.id === id)
			return selectedItem ? selectedItem.name : ''
		},
		updateTree () {
			this.dialogVisible = false
			this.$emit('on-update')
		},
		getOrganList () {
			const ids = this.rackForm.organId ? [this.rackForm.organId] : []
			return this.$fxApi(`${apiName}.getOrganList`)({ data: { ids, names: ['Shop', 'Center'] } }).then(res => {
				this.organSelectList = res
				return Promise.resolve(res)
			})
		},
		getHouseList () {
			const ids = this.rackForm.houseId ? [this.rackForm.houseId] : []
			return this.$fxApi(`${apiName}.getHouseList`, this.rackForm.organId)({ data: ids }).then(res => {
				this.houseSelectList = res
				return Promise.resolve(res)
			})
		},
		onOrganChange () {
			this.rackForm.houseId = ''
			this.getHouseList()
		},
		onCancelClick () {
			this.dialogVisible = false
		},
		verificationDetails () {
			return this.fxDataVerification.checkComfirm(this.rackForm)
		},
		onBeforeClose (close) {
			this.verificationDetails().then(close)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.create-area {
	width: 100%
	height: 300px
	box-sizing: border-box
	.form-item-input {
		width:280px
	}
}
</style>
