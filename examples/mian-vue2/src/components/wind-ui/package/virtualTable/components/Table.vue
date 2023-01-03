<template>
	<div ref="table" class="wind-virtual-table" :class="[{
		'wind-virtual-table__fit': fit,
		'wind-virtual-table__border': isBorder
	}, `${scrollState}`]">
		<div class="wind-virtual-table__hidden-columns" ref="hiddenColumns"><slot></slot></div>
		<div
			v-show="getFrozenColumn.length !== 0"
			:style="{width: `${frozenTableWidth}px`, 'bottom': `${gutterHeight}px`}"
			class="wind-virtual-table__left"
		>
			<Wind-virtual-header
				ref="headLeft"
				:store="store"
				:columnArr="getFrozenColumn"
				:height="tableTrHeightStyle"
				:width="frozenTableWidth"
				fixedTable
				@on-sort="onSortHandler"
			></Wind-virtual-header>
			<Wind-virtual-tbody
				ref="tbody_left"
				:store="store"
				:visibleData="visibleData"
				:columnData="getFrozenColumn"
				:width="frozenTableWidth + 'px'"
				:height="phantomListHeight"
				:viewListTranslateY="viewListTranslateY"
				fixedTable
				class="left-body"
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
				@on-column-width-change="onColumnWidthChange"
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
 * @desc 虚拟渲染表格
 * @param {sort}  [Boolean] - 是否开启排序功能
 * @param {bufferRow}  [Number] - 缓冲行
 * @param {trHeight}  [Number] - 行高度
 * @param {overWidthAutofit}  [Boolean] - 当列的宽度超出table的宽度是否自动适应列的宽度已匹配table宽度
 * @param {expendCellRender}  [Function] - 详情单元格Render函数
 * @param {collectionCellRender}  [Function] - 集合类型标题单元格Render函数
 * @param {collectionProp}  [Object] - 集合类型标题单元格Prop设置

 * @event {select} [selection, row] - 当用户手动勾选数据行的 Checkbox 时触发的事件
 * @event {select-all} [selection] - 当用户手动勾选全选 Checkbox 时触发的事件
 * @event {selection-change} [selection] - 当选择项发生变化时会触发该事件
 * @event {row-click} [row, column, index, event] - 行点击
 * @event {row-dblclick} [row, column, index, event] - 行双击
 * @event {cell-click} [row, column, cell, event] - 单元格单击
 * @event {sort-change} [{ column, prop, order }] - 当表格的排序条件发生变化的时候会触发该事件

 * @methods {clearSelection} [] - 用于多选表格，清空用户的选择
 * @methods {toggleRowSelection} [row, selected] - 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
 * @methods {expandAsync} [rowItem, rowIndex] - 打开单条明细的异步方法
 * @methods {isRowExpanded} [row] - 判断当前row是否展开了(参数为string 或者 object , 当为object时, 自动获取其中的唯一key进行比较)
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
		// 表格显示的数据
		tableData: {
			type: Array,
			default: () => {
				return []
			}
		},
		// 是否开启虚拟渲染
		virtual: {
			type: Boolean,
			default: true
		},
		// 缓冲行
		bufferRow: {
			type: Number,
			default: 25
		},
		// 行高
		trHeight: {
			type: Number,
			default: 35
		},
		// 展开行
		expandRows: {
			type: Array,
			default: () => {
				return []
			}
		},
		// 展开行高
		expandRowHeight: {
			type: Number,
			default: 35
		},
		// 是否为斑马纹table
		stripe: {
			type: Boolean,
			default: true
		},
		// 是否带有纵向边框
		border: Boolean,
		// 表头是否带有纵向边框
		headerBorder: {
			type: Boolean,
			default: true
		},
		// 列的宽度是否自撑开
		fit: {
			type: Boolean,
			default: true
		},
		// @TODO 是否显示表头
		showHeader: {
			type: Boolean,
			default: true
		},
		// 是否要高亮当前行
		highlightCurrentRow: {
			type: Boolean,
			default: true
		},
		// 行的 className
		rowClassName: [Function, String],
		// 行的 style 的回调方法
		rowStyle: Function,
		// 单元格的 className 的回调方法
		cellClassName: [Function, String],
		// 单元格的 style 的回调方法
		cellStyle: [Function, String],
		// @TODO 表头行的 className 的回调方法
		headerRowClassName: [Function, String],
		// @TODO 表头行的 style 的回调方法
		headerRowStyle: [Function, String],
		// @TODO 表头单元格的 className 的回调方法
		headerCellClassName: [Function, String],
		// 当前行的 key，只写属性
		rowKey: {
			type: [String, Number],
			default: 'id'
		},
		// 空数据时显示的文本内容，也可以通过 slot="empty" 设置
		emptyText: String,
		// @TODO 是否默认展开所有行
		defaultExpandAll: Boolean,
		// 可以通过该属性设置 Table 目前的展开行，需要设置 row-key 属性才能使用，该属性为展开行的 keys 数组
		expandRowKeys: Array,
		// 是否在表尾显示合计行
		showSummary: Boolean,
		// @TODO 合计行第一列的文本
		sumText: String,
		// 合计方法
		summaryMethod: Function,
		// 合并行或列的计算方法
		spanMethod: Function,
		// 全选当处于半选点击后, 是取消 还是全选
		selectOnIndeterminate: {
			type: Boolean,
			default: true
		},
		// 打开单条详情的异步方法
		expandAsync: Function,
		// 拖动单元格边框改变单元格大小 是否 总保持table固定宽度
		dragCellKeepTableWidth: Boolean,
		// 当列的宽度超出table的宽度是否自动适应列的宽度已匹配table宽度
		overWidthAutofit: Boolean,
		// 展开详情单元格Render函数
		expendCellRender: Function,
		// 集合类型标题单元格Render函数
		collectionCellRender: Function,
		// 集合类型标题单元格Prop设置
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
			return this.getFrozenColumn.reduce((pre, cur) => {
				return pre + cur.columnConfig.realWidth
			}, 0)
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
			const expandRowsLength = this.data.filter(item => {
				return this.store.isRowExpanded(item)
			}).length
			if (!expandRowsLength) {
				return 0
			}
			const detailsLength = this.expandRows.filter(item => {
				return !!item.visible
			}).length
			return detailsLength * this.expandRowHeight * expandRowsLength
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
					const { scrollTop, scrollLeft } = tbody
					beforeScrollLeft = scrollLeft
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
			if (!this.fit) return
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
					this.$refs.tbody.initScrollLeft()
						.then(this.$refs.headRight.initScrollLeft)
						.then(() => {
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
			beforeScrollLeft = 0
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
			if ((oldWidth !== width || oldHeight !== height) && width && height) {
				this.setResizeState(width, height)
				this.doLayout()
			}
		},
		setResizeState (width, height) {
			if (this.$fxUtils.isDef(width)) {
				this.resizeState.width = width
			}
			if (this.$fxUtils.isDef(height)) {
				this.resizeState.width = height
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
				if (scrollLeft !== beforeScrollLeft) {
					headRight.$el.scrollLeft = scrollLeft
					if (bottomRight) {
						bottomRight.$el.scrollLeft = scrollLeft
					}
					beforeScrollLeft = scrollLeft
					this.getScrollLeft()
				}
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
			return isInView(row, tbody, this.viewListTranslateY)
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
					label: item.label,
					attrs: item.$attrs.item,
					level: item.level,
					rowSpan: item.rowSpan,
					isSubColumn: item.isSubColumn,
					diagonal: item.diagonal,
					columnOrTableParent: item.isSubColumn ? item.columnOrTableParent : null
				}
			})
		},
		getCollectionMap () {
			return this.collectionMap
		},
		isRowExpanded (row) {
			return this.store.isRowExpanded(row)
		},
		onColumnWidthChange () {
			this.$emit('on-column-width-change')
		}
	}
}
</script>
<style lang="stylus">
@import '../style/style.styl'
</style>
