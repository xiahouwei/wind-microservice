<template>
	<w-dialog
		v-model="dialogVisible"
		title="打印预览"
		fullscreen
		@closed="onClosed"
	>
		<w-app-container class="print-view">
			<div class="print-view__menu">
				<div class="print-view__menu-tools">
					<div class="print-view__menu-tools-layout">
						打印布局
						<el-radio-group v-model="currentPrintSize" class="layout-radio-group" @change="onPrintSizeChange">
							<el-radio
								v-for="item in printSizeList"
								:key="item.id"
								:label="item.id"
								class="layout-radio"
							>{{item.name}}</el-radio>
						</el-radio-group>
						打印字体
						<w-select
							v-model="currentFontSize"
							:optionlist="fontSizeSelectList"
							class="font-size-select"
						>
						</w-select>
						<div class="fixed-width-input">
							固定信息列宽
							<w-input-number
								ref="fixedColumnWidthInput"
								v-model="fixedColumnWidth"
								placeholder="请输入"
								integer
								class="form-item-input"
								:min="1"
								:max="currentPrintSizeWidth"
								@blur="onFixedColumnWidthBlur"
								@keyup.enter.native="onFixedColumnWidthEnter"
							>
								<div slot="suffix" class="form-item-input-suffix">px</div>
							</w-input-number>
							<span class="fixed-column-width-tips">注：{{currentPrintSizeObj.name}}纸张宽{{currentPrintSizeWidth}}px</span>
						</div>
						<div class="tabel-row-height-input">
							打印行高
							<w-input-number
								v-model="tabelRowHeight"
								placeholder="请输入"
								integer
								class="form-item-input"
								:min="20"
								:max="50"
							>
								<div slot="suffix" class="form-item-input-suffix">px</div>
							</w-input-number>
							<span class="tabel-row-height-tips">注：打印行高范围20-50px</span>
						</div>
					</div>
					<div class="print-view__menu-tools-btn">
						选择打印模板
						<w-select
							v-model="currentPrintStyle"
							:optionlist="printStyleList"
							class="print-style-select"
							@change="onPrintStyleChange"
						>
						</w-select>
						<el-button type="primary" :disabled="!canPrint" @click="onSavePrintStyleClick">保存打印样式</el-button>
						<el-button type="danger" :disabled="!currentPrintStyle" @click="onDelPrintStyleClick">删除打印样式</el-button>
						<el-button type="primary" :disabled="!canPrint" @click="onPrintClick">打印</el-button>
						<span v-show="!canPrint" class="waring-text">存在列宽度过长问题，请修改！</span>
					</div>
				</div>
			</div>
			<div class="print-view__container">
				<div class="print-view__page-content" :style="{width: `${tableWidth}px`}">
					<div class="print-view__page-content-fixed" :style="{width: `${tableFixedColumn.width}px`}">
						<div class="fx-ellipsis print-view__page-content-fixed-text">固定信息列</div>
					</div>
					<div v-for="(page,index) in tableColumnGroup" :key="index" class="print-view__page-content-summary" :style="{width: `${page.width-1}px`}">汇总{{index + 1}}</div>
				</div>
				<div ref="printTile" class="print-view__title">
					{{businessDateText}}：{{beginDateText}} - {{endDateText}}
					来源：{{datasource}}（{{billState}}）
				</div>
				<div class="print-view__details" :style="{width: `${tableWidth}px`}">
					<fx-list-virtual-table
						ref="detailsTable"
						:tableColumn="tableColumn"
						:listData="tableData"
						:showTools="false"
						:selectable="false"
						:stripe="false"
						:trHeight="30"
						:highlightCurrentRow="false"
						:fit="false"
						:showIndex="false"
						:showPagination="false"
						minWidth="50px"
						border
						@on-column-width-change="onColumnWidthChange"
					>
					</fx-list-virtual-table>
				</div>
			</div>
		</w-app-container>
		<printStyleCreateDialog
			ref="printStyleCreateDialog"
			@on-save-style="onSavePrintStyle"
			@on-del-style="onDelPrintStyle"
		></printStyleCreateDialog>
	</w-dialog>
