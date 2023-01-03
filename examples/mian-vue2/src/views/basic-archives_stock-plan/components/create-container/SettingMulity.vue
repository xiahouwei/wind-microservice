<template>
	<div class="setting-mulity">
		<el-form size="mini" label-width="80px" class="setting-mulity_form">
			<el-form-item label="将字段：" class="form-item">
				<w-select
					v-model="settingKey"
					:optionlist="computedColumnSelectList"
					:optionProp="optionProp"
					class="form-input"
					@change='onTitleChange'
				>
				</w-select>
			</el-form-item>
			<div class="form-edit-text">修改为</div>
			<div class="form-content">
				<div v-show="settingKey===0">
					<div class="supperLimitRadio">
						<el-radio-group v-model="supperLimitRadio">
							<el-radio :label="1" class="strategy-radio-item strategy-radio-fix">有上限</el-radio>
							<el-radio :label="2" class="strategy-radio-item">无上限</el-radio>
						</el-radio-group>
					</div>
					<div class="strategy-content">
						<el-form-item label="上限：" class="form-item">
							<w-input-number :disabled='supperLimitRadio===2' v-model="supperLimit" class="form-input"></w-input-number>
						</el-form-item>
					</div>
				</div>
				<div v-show="settingKey===1">
					<div class="supperLimitRadio">
						<el-radio-group v-model="lowerLimitRadio">
							<el-radio :label="1" class="strategy-radio-item strategy-radio-fix">有下限</el-radio>
							<el-radio :label="2" class="strategy-radio-item">无下限</el-radio>
						</el-radio-group>
					</div>
					<div class="strategy-content">
						<el-form-item label="下限：" class="form-item">
							<w-input-number :disabled='lowerLimitRadio===2' v-model="lowerLimit" class="form-input"></w-input-number>
						</el-form-item>
					</div>
				</div>
				<div v-show="settingKey===2">
					<div class="supperLimitRadio">
						<el-radio-group v-model="roundingRadio">
							<el-radio :label="1" class="strategy-radio-item strategy-radio-fix">限制</el-radio>
							<el-radio :label="0" class="strategy-radio-item">不限制</el-radio>
						</el-radio-group>
					</div>
					<div class="strategy-content">
						<el-form-item label="倍数：" class="form-item">
							<w-input-number :disabled='roundingRadio===0' v-model="rounding" class="form-input" pointSize='2'></w-input-number>
						</el-form-item>
					</div>
				</div>
				<div v-show="settingKey===3">
					<div class="supperLimitRadio">
						<el-radio-group v-model="mustFlag">
							<el-radio :label="1" class="strategy-radio-item strategy-radio-fix">必须采购</el-radio>
							<el-radio :label="0" class="strategy-radio-item">非必须采购</el-radio>
						</el-radio-group>
					</div>
				</div>
				<div v-show="settingKey===4">
					<div class="supperLimitRadio">
						<w-input-number v-model="arrivalCycle" class="arrivalCycle" :integer="true" @change="onInputChange"></w-input-number>
						<span> 小时</span>
					</div>
				</div>
				<div v-show="settingKey===5">
					<div class="supperLimitRadio">
						<el-radio-group v-model="stockCycleRadio">
							<el-radio :label="1" class="strategy-radio-item strategy-radio-fix">每天采购</el-radio>
							<el-radio :label="4" class="strategy-radio-item">月末采购</el-radio>
							<el-radio :label="5" class="strategy-radio-item strategy-radio-fix">隔天采购</el-radio>
							<el-radio :label="2" class="strategy-radio-item">每周固定日采购</el-radio>
							<el-radio :label="3" class="strategy-radio-item strategy-radio-fix">每月固定日采购</el-radio>
						</el-radio-group>
					</div>
					<div class="checkbox-container">
						<div v-show="stockCycleRadio===2">
							<el-checkbox-group v-model="buyEachWeek" size="mini">
								<el-checkbox label="1" border>周一</el-checkbox>
								<el-checkbox label="2" border>周二</el-checkbox>
								<el-checkbox label="3" border>周三</el-checkbox>
								<el-checkbox label="4" border>周四</el-checkbox>
								<el-checkbox label="5" border>周五</el-checkbox>
								<el-checkbox label="6" border>周六</el-checkbox>
								<el-checkbox label="7" border>周日</el-checkbox>
							</el-checkbox-group>
						</div>
						<div v-show="stockCycleRadio===3">
							<el-checkbox-group v-model="buyEachMonth" size="mini">
								<el-checkbox :label="item.id" border v-for="item of days31" :key='item.id'>{{item.label}}</el-checkbox>
								<el-checkbox :label="32" border :key='32' class='lastday'>月末最后一天</el-checkbox>
							</el-checkbox-group>
						</div>
						<w-input-number v-model="stockCycle" class="arrivalCycle" v-show="stockCycleRadio===5" @change='onStockCycleChange' :integer='true'></w-input-number>
						<span v-show="stockCycleRadio===5"> 天</span>
					</div>
				</div>
				<div v-show="settingKey===6">
					<div class="select-container">
						<el-form-item label="卖方机构" class="form-item">
							<w-select
								ref="organ"
								v-model="organ"
								:optionlist="organSelectList"
								class="form-input"
								@change='onOrganChange'
								@visible-change="onOrganSelectVisibleChange"
							>
							</w-select>
						</el-form-item>
						<el-form-item label="出库仓库" class="form-item">
							<w-select
								ref="store"
								v-model="store"
								:optionlist="storeSelectList"
								class="form-input"
								dropdownWidth="240px"
								:optionRender="optionRender"
								@change='onStoreChange'
								@visible-change="onStoreSelectVisibleChange"
							>
							</w-select>
						</el-form-item>
					</div>
				</div>
			</div>
			<div class="form-footer">
				<el-button type="danger" plain @click="onCancelClick">取消</el-button>
				<el-button type="primary" plain @click="onSaveClick">保存</el-button>
			</div>
		</el-form>
	</div>
