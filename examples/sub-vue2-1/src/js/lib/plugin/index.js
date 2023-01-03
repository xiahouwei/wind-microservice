import promisePro from './src/promisePro'
import platform from './src/platform'
import eventBus from './src/eventBus'
import visibilityChange from './src/visibilityChange'
import stockManage from './src/stockManage'
import FxPrintEditer from 'wind-print-editer'

import {
	clearRouterQuery,
	routeLoginPage,
	replaceRouterPathNofresh
} from './src/router'

export const $fxRouter = {
	clearRouterQuery,
	routeLoginPage,
	replaceRouterPathNofresh
}
export { eventBus as $fxEventBus, stockManage as $fxStockManage }
export { createEventBus as $fxCreateEventBus } from './src/eventBus'
export {
	go as $fxGo,
	goBlank as $fxGoBlank
} from './src/router'
export const $fxPrintEditer = new FxPrintEditer()

export default () => {
	promisePro()
	visibilityChange()
	platform.init()
	$fxPrintEditer.listenerPrinterParent()
}

