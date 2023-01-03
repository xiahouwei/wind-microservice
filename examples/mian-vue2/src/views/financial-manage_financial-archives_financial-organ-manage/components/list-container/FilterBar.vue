<template>
	<fx-list-filter @on-enter="onSearchClick">
		<template slot="row-1">
			<el-form-item label="机构类型">
				<w-select
					v-model="organType"
					:optionlist="organTypeSelectList"
					:optionProp="optionProp"
					class="form-input"
				>
				</w-select>
			</el-form-item>
			<el-form-item label="机构">
				<w-select-tab-mulity
					v-model="organKey"
					:optionlist="organList"
					class="form-input"
				></w-select-tab-mulity>
			</el-form-item>
			<el-form-item label="状态">
				<w-select
					v-model="enableFlag"
					:optionlist="enableStateSelectList"
					:optionProp="optionProp"
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
import { apiName } from '../../Index.vue'
export default {
	name: 'filterBar',
	data () {
		return {
			organKey: [],
			organType: '',
			enableFlag: 1,
			enableStateList: this.$fxStateMiddleware.getStateConfig('enableState'),
			organTypeList: this.$fxTypeMiddleware.getCommonTypeList('financialOrganType'),
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
		},
		organTypeSelectList () {
			return [{
				id: '',
				label: '全部'
			}, ...this.organTypeList]
		}
	},
	created () {
		this.getFilterOrganSelectList()
	},
	methods: {
		onSearchClick () {
			this.$emit('on-search')
		},
		onResetClick () {
			this.organKey = []
			this.enableFlag = 1
			this.organType = ''
		},
		getFilterParams () {
			return {
				id: this.organKey,
				enableFlag: this.enableFlag,
				organType: this.organType
			}
		},
		getFilterOrganSelectList () {
			return this.$fxApi(`${apiName}.getFilterOrganSelectList`).then(res => {
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
