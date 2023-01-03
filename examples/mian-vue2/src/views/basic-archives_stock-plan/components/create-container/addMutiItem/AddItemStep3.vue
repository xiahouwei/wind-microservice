<template>
	<w-dialog v-model="dialogVisible" width="1200px" heightFullscreen :beforeClose="onBeforeClose">
		<template slot='title'>
			<span class="dialogTitle">设置采购参数</span>
			<span>第3步</span>
		</template>
		<div class="create-organ">
			<fx-details-table
				ref="detailsTable"
				v-fx-tab:focus.saveAndAddBtn
				:tableColumn="tableColumn"
				:tableValiDate="tableValiDate"
				:tableData="tableData"
				:tableEditColumnProp="tableEditColumnProp"
				:canAdd="false"
				:fpGetDetailsMainId="fpGetDetailsMainId"
				:showIndex='false'
				:fpDeleteDetails="fpDeleteDetails"
				:fpBeforeRowEdit="fpBeforeRowEdit"
				:loading="loading"
				:loadingText='"加载中"'
				:selectedRows="selectedRows"
			>
				<settingMulity
					slot="setting-mulity"
					@on-save-click="onSettingMulitySave"
					:visible="visible"
					slot-scope="{ visible }"
					@on-cancel-click="onSettingMulityClose"
				></settingMulity>
			</fx-details-table>
		</div>
		<template slot="footer">
			<el-button
				ref="preStepBtn"
				v-fx-tab:focus.detailsTable
				@click="step3ToStep2"
			>上一步</el-button>
			<el-button
				ref="saveBtn"
				type="primary"
				v-fx-tab:focus.preStepBtn
				@click="onSaveClick"
			>保存并关闭</el-button>
			<el-button
				ref="saveAndAddBtn"
				type="primary"
				v-fx-tab:focus.saveBtn
				@click="onSaveAndAddClick"
			>保存并继续添加</el-button>
		</template>
	</w-dialog>
