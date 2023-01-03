<template>
	<w-collapse v-model="collapseVisible" contentHeight="480px" :fullScreen="isFullScreen" disabled :showArrow="false" title="计划明细">
		<fx-details-table
			ref="detailsTable"
			v-fx-tab:loop.store-manage_in-store-order_details.detailsInfo
			:disabled="disabled"
			:tableColumn="computedColumn"
			:tableValiDate="tableValiDate"
			:tableData="tableDetails"
			:tableEditColumnProp="tableEditColumnProp"
			:tableExpandEditColumnProp="tableExpandEditColumnProp"
			:tableEditEnterColumnProp="tableEditEnterColumnProp"
			:mainId="organDetails.id"
			:showFullScreenBtn="!isFullScreen"
			:expandRows="expandRows"
			:fpSaveMain="fSaveMain"
			:fpBeforeRowEdit="beforeRowEdit"
			:fpOnRowEdit="fpOnRowEdit"
			:fpInitAddDetailsData="fpInitAddDetailsData"
			:fpSaveDetails="fpSaveDetails"
			:fpDeleteDetails="fpDeleteDetails"
			:selectedRows="selectedRows"
			:canAdd="true"
			:canAddMulity="false"
			:showSummary="false"
			:showMistakeCheck="showMistakeCheck"
			@on-details-refresh="onDetailsRefresh"
			@on-full-screen-click="onFullScreenClick"
			@on-mistake-check-click='onMistakeCheckClick'
			:showDeleteBtn='showDeleteBtn'
			:deleteDisabled="deleteDisabled"
			:defaultSortParam="defaultSortParam"
		>
<!--			<settingMulity-->
<!--				slot="setting-mulity"-->
<!--				slot-scope="{ visible }"-->
<!--				:visible="visible"-->
<!--				:organDetails="organDetails"-->
<!--				@on-save-click="onSettingMulitySave"-->
<!--				@on-cancel-click="onSettingMulityClose"-->
<!--			></settingMulity>-->
		</fx-details-table>
	</w-collapse>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
