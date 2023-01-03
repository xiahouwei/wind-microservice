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
				:tableData="listData"
				:fpBeforeRowEdit="beforeRowEdit"
				:fpOnRowEdit="fpOnRowEdit"
				:tableEditColumnProp="tableEditColumnProp"
				:collectionCellRender="collectionCellRender"
				:tableValiDate="tableValiDate"
				:fullScreenBtn='false'
				:showColumnFilterBtn='false'
				:showDeleteBtn='false'
				:canAdd='false'
				:tableSearchInput='false'
				:rowClassName='rowClassName'
			>
				<div slot="btn-tools-left" class="tools-left">
					<el-button v-fx-auth:stock-sale-manage_assign-manage_in-store.assign-instore class="order-btn" type="primary" plain @click="onAssign">分派</el-button>
					<el-button v-fx-auth:stock-sale-manage_assign-manage_in-store.giveup-instore class="order-btn" type="danger" plain @click="onGiveup">放弃</el-button>
					<el-button v-fx-auth:stock-sale-manage_assign-manage_in-store.show-giveup class="order-btn" type="primary" plain @click="onShowGiveup">查看放弃</el-button>
					<el-button class="order-btn" type="danger" plain @click="onRefreshStock">刷新账存</el-button>
					<el-button class="order-btn" type="primary" plain @click="onSave">保存</el-button>
					<el-button class="order-btn" type="primary" plain @click="onLastStep">上一步</el-button>
				</div>
			</fx-details-table>
		</w-app-container>
		<giveUp ref='giveUp'></giveUp>
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
				{
					prop: 'inHouse',
					label: '入库仓库',
					editColumn: (row, rowIndex, column) => {
						return !row.collectionData.autoType
					},
					fxRender: this.inHouseRender,
					click: this.onCellClick('inHouse')
				},
				{ prop: 'itemName', label: '品项名称' },
				{ prop: 'itemSpec', label: '规格' },
				{ prop: 'unitName', label: '单位' },
				{ prop: 'stockWay', label: '订货方式', fxRender: this.stockWayRender },
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
					label: '本次入库数量',
					editColumn: true,
					fxRender: this.thisAmountRender,
					click: this.onCellClick('thisAmount')
				},
				{
					type: 'arrow',
					prop: 'arrow',
					label: '更多',
					headerClick: this.arrowHeaderClick,
					width: 200
				}
			],
			hideColumn: [
				{
					prop: 'waitInAmount',
					label: '待入库数量',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.waitInAmount, this.sysPointSize)
					},
					renderHeader: this.leftRenderHeader
				},
				{
					prop: 'inGiveUpAmount',
					label: '已放弃数量',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.inGiveUpAmount, this.sysPointSize)
					}
				},
				{
					prop: 'lastAmount',
					label: '当前剩余库存',
					formatter: (row) => {
						if (typeof (row.lastAmount) === 'undefined') {
							return ''
						} else {
							return this.$fxCommon.toFixedAutoZeroFill(row.lastAmount, this.sysPointSize)
						}
					}
				},
				{ prop: 'assistUnit', label: '辅助单位' },
				{
					prop: 'assistUnitAmount',
					label: '订货辅助数量',
					formatter: (row) => {
						return row.assistUnit ? this.$fxCommon.toFixedAutoZeroFill(row.assistUnitAmount, this.sysPointSize) : ''
					}
				},
				{
					prop: 'inAssistUnitAmount',
					label: '入库辅助数量',
					editColumn: (row) => {
						return !!row.assistUnit
					},
					fxRender: this.inAssistUnitAmountRender,
					renderHeader: this.rightRenderHeader,
					click: this.onCellClick('inAssistUnitAmount')
				}
			],
			tableColumnRight: [
				{ prop: 'memo', label: '明细备注', width: 200 }
			],
			listData: [],
			expandFlag: false,
			collectionData: {},
			inHouseList: [],
			fxCalculation: this.$fxCalculation('inStore'),
			tableValiDate: [{
				columnProp: 'inHouse',
				rule: (row, success, error) => {
					this.$refs.detailsTable.getSelectRows(false).then(res => {
						const flag = this.isRepeat([row], res)
						if (flag === 1) {
							if (!row.inHouse.id && !row.inHouseId) {
								error('请选择入库仓库')
							} else {
								success()
							}
						} else {
							success()
						}
					})
				}
			}, {
				columnProp: 'thisAmount',
				rule: (row, success, error) => {
					this.$refs.detailsTable.getSelectRows(false).then(res => {
						const flag = this.isRepeat([row], res)
						if (flag === 1) {
							if (row.thisAmount === 0) {
								error('入库数量不能为0')
							} else if (this.inAmountGreaterOrder && (row.canGiveUpAmount < row.thisAmount)) {
								error('总入库数量不能大于订单数量,最大为' + row.canGiveUpAmount)
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
			sysBillCodes: [],
			tempOrderid: [],
			tableEditColumnProp: ['inHouse', 'thisAmount'],
			indexListData: []
		}
	},
	computed: {
		stockWayState () {
			return (val, key) => {
				return this.$fxTypeMiddleware.getCommonTypeItemById('stockWay')(val)[key]
			}
		},
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
			inAmountGreaterOrder: state => state.system.sysParamsConfig.IN_AMOUNT_GREATER_ORDER_AMOUNT && state.system.sysParamsConfig.IN_AMOUNT_GREATER_ORDER_AMOUNT.value === 'IN_GREATER_ORDER_FALSE'
		}),
		rowClassName () {
			return 'warning-row'
		}
	},
	methods: {
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
			return 0
		},
		initSelect () {
			this.$refs.filterBar.initSelect()
		},
		resetFilter () {
			this.$refs.filterBar.resetFilter()
		},
		refresh (refreshGiveup = false) {
			this.clearSelected()
			return this.getListData(refreshGiveup)
		},
		clearSelected () {
			this.$refs.detailsTable.clearSelected()
		},
		getSearchParams () {
			const params = {
				...this.$refs.filterBar.getFilterParams()
			}
			return {
				...this.$fxCommon.getSearchParams('inStoreAssignItemList')(params)
			}
		},
		getListData (refreshGiveup, getIndexlist = false) {
			this.clearSelected()
			this.listData = []
			const api = `${apiName}.getLockSummary`
			const logger = this.$fxLogger.createInfo('stock-sale-manage.assign-manage.in-assign.lock', {
				data: this.sysBillCodes.map((sysBillCode, index) => {
					return { sysBillCode, id: this.step2ids[index] }
				})
			})
			return this.$fxApi(api)({ data: this.getSearchParams(), logger }).then(res => {
				if (res) {
					if (Object.keys(this.saveDetails).length === 0) {
						for (const i of res) {
							i.thisAmount = i.waitInAmount
							i.inAssistUnitAmount = this.calcAssistAmount(i)
							if (!i.inHouse) {
								i.inHouse = {}
								if (i.inHouseId) {
									i.inHouse = {
										id: i.inHouseId,
										name: i.inHouseName
									}
								}
							}
						}
					} else {
						for (const i of res) {
							if (this.saveDetails[i.id]) {
								i.thisAmount = this.saveDetails[i.id].thisAmount
								i.inHouse = this.saveDetails[i.id].inHouse
							} else {
								i.thisAmount = i.waitInAmount
							}
							i.inAssistUnitAmount = this.calcAssistAmount(i)
							if (!i.inHouse) {
								i.inHouse = {}
								if (i.inHouseId) {
									i.inHouse = {
										id: i.inHouseId,
										name: i.inHouseName
									}
								}
							}
						}
					}
					this.listData = res
					if (getIndexlist) {
						const obj = {}
						const data = this.listData.reduce((item, next) => {
							if (!obj[next.itemId]) {
								item.push(next)
								obj[next.itemId] = true
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
		fpOnRowEdit (row, $index, type) {
			return new Promise(resolve => {
				if (row.collectionData.autoType && type === 'inHouse') {
					this.$refs[`thisAmount-${$index}`].focus()
				} else {
					this.$refs[`${type}-${$index}`].focus()
				}
				resolve()
			})
		},
		onAssign () {
			return this.$refs.detailsTable.getSelectRows().then(res => {
				const flag = this.dataValidate(res)
				if (flag) {
					const data = this.dataProcess(res)
					this.$fxConfirm({
						message: '是否要将选中的品项明细，按照所填写的本次入库数量，生成入库单？',
						selectedRowsLength: res.length
					}).then(() => {
						const logger = this.$fxLogger.createInfo('stock-sale-manage.assign-manage.in-assign.assgin', { data: res })
						this.$fxApi(`${apiName}.assign`)({ data, logger }).then(res => {
							this.$refs.detailsTable.clearSelected()
							this.listData = []
							this.$emit('nextStep', [...res, ...this.tempOrderid])
							this.$nextTick(() => {
								this.tempOrderid = []
							})
						}).catch(error => {
							if (error.data) {
								this.tempOrderid = [...this.tempOrderid, ...error.data]
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
		},
		dataValidate (res) {
			let flag = true
			for (const item of res) {
				if ((!item.inHouse.id && !item.inHouseId) || !item.thisAmount || (this.inAmountGreaterOrder && (item.canGiveUpAmount < item.thisAmount))) {
					const type = !item.inHouse.id && !item.inHouseId ? 'inHouse' : 'thisAmount'
					this.getHouseList(item).then(() => {
						this.$refs.detailsTable.setRowEdit(item, type).then(() => {
							this.$refs.detailsTable.$refs.listTable.verificationRowData(item)
						})
					})
					flag = false
					return false
				}
			}
			return flag
		},
		dataProcess (res) {
			const sortedData = this.sortArr(res, 'collectionData.id')
			const data = sortedData.map(item => {
				return {
					billId: item[0].collectionData.id,
					details: item.map(detail => {
						return {
							id: detail.id,
							houseId: detail.inHouse.id || detail.inHouseId,
							amount: detail.thisAmount,
							assistUnitAmount: detail.inAssistUnitAmount,
							itemId: detail.itemId,
							unitId: detail.unitId,
							expectArrivalDate: detail.expectArrivalDate
						}
					})
				}
			})
			return data
		},
		dataRefresh () {
			this.clearSelected()
			const api = `${apiName}.getLockSummary`
			this.$fxApi(api)({ data: this.getSearchParams() }).then(res => {
				const newIds = res.map(item => item.id)
				const oldIds = this.listData.map(item => item.id)
				const addId = []
				const delId = []
				for (const i of newIds) {
					if (!oldIds.includes(i)) {
						addId.push(i)
					}
				}
				if (addId.length) {
					for (const i of addId) {
						const rowdata = res.find(item => item.id === i)
						rowdata.thisAmount = rowdata.waitInAmount
						rowdata.inAssistUnitAmount = this.calcAssistAmount(rowdata)
						if (!rowdata.inHouse) {
							rowdata.inHouse = {}
						}
						this.listData.push(rowdata)
					}
				}
				for (const i in this.listData) {
					const item = this.listData[i]
					if (newIds.includes(item.id)) {
						item.canGiveUpAmount = res.find(i => i.id === item.id).canGiveUpAmount
					} else {
						delId.push(item.id)
					}
				}
				this.listData = this.listData.filter(item => !delId.includes(item.id))
			})
		},
		getNameById (id, list) {
			if (!id) {
				return ''
			}
			const selectedItem = list.find(item => item.id === id)
			return selectedItem ? selectedItem.name : ''
		},
		sortArr (arr, str) {
			const str1 = str.split('.')[0]
			const str2 = str.split('.')[1]
			const _arr = []
			let _t = []
			let _tmp = arr[0][str1][str2]
			arr = arr.sort((a, b) => {
				const s = a[str1][str2]
				const t = b[str1][str2]
				return s < t ? -1 : 1
			})
			for (var i in arr) {
				if (arr[i][str1][str2] === _tmp) {
					_t.push(arr[i])
				} else {
					_tmp = arr[i][str1][str2]
					_arr.push(_t)
					_t = [arr[i]]
				}
			}
			_arr.push(_t)
			return _arr
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
			this.$refs.giveUp.open(this.step2ids)
		},
		onRefreshStock () {
			const data = this.listData.filter(item => {
				return !!item.inHouse.id || !!item.inHouseId
			}).map(i => {
				return {
					id: i.id,
					storeId: i.inHouse.id || i.inHouseId
				}
			})
			if (data.length) {
				this.$fxApi(`${apiName}.refreshAmount`)({ data }).then(res => {
					for (const resItem of res) {
						for (const item of this.listData) {
							if (resItem.id === item.id) {
								item.lastAmount = resItem.amount
								break
							}
						}
					}
					this.$forceUpdate()
				})
			} else {
				this.$fxMessage.error('请选择仓库')
			}
		},
		collectionCellRender (h, data) {
			h = this.$createElement
			return <div>
				<span class="collection-cell">买方机构：{data.otherOrganName}</span>
				<span class="collection-cell">卖方机构：{data.organName}</span>
				<span class="collection-cell">订货时间：{data.businessDate}</span>
				<span class="collection-cell">系统单号：{data.sysBillCode}</span>
				<span class="collection-cell">手工单号：{data.userBillCode}</span>
				<div class='remove' on-click={() => this.onRemoveClick(data)}><w-icon
					type='tabel-remove'
					class="tabel-remove"
				></w-icon>移除
				</div>
			</div>
		},
		onRemoveClick (data) {
			this.listData = this.listData.filter(item => item.collectionData.sysBillCode !== data.sysBillCode)
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
		stockWayRender (h, { row, $index }) {
			h = this.$createElement
			return <span>{this.stockWayState(row.stockWay, 'label')}</span>
		},
		beforeRowEdit (row) {
			return new Promise(resolve => {
				this.getHouseList(row).then(res => {
					resolve()
				})
			})
		},
		getHouseList (row) {
			const data = {
				buyerOrganId: row.collectionData.otherOrganId,
				itemList: [row.itemId]
			}
			return this.$fxApi(`${apiName}.houseIdList`)({ data }).then(res => {
				this.inHouseList = res
				return Promise.resolve(data)
			})
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
			row.inAssistUnitAmount = this.calcAssistAmount(row)
		},
		inAssistUnitAmountRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`inAssistUnitAmount-${$index}`}
				vModel={row.inAssistUnitAmount}
				isEdit={row.isEdit && row.assistUnit}
				row={row}
				rowIndex={$index}
				columnProp='inAssistUnitAmount'
				cellText={row.assistUnit ? this.$fxCommon.toFixedAutoZeroFill(row.inAssistUnitAmount, this.sysPointSize) : ''}
				pointSize={this.sysPointSize}
				on-on-change={this.onInAssistUnitAmountChange}
			>
			</fx-list-cell-input-number>
		},
		onInAssistUnitAmountChange (val, row) {
			if (row.unitName === row.assistUnit) {
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
				if (!row.collectionData.autoType || type !== 'inHouse') {
					this.$refs.detailsTable.setRowEdit(row, type)
				}
			}
		},
		optionRender (h, { item }) {
			h = this.$createElement
			return <div class="fx-common__cell-select__option fx-ellipsis">
				<span class="fx-common__cell-select__option-left fx-ellipsis" title={item.code}>{ item.code }</span>
				<span class="fx-common__cell-select__option-right fx-ellipsis" title={item.name}>{ item.name }</span>
			</div>
		},
		inHouseRender (h, { row, $index }) {
			h = this.$createElement
			if (row.inHouseId && row.collectionData.autoType) {
				return <el-tooltip effect="dark" content={row.inHouseName} placement="top-start">
					<div class="wind-virtual-table__cell">
						<span class="fx-list-table__cell-span">{row.inHouseName}</span>
					</div>
				</el-tooltip>
			} else {
				return <fx-list-cell-select
					ref={`inHouse-${$index}`}
					value={row.inHouse.id}
					isEdit={row.isEdit}
					row={row}
					rowIndex={$index}
					columnProp='inHouse'
					dropdownWidth='300px'
					optionRender={this.optionRender}
					cellText={row.inHouse.name}
					selectOptionList={this.inHouseList}
					on-on-change={this.onInHouseSelectChange}
				></fx-list-cell-select>
			}
		},
		onInHouseSelectChange (item, row) {
			row.inHouse = item
		},
		onSave () {
			this.$refs.detailsTable.getSelectRows().then(res => {
				for (const i of res) {
					this.saveDetails[i.id] = i
				}
				this.$fxMessage.success('保存成功！')
			})
		},
		clearSave () {
			this.saveDetails = {}
		},
		formatter (item, index) {
			return `${item.itemName}`
		},
		onListClick (i) {
			if (!this.$refs.filterBar.item.includes(i.itemId)) {
				this.$refs.filterBar.item.push(i.itemId)
			} else {
				this.$refs.filterBar.item = this.$refs.filterBar.item.filter(item => {
					return item !== i.itemId
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
.collection-cell {
	margin-right: 20px
}
.remove {
	display inline-block
	float right
	margin-right 20px
	cursor pointer
	.tabel-remove {
		position: relative
		top: 2px
		width: 14px!important
		height 14px!important
		margin-right 2px
	}
}
.warning-row {
	color: red
}
.index-list {
	width: 200px
}
.app-container {
	overflow: auto
}
</style>
