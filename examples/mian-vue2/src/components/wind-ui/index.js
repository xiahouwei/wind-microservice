import WAppContainer from './package/app-container'
import WBarCode from './package/bar-code'
import WCascader from './package/cascader'
import WCollapse from './package/collapse'
import WDatePicker, { getDatePickerOptionsShortcuts } from './package/date-picker'
import WDailog from './package/dialog'
import { WindDragContainer, WindDragItem, initDrag } from './package/drag'
import WIcon from './package/icon'
import WImage from './package/image'
import WImagePreview from './package/image-preview'
import WIndexList from './package/index-list'
import WInput from './package/input'
import WInputNumber from './package/input-number'
import WLink from './package/link'
import WLoading from './package/loading'
import WPagination from './package/pagination'
import WPasswordInput from './package/password-input'
import WPopover from './package/popover'
import WQrCode from './package/qr-code'
import WScrollBar from './package/scroll-bar'
import WSelect from './package/select'
import WSelectCycle from './package/select-cycle'
import WSelectMulity from './package/select-mulity'
import WSelectTab from './package/select-tab'
import WSelectTabMulity from './package/select-tab-mulity'
import { WindTable, WindTableColumn } from './package/simple-table'
import WSwitch from './package/switch'
import WTabs from './package/tabs'
import WTag from './package/tag'
import WTree from './package/tree'
import WTreeVirtual from './package/tree-virtual'
import WUpload from './package/upload'
import WValidate from './package/validate'
import WYearStepper from './package/year-stepper'
import { WindVirtualTable, WindVirtualTableColumn } from './package/virtualTable'
import { WindVirtualTablePlus, WindVirtualTableColumnPlus } from './package/virtualTable-plus'
import draggable from 'vuedraggable'

import WConfirm from './package/confirm'
import WContextMenu from './package/context-menu'
import WMessage from './package/message'
import WUploadHide from './package/upload-hide'

import scrollHide from './js/utils/scroll-hide.js'

export default {
	install (Vue) {
		Vue.component('w-cascader', WCascader)
		Vue.component('w-barcode', WBarCode)
		Vue.component('w-app-container', WAppContainer)
		Vue.component('w-collapse', WCollapse)
		Vue.component('w-date-picker', WDatePicker)
		Vue.component('w-dialog', WDailog)
		Vue.component('w-drag-container', WindDragContainer)
		Vue.component('w-drag-item', WindDragItem)
		Vue.component('w-icon', WIcon)
		Vue.component('w-image', WImage)
		Vue.component('w-image-preview', WImagePreview)
		Vue.component('w-index-list', WIndexList)
		Vue.component('w-input', WInput)
		Vue.component('w-input-number', WInputNumber)
		Vue.component('w-link', WLink)
		Vue.component('w-pagination', WPagination)
		Vue.component('w-password-input', WPasswordInput)
		Vue.component('w-popover', WPopover)
		Vue.component('w-qr-code', WQrCode)
		Vue.component('w-scroll-bar', WScrollBar)
		Vue.component('w-select', WSelect)
		Vue.component('w-select-cycle', WSelectCycle)
		Vue.component('w-select-mulity', WSelectMulity)
		Vue.component('w-select-tab', WSelectTab)
		Vue.component('w-select-tab-mulity', WSelectTabMulity)
		Vue.component('w-simple-table', WindTable)
		Vue.component('w-simple-table-column', WindTableColumn)
		Vue.component('w-switch', WSwitch)
		Vue.component('w-tabs', WTabs)
		Vue.component('w-tag', WTag)
		Vue.component('w-tree', WTree)
		Vue.component('w-tree-virtual', WTreeVirtual)
		Vue.component('w-upload', WUpload)
		Vue.component('w-validate', WValidate)
		Vue.component('w-year-stepper', WYearStepper)
		Vue.component('w-virtual-table', WindVirtualTable)
		Vue.component('w-virtual-table-column', WindVirtualTableColumn)
		Vue.component('w-virtual-table-column-plus', WindVirtualTableColumnPlus)
		Vue.component('w-virtual-table-plus', WindVirtualTablePlus)
		Vue.component('w-draggable', draggable)
		// plugin
		Vue.use(WConfirm)
		Vue.use(WContextMenu)
		Vue.use(WMessage)
		Vue.use(WUploadHide)
		Vue.use(WLoading)
		scrollHide.init()
		initDrag(Vue)
		Vue.prototype.$fxGetDatePickerOptionsShortcuts = getDatePickerOptionsShortcuts
	}
}
