<template>
	<fx-list-filter @on-enter="onSearchClick">
		<template slot="row-1">
			<el-form-item label="销售区域">
				<w-input
					v-model="salesArea"
					placeholder="请输入"
					class="form-input"
				></w-input>
			</el-form-item>
			<el-form-item label="所属机构">
				<w-input
					v-model="subOrgan"
					placeholder="请输入"
					class="form-input"
				></w-input>
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
			<el-form-item label="标签">
				<w-input disabled v-model="tagKey" placeholder="请输入" class="form-input"/>
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
			salesArea: '',
			subOrgan: '',
			enableFlag: 1,
			tagKey: '',
			enableStateList: this.$fxStateMiddleware.getStateConfig('enableState'),
			optionProp: {
				name: 'label'
			}
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
			this.$emit('on-search', this.getFilterParams())
		},
		onResetClick () {
			this.salesArea = ''
			this.subOrgan = ''
			this.enableFlag = 1
			this.tagKey = ''
		},
		getFilterParams () {
			return {
				salesAreaKey: this.salesArea,
				organ: this.subOrgan,
				enableFlag: this.enableFlag
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-input {
	width: 140px
}
</style>
