<template>
	<w-collapse v-model="collapseVisible" title="财务设置">
		<el-form ref="form" :model="organDetails" size="mini" label-width="100px" inline>
			<fx-details-form-row>
				<el-form-item slot="left" prop="accountPeriod" label="账期：">
					<el-radio-group v-model="organDetails.financeSetting.accountPeriod" :disabled="disabled">
						<el-radio :label="1">现结</el-radio>
						<el-radio :label="2">月结</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item v-show="organDetails.financeSetting.accountPeriod === 2" slot="right" prop="monthBalanceWay" label="月结方式：">
					<w-select
						ref='monthBalanceWay'
						v-model="organDetails.financeSetting.monthBalanceWay"
						v-fx-tab:focus.days
						class="form-item-input"
						:disabled='disabled'
						:optionlist="monthBalanceTypeSelectList"
					>
					</w-select>
				</el-form-item>
				<el-form-item v-show="organDetails.financeSetting.accountPeriod === 2" slot="right" prop="days">
					<w-input-number
						ref='days'
						v-model="organDetails.financeSetting.monthBalanceCycle"
						v-fx-tab:loop.basic-archives_supplier-manage_details.financialSetting
						:min="1"
						:max="31"
						:intLength="2"
						integer
						:disabled='disabled'
						class="date-days"
					/>
					<span>{{ organDetails.financeSetting.monthBalanceWay === '2-1' ? '日' : '天'}}</span>
				</el-form-item>
			</fx-details-form-row>
		</el-form>
	</w-collapse>
</template>
<script>
export default {
	name: 'financialSetting',
	props: {
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		disabled: Boolean
	},
	data () {
		return {
			collapseVisible: false,
			monthBalanceTypeSelectList: this.$fxTypeMiddleware.getCommonTypeList('monthBalanceType')
		}
	},
	methods: {
		isCollapse () {
			return this.collapseVisible
		},
		isMonthBalance () {
			return this.organDetails.financeSetting.accountPeriod === 2
		},
		defaultFocus () {
			this.$fxUtils.vDoRefFocus(this, 'monthBalanceWay')
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-item-input {
	width: 175px
	box-sizing: border-box
}
.date-days {
	width: 50px
	margin-right: 10px
}
</style>
