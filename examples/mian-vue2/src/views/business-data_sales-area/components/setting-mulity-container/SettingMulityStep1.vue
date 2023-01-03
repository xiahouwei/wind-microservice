<template>
	<div class="setting-step1-container">
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
			v-model="selectIds"
			:tableColumn="tableColumn"
			:tableData="listData"
			:filter="transferFilter"
			leftTitle="全部可选品项"
			rightTitle="本次已选品项"
		></fx-transfer>
	</div>
</template>
<script>
import { apiName } from '../../Index.vue'
import treeContainer from '@/components/tree-container/tree-item/Index.vue'
export default {
	name: 'settingMulityStep1',
	components: {
		treeContainer
	},
	props: {
		listSelectIds: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	data () {
		return {
			tableTreeData: [],
			treeCheckedKeys: [],
			tableColumn: [
				{ prop: 'name', label: '品项名称', required: true },
				{ prop: 'spec', label: '规格', required: true }
			],
			listData: [],
			selectIds: [],
			compareArrayUtils: this.$fxUtils.compareArrayUtils()
		}
	},
	watch: {
		listSelectIds (val) {
			this.compareArrayUtils.setData(val)
		},
		selectIds (val) {
			this.$emit('update:listSelectIds', val)
		}
	},
	methods: {
		open () {
			this.listData = []
			this.selectIds = []
			this.initOrganTree().then(this.getItemList)
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
		initOrganTree () {
			return this.$fxApi(`${apiName}.getItemTree`).then(res => {
				this.treeCheckedKeys = []
				this.tableTreeData = res
				return Promise.resolve()
			})
		},
		getItemList () {
			return this.$fxApi(`${apiName}.getItemList`).then(res => {
				this.listData = res
				return Promise.resolve()
			})
		},
		onTreeCheck (data, { checkedKeys }) {
			this.treeCheckedKeys = checkedKeys
		},
		transferFilter (item) {
			return this.treeCheckedKeys.length === 0 || this.treeCheckedKeys.includes(item.itemType)
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
