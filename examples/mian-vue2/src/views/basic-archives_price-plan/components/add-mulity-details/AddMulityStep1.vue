<template>
	<w-dialog v-model="dialogVisible" width="1200px" title="新增品项" heightFullscreen @close="onClose" :beforeClose="onBeforeClose">
		<template slot="sub">第一步</template>
		<div class="create-organ">
			<treeContainer
				ref="treeContainer"
				:data="tableTreeData"
				showCheckbox
				readonly
				:showTreeWidthExtendBtn="false"
				@check="onTreeCheck"
			></treeContainer>
			<fx-transfer
				ref="transfer"
				v-model="listSelectIds"
				:tableColumn="tableColumn"
				:tableData="listData"
				:filter="transferFilter"
				leftTitle="全部可选品项"
				rightTitle="本次已选品项"
			></fx-transfer>
		</div>
		<template slot="footer">
			<el-button @click="onCancelClick">取消</el-button>
			<el-button type="primary" @click="onNextStepClick">下一步</el-button>
		</template>
	</w-dialog>
</template>
<script>
import treeContainer from '@/components/tree-container/tree-item/Index.vue'
export default {
	name: 'addMulityStep1',
	components: {
		treeContainer
	},
	data () {
		return {
			dialogVisible: false,
			tableTreeData: [],
			treeCheckedKeys: [],
			tableColumn: [
				{ prop: 'code', label: '品项编号', required: true },
				{ prop: 'name', label: '品项名称', required: true }
			],
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			listSelectIds: [],
			listData: [],
			compareArrayUtils: this.$fxUtils.compareArrayUtils()
		}
	},
	watch: {
		listSelectIds (val) {
			this.compareArrayUtils.setData(val)
		}
	},
	methods: {
		open (selecteds = [], listData = []) {
			this.listData = listData
			this.listSelectIds = selecteds
			return this.initOrganTree().then(() => {
				this.dialogVisible = true
				this.fxDataVerification.resetData(this.listSelectIds)
				return Promise.resolve()
			})
		},
		onClose () {
			this.$refs.treeContainer.clearSearchInput()
			this.$refs.transfer.refresh()
		},
		onCancelClick () {
			this.verificationDetails().then(() => {
				this.dialogVisible = false
			})
		},
		onNextStepClick () {
			if (this.listSelectIds.length === 0) {
				this.$fxMessage.warning('请选择添加品项')
				return false
			}
			const selectItems = this.listData.filter(item => {
				return this.compareArrayUtils.has(item.id)
			})
			this.$emit('on-next-step-click', selectItems)
			this.dialogVisible = false
		},
		initOrganTree () {
			return this.$fxApi('itemType.getItemTree').then(res => {
				this.treeCheckedKeys = []
				this.tableTreeData = res
				return Promise.resolve()
			})
		},
		onTreeCheck (data, { checkedKeys }) {
			this.treeCheckedKeys = checkedKeys
		},
		verificationDetails () {
			return this.fxDataVerification.checkComfirm(this.listSelectIds)
		},
		onBeforeClose (close) {
			this.verificationDetails().then(close)
		},
		transferFilter (item) {
			return this.treeCheckedKeys.length === 0 || this.treeCheckedKeys.includes(item.itemType)
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
	.tree-container {
		margin-top:21px
	}
}
</style>
