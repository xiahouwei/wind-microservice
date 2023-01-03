<template>
	<div class="organ-list" :style="listStyle">
		<div v-if="showTools" class="organ-list__top">
			<div class="organ-list__top-left">
				<div class="count-selected">已选：{{selectedArr.length}} / {{total}}条</div>
			</div>
			<div class="organ-list__top-right">
				<slot name='btn-tools-left'>
					<div class="btn-tools-left"></div>
				</slot>
				<w-popover placement="bottom" trigger="click">
					<div class="organ-list_column-filter-item">
						<el-checkbox :value="isSelectAll" label="全选" @change="onColmunFilterSelectAll"></el-checkbox>
					</div>
					<div v-for="(item, index) in columnFilterArr" :key="index" class="organ-list_column-filter-item">
						<el-checkbox
							v-model="item.visible"
							:label="item.label"
							:disabled="item.required"
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
			<el-table
				ref="organTable"
				v-loading="loading"
				:data="listData"
				:expand-row-keys="expandRowKeys"
				:span-method="spanMergeHandler"
				border
				stripe
				row-key='id'
				height="100%"
				tooltip-effect="dark"
				:element-loading-text="loadingText"
				class="organ-table"
				:class="tableClasses"
				:row-class-name="rowClassName"
				:row-style="rowStyle"
				:cell-class-name="cellClassNameComputed"
				:cell-style="cellStyle"
				@select="onTableRowSelect"
				@select-all="onTableRowSelect"
				@row-click="onTableRowClick"
				@row-dblclick="onTableRowDbclick"
				@cell-click="onCellClick"
				@sort-change="onSortChange"
				>
				<el-table-column
					v-if="selectMulity&&selectable"
					type="selection"
					width="50"
					align="center"
					reserve-selection
					:fixed="selectAndIndexFixed"
					class-name="table-selection"
				>
				</el-table-column>
				<el-table-column
					v-if="!selectMulity&&selectable"
					width="50"
					align="center"
					:fixed="selectAndIndexFixed"
					class-name="table-radio"
				>
					<template slot-scope="scope">
						<el-radio v-model="radioValue" :label="scope.row.id"></el-radio>
					</template>
				</el-table-column>
				<el-table-column v-if="expandRowSlot" :fixed="selectAndIndexFixed" type="expand" label="详情">
					<template slot-scope="{row, $index}">
						<el-form label-position="left" inline class="demo-table-expand" size="mini">
							<slot name="row-expand" :row="row" :$index="$index" :expendRowVisible="expendRowVisible"></slot>
						</el-form>
					</template>
				</el-table-column>
				<el-table-column
					v-if="showIndex"
					label="序号"
					type="index"
					width="50"
					align="center"
					:fixed="selectAndIndexFixed"
					:index="indexFormatter"
					:resizable="false"
				>
				</el-table-column>
				<template v-for="item in currentTableColumn">
					<el-table-column
						v-if="item.visible"
						:key="item.prop"
						:prop="item.prop"
						:label="item.label"
						:align="item.align"
						:fixed='item.fixed'
						:min-width="item.width"
						:sortable="item.sortable && 'custom'"
						:class-name="`fx-list-table__td ${item.className || ''} ${item.sortKey? 'sortKey--'+item.prop+'__'+item.sortKey : ''}`"
					>
					<template slot-scope="scope">
						<fx-render-dom
							v-if="item.fxRender"
							:render="item.fxRender"
							:backValue="scope"
						></fx-render-dom>
						<span v-else class="fx-list-table__cell-span">
							{{item.formatter?item.formatter(scope.row):getCellText(scope.row, item.prop)}}
						</span>
					</template>
					</el-table-column>
				</template>
				<div v-if="$slots.empty" slot="empty" class="list-tabel-empty">
					<slot name="empty"></slot>
				</div>
			</el-table>
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

 * @param {Array}  tableColumn - 列模型

 * @param {String} tableColumn.prop -列的key
 * @param {Boolean} tableColumn.visible -列的显示
 * @param {String} tableColumn.label -列头文本
 * @param {String} tableColumn.width -列宽度
 * @param {String} tableColumn.align -列对齐方式
 * @param {Boolean} tableColumn.fixed -列固定列
 * @param {Boolean} tableColumn.required -必选列
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
 * @param {Array} listData - 表格数据
 * @param {Boolean} showPagination - 是否显示分页控件
 * @param {String} minWidth - table最小宽度
 * @param {String} minHeight - table最小高度
 * @param {String, Number} listTotal - 数据总数
 * @param {Boolean} selectable - 可选择
 * @param {Boolean} selectMulity - 是否多选
 * @param {Array} selectedRows - 默认选中数据
 * @param {Boolean} showColumnFilterBtn - 开启列显示/隐藏控件
 * @param {Boolean} showIndex - 显示索引
 * @param {Boolean} loading - 显示加载中...
 * @param {Boolean} expandRowSlot - 开启详情插槽
 * @param {Boolean} border - 开启边框
 * @param {Boolean} showTools - 开启table操作栏
 * @param {String} loadingText - 加载显示文字
 * @param {Function} fpGetListData - 获取list数据方法
 * @param {Boolean} showSummaryTools - 显示合计
 * @param {Object} summaryData - 全部合计数据
 * @param {Object} defaultSortParam - 默认排序参数
 * @param {Boolean} selectAndIndexFixed - 默认固定多选框列、单选框列、详情按钮列和序号列
 */