</template>
<script>
import { apiName } from '../../Index.vue'
import printStyleCreateDialog from './PrintStyleCreateDialog.vue'
const PRINT_SIZE = [{
	id: 'a4-column',
	width: 794,
	height: 1124,
	name: 'A4纸纵向'
}, {
	id: 'a4-row',
	width: 1124,
	height: 794,
	name: 'A4纸横向'
}]
const fxPrintRegular = /\/\*fx-print-style\*\//
const TABLE_BORDER_WIDTH = 2
export default {
	name: 'printContainer',
	components: {
		printStyleCreateDialog
	},
	data () {
		return {
			dialogVisible: false,
			searchData: {},
			tableData: [],
			tableColumn: [],
			printStyleList: [],
			printSizeList: PRINT_SIZE,
			currentPrintSize: 'a4-column',
			currentFontSize: '12px',
			fixedColumnWidth: 397,
			tabelRowHeight: 30,
			currentPrintStyle: '',
			tableWidth: 0,
			tableGutterWidth: 0,
			tableFixedColumn: {},
			tableColumnGroup: [],
			canPrint: true,
			printOnloadPolling: this.$fxUtils.polling(),
			fontSizeSelectList: this.$fxTypeMiddleware.getCommonTypeList('fontSizeSelectList')
		}
	},
	computed: {
		currentPrintSizeObj () {
			return this.printSizeList.find(item => {
				return item.id === this.currentPrintSize
			})
		},
		currentPrintSizeWidth () {
			return this.currentPrintSizeObj.width
		},
		currentPrintStyleObj () {
			return this.printStyleList.find(item => {
				return item.id === this.currentPrintStyle
			}) || { name: '', style: {} }
		},
		datasource () {
			switch (this.searchData.datasource) {
			case 0:
				return '入库单'
			case 1:
				return '出库单'
			case 2:
				return '销售订单'
			default:
				return ''
			}
		},
		billState () {
			switch (this.searchData.billState) {
			case 0:
				return '未审核'
			case 1:
				return '已审核'
			default:
				return ''
			}
		},
		beginDateText () {
			return this.searchData.startDate
		},
		endDateText () {
			return this.searchData.endDate
		},
		businessDateText () {
			return this.$fxTypeMiddleware.getCommonTypeItemById('dateType')(this.searchData.dateType).name
		},
		summaryColumnWidth () {
			return this.currentPrintSizeWidth - this.fixedColumnWidth
		}
	},
	methods: {
		open (searchData, tableData, tableColumn) {
			this.getPrintStyleList().then(() => {
				this.searchData = searchData
				this.tableData = tableData
				this.setTableColumn(tableColumn)
				this.dialogVisible = true
				this.computedTableGutterWidth()
			})
		},
		setTableColumn (tableColumn) {
			const { currentPrintSize, currentFontSize, fixedColumnWidth, tabelRowHeight, columnWidthList = [] } = this.currentPrintStyleObj.style
			this.currentPrintSize = currentPrintSize || 'a4-column'
			this.currentFontSize = currentFontSize || '12px'
			this.fixedColumnWidth = fixedColumnWidth || 397
			this.tabelRowHeight = tabelRowHeight || 30
			let i = 0
			const resetTableColumnWidth = (columnData) => {
				columnData.forEach(col => {
					if (col.child) {
						delete col.fixed
						resetTableColumnWidth(col.child)
					} else {
						col.width = columnWidthList[i] || '120'
						i++
						delete col.fxRender
						delete col.fixed
					}
				})
			}
			resetTableColumnWidth(tableColumn)
			this.tableColumn = tableColumn
		},
		async resetTableColumn () {
			const tableColumn = this.$fxUtils.deepClone(this.tableColumn)
			this.tableColumn = []
			this.tableWidth = 0
			await this.$nextTick()
			this.setTableColumn(tableColumn)
			await this.$nextTick()
			this.setTableWidth()
		},
		getPrintStyleList (id) {
			return this.$fxApi(`${apiName}.getPrintStyleList`).then(res => {
				this.printStyleList = res
				this.currentPrintStyle = id || (res[0] ? res[0].id : '')
				return Promise.resolve()
			})
		},
		computedTableGutterWidth () {
			this.$nextTick(() => {
				const detailsEl = this.$refs.detailsTable.$el
				const tableBodyEl = detailsEl.querySelector('.wind-virtual-table__right .right-body')
				this.tableGutterWidth = tableBodyEl.offsetWidth - tableBodyEl.clientWidth
				this.setTableWidth()
			})
		},
		setTableWidth () {
			const tableColumn = this.$refs.detailsTable.getVisibleColumns()
			this.tableWidth = +this.$fxUtils.arrSum(tableColumn, (cur) => cur.width) + TABLE_BORDER_WIDTH + this.tableGutterWidth
			this.computedTableColumnGroup(tableColumn)
		},
		computedTableColumnGroup (tableColumn) {
			const tableColumnGroup = Array.from({ length: tableColumn.length }, () => { return { width: 0, cols: [] } })
			this.canPrint = true
			let groupIndex = 0
			tableColumn.forEach(col => {
				const currentWidthSum = tableColumnGroup[groupIndex].width
				if (currentWidthSum + col.width > (groupIndex === 0 ? this.fixedColumnWidth : this.summaryColumnWidth) && currentWidthSum !== 0) {
					groupIndex++
				}
				tableColumnGroup[groupIndex].cols.push(col)
				tableColumnGroup[groupIndex].width += col.width
				if (tableColumnGroup[groupIndex].width > (groupIndex === 0 ? this.fixedColumnWidth : this.summaryColumnWidth)) {
					tableColumnGroup[groupIndex].width = groupIndex === 0 ? this.fixedColumnWidth : this.summaryColumnWidth
					this.canPrint = false
				}
			})
			!this.canPrint && this.$fxMessage.warning('存在列宽度过长问题，请修改！')
			this.tableFixedColumn = tableColumnGroup[0]
			this.tableColumnGroup = tableColumnGroup.filter((item, index) => {
				return index !== 0 && item.cols.length !== 0
			})
		},
		onPrintSizeChange () {
			this.fixedColumnWidth = this.currentPrintSizeWidth / 2
			const tableColumn = this.$refs.detailsTable.getVisibleColumns()
			this.computedTableColumnGroup(tableColumn)
		},
		onPrintClick () {
			this.printHandler()
		},
		onColumnWidthChange () {
			this.setTableWidth()
		},
		printHandler () {
			var iframe = document.createElement('IFRAME')
			var doc = null
			iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;')
			document.body.appendChild(iframe)
			doc = iframe.contentWindow.document
			this.createStyle(doc.head)
			this.createPrintPage(doc.body)
			this.printOnloadPolling.start(200, (next, end) => {
				const tableBorderCollapse = window.getComputedStyle(doc.querySelector('.print-view__table'), null)['border-collapse']
				const onload = tableBorderCollapse === 'collapse'
				if (onload) {
					end()
					iframe.contentWindow.print()
					document.body.removeChild(iframe)
				} else {
					next()
				}
			})
		},
		createStyle (head) {
			const styles = document.getElementsByTagName('style')
			if (styles.length > 0) {
				const printStyle = Array.prototype.find.call(styles, item => fxPrintRegular.test(item.innerHTML))
				if (printStyle) {
					head.appendChild(printStyle.cloneNode(true))
				}
			}
			const styleLinks = Array.prototype.filter.call(document.getElementsByTagName('link'), function (link) {
				return link.rel === 'stylesheet'
			})
			if (styleLinks.length > 0) {
				styleLinks.forEach(linkItem => {
					head.appendChild(linkItem.cloneNode(true))
				})
			}
		},
		createPrintPage (parent) {
			const printColumnGroup = []
			if (this.tableColumnGroup.length !== 0) {
				this.tableColumnGroup.forEach(summaryCols => {
					printColumnGroup.push([...this.tableFixedColumn.cols, ...summaryCols.cols])
				})
			} else {
				printColumnGroup.push(this.tableFixedColumn.cols)
			}
			printColumnGroup.forEach(printColumn => {
				parent.appendChild(this.createTitle())
				parent.appendChild(this.createTable(printColumn))
				parent.appendChild(this.createPrintGagination())
			})
		},
		createTitle () {
			const titleEl = this.$refs.printTile.cloneNode(true)
			titleEl.setAttribute('style', `font-size:${this.currentFontSize}`)
			return titleEl
		},
		createTable (printColumn) {
			const hasSubColumn = printColumn.some(item => item.isSubColumn)
			const parentColumnArrMap = []
			const subColumnList = hasSubColumn ? [] : printColumn
			const table = document.createElement('table')
			table.setAttribute('style', `width:${this.currentPrintSizeWidth}px;font-size:${this.currentFontSize}`)
			table.border = '1'
			table.classList.add('print-view__table')
			const setParentColumnMap = (item) => {
				const isSpecialColumn = item.level === 1
				const index = isSpecialColumn ? 0 : item.level - 2
				const columnId = isSpecialColumn ? item.id : item.columnOrTableParent.columnId
				if (!parentColumnArrMap[index]) {
					parentColumnArrMap[index] = {}
				}
				if (parentColumnArrMap[index][columnId]) {
					parentColumnArrMap[index][columnId].colSpan += 1
				} else {
					parentColumnArrMap[index][columnId] = {
						label: isSpecialColumn ? item.label : item.columnOrTableParent.label,
						diagonal: isSpecialColumn ? item.diagonal : item.columnOrTableParent.diagonal,
						colSpan: 1,
						rowSpan: isSpecialColumn ? item.rowSpan : item.columnOrTableParent.rowSpan
					}
				}
				if (item.columnOrTableParent && item.columnOrTableParent.isSubColumn) {
					setParentColumnMap(item.columnOrTableParent)
				}
			}
			// colgroup部分
			const colgroup = document.createElement('colgroup')
			printColumn.forEach(item => {
				hasSubColumn && setParentColumnMap(item)
				if (item.isSubColumn) {
					subColumnList.push(item)
				}
				const col = document.createElement('col')
				col.width = item.width
				colgroup.appendChild(col)
			})
			// thead部分
			const createTheadTh = (item) => {
				const th = document.createElement('th')
				th.setAttribute('style', 'position:relative')
				const div = document.createElement('div')
				div.classList.add('print-view__table-cell')
				div.setAttribute('style', `min-height:${this.tabelRowHeight}px`)
				if (item.diagonal) {
					const spanLeft = document.createElement('span')
					spanLeft.classList.add('print-view__table-header-diagonal-label-left')
					spanLeft.innerHTML = item.label.left
					const spanRight = document.createElement('span')
					spanRight.classList.add('print-view__table-header-diagonal-label-right')
					spanRight.innerHTML = item.label.right
					const diagonal = document.createElement('div')
					diagonal.classList.add('print-view__table-header-diagonal')
					div.appendChild(spanLeft)
					div.appendChild(spanRight)
					this.$nextTick(() => {
						const _width = div.offsetWidth
						const _height = div.offsetHeight
						const positionLeft = this.$fxUtils.pythagorasTheorem(_width, _height)
						const deg = this.$fxUtils.cosa(_height, _width, positionLeft)
						diagonal.setAttribute('style', `top:${_height / 2}px;transform:rotate(${deg}deg)`)
						div.appendChild(diagonal)
					})
				} else {
					div.innerHTML = item.label
				}
				th.appendChild(div)
				th.setAttribute('colspan', item.colSpan || 1)
				th.setAttribute('rowspan', item.rowSpan || 1)
				return th
			}
			const createTheadTr = (columnList) => {
				const headtr = document.createElement('tr')
				headtr.classList.add('print-view__table-tr')
				headtr.setAttribute('style', `line-height:${this.tabelRowHeight}px`)
				columnList.forEach(item => {
					const th = createTheadTh(item)
					headtr.appendChild(th)
				})
				return headtr
			}
			const thead = document.createElement('thead')
			parentColumnArrMap.forEach(parentColumnMap => {
				const parentColumnList = Object.values(parentColumnMap)
				if (parentColumnList.length) {
					const parentHeadtr = createTheadTr(parentColumnList)
					thead.appendChild(parentHeadtr)
				}
			})
			const headtr = createTheadTr(subColumnList)
			thead.appendChild(headtr)
			// tbody部分
			const tbody = document.createElement('tbody')
			this.tableData.forEach((listItem, listIndex) => {
				const bodytr = document.createElement('tr')
				bodytr.classList.add('print-view__table-tr')
				bodytr.setAttribute('style', `line-height:${this.tabelRowHeight}px`)
				printColumn.forEach(columnItem => {
					const td = document.createElement('td')
					const div = document.createElement('div')
					div.classList.add('print-view__table-cell')
					div.setAttribute('style', `min-height:${this.tabelRowHeight}px`)
					this.renderTableCell(div, listItem, listIndex, columnItem)
					td.appendChild(div)
					td.setAttribute('rowspan', columnItem.attrs.rowMerge ? listItem[columnItem.attrs.rowMerge] : 1)
					if (td.getAttribute('rowspan') !== '0') {
						bodytr.appendChild(td)
					}
				})
				tbody.appendChild(bodytr)
			})
			table.appendChild(colgroup)
			table.appendChild(thead)
			table.appendChild(tbody)
			return table
		},
		renderTableCell (div, listItem, listIndex, columnItem) {
			div.innerHTML = this.getCellText(listItem, columnItem.prop)
		},
		getCellText (row, prop) {
			let val = ''
			if (~prop.indexOf('.')) {
				val = prop.split('.').reduce((pre, cur) => {
					return !this.$fxUtils.isDef(pre) ? '' : pre[cur]
				}, row)
			} else {
				val = this.$fxUtils.isDef(row[prop]) ? row[prop] : ''
			}
			val = !this.$fxUtils.isDef(val) ? '' : val
			return val
		},
		createPrintGagination () {
			const el = document.createElement('div')
			el.setAttribute('style', 'page-break-after: always;')
			return el
		},
		onClosed () {
			this.tableWidth = 0
			this.tableGutterWidth = 0
			this.tableColumn = []
		},
		onSavePrintStyleClick () {
			if (this.currentPrintStyle) {
				this.$refs.printStyleCreateDialog.open(this.currentPrintStyleObj.name, 'edit')
			} else {
				this.$refs.printStyleCreateDialog.open('', 'add')
			}
		},
		onDelPrintStyleClick () {
			this.$refs.printStyleCreateDialog.open(this.currentPrintStyleObj.name, 'del')
		},
		getPrintStyle (name, isAdd) {
			const printStyle = isAdd ? { name, style: {} } : this.$fxUtils.deepClone(this.currentPrintStyleObj)
			const tableColumn = this.$refs.detailsTable.getVisibleColumns()
			const columnWidthList = tableColumn.map(item => item.width)
			printStyle.style = {
				currentPrintSize: this.currentPrintSize,
				currentFontSize: this.currentFontSize,
				fixedColumnWidth: this.fixedColumnWidth,
				tabelRowHeight: this.tabelRowHeight,
				columnWidthList
			}
			return printStyle
		},
		onSavePrintStyle (name) {
			const isAdd = name !== this.currentPrintStyleObj.name
			const	saveApi = isAdd ? 'addPrintStyle' : 'updatePrintStyle'
			const logger = this.$fxLogger.createInfo(`stock-sale-manage.assign-summary-sheet.${saveApi}`, { name })
			return this.$fxApi(`${apiName}.${saveApi}`, this.getPrintStyle(name, isAdd))({ logger }).then(res => {
				this.getPrintStyleList(res.id)
				return Promise.resolve()
			})
		},
		onDelPrintStyle (name) {
			const logger = this.$fxLogger.createInfo('stock-sale-manage.assign-summary-sheet.delPrintStyle', { name })
			return this.$fxApi(`${apiName}.delPrintStyle`, this.currentPrintStyleObj.id)({ logger }).then(() => {
				this.getPrintStyleList().then(this.resetTableColumn)
			})
		},
		onPrintStyleChange () {
			this.resetTableColumn()
		},
		onFixedColumnWidthBlur () {
			const tableColumn = this.$refs.detailsTable.getVisibleColumns()
			this.computedTableColumnGroup(tableColumn)
		},
		onFixedColumnWidthEnter () {
			this.$refs.fixedColumnWidthInput.blur()
		}
	}
}
</script>
<style lang="stylus">
@import '~$assets/stylus/varsty.styl'
/*fx-print-style*/
.print-view {
	height 100%
	padding 0 20px
	&__menu {
		width: 100%
		&-tools {
			display: flex
			justify-content space-between
			align-items: center
			margin-bottom 24px
			&-layout {
				font-size 14px
				.layout-radio-group {
					margin-left 10px
					margin-right 10px
					.layout-radio {
						margin-right 15px
					}
				}
				.font-size-select {
					margin-left 10px
					width 100px
				}
				.fixed-width-input,.tabel-row-height-input {
					position relative
					margin-left 20px
					display inline-block
					.fixed-column-width-tips,.tabel-row-height-tips {
						position absolute
						bottom -20px
						left 0
						font-size 12px
					}
				}
				.form-item-input {
					margin-left 10px
					width 80px
					&-suffix {
						line-height 28px
					}
				}
			}
			&-btn {
				position relative
				font-size 14px
				.waring-text {
					position absolute
					right 0
					bottom -20px
					color $fxRed
				}
				.print-style-select {
					margin 0 10px
					width 130px
				}
			}
		}
	}
	&__container {
		flex 1
		display flex
		flex-direction column
		overflow hidden
		overflow-x auto
	}
	&__page-content {
		display flex
		height 20px
		line-height 20px
		&-fixed, &-summary {
			position relative
			text-align center
			background-color $fxOrange1
			border-radius 10px
			color $fxWhite
			font-size 14px
			&::after {
				content ''
				position absolute
				width 1px
				height 9999px
				background-color $fxOrange2
				z-index 999
				right -1px
				top 0
			}
			&-text {
				padding 0 10px
			}
		}
		&-summary {
			margin-left 1px
			background-color $fxBlue1
		}
	}
	&__title {
		line-height: 30px
		font-size: 12px
	}
	&__details {
		flex 1
	}
	&__table {
		border-collapse: collapse
		table-layout: fixed
		&-tr {
			line-height: 30px;
		}
		&-cell {
			min-height 30px
			word-break: break-all
			font-weight: normal
			padding-left: 8px;
			padding-right: 8px;
			text-align center
		}
		&-header-diagonal {
			position absolute
			left -3px
			right -3px
			border-top 1px solid #808080
		}
		&-header-diagonal-label-left {
			float left
		}
		&-header-diagonal-label-right {
			float right
		}
	}
}
</style>

