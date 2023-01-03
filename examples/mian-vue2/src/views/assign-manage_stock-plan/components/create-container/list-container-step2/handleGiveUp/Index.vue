<template>
  <w-dialog
		v-model="dialogVisible"
		title="放弃分派"
		fullscreen
		@close="onRefresh"
	>
    <fx-details-table
			ref="giveupDetailsTable"
			:tableColumn="tableColumn"
			:tableData="giveUpSelected"
			:fpOnRowEdit="fpOnRowEdit"
			:fpSaveDetails="fpSaveDetails"
			:tableEditColumnProp="tableEditColumnProp"
			:tableValiDate="tableValiDate"
			:fullScreenBtn='false'
			:showColumnFilterBtn='false'
			:showDeleteBtn='false'
			:canAdd='false'
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
				{ prop: 'collectionData.organName', label: '买方机构' },
				{ prop: 'itemName', label: '品项名称' },
				{ prop: 'itemSpec', label: '规格' },
				{ prop: 'unitName', label: '单位' },
				{
					prop: 'amount',
					label: '订货数量',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.amount, this.sysPointSize)
					}
				},
				{ prop: 'stockWay', label: '订货方式', fxRender: this.stockWayRender },
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
					fxRender: this.thisGiveupAmountRender,
					click: this.onCellClick('thisGiveupAmount')
				},
				{
					prop: 'giveUpAmount',
					label: '已放弃数量',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.giveUpAmount, this.sysPointSize)
					}
				}
			],
			giveUpSelected: [],
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
		stockWayState () {
			return (val, key) => {
				return this.$fxTypeMiddleware.getCommonTypeItemById('stockWay')(val)[key]
			}
		},
		...mapState({
			sysPointSize: state => state.system.sysPointSize
		})
	},
	methods: {
		init (res) {
			this.giveUpSelected = []
			this.$nextTick(() => {
				if (this.dialogVisible) {
					this.$refs.giveupDetailsTable.clearSelected()
				}
				for (const i of res) {
					i.thisGiveupAmount = i.canGiveUpAmount
				}
				this.giveUpSelected = this.$fxUtils.deepClone(res)
			})
		},
		fpSaveDetails (detail) {
			return Promise.resolve()
		},
		onRefresh () {
			this.giveUpSelected = []
			this.$refs.giveupDetailsTable.clear()
		},
		fpOnRowEdit (row, $index, type) {
			return new Promise(resolve => {
				this.$refs[`${type}-${$index}`].focus()
				resolve()
			})
		},
		onCellClick (type) {
			return (row) => {
				this.$refs.giveupDetailsTable.setRowEdit(row, type)
			}
		},
		thisGiveupAmountRender (h, { row, $index }) {
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
		stockWayRender (h, { row, $index }) {
			h = this.$createElement
			return <span>{this.stockWayState(row.stockWay, 'label')}</span>
		},
		onEnsure () {
			return this.$refs.giveupDetailsTable.getSelectRows().then(res => {
				let flag = true
				for (const item of res) {
					if (item.thisGiveupAmount > item.canGiveUpAmount) {
						this.$refs.giveupDetailsTable.setRowEdit(item, 'thisGiveupAmount').then(() => {
							this.$refs.giveupDetailsTable.$refs.listTable.verificationRowData(item)
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
						const sortedData = this.sortArr(res, 'collectionData.id')
						const data = sortedData.map(item => {
							return {
								id: item[0].collectionData.id,
								details: item.map(detail => {
									return {
										id: detail.id,
										giveUpAmount: detail.thisGiveupAmount
									}
								})
							}
						})
						const logger = this.$fxLogger.createInfo('stock-sale-manage.assign-manage.stock-plan.giveUp', { data: res })
						this.$fxApi(`${apiName}.detailsGiveUp`)({ data, logger }).then(res => {
							this.$emit('refresh', { refreshGiveup: true })
						})
					})
				}
			})
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
		refreshData () {
			const ids = this.giveUpSelected.map(item => item.id)
			const res = []
			for (const i of this.listData) {
				if (ids.includes(i.id)) {
					res.push(i)
				}
			}
			this.init(res)
		}
	}
}
</script>


