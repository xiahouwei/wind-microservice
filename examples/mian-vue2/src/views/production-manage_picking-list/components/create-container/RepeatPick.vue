<template>
	<w-dialog
		v-model="dialogVisible"
		title="领料"
		@close="onDialogClose"
		width="60%"
	>
		<div class="create-organ">
			<fx-details-table
				ref="detailsTable"
				:canAdd="false"
				:showDeleteBtn='false'
				:fullScreenBtn="false"
				:showColumnFilterBtn="false"
				:showSummary="false"
				:selectable="false"
				:tableValiDate="tableValiDate"
				:tableColumn="tableColumn"
				:tableData="tableData"
			>
			</fx-details-table>
		</div>
		<template slot="footer-right">
			<el-button
				ref="cancelBtn"
				@click="onCancelClick"
			>取消</el-button>
			<fx-button
				ref="saveBtn"
				type="save"
				@click="onSaveClick"
			>保存</fx-button>
		</template>
		<check-err-info ref="checkErrInfo"></check-err-info>
		<uncheck-order-info ref="uncheckOrderInfo" billType="Pick"></uncheck-order-info>
	</w-dialog>
</template>
<script>
import { mapState } from 'vuex'
import checkErrInfo from '@/components/common/Fx-check-err-info.vue'
import uncheckOrderInfo from '@/components/common/Fx-uncheck-order-info.vue'

export default {
	name: 'repeatPick',
	components: {
		checkErrInfo,
		uncheckOrderInfo
	},
	props: {
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	data () {
		return {
			dialogVisible: false,
			tableColumn: [
				{
					prop: 'item.code',
					label: '原料编号',
					width: '120px'
				}, {
					prop: 'item.name',
					label: '原料名称',
					width: '120px'
				}, {
					prop: 'itemUnit.name',
					label: '领料单位',
					width: '100px'
				}, {
					prop: 'planTotal',
					label: '应领数量',
					width: '100px',
					formatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val.planTotal, this.sysPointSize)
					}
				}, {
					prop: 'actualTotal',
					label: '已领数量',
					width: '100px',
					formatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val.actualTotal, this.sysPointSize)
					}
				}, {
					prop: 'pickTotal',
					label: '本次领料数量',
					width: '150px',
					fxRender: this.pickTotalRender
				}
			],
			tableValiDate: [{
				columnProp: 'pickTotal',
				rule: (row, success, error) => {
					if (!row.pickTotal) {
						error('本次领料数量不能为0')
					} else {
						success()
					}
				}
			}],
			tableData: []
		}
	},
	computed: {
		...mapState({
			sysPointSize: state => state.system.sysPointSize,
			sysMoneyPointSize: state => state.system.sysMoneyPointSize,
			sysPricePointSize: state => state.system.sysPricePointSize,
			taxesList: state => state.system.taxesList
		})
	},
	methods: {
		open (pickData) {
			this.tableData = pickData
			this.tableData.map(item => {
				item.pickTotal = (item.planTotal - item.actualTotal) > 0 ? item.item.roundFlag ? Math.floor(item.planTotal - item.actualTotal) : (item.planTotal - item.actualTotal) : 0
			})
			this.dialogVisible = true
		},
		async onSaveClick () {
			const pickParams = []
			for (let i = 0; i < this.tableData.length; i++) {
				await this.$refs.detailsTable.$refs.listTable.verificationRowData(this.tableData[i]).then(res => {
					const pick = {
						pickTotal: res.pickTotal,
						detailId: res.detailId,
						billVersion: res.billVersion,
						item: { id: res.item.id },
						itemUnit: { id: res.itemUnit.id }
					}
					pickParams.push(pick)
				})
			}
			this.onSaveClickHandler(pickParams)
		},
		onSaveClickHandler (pickParams) {
			const repeatPickInfo = this.getRepeatPickInfo()
			const logger = this.$fxLogger.createInfo('production-manage.picking-list.repeatPick', { repeatPickInfo, orderData: this.organDetails })
			return this.$fxApi('pickingList.repeatPick', this.organDetails.id)({ data: pickParams, logger }).then(res => {
				this.onDialogClose(res)
			}).catch(err => {
				if (err.code === 1) {
					const errMessage = this.$fxUtils.JSONparse(err.message) || []
					this.$refs.checkErrInfo.open(errMessage)
				} else if (err.code === 3) {
					const errMessage = this.$fxUtils.JSONparse(err.message) || []
					this.$refs.uncheckOrderInfo.open(errMessage)
				} else {
					return this.$fxMessage.error(err.message || '领料失败，请稍后再试')
				}
			})
		},
		getRepeatPickInfo () {
			return this.tableData.map(item => {
				const name = item.item.name
				const itemUnit = item.itemUnit.name
				const pickTotal = item.pickTotal
				return `品项:${name},单位:${itemUnit},数量:${pickTotal}`
			}).join(';')
		},
		onCancelClick () {
			this.dialogVisible = false
			// this.verificationDetails().then(() => {
			//
			// })
		},
		pickTotalRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-input-number
				ref={`pickTotal-${$index}`}
				vModel={row.pickTotal}
				isEdit={true}
				row={row}
				rowIndex={$index}
				columnProp='pickTotal'
				integer={!!row.item.roundFlag}
				pointSize={this.sysPointSize}
			>
			</fx-list-cell-input-number>
		},
		onDialogClose () {
			this.dialogVisible = false
			this.$emit('on-refresh')
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.create-organ {
	flex: 1
	display: flex;
	flex-direction: column;
	overflow: auto;
}
</style>
