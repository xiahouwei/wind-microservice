<template>
	<fx-list-filter @on-enter="onSearchClick">
		<template slot="row-1">
			<el-form-item label="分类名称">
				<w-input v-model="financialKey" placeholder="请输入" class="form-input"/>
			</el-form-item>
			<el-form-item label="分类类型">
				<w-select
					v-model="subject"
					class="form-input"
					:optionlist="financialTypeSelectList"
					:optionProp="{name:'label'}"
				>
				</w-select>
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
			<el-form-item label="标签">
				<w-input disabled v-model="tagKey" placeholder="请输入" class="form-input"/>
			</el-form-item>
		</template>
		<template slot="row-2">
			<el-form-item label="备注">
				<w-input v-model="memo" placeholder="请输入" class="form-input"/>
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
			financialKey: '',
			subject: '',
			enableFlag: 1,
			tagKey: '',
			memo: '',
			financialTypeList: this.$fxTypeMiddleware.getCommonTypeList('financialType'),
			enableStateList: this.$fxStateMiddleware.getStateConfig('enableState')
		}
	},
	computed: {
		financialTypeSelectList () {
			return [{
				id: '',
				label: '全部'
			}, ...this.financialTypeList]
		},
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
			this.financialKey = ''
			this.subject = ''
			this.enableFlag = 1
			this.tagKey = ''
			this.memo = ''
		},
		getFilterParams () {
			return {
				financialKey: this.financialKey,
				subject: this.subject,
				enableFlag: this.enableFlag,
				tagKey: this.tagKey,
				memo: this.memo
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
