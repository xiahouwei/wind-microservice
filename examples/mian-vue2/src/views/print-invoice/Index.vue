<template>
	<w-app-container class="invoice-print-view" direction="row">
		<div class="invoice-print-view__menu">
			<el-button type="primary" class="print-btn" @click="onBtnClick">打印预览</el-button>
			<div v-if="listData.length>1" class="invoice-print-view__menu-tools">
				<el-button class="invoice-print-view__menu-tools-pre" @click="onPrePageClick">上一张</el-button>
				<span class="invoice-print-view__menu-tools-count">{{currentPageIndex + 1}} / {{listData.length}}</span>
				<el-button class="invoice-print-view__menu-tools-next" @click="onNextPageClick">下一张</el-button>
			</div>
			<div class="invoice-print-view_form-filter invoice-print-view__box">
				<div v-for="(item, index) in formData" :key="index" class="invoice-print-view_form-filter-item">
					<el-checkbox
						v-model="item.visible"
						:label="item.label"
						disabled
						@change="onFormFilterChange(item)"
					></el-checkbox>
				</div>
			</div>
			<div class="invoice-print-view_form-filter invoice-print-view__box">
				<div v-for="(item, index) in footerData" :key="index" class="invoice-print-view_form-filter-item">
					<el-checkbox
						v-model="item.visible"
						:label="item.label"
						disabled
						@change="onFooterFilterChange(item)"
					></el-checkbox>
				</div>
			</div>
		</div>
		<div ref="printContainer" :style="containerStyles" class="invoice-print-view__container">
			<template v-for="(pageItem, pageIndex) in listData">
				<div
					v-if="pageIndex === currentPageIndex"
					:key="pageIndex"
					:style="{width: `${tableWidth}px`}"
					class="invoice-print-view__container-content"
				>
					<div ref="printTile" class="invoice-print-view__title">{{billName}}</div>
					<div ref="printForm" class="invoice-print-view__form">
						<div class="form-row">
							<div class='form-item form-item-margin' >
								<div class="form-item-label">发票类型：</div>
								<div
									data-fx-prop="invoicingType.name"
									class="form-item-value"
								>{{getCellText(pageItem, 'invoicingType.name')}}</div>
							</div>
							<div class='form-item form-item-margin' >
								<div class="form-item-label">发票号码：</div>
								<div
									data-fx-prop="invoicingCode"
									class="form-item-value"
								>{{getCellText(pageItem, 'invoicingCode')}}</div>
							</div>
							<div class='form-item' >
								<div class="form-item-label">开票日期：</div>
								<div
									data-fx-prop="invoicingDate"
									class="form-item-value"
								>{{getCellText(pageItem, 'invoicingDate')}}</div>
							</div>
						</div>
						<div class="detials-form-row">
							<div class="form-row-flex__left">
								<div class="form-row-flex-label">采购方信息：</div>
								<div class='form-item' >
									<div class="form-item-label">名称：</div>
									<div
										data-fx-prop="purchaseOrgan.name"
										class="form-item-value"
									>{{getCellText(pageItem, 'purchaseOrgan.name')}}</div>
								</div>
								<div class='form-item' >
									<div class="form-item-label">税号：</div>
									<div
										data-fx-prop="purchaseTaxNO"
										class="form-item-value"
									>{{getCellText(pageItem, 'purchaseTaxNO')}}</div>
								</div>
								<div class='form-item' >
									<div class="form-item-label">地址/电话：</div>
									<div
										data-fx-prop="purchaseAddr"
										class="form-item-value"
									>{{getCellText(pageItem, 'purchaseAddr')}}</div>
									<span class="divided-symbols">/</span>
									<div
										data-fx-prop="purchasePhone"
										class="form-item-value"
									>{{getCellText(pageItem, 'purchasePhone')}}</div>
								</div>
								<div class='form-item' >
									<div class="form-item-label">开户行/账号：</div>
									<div
										data-fx-prop="purchaseBankName"
										class="form-item-value"
									>{{getCellText(pageItem, 'purchaseBankName')}}</div>
									<span class="divided-symbols">/</span>
									<div
										data-fx-prop="purchaseBankAccount"
										class="form-item-value"
									>{{getCellText(pageItem, 'purchaseBankAccount')}}</div>
								</div>
							</div>
							<div class="form-row-flex__right">
								<div class="form-row-flex-label">销售方信息：</div>
								<div class='form-item' >
									<div class="form-item-label">名称：</div>
									<div
										data-fx-prop="salesOrgan.name"
										class="form-item-value"
									>{{getCellText(pageItem, 'salesOrgan.name')}}</div>
								</div>
								<div class='form-item' >
									<div class="form-item-label">税号：</div>
									<div
										data-fx-prop="salesTaxNO"
										class="form-item-value"
									>{{getCellText(pageItem, 'salesTaxNO')}}</div>
								</div>
								<div class='form-item' >
									<div class="form-item-label">地址/电话：</div>
									<div
										data-fx-prop="salesAddr"
										class="form-item-value"
									>{{getCellText(pageItem, 'salesAddr')}}</div>
									<span class="divided-symbols">/</span>
									<div
										data-fx-prop="salesPhone"
										class="form-item-value"
									>{{getCellText(pageItem, 'salesPhone')}}</div>
								</div>
								<div class='form-item' >
									<div class="form-item-label">开户行/账号：</div>
									<div
										data-fx-prop="salesBankName"
										class="form-item-value"
									>{{getCellText(pageItem, 'salesBankName')}}</div>
									<span class="divided-symbols">/</span>
									<div
										data-fx-prop="salesBankAccount"
										class="form-item-value"
									>{{getCellText(pageItem, 'salesBankAccount')}}</div>
								</div>
							</div>
						</div>
					</div>
					<div class="invoice-print-view__details" :style="{width: `${tableWidth}px`}">
						<fx-details-table
							ref="detailsTable"
							:tableColumn="tableColumn"
							:tableData="pageItem.details"
							:showTools="false"
							:selectable="false"
							:stripe="false"
							:canAdd="false"
							border
							dragCellKeepTableWidth
							overWidthAutofit
						>
						</fx-details-table>
					</div>
					<div ref="printFooter" class="invoice-print-view__footer">
						<div class="detials-form-row">
							<div class="form-row-flex__left">
								<div class='form-item' >
									<div class="form-item-label">价税合计：</div>
									<div
										data-fx-prop="totalMoney"
										class="form-item-value"
									>{{getCellText(pageItem, 'totalMoney')}}</div>
								</div>
							</div>
							<div class="form-row-flex__right">
								<div class='form-item' >
									<div class="form-item-label form-item-label-large">价税合计（大写）：</div>
									<div
										data-fx-prop="totalMoneyInWords"
										class="form-item-value"
									>{{getCellText(pageItem, 'totalMoneyInWords')}}</div>
								</div>
							</div>
						</div>
						<div class="detials-form-row">
							<div class='form-item' >
								<div class="form-item-label">备注：</div>
								<div
									data-fx-prop="memo"
									class="form-item-value"
								>{{getCellText(pageItem, 'memo')}}</div>
							</div>
						</div>
						<div class="detials-form-row">
							<div class="form-row-flex__left">
								<div class='form-item' >
									<div class="form-item-label">经办人：</div>
									<div
										data-fx-prop="operatorMan.name"
										class="form-item-value"
									>{{getCellText(pageItem, 'operatorMan.name')}}</div>
								</div>
							</div>
							<div class="form-row-flex__right">
								<div class='form-item' >
									<div class="form-item-label">生成日期：</div>
									<div
										data-fx-prop="generateDate"
										class="form-item-value"
									>{{getCellText(pageItem, 'generateDate')}}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</template>
		</div>
		<div class="invoice-print-view__form-tools">
			<div class="invoice-print-view_column-filter invoice-print-view__box">
				<div v-for="(item, index) in tableColumn" :key="index" class="invoice-print-view_column-filter-item">
					<el-checkbox
						v-model="item.visible"
						:label="item.label"
						disabled
					></el-checkbox>
				</div>
			</div>
			<div class="invoice-print-view_template invoice-print-view__box">
				<div class="invoice-print-view__template-title">纸张尺寸</div>
				<w-select
					v-model="currentPrintSize"
					:optionlist="printSizeList"
					disabled
					class="invoice-print-view__template-select"
				></w-select>
			</div>
			<div class="invoice-print-view_template invoice-print-view__box">
				<div class="invoice-print-view__template-title">打印模板</div>
				<w-select
					v-model="currentPrintTemplate"
					:optionlist="printTemplateList"
					disabled
					class="invoice-print-view__template-select"
					@change="onTemplateChange"
				></w-select>
				<div class="invoice-print-view__template-btn-tools">
					<el-button disabled class="invoice-print-view__template-btn" @click="onAddClick">新增</el-button>
					<el-button disabled class="invoice-print-view__template-btn" @click="onSaveClick">保存</el-button>
					<el-button disabled class="invoice-print-view__template-btn" @click="onDeleteClick">删除</el-button>
				</div>
			</div>
		</div>
		<createDialog ref="createDialog" @on-save="onAddTemplate"></createDialog>
	</w-app-container>
