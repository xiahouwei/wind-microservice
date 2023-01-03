import appPlugin, {
	$fxEventBus,
	$fxCreateEventBus,
	$fxRouter,
	$fxGo,
	$fxGoBlank,
	$fxStockManage,
	$fxPrintEditer
} from '@/js/lib/plugin'

export default (vue) => {
	appPlugin()
	vue.prototype.$fxEventBus = $fxEventBus
	vue.prototype.$fxCreateEventBus = $fxCreateEventBus
	vue.prototype.$fxRouter = $fxRouter
	vue.prototype.$fxGo = $fxGo
	vue.prototype.$fxGoBlank = $fxGoBlank
	vue.prototype.$fxStockManage = $fxStockManage
	vue.prototype.$fxPrintEditer = $fxPrintEditer
}
