<template>
	<fx-list-filter @on-enter="onSearchClick">
		<template slot="row-1">
			<fx-render-dom :render="filterItemRender"></fx-render-dom>
		</template>
		<template slot="row-2">
			<fx-render-dom :render="filterItemMoreRender"></fx-render-dom>
		</template>
		<template slot="tools">
			<el-button class="order-btn" type="primary" @click="onSearchClick">查询</el-button>
			<el-button class="order-btn" plain @click="onResetClick">重置</el-button>
		</template>
	</fx-list-filter>
</template>
<script>
import { mapGetters } from 'vuex'
import { filterItemConfig } from './FilterItemConfig'
import { BILL_TYPE } from './Index.vue'
export default {
	name: 'filterBar',
	data () {
		return {
			organKey: [],
			father: '',
			organType: '',
			enableFlag: 1,
			tagKey: '',
			memo: '',
			enableStateList: this.$fxStateMiddleware.getStateConfig('enableState'),
			organTypeList: this.$fxTypeMiddleware.getCommonTypeList('organType'),
			optionProp: {
				name: 'label'
			},
			organList: [],
			organListLoading: false
		}
	},
	computed: {
		...mapGetters(['mainFilterItemRenderGetter']),
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
	methods: {
		onSearchClick () {
			this.$emit('on-search')
		},
		onResetClick () {
			this.organKey = []
			this.father = ''
			this.enableFlag = 1
			this.organType = ''
			this.tagKey = ''
			this.memo = ''
		},
		getFilterParams () {
			return {
				id: this.organKey,
				father: this.father,
				enableFlag: this.enableFlag,
				organType: this.organType,
				tagKey: this.tagKey,
				memo: this.memo
			}
		},
		getFilterOrganSelectList () {
			this.organListLoading = true
			return this.$fxApi('organ.getFilterOrganSelectList').then(res => {
				this.organList = res
				this.organListLoading = false
			})
		},
		onOrganListVisibleChange (flag) {
			if (flag) {
				this.getFilterOrganSelectList()
			}
		},
		filterItemRender () {
			return this.mainFilterItemRenderGetter(BILL_TYPE)('basic', filterItemConfig)
		},
		filterItemMoreRender () {
			return this.mainFilterItemRenderGetter(BILL_TYPE)('more', filterItemConfig)
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
