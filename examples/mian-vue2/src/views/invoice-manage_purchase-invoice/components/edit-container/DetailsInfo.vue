<template>
	<w-collapse v-model="collapseVisible" contentHeight="400px" :fullScreen="isFullScreen" disabled :showArrow="false" title="品项信息">
		<div class="details-info-content">
			<fx-details-table
				ref="detailsTable"
				:tableColumn="tableColumn"
				:tableData="tableDetails"
				:canAdd="false"
				:selectable="false"
				:showColumnFilterBtn="false"
				:showFullScreenBtn="!isFullScreen"
				:showDeleteBtn="false"
				:showIndex="false"
				showSummary
				@on-full-screen-click="onFullScreenClick"
			>
			<template slot="btn-tools-left-right">
				<el-button type="primary" :disabled="disabled || articulationDisabled" @click="onArticulationClick">勾稽</el-button>
			</template>
			</fx-details-table>
			<el-form ref="form" :model="organDetails" :rules="rules" size="mini" label-width="100px" inline class="details-info-content-form">
				<fx-details-form-row>
					<el-form-item slot="left" prop="totalMoney" label="价税合计：">
							<w-input-number
								v-model="organDetails.totalMoney"
								pointSize="2"
								class="form-item-input"
								:disabled="disabled || editDisabled"
								@blur="onMoneyBlur"
							></w-input-number>
						</el-form-item>
						<el-form-item slot="right" label-width="140px"  class="form-label-padding" label="价税合计（大写）：">
							<div style="fontSize:12px">{{organDetails.totalMoneyInWords}}</div>
						</el-form-item>
				</fx-details-form-row>
			</el-form>
		</div>
	</w-collapse>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
export default {
	name: 'detailsInfo',
	props: {
		isFullScreen: Boolean,
		tableDetails: {
			type: Array,
			default: () => {
				return []
			}
		},
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		disabled: Boolean
	},
	data () {
		const validateInvoicingMoney = (rule, value, callback) => {
			if (!value || value === 0) {
				callback(new Error('价税合计必须大于0'))
			} else {
				callback()
			}
		}
		return {
			collapseVisible: true,
			rules: {
				totalMoney: [{ required: true, trigger: 'no', validator: validateInvoicingMoney }]
			},
			tableColumn: [
				{ prop: 'item.name', label: '品项名称', width: '150px' },
				{ prop: 'amount', label: '数量' },
				{ prop: 'itemUnit.name', label: '单位' },
				{ prop: 'price', label: '单价' },
				{
					prop: 'money',
					label: '金额',
					width: '150px',
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxUtils.toFixed(val, this.sysMoneyPointSize, false)
					}
				},
				{
					prop: 'taxRate',
					label: '税率',
					width: '100px',
					formatter: (row) => {
						return (row.taxRate * 100) + '%'
					}
				},
				{
					prop: 'taxRateMoney',
					label: '税额',
					width: '150px',
					summary: true,
					summaryFormatter: (val) => {
						return this.$fxUtils.toFixed(val, this.sysMoneyPointSize, false)
					}
				}
			]
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize
		}),
		...mapGetters(['detailsAuthGetter']),
		editDisabled () {
			return !this.detailsAuthGetter('financial-manage_invoice-manage_purchase-invoice.edit-purchase-invoice')
		},
		articulationDisabled () {
			return !this.detailsAuthGetter('financial-manage_invoice-manage_purchase-invoice.articulation-purchase-invoice')
		}
	},
	methods: {
		onFullScreenClick (flag) {
			this.$emit('update:isFullScreen', flag)
		},
		onArticulationClick () {

		},
		validate () {
			return this.$refs.form.validate()
		},
		onMoneyBlur (e) {
			const money = e.target.value
			const totalMoneyInWords = this.$fxUtils.convertCurrency(money)
			this.organDetails.totalMoneyInWords = totalMoneyInWords
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.details-info-content {
	display flex
	flex-direction column
	height 100%
	&-form {
		margin-top 10px
	}
}
.form-item-input {
	width: 175px
	box-sizing: border-box
}
.form-label-padding {
	>>>.el-form-item__label {
		padding-left 10px
	}
}
</style>
