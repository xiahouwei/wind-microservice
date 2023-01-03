<template>
	<w-collapse v-model="collapseVisible" contentHeight="320px" disabled :showArrow="false" title="结算明细">
		<fx-details-table
			ref="detailsTable"
			v-fx-tab:loop.financial-manage_advanced-order_details.settlementDetails
			showSummary
			:disabled="disabled"
			:tableColumn="tableColumn"
			:tableData="tableDetails"
			:tableValiDate="tableValiDate"
			:tableEditColumnProp="tableEditColumnProp"
			:mainId="organDetails.id"
			:fpOnRowEdit="fpOnRowEdit"
			:fpSaveMain="fpSaveMain"
			:fpSaveDetails="fpSaveDetails"
			:fpInitAddDetailsData="fpInitAddDetailsData"
			:fpDeleteDetails="fpDeleteDetails"
			:canAdd="false"
			:showMistakeCheck="false"
			:showColumnFilterBtn="false"
			:fullScreenBtn="false"
      :tableSearchInput="false"
			@on-details-refresh="onDetailsRefresh"
		>
			<fx-button slot="btn-tools-left-right" type="primary" class="add-btn" :disabled="disabled" @click="onAddClick">新增明细</fx-button>
			<div slot="empty">暂无结算明细</div>
		</fx-details-table>
	</w-collapse>
