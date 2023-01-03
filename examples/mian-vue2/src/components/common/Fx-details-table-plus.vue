<template>
	<fx-list-virtual-table-plus
		ref="listTable"
		:virtual="virtual"
		:tableColumn="tableColumn"
		:tableValiDate="tableValiDate"
		:subRowValiDate="subRowValiDate"
		:tableEditColumnProp="tableEditColumnProp"
		:tableExpandEditColumnProp="tableExpandEditColumnProp"
		:tableEditEnterColumnProp="tableEditEnterColumnProp"
		:listData="tableDataComputed"
		:listTotal="showPagination ? '' : tableDataComputed.length || 0"
		:showPagination="showPagination"
		:showIndex='showIndex'
		:expandRows="subColumns"
		:selectable="selectable"
		:border="border"
		:headerBorder="headerBorder"
		:showTools="showTools"
		:showColumnFilterBtn="showColumnFilterBtn"
		:fpExpandAsync="fpExpandAsync"
		:selectedRows.sync="currentSelectedRows"
		:dragCellKeepTableWidth="dragCellKeepTableWidth"
		:stripe="stripe"
		:highlightCurrentRow="highlightCurrentRow"
		:overWidthAutofit="overWidthAutofit"
		:row-class-name="rowClassNameHandler"
		:row-style="rowStyle"
		:cell-class-name="cellClassNameHandler"
		:cell-style="cellStyle"
		:indexCellRender="indexCellRender"
		:collectionCellRender="collectionCellRender"
		:collectionProp="collectionProp"
		:collectionValiDate="collectionValiDate"
		:showSummary="showSummary"
		:showSummaryBottom="showSummaryBottom"
		:summaryMethod="summaryMethod"
		:selectAndIndexFixed="selectAndIndexFixed"
		:indexContinuous="indexContinuous"
		minWidth="100px"
		:minHeight='minHeight'
		:trHeight='trHeight'
		class="fx-details-table"
		@on-row-edit-enter="doRowEditEnter"
		@on-row-edit-tab="doRowEditTab"
		@on-row-edit-up-down-change="setRowEdit"
		@on-sort-change="onSortChange"
		@on-page-change="onPageChange"
	>
		<div slot="btn-tools-left" class="tools-left">
			<div class="tools-left-left">
				<w-input
					v-if='tableSearchInput'
					:value="tableSearchKey"
					placeholder="请输入内容"
					prefix-icon="el-icon-search"
					class="table-search-input"
					@change="onSearchKeyChange"
					@focus="onSearchKeyFocus"
				>
				</w-input>
				<template v-if="fullScreenBtn">
					<w-link v-show='fullScreenBtnVisible' icon="table-details-full-screen" @click="onFullScreen">全屏</w-link>
					<w-link v-show='!fullScreenBtnVisible' icon="table-details-unFull-screen" @click="offFullScreen">取消全屏</w-link>
				</template>
				<slot name="btn-tools-left"></slot>
			</div>
			<div class="tools-left-right">
				<w-link v-if="subColumns.length>0" type="primary" icon="table-details-fold" @click="onAllFoldclick">全部收起</w-link>
				<w-link v-if="subColumns.length>0" type="primary" icon="table-details-expand" @click="onAllExpandClick">全部展开</w-link>
				<w-link
					v-show='showMistakeCheck'
					:disabled="mistakeBtnDisabled"
					type="primary"
					icon="table-details-safe"
					@click="onMistakeCheck"
				>异常警告</w-link>
				<w-link v-show='showDeleteBtn' :disabled="computedDeleteDisabled" type="danger" icon="table-details-delete" @click="onDeleteClick">删除</w-link>
				<w-popover
					v-show="$slots['setting-mulity']||$scopedSlots['setting-mulity']"
					v-model="settingPopperVisible"
					:disabled="disabled"
					trigger="click"
					placement="bottom"
					width="300"
				>
					<w-link
						slot="reference"
						:disabled="disabled"
						type="primary"
						icon="table-details-setting"
						@click="onMulitySettingClick"
					>批量设置</w-link>
					<slot name="setting-mulity" :visible="settingPopperVisible"></slot>
				</w-popover>
				<slot name="btn-tools-left-right"></slot>
			</div>
		</div>
		<div v-if="canAdd" slot="btn-tools-right" class="tools-right">
			<el-button v-if="canAddAttached" type="primary" :disabled="disabled" @click="onAddAttached">新增附成品</el-button>
			<el-button v-if="canAddSub" type="primary" :disabled="disabled" @click="onAddMaterial">新增配料</el-button>
			<el-button v-if="canAddItem" type="primary" :disabled="disabled" @click="onAddOnce">新增成品</el-button>
		</div>
		<div v-if="tableData.length===0" slot="empty" class="details-table-empty">
			<div v-if="canAdd">
				<w-icon type="details-list-empty" class="details-list-empty-icon"></w-icon>
				<div class="details-list-empty-text">您还没有添加任何品项</div>
				<div class="details-list-empty-text">可以在新增品项按钮处操作新增，也可以立即新增</div>
				<el-button v-if="canAddMulity" type="primary" class="popper-btn" @click="onAddMulity" :disabled="disabled">立即新增</el-button>
				<el-button v-else type="primary" class="popper-btn" @click="onAddOnce" :disabled="disabled">立即新增</el-button>
			</div>
			<div v-else>
				<div v-if="$slots.empty" slot="empty" class="details-table-empty">
					<slot name="empty"></slot>
				</div>
				<div v-else>暂无表格数据</div>
			</div>
		</div>
		<div slot="summary-bottom" class="summary-bottom">
			<div class="sum-title"><w-icon type="table-details-product"></w-icon><span>品项合计 ({{this.tableDataComputed.length}})</span></div>
			<div class="sum-row">
				<div v-for="(sumColumn , index) in this.sumColumnPropList.slice(0,2)" :key="sumColumn.prop" :class="{'summary-item': index ===1,'summary-item-pl': index ===0}">
					<span class="sum-item"><span>{{sumColumn.label}} : </span><span class="sum-num">{{getColumnSumData(sumColumn)}}</span></span>
					<span v-if="index === 1||index === 3" style="margin-right: 40px; color: #ccc;font-weight: 900;">｜</span>
				</div>
				<div v-for="(sumColumn , index) in this.sumColumnPropList.slice(6,10)" :key="sumColumn.prop" class="summary-item">
					<span class="sum-item"><span>{{sumColumn.label}} : </span><span class="sum-num">{{getColumnSumData(sumColumn)}}</span></span>
					<span v-if="index === 1" style="margin-right: 40px; color: #ccc;font-weight: 900;">｜</span>
				</div>
			</div>
			<div class="sum-row">
				<div v-for="(sumColumn) in this.sumColumnPropList.slice(2,6)" :key="sumColumn.prop" class="summary-item-pl">
					<span class="sum-item"><span>{{sumColumn.label}} : </span><span class="sum-num">{{getColumnSumData(sumColumn)}}</span></span>
				</div>
			</div>
			<el-divider></el-divider>
			<div class="sum-row">
				<div class="sum-title"><w-icon type="table-details-dosing"></w-icon><span>配料合计 ({{this.subSum}})</span></div>
				<div v-for="subSumColumn in this.subColumnPropList" :key="subSumColumn.prop" class="summary-item-pl">
					<span class="sum-item"><span>{{subSumColumn.label}} : </span><span class="sum-num">{{getSubColumnSumData(subSumColumn)}}</span></span>
				</div>
			</div>
		</div>
	</fx-list-virtual-table-plus>
