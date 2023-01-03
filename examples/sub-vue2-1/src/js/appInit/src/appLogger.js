import FxLogger from '@/js/fxLogger'
const fxLogger = new FxLogger({
	app: 'fx-print-tools',
	remote: 'http://action.fxscm.net/logger/loggers'
})
export default (vue) => {
	vue.prototype.$fxLogger = fxLogger
}
