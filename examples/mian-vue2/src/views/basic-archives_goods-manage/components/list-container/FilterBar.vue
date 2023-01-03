<template>
	<fx-list-filter @on-enter="onSearchClick">
		<template slot="row-1">
			<el-form-item label="创建日期">
				<w-date-picker
					v-model='filter.dateRange'
					type="daterange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					format="yyyy 年 MM 月 dd 日"
					value-format="yyyy-MM-dd HH:mm:ss"
					:default-time="['00:00:00', '23:59:59']"
					:picker-options="pickerOptions"
					class="form-date-input"
				></w-date-picker>
			</el-form-item>
			<el-form-item label="商品">
				<w-input v-model="filter.name_code" placeholder="请输入商品名称或编号" class="form-input"/>
			</el-form-item>
			<el-form-item label="销售渠道">
			<w-select
					v-model="filter.channel_type"
					:optionlist="channelSelectList"
					class="form-select"
				>
				</w-select>
			</el-form-item>
			<el-form-item label="启停状态">
				<w-select
					v-model="filter.enableFlag"
					:optionlist="enableStateSelectList"
					:optionProp="optionProp"
					class="form-select"
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
export default {
	name: 'filterBar',
	data () {
		return {
			filter: {
				dateRange: [],
				name_code: '',
				enableFlag: '',
				channel_type: 0
			},
			stateSelectList: [],
			optionProp: {
				name: 'label'
			},
			enableStateList: this.$fxStateMiddleware.getStateConfig('enableState'),
			channelSelectList: this.$fxTypeMiddleware.getCommonTypeList('saleChannel'),
			pickerOptions: this.$fxGetDatePickerOptionsShortcuts('all')
		}
	},
	computed: {
		enableStateSelectList () {
			return [{
				id: '',
				label: '全部'
			}, ...this.enableStateList]
		}
	},
	methods: {
		onSearchClick () {
			this.$emit('on-search')
		},
		onResetClick () {
			this.filter = {
				dateRange: [],
				name_code: '',
				enableFlag: '',
				channel_type: 0
			}
		},
		getFilterParams () {
			if (this.filter.dateRange && this.filter.dateRange.length) {
				this.filter.create_date = [this.filter.dateRange[0], this.filter.dateRange[1]]
			} else {
				this.filter.create_date = []
			}
			this.filter.enable_flag = this.filter.enableFlag === '' ? this.filter.enableFlag : !!this.filter.enableFlag
			return this.filter
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-input {
	width: 160px
}
.form-select {
	width: 150px
}
</style>
