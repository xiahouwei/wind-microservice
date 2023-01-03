<template>
	<div class="organ-list" :style="listStyle">
		<div v-if="showTools" class="organ-list__top">
			<div class="organ-list__top-left" v-if="selectable">
				<div class="count-selected">已选：{{selectTotalComputed}} / {{total}}条</div>
			</div>
			<div class="organ-list__top-right">
				<slot name='btn-tools-left'>
					<div class="btn-tools-left"></div>
				</slot>
				<w-popover placement="bottom" trigger="click" class='table-column-fiter-btn__container'>
					<div class="organ-list_column-filter-item">
						<el-checkbox :value="isSelectAll" label="全选" @change="onColmunFilterSelectAll"></el-checkbox>
					</div>
					<div v-for="(item, index) in columnFilterArr" :key="index" class="organ-list_column-filter-item">
						<el-checkbox
							v-model="item.visible"
							:label="item.label"
							:disabled="item.required || item.type==='arrow'"
						></el-checkbox>
					</div>
					<w-icon
						v-show="showColumnFilterBtn"
						slot="reference"
						type="tabel-column-filter"
						class="table-column-fiter-btn"
						pointer
					></w-icon>
				</w-popover>
				<slot name='btn-tools-right'></slot>
			</div>
		</div>
		<div class="organ-list__container">
			<w-virtual-table
				ref="organTable"
				v-loading="loading"
				:virtual="virtual"
				:tableData="listData"
				:expand-row-keys="expandRowKeys"
				:expandRows="currentExpandRows"
				:span-method="spanMergeHandler"
				:border="border"
				:row-key='primaryKey'
				height="100%"
				:class="tableClasses"
				:expandAsync="fpExpandAsync"
				:dragCellKeepTableWidth="dragCellKeepTableWidth"
				:stripe="stripe"
				:highlightCurrentRow="highlightCurrentRow"
				:overWidthAutofit="overWidthAutofit"
				:row-class-name="rowClassName"
				:row-style="rowStyle"
				:cell-class-name="cellClassName"
				:cell-style="cellStyle"
				:expendCellRender="indexCellRender"
				:collectionCellRender="collectionCellRender"
				:collectionProp="collectionProp"
				:showSummary="showSummary"
				:summaryMethod="summaryMethod"
				:emptyText="emptyText"
				class="organ-table"
				@select="onTableRowSelect"
				@select-all="onTableRowSelect"
				@select-collection="onTableRowSelect"
				@row-click="onTableRowClick"
				@row-dblclick="onTableRowDbclick"
				@cell-click="onCellClick"
				@sort-change="onSortChange"
			>
				<w-virtual-table-column
					v-if="selectable"
					type="selection"
					:radio="!selectMulity"
					reserve-selection
					:fixed="selectAndIndexFixed"
					:selectable="selectableHandler"
					class-name="table-selection"
				>
				</w-virtual-table-column>
				<w-virtual-table-column v-if="expandRows.length>0" :fixed="selectAndIndexFixed" type="expand" :index="computedIndex" label="序号">
				</w-virtual-table-column>
				<w-virtual-table-column v-else-if="showIndex" :fixed="selectAndIndexFixed" type="index" :index="computedIndex" label="序号">
				</w-virtual-table-column>
				<template v-for="item in currentTableColumn">
					<fx-list-virtual-table-column
						v-if="item.visible"
						:key="item.prop"
						:item="item"
					></fx-list-virtual-table-column>
				</template>
				<div v-if="$slots.empty" slot="empty" class="list-tabel-empty">
					<slot name="empty"></slot>
				</div>
			</w-virtual-table>
		</div>
		<div v-if="showPagination||showSummaryTools" class="organ-list__bottom">
			<div v-if ="showSummaryTools" class="table-sum">
				<fx-list-table-summary
					:columns="summaryColumns"
					:summaryData="summaryData"
					:selectSummaryData="selectSummaryData"
				></fx-list-table-summary>
			</div>
			<div v-if="showPagination" class="table-pagination">
				<w-pagination
					ref="pagination"
					:total="total"
					@on-size-change="onSizeChange"
					@on-current-change="onCurrentChange"
				></w-pagination>
			</div>
		</div>
	</div>
