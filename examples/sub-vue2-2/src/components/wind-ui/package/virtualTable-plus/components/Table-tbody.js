import { TABLE_NAME, FIXED_WIDTH_COLUNM } from '../js/config.js'
import { getCell, getColumnByCell, debounce, addClass, removeClass } from '../js/utils.js'
export default {
	name: 'windTableTbody',
	props: {
		store: {
			required: true
		},
		visibleData: {
			type: Array,
			default: () => {
				return []
			}
		},
		columnData: {
			type: Array,
			default: () => {
				return []
			}
		},
		width: String,
		bodyType: String,
		height: Number,
		viewListTranslateY: {
			type: Number,
			default: 0
		},
		fixedTable: Boolean,
		isScrollX: Boolean
	},
	data () {
		return {
			clickDebounce: this.clickDebounceHandler(),
			rowMouseDebounce: debounce()
		}
	},
	computed: {
		table () {
			return this.$parent
		},
		columnStyle (colItem) {
			return (colItem) => {
				const colStyle = {}
				colStyle['text-align'] = (colItem && colItem.align) || 'center'
				return colStyle
			}
		},
		trHeight () {
			return `${this.store.states.trHeight}px`
		}
	},
	watch: {
		'store.states.hoverRow' (newVal, oldVal) {
			if (this.table.highlightCurrentRow) {
				this.$fxUtils.fxRequestAnimationFrame(() => {
					const newRow = this.$el.querySelector(`.wind-virtual-table__tr-${newVal}`)
					const oldRow = this.$el.querySelector(`.wind-virtual-table__tr-${oldVal}`)
					if (oldRow) {
						removeClass(oldRow, 'hover-row')
					}
					if (newRow) {
						addClass(newRow, 'hover-row')
					}
				})
			}
		}
	},
	methods: {
		handleEvent (event, row, index, name) {
			const table = this.table
			let column
			const cell = getCell(event)
			if (cell) {
				column = getColumnByCell(table, cell)
				if (column) {
					table.$emit(`cell-${name}`, row, column, cell, event)
				}
			}
			table.$emit(`row-${name}`, row, column, index, event)
		},
		onRowClick (event, item, index) {
			this.clickDebounce.click(() => {
				this.handleEvent(event, item, index, 'click')
			})
		},
		onSubRowClick (event, subRow, index) {
			this.table.$emit('row-subClick', subRow, index)
		},
		onSubCellClick (event, subRow, exrow, row) {
			this.table.$emit('cell-subClick', subRow, exrow, row)
		},
		onRowDoubleClick (event, item, index) {
			this.clickDebounce.dbClick(() => {
				this.store.commit('rowExpandedChanged', item)
				this.handleEvent(event, item, index, 'dblclick')
			})
		},
		clickDebounceHandler () {
			let dbclick = false
			let clickTime = null
			return {
				click (fn) {
					clearTimeout(clickTime)
					clickTime = setTimeout(() => {
						if (dbclick) {
							dbclick = false
							return false
						}
						fn()
					}, 300)
				},
				dbClick (fn) {
					dbclick = true
					fn()
				}
			}
		},
		getClientHeight () {
			return this.$refs.tbody ? this.$refs.tbody.clientHeight : 0
		},
		getPhantomClientHeight () {
			return this.$refs.phantom ? this.$refs.phantom.clientHeight : 0
		},
		getClient () {
			return {
				tbodyClientHeight: this.getClientHeight(),
				phantomClientHeight: this.getPhantomClientHeight()
			}
		},
		initScrollTop () {
			this.$nextTick(() => {
				this.$refs.tbody.scrollTop = 0
			})
		},
		initScrollLeft () {
			return new Promise(resolve => {
				this.$refs.tbody.scrollLeft = 0
				this.$nextTick(() => {
					resolve()
				})
			})
		},
		getSpan (row, column, rowIndex, columnIndex, visibleDataCurIndex) {
			let { rowspan, colspan } = this.getSpanMethod(row, column, rowIndex, columnIndex)
			if (!rowspan && visibleDataCurIndex === 0) {
				const rowspanIndex = this.visibleData.findIndex(item => {
					const { rowspan } = this.getSpanMethod(item, column, rowIndex, columnIndex)
					return rowspan !== 0
				})
				rowspan = !~rowspanIndex ? this.visibleData.length : rowspanIndex
			}
			return { rowspan, colspan }
		},
		getSpanMethod (row, column, rowIndex, columnIndex) {
			let rowspan = 1
			let colspan = 1
			const fn = this.table.spanMethod
			if (typeof fn === 'function') {
				const result = fn({
					row,
					column,
					rowIndex,
					columnIndex
				})
				if (Array.isArray(result)) {
					rowspan = result[0]
					colspan = result[1]
				} else if (typeof result === 'object') {
					rowspan = result.rowspan
					colspan = result.colspan
				}
			}
			return { rowspan, colspan }
		},
		handleMouseEnter (index) {
			this.rowMouseDebounce(30, false).then(() => {
				this.store.commit('setHoverRow', index)
			})
		},
		handleMouseLeave () {
			this.rowMouseDebounce(30, false).then(() => {
				this.store.commit('setHoverRow', null)
			})
		},
		initCell (h, item, index, rowItem, rowIndex) {
			return item.columnConfig.renderCell(h, item, index, rowItem, rowIndex, this.store)
		},
		wrappedRowRender (h, row, $index, visibleDataCurIndex, store, { expandRowConfig, columnLength: colspan, hasSelect, hasIndex }) {
			const expanded = expandRowConfig.some(item => item.groupType) ? true : this.store.isRowExpanded(row)
			const expandData = row.dosingDetails ? row.dosingDetails : []
			const subSum = expandData.length
			const collectionData = row[this.table.collectionProp.data]
			const { collectionMap } = this.store.states
			if (expanded && expandData.length > 0) {
				const tr = this.rowRender(h, row, $index)
				return [[
					tr,
					// 子表表头
					<tr class={[`${TABLE_NAME}__title-box`]} style={{ height: '33px', 'background-color': '#eee' }}>
						{
							hasSelect ? <td
								class={[`${TABLE_NAME}-column-selection`, `${TABLE_NAME}__td`]}
								key='selection'
								style={{
									'text-align': 'center'
								}}
								rowspan={1}
								colspan={1}
							>
								<div class={[[`${TABLE_NAME}__cell`]]}>
								</div>
							</td> : ''
						}
						{
							hasIndex ? <td
								class={[`${TABLE_NAME}-column-index`, `${TABLE_NAME}__td`, {
									'is-border': this.table.border
								}]}
								key='index'
								style={{
									'text-align': 'center'
								}}
								rowspan={1}
								colspan={1}
							>
								<div class={[[`${TABLE_NAME}__cell`]]}>
										配料序号
								</div>
							</td> : ''
						}
						{
							this.bodyType !== 'left' ? expandRowConfig.map(expand => {
								return <td><div class={[[`${TABLE_NAME}__cell`, 'fx-list-table__cell-span', 'has-padding']]}>{expand.label}</div></td>
							}) : ''
						}
					</tr>,
					// 子表data
					row.dosingDetails.map((subRow, subIndex) => {
						subRow.$fxIndex = subIndex
						return <tr
							on-click={ ($event) => this.onSubRowClick($event, subRow, subIndex) }
							class={[`${TABLE_NAME}__title-box`, 'hover-subRow', { 'is-edit-subRow': subRow.isEdit }]} style={{ height: '35px', 'background-color': '#f6f6f6' }}>
							{
								hasSelect ? <td
									class={[`${TABLE_NAME}-column-selection`, `${TABLE_NAME}-column-collection`, `${TABLE_NAME}__td`]}
									key='selection'
									style={{
										'text-align': 'center'
									}}
									rowspan={1}
									colspan={1}
								>
									<div class={[[`${TABLE_NAME}__cell`]]}>
										<el-checkbox
											checked={ store.isSubSelected(subRow) }
											nativeOn-click={ (event) => event.stopPropagation() }
											on-change={ () => { store.commit('subRowSelectedChanged', subRow) } }
										></el-checkbox>
									</div>
								</td> : ''
							}
							{
								hasIndex ? <td
									class={[`${TABLE_NAME}-column-index`, `${TABLE_NAME}-column-collection`, `${TABLE_NAME}__td`, {
										'is-border': this.table.border
									}]}
									key='index'
									style={{
										'text-align': 'center'
									}}
									rowspan={1}
									colspan={1}
								>
									<div class={[[`${TABLE_NAME}__cell`]]}>
										{subIndex + 1}
									</div>
								</td> : ''
							}
							{
								this.bodyType !== 'left' ? expandRowConfig.map((exrow) => {
									const propArr = exrow.prop.split('.')
									if (!subRow.house) {
										this.$set(subRow, 'house', {})
									}
									const prop = propArr.length === 2 ? subRow[propArr[0]][propArr[1]] : subRow[exrow.prop]
									let divRender
									if (exrow.render) {
										divRender = exrow.render(h, { row: subRow, $rowIndex: row.$fxIndex, $subIndex: subIndex })
									} else if (exrow.formatter) {
										divRender = <div class={[[`${TABLE_NAME}__cell`, 'fx-list-table__cell-span']]}>{
											exrow.formatter(subRow)
										}</div>
									} else {
										divRender = <div class={[[`${TABLE_NAME}__cell`, 'fx-list-table__cell-span']]} style={{ 'word-wrap': 'break-word', overflow: 'hidden', 'text-overflow': 'ellipsis', 'white-space': 'nowrap' }}>{prop}</div>
									}
									return <td class={[
										`${TABLE_NAME}-column-collection`,
										`${TABLE_NAME}__td-collection`,
										`${TABLE_NAME}__td`,
										'tbody-td'
									]} style={{ 'text-align': 'left' }} on-click={ ($event) => this.onSubCellClick($event, subRow, exrow, row)}>
										<div class={[[`${TABLE_NAME}__cell`, { 'is-edit-sub-cell': !!exrow.editColumn }, { 'addition-col': !(exrow.editColumn ? exrow.editColumn().includes(subRow.dataType) : false) }, 'fx-list-table__cell-span', 'has-padding']]}>
											{divRender}
										</div>
									</td>
								})
									: ''
							}
						</tr>
					}),
					// 合计行
					expandRowConfig.some(item => {
						return !item.groupType
					}) ? <tr class={[`${TABLE_NAME}__title-box`]} style={{
							height: '35px',
							'background-color': '#f6f6f6'
						}}>
							{
								hasSelect ? <td
									class={[`${TABLE_NAME}-column-selection`]}
									key='selection'
									style={{
										'text-align': 'center'
									}}
									rowspan={1}
									colspan={1}
								>
									<div class={[[`${TABLE_NAME}__cell`]]} style={{
										'text-align': 'center'
									}}>
									合计
									</div>
								</td> : ''
							}
							{
								hasIndex ? <td
									class={[`${TABLE_NAME}-column-index`, {
										'is-border': this.table.border
									}]}
									key='index'
									style={{
										'text-align': 'center'
									}}
									rowspan={1}
									colspan={1}
								>
									<div class={[[`${TABLE_NAME}__cell`]]}>
										{`共${subSum}项`}
									</div>
								</td> : ''
							}
							{
								expandRowConfig.map((exrow) => {
									if (exrow.summary) {
										const sumData = expandData.reduce((total, currentValue) => {
											return currentValue[exrow.prop] ? (total + this.$fxUtils.toNumber(currentValue[exrow.prop])) : total
										}, 0)
										return <td><div class={[[`${TABLE_NAME}__cell`, 'fx-list-table__cell-span', 'has-padding', 'is-edit-cell']]}>{exrow.summaryFormatter ? exrow.summaryFormatter(sumData) : sumData}</div></td>
									} else {
										return <td>{}</td>
									}
								})
							}
						</tr> : ''
				]]
			} else if (collectionData && typeof this.table.collectionCellRender === 'function') {
				const tr = this.rowRender(h, row, $index)
				const collectionId = collectionData[this.table.collectionProp.id]
				if (collectionMap[collectionId].indexOf(row.id) === 0) {
					return [[
						<tr
							class={[`${TABLE_NAME}__tr collection-row`]}
							style={{
								height: this.trHeight,
								'line-height': this.trHeight
							}}
							key={`header-row__${row.id}`}
						>
							{
								hasSelect ? <td
									class={[`${TABLE_NAME}-column-selection`, `${TABLE_NAME}__td`, {
										'is-border': this.table.border
									}]}
									key='selection'
									style={{
										'text-align': 'center'
									}}
									rowspan={1}
									colspan={1}
								>
									<div class={[[`${TABLE_NAME}__cell`]]}>
										<el-checkbox
											nativeOn-click={ (event) => event.stopPropagation() }
											value={ store.isCollectionSelected(collectionMap[collectionId]) }
											indeterminate={ store.isCollectionIndeterminateSelected(collectionMap[collectionId]) }
											on-input={ () => { store.commit('rowCollectionSelectedChanged', collectionMap[collectionId]) } }
										></el-checkbox>
									</div>
								</td> : ''
							}
							{
								hasIndex ? <td
									class={[`${TABLE_NAME}-column-index`, `${TABLE_NAME}__td`, {
										'is-border': this.table.border
									}]}
									key='index'
									style={{
										'text-align': 'center'
									}}
									rowspan={1}
									colspan={1}
								>
									<div class={[[`${TABLE_NAME}__cell`]]}>
										<i class={['el-icon', 'el-icon-arrow-down']}></i>
									</div>
								</td> : ''
							}
							<td
								class={[
									`${TABLE_NAME}-column-collection`,
									`${TABLE_NAME}__td-collection`,
									`${TABLE_NAME}__td`,
									'collection-td', {
										'is-border': this.table.border
									}]}
								key='collection'
								style={{
									'text-align': 'left'
								}}
								colspan={colspan}
							>
								<div>{this.fixedTable ? null : this.table.collectionCellRender(h, collectionData, $index)}</div>
							</td>
						</tr>,
						tr
					]]
				} else {
					return tr
				}
			} else {
				return this.rowRender(h, row, $index, visibleDataCurIndex)
			}
		},
		rowRender (h, item, index, visibleDataCurIndex) {
			const classes = [`${TABLE_NAME}__tr`, `${TABLE_NAME}__tr-${item.$fxIndex}`]
			let classObject = {}
			if (typeof this.table.rowClassName === 'string') {
				classes.push(this.table.rowClassName)
			} else if (typeof this.table.rowClassName === 'function') {
				const className = this.table.rowClassName(item, index)
				if (typeof className === 'string') {
					classes.push(className)
				} else if (Array.isArray(className)) {
					classes.push(...className)
				}
			}
			if (typeof this.table.rowStyle === 'function') {
				classObject = this.table.rowStyle(item, index)
			}
			return <tr
				class={[...classes, {
					'is-even': (index % 2 === 0) && this.table.stripe
				}]}
				style={{
					height: this.trHeight,
					'line-height': this.trHeight,
					...classObject
				}}
				key={item.id}
				on-click={ ($event) => this.onRowClick($event, item, index) }
				on-dblclick={ ($event) => this.onRowDoubleClick($event, item, index) }
				on-mouseenter={ _ => this.handleMouseEnter(index) }
				on-mouseleave={ this.handleMouseLeave }
			>
				{
					this.columnData.map((columnItem, columnIndex) => {
						const { rowspan, colspan } = this.getSpan(item, columnItem, index, columnIndex, visibleDataCurIndex)
						if (!rowspan || !colspan) {
							return null
						}
						const cellClassKey = columnItem.prop || columnItem.type
						const hiddenCell = columnItem.fixed && !this.fixedTable
						const tdClasses = [`${TABLE_NAME}__cell`]
						let tdClassObject = {}
						if (columnItem.columnConfig.className) {
							tdClasses.push(columnItem.columnConfig.className)
						}
						if (typeof this.table.cellClassName === 'string') {
							tdClasses.push(this.table.cellClassName)
						} else if (typeof this.table.cellClassName === 'function') {
							const className = this.table.cellClassName(item, index, columnItem, columnIndex)
							if (typeof className === 'string') {
								tdClasses.push(className)
							} else if (Array.isArray(className)) {
								tdClasses.push(...className)
							}
						}
						if (typeof this.table.cellStyle === 'function') {
							tdClassObject = this.table.cellStyle(item, index)
						}
						return <td
							class={[
								`${TABLE_NAME}-column-${cellClassKey}`,
								`${TABLE_NAME}__td`,
								'tbody-td', {
									'is-hidden': hiddenCell,
									'is-border': this.table.border
								}]}
							key={columnItem.prop}
							style={{
								'text-align': columnItem.columnConfig.align
							}}
							rowspan={rowspan}
							colspan={colspan}
						>
							<div class={[...tdClasses, {
								'has-padding': columnItem.columnConfig.cellPadding
							}]} style={{ display: hiddenCell ? 'none' : 'block', ...tdClassObject }}>
								{this.initCell(h, columnItem, columnIndex, item, index)}
							</div>
						</td>
					})
				}
			</tr>
		}
	},
	render (h) {
		const params = {}
		params.expandRowConfig = this.store.states.expandRowConfig.filter(item => {
			return !!item.visible
		})
		if (typeof this.table.collectionCellRender === 'function') {
			params.columnLength = this.columnData.filter(item => !FIXED_WIDTH_COLUNM.includes(item.type)).length
		} else {
			params.columnLength = this.columnData.length
		}
		params.hasSelect = this.columnData.some(item => item.type === 'selection')
		params.hasIndex = this.columnData.some(item => (item.type === 'index' || item.type === 'expand'))
		const classes = [`${TABLE_NAME}__tbody`, { 'hide-scroll-x-bar': !this.isScrollX }]
		if (this.visibleData.length > 0) {
			classes.push('has-table-data')
		}
		return <div ref='tbody' class={classes}>
			<div
				ref='phantom'
				class={[`${TABLE_NAME}__tbody-phantom`]}
				style={{ width: this.width, height: `${this.height}px` }}
			>
				<table
					class={[`${TABLE_NAME}__tbody-content`]}
					style={{
						transform: `translate3d(0px, ${this.viewListTranslateY}px, 0px)`,
						width: this.width
					}}
					cellspacing='0'
					cellpadding='0'
					border='0'
				>
					<colgroup>
						{
							this.columnData.map((columnItem, columnIndex) => {
								const cellWidth = columnItem.columnConfig.realWidth
								const cellClassKey = columnItem.prop || columnItem.type
								return <col name={ `${TABLE_NAME}-column-${cellClassKey}` } width = { cellWidth }/>
							})
						}
					</colgroup>
					<tbody
					>
						{
							this.visibleData.reduce((pre, cur, visibleDataCurIndex) => {
								return pre.concat(this.wrappedRowRender(h, cur, cur.$fxIndex, visibleDataCurIndex, this.store, params))
							}, [])
						}
					</tbody>
				</table>
			</div>
		</div>
	}
}
