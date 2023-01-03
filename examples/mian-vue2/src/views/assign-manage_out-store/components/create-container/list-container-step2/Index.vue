<template>
	<div class="organ-manage-container">
		<filterBar ref="filterBar" :step2ids='step2ids' @on-search="refresh"></filterBar>
		<w-app-container direction="row" class="app-container">
			<w-index-list
				:listData="indexListData"
				:formatter="formatter"
				:activeIds='$refs.filterBar && $refs.filterBar.item'
				class="index-list"
				@on-list-click="onListClick"
			></w-index-list>
			<fx-details-table
				ref="detailsTable"
				:tableColumn="currentTableColumn"
				:fpOnRowEdit="fpOnRowEdit"
				:tableData="listData"
				:collectionCellRender="collectionCellRender"
				:tableEditColumnProp="tableEditColumnProp"
				:fullScreenBtn='false'
				:showColumnFilterBtn='false'
				:showDeleteBtn='false'
				:canAdd='false'
				:tableSearchInput='false'
				:collectionValiDate='collectionValiDate'
				:tableValiDate="tableValiDate"
				:fpBeforeRowEdit="beforeRowEdit"
			>
				<div slot="btn-tools-left" class="tools-left">
					<el-button v-fx-auth:stock-sale-manage_assign-manage_out-store.assign-outstore class="order-btn" type="primary" plain @click="onAssign">分派</el-button>
					<el-button v-fx-auth:stock-sale-manage_assign-manage_out-store.giveup-outstore class="order-btn" type="danger" plain @click="onGiveup">放弃</el-button>
					<el-button v-fx-auth:stock-sale-manage_assign-manage_out-store.show-giveup class="order-btn" type="primary" plain @click="onShowGiveup">查看放弃</el-button>
					<el-button class="order-btn" type="danger" plain @click="onRefreshStock">刷新账存</el-button>
					<el-button class="order-btn" type="primary" plain @click="onSave">保存</el-button>
					<el-button class="order-btn" type="primary" plain @click="onLastStep">上一步</el-button>
				</div>
			</fx-details-table>
		</w-app-container>
		<giveUp ref='giveUp' @refresh='refresh'></giveUp>
		<handleGiveUp
			ref='handleGiveUp'
			:listData="listData"
			@refresh='refresh'
		></handleGiveUp>
	</div>
