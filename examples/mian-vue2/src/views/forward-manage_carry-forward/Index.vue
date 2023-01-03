<template>
	<w-app-container>
		<fx-page-header title="月末结转"></fx-page-header>
		<w-app-container direction="row" class="fx-page-first-container">
			<treeContainer
				ref="treeContainer"
				@on-tree-item-click="onTreeItemClick"
			></treeContainer>
			<listContainer
				ref="listContainer"
				:getCurrentTreeOrganId="getCurrentTreeOrganId"
				@on-carry-forward="onCarryForward"
			></listContainer>
		</w-app-container>
		<carry-forward-container
			ref="carryForward"
			@on-refresh="initOrganList"
		></carry-forward-container>
	</w-app-container>
</template>
<script>
import treeContainer from '@/components/tree-container/tree-carry-forward/Index.vue'
import listContainer from './components/list-container/Index.vue'
import carryForwardContainer from './components/carry-forward-container/CarryForward.vue'
export const apiName = 'carryForward'
export default {
	name: 'carryForward',
	components: {
		treeContainer,
		listContainer,
		carryForwardContainer
	},
	data () {
		return {
		}
	},
	mounted () {
		this.verify().then(this.unVerify)
	},
	methods: {
		initOrganList () {
			this.$refs.listContainer.refresh()
		},
		onTreeItemClick () {
			this.initOrganList()
		},
		getCurrentTreeOrganId () {
			return this.$refs.treeContainer.getCurrentTreeOrganId()
		},
		onCarryForward (type) {
			this.$refs.carryForward.open(type)
		},
		verify () {
			return new Promise(resolve => {
				return this.$fxApi(`${apiName}.verify`).then(res => {
					if (res === 0) {
						resolve()
					} else {
						this.onCarryForward('carryForward')
					}
				})
			})
		},
		unVerify () {
			return this.$fxApi(`${apiName}.unVerify`).then(res => {
				if (res === 0) {
					this.initOrganList()
				} else {
					this.onCarryForward('reverseCarryForward')
				}
			})
		}
	}
}
</script>
