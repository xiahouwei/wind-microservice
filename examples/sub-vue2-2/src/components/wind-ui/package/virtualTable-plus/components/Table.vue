<template>
	<div ref="table" class="wind-virtual-table" :class="[{
		'wind-virtual-table__fit': fit,
		'wind-virtual-table__border': isBorder
	}, `${scrollState}`]">
		<div class="wind-virtual-table__hidden-columns" ref="hiddenColumns"><slot></slot></div>
		<div
			v-show="getFrozenColumn.length !== 0"
			:style="{width: frozenTableWidth, 'bottom': `${gutterHeight}px`}"
			class="wind-virtual-table__left"
		>
			<Wind-virtual-header
				ref="headLeft"
				:store="store"
				:columnArr="getFrozenColumn"
				:height="tableTrHeightStyle"
				fixedTable
				@on-sort="onSortHandler"
			></Wind-virtual-header>
			<Wind-virtual-tbody
				ref="tbody_left"
				:store="store"
				:visibleData="visibleData"
				:columnData="getFrozenColumn"
				:width="frozenTableWidth"
				:height="phantomListHeight"
				:viewListTranslateY="viewListTranslateY"
				fixedTable
				class="left-body"
				bodyType="left"
				@on-cell-click="onCellClick"
			></Wind-virtual-tbody>
			<div v-if="isScrollX&&showSummary" class="wind-virtual-table__scroll-x-bar-placeholder"></div>
			<Wind-virtual-bottom
				v-if="showSummary&&!isEmpty"
				:columnArr="getFrozenColumn"
				:sumData="sumData"
				:height="tableTrHeightStyle"
			></Wind-virtual-bottom>
		</div>
		<div class="wind-virtual-table__right">
			<Wind-virtual-header
				ref="headRight"
				:store="store"
				:columnArr="getVisivleColumn"
				:width="tableComputedwidth"
				:height="tableTrHeightStyle"
				:isScrollY="isScrollY"
				class="right-header"
				@on-sort="onSortHandler"
			></Wind-virtual-header>
			<Wind-virtual-tbody
				ref="tbody"
				:store="store"
				:visibleData="visibleData"
				:columnData="getVisivleColumn"
				:width="tableWidth"
				:height="phantomListHeight"
				:viewListTranslateY="viewListTranslateY"
				:isScrollX="isScrollX"
				class="right-body"
				@on-cell-click="onCellClick"
			></Wind-virtual-tbody>
			<Wind-virtual-bottom
				ref="bottomRight"
				v-if="showSummary&&!isEmpty"
				:sumData="sumData"
				:columnArr="getVisivleColumn"
				:width="tableComputedwidth"
				:height="tableTrHeightStyle"
				:isScrollY="isScrollY"
				class="right-bottom"
			></Wind-virtual-bottom>
			<div
				v-if="isEmpty"
				class="wind-virtual-table__empty-block"
			>
				<span class="wind-virtual-table__empty-text" >
					<slot name="empty">{{ emptyText }}</slot>
				</span>
			</div>
			<div
				ref="emptyView"
				v-show="showEmptyScrollBar"
				class="wind-virtual-table__empty-srcoll-bar"
			>
				<div :style="{width: tableWidth}" class="wind-virtual-table__empty-srcoll"></div>
			</div>
		</div>
		<div ref="resizeProxy" v-show="resizeProxyVisible" class="el-table__column-resize-proxy"></div>
	</div>
</template>

