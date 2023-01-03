<template>
	<w-simple-table :tableData="tableData" align="center">
		<w-simple-table-column prop="default" label="选中列" width="60px" align="center">
			<div slot-scope="scope">
				<el-checkbox v-model="scope.row.isSelected" @change="onSelected(arguments, scope)"></el-checkbox>
			</div>
		</w-simple-table-column>
		<w-simple-table-column prop="areaText" label="序号" width="60px" align="center">
			<template slot-scope="scope">
				{{scope.index + 1}}
			</template>
		</w-simple-table-column>
		<w-simple-table-column prop="code" label="供货商编号" align="center"></w-simple-table-column>
		<w-simple-table-column prop="name" label="供货商名称" align="center"></w-simple-table-column>
	</w-simple-table>
</template>

<script>
export default {
	name: 'businessList',
	props: {
		tableData: Array
	},
	data () {
		return {
			selectRow: {}
		}
	},
	methods: {
		onSelected (checked, { row, index }) {
			row.isSelected ? this.selectRow = row : this.selectRow = {}
			if (checked) {
				this.tableData.forEach((item, addressIndex) => {
					if (index !== addressIndex) {
						item.isSelected = false
					}
				})
			}
		},
		getSelectedRow () {
			return new Promise((resolve, reject) => {
				if (this.$fxUtils.isEmptyObj(this.selectRow)) {
					const error = '请选择供货商'
					this.$fxMessage.warning(error)
					reject(error)
				} else {
					resolve(this.selectRow)
				}
			})
		},
		clearSelectedRow () {
			this.selectRow = {}
		}
	}
}
</script>
<style lang="stylus" scoped>
</style>