</template>
<script>
/**
 * fx-details-table-plus by wzw
 * @desc fx-details-table-plus 明细表格

 * @param {Array}  tableColumn - 列模型

 * @param {String} tableColumn.prop -列的key
 * @param {Boolean} tableColumn.visible -列的显示
 * @param {String} tableColumn.label -列头文本
 * @param {String} tableColumn.width -列宽度
 * @param {String} tableColumn.align -列对齐方式
 * @param {Boolean} tableColumn.fixed -列固定列
 * @param {Boolean} tableColumn.required -必选列
 * @param {Boolean} tableColumn.sortable -可排序列
 * @param {String} tableColumn.sortKey -需要排序的字段名，默认为列prop
 * @param {Boolean} tableColumn.editColumn -可编辑列, hover时, 可编辑列会显示虚线
 * @param {Function} tableColumn.fxRender -render渲染
 * @param {Function} tableColumn.click -列点击回调
 * @param {String} tableColumn.rowMerge -合并单元格-row合并字段
 * @param {Boolean} tableColumn.summary -合计此列
 * @param {Boolean} tableColumn.summaryFormatter -列的所有数据进行合计计算后的格式化方法, 参数为val
 * @param {Boolean} tableColumn.summaryHandler -列的每一个数据的格式化方法, 参数为val, row

 * @param {fpExpandAsync}  [Function] - 打开单条详情的异步方法
 * @param {fpExpandAllAsync}  [Function] - 打开全部详情的异步方法
 * @param {selectedRows}  [Array] - 默认选中数据
 * @param {dragCellKeepTableWidth}  [Boolean] - 拖动单元格边框改变单元格大小 是否 总保持table固定宽度
 * @param {stripe}  [Boolean] - 是否为斑马纹table
 * @param {overWidthAutofit}  [Boolean] - 当列的宽度超出table的宽度是否自动适应列的宽度已匹配table宽度
 * @param {indexCellRender}  [Function] - 索引(详情)单元格Render函数
 * @param {collectionCellRender}  [Function] - 集合类型标题单元格Render函数
 * @param {collectionProp}  [Object] - 集合类型标题单元格Prop设置
 * @param {showSummary}  [Boolean] - 显示合计
 * @param {showSummaryBottom}  [Boolean] - 显示合计总数
 * @param {defaultSortParam} [Object] - 默认排序参数
 * @param {selectAndIndexFixed} [Boolean] - 默认固定多选框列、单选框列、详情按钮列和序号列
 * @param {Boolean} showPagination - 是否显示分页控件
 * @param {Boolean} indexContinuous - 是否开启分页连续序号，默认不开启
 * @param {String} minHeight - 最小高度
 * @param {Number} trHeight - 最小高度
 *

 * @methods {setRowEdit}  (row:object, type:string) - 开启行编辑状态
 * @methods {onTabSetRowEdit}  - 按Tab键开启行编辑状态
 * @methods {onAddOnce}  - 单行新增
 * @methods {canAddMulity}  - 是否开启批量新增，默认开启
 * @methods {doRowEditEnter}  - 主动触发行编辑最后一列回车事件
 * @methods {doRowEditTab}  - 主动触发行编辑最后一列Tab事件
 * @methods {getSelectRows}  - 获取当前选中的明细
 * @methods {clearSelected}  - 清空前选中的明细
 * @methods {clearSearchKey}  - 清空搜索key
 * @methods {clearExpanded}  - 清空展开行
 * @methods {clear}  - 清理table(选中明细 , 搜索key)
 * @methods {checkDetailsUnSaving}  - 检查当前是否处于编辑状态, 如果处于编辑状态则保存明细 切换为非编辑状态,此方法接受一个函数, 传参为当前row, 如果返回false 则校验lastEditRow, 如果返回 true 则自动删除位于末尾的未保存的明细
 * @methods {setListCellFocus} - 聚焦单元格
 * @methods {setListSubCellFocus} - 聚焦子表单元格
 * @methods {getEditingRowData} - 获取当前编辑行的数据
 * @methods {getSummaryData} - 获取合计数据
 **/
