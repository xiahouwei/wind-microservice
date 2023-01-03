<template>
	<fx-list-filter @on-enter="onSearchClick">
		<template slot="row-1">
			<el-form-item label="机构">
				<w-select-tab-mulity
					v-model="organKey"
					:optionlist="organList"
					class="form-input"
					:loading="organListLoading"
					@visible-change="onOrganListVisibleChange"
				></w-select-tab-mulity>
			</el-form-item>
			<el-form-item label="会计期">
				<w-select
					v-model="periodKey"
					:optionlist="periodSelectList"
					:loading="periodListLoading"
					:optionProp="{ name: 'yearMonth' }"
					class="form-input"
					:fpSelectShow="onPeriodVisibleChange"
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
import { apiName } from '../../Index.vue'
export default {
	name: 'filterBar',
	data () {
		return {
			organKey: [],
			organList: [],
			organListLoading: false,
			periodKey: '',
			periodList: [],
			periodListLoading: false
		}
	},
	computed: {
		periodSelectList () {
			return [{
				id: '',
				yearMonth: '全部'
			}, ...this.periodList]
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
			this.periodKey = ''
		},
		getFilterParams () {
			return {
				'organ.id': this.organKey,
				'ap.id': this.periodKey
			}
		},
		getFilterOrganSelectList () {
			this.organListLoading = true
			return this.$fxApi(`${apiName}.getFilterOrganSelectList`).then(res => {
				this.organList = res
				this.organListLoading = false
			})
		},
		onOrganListVisibleChange (flag) {
			if (flag) {
				this.getFilterOrganSelectList()
			}
		},
		getFilterPeriodSelectList () {
			this.periodListLoading = true
			return this.$fxApi(`${apiName}.getFilterPeriodSelectList`).then(res => {
				this.periodList = res
				this.periodListLoading = false
				return Promise.resolve()
			})
		},
		onPeriodVisibleChange () {
			return this.getFilterPeriodSelectList()
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
