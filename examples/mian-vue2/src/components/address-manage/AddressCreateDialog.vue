<template>
	<w-dialog v-model="dialogVisible" :title="dialogTitle" width="450px" :beforeClose="onBeforeClose">
		<div class="create-area">
			<el-form ref="areaForm" :model="addressForm" :rules="rules" size="mini">
				<el-form-item label="省市区：" label-width="90px">
					<w-cascader
						ref="cascaderAddress"
						v-model="addressForm.areaProvinceCity"
						v-fx-tab:focus.locationInput
						:options="areaData"
						:optionProps="addressProps"
						class="form-item-input"
					>
					</w-cascader>
				</el-form-item>
				<el-form-item prop="location" label="详细地址：" label-width="90px">
					<w-input
						v-model="addressForm.location"
						v-fx-tab:focus.linkMan
						:maxlength="300"
						class="form-item-input"
						placeholder="请输入详细地址"
						ref='locationInput'
					/>
				</el-form-item>
				<el-form-item prop="linkMan" label="联系人：" label-width="90px">
					<w-input
						ref="linkMan"
						v-model="addressForm.linkMan"
						v-fx-tab:focus.tel
						:maxlength="20"
						placeholder="请输入联系人"
						class="form-item-input"
					/>
				</el-form-item>
				<el-form-item prop="tel" label="联系电话：" label-width="90px">
					<w-input
						ref="tel"
						v-model="addressForm.tel"
						v-fx-tab:focus.defaultAddress
						:maxlength="20"
						class="form-item-input"
						placeholder="请输入联系电话"
					/>
				</el-form-item>
				<el-form-item label="默认地址：" label-width="90px">
					<w-switch
						ref="defaultAddress"
						v-model="addressForm.isDefault"
						v-fx-tab:focus.saveBtn
						activeColor="blue"
						:activeValue="true"
						:inactiveValue="false"
						:inclusion="false"
						:width="40"
					></w-switch>
				</el-form-item>
			</el-form>
		</div>
		<template slot="footer">
			<el-button ref="cancelBtn" v-fx-tab:focus.cascaderAddress @click="onCancelClick">取消</el-button>
			<el-button ref="saveBtn" v-fx-tab:focus.cancelBtn type="primary" @click="onSubmitClick">保存</el-button>
		</template>
	</w-dialog>
</template>
<script>
import { mapState } from 'vuex'
export default {
	name: 'addressEditDialog',
	data () {
		return {
			dialogVisible: false,
			addressForm: {
				areaProvinceCity: [],
				location: '',
				linkMan: '',
				tel: '',
				isDefault: false
			},
			rules: {
				location: [{ required: true, message: '请输入详细地址', trigger: 'no' }],
				linkMan: [{ required: true, message: '请输入联系人', trigger: 'no' }],
				tel: [{ required: true, message: '请输入联系电话', trigger: 'no' }]
			},
			addressProps: {
				value: 'code',
				label: 'name',
				children: 'child'
			},
			actionType: '',
			actionIndex: 0,
			fxDataVerification: this.$fxUtils.fxDataVerification()
		}
	},
	computed: {
		...mapState({
			areaData: state => state.address.areaData
		}),
		dialogTitle () {
			return this.actionType === 'add' ? '新增地址' : '编辑地址'
		}
	},
	methods: {
		addOpen () {
			this.actionType = 'add'
			this.addressForm = {
				areaProvinceCity: [],
				location: '',
				linkMan: '',
				tel: '',
				isDefault: false
			}
			this.fxDataVerification.resetData(this.addressForm)
			this.dialogVisible = true
			this.$nextTick(() => {
				this.$refs.areaForm.clearValidate()
				this.$refs.locationInput.focus()
			})
		},
		editOpen (params, index) {
			this.actionType = 'edit'
			this.actionIndex = index
			const addressData = {
				...this.$fxUtils.deepClone(params),
				areaProvinceCity: [params.area, params.province, params.city]
			}
			this.addressForm = addressData
			this.fxDataVerification.resetData(this.addressForm)
			this.dialogVisible = true
			this.$nextTick(() => {
				this.$refs.areaForm.clearValidate()
				this.$refs.locationInput.focus()
			})
		},
		onSubmitClick () {
			this.$refs.areaForm.validate().then(() => {
				const address = {
					id: this.addressForm.id,
					areaText: this.getAreaLabel(this.addressForm.areaProvinceCity),
					location: this.addressForm.location,
					linkMan: this.addressForm.linkMan,
					tel: this.addressForm.tel,
					isDefault: this.addressForm.isDefault,
					area: this.addressForm.areaProvinceCity[0],
					province: this.addressForm.areaProvinceCity[1],
					city: this.addressForm.areaProvinceCity[2]
				}
				this.onSubmitHandler(address)
				this.dialogVisible = false
			})
		},
		onSubmitHandler (address) {
			if (this.actionType === 'add') {
				this.$emit('on-add-submit', address)
			} else {
				this.$emit('on-edit-submit', address, this.actionIndex)
			}
		},
		getCascaderObj (val, data) {
			return val.map((value) => {
				for (var item of data) {
					if (item.code === value) {
						data = item.child
						return item
					}
				}
				return null
			})
		},
		getAreaLabel (value) {
			if (!value[2]) return ''
			return this.getCascaderObj(value, this.areaData).map(item => {
				return item.name
			}).join('/')
		},
		verificationDetails () {
			return this.fxDataVerification.checkComfirm(this.addressForm)
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
	height: 250px
	box-sizing: border-box
	.form-item-input {
		width:280px
	}
}
</style>
