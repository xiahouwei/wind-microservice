<template>
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
			:tableData="tableData"
			:filter="transferFilter"
			:disabled="!detailsAuthGetter('basic-archives_support-archives_take-stock-class.edit-item-custom-group')"
			leftTitle="全部品项类别"
			rightTitle="选定品项类别"
		></fx-transfer>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import treeContainer from '@/components/tree-container/tree-item/Index.vue'
export default {
	name: 'connect-item',
	components: {
		treeContainer
	},
	data () {
		return {
			itemDetails: {},
			tableTreeData: [],
			treeCheckedKeys: [],
			tableColumn: [
				{ prop: 'code', label: '品项类别编号', required: true },
				{ prop: 'name', label: '品项类别名称', required: true }
			],
			tableData: [],
			tableSearchKey: '',
			listSelectIds: [],
			fxDataVerification: this.$fxUtils.fxDataVerification()
		}
	},
	computed: {
		...mapGetters(['detailsAuthGetter'])
	},
	methods: {
		setData ({ listSelectIds, tableTreeData, tableData }) {
			this.listSelectIds = listSelectIds
			this.tableTreeData = tableTreeData
			this.tableData = tableData
		},
		onTreeCheck (data, { checkedKeys }) {
			this.treeCheckedKeys = checkedKeys
		},
		transferFilter (item) {
			return this.treeCheckedKeys.length === 0 || this.treeCheckedKeys.includes(item.id)
		},
		clear () {
			this.treeCheckedKeys = []
			this.$refs.treeContainer.clearSearchInput()
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
