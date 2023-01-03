<template>
	<fx-list-filter @on-enter="onSearchClick">
		<template slot="row-1">
			<el-form-item label="客户">
				<w-select-tab-mulity
					v-model="customerKey"
					:optionlist="customerList"
					class="form-input"
					:loading="customerListLoading"
					@visible-change="onCustomerListVisibleChange"
				></w-select-tab-mulity>
			</el-form-item>
			<el-form-item label="类别">
				<w-select
					v-model="customerType"
					:optionlist="customerTypeList"
					class="form-input"
					:loading="customerTypeLoading"
					@visible-change="onCustomerTypeVisibleChange"
				>
				</w-select>
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
			<!-- <el-form-item label="机构类型">
				<w-select
					v-model="organType"
					:optionlist="organTypeSelectList"
					:optionProp="optionProp"
					class="form-input"
				>
				</w-select>
			</el-form-item> -->
		</template>
		<template slot="row-2">
			<el-form-item label="备注">
				<w-input v-model="memo" placeholder="请输入" class="form-input"/>
			</el-form-item>
			<!-- <el-form-item label="上级机构">
				<w-input v-model="father" placeholder="请输入" class="form-input"/>
			</el-form-item> -->
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
			customerKey: [],
			customerType: '',
			enableFlag: 1,
			organType: '',
			memo: '',
			father: '',
			enableStateList: this.$fxStateMiddleware.getStateConfig('enableState'),
			organTypeList: this.$fxTypeMiddleware.getCommonTypeList('customerOrganType'),
			customerTypeList: [],
			customerTypeLoading: false,
			optionProp: {
				name: 'label'
			},
			customerList: [],
			customerListLoading: false
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
	methods: {
		onSearchClick () {
			this.$emit('on-search')
		},
		onResetClick () {
			this.customerKey = []
			this.customerType = ''
			this.enableFlag = 1
			this.organType = ''
			this.memo = ''
			this.father = ''
		},
		getFilterParams () {
			return {
				id: this.customerKey,
				customerType: this.customerType,
				enableFlag: this.enableFlag,
				organType: this.organType,
				memo: this.memo,
				father: this.father
			}
		},
		initSelect () {
			this.getCustomerTypeList()
			this.getFilterCustomerSelectList()
		},
		getCustomerTypeList () {
			this.customerTypeLoading = true
			return this.$fxApi('customerType.getList').then(res => {
				this.customerTypeList = [{
					id: '',
					name: '全部'
				}, ...res]
				this.customerTypeLoading = false
				return Promise.resolve()
			})
		},
		onCustomerTypeVisibleChange (flag) {
			if (flag) {
				this.getCustomerTypeList()
			}
		},
		getFilterCustomerSelectList () {
			this.customerListLoading = true
			return this.$fxApi('customer.getFilterCustomerSelectList').then(res => {
				this.customerList = res
				this.customerListLoading = false
			})
		},
		onCustomerListVisibleChange (flag) {
			if (flag) {
				this.getFilterCustomerSelectList()
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
