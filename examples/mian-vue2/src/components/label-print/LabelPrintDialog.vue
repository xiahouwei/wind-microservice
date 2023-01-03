<template>
	<w-dialog
		v-model="dialogVisible"
		title="品项条码打印预览"
		width="950px"
		positionCenter
		:beforeClose="onBeforeClose">
		<div class="print-barcode__container">
			<div class="print-barcode__left">
				<el-button type="primary" @click="onPrintClick">打印</el-button>
			</div>
			<div class="print-barcode__preview">
				<div class="print-barcode__preview-title">{{currentPrintData.name}}条码预览</div>
				<div class="print-barcode__preview-content">
					<div ref="printContainer" class="preview-content__code-preview">
						<div class="code-preview__container">
							<div class="code-preview__info-container">
								<div
									v-for="item in visibleFilterTop"
									:key="item.id"
									class="code-preview__info-container-item fx-ellipsis"
									:class="{
										'is-full-row': item.isFullRow
									}"
								>{{computedPrintItemText(item.id, item.showLable ? `${item.label} ` : '')}}</div>
							</div>
							<div class="code-preview__img-container">
								<w-barcode :sourceCode="this.currentPrintData.barcode" :height="40"></w-barcode>
							</div>
							<div class="code-preview__info-container">
								<div
									v-for="item in visibleFilterBottom"
									:key="item.id"
									class="code-preview__info-container-item"
									:class="{
										'is-full-row': item.isFullRow
									}"
								>{{computedPrintItemText(item.id, item.showLable ? `${item.label} ` : '')}}</div>
							</div>
						</div>
					</div>
				</div>
				<div class="print-barcode__preview-btns">
					<el-button type="primary" :disabled="prevDisable" @click="onPrevItemClick">上一个品项</el-button>
					<el-button type="primary" :disabled="nextDisable" @click="onNextItemClick">下一个品项</el-button>
				</div>
			</div>
			<div class="print-barcode__tools">
				<div class="print-barcode__tools-params">
					<el-tabs v-model="toolsActive" class="tools-params__tabs">
						<el-tab-pane
							label="条码顶部"
							name="top"
							class="tools-params__pane"
						>
							<el-checkbox-group v-model="printInfoFilterTopSelect">
								<el-checkbox
									v-for="(item, index) in printInfoTopList"
									:key="index"
									:label="item.id"
									:disabled="item.disabled"
									class="tools-params-checkbox"
								>{{item.label}}</el-checkbox>
							</el-checkbox-group>
						</el-tab-pane>
						<el-tab-pane
							label="条码底部"
							name="bottom"
							class="tools-params__pane"
						>
							<el-checkbox-group v-model="printInfoFilterBottomSelect">
									<el-checkbox
										v-for="(item, index) in printInfoBottomList"
										:key="index"
										:label="item.id"
										:disabled="item.disabled"
										class="tools-params-checkbox"
									>{{item.label}}</el-checkbox>
							</el-checkbox-group>
						</el-tab-pane>
					</el-tabs>
				</div>
				<div class="print-barcode__tools-settings">
					<div>纸张尺寸:</div>
					<w-select
						v-model="paperSize"
						:optionlist="paperSizeList"
						class="tools-setting__select-input"
						@change="refreshPrintInfoCheckBox"
					>
					</w-select>
					<div>打印模板:</div>
					<w-select
						v-model="templateId"
						:optionlist="tempalteList"
						class="tools-setting__select-input"
					>
					</w-select>
				</div>
			</div>
		</div>
	</w-dialog>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
