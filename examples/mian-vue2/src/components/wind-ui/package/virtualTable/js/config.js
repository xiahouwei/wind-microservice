import { toFixedSHW as toFixed } from './utils.js'
const TABLE_NAME = 'wind-virtual-table'
const SORT_TYPE = ['', 'asc', 'desc']
const FIXED_WIDTH_COLUNM = ['selection', 'index', 'expand']
const cellConfig = {
	default: {
		order: '',
		cellPadding: true
	},
	selection: {
		width: 40,
		realWidth: 40,
		order: '',
		align: 'center',
		headerAlign: 'center',
		sortable: false,
		resizable: false,
		cellPadding: false
	},
	expand: {
		width: 60,
		realWidth: 60,
		order: '',
		align: 'center',
		headerAlign: 'center',
		sortable: false,
		resizable: false,
		cellPadding: false
	},
	index: {
		width: 45,
		realWidth: 45,
		order: '',
		align: 'center',
		headerAlign: 'center',
		sortable: false,
		resizable: false,
		cellPadding: false
	},
	arrow: {
		width: 75,
		realWidth: 75,
		order: '',
		align: 'center',
		headerAlign: 'center',
		sortable: false,
		resizable: false,
		cellPadding: false
	}
}
const cellRender = {
	selection: {
		renderHeader (h, column, index, store) {
			if (column.radio) {
				return column.label || ''
			} else {
				return <el-checkbox
					disabled={ store.states.data && store.states.data.length === 0 }
					indeterminate={ store.states.selection.length > 0 && !this.isAllSelected }
					nativeOn-click={ this.toggleAllSelection }
					value={ this.isAllSelected }
				/>
			}
		},
		renderCell (h, column, columnIndex, rowItem, rowIndex, store) {
			if (column.radio) {
				return <el-radio
					value={ store.getRadioValue() }
					label={ rowItem.id }
					on-change={() => { store.commit('rowRadioChanged', rowItem) }}
					nativeOn-click={ (event) => event.stopPropagation() }
				></el-radio>
			} else {
				return <el-checkbox
					value={ store.isSelected(rowItem) }
					disabled={ column.selectable ? !column.selectable.call(null, rowItem, rowIndex) : false }
					on-input={ () => { store.commit('rowSelectedChanged', rowItem) } }
					nativeOn-click={ (event) => event.stopPropagation() }
				/>
			}
		}
	},
	index: {
		renderHeader (h, column, index) {
			return column.label || ''
		},
		renderCell (h, column, columnIndex, rowItem, rowIndex) {
			return <span class={[`${TABLE_NAME}__cell-span`]}>{ getIndex(column, rowIndex) }</span>
		}
	},
	expand: {
		renderHeader (h, column, index) {
			return column.label || ''
		},
		renderCell (h, column, columnIndex, rowItem, rowIndex, store) {
			const expandClassName = `${TABLE_NAME}__cell-expand`
			const classes = [expandClassName]
			const isExpanded = store.isRowExpanded(rowItem)
			if (isExpanded) {
				classes.push('is-expanded')
			}
			const callback = function (e) {
				e.stopPropagation()
				if (!isExpanded && typeof this.owner.expandAsync === 'function') {
					this.owner.expandAsync(rowItem, rowIndex).then(() => {
						store.commit('rowExpandedChanged', rowItem)
					})
				} else {
					store.commit('rowExpandedChanged', rowItem)
				}
			}.bind(this)
			const arrowClass = isExpanded ? 'el-icon-arrow-down' : 'el-icon-arrow-right'
			const cell = typeof this.owner.expendCellRender === 'function' ? this.owner.expendCellRender(h, rowItem, rowIndex) : getIndex(column, rowIndex)
			return (<div class={ classes } on-click={callback}>
				<i class={['el-icon', arrowClass, 'expand-icon']}></i><span>{cell}</span>
			</div>)
		}
	},
	arrow: {
		renderHeader (h, column, index) {
			return <div class="arrow-header" on-click={($event) => column.headerClick($event, column, index)}>
				<w-icon
					type='tabel-header-arrow-right'
					class="arrow-header-icon"
				></w-icon>
				<span class='arrow-header-label'>{column.label}</span>
				<w-icon
					type='tabel-header-arrow-left'
					class="arrow-header-icon"
				></w-icon>
			</div>
		},
		renderCell (h, column, columnIndex, rowItem, rowIndex) {
			return cellRender.default.renderCell(h, column, columnIndex, rowItem, rowIndex)
		}
	},
	default: {
		renderHeader (h, column, index) {
			return column.label || ''
		},
		renderCell (h, column, columnIndex, rowItem, rowIndex) {
			if (column.$scopedSlots.default) {
				return column.$scopedSlots.default({ row: rowItem, $index: rowIndex })
			} else if (column.$slots.default) {
				return column.$slots.default
			} else {
				const formatter = column.formatter
				const decimal = column.decimal
				const value = typeof formatter === 'function'
					? formatter(rowItem, column, rowItem[column.prop], rowIndex)
					: typeof decimal === 'number'
						? toFixed(rowItem[column.prop], decimal, false)
						: rowItem[column.prop]
				return <span class={[`${TABLE_NAME}__cell-span`]}>{ value }</span>
			}
		}
	}
}
const getIndex = function (column, rowIndex) {
	let i = rowIndex + 1
	const index = column.index
	if (typeof index === 'number') {
		i = rowIndex + index
	} else if (typeof index === 'function') {
		i = index(rowIndex)
	}
	return i
}
export {
	TABLE_NAME,
	cellConfig,
	cellRender,
	SORT_TYPE,
	FIXED_WIDTH_COLUNM
}
