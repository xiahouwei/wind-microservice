<template>
	<fx-list-filter @on-enter="onSearchClick">
		<template slot="row-1">
			<el-form-item label="分组名称">
				<w-input v-model="groupKey" placeholder="请输入" class="form-input"/>
			</el-form-item>
			<el-form-item label="适用品项">
				<w-select-tab-mulity
					v-model="relItem"
					:optionlist="itemList"
					class="form-input"
					:loading="selectLoading"
					:fpSelectShow="getItemSelectTab"
				>
				</w-select-tab-mulity>
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
			groupKey: '',
			relItem: [],
			itemList: [],
			selectLoading: false
		}
	},
	methods: {
		onSearchClick () {
			this.$emit('on-search', this.getFilterParams())
		},
		onResetClick () {
			this.groupKey = ''
			this.relItem = []
		},
		getFilterParams () {
			return {
				groupKey: this.groupKey,
				relItem: this.relItem.join(',')
			}
		},
		getItemSelectTab () {
			this.selectLoading = true
			return this.$fxApi(`${apiName}.getItemSelectTab`).then(res => {
				this.selectLoading = false
				this.itemList = res
				return Promise.resolve(res)
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-input {
	width: $fx-filterBar-formInputWidth
}
</style>
