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
			:disabled="!detailsAuthGetter('basic-archives_supplier-manage.edit-supplier')"
			leftTitle="全部品项"
			rightTitle="选定品项"
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
			dialogVisible: false,
			itemDetails: {},
			tableTreeData: [],
			treeCheckedKeys: [],
			tableColumn: [
				{ prop: 'code', label: '品项编号', required: true },
				{ prop: 'name', label: '品项名称', required: true },
				{ prop: 'typeName', label: '上级类别', required: true },
				{ prop: 'spec', label: '规格', required: true }
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
