<template>
    <div class="print-props-editer">
		<div class="print-props-editer__container is-first">
			<div class="sub_title" v-if='selectTemplateContainer.id'>【{{selectTemplateContainer.templateContainerName}}】区域编辑器</div>
			<div v-else>区域编辑器</div>
			<div>
				<template v-if='selectTemplateContainer.id'>
					<div class="editor_item">
						<span>明细数据设置：</span>
						<w-switch
							v-model="selectTemplateContainer.isDetailContainer"
							active-value="1"
							inactive-value="0"
							active-color="#fd8900"
							inactive-color="#d9d9d9"
						></w-switch>
					</div>
					<template v-if="selectTemplateContainer.isDetailContainer==='1'">
						<div class="editor_item">
							<span>数据集：</span>
							<w-select
								v-model="selectTemplateContainer.dtlTable"
								:optionlist="tableList"
								class="editer-select"
								@change="onDtlTableChange"
							></w-select>
						</div>
						<div class="editor_item">
							<span>分组条件：</span>
							<w-select-mulity
								v-model="selectTemplateContainer.groupField"
								:optionlist="filedList"
								:showEmpty="false"
								class="editer-select"
							></w-select-mulity>
						</div>
						<div class="editor_item">
							<span>开启分组头：</span>
							<w-switch
								v-model="selectTemplateContainer.hasGroupHead"
								active-value="1"
								inactive-value="0"
								active-color="#fd8900"
								inactive-color="#d9d9d9"
							></w-switch>
						</div>
						<template v-if="selectTemplateContainer.hasGroupHead==='1'">
							<div class="editor_item">
								<span>分组头字段：</span>
								<w-select-mulity
									v-model="selectTemplateContainer.groupHeadField"
									:optionlist="groupList"
									:showEmpty="false"
									class="editer-select"
								></w-select-mulity>
							</div>
						</template>
						<div class="editor_item">
							<span>开启分组尾：</span>
							<w-switch
								v-model="selectTemplateContainer.hasGroupFoot"
								active-value="1"
								inactive-value="0"
								active-color="#fd8900"
								inactive-color="#d9d9d9"
							></w-switch>
						</div>
						<template v-if="selectTemplateContainer.hasGroupFoot==='1'">
							<div class="editor_item">
								<span>分组尾字段：</span>
								<w-select-mulity
									v-model="selectTemplateContainer.groupFootField"
									:optionlist="groupList"
									:showEmpty="false"
									class="editer-select"
								></w-select-mulity>
							</div>
						</template>
					</template>
				</template>
				<div v-if='!selectTemplateContainer.id'>请选择编辑区域</div>
			</div>
		</div>
		<div class="print-props-editer__container">
			<div class="sub_title" v-if='selectedItem.id'>【{{selectedItem.name || selectedItem.title}}】内容编辑器</div>
			<div v-else>内容编辑器</div>
			<div>
				<template v-if='selectedItem.id'>
					<div class="editor_item">
						<span>位置（行）：</span>
						<el-input-number
							v-model="selectedItem.row"
							step-strictly
							:min="1"
							:max="50"
							@change="onDesignItemRowChange"
						/>
					</div>
					<div class="editor_item">
						<span>位置（列）：</span>
						<el-input-number
							v-model="selectedItem.col"
							step-strictly
							:min="1"
							:max="50"
							@change="onDesignItemColChange"
						/>
					</div>
					<div v-if="isComponentType(selectedItem.componentType, ['data', 'script', 'text', 'line'])" class="editor_item">
						<span>宽度：</span>
						<el-input-number
							v-model="selectedItem.width"
							step-strictly
							:min="1"
							:max="40"
						/>
					</div>
					<div v-if="isComponentType(selectedItem.componentType, ['data', 'script', 'text'])" class="editor_item">
						<span>高度：</span>
						<el-input-number
							v-model="selectedItem.height"
							step-strictly
							:min="1"
							:max="255"
						/>
					</div>
					<div v-if="isComponentType(selectedItem.componentType, ['text'])" class="editor_item">
						<span>内容：</span>
						<w-input
							v-model="selectedItem.textContent"
							class="editer-input"
						/>
					</div>
					<div v-if="isComponentType(selectedItem.componentType, ['data'])" class="editor_item">
						<span>公式：</span>
						<w-input
							v-model="selectedItem.displayFormat"
							class="editer-input"
						/>
					</div>
					<div v-if="isComponentType(selectedItem.componentType, ['data', 'script', 'text'])" class="editor_item">
						<span>字高：</span>
						<w-select
							v-model="selectedItem.fontHeight"
							:optionlist="fontHeightWidthList"
							class="editer-select"
						></w-select>
					</div>
					<div v-if="isComponentType(selectedItem.componentType, ['data', 'script', 'text'])" class="editor_item">
						<span>字宽：</span>
						<w-select
							v-model="selectedItem.fontWidth"
							:optionlist="fontHeightWidthList"
							class="editer-select"
						></w-select>
					</div>
					<div v-if="isComponentType(selectedItem.componentType, ['data', 'script', 'text'])" class="editor_item">
						<span>对齐方式：</span>
						<w-select
							v-model="selectedItem.align"
							:optionlist="alignSelectList"
							class="editer-select"
						></w-select>
					</div>
					<div v-if="isComponentType(selectedItem.componentType, ['data', 'script', 'text'])" class="editor_item">
						<span>字体加粗：</span>
						<w-switch
							v-model="selectedItem.fontBold"
							active-value="1"
							inactive-value="0"
							active-color="#fd8900"
							inactive-color="#d9d9d9"
						></w-switch>
					</div>
					<div v-if="isComponentType(selectedItem.componentType, ['data', 'script', 'text'])" class="editor_item">
						<span>下划线：</span>
						<w-switch
							v-model="selectedItem.fontULine"
							active-value="1"
							inactive-value="0"
							active-color="#fd8900"
							inactive-color="#d9d9d9"
						></w-switch>
					</div>
					<div class="editor_item">
						<el-button
							type='primary'
							class="editor_item__tool-btn"
							@click='onAddTextClick'
						>添加文字</el-button>
					</div>
					<div class="editor_item">
						<el-button
							type='primary'
							class="editor_item__tool-btn"
							@click='onAddDivisionLineClick'
						>添加分割线</el-button>
					</div>
					<div class="editor_item">
						<el-button
							type='danger'
							plain
							class="editor_item__tool-btn"
							@click='onDeletePrintItemClick'
						>删除字段</el-button>
					</div>
				</template>
				<div v-if='!selectedItem.id'>请在样式预览区选择字段</div>
			</div>
			<!-- <div class="editor_item" v-if="getCurrentEditAttrShow('contentOnly')">
				打印内容:
				<el-radio v-model='selectedItem.contentOnly' :label='false'>打印标题和内容</el-radio>
				<el-radio v-model='selectedItem.contentOnly' :label='true'>仅打印内容</el-radio>
			</div>
			<div class="editor_item" v-if="getCurrentEditAttrShow('customTitle')">
				自定义标题：
				<w-input
					class='item-input'
					v-model="selectedItem.title"
					:maxlength='5'
					:regType="$fxCommon.getFxInputReg('userName')"
				></w-input>
			</div>
			<div class="editor_item" v-if="getCurrentEditAttrShow('customText')">
				自定义文字：
				<w-input
					class='item-input'
					v-model="selectedItem.content"
				></w-input>
			</div> -->
			<!-- <div class="editor_item" v-if="getCurrentEditAttrShow('dateFormat')">
				展示方式：
				<el-radio v-model="selectedItem.dateStyle" :label="1">YYYY年MM月DD日，如：2018年07月12日（默认方式）</el-radio>
				<el-radio v-model="selectedItem.dateStyle" :label="2">YYYY/MM/DD，如：2018/07/12</el-radio>
				<el-radio v-model="selectedItem.dateStyle" :label="3">YYYY.MM.DD，如：2018.07.12</el-radio>
			</div> -->
			<!-- <template v-if="getCurrentEditAttrShow('barcodeType')">
				<div class="editor_item">
					展示方式：
					<el-radio v-model="selectedItem.barcodeStyle" :label="1">展示为数字</el-radio>
					<el-radio v-model="selectedItem.barcodeStyle" :label="2">展示为条码</el-radio>
					<el-radio v-model="selectedItem.barcodeStyle" :label="3">展示为条码+数字</el-radio>
				</div>
				<div class="editor_item">
					条码宽度：
					<w-input-number
						class='item-input'
						v-model="selectedItem.barcodeWidth"
					></w-input-number>
				</div>
				<div class="editor_item">
					条码高度：
					<w-input-number
						class='item-input'
						v-model="selectedItem.barcodeHeight"
					></w-input-number>
				</div>
			</template> -->
		</div>
	</div>
