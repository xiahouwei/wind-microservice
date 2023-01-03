<template>
	<w-collapse v-model="collapseVisible" contentHeight="480px" :fullScreen="isFullScreen" disabled :showArrow="false" title="单据明细">
		<fx-details-table
			ref="detailsTable"
			v-fx-tab:loop.store-manage_take-stock-order_details.detailsInfo
			:disabled="disabled"
			:canAdd="!disabled && authCanAdd"
			:tableColumn="computedColumn"
			:tableValiDate="tableValiDate"
			:tableData="tableDetails"
			:tableEditColumnProp="tableEditColumnProp"
			:tableExpandEditColumnProp="tableExpandEditColumnProp"
			:expandRows="expandRows"
			:mainId="organDetails.id"
			:showFullScreenBtn="!isFullScreen"
			:fpSaveMain="fSaveMain"
			:fpBeforeRowEdit="fpBeforeRowEdit"
			:fpOnRowEdit="fpOnRowEdit"
			:showDeleteBtn='showDeleteBtn'
			:fpInitAddDetailsData="fpInitAddDetailsData"
			:fpSaveDetails="fpSaveDetails"
			:fpDeleteDetails="fpDeleteDetails"
			:selectedRows="selectedRows"
			:indexCellRender="indexCellRender"
			showSummary
			showMistakeCheck
			:deleteDisabled="deleteDisabled"
			:defaultSortParam="defaultSortParam"
			@on-details-refresh="onDetailsRefresh"
			@on-add-mulity="onAddMulity"
			@on-full-screen-click="onFullScreenClick"
			@on-mistake-check-click='onMistakeCheckClick'
		>
			<settingMulity
				slot="setting-mulity"
				slot-scope="{ visible }"
				:visible="visible"
				:organDetails="organDetails"
				@on-save-click="onSettingMulitySave"
				@on-cancel-click="onSettingMulityClose"
			></settingMulity>
		</fx-details-table>
		<addMulity
			ref="addMulity"
			:organDetails="organDetails"
			:storeSelectList="storeSelectList"
			@on-details-refresh="onDetailsRefresh"
		></addMulity>
	</w-collapse>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import { apiName } from '../../Index.vue'