</template>
<script>
import { mapState } from 'vuex'
import { apiName } from '../Index.vue'
import filterBar from './FilterBar.vue'
import giveUp from '../list-container-step1/give-up/Index.vue'
import handleGiveUp from './handleGiveUp/Index.vue'
export default {
	name: 'listContainer',
	components: {
		filterBar,
		giveUp,
		handleGiveUp
	},
	props: {
		step2ids: Array
	},
	data () {
		return {
			tableColumnLeft: [
				{ prop: 'otherOrganName', label: '买方机构' },
				{ prop: 'defaultInHouseName', label: '买方仓库' },
				{
					prop: 'stockWay',
					label: '订货方式',
					editColumn: this.editStockWay,
					fxRender: this.stockWayRender,
					click: this.onCellClick('stockWay')
				},
				{
					prop: 'expectArrivalDate',
					label: '期望到货时间',
					formatter: (row) => {
						return this.$fxUtils.formatterDateTime(row.expectArrivalDate)
					},
					width: 140
				},
				{
					prop: 'amount',
					label: '订货数量',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.amount, this.sysPointSize)
					}
				},
				{
					prop: 'thisAmount',
					label: '本次出库数量',
					editColumn: true,
					fxRender: this.thisAmountRender,
					click: this.onCellClick('thisAmount')
				},
				{
					prop: 'crossOrganName',
					label: '实际供货方',
					editColumn: this.editCross,
					fxRender: this.crossOrganRender,
					click: this.onCellClick('crossOrganName')
				},
				{
					type: 'arrow',
					prop: 'arrow',
					label: '更多',
					headerClick: this.arrowHeaderClick
				}
			],
			hideColumn: [
				{
					prop: 'waitOutAmount',
					label: '待出库数量',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.waitOutAmount, this.sysPointSize)
					},
					renderHeader: this.leftRenderHeader
				},
				{
					prop: 'outGiveUpAmount',
					label: '已放弃出库数量',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.outGiveUpAmount, this.sysPointSize)
					}
				},
				{
					prop: 'assistUnitAmount',
					label: '本次出库辅助数量',
					editColumn: (row) => {
						return !!row.collectionData.assistUnit
					},
					required: true,
					fxRender: this.inAssistUnitAmountRender,
					renderHeader: this.rightRenderHeader,
					width: 140,
					click: this.onCellClick('assistUnitAmount')
				}
			],
			tableColumnRight: [
				{ prop: 'sysBillCode', label: '系统单号', width: 200 },
				{ prop: 'memo', label: '明细备注', width: 200 }
			],
			listData: [],
			expandFlag: false,
			collectionData: {},
			stockWayTypeList: this.$fxTypeMiddleware.getCommonTypeList('stockWay'),
			selectOptionProp: {
				value: 'label',
				disabled: 'disabled',
				visibleFlag: 'visibleFlag'
			},
			supplierList: [],
			collectionValiDate: [{
				columnProp: 'collectionAmount',
				rule: (collectionData, collectionRows, success, error) => {
					this.$refs.detailsTable.getSelectRows().then(res => {
						const flag = this.isRepeat(collectionRows, res)
						if (flag === 1) {
							if (!collectionData.defaultOutHouseId) {
								error('卖方仓库不能为空')
							} else {
								success()
							}
						} else {
							success()
						}
					})
				}
			}],
			tableValiDate: [{
				columnProp: 'thisAmount',
				rule: (row, success, error) => {
					this.$refs.detailsTable.getSelectRows(false).then(res => {
						const flag = this.isRepeat([row], res)
						if (flag === 1) {
							if (row.thisAmount === 0) {
								error('出库数量不能为0')
							} else if (this.outAmountGreaterOrder && row.waitOutAmount < row.thisAmount) {
								error('总出库数量不能大于订单数量,最大为' + row.waitOutAmount)
							} else {
								success()
							}
						} else {
							success()
						}
					})
				}
			}, {
				columnProp: 'crossOrganName',
				rule: (row, success, error) => {
					this.$refs.detailsTable.getSelectRows(false).then(res => {
						const flag = this.isRepeat([row], res)
						if (flag === 1) {
							if (row.stockWay === 2 && !row.crossOrgan) {
								error('越库订货方式，必须选择实际供货方')
							} else {
								success()
							}
						} else {
							success()
						}
					})
				}
			}],
			saveDetails: {},
			isCommonTypeByRules: this.$fxTypeMiddleware.isCommonType('saleOrderGenerateType', 'rules'),
			tempOrderid: {
				OutStore: [],
				StockOrder: []
			},
			sysBillCodes: [],
			tableEditColumnProp: ['stockWay', 'thisAmount', 'crossOrganName'],
			indexListData: []
		}
	},
	computed: {
		computedTableColumn () {
			return [...this.tableColumnLeft, ...this.hideColumn, ...this.tableColumnRight]
		},
		currentTableColumn () {
			const _cols = this.$fxUtils.deepClone(this.computedTableColumn)
			const expandIndex = this.tableColumnLeft.length - 1
			if (!this.expandFlag) {
				_cols.splice(expandIndex + 1, this.hideColumn.length)
			} else {
				_cols.splice(expandIndex, 1)
			}
			return _cols
		},
		...mapState({
			sysPointSize: state => state.system.sysPointSize,
			outAmountGreaterOrder: state => state.system.sysParamsConfig.OUT_AMOUNT_GREATER_ORDER_AMOUNT && state.system.sysParamsConfig.OUT_AMOUNT_GREATER_ORDER_AMOUNT.value === 'OUT_GREATER_ORDER_FALSE'
		}),
		showAssistUnit () {
			return (assistUnit) => {
				return !!assistUnit
			}
		},
		showAssistUnitAmount () {
			return (assistUnitAmount) => {
				return !!assistUnitAmount
			}
		}
	},
	methods: {
		refresh (refreshGiveup = false) {
			this.clearSelected()
			return this.getListData(refreshGiveup)
		},
		clearSelected () {
			this.$refs.detailsTable.clearSelected()
		},
		initSelect () {
			this.$refs.filterBar.initSelect()
		},
		resetFilter () {
			this.$refs.filterBar.onResetClick()
		},
		getSearchParams () {
			const params = {
				...this.$refs.filterBar.getFilterParams()
			}
			return {
				...this.$fxCommon.getSearchParams('inStoreAssignItemList')(params)
			}
		},
		async getListData (refreshGiveup, getIndexlist = false) {
			this.clearSelected()
			this.listData = []
			const api = `${apiName}.getLockSummary`
			const logger = this.$fxLogger.createInfo('stock-sale-manage.assign-manage.out-assign.lock', {
				data: this.sysBillCodes.map((sysBillCode, index) => {
					return { sysBillCode, id: this.step2ids[index] }
				})
			})
			return this.$fxApi(api)({ data: this.getSearchParams(), logger }).then(res => {
				if (res) {
					if (Object.keys(this.saveDetails).length === 0) {
						for (const i of res) {
							i.id = this.$fxUtils.createUUID()
							i.thisAmount = 0
							i.assistUnitAmount = 0
							i.thisAmount = i.waitOutAmount
							i.assistUnitAmount = this.calcAssistAmount(i)
							i.stockWay = parseInt(i.stockWay)
						}
					} else {
						for (const i of res) {
							if (this.saveDetails[i.detailId]) {
								const saved = this.saveDetails[i.detailId]
								i.id = this.$fxUtils.createUUID()
								i.thisAmount = saved.thisAmount
								i.assistUnitAmount = this.calcAssistAmount(i)
								i.stockWay = parseInt(saved.stockWay)
								if (i.stockWay === 2) {
									i.crossOrgan = saved.crossOrgan
									i.crossOrganName = saved.crossOrganName
								}
							} else {
								i.id = this.$fxUtils.createUUID()
								i.thisAmount = i.waitOutAmount || 0
								i.assistUnitAmount = this.calcAssistAmount(i)
								i.stockWay = parseInt(i.stockWay)
							}
						}
					}
					this.$forceUpdate()
					this.listData = res
					if (getIndexlist) {
						const obj = {}
						const data = res.reduce((item, next) => {
							if (!obj[next.collectionData.itemId]) {
								item.push(next)
								obj[next.collectionData.itemId] = true
							}
							return item
						}, [])
						this.indexListData = data
					}
					this.$nextTick(() => {
						if (refreshGiveup) {
							this.$refs.handleGiveUp.refreshData()
						}
					})
				}
				return Promise.resolve(res.result)
			})
		},
		beforeRowEdit (row) {
			return new Promise(resolve => {
				this.getList(row).then(() => {
					resolve()
				})
			})
		},
		async getList (row) {
			this.supplierList = await this.getSupplierList(row)
		},
		crossOrganRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select-tab
				ref={`crossOrganName-${$index}`}
				vModel={row.crossOrgan}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='crossOrganName'
				activeTagKey={this.$fxTypeMiddleware.getTypeEnum('organTypeEnum.supplier')}
				cellText={row.crossOrganName}
				selectOptionList={this.supplierList}
				disabled={row.stockWay === 1}
				asyncChange={this.onCrossOrganNameSelectChange}
			></fx-list-cell-select-tab>
		},
		editCross (row) {
			return row.stockWay === 2
		},
		onCrossOrganNameSelectChange (item, row) {
			return new Promise(resolve => {
				row.crossOrgan = item.id
				row.crossOrganName = item.name
				resolve()
			})
		},
		getSupplierList (row) {
			const data = {
				billType: 'SalesOrder',
				otherOrganId: row.otherOrganId,
				disabledIdList: row.crossOrgan ? [row.crossOrgan] : []
			}
			return this.$fxApi(`${apiName}.getSellerList`)({ data }).then(res => {
				return Promise.resolve(res)
			})
		},
		onAssign () {
			this.$refs.detailsTable.doCollectionValiDate().then(() => {
				return this.$refs.detailsTable.getSelectRows().then(res => {
					let flag = true
					for (const item of res) {
						if ((item.stockWay === 2 && !item.crossOrgan) || !item.thisAmount || (this.outAmountGreaterOrder && item.waitOutAmount < item.thisAmount)) {
							const type = !item.thisAmount ? 'thisAmount' : 'crossOrganName'
							this.$refs.detailsTable.setRowEdit(item, type).then(() => {
								this.$refs.detailsTable.$refs.listTable.verificationRowData(item)
							})
							flag = false
							return false
						}
					}
					if (flag) {
						const data = this.sortData(res)
						this.$fxConfirm({
							message: '是否要将选中的品项明细，按照所填写的本次出库数量，生成单据？',
							selectedRowsLength: res.length
						}).then(() => {
							const logger = this.$fxLogger.createInfo('stock-sale-manage.assign-manage.out-assign.assgin', {
								data: res.map(i => ({ ...i, outStore: this.getNameById(i.collectionData.defaultOutHouseId, i.collectionData.houseList) }))
							})
							this.$fxApi(`${apiName}.assign`)({ data, logger }).then(res => {
								this.$refs.detailsTable.clearSelected()
								this.listData = []
								const data = {}
								if (res.OutStore) {
									data.OutStore = [...res.OutStore, ...this.tempOrderid.OutStore]
								}
								if (res.StockOrder) {
									data.StockOrder = [...res.StockOrder, ...this.tempOrderid.StockOrder]
								}
								this.$emit('nextStep', data)
								this.$nextTick(() => {
									this.tempOrderid = {
										OutStore: [],
										StockOrder: []
									}
								})
							}).catch(error => {
								if (error.data && error.data.OutStore) {
									this.tempOrderid.OutStore = [...error.data.OutStore, ...this.tempOrderid.OutStore]
								}
								if (error.data && error.data.StockOrder) {
									this.tempOrderid.StockOrder = [...error.data.StockOrder, ...this.tempOrderid.StockOrder]
								}
								if (error.code === 3) {
									this.$fxConfirm({
										message: '当前页面数据已经发生变更，请刷新后再操作',
										option: {
											confirmButtonText: '刷新',
											showCancelButton: false,
											closeOnClickModal: false,
											closeOnPressEscape: false,
											closeOnHashChange: false,
											showClose: false
										}
									}).then(() => {
										// 刷新数据
										this.dataRefresh()
									})
								}
							})
						})
					}
				})
			})
		},
		dataRefresh () {
			const api = `${apiName}.getLockSummary`
			this.$fxApi(api)({ data: this.getSearchParams() }).then(res => {
				const newIds = res.map(item => item.detailId)
				const oldIds = this.listData.map(item => item.detailId)
				const addId = []
				const delId = []
				for (const i of newIds) {
					if (!oldIds.includes(i)) {
						addId.push(i)
					}
				}
				if (addId.length) {
					for (const i of addId) {
						const rowdata = res.find(item => item.detailId === i)
						rowdata.id = this.$fxUtils.createUUID()
						rowdata.thisAmount = 0
						rowdata.assistUnitAmount = 0
						rowdata.thisAmount = rowdata.waitOutAmount
						rowdata.assistUnitAmount = this.calcAssistAmount(rowdata)
						rowdata.stockWay = parseInt(rowdata.stockWay)
						this.listData.push(rowdata)
					}
				}
				for (const i in this.listData) {
					const item = this.listData[i]
					if (newIds.includes(item.detailId)) {
						item.waitOutAmount = res.find(i => i.detailId === item.detailId).waitOutAmount
					} else {
						delId.push(item.detailId)
					}
				}
				this.listData = this.listData.filter(item => !delId.includes(item.detailId))
			})
		},
		getNameById (id, list) {
			if (!id) {
				return ''
			}
			const selectedItem = list.find(item => item.id === id)
			return selectedItem ? selectedItem.name : ''
		},
		sortData (indata) {
			let data = []
			const sortedByBillidData = this.sortArr(indata, 'billId')
			for (const item of sortedByBillidData) {
				if (item.length > 0) {
					const piece = this.sortArr(item, 'crossOrgan')
					const submitPiece = []
					for (const p of piece) {
						if (p.length) {
							submitPiece.push({
								billId: p[0].billId,
								organId: p[0].otherOrganId,
								otherOrganId: p[0].crossOrgan,
								details: p.map(detail => {
									return {
										id: detail.detailId,
										houseId: detail.collectionData.defaultOutHouseId,
										amount: detail.thisAmount,
										assistUnitAmount: detail.assistUnitAmount,
										itemId: detail.collectionData.itemId,
										unitId: detail.collectionData.unitId,
										stockWay: detail.stockWay,
										expectArrivalDate: detail.expectArrivalDate
									}
								})
							})
						}
					}
					if (submitPiece.length) {
						data = [...data, ...submitPiece]
					}
				}
			}
			return data
		},
		sortArr (arr, str) {
			const _arr = []
			let _t = []
			let _tmp = arr[0][str]
			arr = arr.sort((a, b) => {
				const s = a[str]
				const t = b[str]
				return s < t ? -1 : 1
			})
			for (var i in arr) {
				if (arr[i][str] === _tmp) {
					_t.push(arr[i])
				} else {
					_tmp = arr[i][str]
					_arr.push(_t)
					_t = [arr[i]]
				}
			}
			_arr.push(_t)
			return _arr
		},
		fpOnRowEdit (row, $index, type) {
			return new Promise(resolve => {
				this.$refs[`${type}-${$index}`].focus()
				resolve()
			})
		},
		onGiveup () {
			return this.$refs.detailsTable.getSelectRows().then(res => {
				this.$refs.handleGiveUp.dialogVisible = true
				const giveUpData = this.$fxUtils.deepClone(res)
				for (const i of giveUpData) {
					i.isEdit = false
					i.thisGiveupAmount = i.canGiveUpAmount
				}
				this.$nextTick(() => {
					this.$refs.handleGiveUp.init(giveUpData)
				})
			})
		},
		onShowGiveup () {
			const ids = this.listData.map(i => i.sysBillCode)
			this.$refs.giveUp.open(ids)
		},
		onRefreshStock () {
			const data = this.listData.filter(item => {
				return !!item.collectionData.defaultOutHouseId
			}).map(i => {
				return {
					id: i.detailId,
					storeId: i.collectionData.defaultOutHouseId
				}
			})
			if (!data.length) {
				this.$fxMessage.warning('卖方仓库无数据，无法刷新账存！')
				return false
			}
			this.$fxApi(`${apiName}.refreshAmount`)({ data }).then(res => {
				for (const resItem of res) {
					for (const item of this.listData) {
						if (resItem.id === item.detailId) {
							item.collectionData.last = resItem.amount
							break
						}
					}
				}
				this.$forceUpdate()
			})
		},
		collectionCellRender (h, data, $index) {
			h = this.$createElement
			return <div class='collection'>
				<span class="collection-cell item-name-cell">品项名称：{data.itemName}</span>
				<span class="collection-cell">规格：{data.itemSpec}</span>
				<span class="collection-cell">单位：{data.unitName}</span>
				<span class="collection-cell">订货数量：{data.amountSum}</span>
				<span class="collection-cell organ-name-cell">卖方机构：{data.organName}</span>
				<span class="collection-cell">卖方仓库：</span>
				<fx-list-cell-select
					v-model={data.defaultOutHouseId}
					selectOptionList={data.houseList}
					class="form-input collection-cell"
					columnProp='collectionAmount'
					row={data}
					rowIndex={$index}
					dropdownWidth='300px'
					optionRender={this.optionRender}
					isEdit={true}
					isCollectionCell
				></fx-list-cell-select>
				<span class="collection-cell" vShow={this.showAssistUnit(data.assistUnit)}>订货辅助单位：{data.assistUnit}</span>
				<span class="collection-cell" vShow={this.showAssistUnitAmount(data.assistUnitAmount)}>订货辅助数量：{data.assistUnitAmount}</span>
				<span class="collection-cell">当前剩余库存：{data.last}</span>
				<div class='remove-container'>
					<div class='remove' on-click={() => this.onRemoveClick(data)}><w-icon
						type='tabel-remove'
						class="tabel-remove"
					></w-icon>移除
					</div>
				</div>
			</div>
		},
		optionRender (h, { item }) {
			h = this.$createElement
			return <div class="fx-common__cell-select__option fx-ellipsis">
				<span class="fx-common__cell-select__option-left fx-ellipsis" title={item.code}>{ item.code }</span>
				<span class="fx-common__cell-select__option-right fx-ellipsis" title={item.name}>{ item.name }</span>
			</div>
		},
		onRemoveClick (data) {
			this.listData = this.listData.filter(item => item.collectionData.id !== data.id)
			this.clearSelected()
		},
		arrowHeaderClick () {
			this.expandFlag = !this.expandFlag
		},
		leftRenderHeader (h, column, index) {
			h = this.$createElement
			return <span><w-icon
				type='tabel-header-arrow-left'
				class="arrow-header"
				on-click={this.arrowHeaderClick}
			></w-icon>{ column.label }</span>
		},
		rightRenderHeader (h, column, index) {
			h = this.$createElement
			return <span>{ column.label }<w-icon
				type='tabel-header-arrow-right'
				class="arrow-header"
				class="arrow-header"
				on-click={this.arrowHeaderClick}
			></w-icon></span>
		},
		editStockWay (row) {
			return !this.isCommonTypeByRules('assign-sub')(row.billType, row.subBillType)
		},
		stockWayRender (h, { row, $index }) {
			h = this.$createElement
			const optionProp = {
				key: 'id',
				name: 'label',
				value: 'id'
			}
			return <fx-list-cell-select
				ref={`stockWay-${$index}`}
				vModel={row.stockWay}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				selectOptionProp={optionProp}
				columnProp='stockWay'
				cellText={this.$fxTypeMiddleware.getCommonTypeItemById(row.stockWay).label}
				disabled={this.isCommonTypeByRules('assign-sub')(row.billType, row.subBillType)}
				selectOptionList={this.stockWayTypeList}
				on-on-change={this.onStockWayChange}
			></fx-list-cell-select>
		},
		onStockWayChange (item, row) {
			row.stockWay = item.id
			row.crossOrgan = ''
			row.crossOrganName = ''
		},
		thisAmountRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`thisAmount-${$index}`}
				vModel={row.thisAmount}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='thisAmount'
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.thisAmount, this.sysPointSize)}
				pointSize={this.sysPointSize}
				on-on-change={this.onThisAmountChange}
			>
			</fx-list-cell-input-number>
		},
		onThisAmountChange (val, row) {
			row.assistUnitAmount = this.calcAssistAmount(row)
		},
		inAssistUnitAmountRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`assistUnitAmount-${$index}`}
				vModel={row.assistUnitAmount}
				isEdit={row.isEdit && row.collectionData.assistUnit}
				row={row}
				rowIndex={$index}
				columnProp='assistUnitAmount'
				cellText={row.collectionData.assistUnit ? this.$fxCommon.toFixedAutoZeroFill(row.assistUnitAmount, this.sysPointSize) : ''}
				pointSize={this.sysPointSize}
				on-on-change={this.onInAssistUnitAmountChange}
			>
			</fx-list-cell-input-number>
		},
		onInAssistUnitAmountChange (val, row) {
			if (row.collectionData.unitName === row.collectionData.assistUnit) {
				row.thisAmount = val
			}
		},
		calcAssistAmount (row) {
			if (row.assistUnitRatio) {
				return row.unitRatio / row.assistUnitRatio * row.thisAmount
			} else {
				return 0
			}
		},
		onCellClick (type) {
			return (row) => {
				this.$refs.detailsTable.setRowEdit(row, type)
			}
		},
		isRepeat (arr1, arr2) {
			const ids2 = []
			for (const i of arr2) {
				ids2.push(i.id)
			}
			for (const i of arr1) {
				if (ids2.includes(i.id)) {
					return 1
				}
			}
			return 2
		},
		onSave () {
			this.$refs.detailsTable.getSelectRows().then(res => {
				for (const i of res) {
					this.saveDetails[i.detailId] = this.$fxUtils.deepClone(i)
				}
				this.$fxMessage.success('保存成功！')
			})
		},
		formatter (item, index) {
			return `${item.collectionData.itemName}`
		},
		onListClick (i) {
			if (!this.$refs.filterBar.item.includes(i.collectionData.itemId)) {
				this.$refs.filterBar.item.push(i.collectionData.itemId)
			} else {
				this.$refs.filterBar.item = this.$refs.filterBar.item.filter(item => {
					return item !== i.collectionData.itemId
				})
			}
			this.getListData()
		},
		onLastStep () {
			this.$emit('onLastStep')
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.organ-manage-container {
	flex: 1
	display: flex
	flex-direction: column
	overflow: auto
	padding-bottom 20px
	.tools-left, .tools-right {
		display:flex
		flex-direction: row
		align-items: center
	}
	.tools-left {
		flex: 1
	}
}
.arrow-header {
	position: relative
	top: 0px
	cursor: pointer
	width: 10px!important
	height 10px!important
	margin 0 5px
}
.collection {
	display: flex
}
.collection-cell {
	margin-right: 20px
	overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap
  max-width: 150px
	&.item-name-cell,&.organ-name-cell {
		max-width: 300px
	}
}
.remove-container {
	flex: 1
}
.remove {
	margin-right 20px
	cursor pointer
	width: 50px
    float: right
	.tabel-remove {
		position: relative
		top: 2px
		width: 14px!important
		height 14px!important
		margin-right 2px
		}
	}
>>>.el-input__inner {
	height 28px
	line-height 28px
}
.form-input {
	display: inline-block
	width: 140px
}
.index-list {
	width: 200px
}
.app-container {
	overflow: auto
}
</style>
