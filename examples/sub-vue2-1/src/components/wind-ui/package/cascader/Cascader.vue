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
		:filterable="true"
		popper-class="cascader-organ"
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
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '../../style/varsty.styl'
</style>
<style lang="stylus">
.cascader-organ {
	.el-cascader-menu {
		width: 200px
	}
	.el-cascader-node {
		font-size 12px
	}
}
</style>