const PRICE_FIELD = ['price', 'money']
export default {
	name: 'print-barcode',
	data () {
		return {
			dialogVisible: false,
			printFlag: false,
			printInfoTopList: [{
				id: 'name',
				label: '品项名称',
				disabled: false,
				isFullRow: false,
				showLable: false
			}, {
				id: 'unit',
				label: '单位',
				disabled: false,
				isFullRow: false,
				showLable: true
			}, {
				id: 'code',
				label: '品项编号',
				disabled: false,
				isFullRow: false,
				showLable: true
			}, {
				id: 'spec',
				label: '规格',
				disabled: false,
				isFullRow: false,
				showLable: true
			}, {
				id: 'itemTypeName',
				label: '品项类别',
				disabled: false,
				isFullRow: false,
				showLable: true
			}, {
				id: 'amount',
				label: '入库数量',
				disabled: false,
				isFullRow: false,
				showLable: true
			}],
			printInfoBottomList: [{
				id: 'price',
				label: '成本单价',
				disabled: false,
				isFullRow: false,
				showLable: true
			}, {
				id: 'money',
				label: '成本金额',
				disabled: false,
				isFullRow: false,
				showLable: true
			}, {
				id: 'productDate',
				label: '生产日期',
				disabled: false,
				isFullRow: false,
				showLable: true
			}, {
				id: 'shelfLife',
				label: '保质期',
				disabled: false,
				isFullRow: false,
				showLable: true
			}, {
				id: 'printDate',
				label: '打印日期',
				disabled: false,
				isFullRow: false,
				showLable: true
			}, {
				id: 'batchCode',
				label: '批次号',
				disabled: false,
				isFullRow: false,
				showLable: true
			}],
			printInfoFilterTopSelect: [],
			printInfoFilterBottomSelect: [],
			toolsActive: 'top',
			paperSize: '6x4',
			paperSizeList: [{
				id: '6x4',
				name: '6 * 4',
				propDisableList: ['itemTypeName', 'money', 'printDate'],
				propFullRowList: ['price', 'batchCode']
			}, {
				id: '8x6',
				name: '8 * 6',
				propDisableList: [],
				propFullRowList: ['batchCode']
			}],
			templateId: '0',
			tempalteList: [{
				id: '0',
				name: '默认模板'
			}],
			itemIndex: 0,
			printDataList: [],
			templateType: '',
			disableCompare: this.$fxUtils.compareArrayUtils(),
			fullRowCompare: this.$fxUtils.compareArrayUtils()
		}
	},
	computed: {
		...mapGetters(['getSysParams']),
		...mapState({
			sysPricePointSize: state => state.system.sysPricePointSize
		}),
		currentPrintData () {
			if (this.printDataList.length === 0) {
				return {
					unitList: []
				}
			}
			return this.printDataList[this.itemIndex]
		},
		nextDisable () {
			return this.printDataList.length === 0 || this.itemIndex === this.printDataList.length - 1
		},
		prevDisable () {
			return this.printDataList.length === 0 || this.itemIndex === 0
		},
		computedPrintInfoFilter () {
			return [...this.printInfoFilterTopSelect, ...this.printInfoFilterBottomSelect]
		},
		computedPrintItemText () {
			return (key, prefix = '') => {
				const val = this.currentPrintData[key]
				let fieldValue = this.$fxUtils.isDef(val) ? val : ''
				if (PRICE_FIELD.includes(key)) {
					fieldValue = this.$fxUtils.toFixed(fieldValue, this.sysPricePointSize, this.getSysParams('XTGF_ZERO_FILL', 'value'))
				}
				if (key === 'code' && fieldValue.length > 10) {
					fieldValue = fieldValue.slice(0, 8) + '...'
				}
				return this.computedPrintInfoFilter.includes(key) ? `${prefix}${fieldValue}` : ''
			}
		},
		visibleFilterTop () {
			return this.printInfoTopList.filter(item => {
				return this.printInfoFilterTopSelect.includes(item.id)
			})
		},
		visibleFilterBottom () {
			return this.printInfoBottomList.filter(item => {
				return this.printInfoFilterBottomSelect.includes(item.id)
			})
		}
	},
	created () {
		this.refreshPrintInfoCheckBox(this.paperSize)
	},
	methods: {
		open (itemList, templateType) {
			this.itemIndex = 0
			this.printDataList = itemList
			this.templateType = templateType
			this.dialogVisible = true
		},
		onPrintClick () {
			this.printHandler()
		},
		printHandler () {
			this.$fxLablePrint.init().then(() => {
				const printData = []
				this.createPrintInfoData(this.visibleFilterTop, printData)
				this.createPrintBarcodeData(printData)
				this.createPrintInfoData(this.visibleFilterBottom, printData)
				this.$fxLablePrint.print(printData, this.computedPrintInfoFilter, this.templateType, this.paperSize)
			})
		},
		createPrintInfoData (visibleFilter, printData) {
			let printInfo = []
			visibleFilter.forEach((item, index) => {
				if (item.isFullRow) {
					if (printInfo.length > 0) {
						printData.push(printInfo)
						printInfo = []
					}
					printInfo.push({
						id: item.id,
						value: this.computedPrintItemText(item.id, item.showLable ? `${item.label} ` : '')
					})
					printData.push(printInfo)
					printInfo = []
				} else {
					printInfo.push({
						id: item.id,
						value: this.computedPrintItemText(item.id, item.showLable ? `${item.label} ` : '')
					})
					if (printInfo.length === 2 || index === visibleFilter.length - 1) {
						printData.push(printInfo)
						printInfo = []
					}
				}
			})
		},
		createPrintBarcodeData (printData) {
			printData.push([{
				id: 'barcode',
				value: this.currentPrintData.barcode
			}])
		},
		onBeforeClose (close) {
			this.$fxConfirm('确定取消打印品项条码？').then(close)
		},
		onNextItemClick () {
			if (this.nextDisable) {
				return false
			}
			this.itemIndex++
		},
		onPrevItemClick () {
			if (this.prevDisable) {
				return false
			}
			this.itemIndex--
		},
		refreshPrintInfoCheckBox (pageSizeId) {
			const pageSize = this.paperSizeList.find(item => item.id === pageSizeId)
			if (pageSize) {
				this.disableCompare.setData(pageSize.propDisableList)
				this.fullRowCompare.setData(pageSize.propFullRowList)
				this.printInfoTopList.forEach(item => {
					item.disabled = this.disableCompare.has(item.id)
					item.isFullRow = this.fullRowCompare.has(item.id)
				})
				this.printInfoBottomList.forEach(item => {
					item.disabled = this.disableCompare.has(item.id)
					item.isFullRow = this.fullRowCompare.has(item.id)
				})
			}
			this.setPrintInfoFilterSelect()
		},
		setPrintInfoFilterSelect () {
			this.printInfoFilterTopSelect = this.printInfoTopList.filter(item => !item.disabled).map(item => {
				return item.id
			})
			this.printInfoFilterBottomSelect = this.printInfoBottomList.filter(item => !item.disabled).map(item => {
				return item.id
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.print-barcode {
	&__container {
		width: 100%
		height: 550px
		box-sizing: border-box
		display: flex
		border-top: 1px solid $fxBorder
		border-bottom: 1px solid $fxBorder
	}
	&__left {
		width: 100px
		text-align: center
		padding-top: 10px
	}
	&__preview {
		flex: 1
		border-right: 1px solid $fxBorder
		padding-top: 10px
		margin-right: 10px
		&-title {
			height: 40px
			line-height: 40px
			text-align: center
			font-size: 14px
			font-weight: bold
		}
		&-content {
			height: 400px
			display: flex
			.preview-content{
				&__code-preview {
					flex: 1
					display: flex
					justify-content: center
					align-items: center
					.code-preview__container {
						width: 300px
						height: 200px
						border: 1px solid $fxBlue11
						background-color: $fxBlue12
						.code-preview__img-container {
							text-align: center
							.code-preview__img {
								display: inline-block
							}
						}
						.code-preview__title {
							margin-left: 10px
							height: 28px
							line-height: 28px
						}
						.code-preview__info-container {
							overflow: hidden;
							height: 60px
							.code-preview__info-container-item {
								display: inline-block
								width: 45%
								margin-left: 10px
								height: 20px
								line-height: 20px
								overflow: hidden
								vertical-align: middle;
								&.is-full-row {
									width: 100%
								}
							}
						}
					}
				}
			}
		}
		&-btns {
			text-align: center
			margin-top: 20px
		}
	}
	&__tools {
		width: 200px
		padding-top: 10px
		&-params {
			border-bottom: 1px solid $fxBorder
			padding-bottom: 30px
			margin-bottom: 30px
			.tools-params {
				&__tabs {
					margin-left: 20px
					margin-right: 20px
				}
				&__pane {
					width: 180px
				}
				&-title {
					height: 30px
					line-height: 30px
				}
				&-checkbox {
					width: 80px
					height: 30px
					line-height:30px
					&>>>.el-checkbox__label {
						font-size: 10px
					}
				}
			}
		}
		&-settings {
			margin-left: 20px
			.tools-setting {
				&__select-input {
					width:160px
					margin-top: 10px
					margin-bottom: 20px
				}
			}
		}
	}
}
</style>
