import { TABLE_NAME, FIXED_WIDTH_COLUNM } from '../js/config.js'
import WindVirtualSort from './Table-sort.js'
import WindVirtualHeaderDiagonal from './Table-header-diagonal.js'
import { scrollbarWidth, hasClass, addClass, removeClass, arrFlatten } from '../js/utils.js'
import { mapStates } from '../store/helper'
export default {
	name: 'windTableHeader',
	props: {
		store: {
			required: true
		},
		columnArr: {
			type: Array,
			default: () => {
				return []
			}
		},
		width: [String, Number],
		height: String,
		isScrollY: Boolean,
		fixedTable: Boolean
	},
	data () {
		return {
			gutterWidth: scrollbarWidth(),
			dragging: false,
			draggingColumn: null,
			dragState: {}
		}
	},
	computed: {
		...mapStates({
			isAllSelected: 'isAllSelected'
		}),
		table () {
			return this.$parent
		},
		computedGutterWidth () {
			return (this.isScrollY && this.gutterWidth) ? this.gutterWidth : 0
		}
	},
	methods: {
		convertToRows (columns, _maxLevel) {
			let maxLevel = _maxLevel || 1
			const traverse = (column, parent) => {
				if (parent) {
					column.level = parent.level + 1
					if (maxLevel < column.level) {
						maxLevel = column.level
					}
				}
				if (Array.isArray(column.childColumn) && column.childColumn.length > 0) {
					let colSpan = 0
					column.childColumn.forEach(subColumn => {
						traverse(subColumn, column)
						colSpan += subColumn.colSpan
					})
					column.colSpan = colSpan
				} else {
					column.colSpan = 1
				}
			}
			columns.forEach((column) => {
				column.level = 1
				traverse(column)
			})
			const rows = Array.from({
				length: maxLevel
			}, () => {
				return []
			})
			const allColumns = arrFlatten(columns, item => {
				return item.childColumn
			})
			allColumns.forEach(column => {
				if (!(Array.isArray(column.childColumn) && column.childColumn.length > 0)) {
					column.rowSpan = maxLevel - column.level + 1
				} else {
					column.rowSpan = 1
				}
				rows[column.level - 1].push(column)
			})
			return { rows, maxLevel }
		},
		onColumnClick (event, item) {
			event.stopPropagation()
			const target = event.target
			const cell = target.tagName === 'TH' ? target : target.parentNode
			if (hasClass(cell, 'noclick')) {
				return false
			}
			if (item.sortable) {
				this.$emit('on-sort', item)
			}
		},
		toggleAllSelection (event) {
			event.stopPropagation()
			if (event.target.tagName === 'INPUT') {
				this.store.commit('toggleAllSelection')
			}
		},
		handleMouseMove (event, column) {
			if (column.children && column.children.length > 0) return
			let target = event.target
			while (target && target.tagName !== 'TH') {
				target = target.parentNode
			}
			if (!column || !column.columnConfig.resizable) return
			if (!this.dragging) {
				const rect = target.getBoundingClientRect()
				const bodyStyle = document.body.style
				if (rect.width > 12 && rect.right - event.pageX < 8) {
					bodyStyle.cursor = 'col-resize'
					if (hasClass(target, 'is-sortable')) {
						target.style.cursor = 'col-resize'
					}
					this.draggingColumn = column
				} else if (!this.dragging) {
					bodyStyle.cursor = ''
					if (hasClass(target, 'is-sortable')) {
						target.style.cursor = 'pointer'
					}
					this.draggingColumn = null
				}
			}
		},
		handleMouseOut () {
			document.body.style.cursor = ''
		},
		handleMouseDown (event, column, columnIndex) {
			if (column.children && column.children.length > 0) return
			if (this.draggingColumn) {
				this.dragging = true
				this.$parent.resizeProxyVisible = true
				const table = this.$parent
				const tableEl = table.$el
				const tableLeft = tableEl.getBoundingClientRect().left
				const columnEl = this.$el.querySelector(`th.${column.columnConfig.id}`)
				const columnRect = columnEl.getBoundingClientRect()
				const sortableMinWidth = column.columnConfig.sortable ? 50 : 0
				const minLeft = columnRect.left - tableLeft + 30 + sortableMinWidth
				addClass(columnEl, ('noclick'))
				this.dragState = {
					startMouseLeft: event.clientX,
					startLeft: columnRect.right - tableLeft,
					startColumnLeft: columnRect.left - tableLeft,
					tableLeft
				}
				const resizeProxy = table.$refs.resizeProxy
				resizeProxy.style.left = this.dragState.startLeft + 'px'
				document.onselectstart = function () { return false }
				document.ondragstart = function () { return false }
				const handleMouseMove = (event) => {
					const deltaLeft = event.clientX - this.dragState.startMouseLeft
					const proxyLeft = this.dragState.startLeft + deltaLeft

					resizeProxy.style.left = Math.max(minLeft, proxyLeft) + 'px'
				}
				const handleMouseUp = () => {
					if (this.dragging) {
						const {
							startColumnLeft
						} = this.dragState
						const finalLeft = parseInt(resizeProxy.style.left, 10)
						let columnWidth = finalLeft - startColumnLeft
						if ((this.table.dragCellKeepTableWidth || this.changeTableWidth(columnWidth, column)) && this.columnArr[columnIndex + 1]) {
							let dragWidth = columnWidth - column.columnConfig.realWidth
							const nextColumn = this.columnArr[columnIndex + 1].columnConfig
							if ((nextColumn.realWidth - dragWidth) < 20) {
								dragWidth = nextColumn.realWidth - 20
								columnWidth = column.columnConfig.realWidth + dragWidth
							}
							nextColumn.realWidth -= dragWidth
						}
						column.columnConfig.realWidth = columnWidth
						document.body.style.cursor = ''
						this.dragging = false
						this.draggingColumn = null
						this.dragState = {}
						table.resizeProxyVisible = false
					}
					document.removeEventListener('mousemove', handleMouseMove)
					document.removeEventListener('mouseup', handleMouseUp)
					document.onselectstart = null
					document.ondragstart = null
					setTimeout(function () {
						removeClass(columnEl, 'noclick')
					}, 0)
					this.table.updateScrollX()
				}
				document.addEventListener('mousemove', handleMouseMove)
				document.addEventListener('mouseup', handleMouseUp)
			}
		},
		changeTableWidth (columnWidth, column) {
			return columnWidth < column.columnConfig.realWidth && (this.table.colRealWidthSum <= this.table.$refs.tbody.$el.clientWidth || this.table.colRealWidthSum === this.table.$refs.tbody.$el.clientWidth + this.gutterWidth)
		},
		setColumnRows () {
			const visibleColumn = this.store.states._columns.filter(item => {
				return !!item.visiable
			})
			const specialCol = []
			const fixCol = []
			const unFixCol = []
			visibleColumn.forEach(item => {
				if (FIXED_WIDTH_COLUNM.includes(item.type)) {
					specialCol.push(item)
				} else if (item.fixed) {
					fixCol.push(item)
				} else {
					unFixCol.push(item)
				}
			})
			const { rows: visivleColumnArr, maxLevel } = this.convertToRows([...specialCol, ...fixCol, ...unFixCol])
			const { rows: frozenColumnArr } = this.convertToRows([...specialCol, ...fixCol], maxLevel)
			if (this.columnArr.length === this.table.getFrozenColumn.length) {
				return frozenColumnArr
			} else {
				return visivleColumnArr
			}
		}
	},
	render (h) {
		const columnRows = this.setColumnRows()
		const isGroup = columnRows.length > 1
		if (isGroup) this.$parent.isGroup = true
		return <div class={[`${TABLE_NAME}__theader`]}>
			<table
				class={[`${TABLE_NAME}__theader-table`]}
				style={{ width: `${this.width + this.computedGutterWidth}px` }}
				cellspacing='0'
				cellpadding='0'
				border='0'
			>
				<colgroup>
					{
						this.columnArr.map((item, index) => {
							const cellWidth = item.columnConfig.realWidth
							const cellClassKey = item.prop || item.type
							return <col name={ `${TABLE_NAME}-column-${cellClassKey}` } width = { cellWidth } key={item.prop}/>
						})
					}
					{
						this.computedGutterWidth ? <col name={ `${TABLE_NAME}__th-gutter` } width = '17' key='gutter'/> : ''
					}
				</colgroup>
				<thead class={[`${TABLE_NAME}__title`]}>
					{
						columnRows.map((trItem, trIndex) => {
							return <tr
								class={[`${TABLE_NAME}__title-box`, { 'is-group': isGroup }]}
								style={{
									height: this.height,
									'line-height': this.height
								}}
							>
								{
									trItem.map((item, index) => {
										const cellClassKey = item.prop || item.type
										const hiddenCell = item.fixed && !this.fixedTable
										const headerCellClasses = [`${TABLE_NAME}__cell`, {
											'has-padding': item.columnConfig.cellPadding
										}, `is-sortable-header-${item.columnConfig.headerAlign || 'left'}`]
										if (item.labelClassName) {
											headerCellClasses.push(item.labelClassName)
										}
										const haveHeaderBorder = !this.table.isBorder &&
										this.table.isHeaderBorder &&
										!(item.childColumn.length > 0 && trItem[index + 1] && trItem[index + 1].childColumn.length === 0) &&
										(item.fixed || index !== trItem.length - 1 || !item.isSubColumn)
										const haveHeaderLeftBorder = !this.table.isBorder &&
										this.table.isHeaderBorder &&
										item.childColumn.length === 0 &&
										trItem[index - 1] &&
										trItem[index - 1].childColumn.length > 0
										return <th
											class={[`${TABLE_NAME}-column-${cellClassKey}`, `${TABLE_NAME}__th`, `${item.columnConfig.id}`, {
												'is-sortable': item.sortable,
												'is-border': this.table.isBorder,
												'is-header-border': haveHeaderBorder,
												'is-header-left-border': haveHeaderLeftBorder,
												'is-hidden': hiddenCell
											}]}
											key={item.prop}
											colspan={ item.colSpan }
											rowspan={ item.rowSpan }
											on-click={($event) => this.onColumnClick($event, item)}
											on-mousemove={ ($event) => this.handleMouseMove($event, item) }
											on-mouseout={ this.handleMouseOut }
											on-mousedown={ ($event) => this.handleMouseDown($event, item, index) }
										>
											<div class={[...headerCellClasses]} style={{
												'text-align': item.columnConfig.headerAlign || 'left',
												display: hiddenCell ? 'none' : 'block'
											}}>
												{
													item.diagonal ? <div>
														<span class={[`${TABLE_NAME}__th-label`, 'table-header-diagonal-label-left']}>{ item.label.left }</span>
														<span class={[`${TABLE_NAME}__th-label`, 'table-header-diagonal-label-right']}>{ item.label.right }</span>
													</div> : <span class={[`${TABLE_NAME}__th-label`]}>{ item.columnConfig.renderHeader.call(this, h, item, index, this.store) }</span>
												}
												{
													item.columnConfig.sortable ? <WindVirtualSort sort={item.getSort()}></WindVirtualSort> : ''
												}
											</div>
											{
												item.diagonal ? <WindVirtualHeaderDiagonal></WindVirtualHeaderDiagonal> : ''
											}
										</th>
									})
								}
								{
									this.computedGutterWidth ? <th class={[`${TABLE_NAME}__th-gutter`]} style={{ width: `${this.gutterWidth}px` }}></th> : ''
								}
							</tr>
						})
					}
				</thead>
			</table>
		</div>
	}
}
