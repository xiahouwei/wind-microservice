<template>
	<div>
		<w-simple-table
			:tableData="value"
			bottomBtnText="+添加品项单位"
			:showBottomBtn="value.length<limit && !disabled"
			@cellClick="onCellClick"
			@on-bottom-btn-click="onItemAddClick"
		>
			<w-simple-table-column prop="tools" label="操作" width="5%" align="center">
				<span slot="label">
					<el-popover
						placement="top"
						width="290"
						trigger="hover"
						content="若品项单位的参考成本价、参考销售价未填写，则在系统业务使用时，可能会存在品项价格为0的情况">
						<w-icon slot="reference" type="question-active" class="unit-mark-icon"></w-icon>
					</el-popover>
				</span>
				<div slot-scope="scope">
					<w-link type="danger" @click="onItemDelClick(scope)" :disabled="!!scope.row.sourceType || disabled">删除</w-link>
				</div>
			</w-simple-table-column>
			<w-simple-table-column prop="name" label="单位名称" width="10%" align="center">
				<template slot-scope="scope">
					<w-input
						:ref="`grid-name-${scope.index}`"
						v-show="scope.row.isEdit"
						v-model="scope.row.name"
						:disabled="disabled"
						:maxlength="$fxCommon.getFxInputMaxLength('unitName')"
						:regType="$fxCommon.getFxInputReg('unitName')"
						@keyup.enter.native="onCellInputEnter('name', scope.index)"
						@keyup.up.native="onCellInputUp('name', scope.index)"
						@keyup.down.native="onCellInputDown('name', scope.index)"
					></w-input>
					<span v-show="!scope.row.isEdit" class="cell-span">{{ scope.row.name }}</span>
				</template>
			</w-simple-table-column>
			<w-simple-table-column prop="ratio" label="换算系数" width="10%" align="center">
					<span slot="label">
						<span>换算系数</span>
						<el-popover
							placement="top"
							width="290"
							trigger="hover"
							content="此处维护品项单位与品项最小单位之间的换算系数，若品项单位选定为最小单位，则换算系数默认为“1”">
							<w-icon slot="reference" type="question-active" class="unit-mark-icon"></w-icon>
						</el-popover>
					</span>
				<template slot-scope="scope">
					<w-input-number
						:ref="`grid-ratio-${scope.index}`"
						v-show="scope.row.isEdit"
						v-model="scope.row.ratio"
						:disabled="scope.row.mainFlag===1 || disabled"
						@keyup.enter.native="onCellInputEnter('ratio', scope.index)"
						@keyup.up.native="onCellInputUp('ratio', scope.index)"
						@keyup.down.native="onCellInputDown('ratio', scope.index)"
					>
					</w-input-number>
					<span v-show="!scope.row.isEdit" class="cell-span">{{ scope.row.ratio }}</span>
				</template>
			</w-simple-table-column>
			<w-simple-table-column :visible="showCostCardFlag" prop="costCardFlag" label="建立成本卡" width="8%" align="center">
				<div slot-scope="scope">
					<el-checkbox v-model="scope.row.costCardFlag" :disabled="isAssistUnit(scope.row)" :true-label="1" :false-label="0"></el-checkbox>
				</div>
			</w-simple-table-column>
			<w-simple-table-column prop="barcode" label="条码" width="20%" align="center">
				<template slot-scope="scope">
					<w-input
						:ref="`grid-barcode-${scope.index}`"
						v-show="scope.row.isEdit"
						v-model="scope.row.barcode"
						:disabled="disabled"
						:maxlength="$fxCommon.getFxInputMaxLength('barcode')"
						:regType="$fxCommon.getFxInputReg('barcode')"
						@keyup.enter.native="onCellInputEnter('barcode', scope.index)"
						@keyup.up.native="onCellInputUp('barcode', scope.index)"
						@keyup.down.native="onCellInputDown('barcode', scope.index)"
					></w-input>
					<span v-show="!scope.row.isEdit" class="cell-span">{{ scope.row.barcode }}</span>
				</template>
			</w-simple-table-column>
			<w-simple-table-column prop="mainFlag" label="最小" width="5%" align="center">
				<div slot-scope="scope">
					<el-checkbox
						v-model="scope.row.mainFlag"
						:disabled="disabled || isAssistUnit(scope.row)"
						:true-label="1"
						:false-label="0"
						@change="onMainFlagChange(arguments, scope)"
					></el-checkbox>
				</div>
			</w-simple-table-column>
			<w-simple-table-column prop="purchaseFlag" label="采购" width="5%" align="center">
				<div slot-scope="scope">
					<el-checkbox
						v-model="scope.row.purchaseFlag"
						:disabled="disabled || isAssistUnit(scope.row)"
						:true-label="1"
						:false-label="0"
						@change="onUnitFlagChange(arguments, scope, 'purchaseFlag')"
					></el-checkbox>
				</div>
			</w-simple-table-column>
			<w-simple-table-column prop="salesFlag" label="销售" width="5%" align="center">
				<div slot-scope="scope">
					<el-checkbox v-model="scope.row.salesFlag"  :disabled="disabled || isAssistUnit(scope.row)" :true-label="1" :false-label="0" @change="onUnitFlagChange(arguments, scope, 'salesFlag')"></el-checkbox>
				</div>
			</w-simple-table-column>
			<w-simple-table-column prop="checkFirstFlag" label="盘点1" width="5%" align="center">
				<div slot-scope="scope">
					<el-checkbox v-model="scope.row.checkFirstFlag" :disabled="disabled || isAssistUnit(scope.row)" :true-label="1" :false-label="0" @change="onUnitFlagChange(arguments, scope, 'checkFirstFlag')"></el-checkbox>
				</div>
			</w-simple-table-column>
			<w-simple-table-column prop="checkSecondFlag" label="盘点2" width="5%" align="center">
				<div slot-scope="scope">
					<el-checkbox v-model="scope.row.checkSecondFlag" :disabled="disabled || isAssistUnit(scope.row)" :true-label="1" :false-label="0" @change="onUnitFlagChange(arguments, scope, 'checkSecondFlag')"></el-checkbox>
				</div>
			</w-simple-table-column>
			<w-simple-table-column prop="reportFlag" label="报表" width="5%" align="center">
				<div slot-scope="scope">
					<el-checkbox v-model="scope.row.reportFlag" :disabled="disabled || isAssistUnit(scope.row)" :true-label="1" :false-label="0" @change="onUnitFlagChange(arguments, scope, 'reportFlag')"></el-checkbox>
				</div>
			</w-simple-table-column>
			<w-simple-table-column prop="assistFlag" label="辅助" width="5%" align="center">
				<div slot-scope="scope">
					<el-checkbox v-model="scope.row.assistFlag" :disabled="disabled" :true-label="1" :false-label="0" @change="onUnitFlagChange(arguments, scope, 'assistFlag')"></el-checkbox>
				</div>
			</w-simple-table-column>
			<w-simple-table-column prop="refCostPrice" label="参考成本" width="10%" align="center">
				<template slot-scope="scope">
					<w-input-number
						:ref="`grid-refCostPrice-${scope.index}`"
						v-show="scope.row.isEdit"
						v-model="scope.row.refCostPrice"
						:disabled="disabled"
						:pointSize="sysPricePointSize"
						@keyup.enter.native="onCellInputEnter('refCostPrice', scope.index)"
						@keyup.up.native="onCellInputUp('refCostPrice', scope.index)"
						@keyup.down.native="onCellInputDown('refCostPrice', scope.index)"
					>
					</w-input-number>
					<span v-show="!scope.row.isEdit" class="cell-span">{{ scope.row.refCostPrice | filterAutoZeroFill({ len: sysPricePointSize }) }}</span>
				</template>
			</w-simple-table-column>
			<w-simple-table-column prop="refSellingPrice" label="参考售价" width="10%" align="center">
				<template slot-scope="scope">
					<w-input-number
						:ref="`grid-refSellingPrice-${scope.index}`"
						v-show="scope.row.isEdit"
						:disabled="disabled"
						v-model="scope.row.refSellingPrice"
						:pointSize="sysPricePointSize"
						@keyup.enter.native="onCellInputEnter('refSellingPrice', scope.index)"
						@keyup.up.native="onCellInputUp('refSellingPrice', scope.index)"
						@keyup.down.native="onCellInputDown('refSellingPrice', scope.index)"
					>
					</w-input-number>
					<span v-show="!scope.row.isEdit" class="cell-span">{{ scope.row.refSellingPrice | filterAutoZeroFill({ len: sysPricePointSize }) }}</span>
				</template>
			</w-simple-table-column>
		</w-simple-table>
	</div>
