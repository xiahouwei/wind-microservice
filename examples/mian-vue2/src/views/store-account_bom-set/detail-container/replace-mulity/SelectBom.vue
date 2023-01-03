<template>
	<w-dialog v-model="dialogVisible" width="1200px" title="选择BOM" heightFullscreen :beforeClose="onBeforeClose">
	<div class="setting-step1-container">
		<treeContainer
			ref="treeContainer"
			:data="typeTreeData"
			showCheckbox
			readonly
			:showTreeWidthExtendBtn="false"
			@check="onTreeCheck"
		></treeContainer>
		<fx-transfer
			ref="transfer"
			v-model="selectIds"
			:tableColumn="tableColumn"
			:tableData="listData"
			:filter="transferFilter"
			leftTitle="全部BOM"
			rightTitle="已选BOM"
		></fx-transfer>
	</div>
		<template slot="footer">
			<el-button @click="onCancelClick">取消</el-button>
			<el-button type="primary" @click="onSaveClick">确定</el-button>
		</template>
	</w-dialog>
</template>
<script>
import treeContainer from '@/components/tree-container/tree-item/Index.vue'
export default {
	name: 'selectBom',
	components: {
		treeContainer
	},
	props: {
		type: String,
		replaceInfo: {
			type: Object,
			default: () => {
				return {
					default: {}
				}
			}
		},
		bomIdLists: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	data () {
		return {
			dialogVisible: false,
			typeTreeData: [],
			treeCheckedKeys: [],
			tableColumn: [
				{
					prop: 'code',
					label: '成品编号',
					required: true,
					renderHeader: this.renderCodeHeader
				},
				{
					prop: 'bomName',
					label: '菜品/商品BOM名称',
					required: true,
					renderHeader: this.renderBomNameHeader
				},
				{
					prop: 'name',
					label: '成品名称',
					required: true,
					renderHeader: this.renderNameHeader
				}
			],
			listData: [],
			selectIds: [],
			compareArrayUtils: this.$fxUtils.compareArrayUtils(),
			fxDataVerification: this.$fxUtils.fxDataVerification()
		}
	},
	watch: {
		bomIdLists (val) {
			this.compareArrayUtils.setData(val)
		},
		selectIds (val) {
			this.$emit('update:bomIdLists', val)
		}
	},
	methods: {
		open () {
			this.dialogVisible = true
			this.listData = []
			this.initTree().then(this.getItemList)
			this.fxDataVerification.resetData(this.bomIdLists)
		},
		onClose () {
			this.$refs.treeContainer.clearSearchInput()
			this.$refs.transfer.refresh()
		},
		getSelectItems () {
			return this.listData.filter(item => {
				return this.compareArrayUtils.has(item.id)
			})
		},
		initTree () {
			return this.$fxApi('bom.getTypeTree', this.type).then(res => {
				this.typeTreeData = [res]
				return Promise.resolve()
			})
		},
		getItemList () {
			return this.$fxApi('bom.getReplaceBomList', this.type, this.replaceInfo.oldItemId).then(res => {
				this.listData = res
				return Promise.resolve()
			})
		},
		onTreeCheck (data, { checkedKeys }) {
			this.treeCheckedKeys = checkedKeys
		},
		transferFilter (item) {
			return this.treeCheckedKeys.length === 0 || this.treeCheckedKeys.includes(item.itemType)
		},
		renderCodeHeader  (h, column, index) {
			const content = {
				food_bom: '成品编号',
				compose_bom: '成品编号',
				split_bom: '母材料编号'
			}
			h = this.$createElement
			return <div>{ content[this.type] } </div>
		},
		renderBomNameHeader  (h, column, index) {
			const content = {
				food_bom: '菜品/商品BOM名称',
				compose_bom: '组合BOM名称',
				split_bom: '拆分BOM名称'
			}
			h = this.$createElement
			return <div>{ content[this.type] } </div>
		},
		renderNameHeader  (h, column, index) {
			const content = {
				food_bom: '成品名称',
				compose_bom: '成品名称',
				split_bom: '母材料名称'
			}
			h = this.$createElement
			return <div>{ content[this.type] } </div>
		},
		onCancelClick () {
			this.verificationDetails().then(() => {
				this.selectIds = []
				this.dialogVisible = false
			})
		},
		onSaveClick () {
			this.dialogVisible = false
		},
		verificationDetails () {
			return this.fxDataVerification.checkComfirm(this.bomIdLists)
		},
		onBeforeClose (close) {
			this.verificationDetails().then(() => {
				this.selectIds = []
				close()
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.setting-step1-container {
	flex: 1
	display: flex;
	flex-direction: row;
	overflow: auto;
	.tree-container {
		margin-top:11px
	}
}
</style>
