import appPlugin, {
	$fxEventBus,
	$fxCreateEventBus,
	$fxRouter,
	$fxGo,
	$fxGoBlank,
	$fxGoToBillBlank,
	$fxGoPrint,
	$fxGoPrintNested,
	$fxSlCloudReport,
	$fxDragonDecisionReport,
	$fxTabkey,
	$fxBiubiuorder,
	$fxProductionManage,
	$fxEnv,
	$fxIframePostmessage
} from '@/js/lib/plugin'

export default (vue) => {
	appPlugin()
	vue.prototype.$fxEventBus = $fxEventBus
	vue.prototype.$fxCreateEventBus = $fxCreateEventBus
	vue.prototype.$fxRouter = $fxRouter
	vue.prototype.$fxGo = $fxGo
	vue.prototype.$fxGoBlank = $fxGoBlank
	vue.prototype.$fxGoToBillBlank = $fxGoToBillBlank
	vue.prototype.$fxGoPrint = $fxGoPrint
	vue.prototype.$fxGoPrintNested = $fxGoPrintNested
	vue.prototype.$fxSlCloudReport = $fxSlCloudReport
	vue.prototype.$fxDragonDecisionReport = $fxDragonDecisionReport
	vue.prototype.$fxTabkey = $fxTabkey
	vue.prototype.$fxBiubiuorder = $fxBiubiuorder
	vue.prototype.$fxProductionManage = $fxProductionManage
	vue.prototype.$fxEnv = $fxEnv
	vue.prototype.$fxIframePostmessage = $fxIframePostmessage
}
