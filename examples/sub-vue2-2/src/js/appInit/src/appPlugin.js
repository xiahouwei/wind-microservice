import appPlugin, {
	$fxEventBus,
	$fxCreateEventBus,
	$fxGo,
	$fxGoBlank,
	$fxGoToBillBlank,
	$fxGoPrint,
	$fxStylusDynamic
} from '@/js/lib/plugin'

export default (vue) => {
	appPlugin()
	vue.prototype.$fxEventBus = $fxEventBus
	vue.prototype.$fxCreateEventBus = $fxCreateEventBus
	vue.prototype.$fxGo = $fxGo
	vue.prototype.$fxGoBlank = $fxGoBlank
	vue.prototype.$fxGoToBillBlank = $fxGoToBillBlank
	vue.prototype.$fxGoPrint = $fxGoPrint
	vue.prototype.$fxStylusDynamic = $fxStylusDynamic
}
