<template>
	<w-collapse v-model="collapseVisible" contentHeight="480px" :fullScreen="isFullScreen" disabled :showArrow="false" title="采购询定价单明细">
		<fx-details-table
			ref="detailsTable"
			v-fx-tab:loop.stock-sale-manage_stock-inquiry-order_details.detailsInfo
			:disabled="disabled"
			:tableColumn="computedColumn"
			:tableValiDate="tableValiDate"
			:tableData="tableDetails"
			:tableEditColumnProp="tableEditColumnProp"
			:mainId="organDetails.id"
			:showFullScreenBtn="!isFullScreen"
			:fpSaveMain="fSaveMain"
			:fpBeforeRowEdit="beforeRowEdit"
			:fpOnRowEdit="fpOnRowEdit"
			:fpInitAddDetailsData="fpInitAddDetailsData"
			:fpSaveDetails="fpSaveDetails"
			:fpDeleteDetails="fpDeleteDetails"
			:selectedRows="selectedRows"
			:canAdd="authCanAdd"
			showSummary
			:defaultSortParam="defaultSortParam"
			:showDeleteBtn="showDeleteBtn"
			:deleteDisabled="deleteDisabled"
			@on-details-refresh="onDetailsRefresh"
			@on-add-mulity="onAddMulity"
			@on-full-screen-click="onFullScreenClick"
		>
			<settingMulity
				slot="setting-mulity"
				slot-scope="{ visible }"
				:visible="visible"
				:organDetails="organDetails"
				:sellerSelectList="sellerSelectList"
				@on-save-click="onSettingMulitySave"
				@on-cancel-click="onSettingMulityClose"
			></settingMulity>
			<w-link
				slot="btn-tools-left-right"
				v-fx-auth:stock-sale-manage_stock-inquiry-order.copy-item-inquiry
				:disabled="disabled"
				icon="copy-mulity"
				@click="copyItemClick"
			>复制品项</w-link>
		</fx-details-table>
		<addMulity
			ref="addMulity"
			:organDetails="organDetails"
			:sellerSelectList="sellerSelectList"
			@on-details-refresh="onDetailsRefresh"
		></addMulity>
	</w-collapse>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import settingMulity from './SettingMulity.vue'
