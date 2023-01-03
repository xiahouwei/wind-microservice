<template>
	<w-dialog
		v-model="dialogVisible"
		:title="`${dialogTitle}`"
		:showMoreBtn="!isAdd"
		:beforeClose="onBeforeClose"
		:moreBtnOption="moreBtnOption"
		width="550px"
		@close="onClose"

	>
		<div class="create-area">
			<el-form ref="form" :model="formData" :rules="rules" size="mini" inline label-width="130px">
				<el-form-item prop="organ.id" label="加工机构：">
					<w-select-tab
						ref='organ'
						:value="formData.organ.id"
						:optionlist="organSelectList"
						:disabled="authDisabled || !isAdd"
						class="form-item-input"
						@change="onOrganChange"
					></w-select-tab>
				</el-form-item>
				<el-form-item label="默认仓库类型：" prop="defaultHouseType">
					<el-radio-group v-model="formData.defaultHouseType" :disabled="authDisabled || !isAdd">
						<el-radio :label="0">默认加工出库仓库</el-radio>
						<el-radio :label="1">默认领用出库仓库</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item prop="house.id" label="仓库名称：">
					<w-select
						ref="house"
						:value="formData.house.id"
						:optionlist="warehouseList"
						:disabled="authDisabled"
						placeholder="请选择仓库"
						class="form-item-input"
						dropdownWidth='300px'
						@focus='onHouseSelectShow'
						@change='onWarehouseChange'
					></w-select>
				</el-form-item>
			</el-form>
		</div>
		<template slot="footer">
			<el-button
				ref="cancelBtn"
				v-fx-tab:focus.code
				@click="onCancelClick"
			>取消</el-button>
			<el-button
				ref="saveBtn"
				v-fx-tab:focus.cancelBtn
				v-fx-auth:production-manage_dosing-default-house.edit-dosingDefaultHouse
				type="primary"
				@click="onSaveClick"
			>保存</el-button>
		</template>
	</w-dialog>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
	name: 'createFinancial',
	data () {
		return {
			dialogVisible: false,
			formData: {
				organ: { id: '' },
				house: { id: '' },
				defaultHouseType: null
			},
			loggerData: {},
			organSelectList: [],
			warehouseList: [],
			rules: {
				'organ.id': [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				'house.id': [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				defaultHouseType: [{ required: true, message: '请选择默认仓库类型', trigger: 'change' }]
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
		authDisabled () {
			return !this.detailsAuthGetter('production-manage_dosing-default-house.edit-dosingDefaultHouse')
		},
		moreBtnOption () {
			return [{
				show: !this.isAdd && this.detailsAuthGetter('production-manage_dosing-default-house.delete-dosingDefaultHouse'),
				label: '删除',
				icon: 'delete-trash',
				click: this.onDeleteClick
			}]
		}
	},
	methods: {
		async add () {
			this.organSelectList = await this.getStoreOrganList()
			this.formData = {
				organ: {},
				house: {},
				defaultHouseType: null
			}
			this.billDeleteFlag = false
			this.dialogVisible = true
			this.$nextTick(() => {
				this.$refs.form.clearValidate()
				this.fxDataVerification.resetData(this.formData)
			})
		},
		async edit (details) {
			this.formData = details
			this.organSelectList = await this.getStoreOrganList()
			this.organSelectList.forEach(item => {
				item.listData.forEach(organ => {
					if (organ.id === details.organ.id) {
						this.warehouseList = organ.store
					}
				})
			})
			this.dialogVisible = true
			this.$nextTick(() => {
				this.$refs.form.clearValidate()
				this.fxDataVerification.resetData(this.formData)
			})
		},
		getStoreOrganList () {
			return this.$fxApi('dosingDefaultHouse.getStoreOrganList')({
				data: {
					productCodeList: ['SCJG_SE', 'SCJG_PRO'],
					typeList: ['Shop', 'Center'],
					withManageHouseList: true,
					enableFlag: 1
				}
			}).then(res => {
				return Promise.resolve(res)
			})
		},
		onOrganChange (id, item) {
			this.formData.organ = item
			this.warehouseList = item.store
			this.formData.house = {}
		},
		onHouseSelectShow () {
			if (this.formData.organ.id === '') {
				this.$fxMessage.warning('请先选择加工机构')
			}
		},
		onWarehouseChange (id, item) {
			this.formData.house = item
		},
		onClose () {
			this.$emit('on-close', this.billDeleteFlag)
		},
		onSaveClick () {
			this.onValidateFormData().then(this.onSaveHandler)
		},
		onValidateFormData () {
			return this.$refs.form.validate().then(() => {
				return Promise.resolve()
			})
		},
		onSaveHandler () {
			if (this.isAdd) {
				const logger = this.$fxLogger.createInfo('production-manage.dosing-default-house.add', { organName: this.formData.organ.name, defaultHouseType: this.formData.defaultHouseType, houseName: this.formData.house.name })
				return this.$fxApi('dosingDefaultHouse.add')({ data: this.formData, logger }).then(res => {
					this.dialogVisible = false
					return Promise.resolve()
				})
			} else {
				const logger = this.$fxLogger.createInfo('production-manage.dosing-default-house.update', this.createLoggerParams())
				return this.$fxApi('dosingDefaultHouse.edit', this.formData.id)({ data: this.formData, logger }).then(res => {
					this.fxDataVerification.resetData(this.formData)
					return Promise.resolve()
				})
			}
		},
		createLoggerParams () {
			const originData = this.fxDataVerification.getOriginData()
			const organDetails = this.$fxUtils.deepClone(this.formData)
			return {
				pre: {
					organName: originData.organ.name,
					houseName: originData.house.name,
					defaultHouseType: originData.defaultHouseType ? '默认领用出库仓库' : '默认加工出库仓库'
				},
				cur: {
					organName: organDetails.organ.name,
					houseName: organDetails.house.name,
					defaultHouseType: organDetails.defaultHouseType ? '默认领用出库仓库' : '默认加工出库仓库'
				}
			}
		},
		onCancelClick () {
			this.dialogVisible = false
		},
		onDeleteClick () {
			this.$fxConfirm('是否确定删除当前数据')
				.then(this.onDeleteHandler)
				.then(this.onCancelClick)
		},
		onDeleteHandler () {
			const logger = this.$fxLogger.createInfo('production-manage.dosing-default-house.delete', { organName: this.formData.organ.name, defaultHouseType: this.formData.defaultHouseType, houseName: this.formData.house.name })
			return this.$fxApi('dosingDefaultHouse.delete', this.formData.id)({ logger }).then(res => {
				this.billDeleteFlag = true
				return Promise.resolve()
			})
		},
		verificationDetails () {
			return this.fxDataVerification.checkComfirm(this.formData)
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
	height: 200px
	box-sizing: border-box
	.form-item {
		margin-top: 30px
	}
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
>>>.el-popper.wind-select-tab__dropdown{
	width 280px !important
}
</style>
