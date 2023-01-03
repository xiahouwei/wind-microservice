<template>
	<w-collapse v-model="collapseVisible" title="菜品做法设置">
		<w-simple-table
			:tableData="value"
			:showBottomBtn="false"
			@cellClick="onCellClick"
		>
			<w-simple-table-column prop="name" label="做法名称" width="24%" align="center">
				<template slot-scope="scope">
					<span class="cell-span">{{ scope.row.name }}</span>
				</template>
			</w-simple-table-column>
			<w-simple-table-column prop="sellingPrice" label="参考售价(A)" width="22%" align="center">
				<div slot-scope="scope">
					<span class="cell-span">{{ scope.row.sellingPrice | filterAutoZeroFill({ len: sysPricePointSize }) }}</span>
				</div>
			</w-simple-table-column>
			<w-simple-table-column prop="costPrice" label="参考成本(B)" width="22%" align="center">
				<template slot-scope="scope">
					<!-- <w-input-number
						:ref="`grid-costPrice-${scope.index}`"
						v-show="scope.row.isEdit"
						v-model="scope.row.costPrice"
						:disabled="disabled"
						@keyup.enter.native="onCellInputEnter('costPrice', scope.index)"
						@keyup.up.native="onCellInputUp('costPrice', scope.index)"
						@keyup.down.native="onCellInputDown('costPrice', scope.index)"
						@change='costPriceChange(scope.index, $event)'
					>
					</w-input-number> -->
					<span class="cell-span">{{ scope.row.costPrice | filterAutoZeroFill({ len: sysPricePointSize }) }}</span>
				</template>
			</w-simple-table-column>
			<w-simple-table-column prop="grossProfit" label="参考毛利(A-B)/A" width="22%" align="center">
				<template slot-scope="scope">
					<span class="cell-span">{{ scope.row.grossProfit }}%</span>
				</template>
			</w-simple-table-column>
			<w-simple-table-column prop="costCardFlag" label="建立成本卡" width="10%" align="center">
				<div slot-scope="scope">
					<el-checkbox :disabled="disabled" v-model="scope.row.costCardFlag" :true-label="1" :false-label="0"></el-checkbox>
				</div>
			</w-simple-table-column>
		</w-simple-table>
		<div class="text" v-if='!value.length'>【该菜品无做法】</div>
	</w-collapse>
</template>
<script>
import { mapState } from 'vuex'
export default {
	name: 'appendInfo',
	props: {
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		value: {
			type: Array,
			default: () => {
				return []
			}
		},
		disabled: Boolean
	},
	data () {
		return {
			collapseVisible: false,
			editColumn: ['costPrice']
		}
	},
	computed: {
		fileList () {
			return (this.organDetails.itemAppendixList || []).map(item => {
				return item.appendixUrl
			})
		},
		isRowEdit () {
			return this.value.some(item => {
				return !!item.isEdit
			})
		},
		...mapState({
			sysPricePointSize: state => state.system.sysPricePointSize
		})
	},
	methods: {
		onCellClick (item, index, col) {
			if (item.isEdit) {
				return false
			}
			this.saveTable().then(() => {
				this.setCellFocus(col.prop, index)
			})
		},
		setCellFocus (prop, index) {
			this.$set(this.value[index], 'isEdit', true)
			// this.$nextTick(() => {
			// 	this.$refs[`grid-costPrice-${index}`].focus()
			// })
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
		saveTable () {
			return new Promise(resolve => {
				if (this.isRowEdit) {
					this.setTableUnEdit().then(resolve)
				} else {
					resolve()
				}
			})
		},
		costPriceChange (index, val) {
			const sellingPrice = this.value[index].sellingPrice
			this.value[index].grossProfit = this.$fxUtils.toFixed((sellingPrice - val) / sellingPrice * 100, 2, false)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-item-input {
	width:535px
}
.upload-content {
	width: 535px
}
.text {
	height 30px
	line-height 30px
	text-align center
}
</style>
