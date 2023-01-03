import FxLogger from '@/js/fxLogger'
import eventBus from '@/js/lib/plugin/src/eventBus'
const BTN_CLASS = ['el-button', 'wind-link']
const fxLogger = new FxLogger({
	app: 'scm8-dev',
	remote: 'http://39.97.242.158/logger/loggers'
})
const bindBtnLogger = function () {
	document.body.addEventListener('click', function (e) {
		if (BTN_CLASS.some(item => {
			return e.target.classList.contains(item)
		})) {
			const text = e.target.textContent.trim()
			if (text) {
				fxLogger.btnInfo(text)
			}
		} else if (BTN_CLASS.some(item => {
			return e.target.parentNode && e.target.parentNode.classList.contains(item)
		})) {
			const text = e.target.parentNode.textContent.trim()
			if (text) {
				fxLogger.btnInfo(text)
			}
		}
	}, true)
}
const bindDialogLogger = function () {
	eventBus.$on('on-dialog-open', function (title) {
		fxLogger.dialogOpenInfo(title)
	})
	eventBus.$on('on-dialog-close', function (title) {
		fxLogger.dialogCloseInfo(title)
	})
}
bindBtnLogger()
bindDialogLogger()
export default (vue) => {
	vue.prototype.$fxLogger = fxLogger
}
