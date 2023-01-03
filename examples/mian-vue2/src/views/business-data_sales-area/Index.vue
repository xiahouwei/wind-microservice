<template>
	<w-app-container>
		<fx-page-header title="销售区域"></fx-page-header>
		<w-app-container direction="row" class="fx-page-first-container">
			<treeContainer
				ref="organTree"
				readonly
				:data="tableTreeData"
				@on-tree-item-click="initAreaList"
			></treeContainer>
			<listContainer
				ref="listContainer"
				:getCurrentTreeLv="getCurrentTreeLv"
				@on-refresh="initAreaList"
				@on-create-area="onCreateArea"
				@on-area-edit="onAreaEdit"
				@on-setting-close="onClose"
			></listContainer>
			<createContainer ref="createContainer" @on-close="onClose"></createContainer>
		</w-app-container>
	</w-app-container>
</template>
<script>
import treeContainer from '@/components/tree-container/tree-organ/Index.vue'
import listContainer from './components/list-container/Index.vue'
import createContainer from './components/create-container/Index.vue'
export const apiName = 'salesArea'
export default {
	name: 'salesArea',
	components: {
		treeContainer,
		listContainer,
		createContainer
	},
	mounted () {
		this.initTree()
	},
	data () {
		return {
			tableTreeData: []
		}
	},
	methods: {
		initTree () {
			return this.$fxApi('common.getTreeByType')({
				data: [{
					type: 'Organ',
					level: 1
				}]
			}).then(res => {
				this.tableTreeData = res
				return Promise.resolve()
			}).then(this.initAreaList)
		},
		getCurrentTreeLv () {
			return this.$refs.organTree.getCurrentNodeTreeLv()
		},
		initAreaList () {
			this.$refs.listContainer.refresh()
		},
		onCreateArea () {
			const treeNode = this.$refs.organTree.getCurrentNode()
			this.$refs.createContainer.add(treeNode)
		},
		onAreaEdit (salesAreaDetails) {
			this.$refs.createContainer.edit(salesAreaDetails)
		},
		onClose () {
			this.$refs.listContainer.onPageChange()
		}
	}
}
</script>
