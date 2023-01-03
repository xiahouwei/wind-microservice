<template>
	<w-collapse v-model="collapseVisible" contentHeight="400px" :fullScreen="isFullScreen" disabled :showArrow="false" title="方案明细">
		<fx-details-table
			ref="detailsTable"
			v-fx-tab:loop.basic-archives_quick-out-plan_details.detailsInfo
			:disabled="disabled"
			:deleteDisabled="delDisabled"
			:canAdd="canAdd"
			:tableColumn="tableColumn"
			:tableValiDate="tableValiDate"
			:tableData="tableDetails"
			:tableEditColumnProp="tableEditColumnProp"
			:mainId="organDetails.id"
			:showFullScreenBtn="!isFullScreen"
			:fpSaveMain="fSaveMain"
			:fpBeforeRowEdit="beforeRowEdit"
			:fpInitAddDetailsData="fpInitAddDetailsData"
			:fpSaveDetails="fpSaveDetails"
			:fpDeleteDetails="fpDeleteDetails"
			:fpOnRowEdit="fpOnRowEdit"
			:canAddMulity="false"
			@on-details-refresh="onDetailsRefresh"
			@on-full-screen-click="onFullScreenClick"
		>
			<settingMulity
				slot="setting-mulity"
				slot-scope="{ visible }"
				:visible="visible"
				@on-save-click="onSettingMulitySave"
				@on-cancel-click="onSettingMulityClose"
			></settingMulity>
		</fx-details-table>
	</w-collapse>
