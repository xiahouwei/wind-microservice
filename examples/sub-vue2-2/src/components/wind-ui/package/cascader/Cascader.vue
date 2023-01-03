<template>
	<Cascader
		ref="cascader"
		v-model="currentValue"
		:options="options"
		:props="props"
		:size="size"
		:placeholder="placeholder"
		:disabled="disabled"
		:clearable="clearable"
		:filterable="filterable"
		:collapse-tags="collapseTags"
		:show-all-levels="showAllLevels"
		popper-class="cascader-organ"
		class="wind-cascader"
		@change="onItemTypeChange"
	>
	</Cascader>
</template>
<script>
/**
 * Cascader by shang 2020/10/13
 * @desc Cascader 级联器
 * @param {Array} value 选中项绑定值
 * @param {Array} options 可选项数据源，键名可通过 Props 属性配置
 * @param {Object} props 配置选项，具体见下表
 * @param {String} size 尺寸
 * @param {String} placeholder 输入框占位文本
 * @param {Boolean} disabled 是否禁用
 * @param {Boolean} clearable 是否支持清空选项
 * @param {Boolean} filterable 是否可搜索选项
 * @param {Boolean} collapseTags 多选模式下是否折叠Tag
 * @param {Boolean} showAllLevels 输入框中是否显示选中值的完整路径
 */
import { Cascader } from 'element-ui'
export default {
	name: 'wind-cascader',
	components: {
		Cascader
	},
	props: {
		value: {
			type: Array,
			default: () => {
				return []
			}
		},
		options: {
			type: Array,
			default: () => {
				return []
			}
		},
		props: Object,
		size: {
			type: String,
			default: 'mini'
		},
		placeholder: String,
		disabled: Boolean,
		clearable: {
			type: Boolean,
			default: true
		},
		filterable: {
			type: Boolean,
			default: true
		},
		collapseTags: Boolean,
		showAllLevels: {
			type: Boolean,
			default: true
		}
	},
	data () {
		return {
			currentValue: []
		}
	},
	watch: {
		value: {
			immediate: true,
			handler (val) {
				this.currentValue = val
			}
		},
		currentValue (val) {
			this.$emit('input', val)
		}
	},
	methods: {
		onItemTypeChange (ids) {
			this.$emit('change', ids)
		},
		clearSelect () {
			this.$refs.cascader.panel.clearCheckedNodes()
			this.$refs.cascader.panel.activePath = []
		},
		focus () {
			this.$refs.cascader.$refs.input.focus()
			this.$refs.cascader.toggleDropDownVisible()
		},
		getCheckedNodes () {
			return this.$refs.cascader.getCheckedNodes()
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '../../style/varsty.styl'
</style>
<style lang="stylus">
.wind-cascader {
	.el-input--mini{
		.el-input__inner {
			height 28px !important
		}
	}
	.el-cascader__tags {
		.el-tag {
			max-width 70%
		}
	}
}
.cascader-organ {
	.el-cascader-menu {
		width: 200px
	}
	.el-cascader-node {
		font-size 12px
	}
}
</style>