import settingMulity from './SettingMulity.vue'
import addMulity from '../add-mulity-details/AddMulity.vue'
const EDIT_INPUT_TYPE = ['code', 'realCheckAmount1', 'realCheckAmount2', 'realCheckMoney', 'checkCause', 'assistUnitAmount']
const EDIT_INPUT_EXPAND_TYPE = ['memo']
const REQUIRE_CHANGE_COLUMN = ['code', 'realCheckAmount1', 'realCheckAmount2', 'realCheckMoney', 'assistUnitAmount']
export default {
	name: 'detailsInfo',
	components: {
		settingMulity,
		addMulity
	},
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
		storeSelectList: {
			type: Array,
			default: () => {
				return []
			}
		},
		fSaveMain: Function,
		disabled: Boolean,
		deleteDisabled: Boolean
	},
	data () {
		return {
			collapseVisible: true,
			tableColumn: [
				{
					prop: 'code',
					label: '品项编号',
					width: '150px',
					required: true,
					editColumn: true,
					sortable: true,
					sortKey: 'item.code',
					fxRender: this.codeRender,
					click: this.onCellClick('code')
				},
				{ prop: 'item.name', label: '品项名称', required: true, sortable: true },
				{ prop: 'item.spec', label: '规格', width: '100px' },
				{
					prop: 'checkUnitBig',
					label: '盘点大单位',
					headerAlign: 'center',
					required: true,
					child: [
						{
							prop: 'checkUnit1',
							label: '盘点单位1',
							width: '120px',
							required: true,
							formatter: (row) => {
								return (row.checkUnit1 && row.checkUnit1.name) || ''
							}
						},
						{
							prop: 'stockAmount1',
							label: '账存数量',
							required: true,
							formatter: (row) => {
								return this.$fxCommon.toFixedAutoZeroFill(row.stockAmount1, this.sysPointSize)
							}
						},
						{
							prop: 'realCheckAmount1',
							label: '实盘数量',
							width: '140px',
							required: true,
							editColumn: true,
							fxRender: this.amount1Render,
							click: this.onCellClick('realCheckAmount1')
						}
					]
				},
				{
					prop: 'checkUnitSmall',
					label: '盘点小单位',
					headerAlign: 'center',
					required: true,
					child: [{
						prop: 'checkUnit2',
						label: '盘点单位2',
						width: '120px',
						required: true,
						formatter: (row) => {
							return (row.checkUnit2 && row.checkUnit2.name) || ''
						}
					},
					{
						prop: 'stockAmount2',
						label: '账存数量',
						required: true,
						formatter: (row) => {
							return this.$fxCommon.toFixedAutoZeroFill(row.stockAmount2, this.sysPointSize)
						}
					},
					{
						prop: 'realCheckAmount2',
						label: '实盘数量',
						width: '140px',
						required: true,
						editColumn: (row, rowIndex, column) => {
							return row.checkUnit2 && !this.disabled
						},
						fxRender: this.amount2Render,
						click: this.onCellClick('realCheckAmount2')
					}]
				},
				{
					prop: 'stockMoney',
					label: '账存金额',
					required: true,
					sortable: true,
					summary: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.stockMoney, this.sysMoneyPointSize)
					},
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'realCheckMoney',
					label: '实盘金额',
					required: true,
					editColumn: (row, rowIndex, column) => {
						return !this.disabled && !row.stockAmount1 && !row.stockAmount2
					},
					sortable: true,
					fxRender: this.realCheckMoneyRender,
					click: this.onCellClick('realCheckMoney'),
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'diffAmount',
					label: '差异数量',
					width: '180px',
					required: true,
					fxRender: this.diffAmountRender
				},
				{
					prop: 'checkCause',
					label: '盘盈原因',
					width: '160px',
					required: true,
					editColumn: (row, rowIndex, column) => {
						const diffAmount = this.fxCalculation.computeDiffAmount(row)
						return !this.disabled && (diffAmount > 0)
					},
					fxRender: this.checkCauseRender,
					click: this.onCellClick('checkCause')
				},
				{
					prop: 'diffMoney',
					label: '差异金额',
					required: true,
					fxRender: this.diffMoneyRender,
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					},
					summaryHandler: (val, row) => {
						return this.diffMoneyMap[row.id] || 0
					}
				},
				{ prop: 'item.assistUnit', label: '辅助单位', width: '120px', required: true },
				{
					prop: 'assistUnitAmount',
					label: '实盘辅助数量',
					width: '120px',
					required: true,
					editColumn: (row, rowIndex, column) => {
						return !this.disabled && row.item.assistUnit
					},
					fxRender: this.assistUnitAmountRender,
					click: this.onCellClick('assistUnitAmount')
				}
			],
			tableEditColumnProp: EDIT_INPUT_TYPE,
			tableValiDate: [{
				columnProp: 'code',
				rule: (row, success, error) => {
					if (!row.item.id) {
						error('品项编号不能为空')
						return false
					}
					const repeat = this.tableDetails.findIndex(item => {
						return item.item.id === row.item.id && item.id !== row.id
					})
					if (~repeat && this.organDetails.checkWay) {
						this.$fxMessage.warning('品项不得重复添加')
						error()
					} else {
						success()
					}
				}
			}],
			expandRows: [
				{ prop: 'sendRow1', label: '品项信息', render: this.renderExpand1, visible: true, required: true },
				{ prop: 'sendRow2', label: '单位信息', render: this.renderExpand2, visible: true },
				{ prop: 'sendRow3', label: '录入人', render: this.renderExpand3, visible: true },
				{ prop: 'sendRow4', label: '称重信息', render: this.renderExpand4, visible: true }
			],
			fxCalculation: this.$fxCalculation('takeStock'),
			itemList: [],
			diffMoneyMap: {},
			selectOptionProp: {
				name: 'code',
				disabled: 'disabled',
				visibleFlag: 'visibleFlag'
			},
			filterKeys: ['name', 'code', 'pinYin', 'spec', 'itemUnitList.barcode'],
			fxCache: this.$fxUtils.fxCache('take-stock-order'),
			codeSelectLoading: false,
			selectedRows: [],
			tableExpandEditColumnProp: EDIT_INPUT_EXPAND_TYPE,
			checkCauseList: [],
			compareArrayUtils: this.$fxUtils.compareArrayUtils()
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize,
			sysPointSize: state => state.system.sysPointSize,
			sysPricePointSize: state => state.system.sysPricePointSize,
			haveCostPower: state => state.loginer.haveCostPower
		}),
		...mapGetters(['getSysParams', 'detailsAuthGetter']),
		computedColumn () {
			let column = this.tableColumn
			const costPower = ['stockMoney', 'realCheckMoney', 'diffMoney']
			if (!this.haveCostPower) {
				column = column.filter(item => {
					return !costPower.includes(item.prop)
				})
			}
			return column
		},
		defaultSortParam () {
			return this.getSysParams('SJXZL_CHECKSTORE_ITEM_ORDER', 'value')
		},
		mainAssistAmountTogether () {
			return this.getSysParams('SJXZL_ASSIST_MAIN_TOGETER', 'value') || true
		},
		authCanAdd () {
			return this.detailsAuthGetter('store-manage_take-stock-order.add-order')
		},
		showDeleteBtn () {
			return this.detailsAuthGetter('store-manage_take-stock-order.delete-order')
		}
	},
	watch: {
		disabled: {
			immediate: true,
			handler (val) {
				this.tableColumn.forEach(item => {
					if (REQUIRE_CHANGE_COLUMN.includes(item.prop)) {
						item.required = !val
						if (!val) item.visible = true
					}
				})
			}
		},
		tableDetails: {
			immediate: true,
			handler (val) {
				val.forEach(item => {
					const diffMoney = this.fxCalculation.computedDiffMoney(item)
					if (item.id) {
						this.diffMoneyMap[item.id] = diffMoney
					}
				})
				this.compareArrayUtils.setData(val, {
					key: 'item.id'
				})
			}
		}
	},
	methods: {
		optionRender (h, { item }) {
			h = this.$createElement
			return <div class="fx-common__cell-select__option fx-ellipsis">
				<span class="fx-common__cell-select__option-left fx-ellipsis" title={item.code}>{ item.code }</span>
				<span class="fx-common__cell-select__option-right fx-ellipsis" title={item.name}>{ item.name }</span>
			</div>
		},
		codeRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`code-${$index}`}
				value={row.item.id}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='code'
				dropdownWidth='300px'
				optionRender={this.optionRender}
				selectOptionProp={this.selectOptionProp}
				filterKeys={this.filterKeys}
				cellText={row.item.code}
				loading={this.codeSelectLoading}
				selectOptionList={this.computedItemList(row)}
				asyncChange={this.onCodeSelectChange}
				fpSelectShow={this.onCodeSelectShow(row)}
			></fx-list-cell-select>
		},
		computedItemList (row) {
			if (this.organDetails.checkWay && this.itemList.length !== 0) {
				return this.itemList.filter(item => {
					return item.id === row.item.id || !this.compareArrayUtils.has(item.id)
				})
			} else {
				return this.itemList
			}
		},
		onCodeSelectChange (item, row) {
			return new Promise(resolve => {
				row.item = item
				const params = {
					itemId: item.id,
					organId: this.organDetails.organ.id,
					houseId: this.organDetails.house.id,
					businessDate: this.organDetails.businessDate,
					checkWay: this.organDetails.checkWay,
					billId: this.organDetails.id
				}
				this.getItemStock(params).then(res => {
					row.checkUnit1 = res.checkUnit1
					row.stockAmount1 = res.stockAmount1
					row.checkUnit2 = res.checkUnit2
					row.stockAmount2 = res.stockAmount2
					row.mainUnitStockAmount = res.mainUnitStockAmount
					row.stockMoney = res.stockMoney
					row.mainUnit = res.mainUnit
					row.mainUnitPrice = res.mainUnitPrice || 0
					this.fxCalculation.computeRealCheckMoney(row)
					this.setTableEditColumnProp(row)
					resolve()
				})
			})
		},
		getItemStock (data) {
			return this.$fxApi(`${apiName}.getItemStock`)({ data })
		},
		getItemList (extraItemId = '') {
			const params = {
				houseId: this.organDetails.house.id,
				checkClassId: this.organDetails.checkClass.id,
				extraItemId,
				billId: this.organDetails.id
			}
			const key = `itemList.${params.houseId}.${params.checkClassId}.${extraItemId}`
			return this.fxCache.cacher(key, this.$fxApi(`${apiName}.getCheckItemList`)({ data: params }))
		},
		onCodeSelectShow (row) {
			return () => {
				return new Promise(resolve => {
					this.codeSelectLoading = true
					this.getItemList(row.item.id).then(res => {
						this.codeSelectLoading = false
						this.itemList = res
						resolve()
					})
				})
			}
		},
		amount1Render (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`realCheckAmount1-${$index}`}
				vModel={row.realCheckAmount1}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='realCheckAmount1'
				pointSize={this.sysPointSize}
				class="cell-amount__input"
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.realCheckAmount1, this.sysPointSize)}
				vOn:on-change={this.onAmountChange}
			>
			</fx-list-cell-input-number>
		},
		onAmountChange (val, row, { oldVal }) {
			this.fxCalculation.computeRealCheckMoney(row)
			if (`${oldVal}` === '0' || this.mainAssistAmountTogether) {
				this.fxCalculation.computeAssistAmount(row)
			}
			const diffAmount = this.fxCalculation.computeDiffAmount(row)
			if (diffAmount > 0) {
				row.checkCause = this.checkCauseList.find(item => {
					return item.defaultFlag
				})
			} else {
				row.checkCause = {
					id: '',
					name: '无'
				}
			}
			this.setTableEditColumnProp(row)
		},
		amount2Render (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`realCheckAmount2-${$index}`}
				vModel={row.realCheckAmount2}
				isEdit={row.isEdit && !!row.checkUnit2}
				row={row}
				rowIndex={$index}
				columnProp='realCheckAmount2'
				pointSize={this.sysPointSize}
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.realCheckAmount2, this.sysPointSize)}
				class="cell-amount__input"
				vOn:on-change={this.onAmountChange}
			>
			</fx-list-cell-input-number>
		},
		realCheckMoneyRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`realCheckMoney-${$index}`}
				vModel={row.realCheckMoney}
				isEdit={row.isEdit && !row.stockAmount1 && !row.stockAmount2}
				row={row}
				rowIndex={$index}
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.realCheckMoney, this.sysMoneyPointSize)}
				columnProp='realCheckMoney'
				pointSize={this.sysMoneyPointSize}
				vOn:on-change={this.onRealCheckMoneyChange}
			>
			</fx-list-cell-input-number>
		},
		onRealCheckMoneyChange (val, row) {
			row.mainUnitPrice = this.$fxUtils.toFixedParseNumber((val / row.mainUnitAmount), this.sysPricePointSize)
		},
		diffAmountRender (h, { row, $index }) {
			h = this.$createElement
			if (!row.checkUnit1) {
				return <span></span>
			}
			const diffAmount = this.fxCalculation.computeDiffAmount(row)
			const fontClass = {
				'fx-default-font': diffAmount > 0,
				'fx-warn-font': diffAmount < 0
			}
			const cellValue = diffAmount > 0 ? `+${diffAmount}${row.mainUnit.name}` : `${diffAmount}${row.mainUnit.name}`
			if (row.checkUnit1.id === row.mainUnit.id) {
				return <span class={[fontClass, 'fx-list-table__cell-span']}>{cellValue}</span>
			} else {
				const mainAmount = this.fxCalculation.computedCheckUnit1Amount(diffAmount, row)
				return <span class="fx-list-table__cell-span">
					<span class={fontClass}>{cellValue}={mainAmount}{row.checkUnit1.name}</span>
				</span>
			}
		},
		checkCauseRender (h, { row, $index }) {
			h = this.$createElement
			const diffAmount = this.fxCalculation.computeDiffAmount(row)
			return <fx-list-cell-select
				ref={`checkCause-${$index}`}
				value={row.checkCause && row.checkCause.id}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='checkCause'
				cellText={row.checkCause ? row.checkCause.name : '无'}
				disabled={diffAmount <= 0}
				selectOptionList={this.checkCauseList}
				on-on-change={this.onCauseSelectChange}
			></fx-list-cell-select>
		},
		onCauseSelectChange (item, row) {
			row.checkCause = item
		},
		getCheckCauseList () {
			return this.fxCache.cacher('checkCauseList', this.$fxApi(`${apiName}.getCheckCauseList`)).then(res => {
				this.checkCauseList = res
			})
		},
		diffMoneyRender (h, { row, $index }) {
			h = this.$createElement
			const diffMoney = this.fxCalculation.computedDiffMoney(row)
			const cellValue = diffMoney > 0 ? `+${diffMoney}` : diffMoney
			if (row.id) {
				this.diffMoneyMap[row.id] = diffMoney
			}
			return <span class={[{
				'fx-default-font': diffMoney > 0,
				'fx-warn-font': diffMoney < 0
			}, 'fx-list-table__cell-span']}>{this.$fxCommon.toFixedAutoZeroFill(cellValue, this.sysMoneyPointSize)}</span>
		},
		assistUnitAmountRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`assistUnitAmount-${$index}`}
				vModel={row.assistUnitAmount}
				isEdit={row.isEdit && !!row.item.assistUnit}
				row={row}
				rowIndex={$index}
				cellText={row.item.assistUnit ? this.$fxCommon.toFixedAutoZeroFill(row.assistUnitAmount, this.sysPointSize) : ''}
				columnProp='assistUnitAmount'
				pointSize={this.sysPointSize}
			>
			</fx-list-cell-input-number>
		},
		fpBeforeRowEdit (row) {
			if (!row.checkCause) {
				row.checkCause = {
					id: '',
					name: '无'
				}
			}
			this.itemList = this.$fxUtils.isEmptyObj(row.item) ? [] : [row.item]
			return Promise.resolve()
		},
		fpOnRowEdit (row, $index, type) {
			this.setTableEditColumnProp(row)
			return new Promise(resolve => {
				this.getCheckCauseList().then(() => {
					this.$refs[`${type}-${$index}`].focus()
					resolve()
				})
			})
		},
		onCellClick (type) {
			return (row) => {
				this.$refs.detailsTable.setRowEdit(row, type)
			}
		},
		fpInitAddDetailsData () {
			return new Promise(resolve => {
				this.getItemList().then(res => {
					this.itemList = res
					resolve(this.initDetailsRow())
				})
			})
		},
		initDetailsRow () {
			return {
				item: {},
				assistUnitAmount: '',
				memo: '',
				realCheckAmount1: 0,
				realCheckAmount2: 0,
				terminal: 1,
				mainUnitStockAmount: 0,
				mainUnitAmount: 0,
				stockMoney: 0,
				takeStockMoney: 0,
				checkUnit1: null,
				checkUnit2: null,
				checkCause: {
					id: '',
					name: '无'
				}
			}
		},
		fpSaveDetails (detail, origin) {
			return this.onSaveDetailsHandler(detail, origin)
		},
		onSaveDetailsHandler (params, origin) {
			if (params.id) {
				const logger = this.$fxLogger.createInfo('store-manage.take-stock-order.updateDetails', this.createLoggerParams(params, origin))
				return this.$fxApi(`${apiName}.saveDetails`, this.organDetails.id, params.id)({ data: params, logger }).then(res => {
					this.$set(params, 'inputMan', res.inputMan)
					return Promise.resolve(res)
				})
			} else {
				const addItemInfo = this.getAddItemInfo(params)
				const logger = this.$fxLogger.createInfo('store-manage.take-stock-order.addDetails', { orderData: this.organDetails, addItemInfo })
				return this.$fxApi(`${apiName}.addDetails`, this.organDetails.id)({ data: params, logger }).then(res => {
					this.$set(params, 'inputMan', res.inputMan)
					this.$set(params, 'inputModeName', res.inputModeName)
					this.$set(params, 'terminalName', res.terminalName)
					return Promise.resolve(res)
				})
			}
		},
		createLoggerParams (params, origin) {
			const originData = this.$fxUtils.deepClone(origin)
			const organDetails = this.$fxUtils.deepClone(params)
			return {
				pre: originData,
				cur: organDetails,
				orderData: this.organDetails,
				itemName: organDetails.item.name
			}
		},
		getAddItemInfo (params) {
			const name = params.item.name
			const checkUnit1 = params.checkUnit1.name
			const amount = params.realCheckAmount1
			return `品项名称:${name},盘点单位1:${checkUnit1},实盘数量:${amount}`
		},
		fpDeleteDetails (ids) {
			const deleteItemInfo = this.getDeleteItemInfo(ids)
			const logger = this.$fxLogger.createInfo('store-manage.take-stock-order.deleteDetails', { deleteItemInfo, orderData: this.organDetails })
			return this.$fxApi(`${apiName}.delDetailMulity`, this.organDetails.id)({ data: ids, logger }).then(res => {
				return Promise.resolve(res)
			})
		},
		getDeleteItemInfo (ids) {
			return this.tableDetails.filter(item => {
				return ids.includes(item.id)
			}).map(item => {
				const name = item.item.name
				const checkUnit1 = item.checkUnit1.name
				const amount = item.realCheckAmount1
				return `品项名称:${name},盘点单位1:${checkUnit1},实盘数量:${amount}`
			}).join(';')
		},
		onDetailsRefresh (selectedRows) {
			if (this.$fxUtils.isDef(selectedRows) && Array.isArray(selectedRows)) {
				this.selectedRows = selectedRows
			}
			this.$emit('on-details-refresh')
		},
		onAddMulity () {
			this.$refs.addMulity.open(this.organDetails)
		},
		checkDetailsUnSaving () {
			return this.$refs.detailsTable.checkDetailsUnSaving()
		},
		onSettingMulitySave (setting) {
			this.$refs.detailsTable.getSelectRows().then(res => {
				const itemNames = []
				let settingInfo = ''
				const ids = res.map(item => {
					itemNames.push(item.item.name)
					return item.id
				})
				const params = {
					ids,
					batchSetType: setting.type,
					memo: setting.memo
				}
				settingInfo = `备注:${setting.memo}`
				const logger = this.$fxLogger.createInfo('store-manage.take-stock-order.settingMulityDetails', { settingInfo, orderData: this.organDetails, itemNames })
				this.$fxApi(`${apiName}.settingMulity`, this.organDetails.id)({ data: params, logger }).then(this.onDetailsRefresh)
			})
		},
		onSettingMulityClose () {
			this.$refs.detailsTable.closeMulitySettingPopver()
		},
		onFullScreenClick (flag) {
			this.$emit('update:isFullScreen', flag)
		},
		onMistakeCheckClick () {
			this.$emit('on-mistake-check')
		},
		renderExpand1 (h, { row, $index }) {
			h = this.$createElement
			const price = this.$fxCommon.toFixedAutoZeroFill((row.mainUnitPrice * row.checkUnit1.ratio), this.sysPricePointSize)
			return (
				<fx-list-extend-row>
					<fx-list-extend-cell title="品项类别：">{row.item && row.item.itemTypeRef && row.item.itemTypeRef.name}</fx-list-extend-cell>
					<fx-list-extend-cell title="参考均价：">{price}</fx-list-extend-cell>
					<fx-list-extend-cell title="批次号：">{row.batchCode}</fx-list-extend-cell>
					<fx-list-extend-cell title="存放位置："></fx-list-extend-cell>
					<fx-list-extend-cell title="明细备注：" width = { 200 } editColumn disabled={ this.disabled } vOn:click={this.extendCellClick('memo', row)}>
						<fx-list-cell-input
							ref={`memo-${$index}`}
							vModel = { row.memo }
							isEdit = { row.isEdit }
							row = { row }
							rowIndex = { $index }
							columnProp = 'memo'
							maxlength = { this.$fxCommon.getFxInputMaxLength('memo') }
							regType = { this.$fxCommon.getFxInputReg('memo') }
						></fx-list-cell-input>
					</fx-list-extend-cell>
				</fx-list-extend-row>
			)
		},
		renderExpand2 (h, { row, $index }) {
			h = this.$createElement
			const diffAmount = this.fxCalculation.computeDiffAmount(row)
			return (
				<fx-list-extend-row>
					<fx-list-extend-cell title="最小单位：">{row.mainUnit.name}</fx-list-extend-cell>
					<fx-list-extend-cell title="最小单位差异数量：" labelWidth="120px" >{diffAmount}</fx-list-extend-cell>
				</fx-list-extend-row>
			)
		},
		renderExpand3 (h, { row, $index }) {
			h = this.$createElement
			return (
				<fx-list-extend-row>
					<fx-list-extend-cell title="录入人：">{row.inputMan && row.inputMan.name}</fx-list-extend-cell>
					<fx-list-extend-cell title="录入方式：">{row.inputModeName}</fx-list-extend-cell>
					<fx-list-extend-cell title="盘点终端：">{row.terminalName}</fx-list-extend-cell>
				</fx-list-extend-row>
			)
		},
		renderExpand4 (h, { row, $index }) {
			h = this.$createElement
			return (
				<fx-list-extend-row>
					<fx-list-extend-cell title="称重数量："></fx-list-extend-cell>
					<fx-list-extend-cell title="净重量："></fx-list-extend-cell>
					<fx-list-extend-cell title="皮重量："></fx-list-extend-cell>
					<fx-list-extend-cell title="称重单位："></fx-list-extend-cell>
				</fx-list-extend-row>
			)
		},
		clear () {
			this.$refs.detailsTable.clear()
		},
		setTableEditColumnProp (row) {
			const _column = this.$fxUtils.deepClone(EDIT_INPUT_TYPE)
			if (!row.checkUnit2) {
				const index = _column.findIndex(item => {
					return item === 'realCheckAmount2'
				})
				_column.splice(index, 1)
			}
			if (row.stockAmount1 || row.stockAmount2 || !this.haveCostPower) {
				const index = _column.findIndex(item => {
					return item === 'realCheckMoney'
				})
				_column.splice(index, 1)
			}
			if (!row.item.assistUnit) {
				const index = _column.findIndex(item => {
					return item === 'assistUnitAmount'
				})
				_column.splice(index, 1)
			}
			if (!(row.checkCause && row.checkCause.id)) {
				const index = _column.findIndex(item => {
					return item === 'checkCause'
				})
				_column.splice(index, 1)
			}
			this.tableEditColumnProp = _column
		},
		indexCellRender (h, row, index) {
			h = this.$createElement
			return row.autoAdd ? <w-icon type='star' class="uncheck-item"></w-icon> : index + 1
		},
		extendCellClick (type, row) {
			return () => {
				this.$refs.detailsTable.setRowEdit(row, type)
			}
		},
		defaultFocus () {
			this.$refs.detailsTable.focus()
		},
		isRowEditing () {
			return this.$refs.detailsTable.isRowEditing()
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.uncheck-item {
	position: relative
	top: 5px
}
</style>
