const getIsHoverClass = function (item, mouseenterFilter) {
	return item.id === mouseenterFilter ? 'is-hover' : ''
}
const getDisableClass = function (item) {
	return item.disable ? 'is-disable' : ''
}
const getDisableMessageSpan = function (h, item, mouseenterFilter) {
	return (mouseenterFilter === item.id && item.disable) ? <span class="item-tag-disabe-message">当前筛选条件不可移动</span> : null
}
const getLabelSizeClass = function (item) {
	if (item.labelSize) {
		return `label-${item.labelSize}`
	}
	return ''
}
export const filterItemRender = {
	select (h, { item, mouseenterFilter }) {
		h = this.$createElement
		const disableMessageSpan = getDisableMessageSpan(h, item, mouseenterFilter)
		return (
			<div class={[
				'fx-drag-filter-item',
				'fx-filter-item-template__select',
				getDisableClass(item),
				getIsHoverClass(item, mouseenterFilter)
			]}>
				<div class={['fx-filter-item-template__select-label', getLabelSizeClass(item)]}>{item.name}:</div>
				<div class="fx-filter-item-template__select-input">
					请选择
					<i class="el-icon-arrow-down arrow-icon"></i>
					{ disableMessageSpan }
				</div>
			</div>
		)
	},
	input (h, { item, mouseenterFilter }) {
		h = this.$createElement
		const disableMessageSpan = getDisableMessageSpan(h, item, mouseenterFilter)
		return (
			<div class={[
				'fx-drag-filter-item',
				'fx-filter-item-template__input',
				getDisableClass(item),
				getIsHoverClass(item, mouseenterFilter)
			]}>
				<div class={['fx-filter-item-template__input-label', getLabelSizeClass(item)]}>{item.name}:</div>
				<div class="fx-filter-item-template__input-input">
					请输入
					{ disableMessageSpan }
				</div>
			</div>
		)
	},
	dateRange (h, { item, mouseenterFilter }) {
		h = this.$createElement
		const disableMessageSpan = getDisableMessageSpan(h, item, mouseenterFilter)
		return (
			<div class={[
				'fx-drag-filter-item',
				'fx-filter-item-template__date-range',
				getDisableClass(item),
				getIsHoverClass(item, mouseenterFilter)
			]}>
				<div class={['fx-filter-item-template__date-range-label', getLabelSizeClass(item)]}>{item.name}:</div>
				<div class="fx-filter-item-template__date-range-input">
					<i class="el-icon-date date-icon"></i>
					<span class="text-span">至</span>
					{ disableMessageSpan }
				</div>
			</div>
		)
	}
}

export const tableColumnRender = {
	selectable (h, { item }) {
		h = this.$createElement
		return (
			<div class="fx-table-column-template__column-tag-first">
				<div class="fx-table-column-template__column-tag-first-header">
					<span class="el-checkbox__inner"></span>
				</div>
			</div>
		)
	},
	serialNumber (h, { item }) {
		h = this.$createElement
		return (
			<div class="fx-table-column-template__column-tag-first">
				<div class="fx-table-column-template__column-tag-first-header">序号</div>
			</div>
		)
	},
	normal (h, { item }) {
		h = this.$createElement
		const columnClass = ['fx-table-column-template__column-tag-header', 'fx-drag-colunm-item']
		if (item.disable) {
			columnClass.push('fx-drag-disable', 'is-disable')
		}
		if (this.mouseenterFilter === item.id) {
			columnClass.push('is-hover')
		}
		function onTableColumnMouseenter () {
			if (this.isChooseFilterItem) {
				return false
			}
			this.mouseenterFilter = item.id
		}
		function onTableColumnMouseleave () {
			if (this.isChooseFilterItem) {
				return false
			}
			this.mouseenterFilter = null
		}
		return (
			<div class="fx-table-column-template__column-tag">
				<div
					class={columnClass}
					on-mouseenter={onTableColumnMouseenter.bind(this)}
					on-mouseleave={onTableColumnMouseleave.bind(this)}
				>{item.name}</div>
			</div>
		)
	}
}
