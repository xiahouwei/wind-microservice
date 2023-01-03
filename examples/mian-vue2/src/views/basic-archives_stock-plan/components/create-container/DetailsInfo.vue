<template>
	<w-collapse v-model="collapseVisible" contentHeight="500px" disabled :fullScreen="isFullScreen" :showArrow="false" title="方案明细">
		<fx-details-table
			ref="detailsTable"
			v-fx-tab:loop.basic-archives_stock-plan_details.detailsInfo
			:disabled="disabled"
			:canAdd="canAdd"
			:deleteDisabled="delDisabled"
			:tableColumn="tableColumn"
			:tableValiDate="tableValiDate"
			:tableData="tableDetails"
			:showFullScreenBtn="!isFullScreen"
			:tableEditColumnProp="tableEditColumnProp"
			:mainId="organDetails.id"
			:fpSaveMain="fSaveMain"
			:fpBeforeRowEdit="beforeRowEdit"
			:fpInitAddDetailsData="fpInitAddDetailsData"
			:fpSaveDetails="fpSaveDetails"
			:fpDeleteDetails="fpDeleteDetails"
			:fpOnRowEdit="fpOnRowEdit"
			showMistakeCheck
			@on-details-refresh="onDetailsRefresh"
			@on-add-mulity="onAddMulity"
			@on-full-screen-click="onFullScreenClick"
			@on-mistake-check-click='onMistakeCheckClick'
		>
			<settingMulity
				slot="setting-mulity"
				:visible="visible"
				:sellerSelectList="sellerSelectList"
				:organSelectList="organSelectList"
				showHouse
				slot-scope="{ visible }"
				@on-cancel-click="onSettingMulityClose"
				@on-setting-mulity-show="onSettingMulityShow"
				@on-save-click="onSettingMulitySave"
			></settingMulity>
		</fx-details-table>
		<addItemStep1
			ref='addItemStep1'
			:organDetails='organDetails'
			:sellerSelectList='computedSellerSelectList'
			@step1ToStep2='step1ToStep2(arguments)'
			@clearStep3TableDataMap="clearStep3TableDataMap"
		></addItemStep1>
		<addItemStep2
			ref='addItemStep2'
			:listData="computedItemList"
			@step2ToStep3='step2ToStep3'
			@step2ToStep1='step2ToStep1'
			@clearStep3TableDataMap="clearStep3TableDataMap"
		></addItemStep2>
		<addItemStep3
			ref='addItemStep3'
			@step3ToStep2='step3ToStep2'
			@deleteDetails="deleteDetails"
			:organList="sellerSelectList"
			:organDetails='organDetails'
			:sellInfo='sellInfo'
			@on-details-refresh="onDetailsRefresh"
		></addItemStep3>
		<settingSeller
			ref="settingSeller"
			:listData="computedSellerSelectList"
			@on-save-click="onSaveSettingSeller(arguments)"
			:organDetails='organDetails'
		></settingSeller>
	</w-collapse>