<script>
/**
 * VirtualTable by shang 2019/10/25
 * @desc ??????????????????
 * @param {sort}  [Boolean] - ????????????????????????
 * @param {bufferRow}  [Number] - ?????????
 * @param {trHeight}  [Number] - ?????????
 * @param {overWidthAutofit}  [Boolean] - ?????????????????????table????????????????????????????????????????????????table??????
 * @param {expendCellRender}  [Function] - ???????????????Render??????
 * @param {collectionCellRender}  [Function] - ???????????????????????????Render??????
 * @param {collectionProp}  [Object] - ???????????????????????????Prop??????

 * @event {select} [selection, row] - ????????????????????????????????? Checkbox ??????????????????
 * @event {select-all} [selection] - ??????????????????????????? Checkbox ??????????????????
 * @event {selection-change} [selection] - ?????????????????????????????????????????????
 * @event {row-click} [row, column, index, event] - ?????????
 * @event {row-dblclick} [row, column, index, event] - ?????????
 * @event {cell-click} [row, column, cell, event] - ???????????????
 * @event {sort-change} [{ column, prop, order }] - ???????????????????????????????????????????????????????????????

 * @methods {clearSelection} [] - ??????????????????????????????????????????
 * @methods {toggleRowSelection} [row, selected] - ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????selected ??? true ????????????
 * @methods {expandAsync} [rowItem, rowIndex] - ?????????????????????????????????
 * @methods {isRowExpanded} [row] - ????????????row???????????????(?????????string ?????? object , ??????object???, ???????????????????????????key????????????)
 */
