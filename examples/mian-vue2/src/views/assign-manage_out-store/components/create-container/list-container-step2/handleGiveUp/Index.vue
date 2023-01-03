<template>
  <w-dialog
		v-model="dialogVisible"
		title="放弃分派"
		fullscreen
		@close="onRefresh"
	>
    <fx-details-table
			ref="detailsTable"
			:tableColumn="tableColumn"
			:tableData="giveUpSelected"
			:fpOnRowEdit="fpOnRowEdit"
			:fpSaveDetails="fpSaveDetails"
			:tableValiDate="tableValiDate"
			:tableEditColumnProp="tableEditColumnProp"
			:fullScreenBtn='false'
			:showColumnFilterBtn='false'
			:showDeleteBtn='false'
			:canAdd='false'
			:selectedRows="selectedRows"
			:tableSearchInput='false'
		>
			<div slot="btn-tools-left" class="tools-left">
				<el-button class="order-btn" type="danger" plain @click="onEnsure">确定放弃</el-button>
			</div>
		</fx-details-table>
    </w-dialog>
</template>
<script>
import { mapState } from 'vuex'
import { apiName } from '../../Index.vue'
export default {
	name: 'createOrgan',
	props: {
		listData: Array
	},
	data () {
		return {
			dialogVisible: false,
			tableColumn: [
				{ prop: 'otherOrganName', label: '买方机构' },
				{ prop: 'collectionData.itemName', label: '品项名称' },
				{ prop: 'collectionData.itemSpec', label: '规格' },
				{ prop: 'collectionData.unitName', label: '单位' },
				{
					prop: 'amount',
					label: '订货数量',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.amount, this.sysPointSize)
					}
				},
				{ prop: 'stockWay', label: '订货方式', fxRender: this.stockWayRender },
				{ prop: 'collectionData.organName', label: '卖方机构' },
				{
					prop: 'canGiveUpAmount',
					label: '可放弃数量',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.canGiveUpAmount, this.sysPointSize)
					}
				},
				{
					prop: 'thisGiveupAmount',
					label: '本次放弃数量',
					editColumn: true,
					fxRender: this.thisAmountRender,
					click: this.onCellClick('thisGiveupAmount')
				},
				{
					prop: 'outGiveUpAmount',
					label: '已放弃出库数量',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.outGiveUpAmount, this.sysPointSize)
					}
				}
			],
			giveUpSelected: [],
			selectedRows: [],
			tableValiDate: [{
				columnProp: 'thisGiveupAmount',
				rule: (row, success, error) => {
					if (row.thisGiveupAmount > row.canGiveUpAmount) {
						error('本次放弃数量不能大于可放弃数量！')
					} else {
						success()
					}
				}
			}],
			tableEditColumnProp: ['thisGiveupAmount']
		}
	},
	computed: {
		...mapState({
			sysPointSize: state => state.system.sysPointSize
		}),
		stockWayState () {
			return (val, key) => {
				return this.$fxTypeMiddleware.getCommonTypeItemById('stockWay')(val)[key]
			}
		}
	},
	methods: {
		open () {
			this.dialogVisible = true
			this.$nextTick(() => {
				this.$refs.detailsTable.clearSelected()
			})
		},
		init (res) {
			this.giveUpSelected = res
			for (const i of res) {
				i.thisGiveupAmount = i.canGiveUpAmount
			}
			this.selectedRows = this.giveUpSelected.slice()
		},
		fpSaveDetails (detail) {
			return Promise.resolve()
		},
		onRefresh () {
			this.$emit('refresh')
		},
		fpOnRowEdit (row, $index, type) {
			return new Promise(resolve => {
				this.$refs[`${type}-${$index}`].focus()
				resolve()
			})
		},
		onCellClick (type) {
			return (row) => {
				this.$refs.detailsTable.setRowEdit(row, type)
			}
		},
		thisAmountRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`thisGiveupAmount-${$index}`}
				vModel={row.thisGiveupAmount}
				isEdit={row.isEdit}
				row={row}
				rowIndex={$index}
				columnProp='thisGiveupAmount'
				cellText={this.$fxCommon.toFixedAutoZeroFill(row.thisGiveupAmount, this.sysPointSize)}
				pointSize={this.sysPointSize}
				on-on-change={this.onThisAmountChange}
			>
			</fx-list-cell-input-number>
		},
		onThisAmountChange (val, row) {
			row.thisGiveupAmount = val
		},
		onEnsure () {
			return this.$refs.detailsTable.getSelectRows().then(selected => {
				const res = this.$fxUtils.deepClone(selected)
				let flag = true
				for (const item of res) {
					if (item.thisGiveupAmount > item.canGiveUpAmount) {
						this.$refs.detailsTable.setRowEdit(item, 'thisGiveupAmount').then(() => {
							this.$refs.detailsTable.$refs.listTable.verificationRowData(item)
						})
						flag = false
						return false
					}
				}
				if (flag) {
					this.$fxConfirm({
						message: '是否确定放弃分派所选品项？',
						selectedRowsLength: res.length
					}).then(() => {
						const sortedData = this.sortArr(res, 'billId')
						const data = sortedData.map(item => {
							return {
								id: item[0].billId,
								details: item.map(detail => {
									return {
										id: detail.detailId,
										outGiveUpAmount: detail.thisGiveupAmount
									}
								})
							}
						})
						const logger = this.$fxLogger.createInfo('stock-sale-manage.assign-manage.out-assign.giveUp', { data: res })
						this.$fxApi(`${apiName}.detailsGiveUp`)({ data, logger }).then(res => {
							this.$emit('refresh', { refreshGiveup: true })
						})
					})
				}
			})
		},
		createMessage (data) {
			return data.map(i => {
				return `系统单号：${i.sysBillCode}，品项名称：${i.collectionData.itemName}，单位：${i.collectionData.unitName}，本次放弃数量：${i.thisGiveupAmount}`
			}).join('；')
		},
		stockWayRender (h, { row, $index }) {
			h = this.$createElement
			return <span>{this.stockWayState(row.stockWay, 'label')}</span>
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
					if (_t.length > 0) {
						_arr.push(_t)
					}
					_t = [arr[i]]
				}
			}
			if (_t.length) {
				_arr.push(_t)
			}
			return _arr
		},
		refreshData () {
			const ids = this.giveUpSelected.map(item => item.detailId)
			const res = []
			for (const i of this.listData) {
				if (ids.includes(i.detailId)) {
					res.push(i)
				}
			}
			this.init(res)
		}
	}
}
</script>


