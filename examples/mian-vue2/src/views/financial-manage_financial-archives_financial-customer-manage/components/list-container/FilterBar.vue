<template>
	<fx-list-filter @on-enter="onSearchClick">
		<template slot="row-1">
			<el-form-item label="客户类别" label-width="80px">
				<w-select
					v-model="customerTypeId"
					:optionlist="customerTypeSelectList"
					class="form-input"
				>
				</w-select>
			</el-form-item>
			<el-form-item label="客户">
				<w-select-mulity
					v-model="customerKey"
					:optionlist="customerList"
					:showEmpty="false"
					class="form-input"
				></w-select-mulity>
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
			<fx-button class="order-btn" type="primary" @click="onSearchClick">查询</fx-button>
			<fx-button class="order-btn" plain @click="onResetClick">重置</fx-button>
		</template>
	</fx-list-filter>
</template>
<script>
import { apiName } from '../../Index.vue'
export default {
	name: 'filterBar',
	data () {
		return {
			customerKey: [],
			customerTypeId: '',
			enableFlag: 1,
			enableStateList: this.$fxStateMiddleware.getStateConfig('enableState'),
			optionProp: {
				name: 'label'
			},
			customerTypeList: [],
			customerList: []
		}
	},
	computed: {
		enableStateSelectList () {
			return [{
				id: '',
				label: '全部'
			}, ...this.enableStateList]
		},
		customerTypeSelectList () {
			return [{
				id: '',
				name: '全部'
			}, ...this.customerTypeList]
		}
	},
	created () {
		this.getSelectList()
	},
	methods: {
		onSearchClick () {
			this.$emit('on-search')
		},
		onResetClick () {
			this.customerKey = []
			this.enableFlag = 1
			this.customerTypeId = ''
		},
		getFilterParams () {
			return {
				organId: this.customerKey,
				enableFlag: this.enableFlag,
				customerTypeId: this.customerTypeId
			}
		},
		getSelectList () {
			this.getFilterCustomerSelectList()
			this.getCustomerTypeList()
		},
		getFilterCustomerSelectList () {
			return this.$fxApi(`${apiName}.getFilterCustomerSelectList`).then(res => {
				this.customerList = res
			})
		},
		getCustomerTypeList () {
			return this.$fxApi(`${apiName}.getCustomerTypeList`).then(res => {
				this.customerTypeList = res
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
