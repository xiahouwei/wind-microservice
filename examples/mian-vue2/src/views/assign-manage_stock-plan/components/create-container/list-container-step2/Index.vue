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
				:collectionCellRender="collectionCellRender"
				:tableEditColumnProp="tableEditColumnProp"
				:tableValiDate="tableValiDate"
				:fullScreenBtn='false'
				:showColumnFilterBtn='false'
				:showDeleteBtn='false'
				:canAdd='false'
				:tableSearchInput='false'
				:rowClassName='rowClassName'
			>
				<div slot="btn-tools-left" class="tools-left">
					<el-button v-fx-auth:stock-sale-manage_assign-manage_stock-plan.assign-order class="order-btn" type="primary" plain @click="onAssign">分派</el-button>
					<el-button v-fx-auth:stock-sale-manage_assign-manage_stock-plan.giveup-order class="order-btn" type="danger" plain @click="onGiveup">放弃</el-button>
					<el-button v-fx-auth:stock-sale-manage_assign-manage_stock-plan.show-giveup class="order-btn" type="primary" plain @click="onShowGiveup">查看放弃</el-button>
					<el-button class="order-btn" type="danger" plain @click="onRefreshStock">刷新账存</el-button>
					<el-button class="order-btn" type="primary" plain @click="onSave">保存</el-button>
					<el-button class="order-btn" type="primary" plain @click="onLastStep">上一步</el-button>
				</div>
				<settingMulity
					slot="setting-mulity"
					slot-scope="{ visible }"
					:visible="visible"
					@on-save-click="onSettingMulitySave"
					@on-cancel-click="onSettingMulityClose"
				></settingMulity>
			</fx-details-table>
		</w-app-container>
		<giveUp ref='giveUp'></giveUp>
		<handleGiveUp
			ref='handleGiveUp'
			:listData="giveupListData"
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
import settingMulity from './settingMulity/Index.vue'
export default {
	name: 'listContainer',
	components: {
		filterBar,
		giveUp,
		handleGiveUp,
		settingMulity
	},
	props: {
		step2ids: Array
	},
	data () {
		return {
			tableColumnLeft: [
				{ prop: 'inHouseName', label: '入库仓库' },
				{ prop: 'itemName', label: '品项名称' },
				{ prop: 'itemSpec', label: '规格' },
				{ prop: 'unitName', label: '单位' },
				{ prop: 'organ', label: '卖方机构', editColumn: true, fxRender: this.organRender, click: this.onCellClick('otherOrgan') },
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
					label: '申请数量',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.amount, this.sysPointSize)
					}
				},
				{
					prop: 'thisAmount',
					label: '本次订货数量',
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
					prop: 'giveUpAmount',
					label: '已放弃数量',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.giveUpAmount, this.sysPointSize)
					},
					renderHeader: this.leftRenderHeader
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
					label: '申请辅助数量',
					formatter: (row) => {
						return row.assistUnit ? this.$fxCommon.toFixedAutoZeroFill(row.assistUnitAmount, this.sysPointSize) : ''
					}
				},
				{
					prop: 'inAssistUnitAmount',
					label: '订货辅助数量',
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
			giveupListData: [],
			expandFlag: false,
			collectionData: {},
			fxCalculation: this.$fxCalculation('inStore'),
			tableValiDate: [{
				columnProp: 'thisAmount',
				rule: (row, success, error) => {
					this.$refs.detailsTable.getSelectRows(false).then(res => {
						const flag = this.isRepeat([row], res)
						if (flag === 1) {
							if (row.thisAmount === 0) {
								error('订货数量不能为0')
							} else {
								success()
							}
						} else {
							success()
						}
					})
				}
			}, {
				columnProp: 'otherOrgan',
				rule: (row, success, error) => {
					this.$refs.detailsTable.getSelectRows(false).then(res => {
						const flag = this.isRepeat([row], res)
						if (flag === 1) {
							if (!row.otherOrgan.id) {
								error('请选择卖方机构')
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
			organList: [],
			tableEditColumnProp: ['otherOrgan', 'thisAmount'],
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
			sysPointSize: state => state.system.sysPointSize
		}),
		rowClassName (row, rowIndex) {
			return 'warning-row'
		}
	},
	methods: {
		initSelect () {
			this.$refs.filterBar.initSelect()
		},
		resetFilter () {
			this.$refs.filterBar.resetFilter()
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
		refresh (refreshGiveup = false) {
			this.$refs.detailsTable.clearSelected()
			return this.getListData(refreshGiveup)
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
			this.$refs.detailsTable.clearSelected()
			this.listData = []
			const api = `${apiName}.getLockSummary`
			const logger = this.$fxLogger.createInfo('stock-sale-manage.assign-manage.stock-plan.lock', {
				data: this.sysBillCodes.map((sysBillCode, index) => {
					return { sysBillCode, id: this.step2ids[index] }
				})
			})
			return this.$fxApi(api)({ data: this.getSearchParams(), logger }).then(res => {
				if (res) {
					if (Object.keys(this.saveDetails).length === 0) {
						for (const i of res) {
							i.thisAmount = i.canGiveUpAmount
							i.inAssistUnitAmount = this.calcAssistAmount(i)
							if (!i.otherOrgan) {
								i.otherOrgan = {}
							}
						}
					} else {
						for (const i of res) {
							if (this.saveDetails[i.id]) {
								i.thisAmount = this.saveDetails[i.id].thisAmount
								i.inHouseName = this.saveDetails[i.id].inHouseName
								i.inHouseId = this.saveDetails[i.id].inHouseId
								i.otherOrgan = this.saveDetails[i.id].otherOrgan
							} else {
								i.thisAmount = i.canGiveUpAmount
							}
							i.inAssistUnitAmount = this.calcAssistAmount(i)
							if (!i.otherOrgan) {
								i.otherOrgan = {}
							}
						}
					}
					this.listData = res
					this.giveupListData = this.$fxUtils.deepClone(res)
					if (getIndexlist) {
						const obj = {}
						const data = res.reduce((item, next) => {
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
		onAssign () {
			return this.$refs.detailsTable.getSelectRows().then(res => {
				let flag = true
				for (const item of res) {
					if (!item.thisAmount || !item.otherOrgan.id) {
						const type = item.thisAmount ? 'thisAmount' : 'otherOrgan'
						this.getHouseList(item).then(() => {
							this.$refs.detailsTable.setRowEdit(item, type).then(() => {
								this.$refs.detailsTable.$refs.listTable.verificationRowData(item)
							})
						})
						flag = false
						return false
					}
				}
				if (flag) {
					const sortedData = this.sortArr(res, 'collectionData.id')
					const data = sortedData.map(item => {
						return {
							billId: item[0].collectionData.id,
							details: item.map(detail => {
								return {
									id: detail.id,
									houseId: detail.inHouseId,
									amount: detail.thisAmount,
									assistUnitAmount: detail.inAssistUnitAmount,
									itemId: detail.itemId,
									unitId: detail.unitId,
									otherOrganId: detail.otherOrgan.id
								}
							})
						}
					})
					this.$fxConfirm({
						message: '是否要将选中的品项明细，按照所填写的本次订货数量，生成采购订单？',
						selectedRowsLength: res.length
					}).then(() => {
						const logger = this.$fxLogger.createInfo('stock-sale-manage.assign-manage.stock-plan.assgin', { data: res })
						this.$fxApi(`${apiName}.assign`)({ data, logger }).then(res => {
							this.$refs.detailsTable.clearSelected()
							this.listData = []
							this.$emit('nextStep', res)
						})
					})
				}
			})
		},
		fpOnRowEdit (row, $index, type) {
			return new Promise(resolve => {
				this.$refs[`${type}-${$index}`].focus()
				resolve()
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
				this.$nextTick(() => {
					const data = this.$fxUtils.deepClone(res)
					for (const i of data) {
						i.isEdit = false
					}
					this.$refs.handleGiveUp.init(data)
				})
			})
		},
		onShowGiveup () {
			const ids = this.listData.map(i => i.collectionData.sysBillCode)
			this.$refs.giveUp.open(ids)
		},
		onRefreshStock () {
			const data = this.listData.map(i => {
				return {
					id: i.id,
					storeId: i.inHouseId
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
				<span class="collection-cell">买方机构：{data.organName}</span>
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
			this.giveupListData = this.$fxUtils.deepClone(this.listData)
			this.$refs.detailsTable.clearSelected()
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
		organRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select-tab
				ref={`otherOrgan-${$index}`}
				value={row.otherOrgan.id}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='otherOrgan'
				dropdownWidth='300px'
				activeTagKey={this.$fxTypeMiddleware.getTypeEnum('organTypeEnum.supplier')}
				optionRender={this.organOptionRender}
				cellText={row.otherOrgan.name}
				selectOptionList={this.organList}
				on-on-change={this.onOtherOrganChange}
			></fx-list-cell-select-tab>
		},
		onOtherOrganChange (item, row) {
			row.otherOrgan = item
			row.stockWay = item.stockWay || 1
		},
		stockWayRender (h, { row, $index }) {
			h = this.$createElement
			return <span>{this.stockWayState(row.stockWay, 'label')}</span>
		},
		beforeRowEdit (row) {
			return new Promise(resolve => {
				this.getHouseList(row).then(() => {
					resolve()
				})
			})
		},
		getHouseList (row) {
			const data = {
				stockPlanId: row.stockPlanId || '',
				itemId: row.itemId,
				billType: 'StockOrder',
				otherOrganId: row.collectionData.organId,
				disabledIdList: row.otherOrgan.id ? [row.otherOrgan.id] : [],
				notConsiderStockPlan: true
			}
			return this.$fxApi(`${apiName}.getSellerListNew`)({ data }).then(res => {
				this.organList = res
				return Promise.resolve()
			})

			// if (row.stockPlanId) {
			// 	return this.$fxApi(`${apiName}.organListByPlan`, row.stockPlanId).then(res => {
			// 		const preList = res.find(item => {
			// 			return item.itemId === row.itemId
			// 		}) || []
			// 		this.organList = preList.organs || []
			// 		return Promise.resolve()
			// 	})
			// } else {
			// 	return this.$fxApi(`${apiName}.organListAll`).then(res => {
			// 		this.organList = res
			// 		return Promise.resolve()
			// 	})
			// }
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
				pointSize={this.sysPointSize}
				cellText={row.assistUnit ? this.$fxCommon.toFixedAutoZeroFill(row.inAssistUnitAmount, this.sysPointSize) : ''}
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
				this.$refs.detailsTable.setRowEdit(row, type)
			}
		},
		optionRender (h, { item }) {
			h = this.$createElement
			return <div class="fx-common__cell-select__option fx-ellipsis">
				<span class="fx-common__cell-select__option-left fx-ellipsis" title={item.code}>{ item.code }</span>
				<span class="fx-common__cell-select__option-right fx-ellipsis" title={item.name}>{ item.name }</span>
			</div>
		},
		organOptionRender (h, { item }) {
			h = this.$createElement
			return <div class="fx-common__cell-select__option fx-ellipsis">
				<span class="fx-common__cell-select__option-left fx-ellipsis" title={item.name}>{ item.name }</span>
			</div>
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
		onLastStep () {
			this.$emit('onLastStep')
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
		onSettingMulitySave (otherOrgan) {
			this.$refs.detailsTable.getSelectRows().then(res => {
				res.forEach(item => {
					item.otherOrgan = otherOrgan
					item.stockWay = otherOrgan.stockWay || 1
				})
			})
		},
		onSettingMulityClose () {
			this.$refs.detailsTable.closeMulitySettingPopver()
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