const DEFAULT_TABLE_MIN_WIDTH = '500px'
const DEFAULT_TABLE_MIN_HEIGHT = '300px'
const DEFAULT_COL_WIDTH = '120'
const DEFAULT_COL_ALIGN = 'left'
export default {
	name: 'fx-list-table',
	props: {
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
		listData: {
			type: Array,
			default: () => {
				return []
			}
		},
		expandRows: {
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
		selectable: {
			type: Boolean,
			default: true
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
		expandRowSlot: Boolean,
		border: Boolean,
		showTools: {
			type: Boolean,
			default: true
		},
		loadingText: {
			type: String,
			default: '保存中'
		},
		// 行的 className
		rowClassName: [Function, String],
		// 行的 style 的回调方法
		rowStyle: Function,
		// 单元格的 className 的回调方法
		cellClassName: [Function, String],
		// 单元格的 style 的回调方法
		cellStyle: [Function, String],
		// 获取list数据方法
		fpGetListData: Function,
		// 显示合计
		showSummaryTools: Boolean,
		// 全部合计数据
		summaryData: {
			type: Object,
			default: () => {
				return {}
			}
		},
		// 默认筛选参数
		defaultSortParam: null,
		// 默认固定多选框列、单选框列、详情按钮列和序号列
		selectAndIndexFixed: {
			type: Boolean,
			default: true
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
			extendRowArr: [],
			total: 0,
			selectedArr: [],
			selectedRowArr: [],
			radioValue: '',
			sortParams: null,
			expandRowKeys: [],
			currentDbclickRow: null
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
				...this.extendRowArr
			]
		},
		expendRowVisible () {
			const extendObj = {}
			this.extendRowArr.forEach(item => {
				extendObj[item.prop] = item.visible
			})
			return extendObj
		},
		cellClassNameComputed () {
			let className = ''
			if (typeof this.cellClassName === 'string') {
				className = this.cellClassName
			} else if (typeof this.cellClassName === 'function') {
				className = this.cellClassName()
			}
			return `fx-table-cell ${className}`
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
		}
	},
	created () {
		this.tableEventBus.initEvent(this, '$fx-list-cell-enter', this.onListCellEnter)
		this.tableEventBus.initEvent(this, '$fx-list-cell-up', this.onListCellUp)
		this.tableEventBus.initEvent(this, '$fx-list-cell-down', this.onListCellDown)
		this.setDefaultSortParam()
	},
	watch: {
		listData: {
			immediate: true,
			handler (listData) {
				listData.forEach((item, index) => {
					item.$fxIndex = index
				})
				this.$nextTick(() => {
					this.$refs.organTable.clearSelection()
					listData.forEach(item => {
						this.$refs.organTable.toggleRowSelection(item, this.selectedArr.includes(item.id))
					})
				})
			}
		},
		listTotal: {
			immediate: true,
			handler (val) {
				this.setPaginationTotal(val)
			}
		},
		selectedRows: {
			immediate: true,
			handler (val) {
				this.selectedRowArr = val
				this.selectedArr = val.map(item => {
					return item.id
				})
				if (val && val.length === 1) {
					this.radioValue = val[0].id
				} else {
					this.radioValue = ''
				}
			}
		},
		selectedRowArr (val) {
			this.$emit('update:selectedRows', val)
		},
		tableColumn: {
			immediate: true,
			handler (val) {
				const _tableColumn = this.$fxUtils.deepClone(this.tableColumn)
				_tableColumn.forEach(item => {
					if (!this.$fxUtils.isDef(item.visible)) {
						item.visible = true
					}
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
				this.doTableLayout()
			}
		},
		expandRows: {
			immediate: true,
			handler (val) {
				const _extendRowArr = this.$fxUtils.deepClone(this.expandRows)
				_extendRowArr.forEach(item => {
					if (!this.$fxUtils.isDef(item.visible)) {
						item.visible = true
					}
				})
				this.extendRowArr = _extendRowArr
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
			if (!row) {
				if (!selecteds.length) {
					this.selectedRowArr = this.selectedRowArr.filter(item => {
						return !this.listData.some(_item => _item.id === item.id)
					})
				} else {
					selecteds.forEach(item => {
						if (!this.selectedRowArr.some(_item => _item.id === item.id)) {
							this.selectedRowArr.push(item)
						}
					})
				}
			} else {
				const index = this.selectedArr.findIndex(item => {
					return item === row.id
				})
				if (~index) {
					this.selectedRowArr.splice(index, 1)
				} else {
					this.selectedRowArr.push(row)
				}
			}
			this.selectedArr = this.selectedRowArr.map(item => {
				return item.id
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
			this.radioValue = ''
			this.$refs.organTable.clearSelection()
		},
		onTableRowClick (item, column, event) {
			if (!this.selectable || !column) {
				return false
			}
			const col = this.currentTableColumn.find(item => {
				return item.prop === column.property
			}) || {}
			if (typeof col.click !== 'function') {
				this.selectMulity ? this.doSelectRow(item) : this.doSelectRowRadio(item)
			}
		},
		doSelectRow (item, flag) {
			const index = this.selectedArr.findIndex(selectItem => {
				return item.id === selectItem
			})
			if (!this.$fxUtils.isDef(flag)) {
				if (~index) {
					this.selectedRowArr.splice(index, 1)
				} else {
					this.selectedRowArr.push(item)
				}
				this.$refs.organTable.toggleRowSelection(item, !~index)
			} else {
				if ((flag && ~index) || (!flag && !~index)) {
					return false
				}
				if (flag && !~index) {
					this.selectedRowArr.push(item)
				} else if (!flag && ~index) {
					this.selectedRowArr.splice(index, 1)
				}
				this.$refs.organTable.toggleRowSelection(item, flag)
			}
			this.selectedArr = this.selectedRowArr.map(item => {
				return item.id
			})
		},
		doSelectRowRadio (item) {
			this.radioValue = item.id
			this.selectedRowArr = [item]
			this.selectedArr = [item.id]
		},
		onColmunFilterSelectAll (visible) {
			this.columnFilterArr.forEach(item => {
				if (!item.required) {
					item.visible = visible
				}
			})
			this.doTableLayout()
		},
		doTableLayout () {
			this.$nextTick(() => {
				this.$refs.organTable.doLayout()
			})
		},
		onTableRowDbclick (item) {
			this.currentDbclickRow = item
			this.$emit('on-table-row-dbclick', item)
		},
		onCellClick (row, column, cell, event) {
			const col = this.currentTableColumn.find(item => {
				return item.prop === column.property
			}) || {}
			if (typeof col.click === 'function') {
				col.click(row, column, cell, event)
			}
		},
		onSortChange ({ column, prop, order }) {
			const target = this.$refs.organTable.$el.querySelector(`[class*=sortKey--${prop}]`)
			if (target) {
				let sortKey = Array.prototype.find.call(target.classList, item => {
					return item.indexOf(`sortKey--${prop}`) !== -1
				})
				sortKey = sortKey.split('__')[1]
				prop = sortKey
			}
			this.sortParams = order ? {
				[prop]: order === 'descending' ? 'desc' : 'asc'
			} : null
			this.$emit('on-sort-change', this.sortParams)
		},
		getSortKey () {
			return this.sortParams || this.defaultSortParam
		},
		getCellText (row, prop) {
			if (~prop.indexOf('.')) {
				return prop.split('.').reduce((pre, cur) => {
					return pre === undefined ? pre : pre[cur]
				}, row)
			}
			return row[prop]
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
					this.tableEventBus.$emit('$fx-table-row-validate', validate)
					reject(message)
				}
				tableValiDateItem.rule(row, success, error)
			})
		},
		onListCellEnter (cellEvent) {
			if (this.tableEditColumnProp.length > 0) {
				const typeIndex = this.tableEditColumnProp.findIndex(item => {
					return item === cellEvent.columnProp
				})
				if (typeIndex !== this.tableEditColumnProp.length - 1) {
					const nextType = this.tableEditColumnProp[typeIndex + 1]
					const _cellEvent = {
						columnProp: nextType,
						row: cellEvent.row,
						index: cellEvent.index
					}
					this.setListCellFocus(_cellEvent)
				} else {
					this.$emit('on-row-edit-enter')
				}
			}
		},
		setListCellFocus (cellEvent) {
			this.tableEventBus.$emit('$fx-list-cell-setfocus', cellEvent)
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
		scrollToBottom () {
			this.$nextTick(() => {
				const table = this.$refs.organTable
				table.bodyWrapper.scrollTop = table.bodyWrapper.scrollHeight
			})
		},
		setAllExpand () {
			this.expandRowKeys = this.listData.map(item => {
				return item.id
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
					return item.id === this.currentDbclickRow.id
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
					return item.id === this.currentDbclickRow.id
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
			return this.selectedArr.includes(row.id)
		},
		setDefaultSortParam () {
			if (this.defaultSortParam) {
				this.sortParams = this.defaultSortParam
			}
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
			.table-column-fiter-btn {
				margin: 0 20px
			}
		}
	}
	&__container {
		flex: 1
		position: relative
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
		&.el-table--border.no-bord {
			td, th {
				border-right-color: rgba(255,255,255,0) !important
			}
		}
		.el-table__header-wrapper, .el-table__fixed-header-wrapper {
			.cell {
				font-weight: 700
			}
		}
		.el-table__body {
			// 使表格兼容safari，不错位
			width: 100%;
		}
		.el-table__body-wrapper::-webkit-scrollbar {
			width: 8px
			height: 8px
		}
		.el-table__body-wrapper::-webkit-scrollbar-thumb {
			border-radius: 6px;
			background-color: #E1E3E5
		}
		.el-table--border {
			td, th {
				border-right-color: white !important
			}
		}
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
		.el-table__expanded-cell {
			padding:0px 20px 0px 56px
			background-color: $fxGray5
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