// import settingMulity from './SettingMulity.vue'
const EDIT_INPUT_TYPE = ['workshopCode', 'code', 'unit', 'bomCode', 'lineCode', 'planTotal']
const EDIT_INPUT_EXPAND_TYPE = ['productDate', 'memo']
const EDIT_INPUT_ENTER_TYPE = ['inTaxMoney', 'taxRate', 'inPrice', 'inMoney']
export default {
	name: 'detailsInfo',
	props: {
		isFullScreen: Boolean,
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		tableDetails: {
			type: Array,
			default: () => {
				return []
			}
		},
		fSaveMain: Function,
		disabled: Boolean,
		deleteDisabled: Boolean,
		itemName: String
	},
	data () {
		return {
			collapseVisible: true,
			subProductHasLine: false,
			tableColumn: [
				{
					prop: 'workshopCode',
					label: '车间编号',
					width: '150px',
					required: true,
					editColumn: () => {
						return !this.disabled
					},
					sortable: true,
					sortKey: 'workShop.code',
					fxRender: this.workshopCodeRender,
					click: this.onCellClick('workshopCode')
				},
				{ prop: 'workShop.name', label: '车间名称', width: '120px' },
				{
					prop: 'code',
					label: '品项编号',
					width: '150px',
					required: true,
					editColumn: () => {
						return !this.disabled
					},
					sortable: true,
					sortKey: 'item.code',
					fxRender: this.codeRender,
					click: this.onCellClick('code')
				},
				{ prop: 'item.name', label: '品项名称', required: true },
				{ prop: 'item.spec', label: '规格', width: '100px' },
				{
					prop: 'unit',
					label: '单位',
					width: '120px',
					required: true,
					editColumn: () => {
						return !this.disabled
					},
					fxRender: this.unitRender,
					click: this.onCellClick('unit')
				},
				{
					prop: 'bomCode',
					label: '产品BOM',
					width: '200px',
					required: true,
					editColumn: () => {
						return !this.disabled
					},
					fxRender: this.bomRender,
					click: this.onCellClick('bomCode')
				},
				{
					prop: 'lineCode',
					label: '工艺路线',
					width: '200px',
					required: true,
					editColumn: () => {
						return !this.disabled
					},
					fxRender: this.lineRender,
					renderHeader: this.lineRenderHeader,
					click: this.onCellClick('lineCode')
				},
				{
					prop: 'planTotal',
					label: '计划产量',
					width: '120px',
					required: true,
					editColumn: () => {
						return !this.disabled
					},
					fxRender: this.planTotalRender,
					click: this.onCellClick('planTotal'),
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysPointSize)
					}
				},
				{ prop: 'actualTotal', label: '实际产量', width: '120px' },
				{
					prop: 'planStartDate',
					label: '计划开工时间',
					width: '200px',
					required: true,
					editColumn: () => {
						return !this.disabled
					},
					fxRender: this.planStartDateRender,
					click: this.onCellClick('planStartDate')
				},
				{
					prop: 'planEndDate',
					label: '计划完工时间',
					width: '200px',
					required: true,
					editColumn: () => {
						return !this.disabled
					},
					fxRender: this.planEndDateRender,
					click: this.onCellClick('planEndDate')
				},
				{ prop: 'actualStartDate', label: '实际开工时间', width: '120px' },
				{ prop: 'actualEndDate', label: '实际完工时间', width: '120px' },
				{
					prop: 'state',
					label: '生产状态',
					formatter: (row) => {
						return this.$fxTypeMiddleware.getCommonTypeItemById('productionState')(row.state).label
					}
				},
				{
					prop: 'memo',
					label: '明细备注',
					width: '200px',
					required: true,
					editColumn: () => {
						return !this.disabled
					},
					fxRender: this.memoRender,
					click: this.onCellClick('memo')
				}
			],
			tableValiDate: [{
				columnProp: 'workshopCode',
				rule: (row, success, error) => {
					if (!row.workShop.id) {
						error('车间编号不能为空')
					} else {
						success()
					}
				}
			}, {
				columnProp: 'code',
				rule (row, success, error) {
					if (!row.item.id) {
						error('品项编号不能为空')
					} else {
						success()
					}
				}
			}, {
				columnProp: 'unit',
				rule (row, success, error) {
					if (!row.itemUnit.id) {
						error('单位不能为空')
					} else {
						success()
					}
				}
			}, {
				columnProp: 'bomCode',
				rule (row, success, error) {
					if (!row.composeBom.id) {
						error('BOM不能为空')
					} else {
						success()
					}
				}
			}, {
				columnProp: 'planTotal',
				rule (row, success, error) {
					if (!row.planTotal) {
						error('计划产量不能为0')
					} else {
						success()
					}
				}
			}, {
				columnProp: 'planStartDate',
				rule (row, success, error) {
					if (!row.planStartDate) {
						error('计划开工时间不能为空')
					} else {
						success()
					}
				}
			}, {
				columnProp: 'planEndDate',
				rule (row, success, error) {
					if (!row.planEndDate) {
						error('计划完工时间不能为空')
					} else if (!row.compareDate(row.planEndDate, row.planStartDate)) {
						error('计划完工时间不得小于等于计划开工时间')
					} else {
						success()
					}
				}
			}],
			expandRows: [], // 展开行
			itemList: [],
			itemUnitList: [],
			workshopList: [],
			bomList: [],
			lineList: [],
			selectOptionProp: {
				name: 'code',
				disabled: 'disabled',
				visibleFlag: 'visibleFlag'
			},
			filterKeys: ['name', 'code', 'pinYin', 'spec', 'itemUnitList.barcode'],
			fxCache: this.$fxUtils.fxCache('production-plan'),
			codeSelectLoading: false,
			unitSelectLoading: false,
			bomSelectLoading: false,
			lineSelectLoading: false,
			workshopSelectLoading: false,
			selectedRows: [],
			tableEditEnterColumnProp: EDIT_INPUT_ENTER_TYPE
		}
	},
	computed: {
		...mapState({
			sysPointSize: state => state.system.sysPointSize
		}),
		...mapGetters(['getSysParams', 'detailsAuthGetter', 'isProductionPro']),
		computedColumn () {
			if (!this.isProductionPro()) {
				const costPower = ['lineCode']
				return this.tableColumn.filter(item => {
					return !costPower.includes(item.prop)
				})
			}
			return this.tableColumn
		},
		isSingleHouse () {
			return this.organDetails.singleHouseFlag === 1
		},
		showDeleteBtn () {
			return this.detailsAuthGetter('production-manage_production-plan.delete-productionPlan')
		},
		tableEditColumnProp () {
			return EDIT_INPUT_TYPE
		},
		billColor () {
			switch (this.organDetails.billSign) {
			case 1:
				return 'fx-default-font'
			case 2:
				return 'fx-warn-font'
			default:
				return ''
			}
		},
		defaultSortParam () {
			return this.getSysParams('SJXZL_INSTORE_ITEM_ORDER', 'value')
		},
		tableExpandEditColumnProp () {
			return EDIT_INPUT_EXPAND_TYPE
		},
		showMistakeCheck () {
			return false
		}
	},
	watch: {
		itemName: {
			immediate: true,
			handler (val) {
				if (val) {
					this.$nextTick(() => {
						this.$refs.detailsTable.setSearchKey(val)
					})
				}
			}
		}
	},
	methods: {
		onMistakeCheckClick () {
			this.$emit('on-mistake-check')
		},
		optionRender (h, { item }) {
			h = this.$createElement
			return <div class="fx-common__cell-select__option fx-ellipsis">
				<span class="fx-common__cell-select__option-left fx-ellipsis" title={item.code}>{ item.code }</span>
				<span class="fx-common__cell-select__option-right fx-ellipsis" title={item.name}>{ item.name }</span>
			</div>
		},
		workshopCodeRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`workshopCode-${$index}`}
				value={row.workShop.id}
				isEdit={row.isEdit && this.tableEditColumnProp.includes('workshopCode')}
				row={row}
				rowIndex={$index}
				columnProp='workshopCode'
				dropdownWidth='300px'
				optionRender={this.optionRender}
				selectOptionProp={this.selectOptionProp}
				loading={this.workshopSelectLoading}
				cellText={row.workShop.code}
				selectOptionList={this.workshopList}
				fpSelectShow={this.onWorkshopSelectShow(row)}
				on-on-change={this.onWorkshopCodeSelectChange}
			></fx-list-cell-select>
		},
		onWorkshopCodeSelectChange (item, row) {
			row.workShop = item
		},
		onWorkshopSelectShow (row) {
			return () => {
				return new Promise(resolve => {
					this.workshopSelectLoading = true
					this.getWorkshop(row).then(res => {
						this.workshopList = res
						this.workshopSelectLoading = false
						resolve()
					})
				})
			}
		},
		async getWorkshop () {
			const id = this.organDetails.organ.id
			const workShop = await this.$fxApi('productionPlan.getWorkshopList', id)
			return Promise.resolve(workShop)
		},
		codeRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`code-${$index}`}
				value={row.item.id}
				isEdit={row.isEdit && this.tableEditColumnProp.includes('code')}
				row={row}
				rowIndex={$index}
				columnProp='code'
				dropdownWidth='300px'
				optionRender={this.optionRender}
				selectOptionProp={this.selectOptionProp}
				filterKeys={this.filterKeys}
				cellText={row.item.code}
				loading={this.codeSelectLoading}
				selectOptionList={this.itemList}
				asyncChange={this.onCodeSelectChange}
				fpSelectShow={this.onCodeSelectShow(row)}
				asyncClick={this.onCodeSelectClick}
				on-on-select-enter={this.onCodeSelectEnter}
			></fx-list-cell-select>
		},
		onCodeSelectChange (item, row) {
			row.item = item
			row.assistUnit = item.assistUnit
			row.itemUnit = item.itemUnitList[0]
			row.itemUnitId = row.itemUnit.id
			if (row.item.itemUnitList.length === 1) {
				this.$refs.detailsTable.setListCellFocus('unit')
			} else {
				this.$refs.detailsTable.setListCellFocus('unit')
			}
			return this.getbomList(item.id).then(res => {
				this.bomList = res
				if (this.bomList.length > 0) {
					row.composeBom = res[0]
					return Promise.resolve()
				} else {
					row.composeBom = {}
				}
			})
		},
		async getbomList (itemId) {
			const bomList = await this.$fxApi('productionPlan.getBomList', itemId)
			return Promise.resolve(bomList)
		},
		onCodeSelectShow (row) {
			return () => {
				return new Promise(resolve => {
					this.codeSelectLoading = true
					// const storeId = this.isSingleHouse ? this.organDetails.houseId : row.inHouse.id
					if (row.workShop.id) {
						this.getItemList(row.house.id, row.item.id).then(res => {
							this.codeSelectLoading = false
							this.itemList = res
							resolve()
						})
					} else {
						this.$fxMessage.warning('请先选择车间')
					}
				})
			}
		},
		setItemList (storeId) {
			this.getItemList(storeId).then(res => {
				this.itemList = res
			})
		},
		getItemList (storeId, itemId = 0, withUnit = false) {
			const key = `itemList.${this.organDetails.id}.${storeId}.${itemId}.${withUnit}`
			return this.fxCache.cacher(key, this.$fxApi('productionPlan.getItemUnitList', itemId, storeId, withUnit))
		},
		onCodeSelectClick (item, row, $index, unchangedFlag) {
			return new Promise(resolve => {
				if (unchangedFlag) {
					if (row.item.itemUnitList.length === 1) {
						this.$refs.detailsTable.setListCellFocus('unit')
					} else {
						resolve()
					}
				}
			})
		},
		onCodeSelectEnter (row, $index, item, unchangedFlag) {
			if (unchangedFlag) {
				this.$refs.detailsTable.setListCellFocus('unit')
			}
		},
		unitRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`unit-${$index}`}
				value={row.itemUnit.id}
				isEdit={row.isEdit && this.tableEditColumnProp.includes('unit')}
				row={row}
				rowIndex={$index}
				columnProp='unit'
				cellText={row.itemUnit.name}
				loading={this.unitSelectLoading}
				selectOptionList={this.itemUnitList}
				on-on-change={this.onUnitSelectChange}
				fpSelectShow={this.onUnitSelectShow(row)}
			></fx-list-cell-select>
		},
		onUnitSelectChange (item, row) {
			row.itemUnit = item
		},
		onUnitSelectShow (row) {
			return () => {
				return new Promise(resolve => {
					this.unitSelectLoading = true
					if (row.item.id) {
						this.unitSelectLoading = false
						this.itemUnitList = row.item.itemUnitList
						resolve()
						// })
					} else {
						this.$fxMessage.warning('请先选择品项')
					}
				})
			}
		},
		bomRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`bomCode-${$index}`}
				value={row.composeBom.id}
				isEdit={row.isEdit && this.tableEditColumnProp.includes('bomCode')}
				row={row}
				rowIndex={$index}
				columnProp='bomCode'
				cellText={row.composeBom.name}
				loading={this.bomSelectLoading}
				selectOptionList={this.bomList}
				on-on-change={this.bomSelectChange}
				fpSelectShow={this.bomSelectShow(row)}
			></fx-list-cell-select>
		},
		bomSelectChange (item, row) {
			row.composeBom = item
		},
		bomSelectShow (row) {
			return () => {
				return new Promise(resolve => {
					if (row.item.id) {
						this.getbomList(row.item.id).then(res => {
							this.bomList = res
							if (this.bomList.length === 1) {
								row.composeBom = res[0]
							}
							resolve()
						})
					} else {
						this.$fxMessage.warning('请先选择品项')
					}
				})
			}
		},
		lineRender (h, { row, $index }) {
			if (!row.resTechnologyLineDTO) {
				row.resTechnologyLineDTO = { id: '' }
			}
			h = this.$createElement
			return <fx-list-cell-select
				ref={`lineCode-${$index}`}
				value={row.resTechnologyLineDTO.id}
				isEdit={row.isEdit && this.tableEditColumnProp.includes('lineCode') && this.subProductHasLine}
				row={row}
				rowIndex={$index}
				columnProp='lineCode'
				cellText={row.resTechnologyLineDTO.name}
				loading={this.lineSelectLoading}
				selectOptionList={this.lineList}
				on-on-change={this.lineSelectChange}
				fpSelectShow={this.lineSelectShow(row)}
			></fx-list-cell-select>
		},
		lineSelectChange (item, row) {
			row.resTechnologyLineDTO = item
		},
		lineSelectShow () {
			return () => {
				return new Promise(resolve => {
					this.lineSelectLoading = true
					this.getListLine().then(res => {
						this.lineSelectLoading = false
						this.lineList = res
						resolve()
					})
				})
			}
		},
		lineRenderHeader (h, column, index) {
			h = this.$createElement
			return <span>{ column.label }
				<span slot="label">
					<el-popover
						placement="top"
						width="290"
						trigger="hover"
						content="工艺路线选择时，需所有明细均选择工艺路线，或所有明细均不选择工艺路线；选择工艺路线的单据可以生成工序任务单，不选择工艺路线的可以直接生成组合加工单。">
						<w-icon slot="reference" type="question-active" class="unit-mark-icon"></w-icon>
					</el-popover>
				</span>
			</span>
		},
		getListLine () {
			return this.$fxApi('productionPlan.getListLine')({ data: { enableFlag: 1, needLimitEffectFlag: true } }).then(res => {
				return Promise.resolve(res)
			})
		},
		onDateChange (item, row) {
			row.productDate = item
		},
		planTotalRender (h, { row, $index }) {
			h = this.$createElement
			if (this.billColor) {
				return <span class={[this.billColor, 'fx-list-table__cell-span']}>{this.organDetails.billSign === 1 ? '+' : ''}{this.$fxCommon.toFixedAutoZeroFill(row.amount, this.sysPointSize)}</span>
			} else {
				return <fx-list-cell-input-number
					ref={`planTotal-${$index}`}
					vModel={row.planTotal}
					isEdit={row.isEdit && this.tableEditColumnProp.includes('planTotal')}
					row={row}
					rowIndex={$index}
					columnProp='planTotal'
					pointSize={this.sysPointSize}
					cellText={this.$fxCommon.toFixedAutoZeroFill(row.planTotal, this.sysPointSize)}
					on-on-change={this.onPlanTotalChange}
					on-on-input-enter={this.onPlanTotalEnter}
					on-on-input-tab={this.onPlanTotalTab}
				>
				</fx-list-cell-input-number>
			}
		},
		planStartDateRender (h, { row, $index }) {
			h = this.$createElement
			const pickerOptions = {
				disabledDate: (time) => {
					return time.getTime() < this.$fxUtils.getTimeBeforeDay(this.organDetails.businessDate)
				}
			}
			return <fx-list-cell-date
				ref={`planStartDate-${$index}`}
				vModel={row.planStartDate}
				isEdit={row.isEdit && !this.authDisabled}
				row={row}
				rowIndex={$index}
				columnProp='planStartDate'
				valueFormat='yyyy-MM-dd HH:mm:SS'
				pickerOptions={pickerOptions}
				cellText={this.$fxUtils.formatterDateTime(row.planStartDate)}
			>
			</fx-list-cell-date>
		},
		planEndDateRender (h, { row, $index }) {
			row.compareDate = this.$fxUtils.compareDate
			h = this.$createElement
			const pickerOptions = {
				disabledDate: (time) => {
					return time.getTime() < this.$fxUtils.getTimeBeforeDay(row.planStartDate)
				}
			}
			return <fx-list-cell-date
				ref={`planEndDate-${$index}`}
				vModel={row.planEndDate}
				isEdit={row.isEdit && !this.authDisabled}
				row={row}
				rowIndex={$index}
				columnProp='planEndDate'
				valueFormat='yyyy-MM-dd HH:mm:SS'
				pickerOptions={pickerOptions}
				cellText={this.$fxUtils.formatterDateTime(row.planEndDate)}
			>
			</fx-list-cell-date>
		},
		memoRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input
				ref={`memo-${$index}`}
				vModel={row.memo}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='memo'
				class='cell-input-memo'
				maxlength={this.$fxCommon.getFxInputMaxLength('memo')}
				regType={this.$fxCommon.getFxInputReg('memo')}
			></fx-list-cell-input>
		},
		onPlanTotalChange (val, row) {
		},
		onPlanTotalEnter (row) {
		},
		onPlanTotalTab (row, $index) {
		},
		beforeRowEdit (row) {
			this.itemUnitList = this.$fxUtils.isEmptyObj(row.itemUnit) ? [] : [row.itemUnit]
			this.itemList = this.$fxUtils.isEmptyObj(row.item) ? [] : [row.item]
			this.workshopList = this.$fxUtils.isEmptyObj(row.workShop) ? [] : [row.workShop]
			this.bomList = this.$fxUtils.isEmptyObj(row.composeBom) ? [] : [row.composeBom]
			return Promise.resolve()
		},
		fpOnRowEdit (row, $index, type) {
			return new Promise(resolve => {
				this.$refs.detailsTable.setListCellFocus(type)
				resolve()
			})
		},
		onCellClick (type) {
			return (row) => {
				this.$refs.detailsTable.setRowEdit(row, type)
			}
		},
		fpInitAddDetailsData ($index) {
			return new Promise(resolve => {
				const data = {
					workShop: {},
					houseId: this.organDetails.house.id, // 主表仓库id
					house: { id: this.organDetails.house.id },
					item: {},
					itemUnit: {},
					itemId: '',
					itemUnitId: '',
					mainUnitId: '',
					composeBom: {},
					resTechnologyLineDTO: {},
					planTotal: 0,
					actualTotal: '',
					planStartDate: this.organDetails.businessDate,
					planEndDate: this.$fxUtils.setDateTime(this.$fxUtils.getCustomAssignDate(this.organDetails.businessDate, 1)),
					actualStartDate: '',
					actualEndDate: '',
					state: 0,
					memo: ''
				}
				resolve(data)
			})
		},
		fpSaveDetails (detail, origin) {
			detail.billId = this.organDetails.id
			return this.onSaveDetailsHandler(detail, origin)
		},
		onSaveDetailsHandler (params, origin) {
			const paramsData = {
				...params,
				composeBom: { id: params.composeBom.id }
			}
			if (params.resTechnologyLineDTO) {
				paramsData.resTechnologyLineDTO = { id: params.resTechnologyLineDTO.id }
			}
			const mainUnit = params.item.itemUnitList.find(item => {
				return item.mainFlag === 1
			})
			if (!this.isProductionPro()) {
				delete paramsData.resTechnologyLineDTO
			}
			paramsData.mainUnitId = mainUnit.id // 最小单位
			paramsData.unitRatio = params.itemUnit.ratio // 业务单位换算系数a
			if (params.id) {
				delete paramsData.modifyMan
				delete paramsData.modifyDate
				paramsData.createMan = this.organDetails.createMan
				const logger = this.$fxLogger.createInfo('production-manage.production-plan.updateDetails', this.createLoggerParams(params, origin))
				return this.$fxApi('productionPlan.editDetail', this.organDetails.id, params.id)({ data: paramsData, logger }).then(res => {
					return Promise.resolve(res)
				})
			} else {
				const addItemInfo = this.getAddItemInfo(params)
				const logger = this.$fxLogger.createInfo('production-manage.production-plan.addDetails', { orderData: this.organDetails, addItemInfo })
				return this.$fxApi('productionPlan.addDetail', this.organDetails.id)({ data: paramsData, logger }).then(res => {
					return Promise.resolve(res)
				})
			}
		},
		getAddItemInfo (params) {
			const name = params.item.name
			const itemUnit = params.itemUnit.name
			const bomName = params.composeBom.name
			const planTotal = params.planTotal
			if (this.isProductionPro()) {
				const lineName = params.resTechnologyLineDTO.name ? `工艺路线:${params.resTechnologyLineDTO.name},` : ''
				return `品项名称:${name}，单位:${itemUnit}，产品BOM:${bomName}，${lineName}计划产量:${planTotal}`
			} else {
				return `品项名称:${name}，单位:${itemUnit}，产品BOM:${bomName}，计划产量:${planTotal}`
			}
		},
		createLoggerParams (params, origin) {
			const originData = this.$fxUtils.deepClone(origin)
			const organDetails = this.$fxUtils.deepClone(params)
			return {
				pre: originData,
				cur: organDetails,
				code: this.organDetails.sysBillCode,
				itemName: organDetails.item.name,
				orderData: this.organDetails
			}
		},
		fpDeleteDetails (ids) {
			const deleteItemInfo = this.getDeleteItemInfo(ids)
			const logger = this.$fxLogger.createInfo('production-manage.production-plan.deleteDetails', { deleteItemInfo, orderData: this.organDetails })
			if (ids.length > 0) {
				return this.$fxApi('productionPlan.delDetailMulity', this.organDetails.id)({ data: ids, logger }).then(res => {
					this.$refs.detailsTable.clearSelected()
					return Promise.resolve(res)
				})
			} else {
				return this.$fxApi('productionPlan.delDetail', this.organDetails.id, ids[0]).then(res => {
					this.$refs.detailsTable.clearSelected()
					return Promise.resolve(res.details)
				})
			}
		},
		getDeleteItemInfo (ids) {
			return this.tableDetails.filter(item => {
				return ids.includes(item.id)
			}).map(item => {
				const name = item.item.name
				const itemUnit = item.itemUnit.name
				const bomName = item.composeBom.name
				const planTotal = item.planTotal
				// const workShop = item.workShop.name
				return `品项名称:${name}，单位:${itemUnit}，产品BOM:${bomName}，计划产量:${planTotal}`
			}).join(';')
		},
		onDetailsRefresh (selectedRows) {
			if (this.$fxUtils.isDef(selectedRows) && Array.isArray(selectedRows)) {
				this.selectedRows = selectedRows
			}
			this.$emit('on-details-refresh')
		},
		// onAddMulity () {
		// 	this.$refs.addMulity.open()
		// },
		checkDetailsUnSaving () {
			return this.$refs.detailsTable.checkDetailsUnSaving()
		},
		// onSettingMulitySave (setting) {
		// 	this.$refs.detailsTable.getSelectRows().then(res => {
		// 		const itemNames = []
		// 		let settingInfo = ''
		// 		const ids = res.map(item => {
		// 			itemNames.push(item.item.name)
		// 			return item.id
		// 		})
		// 		let params = null
		// 		params = {
		// 			ids,
		// 			operColumn: 'memo',
		// 			memo: setting.memo
		// 		}
		// 		settingInfo = `备注:${setting.memo}`
		// 		const logger = this.$fxLogger.createInfo('store-manage.in-store-order.settingMulityDetails', { settingInfo, orderData: this.organDetails, itemNames })
		// 		this.$fxApi('inStore.setMulity', this.organDetails.id)({ data: params, logger }).then(this.onDetailsRefresh)
		// 	})
		// },
		// onSettingMulityClose () {
		// 	this.$refs.detailsTable.closeMulitySettingPopver()
		// },
		onFullScreenClick (flag) {
			this.$emit('update:isFullScreen', flag)
		},
		clear () {
			this.$refs.detailsTable.clear()
		},
		defaultFocus () {
			this.$refs.detailsTable.focus()
		},
		isRowEditing () {
			return this.$refs.detailsTable.isRowEditing()
		},
		// syncItemAssistUnit (unit, row) {
		// 	return new Promise(resolve => {
		// 		const storeId = this.isSingleHouse ? this.organDetails.inHouse.id : row.inHouse.id
		// 		if (storeId && row.item.id) {
		// 			this.getItemList(storeId, row.item.id).then(res => {
		// 				const currentItem = res.find(item => item.id === row.item.id)
		// 				if (currentItem) {
		// 					row.item.assistUnit = currentItem.assistUnit
		// 					row.item.assistUnitRatio = currentItem.assistUnitRatio
		// 					resolve()
		// 				} else {
		// 					resolve()
		// 				}
		// 			})
		// 		} else {
		// 			resolve()
		// 		}
		// 	})
		// },
		stateFlagmatter (row) {
			return '未开始'
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.productdate{
	>>>.fx-list-extend-cell__container{
		width 170px!important
		margin-left -20px
		.fx-ellipsis {
			position: absolute;
			left: 0;
			top: 0;
		}
	}
}
.unit-mark-icon {
	margin-left:5px
	width:16px
	height: 16px
	position: relative
	top: 4px
}
.flexBox {
	display flex
}
.minusBox {
	font-size 22px
	margin-right 3px
}
</style>
