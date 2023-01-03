<template>
	<w-collapse v-model="collapseVisible" contentHeight="480px" :fullScreen="isFullScreen" disabled :showArrow="false" title="营业明细">
		<fx-details-table
			ref="detailsTable"
			v-fx-tab:loop.business-data_food-business-order_details.detailsInfo
			:disabled="disabled"
			:tableColumn="tableColumn"
			:tableData="tableDetails"
			:tableExpandEditColumnProp="tableExpandEditColumnProp"
			:mainId="organDetails.id"
			:showFullScreenBtn="!isFullScreen"
			:expandRows="expandRows"
			:fpSaveMain="fSaveMain"
			:fpOnRowEdit="fpOnRowEdit"
			:fpSaveDetails="fpSaveDetails"
			:selectedRows="selectedRows"
			:canAdd="false"
			:showDeleteBtn='false'
			:defaultSortParam="defaultSortParam"
			showSummary
			@on-full-screen-click="onFullScreenClick"
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
	</w-collapse>
</template>
<script>
import { apiName } from '../../Index.vue'
import { mapState, mapGetters } from 'vuex'
import settingMulity from './SettingMulity.vue'
const EDIT_INPUT_EXPAND_TYPE = ['memo']
export default {
	name: 'detailsInfo',
	components: {
		settingMulity
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
		fSaveMain: Function,
		disabled: Boolean,
		selectedRows: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	data () {
		return {
			collapseVisible: true,
			tableColumn: [
				{
					prop: 'item.code',
					label: '菜品编号',
					width: '200px',
					required: true,
					sortable: true
				},
				{ prop: 'item.name', label: '菜品名称', required: true, width: '200px', sortable: true },
				{
					prop: 'item.spec',
					label: '做法',
					width: '200px',
					required: true,
					formatter: (row) => {
						const method = []
						row.methods.forEach(item => {
							method.push(item.name)
						})
						return method.join(', ')
					}
				},
				{
					prop: 'itemUnit.name',
					label: '单位',
					width: '200px',
					required: true
				},
				{
					prop: 'amount',
					label: '总营业数量',
					width: '200px',
					required: true,
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.amount, this.sysPointSize)
					},
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysPointSize)
					}
				},
				{
					prop: 'realSalesMoney',
					label: '实际销售金额',
					width: '200px',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.realSalesMoney, this.sysMoneyPointSize)
					},
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				},
				{
					prop: 'salesMoney',
					label: '折前销售金额',
					width: '200px',
					formatter: (row) => {
						return this.$fxCommon.toFixedAutoZeroFill(row.salesMoney, this.sysMoneyPointSize)
					},
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxCommon.toFixedAutoZeroFill(val, this.sysMoneyPointSize)
					}
				}
			],
			expandRows: [
				{ prop: 'detail1', label: '其他销售明细', render: this.renderExpand1, visible: true }
			]
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize,
			sysPointSize: state => state.system.sysPointSize
		}),
		...mapGetters(['getSysParams']),
		tableExpandEditColumnProp () {
			return EDIT_INPUT_EXPAND_TYPE
		},
		defaultSortParam () {
			return this.getSysParams('SJXZL_INSTORE_ITEM_ORDER', 'value')
		}
	},
	methods: {
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
		fpSaveDetails (detail, origin) {
			return this.onSaveDetailsHandler(detail, origin)
		},
		onSaveDetailsHandler (params, origin) {
			const logger = this.$fxLogger.createInfo('cost-manage.food-business.updateDetails', this.createLoggerParams(params, origin))
			return this.$fxApi(`${apiName}.updateDetails`, params.id, this.organDetails.id)({ data: params, logger }).then(res => {
				return Promise.resolve(res)
			})
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
		onDetailsRefresh (data) {
			this.$emit('on-details-refresh', data)
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
				const params = {
					ids,
					batchSetType: 'memo',
					memo: setting.memo,
					billVersion: this.organDetails.version
				}
				settingInfo = `备注:${setting.memo}`
				const logger = this.$fxLogger.createInfo('cost-manage.food-business.settingMulityDetails', { settingInfo, orderData: this.organDetails, itemNames })
				this.$fxApi(`${apiName}.setMulity`, this.organDetails.id)({ data: params, logger }).then(this.onDetailsRefresh)
			})
		},
		onSettingMulityClose () {
			this.$refs.detailsTable.closeMulitySettingPopver()
		},
		onFullScreenClick (flag) {
			this.$emit('update:isFullScreen', flag)
		},
		onAllFoldclick () {
			return this.$refs.detailsTable.onAllFoldclick()
		},
		clear () {
			this.$refs.detailsTable.clear()
		},
		renderExpand1 (h, { row, $index }) {
			h = this.$createElement
			return (
				<fx-list-extend-row>
					<fx-list-extend-cell labelWidth={'80'} width={70} title="堂食数量：">{this.$fxCommon.toFixedAutoZeroFill(row.hallFoodCount, this.sysPointSize)}</fx-list-extend-cell>
					<fx-list-extend-cell labelWidth={'80'} width={70} title="外带数量：">{this.$fxCommon.toFixedAutoZeroFill(row.takeOutCount, this.sysPointSize)}</fx-list-extend-cell>
					<fx-list-extend-cell labelWidth={'80'} width={70} title="外卖数量：">{this.$fxCommon.toFixedAutoZeroFill(row.carryOutCount, this.sysPointSize)}</fx-list-extend-cell>
					<fx-list-extend-cell labelWidth={'80'} width={70} title="自提数量：">{this.$fxCommon.toFixedAutoZeroFill(row.pickedUpCount, this.sysPointSize)}</fx-list-extend-cell>
					<fx-list-extend-cell labelWidth={'80'} width={70} title="试吃数量：">{this.$fxCommon.toFixedAutoZeroFill(row.tasterCount, this.sysPointSize)}</fx-list-extend-cell>
					<fx-list-extend-cell labelWidth={'80'} width={70} title="员工餐数量：">{this.$fxCommon.toFixedAutoZeroFill(row.staffCount, this.sysPointSize)}</fx-list-extend-cell>
					<fx-list-extend-cell labelWidth={'80'} width={70} title="废弃数量：">{this.$fxCommon.toFixedAutoZeroFill(row.abandonCount, this.sysPointSize)}</fx-list-extend-cell>
					<fx-list-extend-cell labelWidth={'80'} title="明细备注：" width={200} editColumn disabled={ this.disabled } vOn:click={this.extendCellClick('memo', row)}>
						<fx-list-cell-input
							ref={`memo-${$index}`}
							vModel={ row.memo }
							isEdit={ row.isEdit }
							row={ row }
							rowIndex={ $index }
							columnProp='memo'
							maxlength={this.$fxCommon.getFxInputMaxLength('memo')}
							regType={this.$fxCommon.getFxInputReg('memo')}
						></fx-list-cell-input>
					</fx-list-extend-cell>
				</fx-list-extend-row>
			)
		},
		extendCellClick (type, row) {
			return () => {
				this.$refs.detailsTable.setRowEdit(row, type)
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
</style>