</template>
<script>
export default {
	name: 'print-props-editer',
	props: {
		positionYStep: Number,
		positionXStep: Number,
		selectTemplateContainer: {
			type: Object,
			default: () => {
				return {}
			}
		},
		selectedItem: {
			type: Object,
			default: () => {
				return {}
			}
		},
		printFieldStore: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	data () {
		return {
			fontHeightWidthList: [{
				id: '1',
				name: '正常'
			}, {
				id: '2',
				name: '2倍'
			}, {
				id: '3',
				name: '3倍'
			}, {
				id: '4',
				name: '4倍'
			}, {
				id: '5',
				name: '5倍'
			}, {
				id: '6',
				name: '6倍'
			}],
			alignSelectList: [{
				id: '0',
				name: '左对齐'
			}, {
				id: '1',
				name: '居中对齐'
			}, {
				id: '2',
				name: '右对齐'
			}],
			tableList: [],
			filedList: [],
			groupList: []
		}
	},
	computed: {
		isComponentType () {
			return (type, typeList = []) => {
				return typeList.includes(type)
			}
		}
	},
	watch: {
		printFieldStore: {
			handler (val) {
				this.tableList = val.map(item => {
					return {
						id: item.table,
						name: item.name,
						list: item.list
					}
				})
			},
			immediate: true
		},
		selectTemplateContainer (val) {
			const tableCurrent = this.tableList.find(item => item.id === val.dtlTable)
			if (tableCurrent) {
				this.filedList = tableCurrent.list.map(item => {
					return {
						id: item.field,
						name: item.name
					}
				})
			}
			val.componentsList && this.syncGroupList(val.componentsList)
		},
		'selectTemplateContainer.componentsList' (val) {
			val && this.syncGroupList(val)
		}
	},
	methods: {
		syncGroupList (list) {
			this.groupList = list.map(item => {
				return {
					id: item.field,
					name: item.name
				}
			})
			const groupListIds = this.groupList.map(item => item.id)
			this.selectTemplateContainer.groupHeadField = this.selectTemplateContainer.groupHeadField.filter(item => {
				return groupListIds.includes(item)
			})
			this.selectTemplateContainer.groupFootField = this.selectTemplateContainer.groupFootField.filter(item => {
				return groupListIds.includes(item)
			})
		},
		onDesignItemRowChange () {
			this.selectedItem.positionY = (this.selectedItem.row - 1) * this.positionYStep
		},
		onDesignItemColChange () {
			this.selectedItem.positionX = (this.selectedItem.col - 1) * this.positionXStep
		},
		onAddTextClick () {
			this.$emit('on-add-text')
		},
		onAddDivisionLineClick () {
			this.$emit('on-add-division-line')
		},
		onDeletePrintItemClick () {
			if (!this.$fxUtils.isEmptyObj(this.selectedItem)) {
				this.$emit('on-delete-print-item', this.selectedItem)
			}
		},
		onDtlTableChange (val) {
			this.selectTemplateContainer.groupField = []
			const tableCurrent = this.tableList.find(item => item.id === val)
			if (tableCurrent) {
				this.filedList = tableCurrent.list.map(item => {
					return {
						id: item.field,
						name: item.name
					}
				})
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
.print-props-editer {
	padding: 0 15px
	box-sizing: border-box
	background: linear-gradient(90deg,hsla(0,0%,89.8%,.3) 1px,transparent 1%),linear-gradient(hsla(0,0%,89.8%,.3) 1px,transparent 1%),rgba(0,0,0,.02);
	background-size: 16px 16px;
	padding-top: 10px
	min-width: 500px;
	overflow-y: auto;
	&__container {
		width 420px
		padding 15px
		border 1px solid #ebedf0
		background-color: #fff
		margin-top: 10px;
		&.is-first {
			margin-top: 39px;
		}
		.editor_item {
			margin-top: 14px
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			>>>.el-input-number--small {
				width 116px
			}
			>>>.wind-link {
				margin-right: 0
			}
			.item-input {
				width: 180px
			}
			&__tool-btn {
				width: 100%
			}
			.editer-select {
				width: 200px
			}
			.editer-input {
				width: 200px
			}
		}
	}
}
</style>
