import FxLogger from '@/js/fxLogger'
import eventBus from '@/js/lib/plugin/src/eventBus'
import { FX_NODE_ENV } from '@/config/env.config'
const LOGGER_CONFIG = {
	release: {
		app: 'scm8-production',
		remote: 'https://mobile.engine.fxscm.net/logger/v1/scm8-production/loggers'
	},
	production: {
		app: 'scm8-dev',
		remote: 'http://action.fxscm.net/logger/v1/scm8-dev/loggers'
	},
	development: {
		app: 'scm8-dev',
		remote: 'http://action.fxscm.net/logger/v1/scm8-dev/loggers'
	}
}
const BTN_CLASS = ['el-button', 'wind-link']
const fxLogger = new FxLogger(LOGGER_CONFIG[FX_NODE_ENV])
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
