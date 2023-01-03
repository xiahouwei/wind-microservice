<template>
	<fx-list-filter @on-enter="onSearchClick">
		<template slot="row-1">
			<el-form-item label="单据种类">
				<w-select
					v-model="billType"
					:optionlist="billTypeSelectList"
					clearable
					class="form-input"
				>
				</w-select>
			</el-form-item>
			<el-form-item label="业务类型">
				<w-input
					v-model="bussinessKey"
					class="form-input"
				></w-input>
			</el-form-item>
			<el-form-item label="启停状态">
				<w-select
					v-model="enableFlag"
					class="form-input"
					:optionlist="enableStateSelectList"
					:optionProp="{name:'label'}"
				>
				</w-select>
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
			billType: '',
			bussinessKey: '',
			enableFlag: 1,
			billTypeSelectList: [],
			enableStateList: this.$fxStateMiddleware.getStateConfig('enableState')
		}
	},
	created () {
		this.getBillTypeList()
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
			this.billType = ''
			this.bussinessKey = ''
			this.enableFlag = 1
		},
		getFilterParams () {
			return {
				billType: this.billType,
				name: this.bussinessKey,
				enableFlag: this.enableFlag
			}
		},
		getBillTypeList () {
			this.$fxApi('bussinessType.getBillTypeList').then(res => {
				this.billTypeSelectList = res
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-input {
	width: 140px
}
</style>
