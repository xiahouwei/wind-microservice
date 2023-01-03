<template>
	<w-dialog v-model="dialogVisible" width="1200px" heightFullscreen @close="onClose" :beforeClose="onBeforeClose">
		<template slot='title'>
			<span class="dialogTitle">添加品项</span>
			<span>第2步</span>
		</template>
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
				v-model="listSelectIds"
				:tableColumn="tableColumn"
				:tableData="listData"
				:filter="transferFilter"
				leftTitle="全部品项"
				rightTitle="选定品项"
			></fx-transfer>
		</div>
		<template slot="footer">
			<el-button @click="onLastStepClick">上一步</el-button>
			<el-button type="primary" @click="onNextStepClick">下一步</el-button>
		</template>
	</w-dialog>
</template>
<script>
import treeContainer from '@/components/tree-container/tree-item/Index.vue'
export default {
	name: 'addMulityStep2',
	components: {
		treeContainer
	},
	props: {
		listData: {
			type: Array,
			default: () => {
				return []
			}
		}
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
			tableSearchKey: '',
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			listSelectIds: [],
			compareArrayUtils: this.$fxUtils.compareArrayUtils()
		}
	},
	watch: {
		listSelectIds (val) {
			this.compareArrayUtils.setData(val)
		}
	},
	methods: {
		async open () {
			return this.initOrganTree().then(() => {
				this.dialogVisible = true
				this.fxDataVerification.resetData([])
				return Promise.resolve()
			})
		},
		onClose () {
			this.$refs.treeContainer.clearSearchInput()
		},
		onLastStepClick () {
			this.$emit('step2ToStep1')
		},
		onNextStepClick () {
			const selectItems = this.listData.filter(item => {
				return this.compareArrayUtils.has(item.id)
			})
			if (!selectItems.length) {
				this.$fxMessage.warning('请至少选择一项')
				return false
			}
			this.$emit('step2ToStep3', selectItems)
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
		transferFilter (item) {
			return this.treeCheckedKeys.length === 0 || this.treeCheckedKeys.includes(item.itemType)
		},
		hide () {
			this.dialogVisible = false
		},
		verificationDetails () {
			return this.fxDataVerification.checkComfirm(this.listSelectIds)
		},
		onBeforeClose (close) {
			this.$emit('clearStep3TableDataMap')
			this.verificationDetails().then(close)
		},
		deleteSelectIds (ids) {
			this.listSelectIds = this.listSelectIds.filter(item => {
				return ids.includes(item)
			})
			return Promise.resolve()
		},
		refresh () {
			this.tableSearchKey = ''
			this.listSelectIds = []
			this.tableTreeData = []
			this.treeCheckedKeys = []
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.dialogTitle {
	font-size 15px
	font-weight 700
	margin-right 10px
}
.create-organ {
	flex: 1
	width: 1150px
	height: 700px
	display: flex;
	flex-direction: row;
	overflow: auto;
	.tree-container {
		margin-top:21px
	}
}
</style>
