
<template>
	<w-app-container class="tick-design">
		<div>ssssss{{$printstore.state.aaa}}</div>
		<el-button
			@click='onTestClick'
		>测试</el-button>
		<fx-page-header title="票据编辑"></fx-page-header>
			<w-app-container direction="column" class="fx-page-first-container">
				<div class="tick-design__title">
					<div class="tick-design__title-name">编辑「方案名称-{{printDesignStyle.styleName}}」</div>
					<w-link class="tick-design__title-preview" @click="onPreviewClick">预览模板效果</w-link>
				</div>
				<div class="tick-design__container">
					<div class="tick-design__container-wrapper">
						<div class="print_design_tools">
							<div class="sub_title">字段区</div>
							<div class="tool-container">
								<div class="content" v-for='item of printFieldStore' :key='item.name'>
									<div class="sub_title">{{item.name}}</div>
									<div class="print_design_bank">
										<el-button
											v-for="i of item.list"
											:key="i.id"
											:class="['print-template__design-tag', {
												'is-used': designTagUseCount(i)
											}]"
											:title="i.name || i.title"
											class="fx-ellipsis"
											@click="addComponent(i)"
										>
											<span>{{i.name || i.title}}</span>
											<div v-if="designTagUseCount(i)" class="print-template__design-tag-mark">
												<span class="mark-count">X{{designTagUseCount(i)}}</span>
											</div>
										</el-button>
									</div>
								</div>
							</div>
						</div>
						<div class="print_design_left">
							<div
								v-for="(containerItem, index) in ticksTemplateList"
								:key="containerItem.id"
								class="print-template__container"
							>
								<div class="print-template__container-title">
									<div class="print-template__container-title-name">{{containerItem.templateContainerName}}</div>
									<div class="print-template__container-title-tools">
										<w-icon
											type="add-round"
											@click="onTemplateContainerAddClick(index)"
										></w-icon>
										<w-icon
											v-if="showTemplateContainerDelBtn(containerItem)"
											type="delete-trash"
											@click="onTemplateContainerDelClick(index)"
										></w-icon>
									</div>
								</div>
								<div
									class="print_design_preview"
									:style="{
										height: computedTemplateContainerHeight(containerItem),
										width: containerWidth
									}"
									:class="{
										'is-active': selectTemplateContainer.id === containerItem.id
									}"
									@click="onTemplateContainerClick(containerItem)"
								>
									<div
										class="item_container"
										ref='editor'
										@mouseleave="end"
										@mousemove="draging($event)"
										@mouseup="end">
										<div
											v-for="item of containerItem.componentsList"
											:class="['component_wrapper', 'fx-ellipsis', {
												selected_wrapper: item.id===selectedItem.id
											}]"
											:key="item.id"
											:style="computedStyle(item)"
											@click="clickComponent(item)"
											@mousedown="start($event, item)"
										>
											<component :is="getComponentByName(item.componentType)" :item="item"></component>
										</div>
										<div class="print_area" :style="{ width:printAreaWidth }"></div>
									</div>
								</div>
							</div>
						</div>
						<printPropsEditer
							:selectTemplateContainer="selectTemplateContainer"
							:selectedItem="selectedItem"
							:printFieldStore="printFieldStore"
							:positionYStep="positionYStep"
							:positionXStep="positionXStep"
							@on-add-text="onAddTextClick"
							@on-add-division-line="onAddDivisionLineClick"
							@on-delete-print-item="onDeletePrintItemClick"
						></printPropsEditer>
					</div>
				</div>
				<div class="container-footer">
					<el-button
						@click='onClose'
					>取消</el-button>
					<el-button
						type='primary'
						@click='onSave'
					>保存</el-button>
				</div>
			</w-app-container>
			<previewDialog v-model="previewDialogVisible" :imgUrl="previewImgUrl"></previewDialog>
	</w-app-container>
