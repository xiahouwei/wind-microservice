<template>
	<div class="fx-transfer">
		<div class="list-container">
			<div class="fx-block-title">{{leftTitle}}</div>
			<fx-list-virtual-table
				ref="listTableUnSelect"
				:tableColumn="tableColumn"
				:listData="unSelectTableDataComputed"
				:listTotal="unSelectTableDataComputed.length || 0"
				:showPagination="false"
				:selectedRows.sync="defaultUnSelect"
				:showColumnFilterBtn="false"
				minWidth="100px"
				class="listTable"
			>
				<div slot="btn-tools-right" class="tools-right">
					<w-input
						v-model="unSelectTableSearchKey"
						placeholder="请输入内容"
						prefix-icon="el-icon-search"
						size="mini"
					>
					</w-input>
				</div>
				<div slot="empty">暂无数据</div>
			</fx-list-virtual-table>
		</div>
		<div class="tools-container">
			<el-tooltip content="左侧数据全部添加至右侧" placement="top" effect="light" :enterable="false">
				<el-button :disabled="disabled" class="tools-btn" icon="el-icon-d-arrow-right" @click="onSelectAll"></el-button>
			</el-tooltip>
			<el-tooltip content="左侧已勾选数据添加至右侧" placement="top" effect="light" :enterable="false">
				<el-button :disabled="disabled" class="tools-btn" icon="el-icon-arrow-right" @click="onSelect"></el-button>
			</el-tooltip>
			<el-tooltip content="右侧已勾选数据返回至左侧" placement="top" effect="light" :enterable="false">
				<el-button :disabled="disabled" class="tools-btn" icon="el-icon-arrow-left" @click="onUnSelect"></el-button>
			</el-tooltip>
			<el-tooltip content="右侧数据全部返回至左侧" placement="top" effect="light" :enterable="false">
				<el-button :disabled="disabled" class="tools-btn" icon="el-icon-d-arrow-left" @click="onUnSelectAll"></el-button>
			</el-tooltip>
		</div>
		<div class="list-container">
			<div class="fx-block-title">{{rightTitle}}</div>
			<fx-list-virtual-table
				ref="listTableSelect"
				:tableColumn="tableColumnRight ? tableColumnRight : tableColumn"
				:listData="selectTableDataComputed"
				:listTotal="selectTableDataComputed.length || 0"
				:showPagination="false"
				:selectedRows.sync="defaultSelect"
				:showColumnFilterBtn="false"
				minWidth="100px"
				class="listTable"
			>
				<div slot="btn-tools-right" class="tools-right">
					<w-input
						v-model="selectTableSearchKey"
						placeholder="请输入内容"
						prefix-icon="el-icon-search"
						size="mini"
					>
					</w-input>
				</div>
				<div slot="empty">暂无数据</div>
			</fx-list-virtual-table>
		</div>
	</div>
</template>
<script>
export default {
	name: 'fx-transfer',
	props: {
		value: {
			type: Array,
			default: () => {
				return []
			}
		},
		tableColumn: {
			type: Array,
			default: () => {
				return []
			}
		},
		tableColumnRight: Array,
		tableData: {
			type: Array,
			default: () => {
				return []
			}
		},
		filter: Function,
		searchProps: {
			type: Array,
			default: () => {
				return ['name', 'code', 'pinYin']
			}
		},
		leftTitle: String,
		rightTitle: String,
		disabled: Boolean
	},
	data () {
		return {
			defaultUnSelect: [],
			defaultSelect: [],
			unSelectTableSearchKey: '',
			selectTableSearchKey: '',
			valueMap: {}
		}
	},
	computed: {
		tableDataComputed () {
			return this.tableData.filter(item => {
				return this.$fxUtils.toRawType(this.filter) !== 'Function' || this.filter(item)
			})
		},
		unSelectTableData () {
			return this.tableDataComputed.filter(item => {
				return !this.valueMap[item.id]
			})
		},
		selectTableData () {
			return this.tableDataComputed.filter(item => {
				return this.valueMap[item.id]
			})
		},
		unSelectTableDataComputed () {
			return this.unSelectTableData.filter(item => {
				return this.$fxUtils.fuzzyQueryObj(item, this.unSelectTableSearchKey, this.searchProps)
			})
		},
		selectTableDataComputed () {
			return this.selectTableData.filter(item => {
				return this.$fxUtils.fuzzyQueryObj(item, this.selectTableSearchKey, this.searchProps)
			})
		}
	},
	watch: {
		tableData: {
			immediate: true,
			handler (val) {
				this.refresh()
			}
		},
		value: {
			immediate: true,
			handler (val) {
				const valueMap = {}
				val.forEach(item => {
					valueMap[item] = true
				})
				this.valueMap = valueMap
			}
		}
	},
	methods: {
		onSelect () {
			this.$refs.listTableUnSelect.getSelectedRows().then(res => {
				const selecteds = res.map(item => {
					return item.id
				})
				this.$emit('input', [...this.value, ...selecteds])
				this.defaultUnSelect = []
			})
		},
		onUnSelect () {
			this.$refs.listTableSelect.getSelectedRows().then(res => {
				const unSelecteds = res.map(item => {
					return item.id
				})
				const selecteds = this.value.filter(item => {
					return !unSelecteds.includes(item)
				})
				this.$emit('input', selecteds)
				this.defaultSelect = []
			})
		},
		onSelectAll () {
			const selecteds = this.unSelectTableDataComputed.map(item => {
				return item.id
			})
			this.$emit('input', [...this.value, ...selecteds])
			this.defaultUnSelect = []
		},
		onUnSelectAll () {
			const unSelecteds = this.selectTableDataComputed.map(item => {
				return item.id
			})
			const selecteds = this.value.filter(item => {
				return !unSelecteds.includes(item)
			})
			this.$emit('input', selecteds)
			this.defaultSelect = []
		},
		refresh () {
			this.defaultUnSelect = []
			this.defaultSelect = []
			this.unSelectTableSearchKey = ''
			this.selectTableSearchKey = ''
		},
		getSelectRows () {
			return this.tableData.filter(item => {
				return this.value.includes(item.id)
			})
		},
		getFilterSelectRows () {
			return this.tableDataComputed.filter(item => {
				return this.value.includes(item.id)
			})
		},
		getUnSelectRow () {
			return this.tableData.filter(item => {
				return !this.value.includes(item.id)
			})
		},
		getFilterUnSelectRow () {
			return this.tableDataComputed.filter(item => {
				return !this.value.includes(item.id)
			})
		},
		doTableLayout () {
			this.$refs.listTableSelect.doTableLayout()
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.fx-transfer {
	display: flex;
	flex-direction: row;
	flex: 1;
	.list-container {
		flex: 1
		overflow:auto
		display: flex;
		flex-direction: column;
		>>>.organ-list__top-right {
			margin-right: 0
		}
	}
	.tools-container {
		display: flex
		flex-direction: column
		align-items: center
		justify-content: center
		width: 100px
		.tools-btn {
			width: 50px
			margin-top: 20px
			margin-left: 0
		}
	}
}
</style>
