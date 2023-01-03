<template>
	<fx-list-filter @on-enter="onSearchClick">
		<template slot="row-1">
			<el-form-item label="供货商类别" label-width="80px">
				<w-select
					v-model="supplierTypeId"
					:optionlist="supplierTypeSelectList"
					class="form-input"
				>
				</w-select>
			</el-form-item>
			<el-form-item label="供货商">
				<w-select-mulity
					v-model="supplierKey"
					:optionlist="supplierList"
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
			supplierKey: [],
			supplierTypeId: '',
			enableFlag: 1,
			enableStateList: this.$fxStateMiddleware.getStateConfig('enableState'),
			optionProp: {
				name: 'label'
			},
			supplierTypeList: [],
			supplierList: []
		}
	},
	computed: {
		enableStateSelectList () {
			return [{
				id: '',
				label: '全部'
			}, ...this.enableStateList]
		},
		supplierTypeSelectList () {
			return [{
				id: '',
				name: '全部'
			}, ...this.supplierTypeList]
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
			this.supplierKey = []
			this.enableFlag = 1
			this.supplierTypeId = ''
		},
		getFilterParams () {
			return {
				organId: this.supplierKey,
				enableFlag: this.enableFlag,
				supplierTypeId: this.supplierTypeId
			}
		},
		getSelectList () {
			this.getFilterSupplierSelectList()
			this.getSupplierTypeList()
		},
		getFilterSupplierSelectList () {
			return this.$fxApi(`${apiName}.getFilterSupplierSelectList`).then(res => {
				this.supplierList = res
			})
		},
		getSupplierTypeList () {
			return this.$fxApi(`${apiName}.getSupplierTypeList`).then(res => {
				this.supplierTypeList = res
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