</template>
<script>
import textComponent from './src/TextComponent.vue'
import groupComponent from './src/GroupComponent.vue'
import dataComponent from './src/DataComponent.vue'
import scriptComponent from './src/ScriptComponent.vue'
import barcodeComponent from './src/BarcodeComponent.vue'
import lineComponent from './src/LineComponent.vue'
import printPropsEditer from './src/PrintPropsEditer.vue'
import previewDialog from './src/PreviewDialog.vue'
export const CONTAINER_WIDTH = 400
export const CONTAINER_COL_LENGTH = 50
export const CONTAINER_ROW_LENGTH = 10
export const ROW_HAS_COL_NUMBER = 50
export const MM_TO_STEP = 0.5
export const POSITION_X_STEP = CONTAINER_WIDTH / ROW_HAS_COL_NUMBER
export const POSITION_Y_STEP = 20
export const PREVIEW_IMG_WIDTH = 400
export default {
	name: 'createContainer',
	components: {
		textComponent,
		groupComponent,
		dataComponent,
		scriptComponent,
		barcodeComponent,
		lineComponent,
		printPropsEditer,
		previewDialog
	},
	data () {
		return {
			printDesignStyle: {},
			isDrag: false,
			isDragImg: false,
			startVal: {},
			positionX: 0,
			positionY: 0,
			selectedItem: {},
			printFieldStore: [],
			ticksTemplateWidth: 80,
			ticksTemplateList: [],
			selectTemplateContainer: {},
			previewDialogVisible: false,
			previewImgUrl: '',
			positionYStep: POSITION_Y_STEP,
			positionXStep: POSITION_X_STEP,
			dataSource: '',
			containerWidth: `${CONTAINER_WIDTH}px`
		}
	},
	computed: {
		title () {
			return this.printDesignStyle.id ? `编辑样式 -- ${this.printDesignStyle.styleName}` : '新建样式'
		},
		computedTemplateContainerHeight () {
			return (item) => {
				const maxRow = this.$fxUtils.arrMax(item.componentsList, item => Number(item.row))
				return `${(Math.max(maxRow, item.high) + 1) * POSITION_Y_STEP}px`
			}
		},
		computedStyle () {
			return item => {
				const style = {
					top: `${item.positionY}px`,
					left: `${item.positionX}px`,
					zIndex: item.id === this.selectedItem.id ? 3 : 2
				}
				return style
			}
		},
		currentEditComponentAttr () {
			const { type: name } = this.selectedItem
			return name ? this.$fxTypeMiddleware.getTypeEnum(`labelNameMapKey.${name}`).attributeList : {}
		},
		showTemplateContainerAddBtn () {
			return (item, index) => {
				return this.ticksTemplateList.length - 1 === index
			}
		},
		showTemplateContainerDelBtn () {
			return () => this.ticksTemplateList.length !== 1
		},
		designTagSelectList () {
			return this.ticksTemplateList.reduce((pre, cur) => {
				pre.push(...cur.componentsList)
				return pre
			}, [])
		},
		designTagUseCount () {
			return item => {
				const tags = this.designTagSelectList.filter(tag => {
					return tag.tagId === item.id
				})
				return tags.length
			}
		},
		printAreaStep () {
			return this.ticksTemplateWidth * MM_TO_STEP
		},
		printAreaWidth () {
			return `${(this.printAreaStep + 1) * POSITION_X_STEP}px`
		}
	},
	created () {
		this.$fxPrintEditer.emitPrintEditerReady()
		this.$fxPrintEditer.onPrintEditer(this.initPrintEditer)
	},
	methods: {
		initBaseSorce () {
			const dataSource = require('@/json/dataSource.json')
			const { data: { dataList: printFieldStore } } = require('@/json/printTemplateItem.json')
			const { data: printDesignStyle } = require('@/json/printDesginStyle.json')
			return {
				printFieldStore,
				dataSource: this.$fxPrintEditer.createDataSourceXml(dataSource.data.dataTable),
				printDesignStyle
			}
		},
		initPrintEditer (data) {
			this.init(data.printFieldStore, data.dataSource, data.printDesignStyle)
		},
		init (printFieldStore, dataSource, printDesignStyle) {
			printFieldStore.forEach(typeItem => {
				typeItem.list.forEach(item => {
					item.fatherName = typeItem.name
					item.table = typeItem.table
				})
			})
			this.printFieldStore = printFieldStore
			this.printDesignStyle = printDesignStyle
			this.ticksTemplateWidth = printDesignStyle.ticksTemplateWidth || 58
			this.ticksTemplateList = printDesignStyle.ticksTemplateList
			this.dataSource = dataSource
			this.selectedItem = {}
		},
		createContainerData () {
			return {
				id: this.$fxUtils.createUUID(),
				high: CONTAINER_ROW_LENGTH,
				wide: CONTAINER_COL_LENGTH,
				isDetailContainer: '0',
				hasGroupHead: '0',
				hasGroupFoot: '0',
				dtlTable: this.printFieldStore[0].table,
				groupField: [],
				groupHeadField: [],
				groupFootField: [],
				componentsList: []
			}
		},
		onTemplateContainerAddClick (index) {
			const templateContainer = {
				...this.createContainerData(),
				templateContainerName: '区域名称',
				templateContainerType: 'customer'
			}
			this.ticksTemplateList.splice(index + 1, 0, templateContainer)
		},
		addComponent (i) {
			if (this.$fxUtils.isEmptyObj(this.selectTemplateContainer)) {
				if (this.ticksTemplateList?.length === 1) {
					this.onTemplateContainerClick(this.ticksTemplateList[0])
				} else {
					this.$fxMessage.warning('请选择模板区域')
					return false
				}
			}
			switch (i.componentType) {
			case 'data': {
				this.onAddComponentClick(i)
				break
			}
			case 'text': {
				this.onAddTextClick(i)
				break
			}
			case 'line': {
				this.onAddDivisionLineClick()
				break
			}
			}
		},
		onAddComponentClick (i) {
			const positionX = 0
			const positionY = POSITION_Y_STEP * this.getComponentsMaxRow(this.selectTemplateContainer.componentsList)
			const item = Object.assign(this.$fxUtils.deepClone(i), {
				tagId: i.id,
				id: this.$fxUtils.createUUID(),
				positionX,
				positionY,
				fatherId: this.selectTemplateContainer.id,
				row: this.getDesignItemRowByPosition(positionY),
				col: this.getDesignItemColByPosition(positionX)
			})
			this.selectedItem = item
			this.selectTemplateContainer.componentsList.push(item)
		},
		onAddTextClick (i) {
			const defaultSetting = {
				width: '20',
				height: '1',
				fontHeight: '1',
				fontWidth: '1',
				align: '0',
				fontBold: '0',
				fontULine: '0'
			}
			const positionX = 0
			const positionY = POSITION_Y_STEP * this.getComponentsMaxRow(this.selectTemplateContainer.componentsList)
			const item = Object.assign(this.$fxUtils.deepClone(i || defaultSetting), {
				id: this.$fxUtils.createUUID(),
				componentType: 'text',
				name: '自定义文本',
				textContent: '新增字符串',
				positionX,
				positionY,
				fatherId: this.selectTemplateContainer.id,
				row: this.getDesignItemRowByPosition(positionY),
				col: this.getDesignItemColByPosition(positionX)
			})
			this.selectedItem = item
			this.selectTemplateContainer.componentsList.push(item)
		},
		onAddDivisionLineClick () {
			const positionX = 0
			const positionY = POSITION_Y_STEP * this.getComponentsMaxRow(this.selectTemplateContainer.componentsList)
			const item = {
				id: this.$fxUtils.createUUID(),
				componentType: 'line',
				name: '分割线',
				positionX,
				positionY,
				width: CONTAINER_COL_LENGTH,
				fatherId: this.selectTemplateContainer.id,
				row: this.getDesignItemRowByPosition(positionY),
				col: this.getDesignItemColByPosition(positionX)
			}
			this.selectedItem = item
			this.selectTemplateContainer.componentsList.push(item)
		},
		getComponentsMaxRow (componentsList) {
			if (componentsList.length === 0) {
				return 0
			}
			return Math.max(...componentsList.map(item => item.row))
		},
		getDesignItemColByPosition (positionX) {
			let col = positionX === 0 ? 0 : Math.floor(positionX / POSITION_X_STEP)
			col += 1
			return col
		},
		getDesignItemRowByPosition (positionY) {
			let row = positionY === 0 ? 0 : Math.floor(positionY / POSITION_Y_STEP)
			row += 1
			return row
		},
		clickComponent (item) {
			this.selectedItem = item
		},
		start (e, item) {
			this.isDragImg = false
			this.selectedItem = item
			this.startVal.clientX = e.clientX - item.positionX
			this.startVal.clientY = e.clientY - item.positionY
			this.startVal.target = e.target
			this.isDrag = true
		},
		draging (e) {
			if (this.isDrag) {
				if (this.isPositionXConformRule(e.clientX - this.startVal.clientX)) {
					this.selectedItem.positionX = (e.clientX - this.startVal.clientX)
				}
				if (this.selectedItem.positionX < 0) { this.selectedItem.positionX = 0 }
				const rightMax = CONTAINER_WIDTH - this.startVal.target.offsetWidth - 1
				if (this.selectedItem.positionX > rightMax) {
					if (this.isPositionXConformRule(rightMax)) {
						this.selectedItem.positionX = rightMax
					}
				}
				if (this.isPositionYConformRule(e.clientY - this.startVal.clientY)) {
					this.selectedItem.positionY = (e.clientY - this.startVal.clientY)
				}
				this.selectedItem.row = this.getDesignItemRowByPosition(this.selectedItem.positionY)
				this.selectedItem.col = this.getDesignItemColByPosition(this.selectedItem.positionX)
			}
		},
		isPositionXConformRule (position) {
			return !(position % POSITION_X_STEP)
		},
		isPositionYConformRule (position) {
			return !(position % POSITION_Y_STEP)
		},
		end () {
			this.isDrag = false
		},
		onSave () {
			this.validateComponents().then(() => {
				this.printDesignStyle.printDesignStyleXml = this.createPrivewXmlPage()
				this.$fxPrintEditer.emitConfirmPrintDesign(this.printDesignStyle)
			})
		},
		onClose () {
			this.$fxPrintEditer.emitCancelPrintEditer()
		},
		getComponentByName (componentType) {
			switch (componentType) {
			case 'data':
				return 'dataComponent'
			case 'text':
				return 'textComponent'
			case 'group':
				return 'groupComponent'
			case 'line':
				return 'lineComponent'
			case 'script':
				return 'scriptComponent'
			default:
				return 'dataComponent'
			}
		},
		getCurrentEditAttrShow (attr) {
			return this.currentEditComponentAttr[attr]
		},
		onTemplateContainerClick (item) {
			this.selectTemplateContainer = item
		},
		onTemplateContainerDelClick (index) {
			if (this.ticksTemplateList[index] === this.selectTemplateContainer) {
				this.selectTemplateContainer = {}
				this.selectedItem = {}
			}
			this.ticksTemplateList.splice(index, 1)
		},
		onDeletePrintItemClick (selectedItem) {
			const container = this.ticksTemplateList.find(item => item.id === selectedItem.fatherId)
			if (container) {
				container.componentsList = container.componentsList.filter(i => {
					return i.id !== selectedItem.id
				})
				this.selectedItem = {}
			}
		},
		sortComponentByRow (list) {
			return list.sort((a, b) => a.row - b.row)
		},
		validateComponents () {
			return new Promise(resolve => {
				const isEmptyComponents = this.ticksTemplateList.every(item => {
					return item.componentsList.length === 0
				})
				if (isEmptyComponents) {
					this.$fxMessage.warning('请正确配置打印模板')
				} else {
					resolve()
				}
			})
		},
		onPreviewClick () {
			this.validateComponents().then(this.previewHandler)
		},
		createPrivewXmlBand (band) {
			if (band.isDetailContainer === '1') {
				return this.createDetailBand(band)
			} else {
				return this.createBasicBand(band)
			}
		},
		createBasicBand (band) {
			const componentsList = this.sortComponentByRow(band.componentsList)
			const content = componentsList.map(item => this.createPrivewXmlItem(item)).join('')
			if (!content) {
				return ''
			}
			return `<Band ID="{${band.id}}" Name="${band.templateContainerName}" Mode="0" DTLTable="" MinRows="0">${content}</Band>`
		},
		createDetailBand (band) {
			let groupHeadList = []
			let groupFootList = []
			let contentList = []
			if (band.hasGroupHead === '1') {
				groupHeadList = band.componentsList.filter(item => {
					return band.groupHeadField.includes(item.field)
				})
			}
			if (band.hasGroupFoot === '1') {
				groupFootList = band.componentsList.filter(item => {
					return band.groupFootField.includes(item.field)
				})
			}
			contentList = band.componentsList.filter(item => {
				return !groupHeadList.includes(item) && !groupFootList.includes(item)
			})
			const groupHeadComponentsList = this.sortComponentByRow(groupHeadList)
			const groupFootComponentsList = this.sortComponentByRow(groupFootList)
			const componentsList = this.sortComponentByRow(contentList)
			const grounpHeadBandXml = this.createGroupHeadXml(groupHeadComponentsList)
			const grounpFootBandXml = this.createGroupHeadXml(groupFootComponentsList)
			const content = componentsList.map(item => this.createPrivewXmlItem(item)).join('')
			const groupField = band.groupField.join(',')
			if (!content && !grounpHeadBandXml && !grounpFootBandXml) {
				return ''
			}
			return `<Band ID="{${band.id}}" Name="${band.templateContainerName}" Mode="1" DTLTable="${band.dtlTable}" MinRows="0" GroupField="${groupField}">${grounpHeadBandXml}${content}${grounpFootBandXml}</Band>`
		},
		createGroupHeadXml (groupHeadList) {
			if (Array.isArray(groupHeadList) && groupHeadList.length > 0) {
				return `<GroupHead>${groupHeadList.map(item => this.createPrivewXmlItem(item)).join('')}</GroupHead>`
			} else {
				return ''
			}
		},
		createGroupFootXml (groupFootList) {
			if (Array.isArray(groupFootList) && groupFootList.length > 0) {
				return `<GroupFoot>${groupFootList.map(item => this.createPrivewXmlItem(item)).join('')}</GroupFoot>`
			} else {
				return ''
			}
		},
		createPrivewXmlItem (item) {
			switch (item.componentType) {
			case 'data':
				return this.createPrivewXmlData(item)
			case 'text':
				return this.createPrivewXmlText(item)
			case 'line':
				return this.createPrivewXmlLine(item)
			case 'script':
				return this.createPrivewXmlScript(item)
			default:
				return ''
			}
		},
		createPrivewXmlData (item) {
			return `<Data Table="${item.table}" Field="${item.field}" Row="${item.row}" Col="${item.col}" Width="${item.width}" Height="${item.height}" Visible="1" FontH="${item.fontHeight}" FontW="${item.fontWidth}" FontColor="0" Align="${item.align}" FontULine="${item.fontULine}" FontBold="${item.fontBold}" DataType="${item.dataType}" DisplayFormat="${item.displayFormat}" SCType="0" Sum="0"/>`
		},
		createPrivewXmlText (item) {
			return `<Text Row="${item.row}" Col="${item.col}" Width="${item.width}" Height="${item.height}" Visible="1" FontH="${item.fontHeight}" FontW="${item.fontWidth}" FontColor="0" Align="${item.align}" FontULine="${item.fontULine}" FontBold="${item.fontBold}" DataType="${item.dataType}" DisplayFormat="%s" SCType="0" Sum="0">${item.textContent}</Text>`
		},
		createPrivewXmlLine (item) {
			return `<Line FontColor="0" Width="${item.width}" Height="1" Visible="1" FontBold="0" DataType="-1" DisplayFormat="" SCType="0" Sum="0" Row="${item.row}" Col="${item.col}" FontW="1" FontH="1"/>`
		},
		createPrivewXmlScript (item) {
			const tagName = 'Script'
			return `<${tagName} Row="${item.row}" Col="${item.col}" Width="${item.width}" Align="${item.align}" FontW="${item.fontWidth}" FontH="${item.fontHeight}" FontBold="${item.fontBold}" FontULine="${item.fontULine}" DataType="${item.dataType}" DisplayFormat="" Visible="1" SCType="0" Height="${item.height}">${item.scriptContent}</${tagName}>`
		},
		createPrivewXmlPage () {
			const content = this.ticksTemplateList.map(item => this.createPrivewXmlBand(item)).join('')
			if (!content) {
				this.$fxMessage.warning('请正确配置打印模板')
			}
			return `<?xml version="1.0" encoding="UTF-8"?><Page MaxCol="${this.getPageMaxCol()}" Title="" Version="8" STable="" SField="">${content}</Page>`
		},
		getPageMaxCol () {
			return Math.ceil(this.ticksTemplateWidth * MM_TO_STEP)
		},
		previewHandler () {
			const previewXmlContent = this.createPrivewXmlPage()
			const data = {
				MaxPixWidth: PREVIEW_IMG_WIDTH,
				Data: new Blob([this.dataSource]),
				Style: new Blob([previewXmlContent])
			}
			const params = new FormData()
			Object.keys(data).forEach(item => {
				params.append(item, data[item])
			})
			this.$fxApi('editer.preview')({
				data
			}).then(res => {
				this.previewImgUrl = res
				this.previewDialogVisible = true
			})
		},
		onTestClick () {
			this.$printstore.setData()
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.tick-design {
	height: 100%;
    overflow: auto
	width: 100%
	background $fxGreen6
	.tick-design__title {
		height: 40px
		display: flex;
		align-items: center;
		margin-left: 10px
		&-name {
			font-size: 14px
			flex: 1
		}
		&-preview {
			margin-left: 20px
			margin-right: 20px
		}
	}
	.tick-design__container {
		flex: 1
		display:flex
		flex-direction: column;
		overflow: auto
		margin-left: 10px
		.tick-design__container-wrapper {
			display flex
			flex: 1
			overflow: auto;
			justify-content: space-around;
			.sub_title {
				font-size: 14px
				font-weight: bold
				margin-bottom: 10px
			}
			.print_design_tools {
				min-width 440px
				max-width: 440px;
				padding-top: 10px
				overflow: auto
				.tool-container {
					border 1px solid #ebedf0
					padding-top: 10px
					.content {
						padding-left: 20px
					}
					.print_design_bank {
						.print-template__design-tag {
							width: 117px;
							height: 50px;
							border-radius: 4px;
							font-weight: bold;
							font-size: 12px;
							margin 16px 12px 10px 0
							color: #787878;
							border: 1px solid #D9D9D9;
							background-color: #F6F6F6;
							position: relative
							&.is-used {
								color: #FD8900;
								border: 1px solid #FD8900;
								background-color: #fe8d0017
							}
						}
						.print-template__design-tag-mark {
							width: 0;
							height: 0;
							border-top: 28px solid #FD8900;
							border-left: 28px solid transparent;
							position: absolute;
							top: 0;
							right: 0;
							.mark-count {
								color: #fff;
								position: absolute;
								top: -26px;
								right: 1px;
								font-size: 10px;
							}
						}
					}
				}
			}
			.print_design_left {
				margin-left 15px
				padding-left: 15px
				padding-right: 15px
				padding-bottom: 30px;
				padding-top: 10px
				position relative
				overflow-y: auto;
				min-width: 410px;
				background: linear-gradient(90deg,hsla(0,0%,89.8%,.3) 1px,transparent 1%),linear-gradient(hsla(0,0%,89.8%,.3) 1px,transparent 1%),rgba(0,0,0,.02);
				background-size: 16px 16px;
				.print-template__container {
					&-title {
						height: 40px
						display: flex
						justify-content: center;
						align-items: center;
						&-name {
							flex: 1
						}
						&-tools {
							width: 50px
							text-align: right
							margin-right: 10px
						}
					}
				}
				.print_design_preview {
					position relative
					background-color #fff
					border 1px solid #ebedf0
					overflow: hidden
					border: 1px solid transparent
					&.is-active {
						background-color: #EAF2FC
						border: 1px solid #B3D2F3
					}
					.item_container {
						width 100%
						height 100%
						position relative
						overflow: hidden
						font-family: "\u5fae\u8f6f\u96c5\u9ed1"
						user-select: none
						position: relative

						.print_area {
							height: 100%
							background-color: #98e3ca57
						}
						.component_wrapper {
							cursor move
							position absolute
							padding: 0 4px
							box-sizing content-box
							border 1px solid transparent
							height: 20px
							line-height: 20px
							box-sizing:border-box
						}
						.selected_wrapper {
							border 1px solid #ccc
							background-color: #FEFE96
						}
					}
				}
			}
		}
	}
	.container-footer {
		height: 50px
		line-height: 50px
		text-align: right;
		margin-right: 20px;
	}
}
</style>