</template>
<script>
import settingMulity from './SettingMulity.vue'
import { apiName } from '../../Index.vue'
const EDIT_INPUT_TYPE = ['code', 'inOrgan', 'inHouse', 'outWay', 'outHouse', 'memo']
export default {
	name: 'detailsInfo',
	components: {
		settingMulity
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
		fSaveMain: Function,
		disabled: Boolean,
		delDisabled: Boolean,
		canAdd: Boolean
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
					fxRender: this.codeRender,
					click: this.onCellClick('code')
				},
				{ prop: 'item.name', label: '品项名称', width: '100px' },
				{ prop: 'item.spec', label: '规格', width: '100px' },
				{
					prop: 'inOrgan',
					label: '入库机构',
					width: '150px',
					required: true,
					editColumn: true,
					fxRender: this.inOrganRender,
					click: this.onCellClick('inOrgan')
				},
				{
					prop: 'inHouse',
					label: '入库仓库',
					width: '150px',
					required: true,
					editColumn: true,
					fxRender: this.inHouseRender,
					click: this.onCellClick('inHouse')
				},
				{
					prop: 'outWay',
					label: '出库方式',
					required: true,
					editColumn: true,
					fxRender: this.outWayRender,
					click: this.onCellClick('outWay')
				},
				{
					prop: 'outHouse',
					label: '耗用仓库',
					width: '150px',
					required: true,
					editColumn: (row) => {
						return row.outWay === 1 && !this.disabled
					},
					fxRender: this.outHouseRender,
					click: this.onCellClick('outHouse')
				},
				{
					prop: 'memo',
					label: '明细备注',
					width: '300px',
					editColumn: true,
					fxRender: this.memoRender,
					click: this.onCellClick('memo')
				}
			],
			tableEditColumnProp: EDIT_INPUT_TYPE,
			tableValiDate: [{
				columnProp: 'code',
				rule: (row, success, error) => {
					const repeat = this.tableDetails.find(item => item.inHouse.id === row.inHouse.id && item.item.id === row.item.id && item.id !== row.id)
					if (repeat) {
						error('同一入库仓库下品项不能重复添加')
					} else {
						success()
					}
				}
			}, {
				columnProp: 'inOrgan',
				rule (row, success, error) {
					if (!row.inOrgan.id) {
						error('入库机构不能为空')
					} else {
						success()
					}
				}
			}, {
				columnProp: 'inHouse',
				rule (row, success, error) {
					if (!row.inHouse.id) {
						error('入库仓库不能为空')
					} else {
						success()
					}
				}
			}, {
				columnProp: 'outHouse',
				rule (row, success, error) {
					if (row.outWay === 1 && !row.outHouse.id) {
						error('耗用仓库不能为空')
					} else {
						success()
					}
				}
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
			filterKeys: ['name', 'code', 'pinYin', 'spec', 'itemUnitList.barcode'],
			fxCache: this.$fxUtils.fxCache('quick-out-plan'),
			outWaySelectList: this.$fxTypeMiddleware.getCommonTypeList('outWayType'),
			editRowItemList: [],
			codeSelectLoading: false,
			inOrganSelectList: [],
			houseSelectList: [],
			inHouseSelectList: [],
			inHouseSelectLoading: false,
			outHouseSelectList: [],
			outHouseSelectLoading: false
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
				cellText={row.item.code}
				optionRender={this.optionRender}
				loading={this.codeSelectLoading}
				selectOptionProp={this.selectOptionProp}
				selectOptionList={this.editRowItemList}
				filterKeys={this.filterKeys}
				on-on-change={this.onCodeSelectChange}
				fpSelectShow={this.onCodeSelectShow(row)}
			></fx-list-cell-select>
		},
		onCodeSelectChange (item, row) {
			row.item = item
		},
		onCodeSelectShow (row) {
			return () => {
				return new Promise(resolve => {
					this.codeSelectLoading = true
					this.getEditItemList(row.item.id).then(res => {
						this.editRowItemList = res
						this.codeSelectLoading = false
						resolve()
					})
				})
			}
		},
		getEditItemList (itemId = '') {
			const key = `itemList.${this.organDetails.id}.${itemId}`
			return this.fxCache.cacher(key, this.$fxApi(`${apiName}.getItemList`)({ data: [itemId] }))
		},
		inOrganRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select-tab
				ref={`inOrgan-${$index}`}
				value={row.inOrgan.id}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='inOrgan'
				cellText={row.inOrgan.name}
				selectOptionList={this.inOrganSelectList}
				on-on-change={this.onInOrganSelectChange}
			></fx-list-cell-select-tab>
		},
		onInOrganSelectChange (item, row) {
			row.inOrgan = item
			row.inHouse = {}
			row.outHouse = {}
			this.houseSelectList = item.store || []
		},
		getInOrganSelectList (inOrganId = '', inHouseId = '', outHouseId = '') {
			const ids = [inOrganId]
			const houseIds = []
			inHouseId && houseIds.push(inHouseId)
			outHouseId && houseIds.push(outHouseId)
			const key = `inOrganList.${this.organDetails.id}.${inOrganId}.${inHouseId}.${outHouseId}`
			return this.fxCache.cacher(key, this.$fxApi(`${apiName}.getInOrganSelectList`)({ data: { ids, houseIds } }))
		},
		inHouseRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`inHouse-${$index}`}
				value={row.inHouse.id}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='inHouse'
				cellText={row.inHouse.name}
				loading={this.inHouseSelectLoading}
				selectOptionList={this.inHouseSelectList}
				on-on-change={this.onInHouseSelectChange}
				fpSelectShow={this.onInHouseSelectShow(row)}
			></fx-list-cell-select>
		},
		onInHouseSelectChange (item, row) {
			row.inHouse = item
		},
		onInHouseSelectShow (row) {
			return () => {
				this.inHouseSelectLoading = true
				this.inHouseSelectList = this.houseSelectList.filter(item => {
					return item.id !== row.outHouse.id
				})
				this.inHouseSelectLoading = false
				return Promise.resolve()
			}
		},
		outWayRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`outWay-${$index}`}
				vModel={row.outWay}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='outWay'
				cellText={this.$fxTypeMiddleware.getCommonTypeItemById('outWayType')(row.outWay).label}
				selectOptionProp={this.optionProp}
				selectOptionList={this.outWaySelectList}
				asyncClick={this.onOutWaySelectClick}
				on-on-change={this.onOutWaySelectChange}
				on-on-select-tab={this.onOutWaySelectTab}
				on-on-select-enter={this.onOutWaySelectTab}
			></fx-list-cell-select>
		},
		onOutWaySelectClick (item, row, $index, unchangedFlag) {
			return new Promise(resolve => {
				if (row.outWay === 0) {
					this.$refs.detailsTable.setListCellFocus('memo')
				} else {
					resolve()
				}
			})
		},
		onOutWaySelectChange (item, row) {
			row.outHouse = {}
		},
		onOutWaySelectTab (row, $index) {
			if (row.outWay === 0) {
				this.$refs.detailsTable.setListCellFocus('memo')
			} else {
				this.$nextTick(() => {
					this.$refs.detailsTable.setListCellFocus('outHouse')
				})
			}
		},
		outHouseRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`outHouse-${$index}`}
				value={row.outHouse.id}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='outHouse'
				disabled={row.outWay === 0}
				cellText={row.outHouse.name}
				loading={this.outHouseSelectLoading}
				selectOptionList={this.outHouseSelectList}
				on-on-change={this.onOutHouseSelectChange}
				fpSelectShow={this.onOutHouseSelectShow(row)}
			></fx-list-cell-select>
		},
		onOutHouseSelectChange (item, row) {
			row.outHouse = item
		},
		onOutHouseSelectShow (row) {
			return () => {
				this.outHouseSelectLoading = true
				this.outHouseSelectList = this.houseSelectList.filter(item => {
					return item.id !== row.inHouse.id
				})
				this.outHouseSelectLoading = false
				return Promise.resolve()
			}
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
		beforeRowEdit (row) {
			return new Promise(resolve => {
				this.getInOrganSelectList(row.inOrgan.id, row.inHouse.id, row.outHouse.id).then(res => {
					this.editRowItemList = [row.item]
					this.inOrganSelectList = res
					this.houseSelectList = this.$fxUtils.getSelectTagById(row.inOrgan.id, res).store || []
					this.inHouseSelectList = [row.inHouse]
					this.outHouseSelectList = [row.outHouse]
					resolve()
				})
			})
		},
		onCellClick (type) {
			return (row) => {
				this.$refs.detailsTable.setRowEdit(row, type)
			}
		},
		fpOnRowEdit (row, index, type = 'code') {
			return new Promise(resolve => {
				if (type === 'outHouse' && row.outWay === 0) {
					this.$refs.detailsTable.setListCellFocus('outWay')
				} else {
					this.$refs.detailsTable.setListCellFocus(type)
				}
				resolve()
			})
		},
		onFullScreenClick (flag) {
			this.$emit('update:isFullScreen', flag)
		},
		fpInitAddDetailsData () {
			return new Promise(resolve => {
				this.getInOrganSelectList().then(res => {
					this.inOrganSelectList = res
					resolve({
						planId: this.organDetails.id,
						item: {},
						inOrgan: {},
						inHouse: {},
						outHouse: {},
						outWay: 0,
						memo: ''
					})
				})
			})
		},
		fpSaveDetails (detail, origin) {
			return this.onSaveDetailsHandler(detail, origin)
		},
		onSaveDetailsHandler (params, origin) {
			if (params.id) {
				const logger = this.$fxLogger.createInfo('basic-archives.quick-out-plan.updateDetails', { name: this.organDetails.name, cur: params, pre: origin, itemName: params.item.name })
				return this.$fxApi(`${apiName}.saveDetails`, this.organDetails.id, params)({ logger }).then(res => {
					return Promise.resolve(res)
				})
			} else {
				const logger = this.$fxLogger.createInfo('basic-archives.quick-out-plan.addDetails', { name: this.organDetails.name, details: params })
				return this.$fxApi(`${apiName}.addDetails`, this.organDetails.id, params)({ logger }).then(res => {
					return Promise.resolve(res)
				})
			}
		},
		fpDeleteDetails (ids) {
			const select = this.tableDetails.filter(item => {
				return ids.includes(item.id)
			})
			const logger = this.$fxLogger.createInfo('basic-archives.quick-out-plan.deleteDetails', { name: this.organDetails.name, select })
			return this.$fxApi(`${apiName}.delDetail`, this.organDetails.id)({ data: ids, logger }).then(res => {
				return Promise.resolve(res)
			})
		},
		onDetailsRefresh () {
			this.$emit('on-details-refresh')
		},
		checkDetailsUnSaving () {
			return this.$refs.detailsTable.checkDetailsUnSaving()
		},
		onSettingMulitySave (setting) {
			this.$refs.detailsTable.getSelectRows().then(res => {
				const ids = res.map(item => {
					return item.id
				})
				const params = {
					batchSetColum: 'memo',
					ids,
					memo: setting.memo,
					planId: this.organDetails.id
				}
				const logger = this.$fxLogger.createInfo('basic-archives.quick-out-plan.settingMulityDetails', { name: this.organDetails.name, select: res, params })
				this.$fxApi(`${apiName}.settingMulityDetails`, this.organDetails.id)({ data: params, logger }).then(this.onDetailsRefresh)
			})
		},
		onSettingMulityClose () {
			this.$refs.detailsTable.closeMulitySettingPopver()
		},
		clear () {
			this.$refs.detailsTable.clear()
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
.cell-input-memo {
	>>>.form-item-input {
		width 100%
	}
}
</style>
