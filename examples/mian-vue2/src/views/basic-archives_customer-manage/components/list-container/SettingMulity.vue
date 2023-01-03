<template>
	<div class="setting-mulity">
		<div class="check-item-container" v-show="showCheckItem">
			<fx-list-virtual-table
				ref="listTable"
				minWidth="300"
				:showTools="false"
				:selectable="false"
				:showPagination="false"
				:tableColumn="tableColumn"
				:listData="settingMulitySelectRows"
			>
			</fx-list-virtual-table>
		</div>
		<el-form size="mini" label-width="80px" class="setting-mulity_form">
			<el-form-item label="将字段：" class="form-item">
				<w-select
					v-model="settingKey"
					class="form-input"
					:optionlist="columnSelectList"
				>
				</w-select>
			</el-form-item>
			<div class="form-edit-text">修改为</div>
			<div class="form-content">
				<div v-show="settingKey===1">
					<w-select
						v-model="stockPlanId"
						:loading="selectLoading"
						:optionlist="stockPlanList"
						:fpSelectShow="fpSelectShow"
						clearable
						class="form-input-long"
						@change="onStockPlanChange"
					>
					</w-select>
				</div>
			</div>
			<div class="form-footer">
				<div class="left-btn">
					<el-button type="primary" plain @click="onCheckClick">查看客户</el-button>
				</div>
				<div class="right-btn">
					<el-button type="danger" plain @click="onCancelClick">取消</el-button>
					<el-button type="primary" plain @click="onSaveClick">确认</el-button>
				</div>
			</div>
		</el-form>
	</div>
</template>
<script>
export default {
	name: 'settingMulity',
	props: {
		visible: Boolean,
		settingMulitySelectRows: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	data () {
		return {
			columnSelectList: [{
				id: 1,
				name: '订货方案'
			}],
			settingKey: 1,
			stockPlan: {},
			stockPlanId: '',
			stockPlanList: [],
			tableColumn: [
				{ prop: 'code', label: '客户编号' },
				{ prop: 'name', label: '客户名称' }
			],
			showCheckItem: false,
			selectLoading: false,
			fxCache: this.$fxUtils.fxCache('customer')
		}
	},
	watch: {
		visible (val) {
			if (val) {
				this.refreshFormData()
			}
		}
	},
	methods: {
		onSaveClick () {
			const ids = this.settingMulitySelectRows.map(item => item.id)
			if (!this.settingMulitySelectRows.length) {
				this.$fxMessage.success('设置完成')
				return false
			}
			const params = {
				customerIds: ids,
				stockPlanId: this.stockPlanId
			}
			const logger = this.$fxLogger.createInfo('basic-archives.customer-manage.settingMulity', { settingInfo: this.getSettingInfo(this.settingMulitySelectRows) })
			return this.$fxApi('customer.settingMulity')({ data: params, logger }).then(() => {
				this.$fxMessage.success('设置成功')
				this.$emit('on-setting-mulity-save')
			})
		},
		getSettingInfo (settingMulitySelectRows) {
			const settingItem = settingMulitySelectRows.map(item => item.name).join(',')
			return `客户:${settingItem};将订货方案设置为“${this.stockPlan.name}”`
		},
		onCancelClick () {
			this.$emit('update:visible', false)
		},
		refreshFormData () {
			this.fxCache.clear()
			this.settingKey = 1
			this.stockPlan = {}
			this.stockPlanId = ''
			this.stockPlanList = []
			this.showCheckItem = false
		},
		fpSelectShow () {
			this.selectLoading = true
			return this.getStockPlanList().then(res => {
				this.stockPlanList = res
				this.selectLoading = false
				return Promise.resolve()
			})
		},
		getStockPlanList () {
			const ids = this.settingMulitySelectRows.map(item => item.id)
			const key = `stockPlanList.${ids.join(',')}`
			return this.fxCache.cacher(key, this.$fxApi('customer.getStockPlanList')({ data: ids }))
		},
		onStockPlanChange (id, plan) {
			this.stockPlan = plan
		},
		onCheckClick () {
			this.showCheckItem = !this.showCheckItem
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.setting-mulity {
	display: flex
	flex-direction: column
	height: 300px
	font-size: 12px
	.check-item-container {
		position absolute
		left -305px
		top -1px
		width 300px
		height 326px
		background-color $fxWhite
		box-shadow 0 2px 12px 0 rgba(0 0 0 0.1)
		border-radius 4px
	}
	.setting-mulity_form {
		display: flex
		flex-direction: column
		flex: 1
		.form-input {
			width: 150px
			>>>.el-input__inner {
				padding-right 20px
			}
		}
		.form-input-long {
			margin-left 20px
			width 230px
		}
		.form-item {
			margin-bottom: 10px
		}
		.form-edit-text {
			height: 26px
			line-height: 26px
			padding-left: 20px
		}
		.form-content {
			flex: 1
			padding-top 20px
			border: 1px solid $fxBorder
		}
		.form-footer {
			display flex
			justify-content space-between
			margin-top: 10px
			margin-bottom: 5px
		}
	}
}
</style>