</template>
<script>
import createDialog from './components/CreateDialog.vue'
import BILL_ROUTER_CONFIG from '@/router/billRouterConfig.js'
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
}]
const fxPrintRegular = /\/\*fx-invoice-print-style\*\//
export default {
	name: 'printInvoice',
	components: {
		createDialog
	},
	data () {
		return {
			apiName: 'print',
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
			printTemplateList: [],
			currentPrintTemplate: '',
			printSizeList: PRINT_SIZE,
			currentPrintSize: 'a4-row'
		}
	},
	computed: {
		containerStyles () {
			const size = this.printSizeList.find(item => {
				return item.id === this.currentPrintSize
			})
			return {
				width: `${size.width}px`
			}
		},
		tableWidth () {
			const size = this.printSizeList.find(item => {
				return item.id === this.currentPrintSize
			})
			return size && size.width
		},
		currentPrintTemplateObj () {
			return this.printTemplateList.find(item => item.id === this.currentPrintTemplate)
		}
	},
	watch: {
		tableWidth () {
			this.$nextTick(() => {
				if (this.$refs.detailsTable) this.$refs.detailsTable[0].doLayout()
			})
		}
	},
	activated () {
		if (this.$fxAppTabs.isNewTab()) {
			this.getRouteParams()
				.then(this.getTemplateList)
				.then(this.getTemplateDetails)
				.then(this.getBillPrintData)
		}
	},
	methods: {
		getRouteParams () {
			this.billType = this.$route.query.billType
			let billId = this.$route.query.billId
			if (!Array.isArray(billId)) {
				billId = [billId]
			}
			this.billId = billId
			this.billName = BILL_ROUTER_CONFIG[this.billType].name
			return Promise.resolve()
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
			return this.$fxApi(`${this.apiName}.${this.billType}`)({ data: this.billId }).then(res => {
				if (!Array.isArray(res)) {
					res = [res]
				}
				this.listData = res
				return Promise.resolve(res)
			})
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
				if (item.valueMap) {
					item.formatter = (row) => {
						return item.valueMap[`${row[item.field]}`]
					}
				}
			})
			this.tableColumn = columnData
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
				} else {
					item.visible = false
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
				} else {
					item.visible = false
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
			this.createPrintPage(doc.body)
			setTimeout(function () {
				iframe.contentWindow.print()
				document.body.removeChild(iframe)
			}, 100)
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
			this.listData.forEach(item => {
				parent.appendChild(this.createTitle(item))
				parent.appendChild(this.createForm(item))
				parent.appendChild(this.createTable(item))
				parent.appendChild(this.createFooter(item))
				parent.appendChild(this.createPrintGagination())
			})
		},
		setFxElValue (el, data) {
			if (el.nodeType === 1) {
				const fxProp = el.dataset.fxProp
				if (fxProp) {
					const _value = this.getCellText(data, fxProp)
					el.innerHTML = this.$fxUtils.isDef(_value) ? _value : ''
				}
				if (el.childNodes.length > 0) {
					Array.prototype.forEach.call(el.childNodes, item => {
						this.setFxElValue(item, data)
					})
				}
			}
		},
		createTitle (listData) {
			const titleEl = this.$refs.printTile[0].cloneNode(true)
			this.setFxElValue(titleEl, listData)
			return titleEl
		},
		createForm (listData) {
			const formEl = this.$refs.printForm[0].cloneNode(true)
			this.setFxElValue(formEl, listData)
			return formEl
		},
		createFooter (listData) {
			const footerEl = this.$refs.printFooter[0].cloneNode(true)
			this.setFxElValue(footerEl, listData)
			return footerEl
		},
		createTable (listData) {
			const detailsEl = this.$refs.detailsTable[0].$el
			var table = document.createElement('table')
			table.setAttribute('style', `width:${this.tableWidth}px;`)
			table.border = '1'
			table.classList.add('invoice-print-view__table')
			const colgroup = document.createElement('colgroup')
			const colList = detailsEl.querySelector('.wind-virtual-table__right').querySelector('colgroup').querySelectorAll('col')
			colList.forEach(item => {
				const col = document.createElement('col')
				col.width = item.width
				colgroup.appendChild(col)
			})
			const thead = document.createElement('thead')
			const headtr = document.createElement('tr')
			headtr.classList.add('invoice-print-view__table-tr')
			const _tableColumn = this.$fxUtils.deepClone(this.tableColumn.filter(item => item.visible))
			_tableColumn.unshift({
				prop: 'index',
				label: '序号'
			})
			_tableColumn.forEach(item => {
				const td = document.createElement('th')
				const div = document.createElement('div')
				div.classList.add('invoice-print-view__table-cell')
				if (item.prop === 'index') {
					div.innerHTML = '序号'
					div.classList.add('invoice-print-view__table-cell-index')
				} else {
					div.innerHTML = item.label
				}
				td.appendChild(div)
				headtr.appendChild(td)
			})
			thead.appendChild(headtr)
			const tbody = document.createElement('tbody')
			listData.details.forEach((listItem, listIndex) => {
				const bodytr = document.createElement('tr')
				bodytr.classList.add('invoice-print-view__table-tr')
				_tableColumn.forEach(item => {
					const td = document.createElement('td')
					const div = document.createElement('div')
					div.classList.add('invoice-print-view__table-cell')
					if (item.prop === 'index') {
						div.innerHTML = listIndex + 1
						div.classList.add('invoice-print-view__table-cell-index')
					} else if (item.valueMap) {
						div.innerHTML = item.valueMap[`${listItem[item.field]}`]
					} else {
						div.innerHTML = this.getCellText(listItem, item.prop)
					}
					td.appendChild(div)
					bodytr.appendChild(td)
				})
				tbody.appendChild(bodytr)
			})
			table.appendChild(colgroup)
			table.appendChild(thead)
			table.appendChild(tbody)
			return table
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
			return this.formatteDate(val)
		},
		formatteDate (date) {
			if (/^\d{4}\-\d{2}-\d{2}\s\d{2}\:\d{2}\:\d{2}$/.test(date)) {
				return date.slice(0, -3)
			}
			return date
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
		}
	}
}
</script>
<style id="printStyle" title="printStyle" lang="stylus">
@import '~$assets/stylus/varsty.styl'
/*fx-invoice-print-style*/
.invoice-print-view {
	height: 100%
	overflow:auto
	.invoice-print-view__box {
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
		.invoice-print-view__template-title {
			height:40px
			line-height: 40px
		}
		.invoice-print-view__template-select {
			width: 100%
			margin-bottom: 20px
		}
		.invoice-print-view__template-btn-tools {
			display: flex
		}
		.invoice-print-view__template-btn {
			width: 60px
		}
	}
	.invoice-print-view_column-filter, .invoice-print-view_template, .invoice-print-view_form-filter {
		margin-top: 20px
		box-sizing: border-box
		padding: 20px
	}
	.invoice-print-view_column-filter {
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
	}
	&__form {
		margin-bottom: 20px
	}
	&__footer {
		display: flex
		margin: 10px 0 20px 0
	}
	&__form, &__footer {
		padding: 0 20px
		position: relative
		flex-direction: column
		.form-row {
			display flex
			justify-content space-between
		}
		.detials-form-row {
			flex: 1
			display: flex
			flex-direction: row;
			.form-row-flex {
				&__left, &__right {
					flex: 1
					display flex
					flex-direction column
				}
				&__left {
					margin-right: 30px
				}
				&-label {
					font-size: 12px
					line-height 28px
				}
			}
			.divided-symbols {
				display inline-block
				width 26px
				text-align center
			}
		}
		.form-item {
			flex: 1
			display: flex
			font-size: 12px
			height: 30px
			line-height: 30px
			position: relative
			&-margin {
				margin-right 30px
			}
			&-label {
				width: 85px
				box-sizing: border-box
				&-large {
					width: 120px
					box-sizing: border-box
				}
			}
			&-value {
				flex 1
				height: 30px
				box-sizing: border-box
				border-bottom: 1px solid gray
				white-space: nowrap;
				overflow: hidden;
				padding: 0 10px
			}
		}
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
			height: 45px
			line-height: 45px;
		}
		&-cell {
			height: 45px
			overflow:hidden
			text-overflow: ellipsis
			white-space: nowrap
			word-break: break-all
			font-size: 12px
			font-weight: normal
			padding-left: 8px;
			padding-right: 8px;
			&-index {
				text-align: center
			}
		}
	}
}
</style>