</template>
<script>
import { mapState } from 'vuex'
import { apiName } from '../../Index.vue'
const EDIT_INPUT_TYPE = ['settleWay', 'accountName', 'payMoney', 'memo']
export default {
	name: 'settlementDetails',
	props: {
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
		disabled: Boolean,
		fpSaveMain: Function
	},
	data () {
		return {
			collapseVisible: true,
			tableColumn: [
				{
					prop: 'settleWay',
					label: '结算方式',
					editColumn: true,
					fxRender: this.settleWayRender,
					click: this.onCellClick('settleWay')
				},
				{
					prop: 'accountName',
					label: '账户名称',
					editColumn: true,
					fxRender: this.accountNameRender,
					click: this.onCellClick('accountName')
				},
				{
					prop: 'bankAccount',
					label: '银行账号'
				},
				{ prop: 'bankName', label: '开户银行' },
				{
					prop: 'payMoney',
					label: '付款金额',
					editColumn: true,
					fxRender: this.payMoneyRender,
					click: this.onCellClick('payMoney'),
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'memo',
					label: '备注',
					editColumn: true,
					fxRender: this.memoRender,
					click: this.onCellClick('memo')
				}
			],
			tableValiDate: [{
				columnProp: 'settleWay',
				rule: (row, success, error) => {
					if (!row.settleWay) {
						error('结算方式不能为空')
					} else {
						success()
					}
				}
			}, {
				columnProp: 'accountName',
				rule: (row, success, error) => {
					if (!row.accountName) {
						error('账户名称不能为空')
					} else {
						success()
					}
				}
			}, {
				columnProp: 'payMoney',
				rule: (row, success, error) => {
					if (row.payMoney === 0) {
						error('付款金额不能为0')
					} else {
						success()
					}
				}
			}],
			fxCache: this.$fxUtils.fxCache('advanced-order'),
			settlementWayLoading: false,
			settlementWayList: [],
			accountNameLoading: false,
			accountNameList: []
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize
		}),
		tableEditColumnProp () {
			return EDIT_INPUT_TYPE
		}
	},
	methods: {
		settleWayRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`settleWay-${$index}`}
				vModel={row.settleWay}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='settleWay'
				cellText={row.settleWay}
				loading={this.settlementWayLoading}
				selectOptionList={this.settlementWayList}
				on-on-change={this.onSettlementWayChange}
				fpSelectShow={this.onSettlementWayShow(row)}
			></fx-list-cell-select>
		},
		onSettlementWayChange (item, row) {
			row.bankAccount = ''
			row.accountName = ''
			row.bankName = ''
		},
		onSettlementWayShow (row) {
			return () => {
				return new Promise(resolve => {
					this.settlementWayLoading = true
					this.getSettlementWayList(row).then(res => {
						this.settlementWayLoading = false
						this.settlementWayList = res
						resolve()
					})
				})
			}
		},
		getSettlementWayList (row) {
			const key = `settlementWayList.${this.organDetails.id}.${this.organDetails.organ.id}`
			return this.fxCache.cacher(key, this.$fxApi(`${apiName}.getSettlementWayList`, this.organDetails.id, this.organDetails.organ.id))
		},
		optionRender (h, { item }) {
			h = this.$createElement
			return <div class="fx-common__cell-select__option fx-ellipsis">
				<span class="fx-common__cell-select__option-left fx-ellipsis" title={item.accountName}>{ item.accountName }</span>
				<span class="fx-common__cell-select__option-right fx-ellipsis" title={item.bankAccount}>{ item.bankAccount }</span>
			</div>
		},
		accountNameRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`accountName-${$index}`}
				vModel={row.accountName}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='accountName'
				dropdownWidth='300px'
				cellText={row.accountName}
				loading={this.accountNameLoading}
				optionRender={this.optionRender}
				selectOptionList={this.accountNameList}
				on-on-change={this.onAccountNameChange}
				fpSelectShow={this.onAccountNameShow(row)}
			></fx-list-cell-select>
		},
		onAccountNameChange (item, row) {
			row.bankAccount = item.bankAccount
			row.bankName = item.bank
		},
		onAccountNameShow (row) {
			return () => {
				return new Promise(resolve => {
					this.accountNameLoading = true
					this.getSettlementWayList(row).then(res => {
						this.accountNameLoading = false
						if (res.length > 0) {
							const settleWayObj = res.find(item => {
								return row.settleWay === item.settlementWay
							})
							const newSettlementValues = this.$fxUtils.deepClone(settleWayObj.settlementValues)
							newSettlementValues.forEach(item => {
								item.id = item.accountName
								item.name = item.accountName
							})
							this.accountNameList = newSettlementValues
						} else {
							this.accountNameList = []
						}
						resolve()
					})
				})
			}
		},
		payMoneyRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`payMoney-${$index}`}
				vModel={row.payMoney}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				min={-Infinity}
				columnProp='payMoney'
				pointSize={this.sysMoneyPointSize}
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.payMoney, this.sysMoneyPointSize)}
			>
			</fx-list-cell-input-number>
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
				class='list-cell-input'
				maxlength={this.$fxCommon.getFxInputMaxLength('memo')}
				regType={this.$fxCommon.getFxInputReg('memo')}
				vOn:on-input-enter={this.onMemoEnter}
			></fx-list-cell-input>
		},
		onMemoEnter (row, $index) {
			if ($index === this.tableDetails.length - 1) {
				this.onAddClick()
			} else {
				this.$refs.detailsTable.doRowEditEnter()
			}
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
		fpSaveDetails (detail, origin) {
			return this.onSaveDetailsHandler(detail, origin)
		},
		onSaveDetailsHandler (params, origin) {
			if (params.id) {
				const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.advanced-order.updateDetails', this.createLoggerParams(params, origin))
				return this.$fxApi(`${apiName}.editDetail`, this.organDetails.id)({ data: params, logger }).then(res => {
					return Promise.resolve(res)
				})
			} else {
				const addItemInfo = this.getAddItemInfo(params)
				const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.advanced-order.addDetails', { orderData: this.organDetails, addItemInfo })
				return this.$fxApi(`${apiName}.addDetail`, this.organDetails.id, params)({ logger }).then(res => {
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
				orderData: this.organDetails
			}
		},
		getAddItemInfo (params) {
			return `结算方式:${params.settleWay},账户名称:${params.accountName},银行账户:${params.bankAccount},开户银行:${params.bankName},付款金额:${params.payMoney}`
		},
		fpDeleteDetails (ids) {
			const deleteItemInfo = this.getDeleteItemInfo(ids)
			const logger = this.$fxLogger.createInfo('financial-manage.capital-manage.advanced-order.deleteDetails', { orderData: this.organDetails, deleteItemInfo })
			return this.$fxApi(`${apiName}.delDetailMulity`, this.organDetails.id)({ data: ids, logger }).then(res => {
				this.$refs.detailsTable.clearSelected()
				return Promise.resolve(res)
			})
		},
		getDeleteItemInfo (ids) {
			return this.tableDetails.filter(item => {
				return ids.includes(item.id)
			}).map(item => {
				return `结算方式:${item.settleWay},账户名称:${item.accountName},银行账户:${item.bankAccount},开户银行:${item.bankName},付款金额:${item.payMoney}`
			}).join(';')
		},
		checkDetailsUnSaving () {
			return this.$refs.detailsTable.checkDetailsUnSaving(this.checkDetailsData)
		},
		checkDetailsData (row) {
			return !row.settleWay
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
		onAddClick () {
			this.$refs.detailsTable.onAddOnce()
		},
		fpInitAddDetailsData () {
			const data = {
				settleWay: '',
				accountName: '',
				bankAccount: '',
				bankName: '',
				payMoney: 0,
				memo: ''
			}
			return Promise.resolve(data)
		},
		onDetailsRefresh () {
			this.$emit('on-details-refresh')
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.add-btn {
	margin-left 10px
}
.list-cell-input {
	>>>.form-item-input {
		width 100%
	}
}
</style>
