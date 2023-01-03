<template>
	<fx-list-filter @on-enter="onSearchClick">
		<template slot="row-1">
			<el-form-item label="结算方式">
				<w-input
					v-model="searchKey"
					placeholder="请输入"
					class="form-input"
				></w-input>
			</el-form-item>
			<el-form-item label="状态">
				<w-select
					v-model="enableFlag"
					:optionlist="enableStateSelectList"
					:optionProp="optionProp"
					class="form-input"
				/>
			</el-form-item>
			<el-form-item label="备注">
				<w-input
					v-model="memo"
					placeholder="请输入"
					class="form-input"
				/>
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
			searchKey: '',
			enableFlag: 1,
			memo: '',
			enableStateList: this.$fxStateMiddleware.getStateConfig('enableState'),
			optionProp: {
				name: 'label'
			}
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
			this.searchKey = ''
			this.enableFlag = 1
			this.memo = ''
		},
		getFilterParams () {
			return {
				searchKey: this.searchKey,
				enableFlag: this.enableFlag,
				memo: this.memo
			}
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
