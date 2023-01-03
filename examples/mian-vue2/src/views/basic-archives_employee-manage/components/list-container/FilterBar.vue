<template>
	<fx-list-filter @on-enter="onSearchClick">
		<template slot="row-1">
			<el-form-item label="员工">
				<w-input v-model="employeeKey" placeholder="请输入" class="form-input"/>
			</el-form-item>
			<el-form-item label="用户名">
				<w-input v-model="username" placeholder="请输入" class="form-input"/>
			</el-form-item>
			<el-form-item label="直属机构">
				<w-select-tab-mulity
					v-model="organ"
					:optionlist="organList"
					class="form-input"
				></w-select-tab-mulity>
			</el-form-item>
			<el-form-item label="启停状态">
				<w-select
					v-model="enableFlag"
					:optionlist="enableStateSelectList"
					:optionProp="optionProp"
					class="form-input"
				>
				</w-select>
			</el-form-item>
			<el-form-item label="手机号">
				<w-input
					v-model="phone"
					placeholder="请输入"
					class="form-input"
					:maxlength="$fxCommon.getFxInputMaxLength('phone')"
					:regType="$fxCommon.getFxInputReg('phone')"
				/>
			</el-form-item>
		</template>
		<template slot="row-2">
			<el-form-item label="标签">
				<w-input disabled v-model="tagKey" placeholder="请输入" class="form-input"/>
			</el-form-item>
		</template>
		<template slot="tools">
			<el-button class="order-btn" type="primary" @click="onSearchClick">查询</el-button>
			<el-button class="order-btn" plain @click="onResetClick">重置</el-button>
		</template>
	</fx-list-filter>
</template>
<script>
export default {
	name: 'filterBar',
	data () {
		return {
			employeeKey: '',
			username: '',
			organ: [],
			enableFlag: 1,
			tagKey: '',
			phone: '',
			enableStateList: this.$fxStateMiddleware.getStateConfig('enableState'),
			optionProp: {
				name: 'label'
			},
			organList: []
		}
	},
	computed: {
		enableStateSelectList () {
			return [{
				id: '',
				label: '全部'
			}, ...this.enableStateList]
		}
	},
	methods: {
		onSearchClick () {
			this.$emit('on-search')
		},
		onResetClick () {
			this.employeeKey = ''
			this.username = ''
			this.organ = []
			this.enableFlag = 1
			this.tagKey = ''
			this.phone = ''
		},
		getFilterParams () {
			return {
				employeeKey: this.employeeKey,
				username: this.username,
				organId: this.organ,
				enableFlag: this.enableFlag,
				tagKey: this.tagKey,
				phone: this.phone
			}
		},
		getOrganList () {
			return this.$fxApi('employee.getFilterDirectOrganList').then(res => {
				this.organList = res
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-input {
	width: 150px
}
</style>
