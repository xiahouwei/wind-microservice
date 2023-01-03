<template>
	<w-dialog
		v-model="dialogVisible"
		width="1200px"
		title="设置盘点顺序"
		heightFullscreen
		@close="onClose"
		:closeOnPressEscape="false">
		<div class="create-organ">
			<div class="list-container">
				<fx-details-table
					ref="detailsTable"
					:tableColumn="tableColumn"
					:tableData="tableData"
					:searchProps="searchProps"
					:tableEditColumnProp="tableEditColumnProp"
					:showColumnFilterBtn="false"
					:canAdd="false"
					:showDeleteBtn="false"
					:fullScreenBtn="false"
					:selectable="false"
				>
				</fx-details-table>
			</div>
		</div>
		<template slot="footer">
			<el-button @click="onCancelClick">取消</el-button>
			<el-button type="primary" @click="onSaveClick()">保存</el-button>
		</template>
	</w-dialog>
</template>
<script>
import { apiName } from './TakeStockClassCreateDialog.vue'
const EDIT_INPUT_TYPE = ['indexNum']
const SEARCH_PROPS = ['code', 'name']
export default {
	name: 'setting-take-stock-sort',
	data () {
		return {
			dialogVisible: false,
			itemDetails: {},
			tableColumn: [
				{ prop: 'code', label: '品项编号', required: true },
				{ prop: 'name', label: '品项名称', required: true },
				{
					prop: 'indexNum',
					label: '盘点顺序号',
					required: true,
					fxRender: this.indexNumRender
				}
			],
			tableData: [],
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			tableEditColumnProp: EDIT_INPUT_TYPE,
			searchProps: SEARCH_PROPS
		}
	},
	methods: {
		open (item) {
			this.itemDetails = item
			this.refreshConnectList().then(() => {
				this.dialogVisible = true
			})
		},
		onClose () {
			this.$refs.detailsTable.clear()
		},
		onCancelClick () {
			this.dialogVisible = false
		},
		refresh () {
			this.refreshConnectList()
		},
		checkDetailsUnSaving () {
			return this.$refs.detailsTable.checkDetailsUnSaving()
		},
		onSaveClick () {
			return this.$fxMessage.success('操作成功')
		},
		saveTakeStockSortApi (editingRowData) {
			return this.checkDetailsUnSaving().then(() => {
				const logger = this.$fxLogger.createInfo('basic-archives.support-archives.take-stock-class.takeStockSort', this.createLoggerParams(this.fxDataVerification.getOriginData(), editingRowData))
				const data = {
					checkClassId: this.itemDetails.id,
					itemId: editingRowData.id,
					indexNum: editingRowData.indexNum,
					...this.$fxCommon.getTenantIdParam()
				}
				return this.$fxApi(`${apiName}.saveTakeStockSort`, this.itemDetails.id)({ data, logger }).then(res => {
					return Promise.resolve()
				})
			})
		},
		createLoggerParams (pre, cur) {
			return {
				pre,
				cur,
				itemCode: cur.code,
				itemName: cur.name,
				name: this.itemDetails.name,
				code: this.itemDetails.code
			}
		},
		refreshConnectList () {
			const data = { checkClassId: this.itemDetails.id }
			return this.$fxApi(`${apiName}.getTakeStockSort`)({ data }).then(res => {
				this.tableData = res
				return Promise.resolve()
			})
		},
		indexNumRender (h, { row, $index }) {
			h = this.$createElement
			return <w-input-number
				vModel={row.indexNum}
				on-focus={() => this.indexNumFocus(row)}
				on-blur={() => this.indexNumBlur(row)}
			></w-input-number>
		},
		indexNumFocus (row) {
			const rowDataClone = this.$fxUtils.deepClone(row)
			delete rowDataClone.$fxIndex
			this.fxDataVerification.resetData(rowDataClone)
		},
		indexNumBlur (row) {
			this.saveTakeStockSortApi(row).then(this.refreshConnectList)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.create-organ {
	flex: 1
	display: flex;
	flex-direction: row;
	overflow: auto;
	.list-container {
		flex: 1
		overflow:auto
		display: flex;
		flex-direction: column;
	}
}
.flex-cell{
	display: flex
	.flex-part {
		display inline-block
		width 100px
	}
	.flex-long {
		flex 1
		display inline-block
	}
}
</style>