</template>
<script>
import { mapState } from 'vuex'
export default {
	name: 'unitManage',
	props: {
		value: {
			type: Array,
			default: () => {
				return []
			}
		},
		limit: {
			type: Number,
			default: 5
		},
		showCostCardFlag: {
			type: Boolean,
			default: false
		},
		disabled: Boolean,
		beforeDeleteUnit: Function
	},
	data () {
		return {
			editColumn: ['name', 'ratio', 'barcode', 'refCostPrice', 'refSellingPrice']
		}
	},
	computed: {
		...mapState({
			sysPricePointSize: state => state.system.sysPricePointSize
		}),
		isRowEdit () {
			return this.value.some(item => {
				return !!item.isEdit
			})
		},
		currentEditRowIndex () {
			return this.value.findIndex(item => {
				return !!item.isEdit
			})
		},
		isAssistUnit () {
			return row => {
				return !!row.assistFlag
			}
		}
	},
	methods: {
		validateEditRow () {
			return new Promise(resolve => {
				const currentRow = this.value.find(item => {
					return !!item.isEdit
				})
				const hasMinUnit = this.value.some(item => {
					return !!item.mainFlag
				})
				if (!currentRow.name) {
					this.$fxMessage.warning('请填入品项单位名称')
					this.setCellFocus('name', this.currentEditRowIndex)
				} else if (!currentRow.ratio) {
					this.$fxMessage.warning('请填入品项换算系数且不为0')
					this.setCellFocus('ratio', this.currentEditRowIndex)
				} else if (currentRow.ratio < 1) {
					this.$fxMessage.warning('品项换算系数不得小于1')
					this.setCellFocus('ratio', this.currentEditRowIndex)
				} else if (!!currentRow.barcode && currentRow.barcode.length !== 13) {
					this.$fxMessage.warning('条码位数必须为13位')
					this.setCellFocus('barcode', this.currentEditRowIndex)
				} else if (!!currentRow.barcode && this.value.some(item => {
					return item.barcode === currentRow.barcode && item.name !== currentRow.name
				})) {
					this.$fxMessage.warning('不同单位条码不得重复')
					this.setCellFocus('barcode', this.currentEditRowIndex)
				} else if (!hasMinUnit) {
					this.$fxMessage.warning('品项最小单位未设置，无法保存')
				} else {
					resolve()
				}
			})
		},
		saveTable () {
			return new Promise(resolve => {
				if (this.isRowEdit) {
					this.validateEditRow().then(this.setTableUnEdit).then(resolve)
				} else {
					resolve()
				}
			})
		},
		onItemDelClick ({ row, index }) {
			if (typeof this.beforeDeleteUnit === 'function') {
				this.beforeDeleteUnit(row).then(() => {
					this.$fxConfirm('确定删除当前品项单位？').then(() => {
						this.value.splice(index, 1)
					})
				})
			} else {
				this.$fxConfirm('确定删除当前品项单位？').then(() => {
					this.value.splice(index, 1)
				})
			}
		},
		onItemAddClick () {
			this.saveTable().then(() => {
				this.value.push({
					name: '',
					ratio: '',
					barcode: '',
					costCardFlag: 0,
					mainFlag: 0,
					purchaseFlag: 0,
					salesFlag: 0,
					checkFirstFlag: 0,
					checkSecondFlag: 0,
					reportFlag: 0,
					refCostPrice: '',
					refSellingPrice: '',
					isEdit: true
				})
				this.$nextTick(() => {
					this.$refs[`grid-name-${this.value.length - 1}`].focus()
				})
			})
		},
		onMainFlagChange (checked, { row, index }) {
			if (checked) {
				this.value.forEach((item, itemIndex) => {
					if (index !== itemIndex) {
						item.mainFlag = 0
					} else {
						row.ratio = '1'
					}
				})
			}
		},
		onUnitFlagChange (checked, { row, index }, prop) {
			if (checked) {
				this.value.forEach((item, itemIndex) => {
					if (index !== itemIndex) {
						item[prop] = 0
					}
				})
				if (prop === 'checkFirstFlag') {
					row.checkSecondFlag = 0
				} else if (prop === 'checkSecondFlag') {
					row.checkFirstFlag = 0
				} else if (prop === 'assistFlag') {
					row.mainFlag = 0
					row.purchaseFlag = 0
					row.salesFlag = 0
					row.checkFirstFlag = 0
					row.checkSecondFlag = 0
					row.reportFlag = 0
					row.costCardFlag = 0
				}
			}
		},
		onCellClick (item, index, col) {
			if (item.isEdit) {
				return false
			}
			if (this.editColumn.includes(col.prop)) {
				this.saveTable().then(() => {
					this.setCellFocus(col.prop, index)
				})
			}
		},
		setCellFocus (prop, index) {
			this.$set(this.value[index], 'isEdit', true)
			this.$nextTick(() => {
				this.$refs[`grid-${prop}-${index}`].focus()
			})
		},
		setTableUnEdit () {
			this.value.forEach((item, index) => {
				this.$set(this.value[index], 'isEdit', false)
			})
			return Promise.resolve()
		},
		onCellInputEnter (prop, index) {
			const propIndex = this.editColumn.findIndex(item => {
				return item === prop
			})
			if (propIndex === this.editColumn.length - 1) {
				this.saveTable()
			} else {
				this.$refs[`grid-${this.editColumn[propIndex + 1]}-${index}`].focus()
			}
		},
		onCellInputUp (prop, index) {
			if (index === 0) {
				return false
			}
			this.saveTable().then(() => {
				this.setCellFocus(prop, index - 1)
			})
		},
		onCellInputDown (prop, index) {
			if (index === this.value.length - 1) {
				return false
			}
			this.saveTable().then(() => {
				this.setCellFocus(prop, index + 1)
			})
		},
		validate () {
			return new Promise(resolve => {
				this.saveTable().then(() => {
					if (this.value.length === 0) {
						this.$fxMessage.warning('请添加品项单位')
						return false
					}
					resolve()
				})
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.cell-span {
	cursor: default;
}
.unit-mark-icon {
	margin-left:5px
	width:16px
	height: 16px
	position: relative
	top: 4px
}
>>>.wind-simple-table__th {
	padding:0!important
}
</style>
