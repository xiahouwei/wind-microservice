import promisePro from './src/promisePro'
import platform from './src/platform'
import eventBus from './src/eventBus'
import slCloudReport from './src/slCloudReport'
import dragonDecisionReport from './src/dragonDecisionReport'
import visibilityChange from './src/visibilityChange'
import tabkey from './src/tabKey'
import biubiuorder from './src/biubiuorder'
import productionManage from './src/productionManage'
import env from './src/env'
import clearMemory from './src/clearMemory'
import iframePostmessage from './src/iframePostmessage'
import limitEnter from './src/limitEnter'

import {
	clearRouterQuery,
	routeLoginPage,
	replaceRouterPathNofresh,
	getLastDomain,
	clearAppointRouterQuery
} from './src/router'

export const $fxRouter = {
	clearRouterQuery,
	routeLoginPage,
	replaceRouterPathNofresh,
	getLastDomain,
	clearAppointRouterQuery
}
export {
	eventBus as $fxEventBus,
	slCloudReport as $fxSlCloudReport,
	dragonDecisionReport as $fxDragonDecisionReport,
	tabkey as $fxTabkey,
	biubiuorder as $fxBiubiuorder,
	productionManage as $fxProductionManage,
	env as $fxEnv
}
export { createEventBus as $fxCreateEventBus } from './src/eventBus'
export {
	go as $fxGo,
	goBlank as $fxGoBlank,
	goToBillBlank as $fxGoToBillBlank,
	goPrint as $fxGoPrint,
	goPrintNested as $fxGoPrintNested
} from './src/router'

export const $fxIframePostmessage = iframePostmessage
export default () => {
	promisePro()
	visibilityChange()
	slCloudReport.init()
	platform.init()
	clearMemory.init()
	limitEnter.init()
	iframePostmessage.init()
}

