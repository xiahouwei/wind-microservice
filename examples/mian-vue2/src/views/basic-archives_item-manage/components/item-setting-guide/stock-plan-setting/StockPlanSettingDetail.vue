<template>
<div class="setting-detail-container">
	<fx-details-table
		ref="detailsTable"
		:tableColumn="tableColumn"
		:tableData="tableData"
		:tableValiDate="tableValiDate"
		:tableEditColumnProp="tableEditColumnProp"
		:canAdd="false"
		:showTools="false"
		:selectable="false"
		:showIndex="false"
		minHeight="60px"
		class="item-setting-table"
	>
	</fx-details-table>
	<w-link
		type="primary"
		icon="table-details-setting"
		class="setting-link"
		@click="onSaveClick"
	>
		将以上订货方案明细添加至选中的订货方案
	</w-link>
	<settingSeller
		ref="settingSeller"
		:listData="sellerSelectList"
		@on-save-click="onSaveSettingSeller(arguments)"
	></settingSeller>
</div>
</template>

<script>
import settingSeller from '@/views/basic-archives_stock-plan/components/create-container/SettingSeller.vue'
export default {
	name: 'stockPlanSettingDetail',
	components: {
		settingSeller
	},
	props: {
		itemDetails: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	data () {
		return {
			tableColumn: [
				{
					prop: 'sellerOrgan',
					label: '卖方机构',
					width: '150px',
					required: true,
					editColumn: true,
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
				{ prop: 'item.code', label: '品项编号', width: '120px', required: true, fixed: true },
				{ prop: 'item.name', label: '品项名称', required: true, fixed: true, width: '100px' },
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
					editColumn: true,
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
			tableValiDate: [{
				columnProp: 'sellerOrgan',
				rule: (row, success, error) => {
					if (!row.sellerOrgan) {
						error('卖方机构不能为空')
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
			tableEditColumnProp: ['sellerOrgan', 'sellerHouse', 'unit', 'roundingWay', 'roundingNum', 'supperLimitSelect', 'supperLimit', 'lowerLimitSelect', 'lowerLimit', 'cycleWay', 'cycleDaySelect', 'stockCycle', 'arrivalCycle', 'memo'],
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
			tableData: [{
				stockWay: 1,
				sellerOrgan: '',
				sellerOrganInfo: {},
				sellerHouse: '',
				sellerHouseInfo: {},
				planId: '',
				item: {},
				itemUnit: {},
				unitId: '',
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
				sortNum: 0
			}],
			selectOptionProp: {
				name: 'code',
				disabled: 'disabled',
				visibleFlag: 'visibleFlag'
			},
			optionProp: {
				name: 'label',
				disabled: 'disabled',
				visibleFlag: 'visibleFlag'
			},
			sellerSelectList: [],
			sellerHouseList: [],
			sellerTabSelectList: [],
			itemUnitList: [],
			outStoreSelectLoading: false
		}
	},
	methods: {
		initData () {
			this.getItemUnitList().then(() => {
				this.tableData = [{
					stockWay: 1,
					sellerOrgan: '',
					sellerOrganInfo: {},
					sellerHouse: '',
					sellerHouseInfo: {},
					planId: '',
					item: this.itemDetails,
					itemUnit: this.itemUnitList[0],
					unitId: this.itemUnitList[0].id,
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
					sortNum: 0
				}]
				this.getSellerList()
				this.getSellerTabList()
			})
		},
		getItemUnitList () {
			return this.$fxApi('item.getItemUnitList', this.itemDetails.id, 'StockPlan').then(res => {
				this.itemUnitList = res
				return Promise.resolve()
			})
		},
		getSellerList () {
			return this.$fxApi('item.getSellerList', this.itemDetails.id)({ data: [] }).then(res => {
				this.sellerSelectList = res
			})
		},
		getSellerTabList () {
			return this.$fxApi('item.getSellerTabList', this.itemDetails.id)({ data: [] }).then(res => {
				this.sellerTabSelectList = res
			})
		},
		sellerOrganRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select-tab
				ref={`sellerOrgan-${$index}`}
				vModel={row.sellerOrgan}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='sellerOrgan'
				cellText={row.sellerOrganInfo.name}
				selectOptionList={this.sellerTabSelectList}
				on-on-change={this.onSellerOrganChange}
			></fx-list-cell-select-tab>
		},
		onSellerOrganChange (item, row) {
			row.sellerOrgan = item.id
			row.sellerOrganInfo = item
			row.sellerHouse = ''
			row.sellerHouseInfo = {}
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
				loading={this.outStoreSelectLoading}
				selectOptionList={this.sellerHouseList}
				on-on-change={this.onOutStoreSelectChange}
				on-on-select-enter={this.onOutStoreSelectEnter}
				on-on-select-tab={this.onOutStoreSelectEnter}
				fpSelectShow={this.onOutStoreSelectShow(row)}
			></fx-list-cell-select>
		},
		onOutStoreSelectChange (item, row) {
			row.sellerHouseInfo = item
		},
		onOutStoreSelectEnter (row, $index, item) {
			this.$refs.detailsTable.setListCellFocus('unit')
		},
		onOutStoreSelectShow (row) {
			return () => {
				return new Promise(resolve => {
					this.outStoreSelectLoading = true
					if (row.sellerOrgan) {
						this.getSellerHouseList(row.sellerOrgan).then(res => {
							this.outStoreSelectLoading = false
							this.sellerHouseList = res
							resolve()
						})
					} else {
						this.$fxMessage.warning('请先选择卖方机构')
					}
				})
			}
		},
		getSellerHouseList (organId) {
			return this.$fxApi('item.getSellerHouseList', organId, this.itemDetails.id)
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
				cellText={row.itemUnit.name}
				selectOptionList={this.itemUnitList}
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
			this.tableData[0].defaultCrossStock = crossOrgans[0].crossOrganName
			this.tableData[0].crossOrgans = crossOrgans
			this.tableData[0].crossStockText = crossStockText
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
		onCellClick (type) {
			return (row) => {
				this.$refs.detailsTable.setRowEdit(row, type)
			}
		},
		onSaveClick () {
			if (!this.tableData[0].sellerOrgan) {
				this.$refs.detailsTable.setRowEdit(this.tableData[0], 'sellerOrgan')
			} else {
				this.$refs.detailsTable.checkDetailsUnSaving().then(() => {
					this.$emit('on-save-detail', this.tableData[0])
				})
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.item-setting-table {
	height 90px
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
}
.setting-link {
	display inline-block
	margin-top 5px
	margin-bottom 15px
}
</style>
