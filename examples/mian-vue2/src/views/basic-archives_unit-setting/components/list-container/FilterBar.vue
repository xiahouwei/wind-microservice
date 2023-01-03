<template>
	<fx-list-filter @on-enter="onSearchClick">
		<template slot="row-1">
			<el-form-item label="品项">
				<w-select-mulity
					v-model="itemId"
					:optionlist="itemList"
					:showEmpty="false"
					:loading="itemSelectLoading"
					class="form-input"
					@visible-change="onItemSelectVisibleChange"
				>
				</w-select-mulity>
			</el-form-item>
			<el-form-item label="品项类型">
				<w-select-mulity
					v-model="category"
					:optionlist="itemCategoryList"
					:showEmpty="false"
					:optionProp="optionProp"
					class="form-input"
				>
					<el-radio-group slot="header" v-model="itemTypeFlag" class="toggle-radio">
						<el-radio :label="true">取交集</el-radio>
						<el-radio :label="false">取并集</el-radio>
					</el-radio-group>
				</w-select-mulity>
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
			itemId: [],
			itemCategoryList: this.$fxTypeMiddleware.getCommonTypeList('itemCategory'),
			optionProp: {
				name: 'label'
			},
			category: [],
			itemTypeFlag: true,
			itemList: [],
			itemSelectLoading: false
		}
	},
	methods: {
		onSearchClick () {
			this.$emit('on-search')
		},
		onResetClick () {
			this.itemId = []
			this.category = []
			this.itemTypeFlag = true
		},
		getFilterParams () {
			return {
				'item.id': this.itemId,
				'category-category': this.category,
				itemTypeFlag: this.itemTypeFlag,
				'item.enableFlag': 1,
				'item.delFlag': 0
			}
		},
		getItemSelectList () {
			this.itemSelectLoading = true
			return this.$fxApi(`${apiName}.getItemSelectList`).then(res => {
				this.itemList = res
				this.itemSelectLoading = false
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
