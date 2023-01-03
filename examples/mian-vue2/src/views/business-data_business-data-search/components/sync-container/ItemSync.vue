<template>
	<div class="container">
		<w-scroll-bar>
		<fx-list-virtual-table
			ref="listTable"
			:tableColumn="tableColumn"
			:listData="itemSyncData"
			showIndex
			:showPagination='false'
			:listTotal="itemSyncData.length || 0"
		>
			<div slot="btn-tools-left" class="tools-left">
				<el-button class="order-btn" type="primary" plain @click="onRefresh">刷新</el-button>
				<el-button class="order-btn" type="danger" plain @click="onEnsure">确认同步</el-button>
			</div>
		</fx-list-virtual-table>
		</w-scroll-bar>
	</div>
</template>
<script>
import { apiName } from '../../Index.vue'
export default {
	name: 'item',
	props: {
		itemSyncData: {
			type: Array,
			default: () => {
				return []
			}
		},
		itemList: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	data () {
		return {
			tableColumn: [
				{ prop: 'sourceTypeName', label: '数据来源' },
				{ prop: 'code', label: '菜品编号', required: true },
				{ prop: 'name', label: '菜品名称', required: true },
				{
					prop: 'method',
					label: '同步方式',
					width: '280px',
					fxRender: this.methodRender,
					required: true
				}, {
					prop: 'item',
					label: '选择现有品项',
					width: '180px',
					fxRender: this.itemRender,
					required: true
				},
				{
					prop: 'createDate.value',
					label: '获取时间',
					width: '180px',
					formatter: (row) => {
						return this.$fxUtils.setDateTime(new Date(row.createDate.value), '年月日时分')
					}
				}
			],
			selectOptionProp: {
				name: 'code'
			}
		}
	},
	methods: {
		methodRender (h, { row, $index }) {
			h = this.$createElement
			return <div onClick={this.stopPropagation}>
				<el-radio-group
					v-model={row.method}
					onChange={(val) => { this.changeMethod(val, row) }}
				>
					<el-radio label={0}>与现有品项同步</el-radio>
					<el-radio label={1}>作为新品项导入</el-radio>
				</el-radio-group>
			</div>
		},
		itemRender (h, { row, $index }) {
			h = this.$createElement
			return <fx-list-cell-select
				ref={`storeCode-${$index}`}
				vModel={row.relItem}
				isEdit={true}
				row={row}
				rowIndex={$index}
				dropdownWidth='300px'
				optionRender={this.optionRender}
				selectOptionList={this.itemList}
				disabled={row.method === 1}
			></fx-list-cell-select>
		},
		optionRender (h, { item }) {
			h = this.$createElement
			return <div class="fx-common__cell-select__option fx-ellipsis">
				<span class="fx-common__cell-select__option-left fx-ellipsis" title={item.code}>{ item.code }</span>
				<span class="fx-common__cell-select__option-right fx-ellipsis" title={item.name}>{ item.name }</span>
			</div>
		},
		changeMethod (val, row) {
			row.relItem = val ? '' : this.itemList[0].id
		},
		stopPropagation () {
			window.event.stopPropagation()
		},
		onEnsure () {
			this.$refs.listTable.getSelectedRows().then(res => {
				if (this.checkRepeat(res)) {
					return false
				}
				const result = res.map(item => {
					return {
						itemId: item.relItem || '',
						cpId: item.id
					}
				})
				this.submitHandler(result).then(res => {
					this.filterHandler(res)
				})
			})
		},
		checkRepeat (res) {
			const checkObj = {}
			let checkResult = []
			for (const item of res) {
				if (item.relItem !== '') {
					if (item.relItem in checkObj) {
						checkResult = [checkObj[item.relItem], item.$fxIndex]
						break
					} else {
						checkObj[item.relItem] = item.$fxIndex
					}
				}
			}
			if (checkResult.length > 0) {
				this.$fxConfirm({
					message: `序号${Math.min(...checkResult) + 1}与序号${Math.max(...checkResult) + 1}对应菜品所选的现有品项一致，请修改`,
					option: {
						showCancelButton: false
					}
				})
				return true
			} else {
				return false
			}
		},
		submitHandler (data) {
			return this.$fxApi(`${apiName}.matchItem`)({ data }).then(res => {
				return Promise.resolve(res)
			})
		},
		filterHandler (idList = []) {
			const updateData = this.itemSyncData.filter(item => {
				return !idList.includes(item.id)
			})
			this.clearSelected()
			this.$emit('updateData', updateData)
		},
		onRefresh () {
			this.clearSelected()
			this.$emit('refreshItem', '刷新成功!')
		},
		clearSelected () {
			this.$refs.listTable.clearSelected()
		}
	}
}
</script>
<style lang="stylus" scoped>
.container {
	height 100%
	flex: 1;
	display:flex
	.tools-left {
		flex: 1
	}
}
</style>
