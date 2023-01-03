<template>
	<w-collapse v-model="collapseVisible" disabled :showArrow="false" title="基础信息">
		<el-form ref="form" :model="organDetails" :rules="rules" size="mini" label-width="100px" inline>
			<fx-details-form-row>
				<el-form-item prop="organId" label="直属机构：">
					<w-select-tab
						ref="organId"
						v-if="!isSystemUser"
						v-model="organDetails.organId"
						v-fx-tab:focus.code
						:optionlist="directOrganData"
            :disabled="disabled"
						:defaultText="organDetails.organName"
						class="form-item-input-full"
						@change="onOrganChange"
					>
					</w-select-tab>
					<span v-else>{{organDetails.organName}}</span>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item slot="left" label="员工图片：" class="avatar-block form-item-image">
					<fx-upload
						:fileList="avatarList"
						:limit="1"
						type="image"
						:notes="false"
						:disabled="disabled"
						class="avatar-upload-content"
						@on-change="onAvatarChange"
					></fx-upload>
				</el-form-item>
				<template slot="right">
					<div class="form-item-vertical">
						<el-form-item prop="code" label="员工编号：">
							<w-input
								ref='code'
								v-model="organDetails.code"
								v-fx-tab:focus.name
								:maxlength="$fxCommon.getFxInputMaxLength('commonCode')"
								placeholder="请输入员工编号"
								:regType="$fxCommon.getFxInputReg('commonCode')"
								:disabled="disabled"
								class="form-item-input"
							></w-input>
						</el-form-item>
						<el-form-item prop="name" label="员工名称：">
							<w-input
								ref='name'
								v-model="organDetails.name"
								v-fx-tab="nameTabHandler"
								:maxlength="$fxCommon.getFxInputMaxLength('commonName')"
								:regType="$fxCommon.getFxInputReg('commonName')"
								:disabled="disabled"
								placeholder="请输入员工名称"
								class="form-item-input"
								@blur="onNameChange"
							/>
						</el-form-item>
					</div>
				</template>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item slot="left" prop="username" label="用户名：">
					<w-input
						ref="username"
						v-model="organDetails.username"
						v-fx-tab:focus.password
						:maxlength="$fxCommon.getFxInputMaxLength('userName')"
						:regType="$fxCommon.getFxInputReg('userName')"
						:disabled="isSystemUser"
						class="form-item-input"
					></w-input>
				</el-form-item>
				<el-form-item slot="right" prop="password" label="密码：">
					<w-password-input
						ref="password"
						v-model="organDetails.password"
						v-fx-tab:focus.phone
						class="form-item-input"
						:disabled="disabled"
					></w-password-input>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item slot="left" prop="phone" label="联系电话：">
					<w-input
						ref="phone"
						v-model="organDetails.phone"
						v-fx-tab="phoneHandler"
						placeholder="请输入联系电话"
						:maxlength="11"
						:disabled="disabled"
						class="form-item-input"
					/>
				</el-form-item>
				<el-form-item slot="right" prop="enableFlag" label="启停状态：">
					<w-switch
						ref="enableFlag"
						v-model="organDetails.enableFlag"
						v-fx-tab:focus.roleList
						:active-value="1"
						:inactive-value="0"
						:inclusion="false"
						:width="40"
						:disabled="enableRole"
					></w-switch>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item label="所属角色：" label-width="100px" class="form-item-role">
					<w-select-mulity
						ref="roleList"
						v-model="organDetails.roleList"
						v-fx-tab:loop.basic-archives_employee-manage_details.basicInfo
						:optionlist="roleSelectList"
						:showEmpty="false"
            :disabled="disabled"
						class="form-item-input-full"
					>
					</w-select-mulity>
				</el-form-item>
			</fx-details-form-row>
		</el-form>
	</w-collapse>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
	name: 'createOrgan',
	props: {
		disabled: Boolean,
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		directOrganData: {
			type: Array,
			default: () => {
				return []
			}
		},
		roleSelectList: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	data () {
		const validateIgnore = (rule, value, callback) => {
			callback()
		}
		return {
			collapseVisible: true,
			rules: {
				organId: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				code: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				name: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				username: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				password: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				phone: [{ required: true, message: '该字段不能为空', trigger: 'no' },
					{ pattern: /^1[3456789]\d{9}$/, message: '请输入正确的联系电话', trigger: 'blur' }],
				enableFlag: [{ required: true, message: '该字段不能为空', trigger: 'no', validator: validateIgnore }]
			},
			avatarList: []
		}
	},
	computed: {
		...mapGetters(['detailsAuthGetter']),
		isSystemUser () {
			return !!this.organDetails.systemFlag || this.disabled
		},
		enableRole () {
			return this.organDetails.enableFlag ? !this.detailsAuthGetter('basic-archives_employee-manage.disable-employee') || this.disabled : !this.detailsAuthGetter('basic-archives_employee-manage.enable-employee') || this.disabled
		}
	},
	watch: {
		'organDetails.imageUrl' () {
			this.avatarList = this.organDetails.imageUrl ? [this.organDetails.imageUrl] : []
		}
	},
	methods: {
		onAvatarChange (list) {
			this.organDetails.imageUrl = list[0] || ''
		},
		validate () {
			return this.$refs.form.validate()
		},
		refreshPasswordInput () {
			this.$refs.password.refresh()
		},
		onOrganChange (id, item) {
			const organType = item.organType
			this.organDetails.manageAllOrgan = (this.organDetails.manageAllOrgan !== 2 || ['1', '2'].includes(organType)) ? this.organDetails.manageAllOrgan : 0
			this.organDetails.manageAllSupplier = (this.organDetails.manageAllSupplier !== 2 || organType === '5') ? this.organDetails.manageAllSupplier : 0
			this.organDetails.manageAllCustom = (this.organDetails.manageAllCustom !== 2 || organType === '6') ? this.organDetails.manageAllCustom : 0
			this.organDetails.toDealWorkType = (this.organDetails.toDealWorkType === 3 && organType === '0') ? 1 : this.organDetails.toDealWorkType
			this.organDetails.organType = organType
		},
		onNameChange (e) {
			const name = e.target.value
			if (!this.organDetails.username) {
				const pinyin = this.$fxUtils.chinese2Pinyin(name, true)
				this.organDetails.username = pinyin
			}
		},
		defaultFocus (refName = this.isSystemUser ? 'code' : 'organId') {
			this.$fxUtils.vDoRefFocus(this, refName)
		},
		nameTabHandler ({ focus }) {
			this.isSystemUser ? focus('password') : focus('username')
		},
		phoneHandler ({ focus }) {
			!this.enableRole ? focus('enableFlag') : focus('roleList')
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-item-input-full {
	width:535px
}
.avatar-upload-content {
	width: 190px
}
.avatar-block {
	margin-bottom: 0
}
.form-item-input {
	width: 186px
	box-sizing: border-box
}
.form-item-vertical {
	display flex
	flex-direction column
}
.form-input-add-btn {
	position: relative
	top: 5px
	left: 5px
}
.form-item-image,.form-item-role {
	>>>.el-form-item__label {
		padding-left:10px
	}
}
</style>
