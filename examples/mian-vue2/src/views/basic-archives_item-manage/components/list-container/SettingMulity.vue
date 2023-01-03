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
				<div v-show="settingKey===0">
					<el-checkbox-group class="checkbox-group" v-model="itemCategoryListSelect">
						<el-checkbox :label=0 :disabled='label0disabled' class="checkbox-item">原料/物料</el-checkbox>
						<el-checkbox :label=1 :disabled='label1disabled' class="checkbox-item">菜品</el-checkbox>
						<el-checkbox :label=2 :disabled='label2disabled' class="checkbox-item">商品</el-checkbox>
					</el-checkbox-group>
				</div>
				<div v-show="settingKey===1">
					<el-form-item label="" class="form-item">
						<w-select
							v-model="offsetMethod"
							:optionlist="offsetMethodList"
							:optionProp="optionProp"
							class="form-input"
							@change='offsetMethodChange'
						>
						</w-select>
					</el-form-item>
					<el-form-item label="冲减方式" class="form-item">
						<w-select
							v-model="consumptionMethod"
							:optionlist="consumptionMethodList"
							:optionProp="optionProp"
							:disabled="consumptionMethodDisabled"
							class="form-input"
						>
						</w-select>
					</el-form-item>
				</div>
				<div v-show="settingKey===2">
					<w-select
						v-model="financeSortId"
						:optionlist="financialClassList"
						clearable
						class="form-input-long"
					>
					</w-select>
				</div>
				<div v-show="settingKey===3">
					<el-form-item label="参与称重：" label-width="87px" class="can-weigh-switch">
						<w-switch
							v-model="canWeigh"
							activeText="参与"
							inactiveText="不参与"
						></w-switch>
					</el-form-item>
					<div class="kg-uint-ratio-container">
						<div class="kg-uint-ratio-label">称重单位换算系数：</div>
						<div class="kg-uint-ratio-content">
							<span>1【Kg】= </span>
							<w-input-number
								v-model="kgToMainUnit"
								placeholder="请输入"
								size="mini"
								class="form-input-number"
								:disabled="!canWeigh"
								@blur="onKgToMainUnitBlur"
							>
							</w-input-number>
							<span>【品项最小单位】</span>
						</div>
					</div>
				</div>
			</div>
			<div class="form-footer">
				<div class="left-btn">
					<el-button type="primary" plain @click="onCheckClick">查看品项</el-button>
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
				id: 0,
				name: '品项类型'
			}, {
				id: 1,
				name: '耗用方式'
			}, {
				id: 2,
				name: '财务分类'
			}, {
				id: 3,
				name: '参与称重'
			}],
			settingKey: 0,
			itemCategoryListSelect: [0],
			offsetMethod: '2',
			consumptionMethod: '1',
			financeSortId: '',
			canWeigh: 1,
			kgToMainUnit: 1,
			consumptionMethodList: this.$fxTypeMiddleware.getCommonTypeList('consumptionMethodType'),
			offsetMethodList: this.$fxTypeMiddleware.getCommonTypeList('offsetMethodType'),
			financialClassList: [],
			optionProp: {
				name: 'label'
			},
			tableColumn: [
				{ prop: 'name', label: '品项名称' },
				{ prop: 'code', label: '品项编号' }
			],
			showCheckItem: false
		}
	},
	computed: {
		label0disabled () {
			return JSON.stringify(this.itemCategoryListSelect) === JSON.stringify([0])
		},
		label1disabled () {
			return JSON.stringify(this.itemCategoryListSelect) === JSON.stringify([1])
		},
		label2disabled () {
			return JSON.stringify(this.itemCategoryListSelect) === JSON.stringify([2])
		},
		consumptionMethodDisabled () {
			return this.offsetMethod === '1'
		}
	},
	watch: {
		visible (val) {
			if (val) {
				this.refreshFormData()
				this.getFinancialList()
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
			let operColumn = ''
			switch (this.settingKey) {
			case 0:
				operColumn = 'category'
				break
			case 1:
				operColumn = 'offsetMethod'
				break
			case 2:
				operColumn = 'financeSortId'
				break
			case 3:
				operColumn = 'canWeigh'
				break
			}
			const params = {
				ids,
				operColumn,
				offsetMethod: this.offsetMethod,
				consumptionMethod: this.consumptionMethod,
				financeSortId: this.financeSortId,
				category: this.itemCategoryListSelect,
				canWeigh: this.canWeigh,
				kgToMainUnit: this.kgToMainUnit
			}
			const logger = this.$fxLogger.createInfo('basic-archives.item-manage.settingMulity', { settingInfo: this.getSettingInfo(this.settingMulitySelectRows) })
			return this.$fxApi('item.settingMulity')({ data: params, logger }).then(() => {
				this.$fxMessage.success('设置成功')
				this.$emit('on-setting-mulity-save')
			})
		},
		getSettingInfo (settingMulitySelectRows) {
			const categoryInfoMap = {
				0: '原料/物料',
				1: '菜品',
				2: '商品'
			}
			const settingItem = settingMulitySelectRows.map(item => item.name).join(',')
			let settingKey = ''
			let settingInfo = ''
			switch (this.settingKey) {
			case 0:
				settingKey = '品项类别'
				settingInfo = this.itemCategoryListSelect.map(item => categoryInfoMap[item]).join(',')
				break
			case 1:
				if (this.offsetMethod === '1') {
					settingKey = '耗用方式'
					settingInfo = this.$fxTypeMiddleware.getCommonTypeItemById('offsetMethodType')(this.offsetMethod).label
				} else {
					settingKey = '耗用方式/冲减方式'
					settingInfo = this.$fxTypeMiddleware.getCommonTypeItemById('offsetMethodType')(this.offsetMethod).label + '/' + this.$fxTypeMiddleware.getCommonTypeItemById('consumptionMethodType')(this.consumptionMethod).label
				}
				break
			case 2:
				settingKey = '财务分类'
				settingInfo = this.financialClassList.find(item => item.id === this.financeSortId).name
				break
			case 3:
				settingKey = '参与称重'
				settingInfo = this.canWeigh ? `参与称重,称重单位换算系数：1【Kg】= ${this.kgToMainUnit}【品项最小单位】` : '不参与称重'
				break
			}
			return `品项:${settingItem},将“${settingKey}”修改为“${settingInfo}”`
		},
		onCancelClick () {
			this.$emit('update:visible', false)
		},
		refreshFormData () {
			this.settingKey = 0
			this.itemCategoryListSelect = [0]
			this.offsetMethod = '2'
			this.consumptionMethod = '1'
			this.financeSortId = ''
			this.showCheckItem = false
		},
		offsetMethodChange (e) {
			if (e === '1') {
				this.consumptionMethod = ''
			} else {
				this.consumptionMethod = '1'
			}
		},
		getFinancialList () {
			return this.$fxApi('finance.getFinancialList')({ data: [], loading: false }).then(res => {
				this.financialClassList = res
				return Promise.resolve(res)
			})
		},
		onCheckClick () {
			this.showCheckItem = !this.showCheckItem
		},
		onKgToMainUnitBlur () {
			if (!this.kgToMainUnit) {
				this.kgToMainUnit = 1
			}
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
			.checkbox-group {
				margin-left 20px
				.checkbox-item {
					margin-right 20px
				}
			}
		}
		.kg-uint-ratio-container {
			padding-left 15px
			color $fxBlack1
			.kg-uint-ratio-label {
				margin-bottom 10px
			}
			.form-input-number {
				width 90px
			}
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
