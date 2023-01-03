import fxAppTabls from './common/Fx-app-tabs.vue'
import fxBillContainer from './common/Fx-bill-container.vue'
import fxButton from './common/Fx-button.vue'
import fxDetailsFormRow from './common/Fx-details-form-row.vue'
import fxDetailsQueueTools from './common/Fx-details-queue-tools.vue'
import fxDetailsStateTag from './common/Fx-details-state-tag.vue'
import fxDetailsTable from './common/Fx-details-table.vue'
import fxDetailsTablePlus from './common/Fx-details-table-plus.vue'
import fxListBtnTools from './common/Fx-list-btn-tools.vue'
import fxListExtendCell from './common/Fx-list-extend-cell.vue'
import fxListExtendRow from './common/Fx-list-extend-row.vue'
import fxListFilter from './common/Fx-list-filter.vue'
import fxListStateTag from './common/Fx-list-state-tag.vue'
import fxListTableSummary from './common/Fx-list-table-summary.vue'
import fxPageHeader from './common/Fx-page-header.vue'
import fxRenderDom from './common/Fx-renderDom.js'
import fxTransfer from './common/Fx-transfer.vue'
import fxTree from './common/Fx-tree.vue'
import fxTreeVirtual from './common/Fx-tree-virtual.vue'
import fxUpload from './common/Fx-upload.vue'
import fxBillChain from './common/Fx-bill-chain.vue'
import fxCard from './common/Fx-card.vue'
import fxMistakeCheckStep from './common/Fx-mistake-check-step.vue'
import fxRadio from './common/Fx-radio.vue'
// {{{ fx-list-table
import fxListCellButton from './common/fx-list-table/Fx-list-cell-button.vue'
import fxListCellDate from './common/fx-list-table/Fx-list-cell-date.vue'
import fxListCellInputNumber from './common/fx-list-table/Fx-list-cell-input-number.vue'
import fxListCellInput from './common/fx-list-table/Fx-list-cell-input.vue'
import fxListCellUpload from './common/fx-list-table/Fx-list-cell-upload.vue'
import fxListCellSelectTab from './common/fx-list-table/Fx-list-cell-select-tab.vue'
import fxListCellSelectMulity from './common/fx-list-table/Fx-list-cell-select-mulity.vue'
import fxListCellSelect from './common/fx-list-table/Fx-list-cell-select.vue'
import fxListCellSwitch from './common/fx-list-table/Fx-list-cell-switch.vue'
import fxListVirtualTable from './common/fx-list-table/Fx-list-virtual-table.vue'
import fxListVirtualTablePlus from './common/fx-list-table/Fx-list-virtual-table-plus.vue'
import fxListVirtualTableColumn from './common/fx-list-table/Fx-list-virtual-table-column.vue'
import fxListVirtualTableColumnPlus from './common/fx-list-table/Fx-list-virtual-table-column-plus.vue'
// }}}
// {{{ fx-teleport
import fxTeleportChild from './common/fx-teleport/Fx-teleport-child.vue'
import fxTeleportFather from './common/fx-teleport/Fx-teleport-father.vue'
// }}}

export default {
	install (Vue) {
		Vue.component('fx-app-tabs', fxAppTabls)
		Vue.component('fx-bill-container', fxBillContainer)
		Vue.component('fx-button', fxButton)
		Vue.component('fx-details-form-row', fxDetailsFormRow)
		Vue.component('fx-details-queue-tools', fxDetailsQueueTools)
		Vue.component('fx-details-state-tag', fxDetailsStateTag)
		Vue.component('fx-details-table', fxDetailsTable)
		Vue.component('fx-details-table-plus', fxDetailsTablePlus)
		Vue.component('fx-list-btn-tools', fxListBtnTools)
		Vue.component('fx-list-cell-date', fxListCellDate)
		Vue.component('fx-list-cell-input-number', fxListCellInputNumber)
		Vue.component('fx-list-cell-input', fxListCellInput)
		Vue.component('fx-list-cell-upload', fxListCellUpload)
		Vue.component('fx-list-cell-select-mulity', fxListCellSelectMulity)
		Vue.component('fx-list-cell-select', fxListCellSelect)
		Vue.component('fx-list-cell-select-tab', fxListCellSelectTab)
		Vue.component('fx-list-cell-switch', fxListCellSwitch)
		Vue.component('fx-list-extend-cell', fxListExtendCell)
		Vue.component('fx-list-extend-row', fxListExtendRow)
		Vue.component('fx-list-cell-button', fxListCellButton)
		Vue.component('fx-list-filter', fxListFilter)
		Vue.component('fx-list-state-tag', fxListStateTag)
		Vue.component('fx-list-virtual-table', fxListVirtualTable)
		Vue.component('fx-list-virtual-table-plus', fxListVirtualTablePlus)
		Vue.component('fx-list-virtual-table-column', fxListVirtualTableColumn)
		Vue.component('fx-list-virtual-table-column-plus', fxListVirtualTableColumnPlus)
		Vue.component('fx-list-table-summary', fxListTableSummary)
		Vue.component('fx-page-header', fxPageHeader)
		Vue.component('fx-render-dom', fxRenderDom)
		Vue.component('fx-transfer', fxTransfer)
		Vue.component('fx-tree', fxTree)
		Vue.component('fx-tree-virtual', fxTreeVirtual)
		Vue.component('fx-upload', fxUpload)
		Vue.component('fx-bill-chain', fxBillChain)
		Vue.component('fx-card', fxCard)
		Vue.component('fx-mistake-check-step', fxMistakeCheckStep)
		Vue.component('fx-radio', fxRadio)
		Vue.component('fx-teleport-child', fxTeleportChild)
		Vue.component('fx-teleport-father', fxTeleportFather)
	}
}
