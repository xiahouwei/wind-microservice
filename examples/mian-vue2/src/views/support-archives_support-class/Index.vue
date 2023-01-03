<template>
	<w-app-container>
		<fx-page-header :title="currentTittle"></fx-page-header>
		<w-app-container direction="row" class="fx-page-first-container">
			<treeContainer
				ref="treeContainer"
				@on-tree-type-click="onTreeTypeClick"
				@on-tree-item-click="onTreeItemClick"
			></treeContainer>
			<component
				ref="listContainer"
				:is="currentSupportType.component"
				:fGetTreeId="getCurrentTreeId"
				:fGetTreeNode="getTreeNode"
			></component>
		</w-app-container>
	</w-app-container>
</template>
<script>
import treeContainer from '@/components/tree-container/tree-support-class/Index.vue'
import listContainerFinancialClass from '@/views/support-archives_financial-class/Index.vue'
import listContainerBussinessType from '@/views/support-archives_bussiness-type/Index.vue'
import listContainerTakeStockClass from '@/views/support-archives_take-stock-class/Index.vue'
import listContainerInvoiceType from '@/views/support-archives_invoice-type/Index.vue'
import listContainerInventoryProfitReasons from '@/views/support-archives_inventory-profit-reason/Index.vue'
import listContainerOutStoreReason from '@/views/support-archives_out-store-reason/Index.vue'
import listContainerOtherExpenseTypeSetting from '@/views/support-archives_other-expense-type-setting/Index.vue'
import listContainerItemCustomGroup from '@/views/support-archives_item-custom-group/Index.vue'
export default {
	name: 'supportClass',
	components: {
		treeContainer,
		listContainerFinancialClass,
		listContainerBussinessType,
		listContainerTakeStockClass,
		listContainerInvoiceType,
		listContainerInventoryProfitReasons,
		listContainerOutStoreReason,
		listContainerOtherExpenseTypeSetting,
		listContainerItemCustomGroup
	},
	data () {
		return {
			supportClassId: '',
			supportTypeObj: this.$fxTypeMiddleware.getCommonTypeItemById('supportClass')
		}
	},
	computed: {
		currentSupportType () {
			return this.supportTypeObj(this.supportClassId)
		},
		currentTittle () {
			const title = '辅助分类'
			const subTitle = this.currentSupportType.name
			return [title, subTitle]
		}
	},
	activated () {
		if (this.$fxAppTabs.isNewTab()) {
			this.initTree()
		} else {
			this.initList()
		}
	},
	methods: {
		initTree () {
			this.$refs.treeContainer.getTreeData().then(supportClass => {
				this.onTreeTypeClick(supportClass)
			})
		},
		initList () {
			this.$refs.listContainer.initList()
		},
		onTreeTypeClick (data) {
			this.supportClassId = data.id
			this.$nextTick(this.initList)
		},
		onTreeItemClick (data) {
			const type = data.i18nCode.split('.')[0]
			if (type === 'bill') {
				this.supportClassId = 'bussinessType'
				this.$nextTick(this.initList)
			} else if (type === 'invoice') {
				this.supportClassId = 'invoiceType'
				this.$nextTick(this.initList)
			} else {
				this.initList()
			}
		},
		getCurrentTreeId () {
			const currentCode = this.$refs.treeContainer.getCurrentNode()
			if (currentCode.id === 'invoiceType') return null
			return currentCode.id === 'bussinessType' ? '0' : currentCode.id
		},
		getTreeNode () {
			return this.$refs.treeContainer.getCurrentNode()
		}
	}
}
</script>
