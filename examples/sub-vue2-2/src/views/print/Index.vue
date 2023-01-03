<template>
	<w-app-container class="print-view" direction="row">
		<div class="print-view__menu">
			<div>ssssss{{$printstore.state.aaa}}</div>
			<el-button
				@click='onTestClick'
			>测试</el-button>
			<el-button type="primary" class="print-btn" @click="onBtnClick">打印预览</el-button>
			<div v-if="listData.length>1" class="print-view__menu-tools">
				<el-button class="print-view__menu-tools-pre" @click="onPrePageClick">上一张</el-button>
				<span class="print-view__menu-tools-count">{{currentPageIndex + 1}} / {{listData.length}}</span>
				<el-button class="print-view__menu-tools-next" @click="onNextPageClick">下一张</el-button>
			</div>
			<div class="print-view_form-filter print-view__box">
				<div v-for="(item, index) in formData" :key="index" class="print-view_form-filter-item">
					<el-checkbox
						v-model="item.visible"
						:label="item.label"
						@change="onFormFilterChange(item)"
					></el-checkbox>
				</div>
			</div>
			<div class="print-view_form-filter print-view__box">
				<div v-for="(item, index) in footerData" :key="index" class="print-view_form-filter-item">
					<el-checkbox
						v-model="item.visible"
						:label="item.label"
						@change="onFooterFilterChange(item)"
					></el-checkbox>
				</div>
			</div>
		</div>
		<div ref="printContainer" :style="containerStyles" class="print-view__container">
			<template v-for="(pageItem, pageIndex) in listData">
				<div
					v-if="pageIndex === currentPageIndex"
					:key="pageIndex"
					:style="containerStyles"
					class="print-view__container-content"
				>
					<div ref="printTile" class="print-view__title" :class="{'print-view__title__is-low': isStylusPrinter}">{{customBillName(pageItem)}}</div>
					<div ref="printForm" class="print-view__form" :class="{'print-view__form__is-low': isStylusPrinter}">
						<transition-group name="transition-form">
							<template v-for="(item) in formVisibleData">
								<div :key="item.id" class='form-item transition-form-item'>
									<div
										:data-fx-Id="item.id"
										class='form-item-container'
										:class="[`form-item-container__${item.id}`]"
										draggable="true"
									>
										<div class="form-item-label">{{item.label}}：</div>
										<div
											:data-fx-prop="item.id"
											:data-fx-numberType="item.numberType?item.numberType:''"
											:data-fx-valueMap="item.valueMap ? JSON.stringify(item.valueMap) : ''"
											:style="{width: `${item.width}px`}"
											:class="[`form-item-value__${transformClassName(item.id)}`]"
											class="form-item-value"
										>{{computedFormItemText(item, pageItem)}}</div>
									</div>
									<div
										class="form-item-resize"
										@mousedown="handleMouseDown($event, item, '.print-view__form', '.print-view__form-resize-proxy', 'resizeProxyVisible')"
									></div>
								</div>
							</template>
						</transition-group>
						<div v-show="resizeProxyVisible" class="print-view__form-resize-proxy"></div>
					</div>
					<div class="print-view__details" :style="{width: `${tableWidth}px`}">
						<fx-details-table
							v-if="resetTable"
							ref="detailsTable"
							:tableColumn="tableColumn"
							:tableData="pageItem.details"
							:showTools="false"
							:selectable="false"
							:stripe="false"
							:canAdd="false"
							:showSummary="isSummary"
							:trHeight="trHeight"
							border
							dragCellKeepTableWidth
							overWidthAutofit
						>
						</fx-details-table>
					</div>
					<div ref="printFooter" class="print-view__footer" :class="{'print-view__footer__is-low': isStylusPrinter}">
						<transition-group name="transition-form">
							<template v-for="(item) in footerVisibleData">
								<div :key="item.id" class='form-item transition-form-item'>
									<div
										:data-fx-Id="item.id"
										class='form-item-container'
										:class="[`form-item-container__${item.id}`]"
										draggable="true"
									>
										<div class="form-item-label">{{item.label}}：</div>
										<div
											:data-fx-prop="item.id"
											:data-fx-numberType="item.numberType?item.numberType:''"
											:data-fx-valueMap="item.valueMap ? JSON.stringify(item.valueMap) : ''"
											:style="{width: `${item.width}px`}"
											:class="[`form-item-value__${transformClassName(item.id)}`]"
											class="form-item-value"
										>{{computedFormItemText(item, pageItem)}}</div>
									</div>
									<div
										class="form-item-resize"
										@mousedown="handleMouseDown($event, item, '.print-view__footer', '.print-view__form-resize-proxy', 'resizeProxyFooterVisible')"
									></div>
								</div>
							</template>
						</transition-group>
						<div v-show="resizeProxyFooterVisible" class="print-view__form-resize-proxy"></div>
						<div v-show="isStylusPrinter" class="print-view__footer-page">
							第<div class="print-view__footer-page-num">n</div>/<div class="print-view__footer-page-total">n</div>页
						</div>
					</div>
				</div>
			</template>
		</div>
		<div class="print-view__form-tools">
			<div class="print-view_column-filter print-view__box">
				<div v-for="(item, index) in tableColumn" :key="index" class="print-view_column-filter-item">
					<el-checkbox
						v-model="item.visible"
						:label="item.label"
					></el-checkbox>
				</div>
			</div>
			<div class="print-view_template print-view__box">
				<div class="print-view__template-title">打印字体</div>
				<w-select
					v-model="currentFontSize"
					:optionlist="fontSizeSelectList"
					class="print-view__template-select"
				></w-select>
			</div>
			<div class="print-view_template print-view__box">
				<div class="print-view__template-title">纸张尺寸</div>
				<w-select
					v-model="currentPrintSize"
					:optionlist="printSizeList"
					class="print-view__template-select"
				></w-select>
			</div>
			<div class="print-view_template print-view__box">
				<div class="print-view__template-title">打印模板</div>
				<w-select
					v-model="currentPrintTemplate"
					:optionlist="printTemplateList"
					class="print-view__template-select"
					@change="onTemplateChange"
				></w-select>
				<div class="print-view__template-btn-tools">
					<el-button class="print-view__template-btn" @click="onAddClick">新增</el-button>
					<el-button class="print-view__template-btn" @click="onSaveClick">保存</el-button>
					<el-button class="print-view__template-btn" @click="onDeleteClick">删除</el-button>
				</div>
			</div>
		</div>
		<createDialog ref="createDialog" @on-save="onAddTemplate"></createDialog>
	</w-app-container>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import createDialog from './components/CreateDialog.vue'