</template>
<script>
export default {
	name: 'settingMulity',
	props: {
		visible: Boolean,
		sellerSelectList: {
			type: Array,
			default: () => {
				return []
			}
		},
		organSelectList: {
			type: Array,
			default: () => {
				return []
			}
		},
		showHouse: Boolean
	},
	inject: ['initPopoverConnectTarget', 'removePopoverConnectTarget'],
	watch: {
		visible (val) {
			if (!val) {
				this.refreshFormData()
			} else {
				this.$emit('on-setting-mulity-show')
			}
		},
		supperLimitRadio (val) {
			if (val === 2) {
				this.supperLimit = 0
			}
		},
		lowerLimitRadio (val) {
			if (val === 2) {
				this.lowerLimit = 0
			}
		},
		roundingRadio (val) {
			if (val === 0) {
				this.rounding = 0
			}
		}
	},
	computed: {
		days31 () {
			return this.daysList(31)
		},
		computedColumnSelectList () {
			return this.showHouse ? this.columnSelectList : this.columnSelectList.slice(1)
		}
	},
	data () {
		return {
			columnSelectList: [{
				id: 6,
				label: '出库仓库'
			}, {
				id: 0,
				label: '订货上限'
			}, {
				id: 1,
				label: '订货下限'
			}, {
				id: 2,
				label: '订货倍数'
			}, {
				id: 3,
				label: '必订品项'
			}, {
				id: 4,
				label: '到货周期'
			}, {
				id: 5,
				label: '订货周期'
			}],
			supperLimitRadio: 1,
			supperLimit: 0,
			lowerLimitRadio: 1,
			lowerLimit: 0,
			roundingRadio: 1,
			rounding: 0,
			mustFlag: 1,
			settingKey: this.showHouse ? 6 : 0,
			arrivalCycle: 0,
			stockCycleRadio: 1,
			buyEachWeek: [],
			stockCycle: 0,
			buyEachMonth: [],
			optionProp: {
				name: 'label'
			},
			organ: '',
			store: '',
			storeSelectList: [],
			storeName: '',
			organName: ''
		}
	},
	methods: {
		onSaveClick () {
			let stockCycle = ''
			if (this.stockCycleRadio === 5) {
				if (!this.stockCycle) {
					this.$fxMessage.warning('天数不能为0')
					return false
				}
				stockCycle = this.stockCycle
			} else if (this.stockCycleRadio === 2) {
				if (!this.buyEachWeek.length) {
					this.$fxMessage.warning('请至少选择一天')
					return false
				}
				stockCycle = this.buyEachWeek.sort().join(',')
			} else if (this.stockCycleRadio === 3) {
				if (!this.buyEachMonth.length) {
					this.$fxMessage.warning('请至少选择一天')
					return false
				}
				stockCycle = this.buyEachMonth.sort((a, b) => {
					return a - b
				}).join(',')
			}
			if (this.settingKey === 0 && this.supperLimitRadio === 1 && !this.supperLimit) {
				this.$fxMessage.warning('订货上限不能为0')
				return false
			} else if (this.settingKey === 1 && this.lowerLimitRadio === 1 && !this.lowerLimit) {
				this.$fxMessage.warning('订货下限不能为0')
				return false
			} else if (this.settingKey === 2 && this.roundingRadio === 1 && !this.rounding) {
				this.$fxMessage.warning('订货倍数不能为0')
				return false
			}
			let cycleDay = []
			if (this.stockCycleRadio === 2) {
				cycleDay = this.buyEachWeek
			} else if (this.stockCycleRadio === 3) {
				cycleDay = this.buyEachMonth
			}
			const params = {
				type: this.settingKey,
				supperLimit: this.supperLimit,
				lowerLimit: this.lowerLimit,
				roundingWay: this.roundingRadio,
				roundingNum: this.rounding,
				mustFlag: this.mustFlag,
				arrivalCycle: this.arrivalCycle,
				cycleWay: this.stockCycleRadio,
				stockCycle,
				cycleDay,
				sellerOrgan: this.organ,
				sellerHouse: this.store,
				sellerHouseName: this.storeName,
				sellerOrganName: this.organName
			}
			this.$emit('on-save-click', params)
		},
		onCancelClick () {
			this.$emit('on-cancel-click')
		},
		refreshFormData () {
			this.supperLimitRadio = 1
			this.supperLimit = 0
			this.lowerLimitRadio = 1
			this.lowerLimit = 0
			this.roundingRadio = 1
			this.rounding = 0
			this.mustFlag = 1
			this.settingKey = this.showHouse ? 6 : 0
			this.arrivalCycle = 0
			this.stockCycleRadio = 1
			this.buyEachWeek = []
			this.stockCycle = 0
			this.buyEachMonth = []
			this.organ = ''
			this.store = ''
		},
		daysList (i) {
			const list = [...Array(i).keys()].map(item => {
				return {
					label: ('0' + (item + 1)).slice(-2),
					id: item + 1
				}
			})
			return list
		},
		onTitleChange () {
			this.supperLimitRadio = 1
			this.supperLimit = 0
			this.lowerLimitRadio = 1
			this.lowerLimit = 0
			this.roundingRadio = 1
			this.rounding = 0
			this.mustFlag = 1
			this.arrivalCycle = 0
			this.stockCycleRadio = 1
			this.buyEachWeek = []
			this.stockCycle = 0
			this.buyEachMonth = []
			this.organ = ''
			this.store = ''
		},
		onStockCycleChange (e) {
			// 限制最大值为99
			const max = 99
			if (e > max) {
				this.stockCycle = max + 1
				this.$nextTick(() => {
					this.stockCycle = max
				})
			} else {
				this.stockCycle = e
			}
		},
		onInputChange (e) {
			const max = 9999
			if (e > max) {
				this.arrivalCycle = max + 1
				this.$nextTick(() => {
					this.arrivalCycle = max
				})
			} else {
				this.arrivalCycle = e
			}
		},
		onOrganChange (id, organ) {
			this.store = ''
			this.storeSelectList = this.sellerSelectList.find(item => {
				return item.id === id
			}).store
			this.organName = organ.name
		},
		onStoreChange (id, store) {
			this.storeName = store.name
		},
		onOrganSelectVisibleChange (val) {
			val ? this.initPopoverConnectTarget(this.$refs.organ) : this.removePopoverConnectTarget(this.$refs.organ)
		},
		onStoreSelectVisibleChange (val) {
			val ? this.initPopoverConnectTarget(this.$refs.store) : this.removePopoverConnectTarget(this.$refs.store)
		},
		optionRender (h, { item }) {
			h = this.$createElement
			return <div class="fx-common__cell-select__option fx-ellipsis">
				<span class="fx-common__cell-select__option-left fx-ellipsis" title={item.code}>{ item.code }</span>
				<span class="fx-common__cell-select__option-right fx-ellipsis" title={item.name}>{ item.name }</span>
			</div>
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
	.setting-mulity_form {
		display: flex
		flex-direction: column
		flex: 1
		.form-input {
			width: 150px
		}
		.form-item {
			margin-bottom: 10px
		}
		.form-input-tax {
			margin-top: 20px
			margin-left: 40px
			width: 200px
		}
		.form-edit-text {
			height: 26px
			line-height:26px
			padding-left: 20px
		}
		.form-content {
			flex: 1
			border: 1px solid #eee
			.supperLimitRadio {
				padding: 10px 0
				border-bottom: 1px dashed #eee
				.strategy-radio-item {
					margin-top: 5px
					margin-bottom: 5px
				}
				.strategy-radio-fix {
					margin-right: 42px
					margin-left: 10px
				}
				.strategy-radio-proportion {
					margin-left: 10px
				}
			}
			.strategy-content {
				padding-top: 10px
			}
			.tax-memo {
				padding: 0 20px
				margin-top: 50px
			}
			.memo-container {
				padding: 5px
			}
		}
		.form-footer {
			text-align: right
			margin-top: 10px
			margin-bottom: 5px
		}
		.arrivalCycle {
			width:70%;
			margin-left:5%
			margin-right: 10px
		}
	}
}
.supperLimitRadio {
	padding: 4px 0!important
}
>>>.el-checkbox {
	margin: 0 2px 3px 10px!important
}
.checkbox-container {
	padding-top: 5px
	max-height: 100px
	overflow: auto
}
.select-container {
	padding-top 20px
	.form-item {
		margin-bottom: 20px !important
	}
}
.lastday {
	width 138px
}
</style>
