<template>
	<fx-list-filter @on-enter="onSearchClick">
		<template slot="row-1">
			<el-form-item label="品项">
				<w-select-tab-mulity
					v-model="itemKey"
					:optionlist="itemList"
					:loading="itemSelectLoading"
					class="form-input"
					@visible-change="onItemSelectVisibleChange"
				></w-select-tab-mulity>
			</el-form-item>
			<el-form-item label="冲减方式">
				<w-select
					v-model="consumptionMethod"
					:optionlist="consumptionMethodSelectList"
					:optionProp="optionProp"
					class="form-input"
				>
				</w-select>
			</el-form-item>
			<el-form-item label="品项类型">
				<w-select-mulity
					v-model="category"
					:optionlist="itemCategoryList"
					:showEmpty='false'
					:optionProp="optionProp"
					class="form-input"
				>
					<el-radio-group slot="header" v-model="itemTypeFlag" class="toggle-radio">
						<el-radio :label="true">取交集</el-radio>
						<el-radio :label="false">取并集</el-radio>
					</el-radio-group>
				</w-select-mulity>
			</el-form-item>
			<el-form-item label="财务分类">
				<w-select-mulity
					v-model="financeSortId"
					:optionlist="financeSortList"
					class="form-input"
				>
				</w-select-mulity>
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
			<el-form-item label="标签">
				<w-input
					v-model="tagKey"
					placeholder="请输入"
					class="form-input"
					disabled
					@keyup.enter.native="onSearchClick"
				/>
			</el-form-item>
		</template>
		<template slot="row-2">
			<el-form-item label="图片上传">
				<w-select
					v-model="haveImage"
					:optionlist="computedHaveImageSelectList"
					:optionProp="optionProp"
					class="form-input"
				>
				</w-select>
			</el-form-item>
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
			itemKey: [],
			consumptionMethod: '',
			enableFlag: 1,
			tagKey: '',
			accounting: '',
			memo: '',
			financeSortId: [],
			haveImage: '',
			enableStateList: this.$fxStateMiddleware.getStateConfig('enableState'),
			consumptionMethodList: this.$fxTypeMiddleware.getCommonTypeList('consumptionMethodType'),
			itemCategoryList: this.$fxTypeMiddleware.getCommonTypeList('itemCategory'),
			haveImageSelectList: this.$fxTypeMiddleware.getCommonTypeList('haveImageSelectList'),
			accountingPeriodList: [],
			customerTypeLoading: false,
			optionProp: {
				name: 'label'
			},
			category: [],
			itemTypeFlag: true,
			itemList: [],
			itemSelectLoading: false,
			financeSortList: []
		}
	},
	computed: {
		enableStateSelectList () {
			return [{
				id: '',
				label: '全部'
			}, ...this.enableStateList]
		},
		consumptionMethodSelectList () {
			return [{
				id: '',
				label: '全部'
			}, ...this.consumptionMethodList]
		},
		computedHaveImageSelectList () {
			return [{
				id: '',
				label: '全部'
			}, ...this.haveImageSelectList]
		}
	},
	methods: {
		onSearchClick () {
			this.$emit('on-search')
		},
		onResetClick () {
			this.itemKey = []
			this.consumptionMethod = ''
			this.enableFlag = 1
			this.tagKey = ''
			this.accounting = ''
			this.memo = ''
			this.category = []
			this.itemTypeFlag = true
			this.financeSortId = []
			this.haveImage = ''
		},
		getFilterParams () {
			return {
				id: this.itemKey,
				consumptionMethod: this.consumptionMethod,
				enableFlag: this.enableFlag,
				accounting: this.accounting,
				memo: this.memo,
				'category-category': this.category,
				itemTypeFlag: this.itemTypeFlag,
				financeSortId: this.financeSortId,
				haveImage: this.haveImage
			}
		},
		initSelect () {
			this.getItemSelectList()
			this.getFinanceSortList()
		},
		getItemSelectList () {
			this.itemSelectLoading = true
			return this.$fxApi('item.getItemSelectTab').then(res => {
				this.itemList = res
				this.itemSelectLoading = false
				return Promise.resolve()
			})
		},
		getFinanceSortList () {
			return this.$fxApi('item.getFinanceSortList').then(res => {
				this.financeSortList = res
			})
		},
		onItemSelectVisibleChange (flag) {
			if (flag) {
				this.getItemSelectList()
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
.toggle-radio {
	display flex
	justify-content center
	align-items center
	height 38px
}
</style>
