<template>
	<fx-list-filter @on-enter="onSearchClick">
		<template slot="row-1">
			<el-form-item label="角色名称">
				<w-select-mulity
					v-model="role"
					:optionlist="roleList"
					:showEmpty='false'
					:loading="roleSelectLoading"
					class="form-input"
					@visible-change="onRoleSelectVisibleChange"
				>
				</w-select-mulity>
			</el-form-item>
			<el-form-item label="适用员工">
				<w-input v-model="employee" placeholder="请输入" class="form-input"/>
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
			role: [],
			employee: '',
			enableFlag: 1,
			enableStateList: this.$fxStateMiddleware.getStateConfig('enableState'),
			roleList: [],
			roleSelectLoading: false
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
			this.$emit('on-search', this.getFilterParams())
		},
		onResetClick () {
			this.role = []
			this.employee = ''
			this.enableFlag = 1
		},
		getFilterParams () {
			return {
				id: this.role,
				employee: this.employee
			}
		},
		onRoleSelectVisibleChange (flag) {
			if (flag) {
				this.getRoleFilterSelectList()
			}
		},
		getRoleFilterSelectList () {
			this.roleSelectLoading = true
			return this.$fxApi('role.getRoleFilterSelectList').then(res => {
				this.roleList = res
				this.roleSelectLoading = false
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