import WindVirtualHeader from './Table-header.js'
import WindVirtualTbody from './Table-tbody.js'
import WindVirtualBottom from './Table-bottom.js'
import { scrollbarWidth, throttle, debounce, isInView } from '../js/utils.js'
import TableLayout from './Table-layout.js'
import { SORT_TYPE, TABLE_NAME, FIXED_WIDTH_COLUNM } from '../js/config.js'
import { createStore, mapStates } from '../store/helper'
import { addResizeListener, removeResizeListener } from '../../../js/utils/resize-event.js'
let tableIdSeed = 1
let beforeScrollTop = 0
let beforeScrollLeft = 0
export default {
	name: 'windVirtualTable',
	components: {
		WindVirtualHeader,
		WindVirtualTbody,
		WindVirtualBottom
	},
	props: {
		// ?????????????????????
		tableData: {
			type: Array,
			default: () => {
				return []
			}
		},
		// ????????????????????????
		virtual: {
			type: Boolean,
			default: true
		},
		// ?????????
		bufferRow: {
			type: Number,
			default: 25
		},
		// ??????
		trHeight: {
			type: Number,
			default: 35
		},
		// ?????????
		expandRows: {
			type: Array,
			default: () => {
				return []
			}
		},
		// ????????????
		expandRowHeight: {
			type: Number,
			default: 35
		},
		// ??????????????????table
		stripe: {
			type: Boolean,
			default: true
		},
		// ????????????????????????
		border: Boolean,
		// ??????????????????????????????
		headerBorder: {
			type: Boolean,
			default: true
		},
		// ???????????????????????????
		fit: {
			type: Boolean,
			default: true
		},
		// @TODO ??????????????????
		showHeader: {
			type: Boolean,
			default: true
		},
		// ????????????????????????
		highlightCurrentRow: {
			type: Boolean,
			default: true
		},
		// ?????? className
		rowClassName: [Function, String],
		// ?????? style ???????????????
		rowStyle: Function,
		// ???????????? className ???????????????
		cellClassName: [Function, String],
		// ???????????? style ???????????????
		cellStyle: [Function, String],
		// @TODO ???????????? className ???????????????
		headerRowClassName: [Function, String],
		// @TODO ???????????? style ???????????????
		headerRowStyle: [Function, String],
		// @TODO ?????????????????? className ???????????????
		headerCellClassName: [Function, String],
		// ???????????? key???????????????
		rowKey: {
			type: [String, Number],
			default: 'id'
		},
		// ??????????????????????????????????????????????????? slot="empty" ??????
		emptyText: String,
		// @TODO ???????????????????????????
		defaultExpandAll: Boolean,
		// ??????????????????????????? Table ????????????????????????????????? row-key ????????????????????????????????????????????? keys ??????
		expandRowKeys: Array,
		// ??????????????????????????????
		showSummary: Boolean,
		// ??????????????????????????????????????????
		showSummaryBottom: Boolean,
		// @TODO ???????????????????????????
		sumText: String,
		// ????????????
		summaryMethod: Function,
		// ??????????????????????????????
		spanMethod: Function,
		// ??????????????????????????????, ????????? ????????????
		selectOnIndeterminate: {
			type: Boolean,
			default: true
		},
		// ?????????????????????????????????
		expandAsync: Function,
		// ?????????????????????????????????????????? ?????? ?????????table????????????
		dragCellKeepTableWidth: Boolean,
		// ?????????????????????table????????????????????????????????????????????????table??????
		overWidthAutofit: Boolean,
		// ?????????????????????Render??????
		expendCellRender: Function,
		// ???????????????????????????Render??????
		collectionCellRender: Function,
		// ???????????????????????????Prop??????
		collectionProp: {
			type: Object,
			default: () => {
				return {
					data: 'collectionData',
					id: 'id'
				}
			}
		}
	},
	data () {
		this.store = createStore(this, {
			rowKey: this.rowKey,
			trHeight: this.trHeight,
			defaultExpandAll: false,
			expandRowConfig: this.expandRows,
			expandRowHeight: this.expandRowHeight,
			selectOnIndeterminate: this.selectOnIndeterminate
		})
		const layout = new TableLayout({
			store: this.store,
			table: this
		})
		return {
			layout,
			data: [],
			viewListTranslateY: 0,
			start: 0,
			end: 0,
			isScrollY: false,
			isScrollX: false,
			resizeProxyVisible: false,
			resizeState: {
				width: null,
				height: null
			},
			scrolling: false,
			tableClientHeight: 0,
			tableClientWidth: 0,
			scrollThrottle: throttle(),
			scrollDebounce: debounce(),
			sumDataDebounce: debounce(),
			isGroup: false,
			sumData: {},
			gutterWidth: scrollbarWidth(),
			rightBodyEl: null,
			rightHeaderEl: null,
			rightBottomEl: null
		}
	},
	computed: {
		...mapStates({
			columnArr: 'columns',
			scrollState: 'scrollState',
			collectionMap: 'collectionMap'
		}),
		visibleCount () {
			return Math.ceil(this.$refs.tbody.getClientHeight() / this.tableTrHeight)
		},
		visibleData () {
			return this.data.slice(this.start, this.end)
		},
		tableTrHeight () {
			return this.trHeight
		},
		tableTrHeightStyle () {
			return `${this.trHeight}px`
		},
		// @TODO
		colRealWidthSum () {
			return this.$fxUtils.toNumber(this.$fxUtils.arrSum(this.getVisivleColumn, item => {
				return item.columnConfig.realWidth
			}))
		},
		colWidthSum () {
			return this.$fxUtils.toNumber(this.$fxUtils.arrSum(this.getVisivleColumn, item => {
				return item.columnConfig.width
			}))
		},
		tableComputedwidth () {
			const tableClientWidth = this.tableClientWidth
			// @TODO
			if (this.phantomListHeight > this.tableClientHeight) {
				// tableClientWidth = tableClientWidth - 17
			}
			return this.colRealWidthSum > tableClientWidth ? this.colRealWidthSum : tableClientWidth
		},
		tableWidth () {
			return `${this.tableComputedwidth}px`
		},
		frozenTableWidth () {
			const width = this.getFrozenColumn.reduce((pre, cur) => {
				return pre + cur.columnConfig.realWidth
			}, 0)
			return `${width}px`
		},
		phantomListHeight () {
			return (this.data.length * this.tableTrHeight) + this.expandRowSumHeight + this.collectionRowSumHeight
		},
		getVisivleColumn () {
			const visibleColumn = this.columnArr.filter(item => {
				return !!item.visiable
			})
			if (visibleColumn.some(item => {
				return !!item.fixed
			})) {
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
				return [...specialCol, ...fixCol, ...unFixCol]
			} else {
				return visibleColumn
			}
		},
		getFrozenColumn () {
			const visibleColumn = this.columnArr.filter(item => {
				return !!item.visiable
			})
			if (visibleColumn.some(item => {
				return !!item.fixed
			})) {
				const specialCol = []
				const fixCol = []
				visibleColumn.forEach(item => {
					if (FIXED_WIDTH_COLUNM.includes(item.type)) {
						specialCol.push(item)
					} else if (item.fixed) {
						fixCol.push(item)
					}
				})
				return [...specialCol, ...fixCol]
			} else {
				return []
			}
		},
		expandRowSumHeight () {
			let rowSum = 0
			const expandRowsLength = this.visibleData.filter(item => {
				if (this.store.isRowExpanded(item)) {
					rowSum += item.dosingDetails.length + 2
				}
				return this.store.isRowExpanded(item)
			}).length
			if (!expandRowsLength) {
				return 0
			}
			return this.expandRowHeight * rowSum
		},
		collectionRowSumHeight () {
			if (typeof this.collectionCellRender === 'function') {
				const collectionRowsLength = this.$fxUtils.arrDedup(this.data.map(item => {
					return item[this.collectionProp.data][this.collectionProp.id]
				})).length
				return collectionRowsLength * this.tableTrHeight
			} else {
				return 0
			}
		},
		gutterHeight () {
			return (this.isScrollX && !this.showSummary) ? 17 : 0
		},
		isBorder () {
			return this.border
		},
		isHeaderBorder () {
			return this.headerBorder
		},
		isEmpty () {
			return !this.tableData || this.tableData.length === 0
		},
		showEmptyScrollBar () {
			return this.isEmpty && (this.colRealWidthSum > this.tableClientWidth)
		}
	},
	watch: {
		phantomListHeight (newVal, oldVal) {
			this.$nextTick(() => {
				const tableOffsetHeight = this.$refs.tbody.$el.offsetHeight
				if ((newVal > tableOffsetHeight || oldVal > tableOffsetHeight) && (newVal < tableOffsetHeight || oldVal < tableOffsetHeight)) {
					this.doLayout()
				}
			})
		},
		data: {
			immediate: true,
			handler (value) {
				this.store.commit('setData', value)
			}
		},
		tableData: {
			immediate: true,
			handler (value, oldValue) {
				this.data = this.initTableData(value)
				this.$nextTick(() => {
					const tbody = this.$refs.tbody.$el
					const { scrollTop } = tbody
					this.updateVisibleData(scrollTop)
				})
			}
		},
		expandRowKeys: {
			immediate: true,
			handler (newVal) {
				this.store.setRowExpanded(newVal)
				this.$nextTick(() => {
					const tbody = this.$refs.tbody.$el
					const { scrollTop } = tbody
					this.updateVisibleData(scrollTop)
				})
			}
		}
	},
	created () {
		this.tableId = 'fx-table_' + tableIdSeed++
		this.$watch('data', {
			handler: (val) => {
				this.sumDataDebounce(500, false).then(() => {
					this.sumData = this.getSumData(val)
				})
			},
			deep: true,
			immediate: true
		})
	},
	mounted () {
		this.bindEvents()
		this.doLayout()
		this.resizeState = {
			width: this.$el.offsetWidth,
			height: this.$el.offsetHeight
		}
		this.$ready = true
	},
	destroyed () {
		this.unbindEvents()
	},
	methods: {
		initGrid (data = []) {
			this.data = this.initTableData(data)
			this.$nextTick(() => {
				this.updateVisibleData()
				this.doScrollTop()
			})
		},
		doLayout ({ columnWidthInit } = {}) {
			this.updateScrollY()
			this.updateScrollX()
			this.tableClientHeight = this.$refs.tbody && this.$refs.tbody.$el.clientHeight
			this.tableClientWidth = this.$refs.tbody && this.$refs.tbody.$el.clientWidth
			this.updateColumnRealWidth({ columnWidthInit })
			this.getScrollLeft()
		},
		updateScrollY () {
			this.$nextTick(() => {
				this.isScrollY = this.phantomListHeight > this.$refs.tbody.$el.clientHeight
			})
		},
		updateScrollX () {
			this.$nextTick(() => {
				this.isScrollX = this.colRealWidthSum > this.$refs.tbody.$el.clientWidth
			})
		},
		updateColumnRealWidth ({ columnWidthInit }) {
			if (this.colWidthSum <= this.$refs.tbody.$el.clientWidth || (this.overWidthAutofit && this.colWidthSum > this.$refs.tbody.$el.clientWidth) || this.colWidthSum === this.$refs.tbody.$el.clientWidth + this.gutterWidth) {
				const columnArr = this.columnArr.filter(item => {
					return !FIXED_WIDTH_COLUNM.includes(item.type)
				})
				const contentColWidth = this.$refs.tbody.$el.clientWidth
				const diffValue = contentColWidth - this.colWidthSum
				const diffWidth = parseInt(diffValue / columnArr.length, 10)
				const firstDiffWidth = diffValue - (diffWidth * (columnArr.length - 1))
				const firstColIndex = this.columnArr.filter(colItem => {
					return FIXED_WIDTH_COLUNM.includes(colItem.type)
				}).length
				this.columnArr.forEach((item, index) => {
					if (firstColIndex === index) {
						item.columnConfig.realWidth = item.columnConfig.width + firstDiffWidth
					} else if (!FIXED_WIDTH_COLUNM.includes(item.type)) {
						item.columnConfig.realWidth = item.columnConfig.width + diffWidth
					}
				})
			} else if (columnWidthInit) {
				this.columnArr.forEach((item, index) => {
					item.columnConfig.realWidth = item.columnConfig.width
				})
			}
		},
		doScrollTop () {
			this.$nextTick(() => {
				this.$refs.tbody.initScrollTop()
			})
		},
		doScrollLeft (macro = false) {
			return new Promise(resolve => {
				this.$nextTick(() => {
					this.$refs.tbody.initScrollLeft().then(() => {
						if (!macro) {
							resolve()
						} else {
							setTimeout(resolve, 100)
						}
					})
				})
			})
		},
		initTableData (tableData) {
			const collectionMap = {}
			const collectionMapData = {}
			tableData.forEach((item, index) => {
				item.$fxIndex = index
				if (typeof this.collectionCellRender === 'function') {
					const collectionData = item[this.collectionProp.data]
					const collectionId = collectionData[this.collectionProp.id]
					if (!collectionMap[collectionId]) {
						collectionMap[collectionId] = [item.id]
						collectionMapData[collectionId] = collectionData
					} else {
						if (!~collectionMap[collectionId].indexOf(item.id)) {
							collectionMap[collectionId].push(item.id)
							item[this.collectionProp.data] = collectionMapData[collectionId]
						}
					}
				}
			})
			this.store.commit('setCollectionMap', collectionMap)
			return tableData
		},
		getSumData (data) {
			let newSumData = {}
			if (typeof this.summaryMethod === 'function') {
				const columns = this.columnArr.filter(item => !!item.prop)
				newSumData = this.summaryMethod({ columns, data })
			}
			return newSumData
		},
		bindEvents () {
			this.rightBodyEl = this.$el.querySelector('.right-body')
			this.rightHeaderEl = this.$el.querySelector('.right-header')
			this.rightBottomEl = this.$el.querySelector('.right-bottom')
			beforeScrollTop = 0
			this.rightBodyEl.addEventListener('scroll', this.bodyHandleScroll, { passive: true })
			this.rightHeaderEl.addEventListener('scroll', this.headerHandleScroll, { passive: true })
			if (this.rightBottomEl) {
				this.rightBottomEl.addEventListener('scroll', this.bottomHandleScroll, { passive: true })
			}
			if (this.$refs.emptyView) {
				this.$refs.emptyView.addEventListener('scroll', this.bodyHandleScroll, { passive: true })
			}
			if (this.fit) {
				addResizeListener(this.$el, this.resizeListener)
			}
		},
		unbindEvents () {
			this.rightBodyEl.removeEventListener('scroll', this.bodyHandleScroll, { passive: true })
			this.rightHeaderEl.removeEventListener('scroll', this.headerHandleScroll, { passive: true })
			if (this.rightBottomEl) {
				this.rightBottomEl.removeEventListener('scroll', this.bottomHandleScroll, { passive: true })
			}
			if (this.$refs.emptyView) {
				this.$refs.emptyView.removeEventListener('scroll', this.bodyHandleScroll, { passive: true })
			}
			if (this.fit) {
				removeResizeListener(this.$el, this.resizeListener)
			}
		},
		resizeListener () {
			if (!this.$ready) return
			const el = this.$el
			const { width: oldWidth, height: oldHeight } = this.resizeState
			const width = el.offsetWidth
			const height = el.offsetHeight
			if (oldWidth !== width || oldHeight !== height) {
				this.doLayout()
			}
		},
		bodyHandleScroll (e) {
			this.scrolling = true
			this.scrollThrottle(15, true).then(() => {
				this.$emit('on-scroll', e)
				const leftBody = this.$el.querySelector('.left-body')
				const { headRight, bottomRight } = this.$refs
				const ele = e.srcElement || e.target
				const { scrollTop, scrollLeft } = ele
				if (scrollTop !== beforeScrollTop) {
					leftBody.scrollTop = scrollTop
					beforeScrollTop = scrollTop
					if (this.virtual) {
						this.updateVisibleData(scrollTop)
					}
				}
				headRight.$el.scrollLeft = scrollLeft
				if (bottomRight) {
					bottomRight.$el.scrollLeft = scrollLeft
				}
				beforeScrollLeft = scrollLeft
				this.getScrollLeft()
			})
		},
		headerHandleScroll (e) {
			this.scrolling = true
			this.scrollThrottle(15, true).then(() => {
				this.$emit('on-scroll', e)
				const { bottomRight, tbody } = this.$refs
				const ele = e.srcElement || e.target
				const { scrollLeft } = ele
				if (scrollLeft !== beforeScrollLeft) {
					if (bottomRight) {
						bottomRight.$el.scrollLeft = scrollLeft
					}
					if (tbody) {
						tbody.$el.scrollLeft = scrollLeft
					}
					beforeScrollLeft = scrollLeft
					this.getScrollLeft()
				}
			})
		},
		bottomHandleScroll (e) {
			this.scrolling = true
			this.scrollThrottle(15, true).then(() => {
				this.$emit('on-scroll', e)
				const { headRight, tbody } = this.$refs
				const ele = e.srcElement || e.target
				const { scrollLeft } = ele
				if (scrollLeft !== beforeScrollLeft) {
					if (headRight) {
						headRight.$el.scrollLeft = scrollLeft
					}
					if (tbody) {
						tbody.$el.scrollLeft = scrollLeft
					}
					beforeScrollLeft = scrollLeft
					this.getScrollLeft()
				}
			})
		},
		updateVisibleData (scrollTop = 0) {
			this.scrollDebounce(100, !this.scrolling, true).then(() => {
				const startIndex = this.getStartIndex(scrollTop)
				const { start, end } = this.getVisibleRange(startIndex)
				this.viewListTranslateY = this.getViewTranslateY(start, end)
				this.start = start
				this.end = end
				this.$nextTick(() => {
					this.scrolling = false
				})
			})
		},
		getScrollLeft () {
			const { scrollWidth, scrollLeft, clientWidth } = this.$refs.tbody.$el
			let scrollState = ''
			if (scrollLeft === 0) {
				scrollState = 'scroll-left'
			} else if ((scrollLeft + clientWidth) < scrollWidth) {
				scrollState = 'scroll-center'
			} else {
				scrollState = 'scroll-right'
			}
			this.store.commit('setScrollState', scrollState)
		},
		getStartIndex (scrollTop) {
			const detailsLength = this.expandRows.filter(item => {
				return !!item.visible
			}).length
			const expandHeight = detailsLength * this.expandRowHeight
			const isCollectionTitle = this.collectionMapHandler()
			let height = 0
			for (let i = 0; i < this.data.length; i++) {
				const _expandHeight = this.store.isRowExpanded(this.data[i]) ? expandHeight : 0
				let _collectionHeight = 0
				if (typeof this.collectionCellRender === 'function' && isCollectionTitle(this.data[i][this.collectionProp.data][this.collectionProp.id])) {
					_collectionHeight = this.tableTrHeight
				}
				height += this.tableTrHeight + _expandHeight + _collectionHeight
				if (height > scrollTop) {
					return i
				}
			}
			return 0
		},
		collectionMapHandler () {
			const collectionMap = {}
			return (id) => {
				if (!collectionMap[id]) {
					collectionMap[id] = true
					return true
				}
				return false
			}
		},
		getViewTranslateY (start, end) {
			if (end === this.data.length) {
				const diffStart = this.data.length - end + start
				return this.getHeightByRowIndex(diffStart - 1)
			}
			return this.getHeightByRowIndex(start - 1)
		},
		getVisibleRange (startIndex) {
			const visibleCount = this.getVisibleCount()
			const start = startIndex - this.bufferRow
			const end = startIndex + visibleCount + this.bufferRow
			return {
				start: start >= 0 ? start : 0,
				end: end > this.data.length ? this.data.length : end
			}
		},
		onCellClick (item, index) {
			this.$emit('on-cell-click', item, index)
		},
		onSortHandler (item) {
			const _sortType = item.getSort()
			let sortIndex = SORT_TYPE.findIndex(type => {
				return type === _sortType
			})
			sortIndex = sortIndex === SORT_TYPE.length - 1 ? 0 : sortIndex + 1
			this.refreshSortType()
			item.setSort(SORT_TYPE[sortIndex])
			this.$emit('sort-change', { item, prop: item.prop, order: item.getSort() })
		},
		refreshSortType () {
			this.columnArr.forEach(item => {
				item.setSort(SORT_TYPE[0])
			})
		},
		clearSelection () {
			this.store.clearSelection()
		},
		clearSubSelection () {
			this.store.clearSubSelection()
		},
		clearCurrentSelection (rowId) {
			this.store.clearCurrentSelection(rowId)
		},
		onlyToggleRowSelection (row, selected) {
			this.store.toggleRowSelection(row, selected, false)
		},
		onlyUpdateAllSelected () {
			this.store.updateAllSelected()
		},
		toggleRowSelection (row, selected) {
			this.store.toggleRowSelection(row, selected, false)
			this.store.updateAllSelected()
		},
		toggleAllSelection () {
			this.store.toggleAllSelection()
		},
		radioSelection (row) {
			this.store.radioSelection(row, false)
		},
		scrollToIndex (index) {
			return new Promise(resolve => {
				const { start, end } = this.getVisibleRange(index + 1)
				const beforeHeight = this.getHeightByRowIndex(index - 1)
				const maxScrollTop = this.$refs.tbody.$el.scrollHeight - this.$refs.tbody.$el.clientHeight
				const scrollTop = beforeHeight > maxScrollTop ? maxScrollTop : beforeHeight
				this.$refs.tbody.$el.scrollTop = scrollTop
				this.$refs.tbody_left.$el.scrollTop = scrollTop
				beforeScrollTop = scrollTop
				this.viewListTranslateY = this.getViewTranslateY(start, end)
				this.start = start
				this.end = end
				setTimeout(() => {
					resolve()
				}, 100)
			})
		},
		getHeightByRowIndex (rowIndex) {
			if (rowIndex <= 0) {
				return 0
			}
			const detailsLength = this.expandRows.filter(item => {
				return !!item.visible
			}).length
			const expandHeight = detailsLength * this.expandRowHeight
			let height = 0
			const isCollectionTitle = this.collectionMapHandler()
			for (let i = 0; i < this.data.length; i++) {
				let _collectionHeight = 0
				if (typeof this.collectionCellRender === 'function' && isCollectionTitle(this.data[i][this.collectionProp.data][this.collectionProp.id])) {
					_collectionHeight = this.tableTrHeight
				}
				height += this.tableTrHeight + (this.store.isRowExpanded(this.data[i]) ? expandHeight : 0) + _collectionHeight
				if (i === rowIndex) {
					return height
				}
			}
		},
		isRenderedRow (rowIndex) {
			return !!this.$refs.tbody.$el.querySelector(`.${TABLE_NAME}__tr-${rowIndex}`)
		},
		isRowInView (rowIndex) {
			const tbody = this.$refs.tbody.$el
			const row = tbody.querySelector(`.${TABLE_NAME}__tr-${rowIndex}`)
			return isInView(row, tbody)
		},
		getVisibleCount () {
			return this.virtual ? Math.ceil(this.$refs.tbody.getClientHeight() / this.tableTrHeight) : this.tableData.length
		},
		getVisibleColumns () {
			return this.columnArr.filter(item => {
				return item.visiable && !FIXED_WIDTH_COLUNM.includes(item.type)
			}).map(item => {
				return {
					id: item.columnConfig.id,
					prop: item.prop,
					width: item.columnConfig.realWidth,
					label: item.label
				}
			})
		},
		getCollectionMap () {
			return this.collectionMap
		},
		isRowExpanded (row) {
			return this.store.isRowExpanded(row)
		}
	}
}
</script>
<style lang="stylus">
</style>
