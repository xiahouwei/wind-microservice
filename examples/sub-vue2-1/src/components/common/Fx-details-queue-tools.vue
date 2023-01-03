<template>
	<div class="details-queue-tools">
		<el-tooltip :disabled="!prevTip" effect="dark" :content="prevTip" placement="top">
			<el-button
				ref="prevBtn"
				type="primary"
				@click="onBillChange('prev')"
			>{{prevLabel}}</el-button>
		</el-tooltip>
		<el-tooltip :disabled="!nextTip" effect="dark" :content="nextTip" placement="top">
			<el-button
				ref="nextBtn"
				type="primary"
				@click="onBillChange('next')"
			>{{nextLabel}}</el-button>
		</el-tooltip>
		<el-tooltip :disabled="!billCheckedTip" effect="dark" :content="billCheckedTip" placement="top">
			<el-checkbox
				ref="billCheckedBtn"
				:value="tableQueueUtils.checked"
				:label="billCheckedLabel"
				border
				class="bill-checked-btn"
				@change="onBillCheckedChange"
				@keydown.native.tab.stop="billCheckedBtnTabHandler"
				@keydown.native.enter.stop="billCheckedBtnEnterHandler"
			></el-checkbox>
		</el-tooltip>
	</div>
</template>
<script>
export default {
	name: 'fx-details-queue-tools',
	props: {
		billId: String,
		tableQueueUtils: {
			type: Object,
			default: () => {
				return {}
			}
		},
		prevLabel: {
			type: String,
			default: '上一张'
		},
		nextLabel: {
			type: String,
			default: '下一张'
		},
		prevTip: String,
		nextTip: String,
		checkTip: String,
		uncheckTip: String
	},
	computed: {
		billCheckedLabel () {
			return this.tableQueueUtils.checked ? '已选中' : '未选中'
		},
		billCheckedTip () {
			return this.tableQueueUtils.checked ? this.checkTip : this.uncheckTip
		}
	},
	methods: {
		onBillChange (type) {
			this.$emit('on-bill-change', type)
		},
		onBillCheckedChange (val) {
			this.tableQueueUtils.setChecked(val)
			this.tableQueueUtils.checkedChange(this.billId, val)
		},
		defaultFocus () {
			this.$fxUtils.vDoRefFocus(this, 'prevBtn')
		},
		billCheckedBtnTabHandler (e) {
			this.$emit('on-tab', e)
		},
		billCheckedBtnEnterHandler () {
			this.tableQueueUtils.setChecked(!this.tableQueueUtils.checked)
			this.tableQueueUtils.checkedChange(this.billId, !this.tableQueueUtils.checked)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.details-queue-tools {
	.bill-checked-btn {
		width: 90px
		margin-left: 10px
	}
	display: inline-block
	margin-left: 10px
}
</style>

