<template>
  <w-collapse v-model="collapseVisible" contentHeight="320px" disabled :showArrow="false" title="结算信息">
    <fx-details-table
      ref="detailsTable"
      v-fx-tab:loop.financial-manage_financial-organ-manage_details.settlementInfo
      :disabled="disabled"
      :tableColumn="tableColumn"
      :tableData="tableDetails"
			:tableValiDate="tableValiDate"
      :tableEditColumnProp="tableEditColumnProp"
      :mainId="organDetails.id"
			:fpSaveMain="fpSaveMain"
      :fpOnRowEdit="fpOnRowEdit"
      :fpSaveDetails="fpSaveDetails"
			:fpInitAddDetailsData="fpInitAddDetailsData"
			:fpDeleteDetails="fpDeleteDetails"
      :fullScreenBtn="false"
      :tableSearchInput="false"
      :canAdd="false"
      :showMistakeCheck="false"
      :showColumnFilterBtn="false"
			@on-details-refresh="onDetailsRefresh"
    >
			<fx-button slot="btn-tools-left-right" type="primary" class="add-btn" :disabled="disabled" @click="onAddClick">新增明细</fx-button>
			<div slot="empty">暂无结算信息</div>
    </fx-details-table>
  </w-collapse>
</template>
<script>
import { apiName } from '../../Index.vue'
const EDIT_INPUT_TYPE = ['settlementWay', 'accountName', 'bankAccount', 'bank', 'revenType']
export default {
	name: 'settlementInfo',
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
					prop: 'settlementWay',
					label: '结算方式',
					editColumn: true,
					fxRender: this.settlementWayRender,
					click: this.onCellClick('settlementWay')
				}, {
					prop: 'accountName',
					label: '账户名称',
					width: '200px',
					editColumn: true,
					fxRender: this.accountNameRender,
					click: this.onCellClick('accountName')
				}, {
					prop: 'bankAccount',
					label: '银行账户',
					width: '200px',
					editColumn: true,
					fxRender: this.bankAccountRender,
					click: this.onCellClick('bankAccount')
				}, {
					prop: 'bank',
					label: '开户银行',
					width: '200px',
					editColumn: true,
					fxRender: this.bankRender,
					click: this.onCellClick('bank')
				}, {
					prop: 'revenType',
					label: '收支属性',
					editColumn: true,
					fxRender: this.revenTypeRender,
					click: this.onCellClick('revenType')
				}, {
					prop: 'defaultFlag',
					label: '是否默认',
					width: '80px',
					editColumn: true,
					fxRender: this.defaultFlagRender,
					click: this.onCellClick('defaultFlag')
				}
			],
			tableValiDate: [{
				columnProp: 'settlementWay',
				rule: (row, success, error) => {
					if (!row.settlementWay.id) {
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
				columnProp: 'bankAccount',
				rule: (row, success, error) => {
					if (!row.bankAccount) {
						error('银行账户不能为空')
					} else {
						success()
					}
				}
			}, {
				columnProp: 'bank',
				rule: (row, success, error) => {
					if (!row.bank) {
						error('开户银行不能为空')
					} else {
						success()
					}
				}
			}],
			fxCache: this.$fxUtils.fxCache('financial-organ'),
			settlementWayLoading: false,
			settlementWayList: [],
			optionProp: {
				name: 'label'
			},
			balancePropertiesList: this.$fxTypeMiddleware.getCommonTypeList('balancePropertiesList'),
			originIsDefaultId: ''
		}
	},
	computed: {
		tableEditColumnProp () {
			return EDIT_INPUT_TYPE
		}
	},
	watch: {
		tableDetails: {
			immediate: true,
			handler (newValue, oldValue) {
				if (newValue !== oldValue) {
					this.setOriginIsDefaultId()
				}
			}
		}
	},
	methods: {
		settlementWayRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`settlementWay-${$index}`}
				value={row.settlementWayId}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='settlementWay'
				cellText={row.settlementWay.name}
				loading={this.settlementWayLoading}
				selectOptionList={this.settlementWayList}
				class="settlement-input"
				on-on-change={this.onSettlementWayChange}
				fpSelectShow={this.onSettlementWayShow(row)}
			></fx-list-cell-select>
		},
		onSettlementWayChange (item, row) {
			row.settlementWay = item
			row.settlementWayId = item.id
		},
		onSettlementWayShow (row) {
			return () => {
				return new Promise(resolve => {
					this.settlementWayLoading = true
					this.getSettlementWayList(row.settlementWayId).then(res => {
						this.settlementWayLoading = false
						this.settlementWayList = res
						resolve()
					})
				})
			}
		},
		getSettlementWayList (settlementWayId) {
			const key = `settlementWayList.${settlementWayId}`
			return this.fxCache.cacher(key, this.$fxApi(`${apiName}.getSettlementWayList`)({ data: { mustShowId: settlementWayId || '' } }))
		},
		accountNameRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input
				ref={`accountName-${$index}`}
				vModel={row.accountName}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='accountName'
				class='list-cell-input'
				maxlength={this.$fxCommon.getFxInputMaxLength('commonName')}
				regType={this.$fxCommon.getFxInputReg('commonName')}
			></fx-list-cell-input>
		},
		bankAccountRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input
				ref={`bankAccount-${$index}`}
				vModel={row.bankAccount}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='bankAccount'
				class='list-cell-input'
				maxlength={20}
				regType={this.$fxCommon.getFxInputReg('phone')}
			></fx-list-cell-input>
		},
		bankRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input
				ref={`bank-${$index}`}
				vModel={row.bank}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='bank'
				class='list-cell-input'
				maxlength={this.$fxCommon.getFxInputMaxLength('commonName')}
				regType={this.$fxCommon.getFxInputReg('commonName')}
			></fx-list-cell-input>
		},
		revenTypeRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`revenType-${$index}`}
				vModel={row.revenType}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='revenType'
				cellText={this.$fxTypeMiddleware.getCommonTypeItemById('balancePropertiesList')(row.revenType).label}
				selectOptionList={this.balancePropertiesList}
				selectOptionProp={this.optionProp}
				on-on-select-enter={this.onBalancePropertiesEnter}
			></fx-list-cell-select>
		},
		onBalancePropertiesEnter (row, $index) {
			if ($index === this.tableDetails.length - 1) {
				this.onAddClick()
			} else {
				this.$refs.detailsTable.doRowEditEnter()
			}
		},
		defaultFlagRender (h, { row, $index }) {
			h = this.$createElement
			return <el-checkbox
				vModel={row.defaultFlag}
				disabled={!row.isEdit}
				true-label={1}
				false-label={0}
				class="is-default-checkbox"
				on-change={(val) => this.onDefaultFlagChange(val, row)}
			>默认</el-checkbox>
		},
		onDefaultFlagChange (val, row) {
			if (val) {
				this.tableDetails.forEach(item => {
					if (item.id !== row.id) {
						item.defaultFlag = 0
					}
				})
			} else if (this.originIsDefaultId) {
				this.tableDetails.forEach(item => {
					if (item.id === this.originIsDefaultId && item.id !== row.id) {
						item.defaultFlag = 1
					}
				})
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
			return this.onSaveDetailsHandler(detail, origin).then(res => {
				this.setOriginIsDefaultId(res)
				return Promise.resolve(res)
			})
		},
		onSaveDetailsHandler (params, origin) {
			if (params.id) {
				const logger = this.$fxLogger.createInfo('financial-manage.financial-archives.financial-organ-manage.updateDetails', this.createLoggerParams(params, origin))
				return this.$fxApi(`${apiName}.editDetail`)({ data: params, logger })
			} else {
				const addItemInfo = this.getAddItemInfo(params)
				const logger = this.$fxLogger.createInfo('financial-manage.financial-archives.financial-organ-manage.addDetails', { name: this.organDetails.name, addItemInfo })
				return this.$fxApi(`${apiName}.addDetail`, params)({ logger })
			}
		},
		createLoggerParams (params, origin) {
			const originData = this.$fxUtils.deepClone(origin)
			const currentData = this.$fxUtils.deepClone(params)
			return {
				pre: originData,
				cur: currentData,
				name: this.organDetails.name,
				settlementWay: currentData.settlementWay.name
			}
		},
		getAddItemInfo (params) {
			const settlementWay = params.settlementWay.name
			const revenType = this.$fxTypeMiddleware.getCommonTypeItemById('balancePropertiesList')(params.revenType).label
			return `结算方式:${settlementWay},账户名称:${params.accountName},银行账户:${params.bankAccount},开户银行:${params.bank},收支属性:${revenType}`
		},
		fpDeleteDetails (ids) {
			const deleteItemInfo = this.getDeleteItemInfo(ids)
			const logger = this.$fxLogger.createInfo('financial-manage.financial-archives.financial-organ-manage.deleteDetails', { deleteItemInfo, name: this.organDetails.name })
			return this.$fxApi(`${apiName}.delDetailMulity`, this.organDetails.id)({ data: ids, logger }).then(res => {
				this.$refs.detailsTable.clearSelected()
				return Promise.resolve(res)
			})
		},
		getDeleteItemInfo (ids) {
			return this.tableDetails.filter(item => {
				return ids.includes(item.id)
			}).map(item => {
				const settlementWay = item.settlementWay.name
				const revenType = this.$fxTypeMiddleware.getCommonTypeItemById('balancePropertiesList')(item.revenType).label
				return `结算方式:${settlementWay},账户名称:${item.accountName},银行账户:${item.bankAccount},开户银行:${item.bank},收支属性:${revenType}`
			}).join(';')
		},
		checkDetailsUnSaving () {
			return this.$refs.detailsTable.checkDetailsUnSaving(this.checkDetailsData)
		},
		checkDetailsData (row) {
			return !row.settlementWay.id
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
				cwOrganId: this.organDetails.id,
				settlementWay: {},
				settlementWayId: '',
				accountName: '',
				bankAccount: '',
				bank: '',
				revenType: 0,
				defaultFlag: 0
			}
			return Promise.resolve(data)
		},
		setOriginIsDefaultId (row = {}) {
			if (row.defaultFlag) {
				this.originIsDefaultId = row.id
			} else {
				this.originIsDefaultId = (this.tableDetails.find(item => {
					return item.defaultFlag
				}) || {}).id
			}
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
.settlement-input {
	>>>.el-input__inner{
		padding-right 30px !important
	}
}
.is-default-checkbox {
	line-height 33px
	>>>.el-checkbox__label {
		font-size 12px
	}
}
</style>

