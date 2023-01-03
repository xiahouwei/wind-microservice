<template>
	<div class="wind-select-tab__dropdown-container">
		<type-dropdown-wrap
			v-if="typeOptionlist.length"
			ref="type-dropdown-wrap"
			:optionlist="currentTypeOptionList"
			:optionProp="typeOptionProp"
			:optionRender="typeOptionRender"
			:virtual="virtual"
			:selectedTypeData.sync="selectedTypeData"
			class="wind-select-tab__dropdown-flex-type"
		></type-dropdown-wrap>
		<item-dropdown-wrap
			ref="item-dropdown-wrap"
			:selectValue="selectValue"
			:optionlist="currentOptionList"
			:currentHoverItem.sync="currentHoverItemSub"
			:optionProp="optionProp"
			:optionRender="optionRender"
			:virtual="virtual"
			:loading="loading"
			:loadingText="loadingText"
			:noDataText="noDataText"
			class="wind-select-tab__dropdown-flex-item"
			@on-scroll="onScroll"
			@on-select-item-click="onSelectItemClick"
		></item-dropdown-wrap>
	</div>
</template>

<script>
import ItemDropdownWrap from './ItemDropdownWrap.vue'
import TypeDropdownWrap from './TypeDropdownWrap.vue'
export default {
	name: 'dropdownWrap',
	components: {
		ItemDropdownWrap,
		TypeDropdownWrap
	},
	props: {
		selectValue: null,
		optionlist: {
			type: Array,
			default: () => {
				return []
			}
		},
		typeOptionlist: {
			type: Array,
			default: () => {
				return []
			}
		},
		optionProp: {
			type: Object,
			default: () => {
				return {
					name: 'name',
					disabled: 'disabled',
					visibleFlag: 'visibleFlag'
				}
			}
		},
		optionRender: Function,
		typeOptionProp: {
			type: Object,
			default: () => {
				return {
					name: 'name',
					disabled: 'disabled',
					visibleFlag: 'visibleFlag'
				}
			}
		},
		typeOptionRender: Function,
		virtual: {
			type: Boolean,
			default: true
		},
		loading: {
			type: Boolean
		},
		loadingText: {
			type: String,
			default: '加载中'
		},
		noDataText: {
			type: String,
			default: '无数据'
		},
		currentHoverItem: {
			type: Object,
			default: () => {
				return {}
			}
		},
		typeFilter: Function,
		showAllTypeOption: Boolean
	},
	data () {
		return {
			selectedTypeData: { id: '' },
			currentHoverItemSub: {}
		}
	},
	computed: {
		currentOptionList () {
			return this.optionlist.filter(item => {
				return item[this.optionProp.visibleFlag || 'visibleFlag'] !== false && this.typeFilterFn(this.selectedTypeData, item)
			})
		},
		currentTypeOptionList () {
			const currentTypeOptionList = this.typeOptionlist.filter(item => {
				return item[this.typeOptionProp.visibleFlag || 'visibleFlag'] !== false
			})
			const allOption = currentTypeOptionList.find(item => item.id === '')
			if (this.showAllTypeOption && !allOption) {
				currentTypeOptionList.unshift({
					id: '',
					name: '全部'
				})
			}
			return currentTypeOptionList
		}
	},
	watch: {
		currentHoverItem (value) {
			this.currentHoverItemSub = value
		},
		currentHoverItemSub (value) {
			this.$emit('update:currentHoverItem', value)
		}
	},
	methods: {
		onScroll (e) {
			this.$emit('on-scroll', e)
		},
		onSelectItemClick (item) {
			this.$emit('on-select-item-click', item)
		},
		scrollToOption (optionItem) {
			this.$refs['item-dropdown-wrap'].scrollToOption(optionItem)
		},
		scrollToIndex (index) {
			this.$refs['item-dropdown-wrap'].scrollToIndex(index)
		},
		recalculateScrollBar () {
			this.$refs['item-dropdown-wrap'].recalculateScrollBar()
			this.$refs['type-dropdown-wrap'] && this.$refs['type-dropdown-wrap'].recalculateScrollBar()
		},
		resetScroll () {
			this.selectedTypeData = { id: '' }
			this.$refs['item-dropdown-wrap'].scrollToIndex(0)
			this.$refs['type-dropdown-wrap'] && this.$refs['type-dropdown-wrap'].scrollToIndex(0)
		},
		typeFilterFn (selectedTypeData, item) {
			if (selectedTypeData.id && this.$fxUtils.isFunction(this.typeFilter)) {
				return this.typeFilter(selectedTypeData, item)
			} else if (selectedTypeData.id) {
				return selectedTypeData.id === item.supplierTypeId || selectedTypeData.id === item.regionId
			} else {
				return true
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
.wind-select-tab {
	&__dropdown {
		&-container {
			display flex
		}
		&-flex-type {
			flex 2
		}
		&-flex-item {
			flex 3
		}
	}
}
</style>