</template>
<script>
/**
 * fx-list-table by shang 2020/12/4
 * @desc fx-list-table 表格

 * @param {Boolean}  virtual - 是否开启虚拟渲染
 * @param {Array}  tableColumn - 列模型

 * @param {String} tableColumn.prop -列的key
 * @param {Boolean} tableColumn.visible -列的显示
 * @param {String} tableColumn.label -列头文本
 * @param {String} tableColumn.width -列宽度
 * @param {String} tableColumn.align -列对齐方式
 * @param {String} tableColumn.headerAlign -列header对齐方式
 * @param {Boolean} tableColumn.fixed -列固定列
 * @param {Boolean} tableColumn.required -必选列
 * @param {Boolean} tableColumn.sortable -可排序列
 * @param {String} tableColumn.sortKey -需要排序的列字段名，默认为列prop
 * @param {Boolean} tableColumn.editColumn -可编辑列, hover时, 可编辑列会显示虚线
 * @param {Function} tableColumn.fxRender -render渲染
 * @param {Function} tableColumn.click -列点击回调
 * @param {String} tableColumn.rowMerge -合并单元格-row合并字段
 * @param {Boolean} tableColumn.summary -合计此列
 * @param {Boolean} tableColumn.summaryFormatter -列的所有数据进行合计计算后的格式化方法, 参数为val
 * @param {Boolean} tableColumn.summaryHandler -列的每一个数据的格式化方法, 参数为val, row

 * @param {Array} tableValiDate - 校验设置
 * @param {String} tableValiDate.columnProp - 校验列key
 * @param {Function} tableValiDate.rule - 校验列规则

 * @param {Array} tableEditColumnProp - 可编辑列
 * @param {Array} tableExpandEditColumnProp - 可编辑列<展开行>
 * @param {Array} tableEditEnterColumnProp - 可编辑列<在这些列按Enter键直接触发换行>
 * @param {Array} listData - 表格数据
 * @param {Boolean} showPagination - 是否显示分页控件
 * @param {String} minWidth - table最小宽度
 * @param {String} minHeight - table最小高度
 * @param {String, Number} listTotal - 数据总计
 * @param {Boolean} selectTotalGlobal - 已选数据总计计算所有数据, 包括当前不显示但是已选择的数据, 默认true
 * @param {Boolean} selectable - 可选择
 * @param {Boolean} selectMulity - 是否多选
 * @param {Array} selectedRows - 默认选中数据
 * @param {Boolean} showColumnFilterBtn - 开启列显示/隐藏控件
 * @param {Boolean} showIndex - 显示索引
 * @param {Boolean} loading - 显示加载中...
 * @param {Array} expandRows - 展开行
 * @param {Boolean} border - 开启边框
 * @param {Boolean} showTools - 开启table操作栏
 * @param {Function}  fpExpandAsync - 打开单条详情的异步方法
 * @param {Boolean}  dragCellKeepTableWidth - 拖动单元格边框改变单元格大小 是否 总保持table固定宽度
 * @param {Boolean}  stripe - 是否为斑马纹table
 * @param {Boolean}  overWidthAutofit - 当列的宽度超出table的宽度是否自动适应列的宽度已匹配table宽度
 * @param {Function} indexCellRender - 索引(详情)单元格Render函数
 * @param {Function} collectionCellRender - 集合类型标题单元格Render函数
 * @param {Object}  collectionProp - 集合类型标题单元格Prop设置
 * @param {Array}  collectionValiDate - 集合row校验
 * @param {Boolean} showSummary - 显示合计
 * @param {Function}  summaryMethod - 合计方法
 * @param {Boolean} showSummaryTools - 显示合计工具按钮
 * @param {Object} summaryData - 全部合计数据
 * @param {Object} defaultSortParam - 默认排序参数
 * @param {Boolean} selectAndIndexFixed - 默认固定多选框列、单选框列、详情按钮列和序号列
 * @param {Boolean} indexContinuous - 是否开启分页连续序号，默认不开启
 * @param {Function} fpGetListData - 获取list数据方法
 * @param {String} emptyText - 空数据时显示的文本内容，也可以通过 slot="empty" 设置

 * @event {on-select} {selectType, selectFlag, selectMulity, selecteds, row, radioValue, selectedArr, selectedRowArr} - 当用户手动勾选数据行的 Checkbox 时触发的事件
	selectType 类型: alone 单独  all 全部
	selectFlag 是否选中
	selectMulity 当前是否为多选
	row 当前选择的row
	radioValue 单选当前的值
	selectedArr 选择后所有id的集合
	selectedRowArr 选择后所有row的集合
 */
