<template>
	<w-app-container>
		<fx-page-header title="系统参数"></fx-page-header>
		<w-app-container direction="row" class="fx-page-first-container">
			<treeContainer
				ref="organTree"
				@on-tree-item-click="initOrganList"
			></treeContainer>
			<listContainer
				ref="listContainer"
				:listData="listData"
				:fxDataVerification="fxDataVerification"
				:nodeName="nodeName"
			></listContainer>
		</w-app-container>
	</w-app-container>
</template>
<script>
import treeContainer from '@/components/tree-container/tree-system/Index.vue'
import listContainer from './components/list-container/Index.vue'
export const apiName = 'paramConfig'
export default {
	name: 'systemParams',
	components: {
		treeContainer,
		listContainer
	},
	data () {
		return {
			listData: [],
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			nodeName: ''
		}
	},
	mounted () {
		this.initTree()
	},
	methods: {
		initTree () {
			this.$refs.organTree.initTree().then(({ res, name }) => {
				this.initOrganList(res, name)
			})
		},
		initOrganList (code, nodeName) {
			return this.$fxApi(`${apiName}.getParamsByEnum`)({ data: code }).then(res => {
				res.forEach(item => {
					item.collapseVisible = true
				})
				this.listData = this.normalizationList(res)
				this.fxDataVerification.resetData(this.listData)
				this.nodeName = nodeName
				this.$refs.listContainer.setMarkInfo(this.listData[0].value[0].mparamConfigs[0])
				return Promise.resolve()
			})
		},
		normalizationList (list) {
			const listMap = {}
			list.forEach(item => {
				if (!listMap[item.fatherTypeName]) {
					listMap[item.fatherTypeName] = [item]
				} else {
					listMap[item.fatherTypeName].push(item)
				}
			})
			return Object.keys(listMap).map(item => {
				return {
					fatherTypeName: item,
					value: listMap[item]
				}
			})
		}
	}
}
</script>