</template>
<script>
import { mapState } from 'vuex'
import settingMulity from '../SettingMulity.vue'
const EDIT_INPUT_TYPE = ['unit', 'roundingWay', 'roundingNum', 'supperLimitSelect', 'supperLimit', 'lowerLimitSelect', 'lowerLimit', 'cycleWay', 'arrivalCycle']
export default {
	name: 'addMulityStep3',
	components: {
		settingMulity
	},
	props: {
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		fpPreStep: Function,
		sellInfo: {
			type: Array,
			default: () => {
				return []
			}
		},
		organList: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	data () {
		return {
			dialogVisible: false,
			tableColumn: [
				{ prop: 'item.code', label: '品项编号', width: '100px', fixed: true },
				{ prop: 'item.name', label: '品项名称', fixed: true },
				{ prop: 'item.spec', label: '规格', fixed: true },
				{
					prop: 'unit',
					label: '单位',
					width: '100px',
					required: true,
					editColumn: true,
					fxRender: this.unitRender,
					click: this.onCellClick('unit')
				}, {
					prop: 'rounding',
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
				}
			],
			tableEditColumnProp: EDIT_INPUT_TYPE,
			tableValiDate: [{
				columnProp: 'unit',
				rule (row, success, error) {
					if (!row.itemUnit.id) {
						error('单位不能为空')
					} else {
						success()
					}
				}
			}, {
				columnProp: 'cycleWay',
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
			}],
			tableData: [],
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
			loading: false,
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			addedItem: [],
			selectedRows: [],
			optionProp: {
				name: 'label',
				disabled: 'disabled',
				visibleFlag: 'visibleFlag'
			},
			tableDataMap: new Map()
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize
		})
	},
	methods: {
		open (items) {
			this.loading = true
			this.dialogVisible = true
			const tableData = items.map((_item, index) => {
				if (this.tableDataMap.has(_item.id)) {
					return this.tableDataMap.get(_item.id)
				}
				const itemUnit = _item.itemUnitList[0]
				const mainUnitId = itemUnit.id
				return {
					planId: this.organDetails.id,
					id: this.$fxUtils.createUUID(),
					item: _item,
					itemUnitList: _item.itemUnitList,
					itemUnit,
					mainUnitId,
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
					showCycleInput: true,
					disabledCycleInput: true,
					cycleDay: [],
					arrivalCycle: 24,
					isEdit: false
				}
			})
			this.tableData = tableData
			this.selectedRows = Array.prototype.slice.call(tableData)
			this.clearTableDataMap()
			this.loading = false
			this.fxDataVerification.resetData([])
			this.$nextTick(() => {
				this.$fxUtils.vDoRefFocus(this, 'saveAndAddBtn')
			})
		},
		unitRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`unit-${$index}`}
				value={row.itemUnit.id}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='unit'
				cellText={row.itemUnit.name}
				selectOptionList={row.itemUnitList}
				on-on-change={this.onUnitSelectChange}
			></fx-list-cell-select>
		},
		onUnitSelectChange (item, row) {
			row.itemUnit = item
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
				pointSize='4'
				on-on-change={this.onSupperLimitChange}
			>
			</fx-list-cell-input-number></section>
		},
		supperLimitSelectText (row) {
			let text
			if (row.supperLimitSelect === 0) {
				text = this.supperLimitList[row.supperLimitSelect].label
			} else {
				text = `上限： ${row.supperLimit}`
			}
			return text
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
		onSupperLimitSelectChange (item, row) {
			row.supperLimitSelect = item.id
			if	(item.id === 0) {
				row.supperLimit = 0
			}
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
				pointSize='4'
				on-on-change={this.onLowerLimitChange}
			>
			</fx-list-cell-input-number></section>
		},
		lowerLimitSelectText (row) {
			let text
			if (row.lowerLimitSelect === 0) {
				text = this.lowerLimitList[row.lowerLimitSelect].label
			} else {
				text = `下限： ${row.lowerLimit}`
			}
			return text
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
		onLowerLimitSelectChange (item, row) {
			row.lowerLimitSelect = item.id
			if	(item.id === 0) {
				row.lowerLimit = 0
			}
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
				activeText='必采'
				inactiveText='非必采'
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
				></fx-list-cell-select><fx-list-cell-input-number
					class='long-cell-part'
					ref={`stockCycle-${$index}`}
					vModel={row.stockCycle}
					isEdit={row.isEdit}
					vShow={row.showCycleInput && row.isEdit}
					row={row}
					disabled={row.disabledCycleInput}
					cellText={''}
					integer={true}
					rowIndex={$index}
					columnProp='stockCycle'
					on-on-change={this.onStockCycleChange}
					on-on-input-enter={this.onCycleDaySelectEnter}
					on-on-input-tab={this.onCycleDaySelectEnter}
				>
				</fx-list-cell-input-number><fx-list-cell-select-mulity
					class='long-cell-part'
					ref={`cycleDaySelect-${$index}`}
					vModel={row.cycleDay}
					isEdit={row.isEdit}
					vShow={!row.showCycleInput && row.isEdit}
					row={row}
					selectOptionProp={this.optionProp}
					cellText={''}
					rowIndex={$index}
					columnProp='cycleDaySelect'
					dropdownWidth='180px'
					selectOptionList={this.stockCycleMutipleList}
					on-on-change={this.onCycleDaySelectChange}
					on-on-input-enter={this.onCycleDaySelectEnter}
					on-on-select-tab={this.onCycleDaySelectEnter}
				>
				</fx-list-cell-select-mulity>
			</section>
		},
		fpBeforeRowEdit (row) {
			if (row.cycleWay === 2) {
				this.stockCycleMutipleList = this.weekList
			}
			if (row.cycleWay === 3) {
				this.stockCycleMutipleList = this.daysList(31)
			}
			return Promise.resolve()
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
		onCellClick (type) {
			return (row) => {
				this.$refs.detailsTable.setRowEdit(row, type)
			}
		},
		fpDeleteDetails (ids) {
			this.tableData = this.tableData.filter(item => {
				return !ids.includes(item.id)
			})
			return Promise.resolve()
		},
		checkDetailsUnSaving () {
			return this.$refs.detailsTable.checkDetailsUnSaving()
		},
		onSettingMulitySave (setting) {
			this.$refs.detailsTable.getSelectRows().then(res => {
				res.forEach(item => {
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
						item.supperLimitSelect = setting.supperLimit ? 1 : 0
						item.supperLimit = setting.supperLimit
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
						item.lowerLimitSelect = setting.lowerLimit ? 1 : 0
						item.lowerLimit = setting.lowerLimit
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
						item.roundingWay = setting.roundingWay
						item.roundingNum = setting.roundingNum
						break
					case 3:
						item.mustFlag = setting.mustFlag
						break
					case 4:
						item.arrivalCycle = setting.arrivalCycle
						break
					case 5:
						item.stockCycle = setting.stockCycle
						if (typeof setting.stockCycle === 'number') {
							item.cycleDay = setting.stockCycle
						} else {
							item.cycleDay = setting.stockCycle.split(',')
						}
						item.cycleWay = setting.cycleWay
						break
					}
				})
				this.$fxMessage.success('保存成功')
			}).catch(() => {})
		},
		onSettingMulityClose () {
			this.$refs.detailsTable.closeMulitySettingPopver()
		},
		onPreStepClick () {
			this.fpPreStep(this.tableData).then(() => {
				this.dialogVisible = false
			})
		},
		onSaveClick () {
			return this.checkDetailsUnSaving().then(() => {
				const details = []
				for	(const item of this.tableData) {
					for (const seller of this.sellInfo[0]) {
						const record = {
							itemId: item.item.id,
							planId: this.organDetails.id,
							unitId: item.itemUnit.id,
							sellerOrgan: seller.id,
							sellerHouse: seller.sellerHouse,
							supperLimit: item.supperLimit,
							lowerLimit: item.lowerLimit,
							mustFlag: item.mustFlag,
							stockWay: this.sellInfo[2],
							roundingWay: item.roundingWay,
							roundingNum: item.roundingNum,
							cycleWay: item.cycleWay,
							stockCycle: item.cycleWay === 5 ? item.stockCycle : item.cycleDay.join(','),
							enableFlag: item.enableFlag,
							arrivalCycle: item.arrivalCycle,
							crossOrgans: this.sellInfo[2] === 2 ? this.sellInfo[1].map(item => {
								return {
									crossHouse: item.crossHouse,
									crossOrgan: item.id,
									isDefault: item.id === this.sellInfo[3] ? 1 : 0
								}
							}) : [],
							memo: ''
						}
						details.push(record)
					}
				}
				const addItemListInfo = this.getAddItemListInfo()
				const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-plan.addMulityDetails', { addItemListInfo, name: this.organDetails.name })
				return this.$fxApi('planStock.addDetailsMulity', this.organDetails.id)({ data: details, logger }).then(res => {
					this.dialogVisible = false
					this.$emit('on-details-refresh', this.tableData)
					return Promise.resolve()
				})
			})
		},
		getAddItemListInfo () {
			const addItemList = []
			const crossOrganNames = this.$fxUtils.getSelectMulityById(this.sellInfo[1].map(item => item.id), this.organList).map(item => item.name).join(',')
			const stockWay = this.sellInfo[2] === 1 ? '直发' : '越库'
			this.tableData.forEach(item => {
				this.sellInfo[0].forEach(seller => {
					const sellerName = this.organList.find(_item => _item.id === seller.id).name
					addItemList.push(
						`卖方机构:${sellerName},品项名称:${item.item.name},订货方式:${stockWay},越库实际供货方:${crossOrganNames}`
					)
				})
			})
			return addItemList.join(';')
		},
		onSaveAndAddClick () {
			this.onSaveClick().then(() => {
				this.addedItem = this.addedItem.concat(this.tableData.map(item => item.item.id))
				this.$emit('step3ToStep2', this.addedItem)
			})
		},
		step3ToStep2 () {
			const ids = []
			this.tableData.forEach(item => {
				ids.push(item.item.id)
				item.isEdit = false
				this.tableDataMap.set(item.item.id, item)
			})
			this.$emit('deleteDetails', ids)
			this.$emit('step3ToStep2')
		},
		clearTableDataMap () {
			return this.tableDataMap.clear()
		},
		// 生成1~i的， label和name均为i的对象数组，用于每月的天数选择
		daysList (i) {
			const list = [...Array(i).keys()].map(item => {
				return {
					label: item + 1,
					id: item + 1
				}
			})
			list.push({
				label: '月末最后一天',
				id: 32
			})
			return list
		},
		hide () {
			this.dialogVisible = false
		},
		fpGetDetailsMainId () {
			return new Promise(resolve => {
				if (this.organDetails.id) {
					resolve(this.organDetails.id)
				} else {
					this.fSavePlan().then(res => {
						resolve(res.id)
					})
				}
			})
		},
		verificationDetails () {
			return this.fxDataVerification.checkComfirm(this.tableData)
		},
		onBeforeClose (close) {
			this.clearTableDataMap()
			this.verificationDetails().then(close)
		},
		refresh () {
			this.tableData = []
			this.stockCycleMutipleList = []
			this.addedItem = []
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.create-organ {
	flex: 1
	width: 100%
	height: 700px
	display: flex;
	flex-direction: row;
	overflow: auto;
	.tree-container {
		margin-top:21px
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
		width 75px
		display inline-block
	}
}
.dialogTitle {
	font-size 15px
	font-weight 700
	margin-right 10px
}
.half-long{
	width 49%
	display inline-block
}
>>>.el-table__fixed::before {
	background-color unset
}

</style>