const DEFAULT_TABLE_MIN_WIDTH = '500px'
const DEFAULT_TABLE_MIN_HEIGHT = '300px'
const DEFAULT_COL_WIDTH = '120'
const DEFAULT_COL_ALIGN = 'left'
export default {
	name: 'fx-list-table',
	props: {
		// 是否开启虚拟渲染
		virtual: {
			type: Boolean,
			default: true
		},
		tableColumn: {
			type: Array,
			default: () => {
				return []
			}
		},
		tableValiDate: {
			type: Array,
			default: () => {
				return []
			}
		},
		tableEditColumnProp: {
			type: Array,
			default: () => {
				return []
			}
		},
		tableExpandEditColumnProp: {
			type: Array,
			default: () => {
				return []
			}
		},
		tableEditEnterColumnProp: {
			type: Array,
			default: () => {
				return []
			}
		},
		listData: {
			type: Array,
			default: () => {
				return []
			}
		},
		showPagination: {
			type: Boolean,
			default: true
		},
		minWidth: {
			type: String,
			default: DEFAULT_TABLE_MIN_WIDTH
		},
		minHeight: {
			type: String,
			default: DEFAULT_TABLE_MIN_HEIGHT
		},
		listTotal: [String, Number],
		selectTotalGlobal: {
			type: Boolean,
			default: true
		},
		selectable: {
			type: Boolean,
			default: true
		},
		selectableHandler: {
			type: Function,
			default: null
		},
		selectMulity: {
			type: Boolean,
			default: true
		},
		selectedRows: {
			type: Array,
			default: () => {
				return []
			}
		},
		showColumnFilterBtn: {
			type: Boolean,
			default: true
		},
		showIndex: Boolean,
		loading: Boolean,
		expandRows: {
			type: Array,
			default: () => {
				return []
			}
		},
		// 是否带有纵向边框
		border: Boolean,
		showTools: {
			type: Boolean,
			default: true
		},
		// 打开单条详情的异步方法
		fpExpandAsync: Function,
		// 拖动单元格边框改变单元格大小 是否 总保持table固定宽度
		dragCellKeepTableWidth: Boolean,
		// 是否为斑马纹table
		stripe: {
			type: Boolean,
			default: true
		},
		// 是否要高亮当前行
		highlightCurrentRow: {
			type: Boolean,
			default: true
		},
		// 当列的宽度超出table的宽度是否自动适应列的宽度已匹配table宽度
		overWidthAutofit: Boolean,
		// 行的 className
		rowClassName: [Function, String],
		// 行的 style 的回调方法
		rowStyle: Function,
		// 单元格的 className 的回调方法
		cellClassName: [Function, String],
		// 单元格的 style 的回调方法
		cellStyle: [Function, String],
		// 索引(详情)单元格Render函数
		indexCellRender: Function,
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
		},
		// 集合row校验
		collectionValiDate: Array,
		// 显示合计
		showSummary: Boolean,
		// 合计方法
		summaryMethod: Function,
		showSummaryTools: Boolean,
		// 全部合计数据
		summaryData: {
			type: Object,
			default: () => {
				return {}
			}
		},
		// 默认筛选参数
		defaultSortParam: {
			type: Object,
			default: null
		},
		// 默认固定多选框列、单选框列、详情按钮列和序号列
		selectAndIndexFixed: {
			type: Boolean,
			default: true
		},
		// 是否开启分页连续序号
		indexContinuous: Boolean,
		// 获取list数据方法
		fpGetListData: Function,
		// 空数据时显示的文本内容，也可以通过 slot="empty" 设置
		emptyText: {
			type: String,
			default: '暂无数据'
		},
		primaryKey: {
			type: String,
			default: 'id'
		}
	},
	provide () {
		return {
			tableEventBus: this.tableEventBus
		}
	},
	data () {
		return {
			tableEventBus: this.$fxCreateEventBus(),
			currentTableColumn: [],
			currentExpandRows: [],
			total: 0,
			selectedArr: [],
			selectedRowArr: [],
			sortParams: null,
			expandRowKeys: [],
			compareArrayUtils: this.$fxUtils.compareArrayUtils(),
			selectRenderFlag: false,
			selectRenderDebounce: this.$fxUtils.debounce(),
			currentDbclickRow: {}
		}
	},
	computed: {
		listStyle () {
			return { 'min-width': this.minWidth, 'min-height': this.minHeight }
		},
		isSelectAll () {
			return this.columnFilterArr.every(item => {
				return !!item.visible
			})
		},
		tableClasses () {
			return {
				'no-bord': !this.border
			}
		},
		columnFilterArr () {
			return [
				...this.currentTableColumn,
				...this.currentExpandRows
			]
		},
		summaryColumns () {
			return this.tableColumn.filter(item => !!item.summary)
		},
		selectSummaryData () {
			if (!this.showSummaryTools) {
				return {}
			}
			const sumData = {}
			if (this.selectedRowArr.length > 0) {
				this.selectedRowArr.forEach((row, rowIndex) => {
					this.summaryColumns.forEach(item => {
						const propVal = this.$fxUtils.getObjDeepValue(row, item.prop)
						const val = typeof item.summaryHandler === 'function' ? item.summaryHandler(propVal, row) : this.$fxUtils.toNumber(propVal)
						const sumVal = this.$fxUtils.toNumber(sumData[item.prop]) + val
						if (rowIndex === this.selectedRowArr.length - 1 && typeof item.summaryFormatter === 'function') {
							sumData[item.prop] = item.summaryFormatter(sumVal, item.prop, item)
						} else {
							sumData[item.prop] = sumVal
						}
					})
				})
			} else {
				this.summaryColumns.forEach(item => {
					if (typeof item.summaryFormatter === 'function') {
						sumData[item.prop] = item.summaryFormatter(0, item.prop, item)
					} else {
						sumData[item.prop] = 0
					}
				})
			}
			return sumData
		},
		selectTotalComputed () {
			if (this.selectTotalGlobal) {
				return this.selectedArr.length
			} else {
				const listDataCompareArrayUtils = this.$fxUtils.compareArrayUtils(this.listData, {
					key: this.primaryKey
				})
				return this.selectedRowArr.filter(item => {
					return listDataCompareArrayUtils.has(item[this.primaryKey])
				}).length
			}
		},
		computedIndex () {
			return this.indexContinuous ? this.indexFormatter : 1
		},
		currentTableColumnFlatten () {
			return this.$fxUtils.arrFlatten(this.currentTableColumn, item => {
				return item.child
			})
		}
	},
	created () {
		this.tableEventBus.initEvent(this, '$fx-list-cell-selected', this.onListCellSelected)
		this.tableEventBus.initEvent(this, '$fx-list-cell-enter', this.onListCellEnter)
		this.tableEventBus.initEvent(this, '$fx-list-cell-up', this.onListCellUp)
		this.tableEventBus.initEvent(this, '$fx-list-cell-down', this.onListCellDown)
		this.tableEventBus.initEvent(this, '$fx-list-cell-tab', this.onListCellTab)
		this.setDefaultSortParam()
	},
	watch: {
		selectedRows: {
			immediate: true,
			handler (val) {
				this.selectRenderFlag = true
				this.selectedArr = val.map(item => {
					return item[this.primaryKey]
				})
				this.selectedRowArr = val
				this.updateSelectRender(val)
			}
		},
		listData: {
			immediate: true,
			handler (listData) {
				if (this.selectable) {
					this.$nextTick(() => {
						this.renderSelect()
						this.selectRenderFlag = false
					})
				}
			}
		},
		listTotal: {
			immediate: true,
			handler (val) {
				this.setPaginationTotal(val)
			}
		},
		selectedRowArr (val) {
			this.$emit('update:selectedRows', val)
		},
		selectedArr: {
			immediate: true,
			handler (val) {
				this.compareArrayUtils.setData(val)
			}
		},
		tableColumn: {
			deep: true,
			immediate: true,
			handler (val) {
				const _tableColumn = this.$fxUtils.deepClone(this.tableColumn)
				_tableColumn.forEach(item => {
					this.setColumnVisible(item)
					if (!this.$fxUtils.isDef(item.width)) {
						item.width = DEFAULT_COL_WIDTH
					}
					if (!this.$fxUtils.isDef(item.align)) {
						item.align = DEFAULT_COL_ALIGN
					}
					if (!this.$fxUtils.isDef(item.fixed)) {
						item.fixed = false
					}
				})
				this.currentTableColumn = _tableColumn
			}
		},
		currentTableColumn: {
			deep: true,
			handler (val) {
				this.doTableLayout({ columnWidthInit: this.isSelectAll })
			}
		},
		expandRows: {
			immediate: true,
			handler (val) {
				const _expendRowArr = this.$fxUtils.deepClone(val)
				_expendRowArr.forEach(item => {
					if (!this.$fxUtils.isDef(item.visible)) {
						item.visible = true
					}
				})
				this.currentExpandRows = _expendRowArr
			}
		}
	},
	methods: {
		getPaginationParams () {
			return this.$refs.pagination.getPaginationParams()
		},
		setPaginationTotal (total) {
			this.total = total - 0 || 0
		},
		setPaginationCurrent (page) {
			this.$refs.pagination.setCurrentPage(page)
		},
		onSizeChange (size) {
			this.$emit('on-page-change')
		},
		onCurrentChange () {
			this.$emit('on-page-change')
		},
		onTableRowSelect (selecteds, row) {
			let selectFlag = false
			let selectType = 'alone'
			if (this.selectMulity) {
				if (!row) {
					selectType = 'all'
					if (!selecteds.length) {
						const listDataCompareArrayUtils = this.$fxUtils.compareArrayUtils(this.listData, {
							key: this.primaryKey
						})
						this.selectedRowArr = this.selectedRowArr.filter(item => {
							return !listDataCompareArrayUtils.has(item[this.primaryKey])
						})
						selectFlag = false
					} else {
						selecteds.forEach(item => {
							if (!this.compareArrayUtils.has(item[this.primaryKey])) {
								this.selectedRowArr.push(item)
							}
						})
						selectFlag = true
					}
				} else {
					const index = this.selectedArr.findIndex(item => {
						return item === row[this.primaryKey]
					})
					if (~index) {
						this.selectedRowArr.splice(index, 1)
						selectFlag = false
					} else {
						this.selectedRowArr.push(row)
						selectFlag = true
					}
				}
				this.selectedArr = this.selectedRowArr.map(item => {
					return item[this.primaryKey]
				})
			} else {
				selectFlag = true
				this.radioValue = selecteds
				this.selectedRowArr = [row]
				this.selectedArr = [selecteds]
			}
			this.$emit('on-select', {
				selectType,
				selectFlag,
				selectMulity: this.selectMulity,
				row,
				radioValue: selecteds,
				selectedArr: this.selectedArr,
				selectedRowArr: this.selectedRowArr
			})
		},
		getSelectedRows (validate = true) {
			return new Promise((resolve, reject) => {
				if (this.selectedRowArr.length === 0 && validate) {
					const error = '请选择一条明细'
					this.$fxMessage.warning(error)
					reject(error)
				} else {
					resolve(this.selectedRowArr)
				}
			})
		},
		getSingleSelectedRow () {
			return new Promise(resolve => {
				if (this.selectedRowArr.length === 0) {
					this.$fxMessage.warning('请选择一条明细')
				} else if (this.selectedRowArr.length > 1) {
					this.$fxMessage.warning('只能选择一条明细')
				} else {
					resolve(this.selectedRowArr[0])
				}
			})
		},
		getSelectIds (fn) {
			return fn ? this.selectedRowArr.filter(fn) : this.selectedArr
		},
		clearSelected () {
			this.selectedArr = []
			this.selectedRowArr = []
			this.$refs.organTable.clearSelection()
		},
		onTableRowClick (item, column, event) {
			if (!this.selectable || !column) {
				return false
			}
			const col = this.currentTableColumnFlatten.find(item => {
				return item.prop === column.property
			}) || {}
			if (typeof col.click !== 'function') {
				this.selectMulity ? this.doSelectRow(item) : this.doSelectRowRadio(item)
			}
		},
		doSelectRow (item) {
			const index = this.selectedArr.findIndex(selectItem => {
				return item[this.primaryKey] === selectItem
			})
			if (~index) {
				this.selectedRowArr.splice(index, 1)
			} else {
				this.selectedRowArr.push(item)
			}
			this.$refs.organTable.toggleRowSelection(item, !~index)
			this.selectedArr = this.selectedRowArr.map(item => {
				return item[this.primaryKey]
			})
			this.$emit('on-select', {
				selectType: 'alone',
				selectFlag: !~index,
				selectMulity: this.selectMulity,
				row: item,
				radioValue: item[this.primaryKey],
				selectedArr: this.selectedArr,
				selectedRowArr: this.selectedRowArr
			})
		},
		doSelectRowRadio (item) {
			if (item[this.primaryKey] === this.selectedArr[0]) {
				return false
			}
			this.selectedRowArr = [item]
			this.selectedArr = [item[this.primaryKey]]
			this.$refs.organTable.radioSelection(item)
		},
		onColmunFilterSelectAll (visible) {
			this.columnFilterArr.forEach(item => {
				if (!item.required) {
					item.visible = visible
				}
			})
		},
		doTableLayout ({ columnWidthInit } = {}) {
			this.$nextTick(() => {
				this.$refs.organTable.doLayout({ columnWidthInit })
			})
		},
		onTableRowDbclick (item) {
			this.currentDbclickRow = item
			this.$emit('on-table-row-dbclick', item)
		},
		onCellClick (row, column, cell, event) {
			const col = this.currentTableColumnFlatten.find(item => {
				return item.prop === column.property
			}) || {}
			if (typeof col.click === 'function') {
				col.click(row, column, cell, event)
			}
		},
		onSortChange ({ item, prop, order }) {
			const sortKey = item.$attrs.item.sortKey || prop
			this.sortParams = order ? {
				[sortKey]: order === 'desc' ? 'desc' : 'asc'
			} : null
			this.$emit('on-sort-change', this.sortParams)
		},
		getSortKey () {
			return this.sortParams || this.defaultSortParam
		},
		async verificationRowData (row) {
			for (let i = 0; i < this.tableValiDate.length; i++) {
				try {
					await this.validate(row, this.tableValiDate[i])
				} catch (error) {
					return Promise.reject(error)
				}
			}
			return Promise.resolve(row)
		},
		validate (row, tableValiDateItem) {
			return new Promise((resolve, reject) => {
				const success = () => {
					const validate = {
						columnProp: tableValiDateItem.columnProp,
						index: row.$fxIndex,
						type: 'success'
					}
					this.tableEventBus.$emit('$fx-table-row-validate', validate)
					resolve()
				}
				const error = (message) => {
					const validate = {
						columnProp: tableValiDateItem.columnProp,
						index: row.$fxIndex,
						type: 'error',
						message
					}
					if (this.isRenderedRow(row.$fxIndex) && this.$refs.organTable.isRowInView(row.$fxIndex)) {
						this.tableEventBus.$emit('$fx-table-row-validate', validate)
						reject(message)
					} else {
						this.scrollToIndex(row.$fxIndex).then(() => {
							this.tableEventBus.$emit('$fx-table-row-validate', validate)
							reject(message)
						})
					}
				}
				tableValiDateItem.rule(row, success, error)
			})
		},
		onListCellEnter (cellEvent) {
			return !cellEvent.isInExpandCell ? this.cellEnterHandler(cellEvent) : this.expandCellEnterHandler(cellEvent)
		},
		cellEnterHandler (cellEvent) {
			if (this.tableEditEnterColumnProp.includes(cellEvent.columnProp)) {
				this.$emit('on-row-edit-enter')
				return false
			}
			if (this.tableEditColumnProp.length > 0) {
				const typeIndex = this.tableEditColumnProp.findIndex(item => {
					return item === cellEvent.columnProp
				})
				if (typeIndex !== this.tableEditColumnProp.length - 1) {
					const nextType = this.tableEditColumnProp[typeIndex + 1]
					this.setListCellFocus(this.createCellEvent(nextType, cellEvent))
				} else {
					this.$emit('on-row-edit-enter')
				}
			}
		},
		expandCellEnterHandler (cellEvent) {
			if (this.tableExpandEditColumnProp.length > 0) {
				const typeIndex = this.tableExpandEditColumnProp.findIndex(item => {
					return item === cellEvent.columnProp
				})
				if (typeIndex !== this.tableExpandEditColumnProp.length - 1) {
					const nextType = this.tableExpandEditColumnProp[typeIndex + 1]
					this.setListCellFocus(this.createCellEvent(nextType, cellEvent))
				} else {
					this.$emit('on-row-edit-enter')
				}
			}
		},
		onListCellSelected (cellEvent) {
			return !cellEvent.isInExpandCell ? this.cellSelectedHandler(cellEvent) : this.expandCellSelectedHandler(cellEvent)
		},
		cellSelectedHandler (cellEvent) {
			if (this.tableEditColumnProp.length > 0) {
				const typeIndex = this.tableEditColumnProp.findIndex(item => {
					return item === cellEvent.columnProp
				})
				if (typeIndex !== this.tableEditColumnProp.length - 1) {
					const nextType = this.tableEditColumnProp[typeIndex + 1]
					this.setListCellFocus(this.createCellEvent(nextType, cellEvent))
				}
			}
		},
		expandCellSelectedHandler (cellEvent) {
			if (this.tableExpandEditColumnProp.length > 0) {
				const typeIndex = this.tableExpandEditColumnProp.findIndex(item => {
					return item === cellEvent.columnProp
				})
				if (typeIndex !== this.tableExpandEditColumnProp.length - 1) {
					const nextType = this.tableExpandEditColumnProp[typeIndex + 1]
					this.setListCellFocus(this.createCellEvent(nextType, cellEvent))
				}
			}
		},
		createCellEvent (columnProp, { row, index }) {
			return {
				columnProp,
				row,
				index
			}
		},
		setListCellFocus (cellEvent, immediate = true) {
			const index = cellEvent.row.$fxIndex
			if (immediate) {
				this.tableEventBus.$emit('$fx-list-cell-setfocus', cellEvent)
			} else {
				this.$refs.organTable.scrollToIndex(index).then(() => {
					this.tableEventBus.$emit('$fx-list-cell-setfocus', cellEvent)
				})
			}
		},
		onListCellUp (cellEvent) {
			if (cellEvent.index <= 0) {
				return false
			}
			const index = cellEvent.index - 1
			const row = this.listData.find(item => {
				return item.$fxIndex === index
			})
			this.$emit('on-row-edit-up-down-change', row, cellEvent.columnProp)
		},
		onListCellDown (cellEvent) {
			if (cellEvent.index >= this.listData.length - 1) {
				return false
			}
			const index = cellEvent.index + 1
			const row = this.listData.find(item => {
				return item.$fxIndex === index
			})
			this.$emit('on-row-edit-up-down-change', row, cellEvent.columnProp)
		},
		onListCellTab (cellEvent) {
			return !cellEvent.isInExpandCell ? this.cellTabHandler(cellEvent) : this.expandCellTabHandler(cellEvent)
		},
		cellTabHandler (cellEvent) {
			if (this.tableEditColumnProp.length > 0) {
				const typeIndex = this.tableEditColumnProp.findIndex(item => {
					return item === cellEvent.columnProp
				})
				if (typeIndex !== this.tableEditColumnProp.length - 1) {
					const nextType = this.tableEditColumnProp[typeIndex + 1]
					this.setListCellFocus(this.createCellEvent(nextType, cellEvent))
				} else {
					const isExpandCell = this.$refs.organTable.isRowExpanded(cellEvent.row[this.primaryKey])
					if (isExpandCell && this.tableExpandEditColumnProp.length > 0) {
						const expandType = this.tableExpandEditColumnProp[0]
						this.$refs.organTable.doScrollLeft(true).then(() => {
							this.setListCellFocus(this.createCellEvent(expandType, cellEvent))
						})
					} else {
						this.$emit('on-row-edit-tab', cellEvent)
					}
				}
			}
		},
		cellIntoExpandCellTabHandler (cellEvent) {
			return new Promise(resolve => {
				const isExpandCell = this.$refs.organTable.isRowExpanded(cellEvent.row[this.primaryKey])
				if (isExpandCell && this.tableExpandEditColumnProp.length > 0) {
					const expandType = this.tableExpandEditColumnProp[0]
					this.$refs.organTable.doScrollLeft(true).then(() => {
						this.setListCellFocus(this.createCellEvent(expandType, cellEvent))
					})
				} else {
					resolve()
				}
			})
		},
		expandCellTabHandler (cellEvent) {
			if (this.tableExpandEditColumnProp.length > 0) {
				const typeIndex = this.tableExpandEditColumnProp.findIndex(item => {
					return item === cellEvent.columnProp
				})
				if (typeIndex !== this.tableExpandEditColumnProp.length - 1) {
					const nextType = this.tableExpandEditColumnProp[typeIndex + 1]
					this.setListCellFocus(this.createCellEvent(nextType, cellEvent))
				} else {
					this.$emit('on-row-edit-tab', cellEvent)
				}
			}
		},
		setAllExpand () {
			this.expandRowKeys = this.listData.map(item => {
				return item[this.primaryKey]
			})
		},
		clearExpanded () {
			this.expandRowKeys = []
		},
		spanMergeHandler ({ row, column, rowIndex, columnIndex }) {
			const columnModel = this.tableColumn.find(item => {
				return item.prop === column.property
			}) || {}
			return {
				rowspan: columnModel.rowMerge ? row[columnModel.rowMerge] : 1,
				colspan: columnModel.colMerge ? row[columnModel.colMerge] : 1
			}
		},
		// @TODO
		onScrollHandler () {
			// this.tableEventBus.$emit('$fx-list-cell-setBlur')
		},
		scrollToIndex (index) {
			return this.$refs.organTable.scrollToIndex(index)
		},
		isRenderedRow (rowIndex) {
			return this.$refs.organTable.isRenderedRow(rowIndex)
		},
		getVisibleColumns () {
			return this.$refs.organTable.getVisibleColumns()
		},
		doLayout () {
			return this.$refs.organTable.doLayout()
		},
		setColumnVisible (item) {
			if (!this.$fxUtils.isDef(item.visible)) {
				item.visible = true
			}
			if (Array.isArray(item.child) && item.child.length > 0) {
				item.child.forEach(childItem => {
					this.setColumnVisible(childItem)
				})
			}
		},
		async doCollectionValiDate () {
			const collectionMap = this.$refs.organTable.getCollectionMap()
			const collectionArr = Object.keys(collectionMap)
			for (let j = 0; j < collectionArr.length; j++) {
				const data = collectionMap[collectionArr[j]].map(mapItem => {
					return this.listData.find(row => {
						return row[this.primaryKey] === mapItem
					})
				})
				for (let i = 0; i < this.collectionValiDate.length; i++) {
					try {
						await this.validateCollection(data[0], data, this.collectionValiDate[i])
					} catch (error) {
						return Promise.reject(error)
					}
				}
			}
			return Promise.resolve()
		},
		validateCollection (row, collectionRows, tableValiDateItem) {
			return new Promise((resolve, reject) => {
				const success = () => {
					const validate = {
						columnProp: tableValiDateItem.columnProp,
						index: row.$fxIndex,
						type: 'success'
					}
					this.tableEventBus.$emit('$fx-table-collection-validate', validate)
					resolve()
				}
				const error = (message) => {
					const validate = {
						columnProp: tableValiDateItem.columnProp,
						index: row.$fxIndex,
						type: 'error',
						message
					}
					if (this.isRenderedRow(row.$fxIndex)) {
						this.tableEventBus.$emit('$fx-table-collection-validate', validate)
						reject(message)
					} else {
						this.scrollToIndex(row.$fxIndex).then(() => {
							this.tableEventBus.$emit('$fx-table-collection-validate', validate)
							reject(message)
						})
					}
				}
				const collectionProp = this.$refs.organTable.collectionProp
				tableValiDateItem.rule(row[collectionProp.data], collectionRows, success, error)
			})
		},
		setDefaultSortParam () {
			if (this.defaultSortParam) {
				this.sortParams = this.defaultSortParam
			}
		},
		refreshSortType () {
			this.$refs.organTable.refreshSortType()
		},
		doScrollLeft () {
			return this.$refs.organTable.doScrollLeft()
		},
		updateSelectRender () {
			if (this.selectRenderFlag) {
				this.selectRenderDebounce(50, false).then(this.renderSelect)
			}
		},
		renderSelect () {
			this.$refs.organTable.clearSelection()
			if (this.selectMulity) {
				this.listData.forEach(item => {
					this.$refs.organTable.onlyToggleRowSelection(item, !!this.compareArrayUtils.has(item[this.primaryKey]))
				})
				this.$refs.organTable.onlyUpdateAllSelected()
			} else {
				if (this.selectedRows[0]) {
					this.$refs.organTable.radioSelection(this.selectedRows[0])
				}
			}
		},
		indexFormatter (index) {
			const page = this.$refs.pagination.getCurrentPage()
			const pageSize = this.$refs.pagination.getPageRows()
			return index + 1 + ((page - 1) * pageSize)
		},
		changeRow (type, { prevErrorMessage, nextErrorMessage }) {
			if (type === 'prev') {
				return this.changePrevRow(prevErrorMessage)
			} else if (type === 'next') {
				return this.changeNextRow(nextErrorMessage)
			}
		},
		changeNextRow (errorMsg) {
			return new Promise(resolve => {
				const index = this.listData.findIndex(item => {
					return item[this.primaryKey] === this.currentDbclickRow[this.primaryKey]
				})
				if (index === this.listData.length - 1) {
					const pageParams = this.$refs.pagination.getPaginationParams()
					const rowNum = pageParams.page * pageParams.rows + index + 1
					if (rowNum < this.total && typeof this.fpGetListData === 'function') {
						this.$refs.pagination.setCurrentPage(pageParams.page + 2)
						this.fpGetListData().then(({ result: listData, total }) => {
							if (listData.length === 0) {
								const _pageParams = this.$refs.pagination.getPaginationParams()
								this.$refs.pagination.setCurrentPage(_pageParams.page)
								this.fpGetListData().then(res => {
									this.$fxMessage.warning(errorMsg)
									return false
								})
							} else {
								const nextRow = listData[0]
								this.currentDbclickRow = nextRow
								this.$emit('update:listData', listData)
								this.setPaginationTotal(total)
								resolve(nextRow)
							}
						})
					} else {
						this.$fxMessage.warning(errorMsg)
						return false
					}
				} else {
					const nextRow = this.listData[index + 1]
					this.currentDbclickRow = nextRow
					resolve(nextRow)
				}
			})
		},
		changePrevRow (errorMsg) {
			return new Promise(resolve => {
				const index = this.listData.findIndex(item => {
					return item[this.primaryKey] === this.currentDbclickRow[this.primaryKey]
				})
				if (index === 0) {
					const pageParams = this.$refs.pagination.getPaginationParams()
					const rowNum = pageParams.page * pageParams.rows + index
					if (rowNum !== 0 && typeof this.fpGetListData === 'function') {
						this.$refs.pagination.setCurrentPage(pageParams.page)
						this.fpGetListData().then(({ result: listData, total }) => {
							if (listData.length === 0) {
								const _pageParams = this.$refs.pagination.getPaginationParams()
								this.$refs.pagination.setCurrentPage(_pageParams.page + 2)
								this.fpGetListData().then(listData => {
									this.$fxMessage.warning(errorMsg)
									return false
								})
							} else {
								const prevRow = listData[listData.length - 1]
								this.currentDbclickRow = prevRow
								this.$emit('update:listData', listData)
								this.setPaginationTotal(total)
								resolve(prevRow)
							}
						})
					} else {
						this.$fxMessage.warning(errorMsg)
						return false
					}
				} else {
					const prevRow = this.listData[index - 1]
					this.currentDbclickRow = prevRow
					resolve(prevRow)
				}
			})
		},
		isSelected (row) {
			return this.selectedArr.includes(row[this.primaryKey])
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.organ-list {
	flex: 1
	display:flex
	flex-direction: column
	overflow: auto
	height: 100%
	&__top {
		display:flex
		flex-direction: row
		justify-content: space-between;
		margin-bottom: 10px
		&-left, &-right {
			display:flex
			flex-direction: row
			align-items: center
		}
		&-left {
			min-width: 100px
			margin-right: 5px
			.count-selected {
				margin: 0 10px
			}
		}
		&-right {
			margin-right: 16px
			flex: 1
			.btn-tools-left {
				flex: 1
			}
			.table-column-fiter-btn__container {
				display: flex
			}
			.table-column-fiter-btn {
				margin: 0 20px
			}
		}
	}
	&__container {
		flex: 1
		position: relative
		display: flex
		>>>.el-table {
			position: absolute;
		}
	}
	&__bottom {
		height: 60px
		display: flex
		align-items: center
		.table-sum {
			margin-left: 20px
			width: 100px
		}
		.table-pagination {
			flex: 1
			display: flex
			align-items: center
			justify-content: flex-end
			padding-right: 20px
		}
	}
	>>>.organ-table {
		border: 1px solid $fxElementBorder
		.fx-list-table__cell-span {
			white-space: nowrap
		}
		.fx-table-cell {
			height: 45px
		}
		.table-radio {
			.el-radio__label {
				display: none
			}
		}
		.table-selection {
			height: 45px
		}
		.list-tabel-empty {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			text-align: center;
			line-height: normal;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
}
.organ-list_column-filter-item {
	margin: 4px 0
	&>>>.el-checkbox__label {
		font-size: 12px
	}
}
</style>