export default {
	name: 'fx-details-table',
	props: {
		// 列模型
		tableColumn: {
			type: Array,
			default: () => {
				return []
			}
		},
		// table数据
		tableData: {
			type: Array,
			default: () => {
				return []
			}
		},
		minHeight: String,
		// 行校验参数
		tableValiDate: {
			type: Array,
			default: () => {
				return []
			}
		},
		// 子表行校验参数
		subRowValiDate: {
			type: Array,
			default: () => {
				return []
			}
		},
		// 可编辑列名
		tableEditColumnProp: {
			type: Array,
			default: () => {
				return []
			}
		},
		// 可编辑子表列名
		tableEditSubColumnProp: {
			type: Array,
			default: () => {
				return []
			}
		},
		// 可编辑列名<展开行>
		tableExpandEditColumnProp: {
			type: Array,
			default: () => {
				return []
			}
		},
		// 可编辑列<在这些列按Enter键直接触发换行>
		tableEditEnterColumnProp: {
			type: Array,
			default: () => {
				return []
			}
		},
		// 显示新增/批量新增按钮, 允许自动新增功能
		canAdd: {
			type: Boolean,
			default: true
		},
		canAddAttached: {
			type: Boolean,
			default: true
		},
		// 是否开启批量新增，默认开启
		canAddMulity: {
			type: Boolean,
			default: true
		},
		canAddSub: {
			type: Boolean,
			default: true
		},
		canAddItem: {
			type: Boolean,
			default: true
		},
		// 开启选择功能
		selectable: {
			type: Boolean,
			default: true
		},
		// 主id
		mainId: String,
		// 是否带有纵向边框
		border: Boolean,
		// 表头是否带有纵向边框
		headerBorder: {
			type: Boolean,
			default: true
		},
		// 是否开启操作栏
		showTools: {
			type: Boolean,
			default: true
		},
		// 开启编辑状态之前
		fpBeforeRowEdit: {
			type: Function,
			default: () => {
				return Promise.resolve()
			}
		},
		// 字表开启编辑状态之前
		fpBeforeSubRowEdit: {
			type: Function,
			default: () => {
				return Promise.resolve()
			}
		},
		// 开启编辑状态
		fpOnRowEdit: Function,
		// 新增明细创建rowData方法
		fpInitAddDetailsData: {
			type: Function,
			default: () => {
				return Promise.resolve({})
			}
		},
		// 新增明细附属品rowData方法
		fpInitAddAttachedData: {
			type: Function,
			default: () => {
				return Promise.resolve({})
			}
		},
		// 明细新增字表方法
		fpInitAddSubData: {
			type: Function,
			default: () => {
				return Promise.resolve({})
			}
		},
		// 保存整单方法
		fpSaveMain: {
			type: Function,
			default: () => {
				return Promise.resolve({})
			}
		},
		// 保存明细方法
		fpSaveDetails: Function,
		// 保存子表明细方法
		fpSaveSubDetails: Function,
		// 删除明细方法
		fpDeleteDetails: Function,
		showIndex: {
			type: Boolean,
			default: true
		},
		searchProps: {
			type: Array,
			default: () => {
				return ['item.name', 'item.code', 'item.pinYin']
			}
		},
		// 是否禁用
		disabled: Boolean,
		// 防错校验按钮是否禁用，优先级大于disabled，不设置则以disabled为准
		mistakeDisabled: {
			type: Boolean,
			default: () => {
				return null
			}
		},
		// 是否允许开启编辑状态 优先级大于disabled 但是必须为false:Boolean才生效
		canEdit: null,
		// 自定义控制全屏/取消全屏按钮, 一旦启用, 自动全屏功能则失效
		showFullScreenBtn: null,
		// 是否显示全屏/取消全屏按钮，默认显示
		fullScreenBtn: {
			type: Boolean,
			default: true
		},
		// 是否开启防错校验按钮，默认不开启
		showMistakeCheck: {
			type: Boolean,
			default: false
		},
		// 显示删除按钮
		showDeleteBtn: {
			type: Boolean,
			default: true
		},
		// 控制删除是否禁用的主属性
		deleteDisabled: {
			type: Boolean,
			default: null
		},
		// 开启列显示/隐藏控件
		showColumnFilterBtn: {
			type: Boolean,
			default: true
		},
		// 显示筛选输入框
		tableSearchInput: {
			type: Boolean,
			default: true
		},
		// 开启虚拟渲染
		virtual: {
			type: Boolean,
			default: true
		},
		// 展开行配置
		subColumns: {
			type: Array,
			default: () => {
				return []
			}
		},
		// 打开单条详情的异步方法
		fpExpandAsync: Function,
		// 打开全部详情的异步方法
		fpExpandAllAsync: Function,
		// 默认选中数据
		selectedRows: {
			type: Array,
			default: () => {
				return []
			}
		},
		// 拖动单元格边框改变单元格大小 是否 总保持table固定宽度
		dragCellKeepTableWidth: Boolean,
		// 是否为斑马纹table
		stripe: {
			type: Boolean,
			default: false
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
		collectionValiDate: Array,
		// 显示合计
		showSummary: Boolean,
		// 显示合计总计
		showSummaryBottom: Boolean,
		// 默认固定多选框列、单选框列、详情按钮列和序号列
		selectAndIndexFixed: {
			type: Boolean,
			default: true
		},
		// 默认筛选参数
		defaultSortParam: {
			type: Object,
			default: null
		},
		// 是否显示分页控件
		showPagination: {
			type: Boolean,
			default: false
		},
		// 是否开启分页连续序号
		indexContinuous: Boolean,
		trHeight: Number
	},
	data () {
		return {
			btnPopperVisible: false,
			settingPopperVisible: false,
			parentDialog: null,
			tableSearchKey: '',
			expandRowKeys: [],
			subSelectedIdMap: {},
			rowVerification: this.$fxUtils.fxDataVerification(),
			subRowVerification: this.$fxUtils.fxDataVerification(),
			isEditingRowIndex: -1,
			isEditingSubRowIndex: -1,
			subSum: 0,
			sortParams: null,
			currentSelectedRows: []
		}
	},
	computed: {
		tableDataComputed () {
			return this.tableData.filter(item => {
				// 配料品项筛选
				let hasSubItem = ''
				if (item.dosingDetails) {
					hasSubItem = item.dosingDetails.some(subItem => {
						return this.$fxUtils.fuzzyQueryObj(subItem, this.tableSearchKey, this.searchProps) || subItem.id === ''
					})
				}
				return this.$fxUtils.fuzzyQueryObj(item, this.tableSearchKey, this.searchProps) || item.id === '' || hasSubItem
			})
		},
		isEditing () {
			return !!(~this.isEditingRowIndex)
		},
		isEditingRow () {
			return ~this.isEditingRowIndex ? this.tableDataComputed[this.isEditingRowIndex] : null
		},
		isEditingSubIndex () {
			const isEditingSubIndex = {
				rowIndex: -1,
				subIndex: -1
			}
			for (const row of this.tableData) {
				for (const subRow of row.dosingDetails) {
					if (subRow.isEdit === true) {
						isEditingSubIndex.rowIndex = row.$fxIndex
						isEditingSubIndex.subIndex = subRow.$fxIndex
					}
				}
			}
			return isEditingSubIndex
		},
		isSubEditing () {
			return !!(~this.isEditingSubIndex.subIndex)
		},
		isEditingSubRow () {
			return this.tableDataComputed[this.isEditingSubIndex.rowIndex].dosingDetails[this.isEditingSubIndex.subIndex]
		},
		validateColumn () {
			return this.tableColumn.filter(item => {
				return typeof item.validate === 'function'
			})
		},
		isFullScreen () {
			return this.parentDialog && this.parentDialog.isFullScreen()
		},
		fullScreenBtnVisible () {
			return this.$fxUtils.isDef(this.showFullScreenBtn) ? this.showFullScreenBtn : !this.isFullScreen
		},
		mistakeBtnDisabled () {
			return this.mistakeDisabled === null ? !this.allowed2edit : this.mistakeDisabled
		},
		allowed2edit () {
			return !((this.disabled && this.canEdit !== true) || this.canEdit === false)
		},
		computedDeleteDisabled () {
			if (this.deleteDisabled === null) {
				return this.disabled
			} else {
				return this.deleteDisabled
			}
		},
		sumColumnPropList () {
			return this.tableColumn.filter(item => {
				return item.summary
			})
		},
		subColumnPropList () {
			return this.subColumns.filter(item => {
				return item.summary
			})
		}
	},
	watch: {
		tableData: {
			immediate: true,
			handler (val, oldValue) {
				if (val !== oldValue) {
					this.isEditingRowIndex = -1
					this.$nextTick(() => {
						this.$refs.listTable.refreshSortType()
					})
				}
			}
		},
		selectedRows: {
			immediate: true,
			handler (newVal, oldVal) {
				if (newVal !== oldVal) {
					this.currentSelectedRows = newVal
				}
			}
		},
		currentSelectedRows (val) {
			this.$emit('update:selectedRows', val)
		}
	},
	created () {
		this.parentDialog = this.$fxUtils.vFindParentByName(this, 'wind-dialog')
	},
	methods: {
		// [public]是否处于行编辑状态
		isRowEditing () {
			return this.isEditing
		},
		// [public]开启编辑状态
		setRowEdit (row, type) {
			// 行编辑
			if (!this.allowed2edit) {
				return false
			}
			const index = row.$fxIndex
			if (this.isEditingRowIndex === index && this.isEditing) {
				return Promise.resolve()
			} else {
				return this.doEditingSave().then(this.doEditingSubSave).then(() => {
					return this.doSetRowEdit(row, index, type)
				})
			}
		},
		// 子表开启编辑状态
		setSubEdit (subRow, row, type) {
			// 行编辑
			if (!this.allowed2edit) {
				return false
			}
			const rowIndex = row.$fxIndex
			const subIndex = subRow.$fxIndex
			// 主明细正在编辑则保存主明细
			if (this.isEditing) {
				return this.doEditingSave().then(() => {
					return this.doSetSubRowEdit(subRow, row, subIndex, type)
				})
			} else if (this.isEditingSubIndex.rowIndex === rowIndex && this.isEditingSubIndex.subIndex === subIndex && this.isSubEditing) {
				return Promise.resolve()
			} else {
				return this.doEditingSubSave().then(() => {
					return this.doSetSubRowEdit(subRow, row, subIndex, type)
				})
			}
		},
		// [public]按Tab键开启编辑状态
		onTabSetRowEdit () {
			const row = this.tableDataComputed[0]
			const index = 0
			const type = this.tableEditColumnProp[0]
			if (!this.allowed2edit) {
				return false
			}
			this.doScrollLeft().then(() => {
				if (this.isEditingRowIndex === index && this.isEditing) {
					return this.setRowEditHandler(row, index, type)
				} else {
					return this.doEditingSave().then(() => {
						return this.doSetRowEdit(row, index, type)
					})
				}
			})
		},
		// 编辑未保存的row
		doEditingSave () {
			return new Promise((resolve, reject) => {
				// 主明细
				if (this.isEditing) {
					this.onSaveDetails((res) => {
						resolve(res)
					}, (error) => {
						reject(error)
					})
				} else {
					resolve()
				}
			})
		},
		// 编辑未保存的subRow
		doEditingSubSave () {
			return new Promise((resolve, reject) => {
				if (~this.isEditingSubIndex.subIndex) {
					this.onSaveSubDetails(() => {
						resolve()
					}, (error) => {
						reject(error)
					})
				} else {
					resolve()
				}
			})
		},
		// 开启行编辑之前的行为
		doSetRowEdit (row, index, type) {
			return this.fpBeforeRowEdit(row, index, type).then(() => {
				return this.setRowEditHandler(row, index, type).then(() => {
					row.$fxCalculation = this.$fxUtils.createUUID()
					this.$fxCalculation.setCache(row)
					this.rowVerification.resetData(row)
					return Promise.resolve(row, index, type)
				})
			})
		},
		// 开启行编辑的方法
		setRowEditHandler (row, index, type = this.tableEditColumnProp[0] || this.tableExpandEditColumnProp[0]) {
			return new Promise(resolve => {
				if (index >= this.tableDataComputed.length || index < 0) {
					return false
				}
				this.$set(this.tableDataComputed[index], 'isEdit', true)
				this.isEditingRowIndex = index
				this.$nextTick(() => {
					if (typeof this.fpOnRowEdit === 'function') {
						if (!this.$refs.listTable.isRenderedRow(row.$fxIndex)) {
							this.$refs.listTable.scrollToIndex(row.$fxIndex).then(() => {
								this.fpOnRowEdit(row, index, type).then(resolve)
							})
						} else {
							this.fpOnRowEdit(row, index, type).then(resolve)
						}
					} else {
						if (this.tableEditColumnProp.length > 0) {
							if (!this.$refs.listTable.isRenderedRow(row.$fxIndex)) {
								this.$refs.listTable.scrollToIndex(row.$fxIndex).then(() => {
									this.setListCellFocus(type)
								})
							} else {
								this.setListCellFocus(type)
							}
						}
						resolve()
					}
				})
			})
		},
		// 开启子表行编辑之前的行为
		doSetSubRowEdit (subRow, row, subIndex, type) {
			return this.fpBeforeSubRowEdit(subRow, row, subIndex, type).then(() => {
				return this.setSubRowEditHandler(subRow, row, subIndex, type).then(() => {
					subRow.$fxCalculation = this.$fxUtils.createUUID()
					this.$fxCalculation.setCache(subRow)
					this.subRowVerification.resetData(subRow)
					return Promise.resolve(subRow, row, subIndex, type)
				})
			})
		},
		// 开启子表行编辑的方法
		setSubRowEditHandler (subRow, row, subIndex, type = this.tableEditSubColumnProp[0]) {
			// 如果是新增则type和focusType = this.tableEditSubColumnProp[0]
			return new Promise(resolve => {
				this.$set(row.dosingDetails[subIndex], 'isEdit', true)
				this.$nextTick(() => {
					if (typeof this.fpOnRowEdit === 'function') {
						// this.$refs.listTable.scrollToIndex(row.$fxIndex).then(() => {
						this.fpOnRowEdit(row, subIndex, type, 'sub').then(resolve)
						// })
					} else {
						resolve()
					}
				})
			})
		},
		// 关闭行编辑的方法
		setRowUnEdit () {
			return new Promise(resolve => {
				if (this.tableDataComputed[this.isEditingRowIndex]) {
					this.$set(this.tableDataComputed[this.isEditingRowIndex], 'isEdit', false)
					this.isEditingRowIndex = -1
				}
				resolve()
			})
		},
		// 关闭子表行编辑的方法
		setSubRowUnEdit () {
			return new Promise(resolve => {
				this.$set(this.isEditingSubRow, 'isEdit', false)
				resolve()
			})
		},
		// [public]新增一行方法
		onAddOnce () {
			const editIndex = this.isEditingRowIndex
			const addIndex = ~editIndex && !this.isEditingRow.additionFlag ? editIndex + 1 : this.tableDataComputed.length
			this.btnPopperVisible = false
			const additionSum = this.isEditingRow && this.isEditingRow.additionProductList ? this.isEditingRow.additionProductList.length : 0
			this.fpSaveMain().then(this.doEditingSave).then(this.doEditingSubSave).then(this.doScrollLeft).then(() => {
				this.fpInitAddDetailsData(0, addIndex).then(res => {
					if (~editIndex) {
						let sortNum = 1
						if (this.tableDataComputed[editIndex + 1]) {
							sortNum = this.$fxUtils.toFixedParseNumber((this.tableDataComputed[editIndex].sortNum + this.tableDataComputed[editIndex + 1].sortNum) / 2, 8)
						} else {
							sortNum = this.tableDataComputed[editIndex].sortNum + 1
						}
						// const insertIndex = this.tableData.findIndex(item => {
						// 	return item.id === this.tableDataComputed[editIndex].id
						// })
						const row = {
							id: '',
							sortNum,
							$fxCalculation: this.$fxUtils.createUUID(),
							...res
						}
						this.$fxCalculation.setCache(row)
						this.tableData.splice(addIndex + additionSum, 0, row)
						this.setRowEditHandler(row, addIndex + additionSum)
						// this.tableData.splice(insertIndex + 1, 0, row)
						// this.setRowEditHandler(row, editIndex + 1)
					} else {
						const index = this.tableDataComputed.length - 1
						const sortNum = ~index ? this.$fxUtils.toFixedParseNumber(this.tableDataComputed[index].sortNum, 8) + 1 : 1
						const row = {
							id: '',
							sortNum,
							$fxCalculation: this.$fxUtils.createUUID(),
							...res
						}
						this.$fxCalculation.setCache(row)
						this.tableData.push(row)
						this.setRowEditHandler(row, this.tableDataComputed.length - 1)
					}
					// this.$refs.listTable.scrollToBottom && this.$refs.listTable.scrollToBottom()
				})
			})
		},
		// 新增附成品
		onAddAttached () {
			this.$refs.listTable.getSingleProductSelectedRow().then(row => {
				const additionProductList = this.tableData.find(item => {
					return item.id === row.id
				}).additionProductList
				const additionSum = additionProductList ? additionProductList.length : 0
				const index = row.$fxIndex + 1
				this.fpSaveMain().then(this.doEditingSave).then(this.doEditingSubSave).then(this.doScrollLeft).then(() => {
					this.fpInitAddDetailsData(1, index).then(res => {
						// const sortNum = ~index ? this.$fxUtils.toFixedParseNumber(this.tableDataComputed[index].sortNum, 8) + 1 : 1
						const addRow = {
							id: '',
							// sortNum,
							$fxCalculation: this.$fxUtils.createUUID(),
							...res,
							parentId: row.id
						}
						// this.$fxCalculation.setCache(row)
						this.tableData.splice(index + additionSum, 0, addRow)
						row.additionProductList.push(addRow)
						this.setRowEditHandler(addRow, index + additionSum)
						this.$refs.listTable.scrollToBottom && this.$refs.listTable.scrollToBottom()
					})
				})
			})
		},
		// 新增配料
		onAddMaterial () {
			this.$refs.listTable.getSingleSelectedRow().then((row) => {
				this.fpSaveMain().then(this.doEditingSave).then(this.doEditingSubSave).then(this.doScrollLeft).then(() => {
					this.fpInitAddSubData().then(res => {
						const subIndex = row.dosingDetails.length
						const subRow = {
							id: '',
							$rowIndex: row.$fxIndex,
							$fxIndex: subIndex,
							detailProductId: row.id, // 父明细id
							$fxCalculation: this.$fxUtils.createUUID(),
							...res
						}
						// 打开主明细的extend
						row.dosingDetails.push(subRow)
						this.setCurrentExpand()
						// 开启行编辑状态
						this.setSubRowEditHandler(subRow, row, subIndex)
					})
				})
			})
		},
		setCurrentExpand () {
			this.$refs.listTable.setCurrentExpand()
			this.$refs.listTable.scrollToBottom && this.$refs.listTable.scrollToBottom()
		},
		// 切换bom 展开当前子表
		setBomAddExpand (row) {
			this.$refs.listTable.setBomAddExpand(row)
		},
		// 切换bom 展开当前子表
		setBomCurrentExpand (row) {
			this.$refs.listTable.setBomCurrentExpand(row)
		},
		setBomCurrentRefresh (row) {
			this.$refs.listTable.setBomCurrentRefresh(row)
		},
		onAddMulity () {
			this.btnPopperVisible = false
			this.fpSaveMain().then(this.doEditingSave).then(() => {
				this.$emit('on-add-mulity')
			})
		},
		// 保存明细方法
		onSaveDetails (successCb, errorCb) {
			const row = this.isEditingRow
			const hasEdit = !this.rowVerification.checkData(row)
			this.$refs.listTable.verificationRowData(row).then(() => {
				if (typeof this.fpSaveDetails === 'function' && hasEdit) {
					const origin = this.rowVerification.getOriginData()
					return this.fpSaveDetails(row, origin).then(res => {
						if (res.row && !row.id) {
							row.id = res.row.id
							row.sortNum = res.row.sortNum
						}
						this.setRowUnEdit()
						successCb(res)
					})
				} else {
					this.setRowUnEdit()
					successCb()
				}
			}).catch(error => {
				if (errorCb) {
					errorCb(error)
				}
			})
		},
		// 保存子表明细方法
		onSaveSubDetails (successCb, errorCb) {
			// 在编辑状态的subRow
			const subRow = this.isEditingSubRow
			// 子表行在主表明细中的index
			const mainRowIndex = this.isEditingSubIndex.rowIndex
			// 子表行是否被修改过
			const hasSubEdit = !this.subRowVerification.checkData(subRow)
			const detailProductId = this.tableData[this.isEditingSubIndex.rowIndex].id
			// 校验子表行
			this.$refs.listTable.verificationSubRowData(subRow, mainRowIndex).then(() => {
				if (typeof this.fpSaveSubDetails === 'function' && hasSubEdit) {
					const origin = this.subRowVerification.getOriginData()
					return this.fpSaveSubDetails(subRow, origin, detailProductId).then(res => {
						if (res && !subRow.id) {
							subRow.id = res.id
						}
						// 关闭当前子表行的编辑状态
						this.setSubRowUnEdit()
						successCb()
					})
				} else {
					this.setSubRowUnEdit()
					successCb()
				}
			}).catch(error => {
				if (errorCb) {
					errorCb(error)
				}
			})
		},
		// [public]行编辑最后一列触发回车事件的方法
		doRowEditEnter () {
			if (this.isEditingRowIndex === this.tableDataComputed.length - 1) {
				this.$refs.listTable.clearExpanded()
				this.canAdd ? this.onAddOnce() : this.doEditingSave()
			} else {
				this.$refs.listTable.clearExpanded()
				this.setRowEdit(this.getRowByIndex(this.isEditingRowIndex + 1)).then(this.doScrollLeft)
			}
		},
		// [public]行编辑最后一列触发Tab事件的方法
		doRowEditTab ({ event, row, index }) {
			if (event) {
				this.doRowEditTabHandler(event)
			} else {
				this.$refs.listTable.cellIntoExpandCellTabHandler({ row, index }).then(() => {
					this.doRowEditTabHandler({ code: 'Tab' })
				})
			}
		},
		doRowEditTabHandler (event) {
			if (this.isEditingRowIndex === this.tableDataComputed.length - 1) {
				this.doEditingSave().then(() => {
					this.$emit('on-tab', event)
				})
			} else {
				this.setRowEdit(this.getRowByIndex(this.isEditingRowIndex + 1)).then(this.doScrollLeft)
			}
		},
		// 根据index获取row
		getRowByIndex (index) {
			return this.tableData.find(item => {
				return item.$fxIndex === index
			})
		},
		// 根据可见数据的index获取全量list数据的index
		getAllListIndexByVisibleListIndex (index) {
			const id = this.tableDataComputed[index].id
			return this.tableData.findIndex(item => {
				return item.id === id
			})
		},
		checkDeleteHasEditRow (dels) {
			if (!this.isEditing && !this.isSubEditing) {
				return Promise.resolve()
			} else if (this.isEditing) {
				const row = this.isEditingRow
				const hasEditRow = dels.findIndex(item => {
					return item.id === row.id
				})
				if (!~hasEditRow) {
					return this.doEditingSave()
				} else {
					return Promise.resolve()
				}
			} else if (this.isSubEditing) {
				return Promise.resolve()
			}
		},
		// 点击删除按钮
		onDeleteClick () {
			return this.$refs.listTable.getSelectedRows().then((res) => {
				let isPlan = res.some(item => {
					return item.billCreateFlag
				})
				for (const sub in this.$refs.listTable.subSelectedRowMap) {
					this.$refs.listTable.subSelectedRowMap[sub].some(item => {
						if (item.billCreateFlag === 1) {
							isPlan = true
						}
						return item.billCreateFlag
					})
				}
				if (isPlan) return this.$fxMessage.warning('计划下发数据不允许删除！')
				return this.$fxConfirm('是否确定删除所选明细？').then(async () => {
					return this.checkDeleteHasEditRow(res).then((saveResult) => {
						// 删除为保存的子表明细-主表保存后将id赋给子表明细
						this.expandRowKeys = [...this.$refs.listTable.rowExpanded]
						const subSelectedRows = this.$refs.listTable.subSelectedRowMap
						const dosingDetailIdMap = {}
						// 如果选了子表明细 处理子表明细未保存时的空id直接删除的情况
						if (saveResult) {
							if (!this.$fxUtils.isEmptyObj(subSelectedRows)) {
								const row = saveResult.row
								const dosingDetails = saveResult.dosingDetails
								for (const subSelectedKey in subSelectedRows) {
									if (subSelectedKey === '') {
										subSelectedRows[row.id] = subSelectedRows[subSelectedKey]
										delete subSelectedRows[subSelectedKey]
									}
								}
								if (dosingDetails.length > 0 && subSelectedRows[row.id]) {
									subSelectedRows[row.id].map(subRow => {
										dosingDetails.forEach(item => {
											if (item.$fxIndex === subRow.$fxIndex) {
												subRow.id = item.id
											}
										})
									})
								}
							}
						}
						for (const selectedMapKey in subSelectedRows) {
							// 如果不保存主明细直接删除主明细和子明细
							if (selectedMapKey !== '') {
								dosingDetailIdMap[selectedMapKey] = []
								subSelectedRows[selectedMapKey].forEach(item => {
									dosingDetailIdMap[selectedMapKey].push(item.id)
								})
							}
						}
						const addRow = res.find(item => {
							return item.id === ''
						})
						// 这里待优化
						if (addRow && res.length === 1) {
							this.tableData.splice(this.getAllListIndexByVisibleListIndex(addRow.$fxIndex), 1)
							this.isEditingRowIndex = -1
							const productDetailIds = res.filter(item => {
								return !!item.id && !item.additionFlag
							}).map(item => {
								return item.id
							})
							const additionProductDetailIdMap =
								this.$refs.listTable.getAdditionProductDetailIdMap(res)
							const selectedIds = {
								productDetailIds,
								additionProductDetailIdMap,
								dosingDetailIdMap: dosingDetailIdMap
							}
							return this.fpDeleteDetails(selectedIds, res, subSelectedRows).then(() => {
								this.$emit('on-details-refresh')
								this.$refs.listTable.clearExpanded()
								return Promise.resolve()
							})
						} else if (addRow) {
							this.tableData.splice(this.getAllListIndexByVisibleListIndex(addRow.$fxIndex), 1)
							this.isEditingRowIndex = -1
							const productDetailIds = res.filter(item => {
								return !!item.id && !item.additionFlag
							}).map(item => {
								return item.id
							})
							const additionProductDetailIdMap = this.$refs.listTable.getAdditionProductDetailIdMap(res)
							this.$refs.listTable.clearSelected()
							this.isEditingRowIndex = -1
							const selectedIds = {
								productDetailIds,
								additionProductDetailIdMap,
								dosingDetailIdMap: dosingDetailIdMap
							}
							return this.fpDeleteDetails(selectedIds, res, subSelectedRows).then(() => {
								this.$emit('on-details-refresh')
								this.$refs.listTable.clearExpanded()
								return Promise.resolve()
							})
						} else {
							const productDetailIds = res.filter(item => {
								return !!item.id && !item.additionFlag
							}).map(item => {
								return item.id
							})
							const additionProductDetailIdMap = this.$refs.listTable.getAdditionProductDetailIdMap(res)
							this.$refs.listTable.clearSelected()
							this.isEditingRowIndex = -1
							const selectedIds = {
								productDetailIds,
								additionProductDetailIdMap,
								dosingDetailIdMap: dosingDetailIdMap
							}
							return this.fpDeleteDetails(selectedIds, res, subSelectedRows).then(() => {
								this.$emit('on-details-refresh')
								this.$refs.listTable.clearExpanded()
								return Promise.resolve()
							})
						}
					}).then(() => {
						this.$refs.listTable.clearSelected()
						this.clearSubSelection()
						this.$refs.listTable.expandRowKeys = this.expandRowKeys
						this.$refs.listTable.rowExpanded = this.expandRowKeys
						return Promise.resolve()
					})
				}).catch(() => {
				})
			})
		},
		onMistakeCheck () {
			this.fpSaveMain().then(this.doEditingSave).then(this.doEditingSubSave).then(() => {
				this.$emit('on-mistake-check-click')
			})
		},
		// [public] 聚焦单元格
		setListCellFocus (cellEvent, immediate = true) {
			if (typeof cellEvent === 'string') {
				const _cellEvent = {
					columnProp: cellEvent,
					row: this.isEditingRow,
					index: this.isEditingRowIndex
				}
				this.$refs.listTable.setListCellFocus(_cellEvent, immediate)
			} else {
				this.$refs.listTable.setListCellFocus(cellEvent, immediate)
			}
		},
		// 聚焦子表单元格
		setListSubCellFocus (cellEvent, immediate = true) {
			if (typeof cellEvent === 'string') {
				const _cellEvent = {
					columnProp: cellEvent,
					row: this.isEditingSubRow,
					index: this.isEditingSubIndex.subIndex
				}
				this.$refs.listTable.setListCellFocus(_cellEvent, immediate)
			} else {
				this.$refs.listTable.setListCellFocus(cellEvent, immediate)
			}
		},
		onMulitySettingClick () {
			this.getSelectRows().then(this.doEditingSave).then(() => {
			}).catch(() => {
				setTimeout(() => {
					this.settingPopperVisible = false
				}, 0)
			})
		},
		// [public]获取当前选中的明细
		getSelectRows (validate = true) {
			return this.$refs.listTable.getSelectedRows(validate)
		},
		// [public]	清空前选中的明细
		clearSelected () {
			this.$refs.listTable.clearSelected()
			this.clearSubSelection()
		},
		// 清空子表选中明细
		clearSubSelection () {
			this.$refs.listTable.clearSubSelection()
		},
		// 清空当前子表选中明细
		clearCurrentSelection (rowId) {
			this.$refs.listTable.clearCurrentSelection(rowId)
		},
		// [public]	清空搜索key
		clearSearchKey () {
			this.tableSearchKey = ''
		},
		// [public]	设置搜索key
		setSearchKey (val) {
			this.tableSearchKey = val
		},
		// [public]	清空展开行
		clearExpanded () {
			this.$refs.listTable.clearExpanded()
		},
		// [public]	清理table
		clear () {
			this.clearSelected()
			this.clearSearchKey()
			this.clearExpanded()
		},
		// [public] 检查当前是否处于编辑状态, 如果处于编辑状态则保存明细 切换为非编辑状态
		checkDetailsUnSaving (cb) {
			if (
				this.isEditing &&
				this.tableDataComputed.length &&
				this.tableDataComputed[this.tableDataComputed.length - 1].id === '' &&
				((typeof cb === 'function' &&
				cb(this.tableDataComputed[this.tableDataComputed.length - 1])) ||
				(typeof cb !== 'function' &&
				!this.tableDataComputed[this.tableDataComputed.length - 1].item.id))
			) {
				this.tableData.splice(this.getAllListIndexByVisibleListIndex(this.isEditingRowIndex), 1)
				this.isEditingRowIndex = -1
			}
			if (this.isEditing) {
				return this.doEditingSave()
			} else {
				return this.doEditingSubSave()
			}
		},
		closeMulitySettingPopver () {
			this.settingPopperVisible = false
		},
		onFullScreen () {
			if (this.$fxUtils.isDef(this.showFullScreenBtn)) {
				this.$emit('on-full-screen-click', this.showFullScreenBtn)
			} else {
				this.parentDialog ? this.parentDialog.onFullScreen() : this.$fxMessage.warning('全屏设置失败')
				this.$emit('on-full-screen')
			}
		},
		offFullScreen () {
			if (this.$fxUtils.isDef(this.showFullScreenBtn)) {
				this.$emit('on-full-screen-click', this.showFullScreenBtn)
			} else {
				this.parentDialog ? this.parentDialog.offFullScreen() : this.$fxMessage.warning('取消全屏设置失败')
				this.$emit('off-full-screen')
			}
		},
		onSearchKeyChange (val) {
			this.$fxUtils.fxDebounce(200, false).then(() => {
				this.tableSearchKey = val
			})
		},
		onSearchKeyFocus () {
			this.doEditingSave()
		},
		onAllExpandClick () {
			this.fpSaveMain().then(this.doEditingSave).then(() => {
				if (typeof this.fpExpandAllAsync === 'function') {
					this.fpExpandAllAsync(this.tableData).then(() => {
						this.$refs.listTable.setAllExpand()
					})
				} else {
					this.$refs.listTable.setAllExpand()
				}
			})
		},
		onAllFoldclick () {
			this.doEditingSave().then(() => {
				this.$refs.listTable.clearExpanded()
			})
		},
		getVisibleColumns () {
			return this.$refs.listTable.getVisibleColumns()
		},
		// [public] 重新样式布局
		doLayout () {
			return this.$refs.listTable.doLayout()
		},
		// [public] 集合行的校验
		doCollectionValiDate () {
			return this.$refs.listTable.doCollectionValiDate()
		},
		summaryMethod ({ data }) {
			if (!this.showSummary) {
				return {}
			}
			const sumData = {}
			const summaryColumns = this.tableColumn.filter(item => !!item.summary)
			if (data.length > 0) {
				data.forEach((row, rowIndex) => {
					summaryColumns.forEach(item => {
						const propVal = this.$fxUtils.getObjDeepValue(row, item.prop)
						const val = typeof item.summaryHandler === 'function' ? item.summaryHandler(propVal, row) : this.$fxUtils.toNumber(propVal)
						const sumVal = this.$fxUtils.toNumber(sumData[item.prop]) + val
						if (rowIndex === data.length - 1 && typeof item.summaryFormatter === 'function') {
							sumData[item.prop] = item.summaryFormatter(sumVal, item.prop, item)
						} else {
							sumData[item.prop] = sumVal
						}
					})
				})
			} else {
				summaryColumns.forEach(item => {
					if (typeof item.summaryFormatter === 'function') {
						sumData[item.prop] = item.summaryFormatter(0, item.prop, item)
					} else {
						sumData[item.prop] = 0
					}
				})
			}
			return sumData
		},
		doScrollLeft () {
			return this.$refs.listTable.doScrollLeft()
		},
		cellClassNameHandler (row, rowIndex, column) {
			let editColumn = column.$attrs.item && column.$attrs.item.editColumn
			editColumn = typeof editColumn === 'function' ? editColumn(row, rowIndex, column) : editColumn && this.allowed2edit
			const editClass = editColumn ? ' is-edit-cell' : ''
			let className = ''
			if (typeof this.cellClassName === 'function') {
				className = this.cellClassName(row, rowIndex, column)
			} else if (this.cellClassName) {
				className = this.cellClassName
			}
			return `${className}${editClass}`
		},
		rowClassNameHandler (row) {
			const editClass = (row.isEdit && this.allowed2edit) ? ' is-edit-row' : ''
			let className = ''
			if (typeof this.rowClassName === 'function') {
				className = this.rowClassName(row)
			} else if (this.rowClassName) {
				className = this.rowClassName
			}
			return `${className}${editClass}`
		},
		onSortChange (sortParams) {
			this.doEditingSave().then(() => {
				this.sortParams = sortParams || this.defaultSortParam
				if (this.$fxUtils.isDef(this.sortParams)) {
					this.tableData.sort(this.onSortChangeHandler(0))
				}
			})
		},
		onSortChangeHandler (index) {
			const sortParamsName = Object.keys(this.sortParams)[index]
			if (sortParamsName) {
				const sortParamsOrder = this.sortParams[sortParamsName]
				return this.$fxUtils.sortBy(sortParamsName, sortParamsOrder, this.onSortChangeHandler(index + 1))
			} else {
				return ''
			}
		},
		// 主动触发fx-details-table组件的focus方法执行的函数
		focus () {
			if (this.tableDataComputed.length) {
				this.onTabSetRowEdit()
			} else if (this.canAdd) {
				this.onAddOnce()
			} else {
				this.$emit('on-tab', { code: 'Tab' })
			}
		},
		getPaginationParams () {
			return this.$refs.listTable.getPaginationParams()
		},
		setPaginationTotal (total) {
			this.$refs.listTable.setPaginationTotal(total)
		},
		setPaginationCurrent (page) {
			this.$refs.listTable.setPaginationCurrent(page)
		},
		onPageChange (size) {
			this.$emit('on-page-change')
		},
		getEditingRowData () {
			return this.isEditingRow
		},
		// [public] 获取合计数据
		getSummaryData (data) {
			return this.summaryMethod({
				data
			})
		},
		// 获取底部合计栏数据
		getColumnSumData (sumColumn) {
			const sumData = this.tableData.reduce((total, currentValue) => {
				return currentValue[sumColumn.prop] ? (total + this.$fxUtils.toNumber(currentValue[sumColumn.prop])) : total
			}, 0)
			return sumColumn.summaryFormatter ? sumColumn.summaryFormatter(sumData) : sumData
		},
		// 获取子表合计数据
		getSubColumnSumData (subSumColumn) {
			const sumSubArr = []
			this.tableData.forEach(item => {
				if (item.dosingDetails.length > 0) {
					item.dosingDetails.forEach(dosing => {
						sumSubArr.push(dosing)
					})
				}
			})
			this.subSum = sumSubArr.length
			const sumData = sumSubArr.reduce((total, currentValue) => {
				return currentValue[subSumColumn.prop] ? (total + this.$fxUtils.toNumber(currentValue[subSumColumn.prop])) : total
			}, 0)
			return subSumColumn.summaryFormatter ? subSumColumn.summaryFormatter(sumData) : sumData
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.fx-details-table {
	.tools-left, .tools-right {
		display:flex
		flex-direction: row
	}
	.tools-left {
		flex: 1
		display:flex
		flex-direction: row
		&-left {
			flex: 1
		}
	}
	>>>.organ-list__top {
		.count-selected {
			margin: 0 10px 0 0 !important
		}
		&-right {
			margin-right: 0px
		}
	}
	.details-table-empty {
		.details-list-empty-icon {
			height: 50px
			width: 50px
		}
		.details-list-empty-text {
			height: 30px
			line-height: 30px
		}
	}
	.table-search-input {
		width: 200px
	}
	>>>.hover-row:not(.is-edit-row) {
		.is-edit-cell::after {
			content: '';
			position: absolute
			top: 4px;
			left: 4px;
			right: 4px;
			bottom: 4px;
			box-sizing: border-box;
			border: 1px dashed $fxDefaultColor
			border-radius: 5px
			cursor:pointer
		}
		& + .wind-virtual-table__tr-expand {
			.is-edit-cell::after {
				content: '';
				position: absolute
				top: 4px;
				left: 0px;
				right: 4px;
				bottom: 4px;
				box-sizing: border-box;
				border: 1px dashed $fxDefaultColor
				border-radius: 5px
				cursor:pointer
				display: inline-block
			}
		}
	}
	>>>.hover-subRow:hover:not(.is-edit-subRow){
			.is-edit-sub-cell::after {
				content: '';
				position: absolute
				top: 4px;
				left: 4px;
				right: 4px;
				bottom: 4px;
				box-sizing: border-box;
				border: 1px dashed $fxDefaultColor
				border-radius: 5px
				cursor:pointer
				display: inline-block
			}
	}

}
.details-info__btn-popper {
	.btn-popper-container {
		display: flex
		flex-direction: column
		.popper-btn {
			margin-top: 10px
			margin-left: 0
		}
	}
}
.summary-bottom {
	font-size 14px
	border: 1px solid #ededed;
	padding: 3px 12px;
	border-top: none;
	height: 155px;
	background-color:#faf9f9;

	.sum-row{
		display: block;
		line-height: 30px;
	}

	.sum-title {
		height: 30px;
		line-height: 30px;
		font-size: 15px;
		font-weight: 900;

		.wind-icon {
			width: 17px;
			height: 17px;
			vertical-align: sub;
			margin-right 10px
		}
	}
	.sum-num {
		font-weight: 900;
	}
	.el-divider--horizontal{
		margin: 3px 0;
	}

	.summary-item{
		display: inline-block;
		.sum-item {
			margin-right 40px
		}
	}
	.summary-item-pl {
		display: inline-block;
		width 200px
	}
}
</style>
