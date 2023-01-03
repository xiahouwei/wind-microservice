<template>
	<w-dialog v-model="dialogVisible" width="1200px" title="异常警告" heightFullscreen @close="clear">
		<div class="create-organ">
			<fx-mistake-check-step :activeStep="5" type="CheckBill"></fx-mistake-check-step>
			<div class="mistake-check-warning fx-warn-font">注：以下盘盈品项的生产日期默认为当前盘点日期，支持修改，若不需要修改请忽略此步骤！</div>
			<fx-details-table
				ref="detailsTable"
				v-fx-tab:focus.saveBtn
				:disabled="authDisabled"
				:tableColumn="tableColumn"
				:tableData="tableData"
				:tableValiDate="tableValiDate"
				:tableEditColumnProp="tableEditColumnProp"
				:fpOnRowEdit="fpOnRowEdit"
				:canAdd="false"
				:showDeleteBtn="false"
				:showColumnFilterBtn="false"
			>
				<settingMulity
					slot="setting-mulity"
					slot-scope="{ visible }"
					:visible="visible"
					:organDetails="organDetails"
					@on-save-click="onSettingMulitySave"
					@on-cancel-click="onSettingMulityClose"
				></settingMulity>
			</fx-details-table>
		</div>
		<template slot="footer">
			<el-button
				ref="saveReturnBtn"
				v-fx-tab:focus.detailsTable
				@click="onSaveReturnClick"
			>保存并返回</el-button>
			<fx-button
				ref="saveBtn"
				:type="actionType"
				v-fx-tab:focus.saveReturnBtn
				@click="onSaveClick"
			>{{actionText}}</fx-button>
		</template>
	</w-dialog>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import { apiName } from '../../Index.vue'
import settingMulity from './SettingMulity.vue'
const EDIT_INPUT_TYPE = ['productDate']
export default {
	name: 'mistakeCheckStep5',
	components: {
		settingMulity
	},
	props: {
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		actionText: String,
		actionType: String
	},
	data () {
		return {
			dialogVisible: false,
			tableColumn: [
				{ prop: 'item.name', label: '品项' },
				{ prop: 'item.spec', label: '规格' },
				{
					prop: 'pyAmount',
					label: '盘盈数量',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.pyAmount, this.sysPointSize)
					}
				},
				{
					prop: 'checkUnit1.name',
					label: '盘盈单位',
					width: '120px',
					required: true
				},
				{
					prop: 'productDate',
					label: '生产日期',
					width: '150px',
					required: true,
					editColumn: true,
					fxRender: this.productDateRender,
					click: this.onCellClick('productDate')
				}
			],
			tableValiDate: [{
				columnProp: 'productDate',
				rule: (row, success, error) => {
					if (row.productDate && !this.$fxUtils.compareDate(this.organDetails.businessDate, row.productDate)) {
						error('生产日期不能大于盘点日期')
					} else {
						success()
					}
				}
			}],
			tableEditColumnProp: EDIT_INPUT_TYPE,
			tableData: []
		}
	},
	computed: {
		...mapState({
			sysPointSize: state => state.system.sysPointSize
		}),
		...mapGetters(['detailsAuthGetter']),
		authDisabled () {
			return !this.detailsAuthGetter('store-manage_take-stock-order.edit-order')
		}
	},
	methods: {
		open (tableData) {
			tableData.forEach(item => {
				item.productDate || (item.productDate = this.organDetails.businessDate)
			})
			this.tableData = tableData
			this.dialogVisible = true
			this.$nextTick(() => {
				this.$fxUtils.vDoRefFocus(this, 'saveBtn')
			})
		},
		onSaveReturnClick () {
			this.$fxConfirm('确定保存并返回详情？').then(() => {
				this.onSaveTableListCheck().then(this.onSaveHandler).then(() => {
					this.dialogVisible = false
				})
			})
		},
		onSaveTableListCheck () {
			return this.$refs.detailsTable.checkDetailsUnSaving().then(this.tableDataValiDate)
		},
		onSaveClick () {
			this.onSaveTableListCheck().then(this.onSaveHandler).then(() => {
				this.dialogVisible = false
				this.$emit('on-finish', 'PyModProductDate')
			})
		},
		tableDataValiDate () {
			return new Promise(resolve => {
				const res = this.tableData.some(item => {
					return item.productDate && !this.$fxUtils.compareDate(this.organDetails.businessDate, item.productDate)
				})
				if (res) {
					this.$fxMessage.warning('生产日期不能大于盘点日期')
				} else {
					resolve()
				}
			})
		},
		onSaveHandler () {
			const loggerInfo = this.getLoggerInfo()
			const logger = this.$fxLogger.createInfo('store-manage.take-stock-order.updateProductDate', { orderData: this.organDetails, loggerInfo })
			const params = this.tableData.map(item => {
				return {
					detailId: item.id,
					productDate: item.productDate
				}
			})
			return this.$fxApi(`${apiName}.updateProductDate`, this.organDetails.id)({ data: params, logger })
		},
		getLoggerInfo () {
			return this.tableData.map(item => {
				const name = item.item.name
				const productDate = item.productDate
				return `品项名称:${name},生产日期:${productDate}`
			}).join(';')
		},
		productDateRender (h, { row, $index }) {
			h = this.$createElement
			const pickerOptions = {
				disabledDate: date => {
					return date.getTime() > new Date(this.organDetails.businessDate).getTime()
				}
			}
			return <fx-list-cell-date
				ref={`productDate-${$index}`}
				vModel={ row.productDate }
				isEdit={ row.isEdit }
				row={ row }
				rowIndex={ $index }
				pickerOptions={ pickerOptions }
				valueFormat="yyyy-MM-dd HH:mm:ss"
				columnProp='productDate'
				placement='top'
				clearable
				cellText={this.$fxUtils.formatterDateTime(row.productDate)}
			>
			</fx-list-cell-date>
		},
		onCellClick (type) {
			return (row) => {
				this.$refs.detailsTable.setRowEdit(row, type)
			}
		},
		fpOnRowEdit (row, $index, type) {
			return new Promise(resolve => {
				this.$refs[`${type}-${$index}`].focus()
				resolve()
			})
		},
		onSettingMulitySave (setting) {
			this.$refs.detailsTable.getSelectRows().then(res => {
				res.forEach(item => {
					item.productDate = setting.productDate
				})
				this.$fxMessage.success('批量设置成功！')
			})
		},
		onSettingMulityClose () {
			this.$refs.detailsTable.closeMulitySettingPopver()
		},
		clear () {
			this.$emit('on-mistake-close')
			this.$refs.detailsTable.clear()
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
	.mistake-check-warning {
		height: 24px
		line-height: 24px
	}
}
</style>
