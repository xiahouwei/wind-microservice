<template>
	<fx-list-filter @on-enter="onSearchClick">
		<template slot="row-1">
			<el-form-item label="供货商">
				<w-select-tab-mulity
					v-model="supplierKey"
					:optionlist="supplierList"
					class="form-input"
					:loading="supplierListLoading"
					@visible-change="onSupplierListVisibleChange"
				></w-select-tab-mulity>
			</el-form-item>
			<el-form-item label="类别">
				<w-select
					v-model="supplierTypeId"
					:optionlist="supplierTypeList"
					class="form-input"
					:loading="supplierTypeLoading"
					@visible-change="onsupplierTypeVisibleChange"
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
			supplierKey: [],
			supplierTypeId: '',
			enableFlag: 1,
			organType: '',
			memo: '',
			father: '',
			enableStateList: this.$fxStateMiddleware.getStateConfig('enableState'),
			organTypeList: this.$fxTypeMiddleware.getCommonTypeList('supplierType'),
			supplierTypeList: [],
			supplierTypeLoading: false,
			optionProp: {
				name: 'label'
			},
			supplierList: [],
			supplierListLoading: false
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
			this.supplierKey = []
			this.supplierTypeId = ''
			this.enableFlag = 1
			this.organType = ''
			this.memo = ''
			this.father = ''
		},
		getFilterParams () {
			return {
				id: this.supplierKey,
				supplierTypeId: this.supplierTypeId,
				enableFlag: this.enableFlag,
				organType: this.organType,
				memo: this.memo,
				father: this.father
			}
		},
		initSelect () {
			this.getSupplierTypeList()
			this.getFilterSupplierSelectList()
		},
		getSupplierTypeList () {
			this.supplierTypeLoading = true
			return this.$fxApi('supplierType.getSupplierTypeList').then(res => {
				this.supplierTypeList = [{
					id: '',
					name: '全部'
				}, ...res]
				this.supplierTypeLoading = false
				return Promise.resolve()
			})
		},
		onsupplierTypeVisibleChange (flag) {
			if (flag) {
				this.getSupplierTypeList()
			}
		},
		getFilterSupplierSelectList () {
			this.supplierListLoading = true
			return this.$fxApi('supplier.getFilterSupplierSelectList').then(res => {
				this.supplierList = res
				this.supplierListLoading = false
			})
		},
		onSupplierListVisibleChange (flag) {
			if (flag) {
				this.getFilterSupplierSelectList()
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
.organ-form-item {
	margin-left: 11px
}
</style>