import addMulity from '../add-mulity-details/AddMulity.vue'
import { apiName } from '../../Index.vue'
const EDIT_INPUT_TYPE = ['code', 'unit', 'taxPrice', 'taxRate', 'price', 'otherOrgan']
const REQUIRE_CHANGE_COLUMN = ['code', 'item.assistUnit']
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
		sellerSelectList: {
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
			testa: false,
			collapseVisible: true,
			tableColumn: [
				{
					prop: 'code',
					label: '品项编号',
					width: '170px',
					required: true,
					editColumn: true,
					sortable: true,
					sortKey: 'item.code',
					fxRender: this.codeRender,
					click: this.onCellClick('code')
				},
				{ prop: 'item.name', label: '品项名称', required: true, sortable: true, width: '170px' },
				{ prop: 'item.spec', label: '规格', width: '170px' },
				{
					prop: 'unit',
					label: '单位',
					width: '170px',
					required: true,
					editColumn: true,
					fxRender: this.unitRender,
					click: this.onCellClick('unit')
				},
				{
					prop: 'taxPrice',
					label: '含税单价',
					width: '120px',
					editColumn: (row) => {
						return !row.giftFlag && !this.disabled
					},
					sortable: true,
					fxRender: this.taxPriceRender,
					click: this.onCellClick('taxPrice')
				},
				{
					prop: 'taxRate',
					label: '税率',
					width: '100px',
					editColumn: (row) => {
						return !row.giftFlag && this.organDetails.organ.taxPlayerFlag === 1 && !this.disabled
					},
					fxRender: this.taxRender,
					click: this.onCellClick('taxRate')
				},
				{
					prop: 'price',
					label: '非税单价',
					width: '120px',
					editColumn: (row) => {
						return !row.giftFlag && !this.disabled
					},
					sortable: true,
					fxRender: this.priceRender,
					click: this.onCellClick('price')
				},
				{ prop: 'item.assistUnit', label: '辅助单位', width: '170px' },
				{
					prop: 'otherOrgan',
					label: '卖方机构',
					width: '150px',
					editColumn: true,
					sortable: true,
					fxRender: this.otherOrganRender,
					click: this.onCellClick('otherOrgan')
				},
				{
					prop: 'isUnique',
					label: '是否唯一',
					width: '120px',
					editColumn: true,
					renderHeader: this.renderIsUniqueHeader,
					fxRender: this.isUniqueRender,
					click: this.onCellClick('isUnique')
				}
			],
			tableValiDate: [{
				columnProp: 'code',
				rule: (row, success, error) => {
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
				columnProp: 'otherOrgan',
				rule (row, success, error) {
					if (!row.otherOrgan.id) {
						error('卖方机构不能为空')
					} else {
						success()
					}
				}
			}],
			fxCalculation: this.$fxCalculation('stockInquiryOrder'),
			itemList: [],
			selectOptionProp: {
				name: 'code',
				disabled: 'disabled',
				visibleFlag: 'visibleFlag'
			},
			filterKeys: ['name', 'code', 'pinYin', 'spec', 'itemUnitList.barcode'],
			selectedRows: [],
			fxCache: this.$fxUtils.fxCache('stock-inquiry-order'),
			itemUnitList: [],
			otherOrganSelectList: [],
			unitSelectLoading: false,
			codeSelectLoading: false
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize,
			sysPointSize: state => state.system.sysPointSize,
			sysPricePointSize: state => state.system.sysPricePointSize,
			taxesList: state => state.system.taxesList
		}),
		...mapGetters(['getSysParams', 'detailsAuthGetter']),
		computedColumn () {
			return this.tableColumn
		},
		assignState () {
			return (val, key) => {
				return this.$fxStateMiddleware.getStateObj('assignState')(val)[key]
			}
		},
		tableEditColumnProp () {
			return EDIT_INPUT_TYPE
		},
		defaultSortParam () {
			return this.getSysParams('SJXZL_STOCKPLAN_ITEM_ORDER', 'value')
		},
		authCanAdd () {
			return this.detailsAuthGetter('stock-sale-manage_stock-inquiry-order.add-stock-inquiry')
		},
		showDeleteBtn () {
			return this.detailsAuthGetter('stock-sale-manage_stock-inquiry-order.delete-stock-inquiry')
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
		optionRender (h, { item }) {
			h = this.$createElement
			return <div class="fx-common__cell-select__option fx-ellipsis">
				<span class="fx-common__cell-select__option-left fx-ellipsis" title={item.code}>{ item.code }</span>
				<span class="fx-common__cell-select__option-right fx-ellipsis" title={item.name}>{ item.name }</span>
			</div>
		},
		getItemList (extraItemId = '') {
			const params = {
				itemId: extraItemId
			}
			const key = `itemList.${this.organDetails.id}.${extraItemId}`
			return this.fxCache.cacher(key, this.$fxApi(`${apiName}.getItemList`, this.organDetails.id, false)({ data: params }))
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
				selectOptionList={this.itemList}
				loading={this.codeSelectLoading}
				asyncChange={this.onCodeSelectChange}
				asyncClick={this.onCodeSelectClick}
				on-on-select-enter={this.onCodeSelectEnter}
				on-on-select-tab={this.onCodeSelectTab}
				fpSelectShow={this.onCodeSelectShow(row)}
			></fx-list-cell-select>
		},
		onCodeSelectChange (item, row) {
			return new Promise(resolve => {
				row.item = item
				return this.getUnitList(item.id).then(res => {
					this.itemUnitList = res
					row.itemUnit = res[0]
					return Promise.resolve()
				}).then(() => {
					this.fxCalculation.changeInquiryUnit(row, this.itemUnitList[0])
					if (this.itemUnitList.length === 1) {
						this.$refs.detailsTable.setListCellFocus('taxPrice')
					} else {
						this.$refs.detailsTable.setListCellFocus('unit')
					}
					resolve()
				})
			})
		},
		onCodeSelectClick (item, row, $index, unchangedFlag) {
			return new Promise(resolve => {
				if (unchangedFlag) {
					this.getUnitList(item.id).then(res => {
						if (res.length === 1) {
							this.$refs.detailsTable.setListCellFocus('taxPrice')
						} else {
							resolve()
						}
					})
				}
			})
		},
		onCodeSelectEnter (row, $index, item, unchangedFlag) {
			if (unchangedFlag) {
				this.getUnitList(item.id).then(res => {
					if (res.length === 1) {
						this.$refs.detailsTable.setListCellFocus('taxPrice')
					} else {
						this.$refs.detailsTable.setListCellFocus('unit')
					}
				})
			}
		},
		onCodeSelectTab (row, $index) {
			this.$refs.detailsTable.setListCellFocus('unit')
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
				vOn:on-change={this.onUnitSelectChange}
				fpSelectShow={this.onUnitSelectShow(row)}
			></fx-list-cell-select>
		},
		onUnitSelectChange (item, row) {
			this.fxCalculation.changeInquiryUnit(row, item)
		},
		onUnitSelectShow (row) {
			return () => {
				return new Promise(resolve => {
					this.unitSelectLoading = true
					if (row.item.id) {
						this.getUnitList(row.item.id, row.itemUnit.id).then(res => {
							this.unitSelectLoading = false
							this.itemUnitList = res
							resolve()
						})
					} else {
						this.$fxMessage.warning('请先选择品项')
					}
				})
			}
		},
		getUnitList (itemId, itemUnitId = '') {
			const key = `unitList.${itemId}`
			const data = itemUnitId ? { itemUnitId } : {}
			return this.fxCache.cacher(key, this.$fxApi(`${apiName}.getItemUnitList`, this.organDetails.id, itemId)({ data }))
		},
		taxPriceRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`taxPrice-${$index}`}
				vModel={row.taxPrice}
				isEdit={row.isEdit && this.tableEditColumnProp.includes('taxPrice')}
				row={row}
				rowIndex={$index}
				columnProp='taxPrice'
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.taxPrice, this.sysPricePointSize)}
				pointSize={this.sysPricePointSize}
				disabled={!!row.giftFlag}
				vOn:on-change={this.onTaxPriceChange}
			>
			</fx-list-cell-input-number>
		},
		onTaxPriceChange (val, row) {
			this.fxCalculation.compInquiryPriceWithTaxes(row)
		},
		taxRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`taxRate-${$index}`}
				vModel={row.taxRate}
				isEdit={row.isEdit && this.tableEditColumnProp.includes('taxRate')}
				row={row}
				rowIndex={$index}
				columnProp='taxRate'
				selectOptionList={this.taxesList}
				disabled={this.organDetails.organ.taxPlayerFlag !== 1 || !!row.giftFlag}
				vOn:on-change={this.onTaxSelectChange}
			></fx-list-cell-select>
		},
		onTaxSelectChange (item, row) {
			this.fxCalculation.compInquiryPriceWithTaxes(row)
		},
		priceRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`price-${$index}`}
				vModel={row.price}
				isEdit={row.isEdit && this.tableEditColumnProp.includes('price')}
				row={row}
				rowIndex={$index}
				columnProp='price'
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.price, this.sysPricePointSize)}
				pointSize={this.sysPricePointSize}
				disabled={!!row.giftFlag}
				vOn:on-change={this.onPriceChange}
			>
			</fx-list-cell-input-number>
		},
		onPriceChange (val, row) {
			this.fxCalculation.changeInquiryPrice(row)
		},
		otherOrganRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select-tab
				ref={`otherOrgan-${$index}`}
				value={row.otherOrgan.id}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='otherOrgan'
				cellText={row.otherOrgan.name}
				selectOptionList={this.sellerSelectList}
				on-on-change={this.onOtherOrganSelectChange}
			></fx-list-cell-select-tab>
		},
		onOtherOrganSelectChange (item, row) {
			row.otherOrgan = item
		},
		getOtherOrganSelectList (inOrganId = '', inHouseId = '', outHouseId = '') {
			const ids = [inOrganId]
			const houseIds = []
			inHouseId && houseIds.push(inHouseId)
			outHouseId && houseIds.push(outHouseId)
			const key = `inOrganList.${this.organDetails.id}.${inOrganId}.${inHouseId}.${outHouseId}`
			return this.fxCache.cacher(key, this.$fxApi(`${apiName}.getInOrganSelectList`)({ data: { ids, houseIds } }))
		},
		renderIsUniqueHeader (h, column, index) {
			const content = '多条相同品项时仅可设置一条品项为唯一'
			h = this.$createElement
			return <div>是否唯一
				<el-popover
					placement="top-start"
					trigger="hover"
					content={content}>
					<w-icon slot="reference" type="exclamation-mark-active" class="mark-icon"></w-icon>
				</el-popover>
			</div>
		},
		isUniqueRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-switch
				ref={`isUnique-${$index}`}
				vModel={row.isUnique}
				isEdit={row.isEdit}
				activeText='是'
				inactiveText='否'
				row={row}
				rowIndex={$index}
				columnProp='isUnique'
				on-on-change={this.onIsUniqueChange}
			></fx-list-cell-switch>
		},
		onIsUniqueChange (val, row) {
			if (val) {
				const isUniqueRow = this.tableDetails.find(detail => {
					return detail.id !== row.id && detail.item.id === row.item.id && detail.isUnique === 1
				})
				const origin = this.$fxUtils.deepClone(isUniqueRow)
				if (isUniqueRow) {
					isUniqueRow.isUnique = 0
					this.saveDetail(isUniqueRow, origin)
				}
			}
		},
		saveDetail (params, origin) {
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-inquiry-order.updateDetails', this.createLoggerParams(params, origin))
			return this.$fxApi(`${apiName}.saveDetails`, this.organDetails.id)({ data: params, logger }).then(res => {
				return Promise.resolve(res)
			})
		},
		beforeRowEdit (row) {
			this.itemList = this.$fxUtils.isEmptyObj(row.item) ? [] : [row.item]
			this.itemUnitList = this.$fxUtils.isEmptyObj(row.itemUnit) ? [] : [row.itemUnit]
			return Promise.resolve()
		},
		fpOnRowEdit (row, $index, type = 'code') {
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
					item: {},
					itemUnit: {},
					taxPrice: 0,
					taxRate: 0,
					price: 0,
					isUnique: 0,
					otherOrgan: {}
				}
				resolve(data)
			})
		},
		fpSaveDetails (detail, origin) {
			detail.billId = this.organDetails.id
			return this.onSaveDetailsHandler(detail, origin).then(this.tableDetailsRefresh)
		},
		tableDetailsRefresh () {
			return this.$fxApi(`${apiName}.getDetails`, this.organDetails.id).then(res => {
				this.$emit('update:tableDetails', res)
				return Promise.resolve()
			})
		},
		onSaveDetailsHandler (params, origin) {
			if (params.id) {
				const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-inquiry-order.updateDetails', this.createLoggerParams(params, origin))
				return this.$fxApi(`${apiName}.saveDetails`, params.billId)({ data: params, logger }).then(res => {
					return Promise.resolve(res)
				})
			} else {
				const addItemInfo = this.getAddItemInfo(params)
				const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-inquiry-order.addDetails', { orderData: this.organDetails, addItemInfo })
				return this.$fxApi(`${apiName}.addDetails`, params.billId)({ data: params, logger }).then(res => {
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
			const itemUnit = params.itemUnit.name
			return `品项名称:${name},单位:${itemUnit}`
		},
		fpDeleteDetails (ids) {
			const deleteItemInfo = this.getDeleteItemInfo(ids)
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-inquiry-order.deleteDetails', { deleteItemInfo, orderData: this.organDetails })
			return this.$fxApi(`${apiName}.delDetailMulity`, this.organDetails.id)({ data: ids, logger }).then(res => {
				return Promise.resolve(res)
			})
		},
		getDeleteItemInfo (ids) {
			return this.tableDetails.filter(item => {
				return ids.includes(item.id)
			}).map(item => {
				const name = item.item.name
				const itemUnit = item.itemUnit.name
				return `品项名称:${name},单位:${itemUnit}`
			}).join(';')
		},
		onDetailsRefresh (selectedRows) {
			if (this.$fxUtils.isDef(selectedRows) && Array.isArray(selectedRows)) {
				this.selectedRows = selectedRows
			}
			this.$emit('on-details-refresh')
		},
		onAddMulity () {
			this.$refs.addMulity.open()
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
				let params = null
				if (setting.type === 1) {
					params = {
						ids,
						otherOrganId: setting.otherOrganId
					}
					settingInfo = `卖方机构:${setting.otherOrgan.name}`
				} else if (setting.type === 2) {
					params = {
						ids,
						taxPrice: setting.taxPrice
					}
					settingInfo = `含税单价:${setting.taxPrice}`
				} else if (setting.type === 3) {
					params = {
						ids,
						taxRate: setting.taxRate
					}
					settingInfo = `税率:${setting.taxRate}`
				} else if (setting.type === 4) {
					params = {
						ids,
						price: setting.price
					}
					settingInfo = `非税单价:${setting.price}`
				}
				const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-inquiry-order.settingMulityDetails', { settingInfo, orderData: this.organDetails, itemNames })
				this.$fxApi(`${apiName}.settingMulity`, this.organDetails.id)({ data: params, logger }).then(this.onDetailsRefresh)
			})
		},
		onSettingMulityClose () {
			this.$refs.detailsTable.closeMulitySettingPopver()
		},
		copyItemClick  () {
			this.checkDetailsUnSaving().then(() => {
				this.$refs.detailsTable.getSelectRows().then(res => {
					this.copyItemHandler(res)
				})
			})
		},
		copyItemHandler (selectRows) {
			if (selectRows.length === 0) {
				this.$fxMessage.warning('请选择复制品项')
				return false
			}
			const params = selectRows.map(item => {
				return {
					billId: this.organDetails.id,
					otherOrgan: item.otherOrgan,
					item: item.item,
					itemUnit: item.itemUnit,
					taxPrice: 0,
					taxRate: 0,
					price: 0,
					isUnique: 0
				}
			})
			const addItemListInfo = this.getAddItemListInfo(selectRows)
			const logger = this.$fxLogger.createInfo('stock-sale-manage.stock-inquiry-order.copyItem', { orderData: this.organDetails, addItemListInfo })
			return this.$fxApi(`${apiName}.addDetailsMulity`, this.organDetails.id, params)({ logger }).then(res => {
				this.onDetailsRefresh(res)
				return Promise.resolve()
			})
		},
		getAddItemListInfo (selectRows) {
			const names = selectRows.map(item => item.item.name).join(',')
			return `品项名称:${names}`
		},
		onFullScreenClick (flag) {
			this.$emit('update:isFullScreen', flag)
		},
		// onMistakeCheckClick () {
		// 	this.$emit('on-mistake-check')
		// },
		clear () {
			this.$refs.detailsTable.clear()
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
.cell-input {
	>>>.form-item-input {
		width 100%
	}
}
.mark-icon {
	width:16px
	height: 16px
	position: relative
	top: 4px
	left: 5px
}
</style>
