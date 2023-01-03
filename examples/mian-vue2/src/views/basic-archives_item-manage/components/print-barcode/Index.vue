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
					<!-- <div class="preview-content__slide">
						<div :class="['preview-content__arrow-btn', 'fx-cursor', {
							'is-disable': prevDisable
						}]" @click="onPrevItemClick">
							<i class="preview-content__arrow el-icon-arrow-left"></i>
							<span class="preview-content__arrow-btn-title">上一个品项</span>
						</div>
					</div> -->
					<div ref="printContainer" class="preview-content__code-preview">
						<div class="code-preview__container">
							<div class="code-preview__title">{{computedPrintItemText('code')}}</div>
							<div class="code-preview__info">
								<div class="code-preview__info-item">{{computedPrintItemText('spec')}}</div>
								<div class="code-preview__info-item">{{computedPrintItemText('unit')}}</div>
							</div>
							<div class="code-preview__img-container">
								<w-barcode :sourceCode="this.currentPrintData.barcode"></w-barcode>
							</div>
							<div class="code-preview__title">{{computedPrintItemText('name')}}</div>
							<div class="code-preview__info">
								<div class="code-preview__info-item">{{computedPrintItemText('refCostPrice', '￥')}}</div>
								<div class="code-preview__info-item">{{computedPrintItemText('refSellingPrice', '￥')}}</div>
							</div>
						</div>
					</div>
					<!-- <div class="preview-content__slide">
						<div :class="['preview-content__arrow-btn', 'fx-cursor', {
							'is-disable': nextDisable
						}]" @click="onNextItemClick">
							<i class="preview-content__arrow el-icon-arrow-right"></i>
							<span class="preview-content__arrow-btn-title" >下一个品项</span>
						</div>
					</div> -->
				</div>
				<div class="print-barcode__preview-btns">
					<el-button type="primary" :disabled="prevUnitDisable" @click="onPrevUnitClick">上一个单位</el-button>
					<el-button type="primary" :disabled="nextUnitDisable" @click="onNextUnitClick">下一个单位</el-button>
					<!-- <el-checkbox v-model="currentPrintDataCheck" class="preview-btns__checkbox">打印该单位</el-checkbox> -->
				</div>
			</div>
			<div class="print-barcode__tools">
				<!-- <div class="print-barcode__tools-btns">
					<el-button type="primary" @click="onPrintClick">新建</el-button>
					<el-button type="primary" @click="onPrintClick">保存</el-button>
					<el-button type="danger" @click="onPrintClick">删除</el-button>
				</div> -->
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
const PRICE_FIELD = ['refCostPrice', 'refSellingPrice']
export default {
	name: 'print-barcode',
	data () {
		return {
			dialogVisible: false,
			printFlag: false,
			printInfoTopList: [{
				id: 'code',
				label: '品项编号'
			}, {
				id: 'spec',
				label: '规格'
			}, {
				id: 'unit',
				label: '单位'
			}],
			printInfoBottomList: [{
				id: 'name',
				label: '品项名称'
			}, {
				id: 'refCostPrice',
				label: '参考成本'
			}, {
				id: 'refSellingPrice',
				label: '参考售价'
			}],
			printInfoFilterTopSelect: ['code', 'spec', 'unit'],
			printInfoFilterBottomSelect: ['name', 'refCostPrice', 'refSellingPrice'],
			toolsActive: 'top',
			paperSize: '6x4',
			paperSizeList: [{
				id: '6x4',
				name: '6 * 4'
			}],
			templateId: '0',
			tempalteList: [{
				id: '0',
				name: '默认模板'
			}],
			itemIndex: 0,
			unitIndex: 0,
			printDataList: []
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
			const currentItem = this.printDataList[this.itemIndex]
			const { name, spec, code } = currentItem
			const { name: unit, barcode, refCostPrice, refSellingPrice, checkFlag } = currentItem.unitList[this.unitIndex]
			return {
				code,
				name,
				spec,
				unit,
				barcode,
				refCostPrice,
				refSellingPrice,
				checkFlag,
				unitList: currentItem.unitList
			}
		},
		currentPrintDataCheck: {
			get () {
				return this.currentPrintData.checkFlag
			},
			set (val) {
				this.$set(this.printDataList[this.itemIndex].unitList[this.unitIndex], 'checkFlag', val)
			}
		},
		nextDisable () {
			return this.printDataList.length === 0 || this.itemIndex === this.printDataList.length - 1
		},
		prevDisable () {
			return this.printDataList.length === 0 || this.itemIndex === 0
		},
		nextUnitDisable () {
			return this.currentPrintData.unitList.length === 0 || this.unitIndex === this.currentPrintData.unitList.length - 1
		},
		prevUnitDisable () {
			return this.currentPrintData.unitList.length === 0 || this.unitIndex === 0
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
				return this.computedPrintInfoFilter.includes(key) ? `${prefix}${fieldValue}` : ''
			}
		}
	},
	methods: {
		open (itemList) {
			this.itemIndex = 0
			this.unitIndex = 0
			this.dialogVisible = true
			this.printDataList = itemList
		},
		onPrintClick () {
			this.printHandler()
		},
		printHandler () {
			this.$fxLablePrint.init().then(() => {
				const printData = {
					code: this.computedPrintItemText('code'),
					barcode: this.currentPrintData.barcode,
					spec: this.computedPrintItemText('spec'),
					unit: this.computedPrintItemText('unit'),
					name: this.computedPrintItemText('name'),
					refCostPrice: this.computedPrintItemText('refCostPrice', '￥'),
					refSellingPrice: this.computedPrintItemText('refSellingPrice', '￥')
				}
				this.$fxLablePrint.print(printData, this.computedPrintInfoFilter, 'itemArchive', '6x4')
			})
			// return this.$fxApi('item.printBarCode')({ data: this.currentPrintData }).then(res => {
			// 	debugger
			// })
		},
		onBeforeClose (close) {
			this.$fxConfirm('确定取消打印品项条码？').then(close)
		},
		onNextItemClick () {
			if (this.nextDisable) {
				return false
			}
			this.itemIndex++
			this.unitIndex = 0
		},
		onPrevItemClick () {
			if (this.prevDisable) {
				return false
			}
			this.itemIndex--
			this.unitIndex = 0
		},
		onPrevUnitClick () {
			if (this.prevUnitDisable) {
				return false
			}
			this.unitIndex--
		},
		onNextUnitClick () {
			if (this.nextUnitDisable) {
				return false
			}
			this.unitIndex++
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
				&__slide {
					width: 80px
					display: flex
					align-items: center
					justify-content: center
				}
				&__arrow-btn {
					width: 26px;
					height: 26px;
					background-color: $fxDefaultColor;
					border-radius: 16px;
					display: flex;
					align-items: center;
					justify-content: center;
					position: relative
					&.is-disable {
						cursor: not-allowed
						background-color: $fxBorder;
					}
					.preview-content__arrow {
						color: $fxWhite
						font-size: 14px
					}
					.preview-content__arrow-btn-title {
						position: absolute
						bottom: -30px
						width: 80px
						text-align: center
					}
				}
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
						.code-preview__info {
							display: flex
							height: 28px
							line-height: 28px
							&-item {
								flex: 1
								margin-left: 10px
							}
						}
					}
				}
			}
		}
		&-btns {
			text-align: center
			margin-top: 20px
			.preview-btns__checkbox {
				margin-left: 10px
				&>>>.el-checkbox__label {
					font-size: 10px
				}
			}
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