</template>
<script>
import { mapState } from 'vuex'
import addItemStep1 from './addMutiItem/AddItemStep1'
import addItemStep2 from './addMutiItem/AddItemStep2'
import addItemStep3 from './addMutiItem/AddItemStep3'
import settingMulity from './SettingMulity.vue'
import settingSeller from './SettingSeller.vue'
const EDIT_INPUT_TYPE = ['sellerOrgan', 'sellerHouse', 'code', 'unit', 'roundingWay', 'roundingNum', 'supperLimitSelect', 'supperLimit', 'lowerLimitSelect', 'lowerLimit', 'cycleWay', 'cycleDaySelect', 'stockCycle', 'arrivalCycle', 'memo']
const REQUIRE_CHANGE_COLUMN = ['sellerHouse', 'code', 'crossStock', 'roundingWay', 'supperLimitSelect', 'lowerLimitSelect', 'mustFlag', 'cycleWay', 'arrivalCycle']
export default {
	name: 'detailsInfo',
	components: {
		settingMulity,
		addItemStep1,
		addItemStep2,
		addItemStep3,
		settingSeller
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
		sellerSelectList: {
			type: Array,
			default: () => {
				return []
			}
		},
		sellerTabSelectList: {
			type: Array,
			default: () => {
				return []
			}
		},
		itemList: {
			type: Array,
			default: () => {
				return []
			}
		},
		fSaveMain: Function,
		fValiDateForm: Function,
		disabled: Boolean,
		delDisabled: Boolean,
		canAdd: Boolean
	},
	data () {
		return {
			Vue: this,
			collapseVisible: true,
			tableColumn: [
				{
					prop: 'sellerOrgan',
					label: '卖方机构',
					width: '150px',
					required: true,
					editColumn: (row) => {
						return !this.disabled && !this.isRowUsed(row)
					},
					fxRender: this.sellerOrganRender,
					click: this.onCellClick('sellerOrgan'),
					fixed: true
				},
				{
					prop: 'sellerHouse',
					label: '出库仓库',
					width: '150px',
					required: true,
					editColumn: true,
					fxRender: this.sellerHouseRender,
					click: this.onCellClick('sellerHouse'),
					fixed: true
				},
				{
					prop: 'code',
					label: '品项编号',
					width: '120px',
					required: true,
					editColumn: (row) => {
						return !this.disabled && !this.isRowUsed(row)
					},
					fxRender: this.codeRender,
					click: this.onCellClick('code'),
					fixed: true
				},
				{
					prop: 'item.name',
					label: '品项名称',
					required: true,
					fixed: true,
					width: '100px'
				},
				{ prop: 'item.spec', label: '规格', width: '100px' },
				{
					prop: 'unit',
					label: '单位',
					width: '100px',
					required: true,
					editColumn: true,
					fxRender: this.unitRender,
					click: this.onCellClick('unit')
				},
				{
					prop: 'stockWay',
					label: '订货方式',
					width: '100px',
					required: true,
					editColumn: true,
					fxRender: this.stockWayRender,
					click: this.onCellClick('stockWay')
				},
				{
					prop: 'crossStock',
					label: '越库实际供货方',
					width: '150px',
					required: true,
					editColumn: (row) => {
						return row.stockWay === 2 && !this.disabled
					},
					fxRender: this.crossStockRender,
					click: this.onCellClick('crossStock')
				}, {
					prop: 'roundingWay',
					label: '订货倍数',
					width: '190px',
					required: true,
					editColumn: true,
					fxRender: this.roundingRender,
					click: this.onCellClick('roundingWay')
				}, {
					prop: 'supperLimitSelect',
					label: '订货上限',
					width: '190px',
					required: true,
					editColumn: true,
					fxRender: this.supperLimitRender,
					click: this.onCellClick('supperLimitSelect')
				}, {
					prop: 'lowerLimitSelect',
					label: '订货下限',
					width: '190px',
					required: true,
					editColumn: true,
					fxRender: this.lowerLimitRender,
					click: this.onCellClick('lowerLimitSelect')
				}, {
					prop: 'mustFlag',
					label: '必订品项',
					width: '110px',
					required: true,
					editColumn: true,
					fxRender: this.mustFlagRender,
					click: this.onCellClick('mustFlag')
				}, {
					prop: 'cycleWay',
					label: '订货周期',
					width: '300px',
					required: true,
					editColumn: true,
					fxRender: this.cycleWayRender,
					click: this.onCellClick('cycleWay')
				}, {
					prop: 'arrivalCycle',
					label: '到货周期',
					width: '100px',
					required: true,
					editColumn: true,
					fxRender: this.arrivalCycleRender,
					click: this.onCellClick('arrivalCycle')
				},
				{
					prop: 'enableFlag',
					label: '启停用',
					width: '110px',
					required: true,
					editColumn: true,
					fxRender: this.enableFlagRender,
					click: this.onCellClick('enableFlag')
				},
				{
					prop: 'memo',
					label: '明细备注',
					width: '200px',
					editColumn: true,
					fxRender: this.memoRender,
					click: this.onCellClick('memo')
				}
			],
			tableEditColumnProp: EDIT_INPUT_TYPE,
			tableValiDate: [{
				columnProp: 'sellerOrgan',
				rule: (row, success, error) => {
					if (!row.sellerOrgan) {
						error('卖方机构不能为空')
					} else if (this.organDetails.organIds.includes(row.sellerOrgan)) {
						error('卖方机构不能与买方机构相同')
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
					if (!row.unitId) {
						error('单位不能为空')
					} else {
						success()
					}
				}
			}, {
				columnProp: 'cycleDaySelect',
				rule (row, success, error) {
					if (row.cycleWay === 2 && !row.cycleDay.length) {
						error('日期不能为空')
					} else if (row.cycleWay === 3 && !row.cycleDay.length) {
						error('日期不能为空')
					} else {
						success()
					}
				}
			}, {
				columnProp: 'stockCycle',
				rule (row, success, error) {
					if (row.cycleWay === 5 && !row.stockCycle) {
						error('天数不能为0')
					} else {
						success()
					}
				}
			}, {
				columnProp: 'roundingNum',
				rule (row, success, error) {
					if (row.roundingWay === 1 && !row.roundingNum) {
						error('订货倍数不能为0')
					} else if (row.roundingWay === 1 && row.supperLimitSelect === 1 && row.roundingNum > row.supperLimit) {
						error('订货倍数不能大于订货上限')
					} else if (row.roundingWay === 1 && row.supperLimitSelect === 1 && (Math.abs(Math.floor(row.supperLimit / row.roundingNum) - Math.floor(row.lowerLimit / row.roundingNum)) < 1) && row.lowerLimit % row.roundingNum !== 0 && row.supperLimit % row.roundingNum !== 0) {
						error('订货倍数 * N不在上下限之间')
					} else {
						success()
					}
				}
			}, {
				columnProp: 'supperLimit',
				rule (row, success, error) {
					if (row.supperLimitSelect === 1 && (row.supperLimit < row.lowerLimit)) {
						error('订货上限不能小于订货下限')
					} else if (row.supperLimitSelect === 1 && !row.supperLimit) {
						error('订货上限不能为0')
					} else {
						success()
					}
				}
			}, {
				columnProp: 'lowerLimit',
				rule (row, success, error) {
					if (row.lowerLimitSelect === 1 && !row.lowerLimit) {
						error('订货下限不能为0')
					} else {
						success()
					}
				}
			}, {
				columnProp: 'crossStock',
				this: this,
				rule: (row, success, error) => {
					if (row.stockWay === 2 && (!('crossOrgans' in row) || row.crossOrgans.length === 0)) {
						this.$fxMessage.error('请选择越库实际供货方')
						error()
					} else {
						success()
					}
				}
			}],
			// 存储第一步的机构数据，sellInfo[0]为卖方机构，sellInfo[1]为越库
			sellInfo: [],
			// 存储第二步的数据，为所选全部品相的完整信息
			step2Data: [],
			roundingList: [
				{
					label: '不限制',
					id: 0
				},
				{
					label: '限制',
					id: 1
				}
			],
			supperLimitList: [
				{
					label: '无上限',
					id: 0
				},
				{
					label: '上限',
					id: 1
				}
			],
			lowerLimitList: [
				{
					label: '无下限',
					id: 0
				},
				{
					label: '下限',
					id: 1
				}
			],
			cycleWayList: [
				{
					name: '每天采购',
					id: 1
				},
				{
					name: '每周固定日采购',
					id: 2
				},
				{
					name: '每月固定日采购',
					id: 3
				},
				{
					name: '月末采购',
					id: 4
				}, {
					name: '隔天采购',
					id: 5
				}
			],
			stockCycleMutipleList: [],
			weekList: [
				{
					label: '周一',
					id: 1
				},
				{
					label: '周二',
					id: 2
				},
				{
					label: '周三',
					id: 3
				},
				{
					label: '周四',
					id: 4
				}, {
					label: '周五',
					id: 5
				}, {
					label: '周六',
					id: 6
				}, {
					label: '周日',
					id: 7
				}
			],
			addedItem: [],
			selectOptionProp: {
				name: 'code',
				disabled: 'disabled',
				visibleFlag: 'visibleFlag'
			},
			filterKeys: ['name', 'code', 'pinYin', 'spec', 'itemUnitList.barcode'],
			optionProp: {
				name: 'label',
				disabled: 'disabled',
				visibleFlag: 'visibleFlag'
			},
			editRowItemList: [],
			sellerHouseList: [],
			organSelectList: []
		}
	},
	computed: {
		...mapState({
			sysPointSize: state => state.system.sysPointSize
		}),
		computedItemList () {
			return this.itemList.filter(item => {
				return !this.addedItem.includes(item.id)
			})
		},
		computedSellerSelectList () {
			return this.sellerSelectList.filter(item => {
				return !this.organDetails.organIds.includes(item.id)
			})
		},
		computedSellerTabSelectList () {
			const sellerTabSelectList = this.$fxUtils.deepClone(this.sellerTabSelectList)
			sellerTabSelectList.forEach(item => {
				item.listData = item.listData.filter(_item => {
					return !this.organDetails.organIds.includes(_item.id)
				})
			})
			return sellerTabSelectList
		},
		isRowUsed () {
			return row => {
				return !!row.useFlag
			}
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
		}
	},
	methods: {
		sellerOrganRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select-tab
				ref={`sellerOrgan-${$index}`}
				vModel={row.sellerOrgan}
				isEdit={row.isEdit && !this.isRowUsed(row)}
				row={row}
				rowIndex={$index}
				columnProp='sellerOrgan'
				cellText={row.sellerOrganInfo.name}
				selectOptionList={this.computedSellerTabSelectList}
				on-on-change={this.onSellerOrganChange}
			></fx-list-cell-select-tab>
		},
		onSellerOrganChange (item, row) {
			row.sellerOrgan = item.id
			row.sellerOrganInfo = item
			this.sellerHouseList = item.store
			row.sellerHouse = ''
			row.sellerHouseInfo = {}
			if (this.$fxTypeMiddleware.isCommonType('supplierType')(['supplier'])(item.organType)) {
				const params = {
					supplierIds: [row.sellerOrgan]
				}
				this.getSupplierItemList(params).then((res) => {
					const supplierItemList = res.data
					this.editRowItemList = supplierItemList.length === 0 ? this.itemList : supplierItemList
				})
			} else {
				this.editRowItemList = this.itemList
			}
		},
		getSupplierItemList (params) {
			return this.$fxApi('planStock.getSupplierItemList')({ data: params }).then(res => {
				return Promise.resolve(res)
			})
		},
		optionRender (h, { item }) {
			h = this.$createElement
			return <div class="fx-common__cell-select__option fx-ellipsis">
				<span class="fx-common__cell-select__option-left fx-ellipsis" title={item.code}>{ item.code }</span>
				<span class="fx-common__cell-select__option-right fx-ellipsis" title={item.name}>{ item.name }</span>
			</div>
		},
		sellerHouseRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`sellerHouse-${$index}`}
				vModel={row.sellerHouse}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='sellerHouse'
				dropdownWidth='300px'
				cellText={row.sellerHouseInfo.name}
				optionRender={this.optionRender}
				selectOptionList={this.sellerHouseList}
				on-on-change={this.onOutStoreSelectChange}
				on-on-select-enter={this.onOutStoreSelectEnter}
				on-on-select-tab={this.onOutStoreSelectEnter}
			></fx-list-cell-select>
		},
		onOutStoreSelectChange (item, row) {
			row.sellerHouseInfo = item
			const organType = row.sellerOrganInfo.organType
			const isSupplierOrgan = this.$fxTypeMiddleware.isCommonType('supplierType')(['supplier'])(organType)
			if (!isSupplierOrgan) {
				this.getQueryHouseItemList([row.sellerHouseInfo.id]).then((res) => {
					this.editRowItemList = res
				})
			}
		},
		getQueryHouseItemList (ids, responseComplete = false) {
			const params = {
				houseIds: ids
			}
			return this.$fxApi('planStock.getQueryHouseItemList', responseComplete)({ data: params }).then(res => {
				return Promise.resolve(res)
			})
		},
		onOutStoreSelectEnter (row, $index, item) {
			if (this.isRowUsed(row)) {
				this.$refs.detailsTable.setListCellFocus('unit')
			} else {
				this.$refs.detailsTable.setListCellFocus('code')
			}
		},
		codeRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`code-${$index}`}
				value={row.item.id}
				isEdit={row.isEdit && !this.isRowUsed(row)}
				row={row}
				rowIndex={$index}
				columnProp='code'
				dropdownWidth='300px'
				cellText={row.item.code}
				optionRender={this.optionRender}
				selectOptionProp={this.selectOptionProp}
				selectOptionList={this.editRowItemList}
				filterKeys={this.filterKeys}
				asyncChange={this.onCodeSelectChange}
				asyncClick={this.onCodeSelectClick}
				on-on-select-enter={this.onCodeSelectEnter}
			></fx-list-cell-select>
		},
		onCodeSelectChange (item, row) {
			return new Promise(resolve => {
				row.item = item
				row.itemUnitList = item.itemUnitList
				row.unitId = item.itemUnitList[0].id
				row.itemUnit = item.itemUnitList[0]
				row.itemId = item.id
				resolve()
			})
		},
		onCodeSelectClick (item, row, $index, unchangedFlag) {
			return new Promise(resolve => {
				if (item.itemUnitList.length === 1) {
					this.$refs.detailsTable.setListCellFocus('roundingWay')
				} else {
					resolve()
				}
			})
		},
		onCodeSelectEnter (row, $index, item, unchangedFlag) {
			if (item.itemUnitList.length === 1) {
				this.$refs.detailsTable.setListCellFocus('roundingWay')
			} else {
				this.$refs.detailsTable.setListCellFocus('unit')
			}
		},
		unitRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`unit-${$index}`}
				vModel={row.unitId}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='unit'
				cellText={row.itemUnit ? row.itemUnit.name : row.unit.name}
				selectOptionList={row.itemUnitList}
				on-on-change={this.onUnitSelectChange}
			></fx-list-cell-select>
		},
		onUnitSelectChange (item, row) {
			row.itemUnit = item
		},
		stockWayRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-switch
				ref={`stockWay-${$index}`}
				vModel={row.stockWay}
				activeText='直发'
				inactiveText='越库'
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='stockWay'
				width={56}
				activeValue={1}
				inactiveValue={2}
				on-on-change={this.onstockWayChange}
			></fx-list-cell-switch>
		},
		onstockWayChange (item, row) {
			row.stockWay = item
			row.crossOrgans = row.crossOrgans || []
		},
		crossStockRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-button
				ref={`crossStock-${$index}`}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				disabled={row.stockWay === 1}
				columnProp='crossStock'
				on-on-click={this.onCrossStockClick}
			>
				{
					row.stockWay === 1
						? '/'
						: (row.crossOrgans[0] && row.crossOrgans[0].isDefault)
							? <div class='fx-ellipsis'><span class='fx-list-cell-default-text'>{row.crossOrgans[0].crossOrganName}</span><span>{row.crossOrgans.length === 1 ? '' : '，'}{row.crossOrgans.slice(1).map(item => item.crossOrganName).join('，')}</span></div>
							: <span class='fx-ellipsis'>{row.crossOrgans.map(item => item.crossOrganName).join('，')}</span>
				}
			</fx-list-cell-button>
		},
		onCrossStockClick (item, row) {
			if (!row.sellerOrgan) {
				this.$refs.detailsTable.setListCellFocus('sellerOrgan')
				return this.$fxMessage.warning('请先选择卖方机构')
			}
			this.editIndex = row.$fxIndex
			const organs = row.crossOrgans ? row.crossOrgans : []
			const ids = organs.map(item => {
				return item.crossOrgan
			})
			const crossHouseMap = {}
			const crossHouseNameMap = {}
			row.crossOrgans.forEach(item => {
				crossHouseMap[item.crossOrgan] = item.crossHouse
				crossHouseNameMap[item.crossOrgan] = item.crossHouseName
			})
			this.$refs.settingSeller.edit(ids, organs, crossHouseMap, crossHouseNameMap, row.sellerOrgan)
		},
		// -----订货倍数
		roundingRender (h, { row, $index }) {
			h = this.$createElement
			return <section class='flex-cell'><fx-list-cell-select
				class='flex-part'
				ref={`roundingWay-${$index}`}
				vModel={row.roundingWay}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='roundingWay'
				cellText={this.roundingSelectText(row)}
				selectOptionList={this.roundingList}
				selectOptionProp={this.optionProp}
				on-on-change={this.onRoundingSelectChange}
				on-on-select-enter={this.onRoundingWaySelectEnter}
				on-on-select-tab={this.onRoundingWaySelectEnter}
				asyncClick={this.onRoundingWaySelectClick}
			></fx-list-cell-select><fx-list-cell-input-number
				class='flex-long'
				ref={`roundingNum-${$index}`}
				vModel={row.roundingNum}
				isEdit={row.isEdit}
				row={row}
				disabled={row.roundingWay === 0}
				cellText={''}
				rowIndex={$index}
				columnProp='roundingNum'
				on-on-change={this.onRoundingNumberChange}
			>
			</fx-list-cell-input-number></section>
		},
		roundingSelectText (row) {
			let text
			if (row.roundingWay === 0) {
				text = this.roundingList[row.roundingWay].label
			} else {
				text = `按${row.roundingNum}倍采购`
			}
			return text
		},
		onRoundingSelectChange (item, row) {
			row.roundingWay = item.id
			if	(item.id === 0) {
				row.roundingNum = 0
			}
		},
		onRoundingWaySelectEnter (row) {
			this.$nextTick(() => {
				if (row.roundingWay === 0) {
					this.$refs.detailsTable.setListCellFocus('supperLimitSelect')
				} else {
					this.$refs.detailsTable.setListCellFocus('roundingNum')
				}
			})
		},
		onRoundingWaySelectClick (item, row) {
			return new Promise(() => {
				this.onRoundingWaySelectEnter(row)
			})
		},
		onRoundingNumberChange (item, row) {
			row.roundingNum = item
		},
		// ------订货上限
		supperLimitRender (h, { row, $index }) {
			h = this.$createElement
			return <section class='flex-cell'><fx-list-cell-select
				class='flex-part'
				ref={`supperLimitSelect-${$index}`}
				vModel={row.supperLimitSelect}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='supperLimitSelect'
				cellText={this.supperLimitSelectText(row)}
				selectOptionList={this.supperLimitList}
				selectOptionProp={this.optionProp}
				on-on-change={this.onSupperLimitSelectChange}
				on-on-select-enter={this.onSupperLimitSelectEnter}
				on-on-select-tab={this.onSupperLimitSelectEnter}
				asyncClick={this.onSupperLimitSelectClick}
			></fx-list-cell-select><fx-list-cell-input-number
				class='flex-long'
				ref={`supperLimit-${$index}`}
				vModel={row.supperLimit}
				isEdit={row.isEdit}
				row={row}
				disabled={row.supperLimitSelect === 0}
				cellText={''}
				rowIndex={$index}
				columnProp='supperLimit'
				pointSize={this.sysPointSize}
				on-on-change={this.onSupperLimitChange}
			>
			</fx-list-cell-input-number></section>
		},
		supperLimitSelectText (row) {
			let text
			if (row.supperLimit === 0) {
				text = '无上限'
			} else {
				text = `上限： ${this.$fxCommon.toFixedAutoZeroFill(row.supperLimit, this.sysPointSize)}`
			}
			return text
		},
		onSupperLimitSelectChange (item, row) {
			row.supperLimitSelect = item.id
			if	(item.id === 0) {
				row.supperLimit = 0
			}
		},
		onSupperLimitSelectEnter (row) {
			this.$nextTick(() => {
				if (row.supperLimitSelect === 0) {
					this.$refs.detailsTable.setListCellFocus('lowerLimitSelect')
				} else {
					this.$refs.detailsTable.setListCellFocus('supperLimit')
				}
			})
		},
		onSupperLimitSelectClick (item, row) {
			return new Promise(() => {
				this.onSupperLimitSelectEnter(row)
			})
		},
		onSupperLimitChange (item, row) {
			row.supperLimit = item
		},
		// ------订货下限
		lowerLimitRender (h, { row, $index }) {
			h = this.$createElement
			return <section class='flex-cell'><fx-list-cell-select
				class='flex-part'
				ref={`lowerLimitSelect-${$index}`}
				vModel={row.lowerLimitSelect}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='lowerLimitSelect'
				cellText={this.lowerLimitSelectText(row)}
				selectOptionList={this.lowerLimitList}
				selectOptionProp={this.optionProp}
				on-on-change={this.onLowerLimitSelectChange}
				on-on-select-enter={this.onLowerLimitSelectEnter}
				on-on-select-tab={this.onLowerLimitSelectEnter}
				asyncClick={this.onLowerLimitSelectClick}
			></fx-list-cell-select><fx-list-cell-input-number
				class='flex-long'
				ref={`lowerLimit-${$index}`}
				vModel={row.lowerLimit}
				vShow={row.isEdit}
				isEdit={row.isEdit}
				row={row}
				disabled={row.lowerLimitSelect === 0}
				cellText={''}
				rowIndex={$index}
				columnProp='lowerLimit'
				pointSize={this.sysPointSize}
				on-on-change={this.onLowerLimitChange}
			>
			</fx-list-cell-input-number></section>
		},
		lowerLimitSelectText (row) {
			let text
			if (row.lowerLimit === 0) {
				text = '无下限'
			} else {
				text = `下限： ${this.$fxCommon.toFixedAutoZeroFill(row.lowerLimit, this.sysPointSize)}`
			}
			return text
		},
		onLowerLimitSelectChange (item, row) {
			row.lowerLimitSelect = item.id
			if	(item.id === 0) {
				row.lowerLimit = 0
			}
		},
		onLowerLimitSelectEnter (row) {
			this.$nextTick(() => {
				if (row.lowerLimitSelect !== 0) {
					this.$refs.detailsTable.setListCellFocus('lowerLimit')
				} else {
					this.$refs.detailsTable.setListCellFocus('cycleWay')
				}
			})
		},
		onLowerLimitSelectClick (item, row) {
			return new Promise(() => {
				this.onLowerLimitSelectEnter(row)
			})
		},
		onLowerLimitChange (item, row) {
			row.lowerLimit = item
		},
		// 必订品项
		mustFlagRender  (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-switch
				ref={`mustFlag-${$index}`}
				vModel={row.mustFlag}
				isEdit={row.isEdit}
				activeText='必订'
				inactiveText='非必订'
				row={row}
				rowIndex={$index}
				columnProp='mustFlag'
			></fx-list-cell-switch>
		},
		// ------订货周期
		cycleWayRender (h, { row, $index }) {
			h = this.$createElement
			return <section class='flex-cell'>
				<fx-list-cell-select
					ref={`cycleWay-${$index}`}
					class='short-cell-part'
					vModel={row.cycleWay}
					isEdit={row.isEdit}
					row={row}
					rowIndex={$index}
					columnProp='cycleWay'
					selectOptionList={this.cycleWayList}
					on-on-change={this.onCycleWaySelectChange}
					on-on-select-enter={this.onCycleWaySelectEnter}
					on-on-select-tab={this.onCycleWaySelectEnter}
					cellText={this.cycleWaySelectText(row)}
					asyncClick={this.onCycleWaySelectClick}
				></fx-list-cell-select><fx-list-cell-select-mulity
					class='long-cell-part'
					ref={`cycleDaySelect-${$index}`}
					vModel={row.cycleDay}
					isEdit={row.isEdit}
					vShow={[2, 3].includes(row.cycleWay) && row.isEdit}
					row={row}
					cellText={''}
					rowIndex={$index}
					selectOptionProp={this.optionProp}
					columnProp='cycleDaySelect'
					dropdownWidth='180px'
					selectOptionList={this.stockCycleMutipleList}
					on-on-select-enter={this.onCycleDaySelectEnter}
					on-on-select-tab={this.onCycleDaySelectEnter}
					on-on-change={this.onCycleDaySelectChange}
				>
				</fx-list-cell-select-mulity><fx-list-cell-input-number
					class='long-cell-part'
					ref={`stockCycle-${$index}`}
					vModel={row.stockCycle}
					isEdit={row.isEdit}
					vShow={[1, 4, 5].includes(row.cycleWay) && row.isEdit}
					row={row}
					disabled={row.cycleWay !== 5}
					cellText={''}
					rowIndex={$index}
					integer={true}
					columnProp='stockCycle'
					on-on-input-enter={this.onCycleDaySelectEnter}
					on-on-input-tab={this.onCycleDaySelectEnter}
					on-on-change={this.onStockCycleChange}
				>
				</fx-list-cell-input-number>
			</section>
		},
		cycleWaySelectText (row) {
			let text = ''
			switch (row.cycleWay) {
			case 1 :
				text = '每天采购'
				break
			case 2 :
				text = `每周${row.cycleDay.join(',')}采购`
				break
			case 3 :
				if (Number(row.cycleDay[0]) === 32) {
					text = '每月月末最后一天采购'
				} else if (Number(row.cycleDay[row.cycleDay.length - 1]) === 32) {
					text = `每月${row.cycleDay.slice(0, -1).join(',')}日及月末最后一天采购`
				} else {
					text = `每月${row.cycleDay.join(',')}日采购`
				}
				break
			case 4 :
				text = '月末采购'
				break
			case 5 :
				text = `每隔${row.stockCycle}天采购`
				break
			}
			return text
		},
		onCycleWaySelectChange (item, row) {
			const id = item.id
			row.cycleWay = id
			row.cycleDay = []
			switch (id) {
			case 1 :
				row.disabledCycleInput = true
				row.showCycleInput = true
				row.stockCycle = 0
				break
			case 2 :
				row.disabledCycleInput = true
				row.showCycleInput = false
				this.stockCycleMutipleList = this.weekList
				break
			case 3 :
				row.disabledCycleInput = true
				row.showCycleInput = false
				this.stockCycleMutipleList = this.daysList(31)
				break
			case 4 :
				row.disabledCycleInput = true
				row.showCycleInput = true
				row.stockCycle = 0
				break
			case 5 :
				row.stockCycle = 0
				row.disabledCycleInput = false
				row.showCycleInput = true
				break
			}
		},
		onCycleWaySelectEnter (row) {
			this.$nextTick(() => {
				if ([2, 3].includes(row.cycleWay)) {
					this.$refs.detailsTable.setListCellFocus('cycleDaySelect')
				} else if (row.cycleWay === 5) {
					this.$refs.detailsTable.setListCellFocus('stockCycle')
				} else {
					this.$refs.detailsTable.setListCellFocus('arrivalCycle')
				}
			})
		},
		onCycleWaySelectClick (item, row) {
			return new Promise(() => {
				this.onCycleWaySelectEnter(row)
			})
		},
		onCycleDaySelectEnter () {
			this.$refs.detailsTable.setListCellFocus('arrivalCycle')
		},
		daysList (i) {
			const list = [...Array(i).keys()].map(item => {
				return {
					label: item + 1 + '',
					id: item + 1
				}
			})
			list.push({
				label: '月末最后一天',
				id: 32
			})
			return list
		},
		onStockCycleChange (item, row) {
			// 限制最大值为99
			const max = 99
			if (item > max) {
				row.stockCycle = max + 1
				this.$nextTick(() => {
					row.stockCycle = max
				})
			} else {
				row.stockCycle = item
			}
		},
		onCycleDaySelectChange (item, row) {
			row.cycleDay = item.map(item => {
				return item.id
			})
		},
		// 到货周期
		arrivalCycleRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`arrivalCycle-${$index}`}
				vModel={row.arrivalCycle}
				isEdit={row.isEdit}
				row={row}
				cellText={row.arrivalCycle + '小时'}
				rowIndex={$index}
				integer={true}
				columnProp='arrivalCycle'
				on-on-change={this.onArrivalCycleChange}
			>
			</fx-list-cell-input-number>
		},
		onArrivalCycleChange (item, row) {
			// 限制最大值为9999
			const max = 9999
			if (item > max) {
				row.arrivalCycle = max + 1
				this.$nextTick(() => {
					row.arrivalCycle = max
				})
			} else {
				row.arrivalCycle = item
			}
		},
		onSaveSettingSeller (data) {
			const crossOrgans = data[2].map(item => {
				return {
					crossHouseName: item.crossHouseName,
					crossHouse: item.crossHouse,
					crossOrganName: item.name,
					crossOrgan: item.id,
					isDefault: item.id === data[3] ? 1 : 0
				}
			}).sort((a, b) => b.isDefault - a.isDefault)
			const crossStockText = crossOrgans.map(item => {
				return item.crossOrganName
			}).join('，')
			this.tableDetails[this.editIndex].defaultCrossStock = crossOrgans[0].crossOrganName
			this.tableDetails[this.editIndex].crossOrgans = crossOrgans
			this.tableDetails[this.editIndex].crossStockText = crossStockText
		},
		enableFlagRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-switch
				ref={`enableFlag-${$index}`}
				vModel={row.enableFlag}
				activeText='已启用'
				inactiveText='未启用'
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='enableFlag'
			></fx-list-cell-switch>
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
				maxlength={this.$fxCommon.getFxInputMaxLength('memo')}
				regType={this.$fxCommon.getFxInputReg('memo')}
			></fx-list-cell-input>
		},
		beforeRowEdit (row) {
			if (row.cycleWay === 2) {
				this.stockCycleMutipleList = this.weekList
			}
			if (row.cycleWay === 3) {
				this.stockCycleMutipleList = this.daysList(31)
			}
			row.cycleDay = row.cycleDay.map(item => {
				return Number(item)
			})
			this.sellerHouseList = this.$fxUtils.getSelectTagById(row.sellerOrgan, this.computedSellerTabSelectList).store || []
			return new Promise(resolve => {
				this.getEditItemList(row).then(res => {
					const organType = row.sellerOrganInfo.organType
					const isSupplierOrgan = this.$fxTypeMiddleware.isCommonType('supplierType')(['supplier'])(organType)
					res = isSupplierOrgan ? res.data : res
					this.editRowItemList = res
					if (row.item.id) {
						const itemUnitList = (res.find(item => {
							return item.id === row.item.id
						}) || {}).itemUnitList
						row.itemUnitList = itemUnitList
						resolve()
					}
				})
			})
		},
		onCellClick (type) {
			return (row) => {
				this.$refs.detailsTable.setRowEdit(row, type)
			}
		},
		onFullScreenClick (flag) {
			this.$emit('update:isFullScreen', flag)
		},
		fpInitAddDetailsData () {
			return new Promise(resolve => {
				this.editRowItemList = this.itemList
				this.sellerHouseList = []
				resolve({
					stockWay: 1,
					sellerOrgan: '',
					sellerOrganInfo: {},
					sellerHouse: '',
					sellerHouseInfo: {},
					planId: this.organDetails.id,
					item: {},
					itemUnitList: [],
					itemUnit: {},
					mainUnitId: '',
					price: 0,
					taxPrice: 0,
					enableFlag: 1,
					memo: '',
					roundingWay: 0,
					roundingNum: 0,
					supperLimitSelect: 0,
					supperLimit: 0,
					lowerLimitSelect: 0,
					lowerLimit: 0,
					mustFlag: 0,
					cycleWay: 1,
					stockCycle: 0,
					crossOrgans: [],
					showCycleInput: true,
					disabledCycleInput: true,
					cycleDay: [],
					arrivalCycle: 24,
					unit: {},
					sortNum: 0
				})
			})
		},
		fpSaveDetails (detail, origin) {
			detail.stockCycle = detail.cycleWay === 5 ? detail.stockCycle : detail.cycleDay.join(',')
			if (this.organDetails.id) {
				detail.planId = this.organDetails.id
				return this.onSaveDetailsHandler(detail, origin)
			} else {
				return this.fSavePlan(detail, origin)
			}
		},
		onSaveDetailsHandler (params, origin) {
			if (params.id) {
				const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan.updateDetails', this.createLoggerParams(params, origin))
				return this.$fxApi('planStock.saveDetails', params.planId, params.id)({ data: params, logger }).then(res => {
					return Promise.resolve(res)
				})
			} else {
				const addItemInfo = this.getAddItemInfo(params)
				const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan.addDetails', { addItemInfo, name: this.organDetails.name })
				return this.$fxApi('planStock.addDetails', params.planId)({ data: params, logger }).then(res => {
					return Promise.resolve(res)
				})
			}
		},
		createLoggerParams (params, origin) {
			const originData = this.$fxUtils.deepClone(origin)
			originData.roundingText = this.roundingSelectText(originData)
			originData.supperLimitText = this.supperLimitSelectText(originData)
			originData.lowerLimitText = this.lowerLimitSelectText(originData)
			originData.cycleWayText = this.cycleWaySelectText(originData)
			originData.defaultCrossStock = (originData.crossOrgans && originData.crossOrgans[0]) ? originData.crossOrgans[0].crossOrganName : '/'
			const organDetails = this.$fxUtils.deepClone(params)
			organDetails.roundingText = this.roundingSelectText(organDetails)
			organDetails.supperLimitText = this.supperLimitSelectText(organDetails)
			organDetails.lowerLimitText = this.lowerLimitSelectText(organDetails)
			organDetails.cycleWayText = this.cycleWaySelectText(organDetails)
			organDetails.defaultCrossStock = (organDetails.crossOrgans && organDetails.crossOrgans[0]) ? organDetails.crossOrgans[0].crossOrganName : '/'
			return {
				pre: originData,
				cur: organDetails,
				name: this.organDetails.name,
				itemName: organDetails.item.name
			}
		},
		getAddItemInfo (params) {
			const crossOrganNames = params.crossStockText || '/'
			const stockWay = params.stockWay === 1 ? '直发' : '越库'
			const sellerName = params.sellerOrganInfo.name
			const defaultCrossStock = params.defaultCrossStock || '/'
			return `卖方机构:${sellerName},品项名称:${params.item.name},订货方式:${stockWay},越库实际供货方:${crossOrganNames},默认越库实际供货方:${defaultCrossStock}`
		},
		fpDeleteDetails (ids, selectRows) {
			const canDelRows = selectRows.filter(item => !item.useFlag && item.id)
			const canDelIds = canDelRows.map(item => item.id)
			const deleteItemInfo = this.getDeleteItemInfo(canDelRows)
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan.deleteDetails', { deleteItemInfo, name: this.organDetails.name })
			if (canDelIds.length === 0) {
				this.$fxMessage.warning('选中的明细均为原方案中的明细，无法删除')
				this.$refs.detailsTable.clearSelected()
				return false
			}
			return this.$fxApi('planStock.delDetailMulity', this.organDetails.id)({ data: canDelIds, logger })
		},
		getDeleteItemInfo (selectRows) {
			return selectRows.map(item => {
				const crossOrganNames = item.crossStockText || '/'
				const stockWay = item.stockWay === 1 ? '直发' : '越库'
				const sellerName = item.sellerOrganInfo.name
				return `卖方机构:${sellerName},品项名称:${item.item.name},订货方式:${stockWay},越库实际供货方:${crossOrganNames}`
			}).join(';')
		},
		fpOnRowEdit (row, $index, type) {
			return new Promise(resolve => {
				if (this.isRowUsed(row) && ['sellerOrgan', 'code'].includes(type)) {
					this.$refs.detailsTable.setListCellFocus('sellerHouse')
				} else {
					this.$refs.detailsTable.setListCellFocus(type)
				}
				resolve()
			})
		},
		onDetailsRefresh () {
			this.$emit('on-details-refresh')
		},
		onAddMulity () {
			this.clearAddMulity()
			this.$refs.addItemStep1.open()
		},
		clearAddMulity () {
			this.$refs.addItemStep1.refresh()
			this.$refs.addItemStep2.refresh()
			this.$refs.addItemStep3.refresh()
			this.addedItem = []
		},
		checkDetailsUnSaving () {
			return this.$refs.detailsTable.checkDetailsUnSaving()
		},
		onSettingMulitySave (setting) {
			const submitData = {
				ids: []
			}
			let type = ''
			const itemNames = []
			let settingInfo = ''
			this.$refs.detailsTable.getSelectRows().then(res => {
				if (setting.type === 6) {
					res.forEach(item => {
						if (item.sellerOrgan === setting.sellerOrgan) {
							submitData.ids.push(item.id)
							itemNames.push(item.item.name)
						}
					})
				} else {
					res.forEach(item => {
						submitData.ids.push(item.id)
						itemNames.push(item.item.name)
					})
					this.tableDetails.forEach(item => {
						if (submitData.ids.includes(item.id)) {
							switch (setting.type) {
							case 0:
								if (setting.supperLimit !== 0 && (setting.supperLimit < item.lowerLimit)) {
									this.$fxMessage.error(`第${item.$fxIndex + 1}行明细，订货上限不能小于订货下限`)
									throw new Error()
								}
								if (item.roundingWay === 1 && setting.supperLimit !== 0 && (Math.abs(Math.floor(setting.supperLimit / item.roundingNum) - Math.floor(item.lowerLimit / item.roundingNum)) < 1) && item.lowerLimit % item.roundingNum !== 0 && setting.supperLimit % item.roundingNum !== 0) {
									this.$fxMessage.error(`第${item.$fxIndex + 1}行明细，订货倍数 * N不在上下限之间`)
									throw new Error()
								}
								if (item.roundingWay === 1 && setting.supperLimit !== 0 && item.roundingNum > setting.supperLimit) {
									this.$fxMessage.error(`第${item.$fxIndex + 1}行明细，订货倍数不能大于订货上限`)
									throw new Error()
								}
								break
							case 1:
								if (item.supperLimit !== 0 && (item.supperLimit < setting.lowerLimit)) {
									this.$fxMessage.error(`第${item.$fxIndex + 1}行明细，订货下限不能大于订货上限`)
									throw new Error()
								}
								if (item.roundingWay === 1 && item.supperLimit !== 0 && (Math.abs(Math.floor(item.supperLimit / item.roundingNum) - Math.floor(setting.lowerLimit / item.roundingNum)) < 1) && setting.lowerLimit % item.roundingNum !== 0 && item.supperLimit % item.roundingNum !== 0) {
									this.$fxMessage.error(`第${item.$fxIndex + 1}行明细，订货倍数 * N不在上下限之间`)
									throw new Error()
								}
								break
							case 2:
								if (setting.roundingWay === 1 && item.supperLimitSelect === 1 && (Math.abs(Math.floor(item.supperLimit / setting.roundingNum) - Math.floor(item.lowerLimit / setting.roundingNum)) < 1) && item.lowerLimit % setting.roundingNum !== 0 && item.supperLimit % setting.roundingNum !== 0) {
									this.$fxMessage.error(`第${item.$fxIndex + 1}行明细，订货倍数 * N不在上下限之间`)
									throw new Error()
								}
								if (item.roundingWay === 1 && item.supperLimitSelect === 1 && setting.roundingNum > item.supperLimit) {
									this.$fxMessage.error(`第${item.$fxIndex + 1}行明细，订货倍数不能大于订货上限`)
									throw new Error()
								}
								break
							default:
								break
							}
						}
					})
				}
				switch (setting.type) {
				case 0:
					submitData.supperLimit = setting.supperLimit
					type = 'supperLimit'
					settingInfo = '订货上限:' + this.supperLimitSelectText(setting)
					break
				case 1:
					submitData.lowerLimit = setting.lowerLimit
					type = 'lowerLimit'
					settingInfo = '订货下限:' + this.lowerLimitSelectText(setting)
					break
				case 2:
					submitData.roundingWay = setting.roundingWay
					submitData.roundingNum = setting.roundingNum
					settingInfo = '订货倍数:' + this.roundingSelectText(setting)
					type = 'roundingWay'
					break
				case 3:
					submitData.mustFlag = setting.mustFlag
					type = 'mustFlag'
					settingInfo = `必订品项:${setting.mustFlag ? '必采' : '非必采'}`
					break
				case 4:
					submitData.arrivalCycle = setting.arrivalCycle
					type = 'arrivalCycle'
					settingInfo = `到货周期:${setting.arrivalCycle}小时`
					break
				case 5:
					submitData.stockCycle = setting.stockCycle
					submitData.cycleWay = setting.cycleWay
					type = 'cycleWay'
					settingInfo = '订货周期:' + this.cycleWaySelectText(setting)
					break
				case 6:
					submitData.sellerOrgan = setting.sellerOrgan
					submitData.sellerHouse = setting.sellerHouse
					type = 'sellerHouse'
					settingInfo = `出库仓库: 卖方机构:${setting.sellerOrganName},出库仓库:${setting.sellerHouseName}`
					break
				}
				const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan.settingMulityDetails', { settingInfo, name: this.organDetails.name, itemNames })
				this.$fxApi('planStock.setDetailMulity', this.organDetails.id, type)({ data: submitData, logger }).then(this.onDetailsRefresh)
			}).catch(() => {})
		},
		async step1ToStep2 (data) {
			this.sellInfo = [].slice.call(data)
			const sellerOrganIds = this.sellInfo[0].map(item => {
				return item.id
			})
			const sellerHouseIds = this.sellInfo[0].map(item => item.sellerHouse).filter(_item => _item)
			this.$emit('get-supplier-item-list', sellerOrganIds, sellerHouseIds)
			await this.$refs.addItemStep2.open()
			this.$refs.addItemStep1.hide()
		},
		step2ToStep3 (data) {
			this.step2Data = data
			this.$refs.addItemStep3.open(data)
			this.$refs.addItemStep2.hide()
		},
		step2ToStep1 () {
			this.$refs.addItemStep1.open()
			this.$refs.addItemStep2.hide()
		},
		async step3ToStep2 (data) {
			if (this.$fxUtils.isDef(data)) {
				this.$refs.addItemStep2.refresh()
				this.addedItem = data || []
			}
			await this.$refs.addItemStep2.open()
			this.$refs.addItemStep3.hide()
		},
		clearStep3TableDataMap () {
			this.$refs.addItemStep3.clearTableDataMap()
		},
		deleteDetails (ids) {
			this.$refs.addItemStep2.deleteSelectIds(ids)
		},
		onSettingMulityClose () {
			this.$refs.detailsTable.closeMulitySettingPopver()
		},
		onMistakeCheckClick () {
			this.$emit('on-mistake-check')
		},
		getEditItemList (row) {
			const organType = row.sellerOrganInfo.organType
			const isSupplierOrgan = this.$fxTypeMiddleware.isCommonType('supplierType')(['supplier'])(organType)
			const houseId = row.sellerHouseInfo.id
			const itemId = isSupplierOrgan ? row.sellerOrganInfo.id : row.item.id
			const apiName = isSupplierOrgan ? 'getSupplierItemList' : (houseId ? 'getQueryHouseItemList' : 'getItemList')
			let params = houseId ? (isSupplierOrgan ? [] : {}) : (isSupplierOrgan ? {} : [])
			if (houseId) {
				if (isSupplierOrgan) {
					params = {
						supplierIds: [itemId]
					}
				} else {
					params.extraItemIds = [itemId]
					params.houseIds = [houseId]
				}
			} else {
				if (isSupplierOrgan) {
					params = {
						supplierIds: [itemId]
					}
				} else {
					params = [itemId]
				}
			}
			return this.$fxApi(`planStock.${apiName}`)({ data: params })
		},
		clear () {
			this.$refs.detailsTable.clear()
		},
		onSettingMulityShow () {
			this.$refs.detailsTable.getSelectRows(false).then(res => {
				const sellerOrganMap = {}
				res.forEach(item => {
					if (!sellerOrganMap[item.sellerOrgan]) {
						sellerOrganMap[item.sellerOrgan] = item.sellerOrganInfo
					}
				})
				this.organSelectList = Object.values(sellerOrganMap)
			})
		},
		defaultFocus () {
			if (this.tableDetails.length) {
				this.$refs.detailsTable.onTabSetRowEdit()
			} else if (this.canAdd) {
				this.$refs.detailsTable.onAddOnce()
			}
		},
		isRowEditing () {
			return this.$refs.detailsTable.isRowEditing()
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.details-info {
	width: 100%
	.tools-left, .tools-right {
		display:flex
		flex-direction: row
		align-items: center
	}
	.tools-left {
		flex: 1
	}
}
.flex-cell{
	display: flex
	.short-cell-part{
		display inline-block
		flex 1
	}
	.long-cell-part{
		width:138px
		display inline-block
	}
	.flex-part {
		display inline-block
		flex 1
	}
	.flex-long {
		width:75px
		display inline-block
	}
}
.details-info__btn-popper {
	.btn-popper-container {
		display: flex
		flex-direction: column
		.popper-btn {
			margin-top: 10px
			margin-left: 0px
		}
	}
}

.details-info{
	>>>.el-table__fixed {
		height calc(100% - 15px) !important
	}
}
.fx-list-cell-default-text {
	color: $fxOrange1
}
</style>
