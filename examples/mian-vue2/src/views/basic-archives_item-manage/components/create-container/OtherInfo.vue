<template>
	<w-collapse v-model="collapseVisible" title="其他信息">
		<el-form size="mini" label-width="110px" inline>
			<fx-details-form-row>
				<el-form-item label="参与称重：" class="can-weigh-switch">
					<w-switch
						ref="canWeigh"
						:disabled="disabled"
						v-fx-tab="canWeighTabHandler"
						activeText="参与"
						inactiveText="不参与"
						v-model="organDetails.canWeigh"
					></w-switch>
				</el-form-item>
				<div class="kg-uint-ratio-container">
					<span class="kg-uint-ratio-label">称重单位换算系数：1</span>
					<w-input
						value="Kg"
						class="form-item-input"
						size="mini"
						disabled
					/>
					<span class="kg-uint-ratio-eq">=</span>
					<w-input-number
						ref="kgToMainUnit"
						v-model="organDetails.kgToMainUnit"
						v-fx-tab:focus.roundFlag
						placeholder="请输入"
						size="mini"
						class="form-item-input"
						:disabled="disabled || kgToMainUnitDisabled"
						@blur="onKgToMainUnitBlur"
					>
					</w-input-number>
					<span class="mainFlag fx-ellipsis">{{mainFlag}}</span>
				</div>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item label="取整领料：" class="can-weigh-switch">
					<w-switch
						ref="roundFlag"
						:disabled="disabled"
						v-fx-tab:focus.indexNum
						activeText="开启"
						inactiveText="关闭"
						v-model="organDetails.roundFlag"
					></w-switch>
				</el-form-item>
				<el-form-item label="品项顺序号：">
					<w-input-number
						ref="indexNum"
						v-model="organDetails.indexNum"
						v-fx-tab:focus.minCostMargin
						intLength="8"
						placeholder="请输入"
						integer
						class="form-item-input"
						:disabled="disabled"
					></w-input-number>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item label="成本毛利目标：">
					<w-input-number
						ref="minCostMargin"
						v-model="organDetails.minCostMargin"
						v-fx-tab:focus.maxCostMargin
						:disabled="disabled"
						:pointSize="sysMoneyPointSize"
						:intLength="numberLength"
						class="form-item-input"
						@blur="onMinCostMarginBlur"
					>
						<div slot="suffix">%</div>
					</w-input-number>
					-
					<w-input-number
						ref="maxCostMargin"
						v-model="organDetails.maxCostMargin"
						v-fx-tab="maxCostMarginTabHandler"
						:disabled="disabled"
						:pointSize="sysMoneyPointSize"
						:intLength="numberLength"
						class="form-item-input"
						@blur="onMaxCostMarginBlur"
					>
						<div slot="suffix">%</div>
					</w-input-number>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row v-show="showFoodMargin">
				<el-form-item label="菜品参考毛利率：">
					<w-input-number
						ref="minFoodMargin"
						v-model="organDetails.minFoodMargin"
						v-fx-tab:focus.maxFoodMargin
						:disabled="disabled"
						:pointSize="sysMoneyPointSize"
						:intLength="numberLength"
						class="form-item-input"
						@blur="onMinFoodMarginBlur"
					>
						<div slot="suffix">%</div>
					</w-input-number>
					-
					<w-input-number
						ref="maxFoodMargin"
						v-model="organDetails.maxFoodMargin"
						v-fx-tab:loop.basic-archives_item-manage_details.otherInfo
						:disabled="disabled"
						:pointSize="sysMoneyPointSize"
						:intLength="numberLength"
						class="form-item-input"
						@blur="onMaxFoodMarginBlur"
					>
						<div slot="suffix">%</div>
					</w-input-number>
				</el-form-item>
			</fx-details-form-row>
		</el-form>
	</w-collapse>
</template>
<script>
import { mapState } from 'vuex'
export default {
	name: 'otherInfo',
	props: {
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		mainFlag: String,
		disabled: Boolean
	},
	data () {
		return {
			collapseVisible: false
		}
	},
	computed: {
		...mapState({
			sysMoneyPointSize: state => state.system.sysMoneyPointSize,
			numberLength: state => state.system.numberLength
		}),
		showFoodMargin () {
			return !!this.organDetails.itemCategoryList.find(item => item.category === 1)
		},
		kgToMainUnitDisabled () {
			return !this.organDetails.canWeigh
		}
	},
	methods: {
		validate () {
			return new Promise(resolve => {
				if (this.organDetails.minCostMargin > this.organDetails.maxCostMargin) {
					this.$fxMessage.warning('注：最小成本毛利目标 ≤ 最大成本毛利目标')
					return false
				}
				if (this.organDetails.minFoodMargin > this.organDetails.maxFoodMargin) {
					this.$fxMessage.warning('注：最小菜品参考毛利率 ≤ 最大菜品参考毛利率')
					return false
				}
				resolve()
			})
		},
		isCollapse () {
			return this.collapseVisible
		},
		defaultFocus () {
			this.$fxUtils.vDoRefFocus(this, 'canWeigh')
		},
		canWeighTabHandler ({ focus }) {
			this.kgToMainUnitDisabled ? focus('roundFlag') : focus('kgToMainUnit')
		},
		maxCostMarginTabHandler ({ focus, loop }) {
			this.showFoodMargin ? focus('minFoodMargin') : loop('basic-archives_item-manage_details', 'otherInfo')
		},
		onMinCostMarginBlur (e) {
			if (!e.target.value) {
				this.organDetails.minCostMargin = ''
				this.$refs.minCostMargin.currentValue = ''
			}
		},
		onMaxCostMarginBlur (e) {
			if (!e.target.value) {
				this.organDetails.maxCostMargin = ''
				this.$refs.maxCostMargin.currentValue = ''
			}
		},
		onMinFoodMarginBlur (e) {
			if (!e.target.value) {
				this.organDetails.minFoodMargin = ''
				this.$refs.minFoodMargin.currentValue = ''
			}
		},
		onMaxFoodMarginBlur (e) {
			if (!e.target.value) {
				this.organDetails.maxFoodMargin = ''
				this.$refs.maxFoodMargin.currentValue = ''
			}
		},
		onKgToMainUnitBlur () {
			if (!this.organDetails.kgToMainUnit) {
				this.organDetails.kgToMainUnit = 1
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-item-input {
	width: 100px
	box-sizing: border-box
}
.assis-uint-ratio-container {
	margin-left: 20px
}
.assis-uint-ratio-label {
	margin-right:10px
}
.assis-uint-ratio-eq {
	margin: 0 10px
}
.can-weigh-switch {
	margin-right 70px
}
.kg-uint-ratio-container {
	margin-bottom: 18px
}
.kg-uint-ratio-label {
	margin-right:10px
}
.kg-uint-ratio-eq {
	margin: 0 10px
}
.mainFlag {
	margin-left: 10px
	width: 60px;
	display: inline-block;
	position: relative;
	top: 2px;
}
</style>
