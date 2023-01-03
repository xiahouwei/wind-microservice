<template>
	<fx-list-filter @on-enter="onSearchClick">
		<template slot="row-1">
			<el-form-item label="原因名称">
				<w-input v-model="reasonKey" placeholder="请输入" class="form-input"/>
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
			reasonKey: '',
			enableFlag: 1,
			enableStateList: this.$fxStateMiddleware.getStateConfig('enableState')
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
			this.reasonKey = ''
			this.enableFlag = 1
		},
		getFilterParams () {
			return {
				reasonKey: this.reasonKey,
				'os.enableFlag': this.enableFlag
			}
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