import BILL_NAME_CONFIG from '@/router/billNameConfig.js'
const FORM_CHILD_CLASS = ['form-item-label', 'form-item-value']
const PRINT_SIZE = [{
	id: 'a4-row',
	width: 1123,
	height: 794,
	name: 'A4纸横向'
}, {
	id: 'a4-column',
	width: 794,
	height: 1123,
	name: 'A4纸纵向'
}, {
	id: 'whole',
	width: 720,
	height: 970,
	name: '一等分'
}, {
	id: 'halve',
	width: 720,
	height: 485,
	name: '二等分'
}, {
	id: 'trisection',
	width: 720,
	height: 330,
	name: '三等分'
}]
const ENUM_NUMBER_TYPE = {
	amount: 'sysPointSize',
	money: 'sysMoneyPointSize',
	default: 'sysPricePointSize'
}
const FONT_SIZE_TYPE = [{
	id: '12px',
	name: '12px'
}, {
	id: '13px',
	name: '13px'
}, {
	id: '14px',
	name: '14px'
}, {
	id: '15px',
	name: '15px'
}, {
	id: '16px',
	name: '16px'
}, {
	id: '17px',
	name: '17px'
}, {
	id: '18px',
	name: '18px'
}, {
	id: '19px',
	name: '19px'
}, {
	id: '20px',
	name: '20px'
}]
const fxPrintRegular = /\/\*fx-print-style\*\//
export default {
	name: 'print',
	components: {
		createDialog
	},
	data () {
		return {
			apiName: 'print',
			source: 'scm8',
			billType: '',
			billId: [],
			billName: '',
			currentPageIndex: 0,
			listData: [],
			formData: [],
			formVisibleData: [],
			footerData: [],
			footerVisibleData: [],
			tableColumn: [],
			resizeProxyVisible: false,
			resizeProxyFooterVisible: false,
			dragging: true,
			dragState: {},
			printTemplateList: [],
			currentPrintTemplate: '',
			printSizeList: PRINT_SIZE,
			currentPrintSize: 'a4-row',
			resetTable: true,
			printOnloadPolling: this.$fxUtils.polling(),
			currentFontSize: '12px',
			fontSizeSelectList: FONT_SIZE_TYPE
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize,
			sysPricePointSize: state => state.system.sysPricePointSize,
			sysPointSize: state => state.system.sysPointSize
		}),
		...mapGetters(['getSysParams']),
		systemParamPrintSumIsSumBill () {
			return true
		},
		customBillName () {
			return (item) => {
				const customName = BILL_NAME_CONFIG[this.source][this.billType].custom
				const billName = (customName && item[customName]) ? item[customName] : this.billName
				return 	billName
			}
		},
		containerStyles () {
			const size = this.currentPrintSizeObj
			return {
				width: `${size.width}px`
			}
		},
		tableWidth () {
			const size = this.currentPrintSizeObj
			return size.width
		},
		currentPrintSizeObj () {
			return this.printSizeList.find(item => {
				return item.id === this.currentPrintSize
			})
		},
		currentPrintTemplateObj () {
			return this.printTemplateList.find(item => item.id === this.currentPrintTemplate)
		},
		isSummary () {
			return this.tableColumn.some(item => item.summary && item.visible)
		},
		isStylusPrinter () {
			return ['whole', 'halve', 'trisection'].includes(this.currentPrintSize)
		},
		trHeight () {
			return this.isStylusPrinter ? 25 : 30
		}
	},
	watch: {
		tableWidth () {
			this.$nextTick(() => {
				if (this.$refs.detailsTable[0]) this.$refs.detailsTable[0].doLayout()
			})
		},
		trHeight () {
			this.resetTable = false
			this.$nextTick(() => {
				this.resetTable = true
			})
		}
	},
	created () {
		this.getRouteParams()
			.then(this.getTemplateList)
			.then(this.getTemplateDetails)
			.then(this.getBillPrintData)
	},
	mounted () {
		this.bindDargEvent()
	},
	methods: {
		getRouteParams () {
			console.log(this.$route)
			this.billType = this.$route.query.billType
			this.source = this.$route.query.source
			let billId = this.$route.query.billId
			if (!Array.isArray(billId)) {
				billId = [billId]
			}
			this.billId = billId
			this.billName = BILL_NAME_CONFIG[this.source][this.billType].name
			this.$store.commit('SET_LOGINER', {
				authorizationMes: this.$route.query.authorizationMes,
				token: this.$route.query.authorization
			})
			this.$store.commit('SET_STYLUS_DYNAMIC', {
				appTheme: this.$route.query.source
			})
			return Promise.resolve()
		},
		computedFormItemText (item, pageItem) {
			return this.normalizationValueByNumberType(this.normalizationValueByValueMap(this.getCellText(pageItem, item.id), item.valueMap), item.numberType)
		},
		getTemplateList () {
			return this.getTemplateListHandler().then(res => {
				this.currentPrintTemplate = res[0].id
				return Promise.resolve(res)
			})
		},
		getTemplateListHandler () {
			return this.$fxApi(`${this.apiName}.getTemplateList`, this.billType).then(res => {
				this.printTemplateList = res
				return Promise.resolve(res)
			})
		},
		getTemplateDetails () {
			return this.$fxApi(`${this.apiName}.getTemplateDetails`, this.billType, this.currentPrintTemplate).then(res => {
				this.initTableColumn(res)
				this.initFormData(res)
				this.initFooterData(res)
				return Promise.resolve(res)
			})
		},
		getBillPrintData () {
			return this.$fxApi(`${this.apiName}.getPrintData`, this.billType)({ data: this.billId }).then(res => {
				if (!Array.isArray(res)) {
					res = [res]
				}
				this.listData = res
				return Promise.resolve(res)
			})
		},
		enumNumerType (str) {
			return this[ENUM_NUMBER_TYPE[str] || ENUM_NUMBER_TYPE.default]
		},
		initTableColumn (res) {
			const columnData = res.all.details
			const visiableColumns = res.visiable.details
			columnData.forEach(item => {
				item.prop = item.field
				const col = visiableColumns.find(visiableItem => {
					return visiableItem.field === item.field
				})
				if (col) {
					item.width = col.width
					item.visible = true
				} else {
					item.width = 100
					item.visible = false
				}
				if (item.numberType === 'amount') {
					item.summary = true
					item.summaryFormatter = this.summaryFormatterAmount
				}
				if (item.numberType === 'money') {
					item.summary = true
					item.summaryFormatter = this.summaryFormatterMoney
				}
				item.formatter = this.tableColumFormatter(item)
			})
			this.tableColumn = columnData
		},
		tableColumFormatter (columnItem) {
			return (row) => {
				const cellValue = this.getCellText(row, columnItem.field)
				if (columnItem.dataType === 'List') {
					return this.normalizationValueByList(cellValue, columnItem.dataValue)
				} else if (cellValue === '') {
					return '---'
				} else {
					return this.normalizationValueByNumberType(this.normalizationValueByValueMap(cellValue, columnItem.valueMap), columnItem.numberType)
				}
			}
		},
		summaryFormatterAmount (val) {
			return this.$fxCommon.toFixedAutoZeroFill(val, this.sysPointSize)
		},
		summaryFormatterMoney (val) {
			return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
		},
		initFormData (res) {
			const formData = res.all.main.header
			const formSort = res.visiable.main.header
			const formKeys = formData.map(item => item.field)
			formSort.forEach(item => {
				item.id = item.field
			})
			formData.forEach(item => {
				item.id = item.field
				const col = formSort.find(sortItem => {
					return sortItem.id === item.id
				})
				if (col) {
					item.visible = true
					item.width = col.width
				} else {
					item.visible = false
					item.width = 100
				}
			})
			this.formData = formData
			this.formVisibleData = formSort.filter(item => {
				return formKeys.includes(item.id)
			})
		},
		initFooterData (res) {
			const formData = res.all.main.footer
			const formSort = res.visiable.main.footer
			const formKeys = formData.map(item => item.field)
			formSort.forEach(item => {
				item.id = item.field
			})
			formData.forEach(item => {
				item.id = item.field
				const col = formSort.find(sortItem => {
					return sortItem.id === item.id
				})
				if (col) {
					item.visible = true
					item.width = col.width
				} else {
					item.visible = false
					item.width = 100
				}
			})
			this.footerData = formData
			this.footerVisibleData = formSort.filter(item => {
				return formKeys.includes(item.field)
			})
		},
		onBtnClick () {
			this.printHandler()
		},
		printHandler () {
			var iframe = document.createElement('IFRAME')
			var doc = null
			iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;')
			document.body.appendChild(iframe)
			doc = iframe.contentWindow.document
			this.createStyle(doc.head)
			let canPrint = true
			if (this.isStylusPrinter) {
				canPrint = this.createPrintPageForStylusPrinter(doc.body)
			} else {
				this.createPrintPage(doc.body)
			}
			if (canPrint) {
				this.printOnloadPolling.start(200, (next, end) => {
					const titleFontSize = window.getComputedStyle(doc.querySelector('.print-view__title'), null)['font-size']
					const onload = titleFontSize === '30px' || titleFontSize === '20px'
					if (onload) {
						end()
						iframe.contentWindow.print()
						document.body.removeChild(iframe)
					} else {
						next()
					}
				})
			}
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
			this.listData.forEach((item, index) => {
				parent.appendChild(this.createTitle(item))
				parent.appendChild(this.createForm(item))
				parent.appendChild(this.createTable(item, index))
				parent.appendChild(this.createFooter(item))
				parent.appendChild(this.createPrintGagination())
			})
		},
		createPrintPageForStylusPrinter (parent) {
			for (const item of this.listData) {
				const printTileHeight = this.$refs.printTile[0].offsetHeight
				const printFormHeight = this.$refs.printForm[0].offsetHeight
				const printFooterHeight = this.$refs.printFooter[0].offsetHeight
				const fixedHeight = printTileHeight + printFormHeight + printFooterHeight + 50
				const remainHeight = this.currentPrintSizeObj.height - fixedHeight
				const tableRows = Math.floor(remainHeight / 25) - 2
				if (tableRows <= 0) {
					this.$fxMessage.warning('表头表尾字段过多，为打印效果，请删减部分表头表尾字段')
					return false
				}
				const splitTableNum = Math.ceil(item.details.length / tableRows)
				for (let index = 0; index < splitTableNum; index++) {
					parent.appendChild(this.createTitle(item))
					parent.appendChild(this.createForm(item))
					parent.appendChild(this.createTable(item, index, index * tableRows, index * tableRows + tableRows))
					parent.appendChild(this.createFooter(item, index + 1, splitTableNum))
					parent.appendChild(this.createPrintGagination())
				}
			}
			return true
		},
		setFxElValue (el, data) {
			if (el.nodeType === 1) {
				const fxProp = el.dataset.fxProp
				const fxValueMap = el.dataset.fxValuemap
				const fxNumberType = el.dataset.fxNumbertype
				if (fxProp) {
					let _value = this.getCellText(data, fxProp)
					if (fxValueMap) {
						const _fxValueMap = this.$fxUtils.JSONparse(fxValueMap)
						_value = _fxValueMap[_value]
					}
					el.innerHTML = this.$fxUtils.isDef(_value) ? this.normalizationValueByNumberType(_value, fxNumberType) : ''
				}
				if (el.childNodes.length > 0) {
					Array.prototype.forEach.call(el.childNodes, item => {
						this.setFxElValue(item, data)
					})
				}
			}
		},
		normalizationValueByValueMap (value, valueMap) {
			if (valueMap) {
				return valueMap[`${value}`]
			}
			return value
		},
		normalizationValueByList (value, dataValue) {
			return value.map(item => item[dataValue]).join(',')
		},
		normalizationValueByNumberType (value, fxNumberType) {
			if (!fxNumberType) {
				return value
			}
			return this.$fxCommon.toFixedAutoZeroFill(value, this.enumNumerType(fxNumberType))
		},
		setFooterPage (el, pageNum, pageTotal) {
			const numEl = el.querySelector('.print-view__footer-page-num')
			const totalEl = el.querySelector('.print-view__footer-page-total')
			numEl.innerHTML = pageNum
			totalEl.innerHTML = pageTotal
		},
		createTitle (listData) {
			const titleEl = this.$refs.printTile[0].cloneNode(true)
			this.setFxElValue(titleEl, listData)
			return titleEl
		},
		createForm (listData) {
			const formEl = this.$refs.printForm[0].cloneNode(true)
			this.setFxElValue(formEl, listData)
			formEl.setAttribute('style', `font-size:${this.currentFontSize}`)
			if (this.isStylusPrinter) {
				formEl.setAttribute('style', `width:${this.currentPrintSizeObj.width}px;margin: 0 auto 5px;font-size:12px`)
			}
			return formEl
		},
		createFooter (listData, pageNum, pageTotal) {
			const footerEl = this.$refs.printFooter[0].cloneNode(true)
			this.setFxElValue(footerEl, listData)
			footerEl.setAttribute('style', `font-size:${this.currentFontSize}`)
			if (this.isStylusPrinter) {
				this.setFooterPage(footerEl, pageNum, pageTotal)
				footerEl.setAttribute('style', `width:${this.currentPrintSizeObj.width}px;margin: 5px auto 20px;font-size:12px`)
			}
			return footerEl
		},
		createTable (listData, listPageIndex, startIndex, endIndex) {
			const detailsEl = this.$refs.detailsTable[0].$el
			var table = document.createElement('table')
			table.setAttribute('style', `width:${this.tableWidth}px;font-size:${this.currentFontSize}`)
			table.border = '1'
			table.classList.add('print-view__table')
			if (this.isStylusPrinter) {
				table.classList.add('print-view__table__is-low')
			}
			const colgroup = document.createElement('colgroup')
			const colList = detailsEl.querySelector('.wind-virtual-table__right').querySelector('colgroup').querySelectorAll('col')
			colList.forEach(item => {
				const col = document.createElement('col')
				col.width = item.width
				colgroup.appendChild(col)
			})
			const thead = document.createElement('thead')
			const headtr = document.createElement('tr')
			headtr.classList.add('print-view__table-tr')
			const _tableColumn = this.$fxUtils.deepClone(this.tableColumn.filter(item => item.visible))
			_tableColumn.unshift({
				prop: 'index',
				label: '序号'
			})
			_tableColumn.forEach(item => {
				const td = document.createElement('th')
				const div = document.createElement('div')
				div.classList.add('print-view__table-cell')
				if (item.prop === 'index') {
					div.innerHTML = '序号'
					div.classList.add('print-view__table-cell-index')
				} else {
					div.innerHTML = item.label
				}
				td.appendChild(div)
				headtr.appendChild(td)
			})
			thead.appendChild(headtr)
			const tbody = document.createElement('tbody')
			let details = listData.details
			if (this.isStylusPrinter) {
				details = listData.details.slice(startIndex, endIndex)
			}
			details.forEach((listItem, listIndex) => {
				const bodytr = document.createElement('tr')
				bodytr.classList.add('print-view__table-tr')
				_tableColumn.forEach(item => {
					const td = document.createElement('td')
					const div = document.createElement('div')
					div.classList.add('print-view__table-cell')
					if (item.prop === 'index') {
						this.renderTableCellIndex(div, listItem, listIndex, startIndex)
					} else if (item.valueMap) {
						this.renderTableCellValueMap(div, listItem, listIndex, item)
					} else if (item.dataType === 'List') {
						this.renderTableCellList(div, listItem, listIndex, item)
					} else {
						this.renderTableCell(div, listItem, listIndex, item)
					}
					td.appendChild(div)
					bodytr.appendChild(td)
				})
				tbody.appendChild(bodytr)
			})
			if (this.isSummary) {
				const summaryDetails = this.systemParamPrintSumIsSumBill ? listData.details : details
				const summaryData = this.$refs.detailsTable[0].getSummaryData(summaryDetails)
				const summaryTr = document.createElement('tr')
				summaryTr.classList.add('print-view__table-tr')
				_tableColumn.forEach(item => {
					const td = document.createElement('td')
					const div = document.createElement('div')
					div.classList.add('print-view__table-cell')
					if (item.prop === 'index') {
						div.innerHTML = this.isStylusPrinter && !this.systemParamPrintSumIsSumBill ? '小计' : '合计'
						div.classList.add('print-view__table-cell-index')
					} else if (item.summary) {
						div.innerHTML = this.$fxUtils.isDef(summaryData[item.prop]) ? summaryData[item.prop] : ''
					}
					td.appendChild(div)
					summaryTr.appendChild(td)
				})
				tbody.appendChild(summaryTr)
			}
			table.appendChild(colgroup)
			table.appendChild(thead)
			table.appendChild(tbody)
			return table
		},
		renderTableCellIndex (div, listItem, listIndex, startIndex = 0) {
			div.innerHTML = listIndex + 1 + startIndex
			div.classList.add('print-view__table-cell-index')
		},
		renderTableCellValueMap (div, listItem, listIndex, cellItem) {
			div.innerHTML = this.normalizationValueByNumberType(this.normalizationValueByValueMap(listItem[cellItem.field], cellItem.valueMap), cellItem.numberType)
		},
		renderTableCellList (div, listItem, listIndex, cellItem) {
			div.innerHTML = this.normalizationValueByList(listItem[cellItem.field], cellItem.dataValue)
		},
		renderTableCell (div, listItem, listIndex, cellItem) {
			div.innerHTML = this.normalizationValueByNumberType(this.getCellText(listItem, cellItem.prop), cellItem.numberType)
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
			return this.formatteDate(val)
		},
		formatteDate (date) {
			if (/^\d{4}\-\d{2}-\d{2}\s\d{2}\:\d{2}\:\d{2}$/.test(date)) {
				return date.slice(0, -3)
			}
			return date
		},
		bindDargEvent () {
			let dragDom = null
			let formEl = null
			const dragEl = this.$refs.printContainer
			dragEl.addEventListener('dragstart', (e) => {
				e.stopPropagation()
				if (!e.target.classList.contains('form-item-container')) {
					e.preventDefault()
					return false
				}
				dragDom = e.target
				formEl = this.getCurrentFormEl(dragDom)
			}, true)
			dragEl.addEventListener('dragover', (e) => {
				e.stopPropagation()
				e.preventDefault()
			}, true)
			dragEl.addEventListener('drop', (e) => {
				e.stopPropagation()
				if (formEl.contains(e.target) && this.isFormChild(e.target.classList)) {
					const target = e.target.parentNode
					if (dragDom !== target) {
						target.classList.remove('drog-active')
						const formData = this.getCurrentFormData(formEl)
						const newIndex = this.getDrogTrueIndex(target, formData)
						const oldIndex = this.getDrogTrueIndex(dragDom, formData)
						formData.splice(newIndex, 0, formData.splice(oldIndex, 1)[0])
					}
				}
			}, true)
			dragEl.addEventListener('dragenter', (e) => {
				e.stopPropagation()
				if (formEl.contains(e.target) && this.isFormChild(e.target.classList, formEl)) {
					const target = e.target.parentNode
					setTimeout(() => {
						if (dragDom !== target) {
							Array.prototype.forEach.call(formEl.querySelectorAll('.form-item-container'), item => {
								item.classList.remove('drog-active')
							})
							target.classList.add('drog-active')
						}
					}, 0)
				}
			}, true)
			dragEl.addEventListener('dragleave', (e) => {
				e.stopPropagation()
				if (formEl.contains(e.target) && this.isFormChild(e.target.classList)) {
					const target = e.target.parentNode
					if (dragDom !== target) {
						target.classList.remove('drog-active')
					}
				}
			}, true)
		},
		isFormChild (classList) {
			return FORM_CHILD_CLASS.some(item => {
				return classList.contains(item)
			})
		},
		getCurrentFormEl (dragDom) {
			var parentNode
			parentNode = dragDom.parentNode
			while (parentNode) {
				if (parentNode.classList.contains('print-view__form') || parentNode.classList.contains('print-view__footer')) {
					return parentNode
				}
				parentNode = parentNode.parentNode
			}
			return false
		},
		getCurrentFormData (formEl) {
			return formEl.classList.contains('print-view__form') ? this.formVisibleData : this.footerVisibleData
		},
		getDrogTrueIndex (target, formData) {
			return formData.findIndex(item => {
				return item.id === target.dataset.fxId
			})
		},
		onFormFilterChange (form) {
			if (!form.visible) {
				const index = this.formVisibleData.findIndex(item => {
					return item.id === form.id
				})
				this.formVisibleData.splice(index, 1)
			} else {
				this.formVisibleData.push(form)
			}
		},
		onFooterFilterChange (form) {
			if (!form.visible) {
				const index = this.footerVisibleData.findIndex(item => {
					return item.id === form.id
				})
				this.footerVisibleData.splice(index, 1)
			} else {
				this.footerVisibleData.push(form)
			}
		},
		handleMouseDown (event, form, formClass, resizeProxyClass, resizeProxyVisible) {
			this.dragging = true
			this[resizeProxyVisible] = true
			const formEl = this.$refs.printContainer.querySelector(formClass)
			const formLeft = formEl.getBoundingClientRect().left
			const containerEl = formEl.querySelector(`.form-item-value__${this.transformClassName(form.id)}`)
			const containerRect = containerEl.getBoundingClientRect()
			const minLeft = containerRect.left - formLeft + 30
			this.dragState = {
				startMouseLeft: event.clientX,
				startLeft: containerRect.right - formLeft,
				startColumnLeft: containerRect.left - formLeft,
				formLeft
			}
			const resizeProxy = formEl.querySelector(resizeProxyClass)
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
					let formWidth = finalLeft - startColumnLeft
					document.body.style.cursor = ''
					this.dragging = false
					this.dragState = {}
					this[resizeProxyVisible] = false
					formWidth = Math.max(Math.min(600, formWidth), 60)
					form.width = formWidth
				}
				document.removeEventListener('mousemove', handleMouseMove)
				document.removeEventListener('mouseup', handleMouseUp)
				document.onselectstart = null
				document.ondragstart = null
			}
			document.addEventListener('mousemove', handleMouseMove)
			document.addEventListener('mouseup', handleMouseUp)
		},
		createPrintGagination (parent) {
			const el = document.createElement('div')
			el.setAttribute('style', 'page-break-after: always;')
			return el
		},
		onPrePageClick () {
			if (this.currentPageIndex === 0) {
				this.currentPageIndex = this.listData.length - 1
				return false
			}
			this.currentPageIndex--
		},
		onNextPageClick () {
			if (this.currentPageIndex === this.listData.length - 1) {
				this.currentPageIndex = 0
				return false
			}
			this.currentPageIndex++
		},
		onAddClick () {
			this.$refs.createDialog.open()
		},
		onAddTemplate (name) {
			this.onAddTemplateHandler(name)
				.then(this.getTemplateListHandler)
		},
		onAddTemplateHandler (name) {
			return this.$fxApi(`${this.apiName}.addTemplate`)({ data: this.getTemplateParams(name) }).then(res => {
				return Promise.resolve(res)
			})
		},
		onSaveClick () {
			this.checkTemplateParams().then(params => {
				this.$fxApi(`${this.apiName}.updateTemplate`, this.currentPrintTemplate)({ data: params }).then(res => {
					return Promise.resolve(res)
				})
			})
		},
		onDeleteClick () {
			this.$fxConfirm('是否确定删除当前打印模板？')
				.then(this.onDelTemplateHandler)
				.then(this.getTemplateList)
				.then(this.getTemplateDetails)
		},
		onDelTemplateHandler () {
			return this.$fxApi(`${this.apiName}.delTemplate`, this.currentPrintTemplate).then(res => {
				return Promise.resolve(res)
			})
		},
		checkTemplateParams () {
			return new Promise(resolve => {
				const cols = this.$refs.detailsTable[0].getVisibleColumns()
				if (this.formVisibleData.length === 0) {
					this.$fxMessage.warning('表头信息不能为空')
				} else if (this.footerVisibleData.length === 0) {
					this.$fxMessage.warning('表尾信息不能为空')
				} else if (cols.length === 0) {
					this.$fxMessage.warning('明细列不能为空')
				} else {
					resolve(this.getTemplateParams())
				}
			})
		},
		getTemplateParams (name) {
			if (!name) {
				name = this.currentPrintTemplateObj.name
			}
			const cols = this.$refs.detailsTable[0].getVisibleColumns()
			cols.forEach(item => {
				item.field = item.prop
			})
			return {
				name,
				billType: this.billType,
				formData: {
					details: cols,
					header: this.formVisibleData,
					footer: this.footerVisibleData
				}
			}
		},
		onTemplateChange (item) {
			this.getTemplateDetails(item)
		},
		transformClassName (name) {
			return name.replace(/\./, '-')
		},
		onTestClick () {
			this.$printstore.setData()
		}
	}
}
</script>
<style id="printStyle" title="printStyle" lang="stylus">
@import '~$assets/stylus/varsty.styl'
/*fx-print-style*/
.print-view {
	height: 100%
	overflow:auto
	.print-view__box {
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
	}
	&__menu {
		width: 240px
		min-width: 240px;
		margin-left: 20px
		margin-right: 20px
		&-tools {
			margin: 20px 0
			display: flex
			align-items: center
			&-count {
				text-align: center
				flex: 1
			}
		}
		.print-btn {
			margin-top:20px
		}
	}
	&__form-tools {
		width: 240px
		margin-left: 20px
		display: flex
		flex-direction: column
		.print-view__template-title {
			height:40px
			line-height: 40px
		}
		.print-view__template-select {
			width: 100%
			margin-bottom: 20px
		}
		.print-view__template-btn-tools {
			display: flex
		}
		.print-view__template-btn {
			width: 60px
		}
	}
	.print-view_column-filter, .print-view_template, .print-view_form-filter {
		margin-top: 20px
		box-sizing: border-box
		padding: 20px
	}
	.print-view_column-filter {
		height 500px
		overflow: auto
	}
	&__container {
		position: relative
		&-content {
			height: 100%
			display: flex
			flex-direction: column
		}
	}
	&__title {
		height: 80px
		line-height: 80px
		font-size: 30px
		font-weight: 900
		text-align: center
		&__is-low {
			padding-top 5px
			height: 45px
			line-height: 45px
			font-size: 20px
			font-weight: 700
		}
	}
	&__form {
		margin-bottom: 20px
		&__is-low {
			padding 0 !important
			margin-bottom: 5px
			.form-item {
				height 20px !important
				line-height 20px !important
			}
		}
	}
	&__footer {
		display: flex
		justify-content: space-between
		margin: 10px 0 20px 0
		span {
			flex 1
		}
		&__is-low {
			padding 0 !important
			margin: 5px 0 20px
			.form-item {
				height 20px !important
				line-height 20px !important
			}
		}
		&-page {
			display: flex
			align-items: flex-end
			font-size: 12px
			&-num,&-total {
				padding 0 5px
			}
		}
	}
	&__form, &__footer {
		padding: 0 20px
		position: relative
		.form-item {
			display: inline-block
			height: 30px
			line-height: 30px
			padding-right: 35px
			position: relative
			.form-item-container {
				cursor: move
				border-radius: 4px
				display: flex;
				&.drog-active {
					background-color:$fxLightBlue1
					color: $fxWhite
				}
			}
			&-label {
				display: inline-block
			}
			&-value {
				display: inline-block
				border-bottom: 1px solid gray
				white-space: nowrap;
				overflow: hidden;
			}
		}
	}
	.form-item-resize {
		position: absolute
		top: 5px
		bottom: 0
		right: 10px
		cursor: col-resize
		width: 20px
		height: 26px
	}
	&__form-resize-proxy {
		position: absolute;
		left: 200px;
		top: 0;
		bottom: 0;
		width: 0;
		border-left: 1px solid #EBEEF5;
		z-index: 10;
	}
	&__details {
		flex: 1
	}
	&__table {
		margin: 0 auto
		// width:794px
		// width:1123px
		border-collapse:collapse
		table-layout:fixed
		margin-left:20px
		margin:0 auto
		&-tr {
			line-height: 30px;
		}
		&-cell {
			line-height: 30px;
			word-break: break-all
			font-weight: normal
			padding-left: 8px;
			padding-right: 8px;
			&-index {
				text-align: center
			}
		}
		&__is-low {
			.print-view__table-tr {
				height 25px
			}
			.print-view__table-cell {
				overflow: hidden
				text-overflow: ellipsis
				white-space: nowrap
				line-height 22px
				height 22px
			}
		}
	}
	.transition-form-item{
		transition: all .5s
	}
	.transition-form-enter, transition-form-leave-to{
		opacity: 0
	}
}
</style>

